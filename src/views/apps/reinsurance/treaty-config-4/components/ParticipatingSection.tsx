import { Box, Typography, Button, FormControl, Select, MenuItem, TextField, IconButton, Grid } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { FieldLabel } from './FieldLabel';

interface Reinsurer {
    id: string;
    reinsurer: string;
    share: string;
}

interface Broker {
    id: string;
    broker: string;
    share: string;
    reinsurers: Reinsurer[];
}

interface ParticipatingSectionProps {
    reinsurers: Reinsurer[];
    brokers: Broker[];
    blockId: string;
    treatyId?: string;
    lineId?: string;
    onAddReinsurer: (blockId: string, treatyId: string | undefined) => void;
    onDeleteReinsurer: (blockId: string, treatyId: string | undefined, reinsurerId: string) => void;
    onReinsurerChange: (blockId: string, treatyId: string | undefined, reinsurerId: string, field: string, value: string) => void;
    onAddBroker: (blockId: string, treatyId: string | undefined) => void;
    onDeleteBroker: (blockId: string, treatyId: string | undefined, brokerId: string) => void;
    onBrokerChange: (blockId: string, treatyId: string | undefined, brokerId: string, field: string, value: string) => void;
    onAddBrokerReinsurer: (blockId: string, treatyId: string | undefined, brokerId: string) => void;
    onDeleteBrokerReinsurer: (blockId: string, treatyId: string | undefined, brokerId: string, reinsurerId: string) => void;
    onBrokerReinsurerChange: (blockId: string, treatyId: string | undefined, brokerId: string, reinsurerId: string, field: string, value: string) => void;
}

