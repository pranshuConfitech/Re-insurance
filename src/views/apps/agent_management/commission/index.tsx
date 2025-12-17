// import Grid from "@material-ui/core/Grid";
// import CreateIcon from "@material-ui/icons/Create";
// import DeleteIcon from "@material-ui/icons/Delete";
'use client'
import * as React from 'react'

// import { useHistory, useLocation } from "react-router-dom";
// import { AgentsService } from "../../remote-api/api/agents-services";
import { useEffect } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import CreateIcon from '@mui/icons-material/Create'
import DeleteIcon from '@mui/icons-material/Delete'

import Grid from '@mui/material/Grid'

import CommissionListComponent from './commission.list.component'
import CommissionDetailsComponent from './commision.details.component'
import { AgentsService } from '@/services/remote-api/api/agents-services'

const agentsService = new AgentsService()

const csTableData$ = agentsService.getAgents({
  page: 0,
  size: 10,
  summary: true,
  active: true
})

// function useQuery() {
//   return new URLSearchParams(useLocation().search);
// }

export default function Agents() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const mode = searchParams.get('mode')

  // const query = useQuery();
  const [rows, setRows] = React.useState([])

  const columns = [
    { field: 'code', headerName: 'Agent Code', width: 350 },
    { field: 'name', headerName: 'Agent Name', width: 350 },
    { field: 'type', headerName: 'Agent type', width: 350 },
    {
      field: 'contact',
      headerName: 'Contact Number',
      width: 300
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 300,
      renderCell: (params: any) => {
        const onClickEdit = () => {
          const { id } = params.row

          router.push(`/agents/commission/${id}?mode=edit`)
        }

        const onClickDelete = () => {}

        return (
          <div>
            <CreateIcon style={{ cursor: 'pointer', color: '#626BDA' }} onClick={onClickEdit} />
            <DeleteIcon style={{ cursor: 'pointer', color: '#626BDA', marginLeft: '5px' }} onClick={onClickDelete} />
          </div>
        )
      }

      // valueGetter: (params) =>
      //   `${params.getValue('firstName') || ''} ${params.getValue('lastName') || ''}`,
    }
  ]

  useEffect(() => {
    if (!mode) {
      router.replace('/agents/commission?mode=viewList')
    }
  }, [mode, router])

  // useObservable(csTableData$, setRows);

  return (
    <div>
      {mode === 'create' ? (
        <Grid
          item
          xs={12}
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            marginBottom: '20px',
            height: '2em',
            color: '#000',
            fontSize: '18px',
            fontWeight: 600
          }}
        >
          <span
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            Commission Management - Create Commission
          </span>
        </Grid>
      ) : null}

      {(() => {
        switch (mode) {
          case 'viewList':
            return <CommissionListComponent rows={rows} columns={columns} />
          case 'create':
            return <CommissionDetailsComponent />
          default:
            return null
        }
      })()}
    </div>
  )
}
