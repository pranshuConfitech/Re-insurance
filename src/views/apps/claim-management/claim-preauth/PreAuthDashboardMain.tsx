'use client'
import React, { useEffect, useState } from 'react'
import { Box, Button, Paper } from '@mui/material'
import { makeStyles } from '@mui/styles'
import PreAuthStats from './PreAuthStats'
import PreAuthTabComponent from './PreAuthTabComponent'
import { PreAuthService } from '@/services/remote-api/api/claims-services'

const preAuthService = new PreAuthService()

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
  paperContainer: {
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    overflow: 'hidden',
    background: '#ffffff',
  },
}))

const TabPanel = (props: any) => {
  const { children, value, index, ...other } = props
  const classes = useStyles()

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`preauth-tabpanel-${index}`}
      aria-labelledby={`preauth-tab-${index}`}
      className={classes.tabContent}
      {...other}
    >
      {value === index && <Box className={classes.tabPanel}>{children}</Box>}
    </div>
  )
}

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
  )
}

export default function PreAuthDashboardMain() {
  const classes = useStyles()
  const [tabValue, setTabValue] = useState(1)
  const [totalPreAuthCount, setTotalPreAuthCount] = useState(0)
  const [reloadTrigger, setReloadTrigger] = useState(0)

  const handleTabChange = (event: any, newValue: any) => {
    setTabValue(newValue)
  }

  useEffect(() => {
    // Fetch total pre-auth count
    preAuthService.getDashboardCount().subscribe((result: any) => {
      if (result?.data) {
        setTotalPreAuthCount(result.data.total || 0)
      }
    })
  }, [])

  const handleTotalClick = () => {
    setReloadTrigger(prev => prev + 1)
  }

  return (
    <div className={classes.root}>
      {/* Pre-Auth Management Title */}
      <div className={classes.titleSection}>
        Claim Management - Pre-Auth
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
          <PreAuthStats />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <PreAuthTabComponent
            reloadTrigger={reloadTrigger}
            totalPreAuthCount={totalPreAuthCount}
            onTotalClick={handleTotalClick}
          />
        </TabPanel>
      </Paper>
    </div>
  )
}
