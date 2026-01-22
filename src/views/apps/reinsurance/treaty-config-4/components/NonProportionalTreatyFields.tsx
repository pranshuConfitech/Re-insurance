import { Grid, TextField, FormControl, Select, MenuItem, Box, InputLabel } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useState, useEffect } from 'react';
import { CommonMastersService } from '@/services/remote-api/api/master-services/common.masters.service';

const commonMastersService = new CommonMastersService();

interface NonProportionalTreaty {
    treatyCode: string;
    priority: string;
    treatyType: string;
    treatyName: string;
    businessTreatyReferenceNumber: string;
    xolType: string;
    formerTreatyCode: string;
    treatyCategory: string;
    treatyStatus: string;
    treatyCurrency: string;
    processing: string;
    annualAggregateLimit: string;
    annualAggDeductible: string;
    totalReinstatedSI: string;
    capacity: string;
    flatRateXOLPrem: string;
    minDepositXOLPrem: string;
    noReinstatements: string;
    proRateToAmount: string;
    proRateToTime: string;
    reserveTypeInvolved: string;
    burningCostRate: string;
    premPaymentWarranty: string;
    alertDays: string;
    perClaimRecoverableLimit: string;
    processingPortfolioMethod: string;
    basisOfAttachment: string;
}

interface NonProportionalTreatyFieldsProps {
    treaty: NonProportionalTreaty;
    blockId: string;
    onTreatyChange: (blockId: string, field: string, value: string) => void;
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

export const NonProportionalTreatyFields = ({ treaty, blockId, onTreatyChange }: NonProportionalTreatyFieldsProps) => {
    const classes = useStyles();

    // State for API dropdown data
    const [currencies, setCurrencies] = useState<any[]>([]);
    const [processingMethodOptions, setProcessingMethodOptions] = useState<any[]>([]);
    const [loadingCurrencies, setLoadingCurrencies] = useState(false);
    const [loadingProcessingMethod, setLoadingProcessingMethod] = useState(false);

    // Fetch currencies from API
    useEffect(() => {
        setLoadingCurrencies(true);
        commonMastersService.getCurrencies().subscribe({
            next: (response) => {
                if (response && response.content) {
                    setCurrencies(response.content);
                }
                setLoadingCurrencies(false);
            },
            error: (error) => {
                console.error('Error fetching currencies:', error);
                setLoadingCurrencies(false);
                // Fallback to hardcoded values
                setCurrencies([
                    { commonCode: 'USD', commonDesc: 'USD' },
                    { commonCode: 'EUR', commonDesc: 'EUR' },
                    { commonCode: 'GBP', commonDesc: 'GBP' },
                    { commonCode: 'JPY', commonDesc: 'JPY' }
                ]);
            }
        });
    }, []);

    // Fetch Processing Method options from API
    useEffect(() => {
        setLoadingProcessingMethod(true);
        commonMastersService.getProcessingMethodOptions().subscribe({
            next: (response) => {
                if (response && response.content) {
                    setProcessingMethodOptions(response.content);
                }
                setLoadingProcessingMethod(false);
            },
            error: (error) => {
                console.error('Error fetching Processing Method options:', error);
                setLoadingProcessingMethod(false);
                // Fallback to hardcoded values
                setProcessingMethodOptions([
                    { commonCode: 'Clean Cut', commonDesc: 'Clean Cut' },
                    { commonCode: 'Run Off', commonDesc: 'Run Off' },
                    { commonCode: 'AUTO', commonDesc: 'Clean Cut' },
                    { commonCode: 'SYSTEM', commonDesc: 'Clean Cut' },
                    { commonCode: 'STANDARD', commonDesc: 'Clean Cut' }
                ]);
            }
        });
    }, []);

    const handleChange = (field: string, value: string) => {
        onTreatyChange(blockId, field, value);
    };

    return (
        <Grid container spacing={3}>
            {/* Row 1 - 4 fields */}
            <Grid item xs={12} sm={6} md={3}>
                <TextField
                    id={`treatyCode-${blockId}`}
                    name="treatyCode"
                    label="Treaty Code"
                    fullWidth
                    value={treaty.treatyCode}
                    onChange={(e) => handleChange('treatyCode', e.target.value)}
                    className={classes.textField}
                />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <FormControl className={classes.formControl} fullWidth>
                    <InputLabel id={`priority-label-${blockId}`}>Priority</InputLabel>
                    <Select
                        labelId={`priority-label-${blockId}`}
                        id={`priority-${blockId}`}
                        name="priority"
                        label="Priority"
                        value={treaty.priority}
                        onChange={(e) => handleChange('priority', e.target.value)}
                    >
                        <MenuItem value="">Select...</MenuItem>
                        <MenuItem value="PRIMARY">Primary</MenuItem>
                        <MenuItem value="SECONDARY">Secondary</MenuItem>
                        <MenuItem value="TERTIARY">Tertiary</MenuItem>
                        <MenuItem value="HIGH">High</MenuItem>
                        <MenuItem value="MEDIUM">Medium</MenuItem>
                        <MenuItem value="LOW">Low</MenuItem>
                        {treaty.priority && !['', 'PRIMARY', 'SECONDARY', 'TERTIARY', 'HIGH', 'MEDIUM', 'LOW'].includes(treaty.priority) && (
                            <MenuItem value={treaty.priority}>{treaty.priority}</MenuItem>
                        )}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <FormControl className={classes.formControl} fullWidth>
                    <InputLabel id={`treatyType-label-${blockId}`}>Treaty Type</InputLabel>
                    <Select
                        labelId={`treatyType-label-${blockId}`}
                        id={`treatyType-${blockId}`}
                        name="treatyType"
                        label="Treaty Type"
                        value={treaty.treatyType}
                        onChange={(e) => handleChange('treatyType', e.target.value)}
                    >
                        <MenuItem value="XOL">XOL</MenuItem>
                        <MenuItem value="Stop Loss">Stop Loss</MenuItem>
                        <MenuItem value="Cat XOL">Cat XOL</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <TextField
                    id={`treatyName-${blockId}`}
                    name="treatyName"
                    label="Treaty Name"
                    fullWidth
                    value={treaty.treatyName}
                    onChange={(e) => handleChange('treatyName', e.target.value)}
                    className={classes.textField}
                />
            </Grid>

            {/* Row 2 - 4 fields */}
            <Grid item xs={12} sm={6} md={3}>
                <TextField
                    id={`businessTreatyReferenceNumber-${blockId}`}
                    name="businessTreatyReferenceNumber"
                    label="Business Treaty Reference Number"
                    fullWidth
                    value={treaty.businessTreatyReferenceNumber}
                    onChange={(e) => handleChange('businessTreatyReferenceNumber', e.target.value)}
                    className={classes.textField}
                />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <FormControl className={classes.formControl} fullWidth>
                    <InputLabel id={`xolType-label-${blockId}`}>XOL Type</InputLabel>
                    <Select
                        labelId={`xolType-label-${blockId}`}
                        id={`xolType-${blockId}`}
                        name="xolType"
                        label="XOL Type"
                        value={treaty.xolType}
                        onChange={(e) => handleChange('xolType', e.target.value)}
                    >
                        <MenuItem value="">Select...</MenuItem>
                        <MenuItem value="Risk Attaching">Risk Attaching</MenuItem>
                        <MenuItem value="Loss Occurring">Loss Occurring</MenuItem>
                        <MenuItem value="RISK_ATTACHING">Risk Attaching</MenuItem>
                        <MenuItem value="LOSS_OCCURRING">Loss Occurring</MenuItem>
                        {treaty.xolType && !['', 'Risk Attaching', 'Loss Occurring', 'RISK_ATTACHING', 'LOSS_OCCURRING'].includes(treaty.xolType) && (
                            <MenuItem value={treaty.xolType}>{treaty.xolType}</MenuItem>
                        )}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <TextField
                    id={`formerTreatyCode-${blockId}`}
                    name="formerTreatyCode"
                    label="Former Treaty Code"
                    fullWidth
                    value={treaty.formerTreatyCode}
                    onChange={(e) => handleChange('formerTreatyCode', e.target.value)}
                    className={classes.textField}
                />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <FormControl className={classes.formControl} fullWidth>
                    <InputLabel id={`treatyCategory-label-${blockId}`}>Treaty Category</InputLabel>
                    <Select
                        labelId={`treatyCategory-label-${blockId}`}
                        id={`treatyCategory-${blockId}`}
                        name="treatyCategory"
                        label="Treaty Category"
                        value={treaty.treatyCategory}
                        onChange={(e) => handleChange('treatyCategory', e.target.value)}
                    >
                        <MenuItem value="">Select...</MenuItem>
                        <MenuItem value="PROPERTY">Property</MenuItem>
                        <MenuItem value="CASUALTY">Casualty</MenuItem>
                        <MenuItem value="MARINE">Marine</MenuItem>
                        <MenuItem value="AVIATION">Aviation</MenuItem>
                        <MenuItem value="NON_PROP">Non-Proportional</MenuItem>
                        <MenuItem value="M">M</MenuItem>
                        <MenuItem value="F">F</MenuItem>
                        {treaty.treatyCategory && !['', 'PROPERTY', 'CASUALTY', 'MARINE', 'AVIATION', 'NON_PROP', 'M', 'F'].includes(treaty.treatyCategory) && (
                            <MenuItem value={treaty.treatyCategory}>{treaty.treatyCategory}</MenuItem>
                        )}
                    </Select>
                </FormControl>
            </Grid>

            {/* Row 3 - 4 fields */}
            <Grid item xs={12} sm={6} md={3}>
                <FormControl className={classes.formControl} fullWidth>
                    <InputLabel id={`treatyStatus-label-${blockId}`}>Treaty Status</InputLabel>
                    <Select
                        labelId={`treatyStatus-label-${blockId}`}
                        id={`treatyStatus-${blockId}`}
                        name="treatyStatus"
                        label="Treaty Status"
                        value={treaty.treatyStatus}
                        onChange={(e) => handleChange('treatyStatus', e.target.value)}
                    >
                        <MenuItem value="">Select...</MenuItem>
                        <MenuItem value="ACTIVE">Active</MenuItem>
                        <MenuItem value="INACTIVE">Inactive</MenuItem>
                        <MenuItem value="PENDING">Pending</MenuItem>
                        <MenuItem value="Active">Active</MenuItem>
                        <MenuItem value="Inactive">Inactive</MenuItem>
                        <MenuItem value="Pending">Pending</MenuItem>
                        {treaty.treatyStatus && !['', 'ACTIVE', 'INACTIVE', 'PENDING', 'Active', 'Inactive', 'Pending'].includes(treaty.treatyStatus) && (
                            <MenuItem value={treaty.treatyStatus}>{treaty.treatyStatus}</MenuItem>
                        )}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <FormControl className={classes.formControl} fullWidth>
                    <InputLabel id={`treatyCurrency-label-${blockId}`}>Treaty Currency</InputLabel>
                    <Select
                        labelId={`treatyCurrency-label-${blockId}`}
                        id={`treatyCurrency-${blockId}`}
                        name="treatyCurrency"
                        label="Treaty Currency"
                        value={treaty.treatyCurrency}
                        onChange={(e) => handleChange('treatyCurrency', e.target.value)}
                        disabled={loadingCurrencies}
                    >
                        <MenuItem value="">
                            <em style={{ color: '#6c757d' }}>
                                {loadingCurrencies ? 'Loading currencies...' : 'Select Currency...'}
                            </em>
                        </MenuItem>
                        {currencies.map((curr) => (
                            <MenuItem key={curr.commonCode || curr.commonDesc} value={curr.commonCode || curr.commonDesc}>
                                {curr.commonDesc || curr.commonCode}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <FormControl className={classes.formControl} fullWidth>
                    <InputLabel id={`processing-label-${blockId}`}>Processing</InputLabel>
                    <Select
                        labelId={`processing-label-${blockId}`}
                        id={`processing-${blockId}`}
                        name="processing"
                        label="Processing"
                        value={treaty.processing}
                        onChange={(e) => handleChange('processing', e.target.value)}
                    >
                        <MenuItem value="">Select...</MenuItem>
                        <MenuItem value="Clean Cut">Clean Cut</MenuItem>
                        <MenuItem value="Run Off">Run Off</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <TextField
                    id={`annualAggregateLimit-${blockId}`}
                    name="annualAggregateLimit"
                    label="Annual Aggregate Limit"
                    type="number"
                    fullWidth
                    value={treaty.annualAggregateLimit}
                    onChange={(e) => handleChange('annualAggregateLimit', e.target.value)}
                    className={classes.textField}
                />
            </Grid>

            {/* Row 4 - 4 fields */}
            <Grid item xs={12} sm={6} md={3}>
                <TextField
                    id={`annualAggDeductible-${blockId}`}
                    name="annualAggDeductible"
                    label="Annual Agg Deductible"
                    type="number"
                    fullWidth
                    value={treaty.annualAggDeductible}
                    onChange={(e) => handleChange('annualAggDeductible', e.target.value)}
                    className={classes.textField}
                />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <TextField
                    id={`totalReinstatedSI-${blockId}`}
                    name="totalReinstatedSI"
                    label="Total Reinstated SI"
                    type="number"
                    fullWidth
                    value={treaty.totalReinstatedSI}
                    onChange={(e) => handleChange('totalReinstatedSI', e.target.value)}
                    className={classes.textField}
                />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <TextField
                    id={`capacity-${blockId}`}
                    name="capacity"
                    label="Capacity"
                    type="number"
                    fullWidth
                    value={treaty.capacity}
                    onChange={(e) => handleChange('capacity', e.target.value)}
                    className={classes.textField}
                />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <TextField
                    id={`flatRateXOLPrem-${blockId}`}
                    name="flatRateXOLPrem"
                    label="Flat Rate XOL Prem"
                    type="number"
                    fullWidth
                    value={treaty.flatRateXOLPrem}
                    onChange={(e) => handleChange('flatRateXOLPrem', e.target.value)}
                    className={classes.textField}
                />
            </Grid>

            {/* Row 5 - 4 fields */}
            <Grid item xs={12} sm={6} md={3}>
                <TextField
                    id={`minDepositXOLPrem-${blockId}`}
                    name="minDepositXOLPrem"
                    label="Min Deposit XOL Prem"
                    type="number"
                    fullWidth
                    value={treaty.minDepositXOLPrem}
                    onChange={(e) => handleChange('minDepositXOLPrem', e.target.value)}
                    className={classes.textField}
                />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <TextField
                    id={`noReinstatements-${blockId}`}
                    name="noReinstatements"
                    label="No. Reinstatements"
                    type="number"
                    fullWidth
                    value={treaty.noReinstatements}
                    onChange={(e) => handleChange('noReinstatements', e.target.value)}
                    className={classes.textField}
                />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <FormControl className={classes.formControl} fullWidth>
                    <InputLabel id={`proRateToAmount-label-${blockId}`}>Pro Rate to Amount</InputLabel>
                    <Select
                        labelId={`proRateToAmount-label-${blockId}`}
                        id={`proRateToAmount-${blockId}`}
                        name="proRateToAmount"
                        label="Pro Rate to Amount"
                        value={treaty.proRateToAmount}
                        onChange={(e) => handleChange('proRateToAmount', e.target.value)}
                    >
                        <MenuItem value="">Select...</MenuItem>
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <FormControl className={classes.formControl} fullWidth>
                    <InputLabel id={`proRateToTime-label-${blockId}`}>Pro Rate to Time</InputLabel>
                    <Select
                        labelId={`proRateToTime-label-${blockId}`}
                        id={`proRateToTime-${blockId}`}
                        name="proRateToTime"
                        label="Pro Rate to Time"
                        value={treaty.proRateToTime}
                        onChange={(e) => handleChange('proRateToTime', e.target.value)}
                    >
                        <MenuItem value="">Select...</MenuItem>
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                    </Select>
                </FormControl>
            </Grid>

            {/* Row 6 - 4 fields */}
            <Grid item xs={12} sm={6} md={3}>
                <TextField
                    id={`reserveTypeInvolved-${blockId}`}
                    name="reserveTypeInvolved"
                    label="Reserve Type Involved"
                    fullWidth
                    value={treaty.reserveTypeInvolved}
                    onChange={(e) => handleChange('reserveTypeInvolved', e.target.value)}
                    className={classes.textField}
                />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <TextField
                    id={`burningCostRate-${blockId}`}
                    name="burningCostRate"
                    label="Burning Cost Rate"
                    type="number"
                    fullWidth
                    value={treaty.burningCostRate}
                    onChange={(e) => handleChange('burningCostRate', e.target.value)}
                    className={classes.textField}
                />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <FormControl className={classes.formControl} fullWidth>
                    <InputLabel id={`premPaymentWarranty-label-${blockId}`}>Prem Payment Warranty</InputLabel>
                    <Select
                        labelId={`premPaymentWarranty-label-${blockId}`}
                        id={`premPaymentWarranty-${blockId}`}
                        name="premPaymentWarranty"
                        label="Prem Payment Warranty"
                        value={treaty.premPaymentWarranty}
                        onChange={(e) => handleChange('premPaymentWarranty', e.target.value)}
                    >
                        <MenuItem value="">Select...</MenuItem>
                        <MenuItem value="Within 30 Days">Within 30 Days</MenuItem>
                        <MenuItem value="Within 45 Days">Within 45 Days</MenuItem>
                        <MenuItem value="Within 60 Days">Within 60 Days</MenuItem>
                        <MenuItem value="Within 90 Days">Within 90 Days</MenuItem>
                        <MenuItem value="Quarterly">Quarterly</MenuItem>
                        <MenuItem value="Semi-Annual">Semi-Annual</MenuItem>
                        <MenuItem value="Annual">Annual</MenuItem>
                        <MenuItem value="WITHIN_30_DAYS">Within 30 Days</MenuItem>
                        <MenuItem value="WITHIN_45_DAYS">Within 45 Days</MenuItem>
                        <MenuItem value="WITHIN_60_DAYS">Within 60 Days</MenuItem>
                        <MenuItem value="WITHIN_90_DAYS">Within 90 Days</MenuItem>
                        <MenuItem value="QUARTERLY">Quarterly</MenuItem>
                        <MenuItem value="SEMI_ANNUAL">Semi-Annual</MenuItem>
                        <MenuItem value="ANNUAL">Annual</MenuItem>
                        {treaty.premPaymentWarranty && !['', 'Within 30 Days', 'Within 45 Days', 'Within 60 Days', 'Within 90 Days', 'Quarterly', 'Semi-Annual', 'Annual', 'WITHIN_30_DAYS', 'WITHIN_45_DAYS', 'WITHIN_60_DAYS', 'WITHIN_90_DAYS', 'QUARTERLY', 'SEMI_ANNUAL', 'ANNUAL'].includes(treaty.premPaymentWarranty) && (
                            <MenuItem value={treaty.premPaymentWarranty}>{treaty.premPaymentWarranty}</MenuItem>
                        )}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <TextField
                    id={`alertDays-${blockId}`}
                    name="alertDays"
                    label="Alert Days"
                    type="number"
                    fullWidth
                    value={treaty.alertDays}
                    onChange={(e) => handleChange('alertDays', e.target.value)}
                    className={classes.textField}
                />
            </Grid>

            {/* Row 7 - 3 fields */}
            <Grid item xs={12} sm={6} md={3}>
                <TextField
                    id={`perClaimRecoverableLimit-${blockId}`}
                    name="perClaimRecoverableLimit"
                    label="Per Claim Recoverable Limit"
                    type="number"
                    fullWidth
                    value={treaty.perClaimRecoverableLimit}
                    onChange={(e) => handleChange('perClaimRecoverableLimit', e.target.value)}
                    className={classes.textField}
                />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <FormControl className={classes.formControl} fullWidth>
                    <InputLabel id={`processingPortfolioMethod-label-${blockId}`}>Processing Portfolio Method</InputLabel>
                    <Select
                        labelId={`processingPortfolioMethod-label-${blockId}`}
                        id={`processingPortfolioMethod-${blockId}`}
                        name="processingPortfolioMethod"
                        label="Processing Portfolio Method"
                        value={treaty.processingPortfolioMethod}
                        onChange={(e) => handleChange('processingPortfolioMethod', e.target.value)}
                        disabled={loadingProcessingMethod}
                    >
                        <MenuItem value="">
                            <em style={{ color: '#6c757d' }}>
                                {loadingProcessingMethod ? 'Loading options...' : 'Select...'}
                            </em>
                        </MenuItem>
                        {processingMethodOptions.map((option) => (
                            <MenuItem key={option.commonCode || option.commonDesc} value={option.commonCode || option.commonDesc}>
                                {option.commonDesc || option.commonCode}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
                <FormControl className={classes.formControl} fullWidth>
                    <InputLabel id={`basisOfAttachment-label-${blockId}`}>Basis of Attachment/Drop Down Values are Risk Attaching Basis/Loss</InputLabel>
                    <Select
                        labelId={`basisOfAttachment-label-${blockId}`}
                        id={`basisOfAttachment-${blockId}`}
                        name="basisOfAttachment"
                        label="Basis of Attachment/Drop Down Values are Risk Attaching Basis/Loss"
                        value={treaty.basisOfAttachment}
                        onChange={(e) => handleChange('basisOfAttachment', e.target.value)}
                    >
                        <MenuItem value="">Select...</MenuItem>
                        <MenuItem value="Risk Attaching Basis">Risk Attaching Basis</MenuItem>
                        <MenuItem value="Loss">Loss</MenuItem>
                        <MenuItem value="LOSS_OCCURRING">Loss Occurring</MenuItem>
                        <MenuItem value="RISK_ATTACHING">Risk Attaching</MenuItem>
                        <MenuItem value="OCCURRENCE">Occurrence</MenuItem>
                        {treaty.basisOfAttachment && !['', 'Risk Attaching Basis', 'Loss', 'LOSS_OCCURRING', 'RISK_ATTACHING', 'OCCURRENCE'].includes(treaty.basisOfAttachment) && (
                            <MenuItem value={treaty.basisOfAttachment}>{treaty.basisOfAttachment}</MenuItem>
                        )}
                    </Select>
                </FormControl>
            </Grid>
        </Grid>
    );
};
