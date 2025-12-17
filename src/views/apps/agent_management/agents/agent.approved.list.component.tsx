'use client'
import React, { useCallback, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { map, switchMap } from 'rxjs/operators'
import { Toast } from 'primereact/toast'
import { Edit, Visibility, Block, Replay } from '@mui/icons-material'

import { FettleDataGrid } from '../../shared-component/components/fettle.data.grid'
import { AgentsService } from '@/services/remote-api/api/agents-services'
import { AgentTypeService } from '@/services/remote-api/api/master-services'

const agentsService = new AgentsService()
const agenttypeservice = new AgentTypeService()

export default function AgentApprovedListComponent(props: { reloadTrigger?: number; onSuspendAgent?: (agent: any) => void; onWithdrawSuspension?: (agent: any) => void; filterType?: string; resetFilters?: number; activeTypeCounts?: { expired: number; active: number; suspended: number } }) {
  const history = useRouter()
  const toast: any = React.useRef(null)

  const [selectedStatus, setSelectedStatus] = React.useState<'active' | 'inactive' | 'suspended' | null>(null)
  const [reloadTable, setReloadTable] = React.useState(false)
  const [agentTypeMapping, setAgentTypeMapping] = React.useState<Record<string, string>>({})
  const [expandedAgentDetails, setExpandedAgentDetails] = React.useState<Record<string, any>>({})
  const [commissionMapping, setCommissionMapping] = React.useState<Record<string, number>>({})
  const [statusCounts, setStatusCounts] = React.useState({ active: 0, expired: 0, suspended: 0 })
  const [licenseNumbers, setLicenseNumbers] = React.useState<Record<string, string>>({})

  useEffect(() => {
    if (props?.reloadTrigger !== undefined && props?.reloadTrigger > 0) {
      setReloadTable(prev => !prev)
    }
  }, [props?.reloadTrigger])

  // Update status counts when activeTypeCounts prop changes
  useEffect(() => {
    if (props?.activeTypeCounts) {
      setStatusCounts({
        active: props.activeTypeCounts.active || 0,
        expired: props.activeTypeCounts.expired || 0,
        suspended: props.activeTypeCounts.suspended || 0
      })
    }
  }, [props?.activeTypeCounts])

  // Fetch agent types mapping and commission data on mount
  useEffect(() => {
    agenttypeservice.getAgentTypes().subscribe({
      next: (response: any) => {
        const mapping: Record<string, string> = {}
        response.content.forEach((agentType: any) => {
          mapping[agentType.name] = agentType.code
        })
        setAgentTypeMapping(mapping)

      },
      error: (error: any) => {
        console.error('Error fetching agent types:', error)
      }
    })

    // Fetch commission data from the correct endpoint
    const commissionPayload = { page: 0, size: 100, summary: true, active: true, sort: ['rowLastUpdatedDate dsc'] }
    agentsService.getAgentCommissionList(commissionPayload).subscribe({
      next: (response: any) => {
        const commMapping: Record<string, number> = {}
        if (response && response.content) {
          response.content.forEach((commission: any) => {
            if (commission.agentCommissionBenefitForYears && commission.agentCommissionBenefitForYears.length > 0) {
              const commissionPercentage = commission.agentCommissionBenefitForYears[0].commissionPercentage || 0
              commMapping[commission.agentType] = commissionPercentage
            }
          })
        }
        setCommissionMapping(commMapping)
        // Trigger table reload after commission mapping is set
        setReloadTable(prev => !prev)
      },
      error: (error: any) => {
        console.error('Error fetching commission data:', error)
      }
    })
  }, [])

  // Reload table when filterType changes

  useEffect(() => {

    setReloadTable(prev => !prev)
  }, [props?.filterType])

  // Reset all filters when resetFilters prop changes
  useEffect(() => {
    if (props?.resetFilters !== undefined && props?.resetFilters > 0) {

      // Reset status first
      setSelectedStatus(null)
    }
  }, [props?.resetFilters])

  // Trigger reload when selectedStatus changes back to null from reset
  useEffect(() => {
    if (props?.resetFilters !== undefined && props?.resetFilters > 0 && selectedStatus === null) {

      setReloadTable(prev => !prev)
    }
  }, [selectedStatus, props?.resetFilters])

  const openEditSection = (agent: any) => history.push(`/agents/management/${agent.id}?mode=edit`)
  const openViewSection = (agent: any) => history.push(`/agents/management?mode=viewOnly&selectedAgent=${agent.id}`)

  const handleStatusChange = (newStatus: boolean | string) => {
    if (typeof newStatus === 'string') {
      const statusValue = newStatus as 'active' | 'inactive' | 'suspended'
      // Allow deselecting any filter by clicking it again
      if (selectedStatus === statusValue) {
        setSelectedStatus(null)
      } else {
        setSelectedStatus(statusValue)
      }
    } else {
      setSelectedStatus(newStatus ? 'active' : 'inactive')
    }
    setReloadTable(prev => !prev)
  }

  const dataSource$ = useCallback((pageRequest: any = {}) => {
    pageRequest.page = pageRequest.page || 0
    pageRequest.size = pageRequest.size || 10
    pageRequest.summary = pageRequest.summary ?? true
    pageRequest.active = true
    pageRequest.isApproved = true
    pageRequest.sort = pageRequest.sort || ['rowLastUpdatedDate dsc']

    // Only add filter parameters if a status is selected
    if (selectedStatus === 'active') {
      pageRequest.isLicenseExpired = false
    } else if (selectedStatus === 'inactive') {
      pageRequest.isLicenseExpired = true
    } else if (selectedStatus === 'suspended') {
      pageRequest.isTerminated = true
    }
    // If selectedStatus is null, no filter is applied (default behavior)

    // Apply filterType if provided (before searchKey mapping)
    const hasFilterType = props.filterType && props.filterType !== ''

    // Map unified searchKey into backend multi-field params
    if (pageRequest.searchKey) {
      const q = pageRequest.searchKey
      pageRequest.code = q
      pageRequest.name = q
      pageRequest.contactNo = q
      // Only add type to search if no filterType is set
      if (!hasFilterType) {
        pageRequest.type = q
      }
      delete pageRequest.searchKey
    }

    // Apply filterType
    // Use typeCode only when a status filter is also selected (Active/Expired/Suspended)
    // Otherwise use type parameter
    if (hasFilterType && props.filterType) {
      if (selectedStatus !== null) {
        // Status filter is selected, use typeCode
        const typeCode = agentTypeMapping[props.filterType]
        if (typeCode) {
          pageRequest.typeCode = typeCode
          // Don't send 'type' parameter when using typeCode to avoid conflicts
          delete pageRequest.type
        } else {
          // Fallback to type if mapping not available yet
          pageRequest.type = props.filterType
        }
      } else {
        // No status filter selected, use type parameter
        pageRequest.type = props.filterType
      }
    }



    return agentsService
      .getAgents(pageRequest)
      .pipe(
        map(data => {
          let content = data.content

          // Client-side filtering if typeCode was sent but backend didn't filter properly
          if (hasFilterType && props.filterType && agentTypeMapping[props.filterType]) {
            const expectedTypeCode = agentTypeMapping[props.filterType]
            content = content.filter((item: any) => item.agentBasicDetails?.type === expectedTypeCode)
            data.totalElements = content.length
          }

          const records = content.map((item: any) => {
            item['agentBasicDetails']['primaryContact'] = item.agentBasicDetails.contactNos[0]?.contactNo || 'N/A'
            if (item.agentBasicDetails.emails && item.agentBasicDetails.emails.length > 0) {
              item['agentBasicDetails']['primaryEmail'] = item.agentBasicDetails.emails[0].emailId
            } else {
              item['agentBasicDetails']['primaryEmail'] = 'N/A'
            }
            // Set commission from mapping based on agent type
            const agentType = item.agentBasicDetails?.type
            if (agentType && commissionMapping[agentType] !== undefined) {
              item.commission = commissionMapping[agentType]
            }
            return item
          })

          data.content = records
          return data
        })
      )
      .pipe(
        switchMap(data => {
          return agenttypeservice.getAgentTypes().pipe(
            map(at => {
              data.content.forEach((ag: any) => {
                at.content.forEach((agenttype: any) => {
                  if (ag.agentBasicDetails.type === agenttype.code) {
                    ag['agentType'] = agenttype.name
                  }
                })
              })
              return data
            })
          )
        })
      )
  }, [selectedStatus, props.filterType, agentTypeMapping, commissionMapping])

  const columnsDefinations = [
    { field: 'agentBasicDetails.name', headerName: 'Agent Name', align: 'left' },
    { field: 'agentBasicDetails.code', headerName: 'Code', align: 'center' },
    { field: 'agentBasicDetails.primaryContact', headerName: 'Contact No', align: 'center' },
    { field: 'agentBasicDetails.primaryEmail', headerName: 'Email ID', align: 'center' },
    {
      field: 'agentBasicDetails.joiningDate',
      headerName: 'Joining Date',
      align: 'center',
      body: (row: any) => {
        if (row.agentBasicDetails?.joiningDate) {
          const date = new Date(row.agentBasicDetails.joiningDate)
          return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
        }
        return 'N/A'
      }
    },
    {
      field: 'commission',
      headerName: 'Commission%',
      align: 'center',
      headerAlign: 'center',
      width: 95,
      flex: 0,
      body: (row: any) => {
        return row.commission !== null && row.commission !== undefined ? row.commission : 0
      }
    }
  ]

  const xlsColumns = [
    'agentBasicDetails.name',
    'agentBasicDetails.code',
    'agentBasicDetails.primaryEmail',
    'agentBasicDetails.primaryContact',
    'agentType'
  ]

  const actionBtnList = useMemo(() => {
    const baseButtons = [
      { key: 'view_agent', icon: <Visibility fontSize="small" />, color: '#18a2b8', className: `ui-button-info`, onClick: openViewSection },
      { key: 'update_agent', icon: <Edit fontSize="small" />, color: '#fbac05', className: `ui-button-warning`, onClick: openEditSection }
    ]

    return [
      ...baseButtons,
      {
        key: 'suspend_withdraw_toggle',
        icon: (row: any) => {
          const isTerminated = row?.agentBasicDetails?.terminated === true
          return isTerminated ? <Replay fontSize="small" /> : <Block fontSize="small" />
        },
        color: (row: any) => {
          const isTerminated = row?.agentBasicDetails?.terminated === true
          return isTerminated ? '#ff9800' : '#dc3545'
        },
        className: 'ui-button-secondary',
        onClick: (row: any) => {
          const isTerminated = row?.agentBasicDetails?.terminated === true
          if (isTerminated) {
            props.onWithdrawSuspension?.(row)
          } else {
            props.onSuspendAgent?.(row)
          }
        },
        tooltip: (row: any) => {
          const isTerminated = row?.agentBasicDetails?.terminated === true
          return isTerminated ? 'Withdraw Suspension' : 'Suspend'
        }
      }
    ]
  }, [openEditSection, openViewSection, props, selectedStatus])

  const handleAccordionExpand = useCallback((row: any) => {
    const agentId = row.id
    console.log('Accordion expanded for agent ID:', agentId)
    if (!expandedAgentDetails[agentId]) {
      console.log('Fetching agent details for ID:', agentId)
      agentsService.getAgentDetails(agentId).subscribe({
        next: (response: any) => {
          console.log('Agent details received:', response)
          setExpandedAgentDetails(prev => ({
            ...prev,
            [agentId]: response
          }))
        },
        error: (error: any) => {
          console.error('Error fetching agent details:', error)
        }
      })
    } else {
      console.log('Agent details already cached for ID:', agentId)
    }

    // Fetch license document number if not already cached
    if (!licenseNumbers[agentId]) {
      console.log('Fetching license documents for agent ID:', agentId)
      agentsService.getAgentDocuments(agentId).subscribe({
        next: (documents: any[]) => {
          console.log('Documents received:', documents)
          const licenseDoc = documents.find((doc: any) => doc.documentType === 'LICENSE')
          if (licenseDoc && licenseDoc.documentNo) {
            setLicenseNumbers(prev => ({
              ...prev,
              [agentId]: licenseDoc.documentNo
            }))
          }
        },
        error: (error: any) => {
          console.error('Error fetching license documents:', error)
        }
      })
    }
  }, [expandedAgentDetails, licenseNumbers])

  const configuration: any = useMemo(() => ({
    useAccordionMode: true,
    enableSelection: true,
    scrollHeight: '600px',
    pageSize: 10,
    actionButtons: actionBtnList,
    onAccordionExpand: handleAccordionExpand,
    columnOptions: {
      enableSorting: true,
      enableColumnMenu: true,
      enableFiltering: true,
      enableColumnVisibility: false
    },
    expandableConfig: {
      gridTemplate: '60px 1.5fr 0.8fr 1fr 1.2fr 1fr 95px 180px',
      getStatusColor: (row: any) => {
        // When a filter is selected, use the filter color
        if (selectedStatus === 'inactive') return '#17a2b8'
        if (selectedStatus === 'suspended') return '#dc3545'
        if (selectedStatus === 'active') return '#28a745'

        // Default state: show color based on agent's actual status
        const isTerminated = row?.agentBasicDetails?.terminated === true
        const isExpired = row?.agentBasicDetails?.agentLicenseExpired === true

        if (isTerminated) return '#dc3545' // Red for suspended
        if (isExpired) return '#17a2b8' // Blue for expired
        return '#28a745' // Green for active
      },
      renderExpandedContent: (row: any) => {
        const agentId = row.id
        const detailedData = expandedAgentDetails[agentId] || row

        const contactPerson = detailedData.agentAddresses?.agentContactPersonDetails
        const otherDetails = detailedData.agentOtherDetails
        const addresses = detailedData.agentAddresses?.addresses || []
        const accountDetails = otherDetails?.accountDetails?.[0]

        // Extract city and county from addresses
        let city = 'N/A'
        let county = 'N/A'
        addresses.forEach((addr: any) => {
          if (addr.addressDetails) {
            if (addr.addressDetails.city) city = addr.addressDetails.city
            if (addr.addressDetails.country) county = addr.addressDetails.country
            if (addr.addressDetails.City) city = addr.addressDetails.City
            if (addr.addressDetails.County) county = addr.addressDetails.County
          }
        })

        return (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '20px', padding: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ color: '#6c757d', fontSize: '12px', fontWeight: 500, textTransform: 'uppercase' }}>City and County</span>
              <span style={{ color: '#212529', fontSize: '14px', fontWeight: 500 }}>
                {city !== 'N/A' || county !== 'N/A' ? `${city}, ${county}` : 'N/A'}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ color: '#6c757d', fontSize: '12px', fontWeight: 500, textTransform: 'uppercase' }}>Contact Person Name</span>
              <span style={{ color: '#212529', fontSize: '14px', fontWeight: 500 }}>
                {contactPerson?.name || 'N/A'}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ color: '#6c757d', fontSize: '12px', fontWeight: 500, textTransform: 'uppercase' }}>Contact Person Email</span>
              <span style={{ color: '#212529', fontSize: '14px', fontWeight: 500 }}>
                {contactPerson?.emailId || 'N/A'}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ color: '#6c757d', fontSize: '12px', fontWeight: 500, textTransform: 'uppercase' }}>Contact Person Mobile</span>
              <span style={{ color: '#212529', fontSize: '14px', fontWeight: 500 }}>
                {contactPerson?.mobileNo || 'N/A'}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ color: '#6c757d', fontSize: '12px', fontWeight: 500, textTransform: 'uppercase' }}>License No</span>
              <span style={{ color: '#212529', fontSize: '14px', fontWeight: 500 }}>
                {licenseNumbers[agentId] || otherDetails?.licenseCode || 'N/A'}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ color: '#6c757d', fontSize: '12px', fontWeight: 500, textTransform: 'uppercase' }}>Bank Account No</span>
              <span style={{ color: '#212529', fontSize: '14px', fontWeight: 500 }}>
                {accountDetails?.accountNo || 'N/A'}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ color: '#6c757d', fontSize: '12px', fontWeight: 500, textTransform: 'uppercase' }}>Bank Name</span>
              <span style={{ color: '#212529', fontSize: '14px', fontWeight: 500 }}>
                {accountDetails?.bankName || 'N/A'}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ color: '#6c757d', fontSize: '12px', fontWeight: 500, textTransform: 'uppercase' }}>PIN/TIN</span>
              <span style={{ color: '#212529', fontSize: '14px', fontWeight: 500 }}>
                {otherDetails?.taxPinNumber || 'N/A'}
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
      enableStatusToggle: true,
      clientSideSearch: false,
      onStatusChange: handleStatusChange,
      addCreateButton: false,
      colorLegend: [
        {
          color: '#28a745',
          label: `Active (${statusCounts.active})`,
          onClick: () => handleStatusChange('active'),
          isActive: selectedStatus === 'active'
        },
        {
          color: '#17a2b8',
          label: `Expired (${statusCounts.expired})`,
          onClick: () => handleStatusChange('inactive'),
          isActive: selectedStatus === 'inactive'
        },
        {
          color: '#dc3545',
          label: `Suspended (${statusCounts.suspended})`,
          onClick: () => handleStatusChange('suspended'),
          isActive: selectedStatus === 'suspended'
        }
      ],
      enableGlobalSearch: true,
      searchText: 'Search by code, name, type, contact'
    }
  }), [actionBtnList, selectedStatus, handleStatusChange, xlsColumns, handleAccordionExpand, expandedAgentDetails, statusCounts])

  return (
    <div>
      <Toast ref={toast} />
      <FettleDataGrid
        $datasource={dataSource$}
        columnsdefination={columnsDefinations}
        onEdit={openEditSection}
        config={configuration}
        reloadtable={reloadTable}
      />
    </div>
  )
}


