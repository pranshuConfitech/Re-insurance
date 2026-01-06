import { Card, Box, Typography, Button, FormControl, Select, MenuItem, TextField, IconButton, Grid } from '@mui/material';
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
    reinsurers, brokers, blockId, treatyId,
    onAddReinsurer, onDeleteReinsurer, onReinsurerChange,
    onAddBroker, onDeleteBroker, onBrokerChange,
    onAddBrokerReinsurer, onDeleteBrokerReinsurer, onBrokerReinsurerChange
}: ParticipatingSectionProps) => {
    return (
        <Card sx={{
            p: 2.5,
            mt: 3,
            backgroundColor: '#fef9f3',
            border: '1px solid #ffe0b2',
            borderRadius: '10px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                <Typography variant="subtitle2" sx={{
                    color: '#e65100',
                    fontWeight: 600,
                    fontSize: '12px',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase'
                }}>
                    Participating Reinsurers / Brokers
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={() => onAddReinsurer(blockId, treatyId)}
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
                        onClick={() => onAddBroker(blockId, treatyId)}
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

            {/* Reinsurers */}
            {reinsurers.map((reinsurer, index) => (
                <Card key={reinsurer.id} sx={{
                    p: 2,
                    mb: 1.5,
                    backgroundColor: 'white',
                    border: '1px solid #e3f2fd',
                    borderRadius: '8px',
                    position: 'relative',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
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
                                        onChange={(e) => onReinsurerChange(blockId, treatyId, reinsurer.id, 'reinsurer', e.target.value)}
                                        displayEmpty
                                        sx={{ backgroundColor: 'white' }}
                                    >
                                        <MenuItem value="">Select Reinsurer...</MenuItem>
                                        <MenuItem value="Reinsurer 1">Reinsurer 1</MenuItem>
                                        <MenuItem value="Reinsurer 2">Reinsurer 2</MenuItem>
                                        <MenuItem value="Reinsurer 3">Reinsurer 3</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <FieldLabel>Share (%)</FieldLabel>
                                <TextField
                                    fullWidth
                                    size="small"
                                    value={reinsurer.share}
                                    onChange={(e) => onReinsurerChange(blockId, treatyId, reinsurer.id, 'share', e.target.value)}
                                    sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }}
                                />
                            </Grid>
                        </Grid>
                        <IconButton
                            size="small"
                            color="error"
                            onClick={() => onDeleteReinsurer(blockId, treatyId, reinsurer.id)}
                        >
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </Card>
            ))}

            {/* Brokers */}
            {brokers.map((broker, index) => (
                <Card key={broker.id} sx={{ p: 2, mb: 1.5, backgroundColor: '#fff3e0', border: '1px solid #f57c00' }}>
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
                                        onChange={(e) => onBrokerChange(blockId, treatyId, broker.id, 'broker', e.target.value)}
                                        displayEmpty
                                        sx={{ backgroundColor: 'white' }}
                                    >
                                        <MenuItem value="">Select Broker...</MenuItem>
                                        <MenuItem value="Broker 1">Broker 1</MenuItem>
                                        <MenuItem value="Broker 2">Broker 2</MenuItem>
                                        <MenuItem value="Broker 3">Broker 3</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <FieldLabel>Share (%)</FieldLabel>
                                <TextField
                                    fullWidth
                                    size="small"
                                    value={broker.share}
                                    onChange={(e) => onBrokerChange(blockId, treatyId, broker.id, 'share', e.target.value)}
                                    sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }}
                                />
                            </Grid>
                        </Grid>
                        <IconButton
                            size="small"
                            color="error"
                            onClick={() => onDeleteBroker(blockId, treatyId, broker.id)}
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
                                onClick={() => onAddBrokerReinsurer(blockId, treatyId, broker.id)}
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
                                                onChange={(e) => onBrokerReinsurerChange(blockId, treatyId, broker.id, reinsurer.id, 'reinsurer', e.target.value)}
                                                displayEmpty
                                                sx={{ backgroundColor: 'white' }}
                                            >
                                                <MenuItem value="">Select Reinsurer...</MenuItem>
                                                <MenuItem value="Reinsurer 1">Reinsurer 1</MenuItem>
                                                <MenuItem value="Reinsurer 2">Reinsurer 2</MenuItem>
                                                <MenuItem value="Reinsurer 3">Reinsurer 3</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            placeholder="%"
                                            value={reinsurer.share}
                                            onChange={(e) => onBrokerReinsurerChange(blockId, treatyId, broker.id, reinsurer.id, 'share', e.target.value)}
                                            sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }}
                                        />
                                    </Grid>
                                </Grid>
                                <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => onDeleteBrokerReinsurer(blockId, treatyId, broker.id, reinsurer.id)}
                                >
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        ))}
                    </Box>
                </Card>
            ))}
        </Card>
    );
};
