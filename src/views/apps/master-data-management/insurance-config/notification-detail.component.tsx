'use client'
import React, { useState, useEffect } from 'react'
import {
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    Grid,
    Paper,
    TextField,
    Typography,
    CircularProgress
} from '@mui/material'
import { makeStyles } from '@mui/styles'
import { ProviderTypeService } from '@/services/remote-api/api/master-services/provider.type.service'

const useStyles = makeStyles(theme => ({
    paper: {
        padding: '2rem',
        borderRadius: '0px',
        // boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e9ecef',
        backgroundColor: '#ffffff'
    },
    notificationMode: {
        marginBottom: '2rem',
        padding: '1.5rem',
        backgroundColor: '#f8f9fa',
        borderRadius: '12px',
        border: '1px solid #e9ecef'
    },
    smtpSection: {
        border: '2px solid #d80f51',
        borderRadius: '12px',
        padding: '2rem',
        marginBottom: '2rem',
        backgroundColor: '#fdf8f9',
        boxShadow: '0px 2px 12px rgba(216, 15, 81, 0.15)',
        position: 'relative',
        '&::before': {
            content: '""',
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            height: '4px',
            backgroundColor: '#d80f51',
            borderRadius: '12px 12px 0 0'
        }
    },
    updateButton: {
        backgroundColor: '#d80f51',
        color: 'white',
        borderRadius: '8px',
        padding: '10px 24px',
        fontWeight: 600,
        textTransform: 'none',
        fontSize: '0.9rem',
        boxShadow: '0px 2px 8px rgba(216, 15, 81, 0.3)',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
            backgroundColor: '#b80a43',
            boxShadow: '0px 4px 16px rgba(216, 15, 81, 0.4)',
            transform: 'translateY(-1px)'
        }
    }
}))

