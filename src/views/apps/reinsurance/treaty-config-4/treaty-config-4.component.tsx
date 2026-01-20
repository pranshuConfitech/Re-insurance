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
import Edit from '@mui/icons-material/Edit';
import Visibility from '@mui/icons-material/Visibility';

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

    const handleEdit = (portfolioId: string, event: React.MouseEvent) => {
        event.stopPropagation();
        console.log('Edit clicked, portfolioId:', portfolioId);
        router.push(`/reinsurance/treaty-config-4/edit/${portfolioId}`);
    };

    const handleView = (portfolioId: string, event: React.MouseEvent) => {
        event.stopPropagation();
        router.push(`/reinsurance/treaty-config-4/view/${portfolioId}`);
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

        const labelStyle = { fontSize: '10px', color: '#6c757d', fontWeight: 600, textTransform: 'uppercase' as const };
        const valueStyle = { fontSize: '12px', color: '#212529', fontWeight: 500 };

        return (
            <Box sx={{ p: 3, backgroundColor: '#f8f9fa', borderRadius: '8px', margin: 2 }}>
                {treatyBlocks.map((block: any, blockIndex: number) => (
                    <Card key={blockIndex} sx={{
                        mb: 3,
                        border: '1px solid #dee2e6',
                        borderRadius: '8px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        overflow: 'hidden',
                        backgroundColor: '#fff'
                    }}>
                        <CardContent sx={{ p: 0 }}>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                p: 3,
                                backgroundColor: '#f8f9fa',
                                borderBottom: '1px solid #dee2e6'
                            }}>
                                <Chip
                                    label={block.blockType}
                                    size="medium"
                                    sx={{
                                        backgroundColor: block.blockType === 'PROPORTIONAL' ? '#e3f2fd' : '#fff3e0',
                                        color: block.blockType === 'PROPORTIONAL' ? '#1565c0' : '#e65100',
                                        fontWeight: 600,
                                        fontSize: '12px',
                                        px: 2,
                                        py: 0.5,
                                        height: '28px'
                                    }}
                                />
                                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a', fontSize: '16px' }}>
                                    Block {block.sortOrder}
                                </Typography>
                            </Box>

                            <Box sx={{ p: 3 }}>
                                {/* Block Summary - Compact */}
                                <Box sx={{ mb: 2, p: 1.5, backgroundColor: 'white', borderRadius: '6px', border: '1px solid #dee2e6' }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#495057', borderBottom: '1px solid #e0e0e0', pb: 0.5, fontSize: '12px' }}>
                                        Block Summary
                                    </Typography>
                                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1.5 }}>
                                        <Box>
                                            <Typography sx={{ ...labelStyle, fontSize: '10px' }}>Block Type</Typography>
                                            <Typography sx={{ ...valueStyle, fontSize: '11px' }}>{block.blockType || '-'}</Typography>
                                        </Box>
                                        <Box>
                                            <Typography sx={{ ...labelStyle, fontSize: '10px' }}>Sort Order</Typography>
                                            <Typography sx={{ ...valueStyle, fontSize: '11px' }}>{block.sortOrder || '-'}</Typography>
                                        </Box>
                                        <Box>
                                            <Typography sx={{ ...labelStyle, fontSize: '10px' }}>Treaties Count</Typography>
                                            <Typography sx={{ ...valueStyle, fontSize: '11px' }}>{block.treaties?.length || 0}</Typography>
                                        </Box>
                                    </Box>
                                </Box>

                                {block.treaties && block.treaties.map((treaty: any, treatyIndex: number) => (
                                    <Card key={treatyIndex} sx={{ mb: 1.5, p: 2, backgroundColor: 'white', border: '1px solid #dee2e6', borderRadius: '6px' }}>
                                        {/* Treaty Header - Compact */}
                                        <Typography variant="h6" sx={{
                                            fontWeight: 600,
                                            mb: 1.5,
                                            color: '#e91e63',
                                            fontSize: '14px',
                                            borderBottom: '1px solid #dee2e6',
                                            pb: 0.5
                                        }}>
                                            Treaty: {treaty.treatyName || '-'}
                                        </Typography>

                                        {/* Basic Treaty Information - Compact Grid */}
                                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 1.5, mb: 2 }}>
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
                                                <Chip label={treaty.status || 'N/A'} size="small" sx={{ ...getStatusColor(treaty.status), fontSize: '10px', height: '18px' }} />
                                            </Box>
                                            <Box>
                                                <Typography sx={labelStyle}>Category</Typography>
                                                <Typography sx={valueStyle}>{treaty.treatyCategory || '-'}</Typography>
                                            </Box>
                                            <Box>
                                                <Typography sx={labelStyle}>Graded Retention</Typography>
                                                <Typography sx={valueStyle}>{treaty.gradedRetention ? 'Yes' : 'No'}</Typography>
                                            </Box>
                                        </Box>

                                        {/* Proportional Treaty Attributes - Compact */}
                                        {treaty.propTreatyAttribute && (
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: '#495057', borderBottom: '1px solid #e0e0e0', pb: 0.5, fontSize: '13px' }}>
                                                    Proportional Treaty Attributes
                                                </Typography>
                                                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 1.5 }}>
                                                    <Box>
                                                        <Typography sx={labelStyle}>Installment</Typography>
                                                        <Typography sx={valueStyle}>{treaty.propTreatyAttribute.installmentType || '-'}</Typography>
                                                    </Box>
                                                    <Box>
                                                        <Typography sx={labelStyle}>Prem Reserve Retained</Typography>
                                                        <Typography sx={valueStyle}>{treaty.propTreatyAttribute.premReserveRetainedRate ?? '-'}%</Typography>
                                                    </Box>
                                                    <Box>
                                                        <Typography sx={labelStyle}>Prem Reserve Interest</Typography>
                                                        <Typography sx={valueStyle}>{treaty.propTreatyAttribute.premReserveInterestRate ?? '-'}%</Typography>
                                                    </Box>
                                                    <Box>
                                                        <Typography sx={labelStyle}>Portfolio Prem Entry</Typography>
                                                        <Typography sx={valueStyle}>{treaty.propTreatyAttribute.portfolioPremEntryRate ?? '-'}%</Typography>
                                                    </Box>
                                                    <Box>
                                                        <Typography sx={labelStyle}>Portfolio Claim Entry</Typography>
                                                        <Typography sx={valueStyle}>{treaty.propTreatyAttribute.portfolioClaimEntryRate ?? '-'}%</Typography>
                                                    </Box>
                                                    <Box>
                                                        <Typography sx={labelStyle}>Mgmt Expenses</Typography>
                                                        <Typography sx={valueStyle}>{treaty.propTreatyAttribute.mgmtExpensesPercent ?? '-'}%</Typography>
                                                    </Box>
                                                </Box>
                                            </Box>
                                        )}

                                        {/* Non-Proportional Treaty Attributes */}
                                        {treaty.nonpropTreatyAttribute && (
                                            <Box sx={{ mb: 3 }}>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#495057', borderBottom: '1px solid #e0e0e0', pb: 1 }}>
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
                                                        <Typography sx={labelStyle}>Capacity</Typography>
                                                        <Typography sx={valueStyle}>{treaty.nonpropTreatyAttribute.capacity?.toLocaleString() ?? '-'}</Typography>
                                                    </Box>
                                                    <Box>
                                                        <Typography sx={labelStyle}>No. Reinstatements</Typography>
                                                        <Typography sx={valueStyle}>{treaty.nonpropTreatyAttribute.noReinstatements ?? '-'}</Typography>
                                                    </Box>
                                                </Box>
                                            </Box>
                                        )}

                                        {/* Risk Details - Compact Professional Table */}
                                        {treaty.propRiskDetails && treaty.propRiskDetails.length > 0 && (
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="subtitle2" sx={{
                                                    fontWeight: 600,
                                                    mb: 1.5,
                                                    color: '#495057',
                                                    fontSize: '13px'
                                                }}>
                                                    Risk Details ({treaty.propRiskDetails.length})
                                                </Typography>

                                                <TableContainer
                                                    component={Paper}
                                                    sx={{
                                                        boxShadow: 'none',
                                                        border: '1px solid #dee2e6',
                                                        borderRadius: '6px',
                                                        overflow: 'hidden'
                                                    }}
                                                >
                                                    <Table size="small" sx={{ '& .MuiTableCell-root': { padding: '6px 8px', fontSize: '11px' } }}>
                                                        <TableHead>
                                                            <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                                                                <TableCell sx={{ fontWeight: 600, color: '#495057', minWidth: 80 }}>Product</TableCell>
                                                                <TableCell sx={{ fontWeight: 600, color: '#495057', minWidth: 70 }}>Code</TableCell>
                                                                <TableCell sx={{ fontWeight: 600, color: '#495057', minWidth: 70 }}>Category</TableCell>
                                                                <TableCell sx={{ fontWeight: 600, color: '#495057', minWidth: 50 }}>Grade</TableCell>
                                                                <TableCell sx={{ fontWeight: 600, color: '#495057', minWidth: 70, textAlign: 'right' }}>Cession %</TableCell>
                                                                <TableCell sx={{ fontWeight: 600, color: '#495057', minWidth: 90, textAlign: 'right' }}>Max Capacity</TableCell>
                                                                <TableCell sx={{ fontWeight: 600, color: '#495057', minWidth: 90, textAlign: 'right' }}>Retention</TableCell>
                                                                <TableCell sx={{ fontWeight: 600, color: '#495057', minWidth: 80, textAlign: 'right' }}>Surplus</TableCell>
                                                                <TableCell sx={{ fontWeight: 600, color: '#495057', minWidth: 90, textAlign: 'right' }}>Event Limit</TableCell>
                                                                <TableCell sx={{ fontWeight: 600, color: '#495057', minWidth: 80, textAlign: 'right' }}>Cash Call</TableCell>
                                                                <TableCell sx={{ fontWeight: 600, color: '#495057', minWidth: 100 }}>Payment</TableCell>
                                                                <TableCell sx={{ fontWeight: 600, color: '#495057', minWidth: 50, textAlign: 'center' }}>Days</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {treaty.propRiskDetails.map((risk: any, riskIndex: number) => (
                                                                <TableRow key={riskIndex} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                                                                    <TableCell sx={{ fontWeight: 500 }}>{risk.productLob || '-'}</TableCell>
                                                                    <TableCell sx={{ fontWeight: 500 }}>{risk.productCode || '-'}</TableCell>
                                                                    <TableCell>{risk.riskCategory || '-'}</TableCell>
                                                                    <TableCell>{risk.riskGrade || '-'}</TableCell>
                                                                    <TableCell sx={{ fontWeight: 600, color: '#e91e63', textAlign: 'right' }}>{risk.cessionRate ?? '-'}%</TableCell>
                                                                    <TableCell sx={{ fontFamily: 'monospace', textAlign: 'right' }}>{risk.quotaCessionMaxCapacity ? (risk.quotaCessionMaxCapacity / 1000).toFixed(0) + 'K' : '-'}</TableCell>
                                                                    <TableCell sx={{ fontFamily: 'monospace', textAlign: 'right' }}>{risk.retentionAmount ? (risk.retentionAmount / 1000).toFixed(0) + 'K' : '-'}</TableCell>
                                                                    <TableCell sx={{ fontFamily: 'monospace', textAlign: 'right' }}>{risk.surplusCapacity ? (risk.surplusCapacity / 1000).toFixed(0) + 'K' : '-'}</TableCell>
                                                                    <TableCell sx={{ fontFamily: 'monospace', textAlign: 'right' }}>{risk.eventLimit ? (risk.eventLimit / 1000).toFixed(0) + 'K' : '-'}</TableCell>
                                                                    <TableCell sx={{ fontFamily: 'monospace', textAlign: 'right' }}>{risk.cashCallLimit ? (risk.cashCallLimit / 1000).toFixed(0) + 'K' : '-'}</TableCell>
                                                                    <TableCell sx={{ fontSize: '10px' }}>{risk.premiumPaymentWarranty?.replace('WITHIN_', '').replace('_DAYS', 'd') || '-'}</TableCell>
                                                                    <TableCell sx={{ textAlign: 'center', fontWeight: 500 }}>{risk.alertDays ?? '-'}</TableCell>
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
                                                <Typography variant="subtitle2" sx={{
                                                    fontWeight: 600,
                                                    mb: 2,
                                                    color: '#495057',
                                                    fontSize: '14px'
                                                }}>
                                                    Non-Proportional Layers ({treaty.nonpropLayers.length})
                                                </Typography>
                                                <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #dee2e6' }}>
                                                    <Table size="small">
                                                        <TableHead>
                                                            <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                                                                <TableCell sx={{ fontWeight: 600, fontSize: '12px', color: '#495057' }}>Layer</TableCell>
                                                                <TableCell sx={{ fontWeight: 600, fontSize: '12px', color: '#495057' }}>Attachment</TableCell>
                                                                <TableCell sx={{ fontWeight: 600, fontSize: '12px', color: '#495057' }}>Limit</TableCell>
                                                                <TableCell sx={{ fontWeight: 600, fontSize: '12px', color: '#495057' }}>Premium</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {treaty.nonpropLayers.map((layer: any, layerIndex: number) => (
                                                                <TableRow key={layerIndex} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                                                                    <TableCell sx={{ fontSize: '12px' }}>{layer.layerNumber || '-'}</TableCell>
                                                                    <TableCell sx={{ fontSize: '12px' }}>{layer.attachment?.toLocaleString() ?? '-'}</TableCell>
                                                                    <TableCell sx={{ fontSize: '12px' }}>{layer.limit?.toLocaleString() ?? '-'}</TableCell>
                                                                    <TableCell sx={{ fontSize: '12px' }}>{layer.premium?.toLocaleString() ?? '-'}</TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </Box>
                                        )}

                                        {/* Allocations - Compact Table */}
                                        {treaty.portfolioTreatyAllocations && treaty.portfolioTreatyAllocations.length > 0 && (
                                            <Box>
                                                <Typography variant="subtitle2" sx={{
                                                    fontWeight: 600,
                                                    mb: 1.5,
                                                    color: '#495057',
                                                    fontSize: '13px'
                                                }}>
                                                    Allocations ({treaty.portfolioTreatyAllocations.length})
                                                </Typography>
                                                <TableContainer
                                                    component={Paper}
                                                    sx={{
                                                        boxShadow: 'none',
                                                        border: '1px solid #dee2e6',
                                                        borderRadius: '6px',
                                                        overflow: 'hidden'
                                                    }}
                                                >
                                                    <Table size="small" sx={{ '& .MuiTableCell-root': { padding: '6px 8px', fontSize: '11px' } }}>
                                                        <TableHead>
                                                            <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                                                                <TableCell sx={{ fontWeight: 600, color: '#495057', minWidth: 100 }}>Type</TableCell>
                                                                <TableCell sx={{ fontWeight: 600, color: '#495057', minWidth: 150 }}>Participant Name</TableCell>
                                                                <TableCell sx={{ fontWeight: 600, color: '#495057', minWidth: 80, textAlign: 'right' }}>Share %</TableCell>
                                                                <TableCell sx={{ fontWeight: 600, color: '#495057', minWidth: 200 }}>Broker Breakdowns</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {treaty.portfolioTreatyAllocations.map((alloc: any, allocIndex: number) => (
                                                                <TableRow key={allocIndex} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                                                                    <TableCell>
                                                                        <Chip
                                                                            label={alloc.participantType}
                                                                            size="small"
                                                                            sx={{
                                                                                fontSize: '9px',
                                                                                height: '16px',
                                                                                backgroundColor: alloc.participantType === 'REINSURER' ? '#e3f2fd' : '#fff3e0',
                                                                                color: alloc.participantType === 'REINSURER' ? '#1565c0' : '#e65100'
                                                                            }}
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell sx={{ fontWeight: 500 }}>{alloc.participantName || '-'}</TableCell>
                                                                    <TableCell sx={{ fontWeight: 600, textAlign: 'right', color: '#e91e63' }}>{alloc.sharePercent ?? '-'}%</TableCell>
                                                                    <TableCell>
                                                                        {alloc.brokerBreakdowns && alloc.brokerBreakdowns.length > 0 ? (
                                                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                                                {alloc.brokerBreakdowns.map((broker: any, brokerIndex: number) => (
                                                                                    <Chip
                                                                                        key={brokerIndex}
                                                                                        label={`${broker.reinsurerName}: ${broker.sharePercent}%`}
                                                                                        size="small"
                                                                                        sx={{
                                                                                            fontSize: '9px',
                                                                                            height: '16px',
                                                                                            backgroundColor: '#f0f0f0',
                                                                                            color: '#666'
                                                                                        }}
                                                                                    />
                                                                                ))}
                                                                            </Box>
                                                                        ) : '-'}
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </Box>
                                        )}
                                    </Card>
                                ))}
                            </Box>
                        </CardContent>
                    </Card>
                ))}
            </Box>
        );
    };

    return (
        <Box sx={{ p: 3, backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            {/* Header Section */}
            <Card sx={{ p: 3, mb: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', backgroundColor: 'white' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a1a1a', mb: 1 }}>
                            Treaty Config 4
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#6c757d' }}>
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
                            borderRadius: '6px',
                            px: 3,
                            py: 1.5,
                            fontWeight: 600,
                            boxShadow: '0 2px 4px rgba(40, 167, 69, 0.3)'
                        }}
                    >
                        Create New Treaty
                    </Button>
                </Box>
            </Card>

            {/* Data Table */}
            <Card sx={{
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                borderRadius: '8px',
                border: '1px solid #dee2e6',
                overflow: 'hidden'
            }}>
                <Box sx={{
                    p: 3,
                    backgroundColor: '#fff',
                    borderBottom: '1px solid #dee2e6',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a', fontSize: '16px' }}>
                            Treaty Portfolios
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#6c757d', mt: 0.5 }}>
                            {data.length} portfolio{data.length !== 1 ? 's' : ''} found
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: '#28a745'
                        }} />
                        <Typography variant="caption" sx={{ color: '#6c757d', fontSize: '12px' }}>
                            Active
                        </Typography>
                    </Box>
                </Box>

                <CardContent sx={{ p: 0 }}>
                    {loading ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', py: 8, gap: 2 }}>
                            <CircularProgress sx={{ color: '#e91e63' }} />
                            <Typography variant="body2" sx={{ color: '#6c757d' }}>
                                Loading treaty portfolios...
                            </Typography>
                        </Box>
                    ) : (
                        <TableContainer component={Paper} elevation={0} sx={{ maxHeight: '600px', overflow: 'auto' }}>
                            <Table stickyHeader sx={{ minWidth: 650 }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{
                                            fontWeight: 600,
                                            fontSize: '12px',
                                            backgroundColor: '#f8f9fa',
                                            color: '#495057',
                                            textTransform: 'uppercase',
                                            py: 2,
                                            borderBottom: '1px solid #dee2e6',
                                            width: '50px'
                                        }}>
                                        </TableCell>
                                        <TableCell sx={{
                                            fontWeight: 600,
                                            fontSize: '12px',
                                            backgroundColor: '#f8f9fa',
                                            color: '#495057',
                                            textTransform: 'uppercase',
                                            py: 2,
                                            borderBottom: '1px solid #dee2e6'
                                        }}>
                                            Portfolio Name
                                        </TableCell>
                                        <TableCell sx={{
                                            fontWeight: 600,
                                            fontSize: '12px',
                                            backgroundColor: '#f8f9fa',
                                            color: '#495057',
                                            textTransform: 'uppercase',
                                            py: 2,
                                            borderBottom: '1px solid #dee2e6'
                                        }}>
                                            Insurer ID
                                        </TableCell>
                                        <TableCell sx={{
                                            fontWeight: 600,
                                            fontSize: '12px',
                                            backgroundColor: '#f8f9fa',
                                            color: '#495057',
                                            textTransform: 'uppercase',
                                            py: 2,
                                            borderBottom: '1px solid #dee2e6'
                                        }}>
                                            Start Date
                                        </TableCell>
                                        <TableCell sx={{
                                            fontWeight: 600,
                                            fontSize: '12px',
                                            backgroundColor: '#f8f9fa',
                                            color: '#495057',
                                            textTransform: 'uppercase',
                                            py: 2,
                                            borderBottom: '1px solid #dee2e6'
                                        }}>
                                            End Date
                                        </TableCell>
                                        <TableCell sx={{
                                            fontWeight: 600,
                                            fontSize: '12px',
                                            backgroundColor: '#f8f9fa',
                                            color: '#495057',
                                            textTransform: 'uppercase',
                                            py: 2,
                                            borderBottom: '1px solid #dee2e6'
                                        }}>
                                            Currency
                                        </TableCell>
                                        <TableCell sx={{
                                            fontWeight: 600,
                                            fontSize: '12px',
                                            backgroundColor: '#f8f9fa',
                                            color: '#495057',
                                            textTransform: 'uppercase',
                                            py: 2,
                                            borderBottom: '1px solid #dee2e6',
                                            width: '120px',
                                            textAlign: 'center'
                                        }}>
                                            Action
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} sx={{ textAlign: 'center', py: 8, color: '#6c757d' }}>
                                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                                    <Box sx={{
                                                        width: 64,
                                                        height: 64,
                                                        borderRadius: '50%',
                                                        backgroundColor: '#f8f9fa',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        mb: 1
                                                    }}>
                                                        <AddIcon sx={{ fontSize: 24, color: '#6c757d' }} />
                                                    </Box>
                                                    <Typography variant="h6" sx={{ color: '#6c757d', fontWeight: 500 }}>
                                                        No treaties found
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ color: '#adb5bd', mb: 2 }}>
                                                        Create your first treaty configuration to get started
                                                    </Typography>
                                                    <Button
                                                        variant="outlined"
                                                        startIcon={<AddIcon />}
                                                        onClick={handleCreate}
                                                        sx={{
                                                            borderColor: '#28a745',
                                                            color: '#28a745',
                                                            '&:hover': {
                                                                borderColor: '#218838',
                                                                backgroundColor: 'rgba(40, 167, 69, 0.04)'
                                                            },
                                                            textTransform: 'none',
                                                            fontWeight: 500
                                                        }}
                                                    >
                                                        Create Treaty
                                                    </Button>
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
                                                            cursor: 'pointer',
                                                            transform: 'translateY(-1px)',
                                                            transition: 'all 0.2s ease-in-out',
                                                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                                                        },
                                                        borderBottom: '1px solid #e9ecef',
                                                        transition: 'all 0.2s ease-in-out'
                                                    }}
                                                    onClick={() => handleRowClick(row.id)}
                                                >
                                                    <TableCell sx={{ py: 2, px: 2 }}>
                                                        <IconButton
                                                            size="small"
                                                            sx={{
                                                                backgroundColor: expandedRow === row.id ? '#e91e63' : '#f8f9fa',
                                                                color: expandedRow === row.id ? '#fff' : '#6c757d',
                                                                '&:hover': {
                                                                    backgroundColor: expandedRow === row.id ? '#c2185b' : '#e9ecef',
                                                                    transform: 'scale(1.05)'
                                                                },
                                                                width: 32,
                                                                height: 32,
                                                                transition: 'all 0.2s ease-in-out'
                                                            }}
                                                        >
                                                            {expandedRow === row.id ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                                        </IconButton>
                                                    </TableCell>
                                                    <TableCell sx={{
                                                        fontSize: '14px',
                                                        py: 2,
                                                        fontWeight: 600,
                                                        color: '#1a1a1a'
                                                    }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <Box sx={{
                                                                width: 6,
                                                                height: 6,
                                                                borderRadius: '50%',
                                                                backgroundColor: '#28a745'
                                                            }} />
                                                            {row.portfolioName || '-'}
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell sx={{
                                                        fontSize: '13px',
                                                        py: 2,
                                                        color: '#495057'
                                                    }}>
                                                        <Chip
                                                            label={row.insurerId || '-'}
                                                            size="small"
                                                            sx={{
                                                                backgroundColor: '#e3f2fd',
                                                                color: '#1565c0',
                                                                fontWeight: 500,
                                                                fontSize: '11px',
                                                                height: '24px',
                                                                '&:hover': {
                                                                    backgroundColor: '#bbdefb'
                                                                }
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell sx={{
                                                        fontSize: '13px',
                                                        py: 2,
                                                        color: '#495057'
                                                    }}>
                                                        {formatDate(row.startDate)}
                                                    </TableCell>
                                                    <TableCell sx={{
                                                        fontSize: '13px',
                                                        py: 2,
                                                        color: '#495057'
                                                    }}>
                                                        {formatDate(row.endDate)}
                                                    </TableCell>
                                                    <TableCell sx={{
                                                        fontSize: '13px',
                                                        py: 2,
                                                        color: '#495057'
                                                    }}>
                                                        <Chip
                                                            label={row.currency || '-'}
                                                            size="small"
                                                            sx={{
                                                                backgroundColor: '#fff3e0',
                                                                color: '#e65100',
                                                                fontWeight: 500,
                                                                fontSize: '11px',
                                                                height: '24px',
                                                                '&:hover': {
                                                                    backgroundColor: '#ffe0b2'
                                                                }
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell sx={{
                                                        py: 2,
                                                        textAlign: 'center'
                                                    }}>
                                                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                                            <IconButton
                                                                size="small"
                                                                onClick={(e) => handleView(row.id, e)}
                                                                sx={{
                                                                    color: '#18a2b8',
                                                                    '&:hover': {
                                                                        backgroundColor: 'rgba(24, 162, 184, 0.1)',
                                                                        transform: 'scale(1.1)'
                                                                    },
                                                                    padding: '4px',
                                                                    transition: 'all 0.2s ease-in-out'
                                                                }}
                                                            >
                                                                <Visibility sx={{ fontSize: 18 }} />
                                                            </IconButton>
                                                            <IconButton
                                                                size="small"
                                                                onClick={(e) => handleEdit(row.id, e)}
                                                                sx={{
                                                                    color: '#fbac05',
                                                                    '&:hover': {
                                                                        backgroundColor: 'rgba(251, 172, 5, 0.1)',
                                                                        transform: 'scale(1.1)'
                                                                    },
                                                                    padding: '4px',
                                                                    transition: 'all 0.2s ease-in-out'
                                                                }}
                                                            >
                                                                <Edit sx={{ fontSize: 18 }} />
                                                            </IconButton>
                                                        </Box>
                                                    </TableCell>
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
