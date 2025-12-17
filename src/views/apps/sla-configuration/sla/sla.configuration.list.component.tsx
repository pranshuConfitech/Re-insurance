import React from 'react'

import { useRouter } from 'next/navigation'

import { map } from 'rxjs/operators'

import { SLAService } from '@/services/remote-api/api/claims-services/sla.services'
import RoleService from '@/services/utility/role'

import { FettleDataGrid } from '../../shared-component/components/fettle.data.grid'

const PAGE_NAME = 'Questionnaire'
const roleService = new RoleService()
const slaService = new SLAService()

const columnsDefinations = [
  { field: 'claimCategory', headerName: 'Claim Category' },
  { field: 'isDeathCase', headerName: 'Is death case?' },
  { field: 'isGrievanceCase', headerName: 'Is grievance case?' },
  { field: 'isVip', headerName: 'Is vip?' },
  { field: 'isSeniorCitizen', headerName: 'Is senior citizen?' },
  { field: 'patientOrDischarge', headerName: 'Patient or discharge?' },
  { field: 'slaType', headerName: 'SLA type' },
  { field: 'tatFrom', headerName: 'TAT from?' },
  { field: 'tatTo', headerName: 'TAT to' },
  { field: 'tatScale', headerName: 'TAT scale?' },
  { field: 'isCompulsory', headerName: 'Is compulsory?' },
  { field: 'minClaimPercentage', headerName: 'Minimum claim percantage' },
  { field: 'maxClaimPercentage', headerName: 'Maximum claim percantage' },
  { field: 'perCaseFixedValue', headerName: 'Per case fixed value' },
  { field: 'isActualBasis', headerName: 'Is actual basis' }
]

export default function SLAConfigurationListComponent(props: any) {
  const router = useRouter()

  const dataSource$: any = (
    pageRequest: any = {
      page: 0,
      size: 10,
      summary: true,
      active: true
    }
  ) => {
    // pageRequest.sort = ['rowLastUpdatedDate dsc'];
    if (!pageRequest.searchKey) {
      return slaService.getAllSLAs(pageRequest).pipe(
        map(data => {
          return data
        })
      )
    }
  }

  const handleOpen = () => {
    router.push('/sla/configuration?mode=create')
  }

  const openEditSection = (data: any) => {
    router.push(`/sla/configuration/${data.id}?mode=edit`)
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
    actionButtons: roleService.checkActionPermission(PAGE_NAME, '', () => {}, actionBtnList),
    header: {
      enable: true,

      // enableDownload: true,
      // downloadbleColumns: xlsColumns,
      addCreateButton: 'CREATE',

      // addCreateButton: roleService.checkActionPermission(PAGE_NAME, 'CREATE'),
      onCreateButtonClick: handleOpen,
      text: 'SLA Configuration'

      // enableGlobalSearch: true,
      // searchText: 'Search by Name,Policy Number',
      // selectionMenuButtonText: 'Advance Search',
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
