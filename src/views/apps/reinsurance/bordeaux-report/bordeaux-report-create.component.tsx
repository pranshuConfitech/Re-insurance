'use client';
import React, { useState, useCallback } from 'react';
import { Box, Card, CardContent, Typography, Button, CircularProgress, Alert } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DescriptionIcon from '@mui/icons-material/Description';
import { useRouter } from 'next/navigation';
import { BordeauxService } from '@/services/remote-api/api/reinsurance-services/bordeaux.service';

const bordeauxService = new BordeauxService();

export default function BordeauxReportCreateComponent() {
    const router = useRouter();
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setUploadedFile(acceptedFiles[0]);
            setError(null);
            setSuccess(false);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/vnd.ms-excel': ['.xls'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'text/csv': ['.csv']
        },
        multiple: false
    });

    const handleClear = () => {
        setUploadedFile(null);
        setError(null);
        setSuccess(false);
    };

    const handleProcessUpload = async () => {
        if (!uploadedFile) return;

        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            await bordeauxService.uploadBordeauxStaging(uploadedFile).toPromise();
            setSuccess(true);
            setTimeout(() => {
                router.push('/reinsurance/bordeaux-report');
            }, 2000);
        } catch (err: any) {
            console.error('Upload error:', err);
            setError(err?.message || 'Failed to upload file. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600, color: '#2c3e50' }}>
                Create Bordeaux Report
            </Typography>

            <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderRadius: '8px' }}>
                <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                        <UploadFileIcon sx={{ color: '#1976d2', fontSize: 22 }} />
                        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '15px', color: '#2c3e50' }}>
                            Upload Staging Excel
                        </Typography>
                    </Box>

                    {/* Dropzone */}
                    <Box
                        {...getRootProps()}
                        sx={{
                            border: '2px dashed',
                            borderColor: isDragActive ? '#1976d2' : '#d0d0d0',
                            borderRadius: '8px',
                            p: 5,
                            textAlign: 'center',
                            cursor: 'pointer',
                            backgroundColor: isDragActive ? '#e3f2fd' : '#fafafa',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                borderColor: '#1976d2',
                                backgroundColor: '#f5f5f5'
                            }
                        }}
                    >
                        <input {...getInputProps()} />
                        <DescriptionIcon
                            sx={{
                                fontSize: 56,
                                color: uploadedFile ? '#1976d2' : '#bdbdbd',
                                mb: 2
                            }}
                        />
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, fontSize: '14px', color: '#2c3e50' }}>
                            {uploadedFile ? uploadedFile.name : 'Drag and drop your Excel file here'}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#6c757d', fontSize: '12px' }}>
                            or click to browse • Supports .xlsx, .xls, and .csv files
                        </Typography>
                        {uploadedFile && (
                            <Typography variant="caption" sx={{ color: '#28a745', fontSize: '11px', mt: 1, display: 'block' }}>
                                ✓ File selected: {(uploadedFile.size / 1024).toFixed(2)} KB
                            </Typography>
                        )}
                    </Box>

                    {/* Success/Error Messages */}
                    {success && (
                        <Alert severity="success" sx={{ mt: 2, fontSize: '13px' }}>
                            File uploaded successfully! Redirecting...
                        </Alert>
                    )}
                    {error && (
                        <Alert severity="error" sx={{ mt: 2, fontSize: '13px' }}>
                            {error}
                        </Alert>
                    )}

                    {/* Action Buttons */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
                        <Button
                            variant="outlined"
                            onClick={handleClear}
                            disabled={!uploadedFile || loading}
                            sx={{
                                textTransform: 'none',
                                fontSize: '13px',
                                fontWeight: 600,
                                px: 3,
                                py: 0.8,
                                borderRadius: '6px',
                                borderColor: '#d0d0d0',
                                color: '#6c757d',
                                '&:hover': {
                                    borderColor: '#999',
                                    backgroundColor: '#f5f5f5'
                                },
                                '&:disabled': {
                                    borderColor: '#e0e0e0',
                                    color: '#bdbdbd'
                                }
                            }}
                        >
                            Clear
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleProcessUpload}
                            disabled={!uploadedFile || loading}
                            sx={{
                                backgroundColor: '#e91e63',
                                color: '#fff',
                                textTransform: 'none',
                                fontSize: '13px',
                                fontWeight: 600,
                                px: 3,
                                py: 0.8,
                                borderRadius: '6px',
                                boxShadow: '0 2px 4px rgba(233, 30, 99, 0.2)',
                                '&:hover': {
                                    backgroundColor: '#c2185b',
                                    boxShadow: '0 4px 8px rgba(233, 30, 99, 0.3)'
                                },
                                '&:disabled': {
                                    backgroundColor: '#e0e0e0',
                                    color: '#9e9e9e',
                                    boxShadow: 'none'
                                }
                            }}
                        >
                            {loading ? (
                                <>
                                    <CircularProgress size={18} sx={{ mr: 1, color: 'white' }} />
                                    Processing...
                                </>
                            ) : (
                                'Process Upload'
                            )}
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}
