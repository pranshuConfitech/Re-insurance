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
    ToggleButtonGroup,
    ToggleButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Checkbox,
    Chip
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SearchIcon from '@mui/icons-material/Search';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { BordeauxService } from '@/services/remote-api/api/reinsurance-services/bordeaux.service';

const bordeauxService = new BordeauxService();

export default function MonthlyStatementGenerationComponent() {
    // Get current date in YYYY-MM-DD format
    const getCurrentDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    // Mode selection: 'single' or 'bulk'
    const [mode, setMode] = useState<'single' | 'bulk'>('single');

    // Single mode states
    const [singleTreatyCode, setSingleTreatyCode] = useState('');
    const [singleFromDate, setSingleFromDate] = useState(getCurrentDate());
    const [singleToDate, setSingleToDate] = useState(getCurrentDate());
    const [singleLoading, setSingleLoading] = useState(false);
    const [singleError, setSingleError] = useState<string | null>(null);
    const [singleSuccess, setSingleSuccess] = useState<string | null>(null);
    const [singleGeneratedData, setSingleGeneratedData] = useState<any>(null);

    // Bulk mode states
    const [bulkFromDate, setBulkFromDate] = useState(getCurrentDate());
    const [bulkToDate, setBulkToDate] = useState(getCurrentDate());
    const [bulkTreaties, setBulkTreaties] = useState<any[]>([]);
    const [selectedTreaties, setSelectedTreaties] = useState<Set<string>>(new Set());
    const [bulkSearchLoading, setBulkSearchLoading] = useState(false);
    const [bulkGenerateLoading, setBulkGenerateLoading] = useState(false);
    const [bulkError, setBulkError] = useState<string | null>(null);
    const [bulkSuccess, setBulkSuccess] = useState<string | null>(null);

    const handleModeChange = (event: React.MouseEvent<HTMLElement>, newMode: 'single' | 'bulk' | null) => {
        if (newMode !== null) {
            setMode(newMode);
            // Reset states when switching modes
            setSingleError(null);
            setSingleSuccess(null);
            setSingleGeneratedData(null);
            setBulkError(null);
            setBulkSuccess(null);
            setBulkTreaties([]);
            setSelectedTreaties(new Set());
        }
    };

    // Single mode: Generate and confirm statement for one treaty
    const handleSingleGenerate = async () => {
        // Validate at least from date and to date are provided
        if (!singleFromDate || !singleToDate) {
            setSingleError('Please select both from date and to date');
            return;
        }

        setSingleLoading(true);
        setSingleError(null);
        setSingleSuccess(null);
        setSingleGeneratedData(null);

        try {
            const params: any = {
                fromDate: singleFromDate,
                toDate: singleToDate
            };

            // Add treaty code only if provided
            if (singleTreatyCode.trim()) {
                params.treatyCode = singleTreatyCode.trim();
            }

            // Step 1: Generate the header
            const generateResult = await bordeauxService.generateBordeauxHeader(params).toPromise();

            if (!generateResult || !generateResult.rows || generateResult.rows.length === 0) {
                setSingleError('No statements generated. Please check the date range and treaty code.');
                return;
            }

            // Store the generated data
            setSingleGeneratedData(generateResult);

            const treatyMsg = singleTreatyCode.trim() ? ` for treaty ${singleTreatyCode}` : '';
            setSingleSuccess(`Statement generated successfully${treatyMsg}. Found ${generateResult.rows?.length || 0} record(s). Please review and submit.`);
        } catch (err: any) {
            console.error('Generate statement error:', err);
            setSingleError(err?.response?.data?.message || err?.message || 'Failed to generate statement. Please try again.');
        } finally {
            setSingleLoading(false);
        }
    };

    // Single mode: Submit the generated statements
    const handleSingleSubmit = async () => {
        if (!singleGeneratedData) {
            setSingleError('No generated data to submit');
            return;
        }

        setSingleLoading(true);
        setSingleError(null);

        try {
            const params: any = {
                fromDate: singleFromDate,
                toDate: singleToDate
            };

            // Add treaty code only if provided
            if (singleTreatyCode.trim()) {
                params.treatyCode = singleTreatyCode.trim();
            }

            // Submit/Confirm the generated header
            const confirmResult = await bordeauxService.confirmGeneratedHeader(params).toPromise();

            if (confirmResult) {
                const treatyMsg = singleTreatyCode.trim() ? ` for treaty ${singleTreatyCode}` : '';
                setSingleSuccess(`Statements submitted and confirmed successfully${treatyMsg}!`);
                // Clear the generated data after successful submission
                setTimeout(() => {
                    setSingleGeneratedData(null);
                }, 2000);
            } else {
                setSingleError('Failed to submit statements. Please try again.');
            }
        } catch (err: any) {
            console.error('Submit statement error:', err);
            setSingleError(err?.response?.data?.message || err?.message || 'Failed to submit statements. Please try again.');
        } finally {
            setSingleLoading(false);
        }
    };

    // Bulk mode: Search treaties in staging table
    const handleBulkSearch = async () => {
        if (!bulkFromDate || !bulkToDate) {
            setBulkError('Please select both from date and to date');
            return;
        }

        setBulkSearchLoading(true);
        setBulkError(null);
        setBulkSuccess(null);
        setBulkTreaties([]);
        setSelectedTreaties(new Set());

        try {
            const params = {
                fromDate: bulkFromDate,
                toDate: bulkToDate
            };

            const result = await bordeauxService.searchBordeauxByRiDate(params).toPromise();

            if (result && result.rows && result.rows.length > 0) {
                // Extract unique treaties from the staging data
                const treatyMap = new Map();
                result.rows.forEach((row: any) => {
                    if (row.treatyCode && !treatyMap.has(row.treatyCode)) {
                        treatyMap.set(row.treatyCode, {
                            treatyCode: row.treatyCode,
                            reinsurerCode: row.reinsurerCode,
                            count: 1
                        });
                    } else if (row.treatyCode) {
                        const existing = treatyMap.get(row.treatyCode);
                        existing.count += 1;
                    }
                });

                const treaties = Array.from(treatyMap.values());
                setBulkTreaties(treaties);
            } else {
                setBulkError('No treaties found in the staging table for the selected date range.');
            }
        } catch (err: any) {
            console.error('Search treaties error:', err);
            setBulkError(err?.response?.data?.message || err?.message || 'Failed to search treaties. Please try again.');
        } finally {
            setBulkSearchLoading(false);
        }
    };

    // Bulk mode: Toggle treaty selection
    const handleToggleTreaty = (treatyCode: string) => {
        const newSelected = new Set(selectedTreaties);
        if (newSelected.has(treatyCode)) {
            newSelected.delete(treatyCode);
        } else {
            newSelected.add(treatyCode);
        }
        setSelectedTreaties(newSelected);
    };

    // Bulk mode: Select/Deselect all treaties
    const handleToggleAll = () => {
        if (selectedTreaties.size === bulkTreaties.length) {
            setSelectedTreaties(new Set());
        } else {
            setSelectedTreaties(new Set(bulkTreaties.map(t => t.treatyCode)));
        }
    };

    // Bulk mode: Generate and confirm statements for selected treaties
    const handleBulkGenerate = async () => {
        if (selectedTreaties.size === 0) {
            setBulkError('Please select at least one treaty');
            return;
        }

        setBulkGenerateLoading(true);
        setBulkError(null);
        setBulkSuccess(null);

        try {
            const selectedTreatyArray = Array.from(selectedTreaties);
            let successCount = 0;
            let failCount = 0;

            // Generate and confirm statements for each selected treaty
            for (const treatyCode of selectedTreatyArray) {
                try {
                    const params = {
                        fromDate: bulkFromDate,
                        toDate: bulkToDate,
                        treatyCode: treatyCode
                    };

                    // Step 1: Generate the header
                    await bordeauxService.generateBordeauxHeader(params).toPromise();

                    // Step 2: Confirm the generated header
                    await bordeauxService.confirmGeneratedHeader(params).toPromise();

                    successCount++;
                } catch (err) {
                    console.error(`Failed to generate statement for treaty ${treatyCode}:`, err);
                    failCount++;
                }
            }

            if (successCount > 0) {
                setBulkSuccess(`Successfully generated and confirmed ${successCount} statement(s). ${failCount > 0 ? `Failed: ${failCount}` : ''}`);
            } else {
                setBulkError('Failed to generate any statements. Please try again.');
            }

            // Refresh the treaty list
            handleBulkSearch();
        } catch (err: any) {
            console.error('Bulk generate error:', err);
            setBulkError(err?.response?.data?.message || err?.message || 'Failed to generate statements. Please try again.');
        } finally {
            setBulkGenerateLoading(false);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#2c3e50', mb: 3 }}>
                Monthly Statement Generation
            </Typography>

            {/* Mode Selection */}
            <Card sx={{ mb: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderRadius: '8px' }}>
                <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                        <AssessmentIcon sx={{ color: '#e91e63', fontSize: 22 }} />
                        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '15px', color: '#2c3e50' }}>
                            Select Generation Mode
                        </Typography>
                    </Box>

                    <ToggleButtonGroup
                        value={mode}
                        exclusive
                        onChange={handleModeChange}
                        sx={{ mb: 2 }}
                    >
                        <ToggleButton value="single" sx={{ px: 3, textTransform: 'none' }}>
                            Single Treaty
                        </ToggleButton>
                        <ToggleButton value="bulk" sx={{ px: 3, textTransform: 'none' }}>
                            Bulk Generation
                        </ToggleButton>
                    </ToggleButtonGroup>

                    <Typography variant="caption" sx={{ display: 'block', color: '#64748b', fontSize: '12px' }}>
                        {mode === 'single'
                            ? '* Generate statement for a specific treaty or all treaties in date range'
                            : '* Search and select multiple treaties to generate statements in bulk'}
                    </Typography>
                </CardContent>
            </Card>

            {/* Single Mode */}
            {mode === 'single' && (
                <Card sx={{ mb: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderRadius: '8px' }}>
                    <CardContent sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '15px', color: '#2c3e50', mb: 3 }}>
                            Generate Statement for Single Treaty
                        </Typography>

                        <Grid container spacing={2.5} alignItems="flex-end">
                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    fullWidth
                                    label="Treaty Code (Optional)"
                                    value={singleTreatyCode}
                                    onChange={(e) => setSingleTreatyCode(e.target.value)}
                                    placeholder="Leave empty for all treaties"
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
                                    label="From Date"
                                    type="date"
                                    value={singleFromDate}
                                    onChange={(e) => setSingleFromDate(e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                    required
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
                                    value={singleToDate}
                                    onChange={(e) => setSingleToDate(e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                    required
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
                                    onClick={handleSingleGenerate}
                                    disabled={singleLoading}
                                    startIcon={singleLoading ? null : <PlayArrowIcon />}
                                    sx={{
                                        backgroundColor: '#e91e63',
                                        height: '42px',
                                        textTransform: 'none',
                                        '&:hover': { backgroundColor: '#c2185b' }
                                    }}
                                >
                                    {singleLoading ? <CircularProgress size={18} sx={{ color: 'white' }} /> : 'Run Statement'}
                                </Button>
                            </Grid>
                        </Grid>

                        <Typography variant="caption" sx={{ display: 'block', mt: 2, color: '#64748b', fontSize: '12px' }}>
                            * Treaty Code is optional. Leave empty to generate for all treaties in the date range.
                        </Typography>

                        {singleError && (
                            <Alert severity="error" sx={{ mt: 2, fontSize: '13px' }}>
                                {singleError}
                            </Alert>
                        )}
                        {singleSuccess && (
                            <Alert severity="success" sx={{ mt: 2, fontSize: '13px' }}>
                                {singleSuccess}
                            </Alert>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Single Mode - Generated Data Display */}
            {mode === 'single' && singleGeneratedData && singleGeneratedData.rows && singleGeneratedData.rows.length > 0 && (
                <Card sx={{ mb: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderRadius: '8px' }}>
                    <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '15px', color: '#2c3e50' }}>
                                Generated Statements ({singleGeneratedData.rows.length})
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Chip
                                    label={`From: ${singleGeneratedData.fromDate}`}
                                    size="small"
                                    sx={{ backgroundColor: '#f0f0f0', fontSize: '11px' }}
                                />
                                <Chip
                                    label={`To: ${singleGeneratedData.toDate}`}
                                    size="small"
                                    sx={{ backgroundColor: '#f0f0f0', fontSize: '11px' }}
                                />
                            </Box>
                        </Box>

                        <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e0e0e0', maxHeight: 500 }}>
                            <Table size="small" stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '12px', backgroundColor: '#f8f9fa', whiteSpace: 'nowrap' }}>Statement Number</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '12px', backgroundColor: '#f8f9fa', whiteSpace: 'nowrap' }}>Treaty</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '12px', backgroundColor: '#f8f9fa', whiteSpace: 'nowrap' }}>Reinsurer</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '12px', backgroundColor: '#f8f9fa', whiteSpace: 'nowrap' }}>Broker</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '12px', backgroundColor: '#f8f9fa', whiteSpace: 'nowrap' }}>Section/LOB</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '12px', backgroundColor: '#f8f9fa', whiteSpace: 'nowrap' }}>Status</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '12px', backgroundColor: '#f8f9fa', whiteSpace: 'nowrap' }}>Fees</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '12px', backgroundColor: '#f8f9fa', whiteSpace: 'nowrap' }}>Period</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '12px', backgroundColor: '#f8f9fa', whiteSpace: 'nowrap' }}>Statement Date</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {singleGeneratedData.rows.map((row: any, index: number) => (
                                        <TableRow key={index} hover sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                                            <TableCell sx={{ fontSize: '12px', fontFamily: 'monospace', color: '#1976d2' }}>
                                                {row.bordeauxStatementNumber}
                                            </TableCell>
                                            <TableCell sx={{ fontSize: '12px' }}>
                                                <Chip
                                                    label={row.treatyCode}
                                                    size="small"
                                                    sx={{ backgroundColor: '#e3f2fd', color: '#1976d2', fontSize: '11px', fontWeight: 500 }}
                                                />
                                            </TableCell>
                                            <TableCell sx={{ fontSize: '12px' }}>
                                                <Chip
                                                    label={row.reinsurerCode}
                                                    size="small"
                                                    sx={{ backgroundColor: '#d1ecf1', color: '#0c5460', fontSize: '11px', fontWeight: 500 }}
                                                />
                                            </TableCell>
                                            <TableCell sx={{ fontSize: '12px', color: row.brokerCode ? '#2c3e50' : '#9e9e9e' }}>
                                                {row.brokerCode || '-'}
                                            </TableCell>
                                            <TableCell sx={{ fontSize: '12px' }}>
                                                <Chip
                                                    label={row.sectionLob}
                                                    size="small"
                                                    sx={{ backgroundColor: '#fce4ec', color: '#c2185b', fontSize: '11px' }}
                                                />
                                            </TableCell>
                                            <TableCell sx={{ fontSize: '12px' }}>
                                                <Chip
                                                    label={row.statementStatus}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: row.statementStatus === 'Open' ? '#fff3cd' : '#d4edda',
                                                        color: row.statementStatus === 'Open' ? '#856404' : '#155724',
                                                        fontSize: '11px',
                                                        fontWeight: 500
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell sx={{ fontSize: '11px' }}>
                                                {row.fees && row.fees.length > 0 ? (
                                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.3 }}>
                                                        {row.fees.map((fee: any, feeIndex: number) => (
                                                            <Box key={feeIndex} sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                                                                <Typography variant="caption" sx={{ fontSize: '11px', color: '#666', fontWeight: 500 }}>
                                                                    {fee.feeCode}:
                                                                </Typography>
                                                                <Typography variant="caption" sx={{ fontSize: '11px', color: '#2c3e50', fontWeight: 500 }}>
                                                                    ₹{new Intl.NumberFormat('en-IN').format(fee.feeAmount)}
                                                                </Typography>
                                                            </Box>
                                                        ))}
                                                    </Box>
                                                ) : (
                                                    <Typography variant="caption" sx={{ fontSize: '11px', color: '#9e9e9e' }}>-</Typography>
                                                )}
                                            </TableCell>
                                            <TableCell sx={{ fontSize: '11px', color: '#666' }}>
                                                <Box>
                                                    <Typography variant="caption" sx={{ fontSize: '10px', display: 'block' }}>
                                                        {row.bordeauxFromDate}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ fontSize: '10px', display: 'block' }}>
                                                        to {row.bordeauxToDate}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell sx={{ fontSize: '12px', color: '#666' }}>
                                                {row.bordeauxStatementDate}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {/* Submit Button */}
                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2, alignItems: 'center' }}>
                            <Typography variant="body2" sx={{ color: '#64748b', fontSize: '13px' }}>
                                Review the generated statements and submit to confirm
                            </Typography>
                            <Button
                                variant="contained"
                                onClick={handleSingleSubmit}
                                disabled={singleLoading}
                                sx={{
                                    backgroundColor: '#4caf50',
                                    px: 4,
                                    textTransform: 'none',
                                    '&:hover': { backgroundColor: '#45a049' }
                                }}
                            >
                                Submit Statements
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            )}

            {/* Bulk Mode */}
            {mode === 'bulk' && (
                <>
                    {/* Search Section */}
                    <Card sx={{ mb: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderRadius: '8px' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '15px', color: '#2c3e50', mb: 3 }}>
                                Search Treaties in Staging Table
                            </Typography>

                            <Grid container spacing={2.5} alignItems="flex-end">
                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField
                                        fullWidth
                                        label="From Date"
                                        type="date"
                                        value={bulkFromDate}
                                        onChange={(e) => setBulkFromDate(e.target.value)}
                                        InputLabelProps={{ shrink: true }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                fontSize: '14px',
                                                height: '42px'
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField
                                        fullWidth
                                        label="To Date"
                                        type="date"
                                        value={bulkToDate}
                                        onChange={(e) => setBulkToDate(e.target.value)}
                                        InputLabelProps={{ shrink: true }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                fontSize: '14px',
                                                height: '42px'
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        onClick={handleBulkSearch}
                                        disabled={bulkSearchLoading}
                                        startIcon={bulkSearchLoading ? null : <SearchIcon />}
                                        sx={{
                                            backgroundColor: '#2196f3',
                                            height: '42px',
                                            textTransform: 'none',
                                            '&:hover': { backgroundColor: '#1976d2' }
                                        }}
                                    >
                                        {bulkSearchLoading ? <CircularProgress size={18} sx={{ color: 'white' }} /> : 'Search Treaties'}
                                    </Button>
                                </Grid>
                            </Grid>

                            {bulkError && (
                                <Alert severity="error" sx={{ mt: 2, fontSize: '13px' }}>
                                    {bulkError}
                                </Alert>
                            )}
                        </CardContent>
                    </Card>

                    {/* Treaties Table */}
                    {bulkTreaties.length > 0 && (
                        <Card sx={{ mb: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderRadius: '8px' }}>
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '15px', color: '#2c3e50' }}>
                                        Available Treaties ({bulkTreaties.length})
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                        <Typography variant="body2" sx={{ color: '#64748b', fontSize: '13px' }}>
                                            Selected: {selectedTreaties.size}
                                        </Typography>
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            onClick={handleToggleAll}
                                            sx={{ textTransform: 'none', fontSize: '12px' }}
                                        >
                                            {selectedTreaties.size === bulkTreaties.length ? 'Deselect All' : 'Select All'}
                                        </Button>
                                    </Box>
                                </Box>

                                <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e0e0e0' }}>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        checked={selectedTreaties.size === bulkTreaties.length && bulkTreaties.length > 0}
                                                        indeterminate={selectedTreaties.size > 0 && selectedTreaties.size < bulkTreaties.length}
                                                        onChange={handleToggleAll}
                                                    />
                                                </TableCell>
                                                <TableCell sx={{ fontWeight: 600, fontSize: '13px' }}>Treaty Code</TableCell>
                                                <TableCell sx={{ fontWeight: 600, fontSize: '13px' }}>Reinsurer Code</TableCell>
                                                <TableCell sx={{ fontWeight: 600, fontSize: '13px' }}>Record Count</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {bulkTreaties.map((treaty) => (
                                                <TableRow
                                                    key={treaty.treatyCode}
                                                    hover
                                                    onClick={() => handleToggleTreaty(treaty.treatyCode)}
                                                    sx={{ cursor: 'pointer' }}
                                                >
                                                    <TableCell padding="checkbox">
                                                        <Checkbox
                                                            checked={selectedTreaties.has(treaty.treatyCode)}
                                                            onChange={() => handleToggleTreaty(treaty.treatyCode)}
                                                        />
                                                    </TableCell>
                                                    <TableCell sx={{ fontSize: '13px' }}>
                                                        <Chip
                                                            label={treaty.treatyCode}
                                                            size="small"
                                                            sx={{ backgroundColor: '#e3f2fd', color: '#1976d2', fontSize: '12px' }}
                                                        />
                                                    </TableCell>
                                                    <TableCell sx={{ fontSize: '13px' }}>{treaty.reinsurerCode}</TableCell>
                                                    <TableCell sx={{ fontSize: '13px' }}>{treaty.count}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>

                                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button
                                        variant="contained"
                                        onClick={handleBulkGenerate}
                                        disabled={bulkGenerateLoading || selectedTreaties.size === 0}
                                        startIcon={bulkGenerateLoading ? null : <PlayArrowIcon />}
                                        sx={{
                                            backgroundColor: '#e91e63',
                                            px: 4,
                                            textTransform: 'none',
                                            '&:hover': { backgroundColor: '#c2185b' }
                                        }}
                                    >
                                        {bulkGenerateLoading ? (
                                            <CircularProgress size={18} sx={{ color: 'white' }} />
                                        ) : (
                                            `Run Statements (${selectedTreaties.size})`
                                        )}
                                    </Button>
                                </Box>

                                {bulkSuccess && (
                                    <Alert severity="success" sx={{ mt: 2, fontSize: '13px' }}>
                                        {bulkSuccess}
                                    </Alert>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </>
            )}
        </Box>
    );
}
