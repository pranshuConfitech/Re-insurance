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
    Divider,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip
} from '@mui/material';
import { ReinsuranceService } from '@/services/remote-api/api/reinsurance-services/reinsurance.service';
import claimAllocationSampleData from '@/data/claim-allocation-sample.json';

const reinsuranceService = new ReinsuranceService();

interface ClaimAllocationPayload {
    policyNo: string;
    companyUIN: string;
    operatingUnitUIN: string;
    productLOB: string;
    productcode: string;
    accountingLOB: string;
    riskCategory: string;
    riskGrade: string;
    claimNo: string;
    ownShareIncurredClaim: number | string;
    ownShareOutstandingClaim: number | string;
    ownSharePaidClaim: number | string;
    dateOfLoss: string;
    claimReserveTypeInvolved: string;
}

export default function ClaimAllocationComponent() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [allocationData, setAllocationData] = useState<any[]>([]);
    const [formData, setFormData] = useState<ClaimAllocationPayload>({
        policyNo: '',
        companyUIN: '',
        operatingUnitUIN: '',
        productLOB: '',
        productcode: '',
        accountingLOB: '',
        riskCategory: '',
        riskGrade: '',
        claimNo: '',
        ownShareIncurredClaim: '',
        ownShareOutstandingClaim: '',
        ownSharePaidClaim: '',
        dateOfLoss: '',
        claimReserveTypeInvolved: ''
    });

    const fetchAllocationData = async () => {
        setLoading(true);
        setError(null);

        try {
            // TODO: Replace with actual Claim Allocation API when available
            // const result = await reinsuranceService.getClaimAllocation(formData).toPromise();

            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Load sample data for now
            setAllocationData(claimAllocationSampleData);
        } catch (err: any) {
            console.error('Error processing claim allocation:', err);
            setError(err?.message || 'An error occurred while processing claim allocation data');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field: keyof ClaimAllocationPayload, value: string | number) => {
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
                Claim Recovery
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
                                        value={formData.productcode}
                                        onChange={(e) => handleInputChange('productcode', e.target.value)}
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
                                        label="Risk Grade"
                                        value={formData.riskGrade}
                                        onChange={(e) => handleInputChange('riskGrade', e.target.value)}
                                        variant="outlined"
                                        sx={{ mb: 2 }}
                                    />
                                </Grid>
                            </Grid>

                            <Divider sx={{ my: 4 }} />

                            <Typography variant="h6" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
                                Claim Figures
                            </Typography>
                            <Grid container spacing={4}>
                                <Grid item xs={12} sm={6} md={3}>
                                    <TextField
                                        fullWidth
                                        label="Claim No"
                                        value={formData.claimNo}
                                        onChange={(e) => handleInputChange('claimNo', e.target.value)}
                                        variant="outlined"
                                        sx={{ mb: 2 }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <TextField
                                        fullWidth
                                        label="Own Share Incurred Claim"
                                        type="number"
                                        value={formData.ownShareIncurredClaim}
                                        onChange={(e) => handleInputChange('ownShareIncurredClaim', e.target.value === '' ? '' : parseFloat(e.target.value))}
                                        variant="outlined"
                                        sx={{ mb: 2 }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <TextField
                                        fullWidth
                                        label="Own Share Outstanding Claim"
                                        type="number"
                                        value={formData.ownShareOutstandingClaim}
                                        onChange={(e) => handleInputChange('ownShareOutstandingClaim', e.target.value === '' ? '' : parseFloat(e.target.value))}
                                        variant="outlined"
                                        sx={{ mb: 2 }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <TextField
                                        fullWidth
                                        label="Own Share Paid Claim"
                                        type="number"
                                        value={formData.ownSharePaidClaim}
                                        onChange={(e) => handleInputChange('ownSharePaidClaim', e.target.value === '' ? '' : parseFloat(e.target.value))}
                                        variant="outlined"
                                        sx={{ mb: 2 }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <TextField
                                        fullWidth
                                        label="Date of Loss"
                                        type="date"
                                        value={formData.dateOfLoss}
                                        onChange={(e) => handleInputChange('dateOfLoss', e.target.value)}
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
                                        label="Claim Reserve Type Involved"
                                        value={formData.claimReserveTypeInvolved}
                                        onChange={(e) => handleInputChange('claimReserveTypeInvolved', e.target.value)}
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

                {/* Claim Allocation Results */}
                {allocationData.length > 0 && (
                    <Grid item xs={12}>
                        <Card sx={{ mt: 3, boxShadow: 3 }}>
                            <CardContent sx={{ p: 4 }}>
                                <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
                                    Claim Recovery Results
                                </Typography>
                                <TableContainer component={Paper} elevation={0}>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow sx={{ backgroundColor: '#fafafa' }}>
                                                <TableCell sx={{ fontWeight: 600, padding: '12px 16px' }}>Treaty Code</TableCell>
                                                <TableCell sx={{ fontWeight: 600, padding: '12px 16px' }}>Treaty Cession %</TableCell>
                                                <TableCell sx={{ fontWeight: 600, padding: '12px 16px' }}>Treaty Incurred Claim</TableCell>
                                                <TableCell sx={{ fontWeight: 600, padding: '12px 16px' }}>Treaty Outstanding Claim</TableCell>
                                                <TableCell sx={{ fontWeight: 600, padding: '12px 16px' }}>Treaty Paid Claim</TableCell>
                                                <TableCell sx={{ fontWeight: 600, padding: '12px 16px' }}>Claim No</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {allocationData.map((row: any, index: number) => (
                                                <TableRow
                                                    key={index}
                                                    sx={{
                                                        backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8f9fa',
                                                        '&:hover': {
                                                            backgroundColor: '#e3f2fd'
                                                        },
                                                        '& .MuiTableCell-root': {
                                                            borderBottom: '1px solid #e9ecef',
                                                            padding: '12px 16px'
                                                        }
                                                    }}
                                                >
                                                    <TableCell>
                                                        <Chip
                                                            label={row.treatyCode}
                                                            size="small"
                                                            color="primary"
                                                            variant="outlined"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={`${row.treatyCessionPercent}%`}
                                                            size="small"
                                                            variant="outlined"
                                                            sx={{
                                                                color: '#607d8b',
                                                                borderColor: '#607d8b'
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        {new Intl.NumberFormat('en-IN', {
                                                            style: 'currency',
                                                            currency: 'INR',
                                                            minimumFractionDigits: 0,
                                                            maximumFractionDigits: 0
                                                        }).format(row.treatyIncurredClaim)}
                                                    </TableCell>
                                                    <TableCell>
                                                        {new Intl.NumberFormat('en-IN', {
                                                            style: 'currency',
                                                            currency: 'INR',
                                                            minimumFractionDigits: 0,
                                                            maximumFractionDigits: 0
                                                        }).format(row.treatyOutstandingClaim)}
                                                    </TableCell>
                                                    <TableCell>
                                                        {new Intl.NumberFormat('en-IN', {
                                                            style: 'currency',
                                                            currency: 'INR',
                                                            minimumFractionDigits: 0,
                                                            maximumFractionDigits: 0
                                                        }).format(row.treatyPaidClaim)}
                                                    </TableCell>
                                                    <TableCell>{row.subClaimNo}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
}
