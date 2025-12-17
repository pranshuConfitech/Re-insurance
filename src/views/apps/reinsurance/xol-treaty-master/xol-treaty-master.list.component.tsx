'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    Alert,
    Button
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { ReinsuranceService } from '@/services/remote-api/api/reinsurance-services/reinsurance.service';

const reinsuranceService = new ReinsuranceService();

interface XolTreaty {
    id: number;
    layerNumber: number;
    xolTreaty: string;
    lossDeduction: number;
    lossLimit: number;
    capacity: number;
    xolPaticipantDTO: {
        id: number;
        paticipant1?: string;
        paticipant2?: string;
        paticipant3?: string;
        paticipant4?: string;
        paticipant5?: string;
        paticipant6?: string;
        paticipant7?: string;
        paticipant8?: string;
        paticipant9?: string;
        paticipant10?: string;
        paticipant11?: string;
    };
    xolIncurredClaimRecovery: number;
}

export default function XolTreatyMasterListComponent() {
    const router = useRouter();
    const [data, setData] = useState<XolTreaty[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [maxParticipants, setMaxParticipants] = useState(0);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        setError(null);

        const subscription = reinsuranceService.getAllXolTreaties({
            page: 0,
            size: 10,
            summary: true,
            active: true
        }).subscribe({
            next: (response) => {
                if (!isMounted) return; // Prevent state update if unmounted

                const content = response?.data?.content || [];
                setData(content);

                // Calculate max participants across all rows
                let max = 0;
                content.forEach((row: XolTreaty) => {
                    const participantCount = getParticipantCount(row.xolPaticipantDTO);
                    if (participantCount > max) {
                        max = participantCount;
                    }
                });
                setMaxParticipants(max);

                setLoading(false);
            },
            error: (err) => {
                if (!isMounted) return; // Prevent state update if unmounted
                console.error('Error fetching XOL treaties:', err);
                setError('Failed to load XOL treaty data');
                setLoading(false);
            }
        });

        return () => {
            isMounted = false;
            subscription.unsubscribe();
        };
    }, []);

    const fetchData = () => {
        setLoading(true);
        setError(null);

        reinsuranceService.getAllXolTreaties({
            page: 0,
            size: 10,
            summary: true,
            active: true
        }).subscribe({
            next: (response) => {
                const content = response?.data?.content || [];
                setData(content);

                // Calculate max participants across all rows
                let max = 0;
                content.forEach((row: XolTreaty) => {
                    const participantCount = getParticipantCount(row.xolPaticipantDTO);
                    if (participantCount > max) {
                        max = participantCount;
                    }
                });
                setMaxParticipants(max);

                setLoading(false);
            },
            error: (err) => {
                console.error('Error fetching XOL treaties:', err);
                setError('Failed to load XOL treaty data');
                setLoading(false);
            }
        });
    };

    const handleOpen = () => {
        router.push('/reinsurance/treaty-configuration?mode=create&tab=xol');
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    };

    // Count how many participants exist in the DTO
    const getParticipantCount = (dto: any) => {
        let count = 0;
        for (let i = 1; i <= 11; i++) {
            const participant = dto[`paticipant${i}`];
            if (participant && participant !== 'string' && participant.trim() !== '') {
                count++;
            }
        }
        return count;
    };

    // Get all participants from the DTO
    const getParticipants = (dto: any) => {
        const participants: string[] = [];
        for (let i = 1; i <= 11; i++) {
            const participant = dto[`paticipant${i}`];
            if (participant && participant !== 'string') {
                participants.push(participant);
            }
        }
        return participants;
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <CircularProgress />
            </div>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ mb: 3 }}>
                {error}
            </Alert>
        );
    }

    return (
        <>
            {/* Create Button */}
            <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                marginBottom: '24px'
            }}>
                <Button
                    variant='contained'
                    size='small'
                    onClick={handleOpen}
                    startIcon={<AddIcon />}
                    sx={{
                        backgroundColor: '#28a745',
                        '&:hover': { backgroundColor: '#218838' }
                    }}
                >
                    Create
                </Button>
            </div>

            {data.length === 0 ? (
                <Card sx={{ p: 4, textAlign: 'center' }}>
                    <Alert severity="info">No XOL treaties found</Alert>
                </Card>
            ) : (
                <Card>
                    <CardContent>
                        <TableContainer component={Paper} elevation={0} sx={{ maxHeight: '600px', overflow: 'auto' }}>
                            <Table stickyHeader sx={{ minWidth: 650 }}>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '14px', backgroundColor: '#f5f5f5', minWidth: 100 }}>Layer Number</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '14px', backgroundColor: '#f5f5f5', minWidth: 150 }}>XOL Treaty</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 600, fontSize: '14px', backgroundColor: '#f5f5f5', minWidth: 150 }}>Loss Deduction/Priority</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 600, fontSize: '14px', backgroundColor: '#f5f5f5', minWidth: 120 }}>Loss Limit</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 600, fontSize: '14px', backgroundColor: '#f5f5f5', minWidth: 120 }}>Capacity</TableCell>
                                        {Array.from({ length: maxParticipants }, (_, i) => (
                                            <TableCell key={i} sx={{ fontWeight: 600, fontSize: '14px', backgroundColor: '#f5f5f5', minWidth: 150 }}>
                                                Participant {i + 1}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data.map((row) => {
                                        const participants = getParticipants(row.xolPaticipantDTO);
                                        return (
                                            <TableRow
                                                key={row.id}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row">
                                                    {row.layerNumber}
                                                </TableCell>
                                                <TableCell>{row.xolTreaty}</TableCell>
                                                <TableCell align="right">{formatCurrency(row.lossDeduction)}</TableCell>
                                                <TableCell align="right">{formatCurrency(row.lossLimit)}</TableCell>
                                                <TableCell align="right">{formatCurrency(row.capacity)}</TableCell>
                                                {Array.from({ length: maxParticipants }, (_, i) => (
                                                    <TableCell key={i}>
                                                        {participants[i] || '-'}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>
            )}
        </>
    );
}

