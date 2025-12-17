'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Box,
    Card,
    Typography,
    TextField,
    Button,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Autocomplete,
    Alert,
    Snackbar
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { ReinsuranceService } from '@/services/remote-api/api/reinsurance-services/reinsurance.service';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const reinsuranceService = new ReinsuranceService();

interface ReinsurerOption {
    id: string | number;
    reinsurerName: string;
    reinsurerCode: string;
}

interface BrokerOption {
    id: string | number;
    brokerName: string;
    brokerCode: string;
}

interface ChildReinsurer {
    id: number;
    reinsurerId: string | number;
    share: number | string;
}

interface ParticipantEntry {
    id: number;
    type: 'reinsurer' | 'broker';
    participantId: string | number;
    share: number | string;
    childReinsurers?: ChildReinsurer[];
}

interface SurplusParticipantRow {
    id: number;
    surplusParticipantId: string;
    surplusParticipant: string | number;
    share: number | string;
    participantEntries: ParticipantEntry[];
}

export default function SurplusParticipantFormComponent() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [reinsurerOptions, setReinsurerOptions] = useState<ReinsurerOption[]>([]);
    const [loadingReinsurers, setLoadingReinsurers] = useState(false);
    const [brokerOptions, setBrokerOptions] = useState<BrokerOption[]>([]);
    const [loadingBrokers, setLoadingBrokers] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [showError, setShowError] = useState(false);

    // Filter states
    const [period, setPeriod] = useState('2025-2026');
    const [productCode, setProductCode] = useState('FIRE01');
    const [riskGrade, setRiskGrade] = useState('1');
    const [accountingLOB, setAccountingLOB] = useState('Fire');
    const [riskCategory, setRiskCategory] = useState('Fire');
    const [type, setType] = useState('Per Risk');
    const [rows, setRows] = useState<SurplusParticipantRow[]>([
        {
            id: 0,
            surplusParticipantId: '',
            surplusParticipant: '' as string | number,
            share: '' as any,
            participantEntries: []
        }
    ]);

    // Fetch reinsurer and broker lists on component mount
    useEffect(() => {
        // Fetch reinsurers
        setLoadingReinsurers(true);
        const reinsurerSubscription = reinsuranceService.getReinsurers({
            page: 0,
            size: 100, // Fetch more items for dropdown
            summary: true,
            active: true
        }).subscribe({
            next: (response) => {
                if (response.content) {
                    setReinsurerOptions(response.content);
                }
                setLoadingReinsurers(false);
            },
            error: (error) => {
                console.error('Error fetching reinsurers:', error);
                setLoadingReinsurers(false);
            }
        });

        // Fetch brokers
        setLoadingBrokers(true);
        const brokerSubscription = reinsuranceService.getBrokers({
            page: 0,
            size: 100, // Fetch more items for dropdown
            summary: true,
            active: true
        }).subscribe({
            next: (response) => {
                if (response.content) {
                    setBrokerOptions(response.content);
                }
                setLoadingBrokers(false);
            },
            error: (error) => {
                console.error('Error fetching brokers:', error);
                setLoadingBrokers(false);
            }
        });

        return () => {
            reinsurerSubscription.unsubscribe();
            brokerSubscription.unsubscribe();
        };
    }, []);

    const handleClose = () => {
        router.push('/reinsurance/treaty-configuration?mode=viewList&tab=surplus');
    };

    const validateShares = (): { isValid: boolean; message: string } => {
        // Validate each row
        for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
            const row = rows[rowIndex];

            // Check if there are participant entries
            if (row.participantEntries.length === 0) {
                return {
                    isValid: false,
                    message: `Surplus Participant ${rowIndex + 1}: Please add at least one reinsurer or broker.`
                };
            }

            // Calculate total share of all participant entries (R1, B1, R2)
            const totalParentShare = row.participantEntries.reduce((sum, entry) => {
                const share = entry.share === '' || entry.share === null || entry.share === undefined ? 0 : Number(entry.share);
                return sum + share;
            }, 0);

            // Check if parent shares sum to 100%
            const tolerance = 0.01;
            if (Math.abs(totalParentShare - 100) > tolerance) {
                // Build detailed breakdown
                const breakdown = row.participantEntries.map((entry, idx) => {
                    const label = entry.type === 'reinsurer' ? 'R' : 'B';
                    const share = entry.share === '' || entry.share === null || entry.share === undefined ? 0 : Number(entry.share);
                    return `${label}${idx + 1}: ${share}%`;
                }).join(' + ');

                return {
                    isValid: false,
                    message: `Total share of all participants must equal 100%. Current: ${breakdown} = ${totalParentShare.toFixed(2)}%`
                };
            }

            // Validate broker child reinsurers
            let reinsurerCount = 0;
            let brokerCount = 0;

            for (let entryIndex = 0; entryIndex < row.participantEntries.length; entryIndex++) {
                const entry = row.participantEntries[entryIndex];

                // Count for proper labeling
                const label = entry.type === 'reinsurer' ? `R${++reinsurerCount}` : `B${++brokerCount}`;

                if (entry.type === 'broker') {
                    // Check if broker has child reinsurers
                    if (!entry.childReinsurers || entry.childReinsurers.length === 0) {
                        return {
                            isValid: false,
                            message: `${label}: Broker must have at least one child reinsurer.`
                        };
                    }

                    // Calculate total share of child reinsurers
                    const totalChildShare = entry.childReinsurers.reduce((sum, child) => {
                        const share = child.share === '' || child.share === null || child.share === undefined ? 0 : Number(child.share);
                        return sum + share;
                    }, 0);

                    // Check if child shares sum to 100%
                    if (Math.abs(totalChildShare - 100) > tolerance) {
                        // Build detailed breakdown for children
                        const childBreakdown = entry.childReinsurers.map((child, idx) => {
                            const share = child.share === '' || child.share === null || child.share === undefined ? 0 : Number(child.share);
                            return `${share}%`;
                        }).join(' + ');

                        return {
                            isValid: false,
                            message: `${label}: Child reinsurers' shares must equal 100%. Current: ${childBreakdown} = ${totalChildShare.toFixed(2)}%`
                        };
                    }
                }
            }
        }

        return { isValid: true, message: '' };
    };

    const handleSave = () => {
        // Validate shares before saving
        // const validation = validateShares();
        // if (!validation.isValid) {
        //     setErrorMessage(validation.message);
        //     setShowError(true);
        //     return;
        // }

        setSaving(true);

        // Transform the data to match API payload structure
        // First object: the main surplus participant with empty participatingReinsurers
        // Subsequent objects: each participant entry (reinsurer or broker) as separate surplus participants
        const payload = rows.flatMap(row => {
            const result = [];

            // First object: Main surplus participant with its share and empty participatingReinsurers
            result.push({
                id: 0,
                surplusParticipantId: row.surplusParticipantId || '',
                surplusParticipant: row.surplusParticipant,
                share: row.share === '' ? 0 : Number(row.share),
                participatingReinsurers: []
            });

            // Subsequent objects: Each participant entry becomes a separate surplus participant
            row.participantEntries.forEach(entry => {
                result.push({
                    id: entry.id,
                    surplusParticipantId: '',
                    surplusParticipant: entry.participantId,
                    share: entry.share === '' ? 0 : Number(entry.share),
                    participatingReinsurers: entry.type === 'broker' && entry.childReinsurers
                        ? entry.childReinsurers.map(child => ({
                            id: child.id,
                            participatingReinsurer: child.reinsurerId,
                            participatingReinsurerShare: child.share === '' ? 0 : Number(child.share)
                        }))
                        : []
                });
            });

            return result;
        });

        console.log('Payload to save:', payload);

        const subscription = reinsuranceService.saveSurplusParticipant(payload).subscribe({
            next: (response) => {
                console.log('Surplus participant saved successfully', response);
                setSaving(false);
                handleClose();
            },
            error: (error) => {
                console.error('Error saving surplus participant:', error);
                setErrorMessage('Failed to save surplus participant. Please try again.');
                setShowError(true);
                setSaving(false);
            }
        });

        return () => subscription.unsubscribe();
    };

    const handleRemoveRow = (index: number) => {
        setRows(rows.filter((_, i) => i !== index));
    };

    const handleRowChange = (index: number, field: keyof SurplusParticipantRow, value: any) => {
        setRows(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    const handleAddReinsurerEntry = (rowIndex: number) => {
        setRows(prev => {
            const updated = [...prev];
            updated[rowIndex].participantEntries.push({
                id: 0,
                type: 'reinsurer',
                participantId: '' as string | number,
                share: '' as any
            });
            return updated;
        });
    };

    const handleAddBrokerEntry = (rowIndex: number) => {
        setRows(prev => {
            const updated = [...prev];
            updated[rowIndex].participantEntries.push({
                id: 0,
                type: 'broker',
                participantId: '' as string | number,
                share: '' as any,
                childReinsurers: []
            });
            return updated;
        });
    };

    const handleRemoveParticipantEntry = (rowIndex: number, entryIndex: number) => {
        setRows(prev => {
            const updated = [...prev];
            updated[rowIndex].participantEntries = updated[rowIndex].participantEntries.filter((_, i) => i !== entryIndex);
            return updated;
        });
    };

    const handleParticipantEntryChange = (rowIndex: number, entryIndex: number, field: keyof ParticipantEntry, value: any) => {
        setRows(prev => {
            const updated = [...prev];
            updated[rowIndex].participantEntries[entryIndex] = {
                ...updated[rowIndex].participantEntries[entryIndex],
                [field]: value
            };
            return updated;
        });
    };

    const handleAddChildReinsurer = (rowIndex: number, entryIndex: number) => {
        setRows(prev => {
            const updated = [...prev];
            if (updated[rowIndex].participantEntries[entryIndex].type === 'broker') {
                updated[rowIndex].participantEntries[entryIndex].childReinsurers =
                    updated[rowIndex].participantEntries[entryIndex].childReinsurers || [];
                updated[rowIndex].participantEntries[entryIndex].childReinsurers!.push({
                    id: 0,
                    reinsurerId: '' as string | number,
                    share: '' as any
                });
            }
            return updated;
        });
    };

    const handleRemoveChildReinsurer = (rowIndex: number, entryIndex: number, childIndex: number) => {
        setRows(prev => {
            const updated = [...prev];
            if (updated[rowIndex].participantEntries[entryIndex].childReinsurers) {
                updated[rowIndex].participantEntries[entryIndex].childReinsurers =
                    updated[rowIndex].participantEntries[entryIndex].childReinsurers!.filter((_, i) => i !== childIndex);
            }
            return updated;
        });
    };

    const handleChildReinsurerChange = (rowIndex: number, entryIndex: number, childIndex: number, field: keyof ChildReinsurer, value: any) => {
        setRows(prev => {
            const updated = [...prev];
            if (updated[rowIndex].participantEntries[entryIndex].childReinsurers) {
                updated[rowIndex].participantEntries[entryIndex].childReinsurers![childIndex] = {
                    ...updated[rowIndex].participantEntries[entryIndex].childReinsurers![childIndex],
                    [field]: value
                };
            }
            return updated;
        });
    };

    const getSelectedSurplusParticipants = (currentRowIndex: number) => {
        return rows
            .filter((_, index) => index !== currentRowIndex)
            .map(row => row.surplusParticipant)
            .filter(id => id !== '');
    };

    const getSelectedParticipants = (rowIndex: number, currentEntryIndex: number, type: 'reinsurer' | 'broker') => {
        return rows[rowIndex].participantEntries
            .filter((_, index) => index !== currentEntryIndex)
            .filter(entry => entry.type === type)
            .map(entry => entry.participantId)
            .filter(id => id !== '');
    };

    const getSelectedChildReinsurers = (rowIndex: number, entryIndex: number, currentChildIndex: number) => {
        const entry = rows[rowIndex].participantEntries[entryIndex];
        if (entry.type !== 'broker' || !entry.childReinsurers) return [];
        return entry.childReinsurers
            .filter((_, index) => index !== currentChildIndex)
            .map(child => child.reinsurerId)
            .filter(id => id !== '');
    };

    return (
        <Box sx={{ padding: 3 }}>
            <Card sx={{ p: 4, borderRadius: 2, boxShadow: 2 }}>
                <Typography variant="h6" mb={3} fontWeight={500}>
                    Create Surplus Participant
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

                {rows.map((row, rowIndex) => (
                    <Box key={rowIndex} sx={{ mb: 4, p: 3, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="subtitle1" fontWeight={600}>
                                Surplus Participant {rowIndex + 1}
                            </Typography>
                            {rows.length > 1 && (
                                <IconButton onClick={() => handleRemoveRow(rowIndex)} color="error" size="small">
                                    <Delete />
                                </IconButton>
                            )}
                        </Box>

                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
                            <Autocomplete
                                options={reinsurerOptions}
                                getOptionLabel={(option) => option.reinsurerName}
                                getOptionKey={(option) => `reinsurer-${option.id}`}
                                getOptionDisabled={(option) => getSelectedSurplusParticipants(rowIndex).includes(option.id)}
                                value={reinsurerOptions.find(opt => opt.id === row.surplusParticipant) || null}
                                onChange={(_, newValue) => {
                                    handleRowChange(rowIndex, 'surplusParticipant', newValue?.id || '');
                                }}
                                loading={loadingReinsurers}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Surplus Participant"
                                        placeholder="Select Reinsurer"
                                    />
                                )}
                                fullWidth
                            />
                            <TextField
                                label="Share (%)"
                                type="number"
                                value={row.share}
                                onChange={(e) => handleRowChange(rowIndex, 'share', e.target.value === '' ? '' : parseFloat(e.target.value))}
                                fullWidth
                            />
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="subtitle2" fontWeight={600}>
                                Participating Reinsurers
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Button
                                    startIcon={<Add />}
                                    onClick={() => handleAddReinsurerEntry(rowIndex)}
                                    variant="outlined"
                                    size="small"
                                    sx={{
                                        borderColor: '#1976d2',
                                        color: '#1976d2',
                                        '&:hover': {
                                            borderColor: '#1565c0',
                                            backgroundColor: '#e3f2fd'
                                        }
                                    }}
                                >
                                    Add Reinsurer
                                </Button>
                                <Button
                                    startIcon={<Add />}
                                    onClick={() => handleAddBrokerEntry(rowIndex)}
                                    variant="outlined"
                                    size="small"
                                    sx={{
                                        borderColor: '#ed6c02',
                                        color: '#ed6c02',
                                        '&:hover': {
                                            borderColor: '#e65100',
                                            backgroundColor: '#fff3e0'
                                        }
                                    }}
                                >
                                    Add Broker
                                </Button>
                            </Box>
                        </Box>

                        {/* Display participant entries */}
                        {row.participantEntries.map((entry, entryIndex) => (
                            <Box
                                key={entryIndex}
                                sx={{
                                    mb: 2,
                                    p: 2,
                                    border: '1px solid #e0e0e0',
                                    borderRadius: 1,
                                    backgroundColor: entry.type === 'broker' ? '#fff8f0' : '#f0f8ff'
                                }}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="body2" fontWeight={600}>
                                        {entry.type === 'reinsurer' ? 'R' : 'B'}{entryIndex + 1}
                                    </Typography>
                                    <IconButton onClick={() => handleRemoveParticipantEntry(rowIndex, entryIndex)} color="error" size="small">
                                        <Delete fontSize="small" />
                                    </IconButton>
                                </Box>

                                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: entry.type === 'broker' ? 2 : 0 }}>
                                    {entry.type === 'reinsurer' ? (
                                        <Autocomplete
                                            size="small"
                                            options={reinsurerOptions}
                                            getOptionLabel={(option) => option.reinsurerName}
                                            getOptionKey={(option) => `reinsurer-${option.id}`}
                                            getOptionDisabled={(option) => getSelectedParticipants(rowIndex, entryIndex, 'reinsurer').includes(option.id)}
                                            value={reinsurerOptions.find(opt => opt.id === entry.participantId) || null}
                                            onChange={(_, newValue) => {
                                                handleParticipantEntryChange(rowIndex, entryIndex, 'participantId', newValue?.id || '');
                                            }}
                                            loading={loadingReinsurers}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Surplus Participation"
                                                    placeholder="Select Reinsurer"
                                                />
                                            )}
                                            fullWidth
                                        />
                                    ) : (
                                        <Autocomplete
                                            size="small"
                                            options={brokerOptions}
                                            getOptionLabel={(option) => option.brokerName}
                                            getOptionKey={(option) => `broker-${option.id}`}
                                            getOptionDisabled={(option) => getSelectedParticipants(rowIndex, entryIndex, 'broker').includes(option.id)}
                                            value={brokerOptions.find(opt => opt.id === entry.participantId) || null}
                                            onChange={(_, newValue) => {
                                                handleParticipantEntryChange(rowIndex, entryIndex, 'participantId', newValue?.id || '');
                                            }}
                                            loading={loadingBrokers}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Surplus Participation"
                                                    placeholder="Select Broker"
                                                />
                                            )}
                                            fullWidth
                                        />
                                    )}
                                    <TextField
                                        size="small"
                                        label="Share (%)"
                                        type="number"
                                        value={entry.share}
                                        onChange={(e) => handleParticipantEntryChange(rowIndex, entryIndex, 'share', e.target.value === '' ? '' : parseFloat(e.target.value))}
                                        fullWidth
                                    />
                                </Box>

                                {/* Child reinsurers for broker type */}
                                {entry.type === 'broker' && (
                                    <>
                                        {entry.childReinsurers && entry.childReinsurers.length > 0 && (
                                            <TableContainer component={Paper} sx={{ mb: 1 }}>
                                                <Table size="small">
                                                    <TableHead>
                                                        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                                            <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Reinsurer</TableCell>
                                                            <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>Share (%)</TableCell>
                                                            <TableCell sx={{ fontWeight: 600, width: 60, fontSize: '0.75rem' }}>Action</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {entry.childReinsurers.map((child, childIndex) => (
                                                            <TableRow key={childIndex}>
                                                                <TableCell>
                                                                    <Autocomplete
                                                                        size="small"
                                                                        options={reinsurerOptions}
                                                                        getOptionLabel={(option) => option.reinsurerName}
                                                                        getOptionKey={(option) => `child-reinsurer-${option.id}`}
                                                                        getOptionDisabled={(option) => getSelectedChildReinsurers(rowIndex, entryIndex, childIndex).includes(option.id)}
                                                                        value={reinsurerOptions.find(opt => opt.id === child.reinsurerId) || null}
                                                                        onChange={(_, newValue) => {
                                                                            handleChildReinsurerChange(rowIndex, entryIndex, childIndex, 'reinsurerId', newValue?.id || '');
                                                                        }}
                                                                        loading={loadingReinsurers}
                                                                        renderInput={(params) => (
                                                                            <TextField
                                                                                {...params}
                                                                                placeholder="Select Reinsurer"
                                                                            />
                                                                        )}
                                                                        fullWidth
                                                                    />
                                                                </TableCell>
                                                                <TableCell>
                                                                    <TextField
                                                                        size="small"
                                                                        type="number"
                                                                        value={child.share}
                                                                        onChange={(e) => handleChildReinsurerChange(rowIndex, entryIndex, childIndex, 'share', e.target.value === '' ? '' : parseFloat(e.target.value))}
                                                                        fullWidth
                                                                    />
                                                                </TableCell>
                                                                <TableCell>
                                                                    <IconButton onClick={() => handleRemoveChildReinsurer(rowIndex, entryIndex, childIndex)} color="error" size="small">
                                                                        <Delete fontSize="small" />
                                                                    </IconButton>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        )}
                                        <Button
                                            startIcon={<Add />}
                                            onClick={() => handleAddChildReinsurer(rowIndex, entryIndex)}
                                            variant="text"
                                            size="small"
                                        >
                                            Add Reinsurer
                                        </Button>
                                    </>
                                )}
                            </Box>
                        ))}
                    </Box>
                ))}

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
                        {saving ? 'Saving...' : 'Save'}
                    </Button>
                </Box>
            </Card>

            {/* Error Snackbar */}
            <Snackbar
                open={showError}
                autoHideDuration={6000}
                onClose={() => setShowError(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={() => setShowError(false)} severity="error" sx={{ width: '100%' }}>
                    {errorMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
}
