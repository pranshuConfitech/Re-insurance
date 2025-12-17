import React from 'react';
import { Box } from '@mui/material';

export interface SummaryCardItem {
    color: string;
    icon: React.ReactElement;
    label: string;
    value: number;
    onClick?: () => void;
    active?: boolean;
    disabled?: boolean;
}

interface SummaryCardsProps {
    items: SummaryCardItem[];
}

// Reusable Summary Box Component
const SummaryBox = ({ color, icon, label, value, onClick, active = false, disabled = false, flexBasis }: SummaryCardItem & { flexBasis: string }) => (
    <Box
        sx={{
            flex: `1 1 ${flexBasis}`,
            minWidth: '120px',
            paddingRight: '8px',
            height: '50px',
            cursor: onClick && !disabled ? 'pointer' : disabled ? 'not-allowed' : 'default',
            opacity: disabled ? 0.5 : 1
        }}
        onClick={disabled ? undefined : onClick}
    >
        <Box
            sx={{
                borderRadius: '8px',
                border: `1px solid ${color}`,
                width: '100%',
                height: '100%',
                color: active ? '#fff' : color,
                backgroundColor: active ? color : 'transparent',
                fontSize: { xs: '11px', sm: '12px', md: '13px' },
                display: 'flex',
                alignItems: 'center',
                whiteSpace: 'nowrap',
                transition: 'background-color 120ms ease, color 120ms ease'
            }}
        >
            {React.cloneElement(icon, {
                style: {
                    fill: active ? '#fff' : color,
                    width: '20px',
                    height: '20px',
                    marginInline: '8px',
                    flexShrink: 0,
                },
            })}
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {label} <span style={{ fontWeight: 700 }}>({value})</span>
            </span>
        </Box>
    </Box>
);

// Main Summary Cards Component
const SummaryCards = ({ items }: SummaryCardsProps) => {
    // Calculate flex basis based on number of items
    const flexBasis = `${100 / items.length}%`;
    
    return (
        <Box
            display={'flex'}
            flexWrap={'nowrap'}
            marginBottom={'22px'}
            sx={{
                overflowX: 'auto',
                '&::-webkit-scrollbar': { height: '4px' },
                '&::-webkit-scrollbar-track': { backgroundColor: '#f1f1f1', borderRadius: '2px' },
                '&::-webkit-scrollbar-thumb': { backgroundColor: '#c1c1c1', borderRadius: '2px' },
                '&::-webkit-scrollbar-thumb:hover': { backgroundColor: '#a8a8a8' },
            }}
        >
            {items.map((item, index) => (
                <SummaryBox key={index} {...item} flexBasis={flexBasis} />
            ))}
        </Box>
    );
};

export default SummaryCards;
