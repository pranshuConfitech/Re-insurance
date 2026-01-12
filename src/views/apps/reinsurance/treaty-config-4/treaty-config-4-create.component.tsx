'use client';
import { useState } from 'react';
import { Box, Card, Typography, Button, IconButton, Collapse, Stepper, Step, StepLabel, TextField, CircularProgress } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { TopFormSection } from './components/TopFormSection';
import { TreatyFormFields } from './components/TreatyFormFields';
import { RiskLimitsSection } from './components/RiskLimitsSection';
import { RiskScoreLayersSection } from './components/RiskScoreLayersSection';
import { NonProportionalSection } from './components/NonProportionalSection';
import { ProportionalSection } from './components/ProportionalSection';
import { ParticipatingSection } from './components/ParticipatingSection';
import { getBlockColor } from './utils/blockColors';
import { ReinsuranceService } from '@/services/remote-api/api/reinsurance-services/reinsurance.service';

const reinsuranceService = new ReinsuranceService();

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
    reinsurers: Reinsurer[];
    brokers: Broker[];
}

interface Treaty {
    id: string; treatyCode: string; priority: string; treatyType: string; treatyName: string;
    businessTreatyReferenceNumber: string; riGradedRet: string; formerTreatyCode: string;
    treatyCategory: string; installment: string; processingPortfolioMethod: string;
    premReserveRetainedRate: string; premReserveInterestRate: string;
    portfolioPremiumEntryRate: string; portfolioClaimEntryRate: string;
    portfolioPremWithdRate: string; portfolioClaimWithdRate: string;
    managementExpenses: string; taxesAndOtherExpenses: string;
    riskLimitLines: RiskLimitLine[];
    reinsurers: Reinsurer[];
    brokers: Broker[];
}

interface Block {
    id: string;
    blockNumber: number;
    treaties: Treaty[];
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

const TreatyConfig4CreateComponent = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [selectMode, setSelectMode] = useState('Treaty (Proportional)');
    const [portfolio, setPortfolio] = useState('');
    const [companyUIN, setCompanyUIN] = useState('');
    const [operatingUnitUINs, setOperatingUnitUINs] = useState<string[]>([]);
    const [currentOperatingUIN, setCurrentOperatingUIN] = useState('');
    const [treatyStartDate, setTreatyStartDate] = useState<Date | null>(null);
    const [treatyEndDate, setTreatyEndDate] = useState<Date | null>(null);
    const [currency, setCurrency] = useState('USD');
    const [blocks, setBlocks] = useState<Block[]>([{ id: '1', blockNumber: 1, treaties: [createEmptyTreaty('1-1')] }]);
    const [nonProportionalBlocks, setNonProportionalBlocks] = useState<NonProportionalBlock[]>([{ id: '1', blockNumber: 1, treaty: createEmptyNonProportionalTreaty('1') }]);

    const steps = ['Basic Configuration', 'Treaty Details', 'Risk & Limits Details', 'Participating Reinsurers / Brokers', 'Additional Configuration'];

    function createEmptyTreaty(id: string): Treaty {
        return {
            id, treatyCode: '', priority: '', treatyType: 'Quota Share', treatyName: '',
            businessTreatyReferenceNumber: '', riGradedRet: '', formerTreatyCode: '',
            treatyCategory: '', installment: '', processingPortfolioMethod: 'Clean Cut',
            premReserveRetainedRate: '', premReserveInterestRate: '',
            portfolioPremiumEntryRate: '', portfolioClaimEntryRate: '',
            portfolioPremWithdRate: '', portfolioClaimWithdRate: '',
            managementExpenses: '', taxesAndOtherExpenses: '',
            riskLimitLines: [createEmptyRiskLimitLine('1')],
            reinsurers: [],
            brokers: []
        };
    }

    function createEmptyRiskLimitLine(id: string): RiskLimitLine {
        return {
            id, productLOB: '', productCode: '', accountingLOB: '', riskCategory: '',
            riskGrade: '', cessionRate: '', quotaCessionMaxCapacity: '',
            retentionGrossNet: '', surplusCapacity: '', capacityCalculateInXL: '',
            perRiskRecoveryLimit: '', eventLimit: '', cashCallLimit: '',
            lossAdviceLimit: '', premiumPaymentWarranty: '', alertDays: '',
            reinsurers: [],
            brokers: []
        };
    }

    function createEmptyReinsurer(id: string): Reinsurer {
        return { id, reinsurer: '', share: '' };
    }

    function createEmptyBroker(id: string): Broker {
        return { id, broker: '', share: '', reinsurers: [] };
    }

    function createEmptyNonProportionalTreaty(id: string): NonProportionalTreaty {
        return {
            id, treatyCode: '', priority: '', treatyType: 'XOL', treatyName: '',
            businessTreatyReferenceNumber: '', xolType: '', formerTreatyCode: '',
            treatyCategory: '', treatyStatus: '', treatyCurrency: '', processing: '',
            annualAggregateLimit: '', annualAggDeductible: '', totalReinstatedSI: '',
            capacity: '', flatRateXOLPrem: '', minDepositXOLPrem: '',
            noReinstatements: '', proRateToAmount: '', proRateToTime: '',
            reserveTypeInvolved: '', burningCostRate: '', premPaymentWarranty: '',
            alertDays: '', perClaimRecoverableLimit: '', processingPortfolioMethod: 'Clean Cut',
            basisOfAttachment: '', showLayers: false,
            layerLines: [createEmptyLayerLine('1')]
        };
    }

    function createEmptyLayerLine(id: string): LayerLine {
        return {
            id, productLOB: '', productCode: '', accountingLOB: '', riskCategory: '',
            riskGrade: '', lossOccurDeductibility: '', lossLimit: '',
            shareOfOccurrenceDeduction: '', availableReinstatedSI: '', annualAggLimit: '',
            annualAggAmount: '', aggClaimAmount: '', localNativeLayer: '',
            transactionLimitCcy: '',
            reinsurers: [],
            brokers: []
        };
    }

    const handleAddOperatingUIN = () => {
        if (currentOperatingUIN && !operatingUnitUINs.includes(currentOperatingUIN)) {
            setOperatingUnitUINs([...operatingUnitUINs, currentOperatingUIN]);
            setCurrentOperatingUIN('');
        }
    };

    const handleRemoveOperatingUIN = (uinToRemove: string) => {
        setOperatingUnitUINs(operatingUnitUINs.filter(uin => uin !== uinToRemove));
    };

    const handleOperatingUnitUINsChange = (newUINs: string[]) => {
        setOperatingUnitUINs(newUINs);
    };

    const handleAddBlock = () => {
        const newBlockNumber = blocks.length + 1;
        const newBlockId = String(newBlockNumber);
        setBlocks([...blocks, { id: newBlockId, blockNumber: newBlockNumber, treaties: [createEmptyTreaty(`${newBlockId}-1`)] }]);
    };

    const handleDeleteBlock = (blockId: string) => {
        if (blocks.length > 1) setBlocks(blocks.filter(block => block.id !== blockId));
    };

    const handleAddTreaty = (blockId: string) => {
        setBlocks(blocks.map(block => {
            if (block.id === blockId) {
                // Create globally unique treaty ID using block ID and treaty count
                const newTreatyId = `${blockId}-${block.treaties.length + 1}`;
                return {
                    ...block,
                    treaties: [...block.treaties, createEmptyTreaty(newTreatyId)]
                };
            }
            return block;
        }));
    };

