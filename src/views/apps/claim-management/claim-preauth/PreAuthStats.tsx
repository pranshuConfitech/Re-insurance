import React, { useState, useEffect } from 'react'
import { makeStyles } from '@mui/styles'
import { Grid, Paper, Typography, Box } from '@mui/material'
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined'
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined'
import ThumbDownAltOutlinedIcon from '@mui/icons-material/ThumbDownAltOutlined'
import RateReviewIcon from '@mui/icons-material/RateReview'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import DraftsOutlinedIcon from '@mui/icons-material/DraftsOutlined'
import { PreAuthService } from '@/services/remote-api/api/claims-services'

const useStyles = makeStyles((theme: any) => ({
  statsCard: {
    padding: theme?.spacing ? theme.spacing(3) : '24px',
    borderRadius: 12,
    height: '100%',
    width: '100%',
    maxWidth: 200,
    transition: 'transform 0.2s ease-in-out',
    '&:hover': {
      transform: 'translateY(-4px)',
    },
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  iconBox: {
    width: 45,
    height: 45,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme?.spacing ? theme.spacing(1) : '8px',
  },
  icon: {
    color: '#fff',
    fontSize: 24,
  },
  value: {
    fontSize: '1.5rem',
    fontWeight: 600,
    marginBottom: theme?.spacing ? theme.spacing(1) : '8px',
    textAlign: 'left',
    width: '100%',
  },
  label: {
    color: theme?.palette?.text?.secondary,
    fontSize: '0.875rem',
    textAlign: 'left',
    wordBreak: 'break-word',
    width: '100%',
  },
}))

const preAuthService = new PreAuthService()

const PreAuthStats = () => {
  const classes = useStyles()
  const [counts, setCounts] = useState({
    total: 0,
    approved: 0,
    rejected: 0,
    requested: 0,
    cancelled: 0,
    draft: 0
  })

  useEffect(() => {
    const subscription = preAuthService.getDashboardCount().subscribe((result: any) => {
      if (result?.data) {
        setCounts(result.data)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  const statsData = [
    {
      label: 'Total',
      value: counts.total,
      color: 'rgba(49, 60, 150, 0.9)',
      icon: AccountBalanceWalletOutlinedIcon
    },
    {
      label: 'Approved',
      value: counts.approved,
      color: 'rgba(1, 222, 116, 0.9)',
      icon: ThumbUpAltOutlinedIcon
    },
    {
      label: 'Rejected',
      value: counts.rejected,
      color: 'rgba(255, 50, 67, 0.9)',
      icon: ThumbDownAltOutlinedIcon
    },
    {
      label: 'Requested',
      value: counts.requested,
      color: 'rgba(4, 59, 92, 0.9)',
      icon: RateReviewIcon
    },
    {
      label: 'Cancelled',
      value: counts.cancelled,
      color: 'rgba(149, 48, 55, 0.9)',
      icon: CancelOutlinedIcon
    },
    {
      label: 'Draft',
      value: counts.draft,
      color: 'rgba(128, 128, 128, 0.9)',
      icon: DraftsOutlinedIcon
    }
  ]

  return (
    <Grid container spacing={2}>
      {statsData.map((stat) => (
        <Grid item key={stat.label} xs={12} sm={6} md={4} lg={3} xl={2}>
          <Paper className={classes.statsCard}>
            <Box className={classes.iconBox} style={{ backgroundColor: stat.color }}>
              <stat.icon className={classes.icon} />
            </Box>
            <Typography variant="h5" className={classes.value}>
              {stat.value}
            </Typography>
            <Typography className={classes.label}>{stat.label}</Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  )
}

export default PreAuthStats

