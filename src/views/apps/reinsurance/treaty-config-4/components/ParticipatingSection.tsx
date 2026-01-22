import { Box, Typography, Button, FormControl, Select, MenuItem, TextField, IconButton, Grid, InputLabel } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { makeStyles } from '@mui/styles';
import { useState, useEffect } from 'react';
import { ReinsuranceService } from '@/services/remote-api/api/reinsurance-services/reinsurance.service';

const reinsuranceService = new ReinsuranceService();

interface Reinsurer {
    id: string;
    reinsurer: string;
    reinsurerCode?: string;
    share: string;
}

interface Broker {
    id: string;
    broker: string;
    brokerCode?: string;
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

const useStyles = makeStyles((theme: any) => ({
    formControl: {
        width: '100%',
        '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            transition: 'all 0.3s ease',
            '&:hover': {
                boxShadow: '0 2px 8px rgba(216, 14, 81, 0.1)'
            },
            '&.Mui-focused': {
                boxShadow: '0 4px 12px rgba(216, 14, 81, 0.15)'
            }
        },
        '& .MuiInputLabel-root.Mui-focused': {
            color: '#D80E51'
        },
        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#D80E51',
            borderWidth: '2px'
        }
    },
    textField: {
        width: '100%',
        '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            transition: 'all 0.3s ease',
            '&:hover': {
                boxShadow: '0 2px 8px rgba(216, 14, 81, 0.1)'
            },
            '&.Mui-focused': {
                boxShadow: '0 4px 12px rgba(216, 14, 81, 0.15)'
            }
        },
        '& .MuiInputLabel-root.Mui-focused': {
            color: '#D80E51'
        },
        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#D80E51',
            borderWidth: '2px'
        }
    }
}));

