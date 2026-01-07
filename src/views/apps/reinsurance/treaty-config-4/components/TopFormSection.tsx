import { Box, Card, FormControl, Select, MenuItem, TextField, Button, Chip, Grid, Typography } from '@mui/material';
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
    onTreatyStartDateChange: (date: Date | null) => void;
    onTreatyEndDateChange: (date: Date | null) => void;
    onCurrencyChange: (value: string) => void;
    onSelectModeChange: (mode: string) => void;
}

export const TopFormSection = ({
    portfolio, companyUIN, currentOperatingUIN, operatingUnitUINs,
    treatyStartDate, treatyEndDate, currency, selectMode,
    onPortfolioChange, onCompanyUINChange, onCurrentOperatingUINChange,
    onAddOperatingUIN, onRemoveOperatingUIN,
    onTreatyStartDateChange, onTreatyEndDateChange, onCurrencyChange, onSelectModeChange
}: TopFormSectionProps) => (
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
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
                <FieldLabel>Operating Unit UIN</FieldLabel>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <FormControl fullWidth size="small">
                        <Select
                            value={currentOperatingUIN}
                            onChange={(e) => onCurrentOperatingUINChange(e.target.value)}
                            displayEmpty
                            sx={{ backgroundColor: 'white' }}
                        >
                            <MenuItem value="">Select Unit...</MenuItem>
                            <MenuItem value="OU-North">OU-North</MenuItem>
                            <MenuItem value="OU-South">OU-South</MenuItem>
                            <MenuItem value="OU-East">OU-East</MenuItem>
                            <MenuItem value="OU-West">OU-West</MenuItem>
                        </Select>
                    </FormControl>
                    {currentOperatingUIN && (
                        <Button
                            size="small"
                            onClick={onAddOperatingUIN}
                            variant="contained"
                            sx={{ minWidth: '40px', backgroundColor: '#28a745', '&:hover': { backgroundColor: '#218838' } }}
                        >
                            <AddIcon fontSize="small" />
                        </Button>
                    )}
                </Box>
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
        {operatingUnitUINs.length > 0 && (
            <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {operatingUnitUINs.map((uin) => (
                    <Chip
                        key={uin}
                        label={uin}
                        onDelete={() => onRemoveOperatingUIN(uin)}
                        size="small"
                        sx={{ backgroundColor: '#e3f2fd', color: '#1976d2' }}
                    />
                ))}
            </Box>
        )}
    </Card>
);
