import { Card, Grid, TextField, FormControl, Select, MenuItem, Box, Typography, Button, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { FieldLabel } from './FieldLabel';
import { ParticipatingSection } from './ParticipatingSection';

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
    treatyId: string;
    onAddLayer: (blockId: string, treatyId: string) => void;
    onDeleteLayer: (blockId: string, treatyId: string, layerId: string) => void;
    onLayerChange: (blockId: string, treatyId: string, layerId: string, field: string, value: string) => void;
    onAddReinsurer: (blockId: string, treatyId: string, layerId: string) => void;
    onDeleteReinsurer: (blockId: string, treatyId: string, layerId: string, reinsurerId: string) => void;
    onReinsurerChange: (blockId: string, treatyId: string, layerId: string, reinsurerId: string, field: string, value: string) => void;
    onAddBroker: (blockId: string, treatyId: string, layerId: string) => void;
    onDeleteBroker: (blockId: string, treatyId: string, layerId: string, brokerId: string) => void;
    onBrokerChange: (blockId: string, treatyId: string, layerId: string, brokerId: string, field: string, value: string) => void;
    onAddBrokerReinsurer: (blockId: string, treatyId: string, layerId: string, brokerId: string) => void;
    onDeleteBrokerReinsurer: (blockId: string, treatyId: string, layerId: string, brokerId: string, reinsurerId: string) => void;
    onBrokerReinsurerChange: (blockId: string, treatyId: string, layerId: string, brokerId: string, reinsurerId: string, field: string, value: string) => void;
}

