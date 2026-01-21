'use client';

import { useState } from 'react';
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
    Alert
} from '@mui/material';
import {
    TrendingUp,
    SwapHoriz,
    Percent,
    BalanceOutlined,
    Download,
    Add,
    Info,
    CheckCircle,
    Warning,
    Schedule,
    Visibility
} from '@mui/icons-material';

const ReinsuranceDashboard = () => {
    const [period, setPeriod] = useState('Q1 2024');
    const [lob, setLob] = useState('All LOBs');

    // Metric cards data
    const metrics = [
        {
            title: 'Gross Written Premium',
            value: '₹ 1,245 Cr',
            change: '+5.2% vs previous quarter',
            positive: true,
            icon: <TrendingUp />,
            color: '#D80E51'
        },
        {
            title: 'Ceded Premium',
            value: '₹ 498 Cr',
            change: '-2.1% vs previous quarter',
            positive: false,
            icon: <SwapHoriz />,
            color: '#1565c0'
        },
        {
            title: 'Retained %',
            value: '60.3%',
            change: '+3.7 pts vs target',
            positive: true,
            icon: <Percent />,
            color: '#2e7d32'
        },
        {
            title: 'Net Loss Ratio',
            value: '68.2%',
            change: '+4.1% vs target (65%)',
            positive: false,
            icon: <BalanceOutlined />,
            color: '#ef6c00'
        }
    ];

    // Chart data for bars
    const chartData = [
        { label: 'GWP', value: 100, amount: '₹1,245 Cr' },
        { label: 'Ceded', value: 40, amount: '₹498 Cr' },
        { label: 'Retained', value: 60, amount: '₹747 Cr' }
    ];

    // Loss ratio trend data
    const lossRatioData = [
        { month: 'Oct', ratio: 65 },
        { month: 'Nov', ratio: 72 },
        { month: 'Dec', ratio: 68 },
        { month: 'Jan', ratio: 75, highlight: true },
        { month: 'Feb', ratio: 70 },
        { month: 'Mar', ratio: 67 }
    ];

    // Top reinsurers data
    const reinsurers = [
        { name: 'Reinsurer A', share: '24.5%', rating: 'AA+', outstanding: '2.4', recovery: '98.2%', ratingColor: '#2e7d32' },
        { name: 'Reinsurer B', share: '18.7%', rating: 'A+', outstanding: '5.2', recovery: '85.6%', ratingColor: '#2e7d32' },
        { name: 'Reinsurer C', share: '12.3%', rating: 'AA-', outstanding: '1.8', recovery: '96.7%', ratingColor: '#2e7d32' },
        { name: 'Reinsurer D', share: '9.2%', rating: 'BBB+', outstanding: '3.5', recovery: '78.3%', ratingColor: '#f57c00' },
        { name: 'Reinsurer E', share: '7.8%', rating: 'A', outstanding: '1.2', recovery: '94.1%', ratingColor: '#2e7d32' }
    ];

    return (
        <Box sx={{
            backgroundColor: '#f8fafc',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)'
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
                        Reinsurance Portfolio Overview
                    </Typography>
                    <Typography variant="body1" sx={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '14px'
                    }}>
                        Comprehensive analytics and performance insights for reinsurance operations
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <FormControl
                        size="small"
                        sx={{
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
                        }}
                    >
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
                            <MenuItem value="Q4 2023">Q4 2023</MenuItem>
                            <MenuItem value="Q1 2024">Q1 2024</MenuItem>
                            <MenuItem value="Q2 2024">Q2 2024</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl
                        size="small"
                        sx={{
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
                        }}
                    >
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
                            <MenuItem value="All LOBs">All LOBs</MenuItem>
                            <MenuItem value="Property">Property</MenuItem>
                            <MenuItem value="Casualty">Casualty</MenuItem>
                            <MenuItem value="Marine">Marine</MenuItem>
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

            <Box sx={{ p: 3 }}>
                {/* Key Metrics */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    {metrics.map((metric, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Card sx={{
                                height: '100%',
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                                border: '1px solid rgba(226, 232, 240, 0.8)',
                                borderRadius: '12px',
                                background: 'linear-gradient(135deg, #ffffff 0%, #fefefe 100%)',
                                position: 'relative',
                                overflow: 'hidden',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '3px',
                                    background: `linear-gradient(90deg, ${metric.color} 0%, ${metric.color}80 100%)`
                                },
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)'
                                }
                            }}>
                                <CardContent sx={{ p: 2.5 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                        <Typography variant="body2" sx={{
                                            color: '#64748b',
                                            fontWeight: 500,
                                            fontSize: '12px',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px'
                                        }}>
                                            {metric.title}
                                        </Typography>
                                        <Box sx={{
                                            width: 36,
                                            height: 36,
                                            borderRadius: '8px',
                                            backgroundColor: `${metric.color}15`,
                                            color: metric.color,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '18px'
                                        }}>
                                            {metric.icon}
                                        </Box>
                                    </Box>
                                    <Typography variant="h4" sx={{
                                        fontWeight: 700,
                                        color: '#1e293b',
                                        mb: 1,
                                        fontSize: '28px'
                                    }}>
                                        {metric.value}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: metric.positive ? '#059669' : '#dc2626',
                                            fontWeight: 500,
                                            fontSize: '12px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 0.5
                                        }}
                                    >
                                        {metric.positive ? '↗' : '↘'} {metric.change}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Charts Section */}
                <Grid container spacing={3} sx={{ mb: 3 }}>
                    {/* GWP vs Ceded vs Retained Chart */}
                    <Grid item xs={12} md={6}>
                        <Card sx={{
                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px'
                        }}>
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                    <Typography variant="h6" sx={{
                                        fontWeight: 600,
                                        color: '#1e293b',
                                        fontSize: '16px'
                                    }}>
                                        GWP vs Ceded vs Retained
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            sx={{
                                                fontSize: '11px',
                                                textTransform: 'none',
                                                borderColor: '#e2e8f0',
                                                color: '#64748b'
                                            }}
                                        >
                                            QoQ
                                        </Button>
                                        <Button
                                            size="small"
                                            variant="contained"
                                            sx={{
                                                backgroundColor: '#D80E51',
                                                fontSize: '11px',
                                                textTransform: 'none',
                                                boxShadow: 'none',
                                                '&:hover': { backgroundColor: '#C2185B' }
                                            }}
                                        >
                                            YoY
                                        </Button>
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'end', gap: 3, height: 180, px: 2 }}>
                                    {chartData.map((item, index) => (
                                        <Box key={index} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <Box
                                                sx={{
                                                    width: '100%',
                                                    height: `${item.value * 1.2}px`,
                                                    backgroundColor: index === 2 ? '#059669' : '#D80E51',
                                                    borderRadius: '4px 4px 0 0',
                                                    mb: 1,
                                                    background: index === 2
                                                        ? 'linear-gradient(to top, #059669, #10b981)'
                                                        : 'linear-gradient(to top, #D80E51, #F06292)'
                                                }}
                                            />
                                            <Typography variant="caption" sx={{
                                                fontWeight: 600,
                                                color: '#64748b',
                                                fontSize: '11px'
                                            }}>
                                                {item.label}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Reinsurer Concentration */}
                    <Grid item xs={12} md={6}>
                        <Card sx={{
                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px'
                        }}>
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                    <Typography variant="h6" sx={{
                                        fontWeight: 600,
                                        color: '#1e293b',
                                        fontSize: '16px'
                                    }}>
                                        Reinsurer Concentration
                                    </Typography>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        startIcon={<Visibility />}
                                        sx={{
                                            fontSize: '11px',
                                            textTransform: 'none',
                                            borderColor: '#e2e8f0',
                                            color: '#64748b'
                                        }}
                                    >
                                        View All
                                    </Button>
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: 220 }}>
                                    {/* Pie Chart */}
                                    <Box sx={{ position: 'relative', mb: 3 }}>
                                        <Box
                                            sx={{
                                                width: 140,
                                                height: 140,
                                                borderRadius: '50%',
                                                background: `conic-gradient(
                                                    #D80E51 0% 30%, 
                                                    #C2185B 30% 55%, 
                                                    #F06292 55% 75%, 
                                                    #FCE4EC 75% 100%
                                                )`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                boxShadow: '0 8px 32px rgba(216, 14, 81, 0.2)',
                                                position: 'relative'
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    width: 85,
                                                    height: 85,
                                                    backgroundColor: 'white',
                                                    borderRadius: '50%',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                                                    border: '2px solid #f8fafc'
                                                }}
                                            >
                                                <Typography variant="caption" sx={{
                                                    color: '#64748b',
                                                    fontSize: '10px',
                                                    fontWeight: 500,
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.5px'
                                                }}>
                                                    Top 10
                                                </Typography>
                                                <Typography variant="h4" sx={{
                                                    fontWeight: 800,
                                                    color: '#D80E51',
                                                    fontSize: '24px',
                                                    lineHeight: 1
                                                }}>
                                                    84%
                                                </Typography>
                                                <Typography variant="caption" sx={{
                                                    color: '#64748b',
                                                    fontSize: '9px',
                                                    textAlign: 'center',
                                                    lineHeight: 1.2,
                                                    mt: 0.5
                                                }}>
                                                    ceded premium
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>

                                    {/* Legend */}
                                    <Box sx={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        justifyContent: 'center',
                                        gap: 2,
                                        maxWidth: '100%'
                                    }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                            <Box sx={{
                                                width: 10,
                                                height: 10,
                                                backgroundColor: '#D80E51',
                                                borderRadius: '2px',
                                                boxShadow: '0 2px 4px rgba(216, 14, 81, 0.3)'
                                            }} />
                                            <Typography variant="caption" sx={{
                                                fontSize: '11px',
                                                fontWeight: 500,
                                                color: '#475569'
                                            }}>
                                                Reinsurer A
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                            <Box sx={{
                                                width: 10,
                                                height: 10,
                                                backgroundColor: '#C2185B',
                                                borderRadius: '2px',
                                                boxShadow: '0 2px 4px rgba(194, 24, 91, 0.3)'
                                            }} />
                                            <Typography variant="caption" sx={{
                                                fontSize: '11px',
                                                fontWeight: 500,
                                                color: '#475569'
                                            }}>
                                                Reinsurer B
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                            <Box sx={{
                                                width: 10,
                                                height: 10,
                                                backgroundColor: '#F06292',
                                                borderRadius: '2px',
                                                boxShadow: '0 2px 4px rgba(240, 98, 146, 0.3)'
                                            }} />
                                            <Typography variant="caption" sx={{
                                                fontSize: '11px',
                                                fontWeight: 500,
                                                color: '#475569'
                                            }}>
                                                Others
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Loss Ratio Trend & RI Recoveries */}
                <Grid container spacing={3} sx={{ mb: 3 }}>
                    {/* Loss Ratio Trend */}
                    <Grid item xs={12} md={6}>
                        <Card sx={{
                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px'
                        }}>
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                    <Typography variant="h6" sx={{
                                        fontWeight: 600,
                                        color: '#1e293b',
                                        fontSize: '16px'
                                    }}>
                                        Loss Ratio Trend (Monthly)
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            sx={{
                                                fontSize: '11px',
                                                textTransform: 'none',
                                                borderColor: '#e2e8f0',
                                                color: '#64748b'
                                            }}
                                        >
                                            Monthly
                                        </Button>
                                        <Button
                                            size="small"
                                            variant="contained"
                                            sx={{
                                                backgroundColor: '#D80E51',
                                                fontSize: '11px',
                                                textTransform: 'none',
                                                boxShadow: 'none',
                                                '&:hover': { backgroundColor: '#C2185B' }
                                            }}
                                        >
                                            Quarterly
                                        </Button>
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'end', justifyContent: 'space-around', height: 180, px: 2 }}>
                                    {lossRatioData.map((item, index) => (
                                        <Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <Typography variant="caption" sx={{ mb: 1, fontSize: '10px', color: '#64748b' }}>{item.month}</Typography>
                                            <Box
                                                sx={{
                                                    width: 24,
                                                    height: `${item.ratio * 1.2}px`,
                                                    backgroundColor: item.highlight ? '#f59e0b' : '#D80E51',
                                                    borderRadius: '4px 4px 0 0',
                                                    mb: 1
                                                }}
                                            />
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    fontWeight: item.highlight ? 700 : 500,
                                                    color: item.highlight ? '#f59e0b' : '#64748b',
                                                    fontSize: '10px'
                                                }}
                                            >
                                                {item.ratio}%
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                                <Typography variant="body2" sx={{
                                    textAlign: 'center',
                                    mt: 2,
                                    color: '#64748b',
                                    fontSize: '12px'
                                }}>
                                    Industry Average: <strong>71.2%</strong>
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* RI Recoveries & Outstanding */}
                    <Grid item xs={12} md={6}>
                        <Card sx={{
                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px'
                        }}>
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                    <Typography variant="h6" sx={{
                                        fontWeight: 600,
                                        color: '#1e293b',
                                        fontSize: '16px'
                                    }}>
                                        RI Recoveries & Outstanding
                                    </Typography>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        sx={{
                                            fontSize: '11px',
                                            textTransform: 'none',
                                            borderColor: '#e2e8f0',
                                            color: '#64748b'
                                        }}
                                    >
                                        Details
                                    </Button>
                                </Box>
                                <Grid container spacing={3}>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" sx={{
                                            color: '#64748b',
                                            mb: 1,
                                            fontSize: '12px',
                                            fontWeight: 500
                                        }}>
                                            RI Recoveries Paid
                                        </Typography>
                                        <Typography variant="h4" sx={{
                                            fontWeight: 700,
                                            color: '#059669',
                                            mb: 1,
                                            fontSize: '24px'
                                        }}>
                                            ₹ 42 Cr
                                        </Typography>
                                        <Typography variant="body2" sx={{
                                            color: '#059669',
                                            mb: 2,
                                            fontSize: '11px',
                                            fontWeight: 500
                                        }}>
                                            ↗ +12.3% vs previous quarter
                                        </Typography>
                                        <Box sx={{ fontSize: '11px' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                                <CheckCircle sx={{ fontSize: 14, color: '#059669' }} />
                                                <Typography variant="caption" sx={{ fontSize: '11px' }}>92% within SLA</Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Schedule sx={{ fontSize: 14, color: '#f59e0b' }} />
                                                <Typography variant="caption" sx={{ fontSize: '11px' }}>8% pending &gt; 30 days</Typography>
                                            </Box>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" sx={{
                                            color: '#64748b',
                                            mb: 1,
                                            fontSize: '12px',
                                            fontWeight: 500
                                        }}>
                                            RI Outstanding
                                        </Typography>
                                        <Typography variant="h4" sx={{
                                            fontWeight: 700,
                                            color: '#dc2626',
                                            mb: 1,
                                            fontSize: '24px'
                                        }}>
                                            ₹ 18 Cr
                                        </Typography>
                                        <Typography variant="body2" sx={{
                                            color: '#dc2626',
                                            mb: 2,
                                            fontSize: '11px',
                                            fontWeight: 500
                                        }}>
                                            ↗ +8.7% vs previous quarter
                                        </Typography>
                                        <Box sx={{ fontSize: '11px' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                                <Warning sx={{ fontSize: 14, color: '#dc2626' }} />
                                                <Typography variant="caption" sx={{ fontSize: '11px' }}>₹ 5.2 Cr &gt; 90 days</Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Info sx={{ fontSize: 14, color: '#D80E51' }} />
                                                <Typography variant="caption" sx={{ fontSize: '11px' }}>3.2% of total recoverable</Typography>
                                            </Box>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Solvency Impact */}
                <Card sx={{
                    mb: 3,
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                }}>
                    <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h6" sx={{
                                fontWeight: 600,
                                color: '#1e293b',
                                fontSize: '16px'
                            }}>
                                Solvency Impact (Before / After RI)
                            </Typography>
                            <Button
                                size="small"
                                variant="outlined"
                                startIcon={<Info />}
                                sx={{
                                    fontSize: '11px',
                                    textTransform: 'none',
                                    borderColor: '#e2e8f0',
                                    color: '#64748b'
                                }}
                            >
                                Methodology
                            </Button>
                        </Box>
                        <Grid container spacing={4}>
                            <Grid item xs={12} md={6}>
                                <Box sx={{ mb: 2.5 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="body2" sx={{ fontSize: '12px', color: '#64748b' }}>Before Reinsurance</Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '12px' }}>1.85</Typography>
                                    </Box>
                                    <LinearProgress
                                        variant="determinate"
                                        value={74}
                                        sx={{
                                            height: 16,
                                            borderRadius: 8,
                                            backgroundColor: '#f1f5f9',
                                            '& .MuiLinearProgress-bar': { backgroundColor: '#dc2626', borderRadius: 8 }
                                        }}
                                    />
                                </Box>
                                <Box sx={{ mb: 2.5 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="body2" sx={{ fontSize: '12px', color: '#64748b' }}>After Reinsurance</Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '12px' }}>2.35</Typography>
                                    </Box>
                                    <LinearProgress
                                        variant="determinate"
                                        value={94}
                                        sx={{
                                            height: 16,
                                            borderRadius: 8,
                                            backgroundColor: '#f1f5f9',
                                            '& .MuiLinearProgress-bar': { backgroundColor: '#059669', borderRadius: 8 }
                                        }}
                                    />
                                </Box>
                                <Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="body2" sx={{ fontSize: '12px', color: '#64748b' }}>Regulatory Minimum</Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '12px' }}>1.50</Typography>
                                    </Box>
                                    <LinearProgress
                                        variant="determinate"
                                        value={60}
                                        sx={{
                                            height: 16,
                                            borderRadius: 8,
                                            backgroundColor: '#f1f5f9',
                                            '& .MuiLinearProgress-bar': { backgroundColor: '#64748b', borderRadius: 8 }
                                        }}
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" sx={{
                                    mb: 2,
                                    color: '#D80E51',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    fontSize: '15px'
                                }}>
                                    ↗ Reinsurance improves solvency by <strong>+0.50 points</strong>
                                </Typography>
                                <Card sx={{ mb: 2, backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                                    <CardContent sx={{ p: 2 }}>
                                        <Typography variant="subtitle2" sx={{
                                            fontWeight: 600,
                                            color: '#059669',
                                            mb: 1,
                                            fontSize: '13px'
                                        }}>
                                            Capital Efficiency
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontSize: '12px', color: '#064e3b' }}>
                                            72% of peak exposure effectively transferred to reinsurers
                                        </Typography>
                                    </CardContent>
                                </Card>
                                <Card sx={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe' }}>
                                    <CardContent sx={{ p: 2 }}>
                                        <Typography variant="subtitle2" sx={{
                                            fontWeight: 600,
                                            color: '#1d4ed8',
                                            mb: 1,
                                            fontSize: '13px'
                                        }}>
                                            Cost vs Benefit Analysis
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontSize: '12px', color: '#1e3a8a' }}>
                                            Reinsurance cost at 4.2% of GWP vs 6.8% capital relief benefit
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                {/* Top Reinsurers Table */}
                <Card sx={{
                    mb: 3,
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                }}>
                    <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h6" sx={{
                                fontWeight: 600,
                                color: '#1e293b',
                                fontSize: '16px'
                            }}>
                                Top 10 Reinsurers
                            </Typography>
                            <Button
                                variant="contained"
                                startIcon={<Add />}
                                size="small"
                                sx={{
                                    backgroundColor: '#D80E51',
                                    fontSize: '12px',
                                    textTransform: 'none',
                                    boxShadow: 'none',
                                    '&:hover': { backgroundColor: '#C2185B' }
                                }}
                            >
                                Add Reinsurer
                            </Button>
                        </Box>
                        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '12px', color: '#475569', py: 1.5 }}>Reinsurer</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '12px', color: '#475569', py: 1.5 }}>Share of Ceded Premium</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '12px', color: '#475569', py: 1.5 }}>Credit Rating</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '12px', color: '#475569', py: 1.5 }}>Outstanding (₹ Cr)</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '12px', color: '#475569', py: 1.5 }}>Recovery Rate</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '12px', color: '#475569', py: 1.5 }}>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {reinsurers.map((reinsurer, index) => (
                                        <TableRow key={index} sx={{ '&:hover': { backgroundColor: '#f8fafc' } }}>
                                            <TableCell sx={{ fontWeight: 600, fontSize: '13px', py: 1.5 }}>{reinsurer.name}</TableCell>
                                            <TableCell sx={{ fontSize: '13px', py: 1.5 }}>{reinsurer.share}</TableCell>
                                            <TableCell sx={{ py: 1.5 }}>
                                                <Chip
                                                    label={reinsurer.rating}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: `${reinsurer.ratingColor}15`,
                                                        color: reinsurer.ratingColor,
                                                        fontWeight: 600,
                                                        fontSize: '11px',
                                                        height: '22px'
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell sx={{ fontSize: '13px', py: 1.5 }}>{reinsurer.outstanding}</TableCell>
                                            <TableCell sx={{ py: 1.5 }}>
                                                <Typography
                                                    sx={{
                                                        color: parseFloat(reinsurer.recovery) > 90 ? '#059669' : '#dc2626',
                                                        fontWeight: 600,
                                                        fontSize: '13px'
                                                    }}
                                                >
                                                    {reinsurer.recovery}
                                                </Typography>
                                            </TableCell>
                                            <TableCell sx={{ py: 1.5 }}>
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    sx={{
                                                        fontSize: '11px',
                                                        textTransform: 'none',
                                                        borderColor: '#e2e8f0',
                                                        color: '#64748b',
                                                        minWidth: 'auto',
                                                        px: 2
                                                    }}
                                                >
                                                    View
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>

                {/* Alerts & Action Items */}
                <Card sx={{
                    mb: 3,
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                }}>
                    <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h6" sx={{
                                fontWeight: 600,
                                color: '#1e293b',
                                fontSize: '16px'
                            }}>
                                Alerts & Action Items
                            </Typography>
                            <Chip
                                label="3 High Priority"
                                color="error"
                                icon={<Warning />}
                                size="small"
                                sx={{ fontWeight: 600, fontSize: '11px' }}
                            />
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Alert severity="warning" sx={{
                                '& .MuiAlert-message': { width: '100%' },
                                borderRadius: '6px',
                                fontSize: '13px'
                            }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5, fontSize: '13px' }}>
                                    RI Outstanding &gt;90 days: ₹ 5.2 Cr (3.2% of total)
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '12px' }}>
                                    Reinsurer D accounts for 65% of overdue amount
                                </Typography>
                            </Alert>
                            <Alert severity="warning" sx={{
                                '& .MuiAlert-message': { width: '100%' },
                                borderRadius: '6px',
                                fontSize: '13px'
                            }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5, fontSize: '13px' }}>
                                    Loss ratio exceeds target by 4.1% (68.2% vs 65% target)
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '12px' }}>
                                    Property segment showing 72.5% loss ratio
                                </Typography>
                            </Alert>
                            <Alert severity="success" sx={{
                                '& .MuiAlert-message': { width: '100%' },
                                borderRadius: '6px',
                                fontSize: '13px'
                            }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5, fontSize: '13px' }}>
                                    Recovery efficiency at 92% (exceeds 90% target)
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '12px' }}>
                                    All major reinsurers complying with SLA terms
                                </Typography>
                            </Alert>
                            <Alert severity="success" sx={{
                                '& .MuiAlert-message': { width: '100%' },
                                borderRadius: '6px',
                                fontSize: '13px'
                            }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5, fontSize: '13px' }}>
                                    Solvency margin strong at 2.35 after reinsurance
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '12px' }}>
                                    Well above regulatory minimum of 1.50
                                </Typography>
                            </Alert>
                        </Box>
                    </CardContent>
                </Card>

                {/* Footer */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    color: '#64748b',
                    fontSize: '12px',
                    pt: 2,
                    borderTop: '1px solid #e2e8f0'
                }}>
                    <Typography variant="caption" sx={{ fontSize: '12px' }}>⏰ Last Updated: March 31, 2024 15:30 IST</Typography>
                    <Typography variant="caption" sx={{ fontSize: '12px' }}>📅 Next Renewal: June 30, 2024</Typography>
                    <Typography variant="caption" sx={{ fontSize: '12px' }}>💾 Data Source: Underwriting & Claims Systems</Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default ReinsuranceDashboard;
