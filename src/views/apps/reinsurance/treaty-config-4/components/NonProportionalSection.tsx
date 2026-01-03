'use client';
import { Box, Card, Typography, Button, IconButton, Collapse } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { NonProportionalTreatyFields } from './NonProportionalTreatyFields';
import { RiskScoreLayersSection } from './RiskScoreLayersSection';
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
    discussion: string;
    annualAggregateLimit: string;
    annualAggDeductible: string;
    totalNumberOfRI: string;
    capacity: string;
    xolBasisForShare: string;
    xolReinstmtForPremio: string;
    xolReinstmtForPremioYes: string;
    proRataOfAmount: string;
    proRataOfTime: string;
    sumInsuredRate: string;
    sumInsuredOccurRate: string;
    premiumOccurRate: string;
    perXlSumInsuredPerRiskLimit: string;
    processingPortfolioMethod: string;
    premReserveRetainedRate: string;
    premReserveInterestRate: string;
    showLayers: boolean;
    layerLines: LayerLine[];
}

interface NonProportionalBlock {
    id: string;
    blockNumber: number;
    treaties: NonProportionalTreaty[];
}

interface NonProportionalSectionProps {
    blocks: NonProportionalBlock[];
    onAddBlock: () => void;
    onDeleteBlock: (blockId: string) => void;
    onAddTreaty: (blockId: string) => void;
    onDeleteTreaty: (blockId: string, treatyId: string) => void;
    onTreatyChange: (blockId: string, treatyId: string, field: string, value: string | boolean) => void;
    onToggleLayers: (blockId: string, treatyId: string) => void;
    onAddLayer: (blockId: string, treatyId: string) => void;
    onDeleteLayer: (blockId: string, treatyId: string, layerId: string) => void;
    onLayerChange: (blockId: string, treatyId: string, layerId: string, field: string, value: string) => void;
    onAddReinsurer: (blockId: string, treatyId: string, layerId: string) => void;
    onDeleteReinsurer: (blockId: string, treatyId: string, layerId: string, reinsurerId: string) => void;
    onReinsurerChange: (blockId: string, treatyId: string, layerId: string, reinsurerId: string, field: string, value: string) => void;
    onAddBroker: (blockId: string, treatyId: string, layerId: string) => void;
    onDeleteBroker: (blockId: string, treatyId: string, layerId: string, brokerId: string) => void;
    onBrokerChange: (blockId: string, treatyId: string, layerId: string, brokerId: string, field: string, value: string) => void;
    onAddBrokerReinsurer: (blockId: string, treatyId: string, layerId: string, brokerId: string) => void;
    onDeleteBrokerReinsurer: (blockId: string, treatyId: string, layerId: string, brokerId: string, reinsurerId: string) => void;
    onBrokerReinsurerChange: (blockId: string, treatyId: string, layerId: string, brokerId: string, reinsurerId: string, field: string, value: string) => void;
}

export const NonProportionalSection = ({
    blocks, onAddBlock, onDeleteBlock, onAddTreaty, onDeleteTreaty, onTreatyChange,
    onToggleLayers, onAddLayer, onDeleteLayer, onLayerChange,
    onAddReinsurer, onDeleteReinsurer, onReinsurerChange,
    onAddBroker, onDeleteBroker, onBrokerChange,
    onAddBrokerReinsurer, onDeleteBrokerReinsurer, onBrokerReinsurerChange
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

                        {block.treaties.map((treaty) => (
                            <Box key={treaty.id} sx={{ p: 3 }}>
                                <Card sx={{
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
                                            <IconButton size="small" color="error" onClick={() => onDeleteTreaty(block.id, treaty.id)}>
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        )}
                                    </Box>

                                    <NonProportionalTreatyFields
                                        treaty={treaty}
                                        blockId={block.id}
                                        treatyId={treaty.id}
                                        onTreatyChange={onTreatyChange}
                                    />
                                </Card>

                                <Box sx={{
                                    textAlign: 'center',
                                    mb: 2,
                                    mt: 2,
                                    py: 1.5,
                                    backgroundColor: '#f8f9fa',
                                    borderRadius: '8px',
                                    border: '1px dashed #dee2e6'
                                }}>
                                    <Button
                                        variant="text"
                                        size="small"
                                        onClick={() => onToggleLayers(block.id, treaty.id)}
                                        disableRipple
                                        sx={{
                                            color: '#007bff !important',
                                            textTransform: 'none',
                                            fontSize: '13px',
                                            fontWeight: 600,
                                            backgroundColor: 'transparent !important',
                                            '&:hover': {
                                                backgroundColor: '#e9ecef !important',
                                                color: '#007bff !important'
                                            }
                                        }}
                                    >
                                        {treaty.showLayers ? '▼ Hide' : '▶ Show'} Risk Score & Layers Details
                                    </Button>
                                </Box>

                                <Collapse in={treaty.showLayers}>
                                    <RiskScoreLayersSection
                                        layerLines={treaty.layerLines}
                                        blockId={block.id}
                                        treatyId={treaty.id}
                                        onAddLayer={onAddLayer}
                                        onDeleteLayer={onDeleteLayer}
                                        onLayerChange={onLayerChange}
                                        onAddReinsurer={onAddReinsurer}
                                        onDeleteReinsurer={onDeleteReinsurer}
                                        onReinsurerChange={onReinsurerChange}
                                        onAddBroker={onAddBroker}
                                        onDeleteBroker={onDeleteBroker}
                                        onBrokerChange={onBrokerChange}
                                        onAddBrokerReinsurer={onAddBrokerReinsurer}
                                        onDeleteBrokerReinsurer={onDeleteBrokerReinsurer}
                                        onBrokerReinsurerChange={onBrokerReinsurerChange}
                                    />
                                </Collapse>
                            </Box>
                        ))}

                        {block.treaties.length < 9 && (
                            <Box sx={{ textAlign: 'center', p: 2 }}>
                                <Button variant="text" startIcon={<AddIcon />} onClick={() => onAddTreaty(block.id)}
                                    disableRipple
                                    sx={{
                                        color: '#007bff !important',
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        backgroundColor: 'transparent !important',
                                        '&:hover': {
                                            backgroundColor: '#e9ecef !important',
                                            color: '#007bff !important'
                                        }
                                    }}>
                                    Add Treaty to this Block
                                </Button>
                            </Box>
                        )}
                    </Card>
                );
            })}
        </Box>
    );
};
