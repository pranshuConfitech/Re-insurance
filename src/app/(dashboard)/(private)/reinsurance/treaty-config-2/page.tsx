'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import { Box, CircularProgress } from '@mui/material';

const TreatyConfig2Component = dynamic(
    () => import('@/views/apps/reinsurance/treaty-config-2/treaty-config-2.component'),
    { ssr: false, loading: () => <LoadingFallback /> }
);

const LoadingFallback = () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
    </Box>
);

export default function TreatyConfig2Page() {
    return <TreatyConfig2Component />;
}

