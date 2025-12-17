'use client'
import React, { useState } from 'react'

import {
    Box,
    Button,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography,
    styled,
    Alert,
    CircularProgress,
    Card,
    CardContent
} from '@mui/material'
import { Save, Cancel, CloudUpload } from '@mui/icons-material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { Dayjs } from 'dayjs'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { TemplateConfigService } from '@/services/remote-api/api/master-services'

const templateConfigService = new TemplateConfigService()

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1
})

const validationSchema = yup.object({
    templateType: yup.string().required('Template Type is required'),
    templateSubType: yup.string().required('Template Sub Type is required'),
    templateName: yup.string().required('Template Name is required'),
    startDate: yup.string().required('Start Date is required')
})

interface TemplateCreateComponentProps {
    onBack: () => void
}

const TemplateCreateComponent = ({ onBack }: TemplateCreateComponentProps) => {
    const [excelFile, setExcelFile] = useState<File | null>(null)
    const [startDate, setStartDate] = useState<Dayjs | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    const formik = useFormik({
        initialValues: {
            templateType: '',
            templateSubType: '',
            templateName: '',
            startDate: ''
        },
        validationSchema: validationSchema,
        onSubmit: () => {
            handleSubmitTemplate()
        }
    })

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            // Validate file type
            const validTypes = [
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ]

            if (!validTypes.includes(file.type)) {
                setError('Please upload a valid Excel or Word document file')
                setExcelFile(null)
                return
            }

            setExcelFile(file)
            setError(null)
        }
    }

    const handleSubmitTemplate = () => {
        if (!excelFile) {
            setError('Please upload a file')
            return
        }

        setLoading(true)
        setError(null)
        setSuccess(null)

        templateConfigService
            .createTemplateConfig(formik.values.templateType, formik.values.startDate, excelFile)
            .subscribe({
                next: (response) => {
                    setLoading(false)
                    setSuccess('Template configuration created successfully!')
                    console.log('Template created:', response)
                    setTimeout(() => {
                        onBack()
                    }, 1500)
                },
                error: (err) => {
                    setLoading(false)
                    setError(err?.response?.data?.message || 'Failed to create template configuration')
                    console.error('Error creating template:', err)
                }
            })
    }

    const handleDateChange = (newValue: unknown) => {
        const date = newValue as Dayjs | null
        setStartDate(date)
        formik.setFieldValue('startDate', date ? date.format('DD/MM/YYYY') : '')
    }

    const handleCancel = () => {
        formik.resetForm()
        setExcelFile(null)
        setStartDate(null)
        setError(null)
        setSuccess(null)
        onBack()
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box>
                <Paper elevation={1} sx={{ padding: 3, margin: 2 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main', mb: 3 }}>
                        Create New Template
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

                    <form onSubmit={formik.handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <FormControl
                                    fullWidth
                                    variant="outlined"
                                    required
                                    error={formik.touched.templateType && Boolean(formik.errors.templateType)}
                                >
                                    <InputLabel>Template Type </InputLabel>
                                    <Select
                                        label="Template Type "
                                        name="templateType"
                                        value={formik.values.templateType}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        disabled={loading}
                                    >
                                        <MenuItem value="QUOTATION">Quotation</MenuItem>
                                        <MenuItem value="INVOICE">Invoice</MenuItem>
                                        <MenuItem value="RECEIPT">Receipt</MenuItem>
                                    </Select>
                                    {formik.touched.templateType && formik.errors.templateType && (
                                        <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                                            {formik.errors.templateType}
                                        </Typography>
                                    )}
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <FormControl
                                    fullWidth
                                    variant="outlined"
                                    required
                                    error={formik.touched.templateSubType && Boolean(formik.errors.templateSubType)}
                                >
                                    <InputLabel>Template Sub Type </InputLabel>
                                    <Select
                                        label="Template Sub Type "
                                        name="templateSubType"
                                        value={formik.values.templateSubType}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        disabled={loading}
                                    >
                                        <MenuItem value="TYPE_A">Type A</MenuItem>
                                        <MenuItem value="TYPE_B">Type B</MenuItem>
                                        <MenuItem value="TYPE_C">Type C</MenuItem>
                                    </Select>
                                    {formik.touched.templateSubType && formik.errors.templateSubType && (
                                        <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                                            {formik.errors.templateSubType}
                                        </Typography>
                                    )}
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Template Name"
                                    name="templateName"
                                    value={formik.values.templateName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    variant="outlined"
                                    required
                                    disabled={loading}
                                    error={formik.touched.templateName && Boolean(formik.errors.templateName)}
                                    helperText={formik.touched.templateName && formik.errors.templateName}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <DatePicker
                                    label="Start Date "
                                    value={startDate}
                                    onChange={handleDateChange}
                                    disabled={loading}
                                    inputFormat="DD/MM/YYYY"
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            fullWidth
                                            variant="outlined"
                                            required
                                            error={formik.touched.startDate && Boolean(formik.errors.startDate)}
                                            helperText={formik.touched.startDate && formik.errors.startDate}
                                            onBlur={formik.handleBlur}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Card variant="outlined" sx={{ backgroundColor: '#fafafa' }}>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                            <Button
                                                component="label"
                                                variant="outlined"
                                                startIcon={<CloudUpload />}
                                                color="primary"
                                                disabled={loading}
                                                sx={{
                                                    textTransform: 'none',
                                                    alignSelf: 'flex-start'
                                                }}
                                            >
                                                Excel Upload
                                                <VisuallyHiddenInput
                                                    type="file"
                                                    accept=".xlsx,.xls,.doc,.docx"
                                                    onChange={handleFileUpload}
                                                />
                                            </Button>
                                            {excelFile && (
                                                <Box sx={{
                                                    p: 2,
                                                    backgroundColor: 'white',
                                                    borderRadius: 1,
                                                    border: '1px solid #e0e0e0'
                                                }}>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Selected file:
                                                    </Typography>
                                                    <Typography variant="body1" sx={{ fontWeight: 500, mt: 0.5 }}>
                                                        {excelFile.name}
                                                    </Typography>
                                                </Box>
                                            )}
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                                    <Button
                                        variant="outlined"
                                        startIcon={<Cancel />}
                                        onClick={handleCancel}
                                        color="error"
                                        disabled={loading}
                                        sx={{
                                            textTransform: 'none',
                                            minWidth: 100
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
                                        color="primary"
                                        disabled={loading}
                                        sx={{
                                            textTransform: 'none',
                                            minWidth: 150
                                        }}
                                    >
                                        {loading ? 'Saving...' : 'Save Template'}
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            </Box>
        </LocalizationProvider>
    )
}

export default TemplateCreateComponent
