'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface TreatyConfig4Data {
    id: number;
    treatyCode: string;
    treatyName: string;
    treatyType: string;
    effectiveDate: string;
    expiryDate: string;
    status: string;
}

const TreatyConfig4Component = () => {
    const router = useRouter();

    // Hardcoded data
    const data: TreatyConfig4Data[] = [
        {
            id: 1,
            treatyCode: 'TC001',
            treatyName: 'Fire Treaty 2025',
            treatyType: 'Quota Share',
            effectiveDate: '01/01/2025',
            expiryDate: '31/12/2025',
            status: 'Active'
        },
        {
            id: 2,
            treatyCode: 'TC002',
            treatyName: 'Marine Treaty 2025',
            treatyType: 'Surplus',
            effectiveDate: '01/01/2025',
            expiryDate: '31/12/2025',
            status: 'Active'
        },
        {
            id: 3,
            treatyCode: 'TC003',
            treatyName: 'Motor Treaty 2025',
            treatyType: 'XOL',
            effectiveDate: '01/01/2025',
            expiryDate: '31/12/2025',
            status: 'Active'
        },
        {
            id: 4,
            treatyCode: 'TC004',
            treatyName: 'Property Treaty 2024',
            treatyType: 'Quota Share',
            effectiveDate: '01/01/2024',
            expiryDate: '31/12/2024',
            status: 'Expired'
        },
        {
            id: 5,
            treatyCode: 'TC005',
            treatyName: 'Liability Treaty 2025',
            treatyType: 'Surplus',
            effectiveDate: '01/03/2025',
            expiryDate: '28/02/2026',
            status: 'Active'
        }
    ];

    const handleCreate = () => {
        router.push('/reinsurance/treaty-config-4/create');
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#212529', mb: 1, fontSize: '28px' }}>
                    Treaty Config 4
                </Typography>
                <Typography variant="body2" sx={{ color: '#6c757d', fontSize: '14px' }}>
                    Manage treaty configurations and definitions.
                </Typography>
            </Box>

            {/* Create Button */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleCreate}
                    sx={{
                        backgroundColor: '#28a745',
                        '&:hover': { backgroundColor: '#218838' },
                        textTransform: 'none'
                    }}
                >
                    Create
                </Button>
            </Box>

            {/* Data Table */}
            <Card sx={{ boxShadow: '0 2px 12px rgba(0,0,0,0.08)', borderRadius: '12px' }}>
                <CardContent sx={{ p: 0 }}>
                    <TableContainer component={Paper} elevation={0} sx={{ maxHeight: '600px', overflow: 'auto', borderRadius: '12px' }}>
                        <Table stickyHeader sx={{ minWidth: 650 }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 700, fontSize: '12px', backgroundColor: '#f8f9fa', color: '#6c757d', textTransform: 'uppercase', py: 2, borderBottom: '2px solid #dee2e6' }}>Treaty Code</TableCell>
                                    <TableCell sx={{ fontWeight: 700, fontSize: '12px', backgroundColor: '#f8f9fa', color: '#6c757d', textTransform: 'uppercase', py: 2, borderBottom: '2px solid #dee2e6' }}>Treaty Name</TableCell>
                                    <TableCell sx={{ fontWeight: 700, fontSize: '12px', backgroundColor: '#f8f9fa', color: '#6c757d', textTransform: 'uppercase', py: 2, borderBottom: '2px solid #dee2e6' }}>Treaty Type</TableCell>
                                    <TableCell sx={{ fontWeight: 700, fontSize: '12px', backgroundColor: '#f8f9fa', color: '#6c757d', textTransform: 'uppercase', py: 2, borderBottom: '2px solid #dee2e6' }}>Effective Date</TableCell>
                                    <TableCell sx={{ fontWeight: 700, fontSize: '12px', backgroundColor: '#f8f9fa', color: '#6c757d', textTransform: 'uppercase', py: 2, borderBottom: '2px solid #dee2e6' }}>Expiry Date</TableCell>
                                    <TableCell sx={{ fontWeight: 700, fontSize: '12px', backgroundColor: '#f8f9fa', color: '#6c757d', textTransform: 'uppercase', py: 2, borderBottom: '2px solid #dee2e6' }}>Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        sx={{
                                            '&:hover': { backgroundColor: '#f8f9fa' }
                                        }}
                                    >
                                        <TableCell sx={{ fontSize: '14px', py: 2, fontWeight: 600 }}>{row.treatyCode}</TableCell>
                                        <TableCell sx={{ fontSize: '14px', py: 2 }}>{row.treatyName}</TableCell>
                                        <TableCell sx={{ fontSize: '14px', py: 2 }}>{row.treatyType}</TableCell>
                                        <TableCell sx={{ fontSize: '14px', py: 2 }}>{row.effectiveDate}</TableCell>
                                        <TableCell sx={{ fontSize: '14px', py: 2 }}>{row.expiryDate}</TableCell>
                                        <TableCell sx={{ fontSize: '14px', py: 2 }}>
                                            <Box
                                                component="span"
                                                sx={{
                                                    px: 2,
                                                    py: 0.5,
                                                    borderRadius: '12px',
                                                    fontSize: '12px',
                                                    fontWeight: 600,
                                                    backgroundColor: row.status === 'Active' ? '#d4edda' : '#f8d7da',
                                                    color: row.status === 'Active' ? '#155724' : '#721c24'
                                                }}
                                            >
                                                {row.status}
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>
        </Box>
    );
};

export default TreatyConfig4Component;
