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

interface RiskLimitLine {
    id: string;
    productLOB: string;
    productCode: string;
    accountingLOB: string;
    riskCategory: string;
    riskGrade: string;
    cessionRate: string;
    quotaCessionMaxCapacity: string;
    retentionGrossNet: string;
    surplusCapacity: string;
    capacityCalculateInXL: string;
    perRiskRecoveryLimit: string;
    eventLimit: string;
    cashCallLimit: string;
    lossAdviceLimit: string;
    premiumPaymentWarranty: string;
    alertDays: string;
    reinsurers: Reinsurer[];
    brokers: Broker[];
}

interface RiskLimitsSectionProps {
    riskLimitLines: RiskLimitLine[];
    blockId: string;
    treatyId: string;
    onAddLine: (blockId: string, treatyId: string) => void;
    onDeleteLine: (blockId: string, treatyId: string, lineId: string) => void;
    onLineChange: (blockId: string, treatyId: string, lineId: string, field: string, value: string) => void;
    onAddReinsurer: (blockId: string, treatyId: string, lineId: string) => void;
    onDeleteReinsurer: (blockId: string, treatyId: string, lineId: string, reinsurerId: string) => void;
    onReinsurerChange: (blockId: string, treatyId: string, lineId: string, reinsurerId: string, field: string, value: string) => void;
    onAddBroker: (blockId: string, treatyId: string, lineId: string) => void;
    onDeleteBroker: (blockId: string, treatyId: string, lineId: string, brokerId: string) => void;
    onBrokerChange: (blockId: string, treatyId: string, lineId: string, brokerId: string, field: string, value: string) => void;
    onAddBrokerReinsurer: (blockId: string, treatyId: string, lineId: string, brokerId: string) => void;
    onDeleteBrokerReinsurer: (blockId: string, treatyId: string, lineId: string, brokerId: string, reinsurerId: string) => void;
    onBrokerReinsurerChange: (blockId: string, treatyId: string, lineId: string, brokerId: string, reinsurerId: string, field: string, value: string) => void;
}

