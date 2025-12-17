'use client'
import * as React from 'react'

import { useEffect } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import { Grid } from '@mui/material'
import CreateIcon from '@mui/icons-material/Create'
import DeleteIcon from '@mui/icons-material/Delete'

// import { useHistory, useLocation } from "react-router-dom";
import { ProvidersService } from '@/services/remote-api/api/provider-services'
import ProviderDetails from './provider.details.component'
import ProviderTabComponent from './provider.list.main.component'
import Dashboard from './Dashboard'


const providerService = new ProvidersService()
const csTableData$ = providerService.getProviders({
  page: 0,
  size: 10000,
  summary: true,
  active: true
})

// function useQuery() {
//   return new URLSearchParams(useLocation().search);
// }

export default function Provider() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const mode = searchParams.get('mode')
  const [rows, setRows] = React.useState([])

  const columns = [
    { field: 'code', headerName: 'Provider Code', width: 350 },
    { field: 'name', headerName: 'Provider Name', width: 350 },
    { field: 'type', headerName: 'Provider type', width: 350 },
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

          router.push(`/provider/${id}?mode=edit`)
        }

        const onClickDelete = () => { }

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
    if (!mode) {
      router.replace('/provider?mode=viewList')
    }
  }, [mode, router])

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
            Provider Management- Create Provider
          </span>
        </Grid>
      ) : null}

      {(() => {
        switch (mode) {
          case 'viewList':
            return <Dashboard />

          // return <ProviderListComponent/>;
          case 'create':
            return <ProviderDetails />
          default:
            return null
        }
      })()}
    </div>
  )
}

export { default as Dashboard } from './Dashboard';
export { default as ProviderStats } from './ProviderStats';
