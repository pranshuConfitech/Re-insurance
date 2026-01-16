'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Box, Card, Typography, CircularProgress, Button, Chip, Grid, Divider, Stack,
    Accordion, AccordionSummary, AccordionDetails, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { format, parseISO } from 'date-fns';
import { ReinsuranceService } from '@/services/remote-api/api/reinsurance-services/reinsurance.service';

const reinsuranceService = new ReinsuranceService();

interface TreatyConfig4ViewComponentProps {
    viewId: string;
}

const TreatyConfig4ViewComponent: React.FC<TreatyConfig4ViewComponentProps> = ({ viewId }) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [portfolioData, setPortfolioData] = useState<any>(null);
    const [expandedBlock, setExpandedBlock] = useState<string | false>('block-0');

    useEffect(() => {
        if (viewId) {
            fetchPortfolioData(viewId);
        }
    }, [viewId]);

    const fetchPortfolioData = (id: string) => {
        setLoading(true);
        reinsuranceService.getPortfolioTreatyById(id).subscribe({
            next: (response) => {
                console.log('Fetched portfolio data:', response);
                setPortfolioData(response?.data);
                setLoading(false);
            },
            error: (error) => {
                console.error('Error fetching portfolio data:', error);
                alert('Failed to load portfolio data. Please try again.');
                setLoading(false);
            }
        });
    };

    const formatDate = (date: string | null) => {
        return date ? format(parseISO(date), 'dd MMM yyyy') : 'N/A';
    };

    const handleBlockChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpandedBlock(isExpanded ? panel : false);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', gap: 2 }}>
                <CircularProgress size={40} />
                <Typography variant="body1" sx={{ color: '#64748b' }}>Loading treaty details...</Typography>
            </Box>
        );
    }

    if (!portfolioData) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', gap: 2 }}>
                <Typography variant="h6" sx={{ color: '#64748b' }}>No data found</Typography>
                <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => router.push('/reinsurance/treaty-config-4')} sx={{ textTransform: 'none' }}>
                    Back to List
                </Button>
            </Box>
        );
    }

    const treatyBlocks = portfolioData['treaty-blocks'] || [];
    const isProportional = treatyBlocks.length > 0 && treatyBlocks[0].blockType === 'PROPORTIONAL';

    return (
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
            <Box sx={{ mb: 3, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 2, p: 3, background: '#e91e63', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
                <Box sx={{ flex: 1 }}>
                    <Typography variant="h5" sx={{ fontWeight: 600, color: 'white', mb: 1.5 }}>{portfolioData.portfolioName}</Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        <Chip label={portfolioData.currency} size="small" sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white', fontWeight: 500, fontSize: '12px' }} />
                        <Chip label={isProportional ? 'Proportional' : 'Non-Proportional'} size="small" sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white', fontWeight: 500, fontSize: '12px' }} />
                        <Chip icon={<CheckCircleIcon sx={{ color: 'white !important', fontSize: '16px' }} />} label="Active" size="small" sx={{ backgroundColor: 'rgba(16, 185, 129, 0.3)', color: 'white', fontWeight: 500, fontSize: '12px' }} />
                    </Stack>
                </Box>
                <Stack direction="row" spacing={1.5}>
                    <Button variant="contained" startIcon={<EditIcon />} onClick={() => router.push(`/reinsurance/treaty-config-4/edit/${viewId}`)} sx={{ backgroundColor: 'white', color: '#e91e63', fontWeight: 500, textTransform: 'none', fontSize: '13px', px: 2.5, boxShadow: 'none', '&:hover': { backgroundColor: '#f8fafc', boxShadow: 'none' } }}>
                        Edit Treaty
                    </Button>
                    <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => router.push('/reinsurance/treaty-config-4')} sx={{ borderColor: 'white', color: 'white', fontWeight: 500, textTransform: 'none', fontSize: '13px', px: 2.5, '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}>
                        Back to List
                    </Button>
                </Stack>
            </Box>

            <Card sx={{ mb: 2, boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <Box sx={{ p: 2.5, borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <DescriptionOutlinedIcon sx={{ color: '#64748b', fontSize: 20 }} />
                    <Typography sx={{ fontWeight: 600, fontSize: '15px', color: '#1e293b' }}>Basic Information</Typography>
                </Box>
                <Box sx={{ p: 3 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <Typography sx={{ fontSize: '12px', color: '#64748b', mb: 0.5 }}>Portfolio Name</Typography>
                            <Typography sx={{ fontSize: '14px', color: '#1e293b', fontWeight: 500 }}>{portfolioData.portfolioName}</Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography sx={{ fontSize: '12px', color: '#64748b', mb: 0.5 }}>Insurer ID</Typography>
                            <Typography sx={{ fontSize: '14px', color: '#1e293b', fontWeight: 500 }}>{portfolioData.insurerId}</Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography sx={{ fontSize: '12px', color: '#64748b', mb: 0.5 }}>Currency</Typography>
                            <Typography sx={{ fontSize: '14px', color: '#1e293b', fontWeight: 500 }}>{portfolioData.currency}</Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography sx={{ fontSize: '12px', color: '#64748b', mb: 0.5 }}>Start Date</Typography>
                            <Typography sx={{ fontSize: '14px', color: '#1e293b', fontWeight: 500 }}>{formatDate(portfolioData.startDate)}</Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography sx={{ fontSize: '12px', color: '#64748b', mb: 0.5 }}>End Date</Typography>
                            <Typography sx={{ fontSize: '14px', color: '#1e293b', fontWeight: 500 }}>{formatDate(portfolioData.endDate)}</Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography sx={{ fontSize: '12px', color: '#64748b', mb: 0.5 }}>Treaty Type</Typography>
                            <Typography sx={{ fontSize: '14px', color: '#1e293b', fontWeight: 500 }}>{isProportional ? 'Proportional' : 'Non-Proportional'}</Typography>
                        </Grid>
                    </Grid>
                    <Divider sx={{ my: 2.5 }} />
                    <Box>
                        <Typography sx={{ fontSize: '12px', color: '#64748b', mb: 1 }}>Operating Units</Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {portfolioData.operatingUnits?.length > 0 ? (
                                portfolioData.operatingUnits.map((ou: any, index: number) => (
                                    <Chip key={index} label={ou.ouCode} size="small" sx={{ backgroundColor: '#e91e63', color: 'white', fontWeight: 500, fontSize: '12px', height: '24px' }} />
                                ))
                            ) : (
                                <Typography sx={{ color: '#94a3b8', fontSize: '13px', fontStyle: 'italic' }}>No operating units</Typography>
                            )}
                        </Box>
                    </Box>
                </Box>
            </Card>

            {treatyBlocks.map((block: any, blockIndex: number) => (
                <Accordion key={block.id} expanded={expandedBlock === `block-${blockIndex}`} onChange={handleBlockChange(`block-${blockIndex}`)} sx={{ mb: 2, boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', borderRadius: '8px !important', border: '1px solid #e2e8f0', '&:before': { display: 'none' }, '&.Mui-expanded': { margin: '0 0 16px 0' } }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: '#f8fafc', borderRadius: '8px', minHeight: '56px', '&.Mui-expanded': { minHeight: '56px', borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }, '& .MuiAccordionSummary-content': { my: 1.5 } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#e91e63' }} />
                            <Typography sx={{ fontWeight: 600, fontSize: '14px', color: '#1e293b', flex: 1 }}>Block {block.sortOrder || blockIndex + 1}</Typography>
                            <Chip label={`${block.treaties?.length || 0} ${block.treaties?.length === 1 ? 'Treaty' : 'Treaties'}`} size="small" sx={{ backgroundColor: '#e91e63', color: 'white', fontWeight: 500, fontSize: '11px', height: '22px' }} />
                            <Typography sx={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>{block.blockType}</Typography>
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: 3, backgroundColor: '#ffffff' }}>
                        {block.treaties?.map((treaty: any, treatyIndex: number) => (
                            <Accordion key={treaty.id} sx={{ mb: 2, boxShadow: 'none', border: '1px solid #e2e8f0', borderRadius: '8px !important', '&:last-child': { mb: 0 }, '&:before': { display: 'none' } }}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: '#f8fafc', borderRadius: '8px', '&.Mui-expanded': { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }, minHeight: '56px', '& .MuiAccordionSummary-content': { my: 1.5 } }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', pr: 1 }}>
                                        <Typography sx={{ fontWeight: 600, fontSize: '14px', color: '#e91e63' }}>Treaty: {treaty.treatyName}</Typography>
                                        <Chip label={treaty.status || 'ACTIVE'} size="small" sx={{ backgroundColor: '#dcfce7', color: '#166534', fontWeight: 500, fontSize: '11px', height: '22px' }} />
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails sx={{ p: 2.5 }}>
                                    <Box sx={{ mb: 3 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, pb: 1.5, borderBottom: '1px solid #e2e8f0' }}>
                                            <DescriptionOutlinedIcon sx={{ fontSize: 18, color: '#e91e63' }} />
                                            <Typography sx={{ fontWeight: 600, fontSize: '14px', color: '#1e293b' }}>Treaty Information</Typography>
                                        </Box>
                                        <Grid container spacing={2.5}>
                                            <Grid item xs={12} md={6}>
                                                <Box sx={{ mb: 2 }}>
                                                    <Typography sx={{ fontSize: '12px', color: '#64748b', mb: 0.5 }}>Treaty Code</Typography>
                                                    <Typography sx={{ fontSize: '13px', color: '#1e293b', fontWeight: 500 }}>{treaty.treatyCode || '-'}</Typography>
                                                </Box>
                                                <Box sx={{ mb: 2 }}>
                                                    <Typography sx={{ fontSize: '12px', color: '#64748b', mb: 0.5 }}>Priority</Typography>
                                                    <Typography sx={{ fontSize: '13px', color: '#1e293b', fontWeight: 500 }}>{treaty.priority || '-'}</Typography>
                                                </Box>
                                                <Box sx={{ mb: 2 }}>
                                                    <Typography sx={{ fontSize: '12px', color: '#64748b', mb: 0.5 }}>Treaty Type</Typography>
                                                    <Typography sx={{ fontSize: '13px', color: '#1e293b', fontWeight: 500 }}>{treaty.treatyType || '-'}</Typography>
                                                </Box>
                                                <Box>
                                                    <Typography sx={{ fontSize: '12px', color: '#64748b', mb: 0.5 }}>Treaty Category</Typography>
                                                    <Typography sx={{ fontSize: '13px', color: '#1e293b', fontWeight: 500 }}>{treaty.treatyCategory || '-'}</Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <Box sx={{ mb: 2 }}>
                                                    <Typography sx={{ fontSize: '12px', color: '#64748b', mb: 0.5 }}>Reference Number</Typography>
                                                    <Typography sx={{ fontSize: '13px', color: '#1e293b', fontWeight: 500 }}>{treaty.refNumber || '-'}</Typography>
                                                </Box>
                                                <Box sx={{ mb: 2 }}>
                                                    <Typography sx={{ fontSize: '12px', color: '#64748b', mb: 0.5 }}>Graded Retention</Typography>
                                                    <Typography sx={{ fontSize: '13px', color: '#1e293b', fontWeight: 500 }}>{treaty.gradedRetention ? 'Yes' : 'No'}</Typography>
                                                </Box>
                                                <Box sx={{ mb: 2 }}>
                                                    <Typography sx={{ fontSize: '12px', color: '#64748b', mb: 0.5 }}>Former Treaty Code</Typography>
                                                    <Typography sx={{ fontSize: '13px', color: '#1e293b', fontWeight: 500 }}>{treaty.formerTreatyCode || '-'}</Typography>
                                                </Box>
                                                <Box>
                                                    <Typography sx={{ fontSize: '12px', color: '#64748b', mb: 0.5 }}>Processing Method</Typography>
                                                    <Typography sx={{ fontSize: '13px', color: '#1e293b', fontWeight: 500 }}>{treaty.processingMethod || '-'}</Typography>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                    {treaty.propTreatyAttribute && (
                                        <Box sx={{ mb: 3 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, pb: 1.5, borderBottom: '1px solid #e2e8f0' }}>
                                                <DescriptionOutlinedIcon sx={{ fontSize: 18, color: '#e91e63' }} />
                                                <Typography sx={{ fontWeight: 600, fontSize: '14px', color: '#1e293b' }}>Proportional Treaty Attributes</Typography>
                                            </Box>
                                            <Grid container spacing={2.5}>
                                                <Grid item xs={12} md={6}>
                                                    <Box sx={{ mb: 2 }}>
                                                        <Typography sx={{ fontSize: '12px', color: '#64748b', mb: 0.5 }}>Installment Type</Typography>
                                                        <Typography sx={{ fontSize: '13px', color: '#1e293b', fontWeight: 500 }}>{treaty.propTreatyAttribute.installmentType || '-'}</Typography>
                                                    </Box>
                                                    <Box sx={{ mb: 2 }}>
                                                        <Typography sx={{ fontSize: '12px', color: '#64748b', mb: 0.5 }}>Prem Reserve Retained Rate (%)</Typography>
                                                        <Typography sx={{ fontSize: '13px', color: '#1e293b', fontWeight: 500 }}>{treaty.propTreatyAttribute.premReserveRetainedRate ?? '-'}</Typography>
                                                    </Box>
                                                    <Box sx={{ mb: 2 }}>
                                                        <Typography sx={{ fontSize: '12px', color: '#64748b', mb: 0.5 }}>Prem Reserve Interest Rate (%)</Typography>
                                                        <Typography sx={{ fontSize: '13px', color: '#1e293b', fontWeight: 500 }}>{treaty.propTreatyAttribute.premReserveInterestRate ?? '-'}</Typography>
                                                    </Box>
                                                    <Box sx={{ mb: 2 }}>
                                                        <Typography sx={{ fontSize: '12px', color: '#64748b', mb: 0.5 }}>Portfolio Prem Entry Rate (%)</Typography>
                                                        <Typography sx={{ fontSize: '13px', color: '#1e293b', fontWeight: 500 }}>{treaty.propTreatyAttribute.portfolioPremEntryRate ?? '-'}</Typography>
                                                    </Box>
                                                    <Box>
                                                        <Typography sx={{ fontSize: '12px', color: '#64748b', mb: 0.5 }}>Management Expenses (%)</Typography>
                                                        <Typography sx={{ fontSize: '13px', color: '#1e293b', fontWeight: 500 }}>{treaty.propTreatyAttribute.mgmtExpensesPercent ?? '-'}</Typography>
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <Box sx={{ mb: 2 }}>
                                                        <Typography sx={{ fontSize: '12px', color: '#64748b', mb: 0.5 }}>Portfolio Claim Entry Rate (%)</Typography>
                                                        <Typography sx={{ fontSize: '13px', color: '#1e293b', fontWeight: 500 }}>{treaty.propTreatyAttribute.portfolioClaimEntryRate ?? '-'}</Typography>
                                                    </Box>
                                                    <Box sx={{ mb: 2 }}>
                                                        <Typography sx={{ fontSize: '12px', color: '#64748b', mb: 0.5 }}>Portfolio Prem Withd Rate (%)</Typography>
                                                        <Typography sx={{ fontSize: '13px', color: '#1e293b', fontWeight: 500 }}>{treaty.propTreatyAttribute.portfolioPremWithdRate ?? '-'}</Typography>
                                                    </Box>
                                                    <Box sx={{ mb: 2 }}>
                                                        <Typography sx={{ fontSize: '12px', color: '#64748b', mb: 0.5 }}>Portfolio Claim Withd Rate (%)</Typography>
                                                        <Typography sx={{ fontSize: '13px', color: '#1e293b', fontWeight: 500 }}>{treaty.propTreatyAttribute.portfolioClaimWithdRate ?? '-'}</Typography>
                                                    </Box>
                                                    <Box>
                                                        <Typography sx={{ fontSize: '12px', color: '#64748b', mb: 0.5 }}>Taxes (%)</Typography>
                                                        <Typography sx={{ fontSize: '13px', color: '#1e293b', fontWeight: 500 }}>{treaty.propTreatyAttribute.taxesPercent ?? '-'}</Typography>
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    )}
                                    {treaty.propRiskDetails?.length > 0 && (
                                        <Box sx={{ mb: 3 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, pb: 1.5, borderBottom: '1px solid #e2e8f0' }}>
                                                <DescriptionOutlinedIcon sx={{ fontSize: 18, color: '#e91e63' }} />
                                                <Typography sx={{ fontWeight: 600, fontSize: '14px', color: '#1e293b' }}>Risk Details ({treaty.propRiskDetails.length})</Typography>
                                            </Box>
                                            <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                                                <Table size="small">
                                                    <TableHead>
                                                        <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                                                            <TableCell sx={{ fontWeight: 600, fontSize: '12px', color: '#64748b', py: 1.5 }}>Product LOB</TableCell>
                                                            <TableCell sx={{ fontWeight: 600, fontSize: '12px', color: '#64748b' }}>Product Code</TableCell>
                                                            <TableCell sx={{ fontWeight: 600, fontSize: '12px', color: '#64748b' }}>Risk Category</TableCell>
                                                            <TableCell sx={{ fontWeight: 600, fontSize: '12px', color: '#64748b' }}>Grade</TableCell>
                                                            <TableCell sx={{ fontWeight: 600, fontSize: '12px', color: '#64748b', textAlign: 'right' }}>Cession %</TableCell>
                                                            <TableCell sx={{ fontWeight: 600, fontSize: '12px', color: '#64748b', textAlign: 'right' }}>Max Capacity</TableCell>
                                                            <TableCell sx={{ fontWeight: 600, fontSize: '12px', color: '#64748b', textAlign: 'right' }}>Retention</TableCell>
                                                            <TableCell sx={{ fontWeight: 600, fontSize: '12px', color: '#64748b', textAlign: 'right' }}>Event Limit</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {treaty.propRiskDetails.map((risk: any) => (
                                                            <TableRow key={risk.id} sx={{ '&:hover': { backgroundColor: '#f8fafc' } }}>
                                                                <TableCell sx={{ fontSize: '12px', py: 1.5 }}>{risk.productLob || '-'}</TableCell>
                                                                <TableCell sx={{ fontSize: '12px' }}>{risk.productCode || '-'}</TableCell>
                                                                <TableCell sx={{ fontSize: '12px' }}>{risk.riskCategory || '-'}</TableCell>
                                                                <TableCell sx={{ fontSize: '12px' }}>
                                                                    <Chip label={risk.riskGrade} size="small" sx={{ height: '20px', fontSize: '11px', backgroundColor: '#e0e7ff', color: '#4338ca' }} />
                                                                </TableCell>
                                                                <TableCell sx={{ fontSize: '12px', textAlign: 'right', fontWeight: 500 }}>{risk.cessionRate ?? '-'}%</TableCell>
                                                                <TableCell sx={{ fontSize: '12px', textAlign: 'right' }}>{risk.quotaCessionMaxCapacity?.toLocaleString() ?? '-'}</TableCell>
                                                                <TableCell sx={{ fontSize: '12px', textAlign: 'right' }}>{risk.retentionAmount?.toLocaleString() ?? '-'}</TableCell>
                                                                <TableCell sx={{ fontSize: '12px', textAlign: 'right' }}>{risk.eventLimit?.toLocaleString() ?? '-'}</TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </Box>
                                    )}
                                    {treaty.portfolioTreatyAllocations?.length > 0 && (
                                        <Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, pb: 1.5, borderBottom: '1px solid #e2e8f0' }}>
                                                <DescriptionOutlinedIcon sx={{ fontSize: 18, color: '#e91e63' }} />
                                                <Typography sx={{ fontWeight: 600, fontSize: '14px', color: '#1e293b' }}>Allocations ({treaty.portfolioTreatyAllocations.length})</Typography>
                                            </Box>
                                            <Grid container spacing={2}>
                                                {treaty.portfolioTreatyAllocations.map((allocation: any) => (
                                                    <Grid item xs={12} sm={6} md={4} key={allocation.id}>
                                                        <Box sx={{ p: 2, backgroundColor: allocation.participantType === 'REINSURER' ? '#eff6ff' : '#fff7ed', border: '1px solid', borderColor: allocation.participantType === 'REINSURER' ? '#bfdbfe' : '#fed7aa', borderRadius: '6px' }}>
                                                            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                                                                <Typography sx={{ fontSize: '13px', color: allocation.participantType === 'REINSURER' ? '#1e40af' : '#9a3412', fontWeight: 600 }}>{allocation.participantName}</Typography>
                                                                <Chip label={`${allocation.sharePercent}%`} size="small" sx={{ backgroundColor: allocation.participantType === 'REINSURER' ? '#3b82f6' : '#f97316', color: 'white', fontWeight: 600, fontSize: '11px', height: '22px' }} />
                                                            </Stack>
                                                            <Chip label={allocation.participantType} size="small" sx={{ fontSize: '10px', height: '18px', backgroundColor: 'rgba(255, 255, 255, 0.7)', color: allocation.participantType === 'REINSURER' ? '#1e40af' : '#9a3412', fontWeight: 500 }} />
                                                        </Box>
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        </Box>
                                    )}
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </AccordionDetails>
                </Accordion>
            ))}
        </Box>
    );
};

export default TreatyConfig4ViewComponent;
