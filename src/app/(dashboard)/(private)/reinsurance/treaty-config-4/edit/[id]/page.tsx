'use client';
import React, { use } from 'react';
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

interface EditPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function TreatyConfig4EditPage({ params }: EditPageProps) {
    const { id } = use(params);

    return <TreatyConfig4CreateComponent editId={id} />;
}
