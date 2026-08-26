'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import { Box, CircularProgress } from '@mui/material';

const TreatyConfig4CreateComponent = dynamic(
    () => import('@/views/apps/reinsurance/treaty-config-4/treaty-config-4-create.component'),
    { ssr: false, loading: () => <LoadingFallback /> }
);

const LoadingFallback = () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
    </Box>
);

export default function TreatyConfig4CreatePage() {
    return <TreatyConfig4CreateComponent />;
}
