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
    IconButton,
    Chip
} from '@mui/material';
import {
    Assessment,
    TrendingUp,
    TrendingDown,
    ChevronLeft,
    ChevronRight,
    BarChart,
    FilterAlt,
    Shield,
    SwapHoriz,
    Timeline,
    Refresh,
    Warning
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
const Line = dynamic(() => import('react-chartjs-2').then((mod) => mod.Line), {
    ssr: false,
});

const Bar = dynamic(() => import('react-chartjs-2').then((mod) => mod.Bar), {
    ssr: false,
});

const ActuarialRiskDashboard = () => {
    const [currentYear, setCurrentYear] = useState(2023);
    const [lob, setLob] = useState('all');
    const [scenario, setScenario] = useState('baseline');
    const [lossTriangleView, setLossTriangleView] = useState('gross');
    const [stressView, setStressView] = useState('waterfall');
    const [isClient, setIsClient] = useState(false);

    // Metrics state
    const [metrics, setMetrics] = useState({
        grossRatio: 68.2,
        cededRatio: 24.7,
        netRatio: 43.5,
        retentionScore: 87
    });

    useEffect(() => {
        setIsClient(true);
        updateMetrics();
    }, [currentYear, lob, scenario]);

    const updateMetrics = () => {
        let grossRatio, cededRatio, netRatio, retentionScore;

        // Base calculations based on LOB
        if (lob === 'all') {
            grossRatio = 68.2 + (currentYear - 2023) * 0.5;
            cededRatio = 24.7 + (currentYear - 2023) * 0.2;
            netRatio = 43.5 + (currentYear - 2023) * 0.3;
            retentionScore = 87 + (currentYear - 2023) * 0.8;
        } else if (lob === 'commercial_auto') {
            grossRatio = 75.3 + (currentYear - 2023) * 0.7;
            cededRatio = 28.1 + (currentYear - 2023) * 0.3;
            netRatio = 47.2 + (currentYear - 2023) * 0.4;
            retentionScore = 82 + (currentYear - 2023) * 1.2;
        } else if (lob === 'workers_comp') {
            grossRatio = 62.8 + (currentYear - 2023) * 0.4;
            cededRatio = 21.5 + (currentYear - 2023) * 0.1;
            netRatio = 41.3 + (currentYear - 2023) * 0.3;
            retentionScore = 91 + (currentYear - 2023) * 0.5;
        } else {
            grossRatio = 65.5 + (currentYear - 2023) * 0.6;
            cededRatio = 23.8 + (currentYear - 2023) * 0.2;
            netRatio = 41.7 + (currentYear - 2023) * 0.4;
            retentionScore = 85 + (currentYear - 2023) * 0.9;
        }

        // Apply scenario adjustments
        if (scenario === 'moderate_stress') {
            grossRatio *= 1.15;
            cededRatio *= 1.1;
            netRatio *= 1.18;
            retentionScore *= 0.92;
        } else if (scenario === 'severe_stress') {
            grossRatio *= 1.35;
            cededRatio *= 1.25;
            netRatio *= 1.4;
            retentionScore *= 0.82;
        } else if (scenario === 'catastrophe') {
            grossRatio *= 1.8;
            cededRatio *= 1.5;
            netRatio *= 2.0;
            retentionScore *= 0.65;
        }

        setMetrics({
            grossRatio: Math.min(grossRatio, 150),
            cededRatio: Math.min(cededRatio, 100),
            netRatio: Math.min(netRatio, 120),
            retentionScore: Math.min(retentionScore, 100)
        });
    };

    // Loss Triangle Chart Data
    const lossTriangleData = {
        labels: ['2018', '2019', '2020', '2021', '2022', '2023'],
        datasets: [
            {
                label: 'Gross Loss',
                data: [650, 720, 680, 810, 790, 850],
                backgroundColor: 'rgba(233, 30, 99, 0.1)',
                borderColor: '#e91e63',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                hidden: lossTriangleView !== 'gross'
            },
            {
                label: 'Ceded Loss',
                data: [230, 250, 220, 280, 260, 300],
                backgroundColor: 'rgba(255, 152, 0, 0.1)',
                borderColor: '#ff9800',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                hidden: lossTriangleView !== 'ceded'
            },
            {
                label: 'Net Loss',
                data: [420, 470, 460, 530, 530, 550],
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                borderColor: '#4caf50',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                hidden: lossTriangleView !== 'net'
            }
        ]
    };

    // Stress Scenario Chart Data
    const stressScenarioData = {
        labels: ['Baseline', 'Premium Change', 'Loss Trend', 'CAT Event', 'Reinsurance', 'Net Impact'],
        datasets: [{
            label: 'Capital Impact',
            data: [100, 15, -25, -40, 20, 70],
            backgroundColor: [
                '#e91e63',
                '#4caf50',
                '#f44336',
                '#f44336',
                '#4caf50',
                '#9c27b0'
            ],
            borderColor: [
                '#e91e63',
                '#4caf50',
                '#f44336',
                '#f44336',
                '#4caf50',
                '#9c27b0'
            ],
            borderWidth: 1,
            borderRadius: 4
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
                    text: 'Loss Amount ($M)',
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
                position: 'top' as const,
                labels: {
                    usePointStyle: true,
                    font: {
                        size: 12
                    }
                }
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

    const barChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Capital ($M)',
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
                    display: false
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
                cornerRadius: 8,
                callbacks: {
                    label: function (context: any) {
                        return `Capital Impact: $${context.raw}M`;
                    }
                }
            }
        }
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
                        Actuarial & Risk Exposure Dashboard
                    </Typography>
                    <Typography variant="body1" sx={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '14px'
                    }}>
                        Monitor loss ratios, retention adequacy, and stress scenario impacts across lines of business
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

            <Box sx={{ p: 3 }}>
                {/* Controls Panel */}
                <Card sx={{
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    border: '1px solid rgba(226, 232, 240, 0.8)',
                    borderRadius: '12px',
                    mb: 4
                }}>
                    <CardContent sx={{ p: 3 }}>
                        <Grid container spacing={3} alignItems="center">
                            <Grid item xs={12} sm={6} md={3}>
                                <Typography variant="caption" sx={{
                                    color: '#64748b',
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    mb: 1,
                                    display: 'block'
                                }}>
                                    Year
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <IconButton
                                        size="small"
                                        onClick={() => setCurrentYear(prev => prev - 1)}
                                        sx={{ color: '#e91e63' }}
                                    >
                                        <ChevronLeft />
                                    </IconButton>
                                    <Typography variant="h6" sx={{
                                        fontWeight: 600,
                                        minWidth: '60px',
                                        textAlign: 'center',
                                        color: '#1e293b'
                                    }}>
                                        {currentYear}
                                    </Typography>
                                    <IconButton
                                        size="small"
                                        onClick={() => setCurrentYear(prev => prev + 1)}
                                        sx={{ color: '#e91e63' }}
                                    >
                                        <ChevronRight />
                                    </IconButton>
                                </Box>
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Line of Business</InputLabel>
                                    <Select
                                        value={lob}
                                        label="Line of Business"
                                        onChange={(e) => setLob(e.target.value)}
                                    >
                                        <MenuItem value="all">All Lines</MenuItem>
                                        <MenuItem value="commercial_auto">Commercial Auto</MenuItem>
                                        <MenuItem value="workers_comp">Workers Compensation</MenuItem>
                                        <MenuItem value="general_liability">General Liability</MenuItem>
                                        <MenuItem value="property">Property</MenuItem>
                                        <MenuItem value="professional_liability">Professional Liability</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Scenario</InputLabel>
                                    <Select
                                        value={scenario}
                                        label="Scenario"
                                        onChange={(e) => setScenario(e.target.value)}
                                    >
                                        <MenuItem value="baseline">Baseline Scenario</MenuItem>
                                        <MenuItem value="moderate_stress">Moderate Stress</MenuItem>
                                        <MenuItem value="severe_stress">Severe Stress</MenuItem>
                                        <MenuItem value="catastrophe">Catastrophe Event</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#64748b' }}>
                                    <Refresh sx={{ fontSize: 16 }} />
                                    <Typography variant="caption" sx={{ fontSize: '12px' }}>
                                        Updated in real-time
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                {/* KPI Cards */}
                <Grid container spacing={{ xs: 2, md: 4 }} sx={{ mb: 5 }}>
                    {[
                        {
                            title: 'Gross Loss Ratio',
                            value: `${metrics.grossRatio.toFixed(1)}%`,
                            icon: <BarChart />,
                            color: '#e91e63',
                            trend: '+2.1% vs prior year',
                            trendUp: true
                        },
                        {
                            title: 'Ceded Loss Ratio',
                            value: `${metrics.cededRatio.toFixed(1)}%`,
                            icon: <SwapHoriz />,
                            color: '#ff9800',
                            trend: '-1.3% vs prior year',
                            trendUp: false
                        },
                        {
                            title: 'Net Loss Ratio',
                            value: `${metrics.netRatio.toFixed(1)}%`,
                            icon: <FilterAlt />,
                            color: '#4caf50',
                            trend: '-3.4% vs prior year',
                            trendUp: false
                        },
                        {
                            title: 'Retention Adequacy',
                            value: `${Math.min(metrics.retentionScore, 100).toFixed(0)}%`,
                            icon: <Shield />,
                            color: '#9c27b0',
                            trend: '+5% vs prior year',
                            trendUp: true
                        }
                    ].map((kpi, i) => (
                        <Grid item xs={12} sm={6} md={3} key={i}>
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

                {/* Loss Triangle Chart */}
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
                                <Timeline />
                                Loss Triangle – Gross / Ceded / Net (Selectable View)
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                {['gross', 'ceded', 'net'].map((view) => (
                                    <Button
                                        key={view}
                                        variant={lossTriangleView === view ? 'contained' : 'outlined'}
                                        size="small"
                                        onClick={() => setLossTriangleView(view)}
                                        sx={{
                                            backgroundColor: lossTriangleView === view ? '#e91e63' : 'transparent',
                                            borderColor: '#e91e63',
                                            color: lossTriangleView === view ? 'white' : '#e91e63',
                                            textTransform: 'capitalize',
                                            '&:hover': {
                                                backgroundColor: lossTriangleView === view ? '#ad1457' : 'rgba(233, 30, 99, 0.05)'
                                            }
                                        }}
                                    >
                                        {view}
                                    </Button>
                                ))}
                            </Box>
                        </Box>
                        <Box sx={{ height: 300 }}>
                            {isClient && (
                                <Line
                                    data={lossTriangleData}
                                    options={chartOptions}
                                />
                            )}
                        </Box>
                    </CardContent>
                </Card>

                {/* Stress Scenario Chart */}
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
                                <BarChart />
                                Stress Scenario Impact on Retention & Capital
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                {['waterfall', 'bar'].map((view) => (
                                    <Button
                                        key={view}
                                        variant={stressView === view ? 'contained' : 'outlined'}
                                        size="small"
                                        onClick={() => setStressView(view)}
                                        sx={{
                                            backgroundColor: stressView === view ? '#e91e63' : 'transparent',
                                            borderColor: '#e91e63',
                                            color: stressView === view ? 'white' : '#e91e63',
                                            textTransform: 'capitalize',
                                            '&:hover': {
                                                backgroundColor: stressView === view ? '#ad1457' : 'rgba(233, 30, 99, 0.05)'
                                            }
                                        }}
                                    >
                                        {view === 'waterfall' ? 'Waterfall' : 'Bar Chart'}
                                    </Button>
                                ))}
                            </Box>
                        </Box>
                        <Box sx={{ height: 350 }}>
                            {isClient && (
                                <Bar
                                    data={stressScenarioData}
                                    options={barChartOptions}
                                />
                            )}
                        </Box>
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
                        Actuarial & Risk Exposure Dashboard • Data as of Q4 2023 • For internal actuarial use only
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Refresh sx={{ fontSize: 14 }} />
                            <Typography variant="caption" sx={{ fontSize: '11px' }}>
                                Updated in real-time
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Warning sx={{ fontSize: 14 }} />
                            <Typography variant="caption" sx={{ fontSize: '11px' }}>
                                Stress tests run quarterly
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default ActuarialRiskDashboard;
