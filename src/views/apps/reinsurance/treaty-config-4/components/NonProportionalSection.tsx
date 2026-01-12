'use client';
import { Box, Typography, Button, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { NonProportionalTreatyFields } from './NonProportionalTreatyFields';
import { getBlockColor } from '../utils/blockColors';

interface Reinsurer {
    id: string;
    reinsurer: string;
    share: string;
}

interface Broker {
    id: string;
    broker: string;
    share: string;
    reinsurers: Reinsurer[];
}

interface LayerLine {
    id: string;
    productLOB: string;
    productCode: string;
    accountingLOB: string;
    riskCategory: string;
    riskGrade: string;
    lossOccurDeductibility: string;
    lossLimit: string;
    shareOfOccurrenceDeduction: string;
    availableReinstatedSI: string;
    annualAggLimit: string;
    annualAggAmount: string;
    aggClaimAmount: string;
    localNativeLayer: string;
    transactionLimitCcy: string;
    reinsurers: Reinsurer[];
    brokers: Broker[];
}

interface NonProportionalTreaty {
    id: string;
    treatyCode: string;
    priority: string;
    treatyType: string;
    treatyName: string;
    businessTreatyReferenceNumber: string;
    xolType: string;
    formerTreatyCode: string;
    treatyCategory: string;
    treatyStatus: string;
    treatyCurrency: string;
    processing: string;
    annualAggregateLimit: string;
    annualAggDeductible: string;
    totalReinstatedSI: string;
    capacity: string;
    flatRateXOLPrem: string;
    minDepositXOLPrem: string;
    noReinstatements: string;
    proRateToAmount: string;
    proRateToTime: string;
    reserveTypeInvolved: string;
    burningCostRate: string;
    premPaymentWarranty: string;
    alertDays: string;
    perClaimRecoverableLimit: string;
    processingPortfolioMethod: string;
    basisOfAttachment: string;
    showLayers: boolean;
    layerLines: LayerLine[];
}

interface NonProportionalBlock {
    id: string;
    blockNumber: number;
    treaty: NonProportionalTreaty;
}

interface NonProportionalSectionProps {
    blocks: NonProportionalBlock[];
    onAddBlock: () => void;
    onDeleteBlock: (blockId: string) => void;
    onTreatyChange: (blockId: string, field: string, value: string | boolean) => void;
}

export const NonProportionalSection = ({
    blocks, onAddBlock, onDeleteBlock, onTreatyChange
}: NonProportionalSectionProps) => {
    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, pb: 2, borderBottom: '2px solid #e0e0e0' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a' }}>Treaty (Non-Proportional)</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={onAddBlock}
                    sx={{
                        backgroundColor: '#28a745',
                        '&:hover': { backgroundColor: '#218838' },
                        textTransform: 'none',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        fontWeight: 600,
                        px: 3
                    }}>
                    New Block
                </Button>
            </Box>

            {blocks.map((block) => {
                const blockColor = getBlockColor(block.blockNumber);
                return (
                    <Box key={block.id} sx={{
                        mb: 3,
                        backgroundColor: blockColor.bg,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        border: `2px solid ${blockColor.border}`,
                        borderLeft: `5px solid ${blockColor.accent}`
                    }}>
                        <Box sx={{
                            p: 2.5,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            backgroundColor: blockColor.border,
                            borderBottom: `1px solid ${blockColor.light}40`
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box sx={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: '50%',
                                    backgroundColor: blockColor.accent,
                                    boxShadow: `0 0 0 4px ${blockColor.light}60`
                                }} />
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#2c3e50', fontSize: '15px', letterSpacing: '0.3px' }}>
                                    BLOCK {block.blockNumber} (NON-PROPORTIONAL)
                                </Typography>
                            </Box>
                            {blocks.length > 1 && (
                                <Button variant="outlined" color="error" size="small" onClick={() => onDeleteBlock(block.id)}
                                    sx={{ textTransform: 'none', fontWeight: 600 }}>
                                    Delete Block
                                </Button>
                            )}
                        </Box>

                        <Box sx={{ p: 3 }}>
                            <Box sx={{
                                p: 3,
                                backgroundColor: 'white',
                                mb: 2,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                borderRadius: '8px',
                                border: 'none'
                            }}>
                                <Typography variant="subtitle2" sx={{
                                    color: '#495057',
                                    fontWeight: 600,
                                    fontSize: '12px',
                                    letterSpacing: '0.5px',
                                    textTransform: 'uppercase',
                                    mb: 2
                                }}>
                                    MANDATORY TREATY INFORMATION
                                </Typography>

                                <NonProportionalTreatyFields
                                    treaty={block.treaty}
                                    blockId={block.id}
                                    onTreatyChange={onTreatyChange}
                                />
                            </Box>
                        </Box>
                    </Box>
                );
            })}
        </Box>
    );
};
