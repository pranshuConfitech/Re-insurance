'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Box,
    Card,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { ReinsuranceService } from '@/services/remote-api/api/reinsurance-services/reinsurance.service';

const reinsuranceService = new ReinsuranceService();

interface ParticipatingReinsurer {
    id: number;
    participatingReinsurer: string;
    participatingReinsurerShare: number;
    participatingReinsurerName: string;
}

interface SurplusParticipant {
    id: number;
    surplusParticipantId: string;
    surplusParticipant: string;
    share: number;
    surplusParticipantName: string;
    participatingReinsurers: ParticipatingReinsurer[];
}

export default function SurplusParticipantListComponent() {
    const router = useRouter();
    const [data, setData] = useState<SurplusParticipant[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const subscription = reinsuranceService.getAllSurplusParticipants({
            page: 0,
            size: 100,
            summary: true,
            active: true,
            sort: ['rowCreatedDate dsc']
        }).subscribe({
            next: (response: any) => {
                if (!isMounted) return; // Prevent state update if unmounted
                const content = response?.data?.content || [];
                setData(content);
                setLoading(false);
            },
            error: (error) => {
                if (!isMounted) return; // Prevent state update if unmounted
                console.error('Error fetching surplus participants:', error);
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
        reinsuranceService.getAllSurplusParticipants({
            page: 0,
            size: 100,
            summary: true,
            active: true,
            sort: ['rowCreatedDate dsc']
        }).subscribe({
            next: (response: any) => {
                const content = response?.data?.content || [];
                setData(content);
                setLoading(false);
            },
            error: (error) => {
                console.error('Error fetching surplus participants:', error);
                setLoading(false);
            }
        });
    };

    const handleCreate = () => {
        router.push('/reinsurance/treaty-configuration?mode=create&tab=surplus');
    };

    // Group data by surplusParticipantId to show them together
    const groupedData = data.reduce((acc, item) => {
        const key = item.surplusParticipantId;
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(item);
        return acc;
    }, {} as Record<string, SurplusParticipant[]>);

    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 3 }}>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleCreate}
                    sx={{
                        backgroundColor: '#28a745',
                        '&:hover': { backgroundColor: '#218838' }
                    }}
                >
                    Create
                </Button>
            </Box>

            {loading ? (
                <Card sx={{ p: 4, textAlign: 'center' }}>
                    <Typography>Loading...</Typography>
                </Card>
            ) : data.length === 0 ? (
                <Card sx={{ p: 4, textAlign: 'center' }}>
                    <Typography color="text.secondary">No surplus participants found</Typography>
                </Card>
            ) : (
                Object.entries(groupedData).map(([groupId, items]) => (
                    <Card key={groupId} sx={{ mb: 3, overflow: 'hidden' }}>
                        <TableContainer component={Paper} elevation={0}>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                                        <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem', width: '35%' }}>
                                            Surplus Participants
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem', width: '15%' }}>
                                            Share %
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem', width: '35%' }}>
                                            Participating Reinsurers
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem', width: '15%' }}>
                                            Participating Reinsurers-Share %
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {items.map((item, itemIndex) => {
                                        const hasChildren = item.participatingReinsurers && item.participatingReinsurers.length > 0;
                                        const rowSpan = hasChildren ? item.participatingReinsurers.length : 1;
                                        const isReinsurer = !hasChildren;
                                        const isBroker = hasChildren;

                                        return (
                                            <React.Fragment key={item.id}>
                                                {/* First row with parent info */}
                                                <TableRow
                                                    sx={{
                                                        backgroundColor: isBroker ? '#fff8f0' : '#f0f8ff',
                                                        '&:hover': { backgroundColor: isBroker ? '#fff3e0' : '#e3f2fd' }
                                                    }}
                                                >
                                                    <TableCell
                                                        rowSpan={rowSpan}
                                                        sx={{
                                                            borderRight: '1px solid #e0e0e0',
                                                            verticalAlign: 'top',
                                                            py: 2
                                                        }}
                                                    >
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <Chip
                                                                label={isBroker ? 'B' : 'R'}
                                                                size="small"
                                                                sx={{
                                                                    backgroundColor: isBroker ? '#ed6c02' : '#1976d2',
                                                                    color: 'white',
                                                                    fontWeight: 600,
                                                                    minWidth: '28px'
                                                                }}
                                                            />
                                                            <Typography variant="body2" fontWeight={500}>
                                                                {item.surplusParticipantName}
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell
                                                        rowSpan={rowSpan}
                                                        sx={{
                                                            borderRight: '1px solid #e0e0e0',
                                                            textAlign: 'center',
                                                            verticalAlign: 'top',
                                                            py: 2
                                                        }}
                                                    >
                                                        <Typography variant="body2" fontWeight={600}>
                                                            {item.share}%
                                                        </Typography>
                                                    </TableCell>
                                                    {hasChildren ? (
                                                        <>
                                                            <TableCell sx={{ borderRight: '1px solid #e0e0e0', py: 1.5 }}>
                                                                <Typography variant="body2">
                                                                    {item.participatingReinsurers[0].participatingReinsurerName}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell sx={{ textAlign: 'center', py: 1.5 }}>
                                                                <Typography variant="body2" fontWeight={600}>
                                                                    {item.participatingReinsurers[0].participatingReinsurerShare}%
                                                                </Typography>
                                                            </TableCell>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <TableCell sx={{ borderRight: '1px solid #e0e0e0', py: 1.5 }}>
                                                                <Typography variant="body2" color="text.secondary" fontStyle="italic">
                                                                    -
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell sx={{ textAlign: 'center', py: 1.5 }}>
                                                                <Typography variant="body2" color="text.secondary" fontStyle="italic">
                                                                    -
                                                                </Typography>
                                                            </TableCell>
                                                        </>
                                                    )}
                                                </TableRow>

                                                {/* Additional rows for remaining children */}
                                                {hasChildren && item.participatingReinsurers.slice(1).map((child, childIndex) => (
                                                    <TableRow
                                                        key={`${item.id}-child-${childIndex}`}
                                                        sx={{
                                                            backgroundColor: '#fff8f0',
                                                            '&:hover': { backgroundColor: '#fff3e0' }
                                                        }}
                                                    >
                                                        <TableCell sx={{ borderRight: '1px solid #e0e0e0', py: 1.5 }}>
                                                            <Typography variant="body2">
                                                                {child.participatingReinsurerName}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell sx={{ textAlign: 'center', py: 1.5 }}>
                                                            <Typography variant="body2" fontWeight={600}>
                                                                {child.participatingReinsurerShare}%
                                                            </Typography>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </React.Fragment>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Card>
                ))
            )}
        </>
    );
}
