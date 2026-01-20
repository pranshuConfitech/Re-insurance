import { Box, Typography, Button } from '@mui/material';

interface TreatyConfigHeaderProps {
    selectMode: string;
    onSelectModeChange: (mode: string) => void;
}

export const TreatyConfigHeader = ({ selectMode, onSelectModeChange }: TreatyConfigHeaderProps) => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, pb: 2, borderBottom: '2px solid #e0e0e0' }}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
            Reinsurance Definition
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
                        '&:hover': {
                            backgroundColor: '#b80c43 !important'
                        },
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    } : {
                        borderColor: '#D80E51 !important',
                        color: '#D80E51 !important',
                        backgroundColor: 'transparent !important',
                        '&:hover': {
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
                        '&:hover': {
                            backgroundColor: '#b80c43 !important'
                        },
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    } : {
                        borderColor: '#D80E51 !important',
                        color: '#D80E51 !important',
                        backgroundColor: 'transparent !important',
                        '&:hover': {
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
);
