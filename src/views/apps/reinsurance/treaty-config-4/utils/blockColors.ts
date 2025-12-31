export const blockColors = [
    { bg: '#f8f9fa', header: '#e9ecef', accent: '#6c757d' }, // Neutral Gray - Professional theme
];

export const getBlockColor = (blockNumber: number) => {
    return blockColors[0]; // Use consistent color for all blocks
};
