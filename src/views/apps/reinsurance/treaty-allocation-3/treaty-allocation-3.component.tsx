'use client';
import React, { useState } from 'react';
import {
    Card,
    CardContent,
    TextField,
    Button,
    Box,
    Grid,
    Typography,
    Alert,
    CircularProgress,
    Paper,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    List,
    ListItem,
    ListItemText
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ReinsuranceService } from '@/services/remote-api/api/reinsurance-services/reinsurance.service';
import treatyAllocationSampleData from '@/data/treaty-allocation-sample.json';

const reinsuranceService = new ReinsuranceService();

interface Participant {
    participantType: string;
    participantName: string;
    sharePercent: number;
    participantRISI: number;
    participantPremium: number;
    participantCommission: number;
    reinsurers: any;
}

interface TreatyAllocationData {
    blockSummaryRow: boolean;
    participantRow: boolean;
    blockNumber: string;
    treatyCode: string | null;
    priorityOrder: number | null;
    balanceSI: number;
    controlCessionSI: number;
    controlValue: number | null;
    earlierTreatySI: number | null;
    incrementalTreatySI: number | null;
    treatyCessionSI: number | null;
    treatyCessionPercent: number | null;
    treatyRIPremium: number | null;
    treatyCommision: number | null;
    participants: Participant[] | null;
}

interface AllocationPayload {
    policy: string;
    productCode: string;
    riskGrade: number;
    accountingLOB: string;
    riskCategory: string;
    ownSharePMLRISI: number;
    gwp: number;
    riskStartDate: string;
    incurredClaimOnThisLocation: number;
    outstandingClaimOnThisLocation: number;
    paidClaimOnThisLocation: number;
    ownShareIncurredClaimOnThisLocation: number;
    ownShareOutstandingClaimOnThisLocation: number;
    ownSharePaidClaimOnThisLocation: number;
}

