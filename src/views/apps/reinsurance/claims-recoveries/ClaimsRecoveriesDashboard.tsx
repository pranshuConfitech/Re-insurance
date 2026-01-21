'use client';

import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    LinearProgress
} from '@mui/material';

import {
    Assessment,
    TrendingUp,
    TrendingDown,
    FilterList,
    Refresh,
    HourglassEmpty,
    BarChart,
    Warning,
    Description
} from '@mui/icons-material';

const ClaimsRecoveriesDashboard = () => {
    const [period, setPeriod] = useState('Q2 2024');
    const [lob, setLob] = useState('All Lines');
    const [reinsurer, setReinsurer] = useState('All Reinsurers');
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const agingData = [
        { label: '>90 Days', amount: '$3.8M', percentage: 40, status: 'URGENT', color: '#dc2626' },
        { label: '61-90 Days', amount: '$2.1M', percentage: 22, status: 'WATCH', color: '#f59e0b' },
        { label: '31-60 Days', amount: '$1.9M', percentage: 20, color: '#ffb74d' },
        { label: '0-30 Days', amount: '$1.6M', percentage: 18, color: '#059669' }
    ];

    // Recovery trend data for the bar chart
    const recoveryTrendData = [
        { month: 'Jan', paid: 14, outstanding: 6 },
        { month: 'Feb', paid: 13, outstanding: 7 },
        { month: 'Mar', paid: 16, outstanding: 8 },
        { month: 'Apr', paid: 15, outstanding: 9 },
        { month: 'May', paid: 17, outstanding: 10 },
        { month: 'Jun', paid: 12, outstanding: 11 }
    ];

    // Large loss claims data
    const largeLossClaims = [
        {
            claimId: 'CL-2024-078',
            event: 'Hurricane Alia',
            lob: 'Property',
            reinsurers: 'Swiss Re, Munich Re',
            grossLoss: '$12.5M',
            riShare: '$8.2M',
            recoveryPercent: '45%',
            status: 'In Review',
            age: 42,
            statusColor: '#2196f3'
        },
        {
            claimId: 'CL-2024-055',
            event: 'Chemical Plant Fire',
            lob: 'Casualty',
            reinsurers: "Lloyd's, Everest Re",
            grossLoss: '$8.7M',
            riShare: '$5.1M',
            recoveryPercent: '80%',
            status: 'Paid',
            age: 15,
            statusColor: '#4caf50'
        },
        {
            claimId: 'CL-2024-112',
            event: 'Flood Damage - Warehouse',
            lob: 'Property',
            reinsurers: 'Munich Re',
            grossLoss: '$6.2M',
            riShare: '$3.8M',
            recoveryPercent: '60%',
            status: 'Pending',
            age: 28,
            statusColor: '#ff9800'
        },
        {
            claimId: 'CL-2024-089',
            event: 'Aviation Incident',
            lob: 'Aviation',
            reinsurers: "Swiss Re, Lloyd's",
            grossLoss: '$15.3M',
            riShare: '$9.9M',
            recoveryPercent: '35%',
            status: 'Disputed',
            age: 67,
            statusColor: '#e91e63'
        },
        {
            claimId: 'CL-2024-101',
            event: 'Marine Cargo Loss',
            lob: 'Marine',
            reinsurers: 'Everest Re',
            grossLoss: '$4.8M',
            riShare: '$2.9M',
            recoveryPercent: '75%',
            status: 'Paid',
            age: 22,
            statusColor: '#4caf50'
        }
    ];

    return (
        <Box sx={{
            backgroundColor: '#f8fafc',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 25%, #f8fafc 50%, #f1f5f9 75%, #e2e8f0 100%)',
            p: { xs: 2, sm: 3, md: 4 }
        }}>

            {/* ================= HEADER ================= */}
            <Box sx={{
                mb: 4,
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'flex-start', md: 'center' },
                gap: 3,
                p: { xs: 3, md: 4 },
                background: '#e91e63',
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
                <Box sx={{ flex: 1 }}>
                    <Typography variant="h5" sx={{
                        fontWeight: 600,
                        color: 'white',
                        mb: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5
                    }}>
                        <Assessment sx={{ fontSize: 28 }} />
                        Claims & Recoveries Dashboard
                    </Typography>
                    <Typography variant="body1" sx={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '14px'
                    }}>
                        Recovery Management • Claims Processing • Reinsurer Relations
                    </Typography>
                </Box>
                <Typography variant="caption" sx={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '12px',
                    fontStyle: 'italic'
                }}>
                    Last updated: Jan 21, 2026 14:30
                </Typography>
            </Box>

            <Box sx={{ px: { xs: 0, sm: 2, md: 3 } }}>
                {/* ================= FILTERS ================= */}
                <Grid container spacing={2} mb={4}>
                    <Grid item>
                        <FormControl size="small" sx={{ minWidth: 160 }}>
                            <InputLabel>Period</InputLabel>
                            <Select value={period} label="Period" onChange={(e) => setPeriod(e.target.value)}>
                                <MenuItem value="Q2 2024">Q2 2024</MenuItem>
                                <MenuItem value="Q1 2024">Q1 2024</MenuItem>
                                <MenuItem value="2024 YTD">2024 YTD</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item>
                        <FormControl size="small" sx={{ minWidth: 160 }}>
                            <InputLabel>LOB</InputLabel>
                            <Select value={lob} label="LOB" onChange={(e) => setLob(e.target.value)}>
                                <MenuItem value="All Lines">All Lines</MenuItem>
                                <MenuItem value="Property">Property</MenuItem>
                                <MenuItem value="Casualty">Casualty</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item>
                        <FormControl size="small" sx={{ minWidth: 180 }}>
                            <InputLabel>Reinsurer</InputLabel>
                            <Select value={reinsurer} label="Reinsurer" onChange={(e) => setReinsurer(e.target.value)}>
                                <MenuItem value="All Reinsurers">All Reinsurers</MenuItem>
                                <MenuItem value="Swiss Re">Swiss Re</MenuItem>
                                <MenuItem value="Munich Re">Munich Re</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item>
                        <Button variant="contained" startIcon={<FilterList />} sx={{
                            backgroundColor: '#e91e63',
                            '&:hover': { backgroundColor: '#ad1457' }
                        }}>Filter</Button>
                    </Grid>

                    <Grid item>
                        <Button variant="outlined" startIcon={<Refresh />} sx={{
                            borderColor: '#e91e63',
                            color: '#e91e63',
                            '&:hover': {
                                borderColor: '#ad1457',
                                backgroundColor: 'rgba(233, 30, 99, 0.05)'
                            }
                        }}>Refresh</Button>
                    </Grid>
                </Grid>

                {/* ================= KPI CARDS ================= */}
                <Grid container spacing={{ xs: 2, md: 4 }} sx={{ mb: 5 }}>
                    {[
                        { label: 'Gross Claims', value: '$45.2M', icon: <TrendingUp />, color: '#e91e63', trend: '+8.5% vs last quarter', trendUp: true },
                        { label: 'Ceded Claims', value: '$28.1M', icon: <TrendingUp />, color: '#2e7d32', trend: '+12.3% vs last quarter', trendUp: true },
                        { label: 'Recoveries Paid', value: '$18.7M', icon: <TrendingDown />, color: '#1976d2', trend: '+15.2% vs last quarter', trendUp: true },
                        { label: 'Outstanding', value: '$9.4M', icon: <TrendingUp />, color: '#f57c00', trend: '-3.1% vs last quarter', trendUp: false },
                        { label: 'Recovery Ratio', value: '66.5%', icon: <TrendingDown />, color: '#9c27b0', trend: 'Target: 70%', trendUp: false }
                    ].map((kpi, i) => (
                        <Grid item xs={12} sm={6} md={4} lg={2.4} key={i}>
                            <Card sx={{
                                height: '100%',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
                                border: '1px solid rgba(226, 232, 240, 0.6)',
                                borderRadius: '20px',
                                borderLeft: `6px solid ${kpi.color}`,
                                background: 'linear-gradient(135deg, #ffffff 0%, #fefefe 50%, #fdfdfd 100%)',
                                position: 'relative',
                                overflow: 'hidden',
                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                '&:hover': {
                                    transform: 'translateY(-8px) scale(1.02)',
                                    boxShadow: `0 20px 60px ${kpi.color}33, 0 8px 24px rgba(0, 0, 0, 0.15)`
                                },
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '4px',
                                    background: `linear-gradient(90deg, ${kpi.color} 0%, ${kpi.color}cc 100%)`,
                                    opacity: 0.8
                                }
                            }}>
                                <CardContent sx={{ p: { xs: 2, md: 3 }, position: 'relative', zIndex: 1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                        <Box sx={{ color: kpi.color, fontSize: 20 }}>
                                            {kpi.icon}
                                        </Box>
                                        <Typography variant="caption" sx={{
                                            color: '#64748b',
                                            fontSize: '12px',
                                            fontWeight: 600,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px'
                                        }}>
                                            {kpi.label}
                                        </Typography>
                                    </Box>
                                    <Typography variant="h4" sx={{
                                        fontWeight: 800,
                                        color: '#1e293b',
                                        fontSize: { xs: '20px', md: '24px' },
                                        mb: 1
                                    }}>
                                        {kpi.value}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        {kpi.trendUp ? (
                                            <TrendingUp sx={{ fontSize: 16, color: '#059669' }} />
                                        ) : (
                                            <TrendingDown sx={{ fontSize: 16, color: '#dc2626' }} />
                                        )}
                                        <Typography variant="caption" sx={{
                                            fontSize: '11px',
                                            color: kpi.trendUp ? '#059669' : '#dc2626',
                                            fontWeight: 600
                                        }}>
                                            {kpi.trend}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* ================= AGING ================= */}
                <Card sx={{
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    border: '1px solid rgba(226, 232, 240, 0.8)',
                    borderRadius: '12px',
                    mb: 4
                }}>
                    <CardContent sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{
                            fontWeight: 600,
                            color: '#e91e63',
                            fontSize: '16px',
                            mb: 3,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}>
                            <HourglassEmpty />
                            Recoveries Aging Analysis
                        </Typography>

                        {agingData.map((item, i) => (
                            <Box key={i} mb={3}>
                                <Box display="flex" justifyContent="space-between" mb={1}>
                                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '14px' }}>
                                        {item.label}
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '14px' }}>
                                        {item.amount}
                                    </Typography>
                                </Box>
                                <Box sx={{ position: 'relative' }}>
                                    <LinearProgress
                                        variant="determinate"
                                        value={100}
                                        sx={{
                                            height: 24,
                                            borderRadius: 12,
                                            backgroundColor: '#f1f5f9',
                                            '& .MuiLinearProgress-bar': {
                                                backgroundColor: '#f1f5f9',
                                                borderRadius: 12
                                            }
                                        }}
                                    />
                                    <LinearProgress
                                        variant="determinate"
                                        value={item.percentage}
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: 24,
                                            borderRadius: 12,
                                            backgroundColor: 'transparent',
                                            '& .MuiLinearProgress-bar': {
                                                backgroundColor: item.color,
                                                borderRadius: 12
                                            }
                                        }}
                                    />
                                </Box>
                            </Box>
                        ))}
                    </CardContent>
                </Card>

                {/* ================= TREND ================= */}
                <Card sx={{
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    border: '1px solid rgba(226, 232, 240, 0.8)',
                    borderRadius: '12px',
                    mb: 4
                }}>
                    <CardContent sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{
                            fontWeight: 600,
                            color: '#e91e63',
                            fontSize: '16px',
                            mb: 3,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}>
                            <BarChart />
                            Recovery Trend
                        </Typography>

                        <Box sx={{
                            display: 'flex',
                            alignItems: 'end',
                            gap: 2,
                            mt: 3,
                            height: 200,
                            px: 2
                        }}>
                            {recoveryTrendData.map((data, index) => (
                                <Box key={index} sx={{
                                    flex: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center'
                                }}>
                                    <Box sx={{
                                        display: 'flex',
                                        alignItems: 'end',
                                        gap: 1,
                                        mb: 1,
                                        height: 150
                                    }}>
                                        <Box sx={{
                                            width: 18,
                                            height: `${data.paid * 7}px`,
                                            backgroundColor: '#e91e63',
                                            borderRadius: '3px 3px 0 0',
                                            boxShadow: '0 2px 4px rgba(233, 30, 99, 0.3)'
                                        }} />
                                        <Box sx={{
                                            width: 18,
                                            height: `${data.outstanding * 7}px`,
                                            backgroundColor: '#9e9e9e',
                                            borderRadius: '3px 3px 0 0',
                                            boxShadow: '0 2px 4px rgba(158, 158, 158, 0.3)'
                                        }} />
                                    </Box>
                                    <Typography variant="caption" sx={{
                                        fontSize: '12px',
                                        color: '#64748b',
                                        fontWeight: 500
                                    }}>
                                        {data.month}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>

                        <Box sx={{
                            display: 'flex',
                            gap: 3,
                            mt: 2,
                            justifyContent: 'center'
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{
                                    width: 16,
                                    height: 12,
                                    backgroundColor: '#e91e63',
                                    borderRadius: 2
                                }} />
                                <Typography variant="caption" sx={{ fontWeight: 500 }}>
                                    Paid
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{
                                    width: 16,
                                    height: 12,
                                    backgroundColor: '#9e9e9e',
                                    borderRadius: 2
                                }} />
                                <Typography variant="caption" sx={{ fontWeight: 500 }}>
                                    Outstanding
                                </Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>

                {/* ================= LARGE LOSS TABLE ================= */}
                <Card sx={{
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    border: '1px solid rgba(226, 232, 240, 0.8)',
                    borderRadius: '12px',
                    mb: 4
                }}>
                    <CardContent sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{
                            fontWeight: 600,
                            color: '#e91e63',
                            fontSize: '16px',
                            mb: 3,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}>
                            <Warning />
                            Large Loss & CAT Claims
                        </Typography>

                        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '12px', color: '#475569' }}>Claim #</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '12px', color: '#475569' }}>Event</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '12px', color: '#475569' }}>LOB</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '12px', color: '#475569' }}>Gross Loss</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '12px', color: '#475569' }}>Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {largeLossClaims.map((claim, index) => (
                                        <TableRow key={index} sx={{ '&:hover': { backgroundColor: '#f8fafc' } }}>
                                            <TableCell sx={{ fontWeight: 600, fontSize: '13px' }}>{claim.claimId}</TableCell>
                                            <TableCell sx={{ fontSize: '13px' }}>{claim.event}</TableCell>
                                            <TableCell sx={{ fontSize: '13px' }}>{claim.lob}</TableCell>
                                            <TableCell sx={{ fontWeight: 600, fontSize: '13px' }}>{claim.grossLoss}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={claim.status}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: `${claim.statusColor}15`,
                                                        color: claim.statusColor,
                                                        fontWeight: 500,
                                                        fontSize: '11px'
                                                    }}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>

                {/* ================= SUMMARY ================= */}
                <Card sx={{
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    border: '1px solid rgba(226, 232, 240, 0.8)',
                    borderRadius: '12px'
                }}>
                    <CardContent sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{
                            fontWeight: 600,
                            color: '#e91e63',
                            fontSize: '16px',
                            mb: 3,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}>
                            <Description />
                            Period Summary
                        </Typography>

                        <Grid container spacing={3}>
                            <Grid item xs={6} md={2}><Typography sx={{ fontSize: '14px' }}>Claims: <b>142</b></Typography></Grid>
                            <Grid item xs={6} md={2}><Typography sx={{ fontSize: '14px' }}>Avg Days: <b>38</b></Typography></Grid>
                            <Grid item xs={6} md={2}><Typography sx={{ fontSize: '14px' }}>Aged 90+: <b>18</b></Typography></Grid>
                            <Grid item xs={6} md={2}><Typography sx={{ fontSize: '14px' }}>Top RI: <b>Swiss Re</b></Typography></Grid>
                            <Grid item xs={6} md={2}><Typography sx={{ fontSize: '14px' }}>CAT Events: <b>3</b></Typography></Grid>
                            <Grid item xs={6} md={2}><Typography sx={{ fontSize: '14px' }}>Disputed: <b>$4.1M</b></Typography></Grid>
                        </Grid>
                    </CardContent>
                </Card>

                {/* Footer */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    color: '#64748b',
                    fontSize: '12px',
                    pt: 4,
                    borderTop: '1px solid #e2e8f0',
                    mt: 4
                }}>
                    <Typography variant="caption" sx={{ fontSize: '12px' }}>
                        © 2026 Claims & Recoveries Dashboard | Data refreshed every 24 hours
                    </Typography>
                </Box>
            </Box>

        </Box>
    );
};

export default ClaimsRecoveriesDashboard;