    const handleDeleteTreaty = (blockId: string, treatyId: string) => {
        setBlocks(blocks.map(block => {
            if (block.id === blockId && block.treaties.length > 1) {
                return {
                    ...block,
                    treaties: block.treaties.filter(treaty => treaty.id !== treatyId)
                };
            }
            return block;
        }));
    };

    const handleTreatyChange = (blockId: string, treatyId: string, field: string, value: string | boolean) => {
        setBlocks(blocks.map(block => {
            if (block.id === blockId) {
                return {
                    ...block,
                    treaties: block.treaties.map(treaty =>
                        treaty.id === treatyId ? { ...treaty, [field]: value } : treaty
                    )
                };
            }
            return block;
        }));
    };

    const handleAddRiskLimitLine = (blockId: string, treatyId?: string) => {
        setBlocks(blocks.map(block => {
            if (block.id === blockId) {
                return {
                    ...block,
                    treaties: block.treaties.map(treaty => {
                        if (!treatyId || treaty.id === treatyId) {
                            const newLineId = String(treaty.riskLimitLines.length + 1);
                            return {
                                ...treaty,
                                riskLimitLines: [...treaty.riskLimitLines, createEmptyRiskLimitLine(newLineId)]
                            };
                        }
                        return treaty;
                    })
                };
            }
            return block;
        }));
    };

    const handleDeleteRiskLimitLine = (blockId: string, treatyId: string | undefined, lineId: string) => {
        setBlocks(blocks.map(block => {
            if (block.id === blockId) {
                return {
                    ...block,
                    treaties: block.treaties.map(treaty => {
                        if ((!treatyId || treaty.id === treatyId) && treaty.riskLimitLines.length > 1) {
                            return {
                                ...treaty,
                                riskLimitLines: treaty.riskLimitLines.filter(line => line.id !== lineId)
                            };
                        }
                        return treaty;
                    })
                };
            }
            return block;
        }));
    };

    const handleRiskLimitLineChange = (blockId: string, treatyId: string | undefined, lineId: string, field: string, value: string) => {
        setBlocks(blocks.map(block => {
            if (block.id === blockId) {
                return {
                    ...block,
                    treaties: block.treaties.map(treaty => {
                        if (!treatyId || treaty.id === treatyId) {
                            return {
                                ...treaty,
                                riskLimitLines: treaty.riskLimitLines.map(line =>
                                    line.id === lineId ? { ...line, [field]: value } : line
                                )
                            };
                        }
                        return treaty;
                    })
                };
            }
            return block;
        }));
    };

    // Reinsurer handlers
    const handleAddReinsurer = (blockId: string, treatyId: string | undefined) => {
        setBlocks(blocks.map(block => {
            if (block.id === blockId) {
                return {
                    ...block,
                    treaties: block.treaties.map(treaty => {
                        if (!treatyId || treaty.id === treatyId) {
                            const newReinsurerId = String(treaty.reinsurers.length + 1);
                            return { ...treaty, reinsurers: [...treaty.reinsurers, createEmptyReinsurer(newReinsurerId)] };
                        }
                        return treaty;
                    })
                };
            }
            return block;
        }));
    };

    const handleDeleteReinsurer = (blockId: string, treatyId: string | undefined, reinsurerId: string) => {
        setBlocks(blocks.map(block => {
            if (block.id === blockId) {
                return {
                    ...block,
                    treaties: block.treaties.map(treaty => {
                        if (!treatyId || treaty.id === treatyId) {
                            return { ...treaty, reinsurers: treaty.reinsurers.filter(r => r.id !== reinsurerId) };
                        }
                        return treaty;
                    })
                };
            }
            return block;
        }));
    };

    const handleReinsurerChange = (blockId: string, treatyId: string | undefined, reinsurerId: string, field: string, value: string) => {
        setBlocks(blocks.map(block => {
            if (block.id === blockId) {
                return {
                    ...block,
                    treaties: block.treaties.map(treaty => {
                        if (!treatyId || treaty.id === treatyId) {
                            return {
                                ...treaty,
                                reinsurers: treaty.reinsurers.map(r =>
                                    r.id === reinsurerId ? { ...r, [field]: value } : r
                                )
                            };
                        }
                        return treaty;
                    })
                };
            }
            return block;
        }));
    };

    // Broker handlers
    const handleAddBroker = (blockId: string, treatyId: string | undefined) => {
        setBlocks(blocks.map(block => {
            if (block.id === blockId) {
                return {
                    ...block,
                    treaties: block.treaties.map(treaty => {
                        if (!treatyId || treaty.id === treatyId) {
                            const newBrokerId = String(treaty.brokers.length + 1);
                            return { ...treaty, brokers: [...treaty.brokers, createEmptyBroker(newBrokerId)] };
                        }
                        return treaty;
                    })
                };
            }
            return block;
        }));
    };

    const handleDeleteBroker = (blockId: string, treatyId: string | undefined, brokerId: string) => {
        setBlocks(blocks.map(block => {
            if (block.id === blockId) {
                return {
                    ...block,
                    treaties: block.treaties.map(treaty => {
                        if (!treatyId || treaty.id === treatyId) {
                            return { ...treaty, brokers: treaty.brokers.filter(b => b.id !== brokerId) };
                        }
                        return treaty;
                    })
                };
            }
            return block;
        }));
    };

    const handleBrokerChange = (blockId: string, treatyId: string | undefined, brokerId: string, field: string, value: string) => {
        setBlocks(blocks.map(block => {
            if (block.id === blockId) {
                return {
                    ...block,
                    treaties: block.treaties.map(treaty => {
                        if (!treatyId || treaty.id === treatyId) {
                            return {
                                ...treaty,
                                brokers: treaty.brokers.map(b =>
                                    b.id === brokerId ? { ...b, [field]: value } : b
                                )
                            };
                        }
                        return treaty;
                    })
                };
            }
            return block;
        }));
    };

    // Broker's Reinsurer handlers
    const handleAddBrokerReinsurer = (blockId: string, treatyId: string | undefined, brokerId: string) => {
        setBlocks(blocks.map(block => {
            if (block.id === blockId) {
                return {
                    ...block,
                    treaties: block.treaties.map(treaty => {
                        if (!treatyId || treaty.id === treatyId) {
                            return {
                                ...treaty,
                                brokers: treaty.brokers.map(b => {
                                    if (b.id === brokerId) {
                                        const newReinsurerId = String(b.reinsurers.length + 1);
                                        return { ...b, reinsurers: [...b.reinsurers, createEmptyReinsurer(newReinsurerId)] };
                                    }
                                    return b;
                                })
                            };
                        }
                        return treaty;
                    })
                };
            }
            return block;
        }));
    };

    const handleDeleteBrokerReinsurer = (blockId: string, treatyId: string | undefined, brokerId: string, reinsurerId: string) => {
        setBlocks(blocks.map(block => {
            if (block.id === blockId) {
                return {
                    ...block,
                    treaties: block.treaties.map(treaty => {
                        if (!treatyId || treaty.id === treatyId) {
                            return {
                                ...treaty,
                                brokers: treaty.brokers.map(b => {
                                    if (b.id === brokerId) {
                                        return { ...b, reinsurers: b.reinsurers.filter(r => r.id !== reinsurerId) };
                                    }
                                    return b;
                                })
                            };
                        }
                        return treaty;
                    })
                };
            }
            return block;
        }));
    };

