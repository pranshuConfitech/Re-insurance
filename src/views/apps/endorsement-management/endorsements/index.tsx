'use client'
import * as React from 'react'

import { useEffect } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import Grid from '@mui/material/Grid'
import CreateIcon from '@mui/icons-material/Create'
import DeleteIcon from '@mui/icons-material/Delete'

import { ProvidersService } from '@/services/remote-api/api/provider-services'
import EndorsementDetails from './endorsement.details.component'
import EndorsementListComponent from './endorsement.list.component'

const providerService = new ProvidersService()

// function useQuery() {
//   return new URLSearchParams(useLocation().search);
// }

export default function Endorsement() {
  const router = useRouter()
  const query = useSearchParams()
  const [rows, setRows] = React.useState([])

  const columns = [
    { field: 'code', headerName: 'Endorsement Code', width: 350 },
    { field: 'name', headerName: 'Endorsement Name', width: 350 },
    { field: 'type', headerName: 'Endorsement type', width: 350 },
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

          router.push(`/endorsements/${id}?mode=edit`)
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

  const useObservable = (observable: any, setter: any) => {
    useEffect(() => {
      const subscription = observable.subscribe((result: any) => {
        const tableArr: any = []

        if (result.content && result.content.length > 0) {
          result.content.forEach((ele: any) => {
            tableArr.push({
              code: ele.providerBasicDetails.code,
              name: ele.providerBasicDetails.name,
              type: ele.providerBasicDetails.type,
              contact:
                ele.providerBasicDetails.contactNos.length > 0 ? ele.providerBasicDetails.contactNos[0].contactNo : '',
              id: ele.id
            })
          })
        }

        setter(tableArr)
      })

      return () => subscription.unsubscribe()
    }, [observable, setter])
  }

  // useObservable(csTableData$, setRows);
  React.useEffect(() => {
    if (!query.get('mode')) {
      router.replace('/endorsements?mode=viewList')
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
            Endorsement Management- Create Endorsement
          </span>
        </Grid>
      ) : null}

      {(() => {
        switch (query.get('mode')) {
          case 'viewList':
            return <EndorsementListComponent rows={rows} columns={columns} />
          case 'create':
            return <EndorsementDetails />
          default:
            return null
        }
      })()}
    </div>
  )
}
