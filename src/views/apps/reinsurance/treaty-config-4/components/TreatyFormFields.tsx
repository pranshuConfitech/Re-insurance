import { Grid, TextField, FormControl, Select, MenuItem } from '@mui/material';
import { FieldLabel } from './FieldLabel';

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
}

interface TreatyFormFieldsProps {
    treaty: Treaty;
    blockId: string;
    onTreatyChange: (blockId: string, field: string, value: string) => void;
}

export const TreatyFormFields = ({ treaty, blockId, onTreatyChange }: TreatyFormFieldsProps) => {
    const handleChange = (field: string, value: string) => {
        onTreatyChange(blockId, field, value);
    };

    return (
        <Grid container spacing={3}>
            {/* Row 1 - 4 fields */}
            <Grid item xs={12} sm={6} md={3}>
                <FieldLabel>Treaty Code</FieldLabel>
                <TextField fullWidth size="small" value={treaty.treatyCode} onChange={(e) => handleChange('treatyCode', e.target.value)} sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <FieldLabel>Priority</FieldLabel>
                <TextField fullWidth size="small" type="number" value={treaty.priority} onChange={(e) => handleChange('priority', e.target.value)} sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <FieldLabel>Treaty Type</FieldLabel>
                <FormControl fullWidth size="small">
                    <Select value={treaty.treatyType} onChange={(e) => handleChange('treatyType', e.target.value)} sx={{ backgroundColor: 'white' }}>
                        <MenuItem value="Quota Share">Quota Share</MenuItem>
                        <MenuItem value="Surplus">Surplus</MenuItem>
                        <MenuItem value="Facultative">Facultative</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <FieldLabel>Treaty Name</FieldLabel>
                <TextField fullWidth size="small" value={treaty.treatyName} onChange={(e) => handleChange('treatyName', e.target.value)} sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }} />
            </Grid>

            {/* Row 2 - 4 fields */}
            <Grid item xs={12} sm={6} md={3}>
                <FieldLabel>Business Treaty Reference Number</FieldLabel>
                <TextField fullWidth size="small" value={treaty.businessTreatyReferenceNumber} onChange={(e) => handleChange('businessTreatyReferenceNumber', e.target.value)} sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <FieldLabel>RI Graded Ret</FieldLabel>
                <FormControl fullWidth size="small">
                    <Select value={treaty.riGradedRet} onChange={(e) => handleChange('riGradedRet', e.target.value)} displayEmpty sx={{ backgroundColor: 'white' }}>
                        <MenuItem value="">Select...</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                        <MenuItem value="Yes">Yes</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <FieldLabel>Former Treaty Code</FieldLabel>
                <TextField fullWidth size="small" value={treaty.formerTreatyCode} onChange={(e) => handleChange('formerTreatyCode', e.target.value)} sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <FieldLabel>Treaty Category</FieldLabel>
                <FormControl fullWidth size="small">
                    <Select value={treaty.treatyCategory} onChange={(e) => handleChange('treatyCategory', e.target.value)} displayEmpty sx={{ backgroundColor: 'white' }}>
                        <MenuItem value="">Select...</MenuItem>
                        <MenuItem value="M">M</MenuItem>
                        <MenuItem value="F">F</MenuItem>
                    </Select>
                </FormControl>
            </Grid>

            {/* Row 3 - 4 fields */}
            <Grid item xs={12} sm={6} md={3}>
                <FieldLabel>Installment</FieldLabel>
                <FormControl fullWidth size="small">
                    <Select value={treaty.installment} onChange={(e) => handleChange('installment', e.target.value)} displayEmpty sx={{ backgroundColor: 'white' }}>
                        <MenuItem value="">Select...</MenuItem>
                        <MenuItem value="M">M</MenuItem>
                        <MenuItem value="Q">Q</MenuItem>
                        <MenuItem value="A">A</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <FieldLabel>Processing Portfolio Method</FieldLabel>
                <FormControl fullWidth size="small">
                    <Select value={treaty.processingPortfolioMethod} onChange={(e) => handleChange('processingPortfolioMethod', e.target.value)} displayEmpty sx={{ backgroundColor: 'white' }}>
                        <MenuItem value="">Select...</MenuItem>
                        <MenuItem value="Clean Cut">Clean Cut</MenuItem>
                        <MenuItem value="Run Off">Run Off</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <FieldLabel>Prem Reserve Retained Rate(%)</FieldLabel>
                <TextField fullWidth size="small" type="number" value={treaty.premReserveRetainedRate} onChange={(e) => handleChange('premReserveRetainedRate', e.target.value)} sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <FieldLabel>Prem Reserve Interest Rate(%)</FieldLabel>
                <TextField fullWidth size="small" type="number" value={treaty.premReserveInterestRate} onChange={(e) => handleChange('premReserveInterestRate', e.target.value)} sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }} />
            </Grid>

            {/* Row 4 - 4 fields */}
            <Grid item xs={12} sm={6} md={3}>
                <FieldLabel>Portfolio Premium Entry Rate(%)</FieldLabel>
                <TextField fullWidth size="small" type="number" value={treaty.portfolioPremiumEntryRate} onChange={(e) => handleChange('portfolioPremiumEntryRate', e.target.value)} sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <FieldLabel>Portfolio Claim Entry Rate(%)</FieldLabel>
                <TextField fullWidth size="small" type="number" value={treaty.portfolioClaimEntryRate} onChange={(e) => handleChange('portfolioClaimEntryRate', e.target.value)} sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <FieldLabel>Portfolio Prem Withd. Rate(%)</FieldLabel>
                <TextField fullWidth size="small" type="number" value={treaty.portfolioPremWithdRate} onChange={(e) => handleChange('portfolioPremWithdRate', e.target.value)} sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <FieldLabel>Portfolio Claim Withd. Rate(%)</FieldLabel>
                <TextField fullWidth size="small" type="number" value={treaty.portfolioClaimWithdRate} onChange={(e) => handleChange('portfolioClaimWithdRate', e.target.value)} sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }} />
            </Grid>

            {/* Row 5 - 2 fields */}
            <Grid item xs={12} sm={6} md={3}>
                <FieldLabel>Management Expenses(%)</FieldLabel>
                <TextField fullWidth size="small" type="number" value={treaty.managementExpenses} onChange={(e) => handleChange('managementExpenses', e.target.value)} sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <FieldLabel>Taxes And Other Expenses(%)</FieldLabel>
                <TextField fullWidth size="small" type="number" value={treaty.taxesAndOtherExpenses} onChange={(e) => handleChange('taxesAndOtherExpenses', e.target.value)} sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }} />
            </Grid>
        </Grid>
    );
};
