'use client'
import React, { useState } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import { Box, Paper, Tab, Tabs, Typography } from '@mui/material'
import { Settings, ViewList } from '@mui/icons-material'
import { makeStyles } from '@mui/styles'

import TemplateCreateComponent from './template-create.component'
import TemplateListComponent from './template-list.component'
import TemplateFormComponent from './template-form.component'

const useStyles = makeStyles(() => ({
    paper: {
        padding: '2rem',
        borderRadius: '0px',
        border: '1px solid #e9ecef',
        backgroundColor: '#ffffff'
    },
    tabContainer: {
        backgroundColor: 'white',
        borderRadius: '8px 8px 0 0',
        border: '1px solid #e0e0e0',
        borderBottom: 'none'
    },
    tab: {
        minHeight: '50px',
        minWidth: '120px',
        textTransform: 'none',
        fontSize: '0.9rem',
        fontWeight: 500,
        color: '#666',
        borderRadius: '6px 6px 0 0',
        marginRight: '4px',
        padding: '8px 16px',
        '&.Mui-selected': {
            backgroundColor: '#e0e0e0',
            color: '#333',
            fontWeight: 600
        },
        '&:hover': {
            backgroundColor: '#f0f0f0',
            color: '#333'
        }
    }
}))

const TemplateConfigComponent = () => {
    const classes = useStyles()
    const router = useRouter()
    const searchParams = useSearchParams()
    const mode = searchParams.get('mode')
    const [activeTab, setActiveTab] = useState(0)

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue)
    }

    const handleCreateTemplate = () => {
        router.push('/masters/template-config?mode=create')
    }

    const handleBackToList = () => {
        router.push('/masters/template-config')
    }

    // If mode is create, show create form
    if (mode === 'create') {
        return (
            <Paper elevation={0} className={classes.paper}>
                <TemplateCreateComponent onBack={handleBackToList} />
            </Paper>
        )
    }

    return (
        <>
            {/* Tab Navigation */}
            <Box className={classes.tabContainer}>
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="inherit"
                    variant="standard"
                    sx={{
                        '& .MuiTabs-indicator': {
                            backgroundColor: '#d32f2f',
                            height: '3px'
                        },
                        '& .MuiTab-root': {
                            minHeight: '50px',
                            minWidth: '120px',
                            fontSize: '0.9rem',
                            fontWeight: 500,
                            textTransform: 'none',
                            padding: '8px 16px'
                        }
                    }}
                >
                    <Tab
                        label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <ViewList sx={{ fontSize: '1rem', color: activeTab === 0 ? '#333' : '#666' }} />
                                <Typography
                                    sx={{
                                        fontSize: '0.9rem',
                                        fontWeight: activeTab === 0 ? 600 : 500,
                                        color: activeTab === 0 ? '#333' : '#666'
                                    }}
                                >
                                    Template List
                                </Typography>
                            </Box>
                        }
                        className={classes.tab}
                    />
                    {/* <Tab
                        label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Settings sx={{ fontSize: '1rem', color: activeTab === 1 ? '#333' : '#666' }} />
                                <Typography
                                    sx={{
                                        fontSize: '0.9rem',
                                        fontWeight: activeTab === 1 ? 600 : 500,
                                        color: activeTab === 1 ? '#333' : '#666'
                                    }}
                                >
                                    Template Settings
                                </Typography>
                            </Box>
                        }
                        className={classes.tab}
                    /> */}
                </Tabs>
            </Box>

            {/* Tab Content */}
            <Paper elevation={0} className={classes.paper}>
                {activeTab === 0 && <TemplateListComponent onCreateTemplate={handleCreateTemplate} />}
                {/* {activeTab === 1 && <TemplateFormComponent />} */}
            </Paper>
        </>
    )
}

export default TemplateConfigComponent
