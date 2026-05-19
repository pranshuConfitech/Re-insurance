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
    Tooltip,
    Collapse,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ReceiptIcon from '@mui/icons-material/Receipt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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
    const [expandedRow, setExpandedRow] = useState<number | null>(null);

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
            setSuccessMessage(null); // Don't show success message
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

            // Store invoice data in sessionStorage for cleaner URL
            const invoiceDataWithFlag = { ...result, isNewlyGenerated: true };
            sessionStorage.setItem('bordeauxInvoiceData', JSON.stringify(invoiceDataWithFlag));

            // Navigate with clean URL
            router.push(`/reinsurance/bordeaux-invoice-generation/invoice-details`);
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

            // Store invoice data in sessionStorage for cleaner URL
            const invoiceDataWithFlag = { ...result, isNewlyGenerated: false };
            sessionStorage.setItem('bordeauxInvoiceData', JSON.stringify(invoiceDataWithFlag));

            // Navigate with clean URL
            router.push(`/reinsurance/bordeaux-invoice-generation/invoice-details`);
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

    const handleAccordionToggle = (headerId: number) => {
        setExpandedRow(expandedRow === headerId ? null : headerId);
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

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            {reportHeaders.map((header) => (
                                <Accordion
                                    key={header.id}
                                    expanded={expandedRow === header.id}
                                    onChange={() => handleAccordionToggle(header.id)}
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
                                        <Grid container spacing={2} alignItems="center">
                                            <Grid item xs={12} sm={6} md={2}>
                                                <Typography variant="caption" sx={{ color: '#6c757d', fontSize: '10px', display: 'block' }}>
                                                    Section LOB
                                                </Typography>
                                                <Typography variant="body2" sx={{ fontSize: '12px', fontWeight: 500 }}>
                                                    {formatValue(header.sectionLob)}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={3}>
                                                <Typography variant="caption" sx={{ color: '#6c757d', fontSize: '10px', display: 'block' }}>
                                                    Bordeaux Statement Number
                                                </Typography>
                                                <Typography variant="body2" sx={{ fontSize: '12px', fontWeight: 500 }}>
                                                    {formatValue(header.bordeauxStatementNumber)}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={2}>
                                                <Typography variant="caption" sx={{ color: '#6c757d', fontSize: '10px', display: 'block' }}>
                                                    Statement Date
                                                </Typography>
                                                <Typography variant="body2" sx={{ fontSize: '12px', fontWeight: 500 }}>
                                                    {formatValue(header.bordeauxStatementDate)}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={1.5}>
                                                <Typography variant="caption" sx={{ color: '#6c757d', fontSize: '10px', display: 'block' }}>
                                                    Status
                                                </Typography>
                                                <Typography variant="body2" sx={{ fontSize: '12px', fontWeight: 500 }}>
                                                    {formatValue(header.statementStatus)}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={1}>
                                                <Typography variant="caption" sx={{ color: '#6c757d', fontSize: '10px', display: 'block' }}>
                                                    Treaty
                                                </Typography>
                                                <Chip
                                                    label={formatValue(header.treatyCode)}
                                                    size="small"
                                                    sx={{ backgroundColor: '#d4edda', color: '#155724', fontSize: '11px', height: '22px' }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={1}>
                                                <Typography variant="caption" sx={{ color: '#6c757d', fontSize: '10px', display: 'block' }}>
                                                    Broker
                                                </Typography>
                                                <Chip
                                                    label={formatValue(header.brokerCode)}
                                                    size="small"
                                                    sx={{ backgroundColor: '#d4edda', color: '#155724', fontSize: '11px', height: '22px' }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={1.5}>
                                                <Typography variant="caption" sx={{ color: '#6c757d', fontSize: '10px', display: 'block' }}>
                                                    Reinsurer
                                                </Typography>
                                                <Chip
                                                    label={formatValue(header.reinsurerCode)}
                                                    size="small"
                                                    sx={{ backgroundColor: '#d1ecf1', color: '#0c5460', fontSize: '11px', height: '22px' }}
                                                />
                                            </Grid>
                                        </Grid>
                                    </AccordionSummary>
                                    <AccordionDetails sx={{ backgroundColor: '#fff', p: 3 }}>
                                        <Grid container spacing={3}>
                                            {/* Sum Fields - Dynamic Fees */}
                                            <Grid item xs={12}>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#2c3e50' }}>
                                                    Participant RI Amount Summary
                                                </Typography>
                                                <Grid container spacing={2}>
                                                    {header.fees && Array.isArray(header.fees) && header.fees.length > 0 ? (
                                                        header.fees.map((fee: any, index: number) => {
                                                            // Define color schemes for different fee types
                                                            const colorSchemes = [
                                                                { bg: '#f0f9ff', border: '#bae6fd', textLight: '#0369a1', textDark: '#0c4a6e' },
                                                                { bg: '#f0fdf4', border: '#bbf7d0', textLight: '#15803d', textDark: '#14532d' },
                                                                { bg: '#fef3c7', border: '#fde68a', textLight: '#92400e', textDark: '#78350f' },
                                                                { bg: '#fce7f3', border: '#fbcfe8', textLight: '#9f1239', textDark: '#881337' },
                                                                { bg: '#ede9fe', border: '#ddd6fe', textLight: '#6b21a8', textDark: '#581c87' },
                                                                { bg: '#fef2f2', border: '#fecaca', textLight: '#b91c1c', textDark: '#7f1d1d' }
                                                            ];
                                                            const colorScheme = colorSchemes[index % colorSchemes.length];

                                                            return (
                                                                <Grid item xs={12} sm={6} md={3} key={index}>
                                                                    <Paper sx={{ p: 2, backgroundColor: colorScheme.bg, border: `1px solid ${colorScheme.border}` }}>
                                                                        <Typography variant="caption" sx={{ color: colorScheme.textLight, fontSize: '11px', display: 'block', mb: 0.5 }}>
                                                                            Sum for {fee.feeCode}
                                                                        </Typography>
                                                                        <Typography variant="h6" sx={{ fontSize: '16px', fontWeight: 600, color: colorScheme.textDark }}>
                                                                            {formatValue(fee.feeAmount)}
                                                                        </Typography>
                                                                    </Paper>
                                                                </Grid>
                                                            );
                                                        })
                                                    ) : (
                                                        <Grid item xs={12}>
                                                            <Typography variant="body2" sx={{ color: '#9e9e9e', fontSize: '13px', fontStyle: 'italic' }}>
                                                                No fee data available
                                                            </Typography>
                                                        </Grid>
                                                    )}
                                                </Grid>
                                            </Grid>

                                            {/* Actions */}
                                            <Grid item xs={12}>
                                                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', pt: 2, borderTop: '1px solid #e9ecef' }}>
                                                    <Tooltip title={header.postedToFinance === 'Yes' ? 'View Invoice' : 'No invoice generated yet'}>
                                                        <span>
                                                            <Button
                                                                variant="outlined"
                                                                size="small"
                                                                startIcon={<VisibilityIcon />}
                                                                onClick={() => handleViewInvoiceForRow(header.id)}
                                                                disabled={header.postedToFinance !== 'Yes' || invoiceLoading}
                                                                sx={{
                                                                    color: header.postedToFinance === 'Yes' ? '#17a2b8' : '#ccc',
                                                                    borderColor: header.postedToFinance === 'Yes' ? '#17a2b8' : '#ccc',
                                                                    textTransform: 'none',
                                                                    '&:hover': {
                                                                        backgroundColor: header.postedToFinance === 'Yes' ? 'rgba(23, 162, 184, 0.1)' : 'transparent',
                                                                        borderColor: header.postedToFinance === 'Yes' ? '#17a2b8' : '#ccc'
                                                                    },
                                                                    '&.Mui-disabled': {
                                                                        color: '#ccc',
                                                                        borderColor: '#ccc'
                                                                    }
                                                                }}
                                                            >
                                                                View Invoice
                                                            </Button>
                                                        </span>
                                                    </Tooltip>

                                                    <Tooltip title={header.postedToFinance === 'Yes' ? 'Invoice already generated' : 'Generate Invoice'}>
                                                        <span>
                                                            <Button
                                                                variant="contained"
                                                                size="small"
                                                                startIcon={<ReceiptIcon />}
                                                                onClick={() => handleGenerateInvoiceForRow(header.id)}
                                                                disabled={header.postedToFinance === 'Yes' || invoiceLoading}
                                                                sx={{
                                                                    backgroundColor: header.postedToFinance !== 'Yes' ? '#e91e63' : '#d0d0d0',
                                                                    color: '#fff',
                                                                    textTransform: 'none',
                                                                    '&:hover': {
                                                                        backgroundColor: header.postedToFinance !== 'Yes' ? '#c2185b' : '#d0d0d0'
                                                                    },
                                                                    '&.Mui-disabled': {
                                                                        backgroundColor: '#d0d0d0',
                                                                        color: '#fff'
                                                                    }
                                                                }}
                                                            >
                                                                Generate Invoice
                                                            </Button>
                                                        </span>
                                                    </Tooltip>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </AccordionDetails>
                                </Accordion>
                            ))}
                        </Box>
                    </CardContent>
                </Card>
            )}
        </Box>
    );
}
