'use client';
import { Box, Card, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { TreatyFormFields } from './TreatyFormFields';
import { getBlockColor } from '../utils/blockColors';

interface RiskLimitLine {
    id: string;
    productLOB: string;
    productCode: string;
    accountingLOB: string;
    riskCategory: string;
    riskGrade: string;
    cessionRate: string;
    quotaCessionMaxCapacity: string;
    retentionGrossNet: string;
    surplusCapacity: string;
    capacityCalculateInXL: string;
    perRiskRecoveryLimit: string;
    eventLimit: string;
    cashCallLimit: string;
    lossAdviceLimit: string;
    premiumPaymentWarranty: string;
    alertDays: string;
    reinsurers: any[];
    brokers: any[];
}

interface Treaty {
    id: string;
    treatyCode: string;
    priority: string;
    treatyType: string;
    treatyName: string;
    businessTreatyReferenceNumber: string;
    riGradedRet: string;
    formerTreatyCode: string;
    treatyCategory: string;
    installment: string;
    processingPortfolioMethod: string;
    premReserveRetainedRate: string;
    premReserveInterestRate: string;
    portfolioPremiumEntryRate: string;
    portfolioClaimEntryRate: string;
    portfolioPremWithdRate: string;
    portfolioClaimWithdRate: string;
    managementExpenses: string;
    taxesAndOtherExpenses: string;
    riskLimitLines: RiskLimitLine[];
}

interface ProportionalBlock {
    id: string;
    blockNumber: number;
    treaties: Treaty[];
}

interface ProportionalSectionProps {
    blocks: ProportionalBlock[];
    onAddBlock: () => void;
    onDeleteBlock: (blockId: string) => void;
    onAddTreaty: (blockId: string) => void;
    onDeleteTreaty: (blockId: string, treatyId: string) => void;
    onTreatyChange: (blockId: string, treatyId: string, field: string, value: string) => void;
}

export const ProportionalSection = ({
    blocks, onAddBlock, onDeleteBlock, onAddTreaty, onDeleteTreaty, onTreatyChange
}: ProportionalSectionProps) => {
    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, pb: 2, borderBottom: '2px solid #e0e0e0' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a' }}>Treaty (Proportional)</Typography>
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
                    <Card key={block.id} sx={{
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
                                    BLOCK {block.blockNumber} (PROPORTIONAL)
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
                            {block.treaties.map((treaty, treatyIndex) => (
                                <Card key={treaty.id} sx={{
                                    p: 3,
                                    backgroundColor: 'white',
                                    mb: 2,
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                    borderRadius: '8px',
                                    border: '1px solid #dee2e6'
                                }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                        <Typography variant="subtitle2" sx={{
                                            color: '#495057',
                                            fontWeight: 600,
                                            fontSize: '12px',
                                            letterSpacing: '0.5px',
                                            textTransform: 'uppercase'
                                        }}>
                                            MANDATORY TREATY INFORMATION
                                        </Typography>
                                        {block.treaties.length > 1 && (
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                size="small"
                                                onClick={() => onDeleteTreaty(block.id, treaty.id)}
                                                sx={{ textTransform: 'none', fontWeight: 600 }}
                                            >
                                                Delete Treaty
                                            </Button>
                                        )}
                                    </Box>

                                    <TreatyFormFields
                                        treaty={treaty}
                                        blockId={block.id}
                                        onTreatyChange={(blockId, field, value) => onTreatyChange(blockId, treaty.id, field, value)}
                                    />
                                </Card>
                            ))}

                            {/* Add Treaty to this Block button */}
                            <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 2 }}>
                                <Button
                                    variant="outlined"
                                    startIcon={<AddIcon />}
                                    onClick={() => onAddTreaty(block.id)}
                                    sx={{
                                        borderColor: '#28a745',
                                        color: '#28a745',
                                        '&:hover': {
                                            borderColor: '#218838',
                                            backgroundColor: '#28a74510',
                                            color: '#218838'
                                        },
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        px: 3
                                    }}
                                >
                                    Add Treaty to this Block
                                </Button>
                            </Box>
                        </Box>
                    </Card>
                );
            })}
        </Box>
    );
};
