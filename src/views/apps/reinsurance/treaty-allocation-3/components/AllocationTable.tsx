import React from 'react';
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
    AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface Participant {
    participantType: string;
    participantName: string;
    sharePercent: number;
    participantRISI: number;
    participantPremium: number;
    participantCommission: number;
    reinsurers: any;
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

interface AllocationTableProps {
    data: TreatyAllocationData[];
}

const AllocationTable: React.FC<AllocationTableProps> = ({ data }) => {
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
                                    {blockData.map((item, index) => (
                                        <TableRow
                                            key={index}
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
                                                            label="SUMMARY"
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
                                                {item.participants && item.participants.length > 0 ? (
                                                    <Box>
                                                        {item.participants.map((participant, pIndex) => (
                                                            <Box key={pIndex} sx={{ mb: 1 }}>
                                                                <Typography variant="body2" sx={{
                                                                    fontWeight: 600,
                                                                    color: '#495057',
                                                                    fontSize: '0.875rem',
                                                                    mb: 0.5
                                                                }}>
                                                                    {participant.participantName}
                                                                </Typography>
                                                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
                                                                    <Chip
                                                                        label={participant.participantType}
                                                                        size="small"
                                                                        color={participant.participantType === 'REINSURER' ? 'success' : 'warning'}
                                                                        variant="outlined"
                                                                    />
                                                                    <Chip
                                                                        label={`${participant.sharePercent}%`}
                                                                        size="small"
                                                                        variant="outlined"
                                                                    />
                                                                    <Chip
                                                                        label={formatCurrency(participant.participantRISI)}
                                                                        size="small"
                                                                        variant="outlined"
                                                                    />
                                                                </Box>
                                                            </Box>
                                                        ))}
                                                    </Box>
                                                ) : '-'}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </AccordionDetails>
                </Accordion>
            ))}
        </>
    );
};

export default AllocationTable;
