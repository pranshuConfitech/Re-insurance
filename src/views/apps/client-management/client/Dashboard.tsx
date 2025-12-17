'use client'
import React, { useState } from 'react';
import {
    Paper,
    Typography,
    Grid,
    Tabs,
    Tab,
    Box,
} from '@mui/material';
import { makeStyles } from '@mui/styles'
import { ClientStats } from '.';
import { Clients } from '.';

const useStyles = makeStyles((theme: any) => ({
    root: {
        width: '100%',
        padding: theme?.spacing ? theme.spacing(3) : '24px',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme?.spacing ? theme.spacing(3) : '24px',
    },
    tabPanel: {
        marginTop: theme?.spacing ? theme.spacing(3) : '24px',
        padding: theme?.spacing ? theme.spacing(2) : '16px',
    },
    tabs: {
        borderBottom: `1px solid ${theme?.palette?.divider}`,
        marginBottom: theme?.spacing ? theme.spacing(2) : '24px',
    },
    tabContent: {
        minHeight: 'calc(100vh - 250px)',
    },
}));

const TabPanel = (props: any) => {
    const { children, value, index, ...other } = props;
    const classes = useStyles();

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`client-tabpanel-${index}`}
            aria-labelledby={`client-tab-${index}`}
            className={classes.tabContent}
            {...other}
        >
            {value === index && <Box className={classes.tabPanel}>{children}</Box>}
        </div>
    );
};

const Dashboard = () => {
    const classes = useStyles();
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event: any, newValue: any) => {
        setTabValue(newValue);
    };

    return (
        <div className={classes.root}>
            <Paper>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    className={classes.tabs}
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    <Tab label="Overview" />
                    <Tab label="Clients" />
                </Tabs>

                <TabPanel value={tabValue} index={0}>
                    <ClientStats />
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                    <Clients />
                </TabPanel>
            </Paper>
        </div>
    );
};

export default Dashboard; 
