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

interface ParticipantRowData {
    blockNumber: string;
    treatyCode: string;
    priorityOrder: number;
    participantName: string;
    participantType: string;
    sharePercent: number;
    participantRISI: number;
    participantPremium: number;
    participantCommission: number;
}

interface ParticipantTableProps {
    data: TreatyAllocationData[];
}

const ParticipantTable: React.FC<ParticipantTableProps> = ({ data }) => {
    const formatCurrency = (amount: number | null) => {
        if (amount === null || amount === undefined) return '-';
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    // Extract participant data from allocation data
    const extractParticipantData = (allocationData: TreatyAllocationData[]): ParticipantRowData[] => {
        const participantRows: ParticipantRowData[] = [];

        allocationData.forEach(item => {
            if (item.participants && item.participants.length > 0) {
                item.participants.forEach(participant => {
                    participantRows.push({
                        blockNumber: item.blockNumber,
                        treatyCode: item.treatyCode || '',
                        priorityOrder: item.priorityOrder || 0,
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

        return participantRows;
    };

    const participantData = extractParticipantData(data);

    const groupedData = participantData.reduce((acc, item) => {
        if (!acc[item.blockNumber]) {
            acc[item.blockNumber] = [];
        }
        acc[item.blockNumber].push(item);
        return acc;
    }, {} as Record<string, ParticipantRowData[]>);

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
                                        <TableCell sx={{ fontWeight: 600 }}>Participant Name</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Share %</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>RISI Amount</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Premium</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Commission</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {blockData.map((item, index) => (
                                        <TableRow
                                            key={index}
                                            sx={{
                                                backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8f9fa',
                                                '&:hover': {
                                                    backgroundColor: '#e3f2fd'
                                                },
                                                '& .MuiTableCell-root': {
                                                    borderBottom: '1px solid #e9ecef',
                                                    padding: '12px 16px'
                                                }
                                            }}
                                        >
                                            <TableCell>
                                                <Chip
                                                    label={item.treatyCode}
                                                    size="small"
                                                    color="primary"
                                                    variant="outlined"
                                                />
                                            </TableCell>
                                            <TableCell>{item.priorityOrder}</TableCell>
                                            <TableCell>
                                                <Typography variant="body2" sx={{
                                                    fontWeight: 600,
                                                    color: '#495057',
                                                    fontSize: '0.875rem'
                                                }}>
                                                    {item.participantName}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={item.participantType}
                                                    size="small"
                                                    color={item.participantType === 'REINSURER' ? 'success' : 'warning'}
                                                    variant="outlined"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={`${item.sharePercent}%`}
                                                    size="small"
                                                    variant="outlined"
                                                />
                                            </TableCell>
                                            <TableCell>{formatCurrency(item.participantRISI)}</TableCell>
                                            <TableCell>{formatCurrency(item.participantPremium)}</TableCell>
                                            <TableCell>{formatCurrency(item.participantCommission)}</TableCell>
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

export default ParticipantTable;
