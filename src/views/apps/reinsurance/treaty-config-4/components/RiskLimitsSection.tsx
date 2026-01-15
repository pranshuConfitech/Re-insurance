import { Card, Grid, TextField, FormControl, Select, MenuItem, Box, Typography, Button, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { FieldLabel } from './FieldLabel';

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
}

interface RiskLimitsSectionProps {
    riskLimitLines: RiskLimitLine[];
    blockId: string;
    treatyId?: string;
    onAddLine: (blockId: string, treatyId?: string) => void;
    onDeleteLine: (blockId: string, treatyId: string | undefined, lineId: string) => void;
    onLineChange: (blockId: string, treatyId: string | undefined, lineId: string, field: string, value: string) => void;
}

export const RiskLimitsSection = ({
    riskLimitLines, blockId, treatyId,
    onAddLine, onDeleteLine, onLineChange
}: RiskLimitsSectionProps) => {
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
                    Risk & Limits Details
                </Typography>
                <Button
                    variant="contained"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => onAddLine(blockId, treatyId)}
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
                    Add Line
                </Button>
            </Box>

            <Box sx={{ p: 3 }}>
                {riskLimitLines.map((line, index) => (
                    <Box key={line.id} sx={{
                        p: 3,
                        mb: index < riskLimitLines.length - 1 ? 3 : 0,
                        backgroundColor: '#fff',
                        borderRadius: '12px',
                        position: 'relative',
                        border: 'none',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                    }}>
                        {riskLimitLines.length > 1 && (
                            <IconButton
                                size="small"
                                color="error"
                                onClick={() => onDeleteLine(blockId, treatyId, line.id)}
                                sx={{
                                    position: 'absolute',
                                    top: 12,
                                    right: 12,
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
                            Risk & Limit Line {index + 1}
                        </Typography>

                        <Grid container spacing={3}>
                            {/* Row 1 - 4 fields */}
                            <Grid item xs={12} sm={6} md={3}>
                                <FieldLabel>Product LOB</FieldLabel>
                                <FormControl fullWidth size="small">
                                    <Select
                                        value={line.productLOB}
                                        onChange={(e) => onLineChange(blockId, treatyId, line.id, 'productLOB', e.target.value)}
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
                                        <MenuItem value="Fire">Fire</MenuItem>
                                        <MenuItem value="Marine">Marine</MenuItem>
                                        <MenuItem value="Motor">Motor</MenuItem>
                                        <MenuItem value="PROPERTY">PROPERTY</MenuItem>
                                        <MenuItem value="FIRE">FIRE</MenuItem>
                                        <MenuItem value="CASUALTY">CASUALTY</MenuItem>
                                        {/* Show current value if not in list */}
                                        {line.productLOB && !['', 'Fire', 'Marine', 'Motor', 'PROPERTY', 'FIRE', 'CASUALTY'].includes(line.productLOB) && (
                                            <MenuItem value={line.productLOB}>{line.productLOB}</MenuItem>
                                        )}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <FieldLabel>Product Code</FieldLabel>
                                <TextField
                                    fullWidth
                                    size="small"
                                    value={line.productCode}
                                    onChange={(e) => onLineChange(blockId, treatyId, line.id, 'productCode', e.target.value)}
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
                                <FieldLabel>Accounting LOB</FieldLabel>
                                <FormControl fullWidth size="small">
                                    <Select
                                        value={line.accountingLOB}
                                        onChange={(e) => onLineChange(blockId, treatyId, line.id, 'accountingLOB', e.target.value)}
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
                                        <MenuItem value="Fire">Fire</MenuItem>
                                        <MenuItem value="Marine">Marine</MenuItem>
                                        <MenuItem value="PROP">PROP</MenuItem>
                                        <MenuItem value="FIRE">FIRE</MenuItem>
                                        {/* Show current value if not in list */}
                                        {line.accountingLOB && !['', 'Fire', 'Marine', 'PROP', 'FIRE'].includes(line.accountingLOB) && (
                                            <MenuItem value={line.accountingLOB}>{line.accountingLOB}</MenuItem>
                                        )}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <FieldLabel>Risk Category</FieldLabel>
                                <FormControl fullWidth size="small">
                                    <Select
                                        value={line.riskCategory}
                                        onChange={(e) => onLineChange(blockId, treatyId, line.id, 'riskCategory', e.target.value)}
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
                                        <MenuItem value="Comm">Comm</MenuItem>
                                        <MenuItem value="Residential">Residential</MenuItem>
                                        <MenuItem value="MEDIUM">MEDIUM</MenuItem>
                                        <MenuItem value="HIGH">HIGH</MenuItem>
                                        <MenuItem value="LOW">LOW</MenuItem>
                                        <MenuItem value="PROPERTY">PROPERTY</MenuItem>
                                        {/* Show current value if not in list */}
                                        {line.riskCategory && !['', 'Comm', 'Residential', 'MEDIUM', 'HIGH', 'LOW', 'PROPERTY'].includes(line.riskCategory) && (
                                            <MenuItem value={line.riskCategory}>{line.riskCategory}</MenuItem>
                                        )}
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* Row 2 - 4 fields */}
                            <Grid item xs={12} sm={6} md={3}>
                                <FieldLabel>Risk Grade</FieldLabel>
                                <TextField
                                    fullWidth
                                    size="small"
                                    value={line.riskGrade}
                                    onChange={(e) => onLineChange(blockId, treatyId, line.id, 'riskGrade', e.target.value)}
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
                                <FieldLabel>Cession Rate %</FieldLabel>
                                <TextField
                                    fullWidth
                                    size="small"
                                    value={line.cessionRate}
                                    onChange={(e) => onLineChange(blockId, treatyId, line.id, 'cessionRate', e.target.value)}
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
                                <FieldLabel>Quota Cession Max Capacity</FieldLabel>
                                <TextField
                                    fullWidth
                                    size="small"
                                    value={line.quotaCessionMaxCapacity}
                                    onChange={(e) => onLineChange(blockId, treatyId, line.id, 'quotaCessionMaxCapacity', e.target.value)}
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
                                <FieldLabel>Retention (Gross/Net)</FieldLabel>
                                <TextField
                                    fullWidth
                                    size="small"
                                    value={line.retentionGrossNet}
                                    onChange={(e) => onLineChange(blockId, treatyId, line.id, 'retentionGrossNet', e.target.value)}
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

                            {/* Row 3 - 4 fields */}
                            <Grid item xs={12} sm={6} md={3}>
                                <FieldLabel>Surplus Capacity</FieldLabel>
                                <TextField
                                    fullWidth
                                    size="small"
                                    value={line.surplusCapacity}
                                    onChange={(e) => onLineChange(blockId, treatyId, line.id, 'surplusCapacity', e.target.value)}
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
                                <FieldLabel>Capacity(Calculate In XL)</FieldLabel>
                                <TextField
                                    fullWidth
                                    size="small"
                                    value={line.capacityCalculateInXL}
                                    onChange={(e) => onLineChange(blockId, treatyId, line.id, 'capacityCalculateInXL', e.target.value)}
                                    placeholder="Enter capacity value"
                                    sx={{
                                        backgroundColor: '#fafafa',
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            border: '1px solid #e9ecef'
                                        },
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            border: '1px solid #626BDA'
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <FieldLabel>Per Risk Recovery Limit</FieldLabel>
                                <TextField
                                    fullWidth
                                    size="small"
                                    value={line.perRiskRecoveryLimit}
                                    onChange={(e) => onLineChange(blockId, treatyId, line.id, 'perRiskRecoveryLimit', e.target.value)}
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
                                <FieldLabel>Event Limit</FieldLabel>
                                <TextField
                                    fullWidth
                                    size="small"
                                    value={line.eventLimit}
                                    onChange={(e) => onLineChange(blockId, treatyId, line.id, 'eventLimit', e.target.value)}
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
                                <FieldLabel>Cash Call Limit</FieldLabel>
                                <TextField
                                    fullWidth
                                    size="small"
                                    value={line.cashCallLimit}
                                    onChange={(e) => onLineChange(blockId, treatyId, line.id, 'cashCallLimit', e.target.value)}
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
                                <FieldLabel>Loss Advice Limit</FieldLabel>
                                <TextField
                                    fullWidth
                                    size="small"
                                    value={line.lossAdviceLimit}
                                    onChange={(e) => onLineChange(blockId, treatyId, line.id, 'lossAdviceLimit', e.target.value)}
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
                                <FieldLabel>Premium Payment Warranty</FieldLabel>
                                <TextField
                                    fullWidth
                                    size="small"
                                    value={line.premiumPaymentWarranty}
                                    onChange={(e) => onLineChange(blockId, treatyId, line.id, 'premiumPaymentWarranty', e.target.value)}
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
                                <FieldLabel>Alert Days</FieldLabel>
                                <TextField
                                    fullWidth
                                    size="small"
                                    value={line.alertDays}
                                    onChange={(e) => onLineChange(blockId, treatyId, line.id, 'alertDays', e.target.value)}
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
                        </Grid>
                    </Box>
                ))}
            </Box>
        </Box >
    );
};
