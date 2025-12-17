import React from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Button
} from '@mui/material'

interface AgentCommissionTableProps {
    agentsList: any[]
    totalPremium: number
    onCommissionChange: (e: any, index: number) => void
    onOpenAgentModal: () => void
    isReadOnly?: boolean
    classes: any
}

export const AgentCommissionTable: React.FC<AgentCommissionTableProps> = ({
    agentsList,
    totalPremium,
    onCommissionChange,
    onOpenAgentModal,
    isReadOnly = false,
    classes
}) => {
    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                {localStorage.getItem('userType') !== 'AGENT' && (
                    <Button onClick={onOpenAgentModal}>
                        Search Agent
                    </Button>
                )}
            </div>

            <Table size='small'>
                <TableHead>
                    <TableRow>
                        <TableCell>Agent name</TableCell>
                        <TableCell>Commission value</TableCell>
                        <TableCell align='right'>Final value</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {agentsList.map((agent, index) => (
                        <TableRow key={agent.agentId}>
                            <TableCell>{agent.name}</TableCell>
                            <TableCell>
                                <TextField
                                    size='small'
                                    type='number'
                                    name='commission'
                                    value={agent.commission}
                                    disabled={isReadOnly}
                                    onChange={(e) => onCommissionChange(e, index)}
                                    label='Commission value (%)'
                                />
                            </TableCell>
                            <TableCell align='right'>
                                {agent.finalValue
                                    ? Number(agent.finalValue).toFixed(2)
                                    : ((Number(agent.commission) * totalPremium) / 100).toFixed(2)
                                }
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    )
}