const NotificationDetailComponent = () => {
    const classes = useStyles()
    const providerTypeService = new ProviderTypeService()

    const [notificationModes, setNotificationModes] = useState({
        email: true,
        sms: false,
        whatsapp: false
    })

    const [smtpConfig, setSmtpConfig] = useState({
        url: '',
        username: '',
        port: '',
        password: ''
    })

    const [loading, setLoading] = useState(false)

    // Fetch notification configuration when component mounts
    useEffect(() => {
        fetchNotificationConfiguration()
    }, [])

    const fetchNotificationConfiguration = () => {
        setLoading(true)
        // Using ID 13 as per the API endpoint you provided
        providerTypeService.getNotificationConfiguration(13).subscribe({
            next: (response: any) => {
                console.log('Notification configuration:', response)
                if (response && response.length > 0) {
                    const config = response[0]
                    // Update notification modes based on API response
                    setNotificationModes({
                        email: config.emailEnabled || false,
                        sms: config.smsEnabled || false,
                        whatsapp: config.whatsappEnabled || false
                    })
                    // Update SMTP config if available
                    if (config.smtpConfig) {
                        setSmtpConfig({
                            url: config.smtpConfig.url || '',
                            username: config.smtpConfig.username || '',
                            port: config.smtpConfig.port || '',
                            password: config.smtpConfig.password || ''
                        })
                    }
                }
                setLoading(false)
            },
            error: (error: any) => {
                console.error('Error fetching notification configuration:', error)
                setLoading(false)
            }
        })
    }

    const handleNotificationModeChange = (mode: string) => {
        setNotificationModes(prev => ({
            ...prev,
            [mode]: !prev[mode as keyof typeof prev]
        }))
    }

    const handleSmtpConfigChange = (field: string, value: string) => {
        setSmtpConfig(prev => ({ ...prev, [field]: value }))
    }

    const handleUpdateSmtp = () => {
        setLoading(true)

        // Prepare payload according to the API specification
        const payload = {
            mode: "EMAIL",
            notificationEmailDTO: {
                host: smtpConfig.url,
                port: smtpConfig.port,
                username: smtpConfig.username,
                password: smtpConfig.password
            }
        }

        console.log('Updating Email Configuration:', payload)

        // Call the PATCH API to update notification configuration
        providerTypeService.updateNotificationConfiguration(13, payload).subscribe({
            next: (response: any) => {
                console.log('Notification configuration updated successfully:', response)
                // You can add a success message here if needed
                setLoading(false)
            },
            error: (error: any) => {
                console.error('Error updating notification configuration:', error)
                setLoading(false)
            }
        })
    }

    return (
        <Paper elevation={0} className={classes.paper}>
            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <CircularProgress />
                </Box>
            )}

            {/* Notification Mode Selection */}
            <Box className={classes.notificationMode}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#333' }}>
                    Notification Mode
                </Typography>
                <Grid container spacing={3}>
                    <Grid item>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={notificationModes.email}
                                    onChange={() => handleNotificationModeChange('email')}
                                    sx={{
                                        color: '#d80f51',
                                        '&.Mui-checked': {
                                            color: '#d80f51'
                                        }
                                    }}
                                />
                            }
                            label={
                                <Typography
                                    sx={{
                                        fontWeight: notificationModes.email ? 600 : 400,
                                        color: notificationModes.email ? '#d80f51' : '#666'
                                    }}
                                >
                                    Email
                                </Typography>
                            }
                        />
                    </Grid>
                    <Grid item>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={notificationModes.sms}
                                    onChange={() => handleNotificationModeChange('sms')}
                                    sx={{
                                        color: '#d80f51',
                                        '&.Mui-checked': {
                                            color: '#d80f51'
                                        }
                                    }}
                                />
                            }
                            label={
                                <Typography
                                    sx={{
                                        fontWeight: notificationModes.sms ? 600 : 400,
                                        color: notificationModes.sms ? '#d80f51' : '#666'
                                    }}
                                >
                                    SMS
                                </Typography>
                            }
                        />
                    </Grid>
                    <Grid item>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={notificationModes.whatsapp}
                                    onChange={() => handleNotificationModeChange('whatsapp')}
                                    sx={{
                                        color: '#d80f51',
                                        '&.Mui-checked': {
                                            color: '#d80f51'
                                        }
                                    }}
                                />
                            }
                            label={
                                <Typography
                                    sx={{
                                        fontWeight: notificationModes.whatsapp ? 600 : 400,
                                        color: notificationModes.whatsapp ? '#d80f51' : '#666'
                                    }}
                                >
                                    WhatsApp
                                </Typography>
                            }
                        />
                    </Grid>
                </Grid>
            </Box>

            {/* Email Configuration - Show only when Email is checked */}
            {notificationModes.email && (
                <Box className={classes.smtpSection}>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#333' }}>
                        Email Configuration
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="SMTP URL"
                                value={smtpConfig.url}
                                onChange={(e) => handleSmtpConfigChange('url', e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="User Name"
                                value={smtpConfig.username}
                                onChange={(e) => handleSmtpConfigChange('username', e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="SMTP Port"
                                value={smtpConfig.port}
                                onChange={(e) => handleSmtpConfigChange('port', e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Password"
                                type="password"
                                value={smtpConfig.password}
                                onChange={(e) => handleSmtpConfigChange('password', e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                variant="contained"
                                className={classes.updateButton}
                                onClick={handleUpdateSmtp}
                                disabled={loading}
                                startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
                            >
                                {loading ? 'Updating...' : 'Update Email Configuration'}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            )}

            {/* SMS Configuration - Show only when SMS is checked */}
            {notificationModes.sms && (
                <Box className={classes.smtpSection}>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#333' }}>
                        SMS Configuration
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography variant="body1" sx={{ color: '#666', fontStyle: 'italic' }}>
                                SMS configuration options will be implemented here.
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
            )}

            {/* WhatsApp Configuration - Show only when WhatsApp is checked */}
            {notificationModes.whatsapp && (
                <Box className={classes.smtpSection}>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#333' }}>
                        WhatsApp Configuration
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography variant="body1" sx={{ color: '#666', fontStyle: 'italic' }}>
                                WhatsApp configuration options will be implemented here.
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
            )}
        </Paper>
    )
}

export default NotificationDetailComponent
