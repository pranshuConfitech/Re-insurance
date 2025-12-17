'use client'

import * as React from 'react'
import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Grid from '@mui/material/Grid'
import CreateIcon from '@mui/icons-material/Create'
import DeleteIcon from '@mui/icons-material/Delete'

import AgentsDetails from './agents.details.component'
import AgentsListComponent from './agents.list.component'
import { AgentsService } from '@/services/remote-api/api/agents-services'
import AgentsViewOnlyComponent from './agents.viewonly.component'

// Interface for proper typing
interface AgentRow {
  id: string | number;
  code: string;
  name: string;
  type: string;
  contact: string;
  status?: string;
  joiningDate?: string;
}

const agentsService = new AgentsService()

const csTableData$ = agentsService.getAgents({
  page: 0,
  size: 10,
  summary: true,
  active: true
})

export default function Agents() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const mode = searchParams.get('mode')
  const selectedAgentId = searchParams.get('selectedAgent') // Get the selected agent ID

  const [rows, setRows] = React.useState<AgentRow[]>([])
  const [selectedAgentData, setSelectedAgentData] = React.useState<AgentRow[]>([]) // State for selected agent data

  const columns: any = [
    { field: 'code', headerName: 'Agent Code', width: 350 },
    { field: 'name', headerName: 'Agent Name', width: 350 },
    { field: 'type', headerName: 'Agent Type', width: 350 },
    {
      field: 'contact',
      headerName: 'Contact Number',
      width: 300
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 300,
      renderCell: (params: any) => {
        const onClickEdit = () => {
          const { id } = params.row
          router.push(`/agents/management/${id}?mode=edit`)
        }

        const onClickDelete = () => {
          // Add delete functionality here
        }

        return (
          <div>
            <CreateIcon style={{ cursor: 'pointer', color: '#626BDA' }} onClick={onClickEdit} />
            <DeleteIcon
              style={{
                cursor: 'pointer',
                color: '#626BDA',
                marginLeft: '5px'
              }}
              onClick={onClickDelete}
            />
          </div>
        )
      }
    }
  ]

  // Columns for viewOnly mode (without action column)
  const viewOnlyColumns: any = [
    { field: 'code', headerName: 'Agent Code', width: 350 },
    { field: 'name', headerName: 'Agent Name', width: 350 },
    { field: 'type', headerName: 'Agent Type', width: 350 },
    {
      field: 'contact',
      headerName: 'Contact Number',
      width: 300
    },
    {
      field: 'status', 
      headerName: 'Status',
      width: 200
    },
    {
      field: 'joiningDate',
      headerName: 'Joining Date', 
      width: 200
    }
  ]

  const useObservable = (observable: any, setter: React.Dispatch<React.SetStateAction<AgentRow[]>>) => {
    useEffect(() => {
      const subscription = observable.subscribe((result: any) => {
        const tableArr: AgentRow[] = []

        if (result.content && result.content.length > 0) {
          result.content.forEach((ele: any) => {
            tableArr.push({
              code: ele.agentBasicDetails.code,
              name: ele.agentBasicDetails.name,
              type: ele.agentBasicDetails.type,
              contact: ele.agentBasicDetails.contactNos.length > 0 ? ele.agentBasicDetails.contactNos[0].contactNo : '',
              status: ele.agentBasicDetails.status || 'Active',
              joiningDate: ele.agentBasicDetails.joiningDate || '',
              id: ele.id
            })
          })
        }

        setter(tableArr)
      })

      return () => subscription.unsubscribe()
    }, [observable, setter])
  }

  // Effect to handle selected agent data for viewOnly mode
  useEffect(() => {
    if (mode === 'viewOnly' && selectedAgentId && rows.length > 0) {
      // Filter the specific agent from rows data
      const selectedAgent = rows.filter(row => row.id === selectedAgentId)
      setSelectedAgentData(selectedAgent)
    }
  }, [mode, selectedAgentId, rows])

  useEffect(() => {
    if (!mode) {
      router.replace('/agents/management?mode=viewList')
    }
  }, [mode, router])

  // Enable data fetching
  useObservable(csTableData$, setRows);

  return (
    <div>
      {mode === 'create' && (
        <Grid
          item
          xs={12}
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            marginBottom: '20px',
            height: '2em',
            color: 'inherit',
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
            Agent Management - Create Agent
          </span>
        </Grid>
      )}

      {mode === 'viewOnly' && (
        <Grid
          item
          xs={12}
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            marginBottom: '20px',
            height: '2em',
            color: 'inherit',
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
            Agent Management - View Agent Details
          </span>
        </Grid>
      )}

      {(() => {
        switch (mode) {
          case 'viewList':
            return <AgentsListComponent rows={rows} columns={columns} />
          case 'create':
            return <AgentsDetails />
          case 'viewOnly':
            return <AgentsViewOnlyComponent 
              rows={selectedAgentData.length > 0 ? selectedAgentData : rows} 
              columns={viewOnlyColumns} 
            />
          default:
            return null
        }
      })()}
    </div>
  )
}
