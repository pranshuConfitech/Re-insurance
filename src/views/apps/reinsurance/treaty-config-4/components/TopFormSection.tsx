import { Box, Card, FormControl, Select, MenuItem, TextField, Button, Chip, Grid, Typography, Checkbox, ListItemText, InputLabel, Autocomplete } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import AddIcon from '@mui/icons-material/Add';
import { makeStyles } from '@mui/styles';
import { useState, useEffect } from 'react';
import { CommonMastersService } from '@/services/remote-api/api/master-services/common.masters.service';

const commonMastersService = new CommonMastersService();

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
    'UN-North',
    'UN-South',
    'UN-East',
    'UN-West',
    'UN-Central',
    'UN-Northeast',
    'UN-Southwest',
    'PROP-IN',
    'PROP-IN-2',
    'NP-IN-01',
    'NP-IN-02',
    'UN-INDIAs'
];

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

export const TopFormSection = ({
    portfolio, companyUIN, currentOperatingUIN, operatingUnitUINs,
    treatyStartDate, treatyEndDate, currency, selectMode,
    onPortfolioChange, onCompanyUINChange, onCurrentOperatingUINChange,
    onAddOperatingUIN, onRemoveOperatingUIN, onOperatingUnitUINsChange,
    onTreatyStartDateChange, onTreatyEndDateChange, onCurrencyChange, onSelectModeChange
}: TopFormSectionProps) => {
    const classes = useStyles();

    // State for API dropdown data
    const [currencies, setCurrencies] = useState<any[]>([]);
    const [operatingUnits, setOperatingUnits] = useState<any[]>([]);
    const [loadingCurrencies, setLoadingCurrencies] = useState(false);
    const [loadingOperatingUnits, setLoadingOperatingUnits] = useState(false);

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
                    { commonCode: 'INR', commonDesc: 'INR' }
                ]);
            }
        });
    }, []);

    // Fetch operating units from API
    useEffect(() => {
        setLoadingOperatingUnits(true);
        commonMastersService.getOperatingUnits().subscribe({
            next: (response) => {
                if (response && response.content) {
                    setOperatingUnits(response.content);
                }
                setLoadingOperatingUnits(false);
            },
            error: (error) => {
                console.error('Error fetching operating units:', error);
                setLoadingOperatingUnits(false);
                // Fallback to hardcoded values
                setOperatingUnits(OPERATING_UNITS.map(unit => ({ commonCode: unit, commonDesc: unit })));
            }
        });
    }, []);

    // Combine API data with any custom units from the form data
    const allOperatingUnits = [
        ...operatingUnits.map(unit => unit.commonCode || unit.commonDesc),
        ...operatingUnitUINs.filter(uin => !operatingUnits.some(unit => (unit.commonCode || unit.commonDesc) === uin))
    ];

    return (
        <Card sx={{ p: 3, mb: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', backgroundColor: 'white' }}>
            {/* Treaty Type Selection */}
            <Box sx={{ mb: 3, pb: 2, borderBottom: '1px solid #e0e0e0' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
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
                                    backgroundColor: '#D80E51 !important',
                                    color: 'white !important',
                                    border: 'none !important',
                                    '&:hover': {
                                        backgroundColor: '#b80c43 !important'
                                    },
                                    '&:active': {
                                        backgroundColor: '#b80c43 !important'
                                    },
                                    '&.Mui-focusVisible': {
                                        backgroundColor: '#D80E51 !important'
                                    },
                                    boxShadow: '0 2px 4px rgba(216, 14, 81, 0.3) !important',
                                } : {
                                    borderColor: '#D80E51 !important',
                                    color: '#D80E51 !important',
                                    backgroundColor: 'transparent !important',
                                    '&:hover': {
                                        borderColor: '#D80E51 !important',
                                        backgroundColor: 'rgba(216, 14, 81, 0.1) !important',
                                        color: '#D80E51 !important'
                                    },
                                    '&:active': {
                                        borderColor: '#D80E51 !important',
                                        backgroundColor: 'rgba(216, 14, 81, 0.1) !important',
                                        color: '#D80E51 !important'
                                    },
                                    '&.Mui-focusVisible': {
                                        borderColor: '#D80E51 !important',
                                        backgroundColor: 'rgba(216, 14, 81, 0.1) !important',
                                        color: '#D80E51 !important'
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
                                    backgroundColor: '#D80E51 !important',
                                    color: 'white !important',
                                    border: 'none !important',
                                    '&:hover': {
                                        backgroundColor: '#b80c43 !important'
                                    },
                                    '&:active': {
                                        backgroundColor: '#b80c43 !important'
                                    },
                                    '&.Mui-focusVisible': {
                                        backgroundColor: '#D80E51 !important'
                                    },
                                    boxShadow: '0 2px 4px rgba(216, 14, 81, 0.3) !important',
                                } : {
                                    borderColor: '#D80E51 !important',
                                    color: '#D80E51 !important',
                                    backgroundColor: 'transparent !important',
                                    '&:hover': {
                                        borderColor: '#D80E51 !important',
                                        backgroundColor: 'rgba(216, 14, 81, 0.1) !important',
                                        color: '#D80E51 !important'
                                    },
                                    '&:active': {
                                        borderColor: '#D80E51 !important',
                                        backgroundColor: 'rgba(216, 14, 81, 0.1) !important',
                                        color: '#D80E51 !important'
                                    },
                                    '&.Mui-focusVisible': {
                                        borderColor: '#D80E51 !important',
                                        backgroundColor: 'rgba(216, 14, 81, 0.1) !important',
                                        color: '#D80E51 !important'
                                    }
                                })
                            }}
                        >
                            Treaty Non Proportional
                        </Button>
                    </Box>
                </Box>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={2.4}>
                    <TextField
                        id="portfolio"
                        name="portfolio"
                        label="Portfolio"
                        fullWidth
                        value={portfolio}
                        onChange={(e) => onPortfolioChange(e.target.value)}
                        className={classes.textField}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                    <FormControl className={classes.formControl} fullWidth>
                        <InputLabel id="companyUIN-label">Company</InputLabel>
                        <Select
                            labelId="companyUIN-label"
                            id="companyUIN"
                            name="companyUIN"
                            label="Company"
                            value={companyUIN}
                            onChange={(e) => onCompanyUINChange(e.target.value)}
                        >
                            <MenuItem value="">Select Company...</MenuItem>
                            <MenuItem value="UIN-1001">UIN-1001</MenuItem>
                            <MenuItem value="UIN-1002">UIN-1002</MenuItem>
                            <MenuItem value="UIN-1003">UIN-1003</MenuItem>
                            <MenuItem value="INS-RE-002">INS-RE-002</MenuItem>
                            <MenuItem value="INS-RE-003">INS-RE-003</MenuItem>
                            <MenuItem value="INS-1001">INS-1001</MenuItem>
                            {companyUIN && !['', 'UIN-1001', 'UIN-1002', 'UIN-1003', 'INS-RE-002', 'INS-RE-003', 'INS-1001'].includes(companyUIN) && (
                                <MenuItem value={companyUIN}>{companyUIN}</MenuItem>
                            )}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                    <Autocomplete
                        multiple
                        id="operatingUnitUIN"
                        options={allOperatingUnits}
                        value={operatingUnitUINs}
                        onChange={(event, newValue) => {
                            onOperatingUnitUINsChange(newValue);
                        }}
                        disabled={loadingOperatingUnits}
                        filterSelectedOptions
                        filterOptions={(options, { inputValue }) => {
                            // Custom filter function for better search experience
                            if (!inputValue) return options;

                            return options.filter(option =>
                                option.toLowerCase().includes(inputValue.toLowerCase()) ||
                                option.toLowerCase().startsWith(inputValue.toLowerCase())
                            );
                        }}
                        renderTags={(value, getTagProps) =>
                            value.map((option, index) => (
                                <Chip
                                    {...getTagProps({ index })}
                                    key={option}
                                    label={option}
                                    size="small"
                                    sx={{
                                        backgroundColor: '#e3f2fd',
                                        color: '#1565c0',
                                        fontSize: '12px',
                                        height: '24px',
                                        '& .MuiChip-deleteIcon': {
                                            fontSize: '16px',
                                            '&:hover': {
                                                color: '#d32f2f'
                                            }
                                        }
                                    }}
                                />
                            ))
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Operating Unit"
                                placeholder={operatingUnitUINs.length === 0 ? (loadingOperatingUnits ? 'Loading...' : 'Type to search operating units...') : 'Add more units...'}
                                className={classes.textField}
                                InputProps={{
                                    ...params.InputProps,
                                    sx: {
                                        '& .MuiAutocomplete-input': {
                                            fontSize: '14px',
                                            '&::placeholder': {
                                                color: '#9e9e9e',
                                                opacity: 1
                                            }
                                        }
                                    }
                                }}
                            />
                        )}
                        ListboxProps={{
                            style: {
                                maxHeight: 300,
                            }
                        }}
                        noOptionsText={loadingOperatingUnits ? "Loading..." : "No operating units found"}
                        loadingText="Loading operating units..."
                        sx={{
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
                                borderColor: '#D80E51 !important',
                                borderWidth: '2px'
                            },
                            '& .MuiAutocomplete-popupIndicator': {
                                color: '#626BDA'
                            },
                            '& .MuiAutocomplete-clearIndicator': {
                                color: '#626BDA'
                            }
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                    <DatePicker
                        label="Start Date"
                        value={treatyStartDate}
                        onChange={onTreatyStartDateChange}
                        renderInput={(params: any) => (
                            <TextField {...params} id="treatyStartDate" fullWidth className={classes.textField} />
                        )}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={2.4}>
                    <DatePicker
                        label="End Date"
                        value={treatyEndDate}
                        onChange={onTreatyEndDateChange}
                        renderInput={(params: any) => (
                            <TextField {...params} id="treatyEndDate" fullWidth className={classes.textField} />
                        )}
                    />
                </Grid>
            </Grid>
            <Grid container spacing={3} sx={{ mt: 0.5 }}>
                <Grid item xs={12} sm={6} md={2.4}>
                    <FormControl className={classes.formControl} fullWidth>
                        <InputLabel id="currency-label">Currency</InputLabel>
                        <Select
                            labelId="currency-label"
                            id="currency"
                            name="currency"
                            label="Currency"
                            value={currency}
                            onChange={(e) => onCurrencyChange(e.target.value)}
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
            </Grid>
        </Card >
    );
};
