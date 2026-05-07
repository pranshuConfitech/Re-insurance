'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Button,
    Grid,
    Divider,
    Stack,
    IconButton,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    CircularProgress
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import NumbersIcon from '@mui/icons-material/Numbers';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AddIcon from '@mui/icons-material/Add';
import { BordeauxService, type BordeauxFinanceSettlementJournal } from '@/services/remote-api/api/reinsurance-services/bordeaux.service';

const bordeauxService = new BordeauxService();

interface InvoiceItem {
    invoiceTotal: number;
    financeSettlementJournalId: number;
    invoiceDate: string;
    invoiceId: number;
    rowCount: number;
    feeCode: number;
    invoiceNumber: string;
}

interface InvoiceDetails {
    postedToFinance: string;
    invoices: InvoiceItem[];
    financePostingDate: string;
    consolidatedIds: number[];
    invoiceCreated: boolean;
    isNewlyGenerated?: boolean; // Flag to distinguish between new and existing invoices
}

export default function BordeauxInvoiceDetailsComponent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [invoiceData, setInvoiceData] = useState<InvoiceDetails | null>(null);
    const [openJournalDialog, setOpenJournalDialog] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<InvoiceItem | null>(null);
    const [journalLoading, setJournalLoading] = useState(false);
    const [journalFormData, setJournalFormData] = useState({
        financeSettlementJournal: '',
        financePaidDate: '',
        financePaidAmount: '' as string | number,
        financeOutstandingAmount: '' as string | number,
        call: ''
    });

    useEffect(() => {
        // Get invoice data from URL parameters
        const data = searchParams.get('data');
        if (data) {
            try {
                const parsedData = JSON.parse(decodeURIComponent(data));
                setInvoiceData(parsedData);
            } catch (error) {
                console.error('Error parsing invoice data:', error);
            }
        }
    }, [searchParams]);

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

    const handleBack = () => {
        router.back();
    };

    const handleOpenJournalDialog = (invoice: InvoiceItem) => {
        setSelectedInvoice(invoice);
        setJournalFormData({
            financeSettlementJournal: '',
            financePaidDate: invoice.invoiceDate,
            financePaidAmount: invoice.invoiceTotal,
            financeOutstandingAmount: '',
            call: ''
        });
        setOpenJournalDialog(true);
    };

    const handleCloseJournalDialog = () => {
        setOpenJournalDialog(false);
        setSelectedInvoice(null);
        setJournalFormData({
            financeSettlementJournal: '',
            financePaidDate: '',
            financePaidAmount: '',
            financeOutstandingAmount: '',
            call: ''
        });
    };

    const handleAddJournal = async () => {
        if (!selectedInvoice) return;

        setJournalLoading(true);
        try {
            const payload: BordeauxFinanceSettlementJournal = {
                invoiceId: selectedInvoice.invoiceId,
                financeSettlementJournal: journalFormData.financeSettlementJournal,
                financePaidDate: journalFormData.financePaidDate,
                financePaidAmount: Number(journalFormData.financePaidAmount) || 0,
                financeOutstandingAmount: Number(journalFormData.financeOutstandingAmount) || 0,
                call: journalFormData.call
            };

            await bordeauxService.pushToFinanceSettlementJournal(payload).toPromise();

            // Show success toast
            toast.success('Journal added successfully!');
            handleCloseJournalDialog();
        } catch (error: any) {
            console.error('Error adding journal:', error);
            toast.error(error?.response?.data?.message || error?.message || 'Failed to add journal');
        } finally {
            setJournalLoading(false);
        }
    };

    if (!invoiceData) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography>Loading invoice details...</Typography>
            </Box>
        );
    }

    const totalAmount = invoiceData.invoices.reduce((sum, invoice) => sum + invoice.invoiceTotal, 0);
    const totalRowCount = invoiceData.invoices.reduce((sum, invoice) => sum + invoice.rowCount, 0);

    return (
        <Box sx={{ p: 3, backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={handleBack}
                    sx={{
                        textTransform: 'none',
                        borderColor: '#64748b',
                        color: '#64748b',
                        '&:hover': {
                            borderColor: '#475569',
                            backgroundColor: '#f1f5f9'
                        }
                    }}
                >
                    Back
                </Button>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', flex: 1 }}>
                    Invoice Details
                </Typography>
            </Box>

            {/* Invoice Summary Banner */}
            <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #e91e63 0%, #c2185b 100%)', boxShadow: '0 4px 12px rgba(233, 30, 99, 0.3)', borderRadius: '12px' }}>
                <CardContent sx={{ p: 2.5 }}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <ReceiptLongIcon sx={{ fontSize: 40, color: '#fff' }} />
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.9)', fontSize: '11px', textTransform: 'uppercase', fontWeight: 600 }}>
                                Total Invoices Generated
                            </Typography>
                            <Typography variant="h5" sx={{ fontWeight: 700, color: '#fff', mt: 0.5 }}>
                                {invoiceData.invoices.length} Invoice(s)
                            </Typography>
                        </Box>
                        {invoiceData.invoiceCreated && invoiceData.isNewlyGenerated && (
                            <Chip
                                icon={<CheckCircleIcon />}
                                label="Invoice Created Successfully"
                                sx={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.25)',
                                    color: '#fff',
                                    fontWeight: 600,
                                    fontSize: '12px',
                                    px: 2,
                                    py: 2,
                                    border: '1px solid rgba(255, 255, 255, 0.5)',
                                    '& .MuiChip-icon': {
                                        color: '#fff'
                                    }
                                }}
                            />
                        )}
                    </Stack>
                </CardContent>
            </Card>

            <Grid container spacing={3}>
                {/* Left Column - Invoice Details */}
                <Grid item xs={12} md={8}>
                    {/* Summary Cards */}
                    <Card sx={{ mb: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderRadius: '12px' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                                <NumbersIcon sx={{ color: '#3b82f6', fontSize: 22 }} />
                                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '16px', color: '#1e293b' }}>
                                    Invoice Summary
                                </Typography>
                            </Box>

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ p: 2.5, backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                        <Stack direction="row" alignItems="center" spacing={1.5}>
                                            <Box sx={{ p: 1, backgroundColor: '#dbeafe', borderRadius: '8px' }}>
                                                <CalendarTodayIcon sx={{ color: '#3b82f6', fontSize: 20 }} />
                                            </Box>
                                            <Box>
                                                <Typography variant="caption" sx={{ color: '#64748b', fontSize: '11px', textTransform: 'uppercase', fontWeight: 600, display: 'block' }}>
                                                    Invoice Date
                                                </Typography>
                                                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mt: 0.5 }}>
                                                    {invoiceData.invoices[0]?.invoiceDate || '-'}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ p: 2.5, backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                        <Stack direction="row" alignItems="center" spacing={1.5}>
                                            <Box sx={{ p: 1, backgroundColor: '#dbeafe', borderRadius: '8px' }}>
                                                <ReceiptLongIcon sx={{ color: '#3b82f6', fontSize: 20 }} />
                                            </Box>
                                            <Box>
                                                <Typography variant="caption" sx={{ color: '#64748b', fontSize: '11px', textTransform: 'uppercase', fontWeight: 600, display: 'block' }}>
                                                    Total Row Count
                                                </Typography>
                                                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mt: 0.5 }}>
                                                    {totalRowCount}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    {/* Invoices Table */}
                    <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderRadius: '12px' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                                <AttachMoneyIcon sx={{ color: '#3b82f6', fontSize: 22 }} />
                                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '16px', color: '#1e293b' }}>
                                    Invoice Breakdown by Fee Code
                                </Typography>
                            </Box>

                            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                                            <TableCell sx={{ fontWeight: 700, fontSize: '12px', color: '#475569', py: 2 }}>Invoice Number</TableCell>
                                            <TableCell sx={{ fontWeight: 700, fontSize: '12px', color: '#475569', py: 2 }}>Fee Code</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 700, fontSize: '12px', color: '#475569', py: 2 }}>Amount (₹)</TableCell>
                                            <TableCell align="center" sx={{ fontWeight: 700, fontSize: '12px', color: '#475569', py: 2 }}>Row Count</TableCell>
                                            {invoiceData.isNewlyGenerated && (
                                                <TableCell align="center" sx={{ fontWeight: 700, fontSize: '12px', color: '#475569', py: 2 }}>Action</TableCell>
                                            )}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {invoiceData.invoices.map((invoice, index) => (
                                            <TableRow key={index} hover sx={{ '&:hover': { backgroundColor: '#f8fafc' } }}>
                                                <TableCell sx={{ fontSize: '12px', fontWeight: 600, py: 2, color: '#1e293b' }}>
                                                    {invoice.invoiceNumber}
                                                </TableCell>
                                                <TableCell sx={{ fontSize: '13px', py: 2 }}>
                                                    <Chip
                                                        label={invoice.feeCode}
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: '#dbeafe',
                                                            color: '#1e40af',
                                                            fontSize: '11px',
                                                            fontWeight: 600
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell align="right" sx={{ fontSize: '13px', fontWeight: 600, color: '#1e293b', py: 2 }}>
                                                    {formatValue(invoice.invoiceTotal)}
                                                </TableCell>
                                                <TableCell align="center" sx={{ fontSize: '13px', py: 2, color: '#475569' }}>
                                                    {invoice.rowCount}
                                                </TableCell>
                                                {invoiceData.isNewlyGenerated && (
                                                    <TableCell align="center" sx={{ py: 2 }}>
                                                        <Tooltip title="Add Journal Entry">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleOpenJournalDialog(invoice)}
                                                                sx={{
                                                                    color: '#3b82f6',
                                                                    '&:hover': {
                                                                        backgroundColor: 'rgba(59, 130, 246, 0.1)'
                                                                    }
                                                                }}
                                                            >
                                                                <AddIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </TableCell>
                                                )}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Right Column - Finance Information */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderRadius: '12px', position: 'sticky', top: 20 }}>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                                <AccountBalanceWalletIcon sx={{ color: '#3b82f6', fontSize: 22 }} />
                                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '16px', color: '#1e293b' }}>
                                    Finance Information
                                </Typography>
                            </Box>

                            <Stack spacing={2.5}>
                                <Box sx={{ p: 2.5, backgroundColor: '#f0fdf4', borderRadius: '8px', border: '1px solid #86efac' }}>
                                    <Typography variant="caption" sx={{ color: '#15803d', fontSize: '11px', textTransform: 'uppercase', fontWeight: 700, display: 'block', mb: 1 }}>
                                        Posted to Finance
                                    </Typography>
                                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#16a34a' }}>
                                        {invoiceData.postedToFinance}
                                    </Typography>
                                </Box>

                                <Divider />

                                <Box>
                                    <Typography variant="caption" sx={{ color: '#64748b', fontSize: '11px', textTransform: 'uppercase', fontWeight: 600, display: 'block', mb: 1 }}>
                                        Finance Posting Date
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#1e293b', fontSize: '15px' }}>
                                        {invoiceData.financePostingDate}
                                    </Typography>
                                </Box>

                                <Divider />

                                <Box>
                                    <Typography variant="caption" sx={{ color: '#64748b', fontSize: '11px', textTransform: 'uppercase', fontWeight: 600, display: 'block', mb: 1 }}>
                                        Finance Settlement Journal IDs
                                    </Typography>
                                    <Stack spacing={0.5}>
                                        {invoiceData.invoices.map((invoice, index) => (
                                            <Chip
                                                key={index}
                                                label={`Fee ${invoice.feeCode}: Journal ${invoice.financeSettlementJournalId}`}
                                                size="small"
                                                sx={{
                                                    backgroundColor: '#fff',
                                                    border: '1px solid #cbd5e1',
                                                    color: '#475569',
                                                    fontSize: '11px',
                                                    fontWeight: 600,
                                                    justifyContent: 'flex-start'
                                                }}
                                            />
                                        ))}
                                    </Stack>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Add Journal Dialog */}
            <Dialog open={openJournalDialog} onClose={handleCloseJournalDialog} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 600, color: '#1e293b' }}>
                    Add Finance Settlement Journal
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <Typography variant="body2" sx={{ mb: 2, color: '#64748b' }}>
                            Invoice: <strong>{selectedInvoice?.invoiceNumber}</strong>
                        </Typography>

                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Finance Settlement Journal"
                                    value={journalFormData.financeSettlementJournal}
                                    onChange={(e) => setJournalFormData({ ...journalFormData, financeSettlementJournal: e.target.value })}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Finance Paid Date"
                                    type="date"
                                    value={journalFormData.financePaidDate}
                                    onChange={(e) => setJournalFormData({ ...journalFormData, financePaidDate: e.target.value })}
                                    InputLabelProps={{ shrink: true }}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Finance Paid Amount"
                                    type="number"
                                    value={journalFormData.financePaidAmount}
                                    onChange={(e) => setJournalFormData({ ...journalFormData, financePaidAmount: e.target.value })}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Finance Outstanding Amount"
                                    type="number"
                                    value={journalFormData.financeOutstandingAmount}
                                    onChange={(e) => setJournalFormData({ ...journalFormData, financeOutstandingAmount: e.target.value })}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Call"
                                    value={journalFormData.call}
                                    onChange={(e) => setJournalFormData({ ...journalFormData, call: e.target.value })}
                                    required
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2.5 }}>
                    <Button
                        onClick={handleCloseJournalDialog}
                        sx={{
                            textTransform: 'none',
                            color: '#64748b',
                            '&:hover': {
                                backgroundColor: '#f1f5f9'
                            }
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleAddJournal}
                        variant="contained"
                        disabled={journalLoading}
                        sx={{
                            textTransform: 'none',
                            backgroundColor: '#e91e63',
                            '&:hover': { backgroundColor: '#c2185b' },
                            '&:disabled': {
                                backgroundColor: '#e0e0e0',
                                color: '#9e9e9e'
                            }
                        }}
                    >
                        {journalLoading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Add Journal'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
