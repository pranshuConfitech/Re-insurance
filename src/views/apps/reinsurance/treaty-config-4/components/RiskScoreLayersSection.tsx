import { Card, Grid, TextField, FormControl, Select, MenuItem, Box, Typography, Button, IconButton } from '@mui/material';
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

interface LayerLine {
    id: string;
    productLOB: string;
    productCode: string;
    accountingLOB: string;
    riskCategory: string;
    riskGrade: string;
    lossOccurDeductibility: string;
    lossLimit: string;
    shareOfOccurrenceDeduction: string;
    availableReinstatedSI: string;
    annualAggLimit: string;
    annualAggAmount: string;
    aggClaimAmount: string;
    localNativeLayer: string;
    transactionLimitCcy: string;
    reinsurers: Reinsurer[];
    brokers: Broker[];
}

interface RiskScoreLayersSectionProps {
    layerLines: LayerLine[];
    blockId: string;
    onAddLayer: (blockId: string) => void;
    onDeleteLayer: (blockId: string, layerId: string) => void;
    onLayerChange: (blockId: string, layerId: string, field: string, value: string) => void;
}

export const RiskScoreLayersSection = ({
    layerLines, blockId,
    onAddLayer, onDeleteLayer, onLayerChange
}: RiskScoreLayersSectionProps) => {
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
                    Risk Score & Layers
                </Typography>
                <Button
                    variant="contained"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => onAddLayer(blockId)}
                    sx={{
                        backgroundColor: '#28a745',
                        '&:hover': { backgroundColor: '#218838' },
                        textTransform: 'none',
                        fontSize: '13px',
                        fontWeight: 600,
                        borderRadius: '8px',
                        px: 2,
                        py: 1
                    }}
                >
                    Add Layer
                </Button>
            </Box>

            <Box sx={{ p: 3 }}>
                {layerLines.map((layer, index) => (
                    <Box key={layer.id} sx={{
                        p: 3,
                        mb: index < layerLines.length - 1 ? 3 : 0,
                        backgroundColor: '#fff',
                        borderRadius: '12px',
                        position: 'relative',
                        border: 'none',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                    }}>
                        {layerLines.length > 1 && (
                            <IconButton
                                size="small"
                                color="error"
                                onClick={() => onDeleteLayer(blockId, layer.id)}
                                sx={{
                                    position: 'absolute',
                                    top: 12,
                                    right: 12,
                                    zIndex: 1,
                                    backgroundColor: '#fff3f3',
                                    '&:hover': { backgroundColor: '#ffe6e6' }
                                }}
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        )}

                        <Typography variant="subtitle2" sx={{
                            color: '#626BDA',
                            fontWeight: 600,
                            mb: 3,
                            fontSize: '14px',
                            borderBottom: '1px solid #f0f0f0',
                            pb: 1
                        }}>
                            Layer {index + 1}
                        </Typography>

                        <Grid container spacing={3}>
                            {/* Row 1 - 4 fields */}
                            <Grid item xs={12} sm={6} md={3}>
                                <FieldLabel>Product LOB</FieldLabel>
                                <FormControl fullWidth size="small">
                                    <Select value={layer.productLOB} onChange={(e) => onLayerChange(blockId, layer.id, 'productLOB', e.target.value)} displayEmpty sx={{ backgroundColor: 'white' }}>
                                        <MenuItem value="">Select...</MenuItem>
                                        <MenuItem value="PROPERTY">Property</MenuItem>
                                        <MenuItem value="CASUALTY">Casualty</MenuItem>
                                        <MenuItem value="MARINE">Marine</MenuItem>
                                        <MenuItem value="AVIATION">Aviation</MenuItem>
                                        <MenuItem value="FIRE">Fire</MenuItem>
                                        <MenuItem value="Fire">Fire</MenuItem>
                                        <MenuItem value="Marine">Marine</MenuItem>
                                        <MenuItem value="Motor">Motor</MenuItem>
                                        {layer.productLOB && !['', 'PROPERTY', 'CASUALTY', 'MARINE', 'AVIATION', 'FIRE', 'Fire', 'Marine', 'Motor'].includes(layer.productLOB) && (
                                            <MenuItem value={layer.productLOB}>{layer.productLOB}</MenuItem>
                                        )}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <FieldLabel>Product Code</FieldLabel>
                                <TextField fullWidth size="small" value={layer.productCode} onChange={(e) => onLayerChange(blockId, layer.id, 'productCode', e.target.value)} sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }} />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <FieldLabel>Accounting LOB</FieldLabel>
                                <FormControl fullWidth size="small">
                                    <Select value={layer.accountingLOB} onChange={(e) => onLayerChange(blockId, layer.id, 'accountingLOB', e.target.value)} displayEmpty sx={{ backgroundColor: 'white' }}>
                                        <MenuItem value="">Select...</MenuItem>
                                        <MenuItem value="PROP">Property</MenuItem>
                                        <MenuItem value="CASUALTY">Casualty</MenuItem>
                                        <MenuItem value="MARINE">Marine</MenuItem>
                                        <MenuItem value="AVIATION">Aviation</MenuItem>
                                        <MenuItem value="FIRE">Fire</MenuItem>
                                        <MenuItem value="Fire">Fire</MenuItem>
                                        <MenuItem value="Marine">Marine</MenuItem>
                                        {layer.accountingLOB && !['', 'PROP', 'CASUALTY', 'MARINE', 'AVIATION', 'FIRE', 'Fire', 'Marine'].includes(layer.accountingLOB) && (
                                            <MenuItem value={layer.accountingLOB}>{layer.accountingLOB}</MenuItem>
                                        )}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <FieldLabel>Risk Category</FieldLabel>
                                <FormControl fullWidth size="small">
                                    <Select value={layer.riskCategory} onChange={(e) => onLayerChange(blockId, layer.id, 'riskCategory', e.target.value)} displayEmpty sx={{ backgroundColor: 'white' }}>
                                        <MenuItem value="">Select...</MenuItem>
                                        <MenuItem value="HIGH">High</MenuItem>
                                        <MenuItem value="MEDIUM">Medium</MenuItem>
                                        <MenuItem value="LOW">Low</MenuItem>
                                        <MenuItem value="PROPERTY">Property</MenuItem>
                                        <MenuItem value="CASUALTY">Casualty</MenuItem>
                                        <MenuItem value="CAT">Catastrophe</MenuItem>
                                        <MenuItem value="Comm">Commercial</MenuItem>
                                        <MenuItem value="Residential">Residential</MenuItem>
                                        {layer.riskCategory && !['', 'HIGH', 'MEDIUM', 'LOW', 'PROPERTY', 'CASUALTY', 'CAT', 'Comm', 'Residential'].includes(layer.riskCategory) && (
                                            <MenuItem value={layer.riskCategory}>{layer.riskCategory}</MenuItem>
                                        )}
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* Row 2 - 4 fields */}
                            <Grid item xs={12} sm={6} md={3}>
                                <FieldLabel>Risk Grade</FieldLabel>
                                <TextField fullWidth size="small" value={layer.riskGrade} onChange={(e) => onLayerChange(blockId, layer.id, 'riskGrade', e.target.value)} sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }} />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <FieldLabel>Loss Occur Deductibility</FieldLabel>
                                <TextField
                                    fullWidth
                                    size="small"
                                    type="number"
                                    value={layer.lossOccurDeductibility}
                                    onChange={(e) => onLayerChange(blockId, layer.id, 'lossOccurDeductibility', e.target.value)}
                                    sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <FieldLabel>Loss Limit</FieldLabel>
                                <TextField
                                    fullWidth
                                    size="small"
                                    type="number"
                                    value={layer.lossLimit}
                                    onChange={(e) => onLayerChange(blockId, layer.id, 'lossLimit', e.target.value)}
                                    sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <FieldLabel>Share Of Occurrence Deduction</FieldLabel>
                                <TextField
                                    fullWidth
                                    size="small"
                                    type="number"
                                    value={layer.shareOfOccurrenceDeduction}
                                    onChange={(e) => onLayerChange(blockId, layer.id, 'shareOfOccurrenceDeduction', e.target.value)}
                                    sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }}
                                />
                            </Grid>

                            {/* Row 3 - 4 fields */}
                            <Grid item xs={12} sm={6} md={3}>
                                <FieldLabel>Available Reinstated SI</FieldLabel>
                                <TextField
                                    fullWidth
                                    size="small"
                                    type="number"
                                    value={layer.availableReinstatedSI}
                                    onChange={(e) => onLayerChange(blockId, layer.id, 'availableReinstatedSI', e.target.value)}
                                    sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <FieldLabel>Annual Agg Limit (Zone)</FieldLabel>
                                <TextField
                                    fullWidth
                                    size="small"
                                    type="number"
                                    value={layer.annualAggLimit}
                                    onChange={(e) => onLayerChange(blockId, layer.id, 'annualAggLimit', e.target.value)}
                                    sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <FieldLabel>Shared Agg Limit (Zone)</FieldLabel>
                                <TextField
                                    fullWidth
                                    size="small"
                                    type="number"
                                    value={layer.annualAggAmount}
                                    onChange={(e) => onLayerChange(blockId, layer.id, 'annualAggAmount', e.target.value)}
                                    sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <FieldLabel>Agg Claim Amount</FieldLabel>
                                <TextField
                                    fullWidth
                                    size="small"
                                    type="number"
                                    value={layer.aggClaimAmount}
                                    onChange={(e) => onLayerChange(blockId, layer.id, 'aggClaimAmount', e.target.value)}
                                    sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }}
                                />
                            </Grid>

                            {/* Row 4 - 2 fields */}
                            <Grid item xs={12} sm={6} md={3}>
                                <FieldLabel>Local Native Layer</FieldLabel>
                                <TextField
                                    fullWidth
                                    size="small"
                                    value={layer.localNativeLayer}
                                    onChange={(e) => onLayerChange(blockId, layer.id, 'localNativeLayer', e.target.value)}
                                    sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <FieldLabel>Transaction Limit Ccy</FieldLabel>
                                <TextField
                                    fullWidth
                                    size="small"
                                    type="number"
                                    value={layer.transactionLimitCcy}
                                    onChange={(e) => onLayerChange(blockId, layer.id, 'transactionLimitCcy', e.target.value)}
                                    sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};
