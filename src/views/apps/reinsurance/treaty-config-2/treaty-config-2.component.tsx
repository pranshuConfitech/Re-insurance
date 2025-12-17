'use client';
import React, { useState } from 'react';
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
    Paper,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    IconButton,
    Chip,
    LinearProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid
} from '@mui/material';
import {
    ArrowUpward,
    ArrowDownward,
    Add,
    Close,
    FiberManualRecord
} from '@mui/icons-material';

interface TreatyRow {
    id: string;
    priority: number;
    treatyCode: string;
    type: string;
    cession: string;
    quotaMax?: string;
    retention?: string;
    surplusCap?: string;
    calculatedCapacity: string;
}

interface Block {
    id: string;
    name: string;
    type: 'quota-share' | 'surplus-retention' | 'fac';
    active: boolean;
    treaties: TreatyRow[];
    totalCession?: number;
}

const TreatyConfig2Component = () => {

    const [allBlocks, setAllBlocks] = useState<Block[]>([
        {
            id: '1',
            name: 'Quota Share',
            type: 'quota-share',
            active: true,
            treaties: [
                {
                    id: 't1',
                    priority: 11,
                    treatyCode: 'T11',
                    type: 'Quota Share',
                    cession: '10%',
                    quotaMax: '300',
                    calculatedCapacity: '300'
                },
                {
                    id: 't2',
                    priority: 12,
                    treatyCode: 'T12',
                    type: 'Quota Share',
                    cession: '20%',
                    quotaMax: '500',
                    calculatedCapacity: '500'
                }
            ],
            totalCession: 30
        },
        {
            id: '2',
            name: 'Surplus & Retention',
            type: 'surplus-retention',
            active: true,
            treaties: [
                {
                    id: 't3',
                    priority: 21,
                    treatyCode: 'SBI Retention',
                    type: 'Retention',
                    cession: '',
                    retention: '25',
                    calculatedCapacity: '25'
                },
                {
                    id: 't4',
                    priority: 22,
                    treatyCode: 'T22',
                    type: 'Surplus',
                    cession: '',
                    surplusCap: '75',
                    calculatedCapacity: '75'
                }
            ]
        },
        {
            id: '5',
            name: 'FAC Automatic Balance',
            type: 'fac',
            active: true,
            treaties: [],
            totalCession: 0
        }
    ]);

    // Auto-filter blocks with 0 rows (FAC blocks are shown only in status bar, not in main list)
    const blocks = allBlocks.filter(block => block.treaties.length > 0 && block.type !== 'fac');

    const [newBlockDialog, setNewBlockDialog] = useState(false);
    const [newBlockName, setNewBlockName] = useState('');
    const [newBlockType, setNewBlockType] = useState<'quota-share' | 'surplus-retention' | 'fac'>('quota-share');
    const [addTreatyDialog, setAddTreatyDialog] = useState<{ open: boolean; blockId: string | null }>({
        open: false,
        blockId: null
    });
    const [newTreaty, setNewTreaty] = useState({
        treatyCode: '',
        type: '',
        cession: '',
        quotaMax: '',
        retention: '',
        surplusCap: ''
    });

    const treatyTypes = ['Quota Share', 'Surplus', 'Retention', 'FAC'];

    const calculateTotalCession = (treaties: TreatyRow[]): number => {
        return treaties.reduce((total, treaty) => {
            const cessionValue = parseFloat(treaty.cession.replace('%', '')) || 0;
            return total + cessionValue;
        }, 0);
    };

    const handleAddBlock = () => {
        if (newBlockName.trim()) {
            const newBlock: Block = {
                id: Date.now().toString(),
                name: newBlockName,
                type: newBlockType,
                active: true,
                treaties: [],
                totalCession: 0
            };
            setAllBlocks([...allBlocks, newBlock]);
            setNewBlockName('');
            setNewBlockDialog(false);
        }
    };

    const handleAddTreaty = (blockId: string) => {
        setAddTreatyDialog({ open: true, blockId });
        setNewTreaty({
            treatyCode: '',
            type: '',
            cession: '',
            quotaMax: '',
            retention: '',
            surplusCap: ''
        });
    };

    const handleSaveTreaty = () => {
        if (!addTreatyDialog.blockId) return;

        const block = allBlocks.find(b => b.id === addTreatyDialog.blockId);
        if (!block) return;

        const maxPriority = block.treaties.length > 0
            ? Math.max(...block.treaties.map(t => t.priority))
            : 0;

        const newTreatyRow: TreatyRow = {
            id: Date.now().toString(),
            priority: maxPriority + 1,
            treatyCode: newTreaty.treatyCode,
            type: newTreaty.type,
            cession: newTreaty.cession,
            quotaMax: newTreaty.quotaMax || undefined,
            retention: newTreaty.retention || undefined,
            surplusCap: newTreaty.surplusCap || undefined,
            calculatedCapacity: newTreaty.quotaMax || newTreaty.retention || newTreaty.surplusCap || '0'
        };

        const updatedBlocks = allBlocks.map(block =>
            block.id === addTreatyDialog.blockId
                ? {
                    ...block,
                    treaties: [...block.treaties, newTreatyRow],
                    totalCession: block.type === 'quota-share' ? calculateTotalCession([...block.treaties, newTreatyRow]) : undefined
                }
                : block
        );

        setAllBlocks(updatedBlocks);
        setAddTreatyDialog({ open: false, blockId: null });
    };

    const handleDeleteTreaty = (blockId: string, treatyId: string) => {
        const updatedBlocks = allBlocks.map(block =>
            block.id === blockId
                ? {
                    ...block,
                    treaties: block.treaties.filter(t => t.id !== treatyId),
                    totalCession: block.type === 'quota-share' ? calculateTotalCession(block.treaties.filter(t => t.id !== treatyId)) : undefined
                }
                : block
        );
        setAllBlocks(updatedBlocks);
    };

    const handleMovePriority = (blockId: string, treatyId: string, direction: 'up' | 'down') => {
        const block = allBlocks.find(b => b.id === blockId);
        if (!block) return;

        const treatyIndex = block.treaties.findIndex(t => t.id === treatyId);
        if (treatyIndex === -1) return;

        const newIndex = direction === 'up' ? treatyIndex - 1 : treatyIndex + 1;
        if (newIndex < 0 || newIndex >= block.treaties.length) return;

        const updatedTreaties = [...block.treaties];
        [updatedTreaties[treatyIndex], updatedTreaties[newIndex]] = [updatedTreaties[newIndex], updatedTreaties[treatyIndex]];

        // Update priorities
        updatedTreaties.forEach((treaty, index) => {
            treaty.priority = (block.treaties[0]?.priority || 0) + index;
        });

        const updatedBlocks = allBlocks.map(b =>
            b.id === blockId ? { ...b, treaties: updatedTreaties } : b
        );

        setAllBlocks(updatedBlocks);
    };

    const getBlockColumns = (blockType: string) => {
        switch (blockType) {
            case 'quota-share':
                return ['PRIORITY', 'TREATY CODE', 'TYPE', 'CESSION %', 'QUOTA MAX', 'RETENTION (GROSS)', 'CALCULATED CAPACITY'];
            case 'surplus-retention':
                return ['PRIORITY', 'TREATY CODE', 'TYPE', 'CESSION %', 'RETENTION', 'SURPLUS CAP', 'CALCULATED CAPACITY'];
            case 'fac':
                return ['PRIORITY', 'TREATY CODE', 'TYPE', 'CESSION %', 'CALCULATED CAPACITY'];
            default:
                return ['PRIORITY', 'TREATY CODE', 'TYPE', 'CESSION %', 'CALCULATED CAPACITY'];
        }
    };

    const getRiskPlacedPercentage = (): number => {
        const facBlock = allBlocks.find(b => b.type === 'fac');
        if (!facBlock) return 0;
        // For FAC blocks, calculate based on treaties
        return facBlock.treaties.length > 0 ? 100 : 0;
    };

    // Get or create FAC block for status bar
    const getFacBlock = (): Block => {
        let facBlock = allBlocks.find(b => b.type === 'fac');
        if (!facBlock) {
            facBlock = {
                id: '5',
                name: 'FAC Automatic Balance',
                type: 'fac',
                active: true,
                treaties: [],
                totalCession: 0
            };
        }
        return facBlock;
    };

    return (
        <Box sx={{
            p: 3,
            backgroundColor: '#ffffff',
            minHeight: '100vh',
            position: 'relative',
            width: '100%',
            boxSizing: 'border-box'
        }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#212529', mb: 1, fontSize: '28px' }}>
                    Treaty Definition Master
                </Typography>
                <Typography variant="body2" sx={{ color: '#6c757d', fontSize: '14px' }}>
                    Configure cession logic, retention, and priorities.
                </Typography>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 3 }}>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => setNewBlockDialog(true)}
                    sx={{
                        backgroundColor: '#28a745',
                        '&:hover': { backgroundColor: '#218838' },
                        textTransform: 'none',
                        borderRadius: '4px 4px 0px 0px',
                        fontSize: '14px',
                        px: 2,
                        py: 1
                    }}
                >
                    + New Block
                </Button>
            </Box>

            {/* Blocks */}
            {blocks.map((block) => (
                <Card key={block.id} sx={{ mb: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.12)', borderRadius: '4px' }}>
                    <CardContent sx={{ p: 3 }}>
                        {/* Block Header */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <FiberManualRecord
                                    sx={{
                                        color: block.active ? '#28a745' : '#dc3545',
                                        fontSize: 10
                                    }}
                                />
                                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '16px' }}>
                                    Block {block.id}: {block.name}
                                </Typography>
                            </Box>
                            {block.treaties.length > 0 && block.type === 'quota-share' && (
                                <Chip
                                    label={`Total Cession: ${block.totalCession || 0}%`}
                                    sx={{
                                        fontWeight: 600,
                                        backgroundColor: '#e3f2fd',
                                        color: '#1976d2',
                                        fontSize: '12px',
                                        height: '28px'
                                    }}
                                />
                            )}
                        </Box>

                        {/* Table */}
                        {block.treaties.length > 0 ? (
                            <TableContainer component={Paper} variant="outlined" sx={{ border: '1px solid #e0e0e0' }}>
                                <Table>
                                    <TableHead>
                                        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                            {getBlockColumns(block.type).map((col) => (
                                                <TableCell
                                                    key={col}
                                                    sx={{
                                                        fontWeight: 600,
                                                        fontSize: '12px',
                                                        textTransform: 'uppercase',
                                                        color: '#666',
                                                        borderBottom: '2px solid #e0e0e0',
                                                        py: 1.5
                                                    }}
                                                >
                                                    {col}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {block.treaties.map((treaty) => (
                                            <TableRow key={treaty.id} sx={{ '&:hover': { backgroundColor: '#fafafa' } }}>
                                                <TableCell sx={{ py: 1.5 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <TextField
                                                            size="small"
                                                            value={treaty.priority}
                                                            onChange={(e) => {
                                                                const newPriority = parseInt(e.target.value) || 0;
                                                                const updatedBlocks = allBlocks.map(b =>
                                                                    b.id === block.id
                                                                        ? {
                                                                            ...b,
                                                                            treaties: b.treaties.map(t =>
                                                                                t.id === treaty.id
                                                                                    ? { ...t, priority: newPriority }
                                                                                    : t
                                                                            )
                                                                        }
                                                                        : b
                                                                );
                                                                setAllBlocks(updatedBlocks);
                                                            }}
                                                            sx={{ width: 70 }}
                                                            type="number"
                                                            variant="outlined"
                                                            inputProps={{
                                                                style: {
                                                                    textAlign: 'center',
                                                                    fontSize: '14px',
                                                                    padding: '8px'
                                                                }
                                                            }}
                                                        />
                                                        <Box sx={{ display: 'flex', flexDirection: 'column', ml: 0.5 }}>
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleMovePriority(block.id, treaty.id, 'up')}
                                                                sx={{ p: 0, height: 14, width: 14 }}
                                                            >
                                                                <ArrowUpward sx={{ fontSize: 12 }} />
                                                            </IconButton>
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleMovePriority(block.id, treaty.id, 'down')}
                                                                sx={{ p: 0, height: 14, width: 14 }}
                                                            >
                                                                <ArrowDownward sx={{ fontSize: 12 }} />
                                                            </IconButton>
                                                        </Box>
                                                    </Box>
                                                </TableCell>
                                                <TableCell sx={{ fontSize: '14px', py: 1.5 }}>{treaty.treatyCode}</TableCell>
                                                <TableCell sx={{ py: 1.5 }}>
                                                    <FormControl size="small" sx={{ minWidth: 140 }}>
                                                        <Select
                                                            value={treaty.type}
                                                            sx={{ fontSize: '14px', height: '32px' }}
                                                        >
                                                            {treatyTypes.map((type) => (
                                                                <MenuItem key={type} value={type}>
                                                                    {type}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </TableCell>
                                                <TableCell sx={{ py: 1.5 }}>
                                                    <TextField
                                                        size="small"
                                                        value={treaty.cession}
                                                        sx={{ width: 80 }}
                                                        placeholder="%"
                                                        variant="outlined"
                                                    />
                                                </TableCell>
                                                {block.type === 'quota-share' && (
                                                    <>
                                                        <TableCell sx={{ py: 1.5 }}>
                                                            <TextField
                                                                size="small"
                                                                value={treaty.quotaMax || ''}
                                                                sx={{ width: 100 }}
                                                                variant="outlined"
                                                            />
                                                        </TableCell>
                                                        <TableCell sx={{ fontSize: '14px', py: 1.5 }}>-</TableCell>
                                                    </>
                                                )}
                                                {block.type === 'surplus-retention' && (
                                                    <>
                                                        <TableCell sx={{ py: 1.5 }}>
                                                            <TextField
                                                                size="small"
                                                                value={treaty.retention || ''}
                                                                sx={{ width: 100 }}
                                                                variant="outlined"
                                                            />
                                                        </TableCell>
                                                        <TableCell sx={{ py: 1.5 }}>
                                                            <TextField
                                                                size="small"
                                                                value={treaty.surplusCap || ''}
                                                                sx={{ width: 100 }}
                                                                variant="outlined"
                                                            />
                                                        </TableCell>
                                                    </>
                                                )}
                                                <TableCell sx={{ py: 1.5 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Typography sx={{ fontSize: '14px' }}>
                                                            {treaty.calculatedCapacity}
                                                        </Typography>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleDeleteTreaty(block.id, treaty.id)}
                                                            sx={{ color: '#dc3545', p: 0.5 }}
                                                        >
                                                            <Close sx={{ fontSize: 16 }} />
                                                        </IconButton>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        ) : null}

                        {/* Add Treaty Link */}
                        {block.type !== 'fac' && (
                            <Button
                                startIcon={<Add />}
                                onClick={() => handleAddTreaty(block.id)}
                                sx={{
                                    mt: 2,
                                    textTransform: 'none',
                                    color: '#28a745',
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    '&:hover': { backgroundColor: 'rgba(40, 167, 69, 0.1)' }
                                }}
                            >
                                + Add Treaty to Block {block.id}
                            </Button>
                        )}
                    </CardContent>
                </Card>
            ))}

            {/* Status Bar at Bottom of Content - FAC Automatic Balance */}
            {(() => {
                const facBlock = getFacBlock();
                const riskPercentage = facBlock.treaties.length > 0 ? 100 : 0;
                return (
                    <Box
                        sx={{
                            mt: 3,
                            backgroundColor: '#ffffff',
                            borderTop: '1px solid #e0e0e0',
                            boxShadow: '0 -2px 8px rgba(0,0,0,0.08)',
                            overflow: 'hidden',
                            width: '100%',
                            boxSizing: 'border-box',
                            p: '1rem' // 1rem padding for FAC Automatic Balance box
                        }}
                    >
                        <Box sx={{
                            width: '100%',
                            maxWidth: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: { xs: 0.5, sm: 1 },
                            overflow: 'hidden',
                            boxSizing: 'border-box',
                            minWidth: 0
                        }}>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 600,
                                    fontSize: { xs: '14px', sm: '16px' },
                                    color: '#212529',
                                    flexShrink: 1,
                                    minWidth: 0,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    maxWidth: { xs: '150px', sm: '200px', md: '250px' }
                                }}
                            >
                                Block {facBlock.id}: {facBlock.name}
                            </Typography>
                            <Box sx={{
                                flex: '1 1 0%',
                                minWidth: 0,
                                maxWidth: { xs: '150px', sm: '250px', md: '350px' },
                                mx: { xs: 0.5, sm: 1 },
                                flexShrink: 1,
                                overflow: 'hidden'
                            }}>
                                <LinearProgress
                                    variant="determinate"
                                    value={riskPercentage}
                                    sx={{
                                        height: 10,
                                        borderRadius: 5,
                                        backgroundColor: '#e0e0e0',
                                        width: '100%',
                                        '& .MuiLinearProgress-bar': {
                                            backgroundColor: riskPercentage === 100 ? '#dc3545' : '#28a745',
                                            borderRadius: 5
                                        }
                                    }}
                                />
                            </Box>
                            <Typography
                                variant="body2"
                                sx={{
                                    fontWeight: 600,
                                    fontSize: { xs: '12px', sm: '14px' },
                                    color: '#212529',
                                    flexShrink: 0,
                                    whiteSpace: 'nowrap',
                                    ml: 'auto'
                                }}
                            >
                                {riskPercentage}% Risk Placed
                            </Typography>
                        </Box>
                    </Box>
                );
            })()}

            {/* New Block Dialog */}
            <Dialog open={newBlockDialog} onClose={() => setNewBlockDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Create New Block</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Block Name"
                                value={newBlockName}
                                onChange={(e) => setNewBlockName(e.target.value)}
                                placeholder="e.g., Quota Share, Surplus & Retention"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Block Type</InputLabel>
                                <Select
                                    value={newBlockType}
                                    onChange={(e) => setNewBlockType(e.target.value as any)}
                                    label="Block Type"
                                >
                                    <MenuItem value="quota-share">Quota Share</MenuItem>
                                    <MenuItem value="surplus-retention">Surplus & Retention</MenuItem>
                                    <MenuItem value="fac">FAC Automatic Balance</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setNewBlockDialog(false)}>Cancel</Button>
                    <Button onClick={handleAddBlock} variant="contained" color="primary">
                        Create
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Add Treaty Dialog */}
            <Dialog
                open={addTreatyDialog.open}
                onClose={() => setAddTreatyDialog({ open: false, blockId: null })}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Add Treaty to Block</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Treaty Code"
                                value={newTreaty.treatyCode}
                                onChange={(e) => setNewTreaty({ ...newTreaty, treatyCode: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Type</InputLabel>
                                <Select
                                    value={newTreaty.type}
                                    onChange={(e) => setNewTreaty({ ...newTreaty, type: e.target.value })}
                                    label="Type"
                                >
                                    {treatyTypes.map((type) => (
                                        <MenuItem key={type} value={type}>
                                            {type}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Cession %"
                                value={newTreaty.cession}
                                onChange={(e) => setNewTreaty({ ...newTreaty, cession: e.target.value })}
                                placeholder="e.g., 10%"
                            />
                        </Grid>
                        {allBlocks.find(b => b.id === addTreatyDialog.blockId)?.type === 'quota-share' && (
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Quota Max"
                                    value={newTreaty.quotaMax}
                                    onChange={(e) => setNewTreaty({ ...newTreaty, quotaMax: e.target.value })}
                                />
                            </Grid>
                        )}
                        {allBlocks.find(b => b.id === addTreatyDialog.blockId)?.type === 'surplus-retention' && (
                            <>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="Retention"
                                        value={newTreaty.retention}
                                        onChange={(e) => setNewTreaty({ ...newTreaty, retention: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="Surplus Cap"
                                        value={newTreaty.surplusCap}
                                        onChange={(e) => setNewTreaty({ ...newTreaty, surplusCap: e.target.value })}
                                    />
                                </Grid>
                            </>
                        )}
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAddTreatyDialog({ open: false, blockId: null })}>Cancel</Button>
                    <Button onClick={handleSaveTreaty} variant="contained" color="primary">
                        Add Treaty
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default TreatyConfig2Component;

