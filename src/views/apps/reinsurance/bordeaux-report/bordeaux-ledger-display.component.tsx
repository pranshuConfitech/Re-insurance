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
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
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

    const handleSearchLedger = async () => {
        // Validate that at least one search criteria is provided
        if (!fromDate && !toDate && !bordeauxStatementNumber.trim()) {
            setError('Please provide at least one search criteria: Date range or Bordeaux Statement Number');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const params: any = {};

            if (fromDate) params.fromDate = fromDate;
            if (toDate) params.toDate = toDate;
            if (bordeauxStatementNumber.trim()) params.bordeauxStatementNumber = bordeauxStatementNumber.trim();

            const result = await bordeauxService.searchLedger(params).toPromise();

            if (!result) {
                setError('No ledger records found for the selected criteria.');
                setLedgerData([]);
                return;
            }

            // Extract rows array from response
            const rows = result.rows || [];

            if (rows.length === 0) {
                setError('No ledger records found for the selected criteria.');
                setLedgerData([]);
                return;
            }

            setLedgerData(rows);
            setSuccessMessage(`Found ${rows.length} ledger record(s)`);
        } catch (err: any) {
            console.error('Search ledger error:', err);
            setLedgerData([]);
            setError(err?.response?.data?.message || err?.message || 'Failed to search ledger. Please try again.');
        } finally {
            setLoading(false);
        }
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

    // Extract column headers from the first data item, excluding ID fields and reordering for better display
    const getTableHeaders = () => {
        if (ledgerData.length === 0) return [];

        // Get all keys and filter out ID-related and technical fields
        const allKeys = Object.keys(ledgerData[0]);
        const excludedFields = [
            'id',
            'key',
            'referenceId',
            'rowCreatedDate',
            'rowLastUpdatedDate',
            'rowVersionNbr',
            'active',
            'rowCreatedBy',
            'rowLastUpdatedBy',
            'rowLastModProcName',
            'createdAt'
        ];

        // Define the preferred order for important columns
        const priorityColumns = [
            'referenceType',
            'referenceNo',
            'postingDate',
            'bordeauxStatementNumber',
            'treatyCode',
            'brokerCode',
            'reinsurerCode',
            'feeCode',
            'accountingCodeDesc',
            'debitAmount',
            'creditAmount',
            'stage'
        ];

        // Filter out excluded fields
        const availableKeys = allKeys.filter(key => !excludedFields.includes(key));

        // Sort keys: priority columns first (in order), then remaining columns
        const sortedKeys = [
            ...priorityColumns.filter(col => availableKeys.includes(col)),
            ...availableKeys.filter(col => !priorityColumns.includes(col))
        ];

        return sortedKeys;
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
                                onClick={handleSearchLedger}
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

            {/* Ledger Data Table */}
            {ledgerData.length > 0 && (
                <Card sx={{ mb: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderRadius: '8px' }}>
                    <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '15px', color: '#2c3e50' }}>
                                Ledger Records
                            </Typography>
                            <Chip
                                label={`${ledgerData.length} record(s) found`}
                                sx={{ backgroundColor: '#fce4ec', color: '#e91e63', fontWeight: 600 }}
                            />
                        </Box>

                        <TableContainer component={Paper} elevation={0} sx={{ maxHeight: 600 }}>
                            <Table size="small" stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        {getTableHeaders().map((header, index) => (
                                            <TableCell
                                                key={index}
                                                sx={{
                                                    fontWeight: 600,
                                                    fontSize: '11px',
                                                    backgroundColor: '#f8f9fa',
                                                    minWidth: 120,
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                {formatColumnHeader(header)}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {ledgerData.map((row, rowIndex) => (
                                        <TableRow key={rowIndex} hover>
                                            {getTableHeaders().map((header, colIndex) => {
                                                const value = row[header];
                                                const isDebitAmount = header === 'debitAmount';
                                                const isCreditAmount = header === 'creditAmount';

                                                return (
                                                    <TableCell
                                                        key={colIndex}
                                                        sx={{
                                                            fontSize: '12px',
                                                            fontWeight: (isDebitAmount || isCreditAmount) && value > 0 ? 600 : 400,
                                                            color: isDebitAmount && value > 0 ? '#d32f2f' :
                                                                isCreditAmount && value > 0 ? '#2e7d32' :
                                                                    'inherit',
                                                            backgroundColor: isDebitAmount && value > 0 ? '#ffebee' :
                                                                isCreditAmount && value > 0 ? '#e8f5e9' :
                                                                    'inherit'
                                                        }}
                                                    >
                                                        {formatValue(value)}
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>
            )}
        </Box>
    );
}
