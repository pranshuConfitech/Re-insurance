'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Alert,
    TextField
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface TreatyConfig3Data {
    id: number;
    blockNumber: string;
    treatyCode: string;
    priorityOrder: number;
    cessionRate: string;
    quotaCessionMax: string;
    retentionGrossNet: string;
    surplusCapacity: string;
    calculatedCapacity: string;
}

const TreatyConfig3Component = () => {
    const router = useRouter();

    // Filter states - Calendar fields and 5 dropdowns
    const [period1, setPeriod1] = useState<Date | null>(new Date('2025-01-01'));
    const [period2, setPeriod2] = useState<Date | null>(new Date('2026-12-31'));
    const [productCode, setProductCode] = useState('FIRE01');
    const [riskGrade, setRiskGrade] = useState('1');
    const [accountingLOB, setAccountingLOB] = useState('Fire');
    const [riskCategory, setRiskCategory] = useState('Fire');
    const [type, setType] = useState('Per Risk');

    const [data, setData] = useState<TreatyConfig3Data[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        setError(null);

        // Simulate API call - replace with actual service call
        setTimeout(() => {
            if (!isMounted) return;

            // Mock data matching the table structure from the image
            setData([
                {
                    id: 1,
                    blockNumber: 'Block1',
                    treatyCode: 'T11',
                    priorityOrder: 11,
                    cessionRate: '10%',
                    quotaCessionMax: '300',
                    retentionGrossNet: '',
                    surplusCapacity: '',
                    calculatedCapacity: '300'
                },
                {
                    id: 2,
                    blockNumber: 'Block1',
                    treatyCode: 'T12',
                    priorityOrder: 12,
                    cessionRate: '20%',
                    quotaCessionMax: '500',
                    retentionGrossNet: '0',
                    surplusCapacity: '',
                    calculatedCapacity: '500'
                },
                {
                    id: 3,
                    blockNumber: 'Block2',
                    treatyCode: 'SBI Retention',
                    priorityOrder: 21,
                    cessionRate: '',
                    quotaCessionMax: '',
                    retentionGrossNet: '25',
                    surplusCapacity: '',
                    calculatedCapacity: '25'
                },
                {
                    id: 4,
                    blockNumber: 'Block2',
                    treatyCode: 'T22',
                    priorityOrder: 22,
                    cessionRate: '',
                    quotaCessionMax: '',
                    retentionGrossNet: '',
                    surplusCapacity: '75',
                    calculatedCapacity: '75'
                },
                {
                    id: 5,
                    blockNumber: 'Block3',
                    treatyCode: 'T31',
                    priorityOrder: 31,
                    cessionRate: '0%',
                    quotaCessionMax: '0',
                    retentionGrossNet: '',
                    surplusCapacity: '200',
                    calculatedCapacity: '200'
                },
                {
                    id: 6,
                    blockNumber: 'Block3',
                    treatyCode: 'T32',
                    priorityOrder: 32,
                    cessionRate: '10%',
                    quotaCessionMax: '150',
                    retentionGrossNet: '',
                    surplusCapacity: '0',
                    calculatedCapacity: '150'
                },
                {
                    id: 7,
                    blockNumber: 'Block4',
                    treatyCode: 'T41',
                    priorityOrder: 41,
                    cessionRate: '',
                    quotaCessionMax: '',
                    retentionGrossNet: '',
                    surplusCapacity: '400',
                    calculatedCapacity: '400'
                }
            ]);
            setLoading(false);
        }, 500);

        return () => {
            isMounted = false;
        };
    }, []);

    const handleCreate = () => {
        router.push('/reinsurance/treaty-config-3/create');
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ mb: 3 }}>
                {error}
            </Alert>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#212529', mb: 1, fontSize: '28px' }}>
                    Treaty Config 3
                </Typography>
                <Typography variant="body2" sx={{ color: '#6c757d', fontSize: '14px' }}>
                    Configure treaty definitions with period and product details.
                </Typography>
            </Box>

            {/* Filter Dropdowns - 2 Calendar fields + 5 dropdowns */}
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <FormControl size="small" sx={{ minWidth: 180 }}>
                        <InputLabel>Product code</InputLabel>
                        <Select
                            value={productCode}
                            label="Product code"
                            onChange={(e) => setProductCode(e.target.value)}
                        >
                            <MenuItem value="FIRE01">FIRE01</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl size="small" sx={{ minWidth: 180 }}>
                        <InputLabel>Risk Grade</InputLabel>
                        <Select
                            value={riskGrade}
                            label="Risk Grade"
                            onChange={(e) => setRiskGrade(e.target.value)}
                        >
                            <MenuItem value="1">1</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl size="small" sx={{ minWidth: 180 }}>
                        <InputLabel>Accounting LOB</InputLabel>
                        <Select
                            value={accountingLOB}
                            label="Accounting LOB"
                            onChange={(e) => setAccountingLOB(e.target.value)}
                        >
                            <MenuItem value="Fire">Fire</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl size="small" sx={{ minWidth: 180 }}>
                        <InputLabel>Risk Category</InputLabel>
                        <Select
                            value={riskCategory}
                            label="Risk Category"
                            onChange={(e) => setRiskCategory(e.target.value)}
                        >
                            <MenuItem value="Fire">Fire</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl size="small" sx={{ minWidth: 180 }}>
                        <InputLabel>Type</InputLabel>
                        <Select
                            value={type}
                            label="Type"
                            onChange={(e) => setType(e.target.value)}
                        >
                            <MenuItem value="Per Risk">Per Risk</MenuItem>
                        </Select>
                    </FormControl>

                    <DatePicker
                        label="Period From"
                        value={period1}
                        onChange={(newValue) => setPeriod1(newValue)}
                        renderInput={(params: any) => <TextField {...params} size="small" sx={{ minWidth: 180 }} />}
                    />

                    <DatePicker
                        label="Period To"
                        value={period2}
                        onChange={(newValue) => setPeriod2(newValue)}
                        renderInput={(params: any) => <TextField {...params} size="small" sx={{ minWidth: 180 }} />}
                    />
                </Box>
            </LocalizationProvider>

            {/* Create Button */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleCreate}
                    sx={{
                        backgroundColor: '#28a745',
                        '&:hover': { backgroundColor: '#218838' },
                        textTransform: 'none'
                    }}
                >
                    Create
                </Button>
            </Box>

            {/* Data Table */}
            {data.length === 0 ? (
                <Card sx={{ p: 4, textAlign: 'center' }}>
                    <Alert severity="info">No treaty configuration data found</Alert>
                </Card>
            ) : (
                <Card sx={{ boxShadow: '0 2px 12px rgba(0,0,0,0.08)', borderRadius: '12px' }}>
                    <CardContent sx={{ p: 0 }}>
                        <TableContainer component={Paper} elevation={0} sx={{ maxHeight: '600px', overflow: 'auto', borderRadius: '12px' }}>
                            <Table stickyHeader sx={{ minWidth: 650 }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 700, fontSize: '12px', backgroundColor: '#f8f9fa', color: '#6c757d', textTransform: 'uppercase', py: 2, borderBottom: '2px solid #dee2e6' }}>Block Number</TableCell>
                                        <TableCell sx={{ fontWeight: 700, fontSize: '12px', backgroundColor: '#f8f9fa', color: '#6c757d', textTransform: 'uppercase', py: 2, borderBottom: '2px solid #dee2e6' }}>Treaty Code</TableCell>
                                        <TableCell sx={{ fontWeight: 700, fontSize: '12px', backgroundColor: '#f8f9fa', color: '#6c757d', textTransform: 'uppercase', py: 2, borderBottom: '2px solid #dee2e6' }}>Priority Order</TableCell>
                                        <TableCell sx={{ fontWeight: 700, fontSize: '12px', backgroundColor: '#f8f9fa', color: '#6c757d', textTransform: 'uppercase', py: 2, borderBottom: '2px solid #dee2e6' }}>Cession Rate %</TableCell>
                                        <TableCell sx={{ fontWeight: 700, fontSize: '12px', backgroundColor: '#f8f9fa', color: '#6c757d', textTransform: 'uppercase', py: 2, borderBottom: '2px solid #dee2e6' }}>Quota Cession Max Capacity</TableCell>
                                        <TableCell sx={{ fontWeight: 700, fontSize: '12px', backgroundColor: '#f8f9fa', color: '#6c757d', textTransform: 'uppercase', py: 2, borderBottom: '2px solid #dee2e6' }}>Retention (Gross/Net)</TableCell>
                                        <TableCell sx={{ fontWeight: 700, fontSize: '12px', backgroundColor: '#f8f9fa', color: '#6c757d', textTransform: 'uppercase', py: 2, borderBottom: '2px solid #dee2e6' }}>Surplus Capacity</TableCell>
                                        <TableCell sx={{ fontWeight: 700, fontSize: '12px', backgroundColor: '#f8f9fa', color: '#6c757d', textTransform: 'uppercase', py: 2, borderBottom: '2px solid #dee2e6' }}>Capacity (Calculate in XL)</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data.map((row, index) => {
                                        const prevRow = index > 0 ? data[index - 1] : null;
                                        const isNewBlock = !prevRow || prevRow.blockNumber !== row.blockNumber;

                                        return (
                                            <TableRow
                                                key={row.id}
                                                sx={{
                                                    '&:hover': { backgroundColor: '#f8f9fa' },
                                                    borderTop: isNewBlock ? '2px solid #dee2e6' : 'none',
                                                    backgroundColor: isNewBlock ? '#fafbfc' : 'transparent'
                                                }}
                                            >
                                                <TableCell sx={{ fontWeight: isNewBlock ? 600 : 400, fontSize: '14px', py: 2 }}>
                                                    {row.blockNumber}
                                                </TableCell>
                                                <TableCell sx={{ fontSize: '14px', py: 2 }}>{row.treatyCode}</TableCell>
                                                <TableCell sx={{ fontSize: '14px', py: 2 }}>{row.priorityOrder}</TableCell>
                                                <TableCell sx={{ fontSize: '14px', py: 2 }}>{row.cessionRate || '-'}</TableCell>
                                                <TableCell sx={{ fontSize: '14px', py: 2 }}>{row.quotaCessionMax || '-'}</TableCell>
                                                <TableCell sx={{ fontSize: '14px', py: 2 }}>{row.retentionGrossNet || '-'}</TableCell>
                                                <TableCell sx={{ fontSize: '14px', py: 2 }}>{row.surplusCapacity || '-'}</TableCell>
                                                <TableCell sx={{ fontSize: '14px', py: 2, fontWeight: 600 }}>{row.calculatedCapacity}</TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>
            )}
        </Box>
    );
};

export default TreatyConfig3Component;
