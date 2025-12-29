import { Box, Typography, FormControl, Select, MenuItem } from '@mui/material';

interface TreatyConfigHeaderProps {
    selectMode: string;
    onSelectModeChange: (mode: string) => void;
}

export const TreatyConfigHeader = ({ selectMode, onSelectModeChange }: TreatyConfigHeaderProps) => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, pb: 2, borderBottom: '2px solid #e0e0e0' }}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
            Reinsurance Configuration
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ color: '#666', fontWeight: 500 }}>
                Select Mode:
            </Typography>
            <FormControl size="small" sx={{ minWidth: 200 }}>
                <Select
                    value={selectMode}
                    onChange={(e) => onSelectModeChange(e.target.value)}
                    sx={{ backgroundColor: 'white' }}
                >
                    <MenuItem value="Treaty (Proportional)">Treaty (Proportional)</MenuItem>
                    <MenuItem value="Treaty (Non Proportional)">Treaty (Non Proportional)</MenuItem>
                </Select>
            </FormControl>
        </Box>
    </Box>
);
