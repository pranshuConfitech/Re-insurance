'use client'
import * as React from 'react'

import { useEffect } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import Grid from '@mui/material/Grid'
import CreateIcon from '@mui/icons-material/Create'
import DeleteIcon from '@mui/icons-material/Delete'

import { ClientService } from '@/services/remote-api/api/client-services'
import PolicyDetails from './policy.details.component'
import PolicyListComponent from './policy.list.component'

import { defaultPageRequest } from '@/services/remote-api/models/page.request'

const clientService = new ClientService()
const reqParam: any = { pageRequest: defaultPageRequest }
const csTableData$ = clientService.getClients(reqParam)

// function useQuery() {
//   return new URLSearchParams(useLocation().search);
// }

export default function Policy() {
  const router = useRouter()
  const query = useSearchParams()

  const [isEdit, setIsEdit] = React.useState(false)

  const [rows, setRows] = React.useState([])

  const [opendetails, setOpenDetails] = React.useState(false)

  const [clientType, setClientType] = React.useState('RETAIL')

  const columns = [
    { field: 'code', headerName: 'Client Code', width: 350 },
    { field: 'firstName', headerName: 'Client Name', width: 350 },
    { field: 'clientTypeCd', headerName: 'Client type', width: 350 },
    {
      field: 'displayName',
      headerName: 'Name',

      // type: 'number',
      width: 100
    },
    {
      field: 'contact',
      headerName: 'Contact Number',

      // type: 'number',
      width: 300
    },
    {
      field: 'action',
      headerName: 'Action',

      // description: 'This column has a value getter and is not sortable.',
      // sortable: false,
      width: 300,
      renderCell: (params: any) => {
        const onClickEdit = () => {
          const { id } = params.row

          router.push(`/policies/${id}?mode=edit`)

          // populateDetails(obj);
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

  const extractObject = (params: any) => {
    const api = params.api

    const fields = api
      .getAllColumns()
      .map((c: { field: any }) => c.field)
      .filter((c: any) => c !== '__check__' && !!c)

    const thisRow: any = {}

    fields.forEach((f: any) => {
      thisRow[f] = params.getValue(f)
    })

    return thisRow
  }

  const useObservable = (observable: any, setter: any) => {
    useEffect(() => {
      const subscription = observable.subscribe((result: any) => {
        const tableArr: any = []

        if (result.content && result.content.length > 0) {
          result.content.forEach((ele: any) => {
            tableArr.push({
              code: ele.clientBasicDetails.code,
              firstName: ele.clientBasicDetails.firstName,
              clientTypeCd: ele.clientBasicDetails.clientTypeCd,
              displayName: ele.clientBasicDetails.displayName,
              contact:
                ele.clientBasicDetails.contactNos.length > 0 ? ele.clientBasicDetails.contactNos[0].contactNo : '',
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

  const populateDetails = (obj: any) => {}

  React.useEffect(() => {
    if (!query.get('mode')) {
      router.replace('/policies?mode=viewList')
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
            Policy Management- Create policy
          </span>
        </Grid>
      ) : null}

      {(() => {
        switch (query.get('mode')) {
          case 'viewList':
            return <PolicyListComponent rows={rows} columns={columns} />
          case 'create':
            return <PolicyDetails />
          default:
            return null
        }
      })()}
    </div>
  )
}
