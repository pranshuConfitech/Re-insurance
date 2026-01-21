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
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    LinearProgress,
    Alert,
    AlertTitle
} from '@mui/material';
import {
    TrendingUp,
    TrendingDown,
    Assessment,
    Security,
    Description,
    Warning,
    CheckCircle,
    Download,
    Map,
    History,
    Speed,
    Inbox,
    Timeline,
    BarChart
} from '@mui/icons-material';

// Dynamic imports for Chart.js components to avoid SSR issues
const Pie = dynamic(() => import('react-chartjs-2').then((mod) => mod.Pie), {
    ssr: false,
});

const Doughnut = dynamic(() => import('react-chartjs-2').then((mod) => mod.Doughnut), {
    ssr: false,
});

const Line = dynamic(() => import('react-chartjs-2').then((mod) => mod.Line), {
    ssr: false,
});

const Bar = dynamic(() => import('react-chartjs-2').then((mod) => mod.Bar), {
    ssr: false,
});

const UnderwritingPerformanceDashboard = () => {
    const [period, setPeriod] = useState('q1-2024');
    const [lob, setLob] = useState('all');
    const [region, setRegion] = useState('all');
    const [treaty, setTreaty] = useState('all');
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);

        // Register Chart.js components
        import('chart.js').then((ChartJS) => {
            ChartJS.Chart.register(
                ChartJS.CategoryScale,
                ChartJS.LinearScale,
                ChartJS.PointElement,
                ChartJS.LineElement,
                ChartJS.BarElement,
                ChartJS.ArcElement,
                ChartJS.Title,
                ChartJS.Tooltip,
                ChartJS.Legend
            );
        });
    }, []);

    // KPI data
    const kpiData = [
        {
            title: 'Gross Premium',
            value: '₹ 1,250 Cr',
            trend: '+12.5% vs last quarter',
            trendUp: true,
            icon: <TrendingUp />,
            color: '#e91e63'
        },
        {
            title: 'Net Premium',
            value: '₹ 875 Cr',
            trend: '+8.3% vs last quarter',
            trendUp: true,
            icon: <TrendingUp />,
            color: '#2e7d32'
        },
        {
            title: 'Risk Exposure',
            value: '₹ 15,250 Cr',
            trend: 'Sum Insured Portfolio',
            trendUp: true,
            icon: <Security />,
            color: '#1976d2'
        },
        {
            title: 'Avg. Risk Score',
            value: '6.8/10',
            trend: 'Target: 7.0',
            trendUp: false,
            icon: <Assessment />,
            color: '#f57c00'
        },
        {
            title: 'Policy Count',
            value: '2,485',
            trend: '-5% vs last quarter',
            trendUp: false,
            icon: <Description />,
            color: '#9c27b0'
        },
        {
            title: 'Renewal Ratio',
            value: '78%',
            trend: 'Target: 80%',
            trendUp: false,
            icon: <Timeline />,
            color: '#ff5722'
        }
    ];

    // Risk distribution data for both bars and donut chart
    const riskDistributionData = [
        { name: 'High Risk', value: 38, color: '#dc2626', target: 25 },
        { name: 'Medium Risk', value: 42, color: '#f59e0b', target: 50 },
        { name: 'Low Risk', value: 20, color: '#059669', target: 25 }
    ];

    // Portfolio mix data for pie chart
    const portfolioMixData = [
        { name: 'Property', value: 45, color: '#1a237e' },
        { name: 'Casualty', value: 30, color: '#3949ab' },
        { name: 'Marine', value: 15, color: '#7986cb' },
        { name: 'Aviation', value: 8, color: '#9fa8da' },
        { name: 'Others', value: 2, color: '#c5cae9' }
    ];

    // Rate vs Loss data for line chart
    const rateLossData = [
        { month: 'Jan', lossRatio: 105, rateChange: 3 },
        { month: 'Feb', lossRatio: 98, rateChange: 5 },
        { month: 'Mar', lossRatio: 92, rateChange: 7 },
        { month: 'Apr', lossRatio: 88, rateChange: 6 },
        { month: 'May', lossRatio: 85, rateChange: 8 },
        { month: 'Jun', lossRatio: 82, rateChange: 9 }
    ];

    // Segment performance data for horizontal bar chart
    const segmentPerformance = [
        { segment: 'Property-Comm', ratio: 88, color: '#2e7d32' },
        { segment: 'Marine-Cargo', ratio: 92, color: '#2e7d32' },
        { segment: 'Aviation', ratio: 94, color: '#f59e0b' },
        { segment: 'Casualty-Prod', ratio: 112, color: '#dc2626' },
        { segment: 'Property-Ind', ratio: 105, color: '#dc2626' }
    ];

    // Chart.js configurations
    const riskDistributionChartData = {
        labels: riskDistributionData.map(item => item.name),
        datasets: [{
            data: riskDistributionData.map(item => item.value),
            backgroundColor: riskDistributionData.map(item => item.color),
            borderWidth: 2,
            borderColor: '#ffffff',
            hoverBorderWidth: 3,
            hoverBorderColor: '#ffffff'
        }]
    };

    const portfolioMixChartData = {
        labels: portfolioMixData.map(item => item.name),
        datasets: [{
            data: portfolioMixData.map(item => item.value),
            backgroundColor: portfolioMixData.map(item => item.color),
            borderWidth: 2,
            borderColor: '#ffffff',
            hoverBorderWidth: 3,
            hoverBorderColor: '#ffffff'
        }]
    };

    const rateLossChartData = {
        labels: rateLossData.map(item => item.month),
        datasets: [
            {
                label: 'Loss Ratio %',
                data: rateLossData.map(item => item.lossRatio),
                borderColor: '#dc2626',
                backgroundColor: 'rgba(220, 38, 38, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.3,
                yAxisID: 'y'
            },
            {
                label: 'Rate Change %',
                data: rateLossData.map(item => item.rateChange),
                borderColor: '#e91e63',
                backgroundColor: 'rgba(233, 30, 99, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.3,
                yAxisID: 'y1'
            }
        ]
    };

    const segmentPerformanceData = {
        labels: segmentPerformance.map(item => item.segment),
        datasets: [{
            label: 'Combined Ratio %',
            data: segmentPerformance.map(item => item.ratio),
            backgroundColor: segmentPerformance.map(item => item.color),
            borderWidth: 1,
            borderRadius: 4,
            borderSkipped: false
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: {
                    padding: 20,
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
                cornerRadius: 8,
                displayColors: true
            }
        }
    };

    const lineChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index' as const,
            intersect: false,
        },
        scales: {
            x: {
                grid: {
                    display: true,
                    color: '#f1f5f9'
                },
                ticks: {
                    font: {
                        size: 12
                    },
                    color: '#64748b'
                }
            },
            y: {
                type: 'linear' as const,
                display: true,
                position: 'left' as const,
                title: {
                    display: true,
                    text: 'Loss Ratio %',
                    color: '#64748b'
                },
                min: 70,
                max: 110,
                grid: {
                    color: '#f1f5f9'
                },
                ticks: {
                    color: '#64748b'
                }
            },
            y1: {
                type: 'linear' as const,
                display: true,
                position: 'right' as const,
                title: {
                    display: true,
                    text: 'Rate Change %',
                    color: '#64748b'
                },
                min: 0,
                max: 15,
                grid: {
                    drawOnChartArea: false,
                },
                ticks: {
                    color: '#64748b'
                }
            }
        },
        plugins: {
            legend: {
                position: 'top' as const,
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
        indexAxis: 'y' as const,
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                beginAtZero: true,
                max: 120,
                title: {
                    display: true,
                    text: 'Combined Ratio %',
                    color: '#64748b'
                },
                grid: {
                    color: '#f1f5f9'
                },
                ticks: {
                    color: '#64748b'
                }
            },
            y: {
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
                        return `CR: ${context.parsed.x}%`;
                    }
                }
            }
        }
    };

    // Underwriting decisions data
    const underwritingDecisions = [
        { label: 'Submitted', value: 350, color: '#e91e63' },
        { label: 'Bound', value: 285, percentage: '81%', color: '#2e7d32' },
        { label: 'Declined', value: 45, color: '#dc2626' },
        { label: 'Referred', value: 20, color: '#f59e0b' }
    ];

    // Compliance data
    const complianceData = [
        { name: 'Pricing Compliance', score: 94, status: 'success' },
        { name: 'Terms Compliance', score: 88, status: 'warning' },
        { name: 'Document Compliance', score: 96, status: 'success' }
    ];

    // Large risks data
    const largeRisks = [
        {
            rank: 1,
            client: 'Reliance Refineries',
            industry: 'Oil & Gas',
            sumInsured: '₹ 2,500 Cr',
            premium: '₹ 18.75 Cr',
            crProjection: 89,
            status: 'good'
        },
        {
            rank: 2,
            client: 'Adani Power Plant',
            industry: 'Power',
            sumInsured: '₹ 1,800 Cr',
            premium: '₹ 14.40 Cr',
            crProjection: 92,
            status: 'good'
        },
        {
            rank: 3,
            client: 'IndiGo Fleet',
            industry: 'Aviation',
            sumInsured: '₹ 1,200 Cr',
            premium: '₹ 9.60 Cr',
            crProjection: 95,
            status: 'average'
        }
    ];

    // Navigation buttons data
    const navigationButtons = [
        { label: 'Risk Map', icon: <Map /> },
        { label: 'UW Audit Trail', icon: <History /> },
        { label: 'Capacity Utilisation', icon: <Speed /> },
        { label: 'Open Referrals', icon: <Inbox /> },
        { label: 'Renewal Pipeline', icon: <Timeline /> },
        { label: 'Model Performance', icon: <BarChart /> },
        { label: 'Export Report', icon: <Download /> }
    ];

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
                        Underwriting Performance Dashboard
                    </Typography>
                    <Typography variant="body1" sx={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '14px'
                    }}>
                        Risk Selection • Pricing Adequacy • Portfolio Management
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
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
                            borderColor: 'rgba(255, 255, 255, 0.3)'
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'rgba(255, 255, 255, 0.5)'
                        },
                        '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'white',
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
                            <MenuItem value="q1-2024">Q1 2024</MenuItem>
                            <MenuItem value="q4-2023">Q4 2023</MenuItem>
                            <MenuItem value="q3-2023">Q3 2023</MenuItem>
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
                            borderColor: 'rgba(255, 255, 255, 0.3)'
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'rgba(255, 255, 255, 0.5)'
                        },
                        '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'white',
                            borderWidth: '2px'
                        }
                    }}>
                        <InputLabel>Line of Business</InputLabel>
                        <Select
                            value={lob}
                            onChange={(e) => setLob(e.target.value)}
                            label="Line of Business"
                            sx={{
                                color: 'white',
                                fontSize: '14px',
                                '& .MuiSvgIcon-root': {
                                    color: 'rgba(255, 255, 255, 0.8)'
                                }
                            }}
                        >
                            <MenuItem value="all">All</MenuItem>
                            <MenuItem value="property">Property</MenuItem>
                            <MenuItem value="casualty">Casualty</MenuItem>
                            <MenuItem value="marine">Marine</MenuItem>
                            <MenuItem value="aviation">Aviation</MenuItem>
                        </Select>
                    </FormControl>

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
                            borderColor: 'rgba(255, 255, 255, 0.3)'
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'rgba(255, 255, 255, 0.5)'
                        },
                        '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'white',
                            borderWidth: '2px'
                        }
                    }}>
                        <InputLabel>Region</InputLabel>
                        <Select
                            value={region}
                            onChange={(e) => setRegion(e.target.value)}
                            label="Region"
                            sx={{
                                color: 'white',
                                fontSize: '14px',
                                '& .MuiSvgIcon-root': {
                                    color: 'rgba(255, 255, 255, 0.8)'
                                }
                            }}
                        >
                            <MenuItem value="all">All</MenuItem>
                            <MenuItem value="north">North</MenuItem>
                            <MenuItem value="south">South</MenuItem>
                            <MenuItem value="east">East</MenuItem>
                            <MenuItem value="west">West</MenuItem>
                        </Select>
                    </FormControl>

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
                            borderColor: 'rgba(255, 255, 255, 0.3)'
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'rgba(255, 255, 255, 0.5)'
                        },
                        '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'white',
                            borderWidth: '2px'
                        }
                    }}>
                        <InputLabel>Treaty</InputLabel>
                        <Select
                            value={treaty}
                            onChange={(e) => setTreaty(e.target.value)}
                            label="Treaty"
                            sx={{
                                color: 'white',
                                fontSize: '14px',
                                '& .MuiSvgIcon-root': {
                                    color: 'rgba(255, 255, 255, 0.8)'
                                }
                            }}
                        >
                            <MenuItem value="all">All</MenuItem>
                            <MenuItem value="treaty-a">Treaty A</MenuItem>
                            <MenuItem value="treaty-b">Treaty B</MenuItem>
                            <MenuItem value="treaty-c">Treaty C</MenuItem>
                        </Select>
                    </FormControl>

                    <Typography variant="caption" sx={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '12px',
                        fontStyle: 'italic'
                    }}>
                        Last updated: Jan 20, 2026 14:30
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ px: { xs: 0, sm: 2, md: 3 } }}>
                {/* KPI Cards */}
                <Grid container spacing={{ xs: 2, md: 4 }} sx={{ mb: 5 }}>
                    {kpiData.map((kpi, index) => (
                        <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
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

                {/* Navigation Buttons */}
                <Grid container spacing={2} sx={{ mb: 4 }}>
                    {navigationButtons.map((button, index) => (
                        <Grid item xs={6} sm={4} md={3} lg={2} key={index}>
                            <Button
                                variant="outlined"
                                startIcon={button.icon}
                                fullWidth
                                sx={{
                                    py: 1.5,
                                    borderColor: '#e2e8f0',
                                    color: '#64748b',
                                    fontSize: '12px',
                                    textTransform: 'none',
                                    fontWeight: 500,
                                    '&:hover': {
                                        borderColor: '#e91e63',
                                        color: '#e91e63',
                                        backgroundColor: 'rgba(233, 30, 99, 0.05)'
                                    }
                                }}
                            >
                                {button.label}
                            </Button>
                        </Grid>
                    ))}
                </Grid>
                <Grid container spacing={4} sx={{ mb: 5 }}>
                    {/* Left Column */}
                    <Grid item xs={12} lg={6}>
                        {/* Risk Distribution */}
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
                                        fontSize: '16px'
                                    }}>
                                        Underwriting Risk Distribution
                                    </Typography>
                                    <Typography variant="caption" sx={{
                                        color: '#64748b',
                                        fontSize: '12px'
                                    }}>
                                        Target: 25% High | 50% Medium | 25% Low
                                    </Typography>
                                </Box>

                                {/* Risk Distribution Bars */}
                                <Box sx={{ mb: 3 }}>
                                    {riskDistributionData.map((risk, index) => (
                                        <Box key={index} sx={{ mb: 3 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '14px' }}>
                                                    {risk.name}
                                                </Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '14px' }}>
                                                    {risk.value}% (Target: {risk.target}%)
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
                                                    value={risk.value}
                                                    sx={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        right: 0,
                                                        height: 24,
                                                        borderRadius: 12,
                                                        backgroundColor: 'transparent',
                                                        '& .MuiLinearProgress-bar': {
                                                            backgroundColor: risk.color,
                                                            borderRadius: 12
                                                        }
                                                    }}
                                                />
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>

                                {/* Donut Chart */}
                                <Box sx={{ height: 250, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    {isClient && (
                                        <Doughnut
                                            data={riskDistributionChartData}
                                            options={chartOptions}
                                        />
                                    )}
                                </Box>
                            </CardContent>
                        </Card>

                        {/* Rate Change vs Loss Ratio */}
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
                                    mb: 3
                                }}>
                                    Rate Change vs. Loss Ratio Trend
                                </Typography>
                                <Box sx={{ height: 300 }}>
                                    {isClient && (
                                        <Line
                                            data={rateLossChartData}
                                            options={lineChartOptions}
                                        />
                                    )}
                                </Box>
                            </CardContent>
                        </Card>

                        {/* Segment Performance */}
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
                                    mb: 3
                                }}>
                                    Segment Performance - Top/Bottom 5
                                </Typography>
                                <Box sx={{ height: 300 }}>
                                    {isClient && (
                                        <Bar
                                            data={segmentPerformanceData}
                                            options={barChartOptions}
                                        />
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Right Column */}
                    <Grid item xs={12} lg={6}>
                        {/* Portfolio Mix */}
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
                                    mb: 3
                                }}>
                                    Portfolio Mix by Segment
                                </Typography>

                                {/* Pie Chart */}
                                <Box sx={{ height: 300, mb: 3 }}>
                                    {isClient && (
                                        <Pie
                                            data={portfolioMixChartData}
                                            options={chartOptions}
                                        />
                                    )}
                                </Box>

                                {/* Legend */}
                                <Box>
                                    {portfolioMixData.map((item, index) => (
                                        <Box key={index} sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            mb: 1,
                                            p: 1,
                                            borderRadius: '6px',
                                            '&:hover': { backgroundColor: '#f8fafc' }
                                        }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Box sx={{
                                                    width: 12,
                                                    height: 12,
                                                    borderRadius: '50%',
                                                    backgroundColor: item.color
                                                }} />
                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                    {item.name}
                                                </Typography>
                                            </Box>
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                {item.value}%
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            </CardContent>
                        </Card>

                        {/* Underwriting Decisions */}
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
                                    mb: 3
                                }}>
                                    Underwriting Decisions
                                </Typography>
                                <Grid container spacing={2}>
                                    {underwritingDecisions.map((decision, index) => (
                                        <Grid item xs={6} sm={3} key={index}>
                                            <Box sx={{
                                                textAlign: 'center',
                                                p: 2,
                                                backgroundColor: `${decision.color}15`,
                                                borderRadius: '12px',
                                                border: `1px solid ${decision.color}30`
                                            }}>
                                                <Typography variant="h4" sx={{
                                                    fontWeight: 800,
                                                    color: decision.color,
                                                    mb: 1
                                                }}>
                                                    {decision.value}
                                                </Typography>
                                                <Typography variant="caption" sx={{
                                                    color: '#64748b',
                                                    fontSize: '12px',
                                                    fontWeight: 600
                                                }}>
                                                    {decision.label}
                                                </Typography>
                                                {decision.percentage && (
                                                    <Typography variant="body2" sx={{
                                                        color: decision.color,
                                                        fontWeight: 700,
                                                        mt: 0.5
                                                    }}>
                                                        {decision.percentage}
                                                    </Typography>
                                                )}
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>
                            </CardContent>
                        </Card>

                        {/* Compliance */}
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
                                    mb: 3
                                }}>
                                    Underwriting Guideline Compliance
                                </Typography>
                                <Box>
                                    {complianceData.map((compliance, index) => (
                                        <Box key={index} sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            p: 2,
                                            mb: 2,
                                            backgroundColor: '#f9f9f9',
                                            borderRadius: '8px'
                                        }}>
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                {compliance.name}
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                                    {compliance.score}%
                                                </Typography>
                                                {compliance.status === 'success' ? (
                                                    <CheckCircle sx={{ color: '#2e7d32', fontSize: 20 }} />
                                                ) : (
                                                    <Warning sx={{ color: '#f57c00', fontSize: 20 }} />
                                                )}
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Alerts & Action Items */}
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
                            Alerts & Action Items
                        </Typography>

                        <Alert severity="warning" sx={{ mb: 2 }}>
                            <AlertTitle>10 policies</AlertTitle>
                            bound below minimum rate. Requires review.
                        </Alert>

                        <Alert severity="warning" sx={{ mb: 2 }}>
                            <AlertTitle>5 large risks</AlertTitle>
                            exceeding single risk capacity. Treaty coordination needed.
                        </Alert>

                        <Alert severity="success" sx={{ mb: 3 }}>
                            All renewals with adverse loss history have been repriced.
                        </Alert>

                        {/* Large Risks Table */}
                        <Typography variant="h6" sx={{
                            fontWeight: 600,
                            color: '#e91e63',
                            fontSize: '16px',
                            mb: 2,
                            mt: 3
                        }}>
                            Top 3 Large Risks Written (Q1 2024)
                        </Typography>

                        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '12px', color: '#475569' }}>Rank</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '12px', color: '#475569' }}>Client</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '12px', color: '#475569' }}>Industry</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '12px', color: '#475569' }}>Sum Insured</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '12px', color: '#475569' }}>Premium</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '12px', color: '#475569' }}>CR Projection</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {largeRisks.map((risk, index) => (
                                        <TableRow key={index} sx={{ '&:hover': { backgroundColor: '#f8fafc' } }}>
                                            <TableCell sx={{ fontSize: '13px', fontWeight: 600 }}>{risk.rank}</TableCell>
                                            <TableCell sx={{ fontSize: '13px', fontWeight: 600 }}>{risk.client}</TableCell>
                                            <TableCell sx={{ fontSize: '13px' }}>{risk.industry}</TableCell>
                                            <TableCell sx={{ fontSize: '13px', fontWeight: 600 }}>{risk.sumInsured}</TableCell>
                                            <TableCell sx={{ fontSize: '13px', fontWeight: 600 }}>{risk.premium}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={`${risk.crProjection}%`}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: risk.status === 'good' ? '#e8f5e9' : '#fff8e1',
                                                        color: risk.status === 'good' ? '#2e7d32' : '#f57c00',
                                                        fontWeight: 600,
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

                {/* Navigation Buttons */}
                <Card sx={{
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    border: '1px solid rgba(226, 232, 240, 0.8)',
                    borderRadius: '12px'
                }}>
                    <CardContent sx={{ p: 3 }}>
                        <Grid container spacing={2}>
                            {navigationButtons.map((button, index) => (
                                <Grid item xs={12} sm={6} md={3} key={index}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        startIcon={button.icon}
                                        sx={{
                                            backgroundColor: '#e91e63',
                                            color: 'white',
                                            fontWeight: 600,
                                            py: 1.5,
                                            borderRadius: '8px',
                                            textTransform: 'none',
                                            boxShadow: 'none',
                                            '&:hover': {
                                                backgroundColor: '#ad1457',
                                                boxShadow: '0 4px 12px rgba(233, 30, 99, 0.3)'
                                            }
                                        }}
                                    >
                                        {button.label}
                                    </Button>
                                </Grid>
                            ))}
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
                        © 2024 Underwriting Analytics Dashboard | Data refreshed every 24 hours
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default UnderwritingPerformanceDashboard;
