'use client';
import React, { useEffect, useState } from 'react';
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
    Button,
    Chip,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { ReinsuranceService } from '@/services/remote-api/api/reinsurance-services/reinsurance.service';

const reinsuranceService = new ReinsuranceService();

interface TreatyAllocation {
    treatyTypeId: string;
    treatyType: string;
    allocationRisi: number;
    allocationPct: number;
    allocationPremium: number;
    riCommission: number;
}

interface SurplusParticipantAllocation {
    [key: string]: any;
}

interface ProportionalAllocationOnClaim {
    [key: string]: any;
}

interface PaidClaimsAllocation {
    [key: string]: any;
}

interface OutstandingClaimsAllocation {
    [key: string]: any;
}

interface XolTreatyDefinitionAllocation {
    layerNumber: number;
    xolTreaty: string;
    lossDeduction: number;
    lossLimit: number;
    capacity: number;
    xolIncurredClaimRecovery: number;
    paidControl: number;
    osControl: number;
    xolClaimRecoveryPaid: number;
    xolClaimRecoveryOS: number;
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
    xolClaimRecoveryParticipants: {
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
}

export default function TreatyAllocationListComponent() {
    const [data, setData] = useState<TreatyAllocation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filter states
    const [period, setPeriod] = useState('2025-2026');
    const [productCode, setProductCode] = useState('FIRE01');
    const [riskGrade, setRiskGrade] = useState('1');
    const [accountingLOB, setAccountingLOB] = useState('Fire');
    const [riskCategory, setRiskCategory] = useState('Fire');
    const [type, setType] = useState('Per Risk');

    const [surplusData, setSurplusData] = useState<SurplusParticipantAllocation[]>([]);
    const [surplusLoading, setSurplusLoading] = useState(true);
    const [surplusError, setSurplusError] = useState<string | null>(null);

    const [proportionalData, setProportionalData] = useState<ProportionalAllocationOnClaim[]>([]);
    const [proportionalLoading, setProportionalLoading] = useState(true);
    const [proportionalError, setProportionalError] = useState<string | null>(null);

    const [paidClaimsData, setPaidClaimsData] = useState<PaidClaimsAllocation[]>([]);
    const [paidClaimsLoading, setPaidClaimsLoading] = useState(true);
    const [paidClaimsError, setPaidClaimsError] = useState<string | null>(null);

    const [outstandingClaimsData, setOutstandingClaimsData] = useState<OutstandingClaimsAllocation[]>([]);
    const [outstandingClaimsLoading, setOutstandingClaimsLoading] = useState(true);
    const [outstandingClaimsError, setOutstandingClaimsError] = useState<string | null>(null);

    // XOL Treaty Definition Allocation - Commented out for now
    // const [xolAllocationData, setXolAllocationData] = useState<XolTreatyDefinitionAllocation[]>([]);
    // const [xolAllocationLoading, setXolAllocationLoading] = useState(true);
    // const [xolAllocationError, setXolAllocationError] = useState<string | null>(null);
    // const [maxXolParticipants, setMaxXolParticipants] = useState(0);

    useEffect(() => {
        fetchTreatyAllocation();
        fetchSurplusParticipantAllocation();
        fetchProportionalAllocationsOnClaim();
        fetchPaidClaimsAllocation();
        fetchOutstandingClaimsAllocation();
        // fetchXolTreatyDefinitionAllocation(); // Commented out for now
    }, []);

    const fetchTreatyAllocation = () => {
        setLoading(true);
        setError(null);

        reinsuranceService.getTreatyAllocation().subscribe({
            next: (response) => {
                setData(response || []);
                setLoading(false);
            },
            error: (err) => {
                console.error('Error fetching treaty allocation:', err);
                setError('Failed to load treaty allocation data');
                setLoading(false);
            }
        });
    };

    const fetchSurplusParticipantAllocation = () => {
        setSurplusLoading(true);
        setSurplusError(null);

        reinsuranceService.getSurplusParticipantAllocation().subscribe({
            next: (response) => {
                setSurplusData(response || []);
                setSurplusLoading(false);
            },
            error: (err) => {
                console.error('Error fetching surplus participant allocation:', err);
                setSurplusError('Failed to load surplus participant allocation data');
                setSurplusLoading(false);
            }
        });
    };

    const fetchProportionalAllocationsOnClaim = () => {
        setProportionalLoading(true);
        setProportionalError(null);

        reinsuranceService.getProportionalAllocationsOnClaim().subscribe({
            next: (response) => {
                setProportionalData(response || []);
                setProportionalLoading(false);
            },
            error: (err) => {
                console.error('Error fetching proportional allocations on claim:', err);
                setProportionalError('Failed to load proportional allocations on claim data');
                setProportionalLoading(false);
            }
        });
    };

    const fetchPaidClaimsAllocation = () => {
        setPaidClaimsLoading(true);
        setPaidClaimsError(null);

        reinsuranceService.getSurplusParticipantAllocationPaidClaims().subscribe({
            next: (response) => {
                setPaidClaimsData(response || []);
                setPaidClaimsLoading(false);
            },
            error: (err) => {
                console.error('Error fetching paid claims allocation:', err);
                setPaidClaimsError('Failed to load paid claims allocation data');
                setPaidClaimsLoading(false);
            }
        });
    };

    const fetchOutstandingClaimsAllocation = () => {
        setOutstandingClaimsLoading(true);
        setOutstandingClaimsError(null);

        reinsuranceService.getSurplusParticipantAllocationOutstandingClaims().subscribe({
            next: (response) => {
                setOutstandingClaimsData(response || []);
                setOutstandingClaimsLoading(false);
            },
            error: (err) => {
                console.error('Error fetching outstanding claims allocation:', err);
                setOutstandingClaimsError('Failed to load outstanding claims allocation data');
                setOutstandingClaimsLoading(false);
            }
        });
    };

    // XOL Treaty Definition Allocation functions - Commented out for now
    // const fetchXolTreatyDefinitionAllocation = () => {
    //     setXolAllocationLoading(true);
    //     setXolAllocationError(null);

    //     reinsuranceService.getXolTreatyDefinitionAllocation().subscribe({
    //         next: (response) => {
    //             const data = response || [];
    //             setXolAllocationData(data);

    //             // Calculate max participants across all rows
    //             let max = 0;
    //             data.forEach((row: XolTreatyDefinitionAllocation) => {
    //                 const participantCount = getXolParticipantCount(row.xolPaticipantDTO);
    //                 if (participantCount > max) {
    //                     max = participantCount;
    //                 }
    //             });
    //             setMaxXolParticipants(max);

    //             setXolAllocationLoading(false);
    //         },
    //         error: (err) => {
    //             console.error('Error fetching XOL treaty definition allocation:', err);
    //             setXolAllocationError('Failed to load XOL treaty definition allocation data');
    //             setXolAllocationLoading(false);
    //         }
    //     });
    // };

    // const getXolParticipantCount = (dto: any) => {
    //     let count = 0;
    //     for (let i = 1; i <= 11; i++) {
    //         const participant = dto[`paticipant${i}`];
    //         if (participant && participant !== 'string' && participant.trim() !== '') {
    //             count++;
    //         }
    //     }
    //     return count;
    // };

    // const getXolParticipants = (dto: any) => {
    //     const participants: string[] = [];
    //     for (let i = 1; i <= 11; i++) {
    //         const participant = dto[`paticipant${i}`];
    //         if (participant && participant !== 'string' && participant.trim() !== '') {
    //             participants.push(participant);
    //         }
    //     }
    //     return participants;
    // };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    };

    const formatPercentage = (value: number) => {
        return `${(value * 100).toFixed(2)}%`;
    };

    const handleDownloadExcel = () => {
        reinsuranceService.downloadTreatyAllocationExcel().subscribe({
            next: (blob) => {
                const url = window.URL.createObjectURL(new Blob([blob]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `treaty-allocation-${new Date().getTime()}.xlsx`);
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(url);
            },
            error: (err) => {
                console.error('Error downloading excel:', err);
                alert('Failed to download Excel file');
            }
        });
    };

    const handleDownloadSurplusExcel = () => {
        reinsuranceService.downloadSurplusParticipantAllocationExcel().subscribe({
            next: (blob) => {
                const url = window.URL.createObjectURL(new Blob([blob]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `surplus-participant-allocation-${new Date().getTime()}.xlsx`);
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(url);
            },
            error: (err) => {
                console.error('Error downloading excel:', err);
                alert('Failed to download Excel file');
            }
        });
    };

    const handleDownloadProportionalExcel = () => {
        reinsuranceService.downloadProportionalAllocationsOnClaimExcel().subscribe({
            next: (blob) => {
                const url = window.URL.createObjectURL(new Blob([blob]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `proportional-allocations-on-claim-${new Date().getTime()}.xlsx`);
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(url);
            },
            error: (err) => {
                console.error('Error downloading excel:', err);
                alert('Failed to download Excel file');
            }
        });
    };

    const handleDownloadPaidClaimsExcel = () => {
        reinsuranceService.downloadSurplusParticipantAllocationPaidClaimsExcel().subscribe({
            next: (blob) => {
                const url = window.URL.createObjectURL(new Blob([blob]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `paid-claims-allocation-${new Date().getTime()}.xlsx`);
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(url);
            },
            error: (err) => {
                console.error('Error downloading excel:', err);
                alert('Failed to download Excel file');
            }
        });
    };

    const handleDownloadOutstandingClaimsExcel = () => {
        reinsuranceService.downloadSurplusParticipantAllocationOutstandingClaimsExcel().subscribe({
            next: (blob) => {
                const url = window.URL.createObjectURL(new Blob([blob]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `outstanding-claims-allocation-${new Date().getTime()}.xlsx`);
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(url);
            },
            error: (err) => {
                console.error('Error downloading excel:', err);
                alert('Failed to download Excel file');
            }
        });
    };

    // XOL Treaty Definition Allocation download handler - Commented out for now
    // const handleDownloadXolAllocationExcel = () => {
    //     reinsuranceService.downloadXolTreatyDefinitionAllocationExcel().subscribe({
    //         next: (blob) => {
    //             const url = window.URL.createObjectURL(new Blob([blob]));
    //             const link = document.createElement('a');
    //             link.href = url;
    //             link.setAttribute('download', `xol-treaty-definition-allocation-${new Date().getTime()}.xlsx`);
    //             document.body.appendChild(link);
    //             link.click();
    //             link.remove();
    //             window.URL.revokeObjectURL(url);
    //         },
    //         error: (err) => {
    //             console.error('Error downloading excel:', err);
    //             alert('Failed to download Excel file');
    //         }
    //     });
    // };

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
            {/* Title and Download Button */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px'
            }}>
                <div style={{
                    fontSize: '28px',
                    fontWeight: '700',
                    color: '#212529',
                    letterSpacing: '-0.5px'
                }}>
                    Treaty Allocation
                </div>
                <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    onClick={handleDownloadExcel}
                    sx={{
                        backgroundColor: '#28a745',
                        '&:hover': { backgroundColor: '#218838' },
                        fontWeight: 600
                    }}
                >
                    Calculation
                </Button>
            </div>

            {/* Filter Dropdowns */}
            <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <FormControl size="small" sx={{ minWidth: 180 }}>
                    <InputLabel>Period</InputLabel>
                    <Select
                        value={period}
                        label="Period"
                        onChange={(e) => setPeriod(e.target.value)}
                    >
                        <MenuItem value="2025-2026">2025-2026</MenuItem>
                        <MenuItem value="2024-2025">2024-2025</MenuItem>
                        <MenuItem value="2023-2024">2023-2024</MenuItem>
                    </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 180 }}>
                    <InputLabel>Product code</InputLabel>
                    <Select
                        value={productCode}
                        label="Product code"
                        onChange={(e) => setProductCode(e.target.value)}
                    >
                        <MenuItem value="FIRE01">FIRE01</MenuItem>
                    </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 180 }}>
                    <InputLabel>Risk Grade</InputLabel>
                    <Select
                        value={riskGrade}
                        label="Risk Grade"
                        onChange={(e) => setRiskGrade(e.target.value)}
                    >
                        <MenuItem value="1">1</MenuItem>
                    </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 180 }}>
                    <InputLabel>Accounting LOB</InputLabel>
                    <Select
                        value={accountingLOB}
                        label="Accounting LOB"
                        onChange={(e) => setAccountingLOB(e.target.value)}
                    >
                        <MenuItem value="Fire">Fire</MenuItem>
                    </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 180 }}>
                    <InputLabel>Risk Category</InputLabel>
                    <Select
                        value={riskCategory}
                        label="Risk Category"
                        onChange={(e) => setRiskCategory(e.target.value)}
                    >
                        <MenuItem value="Fire">Fire</MenuItem>
                    </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 180 }}>
                    <InputLabel>Type</InputLabel>
                    <Select
                        value={type}
                        label="Type"
                        onChange={(e) => setType(e.target.value)}
                    >
                        <MenuItem value="Per Risk">Per Risk</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <Card>
                <CardContent>
                    <TableContainer component={Paper} elevation={0}>
                        <Table sx={{ minWidth: 650 }}>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                    <TableCell sx={{ fontWeight: 600, fontSize: '14px' }}>Treaty Type</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 600, fontSize: '14px' }}>Allocation RISI</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 600, fontSize: '14px' }}>Allocation %</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 600, fontSize: '14px' }}>Allocation Premium</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 600, fontSize: '14px' }}>RI Commission</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data.map((row) => (
                                    <TableRow
                                        key={row.treatyTypeId}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {row.treatyType}
                                        </TableCell>
                                        <TableCell align="right">{formatCurrency(row.allocationRisi)}</TableCell>
                                        <TableCell align="right">{formatPercentage(row.allocationPct)}</TableCell>
                                        <TableCell align="right">{formatCurrency(row.allocationPremium)}</TableCell>
                                        <TableCell align="right">{formatCurrency(row.riCommission)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>

            {/* Surplus Participant Allocation Section */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '48px',
                marginBottom: '24px'
            }}>
                <div style={{
                    fontSize: '28px',
                    fontWeight: '700',
                    color: '#212529',
                    letterSpacing: '-0.5px'
                }}>
                    Surplus Participant Allocation
                </div>
                <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    onClick={handleDownloadSurplusExcel}
                    sx={{
                        backgroundColor: '#28a745',
                        '&:hover': { backgroundColor: '#218838' },
                        fontWeight: 600
                    }}
                >
                    Calculation
                </Button>
            </div>

            {surplusLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
                    <CircularProgress />
                </div>
            ) : surplusError ? (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {surplusError}
                </Alert>
            ) : surplusData.length === 0 ? (
                <Card sx={{ p: 4, textAlign: 'center' }}>
                    <Alert severity="info">No surplus participant allocation data found</Alert>
                </Card>
            ) : (
                <Card sx={{ overflow: 'hidden' }}>
                    <TableContainer component={Paper} elevation={0}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                                    <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem', width: '20%' }}>
                                        Surplus Participants
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem', width: '20%' }}>

                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem', width: '15%', textAlign: 'center' }}>
                                        Share %
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem', width: '22.5%', textAlign: 'right' }}>
                                        Allocation -RISI
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem', width: '22.5%', textAlign: 'right' }}>
                                        Allocation Premium
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {surplusData.map((row: any, index: number) => {
                                    const isParent = row.participantLevel === 'PARENT';
                                    const isChild = row.participantLevel === 'CHILD';
                                    const isBroker = row.participatingType === 'B';
                                    const isReinsurer = row.participatingType === 'R';

                                    return (
                                        <TableRow
                                            key={index}
                                            sx={{
                                                backgroundColor: isChild ? '#f9f9f9' : (isBroker ? '#fff8f0' : '#f0f8ff'),
                                                '&:hover': {
                                                    backgroundColor: isChild ? '#f0f0f0' : (isBroker ? '#fff3e0' : '#e3f2fd')
                                                }
                                            }}
                                        >
                                            {isChild ? (
                                                <>
                                                    <TableCell sx={{ borderRight: '1px solid #e0e0e0', py: 1.5 }}></TableCell>
                                                    <TableCell sx={{ borderRight: '1px solid #e0e0e0', py: 1.5, pl: 2 }}>
                                                        <span style={{ fontSize: '0.875rem', fontWeight: 400, color: '#666' }}>
                                                            {row.participantName || '-'}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell sx={{ borderRight: '1px solid #e0e0e0', textAlign: 'center', py: 1.5 }}>
                                                        <span style={{ fontSize: '0.875rem' }}>
                                                            {row.sharePct !== null && row.sharePct !== undefined ? formatPercentage(row.sharePct) : '-'}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell sx={{ borderRight: '1px solid #e0e0e0', textAlign: 'right', py: 1.5 }}>
                                                        <span style={{ fontSize: '0.875rem' }}>
                                                            {row.allocatedRisi !== null && row.allocatedRisi !== undefined ? formatCurrency(row.allocatedRisi) : '-'}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell sx={{ textAlign: 'right', py: 1.5 }}>
                                                        <span style={{ fontSize: '0.875rem' }}>
                                                            {row.allocatedPremium !== null && row.allocatedPremium !== undefined ? formatCurrency(row.allocatedPremium) : '-'}
                                                        </span>
                                                    </TableCell>
                                                </>
                                            ) : (
                                                <>
                                                    <TableCell sx={{ borderRight: '1px solid #e0e0e0', py: 1.5, pl: 2 }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '4px', backgroundColor: isBroker ? '#ed6c02' : '#1976d2', color: 'white', fontWeight: 600, fontSize: '0.75rem' }}>
                                                                {row.participatingType || 'R'}
                                                            </span>
                                                            <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#212529' }}>
                                                                {row.participantName || '-'}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell sx={{ borderRight: '1px solid #e0e0e0', py: 1.5 }}></TableCell>
                                                    <TableCell sx={{ borderRight: '1px solid #e0e0e0', textAlign: 'center', py: 1.5 }}>
                                                        <span style={{ fontSize: '0.875rem' }}>
                                                            {row.sharePct !== null && row.sharePct !== undefined ? formatPercentage(row.sharePct) : '-'}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell sx={{ borderRight: '1px solid #e0e0e0', textAlign: 'right', py: 1.5 }}>
                                                        <span style={{ fontSize: '0.875rem' }}>
                                                            {row.allocatedRisi !== null && row.allocatedRisi !== undefined ? formatCurrency(row.allocatedRisi) : '-'}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell sx={{ textAlign: 'right', py: 1.5 }}>
                                                        <span style={{ fontSize: '0.875rem' }}>
                                                            {row.allocatedPremium !== null && row.allocatedPremium !== undefined ? formatCurrency(row.allocatedPremium) : '-'}
                                                        </span>
                                                    </TableCell>
                                                </>
                                            )}
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Card>
            )}

            {/* Proportional Allocations on Claim Section */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '48px',
                marginBottom: '24px'
            }}>
                <div style={{
                    fontSize: '28px',
                    fontWeight: '700',
                    color: '#212529',
                    letterSpacing: '-0.5px'
                }}>
                    Proportional Allocations Done on Claim
                </div>
                <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    onClick={handleDownloadProportionalExcel}
                    sx={{
                        backgroundColor: '#28a745',
                        '&:hover': { backgroundColor: '#218838' },
                        fontWeight: 600
                    }}
                >
                    Calculation
                </Button>
            </div>

            {proportionalLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
                    <CircularProgress />
                </div>
            ) : proportionalError ? (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {proportionalError}
                </Alert>
            ) : proportionalData.length === 0 ? (
                <Card sx={{ p: 4, textAlign: 'center' }}>
                    <Alert severity="info">No proportional allocations on claim data found</Alert>
                </Card>
            ) : (
                <Card>
                    <CardContent>
                        <TableContainer component={Paper} elevation={0}>
                            <Table sx={{ minWidth: 650 }}>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '14px' }}>Treaty Type</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 600, fontSize: '14px' }}>RI Claim Recovery-Incurred Claim</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 600, fontSize: '14px' }}>RI Claim Recovery-Outstanding Claim</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 600, fontSize: '14px' }}>RI Claim Recovery-Paid Claims</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 600, fontSize: '14px' }}>Recovery %</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {proportionalData.map((row: any, index: number) => (
                                        <TableRow
                                            key={index}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">
                                                {row.treatyType || '-'}
                                            </TableCell>
                                            <TableCell align="right">
                                                {row.riClaimRecoveryIncurredClaim !== null && row.riClaimRecoveryIncurredClaim !== undefined
                                                    ? formatCurrency(row.riClaimRecoveryIncurredClaim)
                                                    : '-'}
                                            </TableCell>
                                            <TableCell align="right">
                                                {row.riClaimRecoveryOutstandingClaim !== null && row.riClaimRecoveryOutstandingClaim !== undefined
                                                    ? formatCurrency(row.riClaimRecoveryOutstandingClaim)
                                                    : '-'}
                                            </TableCell>
                                            <TableCell align="right">
                                                {row.riClaimRecoveryPaidClaims !== null && row.riClaimRecoveryPaidClaims !== undefined
                                                    ? formatCurrency(row.riClaimRecoveryPaidClaims)
                                                    : '-'}
                                            </TableCell>
                                            <TableCell align="right">
                                                {row.recoveryPct !== null && row.recoveryPct !== undefined
                                                    ? `${row.recoveryPct.toFixed(2)}%`
                                                    : '-'}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>
            )}

            {/* Calculation Result at Participant Level for Surplus Treaty-Paid Claims Section */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '48px',
                marginBottom: '24px'
            }}>
                <div style={{
                    fontSize: '28px',
                    fontWeight: '700',
                    color: '#212529',
                    letterSpacing: '-0.5px'
                }}>
                    Participant Level for Surplus Treaty-Paid Claims
                </div>
                <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    onClick={handleDownloadPaidClaimsExcel}
                    sx={{
                        backgroundColor: '#28a745',
                        '&:hover': { backgroundColor: '#218838' },
                        fontWeight: 600
                    }}
                >
                    Calculation
                </Button>
            </div>

            {paidClaimsLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
                    <CircularProgress />
                </div>
            ) : paidClaimsError ? (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {paidClaimsError}
                </Alert>
            ) : paidClaimsData.length === 0 ? (
                <Card sx={{ p: 4, textAlign: 'center' }}>
                    <Alert severity="info">No paid claims allocation data found</Alert>
                </Card>
            ) : (
                <Card sx={{ overflow: 'hidden' }}>
                    <TableContainer component={Paper} elevation={0}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                                    <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem', width: '40%' }}>
                                        Surplus Participants
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem', width: '20%' }}>

                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem', width: '40%', textAlign: 'right' }}>
                                        RI Claim Recovery-Paid Claim
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paidClaimsData.map((row: any, index: number) => {
                                    const isChild = row.participantLevel === 'CHILD';
                                    const isBroker = row.participatingType === 'B';

                                    return (
                                        <TableRow
                                            key={index}
                                            sx={{
                                                backgroundColor: isChild ? '#f9f9f9' : (isBroker ? '#fff8f0' : '#f0f8ff'),
                                                '&:hover': {
                                                    backgroundColor: isChild ? '#f0f0f0' : (isBroker ? '#fff3e0' : '#e3f2fd')
                                                }
                                            }}
                                        >
                                            {isChild ? (
                                                <>
                                                    <TableCell sx={{ borderRight: '1px solid #e0e0e0', py: 1.5 }}></TableCell>
                                                    <TableCell sx={{ borderRight: '1px solid #e0e0e0', py: 1.5, pl: 2 }}>
                                                        <span style={{ fontSize: '0.875rem', fontWeight: 400, color: '#666' }}>
                                                            {row.surplusParticipants || '-'}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell sx={{ textAlign: 'right', py: 1.5 }}>
                                                        <span style={{ fontSize: '0.875rem' }}>
                                                            {row.riClaimRecoveryPaidClaim !== null && row.riClaimRecoveryPaidClaim !== undefined
                                                                ? formatCurrency(row.riClaimRecoveryPaidClaim)
                                                                : '-'}
                                                        </span>
                                                    </TableCell>
                                                </>
                                            ) : (
                                                <>
                                                    <TableCell sx={{ borderRight: '1px solid #e0e0e0', py: 1.5, pl: 2 }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '4px', backgroundColor: isBroker ? '#ed6c02' : '#1976d2', color: 'white', fontWeight: 600, fontSize: '0.75rem' }}>
                                                                {row.participatingType || 'R'}
                                                            </span>
                                                            <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#212529' }}>
                                                                {row.surplusParticipants || '-'}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell sx={{ borderRight: '1px solid #e0e0e0', py: 1.5 }}></TableCell>
                                                    <TableCell sx={{ textAlign: 'right', py: 1.5 }}>
                                                        <span style={{ fontSize: '0.875rem' }}>
                                                            {row.riClaimRecoveryPaidClaim !== null && row.riClaimRecoveryPaidClaim !== undefined
                                                                ? formatCurrency(row.riClaimRecoveryPaidClaim)
                                                                : '-'}
                                                        </span>
                                                    </TableCell>
                                                </>
                                            )}
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Card>
            )}

            {/* Calculation Result at Participant Level for Surplus Treaty-Outstanding Claims Section */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '48px',
                marginBottom: '24px'
            }}>
                <div style={{
                    fontSize: '28px',
                    fontWeight: '700',
                    color: '#212529',
                    letterSpacing: '-0.5px'
                }}>
                    Participant Level for Surplus Treaty-Outstanding Claims
                </div>
                <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    onClick={handleDownloadOutstandingClaimsExcel}
                    sx={{
                        backgroundColor: '#28a745',
                        '&:hover': { backgroundColor: '#218838' },
                        fontWeight: 600
                    }}
                >
                    Calculation
                </Button>
            </div>

            {outstandingClaimsLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
                    <CircularProgress />
                </div>
            ) : outstandingClaimsError ? (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {outstandingClaimsError}
                </Alert>
            ) : outstandingClaimsData.length === 0 ? (
                <Card sx={{ p: 4, textAlign: 'center' }}>
                    <Alert severity="info">No outstanding claims allocation data found</Alert>
                </Card>
            ) : (
                <Card sx={{ overflow: 'hidden' }}>
                    <TableContainer component={Paper} elevation={0}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                                    <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem', width: '40%' }}>
                                        Surplus Participants
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem', width: '20%' }}>

                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem', width: '40%', textAlign: 'right' }}>
                                        RI Claim Recovery-Outstanding Claim
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {outstandingClaimsData.map((row: any, index: number) => {
                                    const isChild = row.participantLevel === 'CHILD';
                                    const isBroker = row.participatingType === 'B';

                                    return (
                                        <TableRow
                                            key={index}
                                            sx={{
                                                backgroundColor: isChild ? '#f9f9f9' : (isBroker ? '#fff8f0' : '#f0f8ff'),
                                                '&:hover': {
                                                    backgroundColor: isChild ? '#f0f0f0' : (isBroker ? '#fff3e0' : '#e3f2fd')
                                                }
                                            }}
                                        >
                                            {isChild ? (
                                                <>
                                                    <TableCell sx={{ borderRight: '1px solid #e0e0e0', py: 1.5 }}></TableCell>
                                                    <TableCell sx={{ borderRight: '1px solid #e0e0e0', py: 1.5, pl: 2 }}>
                                                        <span style={{ fontSize: '0.875rem', fontWeight: 400, color: '#666' }}>
                                                            {row.surplusParticipants || '-'}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell sx={{ textAlign: 'right', py: 1.5 }}>
                                                        <span style={{ fontSize: '0.875rem' }}>
                                                            {row.riClaimRecoveryOutstandingClaim !== null && row.riClaimRecoveryOutstandingClaim !== undefined
                                                                ? formatCurrency(row.riClaimRecoveryOutstandingClaim)
                                                                : '-'}
                                                        </span>
                                                    </TableCell>
                                                </>
                                            ) : (
                                                <>
                                                    <TableCell sx={{ borderRight: '1px solid #e0e0e0', py: 1.5, pl: 2 }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '4px', backgroundColor: isBroker ? '#ed6c02' : '#1976d2', color: 'white', fontWeight: 600, fontSize: '0.75rem' }}>
                                                                {row.participatingType || 'R'}
                                                            </span>
                                                            <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#212529' }}>
                                                                {row.surplusParticipants || '-'}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell sx={{ borderRight: '1px solid #e0e0e0', py: 1.5 }}></TableCell>
                                                    <TableCell sx={{ textAlign: 'right', py: 1.5 }}>
                                                        <span style={{ fontSize: '0.875rem' }}>
                                                            {row.riClaimRecoveryOutstandingClaim !== null && row.riClaimRecoveryOutstandingClaim !== undefined
                                                                ? formatCurrency(row.riClaimRecoveryOutstandingClaim)
                                                                : '-'}
                                                        </span>
                                                    </TableCell>
                                                </>
                                            )}
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Card>
            )}

            {/* XOL Treaty Definition Allocation Section - Commented out for now */}
            {/* <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '48px',
                marginBottom: '24px'
            }}>
                <div style={{
                    fontSize: '28px',
                    fontWeight: '700',
                    color: '#212529',
                    letterSpacing: '-0.5px'
                }}>
                    XOL Treaty Definition Allocation
                </div>
                <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    onClick={handleDownloadXolAllocationExcel}
                    sx={{
                        backgroundColor: '#28a745',
                        '&:hover': { backgroundColor: '#218838' },
                        fontWeight: 600
                    }}
                >
                    Calculation
                </Button>
            </div>

            {xolAllocationLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
                    <CircularProgress />
                </div>
            ) : xolAllocationError ? (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {xolAllocationError}
                </Alert>
            ) : xolAllocationData.length === 0 ? (
                <Card sx={{ p: 4, textAlign: 'center' }}>
                    <Alert severity="info">No XOL treaty definition allocation data found</Alert>
                </Card>
            ) : (
                <Card>
                    <CardContent>
                        <TableContainer component={Paper} elevation={0} sx={{ maxHeight: '600px', overflow: 'auto' }}>
                            <Table stickyHeader sx={{ minWidth: 650 }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '14px', backgroundColor: '#f5f5f5', minWidth: 100 }}>Layer Number</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '14px', backgroundColor: '#f5f5f5', minWidth: 150 }}>XOL Treaty</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 600, fontSize: '14px', backgroundColor: '#f5f5f5', minWidth: 150 }}>Loss Deduction</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 600, fontSize: '14px', backgroundColor: '#f5f5f5', minWidth: 120 }}>Loss Limit</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 600, fontSize: '14px', backgroundColor: '#f5f5f5', minWidth: 120 }}>Capacity</TableCell>
                                        {Array.from({ length: maxXolParticipants }, (_, i) => (
                                            <TableCell key={`participant-${i}`} sx={{ fontWeight: 600, fontSize: '14px', backgroundColor: '#f5f5f5', minWidth: 150 }}>
                                                Participant {i + 1}
                                            </TableCell>
                                        ))}
                                        <TableCell align="right" sx={{ fontWeight: 600, fontSize: '14px', backgroundColor: '#f5f5f5', minWidth: 180 }}>XOL Incurred Claim Recovery</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 600, fontSize: '14px', backgroundColor: '#f5f5f5', minWidth: 120 }}>Paid Control</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 600, fontSize: '14px', backgroundColor: '#f5f5f5', minWidth: 120 }}>OS Control</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 600, fontSize: '14px', backgroundColor: '#f5f5f5', minWidth: 180 }}>XOL Claim Recovery Paid</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 600, fontSize: '14px', backgroundColor: '#f5f5f5', minWidth: 180 }}>XOL Claim Recovery OS</TableCell>
                                        {Array.from({ length: maxXolParticipants }, (_, i) => (
                                            <TableCell key={`recovery-participant-${i}`} align="right" sx={{ fontWeight: 600, fontSize: '14px', backgroundColor: '#f5f5f5', minWidth: 180 }}>
                                                Claim Recovery Participant {i + 1}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {xolAllocationData.map((row, index) => {
                                        const participants = getXolParticipants(row.xolPaticipantDTO);
                                        const recoveryParticipants = getXolParticipants(row.xolClaimRecoveryParticipants);
                                        return (
                                            <TableRow
                                                key={index}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row">
                                                    {row.layerNumber}
                                                </TableCell>
                                                <TableCell>{row.xolTreaty}</TableCell>
                                                <TableCell align="right">{formatCurrency(row.lossDeduction)}</TableCell>
                                                <TableCell align="right">{formatCurrency(row.lossLimit)}</TableCell>
                                                <TableCell align="right">{formatCurrency(row.capacity)}</TableCell>
                                                {Array.from({ length: maxXolParticipants }, (_, i) => (
                                                    <TableCell key={`participant-${i}`}>
                                                        {participants[i] || '-'}
                                                    </TableCell>
                                                ))}
                                                <TableCell align="right">{formatCurrency(row.xolIncurredClaimRecovery)}</TableCell>
                                                <TableCell align="right">{formatCurrency(row.paidControl)}</TableCell>
                                                <TableCell align="right">{formatCurrency(row.osControl)}</TableCell>
                                                <TableCell align="right">{formatCurrency(row.xolClaimRecoveryPaid)}</TableCell>
                                                <TableCell align="right">{formatCurrency(row.xolClaimRecoveryOS)}</TableCell>
                                                {Array.from({ length: maxXolParticipants }, (_, i) => (
                                                    <TableCell key={`recovery-participant-${i}`} align="right">
                                                        {recoveryParticipants[i] || '-'}
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
            )} */}
        </>
    );
}
