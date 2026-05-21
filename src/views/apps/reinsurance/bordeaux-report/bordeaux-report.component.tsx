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
import { useRouter } from 'next/navigation';
import { BordeauxService, type BordeauxSearchResponse } from '@/services/remote-api/api/reinsurance-services/bordeaux.service';

const bordeauxService = new BordeauxService();

export default function BordeauxReportComponent() {
    const router = useRouter();

    // Get current date in YYYY-MM-DD format
    const getCurrentDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    const [fromDate, setFromDate] = useState(getCurrentDate());
    const [toDate, setToDate] = useState(getCurrentDate());
    const [treatyCode, setTreatyCode] = useState('');
    const [searchData, setSearchData] = useState<BordeauxSearchResponse | null>(null);
    const [generatedData, setGeneratedData] = useState<BordeauxSearchResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

    const handleSearch = async () => {
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const result = await bordeauxService.searchBordeauxByRiDate({
                fromDate,
                toDate,
                treatyCode: treatyCode.trim() || undefined
            }).toPromise();

            if (!result) {
                setError('No data returned from search');
                setSearchData(null);
                return;
            }

            if (!result.rows || result.rows.length === 0) {
                setError('No records found for the selected date range and treaty code');
                setSearchData(null);
                return;
            }

            setSearchData(result);
            setGeneratedData(null);
            // Auto-expand all groups
            const expanded: Record<string, boolean> = {};
            result.rows.forEach(row => {
                expanded[row.bordeauxStatementNumber] = false;
            });
            setExpandedGroups(expanded);
            setSuccessMessage(`Found ${result.count || result.rows.length} records`);
        } catch (err: any) {
            console.error('Search error:', err);
            setSearchData(null);
            setError(err?.response?.data?.message || err?.message || 'Failed to search data. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleGenerate = async () => {
        if (!searchData) {
            setError('Please search for data first before generating');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const result = await bordeauxService.generateBordeauxHeader({
                fromDate,
                toDate,
                treatyCode: treatyCode.trim() || undefined
            }).toPromise();

            if (!result) {
                setError('No data returned from generate');
                setGeneratedData(null);
                return;
            }

            if (!result.rows || result.rows.length === 0) {
                setError('No headers generated. Please verify the data and try again.');
                setGeneratedData(null);
                return;
            }

            // Ensure count is set from rows length if not provided
            const normalizedResult = {
                ...result,
                count: result.count || result.rows?.length || 0
            };

            // Keep generated preview data separate
            setGeneratedData(normalizedResult);

            // Auto-expand all groups with new data
            const expanded: Record<string, boolean> = {};
            normalizedResult.rows.forEach(row => {
                expanded[row.bordeauxStatementNumber] = false;
            });
            setExpandedGroups(expanded);
            setSuccessMessage(`Successfully generated ${normalizedResult.count} header records`);
        } catch (err: any) {
            console.error('Generate error:', err);
            setGeneratedData(null);
            setError(err?.response?.data?.message || err?.message || 'Failed to generate report. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitGenerated = async () => {
        if (!generatedData) {
            setError('No generated data to confirm');
            return;
        }

        setSubmitLoading(true);
        setError(null);
        setSuccessMessage(null);
        try {
            await bordeauxService.confirmGeneratedHeader({
                fromDate,
                toDate,
                treatyCode: treatyCode.trim() || undefined
            }).toPromise();

            // Navigate to Bordeaux Invoice Generation page without query parameters
            // Users will input their own search criteria on that page
            router.push('/reinsurance/bordeaux-invoice-generation');
        } catch (err: any) {
            console.error('Submit generated header error:', err);
            setError(err?.response?.data?.message || err?.message || 'Failed to confirm generated headers. Please try again.');
        } finally {
            setSubmitLoading(false);
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

    // Field mapping for display labels
    const fieldLabels: Record<string, string> = {
        gcLoadDate: 'GC Load date',
        transactionDate: 'TRANSACTION DATE',
        uniqueInternalId: 'Unique INTERNAL ID',
        treatyCode: 'TREATY CODE',
        brokerCode: 'BROKER CODE',
        reinsurerCode: 'INSURER / REINSURER',
        feeCode: 'FEE CODE',
        riDate: 'RI DATE',
        cessionType: 'OUT/RETROO CESSION',
        policyNumber: 'POLICY NUMBER',
        endtNumber: 'ENDT NUMBER',
        policyHolderName: 'POLICY HOLDER NAME',
        policyIssueDate: 'Policy Issue Date',
        policyStartDate: 'POLICY START DATE',
        policyEndDate: 'POLICY END DATE',
        endrStartDate: 'ENDR START DATE',
        sectionLob: 'Section LOB',
        gwpAmountSection: 'GWP AMOUNT SECTION',
        risiAmountSection: 'RISI Amount Section',
        participantRiAmount: 'PARTICIPANT RI Amount',
        claimNumber: 'Claim Number',
        claimantName: 'Claimant name',
        claimLossDate: 'Claim Loss date',
        claimReportingDate: 'Claim reporting Date',
        policyStatus: 'Policy status',
        claimStatus: 'Claim status',
        indemnityIncurredClaimAmount: 'Indemnity Incurred Claim amount',
        indemnityIncurredClaimPaid: 'Indemnity Incurred Claim Paid',
        indemnityIncurredClaimOs: 'Indemnity Incurred Claim OS',
        expenseClaimPaidAmount: 'Expense Claim Paid Amount',
        expenseClaimOsAmount: 'Expense Claim OS Amount',
        participantRiIndemnityRecoveryAmount: 'PARTICIPANT RI Indemnity Recovery Amount',
        participantRiExpenseRecoveryAmount: 'PARTICIPANT RI Expense Recovery Amount',
        statementType: 'Statement Type'
    };

    // Header fields to display in accordion header
    const headerFields = [
        'treatyCode',
        'brokerCode',
        'reinsurerCode',
        'feeCode',
        'riDate',
        'policyNumber',
        'endtNumber',
        'participantRiAmount'
    ];
    const accordionDetailFields = [
        'gcLoadDate',
        'transactionDate',
        'uniqueInternalId',
        'treatyCode',
        'brokerCode',
        'reinsurerCode',
        'feeCode',
        'riDate',
        'cessionType',
        'policyNumber',
        'endtNumber',
        'policyHolderName',
        'policyIssueDate',
        'policyStartDate',
        'policyEndDate',
        'endrStartDate',
        'sectionLob',
        'gwpAmountSection',
        'risiAmountSection',
        'participantRiAmount',
        'claimNumber',
        'claimantName',
        'claimLossDate',
        'claimReportingDate',
        'policyStatus',
        'claimStatus',
        'indemnityIncurredClaimAmount',
        'indemnityIncurredClaimPaid',
        'indemnityIncurredClaimOs',
        'expenseClaimPaidAmount',
        'expenseClaimOsAmount',
        'participantRiIndemnityRecoveryAmount',
        'participantRiExpenseRecoveryAmount',
        'statementType'
    ];

    const formatValue = (value: any) => {
        if (value === null || value === undefined) return '-';
        if (typeof value === 'number') {
            return new Intl.NumberFormat('en-IN').format(value);
        }
        if (typeof value === 'boolean') {
            return value ? 'Yes' : 'No';
        }
        return String(value);
    };

    const renderField = (label: string, value: any) => {
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
                        {formatValue(value)}
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
                    {successMessage && (
                        <Alert severity="success" sx={{ mt: 2, fontSize: '13px' }}>
                            {successMessage}
                        </Alert>
                    )}
                </CardContent>
            </Card>

            {/* Generated Preview Section */}
            {generatedData && generatedData.rows && (
                <Box sx={{ mb: 3 }}>
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
                            Generated Preview
                        </Typography>
                        <Chip
                            label={`${generatedData.count} records generated`}
                            sx={{
                                backgroundColor: '#fff3e0',
                                color: '#ef6c00',
                                fontWeight: 600,
                                fontSize: '12px'
                            }}
                        />
                    </Box>

                    <Card sx={{ borderRadius: '8px', boxShadow: 'none', border: '1px solid #dee2e6', overflow: 'hidden' }}>
                        <TableContainer component={Paper} elevation={0}>
                            <Table stickyHeader size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '11px', backgroundColor: '#f8f9fa', color: '#495057', textTransform: 'uppercase' }}>Treaty Code</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '11px', backgroundColor: '#f8f9fa', color: '#495057', textTransform: 'uppercase' }}>Broker Code</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '11px', backgroundColor: '#f8f9fa', color: '#495057', textTransform: 'uppercase' }}>Insurer / Reinsurer</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '11px', backgroundColor: '#f8f9fa', color: '#495057', textTransform: 'uppercase' }}>Section LOB</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '11px', backgroundColor: '#f8f9fa', color: '#495057', textTransform: 'uppercase' }}>Statement Number</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '11px', backgroundColor: '#f8f9fa', color: '#495057', textTransform: 'uppercase' }}>From Date</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '11px', backgroundColor: '#f8f9fa', color: '#495057', textTransform: 'uppercase' }}>To Date</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '11px', backgroundColor: '#f8f9fa', color: '#495057', textTransform: 'uppercase' }}>Statement Date</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '11px', backgroundColor: '#f8f9fa', color: '#495057', textTransform: 'uppercase' }}>Status</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '11px', backgroundColor: '#f8f9fa', color: '#495057', textTransform: 'uppercase' }}>Fee 9001</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '11px', backgroundColor: '#f8f9fa', color: '#495057', textTransform: 'uppercase' }}>Fee 9002</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '11px', backgroundColor: '#f8f9fa', color: '#495057', textTransform: 'uppercase' }}>Fee 9003</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '11px', backgroundColor: '#f8f9fa', color: '#495057', textTransform: 'uppercase' }}>Fee 1001</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '11px', backgroundColor: '#f8f9fa', color: '#495057', textTransform: 'uppercase' }}>Posted To Finance</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '11px', backgroundColor: '#f8f9fa', color: '#495057', textTransform: 'uppercase' }}>Report Generated</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {generatedData.rows.map((row, idx) => (
                                        <TableRow key={`generated-${idx}`} sx={{ '&:hover': { backgroundColor: '#f8fafc' } }}>
                                            <TableCell sx={{ fontSize: '12px' }}>{formatValue(row.treatyCode)}</TableCell>
                                            <TableCell sx={{ fontSize: '12px' }}>{formatValue(row.brokerCode)}</TableCell>
                                            <TableCell sx={{ fontSize: '12px' }}>{formatValue(row.reinsurerCode)}</TableCell>
                                            <TableCell sx={{ fontSize: '12px' }}>{formatValue(row.sectionLob)}</TableCell>
                                            <TableCell sx={{ fontSize: '12px' }}>{formatValue(row.bordeauxStatementNumber)}</TableCell>
                                            <TableCell sx={{ fontSize: '12px' }}>{formatValue(row.bordeauxFromDate)}</TableCell>
                                            <TableCell sx={{ fontSize: '12px' }}>{formatValue(row.bordeauxToDate)}</TableCell>
                                            <TableCell sx={{ fontSize: '12px' }}>{formatValue(row.bordeauxStatementDate)}</TableCell>
                                            <TableCell sx={{ fontSize: '12px' }}>{formatValue(row.statementStatus)}</TableCell>
                                            <TableCell sx={{ fontSize: '12px' }}>{formatValue(row.sumFee9001)}</TableCell>
                                            <TableCell sx={{ fontSize: '12px' }}>{formatValue(row.sumFee9002)}</TableCell>
                                            <TableCell sx={{ fontSize: '12px' }}>{formatValue(row.sumFee9003)}</TableCell>
                                            <TableCell sx={{ fontSize: '12px' }}>{formatValue(row.sumFee1001)}</TableCell>
                                            <TableCell sx={{ fontSize: '12px' }}>{formatValue(row.postedToFinance)}</TableCell>
                                            <TableCell sx={{ fontSize: '12px' }}>{formatValue(row.reportGenerated)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Card>

                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            variant="contained"
                            onClick={handleSubmitGenerated}
                            disabled={submitLoading || loading}
                            sx={{
                                backgroundColor: '#28a745',
                                color: '#fff',
                                fontWeight: 600,
                                textTransform: 'none',
                                minWidth: '130px',
                                '&:hover': { backgroundColor: '#218838' },
                                '&:disabled': { backgroundColor: '#e0e0e0', color: '#9e9e9e' }
                            }}
                        >
                            {submitLoading ? <CircularProgress size={18} sx={{ color: 'white' }} /> : 'Submit'}
                        </Button>
                    </Box>
                </Box>
            )}

            {/* Search Results Section */}
            {!generatedData && searchData && searchData.rows && (
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

                    <Card sx={{ borderRadius: '8px', boxShadow: 'none', border: '1px solid #dee2e6', overflow: 'hidden' }}>
                        <TableContainer component={Paper} elevation={0}>
                            <Table sx={{ tableLayout: 'fixed' }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ width: '6%', fontWeight: 600, fontSize: '11px', backgroundColor: '#f8f9fa', color: '#495057', py: 1.5, borderBottom: '1px solid #dee2e6' }} />
                                        <TableCell sx={{ width: '22%', fontWeight: 600, fontSize: '11px', backgroundColor: '#f8f9fa', color: '#495057', textTransform: 'uppercase', py: 1.5, borderBottom: '1px solid #dee2e6' }}>
                                            Treaty Code
                                        </TableCell>
                                        <TableCell sx={{ width: '9%', fontWeight: 600, fontSize: '11px', backgroundColor: '#f8f9fa', color: '#495057', textTransform: 'uppercase', py: 1.5, borderBottom: '1px solid #dee2e6' }}>
                                            Broker Code
                                        </TableCell>
                                        <TableCell sx={{ width: '10%', fontWeight: 600, fontSize: '11px', backgroundColor: '#f8f9fa', color: '#495057', textTransform: 'uppercase', py: 1.5, borderBottom: '1px solid #dee2e6' }}>
                                            Insurer / Reinsurer
                                        </TableCell>
                                        <TableCell sx={{ width: '8%', fontWeight: 600, fontSize: '11px', backgroundColor: '#f8f9fa', color: '#495057', textTransform: 'uppercase', py: 1.5, borderBottom: '1px solid #dee2e6' }}>
                                            Fee Code
                                        </TableCell>
                                        <TableCell sx={{ width: '10%', fontWeight: 600, fontSize: '11px', backgroundColor: '#f8f9fa', color: '#495057', textTransform: 'uppercase', py: 1.5, borderBottom: '1px solid #dee2e6' }}>
                                            RI Date
                                        </TableCell>
                                        <TableCell sx={{ width: '9%', fontWeight: 600, fontSize: '11px', backgroundColor: '#f8f9fa', color: '#495057', textTransform: 'uppercase', py: 1.5, borderBottom: '1px solid #dee2e6' }}>
                                            Policy Number
                                        </TableCell>
                                        <TableCell sx={{ width: '7%', fontWeight: 600, fontSize: '11px', backgroundColor: '#f8f9fa', color: '#495057', textTransform: 'uppercase', py: 1.5, borderBottom: '1px solid #dee2e6' }}>
                                            Endt Number
                                        </TableCell>
                                        <TableCell sx={{ width: '13%', fontWeight: 600, fontSize: '11px', backgroundColor: '#f8f9fa', color: '#495057', textTransform: 'uppercase', py: 1.5, borderBottom: '1px solid #dee2e6' }}>
                                            Participant RI Amount
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {searchData.rows.map((row, idx) => {
                                        const recordKey = `record-${row.id || idx}`;
                                        const isExpanded = expandedGroups[recordKey] || false;

                                        return (
                                            <React.Fragment key={recordKey}>
                                                <TableRow
                                                    onClick={() => toggleGroup(recordKey)}
                                                    sx={{
                                                        cursor: 'pointer',
                                                        '&:hover': { backgroundColor: '#f8fafc' },
                                                        borderBottom: '1px solid #e9ecef'
                                                    }}
                                                >
                                                    <TableCell sx={{ py: 1.25, textAlign: 'center' }}>
                                                        <IconButton size="small" sx={{ color: '#6c757d' }}>
                                                            {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                                        </IconButton>
                                                    </TableCell>
                                                    <TableCell sx={{ py: 1.25 }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                                            <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#28a745', mt: 0.7 }} />
                                                            <Box>
                                                                <Typography sx={{ fontSize: '12px', fontWeight: 700, color: '#2c3e50', lineHeight: 1.2 }}>
                                                                    {formatValue(row.treatyCode)}
                                                                </Typography>
                                                                <Typography sx={{ fontSize: '9px', color: '#6c757d', textTransform: 'uppercase', lineHeight: 1.2, mt: 0.3 }}>
                                                                    Participant RI Indemnity Recovery Amount
                                                                </Typography>
                                                                <Typography sx={{ fontSize: '10px', fontWeight: 600, color: '#2c3e50', lineHeight: 1.2 }}>
                                                                    {formatValue(row.participantRiIndemnityRecoveryAmount)}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell sx={{ fontSize: '12px', fontWeight: 600, color: '#2c3e50', py: 1.25 }}>
                                                        {formatValue(row.brokerCode)}
                                                    </TableCell>
                                                    <TableCell sx={{ fontSize: '12px', fontWeight: 600, color: '#2c3e50', py: 1.25 }}>
                                                        {formatValue(row.reinsurerCode)}
                                                    </TableCell>
                                                    <TableCell sx={{ fontSize: '12px', fontWeight: 600, color: '#2c3e50', py: 1.25 }}>
                                                        {formatValue(row.feeCode)}
                                                    </TableCell>
                                                    <TableCell sx={{ fontSize: '12px', fontWeight: 600, color: '#2c3e50', py: 1.25 }}>
                                                        {formatValue(row.riDate)}
                                                    </TableCell>
                                                    <TableCell sx={{ fontSize: '12px', fontWeight: 600, color: '#2c3e50', py: 1.25 }}>
                                                        {formatValue(row.policyNumber)}
                                                    </TableCell>
                                                    <TableCell sx={{ fontSize: '12px', fontWeight: 600, color: '#2c3e50', py: 1.25 }}>
                                                        {formatValue(row.endtNumber)}
                                                    </TableCell>
                                                    <TableCell sx={{ fontSize: '12px', fontWeight: 700, color: '#2c3e50', py: 1.25 }}>
                                                        {formatValue(row.participantRiAmount)}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell colSpan={9} sx={{ py: 0, borderBottom: isExpanded ? '1px solid #dee2e6' : 'none' }}>
                                                        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                                                            <Box sx={{ p: 2.5, backgroundColor: '#fafbfc' }}>
                                                                <Grid container spacing={2}>
                                                                    {accordionDetailFields.map((field) => {
                                                                        const label = fieldLabels[field] || field
                                                                            .replace(/([A-Z])/g, ' $1')
                                                                            .replace(/^./, str => str.toUpperCase())
                                                                            .trim();

                                                                        return renderField(label, row[field]);
                                                                    })}
                                                                </Grid>
                                                            </Box>
                                                        </Collapse>
                                                    </TableCell>
                                                </TableRow>
                                            </React.Fragment>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Card>
                </Box>
            )}
        </Box>
    );
}
