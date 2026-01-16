'use client';
import { Box, Card, Typography, Accordion, AccordionSummary, AccordionDetails, Grid, Chip, Divider } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { format } from 'date-fns';
import { getBlockColor } from '../utils/blockColors';

interface PreviewPageProps {
    formValues: any;
}

export const PreviewPage = ({ formValues }: PreviewPageProps) => {
    const formatDate = (date: Date | null) => date ? format(date, 'dd MMM yyyy') : 'N/A';

    const InfoRow = ({ label, value }: { label: string; value: any }) => (
        <Box sx={{ display: 'flex', mb: 1.5, alignItems: 'flex-start' }}>
            <Typography sx={{ fontWeight: 600, color: '#495057', minWidth: '220px', fontSize: '13px' }}>
                {label}:
            </Typography>
            <Typography sx={{ color: '#212529', fontSize: '13px', flex: 1 }}>
                {value || 'N/A'}
            </Typography>
        </Box>
    );

    const SectionHeader = ({ icon, title }: { icon: string; title: string }) => (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            mb: 2,
            pb: 1.5,
            borderBottom: '2px solid #e0e0e0'
        }}>
            <Box sx={{
                fontSize: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 32,
                height: 32,
                borderRadius: '8px',
                backgroundColor: '#f0f7ff'
            }}>
                {icon}
            </Box>
            <Typography sx={{
                fontWeight: 700,
                fontSize: '15px',
                color: '#1a1a1a',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
            }}>
                {title}
            </Typography>
        </Box>
    );

    return (
        <Box sx={{ maxHeight: 'calc(100vh - 300px)', overflowY: 'auto', pr: 2 }}>
            {/* Basic Configuration Section */}
            <Accordion defaultExpanded sx={{
                mb: 2,
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                borderRadius: '12px !important',
                border: '1px solid #e0e0e0',
                '&:before': { display: 'none' }
            }}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{
                        backgroundColor: '#f8f9fa',
                        borderRadius: '12px',
                        minHeight: '64px',
                        '&:hover': { backgroundColor: '#e9ecef' },
                        '& .MuiAccordionSummary-content': { my: 2 }
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{
                            fontSize: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 40,
                            height: 40,
                            borderRadius: '10px',
                            backgroundColor: '#e3f2fd'
                        }}>
                            📋
                        </Box>
                        <Typography sx={{ fontWeight: 700, fontSize: '16px', color: '#1a1a1a' }}>
                            Basic Configuration
                        </Typography>
                    </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 3, backgroundColor: '#fafbfc' }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <InfoRow label="Portfolio Name" value={formValues.portfolio} />
                            <InfoRow label="Company UIN" value={formValues.companyUIN} />
                            <InfoRow label="Currency" value={formValues.currency} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <InfoRow label="Treaty Start Date" value={formatDate(formValues.treatyStartDate)} />
                            <InfoRow label="Treaty End Date" value={formatDate(formValues.treatyEndDate)} />
                            <InfoRow label="Treaty Mode" value={formValues.selectMode} />
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', mb: 1.5, alignItems: 'flex-start' }}>
                                <Typography sx={{ fontWeight: 600, color: '#495057', minWidth: '220px', fontSize: '13px' }}>
                                    Operating Units:
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, flex: 1 }}>
                                    {formValues.operatingUnitUINs?.length > 0 ? (
                                        formValues.operatingUnitUINs.map((uin: string, index: number) => (
                                            <Chip
                                                key={index}
                                                label={uin}
                                                size="small"
                                                sx={{
                                                    backgroundColor: '#e3f2fd',
                                                    color: '#1976d2',
                                                    fontWeight: 600,
                                                    fontSize: '12px'
                                                }}
                                            />
                                        ))
                                    ) : (
                                        <Typography sx={{ color: '#6c757d', fontSize: '13px', fontStyle: 'italic' }}>None</Typography>
                                    )}
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion>

            {/* Proportional Blocks Section */}
            {formValues.selectMode === 'Treaty (Proportional)' && formValues.blocks?.map((block: any, blockIndex: number) => {
                const blockColor = getBlockColor(block.blockNumber);
                return (
                    <Accordion
                        key={block.id}
                        defaultExpanded={blockIndex === 0}
                        sx={{
                            mb: 2,
                            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                            borderRadius: '12px !important',
                            border: `2px solid ${blockColor.border}`,
                            '&:before': { display: 'none' }
                        }}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            sx={{
                                backgroundColor: blockColor.bg,
                                borderRadius: '12px',
                                minHeight: '64px',
                                '&:hover': { backgroundColor: blockColor.border },
                                '& .MuiAccordionSummary-content': { my: 2 }
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box sx={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: '50%',
                                    backgroundColor: blockColor.accent,
                                    boxShadow: `0 0 0 4px ${blockColor.light}60`
                                }} />
                                <Typography sx={{ fontWeight: 700, fontSize: '16px', color: '#1a1a1a' }}>
                                    Block {block.blockNumber}
                                </Typography>
                                <Chip
                                    label={`${block.treaties?.length || 0} ${block.treaties?.length === 1 ? 'Treaty' : 'Treaties'}`}
                                    size="small"
                                    sx={{
                                        backgroundColor: blockColor.accent,
                                        color: 'white',
                                        fontWeight: 600,
                                        fontSize: '11px'
                                    }}
                                />
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails sx={{ p: 3, backgroundColor: '#fafbfc' }}>
                            {block.treaties?.map((treaty: any, treatyIndex: number) => (
                                <Card key={treaty.id} sx={{
                                    mb: 3,
                                    boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
                                    border: '1px solid #e0e0e0',
                                    borderRadius: '10px',
                                    overflow: 'hidden'
                                }}>
                                    {/* Treaty Header */}
                                    <Box sx={{
                                        p: 2.5,
                                        backgroundColor: '#f5f7fa',
                                        borderBottom: '2px solid #007bff'
                                    }}>
                                        <Typography sx={{
                                            fontWeight: 700,
                                            fontSize: '15px',
                                            color: '#1a1a1a'
                                        }}>
                                            Treaty {blockIndex + 1}.{treatyIndex + 1}: {treaty.treatyName || 'Unnamed Treaty'}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ p: 3 }}>
                                        {/* 1. Treaty Information */}
                                        <SectionHeader icon="📄" title="Treaty Information" />
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} md={6}>
                                                <InfoRow label="Treaty Code" value={treaty.treatyCode} />
                                                <InfoRow label="Priority" value={treaty.priority} />
                                                <InfoRow label="Treaty Type" value={treaty.treatyType} />
                                                <InfoRow label="Treaty Category" value={treaty.treatyCategory} />
                                                <InfoRow label="Installment" value={treaty.installment} />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <InfoRow label="Reference Number" value={treaty.businessTreatyReferenceNumber} />
                                                <InfoRow label="RI Graded Ret" value={treaty.riGradedRet} />
                                                <InfoRow label="Former Treaty Code" value={treaty.formerTreatyCode} />
                                                <InfoRow label="Processing Method" value={treaty.processingPortfolioMethod} />
                                            </Grid>
                                        </Grid>

                                        <Divider sx={{ my: 3 }} />

                                        {/* 2. Risk Limits - Complete Details */}
                                        {treaty.riskLimitLines?.length > 0 && (
                                            <Box>
                                                <SectionHeader
                                                    icon="📊"
                                                    title={`Risk Limits (${treaty.riskLimitLines.length} ${treaty.riskLimitLines.length === 1 ? 'Line' : 'Lines'})`}
                                                />
                                                {treaty.riskLimitLines.map((line: any, lineIndex: number) => (
                                                    <Card key={line.id} sx={{
                                                        mb: 2.5,
                                                        backgroundColor: '#ffffff',
                                                        border: '1px solid #dee2e6',
                                                        borderRadius: '8px',
                                                        overflow: 'hidden'
                                                    }}>
                                                        <Box sx={{
                                                            p: 1.5,
                                                            backgroundColor: '#f8f9fa',
                                                            borderBottom: '1px solid #dee2e6'
                                                        }}>
                                                            <Typography sx={{
                                                                fontWeight: 700,
                                                                fontSize: '13px',
                                                                color: '#495057'
                                                            }}>
                                                                Risk Limit Line {lineIndex + 1}
                                                            </Typography>
                                                        </Box>
                                                        <Box sx={{ p: 2 }}>
                                                            <Grid container spacing={2}>
                                                                <Grid item xs={12} md={6} lg={3}>
                                                                    <InfoRow label="Product LOB" value={line.productLOB} />
                                                                    <InfoRow label="Product Code" value={line.productCode} />
                                                                    <InfoRow label="Accounting LOB" value={line.accountingLOB} />
                                                                    <InfoRow label="Risk Category" value={line.riskCategory} />
                                                                </Grid>
                                                                <Grid item xs={12} md={6} lg={3}>
                                                                    <InfoRow label="Risk Grade" value={line.riskGrade} />
                                                                    <InfoRow label="Cession Rate (%)" value={line.cessionRate} />
                                                                    <InfoRow label="Quota Cession Max Capacity" value={line.quotaCessionMaxCapacity} />
                                                                    <InfoRow label="Retention Gross/Net" value={line.retentionGrossNet} />
                                                                </Grid>
                                                                <Grid item xs={12} md={6} lg={3}>
                                                                    <InfoRow label="Surplus Capacity" value={line.surplusCapacity} />
                                                                    <InfoRow label="Capacity Calculate in XL" value={line.capacityCalculateInXL} />
                                                                    <InfoRow label="Per Risk Recovery Limit" value={line.perRiskRecoveryLimit} />
                                                                    <InfoRow label="Event Limit" value={line.eventLimit} />
                                                                </Grid>
                                                                <Grid item xs={12} md={6} lg={3}>
                                                                    <InfoRow label="Cash Call Limit" value={line.cashCallLimit} />
                                                                    <InfoRow label="Loss Advice Limit" value={line.lossAdviceLimit} />
                                                                    <InfoRow label="Premium Payment Warranty" value={line.premiumPaymentWarranty} />
                                                                    <InfoRow label="Alert Days" value={line.alertDays} />
                                                                </Grid>
                                                            </Grid>

                                                            {/* Risk Limit Line Reinsurers */}
                                                            {line.reinsurers?.length > 0 && (
                                                                <Box sx={{ mt: 2.5, pt: 2.5, borderTop: '1px dashed #dee2e6' }}>
                                                                    <Typography sx={{
                                                                        fontWeight: 600,
                                                                        fontSize: '12px',
                                                                        color: '#6c757d',
                                                                        mb: 1.5,
                                                                        textTransform: 'uppercase',
                                                                        letterSpacing: '0.5px'
                                                                    }}>
                                                                        🏦 Reinsurers ({line.reinsurers.length})
                                                                    </Typography>
                                                                    <Grid container spacing={1}>
                                                                        {line.reinsurers.map((reinsurer: any, idx: number) => (
                                                                            <Grid item xs={12} sm={6} md={4} key={reinsurer.id}>
                                                                                <Box sx={{
                                                                                    p: 1.5,
                                                                                    backgroundColor: '#f0f7ff',
                                                                                    border: '1px solid #d0e7ff',
                                                                                    borderRadius: '6px',
                                                                                    display: 'flex',
                                                                                    alignItems: 'center',
                                                                                    justifyContent: 'space-between'
                                                                                }}>
                                                                                    <Typography sx={{ fontSize: '12px', color: '#212529', fontWeight: 500 }}>
                                                                                        {idx + 1}. {reinsurer.reinsurer || 'N/A'}
                                                                                    </Typography>
                                                                                    <Chip
                                                                                        label={`${reinsurer.share}%`}
                                                                                        size="small"
                                                                                        sx={{
                                                                                            backgroundColor: '#1976d2',
                                                                                            color: 'white',
                                                                                            fontWeight: 700,
                                                                                            fontSize: '11px',
                                                                                            height: '22px'
                                                                                        }}
                                                                                    />
                                                                                </Box>
                                                                            </Grid>
                                                                        ))}
                                                                    </Grid>
                                                                </Box>
                                                            )}

                                                            {/* Risk Limit Line Brokers */}
                                                            {line.brokers?.length > 0 && (
                                                                <Box sx={{ mt: 2.5, pt: 2.5, borderTop: '1px dashed #dee2e6' }}>
                                                                    <Typography sx={{
                                                                        fontWeight: 600,
                                                                        fontSize: '12px',
                                                                        color: '#6c757d',
                                                                        mb: 1.5,
                                                                        textTransform: 'uppercase',
                                                                        letterSpacing: '0.5px'
                                                                    }}>
                                                                        🤝 Brokers ({line.brokers.length})
                                                                    </Typography>
                                                                    <Grid container spacing={1}>
                                                                        {line.brokers.map((broker: any, idx: number) => (
                                                                            <Grid item xs={12} sm={6} md={4} key={broker.id}>
                                                                                <Box sx={{
                                                                                    p: 1.5,
                                                                                    backgroundColor: '#fffbf0',
                                                                                    border: '1px solid #ffe9b3',
                                                                                    borderRadius: '6px',
                                                                                    display: 'flex',
                                                                                    alignItems: 'center',
                                                                                    justifyContent: 'space-between'
                                                                                }}>
                                                                                    <Typography sx={{ fontSize: '12px', color: '#212529', fontWeight: 500 }}>
                                                                                        {idx + 1}. {broker.broker || 'N/A'}
                                                                                    </Typography>
                                                                                    <Chip
                                                                                        label={`${broker.share}%`}
                                                                                        size="small"
                                                                                        sx={{
                                                                                            backgroundColor: '#ff9800',
                                                                                            color: 'white',
                                                                                            fontWeight: 700,
                                                                                            fontSize: '11px',
                                                                                            height: '22px'
                                                                                        }}
                                                                                    />
                                                                                </Box>
                                                                            </Grid>
                                                                        ))}
                                                                    </Grid>
                                                                </Box>
                                                            )}
                                                        </Box>
                                                    </Card>
                                                ))}
                                            </Box>
                                        )}

                                        <Divider sx={{ my: 3 }} />

                                        {/* 3. Treaty Level Participating Reinsurers */}
                                        {treaty.reinsurers?.length > 0 && (
                                            <Box sx={{ mb: 3 }}>
                                                <SectionHeader
                                                    icon="🏦"
                                                    title={`Participating Reinsurers (${treaty.reinsurers.length})`}
                                                />
                                                <Grid container spacing={1.5}>
                                                    {treaty.reinsurers.map((reinsurer: any, idx: number) => (
                                                        <Grid item xs={12} sm={6} md={4} key={reinsurer.id}>
                                                            <Box sx={{
                                                                p: 2,
                                                                backgroundColor: '#f0f7ff',
                                                                border: '1px solid #d0e7ff',
                                                                borderRadius: '8px',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'space-between',
                                                                transition: 'all 0.2s',
                                                                '&:hover': {
                                                                    boxShadow: '0 2px 8px rgba(25, 118, 210, 0.15)',
                                                                    transform: 'translateY(-2px)'
                                                                }
                                                            }}>
                                                                <Typography sx={{ fontSize: '13px', color: '#212529', fontWeight: 600 }}>
                                                                    {idx + 1}. {reinsurer.reinsurer || 'N/A'}
                                                                </Typography>
                                                                <Chip
                                                                    label={`${reinsurer.share}%`}
                                                                    size="small"
                                                                    sx={{
                                                                        backgroundColor: '#1976d2',
                                                                        color: 'white',
                                                                        fontWeight: 700,
                                                                        fontSize: '12px',
                                                                        height: '24px'
                                                                    }}
                                                                />
                                                            </Box>
                                                        </Grid>
                                                    ))}
                                                </Grid>
                                            </Box>
                                        )}

                                        {/* 3. Treaty Level Brokers */}
                                        {treaty.brokers?.length > 0 && (
                                            <Box sx={{ mb: 3 }}>
                                                <SectionHeader
                                                    icon="🤝"
                                                    title={`Brokers (${treaty.brokers.length})`}
                                                />
                                                <Grid container spacing={1.5}>
                                                    {treaty.brokers.map((broker: any, idx: number) => (
                                                        <Grid item xs={12} sm={6} md={4} key={broker.id}>
                                                            <Box sx={{
                                                                p: 2,
                                                                backgroundColor: '#fffbf0',
                                                                border: '1px solid #ffe9b3',
                                                                borderRadius: '8px',
                                                                transition: 'all 0.2s',
                                                                '&:hover': {
                                                                    boxShadow: '0 2px 8px rgba(255, 152, 0, 0.15)',
                                                                    transform: 'translateY(-2px)'
                                                                }
                                                            }}>
                                                                <Box sx={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'space-between',
                                                                    mb: broker.reinsurers?.length > 0 ? 1.5 : 0
                                                                }}>
                                                                    <Typography sx={{ fontSize: '13px', color: '#212529', fontWeight: 600 }}>
                                                                        {idx + 1}. {broker.broker || 'N/A'}
                                                                    </Typography>
                                                                    <Chip
                                                                        label={`${broker.share}%`}
                                                                        size="small"
                                                                        sx={{
                                                                            backgroundColor: '#ff9800',
                                                                            color: 'white',
                                                                            fontWeight: 700,
                                                                            fontSize: '12px',
                                                                            height: '24px'
                                                                        }}
                                                                    />
                                                                </Box>
                                                                {/* Broker's Reinsurers */}
                                                                {broker.reinsurers?.length > 0 && (
                                                                    <Box sx={{
                                                                        mt: 1.5,
                                                                        pt: 1.5,
                                                                        borderTop: '1px dashed #ffe9b3'
                                                                    }}>
                                                                        <Typography sx={{
                                                                            fontSize: '11px',
                                                                            color: '#6c757d',
                                                                            fontWeight: 600,
                                                                            mb: 1,
                                                                            textTransform: 'uppercase'
                                                                        }}>
                                                                            Reinsurers:
                                                                        </Typography>
                                                                        {broker.reinsurers.map((reinsurer: any) => (
                                                                            <Box
                                                                                key={reinsurer.id}
                                                                                sx={{
                                                                                    display: 'flex',
                                                                                    justifyContent: 'space-between',
                                                                                    alignItems: 'center',
                                                                                    mb: 0.5,
                                                                                    fontSize: '11px'
                                                                                }}
                                                                            >
                                                                                <Typography sx={{ fontSize: '11px', color: '#495057' }}>
                                                                                    • {reinsurer.reinsurer || 'N/A'}
                                                                                </Typography>
                                                                                <Typography sx={{
                                                                                    fontSize: '11px',
                                                                                    color: '#ff9800',
                                                                                    fontWeight: 700
                                                                                }}>
                                                                                    {reinsurer.share}%
                                                                                </Typography>
                                                                            </Box>
                                                                        ))}
                                                                    </Box>
                                                                )}
                                                            </Box>
                                                        </Grid>
                                                    ))}
                                                </Grid>
                                            </Box>
                                        )}

                                        <Divider sx={{ my: 3 }} />

                                        {/* 4. Additional Treaty Configuration */}
                                        <SectionHeader icon="⚙️" title="Additional Configuration" />
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} md={6}>
                                                <InfoRow label="Prem Reserve Retained Rate (%)" value={treaty.premReserveRetainedRate} />
                                                <InfoRow label="Prem Reserve Interest Rate (%)" value={treaty.premReserveInterestRate} />
                                                <InfoRow label="Portfolio Premium Entry Rate (%)" value={treaty.portfolioPremiumEntryRate} />
                                                <InfoRow label="Portfolio Claim Entry Rate (%)" value={treaty.portfolioClaimEntryRate} />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <InfoRow label="Portfolio Prem Withd. Rate (%)" value={treaty.portfolioPremWithdRate} />
                                                <InfoRow label="Portfolio Claim Withd. Rate (%)" value={treaty.portfolioClaimWithdRate} />
                                                <InfoRow label="Management Expenses (%)" value={treaty.managementExpenses} />
                                                <InfoRow label="Taxes And Other Expenses (%)" value={treaty.taxesAndOtherExpenses} />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Card>
                            ))}
                        </AccordionDetails>
                    </Accordion>
                );
            })}

            {/* Non-Proportional Blocks */}
            {formValues.selectMode === 'Treaty (Non Proportional)' && formValues.nonProportionalBlocks?.map((block: any, blockIndex: number) => {
                const blockColor = getBlockColor(block.blockNumber);
                return (
                    <Accordion
                        key={block.id}
                        defaultExpanded={blockIndex === 0}
                        sx={{
                            mb: 2,
                            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                            borderRadius: '12px !important',
                            border: `2px solid ${blockColor.border}`,
                            '&:before': { display: 'none' }
                        }}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            sx={{
                                backgroundColor: blockColor.bg,
                                borderRadius: '12px',
                                minHeight: '64px',
                                '&:hover': { backgroundColor: blockColor.border },
                                '& .MuiAccordionSummary-content': { my: 2 }
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box sx={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: '50%',
                                    backgroundColor: blockColor.accent,
                                    boxShadow: `0 0 0 4px ${blockColor.light}60`
                                }} />
                                <Typography sx={{ fontWeight: 700, fontSize: '16px', color: '#1a1a1a' }}>
                                    Block {block.blockNumber}
                                </Typography>
                                <Chip
                                    label="Non-Proportional"
                                    size="small"
                                    sx={{
                                        backgroundColor: blockColor.accent,
                                        color: 'white',
                                        fontWeight: 600,
                                        fontSize: '11px'
                                    }}
                                />
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails sx={{ p: 3, backgroundColor: '#fafbfc' }}>
                            <Card sx={{
                                boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
                                border: '1px solid #e0e0e0',
                                borderRadius: '10px',
                                overflow: 'hidden'
                            }}>
                                <Box sx={{
                                    p: 2.5,
                                    backgroundColor: '#f5f7fa',
                                    borderBottom: '2px solid #007bff'
                                }}>
                                    <Typography sx={{
                                        fontWeight: 700,
                                        fontSize: '15px',
                                        color: '#1a1a1a'
                                    }}>
                                        {block.treaty.treatyName || 'Unnamed Treaty'}
                                    </Typography>
                                </Box>

                                <Box sx={{ p: 3 }}>
                                    {/* 1. Treaty Information */}
                                    <SectionHeader icon="📄" title="Treaty Information" />
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <InfoRow label="Treaty Code" value={block.treaty.treatyCode} />
                                            <InfoRow label="Priority" value={block.treaty.priority} />
                                            <InfoRow label="Treaty Type" value={block.treaty.treatyType} />
                                            <InfoRow label="XOL Type" value={block.treaty.xolType} />
                                            <InfoRow label="Treaty Category" value={block.treaty.treatyCategory} />
                                            <InfoRow label="Treaty Status" value={block.treaty.treatyStatus} />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <InfoRow label="Reference Number" value={block.treaty.businessTreatyReferenceNumber} />
                                            <InfoRow label="Former Treaty Code" value={block.treaty.formerTreatyCode} />
                                            <InfoRow label="Treaty Currency" value={block.treaty.treatyCurrency} />
                                            <InfoRow label="Processing Method" value={block.treaty.processing} />
                                            <InfoRow label="Basis of Attachment" value={block.treaty.basisOfAttachment} />
                                        </Grid>
                                    </Grid>

                                    <Divider sx={{ my: 3 }} />

                                    {/* 2. Layers - Complete Details */}
                                    {block.treaty.layerLines?.length > 0 && (
                                        <Box>
                                            <SectionHeader
                                                icon="📊"
                                                title={`Layers (${block.treaty.layerLines.length})`}
                                            />
                                            {block.treaty.layerLines.map((layer: any, layerIndex: number) => (
                                                <Card key={layer.id} sx={{
                                                    mb: 2.5,
                                                    backgroundColor: '#ffffff',
                                                    border: '1px solid #dee2e6',
                                                    borderRadius: '8px',
                                                    overflow: 'hidden'
                                                }}>
                                                    <Box sx={{
                                                        p: 1.5,
                                                        backgroundColor: '#f8f9fa',
                                                        borderBottom: '1px solid #dee2e6'
                                                    }}>
                                                        <Typography sx={{
                                                            fontWeight: 700,
                                                            fontSize: '13px',
                                                            color: '#495057'
                                                        }}>
                                                            Layer {layerIndex + 1}
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ p: 2 }}>
                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} md={6} lg={3}>
                                                                <InfoRow label="Product LOB" value={layer.productLOB} />
                                                                <InfoRow label="Product Code" value={layer.productCode} />
                                                                <InfoRow label="Accounting LOB" value={layer.accountingLOB} />
                                                                <InfoRow label="Risk Category" value={layer.riskCategory} />
                                                            </Grid>
                                                            <Grid item xs={12} md={6} lg={3}>
                                                                <InfoRow label="Risk Grade" value={layer.riskGrade} />
                                                                <InfoRow label="Loss Occur Deductibility" value={layer.lossOccurDeductibility} />
                                                                <InfoRow label="Loss Limit" value={layer.lossLimit} />
                                                                <InfoRow label="Share of Occurrence Deduction" value={layer.shareOfOccurrenceDeduction} />
                                                            </Grid>
                                                            <Grid item xs={12} md={6} lg={3}>
                                                                <InfoRow label="Available Reinstated SI" value={layer.availableReinstatedSI} />
                                                                <InfoRow label="Annual Agg Limit" value={layer.annualAggLimit} />
                                                                <InfoRow label="Annual Agg Amount" value={layer.annualAggAmount} />
                                                                <InfoRow label="Agg Claim Amount" value={layer.aggClaimAmount} />
                                                            </Grid>
                                                            <Grid item xs={12} md={6} lg={3}>
                                                                <InfoRow label="Local Native Layer" value={layer.localNativeLayer} />
                                                                <InfoRow label="Transaction Limit Ccy" value={layer.transactionLimitCcy} />
                                                            </Grid>
                                                        </Grid>

                                                        {/* Layer Reinsurers */}
                                                        {layer.reinsurers?.length > 0 && (
                                                            <Box sx={{ mt: 2.5, pt: 2.5, borderTop: '1px dashed #dee2e6' }}>
                                                                <Typography sx={{
                                                                    fontWeight: 600,
                                                                    fontSize: '12px',
                                                                    color: '#6c757d',
                                                                    mb: 1.5,
                                                                    textTransform: 'uppercase',
                                                                    letterSpacing: '0.5px'
                                                                }}>
                                                                    🏦 Reinsurers ({layer.reinsurers.length})
                                                                </Typography>
                                                                <Grid container spacing={1}>
                                                                    {layer.reinsurers.map((reinsurer: any, idx: number) => (
                                                                        <Grid item xs={12} sm={6} md={4} key={reinsurer.id}>
                                                                            <Box sx={{
                                                                                p: 1.5,
                                                                                backgroundColor: '#f0f7ff',
                                                                                border: '1px solid #d0e7ff',
                                                                                borderRadius: '6px',
                                                                                display: 'flex',
                                                                                alignItems: 'center',
                                                                                justifyContent: 'space-between'
                                                                            }}>
                                                                                <Typography sx={{ fontSize: '12px', color: '#212529', fontWeight: 500 }}>
                                                                                    {idx + 1}. {reinsurer.reinsurer || 'N/A'}
                                                                                </Typography>
                                                                                <Chip
                                                                                    label={`${reinsurer.share}%`}
                                                                                    size="small"
                                                                                    sx={{
                                                                                        backgroundColor: '#1976d2',
                                                                                        color: 'white',
                                                                                        fontWeight: 700,
                                                                                        fontSize: '11px',
                                                                                        height: '22px'
                                                                                    }}
                                                                                />
                                                                            </Box>
                                                                        </Grid>
                                                                    ))}
                                                                </Grid>
                                                            </Box>
                                                        )}

                                                        {/* Layer Brokers */}
                                                        {layer.brokers?.length > 0 && (
                                                            <Box sx={{ mt: 2.5, pt: 2.5, borderTop: '1px dashed #dee2e6' }}>
                                                                <Typography sx={{
                                                                    fontWeight: 600,
                                                                    fontSize: '12px',
                                                                    color: '#6c757d',
                                                                    mb: 1.5,
                                                                    textTransform: 'uppercase',
                                                                    letterSpacing: '0.5px'
                                                                }}>
                                                                    🤝 Brokers ({layer.brokers.length})
                                                                </Typography>
                                                                <Grid container spacing={1}>
                                                                    {layer.brokers.map((broker: any, idx: number) => (
                                                                        <Grid item xs={12} sm={6} md={4} key={broker.id}>
                                                                            <Box sx={{
                                                                                p: 1.5,
                                                                                backgroundColor: '#fffbf0',
                                                                                border: '1px solid #ffe9b3',
                                                                                borderRadius: '6px',
                                                                                display: 'flex',
                                                                                alignItems: 'center',
                                                                                justifyContent: 'space-between'
                                                                            }}>
                                                                                <Typography sx={{ fontSize: '12px', color: '#212529', fontWeight: 500 }}>
                                                                                    {idx + 1}. {broker.broker || 'N/A'}
                                                                                </Typography>
                                                                                <Chip
                                                                                    label={`${broker.share}%`}
                                                                                    size="small"
                                                                                    sx={{
                                                                                        backgroundColor: '#ff9800',
                                                                                        color: 'white',
                                                                                        fontWeight: 700,
                                                                                        fontSize: '11px',
                                                                                        height: '22px'
                                                                                    }}
                                                                                />
                                                                            </Box>
                                                                        </Grid>
                                                                    ))}
                                                                </Grid>
                                                            </Box>
                                                        )}
                                                    </Box>
                                                </Card>
                                            ))}
                                        </Box>
                                    )}

                                    <Divider sx={{ my: 3 }} />

                                    {/* 3. Additional Configuration */}
                                    <SectionHeader icon="⚙️" title="Additional Configuration" />
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <InfoRow label="Capacity" value={block.treaty.capacity} />
                                            <InfoRow label="Annual Aggregate Limit" value={block.treaty.annualAggregateLimit} />
                                            <InfoRow label="Annual Agg Deductible" value={block.treaty.annualAggDeductible} />
                                            <InfoRow label="Total Reinstated SI" value={block.treaty.totalReinstatedSI} />
                                            <InfoRow label="Flat Rate XOL Prem" value={block.treaty.flatRateXOLPrem} />
                                            <InfoRow label="Min Deposit XOL Prem" value={block.treaty.minDepositXOLPrem} />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <InfoRow label="No. of Reinstatements" value={block.treaty.noReinstatements} />
                                            <InfoRow label="Pro Rate to Amount" value={block.treaty.proRateToAmount} />
                                            <InfoRow label="Pro Rate to Time" value={block.treaty.proRateToTime} />
                                            <InfoRow label="Reserve Type Involved" value={block.treaty.reserveTypeInvolved} />
                                            <InfoRow label="Burning Cost Rate" value={block.treaty.burningCostRate} />
                                            <InfoRow label="Premium Payment Warranty" value={block.treaty.premPaymentWarranty} />
                                            <InfoRow label="Alert Days" value={block.treaty.alertDays} />
                                            <InfoRow label="Per Claim Recoverable Limit" value={block.treaty.perClaimRecoverableLimit} />
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Card>
                        </AccordionDetails>
                    </Accordion>
                );
            })}
        </Box>
    );
};
