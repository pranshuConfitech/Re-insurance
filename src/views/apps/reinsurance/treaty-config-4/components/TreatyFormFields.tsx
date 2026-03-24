import { Grid, TextField, FormControl, Select, MenuItem, Box, InputLabel } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useState, useEffect } from 'react';
import { CommonMastersService } from '@/services/remote-api/api/master-services/common.masters.service';

const commonMastersService = new CommonMastersService();

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
    riskCommission: string;
    reinsurers: any[];
    brokers: any[];
}

interface Treaty {
    treatyCode: string;
    priority: string;
    treatyType: string;
    treatyName: string;
    businessTreatyReferenceNumber: string;
    riGradedRet: string;
    formerTreatyCode: string;
    treatyCategory: string;
    installment: string;
    processingPortfolioMethod: string;
    premReserveRetainedRate: string;
    premReserveInterestRate: string;
    portfolioPremiumEntryRate: string;
    portfolioClaimEntryRate: string;
    portfolioPremWithdRate: string;
    portfolioClaimWithdRate: string;
    managementExpenses: string;
    taxesAndOtherExpenses: string;
    riskLimitLines: RiskLimitLine[];
}

interface TreatyFormFieldsProps {
    treaty: Treaty;
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

export const TreatyFormFields = ({ treaty, blockId, onTreatyChange }: TreatyFormFieldsProps) => {
    const classes = useStyles();

    // State for API dropdown data
    const [riGradedOptions, setRiGradedOptions] = useState<any[]>([]);
    const [priorityOptions, setPriorityOptions] = useState<any[]>([]);
    const [treatyTypeOptions, setTreatyTypeOptions] = useState<any[]>([]);
    const [treatyCategoryOptions, setTreatyCategoryOptions] = useState<any[]>([]);
    const [installmentOptions, setInstallmentOptions] = useState<any[]>([]);
    const [processingMethodOptions, setProcessingMethodOptions] = useState<any[]>([]);
    const [loadingRiGraded, setLoadingRiGraded] = useState(false);
    const [loadingPriorityOptions, setLoadingPriorityOptions] = useState(false);
    const [loadingTreatyTypeOptions, setLoadingTreatyTypeOptions] = useState(false);
    const [loadingTreatyCategoryOptions, setLoadingTreatyCategoryOptions] = useState(false);
    const [loadingInstallment, setLoadingInstallment] = useState(false);
    const [loadingProcessingMethod, setLoadingProcessingMethod] = useState(false);

    // Fetch RI Graded options from API
    useEffect(() => {
        setLoadingRiGraded(true);
        commonMastersService.getRiGradedOptions().subscribe({
            next: (response) => {
                if (response && response.content) {
                    setRiGradedOptions(response.content);
                }
                setLoadingRiGraded(false);
            },
            error: (error) => {
                console.error('Error fetching RI Graded options:', error);
                setLoadingRiGraded(false);
                // Fallback to hardcoded values
                setRiGradedOptions([
                    { commonCode: 'No', commonDesc: 'No' },
                    { commonCode: 'Yes', commonDesc: 'Yes' }
                ]);
            }
        });
    }, []);

    // Fetch Treaty Category options from API
    useEffect(() => {
        setLoadingTreatyCategoryOptions(true);
        commonMastersService.getTreatyCategoryOptions().subscribe({
            next: (response) => {
                if (response && response.content) {
                    setTreatyCategoryOptions(response.content);
                }
                setLoadingTreatyCategoryOptions(false);
            },
            error: (error) => {
                console.error('Error fetching Treaty Category options:', error);
                setLoadingTreatyCategoryOptions(false);
                // Fallback to hardcoded values
                setTreatyCategoryOptions([
                    { commonCode: 'M', commonDesc: 'M' },
                    { commonCode: 'F', commonDesc: 'F' },
                    { commonCode: 'PROPERTY', commonDesc: 'PROPERTY' },
                    { commonCode: 'CASUALTY', commonDesc: 'CASUALTY' },
                    { commonCode: 'MARINE', commonDesc: 'MARINE' },
                    { commonCode: 'PROPORTIONAL', commonDesc: 'PROPORTIONAL' },
                    { commonCode: 'NON_PROP', commonDesc: 'NON_PROP' }
                ]);
            }
        });
    }, []);

    // Fetch Treaty Type options from API
    useEffect(() => {
        setLoadingTreatyTypeOptions(true);
        commonMastersService.getTreatyTypeOptions().subscribe({
            next: (response) => {
                if (response && response.content) {
                    setTreatyTypeOptions(response.content);
                }
                setLoadingTreatyTypeOptions(false);
            },
            error: (error) => {
                console.error('Error fetching Treaty Type options:', error);
                setLoadingTreatyTypeOptions(false);
                // Fallback to hardcoded values
                setTreatyTypeOptions([
                    { commonCode: 'Quota Share', commonDesc: 'Quota Share' },
                    { commonCode: 'Surplus', commonDesc: 'Surplus' },
                    { commonCode: 'Facultative', commonDesc: 'Facultative' }
                ]);
            }
        });
    }, []);

    // Fetch Priority options from API
    useEffect(() => {
        setLoadingPriorityOptions(true);
        commonMastersService.getPriorityTypeOptions().subscribe({
            next: (response) => {
                if (response && response.content) {
                    setPriorityOptions(response.content);
                }
                setLoadingPriorityOptions(false);
            },
            error: (error) => {
                console.error('Error fetching Priority options:', error);
                setLoadingPriorityOptions(false);
                // Fallback to hardcoded values
                setPriorityOptions([
                    { commonCode: 'PRIMARY', commonDesc: 'PRIMARY' },
                    { commonCode: 'SECONDARY', commonDesc: 'SECONDARY' },
                    { commonCode: 'HIGH', commonDesc: 'HIGH' },
                    { commonCode: 'MEDIUM', commonDesc: 'MEDIUM' },
                    { commonCode: 'LOW', commonDesc: 'LOW' },
                    { commonCode: '1', commonDesc: '1' },
                    { commonCode: '2', commonDesc: '2' },
                    { commonCode: '3', commonDesc: '3' }
                ]);
            }
        });
    }, []);

    // Fetch Installment options from API
    useEffect(() => {
        setLoadingInstallment(true);
        commonMastersService.getInstallmentOptions().subscribe({
            next: (response) => {
                if (response && response.content) {
                    setInstallmentOptions(response.content);
                }
                setLoadingInstallment(false);
            },
            error: (error) => {
                console.error('Error fetching Installment options:', error);
                setLoadingInstallment(false);
                // Fallback to hardcoded values
                setInstallmentOptions([
                    { commonCode: 'Monthly', commonDesc: 'Monthly' },
                    { commonCode: 'Quarterly', commonDesc: 'Quarterly' },
                    { commonCode: 'Semi-Annual', commonDesc: 'Semi-Annual' },
                    { commonCode: 'Annual', commonDesc: 'Annual' },
                    { commonCode: 'M', commonDesc: 'M' },
                    { commonCode: 'Q', commonDesc: 'Q' },
                    { commonCode: 'S', commonDesc: 'S' },
                    { commonCode: 'A', commonDesc: 'A' }
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
                    { commonCode: 'Run Off', commonDesc: 'Run Off' }
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
                        disabled={loadingPriorityOptions}
                    >
                        <MenuItem value="">
                            <em style={{ color: '#6c757d' }}>
                                {loadingPriorityOptions ? 'Loading options...' : 'Select...'}
                            </em>
                        </MenuItem>
                        {priorityOptions.map((option) => (
                            <MenuItem key={option.commonCode || option.commonDesc} value={option.commonCode || option.commonDesc}>
                                {option.commonDesc || option.commonCode}
                            </MenuItem>
                        ))}
                        {treaty.priority && !priorityOptions.some((option) => (option.commonCode || option.commonDesc) === treaty.priority) && (
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
                        disabled={loadingTreatyTypeOptions}
                    >
                        <MenuItem value="">
                            <em style={{ color: '#6c757d' }}>
                                {loadingTreatyTypeOptions ? 'Loading options...' : 'Select...'}
                            </em>
                        </MenuItem>
                        {treatyTypeOptions.map((option) => (
                            <MenuItem key={option.commonCode || option.commonDesc} value={option.commonCode || option.commonDesc}>
                                {option.commonDesc || option.commonCode}
                            </MenuItem>
                        ))}
                        {treaty.treatyType && !treatyTypeOptions.some((option) => (option.commonCode || option.commonDesc) === treaty.treatyType) && (
                            <MenuItem value={treaty.treatyType}>{treaty.treatyType}</MenuItem>
                        )}
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
                    <InputLabel id={`riGradedRet-label-${blockId}`}>RI Graded Ret</InputLabel>
                    <Select
                        labelId={`riGradedRet-label-${blockId}`}
                        id={`riGradedRet-${blockId}`}
                        name="riGradedRet"
                        label="RI Graded Ret"
                        value={treaty.riGradedRet}
                        onChange={(e) => handleChange('riGradedRet', e.target.value)}
                        disabled={loadingRiGraded}
                    >
                        <MenuItem value="">
                            <em style={{ color: '#6c757d' }}>
                                {loadingRiGraded ? 'Loading options...' : 'Select...'}
                            </em>
                        </MenuItem>
                        {riGradedOptions.map((option) => (
                            <MenuItem key={option.commonCode || option.commonDesc} value={option.commonCode || option.commonDesc}>
                                {option.commonDesc || option.commonCode}
                            </MenuItem>
                        ))}
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
                        disabled={loadingTreatyCategoryOptions}
                    >
                        <MenuItem value="">
                            <em style={{ color: '#6c757d' }}>
                                {loadingTreatyCategoryOptions ? 'Loading options...' : 'Select...'}
                            </em>
                        </MenuItem>
                        {treatyCategoryOptions.map((option) => (
                            <MenuItem key={option.commonCode || option.commonDesc} value={option.commonCode || option.commonDesc}>
                                {option.commonDesc || option.commonCode}
                            </MenuItem>
                        ))}
                        {treaty.treatyCategory && !treatyCategoryOptions.some((option) => (option.commonCode || option.commonDesc) === treaty.treatyCategory) && (
                            <MenuItem value={treaty.treatyCategory}>{treaty.treatyCategory}</MenuItem>
                        )}
                    </Select>
                </FormControl>
            </Grid>

            {/* Row 3 - 4 fields */}
            <Grid item xs={12} sm={6} md={3}>
                <FormControl className={classes.formControl} fullWidth>
                    <InputLabel id={`installment-label-${blockId}`}>Installment</InputLabel>
                    <Select
                        labelId={`installment-label-${blockId}`}
                        id={`installment-${blockId}`}
                        name="installment"
                        label="Installment"
                        value={treaty.installment}
                        onChange={(e) => handleChange('installment', e.target.value)}
                        disabled={loadingInstallment}
                    >
                        <MenuItem value="">
                            <em style={{ color: '#6c757d' }}>
                                {loadingInstallment ? 'Loading options...' : 'Select...'}
                            </em>
                        </MenuItem>
                        {installmentOptions.map((option) => (
                            <MenuItem key={option.commonCode || option.commonDesc} value={option.commonCode || option.commonDesc}>
                                {option.commonDesc || option.commonCode}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
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
            <Grid item xs={12} sm={6} md={3}>
                <TextField
                    id={`premReserveRetainedRate-${blockId}`}
                    name="premReserveRetainedRate"
                    label="Prem Reserve Retained Rate(%)"
                    type="number"
                    fullWidth
                    value={treaty.premReserveRetainedRate}
                    onChange={(e) => handleChange('premReserveRetainedRate', e.target.value)}
                    className={classes.textField}
                />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <TextField
                    id={`premReserveInterestRate-${blockId}`}
                    name="premReserveInterestRate"
                    label="Prem Reserve Interest Rate(%)"
                    type="number"
                    fullWidth
                    value={treaty.premReserveInterestRate}
                    onChange={(e) => handleChange('premReserveInterestRate', e.target.value)}
                    className={classes.textField}
                />
            </Grid>

            {/* Row 4 - 4 fields */}
            <Grid item xs={12} sm={6} md={3}>
                <TextField
                    id={`portfolioPremiumEntryRate-${blockId}`}
                    name="portfolioPremiumEntryRate"
                    label="Portfolio Premium Entry Rate(%)"
                    type="number"
                    fullWidth
                    value={treaty.portfolioPremiumEntryRate}
                    onChange={(e) => handleChange('portfolioPremiumEntryRate', e.target.value)}
                    className={classes.textField}
                />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <TextField
                    id={`portfolioClaimEntryRate-${blockId}`}
                    name="portfolioClaimEntryRate"
                    label="Portfolio Claim Entry Rate(%)"
                    type="number"
                    fullWidth
                    value={treaty.portfolioClaimEntryRate}
                    onChange={(e) => handleChange('portfolioClaimEntryRate', e.target.value)}
                    className={classes.textField}
                />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <TextField
                    id={`portfolioPremWithdRate-${blockId}`}
                    name="portfolioPremWithdRate"
                    label="Portfolio Prem Withd. Rate(%)"
                    type="number"
                    fullWidth
                    value={treaty.portfolioPremWithdRate}
                    onChange={(e) => handleChange('portfolioPremWithdRate', e.target.value)}
                    className={classes.textField}
                />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <TextField
                    id={`portfolioClaimWithdRate-${blockId}`}
                    name="portfolioClaimWithdRate"
                    label="Portfolio Claim Withd. Rate(%)"
                    type="number"
                    fullWidth
                    value={treaty.portfolioClaimWithdRate}
                    onChange={(e) => handleChange('portfolioClaimWithdRate', e.target.value)}
                    className={classes.textField}
                />
            </Grid>

            {/* Row 5 - 2 fields */}
            <Grid item xs={12} sm={6} md={3}>
                <TextField
                    id={`managementExpenses-${blockId}`}
                    name="managementExpenses"
                    label="Management Expenses(%)"
                    type="number"
                    fullWidth
                    value={treaty.managementExpenses}
                    onChange={(e) => handleChange('managementExpenses', e.target.value)}
                    className={classes.textField}
                />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <TextField
                    id={`taxesAndOtherExpenses-${blockId}`}
                    name="taxesAndOtherExpenses"
                    label="Taxes And Other Expenses(%)"
                    type="number"
                    fullWidth
                    value={treaty.taxesAndOtherExpenses}
                    onChange={(e) => handleChange('taxesAndOtherExpenses', e.target.value)}
                    className={classes.textField}
                />
            </Grid>
        </Grid>
    );
};
