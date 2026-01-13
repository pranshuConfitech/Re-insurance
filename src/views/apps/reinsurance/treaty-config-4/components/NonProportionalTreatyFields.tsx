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

export const NonProportionalTreatyFields = ({ treaty, blockId, onTreatyChange }: NonProportionalTreatyFieldsProps) => {
    const handleChange = (field: string, value: string) => {
        onTreatyChange(blockId, field, value);
    };

    return (
        <Grid container spacing={3}>
            {/* Row 1 - 4 fields */}
            <Grid item xs={12} sm={6} md={3}>
                <FieldLabel>Treaty Code</FieldLabel>
                <TextField
                    fullWidth
                    size="small"
                    value={treaty.treatyCode}
                    onChange={(e) => handleChange('treatyCode', e.target.value)}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: '#fafafa',
                            '& .MuiOutlinedInput-notchedOutline': {
                                border: '1px solid #e9ecef'
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                border: '1px solid #626BDA'
                            }
                        }
                    }}
                />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <FieldLabel>Priority</FieldLabel>
                <FormControl fullWidth size="small">
                    <Select
                        value={treaty.priority}
                        onChange={(e) => handleChange('priority', e.target.value)}
                        displayEmpty
                        sx={{
                            backgroundColor: '#fafafa',
                            '& .MuiOutlinedInput-notchedOutline': {
                                border: '1px solid #e9ecef'
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                border: '1px solid #626BDA'
                            }
                        }}
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
                <FieldLabel>Treaty Type</FieldLabel>
                <FormControl fullWidth size="small">
                    <Select
                        value={treaty.treatyType}
                        onChange={(e) => handleChange('treatyType', e.target.value)}
                        sx={{
                            backgroundColor: '#fafafa',
                            '& .MuiOutlinedInput-notchedOutline': {
                                border: '1px solid #e9ecef'
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                border: '1px solid #626BDA'
                            }
                        }}
                    >
                        <MenuItem value="XOL">XOL</MenuItem>
                        <MenuItem value="Stop Loss">Stop Loss</MenuItem>
                        <MenuItem value="Cat XOL">Cat XOL</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <FieldLabel>Treaty Name</FieldLabel>
                <TextField
                    fullWidth
                    size="small"
                    value={treaty.treatyName}
                    onChange={(e) => handleChange('treatyName', e.target.value)}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: '#fafafa',
                            '& .MuiOutlinedInput-notchedOutline': {
                                border: '1px solid #e9ecef'
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                border: '1px solid #626BDA'
                            }
                        }
                    }}
                />
            </Grid>

            {/* Row 2 - 4 fields */}
            <Grid item xs={12} sm={6} md={3}>
                <FieldLabel>Business Treaty Reference Number</FieldLabel>
                <TextField
                    fullWidth
                    size="small"
                    value={treaty.businessTreatyReferenceNumber}
                    onChange={(e) => handleChange('businessTreatyReferenceNumber', e.target.value)}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: '#fafafa',
                            '& .MuiOutlinedInput-notchedOutline': {
                                border: '1px solid #e9ecef'
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                border: '1px solid #626BDA'
                            }
                        }
                    }}
                />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <FieldLabel>XOL Type</FieldLabel>
                <FormControl fullWidth size="small">
                    <Select
                        value={treaty.xolType}
                        onChange={(e) => handleChange('xolType', e.target.value)}
                        displayEmpty
                        sx={{
                            backgroundColor: '#fafafa',
                            '& .MuiOutlinedInput-notchedOutline': {
                                border: '1px solid #e9ecef'
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                border: '1px solid #626BDA'
                            }
                        }}
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
                <FieldLabel>Former Treaty Code</FieldLabel>
                <TextField
                    fullWidth
                    size="small"
                    value={treaty.formerTreatyCode}
                    onChange={(e) => handleChange('formerTreatyCode', e.target.value)}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: '#fafafa',
                            '& .MuiOutlinedInput-notchedOutline': {
                                border: '1px solid #e9ecef'
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                border: '1px solid #626BDA'
                            }
                        }
                    }}
                />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <FieldLabel>Treaty Category</FieldLabel>
                <FormControl fullWidth size="small">
                    <Select
                        value={treaty.treatyCategory}
                        onChange={(e) => handleChange('treatyCategory', e.target.value)}
                        displayEmpty
                        sx={{
                            backgroundColor: '#fafafa',
                            '& .MuiOutlinedInput-notchedOutline': {
                                border: '1px solid #e9ecef'
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                border: '1px solid #626BDA'
                            }
                        }}
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
                <FieldLabel>Treaty Status</FieldLabel>
                <FormControl fullWidth size="small">
                    <Select
                        value={treaty.treatyStatus}
                        onChange={(e) => handleChange('treatyStatus', e.target.value)}
                        displayEmpty
                        sx={{
                            backgroundColor: '#fafafa',
                            '& .MuiOutlinedInput-notchedOutline': {
                                border: '1px solid #e9ecef'
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                border: '1px solid #626BDA'
                            }
                        }}
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
                <FieldLabel>Treaty Currency</FieldLabel>
                <FormControl fullWidth size="small">
                    <Select
                        value={treaty.treatyCurrency}
                        onChange={(e) => handleChange('treatyCurrency', e.target.value)}
                        displayEmpty
                        sx={{
                            backgroundColor: '#fafafa',
                            '& .MuiOutlinedInput-notchedOutline': {
                                border: '1px solid #e9ecef'
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                border: '1px solid #626BDA'
                            }
                        }}
                    >
                        <MenuItem value="">Select...</MenuItem>
                        <MenuItem value="USD">USD</MenuItem>
                        <MenuItem value="EUR">EUR</MenuItem>
                        <MenuItem value="GBP">GBP</MenuItem>
                        <MenuItem value="JPY">JPY</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <FieldLabel>Processing</FieldLabel>
                <FormControl fullWidth size="small">
                    <Select
                        value={treaty.processing}
                        onChange={(e) => handleChange('processing', e.target.value)}
                        displayEmpty
                        sx={{
                            backgroundColor: '#fafafa',
                            '& .MuiOutlinedInput-notchedOutline': {
                                border: '1px solid #e9ecef'
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                border: '1px solid #626BDA'
                            }
                        }}
                    >
                        <MenuItem value="">Select...</MenuItem>
                        <MenuItem value="Clean Cut">Clean Cut</MenuItem>
                        <MenuItem value="Run Off">Run Off</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <FieldLabel>Annual Aggregate Limit</FieldLabel>
                <TextField
                    fullWidth
                    size="small"
                    type="number"
                    value={treaty.annualAggregateLimit}
                    onChange={(e) => handleChange('annualAggregateLimit', e.target.value)}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: '#fafafa',
                            '& .MuiOutlinedInput-notchedOutline': {
                                border: '1px solid #e9ecef'
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                border: '1px solid #626BDA'
                            }
                        }
                    }}
                />
            </Grid>

            {/* Row 4 - 4 fields */}
            <Grid item xs={12} sm={6} md={3}>
                <FieldLabel>Annual Agg Deductible</FieldLabel>
                <TextField
                    fullWidth
                    size="small"
                    type="number"
                    value={treaty.annualAggDeductible}
                    onChange={(e) => handleChange('annualAggDeductible', e.target.value)}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: '#fafafa',
                            '& .MuiOutlinedInput-notchedOutline': {
                                border: '1px solid #e9ecef'
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                border: '1px solid #626BDA'
                            }
                        }
                    }}
                />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <FieldLabel>Total Reinstated SI</FieldLabel>
                <TextField
                    fullWidth
                    size="small"
                    type="number"
                    value={treaty.totalReinstatedSI}
                    onChange={(e) => handleChange('totalReinstatedSI', e.target.value)}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: '#fafafa',
                            '& .MuiOutlinedInput-notchedOutline': {
                                border: '1px solid #e9ecef'
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                border: '1px solid #626BDA'
                            }
                        }
                    }}
                />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <FieldLabel>Capacity</FieldLabel>
                <TextField
                    fullWidth
                    size="small"
                    type="number"
                    value={treaty.capacity}
                    onChange={(e) => handleChange('capacity', e.target.value)}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: '#fafafa',
                            '& .MuiOutlinedInput-notchedOutline': {
                                border: '1px solid #e9ecef'
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                border: '1px solid #626BDA'
                            }
                        }
                    }}
                />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <FieldLabel>Flat Rate XOL Prem</FieldLabel>
                <TextField
                    fullWidth
                    size="small"
                    type="number"
                    value={treaty.flatRateXOLPrem}
                    onChange={(e) => handleChange('flatRateXOLPrem', e.target.value)}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: '#fafafa',
                            '& .MuiOutlinedInput-notchedOutline': {
                                border: '1px solid #e9ecef'
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                border: '1px solid #626BDA'
                            }
                        }
                    }}
                />
            </Grid>

            {/* Row 5 - 4 fields */}
            <Grid item xs={12} sm={6} md={3}>
                <FieldLabel>Min Deposit XOL Prem</FieldLabel>
                <TextField
                    fullWidth
                    size="small"
                    type="number"
                    value={treaty.minDepositXOLPrem}
                    onChange={(e) => handleChange('minDepositXOLPrem', e.target.value)}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: '#fafafa',
                            '& .MuiOutlinedInput-notchedOutline': {
                                border: '1px solid #e9ecef'
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                border: '1px solid #626BDA'
                            }
                        }
                    }}
                />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <FieldLabel>No. Reinstatements</FieldLabel>
                <TextField
                    fullWidth
                    size="small"
                    type="number"
                    value={treaty.noReinstatements}
                    onChange={(e) => handleChange('noReinstatements', e.target.value)}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: '#fafafa',
                            '& .MuiOutlinedInput-notchedOutline': {
                                border: '1px solid #e9ecef'
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                border: '1px solid #626BDA'
                            }
                        }
                    }}
                />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <FieldLabel>Pro Rate to Amount</FieldLabel>
                <FormControl fullWidth size="small">
                    <Select
                        value={treaty.proRateToAmount}
                        onChange={(e) => handleChange('proRateToAmount', e.target.value)}
                        displayEmpty
                        sx={{
                            backgroundColor: '#fafafa',
                            '& .MuiOutlinedInput-notchedOutline': {
                                border: '1px solid #e9ecef'
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                border: '1px solid #626BDA'
                            }
                        }}
                    >
                        <MenuItem value="">Select...</MenuItem>
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <FieldLabel>Pro Rate to Time</FieldLabel>
                <FormControl fullWidth size="small">
                    <Select
                        value={treaty.proRateToTime}
                        onChange={(e) => handleChange('proRateToTime', e.target.value)}
                        displayEmpty
                        sx={{
                            backgroundColor: '#fafafa',
                            '& .MuiOutlinedInput-notchedOutline': {
                                border: '1px solid #e9ecef'
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                border: '1px solid #626BDA'
                            }
                        }}
                    >
                        <MenuItem value="">Select...</MenuItem>
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                    </Select>
                </FormControl>
            </Grid>

            {/* Row 6 - 4 fields */}
            <Grid item xs={12} sm={6} md={3}>
                <FieldLabel>Reserve Type Involved</FieldLabel>
                <TextField
                    fullWidth
                    size="small"
                    value={treaty.reserveTypeInvolved}
                    onChange={(e) => handleChange('reserveTypeInvolved', e.target.value)}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: '#fafafa',
                            '& .MuiOutlinedInput-notchedOutline': {
                                border: '1px solid #e9ecef'
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                border: '1px solid #626BDA'
                            }
                        }
                    }}
                />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <FieldLabel>Burning Cost Rate</FieldLabel>
                <TextField
                    fullWidth
                    size="small"
                    type="number"
                    value={treaty.burningCostRate}
                    onChange={(e) => handleChange('burningCostRate', e.target.value)}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: '#fafafa',
                            '& .MuiOutlinedInput-notchedOutline': {
                                border: '1px solid #e9ecef'
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                border: '1px solid #626BDA'
                            }
                        }
                    }}
                />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <FieldLabel>Prem Payment Warranty</FieldLabel>
                <FormControl fullWidth size="small">
                    <Select
                        value={treaty.premPaymentWarranty}
                        onChange={(e) => handleChange('premPaymentWarranty', e.target.value)}
                        displayEmpty
                        sx={{
                            backgroundColor: '#fafafa',
                            '& .MuiOutlinedInput-notchedOutline': {
                                border: '1px solid #e9ecef'
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                border: '1px solid #626BDA'
                            }
                        }}
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
                <FieldLabel>Alert Days</FieldLabel>
                <TextField
                    fullWidth
                    size="small"
                    type="number"
                    value={treaty.alertDays}
                    onChange={(e) => handleChange('alertDays', e.target.value)}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: '#fafafa',
                            '& .MuiOutlinedInput-notchedOutline': {
                                border: '1px solid #e9ecef'
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                border: '1px solid #626BDA'
                            }
                        }
                    }}
                />
            </Grid>

            {/* Row 7 - 3 fields */}
            <Grid item xs={12} sm={6} md={3}>
                <FieldLabel>Per Claim Recoverable Limit</FieldLabel>
                <TextField
                    fullWidth
                    size="small"
                    type="number"
                    value={treaty.perClaimRecoverableLimit}
                    onChange={(e) => handleChange('perClaimRecoverableLimit', e.target.value)}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: '#fafafa',
                            '& .MuiOutlinedInput-notchedOutline': {
                                border: '1px solid #e9ecef'
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                border: '1px solid #626BDA'
                            }
                        }
                    }}
                />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <FieldLabel>Processing Portfolio Method</FieldLabel>
                <FormControl fullWidth size="small">
                    <Select
                        value={treaty.processingPortfolioMethod}
                        onChange={(e) => handleChange('processingPortfolioMethod', e.target.value)}
                        displayEmpty
                        sx={{
                            backgroundColor: '#fafafa',
                            '& .MuiOutlinedInput-notchedOutline': {
                                border: '1px solid #e9ecef'
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                border: '1px solid #626BDA'
                            }
                        }}
                    >
                        <MenuItem value="">Select...</MenuItem>
                        <MenuItem value="Clean Cut">Clean Cut</MenuItem>
                        <MenuItem value="Run Off">Run Off</MenuItem>
                        <MenuItem value="AUTO">Clean Cut</MenuItem>
                        <MenuItem value="SYSTEM">Clean Cut</MenuItem>
                        <MenuItem value="STANDARD">Clean Cut</MenuItem>
                        {treaty.processingPortfolioMethod && !['', 'Clean Cut', 'Run Off', 'AUTO', 'SYSTEM', 'STANDARD'].includes(treaty.processingPortfolioMethod) && (
                            <MenuItem value={treaty.processingPortfolioMethod}>{treaty.processingPortfolioMethod}</MenuItem>
                        )}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
                <FieldLabel>Basis of Attachment/Drop Down Values are Risk Attaching Basis/Loss</FieldLabel>
                <FormControl fullWidth size="small">
                    <Select
                        value={treaty.basisOfAttachment}
                        onChange={(e) => handleChange('basisOfAttachment', e.target.value)}
                        displayEmpty
                        sx={{
                            backgroundColor: '#fafafa',
                            '& .MuiOutlinedInput-notchedOutline': {
                                border: '1px solid #e9ecef'
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                border: '1px solid #626BDA'
                            }
                        }}
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
