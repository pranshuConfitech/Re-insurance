'use client'

import React, { useState, useEffect } from 'react'
import { 
  Paper, 
  Tabs, 
  Tab, 
  Box, 
  CircularProgress, 
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material'
import { AgentsService } from '@/services/remote-api/api/agents-services'
import { useSearchParams, useRouter } from 'next/navigation'

import AgentBasicDetails from './agents.basic.details.component'
import AgentAddressOthers from './agents.address.others.component'
import AgentAccountsOthers from './agents.accounts.others.component'
import AgentViewOnlyDocuments from './agents.viewonly.documents.component'
import UnitAssignModal from './Modal/unit.assign.modal'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`agent-tabpanel-${index}`}
      aria-labelledby={`agent-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `agent-tab-${index}`,
    'aria-controls': `agent-tabpanel-${index}`,
  }
}

interface AgentsViewOnlyComponentProps {
  rows: any[]
  columns: any[]
}

const AgentsViewOnlyComponent: React.FC<AgentsViewOnlyComponentProps> = ({
  rows,
  columns
}) => {
  const [value, setValue] = useState(0)
  const [agentData, setAgentData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showApprovalButtons, setShowApprovalButtons] = useState(false)
  
  // Dialog states
  const [openDialog, setOpenDialog] = useState(false)
  const [openUnitAssignModal, setOpenUnitAssignModal] = useState(false)
  const [selectedAction, setSelectedAction] = useState<'APPROVED' | 'REJECTED' | 'REVERT' | null>(null)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  
  const searchParams = useSearchParams()
  const router = useRouter()
  const selectedAgentId = searchParams.get('selectedAgent')

  const agentsService = new AgentsService()

  useEffect(() => {
    if (selectedAgentId) {
      setLoading(true)
      agentsService.getAgentDetails(selectedAgentId).subscribe({
        next: (data) => {
          setAgentData(data)
          setLoading(false)
        },
        error: (error) => {
          console.error('Error fetching agent details:', error)
          setLoading(false)
        }
      })
    }
  }, [selectedAgentId])

  useEffect(() => {
    if (agentData) {
      const isPendingApproval = 
        agentData?.agentBasicDetails?.approvalProgressStatus === 'PENDING_APPROVAL' || agentData?.agentBasicDetails?.approvalProgressStatus ==="PENDING_ACTION_FROM_APPLICANT"
      setShowApprovalButtons(isPendingApproval)
    }
  }, [agentData])

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  const handleButtonClick = (action: 'APPROVED' | 'REJECTED' | 'REVERT') => {
    setSelectedAction(action)
    setComment('')
    
    if (action === 'APPROVED') {
      // Open Unit Assignment Modal for approval
      setOpenUnitAssignModal(true)
    } else {
      // Open simple comment dialog for Reject and Revert
      setOpenDialog(true)
    }
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setSelectedAction(null)
    setComment('')
  }

  const closeAssignUnitModal = () => {
    setOpenUnitAssignModal(false)
    setSelectedAction(null)
  }

  const handleAssignUnitSubmit = (payload: any) => {
    if (!selectedAgentId) return
    
    setSubmitting(true)
    
    // Construct the approval payload with agentUnitDetails (removed decision key)
    const approvalPayload = {
      action: 'APPROVED',
      comment: payload.comment || '',
      agentUnitDetails: {
        unitId: payload.unitId,
        startDate: payload.startDate
      }
    }
    
    // Call API with unit assignment payload
    agentsService.approveAgentWithAction(selectedAgentId, approvalPayload).subscribe({
      next: () => {
        setSubmitting(false)
        closeAssignUnitModal()
        router.push('/agents/management?mode=viewList')
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
    
    // For Reject and Revert, use simple comment payload (removed decision key)
    const payload = {
      action: selectedAction,
      comment: comment
    }
    
    agentsService.approveAgentWithAction(selectedAgentId, payload).subscribe({
      next: () => {
        setSubmitting(false)
        handleCloseDialog()
        router.push('/agents/management?mode=viewList')
      },
      error: (error) => {
        console.error('Approval action failed:', error)
        setSubmitting(false)
      }
    })
  }

  const getActionLabel = (action: string | null) => {
    switch(action) {
      case 'APPROVED': return 'Approve'
      case 'REJECTED': return 'Reject'
      case 'REVERT': return 'Pending'
      default: return ''
    }
  }

  const getActionColor = (action: string | null) => {
    switch(action) {
      case 'APPROVED': return '#4caf50'
      case 'REJECTED': return '#f44336'
      case 'REVERT': return '#ff9800'
      default: return '#626BDA'
    }
  } // <- Added missing closing brace

  if (loading) {
    return (
      <Paper
        elevation={3}
        style={{
          height: '70vh',
          width: '100%',
          padding: '16px',
          backgroundColor: '#fafafa',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <CircularProgress />
      </Paper>
    )
  }

  return (
    <>
      <Paper
        elevation={3}
        style={{
          minHeight: '70vh',
          width: '100%',
          padding: '16px',
          backgroundColor: '#fafafa'
        }}
      >
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="agent details tabs"
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontSize: '14px',
                  fontWeight: 500,
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#626BDA',
                },
              }}
            >
              <Tab
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        backgroundColor: value === 0 ? '#626BDA' : '#ccc',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}
                    >
                      1
                    </Box>
                    Basic Details
                  </Box>
                }
                {...a11yProps(0)}
              />
              <Tab
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        backgroundColor: value === 1 ? '#626BDA' : '#ccc',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}
                    >
                      2
                    </Box>
                    Address and Others
                  </Box>
                }
                {...a11yProps(1)}
              />
              <Tab
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        backgroundColor: value === 2 ? '#626BDA' : '#ccc',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}
                    >
                      3
                    </Box>
                    Accounts and Others
                  </Box>
                }
                {...a11yProps(2)}
              />
              <Tab
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        backgroundColor: value === 3 ? '#626BDA' : '#ccc',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}
                    >
                      4
                    </Box>
                    Documents
                  </Box>
                }
                {...a11yProps(3)}
              />
            </Tabs>
          </Box>

          <TabPanel value={value} index={0}>
            <AgentBasicDetails agentData={agentData} />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <AgentAddressOthers agentData={agentData} />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <AgentAccountsOthers agentData={agentData} />
          </TabPanel>
          <TabPanel value={value} index={3}>
            <AgentViewOnlyDocuments agentData={agentData} />
          </TabPanel>
        </Box>

        {showApprovalButtons && (
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              padding: 2,
              justifyContent: 'flex-end',
              backgroundColor: '#f5f5f5',
              borderBottom: 1,
              borderColor: 'divider'
            }}
          >
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#4caf50',
                '&:hover': { backgroundColor: '#45a049' }
              }}
              onClick={() => handleButtonClick('APPROVED')}
            >
              Approve
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#ff9800',
                '&:hover': { backgroundColor: '#fb8c00' }
              }}
              onClick={() => handleButtonClick('REVERT')}
            >
              Revert
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#f44336',
                '&:hover': { backgroundColor: '#e53935' }
              }}
              onClick={() => handleButtonClick('REJECTED')}
            >
              Reject
            </Button>
          </Box>
        )}
      </Paper>

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
    </>
  )
}

export default AgentsViewOnlyComponent
