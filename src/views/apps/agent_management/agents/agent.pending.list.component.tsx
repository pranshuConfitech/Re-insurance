'use client'
import React, { useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { map, switchMap } from 'rxjs/operators'
import { Toast } from 'primereact/toast'
import { Edit, Visibility, CheckCircle, Undo, Cancel } from '@mui/icons-material'
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress
} from '@mui/material'

import { FettleDataGrid } from '../../shared-component/components/fettle.data.grid'
import { AgentsService } from '@/services/remote-api/api/agents-services'
import { AgentTypeService } from '@/services/remote-api/api/master-services'
import UnitAssignModal from './Modal/unit.assign.modal'

const agentsService = new AgentsService()
const agenttypeservice = new AgentTypeService()

export default function AgentPendingListComponent(props: { reloadTrigger?: number }) {
  const history = useRouter()
  const toast: any = React.useRef(null)

  const [reloadTable, setReloadTable] = React.useState(false)
  const [selectedAgentId, setSelectedAgentId] = React.useState<string | null>(null)
  const [expandedAgentDetails, setExpandedAgentDetails] = React.useState<Record<string, any>>({})
  const [commissionMapping, setCommissionMapping] = React.useState<Record<string, number>>({})
  const [licenseNumbers, setLicenseNumbers] = React.useState<Record<string, string>>({})

  // Approval UI states
  const [openDialog, setOpenDialog] = React.useState(false)
  const [openUnitAssignModal, setOpenUnitAssignModal] = React.useState(false)
  const [selectedAction, setSelectedAction] = React.useState<'APPROVED' | 'REJECTED' | 'REVERT' | null>(null)
  const [comment, setComment] = React.useState('')
  const [submitting, setSubmitting] = React.useState(false)

  useEffect(() => {
    if (props?.reloadTrigger !== undefined && props?.reloadTrigger > 0) {
      setReloadTable(prev => !prev)
    }
  }, [props?.reloadTrigger])

  // Fetch commission data on mount
  useEffect(() => {
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

  const openEditSection = (agent: any) => history.push(`/agents/management/${agent.id}?mode=edit`)
  const openViewSection = (agent: any) => history.push(`/agents/management?mode=viewOnly&selectedAgent=${agent.id}`)

  // Local approve/reject/revert handlers (same as view-only behavior)
  const handleActionClick = (row: any, action: 'APPROVED' | 'REJECTED' | 'REVERT') => {
    setSelectedAgentId(String(row?.id))
    setSelectedAction(action)
    setComment('')
    if (action === 'APPROVED') {
      setOpenUnitAssignModal(true)
    } else {
      setOpenDialog(true)
    }
  }

  const closeAssignUnitModal = () => {
    setOpenUnitAssignModal(false)
    setSelectedAction(null)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setSelectedAction(null)
    setComment('')
  }

  const handleAssignUnitSubmit = (payload: any) => {
    if (!selectedAgentId) return
    setSubmitting(true)
    const approvalPayload = {
      action: 'APPROVED',
      comment: payload.comment || '',
      agentUnitDetails: {
        unitId: payload.unitId,
        startDate: payload.startDate
      }
    }
    agentsService.approveAgentWithAction(selectedAgentId, approvalPayload).subscribe({
      next: () => {
        setSubmitting(false)
        closeAssignUnitModal()
        setReloadTable(prev => !prev)
      },
      error: (error) => {
        console.error('Approval action failed:', error)
        setSubmitting(false)
      }
    })
  }

  const handleSubmitApproval = () => {
    if (!selectedAgentId || !selectedAction) return
    setSubmitting(true)
    const payload = {
      action: selectedAction,
      comment: comment
    }
    agentsService.approveAgentWithAction(selectedAgentId, payload).subscribe({
      next: () => {
        setSubmitting(false)
        handleCloseDialog()
        setReloadTable(prev => !prev)
      },
      error: (error) => {
        console.error('Approval action failed:', error)
        setSubmitting(false)
      }
    })
  }

  const getActionLabel = (action: string | null) => {
    switch (action) {
      case 'APPROVED': return 'Approve'
      case 'REJECTED': return 'Reject'
      case 'REVERT': return 'Pending'
      default: return ''
    }
  }

  const getActionColor = (action: string | null) => {
    switch (action) {
      case 'APPROVED': return '#4caf50'
      case 'REJECTED': return '#f44336'
      case 'REVERT': return '#ff9800'
      default: return '#626BDA'
    }
  }



  const dataSource$ = useCallback((pageRequest: any = {}) => {
    pageRequest.page = pageRequest.page || 0
    pageRequest.size = pageRequest.size || 10
    pageRequest.summary = pageRequest.summary ?? true
    pageRequest.active = true
    pageRequest.isApproved = false
    pageRequest.sort = pageRequest.sort || ['rowLastUpdatedDate dsc']

    // Map unified searchKey into backend-expected multi-field params
    if (pageRequest.searchKey) {
      const q = pageRequest.searchKey
      pageRequest.code = q
      pageRequest.type = q
      pageRequest.name = q
      pageRequest.contactNo = q
      delete pageRequest.searchKey
    }

    return agentsService
      .getAgents(pageRequest)
      .pipe(
        map(data => {
          const content = data.content
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
  }, [commissionMapping])

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

  const actionBtnList = [
    { key: 'view_agent', icon: <Visibility fontSize="small" />, color: '#18a2b8', className: `ui-button-info`, onClick: openViewSection },
    { key: 'update_agent', icon: <Edit fontSize="small" />, color: '#fbac05', className: `ui-button-warning`, onClick: openEditSection },
    {
      key: 'approve_agent',
      tooltip: 'Approve',
      icon: <CheckCircle fontSize="small" />,
      color: '#4caf50',
      disabled: (row: any) => {
        const status = row?.agentBasicDetails?.approvalProgressStatus
        return !(status === 'PENDING_APPROVAL' || status === 'PENDING_ACTION_FROM_APPLICANT')
      },
      onClick: (row: any) => handleActionClick(row, 'APPROVED')
    },
    {
      key: 'revert_agent',
      tooltip: 'Revert',
      icon: <Undo fontSize="small" />,
      color: '#ff9800',
      disabled: (row: any) => {
        const status = row?.agentBasicDetails?.approvalProgressStatus
        return !(status === 'PENDING_APPROVAL' || status === 'PENDING_ACTION_FROM_APPLICANT')
      },
      onClick: (row: any) => handleActionClick(row, 'REVERT')
    },
    {
      key: 'reject_agent',
      tooltip: 'Reject',
      icon: <Cancel fontSize="small" />,
      color: '#f44336',
      disabled: (row: any) => {
        const status = row?.agentBasicDetails?.approvalProgressStatus
        return !(status === 'PENDING_APPROVAL' || status === 'PENDING_ACTION_FROM_APPLICANT')
      },
      onClick: (row: any) => handleActionClick(row, 'REJECTED')
    }
  ]

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

  const configuration: any = {
    useAccordionMode: true,
    enableSelection: false,
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
      getStatusColor: (_row: any) => {
        return null
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
      enableStatusToggle: false,
      clientSideSearch: false,
      addCreateButton: false,
      enableGlobalSearch: true,
      searchText: 'Search by code, name, type, contact'
    }
  }

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
      {/* Simple Comment Dialog for Reject and Revert */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {getActionLabel(selectedAction)} Agent
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              autoFocus
              multiline
              rows={4}
              fullWidth
              label="Comment/Reason"
              placeholder="Enter your comment or reason..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              variant="outlined"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ padding: 2, gap: 1 }}>
          <Button
            onClick={handleCloseDialog}
            variant="outlined"
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmitApproval}
            variant="contained"
            disabled={submitting}
            sx={{
              backgroundColor: getActionColor(selectedAction),
              '&:hover': {
                backgroundColor: getActionColor(selectedAction),
                opacity: 0.9
              }
            }}
          >
            {submitting ? <CircularProgress size={24} /> : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Unit Assignment Modal for Approve Action */}
      <UnitAssignModal
        unitAssignModal={openUnitAssignModal}
        closeAssignUnitModal={closeAssignUnitModal}
        handleAssignUnitSubmit={handleAssignUnitSubmit}
      />
    </div>
  )
}


