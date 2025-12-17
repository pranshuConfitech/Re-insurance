'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Box,
    Card,
    Typography,
    TextField,
    Button,
    CircularProgress,
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
    MenuItem
} from '@mui/material';
import { TreatyTypeService } from '@/services/remote-api/api/master-services/treaty.type.service';
import { ReinsuranceService } from '@/services/remote-api/api/reinsurance-services/reinsurance.service';

const treatyTypeService = new TreatyTypeService();
const reinsuranceService = new ReinsuranceService();

interface TreatyConfigRow {
    priorityOrder: number;
    treatyTypeId: string;
    treatyTypeName: string;
    asPerTreaty: string;
    limitAsPerTreaty: string;
    riCommission: string;
    basicOfCommission: string;
}

export default function TreatyConfigurationFormComponent() {
    const router = useRouter();
    const [treatyTypes, setTreatyTypes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [tableRows, setTableRows] = useState<TreatyConfigRow[]>([]);

    // Filter states
    const [period, setPeriod] = useState('2025-2026');
    const [productCode, setProductCode] = useState('FIRE01');
    const [riskGrade, setRiskGrade] = useState('1');
    const [accountingLOB, setAccountingLOB] = useState('Fire');
    const [riskCategory, setRiskCategory] = useState('Fire');
    const [type, setType] = useState('Per Risk');

    useEffect(() => {
        // Fetch treaty types when component mounts
        const subscription = treatyTypeService.getAllTreatyTypes({
            page: 0,
            size: 100,
            summary: true,
            active: true
        }).subscribe({
            next: (response: any) => {
                const types = response?.content || [];
                setTreatyTypes(types);

                // Initialize table rows based on treaty types
                const rows: TreatyConfigRow[] = types.map((type: any, index: number) => ({
                    priorityOrder: index + 1,
                    treatyTypeId: type.id.toString(),
                    treatyTypeName: type.tretyType || type.treatyTypeName || '',
                    asPerTreaty: '',
                    limitAsPerTreaty: '',
                    riCommission: '',
                    basicOfCommission: ''
                }));
                setTableRows(rows);
                setLoading(false);
            },
            error: (error) => {
                console.error('Error fetching treaty types:', error);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleClose = () => {
        router.push('/reinsurance/treaty-configuration?mode=viewList');
    };

    const handleSave = () => {
        // Prepare payload
        const payload = tableRows.map(row => ({
            priorityOrder: row.priorityOrder,
            treatyTypeId: row.treatyTypeId,
            asPerTreaty: parseFloat(row.asPerTreaty) || 0,
            limitAsPerTreaty: parseFloat(row.limitAsPerTreaty) || 0,
            riCommission: parseFloat(row.riCommission) || 0,
            basicOfCommission: row.basicOfCommission
        }));

        setSaving(true);

        const subscription = reinsuranceService.saveTreatyConfiguration(payload).subscribe({
            next: (response) => {
                console.log('Treaty configuration saved successfully', response);
                setSaving(false);
                handleClose();
            },
            error: (error) => {
                console.error('Error saving treaty configuration:', error);
                setSaving(false);
            }
        });

        return () => subscription.unsubscribe();
    };

    const handleRowChange = (index: number, field: keyof TreatyConfigRow, value: string) => {
        setTableRows(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ padding: 3 }}>
            <Card sx={{ p: 4, borderRadius: 2, boxShadow: 2 }}>
                <Typography variant="h6" mb={3} fontWeight={500}>
                    Create Treaty Config
                </Typography>

                {/* Filter Dropdowns */}
                <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <FormControl size="small" sx={{ minWidth: 160, flex: '1 1 auto', maxWidth: 200 }}>
                        <InputLabel>Period</InputLabel>
                        <Select
                            value={period}
                            label="Period"
                            onChange={(e) => setPeriod(e.target.value)}
                        >
                            <MenuItem value="2025-2026">2025-2026</MenuItem>
                            <MenuItem value="2024-2025">2024-2025</MenuItem>
                            <MenuItem value="2023-2024">2023-2024</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl size="small" sx={{ minWidth: 160, flex: '1 1 auto', maxWidth: 200 }}>
                        <InputLabel>Product code</InputLabel>
                        <Select
                            value={productCode}
                            label="Product code"
                            onChange={(e) => setProductCode(e.target.value)}
                        >
                            <MenuItem value="FIRE01">FIRE01</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl size="small" sx={{ minWidth: 160, flex: '1 1 auto', maxWidth: 200 }}>
                        <InputLabel>Risk Grade</InputLabel>
                        <Select
                            value={riskGrade}
                            label="Risk Grade"
                            onChange={(e) => setRiskGrade(e.target.value)}
                        >
                            <MenuItem value="1">1</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl size="small" sx={{ minWidth: 160, flex: '1 1 auto', maxWidth: 200 }}>
                        <InputLabel>Accounting LOB</InputLabel>
                        <Select
                            value={accountingLOB}
                            label="Accounting LOB"
                            onChange={(e) => setAccountingLOB(e.target.value)}
                        >
                            <MenuItem value="Fire">Fire</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl size="small" sx={{ minWidth: 160, flex: '1 1 auto', maxWidth: 200 }}>
                        <InputLabel>Risk Category</InputLabel>
                        <Select
                            value={riskCategory}
                            label="Risk Category"
                            onChange={(e) => setRiskCategory(e.target.value)}
                        >
                            <MenuItem value="Fire">Fire</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl size="small" sx={{ minWidth: 160, flex: '1 1 auto', maxWidth: 200 }}>
                        <InputLabel>Type</InputLabel>
                        <Select
                            value={type}
                            label="Type"
                            onChange={(e) => setType(e.target.value)}
                        >
                            <MenuItem value="Per Risk">Per Risk</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                <TableContainer component={Paper} sx={{ mb: 3 }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                <TableCell sx={{ fontWeight: 600 }}>Priority Order</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Treaty Type</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>As per treaty (%)</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Limit as per treaty</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>RI Commission (%)</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Basis Of Commission</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tableRows.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{row.priorityOrder}</TableCell>
                                    <TableCell>{row.treatyTypeName}</TableCell>
                                    <TableCell>
                                        <TextField
                                            size="small"
                                            type="number"
                                            value={row.asPerTreaty}
                                            onChange={(e) => handleRowChange(index, 'asPerTreaty', e.target.value)}
                                            placeholder="0"
                                            fullWidth
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            size="small"
                                            type="number"
                                            value={row.limitAsPerTreaty}
                                            onChange={(e) => handleRowChange(index, 'limitAsPerTreaty', e.target.value)}
                                            placeholder="0"
                                            fullWidth
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            size="small"
                                            type="number"
                                            value={row.riCommission}
                                            onChange={(e) => handleRowChange(index, 'riCommission', e.target.value)}
                                            placeholder="0"
                                            fullWidth
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            size="small"
                                            value={row.basicOfCommission}
                                            onChange={(e) => handleRowChange(index, 'basicOfCommission', e.target.value)}
                                            placeholder="Enter basis"
                                            fullWidth
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <Button variant="outlined" onClick={handleClose} disabled={saving}>
                        Close
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSave}
                        sx={{ background: '#D80E51' }}
                        disabled={saving}
                    >
                        {saving ? <CircularProgress size={24} color="inherit" /> : 'Save'}
                    </Button>
                </Box>
            </Card>
        </Box>
    );
}
