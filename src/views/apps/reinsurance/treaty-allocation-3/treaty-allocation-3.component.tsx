'use client';
import React, { useState, useEffect } from 'react';
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
    Divider
} from '@mui/material';
import { ReinsuranceService } from '@/services/remote-api/api/reinsurance-services/reinsurance.service';
import treatyAllocationSampleData from '@/data/treaty-allocation-sample.json';
import CombinedAllocationTable from './components/CombinedAllocationTable';
import ImprovedAllocationTable from './components/ImprovedAllocationTable';

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
    companyUIN: string;
    operatingUnitUIN: string;
    productLOB: string;
    productCode: string;
    riskGrade: number;
    accountingLOB: string;
    riskCategory: string;
    ownSharePMLRISI: number;
    policyPremium: number;
    riskStartDate: string;
    endrNo: string;
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
        companyUIN: 'INS-IND-001',
        operatingUnitUIN: 'INDIA',
        productLOB: 'MOTOR',
        productCode: 'MOT0991',
        riskGrade: 1,
        accountingLOB: 'FIRE',
        riskCategory: 'STD',
        ownSharePMLRISI: 400000000,
        policyPremium: 4000000,
        riskStartDate: '2026-02-24',
        endrNo: 'e1',
        incurredClaimOnThisLocation: 100000000,
        outstandingClaimOnThisLocation: 60000000,
        paidClaimOnThisLocation: 40000000,
        ownShareIncurredClaimOnThisLocation: 80000000,
        ownShareOutstandingClaimOnThisLocation: 48000000,
        ownSharePaidClaimOnThisLocation: 32000000
    });

    const fetchAllocationData = async () => {
        setLoading(true);
        setError(null);

        try {
            // TODO: Replace with actual API call when ready
            // const result = await reinsuranceService.getPortfolioTreatyAllocation(formData).toPromise();

            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Load the combined data
            setAllocationData(treatyAllocationSampleData as TreatyAllocationData[]);
        } catch (err: any) {
            console.error('Error processing allocation:', err);
            setError(err?.message || 'An error occurred while processing allocation data');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field: keyof AllocationPayload, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async () => {
        await fetchAllocationData();
    };

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 600, color: '#e91e63' }}>
                Premium Allocation
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
                                        label="Company UIN"
                                        value={formData.companyUIN}
                                        onChange={(e) => handleInputChange('companyUIN', e.target.value)}
                                        variant="outlined"
                                        sx={{ mb: 2 }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <TextField
                                        fullWidth
                                        label="Operating Unit UIN"
                                        value={formData.operatingUnitUIN}
                                        onChange={(e) => handleInputChange('operatingUnitUIN', e.target.value)}
                                        variant="outlined"
                                        sx={{ mb: 2 }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <TextField
                                        fullWidth
                                        label="Product LOB"
                                        value={formData.productLOB}
                                        onChange={(e) => handleInputChange('productLOB', e.target.value)}
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
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
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
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
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
                                        label="Policy Premium"
                                        type="number"
                                        value={formData.policyPremium}
                                        onChange={(e) => handleInputChange('policyPremium', parseFloat(e.target.value) || 0)}
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
                                <Grid item xs={12} sm={6} md={3}>
                                    <TextField
                                        fullWidth
                                        label="Endorsement No"
                                        value={formData.endrNo}
                                        onChange={(e) => handleInputChange('endrNo', e.target.value)}
                                        variant="outlined"
                                        sx={{ mb: 2 }}
                                    />
                                </Grid>
                            </Grid>

                            {/* Claim Figures Section - Commented Out */}
                            {/* <Divider sx={{ my: 4 }} />

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
                            </Grid> */}
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
                                    {loading && (
                                        <CircularProgress
                                            size={20}
                                            sx={{ ml: 2, color: '#e91e63' }}
                                        />
                                    )}
                                </Typography>

                                {loading ? (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
                                        <CircularProgress size={40} sx={{ color: '#e91e63' }} />
                                        <Typography sx={{ ml: 2, color: '#666' }}>
                                            Loading allocation data...
                                        </Typography>
                                    </Box>
                                ) : (
                                    <ImprovedAllocationTable data={allocationData} />
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
}
