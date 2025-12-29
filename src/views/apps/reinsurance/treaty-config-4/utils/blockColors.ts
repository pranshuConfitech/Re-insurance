export const blockColors = [
    { bg: '#e3f2fd', header: '#bbdefb', accent: '#2196f3' }, // Blue
    { bg: '#f3e5f5', header: '#e1bee7', accent: '#9c27b0' }, // Purple
    { bg: '#e8f5e9', header: '#c8e6c9', accent: '#4caf50' }, // Green
    { bg: '#fff3e0', header: '#ffe0b2', accent: '#ff9800' }, // Orange
    { bg: '#fce4ec', header: '#f8bbd0', accent: '#e91e63' }, // Pink
    { bg: '#e0f2f1', header: '#b2dfdb', accent: '#009688' }, // Teal
    { bg: '#f1f8e9', header: '#dcedc8', accent: '#8bc34a' }, // Light Green
    { bg: '#fff9c4', header: '#fff59d', accent: '#fdd835' }, // Yellow
    { bg: '#ede7f6', header: '#d1c4e9', accent: '#673ab7' }, // Deep Purple
];

export const getBlockColor = (blockNumber: number) => {
    return blockColors[(blockNumber - 1) % blockColors.length];
};
