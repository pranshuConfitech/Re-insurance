'use client';
import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box, Typography, Button, Card, CardContent, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, TextField, FormControl,
  InputLabel, Select, MenuItem, IconButton, Chip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import { Toast } from 'primereact/toast';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ReinsuranceService } from '@/services/remote-api/api/reinsurance-services/reinsurance.service';

interface TreatyRow {
  id: string;
  treatyCode: string;
  priorityOrder: string;
  treatyType: string;
  cessionRatePercent: string;
  quotaMaxCapacity: string;
  retentionAmount: string;
  surplusCapacity: string;
}

interface Block {
  id: string;
  blockNumber: number;
  blockName: string;
  facultative: boolean;
  color: string;
  treaties: TreatyRow[];
}

const TreatyConfig3FormComponent = () => {
  const router = useRouter();
  const toast: any = useRef(null);
  const reinsuranceService = new ReinsuranceService();

  // Form states
  const [treatyProgramName, setTreatyProgramName] = useState('');
  const [periodFrom, setPeriodFrom] = useState<Date | null>(null);
  const [periodTo, setPeriodTo] = useState<Date | null>(null);
  const [productCode, setProductCode] = useState('FIRE01');
  const [riskGrade, setRiskGrade] = useState('1');
  const [accountingLOB, setAccountingLOB] = useState('Fire');
  const [riskCategory, setRiskCategory] = useState('Fire');
  const [riskType, setRiskType] = useState('Per Risk');
  const [currencyCode, setCurrencyCode] = useState('INR');

  // Initialize with 2 default blocks, each with 2 empty treaties
  const createEmptyTreaty = (): TreatyRow => ({
    id: Date.now().toString() + Math.random(),
    treatyCode: '',
    priorityOrder: '',
    treatyType: '',
    cessionRatePercent: '',
    quotaMaxCapacity: '',
    retentionAmount: '',
    surplusCapacity: ''
  });

  const [blocks, setBlocks] = useState<Block[]>([
    {
      id: '1',
      blockNumber: 1,
      blockName: 'Block 1',
      facultative: false,
      color: '#28a745', // Green
      treaties: [createEmptyTreaty(), createEmptyTreaty()]
    },
    {
      id: '2',
      blockNumber: 2,
      blockName: 'Block 2',
      facultative: false,
      color: '#007bff', // Blue
      treaties: [createEmptyTreaty(), createEmptyTreaty()]
    }
  ]);

  const treatyTypes = ['QUOTA', 'SURPLUS', 'RETENTION', 'FAC'];

  const handleBack = () => {
    router.push('/reinsurance/treaty-config-3');
  };

  const handleAddBlock = () => {
    const newBlockNumber = blocks.length + 1;
    const colorPalette = ['#28a745', '#007bff', '#fd7e14', '#6f42c1', '#20c997', '#e83e8c', '#17a2b8', '#ffc107'];
    const colorIndex = (newBlockNumber - 1) % colorPalette.length;

    const newBlock: Block = {
      id: Date.now().toString(),
      blockNumber: newBlockNumber,
      blockName: `Block ${newBlockNumber}`,
      facultative: false,
      color: colorPalette[colorIndex],
      treaties: []
    };
    setBlocks([...blocks, newBlock]);
  };

  const handleAddTreaty = (blockId: string) => {
    const newTreaty = createEmptyTreaty();

    setBlocks(blocks.map(b =>
      b.id === blockId ? { ...b, treaties: [...b.treaties, newTreaty] } : b
    ));
  };

  const handleDeleteTreaty = (blockId: string, treatyId: string) => {
    setBlocks(blocks.map(b =>
      b.id === blockId ? { ...b, treaties: b.treaties.filter(t => t.id !== treatyId) } : b
    ));
  };

  const handleTreatyChange = (blockId: string, treatyId: string, field: keyof TreatyRow, value: any) => {
    setBlocks(blocks.map(b =>
      b.id === blockId
        ? { ...b, treaties: b.treaties.map(t => t.id === treatyId ? { ...t, [field]: value } : t) }
        : b
    ));
  };

  const handleBlockNameChange = (blockId: string, name: string) => {
    setBlocks(blocks.map(b => b.id === blockId ? { ...b, blockName: name } : b));
  };

  const handleFacultativeChange = (blockId: string, value: boolean) => {
    setBlocks(blocks.map(b => b.id === blockId ? { ...b, facultative: value } : b));
  };

  const handleSave = async () => {
    if (!treatyProgramName || !periodFrom || !periodTo) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill Treaty Program Name and Period dates',
        life: 3000
      });
      return;
    }

    const payload = {
      treatyProgramName,
      startDate: periodFrom.getTime(),
      endDate: periodTo.getTime(),
      productCode,
      riskGrade: parseInt(riskGrade),
      accountingLob: accountingLOB,
      riskCategory,
      riskType,
      currencyCode,
      status: 'DRAFT',
      blocks: blocks.map(block => ({
        blockNumber: block.blockNumber,
        blockName: block.blockName,
        facultative: block.facultative,
        treaties: block.treaties.map(treaty => ({
          treatyCode: treaty.treatyCode,
          priorityOrder: treaty.priorityOrder,
          treatyType: treaty.treatyType,
          cessionRatePercent: parseFloat(treaty.cessionRatePercent) || 0,
          quotaMaxCapacity: parseFloat(treaty.quotaMaxCapacity) || 0,
          retentionAmount: parseFloat(treaty.retentionAmount) || 0,
          surplusCapacity: parseFloat(treaty.surplusCapacity) || 0
        }))
      }))
    };

    reinsuranceService.saveTreatyDefinition(payload).subscribe({
      next: (response) => {
        toast.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Treaty configuration saved successfully',
          life: 3000
        });

        setTimeout(() => {
          router.push('/reinsurance/treaty-config-3');
        }, 1000);
      },
      error: (error) => {
        console.error('Error saving treaty config:', error);
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: error?.response?.data?.message || 'Failed to save treaty configuration',
          life: 3000
        });
      }
    });
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <Toast ref={toast} />

      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={handleBack} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#212529', fontSize: '28px' }}>
            Treaty Definition Master
          </Typography>
          <Typography variant="body2" sx={{ color: '#6c757d', fontSize: '14px' }}>
            Configure cession logic, retention, and priorities.
          </Typography>
        </Box>
      </Box>

      {/* Treaty Program Name */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="Treaty Program Name"
          value={treatyProgramName}
          onChange={(e) => setTreatyProgramName(e.target.value)}
          required
          sx={{ maxWidth: 600 }}
        />
      </Box>

      {/* Filter Dropdowns */}
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Product code</InputLabel>
            <Select value={productCode} label="Product code" onChange={(e) => setProductCode(e.target.value)}>
              <MenuItem value="FIRE01">FIRE01</MenuItem>
              <MenuItem value="PR-034">PR-034</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Risk Grade</InputLabel>
            <Select value={riskGrade} label="Risk Grade" onChange={(e) => setRiskGrade(e.target.value)}>
              <MenuItem value="1">1</MenuItem>
              <MenuItem value="2">2</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Accounting LOB</InputLabel>
            <Select value={accountingLOB} label="Accounting LOB" onChange={(e) => setAccountingLOB(e.target.value)}>
              <MenuItem value="Fire">Fire</MenuItem>
              <MenuItem value="Flood">Flood</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Risk Category</InputLabel>
            <Select value={riskCategory} label="Risk Category" onChange={(e) => setRiskCategory(e.target.value)}>
              <MenuItem value="Fire">Fire</MenuItem>
              <MenuItem value="Water">Water</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Risk Type</InputLabel>
            <Select value={riskType} label="Risk Type" onChange={(e) => setRiskType(e.target.value)}>
              <MenuItem value="Per Risk">Per Risk</MenuItem>
              <MenuItem value="mild">Mild</MenuItem>
            </Select>
          </FormControl>

          <DatePicker
            label="Period From"
            value={periodFrom}
            onChange={(newValue) => setPeriodFrom(newValue)}
            renderInput={(params: any) => <TextField {...params} size="small" sx={{ minWidth: 180 }} />}
          />

          <DatePicker
            label="Period To"
            value={periodTo}
            onChange={(newValue) => setPeriodTo(newValue)}
            renderInput={(params: any) => <TextField {...params} size="small" sx={{ minWidth: 180 }} />}
          />

          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Currency</InputLabel>
            <Select value={currencyCode} label="Currency" onChange={(e) => setCurrencyCode(e.target.value)}>
              <MenuItem value="INR">INR</MenuItem>
              <MenuItem value="USD">USD</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </LocalizationProvider>

      {/* New Block Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<LibraryAddIcon />}
          onClick={handleAddBlock}
          sx={{
            backgroundColor: '#5a67d8',
            textTransform: 'none',
            fontWeight: 600,
            boxShadow: '0 4px 6px rgba(90, 103, 216, 0.3)',
            '&:hover': { backgroundColor: '#4c51bf', boxShadow: '0 6px 10px rgba(90, 103, 216, 0.4)' }
          }}
        >
          New Block
        </Button>
      </Box>

      {/* Blocks */}
      {blocks.map((block) => (
        <Card key={block.id} sx={{
          mb: 3,
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          borderRadius: '12px',
          overflow: 'visible',
          border: `2px solid ${block.color}20`,
          transition: 'all 0.3s ease',
          '&:hover': { boxShadow: '0 4px 20px rgba(0,0,0,0.12)', transform: 'translateY(-2px)' }
        }}>
          <CardContent sx={{ p: 0 }}>
            {/* Block Header */}
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 2.5,
              background: `linear-gradient(135deg, ${block.color}08 0%, ${block.color}15 100%)`,
              borderBottom: `2px solid ${block.color}30`
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <FiberManualRecordIcon sx={{ color: block.color, fontSize: 14 }} />
                <TextField
                  size="small"
                  value={block.blockName}
                  onChange={(e) => handleBlockNameChange(block.id, e.target.value)}
                  placeholder="Block Name"
                  sx={{ minWidth: 200 }}
                />
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>Facultative</InputLabel>
                  <Select
                    value={block.facultative ? 'true' : 'false'}
                    label="Facultative"
                    onChange={(e) => handleFacultativeChange(block.id, e.target.value === 'true')}
                  >
                    <MenuItem value="true">Yes</MenuItem>
                    <MenuItem value="false">No</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>

            {/* Table - Same columns for all blocks */}
            {block.treaties.length > 0 && (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                      <TableCell sx={{ fontWeight: 600, fontSize: '12px', color: '#6c757d', textTransform: 'uppercase', py: 1.5 }}>Treaty Code</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: '12px', color: '#6c757d', textTransform: 'uppercase', py: 1.5 }}>Priority Order</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: '12px', color: '#6c757d', textTransform: 'uppercase', py: 1.5 }}>Treaty Type</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: '12px', color: '#6c757d', textTransform: 'uppercase', py: 1.5 }}>Cession Rate %</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: '12px', color: '#6c757d', textTransform: 'uppercase', py: 1.5 }}>Quota Max Capacity</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: '12px', color: '#6c757d', textTransform: 'uppercase', py: 1.5 }}>Retention Amount</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: '12px', color: '#6c757d', textTransform: 'uppercase', py: 1.5 }}>Surplus Capacity</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: '12px', color: '#6c757d', textTransform: 'uppercase', py: 1.5, width: 50 }}></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {block.treaties.map((treaty) => (
                      <TableRow key={treaty.id} sx={{ '&:hover': { backgroundColor: '#fafafa' } }}>
                        <TableCell sx={{ py: 1.5 }}>
                          <TextField
                            size="small"
                            value={treaty.treatyCode}
                            onChange={(e) => handleTreatyChange(block.id, treaty.id, 'treatyCode', e.target.value)}
                            placeholder="Treaty Code"
                            sx={{ minWidth: 120 }}
                          />
                        </TableCell>
                        <TableCell sx={{ py: 1.5 }}>
                          <TextField
                            size="small"
                            value={treaty.priorityOrder}
                            onChange={(e) => handleTreatyChange(block.id, treaty.id, 'priorityOrder', e.target.value)}
                            placeholder="Order"
                            sx={{ width: 80 }}
                          />
                        </TableCell>
                        <TableCell sx={{ py: 1.5 }}>
                          <FormControl size="small" sx={{ minWidth: 120 }}>
                            <Select
                              value={treaty.treatyType}
                              onChange={(e) => handleTreatyChange(block.id, treaty.id, 'treatyType', e.target.value)}
                              displayEmpty
                            >
                              <MenuItem value="">Select</MenuItem>
                              {treatyTypes.map((type) => (
                                <MenuItem key={type} value={type}>{type}</MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </TableCell>
                        <TableCell sx={{ py: 1.5 }}>
                          <TextField
                            size="small"
                            type="number"
                            value={treaty.cessionRatePercent}
                            onChange={(e) => handleTreatyChange(block.id, treaty.id, 'cessionRatePercent', e.target.value)}
                            placeholder="0"
                            sx={{ width: 80 }}
                          />
                        </TableCell>
                        <TableCell sx={{ py: 1.5 }}>
                          <TextField
                            size="small"
                            type="number"
                            value={treaty.quotaMaxCapacity}
                            onChange={(e) => handleTreatyChange(block.id, treaty.id, 'quotaMaxCapacity', e.target.value)}
                            placeholder="0"
                            sx={{ width: 100 }}
                          />
                        </TableCell>
                        <TableCell sx={{ py: 1.5 }}>
                          <TextField
                            size="small"
                            type="number"
                            value={treaty.retentionAmount}
                            onChange={(e) => handleTreatyChange(block.id, treaty.id, 'retentionAmount', e.target.value)}
                            placeholder="0"
                            sx={{ width: 100 }}
                          />
                        </TableCell>
                        <TableCell sx={{ py: 1.5 }}>
                          <TextField
                            size="small"
                            type="number"
                            value={treaty.surplusCapacity}
                            onChange={(e) => handleTreatyChange(block.id, treaty.id, 'surplusCapacity', e.target.value)}
                            placeholder="0"
                            sx={{ width: 100 }}
                          />
                        </TableCell>
                        <TableCell sx={{ py: 1.5, textAlign: 'center' }}>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteTreaty(block.id, treaty.id)}
                            sx={{ color: '#dc3545' }}
                          >
                            <CloseIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {/* Add Treaty Button */}
            <Box sx={{ p: 2, borderTop: block.treaties.length > 0 ? '1px solid #e0e0e0' : 'none' }}>
              <Button
                startIcon={<AddCircleOutlineIcon />}
                onClick={() => handleAddTreaty(block.id)}
                sx={{
                  color: block.color,
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: '14px',
                  '&:hover': {
                    backgroundColor: `${block.color}15`,
                    transform: 'translateX(4px)',
                    transition: 'all 0.2s ease'
                  }
                }}
              >
                Add Treaty to {block.blockName}
              </Button>
            </Box>
          </CardContent>
        </Card>
      ))}

      {/* Save Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
        <Button
          variant="outlined"
          onClick={handleBack}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            borderColor: '#6c757d',
            color: '#6c757d',
            '&:hover': { borderColor: '#5a6268', backgroundColor: 'rgba(108, 117, 125, 0.08)' }
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          sx={{
            backgroundColor: '#dc3545',
            '&:hover': { backgroundColor: '#c82333' },
            textTransform: 'none',
            fontWeight: 600,
            px: 4
          }}
        >
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default TreatyConfig3FormComponent;