export default function TreatyAllocation3Component() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [allocationData, setAllocationData] = useState<TreatyAllocationData[]>([]);
    const [formData, setFormData] = useState<AllocationPayload>({
        policy: 'P1',
        productCode: 'FIRE01',
        riskGrade: 1,
        accountingLOB: 'Fire',
        riskCategory: 'Fire',
        ownSharePMLRISI: 200000000,
        gwp: 2000000,
        riskStartDate: '2020-04-01',
        incurredClaimOnThisLocation: 100000000,
        outstandingClaimOnThisLocation: 60000000,
        paidClaimOnThisLocation: 40000000,
        ownShareIncurredClaimOnThisLocation: 80000000,
        ownShareOutstandingClaimOnThisLocation: 48000000,
        ownSharePaidClaimOnThisLocation: 32000000
    });

    const handleInputChange = (field: keyof AllocationPayload, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const formatCurrency = (amount: number | null) => {
        if (amount === null || amount === undefined) return '-';
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const formatPercentage = (percent: number | null) => {
        if (percent === null || percent === undefined) return '-';
        return `${percent}%`;
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        setAllocationData([]);

        try {
            // TODO: Replace with actual API call when ready
            // const result = await reinsuranceService.getPortfolioTreatyAllocation(formData).toPromise();

            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Use data from JSON file
            setAllocationData(treatyAllocationSampleData as TreatyAllocationData[]);
        } catch (err: any) {
            console.error('Error processing allocation:', err);
            setError(err?.message || 'An error occurred while processing allocation data');
        } finally {
            setLoading(false);
        }
    };

    const groupedData = allocationData.reduce((acc, item) => {
        if (!acc[item.blockNumber]) {
            acc[item.blockNumber] = [];
        }
        acc[item.blockNumber].push(item);
        return acc;
    }, {} as Record<string, TreatyAllocationData[]>);

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 600, color: '#e91e63' }}>
                Treaty Allocation 3
            </Typography>

            <Grid container spacing={4}>
                {/* Risk & Policy Data Section */}
                <Grid item xs={12}>
                    <Card sx={{ boxShadow: 3 }}>
                        <CardContent sx={{ p: 4 }}>
                            <Typography variant="h6" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
                                Risk & Policy Data
                            </Typography>
                            <Grid container spacing={4}>
                                <Grid item xs={12} sm={6} md={3}>
                                    <TextField
                                        fullWidth
                                        label="Policy"
                                        value={formData.policy}
                                        onChange={(e) => handleInputChange('policy', e.target.value)}
                                        variant="outlined"
                                        sx={{ mb: 2 }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <TextField
                                        fullWidth
                                        label="Product Code"
                                        value={formData.productCode}
                                        onChange={(e) => handleInputChange('productCode', e.target.value)}
                                        variant="outlined"
                                        sx={{ mb: 2 }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <TextField
                                        fullWidth
                                        label="Risk Grade"
                                        type="number"
                                        value={formData.riskGrade}
                                        onChange={(e) => handleInputChange('riskGrade', parseInt(e.target.value) || 0)}
                                        variant="outlined"
                                        sx={{ mb: 2 }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <TextField
                                        fullWidth
                                        label="Accounting LOB"
                                        value={formData.accountingLOB}
                                        onChange={(e) => handleInputChange('accountingLOB', e.target.value)}
                                        variant="outlined"
                                        sx={{ mb: 2 }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <TextField
                                        fullWidth
                                        label="Risk Category"
                                        value={formData.riskCategory}
                                        onChange={(e) => handleInputChange('riskCategory', e.target.value)}
                                        variant="outlined"
                                        sx={{ mb: 2 }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <TextField
                                        fullWidth
                                        label="Own Share PML RISI"
                                        type="number"
                                        value={formData.ownSharePMLRISI}
                                        onChange={(e) => handleInputChange('ownSharePMLRISI', parseFloat(e.target.value) || 0)}
                                        variant="outlined"
                                        sx={{ mb: 2 }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <TextField
                                        fullWidth
                                        label="GWP"
                                        type="number"
                                        value={formData.gwp}
                                        onChange={(e) => handleInputChange('gwp', parseFloat(e.target.value) || 0)}
                                        variant="outlined"
                                        sx={{ mb: 2 }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <TextField
                                        fullWidth
                                        label="Risk Start Date"
                                        type="date"
                                        value={formData.riskStartDate}
                                        onChange={(e) => handleInputChange('riskStartDate', e.target.value)}
                                        variant="outlined"
                                        sx={{ mb: 2 }}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </Grid>
                            </Grid>

                            <Divider sx={{ my: 4 }} />

                            <Typography variant="h6" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
                                Claim Figures
                            </Typography>
                            <Grid container spacing={4}>
                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField
                                        fullWidth
                                        label="Incurred Claim On This Location"
                                        type="number"
                                        value={formData.incurredClaimOnThisLocation}
                                        onChange={(e) => handleInputChange('incurredClaimOnThisLocation', parseFloat(e.target.value) || 0)}
                                        variant="outlined"
                                        sx={{ mb: 2 }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField
                                        fullWidth
                                        label="Outstanding Claim On This Location"
                                        type="number"
                                        value={formData.outstandingClaimOnThisLocation}
                                        onChange={(e) => handleInputChange('outstandingClaimOnThisLocation', parseFloat(e.target.value) || 0)}
                                        variant="outlined"
                                        sx={{ mb: 2 }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField
                                        fullWidth
                                        label="Paid Claim On This Location"
                                        type="number"
                                        value={formData.paidClaimOnThisLocation}
                                        onChange={(e) => handleInputChange('paidClaimOnThisLocation', parseFloat(e.target.value) || 0)}
                                        variant="outlined"
                                        sx={{ mb: 2 }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField
                                        fullWidth
                                        label="Own Share Incurred Claim On This Location"
                                        type="number"
                                        value={formData.ownShareIncurredClaimOnThisLocation}
                                        onChange={(e) => handleInputChange('ownShareIncurredClaimOnThisLocation', parseFloat(e.target.value) || 0)}
                                        variant="outlined"
                                        sx={{ mb: 2 }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField
                                        fullWidth
                                        label="Own Share Outstanding Claim On This Location"
                                        type="number"
                                        value={formData.ownShareOutstandingClaimOnThisLocation}
                                        onChange={(e) => handleInputChange('ownShareOutstandingClaimOnThisLocation', parseFloat(e.target.value) || 0)}
                                        variant="outlined"
                                        sx={{ mb: 2 }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField
                                        fullWidth
                                        label="Own Share Paid Claim On This Location"
                                        type="number"
                                        value={formData.ownSharePaidClaimOnThisLocation}
                                        onChange={(e) => handleInputChange('ownSharePaidClaimOnThisLocation', parseFloat(e.target.value) || 0)}
                                        variant="outlined"
                                        sx={{ mb: 2 }}
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Submit Button */}
                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            onClick={handleSubmit}
                            disabled={loading}
                            sx={{
                                px: 6,
                                py: 2,
                                minWidth: 250,
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                borderRadius: 2,
                                boxShadow: 3,
                                '&:hover': {
                                    boxShadow: 6
                                }
                            }}
                        >
                            {loading ? (
                                <>
                                    <CircularProgress size={24} sx={{ mr: 2, color: 'white' }} />
                                    Processing...
                                </>
                            ) : (
                                'Submit'
                            )}
                        </Button>
                    </Box>
                </Grid>

                {/* Error Display */}
                {error && (
                    <Grid item xs={12}>
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {error}
                        </Alert>
                    </Grid>
                )}

                {/* Treaty Allocation Results */}
                {allocationData.length > 0 && (
                    <Grid item xs={12}>
                        <Card sx={{ mt: 3, boxShadow: 3 }}>
                            <CardContent sx={{ p: 4 }}>
                                <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
                                    Treaty Allocation Results
                                </Typography>

                                {Object.entries(groupedData).map(([blockNumber, blockData]) => (
                                    <Accordion key={blockNumber} defaultExpanded sx={{ mb: 2 }}>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            sx={{
                                                backgroundColor: '#f5f5f5',
                                                '&:hover': {
                                                    backgroundColor: '#e91e63',
                                                    color: 'white',
                                                    '& .MuiAccordionSummary-expandIconWrapper': {
                                                        color: 'white'
                                                    }
                                                }
                                            }}
                                        >
                                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                {blockNumber}
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails sx={{ p: 0 }}>
                                            <TableContainer component={Paper} elevation={0}>
                                                <Table size="small">
                                                    <TableHead>
                                                        <TableRow sx={{ backgroundColor: '#fafafa' }}>
                                                            <TableCell sx={{ fontWeight: 600 }}>Treaty Code</TableCell>
                                                            <TableCell sx={{ fontWeight: 600 }}>Priority</TableCell>
                                                            <TableCell sx={{ fontWeight: 600 }}>Balance SI</TableCell>
                                                            <TableCell sx={{ fontWeight: 600 }}>Control Cession SI</TableCell>
                                                            <TableCell sx={{ fontWeight: 600 }}>Treaty Cession %</TableCell>
                                                            <TableCell sx={{ fontWeight: 600 }}>Treaty Premium</TableCell>
                                                            <TableCell sx={{ fontWeight: 600 }}>Participants</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {blockData.map((item, index) => (
                                                            <TableRow
                                                                key={index}
                                                                sx={{
                                                                    backgroundColor: item.blockSummaryRow ? '#e3f2fd' : 'inherit',
                                                                    fontWeight: item.blockSummaryRow ? 600 : 'normal'
                                                                }}
                                                            >
                                                                <TableCell>
                                                                    {item.treatyCode ? (
                                                                        <Chip
                                                                            label={item.treatyCode}
                                                                            size="small"
                                                                            color="primary"
                                                                            variant="outlined"
                                                                        />
                                                                    ) : (
                                                                        item.blockSummaryRow ? (
                                                                            <Chip
                                                                                label="SUMMARY"
                                                                                size="small"
                                                                                color="secondary"
                                                                            />
                                                                        ) : '-'
                                                                    )}
                                                                </TableCell>
                                                                <TableCell>{item.priorityOrder || '-'}</TableCell>
                                                                <TableCell>{formatCurrency(item.balanceSI)}</TableCell>
                                                                <TableCell>{formatCurrency(item.controlCessionSI)}</TableCell>
                                                                <TableCell>{formatPercentage(item.treatyCessionPercent)}</TableCell>
                                                                <TableCell>{formatCurrency(item.treatyRIPremium)}</TableCell>
                                                                <TableCell>
                                                                    {item.participants && item.participants.length > 0 ? (
                                                                        <Box>
                                                                            {item.participants.map((participant, pIndex) => (
                                                                                <Box key={pIndex} sx={{ mb: 1 }}>
                                                                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                                                        {participant.participantName}
                                                                                    </Typography>
                                                                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
                                                                                        <Chip
                                                                                            label={participant.participantType}
                                                                                            size="small"
                                                                                            color={participant.participantType === 'REINSURER' ? 'success' : 'warning'}
                                                                                            variant="outlined"
                                                                                        />
                                                                                        <Chip
                                                                                            label={`${participant.sharePercent}%`}
                                                                                            size="small"
                                                                                            variant="outlined"
                                                                                        />
                                                                                        <Chip
                                                                                            label={formatCurrency(participant.participantRISI)}
                                                                                            size="small"
                                                                                            variant="outlined"
                                                                                        />
                                                                                    </Box>
                                                                                </Box>
                                                                            ))}
                                                                        </Box>
                                                                    ) : '-'}
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </AccordionDetails>
                                    </Accordion>
                                ))}
                            </CardContent>
                        </Card>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
}
