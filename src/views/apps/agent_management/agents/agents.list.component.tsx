'use client'
import React, { useEffect } from 'react'

import { useRouter } from 'next/navigation'

import { map, switchMap } from 'rxjs/operators'
import { Observable, Observer } from 'rxjs'

import { TabView, TabPanel } from 'primereact/tabview'
import { Toast } from 'primereact/toast'
import { Card } from 'primereact/card'

import { Box } from '@mui/material'
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt'
import PersonIcon from '@mui/icons-material/Person'
import BusinessIcon from '@mui/icons-material/Business'
import BadgeIcon from '@mui/icons-material/Badge'
import StorefrontIcon from '@mui/icons-material/Storefront'

import RoleService from '@/services/utility/role/index'
import { AgentsService } from '@/services/remote-api/api/agents-services'
import { AgentTypeService } from '@/services/remote-api/api/master-services'
import CommissionListComponent from '../commission/commission.list.component'
import AgentWithdrawTerminationModal from './Modal/agent.withdraw.termination.modal'

import { FettleDataGrid } from '../../shared-component/components/fettle.data.grid'
import AgentTerminateModal from './Modal/agent.terminate.modal'
import UnitAssignModal from './Modal/unit.assign.modal'
import AgentTimelineModal from './Modal/agent.timeline.modal'
import AgentApprovalModal from './Modal/agent.approval.modal'
import AddIcon from '@mui/icons-material/Add'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { Button, IconButton, Tooltip, Menu, MenuItem } from '@mui/material'
import AgentApprovedListComponent from './agent.approved.list.component'
import AgentPendingListComponent from './agent.pending.list.component'

const agenttypeservice = new AgentTypeService()
const PAGE_NAME = 'AGENT'
const agentsService = new AgentsService()

