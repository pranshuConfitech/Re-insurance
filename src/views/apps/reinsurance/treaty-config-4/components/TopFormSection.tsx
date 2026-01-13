import { Box, Card, FormControl, Select, MenuItem, TextField, Button, Chip, Grid, Typography, Checkbox, ListItemText, OutlinedInput } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import AddIcon from '@mui/icons-material/Add';
import { FieldLabel } from './FieldLabel';

interface TopFormSectionProps {
    portfolio: string;
    companyUIN: string;
    currentOperatingUIN: string;
    operatingUnitUINs: string[];
    treatyStartDate: Date | null;
    treatyEndDate: Date | null;
    currency: string;
    selectMode: string;
    onPortfolioChange: (value: string) => void;
    onCompanyUINChange: (value: string) => void;
    onCurrentOperatingUINChange: (value: string) => void;
    onAddOperatingUIN: () => void;
    onRemoveOperatingUIN: (uin: string) => void;
    onOperatingUnitUINsChange: (uins: string[]) => void;
    onTreatyStartDateChange: (date: Date | null) => void;
    onTreatyEndDateChange: (date: Date | null) => void;
    onCurrencyChange: (value: string) => void;
    onSelectModeChange: (mode: string) => void;
}

const OPERATING_UNITS = [
    'OU-North',
    'OU-South',
    'OU-East',
    'OU-West',
    'OU-Central',
    'OU-Northeast',
    'OU-Southwest',
    'PROP-IN',
    'PROP-IN-2',
    'NP-IN-01',
    'NP-IN-02',
    'OU-INDIAs'
];

