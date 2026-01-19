import { Card, Grid, TextField, FormControl, Select, MenuItem, Box, Typography, Button, IconButton, InputLabel } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { makeStyles } from '@mui/styles';

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
}

interface RiskLimitsSectionProps {
    riskLimitLines: RiskLimitLine[];
    blockId: string;
    treatyId?: string;
    onAddLine: (blockId: string, treatyId?: string) => void;
    onDeleteLine: (blockId: string, treatyId: string | undefined, lineId: string) => void;
    onLineChange: (blockId: string, treatyId: string | undefined, lineId: string, field: string, value: string) => void;
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

export const RiskLimitsSection = ({
    riskLimitLines, blockId, treatyId,
    onAddLine, onDeleteLine, onLineChange
}: RiskLimitsSectionProps) => {
    const classes = useStyles();

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
                    Risk & Limits Details
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
                        fontSize: '13px',
                        fontWeight: 600,
                        borderRadius: '8px',
                        px: 2,
                        py: 1
                    }}
                >
                    Add Line
                </Button>
            </Box>

            <Box sx={{ p: 3 }}>
                {riskLimitLines.map((line, index) => (
                    <Box key={line.id} sx={{
                        p: 3,
                        mb: index < riskLimitLines.length - 1 ? 3 : 0,
                        backgroundColor: '#fff',
                        borderRadius: '12px',
                        position: 'relative',
                        border: 'none',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                    }}>
                        {riskLimitLines.length > 1 && (
                            <IconButton
                                size="small"
                                color="error"
                                onClick={() => onDeleteLine(blockId, treatyId, line.id)}
                                sx={{
                                    position: 'absolute',
                                    top: 12,
                                    right: 12,
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
                            Risk & Limit Line {index + 1}
                        </Typography>

                        <Grid container spacing={3}>
                            {/* Row 1 - 4 fields */}
                            <Grid item xs={12} sm={6} md={3}>
                                <FormControl className={classes.formControl} fullWidth>
                                    <InputLabel id={`productLOB-label-${line.id}`}>Product LOB</InputLabel>
                                    <Select
                                        labelId={`productLOB-label-${line.id}`}
                                        id={`productLOB-${line.id}`}
                                        name="productLOB"
                                        label="Product LOB"
                                        value={line.productLOB}
                                        onChange={(e) => onLineChange(blockId, treatyId, line.id, 'productLOB', e.target.value)}
                                    >
                                        <MenuItem value="">Select...</MenuItem>
                                        <MenuItem value="Fire">Fire</MenuItem>
                                        <MenuItem value="Marine">Marine</MenuItem>
                                        <MenuItem value="Motor">Motor</MenuItem>
                                        <MenuItem value="PROPERTY">PROPERTY</MenuItem>
                                        <MenuItem value="FIRE">FIRE</MenuItem>
                                        <MenuItem value="CASUALTY">CASUALTY</MenuItem>
                                        {line.productLOB && !['', 'Fire', 'Marine', 'Motor', 'PROPERTY', 'FIRE', 'CASUALTY'].includes(line.productLOB) && (
                                            <MenuItem value={line.productLOB}>{line.productLOB}</MenuItem>
                                        )}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    id={`productCode-${line.id}`}
                                    name="productCode"
                                    label="Product Code"
                                    fullWidth
                                    value={line.productCode}
                                    onChange={(e) => onLineChange(blockId, treatyId, line.id, 'productCode', e.target.value)}
                                    className={classes.textField}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <FormControl className={classes.formControl} fullWidth>
                                    <InputLabel id={`accountingLOB-label-${line.id}`}>Accounting LOB</InputLabel>
                                    <Select
                                        labelId={`accountingLOB-label-${line.id}`}
                                        id={`accountingLOB-${line.id}`}
                                        name="accountingLOB"
                                        label="Accounting LOB"
                                        value={line.accountingLOB}
                                        onChange={(e) => onLineChange(blockId, treatyId, line.id, 'accountingLOB', e.target.value)}
                                    >
                                        <MenuItem value="">Select...</MenuItem>
                                        <MenuItem value="Fire">Fire</MenuItem>
                                        <MenuItem value="Marine">Marine</MenuItem>
                                        <MenuItem value="PROP">PROP</MenuItem>
                                        <MenuItem value="FIRE">FIRE</MenuItem>
                                        {line.accountingLOB && !['', 'Fire', 'Marine', 'PROP', 'FIRE'].includes(line.accountingLOB) && (
                                            <MenuItem value={line.accountingLOB}>{line.accountingLOB}</MenuItem>
                                        )}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <FormControl className={classes.formControl} fullWidth>
                                    <InputLabel id={`riskCategory-label-${line.id}`}>Risk Category</InputLabel>
                                    <Select
                                        labelId={`riskCategory-label-${line.id}`}
                                        id={`riskCategory-${line.id}`}
                                        name="riskCategory"
                                        label="Risk Category"
                                        value={line.riskCategory}
                                        onChange={(e) => onLineChange(blockId, treatyId, line.id, 'riskCategory', e.target.value)}
                                    >
                                        <MenuItem value="">Select...</MenuItem>
                                        <MenuItem value="Comm">Comm</MenuItem>
                                        <MenuItem value="Residential">Residential</MenuItem>
                                        <MenuItem value="MEDIUM">MEDIUM</MenuItem>
                                        <MenuItem value="HIGH">HIGH</MenuItem>
                                        <MenuItem value="LOW">LOW</MenuItem>
                                        <MenuItem value="PROPERTY">PROPERTY</MenuItem>
                                        {line.riskCategory && !['', 'Comm', 'Residential', 'MEDIUM', 'HIGH', 'LOW', 'PROPERTY'].includes(line.riskCategory) && (
                                            <MenuItem value={line.riskCategory}>{line.riskCategory}</MenuItem>
                                        )}
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* Row 2 - 4 fields */}
                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    id={`riskGrade-${line.id}`}
                                    name="riskGrade"
                                    label="Risk Grade"
                                    fullWidth
                                    value={line.riskGrade}
                                    onChange={(e) => onLineChange(blockId, treatyId, line.id, 'riskGrade', e.target.value)}
                                    className={classes.textField}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    id={`cessionRate-${line.id}`}
                                    name="cessionRate"
                                    label="Cession Rate %"
                                    fullWidth
                                    value={line.cessionRate}
                                    onChange={(e) => onLineChange(blockId, treatyId, line.id, 'cessionRate', e.target.value)}
                                    className={classes.textField}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    id={`quotaCessionMaxCapacity-${line.id}`}
                                    name="quotaCessionMaxCapacity"
                                    label="Quota Cession Max Capacity"
                                    fullWidth
                                    value={line.quotaCessionMaxCapacity}
                                    onChange={(e) => onLineChange(blockId, treatyId, line.id, 'quotaCessionMaxCapacity', e.target.value)}
                                    className={classes.textField}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    id={`retentionGrossNet-${line.id}`}
                                    name="retentionGrossNet"
                                    label="Retention (Gross/Net)"
                                    fullWidth
                                    value={line.retentionGrossNet}
                                    onChange={(e) => onLineChange(blockId, treatyId, line.id, 'retentionGrossNet', e.target.value)}
                                    className={classes.textField}
                                />
                            </Grid>

                            {/* Row 3 - 4 fields */}
                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    id={`surplusCapacity-${line.id}`}
                                    name="surplusCapacity"
                                    label="Surplus Capacity"
                                    fullWidth
                                    value={line.surplusCapacity}
                                    onChange={(e) => onLineChange(blockId, treatyId, line.id, 'surplusCapacity', e.target.value)}
                                    className={classes.textField}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    id={`capacityCalculateInXL-${line.id}`}
                                    name="capacityCalculateInXL"
                                    label="Capacity(Calculate In XL)"
                                    placeholder="Enter capacity value"
                                    fullWidth
                                    value={line.capacityCalculateInXL}
                                    onChange={(e) => onLineChange(blockId, treatyId, line.id, 'capacityCalculateInXL', e.target.value)}
                                    className={classes.textField}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    id={`perRiskRecoveryLimit-${line.id}`}
                                    name="perRiskRecoveryLimit"
                                    label="Per Risk Recovery Limit"
                                    fullWidth
                                    value={line.perRiskRecoveryLimit}
                                    onChange={(e) => onLineChange(blockId, treatyId, line.id, 'perRiskRecoveryLimit', e.target.value)}
                                    className={classes.textField}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    id={`eventLimit-${line.id}`}
                                    name="eventLimit"
                                    label="Event Limit"
                                    fullWidth
                                    value={line.eventLimit}
                                    onChange={(e) => onLineChange(blockId, treatyId, line.id, 'eventLimit', e.target.value)}
                                    className={classes.textField}
                                />
                            </Grid>

                            {/* Row 4 - 4 fields */}
                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    id={`cashCallLimit-${line.id}`}
                                    name="cashCallLimit"
                                    label="Cash Call Limit"
                                    fullWidth
                                    value={line.cashCallLimit}
                                    onChange={(e) => onLineChange(blockId, treatyId, line.id, 'cashCallLimit', e.target.value)}
                                    className={classes.textField}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    id={`lossAdviceLimit-${line.id}`}
                                    name="lossAdviceLimit"
                                    label="Loss Advice Limit"
                                    fullWidth
                                    value={line.lossAdviceLimit}
                                    onChange={(e) => onLineChange(blockId, treatyId, line.id, 'lossAdviceLimit', e.target.value)}
                                    className={classes.textField}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    id={`premiumPaymentWarranty-${line.id}`}
                                    name="premiumPaymentWarranty"
                                    label="Premium Payment Warranty"
                                    fullWidth
                                    value={line.premiumPaymentWarranty}
                                    onChange={(e) => onLineChange(blockId, treatyId, line.id, 'premiumPaymentWarranty', e.target.value)}
                                    className={classes.textField}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    id={`alertDays-${line.id}`}
                                    name="alertDays"
                                    label="Alert Days"
                                    fullWidth
                                    value={line.alertDays}
                                    onChange={(e) => onLineChange(blockId, treatyId, line.id, 'alertDays', e.target.value)}
                                    className={classes.textField}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                ))}
            </Box>
        </Box >
    );
};
