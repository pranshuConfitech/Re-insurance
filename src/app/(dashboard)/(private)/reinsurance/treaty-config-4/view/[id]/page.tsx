'use client';
import React, { use } from 'react';
import dynamic from 'next/dynamic';
import { Box, CircularProgress } from '@mui/material';

const TreatyConfig4ViewComponent = dynamic(
    () => import('@/views/apps/reinsurance/treaty-config-4/treaty-config-4-view.component'),
    { ssr: false, loading: () => <LoadingFallback /> }
);

const LoadingFallback = () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
    </Box>
);

type Props = {
    params: Promise<{ id: string }>;
};

export default function TreatyConfig4ViewPage({ params }: Props) {
    const { id } = use(params);

    return <TreatyConfig4ViewComponent viewId={id} />;
}