export const ParticipatingSection = ({
    reinsurers, brokers, blockId, treatyId, lineId,
    onAddReinsurer, onDeleteReinsurer, onReinsurerChange,
    onAddBroker, onDeleteBroker, onBrokerChange,
    onAddBrokerReinsurer, onDeleteBrokerReinsurer, onBrokerReinsurerChange
}: ParticipatingSectionProps) => {
    // Use lineId if provided, otherwise use treatyId
    const effectiveId = lineId || treatyId;

    // Predefined reinsurer options
    const predefinedReinsurers = [
        'Hannover Re',
        'Swiss Re',
        'Munich Re',
        'SCOR Re',
        'Lloyd\'s of London',
        'Berkshire Hathaway Re',
        'Reinsurance Group of America',
        'China Re',
        'Korean Re',
        'Transatlantic Re'
    ];

    // Predefined broker options
    const predefinedBrokers = [
        'Aon',
        'Marsh',
        'Willis Towers Watson',
        'Guy Carpenter',
        'JLT Re',
        'BMS Group',
        'TigerRisk',
        'Gallagher Re',
        'Miller',
        'Cooper Gay Swett & Crawford'
    ];

    // Get all unique reinsurer values from current data
    const getAllReinsurerValues = () => {
        const currentValues = new Set<string>();

        // Add values from direct reinsurers
        reinsurers.forEach(r => {
            if (r.reinsurer && r.reinsurer.trim()) {
                currentValues.add(r.reinsurer.trim());
            }
        });

        // Add values from broker reinsurers
        brokers.forEach(b => {
            b.reinsurers.forEach(br => {
                if (br.reinsurer && br.reinsurer.trim()) {
                    currentValues.add(br.reinsurer.trim());
                }
            });
        });

        // Combine predefined and current values
        const allValues = [...predefinedReinsurers];
        currentValues.forEach(value => {
            if (!allValues.includes(value)) {
                allValues.push(value);
            }
        });

        return allValues.sort();
    };

    // Get all unique broker values from current data
    const getAllBrokerValues = () => {
        const currentValues = new Set<string>();

        // Add values from current brokers
        brokers.forEach(b => {
            if (b.broker && b.broker.trim()) {
                currentValues.add(b.broker.trim());
            }
        });

        // Combine predefined and current values
        const allValues = [...predefinedBrokers];
        currentValues.forEach(value => {
            if (!allValues.includes(value)) {
                allValues.push(value);
            }
        });

        return allValues.sort();
    };

    const availableReinsurers = getAllReinsurerValues();
    const availableBrokers = getAllBrokerValues();
    return (
        <Box sx={{
            backgroundColor: '#f8f9fa',
            borderRadius: '12px',
            overflow: 'hidden',
            mb: 3
        }}>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 3,
                backgroundColor: '#fff',
                borderBottom: '1px solid #e9ecef'
            }}>
                <Typography variant="h6" sx={{
                    color: '#495057',
                    fontWeight: 600,
                    fontSize: '16px'
                }}>
                    Participating Reinsurers / Brokers
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={() => onAddReinsurer(blockId, effectiveId)}
                        sx={{
                            textTransform: 'none',
                            fontSize: '11px',
                            fontWeight: 600,
                            borderColor: '#1976d2',
                            color: '#1976d2',
                            borderRadius: '6px',
                            '&:hover': {
                                borderColor: '#1976d2',
                                backgroundColor: '#e9ecef'
                            }
                        }}
                    >
                        Add Reinsurer
                    </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={() => onAddBroker(blockId, effectiveId)}
                        sx={{
                            textTransform: 'none',
                            fontSize: '11px',
                            fontWeight: 600,
                            borderColor: '#f57c00',
                            color: '#f57c00',
                            borderRadius: '6px',
                            '&:hover': {
                                borderColor: '#f57c00',
                                backgroundColor: '#e9ecef'
                            }
                        }}
                    >
                        Add Broker
                    </Button>
                </Box>
            </Box>

            <Box sx={{ p: 3 }}>
                {/* Reinsurers */}
                {reinsurers.map((reinsurer, index) => (
                    <Box key={reinsurer.id} sx={{
                        p: 3,
                        mb: 2,
                        backgroundColor: '#fff',
                        borderRadius: '12px',
                        position: 'relative',
                        border: 'none',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{
                                width: 28,
                                height: 28,
                                borderRadius: '6px',
                                backgroundColor: '#1976d2',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontWeight: 600,
                                fontSize: '12px'
                            }}>
                                RI
                            </Box>
                            <Grid container spacing={2} sx={{ flex: 1 }}>
                                <Grid item xs={12} sm={8}>
                                    <FieldLabel>Reinsurer</FieldLabel>
                                    <FormControl fullWidth size="small">
                                        <Select
                                            value={reinsurer.reinsurer}
                                            onChange={(e) => onReinsurerChange(blockId, effectiveId, reinsurer.id, 'reinsurer', e.target.value)}
                                            displayEmpty
                                            sx={{
                                                backgroundColor: '#fafafa',
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    border: '1px solid #e9ecef'
                                                },
                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                    border: '1px solid #626BDA'
                                                }
                                            }}
                                        >
                                            <MenuItem value="">Select Reinsurer...</MenuItem>
                                            {availableReinsurers.map((reinsurerName) => (
                                                <MenuItem key={reinsurerName} value={reinsurerName}>
                                                    {reinsurerName}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <FieldLabel>Share (%)</FieldLabel>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        value={reinsurer.share}
                                        onChange={(e) => onReinsurerChange(blockId, effectiveId, reinsurer.id, 'share', e.target.value)}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                backgroundColor: '#fafafa',
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    border: '1px solid #e9ecef'
                                                },
                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                    border: '1px solid #626BDA'
                                                }
                                            }
                                        }}
                                    />
                                </Grid>
                            </Grid>
                            <IconButton
                                size="small"
                                color="error"
                                onClick={() => onDeleteReinsurer(blockId, effectiveId, reinsurer.id)}
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    </Box>
                ))}

                {/* Brokers */}
                {brokers.map((broker, index) => (
                    <Box key={broker.id} sx={{
                        p: 3,
                        mb: 2,
                        backgroundColor: '#fff',
                        borderRadius: '12px',
                        border: 'none',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <Box sx={{
                                width: 32,
                                height: 32,
                                borderRadius: '6px',
                                backgroundColor: '#f57c00',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontWeight: 600,
                                fontSize: '12px'
                            }}>
                                BR
                            </Box>
                            <Grid container spacing={2} sx={{ flex: 1 }}>
                                <Grid item xs={12} sm={8}>
                                    <FieldLabel>Broker</FieldLabel>
                                    <FormControl fullWidth size="small">
                                        <Select
                                            value={broker.broker}
                                            onChange={(e) => onBrokerChange(blockId, effectiveId, broker.id, 'broker', e.target.value)}
                                            displayEmpty
                                            sx={{
                                                backgroundColor: '#fafafa',
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    border: '1px solid #e9ecef'
                                                },
                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                    border: '1px solid #626BDA'
                                                }
                                            }}
                                        >
                                            <MenuItem value="">Select Broker...</MenuItem>
                                            {availableBrokers.map((brokerName) => (
                                                <MenuItem key={brokerName} value={brokerName}>
                                                    {brokerName}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <FieldLabel>Share (%)</FieldLabel>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        value={broker.share}
                                        onChange={(e) => onBrokerChange(blockId, effectiveId, broker.id, 'share', e.target.value)}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                backgroundColor: '#fafafa',
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    border: '1px solid #e9ecef'
                                                },
                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                    border: '1px solid #626BDA'
                                                }
                                            }
                                        }}
                                    />
                                </Grid>
                            </Grid>
                            <IconButton
                                size="small"
                                color="error"
                                onClick={() => onDeleteBroker(blockId, effectiveId, broker.id)}
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Box>

                        {/* Broker's Reinsurers */}
                        <Box sx={{ ml: 5, mt: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography variant="caption" sx={{ color: '#666', fontWeight: 600, fontSize: '10px', textTransform: 'uppercase' }}>
                                    Reinsurer
                                </Typography>
                                <Button
                                    variant="text"
                                    size="small"
                                    startIcon={<AddIcon />}
                                    onClick={() => onAddBrokerReinsurer(blockId, effectiveId, broker.id)}
                                    sx={{
                                        textTransform: 'none',
                                        fontSize: '10px',
                                        color: '#d32f2f',
                                        fontWeight: 600,
                                        '&:hover': {
                                            backgroundColor: '#e9ecef',
                                            color: '#d32f2f'
                                        }
                                    }}
                                >
                                    Add Reinsurer
                                </Button>
                            </Box>

                            {broker.reinsurers.map((reinsurer) => (
                                <Box key={reinsurer.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <Grid container spacing={2} sx={{ flex: 1 }}>
                                        <Grid item xs={12} sm={8}>
                                            <FormControl fullWidth size="small">
                                                <Select
                                                    value={reinsurer.reinsurer}
                                                    onChange={(e) => onBrokerReinsurerChange(blockId, effectiveId, broker.id, reinsurer.id, 'reinsurer', e.target.value)}
                                                    displayEmpty
                                                    sx={{
                                                        backgroundColor: '#fafafa',
                                                        '& .MuiOutlinedInput-notchedOutline': {
                                                            border: '1px solid #e9ecef'
                                                        },
                                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                                            border: '1px solid #626BDA'
                                                        }
                                                    }}
                                                >
                                                    <MenuItem value="">Select Reinsurer...</MenuItem>
                                                    {availableReinsurers.map((reinsurerName) => (
                                                        <MenuItem key={reinsurerName} value={reinsurerName}>
                                                            {reinsurerName}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                placeholder="%"
                                                value={reinsurer.share}
                                                onChange={(e) => onBrokerReinsurerChange(blockId, effectiveId, broker.id, reinsurer.id, 'share', e.target.value)}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        backgroundColor: '#fafafa',
                                                        '& .MuiOutlinedInput-notchedOutline': {
                                                            border: '1px solid #e9ecef'
                                                        },
                                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                                            border: '1px solid #626BDA'
                                                        }
                                                    }
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                    <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() => onDeleteBrokerReinsurer(blockId, effectiveId, broker.id, reinsurer.id)}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};
