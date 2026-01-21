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
    LinearProgress,
    Chip
} from '@mui/material';
import {
    TrendingUp,
    TrendingDown,
    Assessment,
    Refresh,
    Description,
    AccountBalance,
    BarChart,
    Info
} from '@mui/icons-material';

// Register Chart.js components
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
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
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

// Dynamic imports for Chart.js components to avoid SSR issues
const Bar = dynamic(() => import('react-chartjs-2').then((mod) => mod.Bar), {
    ssr: false,
});

const Line = dynamic(() => import('react-chartjs-2').then((mod) => mod.Line), {
    ssr: false,
});

const FinanceAccountingDashboard = () => {
    const [currency, setCurrency] = useState('USD');
    const [period, setPeriod] = useState('Q4 2023');
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    // KPI data
    const kpiData = [
        {
            title: 'Ceded Premium',
            value: '$4.82M',
            trend: '+12.5% vs last quarter',
            trendUp: true,
            color: '#e91e63'
        },
        {
            title: 'Commission Receivable',
            value: '$1.26M',
            trend: '+8.3% vs last quarter',
            trendUp: true,
            color: '#e91e63'
        },
        {
            title: 'RI Payable',
            value: '$3.57M',
            trend: '-5.2% vs last quarter',
            trendUp: false,
            color: '#e91e63'
        },
        {
            title: 'Net RI Balance',
            value: '$2.51M',
            trend: '+15.7% vs last quarter',
            trendUp: true,
            color: '#4caf50'
        }
    ];

    // Bordereaux data
    const bordereauxData = [
        {
            title: 'Premium Bordereaux',
            status: '75% Submitted',
            submitted: 45,
            total: 60,
            pending: 15,
            pastDue: 5,
            color: '#3498db',
            statusColor: '#27ae60'
        },
        {
            title: 'Claims Bordereaux',
            status: '60% Submitted',
            submitted: 36,
            total: 60,
            pending: 24,
            pastDue: 8,
            color: '#9b59b6',
            statusColor: '#e67e22'
        }
    ];

    // RI Payables vs Receivables Aging Chart Data
    const agingChartData = {
        labels: ['Current', '1-30 Days', '31-60 Days', '61-90 Days', '90+ Days'],
        datasets: [
            {
                label: 'Receivables',
                data: [12.5, 8.2, 5.1, 3.3, 1.8],
                backgroundColor: 'rgba(52, 152, 219, 0.7)',
                borderColor: 'rgba(52, 152, 219, 1)',
                borderWidth: 1
            },
            {
                label: 'Payables',
                data: [10.3, 6.5, 4.2, 2.7, 1.2],
                backgroundColor: 'rgba(231, 76, 60, 0.7)',
                borderColor: 'rgba(231, 76, 60, 1)',
                borderWidth: 1
            }
        ]
    };

    // FX Impact Chart Data
    const fxChartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'EUR Impact',
                data: [0.12, -0.05, 0.08, 0.15, -0.03, 0.10, 0.18, 0.12, 0.09, -0.02, 0.07, 0.14],
                borderColor: 'rgba(155, 89, 182, 1)',
                backgroundColor: 'rgba(155, 89, 182, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            },
            {
                label: 'GBP Impact',
                data: [0.08, 0.12, -0.04, 0.06, 0.14, 0.09, -0.02, 0.11, 0.07, 0.13, 0.05, 0.10],
                borderColor: 'rgba(46, 204, 113, 1)',
                backgroundColor: 'rgba(46, 204, 113, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }
        ]
    };

    // Chart options
    const barChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Amount ($M)'
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        },
        plugins: {
            legend: {
                position: 'top' as const,
            },
            tooltip: {
                callbacks: {
                    label: function (context: any) {
                        return `${context.dataset.label}: $${context.parsed.y}M`;
                    }
                }
            }
        }
    };

    const lineChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                title: {
                    display: true,
                    text: 'FX Impact (%)'
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                }
            },
            x: {
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                }
            }
        },
        plugins: {
            legend: {
                position: 'top' as const,
            },
            tooltip: {
                callbacks: {
                    label: function (context: any) {
                        let value = context.parsed.y;
                        let sign = value >= 0 ? '+' : '';
                        return `${context.dataset.label}: ${sign}${value}%`;
                    }
                }
            }
        }
    };

    if (!isClient) {
        return (
            <Box sx={{
                backgroundColor: '#f5f7fa',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Typography>Loading Dashboard...</Typography>
            </Box>
        );
    }

    return (
        <Box>
            {/* Header */}
            <Box sx={{
                mb: 3,
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'flex-start', md: 'center' },
                gap: 2,
                p: 3,
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
                        Finance & Reinsurance Accounting Dashboard
                    </Typography>
                    <Typography variant="body1" sx={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '14px'
                    }}>
                        Financial Management • Bordereaux Processing • FX Analytics
                    </Typography>
                </Box>

                {/* Controls */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 2
                }}>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <FormControl size="small" sx={{
                            minWidth: 100,
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                borderRadius: '8px',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                                },
                                '&.Mui-focused': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                                }
                            },
                            '& .MuiInputLabel-root': {
                                color: 'rgba(255, 255, 255, 0.8)',
                                '&.Mui-focused': {
                                    color: 'white'
                                }
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'rgba(255, 255, 255, 0.5) !important'
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'rgba(255, 255, 255, 0.5) !important'
                            },
                            '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'white !important',
                                borderWidth: '2px'
                            }
                        }}>
                            <InputLabel>Currency</InputLabel>
                            <Select
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value)}
                                label="Currency"
                                sx={{
                                    color: 'white',
                                    fontSize: '14px',
                                    '& .MuiSvgIcon-root': {
                                        color: 'rgba(255, 255, 255, 0.8)'
                                    }
                                }}
                            >
                                <MenuItem value="USD">USD</MenuItem>
                                <MenuItem value="EUR">EUR</MenuItem>
                                <MenuItem value="GBP">GBP</MenuItem>
                                <MenuItem value="JPY">JPY</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl size="small" sx={{
                            minWidth: 120,
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                borderRadius: '8px',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                                },
                                '&.Mui-focused': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                                }
                            },
                            '& .MuiInputLabel-root': {
                                color: 'rgba(255, 255, 255, 0.8)',
                                '&.Mui-focused': {
                                    color: 'white'
                                }
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'rgba(255, 255, 255, 0.5) !important'
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'rgba(255, 255, 255, 0.5) !important'
                            },
                            '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'white !important',
                                borderWidth: '2px'
                            }
                        }}>
                            <InputLabel>Period</InputLabel>
                            <Select
                                value={period}
                                onChange={(e) => setPeriod(e.target.value)}
                                label="Period"
                                sx={{
                                    color: 'white',
                                    fontSize: '14px',
                                    '& .MuiSvgIcon-root': {
                                        color: 'rgba(255, 255, 255, 0.8)'
                                    }
                                }}
                            >
                                <MenuItem value="Q1 2023">Q1 2023</MenuItem>
                                <MenuItem value="Q2 2023">Q2 2023</MenuItem>
                                <MenuItem value="Q3 2023">Q3 2023</MenuItem>
                                <MenuItem value="Q4 2023">Q4 2023</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>

                    <Typography variant="caption" sx={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '12px',
                        fontStyle: 'italic'
                    }}>
                        Last updated: Jan 21, 2026 14:30
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ p: 3 }}>
                {/* KPI Cards */}
                <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: 4 }}>
                    {kpiData.map((kpi, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
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
                                            {kpi.trendUp ? <TrendingUp /> : <TrendingDown />}
                                        </Box>
                                        <Typography variant="caption" sx={{
                                            color: '#64748b',
                                            fontSize: '12px',
                                            fontWeight: 600,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px'
                                        }}>
                                            {kpi.title}
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

                {/* Bordereaux Status Section */}
                <Card sx={{
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    border: '1px solid rgba(226, 232, 240, 0.8)',
                    borderRadius: '12px',
                    mb: 4,
                    background: 'white'
                }}>
                    <CardContent sx={{ p: 4 }}>
                        <Typography variant="h6" sx={{
                            fontWeight: 600,
                            color: '#e91e63',
                            fontSize: '16px',
                            mb: 3,
                            pb: 2,
                            borderBottom: '1px solid #eee',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2
                        }}>
                            <AccountBalance sx={{ color: '#e91e63' }} />
                            Bordereaux Status
                        </Typography>

                        <Grid container spacing={4}>
                            {bordereauxData.map((item, index) => (
                                <Grid item xs={12} md={6} key={index}>
                                    <Box sx={{
                                        p: 3,
                                        background: '#f8fafc',
                                        borderRadius: '8px',
                                        borderLeft: `4px solid ${item.color}`
                                    }}>
                                        <Box sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            mb: 2
                                        }}>
                                            <Typography sx={{
                                                fontWeight: 600,
                                                color: '#e91e63',
                                                fontSize: '16px'
                                            }}>
                                                {item.title}
                                            </Typography>
                                            <Chip
                                                label={item.status}
                                                size="small"
                                                sx={{
                                                    backgroundColor: index === 0 ? '#d5f4e6' : '#ffeaa7',
                                                    color: item.statusColor,
                                                    fontWeight: 500,
                                                    fontSize: '12px'
                                                }}
                                            />
                                        </Box>

                                        <Box sx={{ mb: 2 }}>
                                            <Box sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                fontSize: '14px',
                                                mb: 1
                                            }}>
                                                <Typography>Submitted: {item.submitted}/{item.total}</Typography>
                                                <Typography>Pending: {item.pending}/{item.total}</Typography>
                                            </Box>
                                            <LinearProgress
                                                variant="determinate"
                                                value={(item.submitted / item.total) * 100}
                                                sx={{
                                                    height: 8,
                                                    borderRadius: 4,
                                                    backgroundColor: '#ecf0f1',
                                                    '& .MuiLinearProgress-bar': {
                                                        backgroundColor: item.color,
                                                        borderRadius: 4
                                                    }
                                                }}
                                            />
                                        </Box>

                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                            fontSize: '14px',
                                            color: '#666'
                                        }}>
                                            <Info sx={{ fontSize: 16, color: item.color }} />
                                            <Typography sx={{ fontWeight: 600 }}>{item.pastDue} bordereaux</Typography>
                                            <Typography>past due date</Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </CardContent>
                </Card >

                {/* Charts Section */}
                <Card sx={{
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    border: '1px solid rgba(226, 232, 240, 0.8)',
                    borderRadius: '12px',
                    background: 'white'
                }}>
                    <CardContent sx={{ p: 4 }}>
                        <Typography variant="h6" sx={{
                            fontWeight: 600,
                            color: '#e91e63',
                            fontSize: '16px',
                            mb: 3,
                            pb: 2,
                            borderBottom: '1px solid #eee',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2
                        }}>
                            <BarChart sx={{ color: '#e91e63' }} />
                            RI Analytics
                        </Typography>

                        <Grid container spacing={4}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" sx={{
                                    fontWeight: 600,
                                    color: '#e91e63',
                                    fontSize: '16px',
                                    mb: 2,
                                    textAlign: 'center'
                                }}>
                                    RI Payables vs Receivables Aging
                                </Typography>
                                <Box sx={{ height: 300, position: 'relative' }}>
                                    {isClient && (
                                        <Bar
                                            data={agingChartData}
                                            options={barChartOptions}
                                        />
                                    )}
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" sx={{
                                    fontWeight: 600,
                                    color: '#e91e63',
                                    fontSize: '16px',
                                    mb: 2,
                                    textAlign: 'center'
                                }}>
                                    FX Impact on Reinsurance (USD)
                                </Typography>
                                <Box sx={{ height: 300, position: 'relative' }}>
                                    {isClient && (
                                        <Line
                                            data={fxChartData}
                                            options={lineChartOptions}
                                        />
                                    )}
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                {/* Footer */}
                <Box sx={{
                    textAlign: 'center',
                    mt: 4,
                    p: 3,
                    color: '#7f8c8d',
                    fontSize: '14px',
                    borderTop: '1px solid #eee'
                }}>
                    <Typography variant="body2">
                        Data as of December 31, 2023 | For internal use only | Reinsurance Finance & Accounting Department
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default FinanceAccountingDashboard;