    const handleBrokerReinsurerChange = (blockId: string, treatyId: string | undefined, brokerId: string, reinsurerId: string, field: string, value: string) => {
        setBlocks(blocks.map(block => {
            if (block.id === blockId) {
                return {
                    ...block,
                    treaties: block.treaties.map(treaty => {
                        if (!treatyId || treaty.id === treatyId) {
                            return {
                                ...treaty,
                                brokers: treaty.brokers.map(b => {
                                    if (b.id === brokerId) {
                                        return {
                                            ...b,
                                            reinsurers: b.reinsurers.map(r =>
                                                r.id === reinsurerId ? { ...r, [field]: value } : r
                                            )
                                        };
                                    }
                                    return b;
                                })
                            };
                        }
                        return treaty;
                    })
                };
            }
            return block;
        }));
    };

    // Non-Proportional handlers
    const handleAddNonProportionalBlock = () => {
        const newBlockNumber = nonProportionalBlocks.length + 1;
        setNonProportionalBlocks([...nonProportionalBlocks, { id: String(newBlockNumber), blockNumber: newBlockNumber, treaty: createEmptyNonProportionalTreaty(String(newBlockNumber)) }]);
    };

    const handleDeleteNonProportionalBlock = (blockId: string) => {
        if (nonProportionalBlocks.length > 1) setNonProportionalBlocks(nonProportionalBlocks.filter(block => block.id !== blockId));
    };

    const handleNonProportionalTreatyChange = (blockId: string, field: string, value: string | boolean) => {
        setNonProportionalBlocks(nonProportionalBlocks.map(block => {
            if (block.id === blockId) {
                return { ...block, treaty: { ...block.treaty, [field]: value } };
            }
            return block;
        }));
    };

    const handleAddLayer = (blockId: string) => {
        setNonProportionalBlocks(nonProportionalBlocks.map(block => {
            if (block.id === blockId) {
                const newLayerId = String(block.treaty.layerLines.length + 1);
                return {
                    ...block,
                    treaty: {
                        ...block.treaty,
                        layerLines: [...block.treaty.layerLines, createEmptyLayerLine(newLayerId)]
                    }
                };
            }
            return block;
        }));
    };

    const handleDeleteLayer = (blockId: string, layerId: string) => {
        setNonProportionalBlocks(nonProportionalBlocks.map(block => {
            if (block.id === blockId && block.treaty.layerLines.length > 1) {
                return {
                    ...block,
                    treaty: {
                        ...block.treaty,
                        layerLines: block.treaty.layerLines.filter(layer => layer.id !== layerId)
                    }
                };
            }
            return block;
        }));
    };

    const handleLayerChange = (blockId: string, layerId: string, field: string, value: string) => {
        setNonProportionalBlocks(nonProportionalBlocks.map(block => {
            if (block.id === blockId) {
                return {
                    ...block,
                    treaty: {
                        ...block.treaty,
                        layerLines: block.treaty.layerLines.map(layer =>
                            layer.id === layerId ? { ...layer, [field]: value } : layer
                        )
                    }
                };
            }
            return block;
        }));
    };

    // Non-Proportional Reinsurer handlers
    const handleAddNPReinsurer = (blockId: string, layerId: string) => {
        setNonProportionalBlocks(nonProportionalBlocks.map(block => {
            if (block.id === blockId) {
                return {
                    ...block,
                    treaty: {
                        ...block.treaty,
                        layerLines: block.treaty.layerLines.map(layer => {
                            if (layer.id === layerId) {
                                const newReinsurerId = String(layer.reinsurers.length + 1);
                                return { ...layer, reinsurers: [...layer.reinsurers, createEmptyReinsurer(newReinsurerId)] };
                            }
                            return layer;
                        })
                    }
                };
            }
            return block;
        }));
    };

    const handleDeleteNPReinsurer = (blockId: string, layerId: string, reinsurerId: string) => {
        setNonProportionalBlocks(nonProportionalBlocks.map(block => {
            if (block.id === blockId) {
                return {
                    ...block,
                    treaty: {
                        ...block.treaty,
                        layerLines: block.treaty.layerLines.map(layer => {
                            if (layer.id === layerId) {
                                return { ...layer, reinsurers: layer.reinsurers.filter(r => r.id !== reinsurerId) };
                            }
                            return layer;
                        })
                    }
                };
            }
            return block;
        }));
    };

    const handleNPReinsurerChange = (blockId: string, layerId: string, reinsurerId: string, field: string, value: string) => {
        setNonProportionalBlocks(nonProportionalBlocks.map(block => {
            if (block.id === blockId) {
                return {
                    ...block,
                    treaty: {
                        ...block.treaty,
                        layerLines: block.treaty.layerLines.map(layer => {
                            if (layer.id === layerId) {
                                return {
                                    ...layer,
                                    reinsurers: layer.reinsurers.map(r =>
                                        r.id === reinsurerId ? { ...r, [field]: value } : r
                                    )
                                };
                            }
                            return layer;
                        })
                    }
                };
            }
            return block;
        }));
    };

    // Non-Proportional Broker handlers
    const handleAddNPBroker = (blockId: string, layerId: string) => {
        setNonProportionalBlocks(nonProportionalBlocks.map(block => {
            if (block.id === blockId) {
                return {
                    ...block,
                    treaty: {
                        ...block.treaty,
                        layerLines: block.treaty.layerLines.map(layer => {
                            if (layer.id === layerId) {
                                const newBrokerId = String(layer.brokers.length + 1);
                                return { ...layer, brokers: [...layer.brokers, createEmptyBroker(newBrokerId)] };
                            }
                            return layer;
                        })
                    }
                };
            }
            return block;
        }));
    };

    const handleDeleteNPBroker = (blockId: string, layerId: string, brokerId: string) => {
        setNonProportionalBlocks(nonProportionalBlocks.map(block => {
            if (block.id === blockId) {
                return {
                    ...block,
                    treaty: {
                        ...block.treaty,
                        layerLines: block.treaty.layerLines.map(layer => {
                            if (layer.id === layerId) {
                                return { ...layer, brokers: layer.brokers.filter(b => b.id !== brokerId) };
                            }
                            return layer;
                        })
                    }
                };
            }
            return block;
        }));
    };

    const handleNPBrokerChange = (blockId: string, layerId: string, brokerId: string, field: string, value: string) => {
        setNonProportionalBlocks(nonProportionalBlocks.map(block => {
            if (block.id === blockId) {
                return {
                    ...block,
                    treaty: {
                        ...block.treaty,
                        layerLines: block.treaty.layerLines.map(layer => {
                            if (layer.id === layerId) {
                                return {
                                    ...layer,
                                    brokers: layer.brokers.map(b =>
                                        b.id === brokerId ? { ...b, [field]: value } : b
                                    )
                                };
                            }
                            return layer;
                        })
                    }
                };
            }
            return block;
        }));
    };

    // Non-Proportional Broker's Reinsurer handlers
    const handleAddNPBrokerReinsurer = (blockId: string, layerId: string, brokerId: string) => {
        setNonProportionalBlocks(nonProportionalBlocks.map(block => {
            if (block.id === blockId) {
                return {
                    ...block,
                    treaty: {
                        ...block.treaty,
                        layerLines: block.treaty.layerLines.map(layer => {
                            if (layer.id === layerId) {
                                return {
                                    ...layer,
                                    brokers: layer.brokers.map(b => {
                                        if (b.id === brokerId) {
                                            const newReinsurerId = String(b.reinsurers.length + 1);
                                            return { ...b, reinsurers: [...b.reinsurers, createEmptyReinsurer(newReinsurerId)] };
                                        }
                                        return b;
                                    })
                                };
                            }
                            return layer;
                        })
                    }
                };
            }
            return block;
        }));
    };

