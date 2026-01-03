export const blockColors = [
    { bg: '#ffffff', border: '#e3f2fd', accent: '#1976d2', light: '#bbdefb' }, // Blue
    { bg: '#ffffff', border: '#e8f5e9', accent: '#388e3c', light: '#a5d6a7' }, // Green
    { bg: '#ffffff', border: '#fff3e0', accent: '#f57c00', light: '#ffb74d' }, // Orange
    { bg: '#ffffff', border: '#f3e5f5', accent: '#7b1fa2', light: '#ba68c8' }, // Purple
    { bg: '#ffffff', border: '#e0f2f1', accent: '#00796b', light: '#4db6ac' }, // Teal
    { bg: '#ffffff', border: '#fce4ec', accent: '#c2185b', light: '#f06292' }, // Pink
    { bg: '#ffffff', border: '#e8eaf6', accent: '#3f51b5', light: '#7986cb' }, // Indigo
    { bg: '#ffffff', border: '#fff8e1', accent: '#f9a825', light: '#fdd835' }, // Amber
    { bg: '#ffffff', border: '#fbe9e7', accent: '#d84315', light: '#ff8a65' }, // Deep Orange
];

export const getBlockColor = (blockNumber: number) => {
    return blockColors[(blockNumber - 1) % blockColors.length];
};
