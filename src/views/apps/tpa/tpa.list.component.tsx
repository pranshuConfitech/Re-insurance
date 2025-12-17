import React from 'react'
import { useRouter } from 'next/navigation'
import { map } from 'rxjs/operators'
import RoleService from '@/services/utility/role'
import { FettleDataGrid } from '../shared-component/components/fettle.data.grid'
import { TpaService } from '@/services/remote-api/api/tpa-service'

const PAGE_NAME = 'POLICY'
const roleService = new RoleService()

const tpaService = new TpaService()

const columnsDefinations = [
  { field: 'name', headerName: 'Name' },
  { field: 'email', headerName: 'Email' },
  { field: 'contactNo', headerName: 'Contact No' },
  { field: 'code', headerName: 'Code' }
]

export default function TpaListComponent(props: any) {
  const router = useRouter()

  const dataSource$: any = (
    pageRequest: any = {
      page: 0,
      size: 10,
      summary: true,
      active: true
    }
  ) => {
    pageRequest.sort = ['rowLastUpdatedDate dsc']

    // delete pageRequest.searchKey;
    if (!pageRequest.searchKey) {
      return tpaService
        .getTpas(
          pageRequest
        )
        .pipe(
          map(data => {
            return data
          })
        )
    }

    pageRequest.sort = ['rowLastUpdatedDate dsc']

    if (pageRequest.searchKey) {
      // pageRequest['clientName'] = pageRequest.searchKey.trim()
      pageRequest['name'] = pageRequest.searchKey.trim()

      return tpaService.getTpas(pageRequest).pipe(
        map(cdata => {
          return cdata
        })
      )
    }
  }

  const handleOpen = () => {
    router.push('/tpa?mode=create')
  }

  const openEditSection = (tpa: any) => {
    router.push(`/tpa/${tpa.id}?mode=edit`)
  }

  const actionBtnList = [
    {
      key: 'update_policy',
      icon: 'pi pi-user-edit',
      className: 'ui-button-warning',
      onClick: openEditSection
    }
  ]

  const xlsColumns = ['clientName', 'policyNumber', 'policyStartDate', 'policyInitDate', 'policyStatus']

  const configuration: any = {
    enableSelection: false,
    scrollHeight: '300px',
    pageSize: 10,
    actionButtons: roleService.checkActionPermission(PAGE_NAME, '', () => { }, actionBtnList),
    header: {
      enable: true,
      enableDownload: true,
      downloadbleColumns: xlsColumns,
      addCreateButton: roleService.checkActionPermission(PAGE_NAME, 'CREATE'),
      onCreateButtonClick: handleOpen,
      text: 'TPA Management',
      enableGlobalSearch: true,
      searchText: 'Search by Name, Code',
    }
  }

  return (
    <div>
      <FettleDataGrid
        $datasource={dataSource$}
        columnsdefination={columnsDefinations}
        onEdit={openEditSection}
        config={configuration}
      />
    </div>
  )
}
