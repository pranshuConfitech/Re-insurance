'use client';
import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Box, Button, FormControl, InputLabel, Select, MenuItem, CircularProgress } from '@mui/material';
import dynamic from 'next/dynamic';

// Use dynamic imports with ssr: false to prevent caching issues
const TreatyConfigurationListComponent = dynamic(
    () => import('@/views/apps/reinsurance/treaty-configuration/treaty-configuration.list.component'),
    { ssr: false, loading: () => <LoadingFallback /> }
);
const TreatyConfigurationFormComponent = dynamic(
    () => import('@/views/apps/reinsurance/treaty-configuration/treaty-configuration.form.component'),
    { ssr: false, loading: () => <LoadingFallback /> }
);
const SurplusParticipantListComponent = dynamic(
    () => import('@/views/apps/reinsurance/surplus-participant/surplus-participant.list.component'),
    { ssr: false, loading: () => <LoadingFallback /> }
);
const SurplusParticipantFormComponent = dynamic(
    () => import('@/views/apps/reinsurance/surplus-participant/surplus-participant.form.component'),
    { ssr: false, loading: () => <LoadingFallback /> }
);
const XolTreatyMasterListComponent = dynamic(
    () => import('@/views/apps/reinsurance/xol-treaty-master/xol-treaty-master.list.component'),
    { ssr: false, loading: () => <LoadingFallback /> }
);
const XolTreatyMasterFormComponent = dynamic(
    () => import('@/views/apps/reinsurance/xol-treaty-master/xol-treaty-master.form.component'),
    { ssr: false, loading: () => <LoadingFallback /> }
);

// Loading component
const LoadingFallback = () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
    </Box>
);

