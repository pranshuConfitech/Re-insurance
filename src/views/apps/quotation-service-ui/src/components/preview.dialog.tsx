import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Paper,
  Typography,
  Divider,
  Dialog,
  Button
} from '@mui/material';
import {
  Description,
  Person,
  CalendarToday,
  AttachMoney,
  Security,
  Schedule,
  CheckCircle,
  Warning,
  Group,
  TrendingUp,
  Label,
  Cancel,
  HourglassEmpty,
  ThumbUp,
  ThumbDown,
  Edit
} from '@mui/icons-material';
import { SvgIconComponent } from '@mui/icons-material';
import { AgentsService, TaxService } from '@/services/remote-api/fettle-remote-api';

const agentservice = new AgentsService()
const taxservice = new TaxService()

export default function QuotationDetailsScreen(props: any) {
  const [agentNames, setAgentNames] = React.useState<Record<string, string>>({});
  const [taxNames, setTaxNames] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    const fetchAgentNames = async () => {
      const names: Record<string, string> = {};

      for (const agent of props.quotationDetails.quotationAgents) {
        try {
          agentservice.getAgentDetails(agent.agentId).subscribe((val: any) => {
            names[agent.agentId] = val.agentBasicDetails.name;
            setAgentNames({ ...names });
          });
        } catch (error) {
          console.error(`Error fetching agent ${agent.agentId}:`, error);
          names[agent.agentId] = agent.agentId;
        }
      }
    };
    const fetchTaxNames = async () => {
      const names: Record<string, string> = {};

      for (const tax of props.quotationDetails.quotationTaxes) {
        try {
          taxservice.getTaxDetails(tax.taxId).subscribe((val: any) => {
            names[tax.taxId] = val.name;
            setTaxNames({ ...names });
          });
        } catch (error) {
          console.error(`Error fetching agent ${tax.taxId}:`, error);
          names[tax.taxId] = tax.taxId;
        }
      }
    };

    if (props.quotationDetails?.quotationAgents?.length > 0) {
      fetchAgentNames();
    }
    if (props.quotationDetails?.quotationTaxes?.length > 0) {
      fetchTaxNames();
    }
  }, [props.quotationDetails?.quotationAgents, props.quotationDetails?.quotationTaxes]);

  const formatDate = (timestamp: any) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusConfig = (status: string) => {
    const statusMap: Record<string, { color: "success" | "warning" | "error" | "default" | "info", icon: any, bgColor: string, textColor: string }> = {
      'COMPLETED': {
        color: 'success',
        icon: CheckCircle,
        bgColor: '#e8f5e9',
        textColor: '#2e7d32'
      },
      'PREMIUM_CALCULATED': {
        color: 'success',
        icon: CheckCircle,
        bgColor: '#e8f5e9',
        textColor: '#2e7d32'
      },
      'APPROVED': {
        color: 'success',
        icon: ThumbUp,
        bgColor: '#e8f5e9',
        textColor: '#2e7d32'
      },
      'DRAFT': {
        color: 'warning',
        icon: Edit,
        bgColor: '#fff3e0',
        textColor: '#ed6c02'
      },
      'IN_PROGRESS': {
        color: 'info',
        icon: HourglassEmpty,
        bgColor: '#e3f2fd',
        textColor: '#0288d1'
      },
      'PREMIUM_CALCULATION_IN_PROGRESS': {
        color: 'info',
        icon: HourglassEmpty,
        bgColor: '#e3f2fd',
        textColor: '#0288d1'
      },
      'FAILED': {
        color: 'error',
        icon: Cancel,
        bgColor: '#ffebee',
        textColor: '#d32f2f'
      },
      'PREMIUM_CALCULATION_FAILED': {
        color: 'error',
        icon: Cancel,
        bgColor: '#ffebee',
        textColor: '#d32f2f'
      },
      'REJECTED': {
        color: 'error',
        icon: ThumbDown,
        bgColor: '#ffebee',
        textColor: '#d32f2f'
      }
    };

    return statusMap[status] || {
      color: 'default' as const,
      icon: Warning,
      bgColor: '#f5f5f5',
      textColor: '#757575'
    };
  };

  interface InfoCardProps {
    icon: SvgIconComponent;
    label: string;
    value: any;
    color?: string;
  }

  const InfoCard = ({ icon: Icon, label, value, color = "#D80E51" }: InfoCardProps) => (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        height: '100%',
        border: '1px solid',
        borderColor: '#e0e0e0',
        borderRadius: 1,
        backgroundColor: '#fafafa',
        transition: 'all 0.2s',
        '&:hover': {
          boxShadow: '0 2px 8px rgba(216,14,81,0.15)',
          borderColor: '#D80E51'
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
        <Icon sx={{ color: color, mt: 0.3, fontSize: 22 }} />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            {label}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontWeight: 600,
              mt: 0.5,
              wordBreak: 'break-word',
              color: '#424242'
            }}
          >
            {value || 'N/A'}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );

  const StatusCard = ({ label, status }: { label: string, status: string }) => {
    const config = getStatusConfig(status);
    const StatusIcon = config.icon;

    return (
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          backgroundColor: config.bgColor,
          borderRadius: 1,
          border: '1px solid',
          borderColor: config.textColor,
          borderLeftWidth: 4
        }}
      >
        <Typography variant="caption" sx={{ fontWeight: 600, color: config.textColor, textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', mb: 1 }}>
          {label}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <StatusIcon sx={{ color: config.textColor, mr: 1, fontSize: 20 }} />
          <Typography variant="body1" sx={{ fontWeight: 700, color: config.textColor }}>
            {status.replace(/_/g, ' ')}
          </Typography>
        </Box>
      </Paper>
    );
  };

  return (
    <Dialog
      open={props.openPreview}
      onClose={props.closePreview}
      fullWidth
      maxWidth="xl"
      aria-labelledby="quotation-details-dialog"
      disableEnforceFocus
      PaperProps={{
        sx: {
          maxHeight: '95vh',
          borderRadius: 2
        }
      }}
    >
      <Box sx={{
        backgroundColor: '#f5f7fa',
        py: 3
      }}>
        <Container maxWidth="xl">
          {/* Header */}
          <Card
            elevation={1}
            sx={{
              mb: 3,
              borderRadius: 1,
              border: '1px solid #e0e0e0',
              borderTop: '4px solid #D80E51'
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#D80E51', mb: 0.5 }}>
                    Quotation Details
                  </Typography>
                  <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
                    {props.quotationDetails.quotationNo}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip
                    icon={React.createElement(getStatusConfig(props.quotationDetails.quotationStatus).icon, { sx: { fontSize: 18 } })}
                    label={props.quotationDetails.quotationStatus.replace(/_/g, ' ')}
                    color={getStatusConfig(props.quotationDetails.quotationStatus).color}
                    sx={{ fontWeight: 600 }}
                  />
                  <Chip
                    icon={React.createElement(getStatusConfig(props.quotationDetails.quotationSubStatus).icon, { sx: { fontSize: 18 } })}
                    label={props.quotationDetails.quotationSubStatus.replace(/_/g, ' ')}
                    color={getStatusConfig(props.quotationDetails.quotationSubStatus).color}
                    sx={{ fontWeight: 600 }}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Grid container spacing={2.5}>
            {/* Prospect Information */}
            <Grid item xs={12} lg={8}>
              <Card elevation={1} sx={{ height: '100%', borderRadius: 1, border: '1px solid #e0e0e0' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
                    <Person sx={{ mr: 1, color: '#D80E51', fontSize: 24 }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#424242' }}>
                      Prospect Information
                    </Typography>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <InfoCard icon={Person} label="Prospect Name" value={props.quotationDetails.prospectName} color="#D80E51" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <InfoCard icon={Label} label="Tag" value={props.quotationDetails.tag} color="#D80E51" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <InfoCard icon={CalendarToday} label="Quote Date" value={formatDate(props.quotationDetails.quoteDate)} color="#D80E51" />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Premium Summary */}
            <Grid item xs={12} lg={4}>
              <Card
                elevation={1}
                sx={{
                  height: '100%',
                  borderRadius: 1,
                  border: '1px solid #e0e0e0',
                  background: 'linear-gradient(135deg, #D80E51 0%, #A00A3D 100%)',
                  color: 'white'
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
                    <AttachMoney sx={{ mr: 1, fontSize: 24, color: "whitesmoke" }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "whitesmoke" }}>
                      Premium Summary
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ opacity: 0.9, textTransform: 'uppercase', letterSpacing: 0.5, color: "whitesmoke" }}>
                      Total Premium
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 2.5, mt: 0.5, color: "whitesmoke" }}>
                      ₹{props.quotationDetails.totalPremium.toLocaleString()}
                    </Typography>
                    <Divider sx={{ borderColor: 'rgba(255,255,255,0.3)', mb: 2 }} />
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" sx={{ opacity: 0.9, textTransform: 'uppercase', letterSpacing: 0.5, color: "whitesmoke" }}>
                        Payment Frequency
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, mt: 0.5, color: "whitesmoke" }}>
                        {props.quotationDetails.paymentFrequency.replace('_', ' ')}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ opacity: 0.9, textTransform: 'uppercase', letterSpacing: 0.5, color: "whitesmoke" }}>
                        Invoice Generated
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, mt: 0.5, color: "whitesmoke" }}>
                        {props.quotationDetails.isInvoiceGenerated ? 'Yes' : 'No'}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Product & Plan Information */}
            <Grid item xs={12} md={6}>
              <Card elevation={1} sx={{ height: '100%', borderRadius: 1, border: '1px solid #e0e0e0' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
                    <Security sx={{ mr: 1, color: '#D80E51', fontSize: 24 }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#424242' }}>
                      Product & Plan
                    </Typography>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <InfoCard icon={Security} label="Product Name" value={props.quotationDetails.productName} color="#D80E51" />
                    </Grid>
                    <Grid item xs={12}>
                      <InfoCard icon={Security} label="Plan Name" value={props.quotationDetails.planName} color="#D80E51" />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Policy Period */}
            <Grid item xs={12} md={6}>
              <Card elevation={1} sx={{ height: '100%', borderRadius: 1, border: '1px solid #e0e0e0' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
                    <CalendarToday sx={{ mr: 1, color: '#D80E51', fontSize: 24 }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#424242' }}>
                      Policy Period
                    </Typography>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <InfoCard icon={CalendarToday} label="Start Date" value={formatDate(props.quotationDetails.policyStartDate)} color="#D80E51" />
                    </Grid>
                    <Grid item xs={12}>
                      <InfoCard icon={CalendarToday} label="End Date" value={formatDate(props.quotationDetails.policyEndDate)} color="#D80E51" />
                    </Grid>
                    <Grid item xs={12}>
                      <InfoCard icon={Schedule} label="Duration" value={`${props.quotationDetails.policyDuration} days`} color="#D80E51" />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Status Information */}
            <Grid item xs={12}>
              <Card elevation={1} sx={{ borderRadius: 1, border: '1px solid #e0e0e0' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
                    <CheckCircle sx={{ mr: 1, color: '#D80E51', fontSize: 24 }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#424242' }}>
                      Processing Status
                    </Typography>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                      <StatusCard label="Premium Calculation" status={props.quotationDetails.premiumCalculationStatus} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <StatusCard label="Member Upload" status={props.quotationDetails.memberUploadStatus} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <StatusCard label="Quotation Status" status={props.quotationDetails.quotationStatus} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <StatusCard label="Sub Status" status={props.quotationDetails.quotationSubStatus} />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Category Members */}
            <Grid item xs={12}>
              <Card elevation={1} sx={{ borderRadius: 1, border: '1px solid #e0e0e0' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
                    <Group sx={{ mr: 1, color: '#D80E51', fontSize: 24 }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#424242' }}>
                      Category Member Details
                    </Typography>
                  </Box>
                  {Object.entries(props.quotationDetails.categoryMemberHeadCountPremiumAmounts).map(([category, details]: any) => (
                    <Paper
                      key={category}
                      elevation={0}
                      sx={{
                        p: 3,
                        backgroundColor: '#FCE4EC',
                        borderRadius: 1,
                        border: '1px solid #F48FB1',
                        borderLeft: '4px solid #D80E51',
                        mb: 2
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: '#D80E51' }}>
                        {category}
                      </Typography>
                      <Grid container spacing={3}>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', mb: 0.5 }}>
                            Head Count
                          </Typography>
                          <Typography variant="h4" sx={{ fontWeight: 700, color: '#D80E51' }}>
                            {details.headCount}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', mb: 0.5 }}>
                            Premium Amount
                          </Typography>
                          <Typography variant="h4" sx={{ fontWeight: 700, color: '#D80E51' }}>
                            ₹{details.premiumAmount.toLocaleString()}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Paper>
                  ))}
                </CardContent>
              </Card>
            </Grid>

            {/* Premium Rules */}
            <Grid item xs={12}>
              <Card elevation={1} sx={{ borderRadius: 1, border: '1px solid #e0e0e0' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
                    <Description sx={{ mr: 1, color: '#D80E51', fontSize: 24 }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#424242' }}>
                      Category Premium Rules
                    </Typography>
                  </Box>

                  {Object.entries(props.quotationDetails.catagoryPremiumRules).map(([category, ruleIds]: any) => (
                    <Box key={category} sx={{ mb: 3 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: '#424242' }}>
                        {category}
                      </Typography>

                      {ruleIds.map((ruleId: string, idx: number) => {
                        let ruleDetail: any = {}

                        props.premiumRuleDetails.forEach((rule: any) => {
                          rule.premiumRules.forEach((detail: any) => {
                            if (detail.id == ruleId) {
                              let obj = detail;
                              obj.coverageAmount = rule.coverageAmount;
                              ruleDetail = obj;
                            }
                          })
                        })

                        if (!ruleDetail || !ruleDetail.name) return null;

                        return (
                          <Paper
                            key={idx}
                            elevation={0}
                            sx={{
                              p: 2.5,
                              mb: 2,
                              backgroundColor: '#FFF0F5',
                              borderRadius: 1,
                              border: '1px solid #F8BBD0',
                              borderLeft: '3px solid #D80E51'
                            }}
                          >
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#D80E51', mb: 1.5 }}>
                              {ruleDetail.name}
                            </Typography>
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={6} md={3}>
                                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', mb: 0.5 }}>
                                  Coverage Amount
                                </Typography>
                                <Typography variant="body1" fontWeight={600} color="#424242">
                                  ₹{ruleDetail.coverageAmount?.toLocaleString() || 'N/A'}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} sm={6} md={3}>
                                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', mb: 0.5 }}>
                                  Cover Type
                                </Typography>
                                <Typography variant="body1" fontWeight={600} color="#424242">
                                  {ruleDetail.coverType || 'N/A'}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} sm={6} md={3}>
                                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', mb: 0.5 }}>
                                  Expression
                                </Typography>
                                <Typography variant="body1" fontWeight={600} color="#424242">
                                  {ruleDetail.expression || 'N/A'}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} sm={6} md={3}>
                                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', mb: 0.5 }}>
                                  Premium Frequencies
                                </Typography>
                                {ruleDetail.premiumPaymentFrequencies?.map((el: any, i: number) => (
                                  <Typography key={i} variant="body2" fontWeight={600} color="#424242">
                                    ₹{el.premiumAmount} / {el.premiumPaymentFrequncyId}
                                  </Typography>
                                ))}
                              </Grid>
                            </Grid>
                          </Paper>
                        );
                      })}
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>


            {/* Quotation Taxes */}
            <Grid item xs={4}>
              <Card elevation={1} sx={{ borderRadius: 1, border: '1px solid #e0e0e0' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
                    <AttachMoney sx={{ mr: 1, color: '#D80E51', fontSize: 24 }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#424242' }}>
                      Tax Details
                    </Typography>
                  </Box>
                  {props.quotationDetails.quotationTaxes && props.quotationDetails.quotationTaxes.length > 0 ? (
                    props.quotationDetails.quotationTaxes.map((tax: any) => (
                      <Paper
                        key={tax.id}
                        elevation={0}
                        sx={{
                          p: 3,
                          backgroundColor: '#FFF8E1',
                          borderRadius: 1,
                          border: '1px solid #FFE082',
                          borderLeft: '4px solid #FFA726',
                          mb: 2
                        }}
                      >
                        <Grid container spacing={3}>
                          <Grid item xs={12} sm={8}>
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', mb: 0.5 }}>
                              Tax
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 600, color: '#424242' }}>
                              {taxNames[tax.taxId] || 'Loading...'}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', mb: 0.5 }}>
                              Tax Amount
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: '#F57C00' }}>
                              ₹{tax.taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Paper>
                    ))
                  ) : (
                    <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>
                      No tax data available
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Agent Commission */}
            <Grid item xs={8}>
              <Card elevation={1} sx={{ borderRadius: 1, border: '1px solid #e0e0e0' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
                    <TrendingUp sx={{ mr: 1, color: '#D80E51', fontSize: 24 }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#424242' }}>
                      Agent Commission Details
                    </Typography>
                  </Box>
                  {props.quotationDetails.quotationAgents.length > 0 ? (
                    props.quotationDetails.quotationAgents.map((agent: any) => (
                      <Paper
                        key={agent.id}
                        elevation={0}
                        sx={{
                          p: 3,
                          backgroundColor: '#FCE4EC',
                          borderRadius: 1,
                          border: '1px solid #F48FB1',
                          borderLeft: '4px solid #D80E51',
                          mb: 2
                        }}
                      >
                        <Grid container spacing={3}>
                          <Grid item xs={12} sm={6} md={3}>
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', mb: 0.5 }}>
                              Agent Name
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 600, color: '#424242' }}>
                              {agentNames[agent.agentId] || 'Loading...'}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6} md={3}>
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', mb: 0.5 }}>
                              Commission Type
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 600, color: '#424242' }}>
                              {agent.commissionType}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6} md={3}>
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', mb: 0.5 }}>
                              Commission Value
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: '#D80E51' }}>
                              {agent.commissionValue}%
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6} md={3}>
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', mb: 0.5 }}>
                              Final Value
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: '#D80E51' }}>
                              ₹{Number(agent.finalValue || 0).toFixed(2)}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Paper>
                    ))
                  ) : (
                    <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>
                      No agent commission data available
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* System Information */}
            <Grid item xs={12}>
              <Card elevation={1} sx={{ borderRadius: 1, border: '1px solid #e0e0e0' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
                    <Description sx={{ mr: 1, color: '#616161', fontSize: 24 }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#424242' }}>
                      System Information
                    </Typography>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <InfoCard icon={Person} label="Created By" value={props.quotationDetails.createdBy} color="#616161" />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <InfoCard icon={Description} label="Quotation ID" value={props.quotationDetails.id} color="#616161" />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>

        <Box sx={{ display: "flex", justifyContent: 'center', mt: 3, mb: 2 }}>
          <Button
            variant="contained"
            onClick={props.closePreview}
            sx={{
              px: 4,
              py: 1,
              textTransform: 'none',
              fontWeight: 600,
              backgroundColor: '#D80E51',
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: '#A00A3D',
                boxShadow: '0 2px 8px rgba(216,14,81,0.3)'
              }
            }}
          >
            Close
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
