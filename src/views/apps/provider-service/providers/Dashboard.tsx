'use client'
import React, { useState, useEffect } from 'react';
import {
    Paper,
    Box,
    Button,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import ProviderStats from './ProviderStats';
import ProviderTabComponent from './provider.list.main.component';
import { ProvidersService } from '@/services/remote-api/api/provider-services';

const useStyles = makeStyles((theme: any) => ({
    root: {
        width: '100%',
        padding: 0,
    },
    tabPanel: {
        marginTop: '0',
        padding: '5px',
    },
    buttonGroup: {
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
        marginBottom: '0',
    },
    modernButton: {
        minWidth: '140px',
        height: '40px',
        borderRadius: '20px',
        fontSize: '15px',
        fontWeight: 600,
        textTransform: 'none',
        border: 'none',
        letterSpacing: '0.3px',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
            transition: 'left 0.5s',
        },
        '&:hover::before': {
            left: '100%',
        },
        '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 16px rgba(0, 0, 0, 0.12)',
        },
        '&:active': {
            transform: 'translateY(0)',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
        },
    },
    buttonActive: {
        background: '#d80f51',
        color: '#ffffff',
        boxShadow: '0 4px 14px rgba(216, 15, 81, 0.35)',
        '&:hover': {
            background: '#b80d45',
            boxShadow: '0 6px 20px rgba(216, 15, 81, 0.45)',
            transform: 'translateY(-2px)',
        },
    },
    buttonInactive: {
        background: '#f8f9fa',
        color: '#6c757d',
        border: '1px solid #e9ecef',
        '&:hover': {
            background: '#e9ecef',
            color: '#495057',
            borderColor: '#dee2e6',
        },
    },
    tabContent: {
        minHeight: 'calc(100vh - 250px)',
    },
    headerContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 24px',
        borderBottom: '1px solid #e9ecef',
        background: '#ffffff',
    },
    titleSection: {
        fontSize: '28px',
        fontWeight: '700',
        color: '#212529',
        marginBottom: '24px',
        letterSpacing: '-0.5px',
        padding: '0',
    },
    totalBadge: {
        backgroundColor: '#d80f51',
        color: 'white',
        padding: '8px 16px',
        borderRadius: '20px',
        fontSize: '14px',
        fontWeight: '700',
        border: 'none',
        boxShadow: '0 2px 8px rgba(216, 15, 81, 0.25)',
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
            backgroundColor: '#b80d45',
            boxShadow: '0 4px 12px rgba(216, 15, 81, 0.35)',
            transform: 'translateY(-1px)',
        },
    },
    paperContainer: {
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        overflow: 'hidden',
        background: '#ffffff',
    },
}));

const TabPanel = (props: any) => {
    const { children, value, index, ...other } = props;
    const classes = useStyles();

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`provider-tabpanel-${index}`}
            aria-labelledby={`provider-tab-${index}`}
            className={classes.tabContent}
            {...other}
        >
            {value === index && <Box className={classes.tabPanel}>{children}</Box>}
        </div>
    );
};

const ModernButtonGroup = ({ value, onChange, classes }: any) => {
    return (
        <div className={classes.buttonGroup}>
            <Button
                className={`${classes.modernButton} ${value === 0 ? classes.buttonActive : classes.buttonInactive}`}
                onClick={() => onChange(null, 0)}
                disableRipple
            >
                Overview
            </Button>
            <Button
                className={`${classes.modernButton} ${value === 1 ? classes.buttonActive : classes.buttonInactive}`}
                onClick={() => onChange(null, 1)}
                disableRipple
            >
                Features
            </Button>
        </div>
    );
};

const Dashboard = () => {
    const classes = useStyles();
    const [tabValue, setTabValue] = useState(1);
    const [totalProviderCount, setTotalProviderCount] = useState(0);
    const [selectedTypeCode, setSelectedTypeCode] = useState<string | undefined>(undefined);
    const [reloadTrigger, setReloadTrigger] = useState(0);
    const [pendingTabActive, setPendingTabActive] = useState(false);
    const providersService = new ProvidersService();

    const handleTabChange = (event: any, newValue: any) => {
        setTabValue(newValue);
    };

    useEffect(() => {
        // Fetch total provider count
        providersService.getProviderTypeCount().subscribe((result: any) => {
            if (Array.isArray(result)) {
                const total = result.reduce((sum, type) => sum + (type.totalCount || 0), 0);
                setTotalProviderCount(total);
            }
        });
    }, []);

    const handleTotalClick = () => {
        if (pendingTabActive) return; // Disable when pending approval tab is active
        setSelectedTypeCode(undefined);
        // Force reload by incrementing trigger
        setReloadTrigger(prev => prev + 1);
    };

    const handleSubTabChange = (activeIndex: number) => {
        setPendingTabActive(activeIndex === 1); // activeIndex 1 = Pending Approval tab
    };

    return (
        <div className={classes.root}>
            {/* Provider Management Title */}
            <div className={classes.titleSection}>
                Provider Management
            </div>
            <Paper className={classes.paperContainer} elevation={0}>
                <div className={classes.headerContainer}>
                    <ModernButtonGroup
                        value={tabValue}
                        onChange={handleTabChange}
                        classes={classes}
                    />
                </div>


                <TabPanel value={tabValue} index={0}>
                    <ProviderStats />
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                    <ProviderTabComponent
                        initialTypeCode={selectedTypeCode}
                        onTypeChange={setSelectedTypeCode}
                        reloadTrigger={reloadTrigger}
                        onTabChange={handleSubTabChange}
                        totalProviderCount={totalProviderCount}
                        pendingTabActive={pendingTabActive}
                        onTotalClick={handleTotalClick}
                    />
                </TabPanel>
            </Paper>
        </div>
    );
};

export default Dashboard; 