    const handleDeleteNPBrokerReinsurer = (blockId: string, layerId: string, brokerId: string, reinsurerId: string) => {
        setNonProportionalBlocks(nonProportionalBlocks.map(block => {
            if (block.id === blockId) {
                return {
                    ...block,
                    treaty: {
                        ...block.treaty,
                        layerLines: block.treaty.layerLines.map(layer => {
                            if (layer.id === layerId) {
                                return {
                                    ...layer,
                                    brokers: layer.brokers.map(b => {
                                        if (b.id === brokerId) {
                                            return { ...b, reinsurers: b.reinsurers.filter(r => r.id !== reinsurerId) };
                                        }
                                        return b;
                                    })
                                };
                            }
                            return layer;
                        })
                    }
                };
            }
            return block;
        }));
    };

    const handleNPBrokerReinsurerChange = (blockId: string, layerId: string, brokerId: string, reinsurerId: string, field: string, value: string) => {
        setNonProportionalBlocks(nonProportionalBlocks.map(block => {
            if (block.id === blockId) {
                return {
                    ...block,
                    treaty: {
                        ...block.treaty,
                        layerLines: block.treaty.layerLines.map(layer => {
                            if (layer.id === layerId) {
                                return {
                                    ...layer,
                                    brokers: layer.brokers.map(b => {
                                        if (b.id === brokerId) {
                                            return {
                                                ...b,
                                                reinsurers: b.reinsurers.map(r =>
                                                    r.id === reinsurerId ? { ...r, [field]: value } : r
                                                )
                                            };
                                        }
                                        return b;
                                    })
                                };
                            }
                            return layer;
                        })
                    }
                };
            }
            return block;
        }));
    };

