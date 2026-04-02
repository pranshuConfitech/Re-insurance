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
    Divider,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import { ReinsuranceService } from '@/services/remote-api/api/reinsurance-services/reinsurance.service';
import { CommonMastersService } from '@/services/remote-api/api/master-services/common.masters.service';
import treatyAllocationSampleData from '@/data/treaty-allocation-sample.json';
import CombinedAllocationTable from './components/CombinedAllocationTable';
import ImprovedAllocationTable from './components/ImprovedAllocationTable';

const reinsuranceService = new ReinsuranceService();
const commonMastersService = new CommonMastersService();

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
    policyNo: string;
    endrNo: string;
    companyUIN: string;
    operatingUnitUIN: string;
    productLOB: string;
    productcode: string;
    accountingLOB: string;
    riskCategory: string;
    riskGrade: string;
    riskStartDate: string;
    updateRISI: number;
    policyPremium: number;
}

export default function TreatyAllocation3Component() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [allocationData, setAllocationData] = useState<TreatyAllocationData[]>([]);
    const [formData, setFormData] = useState<AllocationPayload>({
        policyNo: '',
        endrNo: '',
        companyUIN: '',
        operatingUnitUIN: '',
        productLOB: '',
        productcode: '',
        accountingLOB: '',
        riskCategory: '',
        riskGrade: '',
        riskStartDate: '',
        updateRISI: '' as any,
        policyPremium: '' as any
    });

    const [companyUINOptions, setCompanyUINOptions] = useState<any[]>([]);
    const [operatingUnitOptions, setOperatingUnitOptions] = useState<any[]>([]);
    const [productLobOptions, setProductLobOptions] = useState<any[]>([]);
    const [accountingLobOptions, setAccountingLobOptions] = useState<any[]>([]);
    const [riskCategoryOptions, setRiskCategoryOptions] = useState<any[]>([]);

    useEffect(() => {
        const fetchDropdown = (fetcher: () => any, setter: (data: any[]) => void) => {
            fetcher().subscribe({
                next: (response: any) => { if (response?.content) setter(response.content); },
                error: (err: any) => console.error('Error fetching dropdown:', err)
            });
        };

        fetchDropdown(() => commonMastersService.getCompanyUINOptions(), setCompanyUINOptions);
        fetchDropdown(() => commonMastersService.getOperatingUnits(), setOperatingUnitOptions);
        fetchDropdown(() => commonMastersService.getProductLobOptions(), setProductLobOptions);
        fetchDropdown(() => commonMastersService.getAccountingLobOptions(), setAccountingLobOptions);
        fetchDropdown(() => commonMastersService.getRiskCategoryOptions(), setRiskCategoryOptions);
    }, []);

    const fetchAllocationData = async () => {
        setLoading(true);
        setError(null);

        try {
            // Call the actual Premium Allocation API
            const result = await reinsuranceService.getPremiumAllocation(formData).toPromise();

            // Set the allocation data from API response
            setAllocationData(result || []);
        } catch (err: any) {
            console.error('Error processing allocation:', err);
            setError(err?.message || 'An error occurred while processing allocation data');

            // Optionally load sample data as fallback
            // setAllocationData(treatyAllocationSampleData as TreatyAllocationData[]);
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
                                        label="Policy No"
                                        value={formData.policyNo}
                                        onChange={(e) => handleInputChange('policyNo', e.target.value)}
                                        variant="outlined"
                                        sx={{ mb: 2 }}
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
                                <Grid item xs={12} sm={6} md={3}>
                                    <FormControl fullWidth>
                                        <InputLabel>Company UIN</InputLabel>
                                        <Select
                                            label="Company UIN"
                                            value={formData.companyUIN}
                                            onChange={(e) => handleInputChange('companyUIN', e.target.value)}
                                        >
                                            <MenuItem value=""><em>Select...</em></MenuItem>
                                            {companyUINOptions.map((opt) => (
                                                <MenuItem key={opt.commonCode} value={opt.commonCode}>{opt.commonDesc}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <FormControl fullWidth>
                                        <InputLabel>Operating Unit UIN</InputLabel>
                                        <Select
                                            label="Operating Unit UIN"
                                            value={formData.operatingUnitUIN}
                                            onChange={(e) => handleInputChange('operatingUnitUIN', e.target.value)}
                                        >
                                            <MenuItem value=""><em>Select...</em></MenuItem>
                                            {operatingUnitOptions.map((opt) => (
                                                <MenuItem key={opt.commonCode} value={opt.commonCode}>{opt.commonDesc}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <FormControl fullWidth>
                                        <InputLabel>Product LOB</InputLabel>
                                        <Select
                                            label="Product LOB"
                                            value={formData.productLOB}
                                            onChange={(e) => handleInputChange('productLOB', e.target.value)}
                                        >
                                            <MenuItem value=""><em>Select...</em></MenuItem>
                                            {productLobOptions.map((opt) => (
                                                <MenuItem key={opt.commonCode} value={opt.commonCode}>{opt.commonDesc}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <TextField
                                        fullWidth
                                        label="Product Code"
                                        value={formData.productcode}
                                        onChange={(e) => handleInputChange('productcode', e.target.value)}
                                        variant="outlined"
                                        sx={{ mb: 2 }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <FormControl fullWidth>
                                        <InputLabel>Accounting LOB</InputLabel>
                                        <Select
                                            label="Accounting LOB"
                                            value={formData.accountingLOB}
                                            onChange={(e) => handleInputChange('accountingLOB', e.target.value)}
                                        >
                                            <MenuItem value=""><em>Select...</em></MenuItem>
                                            {accountingLobOptions.map((opt) => (
                                                <MenuItem key={opt.commonCode} value={opt.commonCode}>{opt.commonDesc}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <FormControl fullWidth>
                                        <InputLabel>Risk Category</InputLabel>
                                        <Select
                                            label="Risk Category"
                                            value={formData.riskCategory}
                                            onChange={(e) => handleInputChange('riskCategory', e.target.value)}
                                        >
                                            <MenuItem value=""><em>Select...</em></MenuItem>
                                            {riskCategoryOptions.map((opt) => (
                                                <MenuItem key={opt.commonCode} value={opt.commonCode}>{opt.commonDesc}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <TextField
                                        fullWidth
                                        label="Risk Grade"
                                        value={formData.riskGrade}
                                        onChange={(e) => handleInputChange('riskGrade', e.target.value)}
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
                                        label="Update RISI"
                                        type="number"
                                        value={formData.updateRISI}
                                        onChange={(e) => handleInputChange('updateRISI', e.target.value === '' ? '' : parseFloat(e.target.value))}
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
                                        onChange={(e) => handleInputChange('policyPremium', e.target.value === '' ? '' : parseFloat(e.target.value))}
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
