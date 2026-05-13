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
    CircularProgress,
    Alert,
    Paper,
    Pagination,
    Stack,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Chip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { BordeauxService } from '@/services/remote-api/api/reinsurance-services/bordeaux.service';

const bordeauxService = new BordeauxService();

export default function BordeauxLedgerDisplayComponent() {
    // Get current date in YYYY-MM-DD format
    const getCurrentDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    const [fromDate, setFromDate] = useState(getCurrentDate());
    const [toDate, setToDate] = useState(getCurrentDate());
    const [bordeauxStatementNumber, setBordeauxStatementNumber] = useState('');
    const [ledgerData, setLedgerData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Pagination state
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [hasNext, setHasNext] = useState(false);
    const [hasPrevious, setHasPrevious] = useState(false);
    const [expandedRow, setExpandedRow] = useState<number | null>(null);

    const handleSearchLedger = async (pageNumber: number = 0) => {
        // Validate that at least one search criteria is provided
        if (!fromDate && !toDate && !bordeauxStatementNumber.trim()) {
            setError('Please provide at least one search criteria: Date range or Bordeaux Statement Number');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const params: any = {
                page: pageNumber,
                size: pageSize
            };

            if (fromDate) params.fromDate = fromDate;
            if (toDate) params.toDate = toDate;
            if (bordeauxStatementNumber.trim()) params.bordeauxStatementNumber = bordeauxStatementNumber.trim();

            const result = await bordeauxService.searchLedger(params).toPromise();

            if (!result) {
                setError('No ledger records found for the selected criteria.');
                setLedgerData([]);
                setTotalPages(0);
                setTotalElements(0);
                setHasNext(false);
                setHasPrevious(false);
                return;
            }

            // Extract rows array and pagination info from response
            const rows = result.rows || [];
            const pageInfo = result.pageInfo || {};

            if (rows.length === 0) {
                setError('No ledger records found for the selected criteria.');
                setLedgerData([]);
                setTotalPages(0);
                setTotalElements(0);
                setHasNext(false);
                setHasPrevious(false);
                return;
            }

            setLedgerData(rows);
            setPage(pageInfo.page || 0);
            setTotalPages(pageInfo.totalPages || 0);
            setTotalElements(pageInfo.totalElements || 0);
            setHasNext(pageInfo.hasNext || false);
            setHasPrevious(pageInfo.hasPrevious || false);
            setSuccessMessage(null); // Don't show success message
        } catch (err: any) {
            console.error('Search ledger error:', err);
            setLedgerData([]);
            setTotalPages(0);
            setTotalElements(0);
            setHasNext(false);
            setHasPrevious(false);
            setError(err?.response?.data?.message || err?.message || 'Failed to search ledger. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        // MUI Pagination is 1-indexed, but API is 0-indexed
        handleSearchLedger(value - 1);
    };

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

    // Format column header for display
    const formatColumnHeader = (header: string) => {
        // Convert camelCase to Title Case with spaces
        return header
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, (str) => str.toUpperCase())
            .trim();
    };

    const handleAccordionToggle = (rowKey: number) => {
        setExpandedRow(expandedRow === rowKey ? null : rowKey);
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#2c3e50', mb: 3 }}>
                Ledger Display
            </Typography>

            {/* Search Section */}
            <Card sx={{ mb: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderRadius: '8px' }}>
                <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                        <AccountBalanceIcon sx={{ color: '#e91e63', fontSize: 22 }} />
                        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '15px', color: '#2c3e50' }}>
                            Search Ledger
                        </Typography>
                    </Box>

                    <Grid container spacing={2.5} alignItems="flex-end">
                        <Grid item xs={12} sm={6} md={3}>
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
                                        height: '42px'
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
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
                                        height: '42px'
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                fullWidth
                                label="Bordeaux Statement Number"
                                value={bordeauxStatementNumber}
                                onChange={(e) => setBordeauxStatementNumber(e.target.value)}
                                placeholder="Optional"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        fontSize: '14px',
                                        height: '42px'
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Button
                                fullWidth
                                variant="contained"
                                onClick={() => handleSearchLedger(0)}
                                disabled={loading}
                                startIcon={loading ? null : <SearchIcon />}
                                sx={{
                                    backgroundColor: '#e91e63',
                                    height: '42px',
                                    textTransform: 'none',
                                    '&:hover': { backgroundColor: '#c2185b' }
                                }}
                            >
                                {loading ? <CircularProgress size={18} sx={{ color: 'white' }} /> : 'Search Ledger'}
                            </Button>
                        </Grid>
                    </Grid>

                    <Typography variant="caption" sx={{ display: 'block', mt: 2, color: '#64748b', fontSize: '12px' }}>
                        * You can search by date range, bordeaux statement number, or both
                    </Typography>

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

            {/* Ledger Data Accordion */}
            {ledgerData.length > 0 && (
                <Card sx={{ mb: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderRadius: '8px' }}>
                    <CardContent sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '15px', color: '#2c3e50', mb: 2 }}>
                            Ledger Records
                        </Typography>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            {ledgerData.map((row, rowIndex) => (
                                <Accordion
                                    key={row.key || rowIndex}
                                    expanded={expandedRow === (row.key || rowIndex)}
                                    onChange={() => handleAccordionToggle(row.key || rowIndex)}
                                    sx={{
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                        '&:before': { display: 'none' },
                                        borderRadius: '6px !important',
                                        overflow: 'hidden'
                                    }}
                                >
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        sx={{
                                            backgroundColor: '#f8f9fa',
                                            minHeight: '56px',
                                            '&:hover': { backgroundColor: '#e9ecef' },
                                            '& .MuiAccordionSummary-content': {
                                                margin: '12px 0',
                                                alignItems: 'center'
                                            }
                                        }}
                                    >
                                        <Grid container spacing={1.5} alignItems="center">
                                            <Grid item xs={6} sm={3} md={1.5}>
                                                <Typography variant="caption" sx={{ color: '#6c757d', fontSize: '10px', display: 'block' }}>
                                                    Finance Posting Date
                                                </Typography>
                                                <Typography variant="body2" sx={{ fontSize: '12px', fontWeight: 500 }}>
                                                    {formatValue(row.financePostingDate)}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6} sm={3} md={1.5}>
                                                <Typography variant="caption" sx={{ color: '#6c757d', fontSize: '10px', display: 'block' }}>
                                                    Reinsurer Code
                                                </Typography>
                                                <Chip
                                                    label={formatValue(row.reinsurerCode)}
                                                    size="small"
                                                    sx={{ backgroundColor: '#d1ecf1', color: '#0c5460', fontSize: '11px', height: '22px', minWidth: '50px' }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={3}>
                                                <Typography variant="caption" sx={{ color: '#6c757d', fontSize: '10px', display: 'block' }}>
                                                    Accounting Code Desc
                                                </Typography>
                                                <Typography variant="body2" sx={{ fontSize: '12px', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {formatValue(row.accountingCodeDesc)}
                                                </Typography>
                                            </Grid>

                                            {/* Dynamic Fee Codes Display */}
                                            {row.fees && Array.isArray(row.fees) && row.fees.length > 0 ? (
                                                row.fees.map((fee: any, feeIndex: number) => (
                                                    <Grid item xs={6} sm={3} md={2} key={feeIndex}>
                                                        <Typography variant="caption" sx={{ color: '#6c757d', fontSize: '10px', display: 'block' }}>
                                                            Fee {fee.feeCode}
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ fontSize: '12px', fontWeight: 500 }}>
                                                            {formatValue(fee.feeAmount)}
                                                        </Typography>
                                                    </Grid>
                                                ))
                                            ) : (
                                                <>
                                                    <Grid item xs={6} sm={3} md={2}>
                                                        <Typography variant="caption" sx={{ color: '#6c757d', fontSize: '10px', display: 'block' }}>
                                                            Fee Code
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ fontSize: '12px', fontWeight: 500 }}>
                                                            {formatValue(row.feeCode)}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={6} sm={3} md={1.5}>
                                                        <Typography variant="caption" sx={{ color: '#6c757d', fontSize: '10px', display: 'block' }}>
                                                            Debit Amount
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ fontSize: '12px', fontWeight: 500 }}>
                                                            {formatValue(row.debitAmount)}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={6} sm={3} md={1.5}>
                                                        <Typography variant="caption" sx={{ color: '#6c757d', fontSize: '10px', display: 'block' }}>
                                                            Credit Amount
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ fontSize: '12px', fontWeight: 500 }}>
                                                            {formatValue(row.creditAmount)}
                                                        </Typography>
                                                    </Grid>
                                                </>
                                            )}
                                        </Grid>
                                    </AccordionSummary>
                                    <AccordionDetails sx={{ backgroundColor: '#fff', p: 2.5 }}>
                                        <Grid container spacing={3}>
                                            {/* Reference and Statement Information */}
                                            <Grid item xs={12}>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: '#2c3e50', fontSize: '13px' }}>
                                                    Reference & Statement Details
                                                </Typography>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12} sm={4}>
                                                        <Box>
                                                            <Typography variant="caption" sx={{ color: '#6c757d', fontSize: '10px', display: 'block', mb: 0.5 }}>
                                                                Reference No
                                                            </Typography>
                                                            <Typography variant="body1" sx={{ fontSize: '14px', fontWeight: 500, color: '#2c3e50' }}>
                                                                {formatValue(row.referenceNo)}
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={12} sm={8}>
                                                        <Box>
                                                            <Typography variant="caption" sx={{ color: '#6c757d', fontSize: '10px', display: 'block', mb: 0.5 }}>
                                                                Bordeaux Statement Number
                                                            </Typography>
                                                            <Typography variant="body1" sx={{ fontSize: '14px', fontWeight: 500, color: '#2c3e50' }}>
                                                                {formatValue(row.bordeauxStatementNumber)}
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                            </Grid>

                                            {/* Treaty and Broker Information */}
                                            <Grid item xs={12}>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: '#2c3e50', fontSize: '13px' }}>
                                                    Treaty & Broker Details
                                                </Typography>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12} sm={6}>
                                                        <Box>
                                                            <Typography variant="caption" sx={{ color: '#6c757d', fontSize: '10px', display: 'block', mb: 0.5 }}>
                                                                Treaty Code
                                                            </Typography>
                                                            <Chip
                                                                label={formatValue(row.treatyCode)}
                                                                size="small"
                                                                sx={{ backgroundColor: '#d4edda', color: '#155724', fontSize: '12px', height: '24px' }}
                                                            />
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={12} sm={6}>
                                                        <Box>
                                                            <Typography variant="caption" sx={{ color: '#6c757d', fontSize: '10px', display: 'block', mb: 0.5 }}>
                                                                Broker Code
                                                            </Typography>
                                                            <Chip
                                                                label={formatValue(row.brokerCode)}
                                                                size="small"
                                                                sx={{ backgroundColor: '#d4edda', color: '#155724', fontSize: '12px', height: '24px' }}
                                                            />
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </AccordionDetails>
                                </Accordion>
                            ))}
                        </Box>

                        {/* Pagination Controls */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3, flexWrap: 'wrap', gap: 2 }}>
                            <Typography variant="body2" sx={{ color: '#64748b', fontSize: '13px' }}>
                                Showing {page * pageSize + 1} - {Math.min((page + 1) * pageSize, totalElements)} of {totalElements}
                            </Typography>

                            {totalPages > 1 && (
                                <Stack spacing={2}>
                                    <Pagination
                                        count={totalPages}
                                        page={page + 1}
                                        onChange={handlePageChange}
                                        color="primary"
                                        disabled={loading}
                                        showFirstButton
                                        showLastButton
                                        sx={{
                                            '& .MuiPaginationItem-root': {
                                                fontSize: '13px'
                                            }
                                        }}
                                    />
                                </Stack>
                            )}
                        </Box>
                    </CardContent>
                </Card>
            )}
        </Box>
    );
}