    const handleNext = () => {
        setActiveStep((prevStep) => prevStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };

    const validateStep1 = () => {
        return portfolio && companyUIN && treatyStartDate && treatyEndDate && currency;
    };

    const validateStep2 = () => {
        if (selectMode === 'Treaty (Proportional)') {
            return blocks.some(block =>
                block.treaties.some(treaty =>
                    treaty.treatyCode && treaty.treatyName && treaty.treatyType
                )
            );
        } else {
            return nonProportionalBlocks.some(block =>
                block.treaty.treatyCode && block.treaty.treatyName && block.treaty.treatyType
            );
        }
    };

    const [isSubmitting, setIsSubmitting] = useState(false);

    const buildPayload = () => {
        const formatDate = (date: Date | null) => date ? format(date, 'yyyy-MM-dd') : '';

        if (selectMode === 'Treaty (Proportional)') {
            // Build Proportional payload
            const treatyBlocks = blocks.map((block, blockIndex) => ({
                blockType: 'PROPORTIONAL',
                sortOrder: blockIndex + 1,
                treaties: block.treaties.map(treaty => ({
                    treatyCode: treaty.treatyCode,
                    priority: treaty.priority || 'PRIMARY',
                    treatyType: treaty.treatyType === 'Quota Share' ? 'QUOTA_SHARE' : treaty.treatyType === 'Surplus' ? 'SURPLUS' : treaty.treatyType.toUpperCase().replace(/\s+/g, '_'),
                    treatyName: treaty.treatyName,
                    refNumber: treaty.businessTreatyReferenceNumber,
                    gradedRetention: treaty.riGradedRet === 'Yes',
                    formerTreatyCode: treaty.formerTreatyCode || null,
                    treatyCategory: treaty.treatyCategory || 'PROPERTY',
                    status: 'ACTIVE',
                    processingMethod: treaty.processingPortfolioMethod === 'Clean Cut' ? 'STANDARD' : treaty.processingPortfolioMethod?.toUpperCase().replace(/\s+/g, '_') || 'STANDARD',
                    propTreatyAttribute: {
                        installmentType: treaty.installment === 'Monthly' ? 'M' : treaty.installment === 'Quarterly' ? 'Q' : treaty.installment === 'Semi-Annual' ? 'S' : treaty.installment === 'Annual' ? 'A' : treaty.installment || 'Q',
                        premReserveRetainedRate: parseFloat(treaty.premReserveRetainedRate) || 0,
                        premReserveInterestRate: parseFloat(treaty.premReserveInterestRate) || 0,
                        portfolioPremEntryRate: parseFloat(treaty.portfolioPremiumEntryRate) || 100.0,
                        portfolioClaimEntryRate: parseFloat(treaty.portfolioClaimEntryRate) || 100.0,
                        portfolioClaimWithdRate: parseFloat(treaty.portfolioClaimWithdRate) || 0,
                        portfolioPremWithdRate: parseFloat(treaty.portfolioPremWithdRate) || 0,
                        mgmtExpensesPercent: parseFloat(treaty.managementExpenses) || 0,
                        taxesPercent: parseFloat(treaty.taxesAndOtherExpenses) || 0,
                        formerTreatyCode: treaty.formerTreatyCode || null,
                        treatyCategory: treaty.treatyCategory || 'PROPERTY',
                        status: 'ACTIVE',
                        processingMethod: treaty.processingPortfolioMethod === 'Clean Cut' ? 'STANDARD' : treaty.processingPortfolioMethod?.toUpperCase().replace(/\s+/g, '_') || 'STANDARD'
                    },
                    nonpropTreatyAttribute: null,
                    propRiskDetails: treaty.riskLimitLines.map(line => ({
                        treatyId: treaty.treatyCode,
                        productLob: line.productLOB || 'PROPERTY',
                        productCode: line.productCode,
                        acctLob: line.accountingLOB || 'PROP',
                        riskCategory: line.riskCategory || 'MEDIUM',
                        riskGrade: line.riskGrade || 'B',
                        quotaCessionMaxCapacity: parseFloat(line.quotaCessionMaxCapacity) || 0,
                        cessionRate: parseFloat(line.cessionRate) || 0,
                        retentionAmount: parseFloat(line.retentionGrossNet) || 0,
                        surplusCapacity: parseFloat(line.surplusCapacity) || 0,
                        capacityCalculated: parseFloat(line.capacityCalculateInXL) || 0,
                        perRiskRecovery: parseFloat(line.perRiskRecoveryLimit) || 0,
                        eventLimit: parseFloat(line.eventLimit) || 0,
                        cashCallLimit: parseFloat(line.cashCallLimit) || 0,
                        lossAdviceLimit: parseFloat(line.lossAdviceLimit) || 0,
                        premiumPaymentWarranty: line.premiumPaymentWarranty || 'WITHIN_30_DAYS',
                        alertDays: parseInt(line.alertDays) || 0
                    })),
                    nonpropLayers: null,
                    portfolioTreatyAllocations: [
                        ...treaty.reinsurers.map(r => ({
                            participantType: 'REINSURER',
                            participantName: r.reinsurer,
                            sharePercent: parseFloat(r.share) || 0,
                            brokerBreakdowns: []
                        })),
                        ...treaty.brokers.map(b => ({
                            participantType: 'BROKER',
                            participantName: b.broker,
                            sharePercent: parseFloat(b.share) || 0,
                            brokerBreakdowns: b.reinsurers.map(br => ({
                                reinsurerName: br.reinsurer,
                                sharePercent: parseFloat(br.share) || 0
                            }))
                        }))
                    ]
                }))
            }));

            return {
                portfolioName: portfolio,
                insurerId: companyUIN,
                startDate: formatDate(treatyStartDate),
                endDate: formatDate(treatyEndDate),
                currency: currency,
                operatingUnits: operatingUnitUINs.map(ou => ({ ouCode: ou })),
                'treaty-blocks': treatyBlocks
            };
        } else {
            // Build Non-Proportional payload
            const treatyBlocks = nonProportionalBlocks.map((block, blockIndex) => ({
                blockType: 'NON_PROPORTIONAL',
                sortOrder: blockIndex + 1,
                treaties: [{
                    treatyCode: block.treaty.treatyCode,
                    priority: block.treaty.priority || 'HIGH',
                    treatyType: block.treaty.treatyType === 'XOL' ? 'XOL' : block.treaty.treatyType.toUpperCase().replace(/\s+/g, '_'),
                    treatyName: block.treaty.treatyName,
                    refNumber: block.treaty.businessTreatyReferenceNumber,
                    gradedRetention: false, // Default value since riGradedRet doesn't exist in NonProportionalTreaty
                    xolAttachmentType: block.treaty.basisOfAttachment || 'RISK',
                    formerTreatyCode: block.treaty.formerTreatyCode || null,
                    treatyCategory: block.treaty.treatyCategory || 'NON_PROP',
                    status: block.treaty.treatyStatus || 'ACTIVE',
                    processingMethod: block.treaty.processingPortfolioMethod === 'Clean Cut' ? 'AUTO' : block.treaty.processingPortfolioMethod?.toUpperCase().replace(/\s+/g, '_') || 'AUTO',
                    propTreatyAttribute: null,
                    propRiskDetails: null,
                    nonpropTreatyAttribute: {
                        annualAggLimit: parseFloat(block.treaty.annualAggregateLimit) || 50000000,
                        annualAggDeductible: parseFloat(block.treaty.annualAggDeductible) || 5000000,
                        totalReinstatedSi: parseFloat(block.treaty.totalReinstatedSI) || 100000000,
                        capacity: parseFloat(block.treaty.capacity) || 25000000,
                        flatRateXolPrem: parseFloat(block.treaty.flatRateXOLPrem) || 3.5,
                        minDepositXolPrem: parseFloat(block.treaty.minDepositXOLPrem) || 1500000,
                        noOfReinstatements: parseInt(block.treaty.noReinstatements) || 2,
                        proRateAmount: block.treaty.proRateToAmount === 'Yes' || true,
                        proRateToTime: block.treaty.proRateToTime === 'Yes' || false,
                        reserveTypeInvolved: block.treaty.reserveTypeInvolved || 'CLAIM',
                        burningCostRate: parseFloat(block.treaty.burningCostRate) || 2.1,
                        premiumPaymentWarranty: block.treaty.premPaymentWarranty || 'QUARTERLY',
                        alertDays: parseInt(block.treaty.alertDays) || 30,
                        perClaimRecoverableLimit: parseFloat(block.treaty.perClaimRecoverableLimit) || 10000000,
                        processingPortfolioMethod: block.treaty.processingPortfolioMethod || 'LAYER_BASED',
                        basisOfAttachment: block.treaty.basisOfAttachment || 'OCCURRENCE'
                    },
                    nonpropLayers: block.treaty.layerLines.map((layer, layerIndex) => ({
                        productLob: layer.productLOB || 'PROPERTY',
                        productCode: layer.productCode || 'PROP-01',
                        accountLob: layer.accountingLOB || 'FIRE',
                        riskCategory: layer.riskCategory || 'CAT',
                        riskGrade: layer.riskGrade || 'A',
                        lossDeductionPriority: layerIndex + 1,
                        lossLimit: parseFloat(layer.lossLimit) || 10000000,
                        basisOfOccurrence: 'EVENT',
                        availableReinstatedSi: parseFloat(layer.availableReinstatedSI) || 20000000,
                        shareAggDeductible: parseFloat(layer.shareOfOccurrenceDeduction) || 2000000,
                        shareAggLimit: parseFloat(layer.annualAggLimit) || 30000000,
                        aggClaimAmount: parseFloat(layer.aggClaimAmount) || 0,
                        aggClaimRecovered: 0,
                        lossAdviceLimit: parseFloat(layer.lossOccurDeductibility) || 500000,
                        mgmtExpensePercent: 5,
                        taxesOtherExpensePercent: 2
                    })),
                    portfolioTreatyAllocations: [
                        // Add reinsurers from layer allocations
                        ...block.treaty.layerLines.flatMap(layer =>
                            layer.reinsurers.map(r => ({
                                participantType: 'REINSURER',
                                participantName: r.reinsurer || 'Swiss Re',
                                sharePercent: parseFloat(r.share) || 60,
                                brokerBreakdowns: layer.brokers.map(b => ({
                                    reinsurerName: b.broker || 'Broker A',
                                    sharePercent: parseFloat(b.share) || parseFloat(r.share) || 60
                                }))
                            }))
                        ),
                        // Add brokers as separate participants if they exist
                        ...block.treaty.layerLines.flatMap(layer =>
                            layer.brokers.filter(b => b.broker).map(b => ({
                                participantType: 'REINSURER',
                                participantName: b.broker || 'Munich Re',
                                sharePercent: parseFloat(b.share) || 40,
                                brokerBreakdowns: b.reinsurers.map(br => ({
                                    reinsurerName: br.reinsurer || 'Broker B',
                                    sharePercent: parseFloat(br.share) || parseFloat(b.share) || 40
                                }))
                            }))
                        )
                    ].slice(0, 2) // Limit to 2 participants as per your example
                }]
            }));

            return {
                portfolioName: portfolio || 'NonProp Portfolio FY26',
                insurerId: companyUIN || 'INS-001',
                startDate: formatDate(treatyStartDate),
                endDate: formatDate(treatyEndDate),
                currency: currency,
                operatingUnits: operatingUnitUINs.length > 0
                    ? operatingUnitUINs.map(ou => ({ ouCode: ou }))
                    : [{ ouCode: 'OU-NP-01' }, { ouCode: 'OU-NP-02' }],
                'treaty-blocks': treatyBlocks
            };
        }
    };

    const validateNonProportionalPayload = (payload: any) => {
        // Validate the payload structure matches the expected format
        const requiredFields = [
            'portfolioName', 'insurerId', 'startDate', 'endDate',
            'currency', 'operatingUnits', 'treaty-blocks'
        ];

        const missingFields = requiredFields.filter(field => !payload[field]);
        if (missingFields.length > 0) {
            console.warn('Missing required fields:', missingFields);
        }

        // Validate treaty blocks structure
        if (payload['treaty-blocks'] && payload['treaty-blocks'].length > 0) {
            const block = payload['treaty-blocks'][0];
            if (block.blockType !== 'NON_PROPORTIONAL') {
                console.warn('Expected blockType to be NON_PROPORTIONAL, got:', block.blockType);
            }

            if (block.treaties && block.treaties.length > 0) {
                const treaty = block.treaties[0];
                const requiredTreatyFields = [
                    'treatyCode', 'priority', 'treatyType', 'treatyName',
                    'nonpropTreatyAttribute', 'nonpropLayers', 'portfolioTreatyAllocations'
                ];

                const missingTreatyFields = requiredTreatyFields.filter(field =>
                    treaty[field] === undefined || treaty[field] === null
                );

                if (missingTreatyFields.length > 0) {
                    console.warn('Missing treaty fields:', missingTreatyFields);
                }
            }
        }

        return payload;
    };

    const handleSubmit = () => {
        setIsSubmitting(true);
        let payload = buildPayload();

        // Validate non-proportional payload structure
        if (selectMode === 'Treaty (Non Proportional)') {
            payload = validateNonProportionalPayload(payload);
        }

        console.log('Submitting payload:', JSON.stringify(payload, null, 2));
        console.log('Treaty mode:', selectMode);

        reinsuranceService.savePortfolioTreaty(payload).subscribe({
            next: (response) => {
                console.log('Submit successful:', response);
                alert(`${selectMode} treaty configuration saved successfully!`);
                setIsSubmitting(false);
            },
            error: (error) => {
                console.error('Submit error:', error);
                alert(`Failed to save ${selectMode.toLowerCase()} treaty configuration. Please try again.`);
                setIsSubmitting(false);
            }
        });
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ p: 4, backgroundColor: '#fafafa', minHeight: '100vh' }}>
                <Typography variant="h4" sx={{ fontWeight: 600, color: '#1a1a1a', mb: 3 }}>
                    Reinsurance Configuration
                </Typography>

