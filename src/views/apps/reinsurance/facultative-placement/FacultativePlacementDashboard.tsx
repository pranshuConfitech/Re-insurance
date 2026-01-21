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
    IconButton
} from '@mui/material';
import {
    Assessment,
    Download,
    FilterList,
    Refresh,
    ChevronLeft,
    ChevronRight,
    TrendingUp,
    TrendingDown
} from '@mui/icons-material';

// Dynamic imports for Chart.js components to avoid SSR issues
const Bar = dynamic(() => import('react-chartjs-2').then((mod) => mod.Bar), {
    ssr: false,
});

const Doughnut = dynamic(() => import('react-chartjs-2').then((mod) => mod.Doughnut), {
    ssr: false,
});

const FacultativePlacementDashboard = () => {
    const [period, setPeriod] = useState('current');
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
            title: 'Requests Raised',
            value: '142',
            trend: '+12% from last period',
            trendUp: true,
            color: '#3498db'
        },
        {
            title: 'Accepted',
            value: '98',
            trend: '+8% from last period',
            trendUp: true,
            color: '#2ecc71'
        },
        {
            title: 'Declined',
            value: '27',
            trend: '-3% from last period',
            trendUp: false,
            color: '#e74c3c'
        },
        {
            title: 'Avg Placement Time (Days)',
            value: '4.2',
            trend: '0.8 days faster',
            trendUp: true,
            color: '#f39c12'
        }
    ];

    // Placement status data for stacked bar chart
    const placementStatusData = {
        labels: ['Property', 'Marine', 'Aviation', 'Energy', 'Liability', 'Engineering', 'Cyber', 'Agriculture', 'Healthcare', 'Motor'],
        datasets: [
            {
                label: 'Pending',
                data: [5, 8, 3, 2, 4, 7, 6, 1, 3, 4],
                backgroundColor: '#3498db',
                borderWidth: 1
            },
            {
                label: 'Accepted',
                data: [12, 6, 8, 10, 9, 5, 11, 7, 10, 8],
                backgroundColor: '#2ecc71',
                borderWidth: 1
            },
            {
                label: 'Declined',
                data: [2, 3, 5, 1, 2, 4, 1, 6, 1, 2],
                backgroundColor: '#e74c3c',
                borderWidth: 1
            },
            {
                label: 'In Negotiation',
                data: [3, 4, 2, 5, 3, 2, 4, 2, 3, 2],
                backgroundColor: '#f39c12',
                borderWidth: 1
            }
        ]
    };

    // Placement percentage data for doughnut chart
    const placementPercentData = {
        labels: ['Placed', 'Pending', 'Declined'],
        datasets: [{
            data: [69, 21, 10],
            backgroundColor: ['#2ecc71', '#3498db', '#e74c3c'],
            borderWidth: 2,
            borderColor: '#ffffff',
            hoverBorderWidth: 3
        }]
    };

    // Premium & Commission data for dual axis chart
    const premiumCommissionData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Facultative Premium ($M)',
                data: [12.5, 14.2, 16.8, 13.5, 15.1, 17.3, 18.5, 16.2, 19.1, 17.8, 15.6, 20.2],
                backgroundColor: 'rgba(52, 152, 219, 0.7)',
                borderColor: '#3498db',
                borderWidth: 1,
                yAxisID: 'y'
            },
            {
                label: 'Commission (%)',
                data: [22.5, 23.1, 21.8, 22.3, 23.5, 24.1, 23.8, 22.9, 24.5, 23.2, 22.7, 24.8],
                backgroundColor: 'rgba(46, 204, 113, 0.7)',
                borderColor: '#2ecc71',
                borderWidth: 1,
                yAxisID: 'y1'
            }
        ]
    };

    // Sample cases data
    const sampleCases = [
        { risk: "Commercial Property - Warehouse", sumInsured: "$45M", cedantShare: "30%", riShare: "70%", reinsurer: "Swiss Re", status: "Accepted", tat: 3, lob: "Property", underwriter: "John Smith" },
        { risk: "Marine Cargo - Container Ship", sumInsured: "$120M", cedantShare: "25%", riShare: "75%", reinsurer: "Munich Re", status: "Pending", tat: 5, lob: "Marine", underwriter: "Maria Garcia" },
        { risk: "Aviation - Fleet Policy", sumInsured: "$300M", cedantShare: "40%", riShare: "60%", reinsurer: "Hannover Re", status: "Declined", tat: 7, lob: "Aviation", underwriter: "Robert Chen" },
        { risk: "Energy - Offshore Platform", sumInsured: "$85M", cedantShare: "35%", riShare: "65%", reinsurer: "SCOR", status: "Placed", tat: 4, lob: "Energy", underwriter: "Sarah Johnson" },
        { risk: "Liability - Product Recall", sumInsured: "$60M", cedantShare: "50%", riShare: "50%", reinsurer: "AXA XL", status: "Accepted", tat: 2, lob: "Liability", underwriter: "David Wilson" },
        { risk: "Construction - Bridge Project", sumInsured: "$150M", cedantShare: "20%", riShare: "80%", reinsurer: "Everest Re", status: "Pending", tat: 6, lob: "Engineering", underwriter: "Lisa Brown" },
        { risk: "Cyber - Data Breach", sumInsured: "$25M", cedantShare: "45%", riShare: "55%", reinsurer: "Beazley", status: "Accepted", tat: 3, lob: "Cyber", underwriter: "James Taylor" },
        { risk: "Agriculture - Crop Insurance", sumInsured: "$35M", cedantShare: "60%", riShare: "40%", reinsurer: "PartnerRe", status: "Declined", tat: 8, lob: "Agriculture", underwriter: "Emma Davis" },
        { risk: "Healthcare - Hospital Malpractice", sumInsured: "$75M", cedantShare: "30%", riShare: "70%", reinsurer: "RenaissanceRe", status: "Placed", tat: 4, lob: "Healthcare", underwriter: "Michael Lee" },
        { risk: "Automotive - Fleet Insurance", sumInsured: "$50M", cedantShare: "40%", riShare: "60%", reinsurer: "Axis Capital", status: "Accepted", tat: 3, lob: "Motor", underwriter: "Olivia Martinez" }
    ];

    // Chart options
    const stackedBarOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                stacked: true,
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
                stacked: true,
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Number of Cases',
                    color: '#64748b'
                },
                grid: {
                    color: '#f1f5f9'
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
                mode: 'index' as const,
                intersect: false,
                backgroundColor: 'white',
                titleColor: '#1e293b',
                bodyColor: '#64748b',
                borderColor: '#e2e8f0',
                borderWidth: 1,
                cornerRadius: 8
            }
        }
    };

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
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
                        return `${context.label}: ${context.raw}%`;
                    }
                }
            }
        }
    };

    const dualAxisOptions = {
        responsive: true,
        maintainAspectRatio: false,
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
                mode: 'index' as const,
                intersect: false,
                backgroundColor: 'white',
                titleColor: '#1e293b',
                bodyColor: '#64748b',
                borderColor: '#e2e8f0',
                borderWidth: 1,
                cornerRadius: 8
            }
        },
        scales: {
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    color: '#64748b'
                }
            },
            y: {
                type: 'linear' as const,
                display: true,
                position: 'left' as const,
                title: {
                    display: true,
                    text: 'Premium ($M)',
                    color: '#64748b'
                },
                beginAtZero: true,
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
                    text: 'Commission (%)',
                    color: '#64748b'
                },
                beginAtZero: true,
                grid: {
                    drawOnChartArea: false,
                },
                ticks: {
                    color: '#64748b'
                }
            }
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Accepted': return '#2ecc71';
            case 'Declined': return '#e74c3c';
            case 'Pending': return '#f39c12';
            case 'Placed': return '#3498db';
            default: return '#64748b';
        }
    };

    const getTATColor = (tat: number) => {
        if (tat <= 3) return '#2ecc71';
        if (tat <= 5) return '#f39c12';
        return '#e74c3c';
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
                        Facultative Placement Dashboard
                    </Typography>
                    <Typography variant="body1" sx={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '14px'
                    }}>
                        Monitor facultative placement status, performance metrics, and detailed case information
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                    <FormControl size="small" sx={{
                        minWidth: 200,
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
                            <MenuItem value="current">Current Period (Jan 2024)</MenuItem>
                            <MenuItem value="previous">Previous Period (Dec 2023)</MenuItem>
                            <MenuItem value="quarter">This Quarter (Q1 2024)</MenuItem>
                            <MenuItem value="year">Year to Date (2024)</MenuItem>
                        </Select>
                    </FormControl>

                    <Button
                        variant="outlined"
                        startIcon={<Refresh />}
                        sx={{
                            borderColor: 'rgba(255, 255, 255, 0.5)',
                            color: 'white',
                            fontSize: '13px',
                            textTransform: 'none',
                            fontWeight: 500,
                            px: 3,
                            py: 1,
                            borderRadius: '8px',
                            '&:hover': {
                                borderColor: 'white',
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                transform: 'translateY(-1px)',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                            },
                            transition: 'all 0.2s ease-in-out'
                        }}
                    >
                        Refresh Data
                    </Button>
                </Box>
            </Box>

            <Box sx={{ px: { xs: 0, sm: 2, md: 3 } }}>
                {/* KPI Cards */}
                <Grid container spacing={{ xs: 2, md: 4 }} sx={{ mb: 5 }}>
                    {kpiData.map((kpi, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Card sx={{
                                height: '100%',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
                                border: '1px solid rgba(226, 232, 240, 0.6)',
                                borderRadius: '20px',
                                borderTop: `4px solid ${kpi.color}`,
                                background: 'linear-gradient(135deg, #ffffff 0%, #fefefe 50%, #fdfdfd 100%)',
                                position: 'relative',
                                overflow: 'hidden',
                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                '&:hover': {
                                    transform: 'translateY(-8px) scale(1.02)',
                                    boxShadow: `0 20px 60px ${kpi.color}33, 0 8px 24px rgba(0, 0, 0, 0.15)`
                                }
                            }}>
                                <CardContent sx={{ p: { xs: 2, md: 3 }, position: 'relative', zIndex: 1 }}>
                                    <Typography variant="h3" sx={{
                                        fontWeight: 800,
                                        color: kpi.color,
                                        fontSize: { xs: '28px', md: '32px' },
                                        mb: 1
                                    }}>
                                        {kpi.value}
                                    </Typography>
                                    <Typography variant="caption" sx={{
                                        color: '#64748b',
                                        fontSize: '14px',
                                        fontWeight: 600,
                                        display: 'block',
                                        mb: 1
                                    }}>
                                        {kpi.title}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        {kpi.trendUp ? (
                                            <TrendingUp sx={{ fontSize: 16, color: '#059669' }} />
                                        ) : (
                                            <TrendingDown sx={{ fontSize: 16, color: '#dc2626' }} />
                                        )}
                                        <Typography variant="caption" sx={{
                                            fontSize: '12px',
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

                {/* Charts Section */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    {/* Facultative Placement Status */}
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
                                        Facultative Placement Status
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Button size="small" variant="outlined" startIcon={<FilterList />} sx={{ fontSize: '11px', textTransform: 'none' }}>
                                            Filter
                                        </Button>
                                        <Button size="small" variant="outlined" startIcon={<Download />} sx={{ fontSize: '11px', textTransform: 'none' }}>
                                            Export
                                        </Button>
                                    </Box>
                                </Box>
                                <Box sx={{ height: 300 }}>
                                    {isClient && (
                                        <Bar
                                            data={placementStatusData}
                                            options={stackedBarOptions}
                                        />
                                    )}
                                </Box>
                                {/* Legend */}
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    gap: 3,
                                    mt: 3,
                                    flexWrap: 'wrap'
                                }}>
                                    {[
                                        { label: 'Pending', color: '#3498db' },
                                        { label: 'Accepted', color: '#2ecc71' },
                                        { label: 'Declined', color: '#e74c3c' },
                                        { label: 'In Negotiation', color: '#f39c12' }
                                    ].map((item, index) => (
                                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Box sx={{
                                                width: 12,
                                                height: 12,
                                                backgroundColor: item.color,
                                                borderRadius: '2px'
                                            }} />
                                            <Typography variant="caption" sx={{ fontSize: '12px', fontWeight: 500 }}>
                                                {item.label}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Placement % by LOB */}
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
                                        Placement % by LOB
                                    </Typography>
                                    <Button size="small" variant="outlined" startIcon={<FilterList />} sx={{ fontSize: '11px', textTransform: 'none' }}>
                                        LOB
                                    </Button>
                                </Box>
                                <Box sx={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    {isClient && (
                                        <Doughnut
                                            data={placementPercentData}
                                            options={doughnutOptions}
                                        />
                                    )}
                                </Box>
                                <Typography sx={{
                                    textAlign: 'center',
                                    mt: 2,
                                    color: '#64748b',
                                    fontSize: '14px'
                                }}>
                                    Overall Placement Rate: <strong style={{ color: '#e91e63' }}>69%</strong>
                                </Typography>
                                {/* Legend */}
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    gap: 3,
                                    mt: 2,
                                    flexWrap: 'wrap'
                                }}>
                                    {[
                                        { label: 'Placed', color: '#2ecc71' },
                                        { label: 'Pending', color: '#3498db' },
                                        { label: 'Declined', color: '#e74c3c' }
                                    ].map((item, index) => (
                                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Box sx={{
                                                width: 12,
                                                height: 12,
                                                backgroundColor: item.color,
                                                borderRadius: '50%'
                                            }} />
                                            <Typography variant="caption" sx={{ fontSize: '12px', fontWeight: 500 }}>
                                                {item.label}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Facultative Premium & Commission */}
                    <Grid item xs={12}>
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
                                        Facultative Premium & Commission
                                    </Typography>
                                    <Button size="small" variant="outlined" sx={{ fontSize: '11px', textTransform: 'none' }}>
                                        View Details
                                    </Button>
                                </Box>
                                <Box sx={{ height: 400 }}>
                                    {isClient && (
                                        <Bar
                                            data={premiumCommissionData}
                                            options={dualAxisOptions}
                                        />
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Facultative Cases Table */}
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
                                Facultative Cases – Detailed Table
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button size="small" variant="outlined" startIcon={<FilterList />} sx={{ fontSize: '11px', textTransform: 'none' }}>
                                    Filter
                                </Button>
                                <Button size="small" variant="outlined" startIcon={<Download />} sx={{ fontSize: '11px', textTransform: 'none' }}>
                                    Export
                                </Button>
                            </Box>
                        </Box>

                        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '12px', color: '#475569' }}>Risk</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '12px', color: '#475569' }}>Sum Insured</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '12px', color: '#475569' }}>Cedant Share</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '12px', color: '#475569' }}>RI Share</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '12px', color: '#475569' }}>Reinsurer</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '12px', color: '#475569' }}>Status</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '12px', color: '#475569' }}>TAT (Days)</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '12px', color: '#475569' }}>LOB</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '12px', color: '#475569' }}>Underwriter</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {sampleCases.map((caseItem, index) => (
                                        <TableRow key={index} sx={{ '&:hover': { backgroundColor: '#f8fafc' } }}>
                                            <TableCell sx={{ fontSize: '13px' }}>{caseItem.risk}</TableCell>
                                            <TableCell sx={{ fontSize: '13px', fontWeight: 600 }}>{caseItem.sumInsured}</TableCell>
                                            <TableCell sx={{ fontSize: '13px' }}>{caseItem.cedantShare}</TableCell>
                                            <TableCell sx={{ fontSize: '13px', fontWeight: 600 }}>{caseItem.riShare}</TableCell>
                                            <TableCell sx={{ fontSize: '13px' }}>{caseItem.reinsurer}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={caseItem.status}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: `${getStatusColor(caseItem.status)}15`,
                                                        color: getStatusColor(caseItem.status),
                                                        fontWeight: 600,
                                                        fontSize: '11px'
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell sx={{
                                                fontSize: '13px',
                                                fontWeight: 600,
                                                color: getTATColor(caseItem.tat)
                                            }}>
                                                {caseItem.tat}
                                            </TableCell>
                                            <TableCell sx={{ fontSize: '13px' }}>{caseItem.lob}</TableCell>
                                            <TableCell sx={{ fontSize: '13px' }}>{caseItem.underwriter}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {/* Pagination */}
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mt: 3,
                            fontSize: '14px',
                            color: '#64748b'
                        }}>
                            <Typography variant="body2">
                                Showing <strong>10</strong> of <strong>142</strong> facultative cases
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <IconButton size="small" sx={{ border: '1px solid #e2e8f0' }}>
                                    <ChevronLeft />
                                </IconButton>
                                <IconButton size="small" sx={{ border: '1px solid #e2e8f0' }}>
                                    <ChevronRight />
                                </IconButton>
                            </Box>
                        </Box>
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
                        © 2024 Facultative Placement Dashboard | Data refreshed every 24 hours
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

export default FacultativePlacementDashboard;
