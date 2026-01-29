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

interface CombinedRowData {
    type: 'allocation' | 'participant';
    blockNumber: string;
    treatyCode: string | null;
    priorityOrder: number | null;

    // Allocation specific fields
    balanceSI?: number;
    controlCessionSI?: number;
    treatyCessionPercent?: number | null;
    treatyRIPremium?: number | null;
    blockSummaryRow?: boolean;

    // Participant specific fields
    participantName?: string;
    participantType?: string;
    sharePercent?: number;
    participantRISI?: number;
    participantPremium?: number;
    participantCommission?: number;
}

interface CombinedAllocationTableProps {
    data: TreatyAllocationData[];
}

const CombinedAllocationTable: React.FC<CombinedAllocationTableProps> = ({ data }) => {
    const formatCurrency = (amount: number | null | undefined) => {
        if (amount === null || amount === undefined) return '-';
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const formatPercentage = (percent: number | null | undefined) => {
        if (percent === null || percent === undefined) return '-';
        return `${percent}%`;
    };

    // Create combined data structure
    const createCombinedData = (allocationData: TreatyAllocationData[]): CombinedRowData[] => {
        const combinedRows: CombinedRowData[] = [];

        allocationData.forEach(item => {
            // Add allocation row
            combinedRows.push({
                type: 'allocation',
                blockNumber: item.blockNumber,
                treatyCode: item.treatyCode,
                priorityOrder: item.priorityOrder,
                balanceSI: item.balanceSI,
                controlCessionSI: item.controlCessionSI,
                treatyCessionPercent: item.treatyCessionPercent,
                treatyRIPremium: item.treatyRIPremium,
                blockSummaryRow: item.blockSummaryRow
            });

            // Add participant rows for this allocation
            if (item.participants && item.participants.length > 0) {
                item.participants.forEach(participant => {
                    combinedRows.push({
                        type: 'participant',
                        blockNumber: item.blockNumber,
                        treatyCode: item.treatyCode,
                        priorityOrder: item.priorityOrder,
                        participantName: participant.participantName,
                        participantType: participant.participantType,
                        sharePercent: participant.sharePercent,
                        participantRISI: participant.participantRISI,
                        participantPremium: participant.participantPremium,
                        participantCommission: participant.participantCommission
                    });
                });
            }
        });

        return combinedRows;
    };

    const combinedData = createCombinedData(data);

    // Group by block number
    const groupedData = combinedData.reduce((acc, item) => {
        if (!acc[item.blockNumber]) {
            acc[item.blockNumber] = [];
        }
        acc[item.blockNumber].push(item);
        return acc;
    }, {} as Record<string, CombinedRowData[]>);

    return (
        <>
            {Object.entries(groupedData).map(([blockNumber, blockData]) => (
                <Accordion key={blockNumber} defaultExpanded sx={{ mb: 2 }}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        sx={{
                            backgroundColor: '#f5f5f5',
                            '&:hover': {
                                backgroundColor: '#607d8b',
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
                                        <TableCell sx={{ fontWeight: 600, minWidth: 80 }}>Type</TableCell>
                                        <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>Treaty Code</TableCell>
                                        <TableCell sx={{ fontWeight: 600, minWidth: 80 }}>Priority</TableCell>
                                        <TableCell sx={{ fontWeight: 600, minWidth: 150 }}>Participant Name</TableCell>
                                        <TableCell sx={{ fontWeight: 600, minWidth: 100 }}>Participant Type</TableCell>
                                        <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>Balance SI</TableCell>
                                        <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>Control Cession SI</TableCell>
                                        <TableCell sx={{ fontWeight: 600, minWidth: 100 }}>Share %</TableCell>
                                        <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>RISI Amount</TableCell>
                                        <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>Premium</TableCell>
                                        <TableCell sx={{ fontWeight: 600, minWidth: 120 }}>Commission</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {blockData.map((item, index) => (
                                        <TableRow
                                            key={index}
                                            sx={{
                                                backgroundColor: item.type === 'allocation'
                                                    ? (item.blockSummaryRow
                                                        ? 'linear-gradient(135deg, #e8f4fd 0%, #e1f5fe 100%)'
                                                        : '#f8f9fa')
                                                    : (index % 2 === 0 ? '#f1f3f4' : '#e8eaf6'),
                                                fontWeight: item.blockSummaryRow ? 600 : 'normal',
                                                '&:hover': {
                                                    backgroundColor: item.type === 'allocation'
                                                        ? '#e3f2fd'
                                                        : '#eceff1'
                                                },
                                                '& .MuiTableCell-root': {
                                                    borderBottom: '1px solid #e9ecef',
                                                    padding: '8px 12px',
                                                    fontSize: '0.875rem'
                                                }
                                            }}
                                        >
                                            <TableCell>
                                                <Chip
                                                    label={item.type === 'allocation' ? 'ALLOC' : 'PART'}
                                                    size="small"
                                                    variant="filled"
                                                    sx={{
                                                        minWidth: 60,
                                                        fontSize: '0.75rem',
                                                        fontWeight: 600,
                                                        backgroundColor: item.type === 'allocation' ? '#607d8b' : '#78909c',
                                                        color: 'white',
                                                        '&:hover': {
                                                            backgroundColor: item.type === 'allocation' ? '#546e7a' : '#6a7b84'
                                                        }
                                                    }}
                                                />
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
                                                            label="SUMMARY"
                                                            size="small"
                                                            color="secondary"
                                                        />
                                                    ) : '-'
                                                )}
                                            </TableCell>
                                            <TableCell>{item.priorityOrder || '-'}</TableCell>
                                            <TableCell>
                                                {item.participantName ? (
                                                    <Typography variant="body2" sx={{
                                                        fontWeight: 600,
                                                        color: '#495057',
                                                        fontSize: '0.875rem'
                                                    }}>
                                                        {item.participantName}
                                                    </Typography>
                                                ) : '-'}
                                            </TableCell>
                                            <TableCell>
                                                {item.participantType ? (
                                                    <Chip
                                                        label={item.participantType}
                                                        size="small"
                                                        color={item.participantType === 'REINSURER' ? 'success' : 'warning'}
                                                        variant="outlined"
                                                    />
                                                ) : '-'}
                                            </TableCell>
                                            <TableCell>{formatCurrency(item.balanceSI)}</TableCell>
                                            <TableCell>{formatCurrency(item.controlCessionSI)}</TableCell>
                                            <TableCell>
                                                {item.type === 'allocation'
                                                    ? formatPercentage(item.treatyCessionPercent)
                                                    : formatPercentage(item.sharePercent)
                                                }
                                            </TableCell>
                                            <TableCell>
                                                {item.type === 'allocation'
                                                    ? '-'
                                                    : formatCurrency(item.participantRISI)
                                                }
                                            </TableCell>
                                            <TableCell>
                                                {item.type === 'allocation'
                                                    ? formatCurrency(item.treatyRIPremium)
                                                    : formatCurrency(item.participantPremium)
                                                }
                                            </TableCell>
                                            <TableCell>
                                                {item.type === 'allocation'
                                                    ? '-'
                                                    : formatCurrency(item.participantCommission)
                                                }
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

export default CombinedAllocationTable;