                {/* Stepper */}
                <Card sx={{ p: 3, mb: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                    <Stepper activeStep={activeStep} alternativeLabel>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Card>

                {/* Step 1: Basic Configuration */}
                {activeStep === 0 && (
                    <Box>
                        <TopFormSection
                            portfolio={portfolio}
                            companyUIN={companyUIN}
                            currentOperatingUIN={currentOperatingUIN}
                            operatingUnitUINs={operatingUnitUINs}
                            treatyStartDate={treatyStartDate}
                            treatyEndDate={treatyEndDate}
                            currency={currency}
                            selectMode={selectMode}
                            onPortfolioChange={setPortfolio}
                            onCompanyUINChange={setCompanyUIN}
                            onCurrentOperatingUINChange={setCurrentOperatingUIN}
                            onAddOperatingUIN={handleAddOperatingUIN}
                            onRemoveOperatingUIN={handleRemoveOperatingUIN}
                            onOperatingUnitUINsChange={handleOperatingUnitUINsChange}
                            onTreatyStartDateChange={setTreatyStartDate}
                            onTreatyEndDateChange={setTreatyEndDate}
                            onCurrencyChange={setCurrency}
                            onSelectModeChange={setSelectMode}
                        />

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                            <Button
                                variant="contained"
                                onClick={handleNext}
                                disabled={!validateStep1()}
                                sx={{
                                    backgroundColor: '#007bff',
                                    '&:hover': { backgroundColor: '#0056b3' },
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    px: 4,
                                    py: 1.5
                                }}
                            >
                                Next
                            </Button>
                        </Box>
                    </Box>
                )}

                {/* Step 2: Treaty Details */}
                {activeStep === 1 && (
                    <Box>
                        {selectMode === 'Treaty (Proportional)' && (
                            <ProportionalSection
                                blocks={blocks}
                                onAddBlock={handleAddBlock}
                                onDeleteBlock={handleDeleteBlock}
                                onAddTreaty={handleAddTreaty}
                                onDeleteTreaty={handleDeleteTreaty}
                                onTreatyChange={handleTreatyChange}
                            />
                        )}

                        {selectMode === 'Treaty (Non Proportional)' && (
                            <NonProportionalSection
                                blocks={nonProportionalBlocks}
                                onAddBlock={handleAddNonProportionalBlock}
                                onDeleteBlock={handleDeleteNonProportionalBlock}
                                onTreatyChange={handleNonProportionalTreatyChange}
                            />
                        )}

                        {/* Navigation Buttons */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                            <Button
                                variant="outlined"
                                onClick={handleBack}
                                disableRipple
                                sx={{
                                    borderColor: '#6c757d !important',
                                    color: '#6c757d !important',
                                    backgroundColor: 'transparent !important',
                                    '&:hover': {
                                        borderColor: '#6c757d !important',
                                        backgroundColor: '#e9ecef !important',
                                        color: '#6c757d !important'
                                    },
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    px: 4,
                                    py: 1.5
                                }}
                            >
                                Back
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleNext}
                                sx={{
                                    backgroundColor: '#007bff',
                                    '&:hover': { backgroundColor: '#0056b3' },
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    px: 4,
                                    py: 1.5
                                }}
                            >
                                Next
                            </Button>
                        </Box>
                    </Box>
                )}

                {/* Step 3: Risk & Limits Details */}
                {activeStep === 2 && (
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a1a1a', mb: 3 }}>
                            Risk & Limits Details
                        </Typography>

                        {selectMode === 'Treaty (Proportional)' && (
                            <Box>
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
                                                        BLOCK {block.blockNumber} - RISK & LIMITS
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            <Box sx={{ p: 3 }}>
                                                {block.treaties.map((treaty, treatyIndex) => (
                                                    <Card key={treaty.id} sx={{ mb: 2, p: 3, backgroundColor: 'white', border: '1px solid #dee2e6' }}>
                                                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a', mb: 2 }}>
                                                            Treaty {block.blockNumber}{treatyIndex + 1}: {treaty.treatyName || `Block ${block.blockNumber} Treaty ${treatyIndex + 1}`}
                                                        </Typography>
                                                        <RiskLimitsSection
                                                            riskLimitLines={treaty.riskLimitLines || []}
                                                            blockId={block.id}
                                                            treatyId={treaty.id}
                                                            onAddLine={(blockId, treatyId) => handleAddRiskLimitLine(blockId, treatyId)}
                                                            onDeleteLine={(blockId, treatyId, lineId) => handleDeleteRiskLimitLine(blockId, treatyId, lineId)}
                                                            onLineChange={(blockId, treatyId, lineId, field, value) => handleRiskLimitLineChange(blockId, treatyId, lineId, field, value)}
                                                        />
                                                    </Card>
                                                ))}
                                            </Box>
                                        </Card>
                                    );
                                })}
                            </Box>
                        )}

