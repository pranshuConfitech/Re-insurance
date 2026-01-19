import { Grid, TextField, FormControl, Select, MenuItem, Box, InputLabel } from '@mui/material';
import { makeStyles } from '@mui/styles';

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
                        <MenuItem value="PRIMARY">PRIMARY</MenuItem>
                        <MenuItem value="SECONDARY">SECONDARY</MenuItem>
                        <MenuItem value="HIGH">HIGH</MenuItem>
                        <MenuItem value="MEDIUM">MEDIUM</MenuItem>
                        <MenuItem value="LOW">LOW</MenuItem>
                        <MenuItem value="1">1</MenuItem>
                        <MenuItem value="2">2</MenuItem>
                        <MenuItem value="3">3</MenuItem>
                        {treaty.priority && !['', 'PRIMARY', 'SECONDARY', 'HIGH', 'MEDIUM', 'LOW', '1', '2', '3'].includes(treaty.priority) && (
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
                        <MenuItem value="Quota Share">Quota Share</MenuItem>
                        <MenuItem value="Surplus">Surplus</MenuItem>
                        <MenuItem value="Facultative">Facultative</MenuItem>
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
                    >
                        <MenuItem value="">Select...</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                        <MenuItem value="Yes">Yes</MenuItem>
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
                        <MenuItem value="M">M</MenuItem>
                        <MenuItem value="F">F</MenuItem>
                        <MenuItem value="PROPERTY">PROPERTY</MenuItem>
                        <MenuItem value="CASUALTY">CASUALTY</MenuItem>
                        <MenuItem value="MARINE">MARINE</MenuItem>
                        <MenuItem value="PROPORTIONAL">PROPORTIONAL</MenuItem>
                        <MenuItem value="NON_PROP">NON_PROP</MenuItem>
                        {treaty.treatyCategory && !['', 'M', 'F', 'PROPERTY', 'CASUALTY', 'MARINE', 'PROPORTIONAL', 'NON_PROP'].includes(treaty.treatyCategory) && (
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
                    >
                        <MenuItem value="">Select...</MenuItem>
                        <MenuItem value="Monthly">Monthly</MenuItem>
                        <MenuItem value="Quarterly">Quarterly</MenuItem>
                        <MenuItem value="Semi-Annual">Semi-Annual</MenuItem>
                        <MenuItem value="Annual">Annual</MenuItem>
                        <MenuItem value="M">M</MenuItem>
                        <MenuItem value="Q">Q</MenuItem>
                        <MenuItem value="S">S</MenuItem>
                        <MenuItem value="A">A</MenuItem>
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
                    >
                        <MenuItem value="">Select...</MenuItem>
                        <MenuItem value="Clean Cut">Clean Cut</MenuItem>
                        <MenuItem value="Run Off">Run Off</MenuItem>
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
