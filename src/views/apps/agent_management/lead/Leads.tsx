"use client"
import React, { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import { makeStyles } from '@mui/styles'

import { map, switchMap } from 'rxjs/operators'

import { ProspectService } from '@/services/remote-api/api/client-services'
import { ClientTypeService } from '@/services/remote-api/api/master-services'

import { FettleDataGrid } from '../../shared-component/components/fettle.data.grid'

const PAGE_NAME = 'PROSPECT'
const clienttypeervice = new ClientTypeService()

const useStyles = makeStyles(theme => ({
  tableBg: {
    height: 400,
    width: '100%',
    backgroundColor: '#fff',
    boxShadow: '0px 3px 3px -2px rgb(0 0 0 / 20%), 0px 3px 4px 0px rgb(0 0 0 / 14%), 0px 1px 8px 0px rgb(0 0 0 / 12%)',
    borderRadius: '4px'
  }
}))

const prospectService = new ProspectService()

const dataSource$: any = (
  pageRequest: any = {
    page: 0,
    size: 10,
    summary: true,
    active: true
  }
) => {
  pageRequest.sort = ['rowLastUpdatedDate dsc']

  if (pageRequest.searchKey) {
    pageRequest['code'] = pageRequest.searchKey.trim()
    pageRequest['displayName'] = pageRequest.searchKey.trim()
    pageRequest['mobileNo'] = pageRequest.searchKey.trim()
  }

  delete pageRequest.searchKey

  return prospectService.getProspects(pageRequest).pipe(
    switchMap(data => {
      return clienttypeervice.getCleintTypes().pipe(
        map(ct => {
          data.content.forEach((cl: any) => {
            ct.content.forEach((clienttype: any) => {
              if (cl.clientType === clienttype.code) {
                cl['clientTypeName'] = clienttype.name
              }
            })
          })

          return data
        })
      )
    })
  )
}

// const dataSource$ = (pageRequest={ page: 0,
//     size: 10,
//     summary: true,
//     active: true}) => prospectService.getProspects(pageRequest);
const columnsDefinations = [
  { field: 'displayName', headerName: 'Name' },
  { field: 'code', headerName: 'Prospect Code' },
  { field: 'clientTypeName', headerName: 'Client Type' },
  { field: 'mobileNo', headerName: 'Contact Number' }
]

const xlsColumns = ['displayName', 'code', 'clientTypeName', 'mobileNo']

const ProspectListComponent = (props: any) => {
  const router = useRouter()
  const classes = useStyles()

  const [configuration, setConfiguration] = useState({
    enableSelection: false,
    scrollHeight: '300px',
    pageSize: 10,
    actionButtons: [],
    header: {
      enable: true,
      enableDownload: true,
      downloadbleColumns: xlsColumns,
      addCreateButton: false,
      onCreateButtonClick: () => handleOpen(),
      text: 'Leads Management',
      enableGlobalSearch: true,
      searchText: 'Search by code, name, mobile'
    }
  })

  const hasAccess = (accessName: any) => {
    const accessDetails = JSON.parse(localStorage.getItem('access_details') ?? '[]')

    const accessList: any = accessDetails
      .filter((ad: string | string[]) => ad.indexOf(PAGE_NAME) > -1)
      .map((ac: string) => ac.split('_')[0])

    const status = accessList.some((a: string | any[]) => a.indexOf(accessName) > -1)

    if (accessName === 'UPDATE') {
      return status
        ? [
          {
            icon: 'pi pi-user-edit',
            className: 'ui-button-warning',
            onClick: openEditSection
          }
        ]
        : []
    }

    return status
  }

  useEffect(() => {
    setConfiguration(prev => ({
      ...prev,
      actionButtons: hasAccess('UPDATE'),
      header: {
        ...prev.header,
        addCreateButton: hasAccess('CREATE')
      }
    }))
  }, [])

  const handleOpen = () => {
    router.push('/client/prospects?mode=create')
  }

  const openEditSection = (prospect: { id: any }) => {
    router.push(`/client/prospects/${prospect.id}?mode=edit`)
  }

  return (
    <div>
      <FettleDataGrid
        $datasource={dataSource$}
        config={configuration}
        columnsdefination={columnsDefinations}
        onEdit={openEditSection}
      />
    </div>
  )
}

export default ProspectListComponent
