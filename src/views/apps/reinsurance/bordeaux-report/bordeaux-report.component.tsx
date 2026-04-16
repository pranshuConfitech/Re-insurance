'use client';
import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Grid,
    Typography,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Collapse,
    IconButton,
    CircularProgress,
    Alert,
    Divider,
    Chip,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import DescriptionIcon from '@mui/icons-material/Description';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { useRouter } from 'next/navigation';
import { BordeauxService, type BordeauxSearchResponse } from '@/services/remote-api/api/reinsurance-services/bordeaux.service';

const bordeauxService = new BordeauxService();

export default function BordeauxReportComponent() {
    const router = useRouter();
    const [fromDate, setFromDate] = useState('2026-04-01');
    const [toDate, setToDate] = useState('2026-04-30');
    const [treatyCode, setTreatyCode] = useState('');
    const [searchData, setSearchData] = useState<BordeauxSearchResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

    const handleSearch = async () => {
        setLoading(true);
        setError(null);

        try {
            const result = await bordeauxService.searchBordeauxByRiDate({
                fromDate,
                toDate,
                treatyCode: treatyCode.trim() || undefined
            }).toPromise();

            if (!result) {
                setError('No data returned from search');
                return;
            }

            setSearchData(result);
            // Auto-expand all groups
            const expanded: Record<string, boolean> = {};
            result.rows.forEach(row => {
                expanded[row.bordeauxStatementNumber] = false;
            });
            setExpandedGroups(expanded);
        } catch (err: any) {
            console.error('Search error:', err);
            setError(err?.message || 'Failed to search data');
        } finally {
            setLoading(false);
        }
    };

    const handleGenerate = async () => {
        if (!searchData) return;

        setLoading(true);
        setError(null);

        try {
            const result = await bordeauxService.generateBordeauxHeader({
                fromDate,
                toDate,
                treatyCode: treatyCode.trim() || undefined
            }).toPromise();

            if (!result) {
                setError('No data returned from generate');
                return;
            }

            // Ensure count is set from rows length if not provided
            const normalizedResult = {
                ...result,
                count: result.count || result.rows?.length || 0
            };

            // Replace search data with generated data
            setSearchData(normalizedResult);

            // Auto-expand all groups with new data
            const expanded: Record<string, boolean> = {};
            normalizedResult.rows.forEach(row => {
                expanded[row.bordeauxStatementNumber] = false;
            });
            setExpandedGroups(expanded);
        } catch (err: any) {
            console.error('Generate error:', err);
            setError(err?.message || 'Failed to generate report');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        router.push('/reinsurance/bordeaux-report/create');
    };

    const toggleGroup = (statementNumber: string) => {
        setExpandedGroups(prev => ({
            ...prev,
            [statementNumber]: !prev[statementNumber]
        }));
    };

    // Group data by bordeauxStatementNumber
    const groupedData = searchData?.rows.reduce((acc, row) => {
        const key = row.bordeauxStatementNumber;
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(row);
        return acc;
    }, {} as Record<string, typeof searchData.rows>);

    const renderField = (label: string, value: any) => {
        if (value === null || value === undefined) return null;

        // Format the value
        let displayValue = value;
        if (typeof value === 'number') {
            displayValue = new Intl.NumberFormat('en-IN').format(value);
        } else if (typeof value === 'boolean') {
            displayValue = value ? 'Yes' : 'No';
        } else {
            displayValue = String(value);
        }

        return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={label}>
                <Box sx={{
                    p: 1.5,
                    backgroundColor: '#fff',
                    borderRadius: '4px',
                    border: '1px solid #e0e0e0'
                }}>
                    <Typography
                        variant="caption"
                        sx={{
                            color: '#6c757d',
                            fontSize: '10px',
                            textTransform: 'uppercase',
                            fontWeight: 600,
                            letterSpacing: '0.5px',
                            display: 'block',
                            mb: 0.5
                        }}
                    >
                        {label}
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            fontWeight: 500,
                            fontSize: '12px',
                            color: '#2c3e50',
                            wordBreak: 'break-word'
                        }}
                    >
                        {displayValue}
                    </Typography>
                </Box>
            </Grid>
        );
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                    Bordeaux Report
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleCreate}
                    sx={{
                        backgroundColor: '#28a745',
                        color: '#fff',
                        textTransform: 'none',
                        fontSize: '13px',
                        fontWeight: 600,
                        px: 3,
                        py: 1,
                        borderRadius: '6px',
                        boxShadow: '0 2px 4px rgba(40, 167, 69, 0.2)',
                        '&:hover': {
                            backgroundColor: '#218838',
                            boxShadow: '0 4px 8px rgba(40, 167, 69, 0.3)'
                        }
                    }}
                >
                    Create
                </Button>
            </Box>

            {/* Search Section */}
            <Card sx={{ mb: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderRadius: '8px' }}>
                <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                        <SearchIcon sx={{ color: '#1976d2', fontSize: 22 }} />
                        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '15px', color: '#2c3e50' }}>
                            Search & Verify Data
                        </Typography>
                    </Box>

                    <Grid container spacing={2.5} alignItems="flex-end">
                        <Grid item xs={12} sm={6} md={2.5}>
                            <TextField
                                fullWidth
                                label="From Date"
                                type="date"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        fontSize: '14px',
                                        height: '42px',
                                        '& fieldset': {
                                            borderColor: '#d0d0d0'
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#999'
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#e91e63',
                                            borderWidth: '2px'
                                        }
                                    },
                                    '& .MuiInputLabel-root': {
                                        fontSize: '14px',
                                        '&.Mui-focused': {
                                            color: '#e91e63'
                                        }
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={2.5}>
                            <TextField
                                fullWidth
                                label="To Date"
                                type="date"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        fontSize: '14px',
                                        height: '42px',
                                        '& fieldset': {
                                            borderColor: '#d0d0d0'
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#999'
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#e91e63',
                                            borderWidth: '2px'
                                        }
                                    },
                                    '& .MuiInputLabel-root': {
                                        fontSize: '14px',
                                        '&.Mui-focused': {
                                            color: '#e91e63'
                                        }
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={2.5}>
                            <TextField
                                fullWidth
                                label="Treaty Code"
                                value={treatyCode}
                                onChange={(e) => setTreatyCode(e.target.value)}
                                placeholder="e.g., T11"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        fontSize: '14px',
                                        height: '42px',
                                        '& fieldset': {
                                            borderColor: '#d0d0d0'
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#999'
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#e91e63',
                                            borderWidth: '2px'
                                        },
                                        '& input': {
                                            padding: '8.5px 14px',
                                            height: '42px',
                                            boxSizing: 'border-box'
                                        }
                                    },
                                    '& .MuiInputLabel-root': {
                                        fontSize: '14px',
                                        '&.Mui-focused': {
                                            color: '#e91e63'
                                        }
                                    },
                                    '& input::placeholder': {
                                        fontSize: '13px',
                                        color: '#9e9e9e',
                                        opacity: 1
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={2.25}>
                            <Button
                                fullWidth
                                variant="contained"
                                onClick={handleSearch}
                                disabled={loading}
                                startIcon={loading ? null : <SearchIcon sx={{ fontSize: 18 }} />}
                                sx={{
                                    backgroundColor: '#e91e63',
                                    color: '#fff',
                                    fontWeight: 500,
                                    fontSize: '14px',
                                    textTransform: 'none',
                                    height: '42px',
                                    borderRadius: '6px',
                                    boxShadow: 'none',
                                    '&:hover': {
                                        backgroundColor: '#c2185b',
                                        boxShadow: '0 2px 4px rgba(233, 30, 99, 0.3)'
                                    },
                                    '&:disabled': {
                                        backgroundColor: '#e0e0e0',
                                        color: '#9e9e9e'
                                    }
                                }}
                            >
                                {loading ? <CircularProgress size={18} sx={{ color: 'white' }} /> : 'Search Data'}
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={6} md={2.25}>
                            <Button
                                fullWidth
                                variant="contained"
                                onClick={handleGenerate}
                                disabled={!searchData || loading}
                                sx={{
                                    backgroundColor: '#d81b60',
                                    color: '#fff',
                                    fontWeight: 500,
                                    fontSize: '14px',
                                    textTransform: 'none',
                                    height: '42px',
                                    borderRadius: '6px',
                                    boxShadow: 'none',
                                    '&:hover': {
                                        backgroundColor: '#ad1457',
                                        boxShadow: '0 2px 4px rgba(216, 27, 96, 0.3)'
                                    },
                                    '&:disabled': {
                                        backgroundColor: '#e0e0e0',
                                        color: '#9e9e9e'
                                    }
                                }}
                            >
                                Generate
                            </Button>
                        </Grid>
                    </Grid>

                    {error && (
                        <Alert severity="error" sx={{ mt: 2, fontSize: '13px' }}>
                            {error}
                        </Alert>
                    )}
                </CardContent>
            </Card>

            {/* Results Section */}
            {searchData && groupedData && (
                <Box>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mb: 2,
                        p: 2,
                        backgroundColor: '#f8f9fa',
                        borderRadius: '8px'
                    }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '14px', color: '#2c3e50' }}>
                            Search Results
                        </Typography>
                        <Chip
                            label={`${searchData.count} records found`}
                            sx={{
                                backgroundColor: '#e3f2fd',
                                color: '#1976d2',
                                fontWeight: 600,
                                fontSize: '12px'
                            }}
                        />
                    </Box>

                    {Object.entries(groupedData).map(([statementNumber, rows]) => (
                        <Card
                            key={statementNumber}
                            sx={{
                                mb: 2,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                borderRadius: '8px',
                                border: '1px solid #e0e0e0',
                                overflow: 'hidden'
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    p: 2,
                                    backgroundColor: '#f8f9fa',
                                    cursor: 'pointer',
                                    borderBottom: expandedGroups[statementNumber] ? '1px solid #e0e0e0' : 'none',
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                        backgroundColor: '#e9ecef'
                                    }
                                }}
                                onClick={() => toggleGroup(statementNumber)}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <DescriptionIcon sx={{ color: '#1976d2', fontSize: 22 }} />
                                    <Box>
                                        <Typography sx={{ fontWeight: 600, fontSize: '13px', color: '#2c3e50' }}>
                                            {statementNumber}
                                        </Typography>
                                        <Typography sx={{ fontSize: '11px', color: '#6c757d', mt: 0.3 }}>
                                            {rows.length} {rows.length === 1 ? 'record' : 'records'}
                                        </Typography>
                                    </Box>
                                </Box>
                                <IconButton size="small" sx={{ color: '#6c757d' }}>
                                    {expandedGroups[statementNumber] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                </IconButton>
                            </Box>

                            <Collapse in={expandedGroups[statementNumber]}>
                                <Box sx={{ p: 0 }}>
                                    {rows.map((row, idx) => (
                                        <Box
                                            key={row.key || idx}
                                            sx={{
                                                borderBottom: idx < rows.length - 1 ? '2px solid #dee2e6' : 'none'
                                            }}
                                        >
                                            <Box sx={{
                                                p: 3,
                                                backgroundColor: idx % 2 === 0 ? '#fff' : '#fafafa'
                                            }}>
                                                <Grid container spacing={2}>
                                                    {Object.entries(row).map(([key, value]) => {
                                                        if (key === 'id' || key === 'key') return null;

                                                        const label = key
                                                            .replace(/([A-Z])/g, ' $1')
                                                            .replace(/^./, str => str.toUpperCase())
                                                            .trim();

                                                        return renderField(label, value);
                                                    })}
                                                </Grid>
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                            </Collapse>
                        </Card>
                    ))}
                </Box>
            )}
        </Box>
    );
}