export default function AgentsListComponent(props: any) {
  const router = useRouter()
  const [value, setValue] = React.useState(0)
  const [reloadTable, setReloadTable] = React.useState(false)
  const [activeIndex, setActiveIndex] = React.useState(0)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [agentsToTerminate, setAgentsToTerminate]: any[] = React.useState([])
  const [assigneeAgent, setAssigneeAgent]: any = React.useState()
  const [agentId, setAgentId] = React.useState<string | null>(null)
  const [openAgentTimelineModal, setOpenAgentTimelineModal] = React.useState<boolean>(false)
  const [rows, setRows] = React.useState(props.rows)
  const [openTerminateModal, setOpenTerminateModal] = React.useState(false)
  const [openAssignUnitModal, setOpenAssignUnitModal] = React.useState(false)
  const [selectionTerminatedMenuDisabled, setSelectionTerminatedMenuDisabled] = React.useState(true)
  const toast: any = React.useRef(null)
  const roleService = new RoleService()
  const [openApprovalModal, setOpenApprovalModal] = React.useState(false)
  const [selectedAgentForApproval, setSelectedAgentForApproval]: any = React.useState(null)
  const [approvalLoading, setApprovalLoading] = React.useState(false)
  const [filterType, setFilterType] = React.useState<string>('')
  const [openWithdrawModal, setOpenWithdrawModal] = React.useState(false)
  const [selectedAgentForWithdraw, setSelectedAgentForWithdraw]: any = React.useState(null)
  const [approvedCount, setApprovedCount] = React.useState<number>(0)
  const [resetFilters, setResetFilters] = React.useState(0)

  const [agentCounts, setAgentCounts] = React.useState<any>({
    total: 0,
    types: {
      Agent: 0,
      Broker: 0,
      'Direct Agent': 0,
      Franchise: 0
    },
    activeTypes: {
      expired: 0,
      active: 0,
      suspended: 0
    }
  })

  const [agentTypes, setAgentTypes] = React.useState<any[]>([])
  const [selectedTypeCode, setSelectedTypeCode] = React.useState<string>('')

  const handleSuspendAgent = (agent: any) => {
    if (!agent?.id) return
    setAgentsToTerminate([agent.id])
    setOpenTerminateModal(true)
  }

  // Event handlers - Define before using in action buttons
  const handleClickForWithdraw = (agent: any) => {
    setSelectedAgentForWithdraw(agent)
    setOpenWithdrawModal(true)
  }

  const closeWithdrawModal = () => {
    setOpenWithdrawModal(false)
    setSelectedAgentForWithdraw(null)
  }

  const handleWithdrawSubmit = (payload: any) => {
    agentsService.withdrawTermination(payload).subscribe({
      next: (res) => {
        toast.current.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Termination withdrawn successfully',
          life: 3000
        })
        closeWithdrawModal()
        setReloadTable(true)
        setTimeout(() => {
          setReloadTable(false)
        }, 100)
      },
      error: (error) => {
        console.error('Withdraw termination failed:', error)
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to withdraw termination. Please try again.',
          life: 3000
        })
      }
    })
  }

  const handleOpen = () => {
    router.push('/agents/management?mode=create')
  }

  const openEditSection: any = (agent: any) => {
    router.push(`/agents/management/${agent.id}?mode=edit`)
  }

  // const handleClickForAppoveOpen = (agent: any) => {
  //   agentsService.approveAgent(agent.id).subscribe(res => {
  //     toast.current.show({
  //       severity: 'success',
  //       summary: 'Success',
  //       detail: 'Agent Approved',
  //       life: 3000
  //     })
  //     setTimeout(() => {
  //       setReloadTable(true)
  //     }, 1500)
  //   })
  // }

  const handleClickForApproveOpen = (agent: any) => {
    setSelectedAgentForApproval(agent)
    setOpenApprovalModal(true)
  }

  const closeApprovalModal = () => {
    setOpenApprovalModal(false)
    setSelectedAgentForApproval(null)
    setApprovalLoading(false)
  }

  // const handleApprovalSubmit = (action: 'REVERT' | 'REJECTED' | 'APPROVED', comment: string) => {
  //   if (!selectedAgentForApproval?.id) {
  //     return
  //   }

  //   setApprovalLoading(true)

  //   // Use the new service method
  //   agentsService.approveAgentWithAction(selectedAgentForApproval.id, action, comment)
  //     .subscribe({
  //       next: (res) => {
  //         const actionMessages = {
  //           APPROVED: 'Agent Approved Successfully',
  //           REJECTED: 'Agent Rejected Successfully',
  //           REVERT: 'Agent Reverted to Pending Successfully'
  //         }

  //         toast.current.show({
  //           severity: 'success',
  //           summary: 'Success',
  //           detail: actionMessages[action],
  //           life: 3000
  //         })

  //         closeApprovalModal()

  //         setTimeout(() => {
  //           setReloadTable(true)
  //         }, 1500)
  //       },
  //       error: (error) => {
  //         console.error('Approval action failed:', error)
  //         toast.current.show({
  //           severity: 'error',
  //           summary: 'Error',
  //           detail: 'Failed to process approval action. Please try again.',
  //           life: 3000
  //         })
  //         setApprovalLoading(false)
  //       }
  //     })
  // }

  const handleClickForAssignUnit = (agent: any) => {
    setAssigneeAgent(agent.id)
    setOpenAssignUnitModal(true)
  }

  const handleClickForTimeline = (agent: any) => {
    setAgentId(agent.id)
    setOpenAgentTimelineModal(true)
  }

  const handleSelectedRows = (selectedAgents: any) => {
    if (selectedAgents.length == 0) {
      setSelectionTerminatedMenuDisabled(true)
    } else {
      setSelectionTerminatedMenuDisabled(false)
      let ta: any[] = []
      selectedAgents.forEach((agent: any) => {
        ta.push(agent.id)
      })
      setAgentsToTerminate(ta)
    }
  }

  const openTerminatelist = (e: any) => {
    if (!agentsToTerminate.length) {
      toast.current?.show({
        severity: 'info',
        summary: 'No agents selected',
        detail: 'Please select at least one agent to suspend.',
        life: 3000
      })
      return
    }
    setOpenTerminateModal(true)
  }

  const closeTerminateModal = () => {
    setOpenTerminateModal(false)
    setAgentsToTerminate([])
  }

  const closeAssignUnitModal = () => {
    setOpenAssignUnitModal(false)
  }

  const closeTimelineModal = () => {
    setOpenAgentTimelineModal(false)
    setAgentId(null)
  }

  const handleTerminateSubmit = (payload: any) => {
    payload['agentIds'] = agentsToTerminate
    agentsService.terminateAgents(payload).subscribe(res => {
      closeTerminateModal()
      setReloadTable(true)
      setTimeout(() => {
        setReloadTable(false)
      }, 100)
    })
  }

  const handleAssignUnitSubmit = (payload: any) => {
    agentsService.assignUnit(payload, assigneeAgent).subscribe(res => {
      closeAssignUnitModal()
      setAssigneeAgent(null)
      setReloadTable(true)
      setTimeout(() => {
        setReloadTable(false)
      }, 100)
    })
  }

  const handleAgentTypeClick = (type: string, typeCode?: string) => {
    console.log('Agent type clicked:', type, 'typeCode:', typeCode)
    // Toggle behavior: if clicking the same type, deselect it
    if (filterType === type) {
      setFilterType('')
      setSelectedTypeCode('')
      // Fetch overall counts when deselecting
      fetchAgentCounts()
    } else {
      setFilterType(type)
      if (typeCode) {
        setSelectedTypeCode(typeCode)
        // Fetch type-wise counts when selecting a specific type
        fetchAgentTypeWiseCounts(typeCode)
      } else {
        setSelectedTypeCode('')
        fetchAgentCounts()
      }
    }
  }

  const handleResetAllFilters = () => {
    console.log('Resetting all filters')
    setFilterType('')
    setSelectedTypeCode('')
    setResetFilters(prev => prev + 1)
    fetchAgentCounts()
  }

  // Action buttons - Define after handlers
  const actionBtnList = [
    // {
    //   key: 'update_provider',
    //   icon: 'pi pi-check',
    //   onClick: handleClickForApproveOpen,
    //   tooltip: 'Approve'
    // },
    {
      key: 'update_provider',
      icon: 'pi pi-user-edit',
      className: 'ui-button-warning',
      onClick: openEditSection,
      disabled: (rowData: any) => {
        const shouldDisable = rowData?.agentBasicDetails?.agentSourceType === 'AGENT_PORTAL'
        return shouldDisable
      }
    }
  ]

  const actionButtons = [
    // {
    //   key: 'update_provider',
    //   icon: 'pi pi-book',
    //   onClick: handleClickForAssignUnit,
    //   tooltip: 'Assign Unit'
    // },
    {
      key: 'update_provider',
      icon: 'pi pi-user-edit',
      className: 'ui-button-warning',
      onClick: openEditSection
    },
    {
      key: 'update_provider',
      icon: 'pi pi-calendar-times',
      onClick: handleClickForTimeline,
      tooltip: 'Timeline'
    }
  ]

  // Action buttons for terminated agents
  const actionButtonsTerminated = [
    {
      key: 'withdraw_termination',
      icon: 'pi pi-undo',
      className: 'p-button-success',
      onClick: handleClickForWithdraw,
      tooltip: 'Withdraw Termination'
    }
  ]

  // Data source functions wrapped in useCallback
  const dataSource$ = React.useCallback(
    (
      pageRequest: any = {
        page: 0,
        size: 10,
        summary: true,
        active: true,
        isApproved: true
      }
    ) => {
      pageRequest.sort = ['rowLastUpdatedDate dsc']

      if (pageRequest.searchKey) {
        pageRequest['code'] = pageRequest.searchKey.trim()
        pageRequest['type'] = pageRequest.searchKey.trim()
        pageRequest['name'] = pageRequest.searchKey.trim()
        pageRequest['contactNo'] = pageRequest.searchKey.trim()
      }

      delete pageRequest.searchKey

      if (filterType && filterType !== '') {
        pageRequest['type'] = filterType
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
                  at.content.forEach(agenttype => {
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
    },
    [filterType]
  )

  const dataSourcePending$ = React.useCallback(
    (
      pageRequest: any = {
        page: 0,
        size: 10,
        summary: true,
        active: true,
        isApproved: false
      }
    ) => {
      pageRequest.sort = ['rowLastUpdatedDate dsc']

      if (pageRequest.searchKey) {
        pageRequest['code'] = pageRequest.searchKey.trim()
        pageRequest['type'] = pageRequest.searchKey.trim()
        pageRequest['name'] = pageRequest.searchKey.trim()
        pageRequest['contactNo'] = pageRequest.searchKey.trim()
      }

      delete pageRequest.searchKey

      return agentsService
        .getAgents(pageRequest)
        .pipe(
          map(data => {
            const content = data.content
            console.log('content', content)

            const records = content.map((item: any) => {
              item['agentBasicDetails']['primaryContact'] = item.agentBasicDetails.contactNos[0]?.contactNo || 'N/A'

              if (item.agentBasicDetails.emails && item.agentBasicDetails.emails.length > 0) {
                item['agentBasicDetails']['primaryEmail'] = item.agentBasicDetails.emails[0].emailId
              } else {
                item['agentBasicDetails']['primaryEmail'] = 'N/A'
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
                  at.content.forEach(agenttype => {
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
    },
    []
  )

  const dataSourceTerminated$ = React.useCallback(
    (
      pageRequest: any = {
        page: 0,
        size: 10,
        summary: true,
        active: true,
        isTerminated: true,
        isApproved: true
      }
    ) => {
      pageRequest.sort = ['rowLastUpdatedDate dsc']

      if (pageRequest.searchKey) {
        pageRequest['code'] = pageRequest.searchKey.trim()
        pageRequest['type'] = pageRequest.searchKey.trim()
        pageRequest['name'] = pageRequest.searchKey.trim()
        pageRequest['contactNo'] = pageRequest.searchKey.trim()
      }

      delete pageRequest.searchKey

      return agentsService
        .getAgents(pageRequest)
        .pipe(
          map(data => {
            const content = data.content

            const records = content.map((item: any) => {
              item['agentBasicDetails']['primaryContact'] = item.agentBasicDetails.contactNos[0]?.contactNo || 'N/A'

              // Add primary email - handle null emails array
              if (item.agentBasicDetails.emails && item.agentBasicDetails.emails.length > 0) {
                item['agentBasicDetails']['primaryEmail'] = item.agentBasicDetails.emails[0].emailId
              } else {
                item['agentBasicDetails']['primaryEmail'] = 'N/A'
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
                  at.content.forEach(agenttype => {
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
    },
    []
  )

  const dataSourceIncentive$ = React.useCallback(
    (
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
        pageRequest['type'] = pageRequest.searchKey.trim()
        pageRequest['name'] = pageRequest.searchKey.trim()
        pageRequest['contactNo'] = pageRequest.searchKey.trim()
      }

      delete pageRequest.searchKey

      return agentsService.getIncentives(pageRequest).pipe(
        map((data: any) => {
          const content = data.content

          const records = content.map((item: any) => {
            // item['validFrom'] = moment(item.validFrom).format('DD/MM/YYYY')

            return item
          })

          data.content = records
          console.log('data.content', data.content)
          return data
        })
      )
    },
    []
  )

  // Effects
  useEffect(() => {
    if (localStorage.getItem('agentId')) {
      localStorage.removeItem('agentId')
    }
  }, [])

  // Fetch agent types on mount
  useEffect(() => {
    agenttypeservice.getAgentTypes().subscribe({
      next: (response) => {
        if (response.content) {
          setAgentTypes(response.content)
        }
      },
      error: (error) => {
        console.error('Error fetching agent types:', error)
      }
    })
  }, [])

  // Fetch agent counts when activeIndex is 0 or reloadTable changes
  useEffect(() => {
    if (activeIndex === 0) {
      if (selectedTypeCode) {
        fetchAgentTypeWiseCounts(selectedTypeCode)
      } else {
        fetchAgentCounts()
      }
    }
  }, [activeIndex, reloadTable])

  React.useEffect(() => {
    setRows(props.rows)
  }, [props.rows])

  // Fetch agent counts
  const fetchAgentCounts = () => {
    const payload = {
      page: 0,
      size: 10,
      summary: true,
      active: true
    }

    agentsService.getAgentCounts(payload).subscribe({
      next: (response) => {
        setAgentCounts(response)
        setApprovedCount(response?.total ?? 0)
      },
      error: (error) => {
        console.error('Error fetching agent counts:', error)
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to fetch agent counts',
          life: 3000
        })
      }
    })
  }

  // Fetch agent type-wise counts
  const fetchAgentTypeWiseCounts = (typeCode: string) => {
    const payload = {
      page: 0,
      size: 1,
      summary: true,
      active: true,
      isApproved: true,
      typeCode: typeCode
    }

    agentsService.getAgentTypeWiseCounts(payload).subscribe({
      next: (response) => {
        // Update counts with type-wise data
        setAgentCounts({
          total: response.total || 0,
          types: response.types || {},
          activeTypes: response.activeTypes || {}
        })
        setApprovedCount(response?.total ?? 0)
      },
      error: (error) => {
        console.error('Error fetching type-wise agent counts:', error)
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to fetch type-wise agent counts',
          life: 3000
        })
      }
    })
  }

  // Column definitions
  const columnsDefinationsActive = [
    { field: 'agentBasicDetails.name', headerName: 'Agent Name' },
    { field: 'agentBasicDetails.code', headerName: 'Agent Code' },
    { field: 'agentBasicDetails.primaryContact', headerName: 'Contact Number' },
    { field: 'agentBasicDetails.primaryEmail', headerName: 'Email ID' },
    {
      field: 'agentBasicDetails.joiningDate',
      headerName: 'Joining Date',
      body: (rowData: any) => <span>{new Date(rowData.agentBasicDetails.joiningDate).toLocaleDateString()}</span>
    },
    {
      field: 'commission',
      headerName: 'Commission (%)',
      body: (rowData: any) => <span>{rowData.commission !== null && rowData.commission !== undefined ? rowData.commission : 0}</span>
    }
  ]

  const columnsDefinationsPending = [
    { field: 'agentBasicDetails.name', headerName: 'Agent Name' },
    { field: 'agentBasicDetails.code', headerName: 'Agent Code' },
    { field: 'agentBasicDetails.primaryContact', headerName: 'Contact Number' },
    { field: 'agentBasicDetails.primaryEmail', headerName: 'Email ID' },
    {
      field: 'agentBasicDetails.joiningDate',
      headerName: 'Joining Date',
      body: (rowData: any) => <span>{new Date(rowData.agentBasicDetails.joiningDate).toLocaleDateString()}</span>
    },
    {
      field: 'commission',
      headerName: 'Commission (%)',
      body: (rowData: any) => <span>{rowData.commission !== null && rowData.commission !== undefined ? rowData.commission : 0}</span>
    }
  ]

  const columnsDefinationsTerminated = [
    { field: 'agentBasicDetails.name', headerName: 'Agent Name' },
    { field: 'agentBasicDetails.code', headerName: 'Agent Code' },
    { field: 'agentBasicDetails.primaryContact', headerName: 'Contact Number' },
    { field: 'agentBasicDetails.primaryEmail', headerName: 'Email ID' },
    {
      field: 'agentBasicDetails.joiningDate',
      headerName: 'Joining Date',
      body: (rowData: any) => <span>{new Date(rowData.agentBasicDetails.joiningDate).toLocaleDateString()}</span>
    },
    {
      field: 'commission',
      headerName: 'Commission (%)',
      body: (rowData: any) => <span>{rowData.commission !== null && rowData.commission !== undefined ? rowData.commission : 0}</span>
    }
  ]

  const columnsDefinationsIncentive = [
    { field: 'type', headerName: 'Type' },
    { field: 'value', headerName: 'Value (% of commission earned by agents under unit manager)' }
  ]

  // Configurations
  const [configuration, setConfiguration] = React.useState({
    enableSelection: true,
    scrollHeight: '300px',
    pageSize: 10,
    actionButtons: [],
    header: {
      enable: true,
      enableDownload: true,
      addCreateButton: false,
      onCreateButtonClick: handleOpen,
      text: 'Agent Management',
      enableGlobalSearch: true,
      searchText: 'Search by code, name, type, contact',
      onSelectionChange: handleSelectedRows,
      selectionMenus: [
        {
          icon: '',
          label: 'Suspended',
          onClick: openTerminatelist
        }
      ]
    }
  })

  const [configurationPending, setConfigurationPending] = React.useState({
    enableSelection: false,
    scrollHeight: '300px',
    pageSize: 10,
    // actionButtons: roleService.checkActionPermission(PAGE_NAME, 'UPDATE', openEditSection),
    actionButtons: [],
    header: {
      enable: true,
      enableDownload: true,
      text: 'Pending Agents',
      enableGlobalSearch: true,
      searchText: 'Search by code, name, type, contact'
    }
  })

  const [configurationTerminated, setConfigurationTerminated] = React.useState({
    enableSelection: false,
    scrollHeight: '300px',
    pageSize: 10,
    actionButtons: [],
    header: {
      enable: true,
      enableDownload: true,
      text: 'Terminated Agents',
      enableGlobalSearch: true,
      searchText: 'Search by code, name, type, contact'
    }
  })

  // New configuration for Incentive tab
  const [configurationIncentive, setConfigurationIncentive] = React.useState({
    enableSelection: false,
    scrollHeight: '300px',
    pageSize: 10,
    actionButtons: [], // No action buttons for Incentive tab
    header: {
      enable: true,
      enableDownload: true,
      addCreateButton: true,
      onCreateButtonClick: () => router.push('/agents/incentive/create?mode=create'),
      text: 'Incentive',
      enableGlobalSearch: true,
      searchText: 'Search by code, name, type, contact'
    }
  })

  // Setup configuration on mount
  // useEffect(() => {
  //   setConfiguration(prevConfig => ({
  //     ...prevConfig,
  //     // actionButtons: roleService.checkActionPermission(PAGE_NAME, 'UPDATE', openEditSection),
  //     actionButtons: roleService.checkActionPermission(PAGE_NAME, '', () => { }, actionButtons),
  //     header: {
  //       ...prevConfig.header,
  //       addCreateButton: roleService.checkActionPermission(PAGE_NAME, 'CREATE')
  //     }
  //   }))

  //   setConfigurationPending(prevConfig => ({
  //     ...prevConfig,
  //     actionButtons: roleService.checkActionPermission(PAGE_NAME, '', () => { }, actionBtnList)
  //   }))

  //   // setConfigurationTerminated(prevConfig => ({
  //   //   ...prevConfig,
  //   //   actionButtons: roleService.checkActionPermission(PAGE_NAME, 'UPDATE', openEditSection)
  //   // }))

  //   setConfigurationTerminated(prevConfig => ({
  //     ...prevConfig,
  //     actionButtons: roleService.checkActionPermission(PAGE_NAME, '', () => { }, actionButtonsTerminated)
  //   }))

  //   // New configuration for Incentive tab
  //   setConfigurationIncentive({
  //     enableSelection: false,
  //     scrollHeight: '300px',
  //     pageSize: 10,
  //     actionButtons: [], // No action buttons for Incentive tab
  //     header: {
  //       enable: true,
  //       enableDownload: true,
  //       addCreateButton: true,
  //       onCreateButtonClick: () => router.push('/agents/incentive/create?mode=create'),
  //       text: 'Incentive',
  //       enableGlobalSearch: true,
  //       searchText: 'Search by code, name, type, contact'
  //     }
  //   })
  // }, [])

  // Setup configuration on mount
  useEffect(() => {
    setConfiguration(prevConfig => ({
      ...prevConfig,
      actionButtons: roleService.checkActionPermission(PAGE_NAME, '', () => { }, actionButtons),
      header: {
        ...prevConfig.header,
        addCreateButton: roleService.checkActionPermission(PAGE_NAME, 'CREATE')
      }
    }))

    setConfigurationPending(prevConfig => ({
      ...prevConfig,
      actionButtons: roleService.checkActionPermission(PAGE_NAME, '', () => { }, actionBtnList)
    }))

    // For terminated agents - cast to any to avoid type error
    setConfigurationTerminated((prevConfig: any) => ({
      ...prevConfig,
      actionButtons: actionButtonsTerminated
    }))

    setConfigurationIncentive((prevConfig: any) => ({
      ...prevConfig,
      enableSelection: false,
      scrollHeight: '300px',
      pageSize: 10,
      actionButtons: [],
      header: {
        enable: true,
        enableDownload: true,
        addCreateButton: true,
        onCreateButtonClick: () => router.push('/agents/incentive/create?mode=create'),
        text: 'Incentive',
        enableGlobalSearch: true,
        searchText: 'Search by code, name, type, contact'
      }
    }))
  }, [])


  // const AgentCountCards = () => (
  //   <Box sx={{
  //     display: 'grid',
  //     gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(auto-fit, minmax(180px, 1fr))' },
  //     gap: 1.5,
  //     marginBottom: 3,
  //     padding: 0
  //   }}>
  //     {/* Total Agents Card */}
  //     <Box
  //       onClick={() => handleAgentTypeClick('')}
  //       sx={{
  //         borderRadius: '8px',
  //         border: '1px solid',
  //         borderColor: filterType === '' ? '#6b7280' : '#6b7280',
  //         padding: '12px 16px',
  //         color: filterType === '' ? '#fff' : '#6b7280',
  //         fontSize: { xs: '12px', sm: '13px' },
  //         display: 'flex',
  //         alignItems: 'center',
  //         gap: 1,
  //         minHeight: '50px',
  //         backgroundColor: filterType === '' ? '#6b7280' : 'transparent',
  //         cursor: 'pointer',
  //         transition: 'all 0.2s ease'
  //       }}
  //     >
  //       <ThumbUpAltIcon sx={{ width: '20px', height: '20px', flexShrink: 0 }} />
  //       <Box sx={{ overflow: 'hidden' }}>
  //         <Box component="span" sx={{
  //           display: 'block',
  //           overflow: 'hidden',
  //           textOverflow: 'ellipsis',
  //           whiteSpace: 'nowrap'
  //         }}>
  //           Total Agents <Box component="span" sx={{ fontWeight: 700 }}>({agentCounts.total})</Box>
  //         </Box>
  //       </Box>
  //     </Box>

  //     {/* Agent Card */}
  //     <Box
  //       onClick={() => handleAgentTypeClick('Agent')}
  //       sx={{
  //         borderRadius: '8px',
  //         border: '1px solid',
  //         borderColor: filterType === 'Agent' ? '#2563eb' : '#2563eb',
  //         padding: '12px 16px',
  //         color: filterType === 'Agent' ? '#fff' : '#2563eb',
  //         fontSize: { xs: '12px', sm: '13px' },
  //         display: 'flex',
  //         alignItems: 'center',
  //         gap: 1,
  //         minHeight: '50px',
  //         backgroundColor: filterType === 'Agent' ? '#2563eb' : 'transparent',
  //         cursor: 'pointer',
  //         transition: 'all 0.2s ease'
  //       }}
  //     >
  //       <PersonIcon sx={{ width: '20px', height: '20px', flexShrink: 0 }} />
  //       <Box sx={{ overflow: 'hidden' }}>
  //         <Box component="span" sx={{
  //           display: 'block',
  //           overflow: 'hidden',
  //           textOverflow: 'ellipsis',
  //           whiteSpace: 'nowrap'
  //         }}>
  //           Agent <Box component="span" sx={{ fontWeight: 700 }}>({agentCounts.types.Agent})</Box>
  //         </Box>
  //       </Box>
  //     </Box>

  //     {/* Broker Card */}
  //     <Box
  //       onClick={() => handleAgentTypeClick('Broker')}
  //       sx={{
  //         borderRadius: '8px',
  //         border: '1px solid',
  //         borderColor: filterType === 'Broker' ? '#ea580c' : '#ea580c',
  //         padding: '12px 16px',
  //         color: filterType === 'Broker' ? '#fff' : '#ea580c',
  //         fontSize: { xs: '12px', sm: '13px' },
  //         display: 'flex',
  //         alignItems: 'center',
  //         gap: 1,
  //         minHeight: '50px',
  //         backgroundColor: filterType === 'Broker' ? '#ea580c' : 'transparent',
  //         cursor: 'pointer',
  //         transition: 'all 0.2s ease'
  //       }}
  //     >
  //       <BusinessIcon sx={{ width: '20px', height: '20px', flexShrink: 0 }} />
  //       <Box sx={{ overflow: 'hidden' }}>
  //         <Box component="span" sx={{
  //           display: 'block',
  //           overflow: 'hidden',
  //           textOverflow: 'ellipsis',
  //           whiteSpace: 'nowrap'
  //         }}>
  //           Broker <Box component="span" sx={{ fontWeight: 700 }}>({agentCounts.types.Broker})</Box>
  //         </Box>
  //       </Box>
  //     </Box>

  //     {/* Direct Agent Card */}
  //     <Box
  //       onClick={() => handleAgentTypeClick('Direct Agent')}
  //       sx={{
  //         borderRadius: '8px',
  //         border: '1px solid',
  //         borderColor: filterType === 'Direct Agent' ? '#9333ea' : '#9333ea',
  //         padding: '12px 16px',
  //         color: filterType === 'Direct Agent' ? '#fff' : '#9333ea',
  //         fontSize: { xs: '12px', sm: '13px' },
  //         display: 'flex',
  //         alignItems: 'center',
  //         gap: 1,
  //         minHeight: '50px',
  //         backgroundColor: filterType === 'Direct Agent' ? '#9333ea' : 'transparent',
  //         cursor: 'pointer',
  //         transition: 'all 0.2s ease'
  //       }}
  //     >
  //       <BadgeIcon sx={{ width: '20px', height: '20px', flexShrink: 0 }} />
  //       <Box sx={{ overflow: 'hidden' }}>
  //         <Box component="span" sx={{
  //           display: 'block',
  //           overflow: 'hidden',
  //           textOverflow: 'ellipsis',
  //           whiteSpace: 'nowrap'
  //         }}>
  //           Direct Agent <Box component="span" sx={{ fontWeight: 700 }}>({agentCounts.types['Direct Agent']})</Box>
  //         </Box>
  //       </Box>
  //     </Box>

  //     {/* Franchise Card */}
  //     <Box
  //       onClick={() => handleAgentTypeClick('Franchise')}
  //       sx={{
  //         borderRadius: '8px',
  //         border: '1px solid',
  //         borderColor: filterType === 'Franchise' ? '#16a34a' : '#16a34a',
  //         padding: '12px 16px',
  //         color: filterType === 'Franchise' ? '#fff' : '#16a34a',
  //         fontSize: { xs: '12px', sm: '13px' },
  //         display: 'flex',
  //         alignItems: 'center',
  //         gap: 1,
  //         minHeight: '50px',
  //         backgroundColor: filterType === 'Franchise' ? '#16a34a' : 'transparent',
  //         cursor: 'pointer',
  //         transition: 'all 0.2s ease'
  //       }}
  //     >
  //       <StorefrontIcon sx={{ width: '20px', height: '20px', flexShrink: 0 }} />
  //       <Box sx={{ overflow: 'hidden' }}>
  //         <Box component="span" sx={{
  //           display: 'block',
  //           overflow: 'hidden',
  //           textOverflow: 'ellipsis',
  //           whiteSpace: 'nowrap'
  //         }}>
  //           Franchise <Box component="span" sx={{ fontWeight: 700 }}>({agentCounts.types.Franchise})</Box>
  //         </Box>
  //       </Box>
  //     </Box>
  //   </Box>
  // )

  const AgentCountCards = () => (
    <>
    </>
  )

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleActionClick = (action: string) => {
    console.log('Action clicked:', action)
    handleMenuClose()
  }

  const AgentCountCardsContent = () => (
    <Box sx={{
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(auto-fit, minmax(180px, 1fr))' },
      gap: 1.5,
      marginBottom: 3,
      padding: 0
    }}>
      {/* Total Agents Card */}
      <Box
        onClick={() => handleAgentTypeClick('', '')}
        sx={{
          borderRadius: '8px',
          border: '1px solid',
          borderColor: filterType === '' ? '#6b7280' : '#6b7280',
          padding: '12px 16px',
          color: filterType === '' ? '#fff' : '#6b7280',
          fontSize: { xs: '12px', sm: '13px' },
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          minHeight: '50px',
          backgroundColor: filterType === '' ? '#6b7280' : 'transparent',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
      >
        <ThumbUpAltIcon sx={{ width: '20px', height: '20px', flexShrink: 0 }} />
        <Box sx={{ overflow: 'hidden' }}>
          <Box component="span" sx={{
            display: 'block',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            Total Agents <Box component="span" sx={{ fontWeight: 700 }}>({agentCounts.total})</Box>
          </Box>
        </Box>
      </Box>

      {/* Agent Card - Light Blue Color */}
      <Box
        onClick={() => {
          const agentType = agentTypes.find(t => t.name === 'Agent')
          handleAgentTypeClick('Agent', agentType?.code)
        }}
        sx={{
          borderRadius: '8px',
          border: '1px solid',
          borderColor: filterType === 'Agent' ? '#60a5fa' : '#60a5fa',
          padding: '12px 16px',
          color: filterType === 'Agent' ? '#fff' : '#60a5fa',
          fontSize: { xs: '12px', sm: '13px' },
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          minHeight: '50px',
          backgroundColor: filterType === 'Agent' ? '#60a5fa' : 'transparent',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
      >
        <PersonIcon sx={{ width: '20px', height: '20px', flexShrink: 0 }} />
        <Box sx={{ overflow: 'hidden' }}>
          <Box component="span" sx={{
            display: 'block',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            Agent <Box component="span" sx={{ fontWeight: 700 }}>({agentCounts.types.Agent})</Box>
          </Box>
        </Box>
      </Box>

      {/* Broker Card - Light Orange Color */}
      <Box
        onClick={() => {
          const brokerType = agentTypes.find(t => t.name === 'Broker')
          handleAgentTypeClick('Broker', brokerType?.code)
        }}
        sx={{
          borderRadius: '8px',
          border: '1px solid',
          borderColor: filterType === 'Broker' ? '#fb923c' : '#fb923c',
          padding: '12px 16px',
          color: filterType === 'Broker' ? '#fff' : '#fb923c',
          fontSize: { xs: '12px', sm: '13px' },
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          minHeight: '50px',
          backgroundColor: filterType === 'Broker' ? '#fb923c' : 'transparent',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
      >
        <BusinessIcon sx={{ width: '20px', height: '20px', flexShrink: 0 }} />
        <Box sx={{ overflow: 'hidden' }}>
          <Box component="span" sx={{
            display: 'block',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            Broker <Box component="span" sx={{ fontWeight: 700 }}>({agentCounts.types.Broker})</Box>
          </Box>
        </Box>
      </Box>

      {/* Direct Agent Card - Light Purple Color */}
      <Box
        onClick={() => {
          const directAgentType = agentTypes.find(t => t.name === 'Direct Agent')
          handleAgentTypeClick('Direct Agent', directAgentType?.code)
        }}
        sx={{
          borderRadius: '8px',
          border: '1px solid',
          borderColor: filterType === 'Direct Agent' ? '#a78bfa' : '#a78bfa',
          padding: '12px 16px',
          color: filterType === 'Direct Agent' ? '#fff' : '#a78bfa',
          fontSize: { xs: '12px', sm: '13px' },
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          minHeight: '50px',
          backgroundColor: filterType === 'Direct Agent' ? '#a78bfa' : 'transparent',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
      >
        <BadgeIcon sx={{ width: '20px', height: '20px', flexShrink: 0 }} />
        <Box sx={{ overflow: 'hidden' }}>
          <Box component="span" sx={{
            display: 'block',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            Direct Agent <Box component="span" sx={{ fontWeight: 700 }}>({agentCounts.types['Direct Agent']})</Box>
          </Box>
        </Box>
      </Box>

      {/* Franchise Card */}
      <Box
        onClick={() => {
          const franchiseType = agentTypes.find(t => t.name === 'Franchise')
          handleAgentTypeClick('Franchise', franchiseType?.code)
        }}
        sx={{
          borderRadius: '8px',
          border: '1px solid',
          borderColor: filterType === 'Franchise' ? '#16a34a' : '#16a34a',
          padding: '12px 16px',
          color: filterType === 'Franchise' ? '#fff' : '#16a34a',
          fontSize: { xs: '12px', sm: '13px' },
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          minHeight: '50px',
          backgroundColor: filterType === 'Franchise' ? '#16a34a' : 'transparent',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
      >
        <StorefrontIcon sx={{ width: '20px', height: '20px', flexShrink: 0 }} />
        <Box sx={{ overflow: 'hidden' }}>
          <Box component="span" sx={{
            display: 'block',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            Franchise <Box component="span" sx={{ fontWeight: 700 }}>({agentCounts.types.Franchise})</Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )



  return (
    <>
      <Toast ref={toast} />
      <AgentTerminateModal
        closeTerminateModal={closeTerminateModal}
        openTerminateModal={openTerminateModal}
        handleTerminateSubmit={handleTerminateSubmit}
      />
      <UnitAssignModal
        closeAssignUnitModal={closeAssignUnitModal}
        unitAssignModal={openAssignUnitModal}
        handleAssignUnitSubmit={handleAssignUnitSubmit}
      />
      <AgentTimelineModal
        closeTimelineModal={closeTimelineModal}
        openAgentTimelineModal={openAgentTimelineModal}
        agentId={agentId}
      />

      <AgentWithdrawTerminationModal
        visible={openWithdrawModal}
        onHide={closeWithdrawModal}
        onSubmit={handleWithdrawSubmit}
        agentId={selectedAgentForWithdraw?.id}
      />

      {/* <AgentApprovalModal
        visible={openApprovalModal}
        onHide={closeApprovalModal}
        onSubmit={handleApprovalSubmit}
        agentData={selectedAgentForApproval}
        loading={approvalLoading}
      /> */}

      {/* Agent Management Title */}
      <div style={{
        fontSize: '28px',
        fontWeight: '700',
        color: '#212529',
        marginBottom: '24px',
        letterSpacing: '-0.5px',
        padding: '0'
      }}>
        Agent Management
      </div>

      <div style={{ position: 'relative' }}>
        <div style={{
          position: 'absolute',
          top: 6,
          right: 8,
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          {activeIndex === 0 && (
            <>
              <Box
                onClick={handleResetAllFilters}
                sx={{
                  minWidth: 140,
                  height: 32,
                  padding: '4px 12px',
                  borderRadius: '10px',
                  border: '1px solid #d80f51',
                  color: '#d80f51',
                  backgroundColor: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  '&:hover': {
                    backgroundColor: '#d80f51',
                    color: '#fff',
                    boxShadow: '0 8px 20px rgba(216, 15, 81, 0.25)'
                  }
                }}
              >
                <CheckCircleIcon sx={{ fontSize: 12, flexShrink: 0, color: 'inherit' }} />
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontWeight: 600,
                    letterSpacing: 0.5,
                    textTransform: 'uppercase',
                    fontSize: 8
                  }}
                >
                  <span>Total Agents</span>
                  <Box
                    sx={{
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: 0,
                      textTransform: 'none'
                    }}
                  >
                    {approvedCount}
                  </Box>
                </Box>
              </Box>
              <Button
                variant='contained'
                size='small'
                onClick={() => router.push('/agents/management?mode=create')}
                startIcon={<AddIcon />}
                sx={{
                  backgroundColor: '#28a745',
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                  '&:hover': { backgroundColor: '#218838' }
                }}
              >
                Create
              </Button>
            </>
          )}
          {activeIndex === 1 && (
            <Button
              variant='contained'
              size='small'
              onClick={() => router.push('/agents/management?mode=create')}
              startIcon={<AddIcon />}
              sx={{
                backgroundColor: '#28a745',
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                '&:hover': { backgroundColor: '#218838' }
              }}
            >
              Create
            </Button>
          )}
          {activeIndex === 2 && (
            <Button
              variant='contained'
              size='small'
              onClick={() => router.push('/agents/commission?mode=create')}
              startIcon={<AddIcon />}
              sx={{
                backgroundColor: '#28a745',
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                '&:hover': { backgroundColor: '#218838' }
              }}
            >
              Create
            </Button>
          )}
          {/* {activeIndex === 0 && (
            <>
              <Tooltip title="More Actions" arrow>
                <IconButton
                  size="small"
                  onClick={handleMenuClick}
                  sx={{
                    backgroundColor: '#f5f5f5',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    fontSize: '12px',
                    '&:hover': { backgroundColor: '#e0e0e0' }
                  }}
                >
                  <MoreVertIcon fontSize="small" />
                  <span style={{ marginLeft: '4px', fontSize: '12px' }}>more</span>
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem onClick={() => handleActionClick('suspend')}>Suspend</MenuItem>
                <MenuItem onClick={() => handleActionClick('assign_unit')}>Assign Unit</MenuItem>
              </Menu>
            </>
          )} */}
        </div>
        <TabView
          scrollable
          style={{ fontSize: '14px' }}
          activeIndex={activeIndex}
          onTabChange={e => setActiveIndex(e.index)}
        >
          <TabPanel header={<span style={{ display: 'inline-flex', alignItems: 'center' }}><i className="pi pi-check-circle" style={{ color: '#28a745', marginRight: 8 }}></i><span style={{ fontSize: "1rem" }}>Approved Agents</span></span>}>
            <AgentCountCardsContent />
            <AgentApprovedListComponent
              reloadTrigger={reloadTable ? 1 : 0}
              onSuspendAgent={handleSuspendAgent}
              onWithdrawSuspension={handleClickForWithdraw}
              filterType={filterType}
              resetFilters={resetFilters}
              activeTypeCounts={agentCounts.activeTypes}
            />
          </TabPanel>
          <TabPanel header={<span style={{ display: 'inline-flex', alignItems: 'center' }}><i className="pi pi-hourglass" style={{ color: '#fd7e14', marginRight: 8 }}></i><span style={{ fontSize: "1rem" }}>Pending Approval</span></span>}>
            <AgentPendingListComponent reloadTrigger={reloadTable ? 1 : 0} />
          </TabPanel>
          {/* <TabPanel leftIcon='pi pi-user-minus mr-2' header='Suspended Agent'>
          <FettleDataGrid
            $datasource={dataSourceTerminated$}
            config={configurationTerminated}
            columnsdefination={columnsDefinationsTerminated}
            reloadtable={reloadTable}
          />
        </TabPanel> */}
          <TabPanel header={<span style={{ display: 'inline-flex', alignItems: 'center' }}><i className="pi pi-percentage" style={{ color: '#17a2b8', marginRight: 8 }}></i><span style={{ fontSize: "1rem" }}>Commission</span></span>}>
            <CommissionListComponent />
          </TabPanel>
          <TabPanel header={<span style={{ display: 'inline-flex', alignItems: 'center' }}><i className="pi pi-gift" style={{ color: '#9333ea', marginRight: 8 }}></i><span style={{ fontSize: "1rem" }}>Incentive</span></span>}>
            <FettleDataGrid
              $datasource={dataSourceIncentive$}
              config={configurationIncentive}
              columnsdefination={columnsDefinationsIncentive}
            />
          </TabPanel>
        </TabView>
      </div>
    </>
  )
}
