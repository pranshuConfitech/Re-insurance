'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
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
    Button
} from '@mui/material';
import {
    Assessment,
    TrendingUp,
    TrendingDown,
    PieChart,
    BarChart,
    TableChart,
    Refresh,
    Download
} from '@mui/icons-material';

// Register Chart.js components
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

// Dynamic imports for Chart.js components to avoid SSR issues
const Pie = dynamic(() => import('react-chartjs-2').then((mod) => mod.Pie), {
    ssr: false,
});

const Bar = dynamic(() => import('react-chartjs-2').then((mod) => mod.Bar), {
    ssr: false,
});

const InsuranceMarketingDashboard = () => {
    const [year, setYear] = useState('all');
    const [month, setMonth] = useState('all');
    const [company, setCompany] = useState('all');
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    // Product Mix Data for Pie Chart
    const productMixData = {
        labels: ['Employer Liability', 'Engineering', 'Fire', 'Health', 'Marine Cargo', 'Motor', 'Personal Accident', 'Rural'],
        datasets: [{
            data: [14.1, 16.4, 21.0, 17.3, 11.3, 14.6, 8.3, 6.3],
            backgroundColor: [
                '#e91e63',
                '#4caf50',
                '#f44336',
                '#ff9800',
                '#9c27b0',
                '#00bcd4',
                '#607d8b',
                '#795548'
            ],
            borderWidth: 2,
            borderColor: '#fff'
        }]
    };

    // Key Ratios Comparison Data for Bar Chart
    const ratiosData = {
        labels: ['Net Incurred Claim Ratio', 'Net Commission Ratio', 'Management Expense Ratio', 'Combined Ratio', 'Net Retention Ratio'],
        datasets: [
            {
                label: 'Current Period',
                data: [45.2, 12.8, 8.5, 66.5, 73.5],
                backgroundColor: '#e91e63',
                borderColor: '#ad1457',
                borderWidth: 1
            },
            {
                label: 'Previous Period',
                data: [47.5, 13.2, 9.1, 69.8, 70.2],
                backgroundColor: '#f8bbd9',
                borderColor: '#e91e63',
                borderWidth: 1
            }
        ]
    };

    const pieChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right' as const,
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
                callbacks: {
                    label: function (context: any) {
                        return `${context.label}: ${context.parsed}%`;
                    }
                }
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
                    text: 'Percentage (%)',
                    color: '#64748b'
                },
                ticks: {
                    callback: function (value: any) {
                        return value + '%';
                    },
                    color: '#64748b'
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
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
                position: 'top' as const,
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
                        return `${context.dataset.label}: ${context.parsed.y}%`;
                    }
                }
            }
        }
    };

    // Department data for table
    const departmentData = [
        {
            name: 'Employer Liability',
            gwpDirect: '$520,000',
            gwpInward: '$85,000',
            totalGwp: '$605,000',
            netWritten: '$480,000',
            netEarned: '$460,000',
            underwritingProfit: '$65,000'
        },
        {
            name: 'Engineering',
            gwpDirect: '$610,000',
            gwpInward: '$95,000',
            totalGwp: '$705,000',
            netWritten: '$550,000',
            netEarned: '$530,000',
            underwritingProfit: '$78,000'
        },
        {
            name: 'Fire',
            gwpDirect: '$780,000',
            gwpInward: '$120,000',
            totalGwp: '$900,000',
            netWritten: '$720,000',
            netEarned: '$690,000',
            underwritingProfit: '$92,000'
        },
        {
            name: 'Health',
            gwpDirect: '$650,000',
            gwpInward: '$90,000',
            totalGwp: '$740,000',
            netWritten: '$590,000',
            netEarned: '$570,000',
            underwritingProfit: '$85,000'
        },
        {
            name: 'Marine Cargo',
            gwpDirect: '$420,000',
            gwpInward: '$65,000',
            totalGwp: '$485,000',
            netWritten: '$380,000',
            netEarned: '$365,000',
            underwritingProfit: '$52,000'
        },
        {
            name: 'Motor',
            gwpDirect: '$550,000',
            gwpInward: '$75,000',
            totalGwp: '$625,000',
            netWritten: '$500,000',
            netEarned: '$480,000',
            underwritingProfit: '$68,000'
        },
        {
            name: 'Personal Accident',
            gwpDirect: '$310,000',
            gwpInward: '$45,000',
            totalGwp: '$355,000',
            netWritten: '$280,000',
            netEarned: '$270,000',
            underwritingProfit: '$38,000'
        },
        {
            name: 'Rural',
            gwpDirect: '$240,000',
            gwpInward: '$32,000',
            totalGwp: '$272,000',
            netWritten: '$210,000',
            netEarned: '$200,000',
            underwritingProfit: '$25,000'
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
        <Box sx={{
            backgroundColor: '#f8fafc',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 25%, #f8fafc 50%, #f1f5f9 75%, #e2e8f0 100%)',
            p: 3
        }}>
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
                        mb: 1.5
                    }}>
                        Insurance Marketing Dashboard
                    </Typography>
                    <Typography variant="body1" sx={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '14px'
                    }}>
                        Marketing Report | 11-JUN-09 07:50 AM | Data Source: MIS Marketing.xls - Final Sheet
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <FormControl
                        size="small"
                        sx={{
                            minWidth: 100,
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                borderRadius: '8px',
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                    transform: 'translateY(-1px)',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
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
                        }}
                    >
                        <InputLabel>Year</InputLabel>
                        <Select
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            label="Year"
                            sx={{
                                color: 'white',
                                fontSize: '14px',
                                '& .MuiSvgIcon-root': {
                                    color: 'rgba(255, 255, 255, 0.8)'
                                }
                            }}
                        >
                            <MenuItem value="all">All</MenuItem>
                            <MenuItem value="2009">2009</MenuItem>
                            <MenuItem value="2008">2008</MenuItem>
                            <MenuItem value="2007">2007</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl
                        size="small"
                        sx={{
                            minWidth: 100,
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                borderRadius: '8px',
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                    transform: 'translateY(-1px)',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
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
                        }}
                    >
                        <InputLabel>Month</InputLabel>
                        <Select
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                            label="Month"
                            sx={{
                                color: 'white',
                                fontSize: '14px',
                                '& .MuiSvgIcon-root': {
                                    color: 'rgba(255, 255, 255, 0.8)'
                                }
                            }}
                        >
                            <MenuItem value="all">All</MenuItem>
                            <MenuItem value="jan">January</MenuItem>
                            <MenuItem value="feb">February</MenuItem>
                            <MenuItem value="mar">March</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl
                        size="small"
                        sx={{
                            minWidth: 120,
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                borderRadius: '8px',
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                    transform: 'translateY(-1px)',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
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
                        }}
                    >
                        <InputLabel>Company</InputLabel>
                        <Select
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            label="Company"
                            sx={{
                                color: 'white',
                                fontSize: '14px',
                                '& .MuiSvgIcon-root': {
                                    color: 'rgba(255, 255, 255, 0.8)'
                                }
                            }}
                        >
                            <MenuItem value="all">All</MenuItem>
                            <MenuItem value="company1">Company A</MenuItem>
                            <MenuItem value="company2">Company B</MenuItem>
                        </Select>
                    </FormControl>
                    <Button
                        variant="outlined"
                        startIcon={<Download />}
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
                        Export Report
                    </Button>
                </Box>
            </Box>

            <Box sx={{ px: 0 }}>
                {/* KPI Cards */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    {[
                        {
                            title: 'Total GWP',
                            value: '$4,287,500',
                            change: '+12.5% vs last period',
                            trendUp: true,
                            color: '#e91e63'
                        },
                        {
                            title: 'Net Written Premium',
                            value: '$3,150,200',
                            change: '+8.3% vs last period',
                            trendUp: true,
                            color: '#4caf50'
                        },
                        {
                            title: 'Net Incurred Claims',
                            value: '$1,890,400',
                            change: '+5.2% vs last period',
                            trendUp: false,
                            color: '#f44336'
                        },
                        {
                            title: 'Underwriting Profit',
                            value: '$420,800',
                            change: '+15.7% vs last period',
                            trendUp: true,
                            color: '#ff9800'
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
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        {kpi.trendUp ? (
                                            <TrendingUp sx={{ fontSize: 16, color: '#059669' }} />
                                        ) : (
                                            <TrendingUp sx={{ fontSize: 16, color: '#dc2626' }} />
                                        )}
                                        <Typography variant="caption" sx={{
                                            fontSize: '11px',
                                            color: kpi.trendUp ? '#059669' : '#dc2626',
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
                <Grid container spacing={3} sx={{ mb: 3 }}>
                    {/* Product Mix Chart */}
                    <Grid item xs={12} md={6}>
                        <Card sx={{
                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px'
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
                                    <PieChart />
                                    Product Mix (% of GWP)
                                </Typography>
                                <Box sx={{ height: 300 }}>
                                    {isClient && (
                                        <Pie
                                            data={productMixData}
                                            options={pieChartOptions}
                                        />
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Key Ratios Chart */}
                    <Grid item xs={12} md={6}>
                        <Card sx={{
                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px'
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
                                    Key Ratios Comparison
                                </Typography>
                                <Box sx={{ height: 300 }}>
                                    {isClient && (
                                        <Bar
                                            data={ratiosData}
                                            options={barChartOptions}
                                        />
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Insurance Metrics Table */}
                <Card sx={{
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    mb: 3
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
                            <TableChart />
                            Insurance Metrics by Department
                        </Typography>

                        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '12px', color: '#475569' }}>Department Name</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '12px', color: '#475569' }}>GWP - Direct</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '12px', color: '#475569' }}>GWP - Inward Reinsurance</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '12px', color: '#475569' }}>Total GWP</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '12px', color: '#475569' }}>Net Written Premium</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '12px', color: '#475569' }}>Net Earned Premium</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '12px', color: '#475569' }}>Underwriting Profit/(Loss)</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {departmentData.map((dept, index) => (
                                        <TableRow key={index} sx={{ '&:hover': { backgroundColor: '#f8fafc' } }}>
                                            <TableCell sx={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>
                                                {dept.name}
                                            </TableCell>
                                            <TableCell sx={{ fontSize: '13px' }}>{dept.gwpDirect}</TableCell>
                                            <TableCell sx={{ fontSize: '13px' }}>{dept.gwpInward}</TableCell>
                                            <TableCell sx={{ fontSize: '13px', fontWeight: 600 }}>{dept.totalGwp}</TableCell>
                                            <TableCell sx={{ fontSize: '13px' }}>{dept.netWritten}</TableCell>
                                            <TableCell sx={{ fontSize: '13px' }}>{dept.netEarned}</TableCell>
                                            <TableCell sx={{ fontSize: '13px', fontWeight: 600, color: '#059669' }}>
                                                {dept.underwritingProfit}
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
                        Insurance Marketing Dashboard • Data as of 11-JUN-09 07:50 AM • Generated from MIS Marketing.xls
                    </Typography>
                    <Typography variant="caption" sx={{ fontSize: '11px' }}>
                        © 2009 Insurance Analytics. All metrics are calculated based on the provided data structure.
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default InsuranceMarketingDashboard;
