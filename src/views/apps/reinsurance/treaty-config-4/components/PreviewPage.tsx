'use client';
import { Box, Card, Typography, Grid, Chip, Divider, Paper, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import BusinessIcon from '@mui/icons-material/Business';
import AssessmentIcon from '@mui/icons-material/Assessment';
import GroupIcon from '@mui/icons-material/Group';
import SettingsIcon from '@mui/icons-material/Settings';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { format } from 'date-fns';

interface PreviewPageProps {
    formValues: any;
}

export const PreviewPage = ({ formValues }: PreviewPageProps) => {
    const formatDate = (date: Date | null) => date ? format(date, 'dd MMM yyyy') : 'N/A';

    const InfoRow = ({ label, value }: { label: string; value: any }) => (
        <Box sx={{ mb: 2 }}>
            <Typography sx={{ fontSize: '12px', color: '#64748b', mb: 0.5, fontWeight: 500 }}>
                {label}
            </Typography>
            <Typography sx={{ fontSize: '14px', color: '#1e293b', fontWeight: 500 }}>
                {value || 'N/A'}
            </Typography>
        </Box>
    );

    const SectionCard = ({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) => (
        <Card sx={{ mb: 3, boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <Box sx={{ p: 2.5, borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 1.5, backgroundColor: '#f8fafc' }}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 32,
                    height: 32,
                    borderRadius: '6px',
                    backgroundColor: '#D80E51',
                    color: 'white'
                }}>
                    {icon}
                </Box>
                <Typography sx={{ fontWeight: 600, fontSize: '15px', color: '#1e293b' }}>{title}</Typography>
            </Box>
            <Box sx={{ p: 3 }}>
                {children}
            </Box>
        </Card>
    );

    const BlockCard = ({ block, blockIndex }: { block: any; blockIndex: number }) => (
        <Accordion defaultExpanded sx={{ mb: 3, boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', borderRadius: '8px !important', border: '1px solid #e2e8f0', '&:before': { display: 'none' } }}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                    p: 2.5,
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px',
                    '&.Mui-expanded': {
                        borderBottomLeftRadius: 0,
                        borderBottomRightRadius: 0
                    },
                    '& .MuiAccordionSummary-content': {
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5
                    }
                }}
            >
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#D80E51' }} />
                <Typography sx={{ fontWeight: 600, fontSize: '15px', color: '#1e293b', flex: 1 }}>
                    Block {block.blockNumber}
                </Typography>
                <Chip
                    label={`${block.treaties?.length || 0} ${block.treaties?.length === 1 ? 'Treaty' : 'Treaties'}`}
                    size="small"
                    sx={{ backgroundColor: '#D80E51', color: 'white', fontWeight: 500, fontSize: '11px', height: '22px' }}
                />
            </AccordionSummary>
            <AccordionDetails sx={{ p: 3, backgroundColor: '#ffffff' }}>
                {block.treaties?.map((treaty: any, treatyIndex: number) => (
                    <TreatyCard key={treaty.id} treaty={treaty} treatyIndex={treatyIndex} blockIndex={blockIndex} />
                ))}
            </AccordionDetails>
        </Accordion>
    );

    const TreatyCard = ({ treaty, treatyIndex, blockIndex }: { treaty: any; treatyIndex: number; blockIndex: number }) => (
        <Paper sx={{ mb: 3, p: 3, border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: '#ffffff' }}>
            <Box sx={{ mb: 3, pb: 2, borderBottom: '1px solid #e2e8f0' }}>
                <Typography sx={{ fontWeight: 600, fontSize: '16px', color: '#1e293b', mb: 1 }}>
                    Treaty {blockIndex + 1}.{treatyIndex + 1}: {treaty.treatyName || 'Unnamed Treaty'}
                </Typography>
                <Chip label="Active" size="small" sx={{ backgroundColor: '#dcfce7', color: '#166534', fontWeight: 500, fontSize: '11px' }} />
            </Box>

            {/* Treaty Information */}
            <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                    <BusinessIcon sx={{ fontSize: 18, color: '#D80E51' }} />
                    <Typography sx={{ fontWeight: 600, fontSize: '14px', color: '#1e293b' }}>Treaty Information</Typography>
                </Box>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <InfoRow label="Treaty Code" value={treaty.treatyCode} />
                        <InfoRow label="Priority" value={treaty.priority} />
                        <InfoRow label="Treaty Type" value={treaty.treatyType} />
                        <InfoRow label="Treaty Category" value={treaty.treatyCategory} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <InfoRow label="Reference Number" value={treaty.businessTreatyReferenceNumber} />
                        <InfoRow label="RI Graded Ret" value={treaty.riGradedRet} />
                        <InfoRow label="Former Treaty Code" value={treaty.formerTreatyCode} />
                        <InfoRow label="Processing Method" value={treaty.processingPortfolioMethod} />
                    </Grid>
                </Grid>
            </Box>

            {/* Risk Limits */}
            {treaty.riskLimitLines?.length > 0 && (
                <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                        <AssessmentIcon sx={{ fontSize: 18, color: '#D80E51' }} />
                        <Typography sx={{ fontWeight: 600, fontSize: '14px', color: '#1e293b' }}>
                            Risk Limits ({treaty.riskLimitLines.length})
                        </Typography>
                    </Box>
                    {treaty.riskLimitLines.map((line: any, lineIndex: number) => (
                        <Paper key={line.id} sx={{ mb: 2, p: 2, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                            <Typography sx={{ fontWeight: 600, fontSize: '13px', color: '#1e293b', mb: 2 }}>
                                Risk Line {lineIndex + 1}
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6} md={3}>
                                    <InfoRow label="Product LOB" value={line.productLOB} />
                                    <InfoRow label="Risk Category" value={line.riskCategory} />
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <InfoRow label="Product Code" value={line.productCode} />
                                    <InfoRow label="Risk Grade" value={line.riskGrade} />
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <InfoRow label="Cession Rate (%)" value={line.cessionRate} />
                                    <InfoRow label="Event Limit" value={line.eventLimit} />
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <InfoRow label="Cash Call Limit" value={line.cashCallLimit} />
                                    <InfoRow label="Alert Days" value={line.alertDays} />
                                </Grid>
                            </Grid>
                        </Paper>
                    ))}
                </Box>
            )}

            {/* Participants */}
            {(treaty.reinsurers?.length > 0 || treaty.brokers?.length > 0) && (
                <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                        <GroupIcon sx={{ fontSize: 18, color: '#D80E51' }} />
                        <Typography sx={{ fontWeight: 600, fontSize: '14px', color: '#1e293b' }}>Participants</Typography>
                    </Box>

                    {treaty.reinsurers?.length > 0 && (
                        <Box sx={{ mb: 2 }}>
                            <Typography sx={{ fontSize: '12px', color: '#64748b', mb: 1, fontWeight: 500 }}>
                                Reinsurers ({treaty.reinsurers.length})
                            </Typography>
                            <Grid container spacing={1}>
                                {treaty.reinsurers.map((reinsurer: any) => (
                                    <Grid item xs={12} sm={6} md={4} key={reinsurer.id}>
                                        <Box sx={{
                                            p: 1.5,
                                            backgroundColor: '#eff6ff',
                                            border: '1px solid #bfdbfe',
                                            borderRadius: '6px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between'
                                        }}>
                                            <Typography sx={{ fontSize: '12px', color: '#1e293b', fontWeight: 500 }}>
                                                {reinsurer.reinsurer || 'N/A'}
                                            </Typography>
                                            <Chip
                                                label={`${reinsurer.share}%`}
                                                size="small"
                                                sx={{
                                                    backgroundColor: '#3b82f6',
                                                    color: 'white',
                                                    fontWeight: 600,
                                                    fontSize: '11px',
                                                    height: '20px'
                                                }}
                                            />
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    )}

                    {treaty.brokers?.length > 0 && (
                        <Box>
                            <Typography sx={{ fontSize: '12px', color: '#64748b', mb: 1, fontWeight: 500 }}>
                                Brokers ({treaty.brokers.length})
                            </Typography>
                            <Grid container spacing={1}>
                                {treaty.brokers.map((broker: any) => (
                                    <Grid item xs={12} sm={6} md={4} key={broker.id}>
                                        <Box sx={{
                                            p: 1.5,
                                            backgroundColor: '#fef3c7',
                                            border: '1px solid #fde68a',
                                            borderRadius: '6px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between'
                                        }}>
                                            <Typography sx={{ fontSize: '12px', color: '#1e293b', fontWeight: 500 }}>
                                                {broker.broker || 'N/A'}
                                            </Typography>
                                            <Chip
                                                label={`${broker.share}%`}
                                                size="small"
                                                sx={{
                                                    backgroundColor: '#f59e0b',
                                                    color: 'white',
                                                    fontWeight: 600,
                                                    fontSize: '11px',
                                                    height: '20px'
                                                }}
                                            />
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    )}
                </Box>
            )}

            {/* Special Condition */}
            <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                    <SettingsIcon sx={{ fontSize: 18, color: '#D80E51' }} />
                    <Typography sx={{ fontWeight: 600, fontSize: '14px', color: '#1e293b' }}>Special Condition</Typography>
                </Box>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <InfoRow label="Installment" value={treaty.installment} />
                        <InfoRow label="Prem Reserve Retained Rate (%)" value={treaty.premReserveRetainedRate} />
                        <InfoRow label="Portfolio Prem Entry Rate (%)" value={treaty.portfolioPremiumEntryRate} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <InfoRow label="Management Expenses (%)" value={treaty.managementExpenses} />
                        <InfoRow label="Taxes And Other Expenses (%)" value={treaty.taxesAndOtherExpenses} />
                        <InfoRow label="Portfolio Claim Entry Rate (%)" value={treaty.portfolioClaimEntryRate} />
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    );

    return (
        <Box sx={{ maxHeight: 'calc(100vh - 300px)', overflowY: 'auto', pr: 2 }}>
            {/* Basic Detail Section */}
            <SectionCard icon={<DescriptionOutlinedIcon sx={{ fontSize: 18 }} />} title="Basic Detail">
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <InfoRow label="Portfolio Name" value={formValues.portfolio} />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <InfoRow label="Company" value={formValues.companyUIN} />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <InfoRow label="Currency" value={formValues.currency} />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <InfoRow label="Start Date" value={formatDate(formValues.treatyStartDate)} />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <InfoRow label="End Date" value={formatDate(formValues.treatyEndDate)} />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <InfoRow label="Treaty Type" value={formValues.selectMode} />
                    </Grid>
                </Grid>
                <Divider sx={{ my: 2.5 }} />
                <Box>
                    <Typography sx={{ fontSize: '12px', color: '#64748b', mb: 1, fontWeight: 500 }}>Operating Units</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {formValues.operatingUnitUINs?.length > 0 ? (
                            formValues.operatingUnitUINs.map((uin: string, index: number) => (
                                <Chip key={index} label={uin} size="small" sx={{ backgroundColor: '#D80E51', color: 'white', fontWeight: 500, fontSize: '12px', height: '24px' }} />
                            ))
                        ) : (
                            <Typography sx={{ color: '#94a3b8', fontSize: '13px', fontStyle: 'italic' }}>No operating units</Typography>
                        )}
                    </Box>
                </Box>
            </SectionCard>

            {/* Proportional Blocks */}
            {formValues.selectMode === 'Treaty (Proportional)' && formValues.blocks?.map((block: any, blockIndex: number) => (
                <BlockCard key={block.id} block={block} blockIndex={blockIndex} />
            ))}

            {/* Non-Proportional Blocks */}
            {formValues.selectMode === 'Treaty (Non Proportional)' && formValues.nonProportionalBlocks?.map((block: any, blockIndex: number) => (
                <Accordion key={block.id} defaultExpanded sx={{ mb: 3, boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', borderRadius: '8px !important', border: '1px solid #e2e8f0', '&:before': { display: 'none' } }}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        sx={{
                            p: 2.5,
                            backgroundColor: '#f8fafc',
                            borderRadius: '8px',
                            '&.Mui-expanded': {
                                borderBottomLeftRadius: 0,
                                borderBottomRightRadius: 0
                            },
                            '& .MuiAccordionSummary-content': {
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5
                            }
                        }}
                    >
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#D80E51' }} />
                        <Typography sx={{ fontWeight: 600, fontSize: '15px', color: '#1e293b', flex: 1 }}>
                            Block {block.blockNumber}
                        </Typography>
                        <Chip label="Non-Proportional" size="small" sx={{ backgroundColor: '#D80E51', color: 'white', fontWeight: 500, fontSize: '11px', height: '22px' }} />
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: 3, backgroundColor: '#ffffff' }}>
                        <Paper sx={{ p: 3, border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: '#ffffff' }}>
                            <Box sx={{ mb: 3, pb: 2, borderBottom: '1px solid #e2e8f0' }}>
                                <Typography sx={{ fontWeight: 600, fontSize: '16px', color: '#1e293b', mb: 1 }}>
                                    {block.treaty.treatyName || `Block ${block.blockNumber} Treaty`}
                                </Typography>
                                <Chip label="Active" size="small" sx={{ backgroundColor: '#dcfce7', color: '#166534', fontWeight: 500, fontSize: '11px' }} />
                            </Box>

                            {/* Non-Proportional Treaty Information */}
                            <Box sx={{ mb: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                                    <TrendingUpIcon sx={{ fontSize: 18, color: '#D80E51' }} />
                                    <Typography sx={{ fontWeight: 600, fontSize: '14px', color: '#1e293b' }}>Non-Proportional Treaty Details</Typography>
                                </Box>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <InfoRow label="Treaty Code" value={block.treaty.treatyCode} />
                                        <InfoRow label="Treaty Type" value={block.treaty.treatyType} />
                                        <InfoRow label="Annual Aggregate Limit" value={block.treaty.annualAggregateLimit} />
                                        <InfoRow label="Capacity" value={block.treaty.capacity} />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <InfoRow label="Priority" value={block.treaty.priority} />
                                        <InfoRow label="XOL Type" value={block.treaty.xolType} />
                                        <InfoRow label="Annual Agg Deductible" value={block.treaty.annualAggDeductible} />
                                        <InfoRow label="Flat Rate XOL Prem" value={block.treaty.flatRateXOLPrem} />
                                    </Grid>
                                </Grid>
                            </Box>
                        </Paper>
                    </AccordionDetails>
                </Accordion>
            ))}
        </Box>
    );
};