export const ParticipatingSection = ({
    reinsurers, brokers, blockId, treatyId, lineId,
    onAddReinsurer, onDeleteReinsurer, onReinsurerChange,
    onAddBroker, onDeleteBroker, onBrokerChange,
    onAddBrokerReinsurer, onDeleteBrokerReinsurer, onBrokerReinsurerChange
}: ParticipatingSectionProps) => {
    const classes = useStyles();

    // Use lineId if provided, otherwise use treatyId
    const effectiveId = lineId || treatyId;

    // State for API dropdown data
    const [apiReinsurers, setApiReinsurers] = useState<any[]>([]);
    const [apiBrokers, setApiBrokers] = useState<any[]>([]);
    const [loadingReinsurers, setLoadingReinsurers] = useState(false);
    const [loadingBrokers, setLoadingBrokers] = useState(false);

    // Fetch reinsurers from API
    useEffect(() => {
        setLoadingReinsurers(true);
        reinsuranceService.getReinsurers({
            page: 0,
            size: 100, // Get more items for dropdown
            summary: true,
            active: true
        }).subscribe({
            next: (response) => {
                if (response && response.content && Array.isArray(response.content)) {
                    setApiReinsurers(response.content);
                } else {
                    console.warn('Invalid reinsurers response format:', response);
                    setApiReinsurers([]);
                }
                setLoadingReinsurers(false);
            },
            error: (error) => {
                console.error('Error fetching reinsurers:', error);
                setLoadingReinsurers(false);
                // Fallback to hardcoded values
                setApiReinsurers([
                    { reinsurerCode: 'HANNOVER_RE', reinsurerName: 'Hannover Re' },
                    { reinsurerCode: 'SWISS_RE', reinsurerName: 'Swiss Re' },
                    { reinsurerCode: 'MUNICH_RE', reinsurerName: 'Munich Re' },
                    { reinsurerCode: 'SCOR_RE', reinsurerName: 'SCOR Re' },
                    { reinsurerCode: 'LLOYDS', reinsurerName: 'Lloyd\'s of London' }
                ]);
            }
        });
    }, []);

    // Fetch brokers from API
    useEffect(() => {
        setLoadingBrokers(true);
        reinsuranceService.getBrokers({
            page: 0,
            size: 100, // Get more items for dropdown
            summary: true,
            active: true
        }).subscribe({
            next: (response) => {
                if (response && response.content && Array.isArray(response.content)) {
                    setApiBrokers(response.content);
                } else {
                    console.warn('Invalid brokers response format:', response);
                    setApiBrokers([]);
                }
                setLoadingBrokers(false);
            },
            error: (error) => {
                console.error('Error fetching brokers:', error);
                setLoadingBrokers(false);
                // Fallback to hardcoded values
                setApiBrokers([
                    { brokerCode: 'AON', brokerName: 'Aon' },
                    { brokerCode: 'MARSH', brokerName: 'Marsh' },
                    { brokerCode: 'WILLIS', brokerName: 'Willis Towers Watson' },
                    { brokerCode: 'GUY_CARPENTER', brokerName: 'Guy Carpenter' }
                ]);
            }
        });
    }, []);

    // Predefined reinsurer options (fallback)
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

    // Predefined broker options (fallback)
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

    // Get all unique reinsurer values from API and current data
    const getAllReinsurerValues = () => {
        const allValues = new Set<string>();

        // Add values from direct reinsurers
        reinsurers.forEach(r => {
            if (r.reinsurer && r.reinsurer.trim()) {
                allValues.add(r.reinsurer.trim());
            }
        });

        // Add values from broker reinsurers
        brokers.forEach(b => {
            b.reinsurers.forEach(br => {
                if (br.reinsurer && br.reinsurer.trim()) {
                    allValues.add(br.reinsurer.trim());
                }
            });
        });

        // Use API data if available, otherwise fallback to predefined
        const apiValues = apiReinsurers.length > 0
            ? apiReinsurers.map(r => r.reinsurerName || r.reinsurerCode).filter(name => name && name.trim())
            : predefinedReinsurers;

        // Add API values to the set (automatically removes duplicates)
        apiValues.forEach(value => {
            if (value && value.trim()) {
                allValues.add(value.trim());
            }
        });

        // Convert Set to Array and sort
        return Array.from(allValues).sort();
    };

    // Get all unique broker values from API and current data
    const getAllBrokerValues = () => {
        const allValues = new Set<string>();

        // Add values from current brokers
        brokers.forEach(b => {
            if (b.broker && b.broker.trim()) {
                allValues.add(b.broker.trim());
            }
        });

        // Use API data if available, otherwise fallback to predefined
        const apiValues = apiBrokers.length > 0
            ? apiBrokers.map(b => b.brokerName || b.brokerCode).filter(name => name && name.trim())
            : predefinedBrokers;

        // Add API values to the set (automatically removes duplicates)
        apiValues.forEach(value => {
            if (value && value.trim()) {
                allValues.add(value.trim());
            }
        });

        // Convert Set to Array and sort
        return Array.from(allValues).sort();
    };

    // Helper function to get participant code from API data
    const getParticipantCode = (participantName: string, participantType: 'REINSURER' | 'BROKER'): string => {
        if (!participantName || !participantName.trim()) {
            return '';
        }

        if (participantType === 'REINSURER') {
            const reinsurer = apiReinsurers.find(r =>
                r.reinsurerName === participantName || r.reinsurerCode === participantName
            );
            return reinsurer?.reinsurerCode || '';
        } else {
            const broker = apiBrokers.find(b =>
                b.brokerName === participantName || b.brokerCode === participantName
            );
            return broker?.brokerCode || '';
        }
    };

    // Enhanced change handlers that include participant codes
    const handleReinsurerChange = (blockId: string, treatyId: string | undefined, reinsurerId: string, field: string, value: string) => {
        if (field === 'reinsurer') {
            // When reinsurer name changes, also update the code
            const reinsurerCode = getParticipantCode(value, 'REINSURER');
            // Call the original handler for the name
            onReinsurerChange(blockId, treatyId, reinsurerId, field, value);
            // Also update the code if we have a way to do it
            // For now, we'll store it in the component state and use it in payload generation
        } else {
            onReinsurerChange(blockId, treatyId, reinsurerId, field, value);
        }
    };

    const handleBrokerChange = (blockId: string, treatyId: string | undefined, brokerId: string, field: string, value: string) => {
        if (field === 'broker') {
            // When broker name changes, also update the code
            const brokerCode = getParticipantCode(value, 'BROKER');
            // Call the original handler for the name
            onBrokerChange(blockId, treatyId, brokerId, field, value);
            // Also update the code if we have a way to do it
        } else {
            onBrokerChange(blockId, treatyId, brokerId, field, value);
        }
    };

    const handleBrokerReinsurerChange = (blockId: string, treatyId: string | undefined, brokerId: string, reinsurerId: string, field: string, value: string) => {
        if (field === 'reinsurer') {
            // When reinsurer name changes, also update the code
            const reinsurerCode = getParticipantCode(value, 'REINSURER');
            // Call the original handler for the name
            onBrokerReinsurerChange(blockId, treatyId, brokerId, reinsurerId, field, value);
        } else {
            onBrokerReinsurerChange(blockId, treatyId, brokerId, reinsurerId, field, value);
        }
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
                    Participants Reinsurance
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
                                    <FormControl className={classes.formControl} fullWidth>
                                        <InputLabel id={`reinsurer-label-${reinsurer.id}`}>Reinsurer</InputLabel>
                                        <Select
                                            labelId={`reinsurer-label-${reinsurer.id}`}
                                            id={`reinsurer-${reinsurer.id}`}
                                            name="reinsurer"
                                            label="Reinsurer"
                                            value={reinsurer.reinsurer}
                                            onChange={(e) => handleReinsurerChange(blockId, effectiveId, reinsurer.id, 'reinsurer', e.target.value)}
                                            disabled={loadingReinsurers}
                                        >
                                            <MenuItem value="">
                                                <em style={{ color: '#6c757d' }}>
                                                    {loadingReinsurers ? 'Loading reinsurers...' : 'Select Reinsurer...'}
                                                </em>
                                            </MenuItem>
                                            {availableReinsurers.map((reinsurerName, index) => (
                                                <MenuItem key={`reinsurer-${index}-${reinsurerName}`} value={reinsurerName}>
                                                    {reinsurerName}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        id={`reinsurerShare-${reinsurer.id}`}
                                        name="share"
                                        label="Share (%)"
                                        fullWidth
                                        value={reinsurer.share}
                                        onChange={(e) => onReinsurerChange(blockId, effectiveId, reinsurer.id, 'share', e.target.value)}
                                        className={classes.textField}
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
                                    <FormControl className={classes.formControl} fullWidth>
                                        <InputLabel id={`broker-label-${broker.id}`}>Broker</InputLabel>
                                        <Select
                                            labelId={`broker-label-${broker.id}`}
                                            id={`broker-${broker.id}`}
                                            name="broker"
                                            label="Broker"
                                            value={broker.broker}
                                            onChange={(e) => handleBrokerChange(blockId, effectiveId, broker.id, 'broker', e.target.value)}
                                            disabled={loadingBrokers}
                                        >
                                            <MenuItem value="">
                                                <em style={{ color: '#6c757d' }}>
                                                    {loadingBrokers ? 'Loading brokers...' : 'Select Broker...'}
                                                </em>
                                            </MenuItem>
                                            {availableBrokers.map((brokerName, index) => (
                                                <MenuItem key={`broker-${index}-${brokerName}`} value={brokerName}>
                                                    {brokerName}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        id={`brokerShare-${broker.id}`}
                                        name="share"
                                        label="Share (%)"
                                        fullWidth
                                        value={broker.share}
                                        onChange={(e) => onBrokerChange(blockId, effectiveId, broker.id, 'share', e.target.value)}
                                        className={classes.textField}
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
                                            <FormControl className={classes.formControl} fullWidth>
                                                <InputLabel id={`brokerReinsurer-label-${reinsurer.id}`}>Reinsurer</InputLabel>
                                                <Select
                                                    labelId={`brokerReinsurer-label-${reinsurer.id}`}
                                                    value={reinsurer.reinsurer}
                                                    label="Reinsurer"
                                                    onChange={(e) => handleBrokerReinsurerChange(blockId, effectiveId, broker.id, reinsurer.id, 'reinsurer', e.target.value)}
                                                    disabled={loadingReinsurers}
                                                >
                                                    <MenuItem value="">
                                                        <em style={{ color: '#6c757d' }}>
                                                            {loadingReinsurers ? 'Loading...' : 'Select Reinsurer...'}
                                                        </em>
                                                    </MenuItem>
                                                    {availableReinsurers.map((reinsurerName, index) => (
                                                        <MenuItem key={`broker-reinsurer-${index}-${reinsurerName}`} value={reinsurerName}>
                                                            {reinsurerName}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <TextField
                                                fullWidth
                                                placeholder="%"
                                                value={reinsurer.share}
                                                onChange={(e) => onBrokerReinsurerChange(blockId, effectiveId, broker.id, reinsurer.id, 'share', e.target.value)}
                                                className={classes.textField}
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
