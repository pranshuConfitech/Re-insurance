import { Card, Grid, TextField, FormControl, Select, MenuItem, Box, Typography, Button, IconButton, InputLabel } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { makeStyles } from '@mui/styles';
import { useState, useEffect } from 'react';
import { CommonMastersService } from '@/services/remote-api/api/master-services/common.masters.service';

const commonMastersService = new CommonMastersService();

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

export const RiskScoreLayersSection = ({
    layerLines, blockId,
    onAddLayer, onDeleteLayer, onLayerChange
}: RiskScoreLayersSectionProps) => {
    const classes = useStyles();

    // State for API dropdown data
    const [productLobOptions, setProductLobOptions] = useState<any[]>([]);
    const [accountingLobOptions, setAccountingLobOptions] = useState<any[]>([]);
    const [riskCategoryOptions, setRiskCategoryOptions] = useState<any[]>([]);
    const [loadingProductLob, setLoadingProductLob] = useState(false);
    const [loadingAccountingLob, setLoadingAccountingLob] = useState(false);
    const [loadingRiskCategory, setLoadingRiskCategory] = useState(false);

    // Fetch Product LOB options from API
    useEffect(() => {
        setLoadingProductLob(true);
        commonMastersService.getProductLobOptions().subscribe({
            next: (response) => {
                if (response && response.content) {
                    setProductLobOptions(response.content);
                }
                setLoadingProductLob(false);
            },
            error: (error) => {
                console.error('Error fetching Product LOB options:', error);
                setLoadingProductLob(false);
                // Fallback to hardcoded values
                setProductLobOptions([
                    { commonCode: 'PROPERTY', commonDesc: 'Property' },
                    { commonCode: 'CASUALTY', commonDesc: 'Casualty' },
                    { commonCode: 'MARINE', commonDesc: 'Marine' },
                    { commonCode: 'AVIATION', commonDesc: 'Aviation' },
                    { commonCode: 'FIRE', commonDesc: 'Fire' },
                    { commonCode: 'Fire', commonDesc: 'Fire' },
                    { commonCode: 'Marine', commonDesc: 'Marine' },
                    { commonCode: 'Motor', commonDesc: 'Motor' }
                ]);
            }
        });
    }, []);

    // Fetch Accounting LOB options from API
    useEffect(() => {
        setLoadingAccountingLob(true);
        commonMastersService.getAccountingLobOptions().subscribe({
            next: (response) => {
                if (response && response.content) {
                    setAccountingLobOptions(response.content);
                }
                setLoadingAccountingLob(false);
            },
            error: (error) => {
                console.error('Error fetching Accounting LOB options:', error);
                setLoadingAccountingLob(false);
                // Fallback to hardcoded values
                setAccountingLobOptions([
                    { commonCode: 'PROP', commonDesc: 'Property' },
                    { commonCode: 'CASUALTY', commonDesc: 'Casualty' },
                    { commonCode: 'MARINE', commonDesc: 'Marine' },
                    { commonCode: 'AVIATION', commonDesc: 'Aviation' },
                    { commonCode: 'FIRE', commonDesc: 'Fire' },
                    { commonCode: 'Fire', commonDesc: 'Fire' },
                    { commonCode: 'Marine', commonDesc: 'Marine' }
                ]);
            }
        });
    }, []);

    // Fetch Risk Category options from API
    useEffect(() => {
        setLoadingRiskCategory(true);
        commonMastersService.getRiskCategoryOptions().subscribe({
            next: (response) => {
                if (response && response.content) {
                    setRiskCategoryOptions(response.content);
                }
                setLoadingRiskCategory(false);
            },
            error: (error) => {
                console.error('Error fetching Risk Category options:', error);
                setLoadingRiskCategory(false);
                // Fallback to hardcoded values
                setRiskCategoryOptions([
                    { commonCode: 'HIGH', commonDesc: 'High' },
                    { commonCode: 'MEDIUM', commonDesc: 'Medium' },
                    { commonCode: 'LOW', commonDesc: 'Low' },
                    { commonCode: 'PROPERTY', commonDesc: 'Property' },
                    { commonCode: 'CASUALTY', commonDesc: 'Casualty' },
                    { commonCode: 'CAT', commonDesc: 'Catastrophe' },
                    { commonCode: 'Comm', commonDesc: 'Commercial' },
                    { commonCode: 'Residential', commonDesc: 'Residential' }
                ]);
            }
        });
    }, []);
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
                                <FormControl className={classes.formControl} fullWidth>
                                    <InputLabel id={`productLOB-label-${layer.id}`}>Product LOB</InputLabel>
                                    <Select
                                        labelId={`productLOB-label-${layer.id}`}
                                        id={`productLOB-${layer.id}`}
                                        name="productLOB"
                                        label="Product LOB"
                                        value={layer.productLOB}
                                        onChange={(e) => onLayerChange(blockId, layer.id, 'productLOB', e.target.value)}
                                        disabled={loadingProductLob}
                                    >
                                        <MenuItem value="">
                                            <em style={{ color: '#6c757d' }}>
                                                {loadingProductLob ? 'Loading options...' : 'Select...'}
                                            </em>
                                        </MenuItem>
                                        {productLobOptions.map((option) => (
                                            <MenuItem key={option.commonCode || option.commonDesc} value={option.commonCode || option.commonDesc}>
                                                {option.commonDesc || option.commonCode}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    id={`productCode-${layer.id}`}
                                    name="productCode"
                                    label="Product Code"
                                    fullWidth
                                    value={layer.productCode}
                                    onChange={(e) => onLayerChange(blockId, layer.id, 'productCode', e.target.value)}
                                    className={classes.textField}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <FormControl className={classes.formControl} fullWidth>
                                    <InputLabel id={`accountingLOB-label-${layer.id}`}>Accounting LOB</InputLabel>
                                    <Select
                                        labelId={`accountingLOB-label-${layer.id}`}
                                        id={`accountingLOB-${layer.id}`}
                                        name="accountingLOB"
                                        label="Accounting LOB"
                                        value={layer.accountingLOB}
                                        onChange={(e) => onLayerChange(blockId, layer.id, 'accountingLOB', e.target.value)}
                                        disabled={loadingAccountingLob}
                                    >
                                        <MenuItem value="">
                                            <em style={{ color: '#6c757d' }}>
                                                {loadingAccountingLob ? 'Loading options...' : 'Select...'}
                                            </em>
                                        </MenuItem>
                                        {accountingLobOptions.map((option) => (
                                            <MenuItem key={option.commonCode || option.commonDesc} value={option.commonCode || option.commonDesc}>
                                                {option.commonDesc || option.commonCode}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <FormControl className={classes.formControl} fullWidth>
                                    <InputLabel id={`riskCategory-label-${layer.id}`}>Risk Category</InputLabel>
                                    <Select
                                        labelId={`riskCategory-label-${layer.id}`}
                                        id={`riskCategory-${layer.id}`}
                                        name="riskCategory"
                                        label="Risk Category"
                                        value={layer.riskCategory}
                                        onChange={(e) => onLayerChange(blockId, layer.id, 'riskCategory', e.target.value)}
                                        disabled={loadingRiskCategory}
                                    >
                                        <MenuItem value="">
                                            <em style={{ color: '#6c757d' }}>
                                                {loadingRiskCategory ? 'Loading options...' : 'Select...'}
                                            </em>
                                        </MenuItem>
                                        {riskCategoryOptions.map((option) => (
                                            <MenuItem key={option.commonCode || option.commonDesc} value={option.commonCode || option.commonDesc}>
                                                {option.commonDesc || option.commonCode}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* Row 2 - 4 fields */}
                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    id={`riskGrade-${layer.id}`}
                                    name="riskGrade"
                                    label="Risk Grade"
                                    fullWidth
                                    value={layer.riskGrade}
                                    onChange={(e) => onLayerChange(blockId, layer.id, 'riskGrade', e.target.value)}
                                    className={classes.textField}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    id={`lossOccurDeductibility-${layer.id}`}
                                    name="lossOccurDeductibility"
                                    label="Loss Occur Deductibility"
                                    type="number"
                                    fullWidth
                                    value={layer.lossOccurDeductibility}
                                    onChange={(e) => onLayerChange(blockId, layer.id, 'lossOccurDeductibility', e.target.value)}
                                    className={classes.textField}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    id={`lossLimit-${layer.id}`}
                                    name="lossLimit"
                                    label="Loss Limit"
                                    type="number"
                                    fullWidth
                                    value={layer.lossLimit}
                                    onChange={(e) => onLayerChange(blockId, layer.id, 'lossLimit', e.target.value)}
                                    className={classes.textField}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    id={`shareOfOccurrenceDeduction-${layer.id}`}
                                    name="shareOfOccurrenceDeduction"
                                    label="Share Of Occurrence Deduction"
                                    type="number"
                                    fullWidth
                                    value={layer.shareOfOccurrenceDeduction}
                                    onChange={(e) => onLayerChange(blockId, layer.id, 'shareOfOccurrenceDeduction', e.target.value)}
                                    className={classes.textField}
                                />
                            </Grid>

                            {/* Row 3 - 4 fields */}
                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    id={`availableReinstatedSI-${layer.id}`}
                                    name="availableReinstatedSI"
                                    label="Available Reinstated SI"
                                    type="number"
                                    fullWidth
                                    value={layer.availableReinstatedSI}
                                    onChange={(e) => onLayerChange(blockId, layer.id, 'availableReinstatedSI', e.target.value)}
                                    className={classes.textField}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    id={`annualAggLimit-${layer.id}`}
                                    name="annualAggLimit"
                                    label="Annual Agg Limit (Zone)"
                                    type="number"
                                    fullWidth
                                    value={layer.annualAggLimit}
                                    onChange={(e) => onLayerChange(blockId, layer.id, 'annualAggLimit', e.target.value)}
                                    className={classes.textField}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    id={`annualAggAmount-${layer.id}`}
                                    name="annualAggAmount"
                                    label="Shared Agg Limit (Zone)"
                                    type="number"
                                    fullWidth
                                    value={layer.annualAggAmount}
                                    onChange={(e) => onLayerChange(blockId, layer.id, 'annualAggAmount', e.target.value)}
                                    className={classes.textField}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    id={`aggClaimAmount-${layer.id}`}
                                    name="aggClaimAmount"
                                    label="Agg Claim Amount"
                                    type="number"
                                    fullWidth
                                    value={layer.aggClaimAmount}
                                    onChange={(e) => onLayerChange(blockId, layer.id, 'aggClaimAmount', e.target.value)}
                                    className={classes.textField}
                                />
                            </Grid>

                            {/* Row 4 - 2 fields */}
                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    id={`localNativeLayer-${layer.id}`}
                                    name="localNativeLayer"
                                    label="Local Native Layer"
                                    fullWidth
                                    value={layer.localNativeLayer}
                                    onChange={(e) => onLayerChange(blockId, layer.id, 'localNativeLayer', e.target.value)}
                                    className={classes.textField}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    id={`transactionLimitCcy-${layer.id}`}
                                    name="transactionLimitCcy"
                                    label="Transaction Limit Ccy"
                                    type="number"
                                    fullWidth
                                    value={layer.transactionLimitCcy}
                                    onChange={(e) => onLayerChange(blockId, layer.id, 'transactionLimitCcy', e.target.value)}
                                    className={classes.textField}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};
