import { Grid, TextField, FormControl, Select, MenuItem } from '@mui/material';
import { FieldLabel } from './FieldLabel';

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
    discussion: string;
    annualAggregateLimit: string;
    annualAggDeductible: string;
    totalNumberOfRI: string;
    capacity: string;
    xolBasisForShare: string;
    xolReinstmtForPremio: string;
    xolReinstmtForPremioYes: string;
    proRataOfAmount: string;
    proRataOfTime: string;
    sumInsuredRate: string;
    sumInsuredOccurRate: string;
    premiumOccurRate: string;
    perXlSumInsuredPerRiskLimit: string;
    processingPortfolioMethod: string;
    premReserveRetainedRate: string;
    premReserveInterestRate: string;
}

interface NonProportionalTreatyFieldsProps {
    treaty: NonProportionalTreaty;
    blockId: string;
    treatyId: string;
    onTreatyChange: (blockId: string, treatyId: string, field: string, value: string) => void;
}

export const NonProportionalTreatyFields = ({ treaty, blockId, treatyId, onTreatyChange }: NonProportionalTreatyFieldsProps) => {
    const handleChange = (field: string, value: string) => {
        onTreatyChange(blockId, treatyId, field, value);
    };

    return (
        <Grid container spacing={2.5}>
            {/* Row 1 */}
            <Grid item xs={6} sm={4} md={2}>
                <FieldLabel>Treaty Code</FieldLabel>
                <TextField fullWidth size="small" value={treaty.treatyCode} onChange={(e) => handleChange('treatyCode', e.target.value)} sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }} />
            </Grid>
            <Grid item xs={6} sm={4} md={1.5}>
                <FieldLabel>Priority</FieldLabel>
                <TextField fullWidth size="small" type="number" value={treaty.priority} onChange={(e) => handleChange('priority', e.target.value)} sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }} />
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
                <FieldLabel>Treaty Type</FieldLabel>
                <FormControl fullWidth size="small">
                    <Select value={treaty.treatyType} onChange={(e) => handleChange('treatyType', e.target.value)} sx={{ backgroundColor: 'white' }}>
                        <MenuItem value="XOL">XOL</MenuItem>
                        <MenuItem value="Stop Loss">Stop Loss</MenuItem>
                        <MenuItem value="Cat XOL">Cat XOL</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={6} sm={4} md={2.5}>
                <FieldLabel>Treaty Name</FieldLabel>
                <TextField fullWidth size="small" value={treaty.treatyName} onChange={(e) => handleChange('treatyName', e.target.value)} sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }} />
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
                <FieldLabel>Business Treaty Ref. Number</FieldLabel>
                <TextField fullWidth size="small" value={treaty.businessTreatyReferenceNumber} onChange={(e) => handleChange('businessTreatyReferenceNumber', e.target.value)} sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }} />
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
                <FieldLabel>XOL Type</FieldLabel>
                <FormControl fullWidth size="small">
                    <Select value={treaty.xolType} onChange={(e) => handleChange('xolType', e.target.value)} displayEmpty sx={{ backgroundColor: 'white' }}>
                        <MenuItem value="">Select...</MenuItem>
                        <MenuItem value="Loss Occurring">Loss Occurring</MenuItem>
                        <MenuItem value="Risk Attaching">Risk Attaching</MenuItem>
                    </Select>
                </FormControl>
            </Grid>

            {/* Row 2 */}
            <Grid item xs={6} sm={4} md={2}>
                <FieldLabel>Former Treaty Code</FieldLabel>
                <TextField fullWidth size="small" value={treaty.formerTreatyCode} onChange={(e) => handleChange('formerTreatyCode', e.target.value)} sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }} />
            </Grid>
            <Grid item xs={6} sm={4} md={1.5}>
                <FieldLabel>Treaty Category</FieldLabel>
                <FormControl fullWidth size="small">
                    <Select value={treaty.treatyCategory} onChange={(e) => handleChange('treatyCategory', e.target.value)} displayEmpty sx={{ backgroundColor: 'white' }}>
                        <MenuItem value="">Select...</MenuItem>
                        <MenuItem value="M">M</MenuItem>
                        <MenuItem value="F">F</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={6} sm={4} md={1.5}>
                <FieldLabel>Treaty Status</FieldLabel>
                <FormControl fullWidth size="small">
                    <Select value={treaty.treatyStatus} onChange={(e) => handleChange('treatyStatus', e.target.value)} displayEmpty sx={{ backgroundColor: 'white' }}>
                        <MenuItem value="">Select...</MenuItem>
                        <MenuItem value="Active">Active</MenuItem>
                        <MenuItem value="Inactive">Inactive</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={6} sm={4} md={1.5}>
                <FieldLabel>Treaty Currency</FieldLabel>
                <FormControl fullWidth size="small">
                    <Select value={treaty.treatyCurrency} onChange={(e) => handleChange('treatyCurrency', e.target.value)} displayEmpty sx={{ backgroundColor: 'white' }}>
                        <MenuItem value="">Select...</MenuItem>
                        <MenuItem value="USD">USD</MenuItem>
                        <MenuItem value="EUR">EUR</MenuItem>
                        <MenuItem value="GBP">GBP</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={6} sm={4} md={1.5}>
                <FieldLabel>Discussion</FieldLabel>
                <FormControl fullWidth size="small">
                    <Select value={treaty.discussion} onChange={(e) => handleChange('discussion', e.target.value)} displayEmpty sx={{ backgroundColor: 'white' }}>
                        <MenuItem value="">Select...</MenuItem>
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
                <FieldLabel>Annual Aggregate Limit</FieldLabel>
                <TextField fullWidth size="small" value={treaty.annualAggregateLimit} onChange={(e) => handleChange('annualAggregateLimit', e.target.value)} sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }} />
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
                <FieldLabel>Annual Agg Deductible</FieldLabel>
                <TextField fullWidth size="small" value={treaty.annualAggDeductible} onChange={(e) => handleChange('annualAggDeductible', e.target.value)} sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }} />
            </Grid>

            {/* Row 3 */}
            <Grid item xs={6} sm={4} md={2}>
                <FieldLabel>Total Number Of RI</FieldLabel>
                <TextField fullWidth size="small" value={treaty.totalNumberOfRI} onChange={(e) => handleChange('totalNumberOfRI', e.target.value)} sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }} />
            </Grid>
            <Grid item xs={6} sm={4} md={1.5}>
                <FieldLabel>Capacity</FieldLabel>
                <TextField fullWidth size="small" value={treaty.capacity} onChange={(e) => handleChange('capacity', e.target.value)} sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }} />
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
                <FieldLabel>XOL Basis For Share</FieldLabel>
                <FormControl fullWidth size="small">
                    <Select value={treaty.xolBasisForShare} onChange={(e) => handleChange('xolBasisForShare', e.target.value)} displayEmpty sx={{ backgroundColor: 'white' }}>
                        <MenuItem value="">Select...</MenuItem>
                        <MenuItem value="Premium">Premium</MenuItem>
                        <MenuItem value="Loss">Loss</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
                <FieldLabel>XOL Reinstmt For Premio</FieldLabel>
                <FormControl fullWidth size="small">
                    <Select value={treaty.xolReinstmtForPremio} onChange={(e) => handleChange('xolReinstmtForPremio', e.target.value)} displayEmpty sx={{ backgroundColor: 'white' }}>
                        <MenuItem value="">Select...</MenuItem>
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
                <FieldLabel>XOL Reinstmt For Premio (Yes)</FieldLabel>
                <TextField fullWidth size="small" value={treaty.xolReinstmtForPremioYes} onChange={(e) => handleChange('xolReinstmtForPremioYes', e.target.value)} sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }} />
            </Grid>
            <Grid item xs={6} sm={4} md={1.5}>
                <FieldLabel>Pro Rata Of Amount</FieldLabel>
                <FormControl fullWidth size="small">
                    <Select value={treaty.proRataOfAmount} onChange={(e) => handleChange('proRataOfAmount', e.target.value)} displayEmpty sx={{ backgroundColor: 'white' }}>
                        <MenuItem value="">Select...</MenuItem>
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={6} sm={4} md={1}>
                <FieldLabel>Pro Rata Of Time</FieldLabel>
                <FormControl fullWidth size="small">
                    <Select value={treaty.proRataOfTime} onChange={(e) => handleChange('proRataOfTime', e.target.value)} displayEmpty sx={{ backgroundColor: 'white' }}>
                        <MenuItem value="">Select...</MenuItem>
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                    </Select>
                </FormControl>
            </Grid>

            {/* Row 4 */}
            <Grid item xs={6} sm={4} md={2}>
                <FieldLabel>Sum Insured Rate</FieldLabel>
                <TextField fullWidth size="small" value={treaty.sumInsuredRate} onChange={(e) => handleChange('sumInsuredRate', e.target.value)} sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }} />
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
                <FieldLabel>Sum Insured Occur Rate</FieldLabel>
                <TextField fullWidth size="small" value={treaty.sumInsuredOccurRate} onChange={(e) => handleChange('sumInsuredOccurRate', e.target.value)} sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }} />
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
                <FieldLabel>Premium Occur Rate</FieldLabel>
                <TextField fullWidth size="small" value={treaty.premiumOccurRate} onChange={(e) => handleChange('premiumOccurRate', e.target.value)} sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }} />
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
                <FieldLabel>Per XL Sum Insured Per Risk Limit</FieldLabel>
                <TextField fullWidth size="small" value={treaty.perXlSumInsuredPerRiskLimit} onChange={(e) => handleChange('perXlSumInsuredPerRiskLimit', e.target.value)} sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }} />
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
                <FieldLabel>Processing Portfolio Method</FieldLabel>
                <FormControl fullWidth size="small">
                    <Select value={treaty.processingPortfolioMethod} onChange={(e) => handleChange('processingPortfolioMethod', e.target.value)} sx={{ backgroundColor: 'white' }}>
                        <MenuItem value="Clean Cut">Clean Cut</MenuItem>
                        <MenuItem value="Run Off">Run Off</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
                <FieldLabel>Prem Reserve Retained Rate(%)</FieldLabel>
                <TextField fullWidth size="small" value={treaty.premReserveRetainedRate} onChange={(e) => handleChange('premReserveRetainedRate', e.target.value)} sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }} />
            </Grid>

            {/* Row 5 */}
            <Grid item xs={6} sm={4} md={2}>
                <FieldLabel>Prem Reserve Interest Rate(%)</FieldLabel>
                <TextField fullWidth size="small" value={treaty.premReserveInterestRate} onChange={(e) => handleChange('premReserveInterestRate', e.target.value)} sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }} />
            </Grid>
        </Grid>
    );
};
