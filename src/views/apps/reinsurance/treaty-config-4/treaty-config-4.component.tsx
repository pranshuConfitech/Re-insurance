'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Collapse,
    IconButton,
    CircularProgress,
    Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { ReinsuranceService } from '@/services/remote-api/api/reinsurance-services/reinsurance.service';

const reinsuranceService = new ReinsuranceService();

interface PortfolioTreatyData {
    id: string;
    portfolioName: string;
    insurerId: string;
    startDate: string;
    endDate: string;
    currency: string;
    operatingUnits: { id: number; portfolioId: string; ouCode: string }[];
}

interface TreatyBlockDetail {
    blockType: string;
    sortOrder: number;
    treaties: any[];
}

const TreatyConfig4Component = () => {
    const router = useRouter();
    const [data, setData] = useState<PortfolioTreatyData[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedRow, setExpandedRow] = useState<string | null>(null);
    const [accordionData, setAccordionData] = useState<{ [key: string]: any }>({});
    const [accordionLoading, setAccordionLoading] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        setLoading(true);
        const pageRequest = {
            page: 0,
            size: 10,
            summary: true,
            active: true
        };

        reinsuranceService.getAllPortfolioTreaties(pageRequest).subscribe({
            next: (response) => {
                const content = response?.data?.content || [];
                setData(content);
                setLoading(false);
            },
            error: (error) => {
                console.error('Error fetching portfolio treaties:', error);
                setLoading(false);
            }
        });
    };

    const handleRowClick = (portfolioId: string) => {
        if (expandedRow === portfolioId) {
            setExpandedRow(null);
            return;
        }

        setExpandedRow(portfolioId);

        // Check if data already loaded
        if (accordionData[portfolioId]) {
            return;
        }

        // Fetch accordion data
        setAccordionLoading(portfolioId);
        reinsuranceService.getPortfolioTreatyById(portfolioId).subscribe({
            next: (response) => {
                setAccordionData(prev => ({
                    ...prev,
                    [portfolioId]: response?.data || {}
                }));
                setAccordionLoading(null);
            },
            error: (error) => {
                console.error('Error fetching treaty details:', error);
                setAccordionLoading(null);
            }
        });
    };

    const handleCreate = () => {
        router.push('/reinsurance/treaty-config-4/create');
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '-';
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-GB');
        } catch {
            return dateStr;
        }
    };

    const getStatusColor = (status: string) => {
        const s = status?.toUpperCase();
        if (s === 'ACTIVE') return { bg: '#d4edda', color: '#155724' };
        if (s === 'EXPIRED') return { bg: '#f8d7da', color: '#721c24' };
        return { bg: '#e2e3e5', color: '#383d41' };
    };

    const renderAccordionContent = (portfolioId: string) => {
        if (accordionLoading === portfolioId) {
            return (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress size={30} />
                </Box>
            );
        }

        const detail = accordionData[portfolioId];
        if (!detail) return null;

        const treatyBlocks = detail['treaty-blocks'] || [];

        if (treatyBlocks.length === 0) {
            return (
                <Box sx={{ p: 3, textAlign: 'center', color: '#6c757d' }}>
                    No treaty blocks available
                </Box>
            );
        }

        const labelStyle = { fontSize: '11px', color: '#6c757d', fontWeight: 600, textTransform: 'uppercase' as const };
        const valueStyle = { fontSize: '13px', color: '#212529', fontWeight: 500 };

        return (
            <Box sx={{ p: 3, backgroundColor: '#f8f9fa' }}>
                {treatyBlocks.map((block: any, blockIndex: number) => (
                    <Card key={blockIndex} sx={{ mb: 3, border: '1px solid #dee2e6' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                <Chip
                                    label={block.blockType}
                                    size="small"
                                    sx={{
                                        backgroundColor: block.blockType === 'PROPORTIONAL' ? '#e3f2fd' : '#fff3e0',
                                        color: block.blockType === 'PROPORTIONAL' ? '#1565c0' : '#e65100',
                                        fontWeight: 600
                                    }}
                                />
                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                    Block {block.sortOrder}
                                </Typography>
                            </Box>

                            {block.treaties && block.treaties.map((treaty: any, treatyIndex: number) => (
                                <Box key={treatyIndex} sx={{ mb: 3, p: 2, backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
                                    {/* Treaty Basic Info */}
                                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: '#1976d2' }}>
                                        Treaty: {treaty.treatyName || '-'}
                                    </Typography>

                                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, mb: 3 }}>
                                        <Box>
                                            <Typography sx={labelStyle}>Treaty Code</Typography>
                                            <Typography sx={valueStyle}>{treaty.treatyCode || '-'}</Typography>
                                        </Box>
                                        <Box>
                                            <Typography sx={labelStyle}>Treaty Type</Typography>
                                            <Typography sx={valueStyle}>{treaty.treatyType || '-'}</Typography>
                                        </Box>
                                        <Box>
                                            <Typography sx={labelStyle}>Priority</Typography>
                                            <Typography sx={valueStyle}>{treaty.priority || '-'}</Typography>
                                        </Box>
                                        <Box>
                                            <Typography sx={labelStyle}>Status</Typography>
                                            <Chip label={treaty.status || 'N/A'} size="small" sx={{ ...getStatusColor(treaty.status), fontSize: '11px', height: '22px' }} />
                                        </Box>
                                        <Box>
                                            <Typography sx={labelStyle}>Ref Number</Typography>
                                            <Typography sx={valueStyle}>{treaty.refNumber || '-'}</Typography>
                                        </Box>
                                        <Box>
                                            <Typography sx={labelStyle}>Treaty Category</Typography>
                                            <Typography sx={valueStyle}>{treaty.treatyCategory || '-'}</Typography>
                                        </Box>
                                        <Box>
                                            <Typography sx={labelStyle}>Former Treaty Code</Typography>
                                            <Typography sx={valueStyle}>{treaty.formerTreatyCode || '-'}</Typography>
                                        </Box>
                                        <Box>
                                            <Typography sx={labelStyle}>Graded Retention</Typography>
                                            <Typography sx={valueStyle}>{treaty.gradedRetention ? 'Yes' : 'No'}</Typography>
                                        </Box>
                                        <Box>
                                            <Typography sx={labelStyle}>XOL Attachment Type</Typography>
                                            <Typography sx={valueStyle}>{treaty.xolAttachmentType || '-'}</Typography>
                                        </Box>
                                        <Box>
                                            <Typography sx={labelStyle}>Processing Method</Typography>
                                            <Typography sx={valueStyle}>{treaty.processingMethod || '-'}</Typography>
                                        </Box>
                                    </Box>

                                    {/* Proportional Treaty Attributes */}
                                    {treaty.propTreatyAttribute && (
                                        <Box sx={{ mb: 3 }}>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#388e3c', borderBottom: '1px solid #e0e0e0', pb: 1 }}>
                                                Proportional Treaty Attributes
                                            </Typography>
                                            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
                                                <Box>
                                                    <Typography sx={labelStyle}>Installment Type</Typography>
                                                    <Typography sx={valueStyle}>{treaty.propTreatyAttribute.installmentType || '-'}</Typography>
                                                </Box>
                                                <Box>
                                                    <Typography sx={labelStyle}>Prem Reserve Retained Rate</Typography>
                                                    <Typography sx={valueStyle}>{treaty.propTreatyAttribute.premReserveRetainedRate ?? '-'}%</Typography>
                                                </Box>
                                                <Box>
                                                    <Typography sx={labelStyle}>Prem Reserve Interest Rate</Typography>
                                                    <Typography sx={valueStyle}>{treaty.propTreatyAttribute.premReserveInterestRate ?? '-'}%</Typography>
                                                </Box>
                                                <Box>
                                                    <Typography sx={labelStyle}>Portfolio Prem Entry Rate</Typography>
                                                    <Typography sx={valueStyle}>{treaty.propTreatyAttribute.portfolioPremEntryRate ?? '-'}%</Typography>
                                                </Box>
                                                <Box>
                                                    <Typography sx={labelStyle}>Portfolio Claim Entry Rate</Typography>
                                                    <Typography sx={valueStyle}>{treaty.propTreatyAttribute.portfolioClaimEntryRate ?? '-'}%</Typography>
                                                </Box>
                                                <Box>
                                                    <Typography sx={labelStyle}>Portfolio Claim Withd Rate</Typography>
                                                    <Typography sx={valueStyle}>{treaty.propTreatyAttribute.portfolioClaimWithdRate ?? '-'}%</Typography>
                                                </Box>
                                                <Box>
                                                    <Typography sx={labelStyle}>Portfolio Prem Withd Rate</Typography>
                                                    <Typography sx={valueStyle}>{treaty.propTreatyAttribute.portfolioPremWithdRate ?? '-'}%</Typography>
                                                </Box>
                                                <Box>
                                                    <Typography sx={labelStyle}>Mgmt Expenses %</Typography>
                                                    <Typography sx={valueStyle}>{treaty.propTreatyAttribute.mgmtExpensesPercent ?? '-'}%</Typography>
                                                </Box>
                                                <Box>
                                                    <Typography sx={labelStyle}>Taxes %</Typography>
                                                    <Typography sx={valueStyle}>{treaty.propTreatyAttribute.taxesPercent ?? '-'}%</Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    )}

                                    {/* Non-Proportional Treaty Attributes */}
                                    {treaty.nonpropTreatyAttribute && (
                                        <Box sx={{ mb: 3 }}>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#f57c00', borderBottom: '1px solid #e0e0e0', pb: 1 }}>
                                                Non-Proportional Treaty Attributes
                                            </Typography>
                                            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
                                                <Box>
                                                    <Typography sx={labelStyle}>XOL Type</Typography>
                                                    <Typography sx={valueStyle}>{treaty.nonpropTreatyAttribute.xolType || '-'}</Typography>
                                                </Box>
                                                <Box>
                                                    <Typography sx={labelStyle}>Annual Aggregate Limit</Typography>
                                                    <Typography sx={valueStyle}>{treaty.nonpropTreatyAttribute.annualAggregateLimit?.toLocaleString() ?? '-'}</Typography>
                                                </Box>
                                                <Box>
                                                    <Typography sx={labelStyle}>Annual Agg Deductible</Typography>
                                                    <Typography sx={valueStyle}>{treaty.nonpropTreatyAttribute.annualAggDeductible?.toLocaleString() ?? '-'}</Typography>
                                                </Box>
                                                <Box>
                                                    <Typography sx={labelStyle}>Total Reinstated SI</Typography>
                                                    <Typography sx={valueStyle}>{treaty.nonpropTreatyAttribute.totalReinstatedSI?.toLocaleString() ?? '-'}</Typography>
                                                </Box>
                                                <Box>
                                                    <Typography sx={labelStyle}>Capacity</Typography>
                                                    <Typography sx={valueStyle}>{treaty.nonpropTreatyAttribute.capacity?.toLocaleString() ?? '-'}</Typography>
                                                </Box>
                                                <Box>
                                                    <Typography sx={labelStyle}>Flat Rate XOL Prem</Typography>
                                                    <Typography sx={valueStyle}>{treaty.nonpropTreatyAttribute.flatRateXOLPrem ?? '-'}</Typography>
                                                </Box>
                                                <Box>
                                                    <Typography sx={labelStyle}>Min Deposit XOL Prem</Typography>
                                                    <Typography sx={valueStyle}>{treaty.nonpropTreatyAttribute.minDepositXOLPrem ?? '-'}</Typography>
                                                </Box>
                                                <Box>
                                                    <Typography sx={labelStyle}>No. Reinstatements</Typography>
                                                    <Typography sx={valueStyle}>{treaty.nonpropTreatyAttribute.noReinstatements ?? '-'}</Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    )}

                                    {/* Proportional Risk Details */}
                                    {treaty.propRiskDetails && treaty.propRiskDetails.length > 0 && (
                                        <Box sx={{ mb: 3 }}>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#7b1fa2', borderBottom: '1px solid #e0e0e0', pb: 1 }}>
                                                Risk Details ({treaty.propRiskDetails.length})
                                            </Typography>
                                            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
                                                <Table size="small">
                                                    <TableHead>
                                                        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                                            <TableCell sx={{ fontWeight: 600, fontSize: '11px' }}>Product LOB</TableCell>
                                                            <TableCell sx={{ fontWeight: 600, fontSize: '11px' }}>Product Code</TableCell>
                                                            <TableCell sx={{ fontWeight: 600, fontSize: '11px' }}>Risk Category</TableCell>
                                                            <TableCell sx={{ fontWeight: 600, fontSize: '11px' }}>Risk Grade</TableCell>
                                                            <TableCell sx={{ fontWeight: 600, fontSize: '11px' }}>Cession Rate</TableCell>
                                                            <TableCell sx={{ fontWeight: 600, fontSize: '11px' }}>Retention Amt</TableCell>
                                                            <TableCell sx={{ fontWeight: 600, fontSize: '11px' }}>Surplus Capacity</TableCell>
                                                            <TableCell sx={{ fontWeight: 600, fontSize: '11px' }}>Event Limit</TableCell>
                                                            <TableCell sx={{ fontWeight: 600, fontSize: '11px' }}>Alert Days</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {treaty.propRiskDetails.map((risk: any, riskIndex: number) => (
                                                            <TableRow key={riskIndex}>
                                                                <TableCell sx={{ fontSize: '12px' }}>{risk.productLob || '-'}</TableCell>
                                                                <TableCell sx={{ fontSize: '12px' }}>{risk.productCode || '-'}</TableCell>
                                                                <TableCell sx={{ fontSize: '12px' }}>{risk.riskCategory || '-'}</TableCell>
                                                                <TableCell sx={{ fontSize: '12px' }}>{risk.riskGrade || '-'}</TableCell>
                                                                <TableCell sx={{ fontSize: '12px' }}>{risk.cessionRate ?? '-'}%</TableCell>
                                                                <TableCell sx={{ fontSize: '12px' }}>{risk.retentionAmount?.toLocaleString() ?? '-'}</TableCell>
                                                                <TableCell sx={{ fontSize: '12px' }}>{risk.surplusCapacity?.toLocaleString() ?? '-'}</TableCell>
                                                                <TableCell sx={{ fontSize: '12px' }}>{risk.eventLimit?.toLocaleString() ?? '-'}</TableCell>
                                                                <TableCell sx={{ fontSize: '12px' }}>{risk.alertDays ?? '-'}</TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </Box>
                                    )}

                                    {/* Non-Proportional Layers */}
                                    {treaty.nonpropLayers && treaty.nonpropLayers.length > 0 && (
                                        <Box sx={{ mb: 3 }}>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#f57c00', borderBottom: '1px solid #e0e0e0', pb: 1 }}>
                                                Layers ({treaty.nonpropLayers.length})
                                            </Typography>
                                            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
                                                <Table size="small">
                                                    <TableHead>
                                                        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                                            <TableCell sx={{ fontWeight: 600, fontSize: '11px' }}>Layer #</TableCell>
                                                            <TableCell sx={{ fontWeight: 600, fontSize: '11px' }}>Product LOB</TableCell>
                                                            <TableCell sx={{ fontWeight: 600, fontSize: '11px' }}>Product Code</TableCell>
                                                            <TableCell sx={{ fontWeight: 600, fontSize: '11px' }}>Loss Limit</TableCell>
                                                            <TableCell sx={{ fontWeight: 600, fontSize: '11px' }}>Deductibility</TableCell>
                                                            <TableCell sx={{ fontWeight: 600, fontSize: '11px' }}>Annual Agg Limit</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {treaty.nonpropLayers.map((layer: any, layerIndex: number) => (
                                                            <TableRow key={layerIndex}>
                                                                <TableCell sx={{ fontSize: '12px' }}>{layer.layerNumber || layerIndex + 1}</TableCell>
                                                                <TableCell sx={{ fontSize: '12px' }}>{layer.productLob || '-'}</TableCell>
                                                                <TableCell sx={{ fontSize: '12px' }}>{layer.productCode || '-'}</TableCell>
                                                                <TableCell sx={{ fontSize: '12px' }}>{layer.lossLimit?.toLocaleString() ?? '-'}</TableCell>
                                                                <TableCell sx={{ fontSize: '12px' }}>{layer.lossOccurDeductibility?.toLocaleString() ?? '-'}</TableCell>
                                                                <TableCell sx={{ fontSize: '12px' }}>{layer.annualAggLimit?.toLocaleString() ?? '-'}</TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </Box>
                                    )}

                                    {/* Portfolio Treaty Allocations */}
                                    {treaty.portfolioTreatyAllocations && treaty.portfolioTreatyAllocations.length > 0 && (
                                        <Box>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#0288d1', borderBottom: '1px solid #e0e0e0', pb: 1 }}>
                                                Allocations ({treaty.portfolioTreatyAllocations.length})
                                            </Typography>
                                            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
                                                <Table size="small">
                                                    <TableHead>
                                                        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                                            <TableCell sx={{ fontWeight: 600, fontSize: '11px' }}>Participant Type</TableCell>
                                                            <TableCell sx={{ fontWeight: 600, fontSize: '11px' }}>Participant Name</TableCell>
                                                            <TableCell sx={{ fontWeight: 600, fontSize: '11px' }}>Share %</TableCell>
                                                            <TableCell sx={{ fontWeight: 600, fontSize: '11px' }}>Broker Breakdowns</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {treaty.portfolioTreatyAllocations.map((alloc: any, allocIndex: number) => (
                                                            <TableRow key={allocIndex}>
                                                                <TableCell sx={{ fontSize: '12px' }}>
                                                                    <Chip label={alloc.participantType} size="small" sx={{ fontSize: '10px', height: '20px' }} />
                                                                </TableCell>
                                                                <TableCell sx={{ fontSize: '12px' }}>{alloc.participantName || '-'}</TableCell>
                                                                <TableCell sx={{ fontSize: '12px' }}>{alloc.sharePercent ?? '-'}%</TableCell>
                                                                <TableCell sx={{ fontSize: '12px' }}>
                                                                    {alloc.brokerBreakdowns && alloc.brokerBreakdowns.length > 0 ? (
                                                                        alloc.brokerBreakdowns.map((bb: any, bbIndex: number) => (
                                                                            <Box key={bbIndex} sx={{ fontSize: '11px' }}>
                                                                                {bb.reinsurerName}: {bb.sharePercent}%
                                                                            </Box>
                                                                        ))
                                                                    ) : '-'}
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </Box>
                                    )}
                                </Box>
                            ))}
                        </CardContent>
                    </Card>
                ))}
            </Box>
        );
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#212529', mb: 1, fontSize: '28px' }}>
                    Treaty Config 4
                </Typography>
                <Typography variant="body2" sx={{ color: '#6c757d', fontSize: '14px' }}>
                    Manage treaty configurations and definitions.
                </Typography>
            </Box>

            {/* Create Button */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleCreate}
                    sx={{
                        backgroundColor: '#28a745',
                        '&:hover': { backgroundColor: '#218838' },
                        textTransform: 'none'
                    }}
                >
                    Create
                </Button>
            </Box>

            {/* Data Table */}
            <Card sx={{ boxShadow: '0 2px 12px rgba(0,0,0,0.08)', borderRadius: '12px' }}>
                <CardContent sx={{ p: 0 }}>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <TableContainer component={Paper} elevation={0} sx={{ maxHeight: '600px', overflow: 'auto', borderRadius: '12px' }}>
                            <Table stickyHeader sx={{ minWidth: 650 }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 700, fontSize: '12px', backgroundColor: '#f8f9fa', color: '#6c757d', textTransform: 'uppercase', py: 2, borderBottom: '2px solid #dee2e6', width: '50px' }}></TableCell>
                                        <TableCell sx={{ fontWeight: 700, fontSize: '12px', backgroundColor: '#f8f9fa', color: '#6c757d', textTransform: 'uppercase', py: 2, borderBottom: '2px solid #dee2e6' }}>Portfolio ID</TableCell>
                                        <TableCell sx={{ fontWeight: 700, fontSize: '12px', backgroundColor: '#f8f9fa', color: '#6c757d', textTransform: 'uppercase', py: 2, borderBottom: '2px solid #dee2e6' }}>Portfolio Name</TableCell>
                                        <TableCell sx={{ fontWeight: 700, fontSize: '12px', backgroundColor: '#f8f9fa', color: '#6c757d', textTransform: 'uppercase', py: 2, borderBottom: '2px solid #dee2e6' }}>Insurer ID</TableCell>
                                        <TableCell sx={{ fontWeight: 700, fontSize: '12px', backgroundColor: '#f8f9fa', color: '#6c757d', textTransform: 'uppercase', py: 2, borderBottom: '2px solid #dee2e6' }}>Start Date</TableCell>
                                        <TableCell sx={{ fontWeight: 700, fontSize: '12px', backgroundColor: '#f8f9fa', color: '#6c757d', textTransform: 'uppercase', py: 2, borderBottom: '2px solid #dee2e6' }}>End Date</TableCell>
                                        <TableCell sx={{ fontWeight: 700, fontSize: '12px', backgroundColor: '#f8f9fa', color: '#6c757d', textTransform: 'uppercase', py: 2, borderBottom: '2px solid #dee2e6' }}>Currency</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4, color: '#6c757d' }}>
                                                No data available
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        data.map((row, index) => (
                                            <React.Fragment key={row.id || `row-${index}`}>
                                                <TableRow
                                                    sx={{
                                                        '&:hover': { backgroundColor: '#f8f9fa' },
                                                        cursor: 'pointer'
                                                    }}
                                                    onClick={() => handleRowClick(row.id)}
                                                >
                                                    <TableCell sx={{ py: 2 }}>
                                                        <IconButton size="small">
                                                            {expandedRow === row.id ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                                        </IconButton>
                                                    </TableCell>
                                                    <TableCell sx={{ fontSize: '14px', py: 2, fontWeight: 600 }}>{row.id || '-'}</TableCell>
                                                    <TableCell sx={{ fontSize: '14px', py: 2 }}>{row.portfolioName || '-'}</TableCell>
                                                    <TableCell sx={{ fontSize: '14px', py: 2 }}>{row.insurerId || '-'}</TableCell>
                                                    <TableCell sx={{ fontSize: '14px', py: 2 }}>{formatDate(row.startDate)}</TableCell>
                                                    <TableCell sx={{ fontSize: '14px', py: 2 }}>{formatDate(row.endDate)}</TableCell>
                                                    <TableCell sx={{ fontSize: '14px', py: 2 }}>{row.currency || '-'}</TableCell>
                                                </TableRow>
                                                <TableRow key={`collapse-${row.id || index}`}>
                                                    <TableCell colSpan={7} sx={{ py: 0, borderBottom: expandedRow === row.id ? '1px solid #dee2e6' : 'none' }}>
                                                        <Collapse in={expandedRow === row.id} timeout="auto" unmountOnExit>
                                                            {renderAccordionContent(row.id)}
                                                        </Collapse>
                                                    </TableCell>
                                                </TableRow>
                                            </React.Fragment>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
};

export default TreatyConfig4Component;