export const RiskLimitsSection = ({
    riskLimitLines, blockId, treatyId,
    onAddLine, onDeleteLine, onLineChange,
    onAddReinsurer, onDeleteReinsurer, onReinsurerChange,
    onAddBroker, onDeleteBroker, onBrokerChange,
    onAddBrokerReinsurer, onDeleteBrokerReinsurer, onBrokerReinsurerChange
}: RiskLimitsSectionProps) => {
    return (
        <Card sx={{ p: 2, backgroundColor: '#1e3a5f', mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 600, fontSize: '12px', letterSpacing: '0.5px' }}>
                    RISK & LIMITS DETAILS
                </Typography>
                <Button
                    variant="contained"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => onAddLine(blockId, treatyId)}
                    sx={{
                        backgroundColor: '#28a745',
                        '&:hover': { backgroundColor: '#218838' },
                        textTransform: 'none',
                        fontSize: '11px',
                        fontWeight: 600,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                >
                    Add Line
                </Button>
            </Box>

            {riskLimitLines.map((line, index) => (
                <Card key={line.id} sx={{ p: 2.5, mb: 2, backgroundColor: 'white', borderLeft: '4px solid #007bff', position: 'relative' }}>
                    {riskLimitLines.length > 1 && (
                        <IconButton
                            size="small"
                            color="error"
                            onClick={() => onDeleteLine(blockId, treatyId, line.id)}
                            sx={{ position: 'absolute', top: 8, right: 8 }}
                        >
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    )}

                    <Typography variant="caption" sx={{ color: '#666', fontWeight: 600, mb: 1.5, display: 'block', fontSize: '11px' }}>
                        Risk & Limit Line {index + 1}
                    </Typography>

                    <Grid container spacing={3}>
                        {/* Row 1 - 4 fields */}
                        <Grid item xs={12} sm={6} md={3}>
                            <FieldLabel>Product LOB</FieldLabel>
                            <FormControl fullWidth size="small">
                                <Select value={line.productLOB} onChange={(e) => onLineChange(blockId, treatyId, line.id, 'productLOB', e.target.value)} displayEmpty sx={{ backgroundColor: 'white' }}>
                                    <MenuItem value="">Select...</MenuItem>
                                    <MenuItem value="Fire">Fire</MenuItem>
                                    <MenuItem value="Marine">Marine</MenuItem>
                                    <MenuItem value="Motor">Motor</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <FieldLabel>Product Code</FieldLabel>
                            <TextField fullWidth size="small" value={line.productCode} onChange={(e) => onLineChange(blockId, treatyId, line.id, 'productCode', e.target.value)} sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }} />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <FieldLabel>Accounting LOB</FieldLabel>
                            <FormControl fullWidth size="small">
                                <Select value={line.accountingLOB} onChange={(e) => onLineChange(blockId, treatyId, line.id, 'accountingLOB', e.target.value)} displayEmpty sx={{ backgroundColor: 'white' }}>
                                    <MenuItem value="">Select...</MenuItem>
                                    <MenuItem value="Fire">Fire</MenuItem>
                                    <MenuItem value="Marine">Marine</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <FieldLabel>Risk Category</FieldLabel>
                            <FormControl fullWidth size="small">
                                <Select value={line.riskCategory} onChange={(e) => onLineChange(blockId, treatyId, line.id, 'riskCategory', e.target.value)} displayEmpty sx={{ backgroundColor: 'white' }}>
                                    <MenuItem value="">Select...</MenuItem>
                                    <MenuItem value="Comm">Comm</MenuItem>
                                    <MenuItem value="Residential">Residential</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Row 2 - 4 fields */}
                        <Grid item xs={12} sm={6} md={3}>
                            <FieldLabel>Risk Grade</FieldLabel>
                            <TextField fullWidth size="small" value={line.riskGrade} onChange={(e) => onLineChange(blockId, treatyId, line.id, 'riskGrade', e.target.value)} sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }} />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <FieldLabel>Cession Rate %</FieldLabel>
                            <TextField fullWidth size="small" value={line.cessionRate} onChange={(e) => onLineChange(blockId, treatyId, line.id, 'cessionRate', e.target.value)} sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }} />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <FieldLabel>Quota Cession Max Capacity</FieldLabel>
                            <TextField fullWidth size="small" value={line.quotaCessionMaxCapacity} onChange={(e) => onLineChange(blockId, treatyId, line.id, 'quotaCessionMaxCapacity', e.target.value)} sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }} />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <FieldLabel>Retention (Gross/Net)</FieldLabel>
                            <TextField fullWidth size="small" value={line.retentionGrossNet} onChange={(e) => onLineChange(blockId, treatyId, line.id, 'retentionGrossNet', e.target.value)} sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }} />
                        </Grid>

                        {/* Row 3 - 4 fields */}
                        <Grid item xs={12} sm={6} md={3}>
                            <FieldLabel>Surplus Capacity</FieldLabel>
                            <TextField fullWidth size="small" value={line.surplusCapacity} onChange={(e) => onLineChange(blockId, treatyId, line.id, 'surplusCapacity', e.target.value)} sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }} />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <FieldLabel>Capacity(Calculate In XL)</FieldLabel>
                            <FormControl fullWidth size="small">
                                <Select value={line.capacityCalculateInXL} onChange={(e) => onLineChange(blockId, treatyId, line.id, 'capacityCalculateInXL', e.target.value)} displayEmpty sx={{ backgroundColor: 'white' }}>
                                    <MenuItem value="">Select...</MenuItem>
                                    <MenuItem value="Yes">Yes</MenuItem>
                                    <MenuItem value="No">No</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <FieldLabel>Per Risk Recovery Limit</FieldLabel>
                            <TextField fullWidth size="small" value={line.perRiskRecoveryLimit} onChange={(e) => onLineChange(blockId, treatyId, line.id, 'perRiskRecoveryLimit', e.target.value)} sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }} />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <FieldLabel>Event Limit</FieldLabel>
                            <TextField fullWidth size="small" value={line.eventLimit} onChange={(e) => onLineChange(blockId, treatyId, line.id, 'eventLimit', e.target.value)} sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }} />
                        </Grid>

                        {/* Row 4 - 3 fields */}
                        <Grid item xs={12} sm={6} md={3}>
                            <FieldLabel>Cash Call Limit</FieldLabel>
                            <TextField fullWidth size="small" value={line.cashCallLimit} onChange={(e) => onLineChange(blockId, treatyId, line.id, 'cashCallLimit', e.target.value)} sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }} />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <FieldLabel>Loss Advice Limit</FieldLabel>
                            <TextField fullWidth size="small" value={line.lossAdviceLimit} onChange={(e) => onLineChange(blockId, treatyId, line.id, 'lossAdviceLimit', e.target.value)} sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }} />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <FieldLabel>Premium Payment Warranty</FieldLabel>
                            <TextField fullWidth size="small" value={line.premiumPaymentWarranty} onChange={(e) => onLineChange(blockId, treatyId, line.id, 'premiumPaymentWarranty', e.target.value)} sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }} />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <FieldLabel>Alert Days</FieldLabel>
                            <TextField fullWidth size="small" value={line.alertDays} onChange={(e) => onLineChange(blockId, treatyId, line.id, 'alertDays', e.target.value)} sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }} />
                        </Grid>
                    </Grid>

                    <ParticipatingSection
                        reinsurers={line.reinsurers}
                        brokers={line.brokers}
                        blockId={blockId}
                        treatyId={treatyId}
                        lineId={line.id}
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
        </Card>
    );
};
