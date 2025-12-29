'use client';
import { useState } from 'react';
import { Box, Card, Typography, Button, IconButton, Collapse } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { TreatyConfigHeader } from './components/TreatyConfigHeader';
import { TopFormSection } from './components/TopFormSection';
import { TreatyFormFields } from './components/TreatyFormFields';
import { RiskLimitsSection } from './components/RiskLimitsSection';
import { NonProportionalSection } from './components/NonProportionalSection';
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
    managementExpenses: string; taxesAndOtherExpenses: string; showRiskLimits: boolean;
    riskLimitLines: RiskLimitLine[];
}

interface Block { id: string; blockNumber: number; treaties: Treaty[]; }

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

interface NonProportionalBlock { id: string; blockNumber: number; treaties: NonProportionalTreaty[]; }

const TreatyConfig4CreateComponent = () => {
    const [selectMode, setSelectMode] = useState('Treaty (Proportional)');
    const [portfolio, setPortfolio] = useState('');
    const [companyUIN, setCompanyUIN] = useState('');
    const [operatingUnitUINs, setOperatingUnitUINs] = useState<string[]>([]);
    const [currentOperatingUIN, setCurrentOperatingUIN] = useState('');
    const [treatyStartDate, setTreatyStartDate] = useState<Date | null>(null);
    const [treatyEndDate, setTreatyEndDate] = useState<Date | null>(null);
    const [currency, setCurrency] = useState('USD');
    const [blocks, setBlocks] = useState<Block[]>([{ id: '1', blockNumber: 1, treaties: [createEmptyTreaty('1-1')] }]);
    const [nonProportionalBlocks, setNonProportionalBlocks] = useState<NonProportionalBlock[]>([{ id: '1', blockNumber: 1, treaties: [createEmptyNonProportionalTreaty('1-1')] }]);

    function createEmptyTreaty(id: string): Treaty {
        return {
            id, treatyCode: '', priority: '', treatyType: 'Quota Share', treatyName: '',
            businessTreatyReferenceNumber: '', riGradedRet: '', formerTreatyCode: '',
            treatyCategory: '', installment: '', processingPortfolioMethod: 'Clean Cut',
            premReserveRetainedRate: '', premReserveInterestRate: '',
            portfolioPremiumEntryRate: '', portfolioClaimEntryRate: '',
            portfolioPremWithdRate: '', portfolioClaimWithdRate: '',
            managementExpenses: '', taxesAndOtherExpenses: '', showRiskLimits: false,
            riskLimitLines: [createEmptyRiskLimitLine('1')]
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
            treatyCategory: '', treatyStatus: '', treatyCurrency: '', discussion: '',
            annualAggregateLimit: '', annualAggDeductible: '', totalNumberOfRI: '',
            capacity: '', xolBasisForShare: '', xolReinstmtForPremio: '',
            xolReinstmtForPremioYes: '', proRataOfAmount: '', proRataOfTime: '',
            sumInsuredRate: '', sumInsuredOccurRate: '', premiumOccurRate: '',
            perXlSumInsuredPerRiskLimit: '', processingPortfolioMethod: 'Clean Cut',
            premReserveRetainedRate: '', premReserveInterestRate: '', showLayers: false,
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
        setBlocks([...blocks, { id: String(newBlockNumber), blockNumber: newBlockNumber, treaties: [createEmptyTreaty(`${newBlockNumber}-1`)] }]);
    };

    const handleDeleteBlock = (blockId: string) => {
        if (blocks.length > 1) setBlocks(blocks.filter(block => block.id !== blockId));
    };

    const handleAddTreaty = (blockId: string) => {
        setBlocks(blocks.map(block => {
            if (block.id === blockId && block.treaties.length < 9) {
                return { ...block, treaties: [...block.treaties, createEmptyTreaty(`${blockId}-${block.treaties.length + 1}`)] };
            }
            return block;
        }));
    };

    const handleDeleteTreaty = (blockId: string, treatyId: string) => {
        setBlocks(blocks.map(block => {
            if (block.id === blockId && block.treaties.length > 1) {
                return { ...block, treaties: block.treaties.filter(treaty => treaty.id !== treatyId) };
            }
            return block;
        }));
    };

    const handleTreatyChange = (blockId: string, treatyId: string, field: string, value: string | boolean) => {
        setBlocks(blocks.map(block => {
            if (block.id === blockId) {
                return { ...block, treaties: block.treaties.map(treaty => treaty.id === treatyId ? { ...treaty, [field]: value } : treaty) };
            }
            return block;
        }));
    };

    const toggleRiskLimits = (blockId: string, treatyId: string) => {
        setBlocks(blocks.map(block => {
            if (block.id === blockId) {
                return { ...block, treaties: block.treaties.map(treaty => treaty.id === treatyId ? { ...treaty, showRiskLimits: !treaty.showRiskLimits } : treaty) };
            }
            return block;
        }));
    };

    const handleAddRiskLimitLine = (blockId: string, treatyId: string) => {
        setBlocks(blocks.map(block => {
            if (block.id === blockId) {
                return {
                    ...block,
                    treaties: block.treaties.map(treaty => {
                        if (treaty.id === treatyId) {
                            const newLineId = String(treaty.riskLimitLines.length + 1);
                            return { ...treaty, riskLimitLines: [...treaty.riskLimitLines, createEmptyRiskLimitLine(newLineId)] };
                        }
                        return treaty;
                    })
                };
            }
            return block;
        }));
    };

    const handleDeleteRiskLimitLine = (blockId: string, treatyId: string, lineId: string) => {
        setBlocks(blocks.map(block => {
            if (block.id === blockId) {
                return {
                    ...block,
                    treaties: block.treaties.map(treaty => {
                        if (treaty.id === treatyId && treaty.riskLimitLines.length > 1) {
                            return { ...treaty, riskLimitLines: treaty.riskLimitLines.filter(line => line.id !== lineId) };
                        }
                        return treaty;
                    })
                };
            }
            return block;
        }));
    };

    const handleRiskLimitLineChange = (blockId: string, treatyId: string, lineId: string, field: string, value: string) => {
        setBlocks(blocks.map(block => {
            if (block.id === blockId) {
                return {
                    ...block,
                    treaties: block.treaties.map(treaty => {
                        if (treaty.id === treatyId) {
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
    const handleAddReinsurer = (blockId: string, treatyId: string, lineId: string) => {
        setBlocks(blocks.map(block => {
            if (block.id === blockId) {
                return {
                    ...block,
                    treaties: block.treaties.map(treaty => {
                        if (treaty.id === treatyId) {
                            return {
                                ...treaty,
                                riskLimitLines: treaty.riskLimitLines.map(line => {
                                    if (line.id === lineId) {
                                        const newReinsurerId = String(line.reinsurers.length + 1);
                                        return { ...line, reinsurers: [...line.reinsurers, createEmptyReinsurer(newReinsurerId)] };
                                    }
                                    return line;
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

    const handleDeleteReinsurer = (blockId: string, treatyId: string, lineId: string, reinsurerId: string) => {
        setBlocks(blocks.map(block => {
            if (block.id === blockId) {
                return {
                    ...block,
                    treaties: block.treaties.map(treaty => {
                        if (treaty.id === treatyId) {
                            return {
                                ...treaty,
                                riskLimitLines: treaty.riskLimitLines.map(line => {
                                    if (line.id === lineId) {
                                        return { ...line, reinsurers: line.reinsurers.filter(r => r.id !== reinsurerId) };
                                    }
                                    return line;
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

    const handleReinsurerChange = (blockId: string, treatyId: string, lineId: string, reinsurerId: string, field: string, value: string) => {
        setBlocks(blocks.map(block => {
            if (block.id === blockId) {
                return {
                    ...block,
                    treaties: block.treaties.map(treaty => {
                        if (treaty.id === treatyId) {
                            return {
                                ...treaty,
                                riskLimitLines: treaty.riskLimitLines.map(line => {
                                    if (line.id === lineId) {
                                        return {
                                            ...line,
                                            reinsurers: line.reinsurers.map(r =>
                                                r.id === reinsurerId ? { ...r, [field]: value } : r
                                            )
                                        };
                                    }
                                    return line;
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

    // Broker handlers
    const handleAddBroker = (blockId: string, treatyId: string, lineId: string) => {
        setBlocks(blocks.map(block => {
            if (block.id === blockId) {
                return {
                    ...block,
                    treaties: block.treaties.map(treaty => {
                        if (treaty.id === treatyId) {
                            return {
                                ...treaty,
                                riskLimitLines: treaty.riskLimitLines.map(line => {
                                    if (line.id === lineId) {
                                        const newBrokerId = String(line.brokers.length + 1);
                                        return { ...line, brokers: [...line.brokers, createEmptyBroker(newBrokerId)] };
                                    }
                                    return line;
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

    const handleDeleteBroker = (blockId: string, treatyId: string, lineId: string, brokerId: string) => {
        setBlocks(blocks.map(block => {
            if (block.id === blockId) {
                return {
                    ...block,
                    treaties: block.treaties.map(treaty => {
                        if (treaty.id === treatyId) {
                            return {
                                ...treaty,
                                riskLimitLines: treaty.riskLimitLines.map(line => {
                                    if (line.id === lineId) {
                                        return { ...line, brokers: line.brokers.filter(b => b.id !== brokerId) };
                                    }
                                    return line;
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

    const handleBrokerChange = (blockId: string, treatyId: string, lineId: string, brokerId: string, field: string, value: string) => {
        setBlocks(blocks.map(block => {
            if (block.id === blockId) {
                return {
                    ...block,
                    treaties: block.treaties.map(treaty => {
                        if (treaty.id === treatyId) {
                            return {
                                ...treaty,
                                riskLimitLines: treaty.riskLimitLines.map(line => {
                                    if (line.id === lineId) {
                                        return {
                                            ...line,
                                            brokers: line.brokers.map(b =>
                                                b.id === brokerId ? { ...b, [field]: value } : b
                                            )
                                        };
                                    }
                                    return line;
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

    // Broker's Reinsurer handlers
    const handleAddBrokerReinsurer = (blockId: string, treatyId: string, lineId: string, brokerId: string) => {
        setBlocks(blocks.map(block => {
            if (block.id === blockId) {
                return {
                    ...block,
                    treaties: block.treaties.map(treaty => {
                        if (treaty.id === treatyId) {
                            return {
                                ...treaty,
                                riskLimitLines: treaty.riskLimitLines.map(line => {
                                    if (line.id === lineId) {
                                        return {
                                            ...line,
                                            brokers: line.brokers.map(b => {
                                                if (b.id === brokerId) {
                                                    const newReinsurerId = String(b.reinsurers.length + 1);
                                                    return { ...b, reinsurers: [...b.reinsurers, createEmptyReinsurer(newReinsurerId)] };
                                                }
                                                return b;
                                            })
                                        };
                                    }
                                    return line;
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

    const handleDeleteBrokerReinsurer = (blockId: string, treatyId: string, lineId: string, brokerId: string, reinsurerId: string) => {
        setBlocks(blocks.map(block => {
            if (block.id === blockId) {
                return {
                    ...block,
                    treaties: block.treaties.map(treaty => {
                        if (treaty.id === treatyId) {
                            return {
                                ...treaty,
                                riskLimitLines: treaty.riskLimitLines.map(line => {
                                    if (line.id === lineId) {
                                        return {
                                            ...line,
                                            brokers: line.brokers.map(b => {
                                                if (b.id === brokerId) {
                                                    return { ...b, reinsurers: b.reinsurers.filter(r => r.id !== reinsurerId) };
                                                }
                                                return b;
                                            })
                                        };
                                    }
                                    return line;
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

    const handleBrokerReinsurerChange = (blockId: string, treatyId: string, lineId: string, brokerId: string, reinsurerId: string, field: string, value: string) => {
        setBlocks(blocks.map(block => {
            if (block.id === blockId) {
                return {
                    ...block,
                    treaties: block.treaties.map(treaty => {
                        if (treaty.id === treatyId) {
                            return {
                                ...treaty,
                                riskLimitLines: treaty.riskLimitLines.map(line => {
                                    if (line.id === lineId) {
                                        return {
                                            ...line,
                                            brokers: line.brokers.map(b => {
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
                                    return line;
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
        setNonProportionalBlocks([...nonProportionalBlocks, { id: String(newBlockNumber), blockNumber: newBlockNumber, treaties: [createEmptyNonProportionalTreaty(`${newBlockNumber}-1`)] }]);
    };

    const handleDeleteNonProportionalBlock = (blockId: string) => {
        if (nonProportionalBlocks.length > 1) setNonProportionalBlocks(nonProportionalBlocks.filter(block => block.id !== blockId));
    };

    const handleAddNonProportionalTreaty = (blockId: string) => {
        setNonProportionalBlocks(nonProportionalBlocks.map(block => {
            if (block.id === blockId && block.treaties.length < 9) {
                return { ...block, treaties: [...block.treaties, createEmptyNonProportionalTreaty(`${blockId}-${block.treaties.length + 1}`)] };
            }
            return block;
        }));
    };

    const handleDeleteNonProportionalTreaty = (blockId: string, treatyId: string) => {
        setNonProportionalBlocks(nonProportionalBlocks.map(block => {
            if (block.id === blockId && block.treaties.length > 1) {
                return { ...block, treaties: block.treaties.filter(treaty => treaty.id !== treatyId) };
            }
            return block;
        }));
    };

    const handleNonProportionalTreatyChange = (blockId: string, treatyId: string, field: string, value: string | boolean) => {
        setNonProportionalBlocks(nonProportionalBlocks.map(block => {
            if (block.id === blockId) {
                return { ...block, treaties: block.treaties.map(treaty => treaty.id === treatyId ? { ...treaty, [field]: value } : treaty) };
            }
            return block;
        }));
    };

    const toggleLayers = (blockId: string, treatyId: string) => {
        setNonProportionalBlocks(nonProportionalBlocks.map(block => {
            if (block.id === blockId) {
                return { ...block, treaties: block.treaties.map(treaty => treaty.id === treatyId ? { ...treaty, showLayers: !treaty.showLayers } : treaty) };
            }
            return block;
        }));
    };

    const handleAddLayer = (blockId: string, treatyId: string) => {
        setNonProportionalBlocks(nonProportionalBlocks.map(block => {
            if (block.id === blockId) {
                return {
                    ...block,
                    treaties: block.treaties.map(treaty => {
                        if (treaty.id === treatyId) {
                            const newLayerId = String(treaty.layerLines.length + 1);
                            return { ...treaty, layerLines: [...treaty.layerLines, createEmptyLayerLine(newLayerId)] };
                        }
                        return treaty;
                    })
                };
            }
            return block;
        }));
    };

    const handleDeleteLayer = (blockId: string, treatyId: string, layerId: string) => {
        setNonProportionalBlocks(nonProportionalBlocks.map(block => {
            if (block.id === blockId) {
                return {
                    ...block,
                    treaties: block.treaties.map(treaty => {
                        if (treaty.id === treatyId && treaty.layerLines.length > 1) {
                            return { ...treaty, layerLines: treaty.layerLines.filter(layer => layer.id !== layerId) };
                        }
                        return treaty;
                    })
                };
            }
            return block;
        }));
    };

    const handleLayerChange = (blockId: string, treatyId: string, layerId: string, field: string, value: string) => {
        setNonProportionalBlocks(nonProportionalBlocks.map(block => {
            if (block.id === blockId) {
                return {
                    ...block,
                    treaties: block.treaties.map(treaty => {
                        if (treaty.id === treatyId) {
                            return {
                                ...treaty,
                                layerLines: treaty.layerLines.map(layer =>
                                    layer.id === layerId ? { ...layer, [field]: value } : layer
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

    // Non-Proportional Reinsurer handlers
    const handleAddNPReinsurer = (blockId: string, treatyId: string, layerId: string) => {
        setNonProportionalBlocks(nonProportionalBlocks.map(block => {
            if (block.id === blockId) {
                return {
                    ...block,
                    treaties: block.treaties.map(treaty => {
                        if (treaty.id === treatyId) {
                            return {
                                ...treaty,
                                layerLines: treaty.layerLines.map(layer => {
                                    if (layer.id === layerId) {
                                        const newReinsurerId = String(layer.reinsurers.length + 1);
                                        return { ...layer, reinsurers: [...layer.reinsurers, createEmptyReinsurer(newReinsurerId)] };
                                    }
                                    return layer;
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

    const handleDeleteNPReinsurer = (blockId: string, treatyId: string, layerId: string, reinsurerId: string) => {
        setNonProportionalBlocks(nonProportionalBlocks.map(block => {
            if (block.id === blockId) {
                return {
                    ...block,
                    treaties: block.treaties.map(treaty => {
                        if (treaty.id === treatyId) {
                            return {
                                ...treaty,
                                layerLines: treaty.layerLines.map(layer => {
                                    if (layer.id === layerId) {
                                        return { ...layer, reinsurers: layer.reinsurers.filter(r => r.id !== reinsurerId) };
                                    }
                                    return layer;
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

    const handleNPReinsurerChange = (blockId: string, treatyId: string, layerId: string, reinsurerId: string, field: string, value: string) => {
        setNonProportionalBlocks(nonProportionalBlocks.map(block => {
            if (block.id === blockId) {
                return {
                    ...block,
                    treaties: block.treaties.map(treaty => {
                        if (treaty.id === treatyId) {
                            return {
                                ...treaty,
                                layerLines: treaty.layerLines.map(layer => {
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
                            };
                        }
                        return treaty;
                    })
                };
            }
            return block;
        }));
    };

    // Non-Proportional Broker handlers
    const handleAddNPBroker = (blockId: string, treatyId: string, layerId: string) => {
        setNonProportionalBlocks(nonProportionalBlocks.map(block => {
            if (block.id === blockId) {
                return {
                    ...block,
                    treaties: block.treaties.map(treaty => {
                        if (treaty.id === treatyId) {
                            return {
                                ...treaty,
                                layerLines: treaty.layerLines.map(layer => {
                                    if (layer.id === layerId) {
                                        const newBrokerId = String(layer.brokers.length + 1);
                                        return { ...layer, brokers: [...layer.brokers, createEmptyBroker(newBrokerId)] };
                                    }
                                    return layer;
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

    const handleDeleteNPBroker = (blockId: string, treatyId: string, layerId: string, brokerId: string) => {
        setNonProportionalBlocks(nonProportionalBlocks.map(block => {
            if (block.id === blockId) {
                return {
                    ...block,
                    treaties: block.treaties.map(treaty => {
                        if (treaty.id === treatyId) {
                            return {
                                ...treaty,
                                layerLines: treaty.layerLines.map(layer => {
                                    if (layer.id === layerId) {
                                        return { ...layer, brokers: layer.brokers.filter(b => b.id !== brokerId) };
                                    }
                                    return layer;
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

    const handleNPBrokerChange = (blockId: string, treatyId: string, layerId: string, brokerId: string, field: string, value: string) => {
        setNonProportionalBlocks(nonProportionalBlocks.map(block => {
            if (block.id === blockId) {
                return {
                    ...block,
                    treaties: block.treaties.map(treaty => {
                        if (treaty.id === treatyId) {
                            return {
                                ...treaty,
                                layerLines: treaty.layerLines.map(layer => {
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
                            };
                        }
                        return treaty;
                    })
                };
            }
            return block;
        }));
    };

    // Non-Proportional Broker's Reinsurer handlers
    const handleAddNPBrokerReinsurer = (blockId: string, treatyId: string, layerId: string, brokerId: string) => {
        setNonProportionalBlocks(nonProportionalBlocks.map(block => {
            if (block.id === blockId) {
                return {
                    ...block,
                    treaties: block.treaties.map(treaty => {
                        if (treaty.id === treatyId) {
                            return {
                                ...treaty,
                                layerLines: treaty.layerLines.map(layer => {
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
                            };
                        }
                        return treaty;
                    })
                };
            }
            return block;
        }));
    };

    const handleDeleteNPBrokerReinsurer = (blockId: string, treatyId: string, layerId: string, brokerId: string, reinsurerId: string) => {
        setNonProportionalBlocks(nonProportionalBlocks.map(block => {
            if (block.id === blockId) {
                return {
                    ...block,
                    treaties: block.treaties.map(treaty => {
                        if (treaty.id === treatyId) {
                            return {
                                ...treaty,
                                layerLines: treaty.layerLines.map(layer => {
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
                            };
                        }
                        return treaty;
                    })
                };
            }
            return block;
        }));
    };

    const handleNPBrokerReinsurerChange = (blockId: string, treatyId: string, layerId: string, brokerId: string, reinsurerId: string, field: string, value: string) => {
        setNonProportionalBlocks(nonProportionalBlocks.map(block => {
            if (block.id === blockId) {
                return {
                    ...block,
                    treaties: block.treaties.map(treaty => {
                        if (treaty.id === treatyId) {
                            return {
                                ...treaty,
                                layerLines: treaty.layerLines.map(layer => {
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
                            };
                        }
                        return treaty;
                    })
                };
            }
            return block;
        }));
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ p: 4, backgroundColor: '#fafafa', minHeight: '100vh' }}>
                <TreatyConfigHeader selectMode={selectMode} onSelectModeChange={setSelectMode} />

                <TopFormSection
                    portfolio={portfolio}
                    companyUIN={companyUIN}
                    currentOperatingUIN={currentOperatingUIN}
                    operatingUnitUINs={operatingUnitUINs}
                    treatyStartDate={treatyStartDate}
                    treatyEndDate={treatyEndDate}
                    currency={currency}
                    onPortfolioChange={setPortfolio}
                    onCompanyUINChange={setCompanyUIN}
                    onCurrentOperatingUINChange={setCurrentOperatingUIN}
                    onAddOperatingUIN={handleAddOperatingUIN}
                    onRemoveOperatingUIN={handleRemoveOperatingUIN}
                    onTreatyStartDateChange={setTreatyStartDate}
                    onTreatyEndDateChange={setTreatyEndDate}
                    onCurrencyChange={setCurrency}
                />

                {selectMode === 'Treaty (Proportional)' && (
                    <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, pb: 2, borderBottom: '2px solid #e0e0e0' }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a' }}>Treaty (Proportional)</Typography>
                            <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddBlock}
                                sx={{
                                    background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                                    '&:hover': { background: 'linear-gradient(135deg, #0e8074 0%, #2dd46a 100%)' },
                                    textTransform: 'none',
                                    boxShadow: '0 4px 15px rgba(17, 153, 142, 0.4)',
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
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    border: `2px solid ${blockColor.accent}20`
                                }}>
                                    <Box sx={{
                                        p: 2.5,
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        background: `linear-gradient(135deg, ${blockColor.header} 0%, ${blockColor.accent}30 100%)`,
                                        borderBottom: `3px solid ${blockColor.accent}`
                                    }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Box sx={{
                                                width: 40,
                                                height: 40,
                                                borderRadius: '10px',
                                                backgroundColor: blockColor.accent,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'white',
                                                fontWeight: 700,
                                                fontSize: '18px',
                                                boxShadow: `0 4px 10px ${blockColor.accent}40`
                                            }}>
                                                {block.blockNumber}
                                            </Box>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#212529', fontSize: '16px' }}>
                                                BLOCK {block.blockNumber} (PROPORTIONAL)
                                            </Typography>
                                        </Box>
                                        {blocks.length > 1 && (
                                            <Button variant="outlined" color="error" size="small" onClick={() => handleDeleteBlock(block.id)}
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
                                                borderRadius: '10px',
                                                border: `2px solid ${blockColor.accent}15`
                                            }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                                    <Typography variant="subtitle2" sx={{
                                                        color: blockColor.accent,
                                                        fontWeight: 600,
                                                        fontSize: '12px',
                                                        letterSpacing: '0.5px',
                                                        textTransform: 'uppercase'
                                                    }}>
                                                        MANDATORY TREATY INFORMATION
                                                    </Typography>
                                                    {block.treaties.length > 1 && (
                                                        <IconButton size="small" color="error" onClick={() => handleDeleteTreaty(block.id, treaty.id)}>
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    )}
                                                </Box>

                                                <TreatyFormFields
                                                    treaty={treaty}
                                                    blockId={block.id}
                                                    treatyId={treaty.id}
                                                    onTreatyChange={handleTreatyChange}
                                                />
                                            </Card>

                                            <Box sx={{ textAlign: 'center', mb: 2 }}>
                                                <Button variant="text" size="small" onClick={() => toggleRiskLimits(block.id, treaty.id)}
                                                    sx={{ color: blockColor.accent, textTransform: 'none', fontSize: '13px', fontWeight: 600 }}>
                                                    {treaty.showRiskLimits ? 'Hide' : 'Show'} / Hide Risk & Limits Details
                                                </Button>
                                            </Box>

                                            <Collapse in={treaty.showRiskLimits}>
                                                <RiskLimitsSection
                                                    riskLimitLines={treaty.riskLimitLines}
                                                    blockId={block.id}
                                                    treatyId={treaty.id}
                                                    onAddLine={handleAddRiskLimitLine}
                                                    onDeleteLine={handleDeleteRiskLimitLine}
                                                    onLineChange={handleRiskLimitLineChange}
                                                    onAddReinsurer={handleAddReinsurer}
                                                    onDeleteReinsurer={handleDeleteReinsurer}
                                                    onReinsurerChange={handleReinsurerChange}
                                                    onAddBroker={handleAddBroker}
                                                    onDeleteBroker={handleDeleteBroker}
                                                    onBrokerChange={handleBrokerChange}
                                                    onAddBrokerReinsurer={handleAddBrokerReinsurer}
                                                    onDeleteBrokerReinsurer={handleDeleteBrokerReinsurer}
                                                    onBrokerReinsurerChange={handleBrokerReinsurerChange}
                                                />
                                            </Collapse>
                                        </Box>
                                    ))}

                                    {block.treaties.length < 9 && (
                                        <Box sx={{ textAlign: 'center', p: 2 }}>
                                            <Button variant="text" startIcon={<AddIcon />} onClick={() => handleAddTreaty(block.id)}
                                                sx={{ color: blockColor.accent, textTransform: 'none', fontWeight: 600 }}>
                                                Add Treaty to this Block
                                            </Button>
                                        </Box>
                                    )}
                                </Card>
                            );
                        })}
                    </Box>
                )}

                {selectMode === 'Treaty (Non Proportional)' && (
                    <NonProportionalSection
                        blocks={nonProportionalBlocks}
                        onAddBlock={handleAddNonProportionalBlock}
                        onDeleteBlock={handleDeleteNonProportionalBlock}
                        onAddTreaty={handleAddNonProportionalTreaty}
                        onDeleteTreaty={handleDeleteNonProportionalTreaty}
                        onTreatyChange={handleNonProportionalTreatyChange}
                        onToggleLayers={toggleLayers}
                        onAddLayer={handleAddLayer}
                        onDeleteLayer={handleDeleteLayer}
                        onLayerChange={handleLayerChange}
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
                )}
            </Box>
        </LocalizationProvider>
    );
};

export default TreatyConfig4CreateComponent;