export const RiskScoreLayersSection = ({
    layerLines, blockId, treatyId,
    onAddLayer, onDeleteLayer, onLayerChange,
    onAddReinsurer, onDeleteReinsurer, onReinsurerChange,
    onAddBroker, onDeleteBroker, onBrokerChange,
    onAddBrokerReinsurer, onDeleteBrokerReinsurer, onBrokerReinsurerChange
}: RiskScoreLayersSectionProps) => {
    return (
        <Card sx={{
            p: 0,
            backgroundColor: 'white',
            mb: 2,
            borderRadius: '12px',
            border: '1px solid #e0e0e0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            overflow: 'hidden'
        }}>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 2.5,
                backgroundColor: '#f8f9fa',
                borderBottom: '2px solid #e9ecef'
            }}>
                <Typography variant="subtitle2" sx={{
                    color: '#495057',
                    fontWeight: 600,
                    fontSize: '13px',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase'
                }}>
                    RISK SCORE & LAYERS (TABLE)
                </Typography>
                <Button
                    variant="contained"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => onAddLayer(blockId, treatyId)}
                    sx={{
                        backgroundColor: '#28a745',
                        '&:hover': { backgroundColor: '#218838' },
                        textTransform: 'none',
                        fontSize: '12px',
                        fontWeight: 600,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        borderRadius: '6px'
                    }}
                >
                    Add Layer
                </Button>
            </Box>

            <Box sx={{ p: 3 }}>
                {layerLines.map((layer, index) => (
                    <Card key={layer.id} sx={{
                        p: 3,
                        mb: 2.5,
                        backgroundColor: 'white',
                        borderRadius: '10px',
                        border: '1px solid #e9ecef',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
                        position: 'relative'
                    }}>
                        {layerLines.length > 1 && (
                            <IconButton
                                size="small"
                                color="error"
                                onClick={() => onDeleteLayer(blockId, treatyId, layer.id)}
                                sx={{ position: 'absolute', top: 12, right: 12, zIndex: 1 }}
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        )}

                        <Typography variant="caption" sx={{ color: '#666', fontWeight: 600, mb: 1.5, display: 'block', fontSize: '11px' }}>
                            Layer {index + 1}
                        </Typography>

                        <Grid container spacing={3}>
                            {/* Row 1 - 4 fields */}
                            <Grid item xs={12} sm={6} md={3}>
                                <FieldLabel>Product LOB</FieldLabel>
                                <FormControl fullWidth size="small">
                                    <Select value={layer.productLOB} onChange={(e) => onLayerChange(blockId, treatyId, layer.id, 'productLOB', e.target.value)} displayEmpty sx={{ backgroundColor: 'white' }}>
                                        <MenuItem value="">Select...</MenuItem>
                                        <MenuItem value="Fire">Fire</MenuItem>
                                        <MenuItem value="Marine">Marine</MenuItem>
                                        <MenuItem value="Motor">Motor</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <FieldLabel>Product Code</FieldLabel>
                                <TextField fullWidth size="small" value={layer.productCode} onChange={(e) => onLayerChange(blockId, treatyId, layer.id, 'productCode', e.target.value)} sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }} />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <FieldLabel>Accounting LOB</FieldLabel>
                                <FormControl fullWidth size="small">
                                    <Select value={layer.accountingLOB} onChange={(e) => onLayerChange(blockId, treatyId, layer.id, 'accountingLOB', e.target.value)} displayEmpty sx={{ backgroundColor: 'white' }}>
                                        <MenuItem value="">Select...</MenuItem>
                                        <MenuItem value="Fire">Fire</MenuItem>
                                        <MenuItem value="Marine">Marine</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <FieldLabel>Risk Category</FieldLabel>
                                <FormControl fullWidth size="small">
                                    <Select value={layer.riskCategory} onChange={(e) => onLayerChange(blockId, treatyId, layer.id, 'riskCategory', e.target.value)} displayEmpty sx={{ backgroundColor: 'white' }}>
                                        <MenuItem value="">Select...</MenuItem>
                                        <MenuItem value="Comm">Comm</MenuItem>
                                        <MenuItem value="Residential">Residential</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* Row 2 - 4 fields */}
                            <Grid item xs={12} sm={6} md={3}>
                                <FieldLabel>Risk Grade</FieldLabel>
                                <TextField fullWidth size="small" value={layer.riskGrade} onChange={(e) => onLayerChange(blockId, treatyId, layer.id, 'riskGrade', e.target.value)} sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }} />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <FieldLabel>Loss Occur Deductibility</FieldLabel>
                                <FormControl fullWidth size="small">
                                    <Select value={layer.lossOccurDeductibility} onChange={(e) => onLayerChange(blockId, treatyId, layer.id, 'lossOccurDeductibility', e.target.value)} displayEmpty sx={{ backgroundColor: 'white' }}>
                                        <MenuItem value="">Select...</MenuItem>
                                        <MenuItem value="Deductible">Deductible</MenuItem>
                                        <MenuItem value="Non-Deductible">Non-Deductible</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <FieldLabel>Loss Limit</FieldLabel>
                                <TextField fullWidth size="small" value={layer.lossLimit} onChange={(e) => onLayerChange(blockId, treatyId, layer.id, 'lossLimit', e.target.value)} sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }} />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <FieldLabel>Share Of Occurrence Deduction</FieldLabel>
                                <TextField fullWidth size="small" value={layer.shareOfOccurrenceDeduction} onChange={(e) => onLayerChange(blockId, treatyId, layer.id, 'shareOfOccurrenceDeduction', e.target.value)} sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }} />
                            </Grid>

                            {/* Row 3 - 4 fields */}
                            <Grid item xs={12} sm={6} md={3}>
                                <FieldLabel>Available Reinstated SI</FieldLabel>
                                <TextField fullWidth size="small" value={layer.availableReinstatedSI} onChange={(e) => onLayerChange(blockId, treatyId, layer.id, 'availableReinstatedSI', e.target.value)} sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }} />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <FieldLabel>Annual Agg Limit (Zone)</FieldLabel>
                                <TextField fullWidth size="small" value={layer.annualAggLimit} onChange={(e) => onLayerChange(blockId, treatyId, layer.id, 'annualAggLimit', e.target.value)} sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }} />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <FieldLabel>Shared Agg Limit (Zone)</FieldLabel>
                                <TextField fullWidth size="small" value={layer.annualAggAmount} onChange={(e) => onLayerChange(blockId, treatyId, layer.id, 'annualAggAmount', e.target.value)} sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }} />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <FieldLabel>Agg Claim Amount</FieldLabel>
                                <TextField fullWidth size="small" value={layer.aggClaimAmount} onChange={(e) => onLayerChange(blockId, treatyId, layer.id, 'aggClaimAmount', e.target.value)} sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }} />
                            </Grid>

                            {/* Row 4 - 2 fields */}
                            <Grid item xs={12} sm={6} md={3}>
                                <FieldLabel>Local Native Layer</FieldLabel>
                                <TextField fullWidth size="small" value={layer.localNativeLayer} onChange={(e) => onLayerChange(blockId, treatyId, layer.id, 'localNativeLayer', e.target.value)} sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }} />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <FieldLabel>Transaction Limit Ccy</FieldLabel>
                                <TextField fullWidth size="small" value={layer.transactionLimitCcy} onChange={(e) => onLayerChange(blockId, treatyId, layer.id, 'transactionLimitCcy', e.target.value)} sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }} />
                            </Grid>
                        </Grid>

                        <ParticipatingSection
                            reinsurers={layer.reinsurers}
                            brokers={layer.brokers}
                            blockId={blockId}
                            treatyId={treatyId}
                            lineId={layer.id}
                            onAddReinsurer={onAddReinsurer}
                            onDeleteReinsurer={onDeleteReinsurer}
                            onReinsurerChange={onReinsurerChange}
                            onAddBroker={onAddBroker}
                            onDeleteBroker={onDeleteBroker}
                            onBrokerChange={onBrokerChange}
                            onAddBrokerReinsurer={onAddBrokerReinsurer}
                            onDeleteBrokerReinsurer={onDeleteBrokerReinsurer}
                            onBrokerReinsurerChange={onBrokerReinsurerChange}
                        />
                    </Card>
                ))}
            </Box>
        </Card>
    );
};
