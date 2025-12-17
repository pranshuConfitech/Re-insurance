'use client'
import React, { useCallback, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import moment from 'moment'
import { map } from 'rxjs/operators'
import { Toast } from 'primereact/toast'
import { Edit } from '@mui/icons-material'

import { AgentsService } from '@/services/remote-api/api/agents-services'
import { AgentTypeService } from '@/services/remote-api/api/master-services'
import RoleService from '../../../../services/utility/role/index'
import { FettleDataGrid } from '../../shared-component/components/fettle.data.grid'

const agenttypeservice = new AgentTypeService()
const roleService = new RoleService()
const PAGE_NAME = 'AGENT'
const agentsService = new AgentsService()

function CommissionListComponent(props: any) {
  const router = useRouter()
  const toast: any = React.useRef(null)
  const [rows, setRows] = React.useState(props.rows)
  const [reloadTable, setReloadTable] = React.useState(false)
  const [expandedCommissionDetails, setExpandedCommissionDetails] = React.useState<Record<string, any>>({})

  const handleOpen = () => {
    router.push('/agents/commission?mode=create')
  }

  const openEditSection = (commission: any) => {
    router.push(`/agents/commission/${commission?.id}?mode=edit`)
  }

  React.useEffect(() => {
    setRows(props.rows)
  }, [props.rows])

  React.useEffect(() => {
    if (localStorage.getItem('agentId')) {
      localStorage.removeItem('agentId')
    }
  }, [])

  const dataSource$ = useCallback((pageRequest: any = {}) => {
    pageRequest.page = pageRequest.page || 0
    pageRequest.size = pageRequest.size || 10
    pageRequest.summary = pageRequest.summary ?? true
    pageRequest.active = true
    pageRequest.sort = pageRequest.sort || ['rowLastUpdatedDate dsc']

    if (pageRequest.searchKey) {
      pageRequest['code'] = pageRequest.searchKey.trim()
      pageRequest['type'] = pageRequest.searchKey.trim()
      pageRequest['name'] = pageRequest.searchKey.trim()
      pageRequest['contactNo'] = pageRequest.searchKey.trim()
      delete pageRequest.searchKey
    }

    return agentsService.getAgentCommissionList(pageRequest).pipe(
      map((data: any) => {
        const content = data.content
        const records = content.map((item: any) => {
          item['validFrom'] = moment(item.validFrom).format('DD/MM/YYYY')
          return item
        })
        data.content = records
        return data
      })
    )
  }, [])

  const columnsDefinations = [
    { field: 'clientType', headerName: 'Client Type', align: 'left' },
    { field: 'agentType', headerName: 'Agent Type', align: 'center' },
    { field: 'validFrom', headerName: 'Valid From', align: 'center' }
  ]

  const xlsColumns = ['clientType', 'agentType', 'validFrom']

  const actionBtnList = useMemo(() => [
    { key: 'update_commission', icon: <Edit fontSize="small" />, color: '#fbac05', className: `ui-button-warning`, onClick: openEditSection }
  ], [])

  const handleAccordionExpand = useCallback((row: any) => {
    const commissionId = row.id
    console.log('Accordion expanded for commission ID:', commissionId)
    if (!expandedCommissionDetails[commissionId]) {
      console.log('Fetching commission details for ID:', commissionId)
      // If you have a detailed commission API, fetch it here
      // For now, we'll just use the row data
      setExpandedCommissionDetails(prev => ({
        ...prev,
        [commissionId]: row
      }))
    }
  }, [expandedCommissionDetails])

  const configuration: any = useMemo(() => ({
    useAccordionMode: true,
    enableSelection: false,
    scrollHeight: '600px',
    pageSize: 10,
    actionButtons: actionBtnList,
    onAccordionExpand: handleAccordionExpand,
    expandableConfig: {
      gridTemplate: '60px 1.5fr 1fr 1fr 120px',
      getStatusColor: (_row: any) => {
        return null
      },
      renderExpandedContent: (row: any) => {
        const commissionId = row.id
        const detailedData = expandedCommissionDetails[commissionId] || row

        // Extract commission benefit details
        const benefitYears = detailedData.agentCommissionBenefitForYears || []
        const firstYearBenefit = benefitYears[0] || {}
        const commissionPercentage = firstYearBenefit.commissionPercentage || 'N/A'
        const year = firstYearBenefit.year || 'N/A'

        return (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', padding: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ color: '#6c757d', fontSize: '12px', fontWeight: 500, textTransform: 'uppercase' }}>Commission Percentage</span>
              <span style={{ color: '#212529', fontSize: '14px', fontWeight: 500 }}>
                {commissionPercentage}%
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ color: '#6c757d', fontSize: '12px', fontWeight: 500, textTransform: 'uppercase' }}>Year</span>
              <span style={{ color: '#212529', fontSize: '14px', fontWeight: 500 }}>
                {year}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ color: '#6c757d', fontSize: '12px', fontWeight: 500, textTransform: 'uppercase' }}>Client Type</span>
              <span style={{ color: '#212529', fontSize: '14px', fontWeight: 500 }}>
                {detailedData.clientType || 'N/A'}
              </span>
            </div>
          </div>
        )
      }
    },
    header: {
      enable: true,
      enableDownload: true,
      downloadbleColumns: xlsColumns,
      enableStatusToggle: false,
      clientSideSearch: false,
      addCreateButton: false,
      enableGlobalSearch: true,
      searchText: 'Search by client type, agent type'
    }
  }), [actionBtnList, xlsColumns, handleAccordionExpand, expandedCommissionDetails])

  React.useEffect(() => {
    // Update configuration with role-based permissions if needed
  }, [])

  return (
    <div>
      <Toast ref={toast} />
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

export default CommissionListComponent
