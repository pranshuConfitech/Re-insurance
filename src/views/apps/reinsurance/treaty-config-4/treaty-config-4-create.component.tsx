'use client';
import { useState } from 'react';
import { Box, Card, Typography, Button, IconButton, Collapse, Stepper, Step, StepLabel, TextField } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
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
            lossAdviceLimit: '', premiumPaymentWarranty: '', alertDays: ''
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
                                                            onAddReinsurer={handleAddNPReinsurer}
                                                            onDeleteReinsurer={handleDeleteNPReinsurer}
                                                            onReinsurerChange={handleNPReinsurerChange}
                                                            onAddBroker={handleAddNPBroker}
                                                            onDeleteBroker={handleDeleteNPBroker}
                                                            onBrokerChange={handleNPBrokerChange}
                                                            onAddBrokerReinsurer={handleAddNPBrokerReinsurer}
                                                            onDeleteBrokerReinsurer={handleDeleteNPBrokerReinsurer}
                                                            onBrokerReinsurerChange={handleNPBrokerReinsurerChange}
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
                                                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#495057' }}>
                                                                Additional Configuration Settings
                                                            </Typography>
                                                            <Typography variant="body2" sx={{ color: '#6c757d', fontStyle: 'italic' }}>
                                                                Additional configuration options will be implemented here.
                                                                This section can include settings like:
                                                                <br />• Commission structures
                                                                <br />• Special terms and conditions
                                                                <br />• Reporting requirements
                                                                <br />• Settlement procedures
                                                            </Typography>
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
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#495057' }}>
                                                        Additional Configuration Settings
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ color: '#6c757d', fontStyle: 'italic' }}>
                                                        Additional configuration options will be implemented here.
                                                        This section can include settings like:
                                                        <br />• Commission structures
                                                        <br />• Special terms and conditions
                                                        <br />• Reporting requirements
                                                        <br />• Settlement procedures
                                                    </Typography>
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
                                sx={{
                                    backgroundColor: '#28a745',
                                    '&:hover': { backgroundColor: '#218838' },
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    px: 4,
                                    py: 1.5
                                }}
                            >
                                Submit
                            </Button>
                        </Box>
                    </Box>
                )}
            </Box>
        </LocalizationProvider>
    );
};

export default TreatyConfig4CreateComponent;
