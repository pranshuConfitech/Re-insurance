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
    LinearProgress
} from '@mui/material';
import {
    TrendingUp,
    Download,
    FilterList
} from '@mui/icons-material';

// Dynamic imports for Chart.js components to avoid SSR issues
const Bar = dynamic(() => import('react-chartjs-2').then((mod) => mod.Bar), {
    ssr: false,
});

const Line = dynamic(() => import('react-chartjs-2').then((mod) => mod.Line), {
    ssr: false,
});

const TreatyPerformanceDashboard = () => {
    const [treatyType, setTreatyType] = useState('all');
    const [lob, setLob] = useState('all');
    const [period, setPeriod] = useState('q1-2024');
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

    // Treaty cards data
    const treatyCards = [
        {
            type: 'Quota Share Treaty',
            status: 'Active',
            capacity: '₹ 150 Cr',
            utilized: '₹ 112.5 Cr',
            balance: '₹ 37.5 Cr',
            combinedRatio: '94.2%',
            utilization: 75,
            statusColor: '#059669'
        },
        {
            type: 'Excess of Loss Treaty',
            status: 'Active',
            capacity: '₹ 80 Cr',
            utilized: '₹ 48 Cr',
            balance: '₹ 32 Cr',
            combinedRatio: '102.5%',
            utilization: 60,
            statusColor: '#059669'
        },
        {
            type: 'Surplus Treaty',
            status: 'Pending Renewal',
            capacity: '₹ 200 Cr',
            utilized: '₹ 160 Cr',
            balance: '₹ 40 Cr',
            combinedRatio: '89.7%',
            utilization: 80,
            statusColor: '#f59e0b'
        }
    ];

    // Chart data
    const premiumData = [
        { name: 'Quota Share', value: 112.5, color: '#3b82f6' },
        { name: 'Excess of Loss', value: 48, color: '#06b6d4' },
        { name: 'Surplus', value: 160, color: '#8b5cf6' },
        { name: 'Stop Loss', value: 65, color: '#10b981' },
        { name: 'Facultative', value: 28, color: '#f59e0b' }
    ];

    const lossRatioData = [
        { name: 'Quota Share', value: 72.5, color: '#059669' },
        { name: 'Excess of Loss', value: 102.5, color: '#dc2626' },
        { name: 'Surplus', value: 65.3, color: '#059669' },
        { name: 'Stop Loss', value: 89.2, color: '#f59e0b' },
        { name: 'Facultative', value: 115.7, color: '#dc2626' }
    ];

    // Commission data for bar chart
    const commissionData = [
        { name: 'Quota Share', earned: 8.5, payable: 7.8 },
        { name: 'Excess of Loss', earned: 3.2, payable: 2.9 },
        { name: 'Surplus', earned: 12.8, payable: 11.2 },
        { name: 'Stop Loss', earned: 4.5, payable: 4.1 },
        { name: 'Facultative', earned: 2.1, payable: 1.9 }
    ];

    // Combined ratio trend data for line chart
    const combinedRatioTrendData = [
        { quarter: 'Q2 2023', quotaShare: 88, excessLoss: 95, surplus: 82 },
        { quarter: 'Q3 2023', quotaShare: 92, excessLoss: 98, surplus: 85 },
        { quarter: 'Q4 2023', quotaShare: 89, excessLoss: 102, surplus: 87 },
        { quarter: 'Q1 2024', quotaShare: 94, excessLoss: 105, surplus: 90 }
    ];

    // Chart.js configurations
    const premiumChartData = {
        labels: premiumData.map(item => item.name),
        datasets: [{
            label: 'Ceded Premium (₹ Cr)',
            data: premiumData.map(item => item.value),
            backgroundColor: premiumData.map(item => item.color),
            borderWidth: 1,
            borderRadius: 4,
            borderSkipped: false
        }]
    };

    const lossRatioChartData = {
        labels: lossRatioData.map(item => item.name),
        datasets: [{
            label: 'Loss Ratio %',
            data: lossRatioData.map(item => item.value),
            backgroundColor: lossRatioData.map(item => item.color),
            borderWidth: 1,
            borderRadius: 4,
            borderSkipped: false
        }]
    };

    const commissionChartData = {
        labels: commissionData.map(item => item.name),
        datasets: [
            {
                label: 'Commission Earned (₹ Cr)',
                data: commissionData.map(item => item.earned),
                backgroundColor: '#3b82f6',
                borderWidth: 1,
                borderRadius: 4,
                borderSkipped: false
            },
            {
                label: 'Commission Payable (₹ Cr)',
                data: commissionData.map(item => item.payable),
                backgroundColor: '#f59e0b',
                borderWidth: 1,
                borderRadius: 4,
                borderSkipped: false
            }
        ]
    };

    const combinedRatioChartData = {
        labels: combinedRatioTrendData.map(item => item.quarter),
        datasets: [
            {
                label: 'Quota Share',
                data: combinedRatioTrendData.map(item => item.quotaShare),
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 3,
                fill: false,
                tension: 0.3
            },
            {
                label: 'Excess of Loss',
                data: combinedRatioTrendData.map(item => item.excessLoss),
                borderColor: '#dc2626',
                backgroundColor: 'rgba(220, 38, 38, 0.1)',
                borderWidth: 3,
                fill: false,
                tension: 0.3
            },
            {
                label: 'Surplus',
                data: combinedRatioTrendData.map(item => item.surplus),
                borderColor: '#059669',
                backgroundColor: 'rgba(5, 150, 105, 0.1)',
                borderWidth: 3,
                fill: false,
                tension: 0.3
            }
        ]
    };

    const barChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    color: '#64748b',
                    font: {
                        size: 12
                    }
                }
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: '#f1f5f9'
                },
                ticks: {
                    color: '#64748b',
                    font: {
                        size: 12
                    }
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

    const lineChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                grid: {
                    display: true,
                    color: '#f1f5f9'
                },
                ticks: {
                    color: '#64748b',
                    font: {
                        size: 12
                    }
                }
            },
            y: {
                beginAtZero: true,
                max: 120,
                grid: {
                    color: '#f1f5f9'
                },
                ticks: {
                    color: '#64748b',
                    font: {
                        size: 12
                    }
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

    // Large loss recoveries data
    const lossRecoveries = [
        {
            reference: 'QS-2024-001',
            event: 'Industrial Fire - Mumbai',
            date: 'Mar 15, 2024',
            claimAmount: '₹ 18.5',
            recoveredAmount: '₹ 14.2',
            status: 'Partially Recovered',
            statusColor: '#f59e0b'
        },
        {
            reference: 'XL-2024-005',
            event: 'Cyclone Damage - Chennai',
            date: 'Feb 28, 2024',
            claimAmount: '₹ 32.7',
            recoveredAmount: '₹ 32.7',
            status: 'Fully Recovered',
            statusColor: '#059669'
        },
        {
            reference: 'SP-2024-012',
            event: 'Marine Cargo Loss',
            date: 'Jan 22, 2024',
            claimAmount: '₹ 9.8',
            recoveredAmount: '₹ 9.8',
            status: 'Fully Recovered',
            statusColor: '#059669'
        },
        {
            reference: 'QS-2023-045',
            event: 'Flood Damage - Kerala',
            date: 'Dec 05, 2023',
            claimAmount: '₹ 25.3',
            recoveredAmount: '₹ 20.1',
            status: 'Pending Recovery',
            statusColor: '#f59e0b'
        },
        {
            reference: 'XL-2023-028',
            event: 'Aviation Incident',
            date: 'Nov 18, 2023',
            claimAmount: '₹ 42.6',
            recoveredAmount: '₹ 38.5',
            status: 'Partially Recovered',
            statusColor: '#f59e0b'
        }
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
                        <TrendingUp sx={{ fontSize: 28 }} />
                        Treaty Performance Dashboard
                    </Typography>
                    <Typography variant="body1" sx={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '14px'
                    }}>
                        Monitor treaty performance, utilization, and recovery analytics
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                    <FormControl size="small" sx={{
                        minWidth: 140,
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
                        <InputLabel>Treaty Type</InputLabel>
                        <Select
                            value={treatyType}
                            onChange={(e) => setTreatyType(e.target.value)}
                            label="Treaty Type"
                            sx={{
                                color: 'white',
                                fontSize: '14px',
                                '& .MuiSvgIcon-root': { color: 'rgba(255, 255, 255, 0.8)' }
                            }}
                        >
                            <MenuItem value="all">All Treaty Types</MenuItem>
                            <MenuItem value="quota-share">Quota Share</MenuItem>
                            <MenuItem value="surplus">Surplus</MenuItem>
                            <MenuItem value="excess-loss">Excess of Loss</MenuItem>
                            <MenuItem value="stop-loss">Stop Loss</MenuItem>
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
                        <InputLabel>Line of Business</InputLabel>
                        <Select
                            value={lob}
                            onChange={(e) => setLob(e.target.value)}
                            label="Line of Business"
                            sx={{
                                color: 'white',
                                fontSize: '14px',
                                '& .MuiSvgIcon-root': { color: 'rgba(255, 255, 255, 0.8)' }
                            }}
                        >
                            <MenuItem value="all">All LOBs</MenuItem>
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
                                '& .MuiSvgIcon-root': { color: 'rgba(255, 255, 255, 0.8)' }
                            }}
                        >
                            <MenuItem value="q1-2024">Q1 2024</MenuItem>
                            <MenuItem value="q4-2023">Q4 2023</MenuItem>
                            <MenuItem value="q3-2023">Q3 2023</MenuItem>
                            <MenuItem value="q2-2023">Q2 2023</MenuItem>
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

            <Box sx={{ p: 3 }}>
                {/* Treaty Cards */}
                <Grid container spacing={{ xs: 2, md: 4 }} sx={{ mb: 5 }}>
                    {treatyCards.map((treaty, index) => (
                        <Grid item xs={12} md={4} key={index}>
                            <Card sx={{
                                height: '100%',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
                                border: '1px solid rgba(226, 232, 240, 0.6)',
                                borderRadius: '20px',
                                borderLeft: `6px solid #e91e63`,
                                background: 'linear-gradient(135deg, #ffffff 0%, #fefefe 50%, #fdfdfd 100%)',
                                position: 'relative',
                                overflow: 'hidden',
                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                '&:hover': {
                                    transform: 'translateY(-8px) scale(1.02)',
                                    boxShadow: '0 20px 60px rgba(233, 30, 99, 0.2), 0 8px 24px rgba(0, 0, 0, 0.15)',
                                    borderLeft: `6px solid #ad1457`
                                },
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '4px',
                                    background: 'linear-gradient(90deg, #e91e63 0%, #ad1457 50%, #880e4f 100%)',
                                    opacity: 0.8
                                }
                            }}>
                                <CardContent sx={{ p: { xs: 3, md: 4 }, position: 'relative', zIndex: 1 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                        <Typography variant="h6" sx={{
                                            fontWeight: 700,
                                            color: '#e91e63',
                                            fontSize: { xs: '16px', md: '18px' },
                                            textShadow: '0 1px 2px rgba(233, 30, 99, 0.1)'
                                        }}>
                                            {treaty.type}
                                        </Typography>
                                        <Chip
                                            label={treaty.status}
                                            size="small"
                                            sx={{
                                                backgroundColor: `${treaty.statusColor}20`,
                                                color: treaty.statusColor,
                                                fontWeight: 700,
                                                fontSize: '12px',
                                                borderRadius: '12px',
                                                px: 1.5,
                                                border: `1px solid ${treaty.statusColor}40`,
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px'
                                            }}
                                        />
                                    </Box>

                                    <Grid container spacing={3} sx={{ mb: 3 }}>
                                        <Grid item xs={6}>
                                            <Box sx={{
                                                p: 2,
                                                backgroundColor: 'rgba(233, 30, 99, 0.05)',
                                                borderRadius: '12px',
                                                border: '1px solid rgba(233, 30, 99, 0.1)'
                                            }}>
                                                <Typography variant="caption" sx={{
                                                    color: '#64748b',
                                                    fontSize: '12px',
                                                    fontWeight: 600,
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.5px'
                                                }}>
                                                    Treaty Capacity
                                                </Typography>
                                                <Typography variant="h5" sx={{
                                                    fontWeight: 800,
                                                    color: '#1e293b',
                                                    fontSize: { xs: '18px', md: '20px' },
                                                    mt: 0.5
                                                }}>
                                                    {treaty.capacity}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Box sx={{
                                                p: 2,
                                                backgroundColor: 'rgba(5, 150, 105, 0.05)',
                                                borderRadius: '12px',
                                                border: '1px solid rgba(5, 150, 105, 0.1)'
                                            }}>
                                                <Typography variant="caption" sx={{
                                                    color: '#64748b',
                                                    fontSize: '12px',
                                                    fontWeight: 600,
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.5px'
                                                }}>
                                                    Utilized
                                                </Typography>
                                                <Typography variant="h6" sx={{
                                                    fontWeight: 700,
                                                    color: '#059669',
                                                    fontSize: { xs: '14px', md: '16px' },
                                                    mt: 0.5
                                                }}>
                                                    {treaty.utilized}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Box sx={{
                                                p: 2,
                                                backgroundColor: 'rgba(245, 158, 11, 0.05)',
                                                borderRadius: '12px',
                                                border: '1px solid rgba(245, 158, 11, 0.1)'
                                            }}>
                                                <Typography variant="caption" sx={{
                                                    color: '#64748b',
                                                    fontSize: '12px',
                                                    fontWeight: 600,
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.5px'
                                                }}>
                                                    Balance
                                                </Typography>
                                                <Typography variant="h6" sx={{
                                                    fontWeight: 700,
                                                    color: '#f59e0b',
                                                    fontSize: { xs: '14px', md: '16px' },
                                                    mt: 0.5
                                                }}>
                                                    {treaty.balance}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Box sx={{
                                                p: 2,
                                                backgroundColor: 'rgba(99, 102, 241, 0.05)',
                                                borderRadius: '12px',
                                                border: '1px solid rgba(99, 102, 241, 0.1)'
                                            }}>
                                                <Typography variant="caption" sx={{
                                                    color: '#64748b',
                                                    fontSize: '12px',
                                                    fontWeight: 600,
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.5px'
                                                }}>
                                                    Combined Ratio
                                                </Typography>
                                                <Typography variant="h5" sx={{
                                                    fontWeight: 800,
                                                    color: '#6366f1',
                                                    fontSize: { xs: '18px', md: '20px' },
                                                    mt: 0.5
                                                }}>
                                                    {treaty.combinedRatio}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>

                                    <Box sx={{
                                        p: 3,
                                        backgroundColor: 'rgba(248, 250, 252, 0.8)',
                                        borderRadius: '16px',
                                        border: '1px solid rgba(226, 232, 240, 0.5)'
                                    }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                            <Typography variant="caption" sx={{
                                                color: '#64748b',
                                                fontSize: '13px',
                                                fontWeight: 600,
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px'
                                            }}>
                                                Utilization Progress
                                            </Typography>
                                            <Typography variant="h6" sx={{
                                                fontWeight: 800,
                                                color: '#e91e63',
                                                fontSize: '16px'
                                            }}>
                                                {treaty.utilization}%
                                            </Typography>
                                        </Box>
                                        <LinearProgress
                                            variant="determinate"
                                            value={treaty.utilization}
                                            sx={{
                                                height: 12,
                                                borderRadius: 8,
                                                backgroundColor: '#f1f5f9',
                                                boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
                                                '& .MuiLinearProgress-bar': {
                                                    background: 'linear-gradient(90deg, #e91e63 0%, #ad1457 50%, #880e4f 100%)',
                                                    borderRadius: 8,
                                                    boxShadow: '0 2px 8px rgba(233, 30, 99, 0.3)'
                                                }
                                            }}
                                        />
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Navigation Buttons */}
                <Grid container spacing={2} sx={{ mb: 4 }}>
                    <Grid item xs={6} sm={4} md={3} lg={2}>
                        <Button
                            variant="outlined"
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
                            Treaty Analysis
                        </Button>
                    </Grid>
                    <Grid item xs={6} sm={4} md={3} lg={2}>
                        <Button
                            variant="outlined"
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
                            Capacity Monitor
                        </Button>
                    </Grid>
                    <Grid item xs={6} sm={4} md={3} lg={2}>
                        <Button
                            variant="outlined"
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
                            Recovery Tracker
                        </Button>
                    </Grid>
                    <Grid item xs={6} sm={4} md={3} lg={2}>
                        <Button
                            variant="outlined"
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
                            Performance Report
                        </Button>
                    </Grid>
                    <Grid item xs={6} sm={4} md={3} lg={2}>
                        <Button
                            variant="outlined"
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
                            Risk Assessment
                        </Button>
                    </Grid>
                    <Grid item xs={6} sm={4} md={3} lg={2}>
                        <Button
                            variant="outlined"
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
                            Export Data
                        </Button>
                    </Grid>
                </Grid>
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    {/* Treaty-wise Ceded Premium */}
                    <Grid item xs={12} md={6}>
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
                                        fontSize: '16px'
                                    }}>
                                        Treaty-wise Ceded Premium
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Button size="small" variant="outlined" sx={{ fontSize: '11px', textTransform: 'none' }}>
                                            Quarterly
                                        </Button>
                                        <Button size="small" variant="contained" sx={{
                                            backgroundColor: '#e91e63',
                                            fontSize: '11px',
                                            textTransform: 'none',
                                            boxShadow: 'none'
                                        }}>
                                            Yearly
                                        </Button>
                                    </Box>
                                </Box>
                                <Box sx={{ height: 300 }}>
                                    {isClient && (
                                        <Bar
                                            data={premiumChartData}
                                            options={barChartOptions}
                                        />
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Treaty-wise Loss Ratio */}
                    <Grid item xs={12} md={6}>
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
                                        fontSize: '16px'
                                    }}>
                                        Treaty-wise Loss Ratio
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Button size="small" variant="outlined" sx={{ fontSize: '11px', textTransform: 'none' }}>
                                            Quarterly
                                        </Button>
                                        <Button size="small" variant="contained" sx={{
                                            backgroundColor: '#e91e63',
                                            fontSize: '11px',
                                            textTransform: 'none',
                                            boxShadow: 'none'
                                        }}>
                                            Yearly
                                        </Button>
                                    </Box>
                                </Box>
                                <Box sx={{ height: 300 }}>
                                    {isClient && (
                                        <Bar
                                            data={lossRatioChartData}
                                            options={barChartOptions}
                                        />
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Commission Earned vs Payable */}
                    <Grid item xs={12} md={6}>
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
                                        fontSize: '16px'
                                    }}>
                                        Commission Earned vs Payable
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Button size="small" variant="outlined" sx={{ fontSize: '11px', textTransform: 'none' }}>
                                            Quarterly
                                        </Button>
                                        <Button size="small" variant="contained" sx={{
                                            backgroundColor: '#e91e63',
                                            fontSize: '11px',
                                            textTransform: 'none',
                                            boxShadow: 'none'
                                        }}>
                                            Yearly
                                        </Button>
                                    </Box>
                                </Box>
                                <Box sx={{ height: 300 }}>
                                    {isClient && (
                                        <Bar
                                            data={commissionChartData}
                                            options={{
                                                ...barChartOptions,
                                                plugins: {
                                                    ...barChartOptions.plugins,
                                                    legend: {
                                                        display: true,
                                                        position: 'top' as const,
                                                        labels: {
                                                            usePointStyle: true,
                                                            font: {
                                                                size: 12
                                                            }
                                                        }
                                                    }
                                                }
                                            }}
                                        />
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Combined Ratio Trend */}
                    <Grid item xs={12} md={6}>
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
                                        fontSize: '16px'
                                    }}>
                                        Combined Ratio Trend
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Button size="small" variant="outlined" sx={{ fontSize: '11px', textTransform: 'none' }}>
                                            Quarterly
                                        </Button>
                                        <Button size="small" variant="contained" sx={{
                                            backgroundColor: '#e91e63',
                                            fontSize: '11px',
                                            textTransform: 'none',
                                            boxShadow: 'none'
                                        }}>
                                            Yearly
                                        </Button>
                                    </Box>
                                </Box>
                                <Box sx={{ height: 300 }}>
                                    {isClient && (
                                        <Line
                                            data={combinedRatioChartData}
                                            options={lineChartOptions}
                                        />
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Large Loss Recoveries Table */}
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
                                fontSize: '16px'
                            }}>
                                Large Loss Recoveries
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    startIcon={<Download />}
                                    sx={{ fontSize: '11px', textTransform: 'none' }}
                                >
                                    Export
                                </Button>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    startIcon={<FilterList />}
                                    sx={{ fontSize: '11px', textTransform: 'none' }}
                                >
                                    Filter
                                </Button>
                            </Box>
                        </Box>

                        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '12px', color: '#475569' }}>Treaty Reference</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '12px', color: '#475569' }}>Loss Event</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '12px', color: '#475569' }}>Date of Loss</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '12px', color: '#475569' }}>Claim Amount</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '12px', color: '#475569' }}>Recovered Amount</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '12px', color: '#475569' }}>Recovery Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {lossRecoveries.map((recovery, index) => (
                                        <TableRow key={index} sx={{ '&:hover': { backgroundColor: '#f8fafc' } }}>
                                            <TableCell sx={{ fontSize: '13px', fontWeight: 600 }}>{recovery.reference}</TableCell>
                                            <TableCell sx={{ fontSize: '13px' }}>{recovery.event}</TableCell>
                                            <TableCell sx={{ fontSize: '13px' }}>{recovery.date}</TableCell>
                                            <TableCell sx={{ fontSize: '13px', fontWeight: 600, color: '#dc2626' }}>
                                                {recovery.claimAmount}
                                            </TableCell>
                                            <TableCell sx={{ fontSize: '13px', fontWeight: 600, color: '#059669' }}>
                                                {recovery.recoveredAmount}
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={recovery.status}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: `${recovery.statusColor}15`,
                                                        color: recovery.statusColor,
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

                {/* Footer */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    color: '#64748b',
                    fontSize: '12px',
                    pt: 4,
                    borderTop: '1px solid #e2e8f0',
                    mt: 4
                }}>
                    <Typography variant="caption" sx={{ fontSize: '12px' }}>
                        © 2024 Reinsurance Analytics Dashboard | Data refreshed every 24 hours
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            size="small"
                            variant="text"
                            sx={{
                                fontSize: '11px',
                                textTransform: 'none',
                                color: '#64748b'
                            }}
                        >
                            Help
                        </Button>
                        <Button
                            size="small"
                            variant="text"
                            sx={{
                                fontSize: '11px',
                                textTransform: 'none',
                                color: '#64748b'
                            }}
                        >
                            Settings
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default TreatyPerformanceDashboard;