export const TopFormSection = ({
    portfolio, companyUIN, currentOperatingUIN, operatingUnitUINs,
    treatyStartDate, treatyEndDate, currency, selectMode,
    onPortfolioChange, onCompanyUINChange, onCurrentOperatingUINChange,
    onAddOperatingUIN, onRemoveOperatingUIN, onOperatingUnitUINsChange,
    onTreatyStartDateChange, onTreatyEndDateChange, onCurrencyChange, onSelectModeChange
}: TopFormSectionProps) => {

    // Combine predefined units with any custom units from the data
    const allOperatingUnits = [...new Set([...OPERATING_UNITS, ...operatingUnitUINs])];

    const handleOperatingUnitChange = (event: any) => {
        const value = event.target.value;
        const newSelection = typeof value === 'string' ? value.split(',') : value;
        onOperatingUnitUINsChange(newSelection);
    };

    return (
        <Card sx={{ p: 3, mb: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', backgroundColor: 'white' }}>
            {/* Treaty Type Selection */}
            <Box sx={{ mb: 3, pb: 2, borderBottom: '1px solid #e0e0e0' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a', mb: 2 }}>
                    Treaty Type
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Button
                        variant={selectMode === 'Treaty (Proportional)' ? 'contained' : 'outlined'}
                        onClick={() => onSelectModeChange('Treaty (Proportional)')}
                        disableRipple
                        disableElevation
                        sx={{
                            textTransform: 'none',
                            fontWeight: 600,
                            px: 3,
                            py: 1,
                            borderRadius: '6px',
                            ...(selectMode === 'Treaty (Proportional)' ? {
                                backgroundColor: '#007bff !important',
                                color: 'white !important',
                                '&:hover': {
                                    backgroundColor: '#0056b3 !important'
                                },
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            } : {
                                borderColor: '#007bff !important',
                                color: '#007bff !important',
                                backgroundColor: 'transparent !important',
                                '&:hover': {
                                    borderColor: '#007bff !important',
                                    backgroundColor: '#e9ecef !important',
                                    color: '#007bff !important'
                                }
                            })
                        }}
                    >
                        Treaty Proportional
                    </Button>
                    <Button
                        variant={selectMode === 'Treaty (Non Proportional)' ? 'contained' : 'outlined'}
                        onClick={() => onSelectModeChange('Treaty (Non Proportional)')}
                        disableRipple
                        disableElevation
                        sx={{
                            textTransform: 'none',
                            fontWeight: 600,
                            px: 3,
                            py: 1,
                            borderRadius: '6px',
                            ...(selectMode === 'Treaty (Non Proportional)' ? {
                                backgroundColor: '#007bff !important',
                                color: 'white !important',
                                '&:hover': {
                                    backgroundColor: '#0056b3 !important'
                                },
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            } : {
                                borderColor: '#007bff !important',
                                color: '#007bff !important',
                                backgroundColor: 'transparent !important',
                                '&:hover': {
                                    borderColor: '#007bff !important',
                                    backgroundColor: '#e9ecef !important',
                                    color: '#007bff !important'
                                }
                            })
                        }}
                    >
                        Treaty Non Proportional
                    </Button>
                </Box>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={2.4}>
                    <FieldLabel>Portfolio</FieldLabel>
                    <TextField
                        fullWidth
                        size="small"
                        value={portfolio}
                        onChange={(e) => onPortfolioChange(e.target.value)}
                        sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                    <FieldLabel>Company UIN</FieldLabel>
                    <FormControl fullWidth size="small">
                        <Select
                            value={companyUIN}
                            onChange={(e) => onCompanyUINChange(e.target.value)}
                            displayEmpty
                            sx={{ backgroundColor: 'white' }}
                        >
                            <MenuItem value="">Select Company...</MenuItem>
                            <MenuItem value="UIN-1001">UIN-1001</MenuItem>
                            <MenuItem value="UIN-1002">UIN-1002</MenuItem>
                            <MenuItem value="UIN-1003">UIN-1003</MenuItem>
                            <MenuItem value="INS-RE-002">INS-RE-002</MenuItem>
                            <MenuItem value="INS-RE-003">INS-RE-003</MenuItem>
                            <MenuItem value="INS-1001">INS-1001</MenuItem>
                            {/* Show current value if not in list */}
                            {companyUIN && !['', 'UIN-1001', 'UIN-1002', 'UIN-1003', 'INS-RE-002', 'INS-RE-003', 'INS-1001'].includes(companyUIN) && (
                                <MenuItem value={companyUIN}>{companyUIN}</MenuItem>
                            )}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                    <FieldLabel>Operating Unit UIN</FieldLabel>
                    <FormControl fullWidth size="small">
                        <Select
                            multiple
                            value={operatingUnitUINs}
                            onChange={handleOperatingUnitChange}
                            input={<OutlinedInput />}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {(selected as string[]).length === 0 ? (
                                        <Typography variant="body2" sx={{ color: '#9e9e9e', fontSize: '14px' }}>
                                            Select Operating Units...
                                        </Typography>
                                    ) : (
                                        (selected as string[]).map((value) => (
                                            <Chip
                                                key={value}
                                                label={value}
                                                size="small"
                                                sx={{
                                                    backgroundColor: '#e3f2fd',
                                                    color: '#1565c0',
                                                    fontSize: '12px',
                                                    height: '24px'
                                                }}
                                            />
                                        ))
                                    )}
                                </Box>
                            )}
                            displayEmpty
                            sx={{
                                backgroundColor: 'white',
                                '& .MuiSelect-select': {
                                    minHeight: '20px',
                                    display: 'flex',
                                    alignItems: 'center'
                                }
                            }}
                            MenuProps={{
                                PaperProps: {
                                    style: {
                                        maxHeight: 300,
                                        width: 250,
                                    },
                                },
                            }}
                        >
                            <MenuItem disabled value="">
                                <em style={{ color: '#6c757d' }}>Select Operating Units...</em>
                            </MenuItem>
                            {allOperatingUnits.map((unit) => (
                                <MenuItem key={unit} value={unit}>
                                    <Checkbox
                                        checked={operatingUnitUINs.indexOf(unit) > -1}
                                        sx={{
                                            color: '#626BDA',
                                            '&.Mui-checked': {
                                                color: '#626BDA',
                                            }
                                        }}
                                    />
                                    <ListItemText
                                        primary={unit}
                                        sx={{
                                            '& .MuiListItemText-primary': {
                                                fontSize: '14px',
                                                fontWeight: operatingUnitUINs.indexOf(unit) > -1 ? 600 : 400
                                            }
                                        }}
                                    />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                    <FieldLabel>Treaty Start Date</FieldLabel>
                    <DatePicker
                        label=""
                        value={treatyStartDate}
                        onChange={onTreatyStartDateChange}
                        renderInput={(params: any) => (
                            <TextField {...params} size="small" fullWidth sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }} />
                        )}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                    <FieldLabel>Treaty End Date</FieldLabel>
                    <DatePicker
                        label=""
                        value={treatyEndDate}
                        onChange={onTreatyEndDateChange}
                        renderInput={(params: any) => (
                            <TextField {...params} size="small" fullWidth sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'white' } }} />
                        )}
                    />
                </Grid>
            </Grid>
            <Grid container spacing={3} sx={{ mt: 0.5 }}>
                <Grid item xs={12} sm={6} md={2.4}>
                    <FieldLabel>Currency</FieldLabel>
                    <FormControl fullWidth size="small">
                        <Select value={currency} onChange={(e) => onCurrencyChange(e.target.value)} sx={{ backgroundColor: 'white' }}>
                            <MenuItem value="USD">USD</MenuItem>
                            <MenuItem value="EUR">EUR</MenuItem>
                            <MenuItem value="GBP">GBP</MenuItem>
                            <MenuItem value="INR">INR</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
        </Card>
    );
};
