'use client'

import * as React from 'react'

import { useEffect } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import Grid from '@mui/material/Grid'
import CreateIcon from '@mui/icons-material/Create'
import DeleteIcon from '@mui/icons-material/Delete'

import type { Observable } from 'rxjs'

import ProspectListComponent from './prospect-list.component'
import ProspectManagementForm from './prospect-management-form'
import { ProspectService } from '@/services/remote-api/api/client-services'

const prospectService = new ProspectService()

const psTableData$ = prospectService.getProspects()

// function useQuery() {
//   return new URLSearchParams(useLocation().search);
// }

export default function ProspectComponent() {
  const query = useSearchParams()
  const router = useRouter()

  const [rows, setRows] = React.useState([])

  const clientTypeName = 'Retail'

  const extractObject = (params: any) => {
    const api = params.api

    const fields = api
      .getAllColumns()
      .map((c: { field: any }) => c.field)
      .filter((c: string) => c !== '__check__' && !!c)

    const thisRow: any = {}

    fields.forEach((f: string | number) => {
      thisRow[f] = params.getValue(f)
    })

    return thisRow
  }

  const columns = [
    { field: 'code', headerName: 'Prospect Code', width: 350 },
    { field: 'firstName', headerName: 'Prospect Name', width: 350 },
    { field: 'clientType', headerName: 'Client Type', width: 300 },
    {
      field: 'displayName',
      headerName: 'Name',

      // type: 'number',
      width: 350
    },
    {
      field: 'mobileNo',
      headerName: 'Contact Number',

      // type: 'number',
      width: 200
    },
    {
      field: 'Action',
      headerName: 'Action',

      // description: 'This column has a value getter and is not sortable.',
      // sortable: false,
      width: 200,
      renderCell: (params: { row: { id: any } }) => {
        const onClickEdit = () => {
          // let obj = extractObject(params);
          const { id } = params.row

          router.push(`/prospects/${id}?mode=edit`)
        }

        const onClickDelete = () => {
          const obj = extractObject(params)
        }

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

  const useObservable = (observable: Observable<any>, setter: any) => {
    useEffect(() => {
      const subscription = observable.subscribe(result => {
        setter(result.content)
      })

      return () => subscription.unsubscribe()
    }, [observable, setter])
  }

  useObservable(psTableData$, setRows)

  React.useEffect(() => {
    if (!query.get('mode')) {
      router.replace('/client/prospects?mode=viewList')
    }
  }, [query, router])

  return (
    <div>
      {query.get('mode') === 'create' ? (
        <Grid
          item
          xs={12}
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            marginBottom: '20px',
            height: '2em',
            color: 'inherit',
            fontSize: '18px'
          }}
        >
          <span
            style={{
              fontWeight: '600',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            Lead Management - Create Lead
          </span>
        </Grid>
      ) : null}

      {(() => {
        switch (query.get('mode')) {
          case 'viewList':
            return <ProspectListComponent rows={rows} columns={columns} />
          case 'create':
            return <ProspectManagementForm clientTypeName={clientTypeName} />
          default:
            return null
        }
      })()}
    </div>
  )
}
