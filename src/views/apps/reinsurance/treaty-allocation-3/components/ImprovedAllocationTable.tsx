import React, { useState } from 'react';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Box,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Collapse
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface Participant {
    participantType: string;
    participantName: string;
    sharePercent: number;
    participantRISI: number;
    participantPremium: number;
    participantCommission: number;
    reinsurers: Participant[] | null;
}

interface TreatyAllocationData {
    blockSummaryRow: boolean;
    participantRow: boolean;
    blockNumber: string;
    treatyCode: string | null;
    priorityOrder: number | null;
    balanceSI: number;
    controlCessionSI: number;
    controlValue: number | null;
    earlierTreatySI: number | null;
    incrementalTreatySI: number | null;
    treatyCessionSI: number | null;
    treatyCessionPercent: number | null;
    treatyRIPremium: number | null;
    treatyCommision: number | null;
    participants: Participant[] | null;
}

interface ImprovedAllocationTableProps {
    data: TreatyAllocationData[];
}

const ImprovedAllocationTable: React.FC<ImprovedAllocationTableProps> = ({ data }) => {
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

    const formatCurrency = (amount: number | null) => {
        if (amount === null || amount === undefined) return '-';
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const formatPercentage = (percent: number | null) => {
        if (percent === null || percent === undefined) return '-';
        return `${percent}%`;
    };

    const toggleRowExpansion = (rowId: string) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(rowId)) {
            newExpanded.delete(rowId);
        } else {
            newExpanded.add(rowId);
        }
        setExpandedRows(newExpanded);
    };

    const groupedData = data.reduce((acc, item) => {
        if (!acc[item.blockNumber]) {
            acc[item.blockNumber] = [];
        }
        acc[item.blockNumber].push(item);
        return acc;
    }, {} as Record<string, TreatyAllocationData[]>);

    return (
        <>
            {Object.entries(groupedData).map(([blockNumber, blockData]) => (
                <Accordion key={blockNumber} defaultExpanded sx={{ mb: 2 }}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        sx={{
                            backgroundColor: '#f5f5f5',
                            '&:hover': {
                                backgroundColor: '#e91e63',
                                color: 'white',
                                '& .MuiAccordionSummary-expandIconWrapper': {
                                    color: 'white'
                                }
                            }
                        }}
                    >
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {blockNumber}
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: 0 }}>
                        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 0 }}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: '#fafafa' }}>
                                        <TableCell sx={{ fontWeight: 600, width: 50 }}></TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Treaty Code</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Priority</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Balance SI</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Control Cession SI</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Treaty Cession %</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Treaty Premium</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Participants</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {blockData.map((item, index) => {
                                        const rowId = `${blockNumber}-${index}`;
                                        const isExpanded = expandedRows.has(rowId);
                                        const hasParticipants = item.participants && item.participants.length > 0;

                                        return (
                                            <React.Fragment key={index}>
                                                {/* Main Allocation Row */}
                                                <TableRow
                                                    sx={{
                                                        backgroundColor: item.blockSummaryRow ?
                                                            'linear-gradient(135deg, #e8f4fd 0%, #e1f5fe 100%)' :
                                                            index % 2 === 0 ? '#ffffff' : '#f8f9fa',
                                                        fontWeight: item.blockSummaryRow ? 600 : 'normal',
                                                        '&:hover': {
                                                            backgroundColor: item.blockSummaryRow ?
                                                                'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)' :
                                                                '#e3f2fd'
                                                        },
                                                        '& .MuiTableCell-root': {
                                                            borderBottom: '1px solid #e9ecef',
                                                            padding: '12px 16px'
                                                        }
                                                    }}
                                                >
                                                    <TableCell>
                                                        {/* Empty cell - no arrow needed */}
                                                    </TableCell>
                                                    <TableCell>
                                                        {item.treatyCode ? (
                                                            <Chip
                                                                label={item.treatyCode}
                                                                size="small"
                                                                color="primary"
                                                                variant="outlined"
                                                            />
                                                        ) : (
                                                            item.blockSummaryRow ? (
                                                                <Chip
                                                                    label="Treaty Sum"
                                                                    size="small"
                                                                    color="secondary"
                                                                />
                                                            ) : '-'
                                                        )}
                                                    </TableCell>
                                                    <TableCell>{item.priorityOrder || '-'}</TableCell>
                                                    <TableCell>{formatCurrency(item.balanceSI)}</TableCell>
                                                    <TableCell>{formatCurrency(item.controlCessionSI)}</TableCell>
                                                    <TableCell>{formatPercentage(item.treatyCessionPercent)}</TableCell>
                                                    <TableCell>{formatCurrency(item.treatyRIPremium)}</TableCell>
                                                    <TableCell>
                                                        {hasParticipants ? (
                                                            (() => {
                                                                const totalParticipants = item.participants!.length;
                                                                const totalReinsurers = item.participants!.reduce((acc, p) =>
                                                                    acc + (p.reinsurers ? p.reinsurers.length : 0), 0);
                                                                const totalCount = totalParticipants + totalReinsurers;

                                                                return (
                                                                    <Chip
                                                                        label={`${totalCount} Participant${totalCount > 1 ? 's' : ''}`}
                                                                        size="small"
                                                                        variant="outlined"
                                                                        onClick={() => toggleRowExpansion(rowId)}
                                                                        sx={{
                                                                            color: '#607d8b',
                                                                            borderColor: '#607d8b',
                                                                            cursor: 'pointer',
                                                                            '&:hover': {
                                                                                backgroundColor: '#e91e63',
                                                                                color: 'black',
                                                                                borderColor: '#e91e63'
                                                                            },
                                                                            transition: 'all 0.2s ease-in-out'
                                                                        }}
                                                                    />
                                                                );
                                                            })()
                                                        ) : '-'}
                                                    </TableCell>
                                                </TableRow>

                                                {/* Participant Details Row (Collapsible) */}
                                                {hasParticipants && (
                                                    <TableRow>
                                                        <TableCell
                                                            colSpan={8}
                                                            sx={{
                                                                padding: 0,
                                                                borderBottom: isExpanded ? '1px solid #e9ecef' : 'none'
                                                            }}
                                                        >
                                                            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                                                                <Box sx={{ p: 2, backgroundColor: '#f8f9fa' }}>
                                                                    <Typography variant="subtitle2" sx={{
                                                                        mb: 2,
                                                                        fontWeight: 600,
                                                                        color: '#607d8b'
                                                                    }}>
                                                                        Participants for {item.treatyCode}
                                                                    </Typography>
                                                                    <Table size="small">
                                                                        <TableHead>
                                                                            <TableRow sx={{ backgroundColor: '#e8eaf6' }}>
                                                                                <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Participant Name</TableCell>
                                                                                <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Type</TableCell>
                                                                                <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Share %</TableCell>
                                                                                <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>RISI Amount</TableCell>
                                                                                <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Premium</TableCell>
                                                                                <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Commission</TableCell>
                                                                            </TableRow>
                                                                        </TableHead>
                                                                        <TableBody>
                                                                            {item.participants!.map((participant, pIndex) => (
                                                                                <React.Fragment key={pIndex}>
                                                                                    {/* Main Participant Row */}
                                                                                    <TableRow
                                                                                        sx={{
                                                                                            backgroundColor: pIndex % 2 === 0 ? '#ffffff' : '#f1f3f4',
                                                                                            '&:hover': {
                                                                                                backgroundColor: '#eceff1'
                                                                                            },
                                                                                            '& .MuiTableCell-root': {
                                                                                                borderBottom: '1px solid #e0e0e0',
                                                                                                padding: '8px 12px',
                                                                                                fontSize: '0.875rem'
                                                                                            }
                                                                                        }}
                                                                                    >
                                                                                        <TableCell>
                                                                                            <Typography variant="body2" sx={{
                                                                                                fontWeight: 600,
                                                                                                color: '#495057',
                                                                                                fontSize: '0.875rem'
                                                                                            }}>
                                                                                                {participant.participantName}
                                                                                            </Typography>
                                                                                        </TableCell>
                                                                                        <TableCell>
                                                                                            <Chip
                                                                                                label={participant.participantType}
                                                                                                size="small"
                                                                                                color={participant.participantType === 'REINSURER' ? 'success' : 'warning'}
                                                                                                variant="outlined"
                                                                                            />
                                                                                        </TableCell>
                                                                                        <TableCell>
                                                                                            <Chip
                                                                                                label={`${participant.sharePercent}%`}
                                                                                                size="small"
                                                                                                variant="outlined"
                                                                                                sx={{
                                                                                                    color: '#607d8b',
                                                                                                    borderColor: '#607d8b'
                                                                                                }}
                                                                                            />
                                                                                        </TableCell>
                                                                                        <TableCell>{formatCurrency(participant.participantRISI)}</TableCell>
                                                                                        <TableCell>{formatCurrency(participant.participantPremium)}</TableCell>
                                                                                        <TableCell>{formatCurrency(participant.participantCommission)}</TableCell>
                                                                                    </TableRow>

                                                                                    {/* Nested Reinsurers for Brokers */}
                                                                                    {participant.participantType === 'BROKER' &&
                                                                                        participant.reinsurers &&
                                                                                        participant.reinsurers.length > 0 &&
                                                                                        participant.reinsurers.map((reinsurer, rIndex) => (
                                                                                            <TableRow
                                                                                                key={`${pIndex}-${rIndex}`}
                                                                                                sx={{
                                                                                                    backgroundColor: '#e8eaf6',
                                                                                                    '&:hover': {
                                                                                                        backgroundColor: '#c5cae9'
                                                                                                    },
                                                                                                    '& .MuiTableCell-root': {
                                                                                                        borderBottom: '1px solid #d1d5db',
                                                                                                        padding: '6px 12px',
                                                                                                        fontSize: '0.8125rem'
                                                                                                    }
                                                                                                }}
                                                                                            >
                                                                                                <TableCell sx={{ paddingLeft: '32px' }}>
                                                                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                                                        <Typography variant="body2" sx={{
                                                                                                            fontWeight: 500,
                                                                                                            color: '#6b7280',
                                                                                                            fontSize: '0.8125rem',
                                                                                                            fontStyle: 'italic'
                                                                                                        }}>
                                                                                                            ↳ {reinsurer.participantName}
                                                                                                        </Typography>
                                                                                                    </Box>
                                                                                                </TableCell>
                                                                                                <TableCell>
                                                                                                    <Chip
                                                                                                        label="REINSURER"
                                                                                                        size="small"
                                                                                                        color="success"
                                                                                                        variant="outlined"
                                                                                                        sx={{ fontSize: '0.75rem', height: '20px' }}
                                                                                                    />
                                                                                                </TableCell>
                                                                                                <TableCell>
                                                                                                    <Chip
                                                                                                        label={`${reinsurer.sharePercent}%`}
                                                                                                        size="small"
                                                                                                        variant="outlined"
                                                                                                        sx={{
                                                                                                            color: '#6b7280',
                                                                                                            borderColor: '#6b7280',
                                                                                                            fontSize: '0.75rem',
                                                                                                            height: '20px'
                                                                                                        }}
                                                                                                    />
                                                                                                </TableCell>
                                                                                                <TableCell sx={{ color: '#6b7280' }}>
                                                                                                    {formatCurrency(reinsurer.participantRISI)}
                                                                                                </TableCell>
                                                                                                <TableCell sx={{ color: '#6b7280' }}>
                                                                                                    {formatCurrency(reinsurer.participantPremium)}
                                                                                                </TableCell>
                                                                                                <TableCell sx={{ color: '#6b7280' }}>
                                                                                                    {formatCurrency(reinsurer.participantCommission)}
                                                                                                </TableCell>
                                                                                            </TableRow>
                                                                                        ))}
                                                                                </React.Fragment>
                                                                            ))}
                                                                        </TableBody>
                                                                    </Table>
                                                                </Box>
                                                            </Collapse>
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </React.Fragment>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </AccordionDetails>
                </Accordion>
            ))}
        </>
    );
};

export default ImprovedAllocationTable;
