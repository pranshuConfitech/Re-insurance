'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
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
    Chip,
    IconButton,
    Tooltip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ReceiptIcon from '@mui/icons-material/Receipt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { BordeauxService, type BordeauxReportHeader } from '@/services/remote-api/api/reinsurance-services/bordeaux.service';

const bordeauxService = new BordeauxService();

export default function BordeauxReportHeadersComponent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // Get current date in YYYY-MM-DD format
    const getCurrentDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    // Initialize state with current date as default
    const [fromDate, setFromDate] = useState(getCurrentDate());
    const [toDate, setToDate] = useState(getCurrentDate());
    const [treatyCode, setTreatyCode] = useState('');
    const [reportHeaders, setReportHeaders] = useState<BordeauxReportHeader[]>([]);
    const [loading, setLoading] = useState(false);
    const [invoiceLoading, setInvoiceLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // No auto-search - users will manually search with their own dates

    const handleSearchHeaders = async () => {
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const result = await bordeauxService.searchReportHeaders({
                fromDate,
                toDate,
                treatyCode: treatyCode.trim() || undefined
            }).toPromise();

            if (!result || result.length === 0) {
                setError('No report headers found for the selected criteria. Please confirm generated headers first.');
                setReportHeaders([]);
                return;
            }

            setReportHeaders(result);
            setSuccessMessage(`Found ${result.length} report headers`);
        } catch (err: any) {
            console.error('Search headers error:', err);
            setReportHeaders([]);
            setError(err?.response?.data?.message || err?.message || 'Failed to search report headers. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateInvoiceForRow = async (headerId: number) => {
        setInvoiceLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const result = await bordeauxService.generateInvoice({
                consolidatedIds: [headerId]
            }).toPromise();

            if (!result) {
                setError('Invoice generation completed but no response received');
                return;
            }

            // Add flag to indicate this is a newly generated invoice
            const invoiceDataWithFlag = { ...result, isNewlyGenerated: true };
            const invoiceData = encodeURIComponent(JSON.stringify(invoiceDataWithFlag));
            router.push(`/reinsurance/bordeaux-invoice-generation/invoice-details?data=${invoiceData}`);
        } catch (err: any) {
            console.error('Generate invoice error:', err);
            setError(err?.response?.data?.message || err?.message || 'Failed to generate invoice. Please try again.');
        } finally {
            setInvoiceLoading(false);
        }
    };

    const handleViewInvoiceForRow = async (headerId: number) => {
        setInvoiceLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const result = await bordeauxService.viewInvoiceByConsolidatedId(headerId).toPromise();

            if (!result) {
                setError('No invoice data found');
                return;
            }

            // Add flag to indicate this is an existing invoice (view mode)
            const invoiceDataWithFlag = { ...result, isNewlyGenerated: false };
            const invoiceData = encodeURIComponent(JSON.stringify(invoiceDataWithFlag));
            router.push(`/reinsurance/bordeaux-invoice-generation/invoice-details?data=${invoiceData}`);
        } catch (err: any) {
            console.error('View invoice error:', err);
            setError(err?.response?.data?.message || err?.message || 'Failed to view invoice. Please try again.');
        } finally {
            setInvoiceLoading(false);
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

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#2c3e50', mb: 3 }}>
                Bordeaux Report Headers & Invoices
            </Typography>

            {/* Search Report Headers Section */}
            <Card sx={{ mb: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderRadius: '8px' }}>
                <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                        <SearchIcon sx={{ color: '#1976d2', fontSize: 22 }} />
                        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '15px', color: '#2c3e50' }}>
                            Search Report Headers
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
                                label="Treaty Code"
                                value={treatyCode}
                                onChange={(e) => setTreatyCode(e.target.value)}
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
                                onClick={handleSearchHeaders}
                                disabled={loading}
                                startIcon={loading ? null : <SearchIcon />}
                                sx={{
                                    backgroundColor: '#e91e63',
                                    height: '42px',
                                    textTransform: 'none',
                                    '&:hover': { backgroundColor: '#c2185b' }
                                }}
                            >
                                {loading ? <CircularProgress size={18} sx={{ color: 'white' }} /> : 'Search Headers'}
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

            {/* Report Headers Table */}
            {reportHeaders.length > 0 && (
                <Card sx={{ mb: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderRadius: '8px' }}>
                    <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '15px', color: '#2c3e50' }}>
                                Report Headers
                            </Typography>
                            <Chip
                                label={`${reportHeaders.length} records found`}
                                sx={{ backgroundColor: '#e3f2fd', color: '#1976d2', fontWeight: 600 }}
                            />
                        </Box>

                        <TableContainer component={Paper} elevation={0} sx={{ maxHeight: 600 }}>
                            <Table size="small" stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '10px', backgroundColor: '#f8f9fa', minWidth: 100 }}>Section LOB</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '10px', backgroundColor: '#f8f9fa', minWidth: 200 }}>Bordeaux Statement Number</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '10px', backgroundColor: '#f8f9fa', minWidth: 120 }}>Bordeaux Statement Date</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '10px', backgroundColor: '#f8f9fa', minWidth: 120 }}>Statement Status</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '10px', backgroundColor: '#28a745', color: '#fff', minWidth: 100 }}>TREATY CODE</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '10px', backgroundColor: '#28a745', color: '#fff', minWidth: 100 }}>BROKER CODE</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '10px', backgroundColor: '#17a2b8', color: '#fff', minWidth: 120 }}>REINSURER CODE</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '10px', backgroundColor: '#f8f9fa', minWidth: 150 }}>sum(participant RI amount) for 9001</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '10px', backgroundColor: '#f8f9fa', minWidth: 150 }}>sum(participant RI amount) for 9002</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '10px', backgroundColor: '#f8f9fa', minWidth: 150 }}>sum(participant RI amount) for 9003</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '10px', backgroundColor: '#f8f9fa', minWidth: 150 }}>sum(participant RI amount) for 1001</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '10px', backgroundColor: '#ffc107', color: '#000', minWidth: 150, position: 'sticky', right: 0, zIndex: 1 }}>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {reportHeaders.map((header) => (
                                        <TableRow key={header.id} hover>
                                            <TableCell sx={{ fontSize: '11px' }}>{formatValue(header.sectionLob)}</TableCell>
                                            <TableCell sx={{ fontSize: '11px' }}>{formatValue(header.bordeauxStatementNumber)}</TableCell>
                                            <TableCell sx={{ fontSize: '11px' }}>{formatValue(header.bordeauxStatementDate)}</TableCell>
                                            <TableCell sx={{ fontSize: '11px' }}>{formatValue(header.statementStatus)}</TableCell>
                                            <TableCell sx={{ fontSize: '11px', backgroundColor: '#d4edda' }}>{formatValue(header.treatyCode)}</TableCell>
                                            <TableCell sx={{ fontSize: '11px', backgroundColor: '#d4edda' }}>{formatValue(header.brokerCode)}</TableCell>
                                            <TableCell sx={{ fontSize: '11px', backgroundColor: '#d1ecf1' }}>{formatValue(header.reinsurerCode)}</TableCell>
                                            <TableCell sx={{ fontSize: '11px' }}>{formatValue(header.sumFee9001)}</TableCell>
                                            <TableCell sx={{ fontSize: '11px' }}>{formatValue(header.sumFee9002)}</TableCell>
                                            <TableCell sx={{ fontSize: '11px' }}>{formatValue(header.sumFee9003)}</TableCell>
                                            <TableCell sx={{ fontSize: '11px' }}>{formatValue(header.sumFee1001)}</TableCell>
                                            <TableCell sx={{ fontSize: '11px', position: 'sticky', right: 0, backgroundColor: '#fff', zIndex: 1 }}>
                                                <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                                                    {/* View Invoice Icon - Always visible */}
                                                    <Tooltip title={header.postedToFinance === 'Yes' ? 'View Invoice' : 'No invoice generated yet'}>
                                                        <span>
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleViewInvoiceForRow(header.id)}
                                                                disabled={header.postedToFinance !== 'Yes' || invoiceLoading}
                                                                sx={{
                                                                    color: header.postedToFinance === 'Yes' ? '#17a2b8' : '#ccc',
                                                                    '&:hover': {
                                                                        backgroundColor: header.postedToFinance === 'Yes' ? 'rgba(23, 162, 184, 0.1)' : 'transparent'
                                                                    },
                                                                    '&.Mui-disabled': {
                                                                        color: '#ccc'
                                                                    }
                                                                }}
                                                            >
                                                                <VisibilityIcon fontSize="small" />
                                                            </IconButton>
                                                        </span>
                                                    </Tooltip>

                                                    {/* Generate Invoice Icon - Always visible */}
                                                    <Tooltip title={header.postedToFinance === 'Yes' ? 'Invoice already generated' : 'Generate Invoice'}>
                                                        <span>
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleGenerateInvoiceForRow(header.id)}
                                                                disabled={header.postedToFinance === 'Yes' || invoiceLoading}
                                                                sx={{
                                                                    color: header.postedToFinance === 'No' ? '#28a745' : '#ccc',
                                                                    '&:hover': {
                                                                        backgroundColor: header.postedToFinance === 'No' ? 'rgba(40, 167, 69, 0.1)' : 'transparent'
                                                                    },
                                                                    '&.Mui-disabled': {
                                                                        color: '#ccc'
                                                                    }
                                                                }}
                                                            >
                                                                <ReceiptIcon fontSize="small" />
                                                            </IconButton>
                                                        </span>
                                                    </Tooltip>
                                                </Box>
                                            </TableCell>
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
