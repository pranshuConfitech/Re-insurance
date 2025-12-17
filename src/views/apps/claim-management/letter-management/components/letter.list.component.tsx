import React from 'react'

import { useRouter } from 'next/navigation'

import { map } from 'rxjs/operators'

import { LetterService } from '@/services/remote-api/api/claims-services/letter.services'
import { ClientTypeService } from '@/services/remote-api/api/master-services/cleint.type.service'
import { PlanService } from '@/services/remote-api/api/plan-services/plan.service'
import RoleService from '@/services/utility/role'
import { FettleDataGrid } from '@/views/apps/shared-component/components/fettle.data.grid'

const PAGE_NAME = 'CLAIM'
const roleService = new RoleService()
const clienttypeervice = new ClientTypeService()
const planservice = new PlanService()
const letterService = new LetterService()

const dataSource$ = (
  pageRequest: any = {
    page: 0,
    size: 10,
    summary: true,
    active: true
  }
) => {
  pageRequest.sort = ['rowLastUpdatedDate dsc']

  if (pageRequest.searchKey) {
    pageRequest['letterType'] = pageRequest.searchKey.trim()
    pageRequest['formatName'] = pageRequest.searchKey.trim()
  }

  delete pageRequest.searchKey

  return letterService.getLetters(pageRequest).pipe(
    map(data => {
      return data
    })
  )
}

const columnsDefinations: any = [
  {
    field: 'serial',
    headerName: 'SL#',
    body: (rowData: any, data: any) => data.rowIndex + 1,
    style: { width: '2rem' }
  },
  { field: 'formatName', headerName: 'Format Name', style: { width: '4rem' } },
  { field: 'letterType', headerName: 'Letter type', style: { width: '4rem' } }
]

export default function LetterListComponent(props: any) {
  const router = useRouter()
  const [reloadTable, setReloadTable] = React.useState(false)

  const handleOpen = () => {
    router.push('/claims/letter?mode=create')
  }

  const openEditSection = (plan: any) => {
    router.push(`/claims/letter/${plan.id}?mode=edit`)
  }

  const actionBtnList = [
    {
      key: 'update_plan',
      icon: 'pi pi-user-edit',
      className: 'ui-button-warning',
      onClick: openEditSection
    }
  ]

  const xlsColumns = ['serial', 'formatName', 'letterType']

  const configuration: any = {
    enableSelection: false,
    scrollHeight: '300px',
    pageSize: 10,
    actionButtons: roleService.checkActionPermission(PAGE_NAME, '', () => {}, actionBtnList),
    header: {
      enable: true,
      enableDownload: true,
      downloadbleColumns: xlsColumns,
      addCreateButton: roleService.checkActionPermission(PAGE_NAME, 'CREATE'),
      onCreateButtonClick: handleOpen,
      text: 'Letter Management',
      enableGlobalSearch: true,
      searchText: 'Search by format name, letter type'

      //   onSelectionChange: handleSelectedRows,
      //   selectionMenus: [{ icon: "", text: "Blacklist", disabled: selectionBlacklistMenuDisabled, onClick: openBlacklist }],
      //   selectionMenuButtonText: "Action"
    }
  }

  return (
    <div>
      <FettleDataGrid
        $datasource={dataSource$}
        config={configuration}
        columnsdefination={columnsDefinations}
        onEdit={openEditSection}
        reloadtable={reloadTable}
      />
    </div>
  )
}
