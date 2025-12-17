'use client';
import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
    Box,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    IconButton,
    Typography
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Toast } from 'primereact/toast';
import { ReinsuranceService } from '@/services/remote-api/api/reinsurance-services/reinsurance.service';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const reinsuranceService = new ReinsuranceService();

interface ParticipantData {
    [key: string]: string;
}

interface XolLayer {
    layerNo: number;
    xolTreaty: string;
    lossDeduction: string;
    lossLimit: string;
    capacity: string;
    participants: ParticipantData;
}

export default function XolTreatyMasterFormComponent() {
    const router = useRouter();
    const toast: any = useRef(null);
    const [participantCount, setParticipantCount] = useState(1);

    // Filter states
    const [period, setPeriod] = useState('2025-2026');
    const [productCode, setProductCode] = useState('FIRE01');
    const [riskGrade, setRiskGrade] = useState('1');
    const [accountingLOB, setAccountingLOB] = useState('Fire');
    const [riskCategory, setRiskCategory] = useState('Fire');
    const [type, setType] = useState('Per Risk');

    const [layers, setLayers] = useState<XolLayer[]>([
        { layerNo: 1, xolTreaty: '', lossDeduction: '', lossLimit: '', capacity: '', participants: { participant1: '' } },
        { layerNo: 2, xolTreaty: '', lossDeduction: '', lossLimit: '', capacity: '', participants: { participant1: '' } },
        { layerNo: 3, xolTreaty: '', lossDeduction: '', lossLimit: '', capacity: '', participants: { participant1: '' } },
        { layerNo: 4, xolTreaty: '', lossDeduction: '', lossLimit: '', capacity: '', participants: { participant1: '' } }
    ]);

    const handleBack = () => {
        router.push('/reinsurance/treaty-configuration?mode=viewList&tab=xol');
    };

    const handleAddParticipant = () => {
        const newParticipantCount = participantCount + 1;
        setParticipantCount(newParticipantCount);

        // Add new participant column to all existing layers
        setLayers(layers.map(layer => ({
            ...layer,
            participants: {
                ...layer.participants,
                [`participant${newParticipantCount}`]: ''
            }
        })));
    };

    const handleAddLayer = () => {
        const newLayerNo = layers.length + 1;
        const newParticipants: ParticipantData = {};

        // Initialize all participants for the new layer
        for (let i = 1; i <= participantCount; i++) {
            newParticipants[`participant${i}`] = '';
        }

        setLayers([
            ...layers,
            {
                layerNo: newLayerNo,
                xolTreaty: '',
                lossDeduction: '',
                lossLimit: '',
                capacity: '',
                participants: newParticipants
            }
        ]);
    };

    const handleDeleteLayer = (index: number) => {
        if (layers.length > 1) {
            const updatedLayers = layers.filter((_, i) => i !== index);
            // Renumber layers
            const renumberedLayers = updatedLayers.map((layer, idx) => ({
                ...layer,
                layerNo: idx + 1
            }));
            setLayers(renumberedLayers);
        }
    };

    const handleFieldChange = (index: number, field: keyof XolLayer, value: string) => {
        const updatedLayers = [...layers];
        if (field === 'participants') return; // Handle participants separately
        updatedLayers[index] = {
            ...updatedLayers[index],
            [field]: value
        };
        setLayers(updatedLayers);
    };

    const handleParticipantChange = (layerIndex: number, participantKey: string, value: string) => {
        const updatedLayers = [...layers];
        updatedLayers[layerIndex] = {
            ...updatedLayers[layerIndex],
            participants: {
                ...updatedLayers[layerIndex].participants,
                [participantKey]: value
            }
        };
        setLayers(updatedLayers);
    };

    const handleSave = () => {
        // Transform participants object to match API structure (paticipant1, paticipant2, etc.)
        const payload = layers.map(layer => {
            const xolPaticipantDTO: { [key: string]: string } = {};

            // Convert participant1, participant2... to paticipant1, paticipant2... (note the typo in API)
            Object.entries(layer.participants).forEach(([key, value]) => {
                const participantNumber = key.replace('participant', '');
                xolPaticipantDTO[`paticipant${participantNumber}`] = value as string;
            });

            return {
                layerNumber: layer.layerNo,
                xolTreaty: layer.xolTreaty,
                lossDeduction: parseFloat(layer.lossDeduction) || 0,
                lossLimit: parseFloat(layer.lossLimit) || 0,
                capacity: parseFloat(layer.capacity) || 0,
                xolPaticipantDTO: xolPaticipantDTO,
                xolIncurredClaimRecovery: 0 // Add default value or make it configurable
            };
        });

        console.log('XOL Treaty Payload:', JSON.stringify(payload, null, 2));

        // Call the API
        reinsuranceService.saveXolTreaty(payload).subscribe({
            next: (response) => {
                console.log('Success:', response);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'XOL Treaty saved successfully',
                    life: 3000
                });
                setTimeout(() => {
                    router.push('/reinsurance/treaty-configuration?mode=viewList&tab=xol');
                }, 1000);
            },
            error: (error) => {
                console.error('Error:', error);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: error?.message || 'Failed to save XOL Treaty',
                    life: 3000
                });
            }
        });
    };

    return (
        <Box>
            <Toast ref={toast} />
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <IconButton onClick={handleBack} sx={{ mr: 2 }}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    XOL Treaty
                </Typography>
            </Box>

            {/* Filter Dropdowns */}
            <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <FormControl size="small" sx={{ minWidth: 180 }}>
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
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddParticipant}
                    sx={{
                        backgroundColor: '#28a745',
                        '&:hover': { backgroundColor: '#218838' }
                    }}
                >
                    Add Participant
                </Button>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddLayer}
                    sx={{
                        backgroundColor: '#007bff',
                        '&:hover': { backgroundColor: '#0056b3' }
                    }}
                >
                    Add XOL Layer
                </Button>
            </Box>

            {/* Table */}
            <TableContainer component={Paper} sx={{ mb: 3, maxHeight: '600px', overflow: 'auto' }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 700, backgroundColor: '#f8f9fa', minWidth: 100 }}>Layer No</TableCell>
                            <TableCell sx={{ fontWeight: 700, backgroundColor: '#f8f9fa', minWidth: 150 }}>XOL Treaty</TableCell>
                            <TableCell sx={{ fontWeight: 700, backgroundColor: '#f8f9fa', minWidth: 150 }}>Loss Deduction</TableCell>
                            <TableCell sx={{ fontWeight: 700, backgroundColor: '#f8f9fa', minWidth: 150 }}>Loss Limit</TableCell>
                            <TableCell sx={{ fontWeight: 700, backgroundColor: '#f8f9fa', minWidth: 150 }}>Capacity</TableCell>
                            {Array.from({ length: participantCount }, (_, i) => (
                                <TableCell key={i} sx={{ fontWeight: 700, backgroundColor: '#f8f9fa', minWidth: 150 }}>
                                    Participant {i + 1}
                                </TableCell>
                            ))}
                            <TableCell sx={{ fontWeight: 700, backgroundColor: '#f8f9fa', minWidth: 80 }}>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {layers.map((layer, index) => (
                            <TableRow key={index}>
                                <TableCell>{layer.layerNo}</TableCell>
                                <TableCell>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        value={layer.xolTreaty}
                                        onChange={(e) => handleFieldChange(index, 'xolTreaty', e.target.value)}
                                        placeholder="XOL Treaty"
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        type="number"
                                        value={layer.lossDeduction}
                                        onChange={(e) => handleFieldChange(index, 'lossDeduction', e.target.value)}
                                        placeholder="0.00"
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        type="number"
                                        value={layer.lossLimit}
                                        onChange={(e) => handleFieldChange(index, 'lossLimit', e.target.value)}
                                        placeholder="0.00"
                                    />
                                </TableCell>
                                <TableCell>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        type="number"
                                        value={layer.capacity}
                                        onChange={(e) => handleFieldChange(index, 'capacity', e.target.value)}
                                        placeholder="0.00"
                                    />
                                </TableCell>
                                {Array.from({ length: participantCount }, (_, i) => {
                                    const participantKey = `participant${i + 1}`;
                                    return (
                                        <TableCell key={i}>
                                            <TextField
                                                size="small"
                                                fullWidth
                                                type="number"
                                                value={layer.participants[participantKey] || ''}
                                                onChange={(e) => handleParticipantChange(index, participantKey, e.target.value)}
                                                placeholder="0.00"
                                            />
                                        </TableCell>
                                    );
                                })}
                                <TableCell>
                                    <IconButton
                                        color="error"
                                        onClick={() => handleDeleteLayer(index)}
                                        disabled={layers.length === 1}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Save Button */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                    variant="outlined"
                    onClick={handleBack}
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSave}
                    sx={{
                        backgroundColor: '#dc3545',
                        '&:hover': { backgroundColor: '#c82333' }
                    }}
                >
                    Save
                </Button>
            </Box>
        </Box>
    );
}

