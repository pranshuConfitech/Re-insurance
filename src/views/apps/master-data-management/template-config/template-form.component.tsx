'use client'
import React, { useState } from 'react'

import {
    Box,
    Button,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
    Alert,
    CircularProgress
} from '@mui/material'
import { Save, Cancel, CloudUpload } from '@mui/icons-material'
import { TemplateConfigService } from '@/services/remote-api/api/master-services'

const templateConfigService = new TemplateConfigService()

const TemplateFormComponent = () => {
    const [formData, setFormData] = useState({
        templateType: '',
        startDate: ''
    })
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    const handleChange = (event: any) => {
        const { name, value } = event.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        setError(null)
        setSuccess(null)
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            // Validate file type (Excel files)
            const validTypes = [
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ]

            if (!validTypes.includes(file.type)) {
                setError('Please upload a valid Excel or Word document file')
                setSelectedFile(null)
                return
            }

            setSelectedFile(file)
            setError(null)
            setSuccess(null)
        }
    }

    const handleSubmit = () => {
        // Validation
        if (!formData.templateType) {
            setError('Please select a template type')
            return
        }

        if (!formData.startDate) {
            setError('Please enter a start date')
            return
        }

        if (!selectedFile) {
            setError('Please upload a file')
            return
        }

        setLoading(true)
        setError(null)
        setSuccess(null)

        templateConfigService
            .createTemplateConfig(formData.templateType, formData.startDate, selectedFile)
            .subscribe({
                next: (response) => {
                    setLoading(false)
                    setSuccess('Template configuration created successfully!')
                    console.log('Template created:', response)
                    handleReset()
                },
                error: (err) => {
                    setLoading(false)
                    setError(err?.response?.data?.message || 'Failed to create template configuration')
                    console.error('Error creating template:', err)
                }
            })
    }

    const handleReset = () => {
        setFormData({
            templateType: '',
            startDate: ''
        })
        setSelectedFile(null)
        setError(null)
        setSuccess(null)
    }

    return (
        <Box>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#333' }}>
                Template Configuration
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {success && (
                <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
                    {success}
                </Alert>
            )}

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <FormControl fullWidth variant="outlined" required>
                        <InputLabel>Template Type</InputLabel>
                        <Select
                            label="Template Type"
                            name="templateType"
                            value={formData.templateType}
                            onChange={handleChange}
                            disabled={loading}
                        >
                            <MenuItem value="QUOTATION">Quotation</MenuItem>
                            <MenuItem value="INVOICE">Invoice</MenuItem>
                            <MenuItem value="RECEIPT">Receipt</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Start Date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        variant="outlined"
                        type="date"
                        required
                        disabled={loading}
                        InputLabelProps={{
                            shrink: true
                        }}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Box>
                        <Button
                            variant="outlined"
                            component="label"
                            startIcon={<CloudUpload />}
                            disabled={loading}
                            sx={{
                                textTransform: 'none',
                                mb: 1
                            }}
                        >
                            Upload Excel/Document File
                            <input
                                type="file"
                                hidden
                                accept=".xls,.xlsx,.doc,.docx"
                                onChange={handleFileChange}
                            />
                        </Button>
                        {selectedFile && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                Selected file: {selectedFile.name}
                            </Typography>
                        )}
                    </Box>
                </Grid>

                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                        <Button
                            variant="outlined"
                            startIcon={<Cancel />}
                            onClick={handleReset}
                            color="primary"
                            disabled={loading}
                            sx={{
                                textTransform: 'none'
                            }}
                        >
                            Reset
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
                            onClick={handleSubmit}
                            color="primary"
                            disabled={loading}
                            sx={{
                                textTransform: 'none'
                            }}
                        >
                            {loading ? 'Saving...' : 'Save Template'}
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    )
}

export default TemplateFormComponent