export default function TreatyConfigurationPage() {
    const router = useRouter();
    const query = useSearchParams();

    // Get tab from URL or default to 'treaty'
    const tabParam = query.get('tab') as 'treaty' | 'surplus' | 'xol' | null;
    const [activeTab, setActiveTab] = React.useState<'treaty' | 'surplus' | 'xol'>(tabParam || 'treaty');
    const [isTransitioning, setIsTransitioning] = React.useState(false);

    // Filter states
    const [period, setPeriod] = React.useState('2025-2026');
    const [productCode, setProductCode] = React.useState('FIRE01');
    const [riskGrade, setRiskGrade] = React.useState('1');
    const [accountingLOB, setAccountingLOB] = React.useState('Fire');
    const [riskCategory, setRiskCategory] = React.useState('Fire');
    const [type, setType] = React.useState('Per Risk');

    React.useEffect(() => {
        if (!query.get('mode')) {
            router.replace('/reinsurance/treaty-configuration?mode=viewList&tab=treaty');
        }
        // Update activeTab when URL changes
        if (tabParam && tabParam !== activeTab) {
            setActiveTab(tabParam);
        }
    }, [query, router, tabParam, activeTab]);

    const mode = query.get('mode');

    const handleTabChange = (tab: 'treaty' | 'surplus' | 'xol') => {
        if (tab === activeTab) return; // Don't do anything if clicking the same tab

        // Start transition - unmount current component
        setIsTransitioning(true);

        // Wait for unmount to complete, then mount new component
        setTimeout(() => {
            setActiveTab(tab);
            router.push(`/reinsurance/treaty-configuration?mode=viewList&tab=${tab}`);
            // Add another small delay before showing new component
            setTimeout(() => {
                setIsTransitioning(false);
            }, 100);
        }, 100); // Increased delay to ensure complete cleanup
    };

    // Handle form modes
    if (mode === 'create' || mode === 'edit') {
        return (
            <>
                {activeTab === 'surplus' && <SurplusParticipantFormComponent />}
                {activeTab === 'xol' && <XolTreatyMasterFormComponent />}
                {activeTab === 'treaty' && <TreatyConfigurationFormComponent />}
            </>
        );
    }

    // List view with toggle buttons
    return (
        <Box>
            {/* Common Header */}
            <Box sx={{
                fontSize: '28px',
                fontWeight: '700',
                color: '#212529',
                letterSpacing: '-0.5px',
                mb: 3
            }}>
                Treaty Definition
            </Box>

            {/* Toggle Buttons */}
            <Box sx={{ mb: 4, display: 'inline-flex', gap: 1, p: 0.5, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
                <Button
                    onClick={() => handleTabChange('treaty')}
                    sx={{
                        backgroundColor: activeTab === 'treaty' ? '#28a745' : 'transparent',
                        color: activeTab === 'treaty' ? 'white' : '#666',
                        fontWeight: 600,
                        px: 3,
                        py: 1,
                        borderRadius: 1.5,
                        textTransform: 'none',
                        fontSize: '0.95rem',
                        minWidth: '120px',
                        boxShadow: activeTab === 'treaty' ? '0 2px 4px rgba(40, 167, 69, 0.3)' : 'none',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                            backgroundColor: activeTab === 'treaty' ? '#218838' : '#e8e8e8'
                        }
                    }}
                >
                    Treaty
                </Button>
                <Button
                    onClick={() => handleTabChange('surplus')}
                    sx={{
                        backgroundColor: activeTab === 'surplus' ? '#28a745' : 'transparent',
                        color: activeTab === 'surplus' ? 'white' : '#666',
                        fontWeight: 600,
                        px: 3,
                        py: 1,
                        borderRadius: 1.5,
                        textTransform: 'none',
                        fontSize: '0.95rem',
                        minWidth: '120px',
                        boxShadow: activeTab === 'surplus' ? '0 2px 4px rgba(40, 167, 69, 0.3)' : 'none',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                            backgroundColor: activeTab === 'surplus' ? '#218838' : '#e8e8e8'
                        }
                    }}
                >
                    Surplus
                </Button>
                <Button
                    onClick={() => handleTabChange('xol')}
                    sx={{
                        backgroundColor: activeTab === 'xol' ? '#28a745' : 'transparent',
                        color: activeTab === 'xol' ? 'white' : '#666',
                        fontWeight: 600,
                        px: 3,
                        py: 1,
                        borderRadius: 1.5,
                        textTransform: 'none',
                        fontSize: '0.95rem',
                        minWidth: '150px',
                        boxShadow: activeTab === 'xol' ? '0 2px 4px rgba(40, 167, 69, 0.3)' : 'none',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                            backgroundColor: activeTab === 'xol' ? '#218838' : '#e8e8e8'
                        }
                    }}
                >
                    XOL
                </Button>
            </Box>

            {/* Filter Dropdowns */}
            <Box sx={{ mb: 4, mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <FormControl size="small" sx={{ minWidth: 180 }}>
                    <InputLabel>Period</InputLabel>
                    <Select
                        value={period}
                        label="Period"
                        onChange={(e) => setPeriod(e.target.value)}
                    >
                        <MenuItem value="2025-2026">2025-2026</MenuItem>
                        <MenuItem value="2024-2025">2024-2025</MenuItem>
                        <MenuItem value="2023-2024">2023-2024</MenuItem>
                    </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 180 }}>
                    <InputLabel>Product code</InputLabel>
                    <Select
                        value={productCode}
                        label="Product code"
                        onChange={(e) => setProductCode(e.target.value)}
                    >
                        <MenuItem value="FIRE01">FIRE01</MenuItem>
                    </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 180 }}>
                    <InputLabel>Risk Grade</InputLabel>
                    <Select
                        value={riskGrade}
                        label="Risk Grade"
                        onChange={(e) => setRiskGrade(e.target.value)}
                    >
                        <MenuItem value="1">1</MenuItem>
                    </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 180 }}>
                    <InputLabel>Accounting LOB</InputLabel>
                    <Select
                        value={accountingLOB}
                        label="Accounting LOB"
                        onChange={(e) => setAccountingLOB(e.target.value)}
                    >
                        <MenuItem value="Fire">Fire</MenuItem>
                    </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 180 }}>
                    <InputLabel>Risk Category</InputLabel>
                    <Select
                        value={riskCategory}
                        label="Risk Category"
                        onChange={(e) => setRiskCategory(e.target.value)}
                    >
                        <MenuItem value="Fire">Fire</MenuItem>
                    </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 180 }}>
                    <InputLabel>Type</InputLabel>
                    <Select
                        value={type}
                        label="Type"
                        onChange={(e) => setType(e.target.value)}
                    >
                        <MenuItem value="Per Risk">Per Risk</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {/* Content based on active tab - Only render active component */}
            {isTransitioning ? (
                <LoadingFallback />
            ) : (
                <>
                    {activeTab === 'treaty' && <TreatyConfigurationListComponent key="treaty" />}
                    {activeTab === 'surplus' && <SurplusParticipantListComponent key="surplus" />}
                    {activeTab === 'xol' && <XolTreatyMasterListComponent key="xol" />}
                </>
            )}
        </Box>
    );
}