                        {selectMode === 'Treaty (Non Proportional)' && (
                            <Box>
                                {nonProportionalBlocks.map((block) => {
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
                                                        BLOCK {block.blockNumber} - LAYERS & LIMITS
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            <Box sx={{ p: 3 }}>
                                                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a', mb: 2 }}>
                                                    {block.treaty.treatyName || `Block ${block.blockNumber} Treaty`}
                                                </Typography>
                                                <RiskScoreLayersSection
                                                    layerLines={block.treaty.layerLines}
                                                    blockId={block.id}
                                                    onAddLayer={handleAddLayer}
                                                    onDeleteLayer={handleDeleteLayer}
                                                    onLayerChange={handleLayerChange}
                                                />
                                            </Box>
                                        </Card>
                                    );
                                })}
                            </Box>
                        )}

                        {/* Navigation Buttons */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                            <Button
                                variant="outlined"
                                onClick={handleBack}
                                disableRipple
                                sx={{
                                    borderColor: '#6c757d !important',
                                    color: '#6c757d !important',
                                    backgroundColor: 'transparent !important',
                                    '&:hover': {
                                        borderColor: '#6c757d !important',
                                        backgroundColor: '#e9ecef !important',
                                        color: '#6c757d !important'
                                    },
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    px: 4,
                                    py: 1.5
                                }}
                            >
                                Back
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleNext}
                                sx={{
                                    backgroundColor: '#007bff',
                                    '&:hover': { backgroundColor: '#0056b3' },
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    px: 4,
                                    py: 1.5
                                }}
                            >
                                Next
                            </Button>
                        </Box>
                    </Box>
                )}

                {/* Step 4: Participating Reinsurers / Brokers */}
                {activeStep === 3 && (
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a1a1a', mb: 3 }}>
                            Participating Reinsurers / Brokers
                        </Typography>

                        {selectMode === 'Treaty (Proportional)' && (
                            <Box>
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
                                                        BLOCK {block.blockNumber} - PARTICIPATING REINSURERS / BROKERS
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            <Box sx={{ p: 3 }}>
                                                {block.treaties.map((treaty, treatyIndex) => (
                                                    <Card key={treaty.id} sx={{ mb: 3, p: 3, backgroundColor: 'white', border: '1px solid #dee2e6' }}>
                                                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a', mb: 2 }}>
                                                            Treaty {block.blockNumber}{treatyIndex + 1}: {treaty.treatyName || `Block ${block.blockNumber} Treaty ${treatyIndex + 1}`}
                                                        </Typography>

                                                        <ParticipatingSection
                                                            reinsurers={treaty.reinsurers}
                                                            brokers={treaty.brokers}
                                                            blockId={block.id}
                                                            treatyId={treaty.id}
                                                            onAddReinsurer={(blockId, treatyId) => handleAddReinsurer(blockId, treatyId)}
                                                            onDeleteReinsurer={(blockId, treatyId, reinsurerId) => handleDeleteReinsurer(blockId, treatyId, reinsurerId)}
                                                            onReinsurerChange={(blockId, treatyId, reinsurerId, field, value) => handleReinsurerChange(blockId, treatyId, reinsurerId, field, value)}
                                                            onAddBroker={(blockId, treatyId) => handleAddBroker(blockId, treatyId)}
                                                            onDeleteBroker={(blockId, treatyId, brokerId) => handleDeleteBroker(blockId, treatyId, brokerId)}
                                                            onBrokerChange={(blockId, treatyId, brokerId, field, value) => handleBrokerChange(blockId, treatyId, brokerId, field, value)}
                                                            onAddBrokerReinsurer={(blockId, treatyId, brokerId) => handleAddBrokerReinsurer(blockId, treatyId, brokerId)}
                                                            onDeleteBrokerReinsurer={(blockId, treatyId, brokerId, reinsurerId) => handleDeleteBrokerReinsurer(blockId, treatyId, brokerId, reinsurerId)}
                                                            onBrokerReinsurerChange={(blockId, treatyId, brokerId, reinsurerId, field, value) => handleBrokerReinsurerChange(blockId, treatyId, brokerId, reinsurerId, field, value)}
                                                        />
                                                    </Card>
                                                ))}
                                            </Box>
                                        </Card>
                                    );
                                })}
                            </Box>
                        )}

                        {selectMode === 'Treaty (Non Proportional)' && (
                            <Box>
                                {nonProportionalBlocks.map((block) => {
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
                                                        BLOCK {block.blockNumber} - PARTICIPATING REINSURERS / BROKERS
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            <Box sx={{ p: 3 }}>
                                                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a', mb: 2 }}>
                                                    {block.treaty.treatyName || `Block ${block.blockNumber} Treaty`}
                                                </Typography>

                                                {block.treaty.layerLines.map((layer, layerIndex) => (
                                                    <Card key={layer.id} sx={{ mb: 2, p: 2, backgroundColor: 'white', border: '1px solid #dee2e6' }}>
                                                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#495057' }}>
                                                            Layer {layerIndex + 1}
                                                        </Typography>
                                                        <ParticipatingSection
                                                            reinsurers={layer.reinsurers}
                                                            brokers={layer.brokers}
                                                            blockId={block.id}
                                                            lineId={layer.id}
                                                            onAddReinsurer={(blockId, _) => handleAddNPReinsurer(blockId, layer.id)}
                                                            onDeleteReinsurer={(blockId, _, reinsurerId) => handleDeleteNPReinsurer(blockId, layer.id, reinsurerId)}
                                                            onReinsurerChange={(blockId, _, reinsurerId, field, value) => handleNPReinsurerChange(blockId, layer.id, reinsurerId, field, value)}
                                                            onAddBroker={(blockId, _) => handleAddNPBroker(blockId, layer.id)}
                                                            onDeleteBroker={(blockId, _, brokerId) => handleDeleteNPBroker(blockId, layer.id, brokerId)}
                                                            onBrokerChange={(blockId, _, brokerId, field, value) => handleNPBrokerChange(blockId, layer.id, brokerId, field, value)}
                                                            onAddBrokerReinsurer={(blockId, _, brokerId) => handleAddNPBrokerReinsurer(blockId, layer.id, brokerId)}
                                                            onDeleteBrokerReinsurer={(blockId, _, brokerId, reinsurerId) => handleDeleteNPBrokerReinsurer(blockId, layer.id, brokerId, reinsurerId)}
                                                            onBrokerReinsurerChange={(blockId, _, brokerId, reinsurerId, field, value) => handleNPBrokerReinsurerChange(blockId, layer.id, brokerId, reinsurerId, field, value)}
                                                        />
                                                    </Card>
                                                ))}
                                            </Box>
                                        </Card>
                                    );
                                })}
                            </Box>
                        )}

                        {/* Navigation Buttons */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                            <Button
                                variant="outlined"
                                onClick={handleBack}
                                disableRipple
                                sx={{
                                    borderColor: '#6c757d !important',
                                    color: '#6c757d !important',
                                    backgroundColor: 'transparent !important',
                                    '&:hover': {
                                        borderColor: '#6c757d !important',
                                        backgroundColor: '#e9ecef !important',
                                        color: '#6c757d !important'
                                    },
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    px: 4,
                                    py: 1.5
                                }}
                            >
                                Back
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleNext}
                                sx={{
                                    backgroundColor: '#007bff',
                                    '&:hover': { backgroundColor: '#0056b3' },
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    px: 4,
                                    py: 1.5
                                }}
                            >
                                Next
                            </Button>
                        </Box>
                    </Box>
                )}

                {/* Step 5: Additional Configuration */}
                {activeStep === 4 && (
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a1a1a', mb: 3 }}>
                            Additional Configuration
                        </Typography>

                        {selectMode === 'Treaty (Proportional)' && (
                            <Box>
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
                                                        BLOCK {block.blockNumber} - ADDITIONAL CONFIGURATION
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            <Box sx={{ p: 3 }}>
                                                {block.treaties.map((treaty, treatyIndex) => (
                                                    <Card key={treaty.id} sx={{ mb: 2, p: 3, backgroundColor: 'white', border: '1px solid #dee2e6' }}>
                                                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a', mb: 2 }}>
                                                            Treaty {block.blockNumber}{treatyIndex + 1}: {treaty.treatyName || `Block ${block.blockNumber} Treaty ${treatyIndex + 1}`}
                                                        </Typography>

                                                        <Card sx={{ p: 3, backgroundColor: '#f8f9fa', border: '1px solid #dee2e6' }}>
                                                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 3, color: '#495057', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                                                Additional Configurations
                                                            </Typography>
                                                            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                                                                <Button
                                                                    variant="outlined"
                                                                    startIcon={<Box component="span" sx={{ fontSize: '16px' }}>📊</Box>}
                                                                    sx={{
                                                                        p: 2,
                                                                        borderColor: '#007bff',
                                                                        color: '#007bff',
                                                                        backgroundColor: 'white',
                                                                        textTransform: 'none',
                                                                        fontWeight: 600,
                                                                        justifyContent: 'flex-start',
                                                                        '&:hover': {
                                                                            borderColor: '#0056b3',
                                                                            backgroundColor: '#f8f9ff'
                                                                        }
                                                                    }}
                                                                >
                                                                    Profit Commission
                                                                </Button>
                                                                <Button
                                                                    variant="outlined"
                                                                    startIcon={<Box component="span" sx={{ fontSize: '16px' }}>⚖️</Box>}
                                                                    sx={{
                                                                        p: 2,
                                                                        borderColor: '#6c757d',
                                                                        color: '#6c757d',
                                                                        backgroundColor: 'white',
                                                                        textTransform: 'none',
                                                                        fontWeight: 600,
                                                                        justifyContent: 'flex-start',
                                                                        '&:hover': {
                                                                            borderColor: '#495057',
                                                                            backgroundColor: '#f8f9fa'
                                                                        }
                                                                    }}
                                                                >
                                                                    Sliding Scale Commission
                                                                </Button>
                                                                <Button
                                                                    variant="outlined"
                                                                    startIcon={<Box component="span" sx={{ fontSize: '16px' }}>🔄</Box>}
                                                                    sx={{
                                                                        p: 2,
                                                                        borderColor: '#28a745',
                                                                        color: '#28a745',
                                                                        backgroundColor: 'white',
                                                                        textTransform: 'none',
                                                                        fontWeight: 600,
                                                                        justifyContent: 'flex-start',
                                                                        '&:hover': {
                                                                            borderColor: '#218838',
                                                                            backgroundColor: '#f8fff9'
                                                                        }
                                                                    }}
                                                                >
                                                                    Reinstatement
                                                                </Button>
                                                                <Button
                                                                    variant="outlined"
                                                                    startIcon={<Box component="span" sx={{ fontSize: '16px' }}>🔒</Box>}
                                                                    sx={{
                                                                        p: 2,
                                                                        borderColor: '#ffc107',
                                                                        color: '#856404',
                                                                        backgroundColor: 'white',
                                                                        textTransform: 'none',
                                                                        fontWeight: 600,
                                                                        justifyContent: 'flex-start',
                                                                        '&:hover': {
                                                                            borderColor: '#e0a800',
                                                                            backgroundColor: '#fffdf5'
                                                                        }
                                                                    }}
                                                                >
                                                                    Special Conditions
                                                                </Button>
                                                            </Box>
                                                        </Card>
                                                    </Card>
                                                ))}
                                            </Box>
                                        </Card>
                                    );
                                })}
                            </Box>
                        )}

                        {selectMode === 'Treaty (Non Proportional)' && (
                            <Box>
                                {nonProportionalBlocks.map((block) => {
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
                                                        BLOCK {block.blockNumber} - ADDITIONAL CONFIGURATION
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            <Box sx={{ p: 3 }}>
                                                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a', mb: 2 }}>
                                                    {block.treaty.treatyName || `Block ${block.blockNumber} Treaty`}
                                                </Typography>

                                                <Card sx={{ p: 3, backgroundColor: 'white', border: '1px solid #dee2e6' }}>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 3, color: '#495057', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                                        Additional Configurations
                                                    </Typography>
                                                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                                                        <Button
                                                            variant="outlined"
                                                            startIcon={<Box component="span" sx={{ fontSize: '16px' }}>📊</Box>}
                                                            sx={{
                                                                p: 2,
                                                                borderColor: '#007bff',
                                                                color: '#007bff',
                                                                backgroundColor: 'white',
                                                                textTransform: 'none',
                                                                fontWeight: 600,
                                                                justifyContent: 'flex-start',
                                                                '&:hover': {
                                                                    borderColor: '#0056b3',
                                                                    backgroundColor: '#f8f9ff'
                                                                }
                                                            }}
                                                        >
                                                            Profit Commission
                                                        </Button>
                                                        <Button
                                                            variant="outlined"
                                                            startIcon={<Box component="span" sx={{ fontSize: '16px' }}>⚖️</Box>}
                                                            sx={{
                                                                p: 2,
                                                                borderColor: '#6c757d',
                                                                color: '#6c757d',
                                                                backgroundColor: 'white',
                                                                textTransform: 'none',
                                                                fontWeight: 600,
                                                                justifyContent: 'flex-start',
                                                                '&:hover': {
                                                                    borderColor: '#495057',
                                                                    backgroundColor: '#f8f9fa'
                                                                }
                                                            }}
                                                        >
                                                            Sliding Scale Commission
                                                        </Button>
                                                        <Button
                                                            variant="outlined"
                                                            startIcon={<Box component="span" sx={{ fontSize: '16px' }}>🔄</Box>}
                                                            sx={{
                                                                p: 2,
                                                                borderColor: '#28a745',
                                                                color: '#28a745',
                                                                backgroundColor: 'white',
                                                                textTransform: 'none',
                                                                fontWeight: 600,
                                                                justifyContent: 'flex-start',
                                                                '&:hover': {
                                                                    borderColor: '#218838',
                                                                    backgroundColor: '#f8fff9'
                                                                }
                                                            }}
                                                        >
                                                            Reinstatement
                                                        </Button>
                                                        <Button
                                                            variant="outlined"
                                                            startIcon={<Box component="span" sx={{ fontSize: '16px' }}>🔒</Box>}
                                                            sx={{
                                                                p: 2,
                                                                borderColor: '#ffc107',
                                                                color: '#856404',
                                                                backgroundColor: 'white',
                                                                textTransform: 'none',
                                                                fontWeight: 600,
                                                                justifyContent: 'flex-start',
                                                                '&:hover': {
                                                                    borderColor: '#e0a800',
                                                                    backgroundColor: '#fffdf5'
                                                                }
                                                            }}
                                                        >
                                                            Special Conditions
                                                        </Button>
                                                    </Box>
                                                </Card>
                                            </Box>
                                        </Card>
                                    );
                                })}
                            </Box>
                        )}

                        {/* Navigation Buttons */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                            <Button
                                variant="outlined"
                                onClick={handleBack}
                                disableRipple
                                sx={{
                                    borderColor: '#6c757d !important',
                                    color: '#6c757d !important',
                                    backgroundColor: 'transparent !important',
                                    '&:hover': {
                                        borderColor: '#6c757d !important',
                                        backgroundColor: '#e9ecef !important',
                                        color: '#6c757d !important'
                                    },
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    px: 4,
                                    py: 1.5
                                }}
                            >
                                Back
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                sx={{
                                    backgroundColor: '#28a745',
                                    '&:hover': { backgroundColor: '#218838' },
                                    '&:disabled': { backgroundColor: '#94d3a2' },
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    px: 4,
                                    py: 1.5,
                                    minWidth: 120
                                }}
                            >
                                {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Submit'}
                            </Button>
                        </Box>
                    </Box>
                )}
            </Box>
        </LocalizationProvider>
    );
};

export default TreatyConfig4CreateComponent;
