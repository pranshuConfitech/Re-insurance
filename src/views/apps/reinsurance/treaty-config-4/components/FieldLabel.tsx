import { Typography } from '@mui/material';

interface FieldLabelProps {
    children: React.ReactNode;
}

export const FieldLabel = ({ children }: FieldLabelProps) => (
    <Typography
        variant="caption"
        sx={{
            color: '#666',
            fontWeight: 500,
            mb: 0.5,
            display: 'block',
            fontSize: '10px',
            textTransform: 'uppercase',
            minHeight: '28px',
            lineHeight: '14px',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
        }}
    >
        {children}
    </Typography>
);
