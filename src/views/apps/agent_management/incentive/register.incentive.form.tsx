'use client';

import React, { useState } from 'react';
import { Box, Button, Card, Grid, TextField, Typography, CircularProgress, Alert } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function RegisterIncentiveForm() {
    const [commissionValue, setCommissionValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCommissionValue(e.target.value);
        setError(null);
    };

    const handleSave = () => {
        if (!commissionValue.trim()) {
            setError('Commission value is required');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);

        // Simulate API call for saving incentive
        setTimeout(() => {
            setLoading(false);
            setSuccess('Incentive saved successfully!');
            console.log('Saving incentive:', { commissionValue });
            // Optionally, navigate back or to another page after saving
            // router.push('/agents/management');
        }, 1500);
    };

    return (
        <Box p={4} sx={{ minHeight: '100vh' }}>
            <Card sx={{ p: 4, maxWidth: 1100, mx: 'auto', borderRadius: 1, boxShadow: 1 }}>
                <Typography variant="h6" mb={4} fontWeight={500}>
                    % of commission earned by agents under unit manager
                </Typography>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        {success}
                    </Alert>
                )}
                <Grid container spacing={4}>
                    <Grid item xs={6}>
                        <TextField
                            label="Commission Value"
                            name="commissionValue"
                            value={commissionValue}
                            onChange={handleChange}
                            fullWidth
                            required
                            size="small"
                            type="number"
                            error={!!error}
                            helperText={error}
                        />
                    </Grid>
                </Grid>
                <Box display="flex" justifyContent="flex-end" mt={6}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSave}
                        disabled={loading}
                        sx={{
                            minWidth: 120,
                            fontWeight: 600,
                            fontSize: 16,
                            background: '#D80E51',
                            '&:hover': { background: '#b80c43' }
                        }}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Save'}
                    </Button>
                </Box>
            </Card>
        </Box>
    );
} 
