'use client'
import * as React from 'react'

import { useEffect } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import Grid from '@mui/material/Grid'

import { ClientService } from '@/services/remote-api/api/client-services'
import SLAConfigurationComponent from './sla.configuration.component'
import SLAConfigurationListComponent from './sla.configuration.list.component'

import { defaultPageRequest } from '@/services/remote-api/models/page.request'

const reqParam: any = { pageRequest: defaultPageRequest }
const clientService = new ClientService()
const csTableData$ = clientService.getClients(reqParam)

// function useQuery() {
//   return new URLSearchParams(useLocation().search);
// }

export default function SLAConfiguration() {
  const router = useRouter()
  const query = useSearchParams()

  const [isEdit, setIsEdit] = React.useState(false)

  const [rows, setRows] = React.useState([])

  const [opendetails, setOpenDetails] = React.useState(false)

  const [clientType, setClientType] = React.useState('RETAIL')

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
      router.replace('/sla/configuration?mode=viewList')
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
            SLA Configuration
          </span>
        </Grid>
      ) : null}

      {(() => {
        switch (query.get('mode')) {
          case 'viewList':
            return <SLAConfigurationListComponent rows={rows} />
          case 'create':
            return <SLAConfigurationComponent />
          default:
            return null
        }
      })()}
    </div>
  )
}
