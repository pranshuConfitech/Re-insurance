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
            <Box sx={{ p: 4, backgroundColor: '#f5f5f5', borderRadius: '12px', margin: 2 }}>
                {treatyBlocks.map((block: any, blockIndex: number) => (
                    <Card key={blockIndex} sx={{
                        mb: 4,
                        border: 'none',
                        borderRadius: '16px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        overflow: 'hidden',
                        backgroundColor: '#fff'
                    }}>
                        <CardContent sx={{ p: 0 }}>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                p: 4,
                                backgroundColor: '#f8f9fa',
                                borderBottom: '1px solid #e9ecef'
                            }}>
                                <Chip
                                    label={block.blockType}
                                    size="medium"
                                    sx={{
                                        backgroundColor: block.blockType === 'PROPORTIONAL' ? '#e3f2fd' : '#fff3e0',
                                        color: block.blockType === 'PROPORTIONAL' ? '#1565c0' : '#e65100',
                                        fontWeight: 600,
                                        fontSize: '14px',
                                        px: 3,
                                        py: 1,
                                        height: '32px'
                                    }}
                                />
                                <Typography variant="h6" sx={{ fontWeight: 600, color: '#212529', fontSize: '20px' }}>
                                    Block {block.sortOrder}
                                </Typography>
                            </Box>

                            <Box sx={{ p: 4 }}>
                                {block.treaties && block.treaties.map((treaty: any, treatyIndex: number) => (
                                    <Box key={treatyIndex} sx={{
                                        mb: treatyIndex < block.treaties.length - 1 ? 5 : 0,
                                        p: 4,
                                        backgroundColor: '#fafafa',
                                        borderRadius: '12px',
                                        border: '1px solid #f0f0f0'
                                    }}>
                                        {/* Treaty Basic Info */}
                                        <Typography variant="h6" sx={{
                                            fontWeight: 700,
                                            mb: 4,
                                            color: '#626BDA',
                                            fontSize: '20px',
                                            borderBottom: '2px solid #e9ecef',
                                            pb: 2
                                        }}>
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
                                            <Box sx={{ mb: 4 }}>
                                                <Typography variant="subtitle2" sx={{
                                                    fontWeight: 600,
                                                    mb: 3,
                                                    color: '#7b1fa2',
                                                    fontSize: '16px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1
                                                }}>
                                                    Risk Details ({treaty.propRiskDetails.length})
                                                </Typography>
                                                <Box sx={{
                                                    backgroundColor: '#fafafa',
                                                    borderRadius: '12px',
                                                    overflow: 'hidden',
                                                    border: 'none'
                                                }}>
                                                    <Table size="small" sx={{
                                                        '& .MuiTableCell-root': {
                                                            border: 'none',
                                                            borderBottom: '1px solid #f0f0f0'
                                                        },
                                                        '& .MuiTableRow-root:last-child .MuiTableCell-root': {
                                                            borderBottom: 'none'
                                                        }
                                                    }}>
                                                        <TableHead>
                                                            <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                                                                <TableCell sx={{ fontWeight: 600, fontSize: '13px', color: '#495057', py: 2.5, px: 3 }}>Product LOB</TableCell>
                                                                <TableCell sx={{ fontWeight: 600, fontSize: '13px', color: '#495057', py: 2.5, px: 3 }}>Product Code</TableCell>
                                                                <TableCell sx={{ fontWeight: 600, fontSize: '13px', color: '#495057', py: 2.5, px: 3 }}>Risk Category</TableCell>
                                                                <TableCell sx={{ fontWeight: 600, fontSize: '13px', color: '#495057', py: 2.5, px: 3 }}>Risk Grade</TableCell>
                                                                <TableCell sx={{ fontWeight: 600, fontSize: '13px', color: '#495057', py: 2.5, px: 3 }}>Cession Rate</TableCell>
                                                                <TableCell sx={{ fontWeight: 600, fontSize: '13px', color: '#495057', py: 2.5, px: 3 }}>Retention Amt</TableCell>
                                                                <TableCell sx={{ fontWeight: 600, fontSize: '13px', color: '#495057', py: 2.5, px: 3 }}>Surplus Capacity</TableCell>
                                                                <TableCell sx={{ fontWeight: 600, fontSize: '13px', color: '#495057', py: 2.5, px: 3 }}>Event Limit</TableCell>
                                                                <TableCell sx={{ fontWeight: 600, fontSize: '13px', color: '#495057', py: 2.5, px: 3 }}>Alert Days</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {treaty.propRiskDetails.map((risk: any, riskIndex: number) => (
                                                                <TableRow key={riskIndex} sx={{
                                                                    '&:hover': { backgroundColor: '#f5f5f5' },
                                                                    backgroundColor: riskIndex % 2 === 0 ? '#fff' : '#fafafa'
                                                                }}>
                                                                    <TableCell sx={{ fontSize: '13px', py: 2, px: 3, color: '#333' }}>{risk.productLob || '-'}</TableCell>
                                                                    <TableCell sx={{ fontSize: '13px', py: 2, px: 3, color: '#333' }}>{risk.productCode || '-'}</TableCell>
                                                                    <TableCell sx={{ fontSize: '13px', py: 2, px: 3, color: '#333' }}>{risk.riskCategory || '-'}</TableCell>
                                                                    <TableCell sx={{ fontSize: '13px', py: 2, px: 3, color: '#333' }}>{risk.riskGrade || '-'}</TableCell>
                                                                    <TableCell sx={{ fontSize: '13px', py: 2, px: 3, color: '#333', fontWeight: 500 }}>{risk.cessionRate ?? '-'}%</TableCell>
                                                                    <TableCell sx={{ fontSize: '13px', py: 2, px: 3, color: '#333' }}>{risk.retentionAmount?.toLocaleString() ?? '-'}</TableCell>
                                                                    <TableCell sx={{ fontSize: '13px', py: 2, px: 3, color: '#333' }}>{risk.surplusCapacity?.toLocaleString() ?? '-'}</TableCell>
                                                                    <TableCell sx={{ fontSize: '13px', py: 2, px: 3, color: '#333' }}>{risk.eventLimit?.toLocaleString() ?? '-'}</TableCell>
                                                                    <TableCell sx={{ fontSize: '13px', py: 2, px: 3, color: '#333' }}>{risk.alertDays ?? '-'}</TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </Box>
                                            </Box>
                                        )}

                                        {/* Non-Proportional Layers */}
                                        {treaty.nonpropLayers && treaty.nonpropLayers.length > 0 && (
                                            <Box sx={{ mb: 4 }}>
                                                <Typography variant="subtitle2" sx={{
                                                    fontWeight: 600,
                                                    mb: 3,
                                                    color: '#f57c00',
                                                    fontSize: '16px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1
                                                }}>
                                                    Layers ({treaty.nonpropLayers.length})
                                                </Typography>
                                                <Box sx={{
                                                    backgroundColor: '#fafafa',
                                                    borderRadius: '12px',
                                                    overflow: 'hidden',
                                                    border: 'none'
                                                }}>
                                                    <Table size="small" sx={{
                                                        '& .MuiTableCell-root': {
                                                            border: 'none',
                                                            borderBottom: '1px solid #f0f0f0'
                                                        },
                                                        '& .MuiTableRow-root:last-child .MuiTableCell-root': {
                                                            borderBottom: 'none'
                                                        }
                                                    }}>
                                                        <TableHead>
                                                            <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                                                                <TableCell sx={{ fontWeight: 600, fontSize: '13px', color: '#495057', py: 2.5, px: 3 }}>Layer #</TableCell>
                                                                <TableCell sx={{ fontWeight: 600, fontSize: '13px', color: '#495057', py: 2.5, px: 3 }}>Product LOB</TableCell>
                                                                <TableCell sx={{ fontWeight: 600, fontSize: '13px', color: '#495057', py: 2.5, px: 3 }}>Product Code</TableCell>
                                                                <TableCell sx={{ fontWeight: 600, fontSize: '13px', color: '#495057', py: 2.5, px: 3 }}>Loss Limit</TableCell>
                                                                <TableCell sx={{ fontWeight: 600, fontSize: '13px', color: '#495057', py: 2.5, px: 3 }}>Deductibility</TableCell>
                                                                <TableCell sx={{ fontWeight: 600, fontSize: '13px', color: '#495057', py: 2.5, px: 3 }}>Annual Agg Limit</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {treaty.nonpropLayers.map((layer: any, layerIndex: number) => (
                                                                <TableRow key={layerIndex} sx={{
                                                                    '&:hover': { backgroundColor: '#f5f5f5' },
                                                                    backgroundColor: layerIndex % 2 === 0 ? '#fff' : '#fafafa'
                                                                }}>
                                                                    <TableCell sx={{ fontSize: '13px', py: 2, px: 3, color: '#333', fontWeight: 500 }}>{layer.layerNumber || layerIndex + 1}</TableCell>
                                                                    <TableCell sx={{ fontSize: '13px', py: 2, px: 3, color: '#333' }}>{layer.productLob || '-'}</TableCell>
                                                                    <TableCell sx={{ fontSize: '13px', py: 2, px: 3, color: '#333' }}>{layer.productCode || '-'}</TableCell>
                                                                    <TableCell sx={{ fontSize: '13px', py: 2, px: 3, color: '#333' }}>{layer.lossLimit?.toLocaleString() ?? '-'}</TableCell>
                                                                    <TableCell sx={{ fontSize: '13px', py: 2, px: 3, color: '#333' }}>{layer.lossOccurDeductibility?.toLocaleString() ?? '-'}</TableCell>
                                                                    <TableCell sx={{ fontSize: '13px', py: 2, px: 3, color: '#333' }}>{layer.annualAggLimit?.toLocaleString() ?? '-'}</TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </Box>
                                            </Box>
                                        )}

                                        {/* Portfolio Treaty Allocations */}
                                        {treaty.portfolioTreatyAllocations && treaty.portfolioTreatyAllocations.length > 0 && (
                                            <Box>
                                                <Typography variant="subtitle2" sx={{
                                                    fontWeight: 600,
                                                    mb: 3,
                                                    color: '#0288d1',
                                                    fontSize: '16px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1
                                                }}>
                                                    Allocations ({treaty.portfolioTreatyAllocations.length})
                                                </Typography>
                                                <Box sx={{
                                                    backgroundColor: '#fafafa',
                                                    borderRadius: '12px',
                                                    overflow: 'hidden',
                                                    border: 'none'
                                                }}>
                                                    <Table size="small" sx={{
                                                        '& .MuiTableCell-root': {
                                                            border: 'none',
                                                            borderBottom: '1px solid #f0f0f0'
                                                        },
                                                        '& .MuiTableRow-root:last-child .MuiTableCell-root': {
                                                            borderBottom: 'none'
                                                        }
                                                    }}>
                                                        <TableHead>
                                                            <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                                                                <TableCell sx={{ fontWeight: 600, fontSize: '13px', color: '#495057', py: 2.5, px: 3 }}>Participant Type</TableCell>
                                                                <TableCell sx={{ fontWeight: 600, fontSize: '13px', color: '#495057', py: 2.5, px: 3 }}>Participant Name</TableCell>
                                                                <TableCell sx={{ fontWeight: 600, fontSize: '13px', color: '#495057', py: 2.5, px: 3 }}>Share %</TableCell>
                                                                <TableCell sx={{ fontWeight: 600, fontSize: '13px', color: '#495057', py: 2.5, px: 3 }}>Broker Breakdowns</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {treaty.portfolioTreatyAllocations.map((alloc: any, allocIndex: number) => (
                                                                <TableRow key={allocIndex} sx={{
                                                                    '&:hover': { backgroundColor: '#f5f5f5' },
                                                                    backgroundColor: allocIndex % 2 === 0 ? '#fff' : '#fafafa'
                                                                }}>
                                                                    <TableCell sx={{ fontSize: '13px', py: 2, px: 3 }}>
                                                                        <Chip
                                                                            label={alloc.participantType}
                                                                            size="small"
                                                                            sx={{
                                                                                fontSize: '11px',
                                                                                height: '24px',
                                                                                backgroundColor: alloc.participantType === 'REINSURER' ? '#e3f2fd' : '#fff3e0',
                                                                                color: alloc.participantType === 'REINSURER' ? '#1565c0' : '#e65100',
                                                                                fontWeight: 500
                                                                            }}
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell sx={{ fontSize: '13px', py: 2, px: 3, color: '#333', fontWeight: 500 }}>{alloc.participantName || '-'}</TableCell>
                                                                    <TableCell sx={{ fontSize: '13px', py: 2, px: 3, color: '#333', fontWeight: 600 }}>{alloc.sharePercent ?? '-'}%</TableCell>
                                                                    <TableCell sx={{ fontSize: '13px', py: 2, px: 3, color: '#333' }}>
                                                                        {alloc.brokerBreakdowns && alloc.brokerBreakdowns.length > 0 ? (
                                                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                                                                {alloc.brokerBreakdowns.map((bb: any, bbIndex: number) => (
                                                                                    <Chip
                                                                                        key={bbIndex}
                                                                                        label={`${bb.reinsurerName}: ${bb.sharePercent}%`}
                                                                                        size="small"
                                                                                        sx={{
                                                                                            fontSize: '10px',
                                                                                            height: '20px',
                                                                                            backgroundColor: '#f5f5f5',
                                                                                            color: '#666'
                                                                                        }}
                                                                                    />
                                                                                ))}
                                                                            </Box>
                                                                        ) : (
                                                                            <Typography sx={{ fontSize: '12px', color: '#999' }}>-</Typography>
                                                                        )}
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </Box>
                                            </Box>
                                        )}
                                    </Box>
                                ))}
                            </Box>
                        </CardContent>
                    </Card>
                ))}
            </Box>
        );
    };

    return (
        <Box sx={{ p: 4, backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            {/* Header Section */}
            <Box sx={{ mb: 4, p: 3, backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#212529', mb: 1, fontSize: '28px' }}>
                            Treaty Config 4
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#6c757d', fontSize: '14px' }}>
                            Manage treaty configurations and definitions.
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleCreate}
                        sx={{
                            backgroundColor: '#28a745',
                            '&:hover': { backgroundColor: '#218838' },
                            textTransform: 'none',
                            borderRadius: '8px',
                            px: 3,
                            py: 1.5,
                            fontWeight: 600,
                            boxShadow: '0 2px 8px rgba(40, 167, 69, 0.3)'
                        }}
                    >
                        Create New Treaty
                    </Button>
                </Box>
            </Box>

            {/* Data Table */}
            <Card sx={{
                boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                borderRadius: '12px',
                border: '1px solid #e9ecef',
                overflow: 'hidden'
            }}>
                <Box sx={{
                    p: 3,
                    backgroundColor: '#fff',
                    borderBottom: '1px solid #e9ecef'
                }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#212529', fontSize: '18px' }}>
                        Treaty Portfolios
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6c757d', mt: 0.5 }}>
                        {data.length} portfolio{data.length !== 1 ? 's' : ''} found
                    </Typography>
                </Box>

                <CardContent sx={{ p: 0 }}>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                            <CircularProgress sx={{ color: '#626BDA' }} />
                        </Box>
                    ) : (
                        <TableContainer component={Paper} elevation={0} sx={{ maxHeight: '600px', overflow: 'auto' }}>
                            <Table stickyHeader sx={{ minWidth: 650 }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{
                                            fontWeight: 700,
                                            fontSize: '13px',
                                            backgroundColor: '#f8f9fa',
                                            color: '#495057',
                                            textTransform: 'uppercase',
                                            py: 3,
                                            borderBottom: '2px solid #dee2e6',
                                            width: '60px',
                                            letterSpacing: '0.5px'
                                        }}>

                                        </TableCell>
                                        <TableCell sx={{
                                            fontWeight: 700,
                                            fontSize: '13px',
                                            backgroundColor: '#f8f9fa',
                                            color: '#495057',
                                            textTransform: 'uppercase',
                                            py: 3,
                                            borderBottom: '2px solid #dee2e6',
                                            letterSpacing: '0.5px'
                                        }}>
                                            Portfolio Name
                                        </TableCell>
                                        <TableCell sx={{
                                            fontWeight: 700,
                                            fontSize: '13px',
                                            backgroundColor: '#f8f9fa',
                                            color: '#495057',
                                            textTransform: 'uppercase',
                                            py: 3,
                                            borderBottom: '2px solid #dee2e6',
                                            letterSpacing: '0.5px'
                                        }}>
                                            Insurer ID
                                        </TableCell>
                                        <TableCell sx={{
                                            fontWeight: 700,
                                            fontSize: '13px',
                                            backgroundColor: '#f8f9fa',
                                            color: '#495057',
                                            textTransform: 'uppercase',
                                            py: 3,
                                            borderBottom: '2px solid #dee2e6',
                                            letterSpacing: '0.5px'
                                        }}>
                                            Start Date
                                        </TableCell>
                                        <TableCell sx={{
                                            fontWeight: 700,
                                            fontSize: '13px',
                                            backgroundColor: '#f8f9fa',
                                            color: '#495057',
                                            textTransform: 'uppercase',
                                            py: 3,
                                            borderBottom: '2px solid #dee2e6',
                                            letterSpacing: '0.5px'
                                        }}>
                                            End Date
                                        </TableCell>
                                        <TableCell sx={{
                                            fontWeight: 700,
                                            fontSize: '13px',
                                            backgroundColor: '#f8f9fa',
                                            color: '#495057',
                                            textTransform: 'uppercase',
                                            py: 3,
                                            borderBottom: '2px solid #dee2e6',
                                            letterSpacing: '0.5px'
                                        }}>
                                            Currency
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} sx={{ textAlign: 'center', py: 8, color: '#6c757d' }}>
                                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                                    <Typography variant="h6" sx={{ color: '#6c757d', fontWeight: 500 }}>
                                                        No treaties found
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ color: '#adb5bd' }}>
                                                        Create your first treaty configuration to get started
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        data.map((row, index) => (
                                            <React.Fragment key={row.id || `row-${index}`}>
                                                <TableRow
                                                    sx={{
                                                        '&:hover': {
                                                            backgroundColor: '#f8f9fa',
                                                            transform: 'translateY(-1px)',
                                                            transition: 'all 0.2s ease-in-out'
                                                        },
                                                        cursor: 'pointer',
                                                        borderBottom: '1px solid #e9ecef'
                                                    }}
                                                    onClick={() => handleRowClick(row.id)}
                                                >
                                                    <TableCell sx={{ py: 3, px: 3 }}>
                                                        <IconButton
                                                            size="small"
                                                            sx={{
                                                                backgroundColor: expandedRow === row.id ? '#626BDA' : '#f8f9fa',
                                                                color: expandedRow === row.id ? '#fff' : '#6c757d',
                                                                '&:hover': {
                                                                    backgroundColor: expandedRow === row.id ? '#5a63d1' : '#e9ecef'
                                                                },
                                                                transition: 'all 0.2s ease-in-out'
                                                            }}
                                                        >
                                                            {expandedRow === row.id ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                                        </IconButton>
                                                    </TableCell>
                                                    <TableCell sx={{
                                                        fontSize: '15px',
                                                        py: 3,
                                                        fontWeight: 600,
                                                        color: '#212529'
                                                    }}>
                                                        {row.portfolioName || '-'}
                                                    </TableCell>
                                                    <TableCell sx={{
                                                        fontSize: '14px',
                                                        py: 3,
                                                        color: '#495057'
                                                    }}>
                                                        <Chip
                                                            label={row.insurerId || '-'}
                                                            size="small"
                                                            sx={{
                                                                backgroundColor: '#e3f2fd',
                                                                color: '#1565c0',
                                                                fontWeight: 500,
                                                                fontSize: '12px'
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell sx={{
                                                        fontSize: '14px',
                                                        py: 3,
                                                        color: '#495057'
                                                    }}>
                                                        {formatDate(row.startDate)}
                                                    </TableCell>
                                                    <TableCell sx={{
                                                        fontSize: '14px',
                                                        py: 3,
                                                        color: '#495057'
                                                    }}>
                                                        {formatDate(row.endDate)}
                                                    </TableCell>
                                                    <TableCell sx={{
                                                        fontSize: '14px',
                                                        py: 3,
                                                        color: '#495057'
                                                    }}>
                                                        <Chip
                                                            label={row.currency || '-'}
                                                            size="small"
                                                            sx={{
                                                                backgroundColor: '#fff3e0',
                                                                color: '#e65100',
                                                                fontWeight: 500,
                                                                fontSize: '12px'
                                                            }}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow key={`collapse-${row.id || index}`}>
                                                    <TableCell colSpan={6} sx={{ py: 0, borderBottom: expandedRow === row.id ? '1px solid #dee2e6' : 'none' }}>
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
