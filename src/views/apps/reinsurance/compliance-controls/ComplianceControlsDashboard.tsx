'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    LinearProgress,
    TextField
} from '@mui/material';
import {
    Assessment,
    TrendingUp,
    TrendingDown,
    Download,
    CheckCircle,
    Warning,
    Error,
    Timeline,
    Security,
    Gavel,
    CalendarToday,
    Refresh
} from '@mui/icons-material';

// Register Chart.js components
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

// Dynamic imports for Chart.js components to avoid SSR issues
const Line = dynamic(() => import('react-chartjs-2').then((mod) => mod.Line), {
    ssr: false,
});

const ComplianceControlsDashboard = () => {
    const [regulator, setRegulator] = useState('all');
    const [period, setPeriod] = useState('2024-04');
    const [trendPeriod, setTrendPeriod] = useState('6m');
    const [complianceStatus, setComplianceStatus] = useState('green');
    const [isClient, setIsClient] = useState(false);

    // Metrics state
    const [metrics, setMetrics] = useState({
        inLimitCessions: 94.2,
        exceptions: 23,
        overrides: 7,
        lateCessions: 4,
        securityBreaches: 0
    });

    useEffect(() => {
        setIsClient(true);
        updateMetrics();
    }, [regulator, period]);

    const updateMetrics = () => {
        if (regulator === 'all') {
            setMetrics({
                inLimitCessions: 94.2,
                exceptions: 23,
                overrides: 7,
                lateCessions: 4,
                securityBreaches: 0
            });
        } else {
            // Simulate different data for different regulators
            setMetrics({
                inLimitCessions: 96.5,
                exceptions: 18,
                overrides: 5,
                lateCessions: 2,
                securityBreaches: 0
            });
        }
    };

    // Exception Trend Chart Data
    const exceptionTrendData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Exceptions',
            data: [28, 25, 30, 23, 26, 23],
            backgroundColor: 'rgba(233, 30, 99, 0.1)',
            borderColor: '#e91e63',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#e91e63',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 6
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Number of Exceptions',
                    color: '#64748b'
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                },
                ticks: {
                    color: '#64748b'
                }
            },
            x: {
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                },
                ticks: {
                    color: '#64748b'
                }
            }
        },
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: 'white',
                titleColor: '#1e293b',
                bodyColor: '#64748b',
                borderColor: '#e2e8f0',
                borderWidth: 1,
                cornerRadius: 8
            }
        }
    };

    // Reinsurer data
    const reinsurerData = [
        {
            name: 'Global Reinsurance Ltd.',
            rating: 'AA+',
            ratingColor: '#4caf50',
            exposure: 85,
            exposureAmount: '$42.5M',
            country: 'Switzerland',
            status: 'Compliant',
            statusColor: '#4caf50'
        },
        {
            name: 'North Star Re',
            rating: 'A+',
            ratingColor: '#4caf50',
            exposure: 60,
            exposureAmount: '$28.1M',
            country: 'United States',
            status: 'Compliant',
            statusColor: '#4caf50'
        },
        {
            name: 'Alpine Risk Partners',
            rating: 'BBB',
            ratingColor: '#ff9800',
            exposure: 30,
            exposureAmount: '$15.7M',
            country: 'Germany',
            status: 'Under Review',
            statusColor: '#ff9800'
        },
        {
            name: 'Pacific Reinsurance Co.',
            rating: 'AA',
            ratingColor: '#4caf50',
            exposure: 60,
            exposureAmount: '$32.4M',
            country: 'Japan',
            status: 'Compliant',
            statusColor: '#4caf50'
        },
        {
            name: 'Equatorial Re',
            rating: 'BB',
            ratingColor: '#f44336',
            exposure: 30,
            exposureAmount: '$8.9M',
            country: 'Singapore',
            status: 'Action Required',
            statusColor: '#f44336'
        },
        {
            name: 'London & Continental Re',
            rating: 'A++',
            ratingColor: '#4caf50',
            exposure: 85,
            exposureAmount: '$50.2M',
            country: 'United Kingdom',
            status: 'Compliant',
            statusColor: '#4caf50'
        }
    ];

    const getComplianceStatusInfo = () => {
        switch (complianceStatus) {
            case 'green':
                return {
                    icon: <CheckCircle sx={{ fontSize: 40 }} />,
                    color: '#4caf50',
                    title: 'All treaties are compliant',
                    description: 'All cession treaties meet regulatory requirements and internal controls. No critical exceptions detected in the current period.'
                };
            case 'amber':
                return {
                    icon: <Warning sx={{ fontSize: 40 }} />,
                    color: '#ff9800',
                    title: 'Some treaties under review',
                    description: '3 treaties have exceptions that require review. No critical compliance issues detected.'
                };
            case 'red':
                return {
                    icon: <Error sx={{ fontSize: 40 }} />,
                    color: '#f44336',
                    title: 'Critical exceptions detected',
                    description: '7 treaties have critical exceptions requiring immediate action. Compliance team notified.'
                };
            default:
                return {
                    icon: <CheckCircle sx={{ fontSize: 40 }} />,
                    color: '#4caf50',
                    title: 'All treaties are compliant',
                    description: 'All cession treaties meet regulatory requirements and internal controls. No critical exceptions detected in the current period.'
                };
        }
    };

    const handleStatusClick = () => {
        if (complianceStatus === 'green') {
            setComplianceStatus('amber');
        } else if (complianceStatus === 'amber') {
            setComplianceStatus('red');
        } else {
            setComplianceStatus('green');
        }
    };

    const handleExportData = () => {
        alert('Data export would be initiated. In a real application, this would download a CSV or PDF file.');
    };

    if (!isClient) {
        return (
            <Box sx={{
                backgroundColor: '#f8fafc',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Typography>Loading Dashboard...</Typography>
            </Box>
        );
    }

    const statusInfo = getComplianceStatusInfo();

    return (
        <Box sx={{
            backgroundColor: '#f8fafc',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 25%, #f8fafc 50%, #f1f5f9 75%, #e2e8f0 100%)',
            p: { xs: 2, sm: 3, md: 4 }
        }}>
            {/* Header */}
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
                        Compliance & Controls Dashboard
                    </Typography>
                    <Typography variant="body1" sx={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '14px'
                    }}>
                        Regulatory Compliance • Risk Controls • Treaty Monitoring
                    </Typography>
                </Box>

                {/* Header Controls */}
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <FormControl size="small" sx={{
                        minWidth: 200,
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: 'rgba(255, 255, 255, 0.15)',
                            borderRadius: '8px',
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'rgba(255, 255, 255, 0.3)'
                            }
                        },
                        '& .MuiInputLabel-root': {
                            color: 'rgba(255, 255, 255, 0.8)'
                        }
                    }}>
                        <InputLabel>Regulator</InputLabel>
                        <Select
                            value={regulator}
                            label="Regulator"
                            onChange={(e) => setRegulator(e.target.value)}
                            sx={{
                                color: 'white',
                                fontSize: '14px',
                                '& .MuiSvgIcon-root': {
                                    color: 'rgba(255, 255, 255, 0.8)'
                                }
                            }}
                        >
                            <MenuItem value="all">All Regulators</MenuItem>
                            <MenuItem value="pra">Prudential Regulation Authority (PRA)</MenuItem>
                            <MenuItem value="fca">Financial Conduct Authority (FCA)</MenuItem>
                            <MenuItem value="eiopa">European Insurance & Occupational Pensions Authority (EIOPA)</MenuItem>
                            <MenuItem value="naic">National Association of Insurance Commissioners (NAIC)</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        type="month"
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                        size="small"
                        sx={{
                            minWidth: 150,
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                borderRadius: '8px',
                                color: 'white',
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'rgba(255, 255, 255, 0.3)'
                                }
                            }
                        }}
                    />
                </Box>
            </Box>

            <Box sx={{ px: { xs: 0, sm: 2, md: 3 } }}>
                {/* KPI Cards */}
                <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: 4 }}>
                    {[
                        {
                            title: 'In-limit Cessions',
                            value: `${metrics.inLimitCessions}%`,
                            change: '+2.1% vs last period',
                            trendUp: true,
                            color: '#e91e63'
                        },
                        {
                            title: 'Exceptions',
                            value: metrics.exceptions.toString(),
                            change: '+3 vs last period',
                            trendUp: false,
                            color: '#ff9800'
                        },
                        {
                            title: 'Overrides',
                            value: metrics.overrides.toString(),
                            change: '-2 vs last period',
                            trendUp: true,
                            color: '#2196f3'
                        },
                        {
                            title: 'Late Cessions',
                            value: metrics.lateCessions.toString(),
                            change: '-1 vs last period',
                            trendUp: true,
                            color: '#4caf50'
                        },
                        {
                            title: 'Security Breaches',
                            value: metrics.securityBreaches.toString(),
                            change: 'No change',
                            trendUp: null,
                            color: '#9c27b0'
                        }
                    ].map((kpi, i) => (
                        <Grid item xs={12} sm={6} md={2.4} key={i}>
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
                                <CardContent sx={{ p: { xs: 2, md: 3 }, position: 'relative', zIndex: 1, textAlign: 'center' }}>
                                    <Typography variant="caption" sx={{
                                        color: '#64748b',
                                        fontSize: '12px',
                                        fontWeight: 600,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px',
                                        mb: 2,
                                        display: 'block'
                                    }}>
                                        {kpi.title}
                                    </Typography>
                                    <Typography variant="h4" sx={{
                                        fontWeight: 800,
                                        color: '#1e293b',
                                        fontSize: { xs: '20px', md: '24px' },
                                        mb: 1
                                    }}>
                                        {kpi.value}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                                        {kpi.trendUp === true && (
                                            <TrendingUp sx={{ fontSize: 16, color: '#059669' }} />
                                        )}
                                        {kpi.trendUp === false && (
                                            <TrendingDown sx={{ fontSize: 16, color: '#dc2626' }} />
                                        )}
                                        <Typography variant="caption" sx={{
                                            fontSize: '11px',
                                            color: kpi.trendUp === true ? '#059669' : kpi.trendUp === false ? '#dc2626' : '#64748b',
                                            fontWeight: 600
                                        }}>
                                            {kpi.change}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Charts Row */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    {/* Exception Trend Chart */}
                    <Grid item xs={12} md={8}>
                        <Card sx={{
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                            border: '1px solid rgba(226, 232, 240, 0.8)',
                            borderRadius: '12px'
                        }}>
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                    <Typography variant="h6" sx={{
                                        fontWeight: 600,
                                        color: '#e91e63',
                                        fontSize: '16px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1
                                    }}>
                                        <Timeline />
                                        Exception Trend (Line)
                                    </Typography>
                                    <FormControl size="small" sx={{ minWidth: 150 }}>
                                        <Select
                                            value={trendPeriod}
                                            onChange={(e) => setTrendPeriod(e.target.value)}
                                        >
                                            <MenuItem value="6m">Last 6 Months</MenuItem>
                                            <MenuItem value="1y">Last Year</MenuItem>
                                            <MenuItem value="2y">Last 2 Years</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                                <Box sx={{ height: 200 }}>
                                    {isClient && (
                                        <Line
                                            data={exceptionTrendData}
                                            options={chartOptions}
                                        />
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Treaty Compliance Status */}
                    <Grid item xs={12} md={4}>
                        <Card sx={{
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                            border: '1px solid rgba(226, 232, 240, 0.8)',
                            borderRadius: '12px',
                            height: '100%'
                        }}>
                            <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <Typography variant="h6" sx={{
                                    fontWeight: 600,
                                    color: '#e91e63',
                                    fontSize: '16px',
                                    mb: 3,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1
                                }}>
                                    <Security />
                                    Treaty Compliance Status (Traffic Light)
                                </Typography>

                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flex: 1,
                                    gap: 2
                                }}>
                                    <Box
                                        onClick={handleStatusClick}
                                        sx={{
                                            width: 80,
                                            height: 80,
                                            borderRadius: '50%',
                                            backgroundColor: statusInfo.color,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            cursor: 'pointer',
                                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'scale(1.05)',
                                                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)'
                                            }
                                        }}
                                    >
                                        {statusInfo.icon}
                                    </Box>

                                    <Box sx={{ textAlign: 'center', maxWidth: 250 }}>
                                        <Typography variant="subtitle1" sx={{
                                            fontWeight: 600,
                                            color: '#1e293b',
                                            mb: 1
                                        }}>
                                            {statusInfo.title}
                                        </Typography>
                                        <Typography variant="body2" sx={{
                                            color: '#64748b',
                                            lineHeight: 1.6,
                                            fontSize: '13px'
                                        }}>
                                            {statusInfo.description}
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Reinsurer Rating & Exposure Matrix Table */}
                <Card sx={{
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    border: '1px solid rgba(226, 232, 240, 0.8)',
                    borderRadius: '12px',
                    mb: 4
                }}>
                    <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h6" sx={{
                                fontWeight: 600,
                                color: '#e91e63',
                                fontSize: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            }}>
                                <Gavel />
                                Reinsurer Rating & Exposure Matrix (Table)
                            </Typography>
                            <Button
                                variant="contained"
                                startIcon={<Download />}
                                onClick={handleExportData}
                                sx={{
                                    backgroundColor: '#e91e63',
                                    '&:hover': { backgroundColor: '#ad1457' }
                                }}
                            >
                                Export Data
                            </Button>
                        </Box>

                        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '12px', color: '#475569' }}>Reinsurer</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '12px', color: '#475569' }}>Rating</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '12px', color: '#475569' }}>Exposure</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '12px', color: '#475569' }}>Country</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '12px', color: '#475569' }}>Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {reinsurerData.map((reinsurer, index) => (
                                        <TableRow key={index} sx={{ '&:hover': { backgroundColor: '#f8fafc' } }}>
                                            <TableCell sx={{ fontSize: '13px', fontWeight: 600 }}>
                                                {reinsurer.name}
                                            </TableCell>
                                            <TableCell>
                                                <Typography sx={{
                                                    fontSize: '13px',
                                                    fontWeight: 600,
                                                    color: reinsurer.ratingColor
                                                }}>
                                                    {reinsurer.rating}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ width: '100%' }}>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={reinsurer.exposure}
                                                        sx={{
                                                            height: 8,
                                                            borderRadius: 4,
                                                            backgroundColor: '#e9ecef',
                                                            '& .MuiLinearProgress-bar': {
                                                                backgroundColor: reinsurer.exposure > 70 ? '#dc3545' :
                                                                    reinsurer.exposure > 40 ? '#ffc107' : '#28a745',
                                                                borderRadius: 4
                                                            }
                                                        }}
                                                    />
                                                    <Typography variant="caption" sx={{
                                                        fontSize: '11px',
                                                        color: '#64748b',
                                                        mt: 0.5,
                                                        display: 'block'
                                                    }}>
                                                        {reinsurer.exposureAmount}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell sx={{ fontSize: '13px' }}>
                                                {reinsurer.country}
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={reinsurer.status}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: `${reinsurer.statusColor}15`,
                                                        color: reinsurer.statusColor,
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

                {/* Footer */}
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    color: '#64748b',
                    fontSize: '12px',
                    pt: 4,
                    borderTop: '1px solid #e2e8f0',
                    mt: 4,
                    gap: 1
                }}>
                    <Typography variant="caption" sx={{ fontSize: '12px' }}>
                        Compliance & Control Dashboard v2.1 | Data last updated: April 15, 2024 | For internal use only
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default ComplianceControlsDashboard;
