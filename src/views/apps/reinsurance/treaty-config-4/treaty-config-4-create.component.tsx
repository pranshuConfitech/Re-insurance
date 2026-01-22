'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Card, Typography, Button, IconButton, Collapse, Stepper, Step, StepLabel, TextField, CircularProgress } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, parseISO } from 'date-fns';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { TopFormSection } from './components/TopFormSection';
import { TreatyFormFields } from './components/TreatyFormFields';
import { RiskLimitsSection } from './components/RiskLimitsSection';
import { RiskScoreLayersSection } from './components/RiskScoreLayersSection';
import { NonProportionalSection } from './components/NonProportionalSection';
import { ProportionalSection } from './components/ProportionalSection';
import { ParticipatingSection } from './components/ParticipatingSection';
import { PreviewPage } from './components/PreviewPage';
import { getBlockColor } from './utils/blockColors';
import { ReinsuranceService } from '@/services/remote-api/api/reinsurance-services/reinsurance.service';

const reinsuranceService = new ReinsuranceService();

// Yup Validation Schemas
// VALIDATION SCHEMA DISABLED - NO VALIDATION BLOCKING SUBMISSION
/*
const treatyValidationSchema = Yup.object({
    portfolio: Yup.string().required('Portfolio name is required'),
    companyUIN: Yup.string().required('Company UIN is required'),
    treatyStartDate: Yup.date().required('Treaty start date is required'),
    treatyEndDate: Yup.date()
        .required('Treaty end date is required')
        .min(Yup.ref('treatyStartDate'), 'End date must be after start date'),
    currency: Yup.string().required('Currency is required'),
    operatingUnitUINs: Yup.array().min(1, 'At least one operating unit is required'),
    selectMode: Yup.string().required('Treaty mode is required'),
    blocks: Yup.array().when('selectMode', {
        is: 'Treaty (Proportional)',
        then: (schema) => schema.of(
            Yup.object({
                treaties: Yup.array().of(
                    Yup.object({
                        treatyCode: Yup.string().required('Treaty code is required'),
                        treatyName: Yup.string().required('Treaty name is required'),
                        treatyType: Yup.string().required('Treaty type is required'),
                        priority: Yup.string().required('Priority is required')
                    })
                ).min(1, 'At least one treaty is required')
            })
        ).min(1, 'At least one block is required'),
        otherwise: (schema) => schema
    }),
    nonProportionalBlocks: Yup.array().when('selectMode', {
        is: 'Treaty (Non Proportional)',
        then: (schema) => schema.of(
            Yup.object({
                treaty: Yup.object({
                    treatyCode: Yup.string().required('Treaty code is required'),
                    treatyName: Yup.string().required('Treaty name is required'),
                    treatyType: Yup.string().required('Treaty type is required'),
                    priority: Yup.string().required('Priority is required')
                })
            })
        ).min(1, 'At least one block is required'),
        otherwise: (schema) => schema
    })
});
*/

// Helper functions for creating empty objects
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
        riskCommission: '',
        reinsurers: [],
        brokers: []
    };
}

function createEmptyReinsurer(id: string): Reinsurer {
    return { id, reinsurer: '', reinsurerCode: '', share: '' };
}

function createEmptyBroker(id: string): Broker {
    return { id, broker: '', brokerCode: '', share: '', reinsurers: [] };
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

// Initial form values
const getInitialValues = (isEditMode: boolean) => ({
    portfolio: '',
    companyUIN: '',
    operatingUnitUINs: [] as string[],
    currentOperatingUIN: '',
    treatyStartDate: null as Date | null,
    treatyEndDate: null as Date | null,
    currency: 'USD',
    selectMode: 'Treaty (Proportional)',
    blocks: [{ id: '1', blockNumber: 1, treaties: [createEmptyTreaty('1-1')] }] as Block[],
    nonProportionalBlocks: [{ id: '1', blockNumber: 1, treaty: createEmptyNonProportionalTreaty('1') }] as NonProportionalBlock[]
});

interface Reinsurer {
    id: string;
    reinsurer: string;
    reinsurerCode?: string;
    share: string;
}

interface Broker {
    id: string;
    broker: string;
    brokerCode?: string;
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
    riskCommission: string;
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

interface TreatyConfig4CreateComponentProps {
    editId?: string;
}

const TreatyConfig4CreateComponent: React.FC<TreatyConfig4CreateComponentProps> = ({ editId }) => {
    const router = useRouter();
    const isEditMode = !!editId;
    const [loading, setLoading] = useState(isEditMode);
    const [activeStep, setActiveStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // State for API participant data
    const [apiReinsurers, setApiReinsurers] = useState<any[]>([]);
    const [apiBrokers, setApiBrokers] = useState<any[]>([]);

    const steps = ['Basic Detail', 'Treaty Details', 'Risk & Limits Details', 'Participants Reinsurance', 'Special Condition', 'Preview & Submit'];

    // Formik form management
    const formik = useFormik({
        initialValues: getInitialValues(isEditMode),
        // validationSchema: treatyValidationSchema, // DISABLED - No validation blocking submission
        validate: () => ({}), // Always return empty errors object - no validation
        onSubmit: (values) => {
            handleSubmit(values);
        },
        enableReinitialize: true
    });

    // Fetch data for edit mode
    useEffect(() => {
        console.log('Edit mode check - isEditMode:', isEditMode, 'editId:', editId);
        if (isEditMode && editId) {
            console.log('Fetching portfolio data for edit mode, ID:', editId);
            fetchPortfolioData(editId);
        }
    }, [editId, isEditMode]);

    // Fetch API participant data
    useEffect(() => {
        // Fetch reinsurers
        reinsuranceService.getReinsurers({
            page: 0,
            size: 100,
            summary: true,
            active: true
        }).subscribe({
            next: (response) => {
                if (response && response.content && Array.isArray(response.content)) {
                    setApiReinsurers(response.content);
                }
            },
            error: (error) => {
                console.error('Error fetching reinsurers for codes:', error);
            }
        });

        // Fetch brokers
        reinsuranceService.getBrokers({
            page: 0,
            size: 100,
            summary: true,
            active: true
        }).subscribe({
            next: (response) => {
                if (response && response.content && Array.isArray(response.content)) {
                    setApiBrokers(response.content);
                }
            },
            error: (error) => {
                console.error('Error fetching brokers for codes:', error);
            }
        });
    }, []);

    const fetchPortfolioData = (id: string) => {
        setLoading(true);
        console.log('Calling API to fetch portfolio:', id);
        reinsuranceService.getPortfolioTreatyById(id).subscribe({
            next: (response) => {
                console.log('API Response:', response);
                const data = response?.data;
                if (data) {
                    populateFormWithData(data);
                }
                setLoading(false);
            },
            error: (error) => {
                console.error('Error fetching portfolio data:', error);
                alert('Failed to load portfolio data. Please try again.');
                setLoading(false);
            }
        });
    };

    const populateFormWithData = (data: any) => {
        console.log('Populating form with data:', data);

        // Determine treaty type and populate blocks
        const treatyBlocks = data['treaty-blocks'] || [];
        console.log('Treaty blocks:', treatyBlocks);

        let formValues = {
            portfolio: data.portfolioName || '',
            companyUIN: data.insurerId || '',
            currency: data.currency || 'USD',
            treatyStartDate: data.startDate ? parseISO(data.startDate) : null,
            treatyEndDate: data.endDate ? parseISO(data.endDate) : null,
            operatingUnitUINs: data.operatingUnits?.map((ou: any) => ou.ouCode) || [],
            currentOperatingUIN: '',
            selectMode: 'Treaty (Proportional)',
            blocks: [{ id: '1', blockNumber: 1, treaties: [createEmptyTreaty('1-1')] }] as Block[],
            nonProportionalBlocks: [{ id: '1', blockNumber: 1, treaty: createEmptyNonProportionalTreaty('1') }] as NonProportionalBlock[]
        };

        if (treatyBlocks.length > 0) {
            const firstBlock = treatyBlocks[0];
            if (firstBlock.blockType === 'NON_PROPORTIONAL') {
                console.log('Setting Non-Proportional mode');
                formValues.selectMode = 'Treaty (Non Proportional)';
                formValues.nonProportionalBlocks = populateNonProportionalBlocks(treatyBlocks);
            } else {
                console.log('Setting Proportional mode');
                formValues.selectMode = 'Treaty (Proportional)';
                formValues.blocks = populateProportionalBlocks(treatyBlocks);
            }
        }

        // Set all values at once using Formik
        formik.setValues(formValues);

        console.log('Form populated with values:', formValues);
    };

    const populateProportionalBlocks = (treatyBlocks: any[]): Block[] => {
        console.log('Populating proportional blocks:', treatyBlocks);

        const mappedBlocks: Block[] = treatyBlocks.map((block, blockIndex) => {
            console.log(`Processing block ${blockIndex + 1}:`, block);

            return {
                id: String(block.id || blockIndex + 1),
                blockNumber: block.sortOrder || blockIndex + 1,
                treaties: (block.treaties || []).map((treaty: any, treatyIndex: number) => {
                    console.log(`Processing treaty ${treatyIndex + 1}:`, treaty);
                    console.log('Treaty propTreatyAttribute:', treaty.propTreatyAttribute);
                    console.log('Treaty propRiskDetails:', treaty.propRiskDetails);
                    console.log('Treaty portfolioTreatyAllocations:', treaty.portfolioTreatyAllocations);

                    const mappedTreaty = {
                        id: String(treaty.id || `${blockIndex + 1}-${treatyIndex + 1}`),
                        treatyCode: treaty.treatyCode || '',
                        priority: treaty.priority || '',
                        treatyType: mapTreatyType(treaty.treatyType),
                        treatyName: treaty.treatyName || '',
                        businessTreatyReferenceNumber: treaty.refNumber || '',
                        riGradedRet: treaty.gradedRetention ? 'Yes' : 'No',
                        formerTreatyCode: treaty.formerTreatyCode || '',
                        treatyCategory: treaty.treatyCategory || '',
                        installment: mapInstallmentType(treaty.propTreatyAttribute?.installmentType),
                        processingPortfolioMethod: mapProcessingMethod(treaty.processingMethod),
                        premReserveRetainedRate: String(treaty.propTreatyAttribute?.premReserveRetainedRate ?? ''),
                        premReserveInterestRate: String(treaty.propTreatyAttribute?.premReserveInterestRate ?? ''),
                        portfolioPremiumEntryRate: String(treaty.propTreatyAttribute?.portfolioPremEntryRate ?? ''),
                        portfolioClaimEntryRate: String(treaty.propTreatyAttribute?.portfolioClaimEntryRate ?? ''),
                        portfolioPremWithdRate: String(treaty.propTreatyAttribute?.portfolioPremWithdRate ?? ''),
                        portfolioClaimWithdRate: String(treaty.propTreatyAttribute?.portfolioClaimWithdRate ?? ''),
                        managementExpenses: String(treaty.propTreatyAttribute?.mgmtExpensesPercent ?? ''),
                        taxesAndOtherExpenses: String(treaty.propTreatyAttribute?.taxesPercent ?? ''),
                        riskLimitLines: mapRiskLimitLines(treaty.propRiskDetails || []),
                        reinsurers: mapReinsurers(treaty.portfolioTreatyAllocations || []),
                        brokers: mapBrokers(treaty.portfolioTreatyAllocations || [])
                    };

                    console.log('Mapped treaty:', mappedTreaty);
                    return mappedTreaty;
                })
            };
        });

        console.log('Final mapped blocks:', mappedBlocks);
        return mappedBlocks.length > 0 ? mappedBlocks : [{ id: '1', blockNumber: 1, treaties: [createEmptyTreaty('1-1')] }];
    };

    const populateNonProportionalBlocks = (treatyBlocks: any[]): NonProportionalBlock[] => {
        console.log('Populating non-proportional blocks:', treatyBlocks);

        const mappedBlocks: NonProportionalBlock[] = treatyBlocks.map((block, blockIndex) => {
            console.log(`Processing NP block ${blockIndex + 1}:`, block);
            const treaty = block.treaties?.[0] || {};
            console.log('NP Treaty:', treaty);
            console.log('NP Treaty nonpropTreatyAttribute:', treaty.nonpropTreatyAttribute);
            console.log('NP Treaty nonpropLayers:', treaty.nonpropLayers);
            console.log('NP Treaty portfolioTreatyAllocations:', treaty.portfolioTreatyAllocations);

            const mappedTreaty = {
                id: String(treaty.id || blockIndex + 1),
                treatyCode: treaty.treatyCode || '',
                priority: treaty.priority || '',
                treatyType: treaty.treatyType || 'XOL',
                treatyName: treaty.treatyName || '',
                businessTreatyReferenceNumber: treaty.refNumber || '',
                xolType: treaty.xolAttachmentType || treaty.nonpropTreatyAttribute?.basisOfAttachment || '',
                formerTreatyCode: treaty.formerTreatyCode || '',
                treatyCategory: treaty.treatyCategory || '',
                treatyStatus: treaty.status || '',
                treatyCurrency: '', // Not provided in API response
                processing: mapProcessingMethod(treaty.processingMethod || treaty.nonpropTreatyAttribute?.processingPortfolioMethod),
                annualAggregateLimit: String(treaty.nonpropTreatyAttribute?.annualAggLimit || ''),
                annualAggDeductible: String(treaty.nonpropTreatyAttribute?.annualAggDeductible || ''),
                totalReinstatedSI: String(treaty.nonpropTreatyAttribute?.totalReinstatedSi || ''),
                capacity: String(treaty.nonpropTreatyAttribute?.capacity || ''),
                flatRateXOLPrem: String(treaty.nonpropTreatyAttribute?.flatRateXolPrem || ''),
                minDepositXOLPrem: String(treaty.nonpropTreatyAttribute?.minDepositXolPrem || ''),
                noReinstatements: String(treaty.nonpropTreatyAttribute?.noOfReinstatements || ''),
                proRateToAmount: treaty.nonpropTreatyAttribute?.proRateAmount ? 'Yes' : 'No',
                proRateToTime: treaty.nonpropTreatyAttribute?.proRateToTime ? 'Yes' : 'No',
                reserveTypeInvolved: treaty.nonpropTreatyAttribute?.reserveTypeInvolved || '',
                burningCostRate: String(treaty.nonpropTreatyAttribute?.burningCostRate || ''),
                premPaymentWarranty: mapPremiumPaymentWarranty(treaty.nonpropTreatyAttribute?.premiumPaymentWarranty),
                alertDays: String(treaty.nonpropTreatyAttribute?.alertDays || ''),
                perClaimRecoverableLimit: String(treaty.nonpropTreatyAttribute?.perClaimRecoverableLimit || ''),
                processingPortfolioMethod: mapProcessingMethod(treaty.nonpropTreatyAttribute?.processingPortfolioMethod || treaty.processingMethod),
                basisOfAttachment: treaty.nonpropTreatyAttribute?.basisOfAttachment || treaty.xolAttachmentType || '',
                showLayers: (treaty.nonpropLayers?.length || 0) > 0,
                layerLines: mapNonPropLayerLines(treaty.nonpropLayers || []).map(layer => ({
                    ...layer,
                    reinsurers: mapReinsurers(treaty.portfolioTreatyAllocations || []),
                    brokers: mapBrokers(treaty.portfolioTreatyAllocations || [])
                }))
            };

            console.log('Mapped NP treaty:', mappedTreaty);

            return {
                id: String(block.id || blockIndex + 1),
                blockNumber: block.sortOrder || blockIndex + 1,
                treaty: mappedTreaty
            };
        });

        console.log('Final mapped NP blocks:', mappedBlocks);
        return mappedBlocks.length > 0 ? mappedBlocks : [{ id: '1', blockNumber: 1, treaty: createEmptyNonProportionalTreaty('1') }];
    };

    // Helper mapping functions
    const mapTreatyType = (type: string): string => {
        const typeMap: { [key: string]: string } = {
            'QUOTA_SHARE': 'Quota Share',
            'QS': 'Quota Share',
            'SURPLUS': 'Surplus',
            'XOL': 'XOL'
        };
        return typeMap[type] || type || 'Quota Share';
    };

    const mapInstallmentType = (type: string): string => {
        const typeMap: { [key: string]: string } = {
            'M': 'Monthly',
            'MONTHLY': 'Monthly',
            'Q': 'Quarterly',
            'QUARTERLY': 'Quarterly',
            'S': 'Semi-Annual',
            'A': 'Annual',
            'ANNUAL': 'Annual'
        };
        return typeMap[type] || type || '';
    };

    const mapProcessingMethod = (method: string): string => {
        const methodMap: { [key: string]: string } = {
            'STANDARD': 'Clean Cut',
            'AUTO': 'Clean Cut',
            'SYSTEM': 'Clean Cut',
            'CLEAN_CUT': 'Clean Cut'
        };
        return methodMap[method] || method || 'Clean Cut';
    };

    const mapRiskLimitLines = (riskDetails: any[]): RiskLimitLine[] => {
        console.log('Mapping risk limit lines:', riskDetails);

        const mapped = riskDetails.map((risk, index) => {
            const mappedRisk = {
                id: String(risk.id || index + 1),
                productLOB: risk.productLob || '',
                productCode: risk.productCode || '',
                accountingLOB: risk.acctLob || '',
                riskCategory: risk.riskCategory || '',
                riskGrade: risk.riskGrade || '',
                cessionRate: String(risk.cessionRate ?? ''),
                quotaCessionMaxCapacity: String(risk.quotaCessionMaxCapacity ?? ''),
                retentionGrossNet: String(risk.retentionAmount ?? ''),
                surplusCapacity: String(risk.surplusCapacity ?? ''),
                capacityCalculateInXL: String(risk.capacityCalculated ?? ''),
                perRiskRecoveryLimit: String(risk.perRiskRecovery ?? ''),
                eventLimit: String(risk.eventLimit ?? ''),
                cashCallLimit: String(risk.cashCallLimit ?? ''),
                lossAdviceLimit: String(risk.lossAdviceLimit ?? ''),
                premiumPaymentWarranty: risk.premiumPaymentWarranty || '',
                alertDays: String(risk.alertDays ?? ''),
                riskCommission: String(risk.riskCommission ?? ''),
                reinsurers: [],
                brokers: []
            };
            console.log('Mapped risk line:', mappedRisk);
            return mappedRisk;
        });

        return mapped;
    };

    const mapLayerLines = (layers: any[]): LayerLine[] => {
        return layers.map((layer, index) => ({
            id: String(layer.id || index + 1),
            productLOB: layer.productLob || '',
            productCode: layer.productCode || '',
            accountingLOB: layer.accountLob || '',
            riskCategory: layer.riskCategory || '',
            riskGrade: layer.riskGrade || '',
            lossOccurDeductibility: String(layer.lossAdviceLimit || ''),
            lossLimit: String(layer.lossLimit || ''),
            shareOfOccurrenceDeduction: String(layer.shareAggDeductible || ''),
            availableReinstatedSI: String(layer.availableReinstatedSi || ''),
            annualAggLimit: String(layer.shareAggLimit || ''),
            annualAggAmount: '',
            aggClaimAmount: String(layer.aggClaimAmount || ''),
            localNativeLayer: '',
            transactionLimitCcy: '',
            reinsurers: [],
            brokers: []
        }));
    };

    const mapNonPropLayerLines = (layers: any[]): LayerLine[] => {
        console.log('Mapping non-prop layer lines:', layers);

        const mapped = layers.map((layer, index) => {
            const mappedLayer = {
                id: String(layer.id || index + 1),
                productLOB: layer.productLob || '',
                productCode: layer.productCode || '',
                accountingLOB: layer.accountLob || '',
                riskCategory: layer.riskCategory || '',
                riskGrade: layer.riskGrade || '',
                lossOccurDeductibility: String(layer.lossDeductionPriority || ''),
                lossLimit: String(layer.lossLimit || ''),
                shareOfOccurrenceDeduction: String(layer.shareAggDeductible || ''),
                availableReinstatedSI: String(layer.availableReinstatedSi || ''),
                annualAggLimit: String(layer.shareAggLimit || ''),
                annualAggAmount: String(layer.aggClaimAmount || ''),
                aggClaimAmount: String(layer.aggClaimRecovered || ''),
                localNativeLayer: layer.basisOfOccurrence || '',
                transactionLimitCcy: String(layer.lossAdviceLimit || ''),
                reinsurers: [],
                brokers: []
            };
            console.log('Mapped layer line:', mappedLayer);
            return mappedLayer;
        });

        return mapped;
    };

    const mapPremiumPaymentWarranty = (warranty: string): string => {
        const warrantyMap: { [key: string]: string } = {
            'WITHIN_30_DAYS': 'Within 30 Days',
            'WITHIN_45_DAYS': 'Within 45 Days',
            'WITHIN_60_DAYS': 'Within 60 Days',
            'WITHIN_90_DAYS': 'Within 90 Days',
            'QUARTERLY': 'Quarterly',
            'SEMI_ANNUAL': 'Semi-Annual',
            'ANNUAL': 'Annual'
        };
        return warrantyMap[warranty] || warranty || '';
    };

    const mapReinsurers = (allocations: any[]): Reinsurer[] => {
        console.log('Mapping reinsurers from allocations:', allocations);

        const reinsurers = allocations
            .filter((alloc: any) => alloc.participantType === 'REINSURER')
            .map((alloc: any, index: number) => ({
                id: String(alloc.id || index + 1),
                reinsurer: alloc.participantName || '',
                reinsurerCode: alloc.participantCode || '',
                share: String(alloc.sharePercent ?? '')
            }));

        console.log('Mapped reinsurers:', reinsurers);
        return reinsurers;
    };

    const mapBrokers = (allocations: any[]): Broker[] => {
        console.log('Mapping brokers from allocations:', allocations);

        // Check if there are broker breakdowns in REINSURER type allocations
        const brokersFromReinsurers = allocations
            .filter((alloc: any) => alloc.participantType === 'REINSURER' && alloc.brokerBreakdowns?.length > 0)
            .flatMap((alloc: any) =>
                alloc.brokerBreakdowns.map((bd: any, bdIndex: number) => ({
                    id: String(bd.id || bdIndex + 1),
                    broker: bd.reinsurerName || '',
                    brokerCode: '', // Broker breakdowns don't have codes in this structure
                    share: String(bd.sharePercent ?? ''),
                    reinsurers: []
                }))
            );

        // Also get direct BROKER type allocations
        const directBrokers = allocations
            .filter((alloc: any) => alloc.participantType === 'BROKER')
            .map((alloc: any, index: number) => ({
                id: String(alloc.id || index + 1),
                broker: alloc.participantName || '',
                brokerCode: alloc.participantCode || '',
                share: String(alloc.sharePercent ?? ''),
                reinsurers: (alloc.brokerBreakdowns || []).map((bd: any, bdIndex: number) => ({
                    id: String(bd.id || bdIndex + 1),
                    reinsurer: bd.reinsurerName || '',
                    reinsurerCode: '', // Broker breakdowns don't have reinsurer codes
                    share: String(bd.sharePercent ?? '')
                }))
            }));

        const allBrokers = [...brokersFromReinsurers, ...directBrokers];
        console.log('Mapped brokers:', allBrokers);
        return allBrokers;
    };

    const handleAddOperatingUIN = () => {
        const currentOperatingUIN = formik.values.currentOperatingUIN;
        const operatingUnitUINs = formik.values.operatingUnitUINs;

        if (currentOperatingUIN && !operatingUnitUINs.includes(currentOperatingUIN)) {
            formik.setFieldValue('operatingUnitUINs', [...operatingUnitUINs, currentOperatingUIN]);
            formik.setFieldValue('currentOperatingUIN', '');
        }
    };

    const handleRemoveOperatingUIN = (uinToRemove: string) => {
        const operatingUnitUINs = formik.values.operatingUnitUINs;
        formik.setFieldValue('operatingUnitUINs', operatingUnitUINs.filter(uin => uin !== uinToRemove));
    };

    const handleOperatingUnitUINsChange = (newUINs: string[]) => {
        formik.setFieldValue('operatingUnitUINs', newUINs);
    };

    const handleAddBlock = () => {
        const blocks = formik.values.blocks;
        const newBlockNumber = blocks.length + 1;
        const newBlockId = String(newBlockNumber);
        formik.setFieldValue('blocks', [...blocks, { id: newBlockId, blockNumber: newBlockNumber, treaties: [createEmptyTreaty(`${newBlockId}-1`)] }]);
    };

    const handleDeleteBlock = (blockId: string) => {
        const blocks = formik.values.blocks;
        if (blocks.length > 1) {
            formik.setFieldValue('blocks', blocks.filter(block => block.id !== blockId));
        }
    };

    const handleAddTreaty = (blockId: string) => {
        const blocks = formik.values.blocks;
        const updatedBlocks = blocks.map(block => {
            if (block.id === blockId) {
                const newTreatyId = `${blockId}-${block.treaties.length + 1}`;
                return {
                    ...block,
                    treaties: [...block.treaties, createEmptyTreaty(newTreatyId)]
                };
            }
            return block;
        });
        formik.setFieldValue('blocks', updatedBlocks);
    };

    const handleDeleteTreaty = (blockId: string, treatyId: string) => {
        const blocks = formik.values.blocks;
        const updatedBlocks = blocks.map(block => {
            if (block.id === blockId && block.treaties.length > 1) {
                return {
                    ...block,
                    treaties: block.treaties.filter(treaty => treaty.id !== treatyId)
                };
            }
            return block;
        });
        formik.setFieldValue('blocks', updatedBlocks);
    };

    const handleTreatyChange = (blockId: string, treatyId: string, field: string, value: string | boolean) => {
        const blocks = formik.values.blocks;
        const updatedBlocks = blocks.map(block => {
            if (block.id === blockId) {
                return {
                    ...block,
                    treaties: block.treaties.map(treaty =>
                        treaty.id === treatyId ? { ...treaty, [field]: value } : treaty
                    )
                };
            }
            return block;
        });
        formik.setFieldValue('blocks', updatedBlocks);
    };

    const handleAddRiskLimitLine = (blockId: string, treatyId?: string) => {
        const blocks = formik.values.blocks;
        const updatedBlocks = blocks.map(block => {
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
        });
        formik.setFieldValue('blocks', updatedBlocks);
    };

    const handleDeleteRiskLimitLine = (blockId: string, treatyId: string | undefined, lineId: string) => {
        const blocks = formik.values.blocks;
        const updatedBlocks = blocks.map(block => {
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
        });
        formik.setFieldValue('blocks', updatedBlocks);
    };

    const handleRiskLimitLineChange = (blockId: string, treatyId: string | undefined, lineId: string, field: string, value: string) => {
        const blocks = formik.values.blocks;
        const updatedBlocks = blocks.map(block => {
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
        });
        formik.setFieldValue('blocks', updatedBlocks);
    };

    // Reinsurer handlers
    const handleAddReinsurer = (blockId: string, treatyId: string | undefined) => {
        const blocks = formik.values.blocks;
        const updatedBlocks = blocks.map(block => {
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
        });
        formik.setFieldValue('blocks', updatedBlocks);
    };

    const handleDeleteReinsurer = (blockId: string, treatyId: string | undefined, reinsurerId: string) => {
        const blocks = formik.values.blocks;
        const updatedBlocks = blocks.map(block => {
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
        });
        formik.setFieldValue('blocks', updatedBlocks);
    };

    const handleReinsurerChange = (blockId: string, treatyId: string | undefined, reinsurerId: string, field: string, value: string) => {
        const blocks = formik.values.blocks;
        const updatedBlocks = blocks.map(block => {
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
        });
        formik.setFieldValue('blocks', updatedBlocks);
    };

    // Broker handlers
    const handleAddBroker = (blockId: string, treatyId: string | undefined) => {
        const blocks = formik.values.blocks;
        const updatedBlocks = blocks.map(block => {
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
        });
        formik.setFieldValue('blocks', updatedBlocks);
    };

    const handleDeleteBroker = (blockId: string, treatyId: string | undefined, brokerId: string) => {
        const blocks = formik.values.blocks;
        const updatedBlocks = blocks.map(block => {
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
        });
        formik.setFieldValue('blocks', updatedBlocks);
    };

    const handleBrokerChange = (blockId: string, treatyId: string | undefined, brokerId: string, field: string, value: string) => {
        const blocks = formik.values.blocks;
        const updatedBlocks = blocks.map(block => {
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
        });
        formik.setFieldValue('blocks', updatedBlocks);
    };

    // Broker's Reinsurer handlers
    const handleAddBrokerReinsurer = (blockId: string, treatyId: string | undefined, brokerId: string) => {
        const blocks = formik.values.blocks;
        const updatedBlocks = blocks.map(block => {
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
        });
        formik.setFieldValue('blocks', updatedBlocks);
    };

    const handleDeleteBrokerReinsurer = (blockId: string, treatyId: string | undefined, brokerId: string, reinsurerId: string) => {
        const blocks = formik.values.blocks;
        const updatedBlocks = blocks.map(block => {
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
        });
        formik.setFieldValue('blocks', updatedBlocks);
    };

    const handleBrokerReinsurerChange = (blockId: string, treatyId: string | undefined, brokerId: string, reinsurerId: string, field: string, value: string) => {
        const blocks = formik.values.blocks;
        const updatedBlocks = blocks.map(block => {
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
        });
        formik.setFieldValue('blocks', updatedBlocks);
    };

    // Non-Proportional handlers
    const handleAddNonProportionalBlock = () => {
        const nonProportionalBlocks = formik.values.nonProportionalBlocks;
        const newBlockNumber = nonProportionalBlocks.length + 1;
        formik.setFieldValue('nonProportionalBlocks', [...nonProportionalBlocks, { id: String(newBlockNumber), blockNumber: newBlockNumber, treaty: createEmptyNonProportionalTreaty(String(newBlockNumber)) }]);
    };

    const handleDeleteNonProportionalBlock = (blockId: string) => {
        const nonProportionalBlocks = formik.values.nonProportionalBlocks;
        if (nonProportionalBlocks.length > 1) {
            formik.setFieldValue('nonProportionalBlocks', nonProportionalBlocks.filter(block => block.id !== blockId));
        }
    };

    const handleNonProportionalTreatyChange = (blockId: string, field: string, value: string | boolean) => {
        const nonProportionalBlocks = formik.values.nonProportionalBlocks;
        const updatedBlocks = nonProportionalBlocks.map(block => {
            if (block.id === blockId) {
                return { ...block, treaty: { ...block.treaty, [field]: value } };
            }
            return block;
        });
        formik.setFieldValue('nonProportionalBlocks', updatedBlocks);
    };

    const handleAddLayer = (blockId: string) => {
        const nonProportionalBlocks = formik.values.nonProportionalBlocks;
        const updatedBlocks = nonProportionalBlocks.map(block => {
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
        });
        formik.setFieldValue('nonProportionalBlocks', updatedBlocks);
    };

    const handleDeleteLayer = (blockId: string, layerId: string) => {
        const nonProportionalBlocks = formik.values.nonProportionalBlocks;
        const updatedBlocks = nonProportionalBlocks.map(block => {
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
        });
        formik.setFieldValue('nonProportionalBlocks', updatedBlocks);
    };

    const handleLayerChange = (blockId: string, layerId: string, field: string, value: string) => {
        const nonProportionalBlocks = formik.values.nonProportionalBlocks;
        const updatedBlocks = nonProportionalBlocks.map(block => {
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
        });
        formik.setFieldValue('nonProportionalBlocks', updatedBlocks);
    };

    // Non-Proportional Reinsurer handlers
    const handleAddNPReinsurer = (blockId: string, layerId: string) => {
        const nonProportionalBlocks = formik.values.nonProportionalBlocks;
        const updatedBlocks = nonProportionalBlocks.map(block => {
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
        });
        formik.setFieldValue('nonProportionalBlocks', updatedBlocks);
    };

    const handleDeleteNPReinsurer = (blockId: string, layerId: string, reinsurerId: string) => {
        const nonProportionalBlocks = formik.values.nonProportionalBlocks;
        const updatedBlocks = nonProportionalBlocks.map(block => {
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
        });
        formik.setFieldValue('nonProportionalBlocks', updatedBlocks);
    };

    const handleNPReinsurerChange = (blockId: string, layerId: string, reinsurerId: string, field: string, value: string) => {
        const nonProportionalBlocks = formik.values.nonProportionalBlocks;
        const updatedBlocks = nonProportionalBlocks.map(block => {
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
        });
        formik.setFieldValue('nonProportionalBlocks', updatedBlocks);
    };

    // Non-Proportional Broker handlers
    const handleAddNPBroker = (blockId: string, layerId: string) => {
        const nonProportionalBlocks = formik.values.nonProportionalBlocks;
        const updatedBlocks = nonProportionalBlocks.map(block => {
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
        });
        formik.setFieldValue('nonProportionalBlocks', updatedBlocks);
    };

    const handleDeleteNPBroker = (blockId: string, layerId: string, brokerId: string) => {
        const nonProportionalBlocks = formik.values.nonProportionalBlocks;
        const updatedBlocks = nonProportionalBlocks.map(block => {
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
        });
        formik.setFieldValue('nonProportionalBlocks', updatedBlocks);
    };

    const handleNPBrokerChange = (blockId: string, layerId: string, brokerId: string, field: string, value: string) => {
        const nonProportionalBlocks = formik.values.nonProportionalBlocks;
        const updatedBlocks = nonProportionalBlocks.map(block => {
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
        });
        formik.setFieldValue('nonProportionalBlocks', updatedBlocks);
    };

    // Non-Proportional Broker's Reinsurer handlers
    const handleAddNPBrokerReinsurer = (blockId: string, layerId: string, brokerId: string) => {
        const nonProportionalBlocks = formik.values.nonProportionalBlocks;
        const updatedBlocks = nonProportionalBlocks.map(block => {
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
        });
        formik.setFieldValue('nonProportionalBlocks', updatedBlocks);
    };

    const handleDeleteNPBrokerReinsurer = (blockId: string, layerId: string, brokerId: string, reinsurerId: string) => {
        const nonProportionalBlocks = formik.values.nonProportionalBlocks;
        const updatedBlocks = nonProportionalBlocks.map(block => {
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
        });
        formik.setFieldValue('nonProportionalBlocks', updatedBlocks);
    };

    const handleNPBrokerReinsurerChange = (blockId: string, layerId: string, brokerId: string, reinsurerId: string, field: string, value: string) => {
        const nonProportionalBlocks = formik.values.nonProportionalBlocks;
        const updatedBlocks = nonProportionalBlocks.map(block => {
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
        });
        formik.setFieldValue('nonProportionalBlocks', updatedBlocks);
    };

    const handleNext = () => {
        setActiveStep((prevStep) => prevStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };

    const validateStep1 = () => {
        // DISABLED - No validation blocking submission
        return true; // Always allow proceeding to next step
    };

    const validateStep2 = () => {
        // DISABLED - No validation blocking submission  
        return true; // Always allow proceeding to next step
    };

    // Helper function to get participant codes from API data
    const getParticipantCode = (participantName: string, participantType: 'REINSURER' | 'BROKER'): string => {
        if (!participantName || !participantName.trim()) {
            return '';
        }

        if (participantType === 'REINSURER') {
            const reinsurer = apiReinsurers.find(r =>
                r.reinsurerName === participantName || r.reinsurerCode === participantName
            );
            return reinsurer?.reinsurerCode || `RE-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
        } else {
            const broker = apiBrokers.find(b =>
                b.brokerName === participantName || b.brokerCode === participantName
            );
            return broker?.brokerCode || `BRK-${String(Math.floor(Math.random() * 1000)).padStart(4, '0')}`;
        }
    };

    const buildPayload = () => {
        console.log('buildPayload called');
        const {
            portfolio, companyUIN, treatyStartDate, treatyEndDate, currency,
            operatingUnitUINs, selectMode, blocks, nonProportionalBlocks
        } = formik.values;

        console.log('Form values extracted:', {
            portfolio, companyUIN, treatyStartDate, treatyEndDate, currency,
            operatingUnitUINs, selectMode, blocksCount: blocks?.length, npBlocksCount: nonProportionalBlocks?.length
        });

        const formatDate = (date: Date | null) => date ? format(date, 'yyyy-MM-dd') : '';

        if (selectMode === 'Treaty (Proportional)') {
            console.log('Building proportional payload...');
            // Build Proportional payload
            const treatyBlocks = blocks.map((block, blockIndex) => ({
                ...(isEditMode && { id: parseInt(block.id) }),
                ...(isEditMode && { portfolioId: editId }),
                blockType: 'PROPORTIONAL',
                sortOrder: blockIndex + 1,
                treaties: block.treaties.map(treaty => ({
                    ...(isEditMode && { id: parseInt(treaty.id) }),
                    ...(isEditMode && { blockId: block.id }),
                    treatyCode: treaty.treatyCode,
                    priority: treaty.priority || 'PRIMARY',
                    treatyType: treaty.treatyType === 'Quota Share' ? 'QUOTA_SHARE' : treaty.treatyType === 'Surplus' ? 'SURPLUS' : treaty.treatyType.toUpperCase().replace(/\s+/g, '_'),
                    treatyName: treaty.treatyName,
                    refNumber: treaty.businessTreatyReferenceNumber,
                    gradedRetention: treaty.riGradedRet === 'Yes',
                    xolAttachmentType: null,
                    formerTreatyCode: treaty.formerTreatyCode || null,
                    treatyCategory: treaty.treatyCategory || 'PROPORTIONAL',
                    status: 'ACTIVE',
                    processingMethod: treaty.processingPortfolioMethod === 'Clean Cut' ? 'AUTO' : treaty.processingPortfolioMethod?.toUpperCase().replace(/\s+/g, '_') || 'AUTO',
                    propTreatyAttribute: {
                        ...(isEditMode && treaty.id && { id: parseInt(treaty.id) + 100 }), // Approximate attribute ID
                        ...(isEditMode && { portfolioTreatyId: parseInt(treaty.id) }),
                        installmentType: treaty.installment === 'Monthly' ? 'MONTHLY' : treaty.installment === 'Quarterly' ? 'Q' : treaty.installment === 'Semi-Annual' ? 'S' : treaty.installment === 'Annual' ? 'A' : treaty.installment || 'Q',
                        premReserveRetainedRate: parseFloat(treaty.premReserveRetainedRate) || 0,
                        premReserveInterestRate: parseFloat(treaty.premReserveInterestRate) || 0,
                        portfolioPremEntryRate: parseFloat(treaty.portfolioPremiumEntryRate) || 100.0,
                        portfolioClaimEntryRate: parseFloat(treaty.portfolioClaimEntryRate) || 100.0,
                        portfolioClaimWithdRate: parseFloat(treaty.portfolioClaimWithdRate) || 0,
                        portfolioPremWithdRate: parseFloat(treaty.portfolioPremWithdRate) || 0,
                        mgmtExpensesPercent: parseFloat(treaty.managementExpenses) || 0,
                        taxesPercent: parseFloat(treaty.taxesAndOtherExpenses) || 0
                    },
                    nonpropTreatyAttribute: null,
                    propRiskDetails: treaty.riskLimitLines.map((line, lineIndex) => ({
                        ...(isEditMode && { id: parseInt(line.id) + 100 }), // Approximate risk detail ID
                        treatyId: treaty.treatyCode,
                        detailId: null,
                        ...(isEditMode && { portfolioTreatyId: parseInt(treaty.id) }),
                        productLob: line.productLOB || 'FIRE',
                        productCode: line.productCode || 'A001',
                        acctLob: line.accountingLOB || 'COMMERCIAL',
                        riskCategory: line.riskCategory || 'PROPERTY',
                        riskGrade: line.riskGrade || 'G1',
                        quotaCessionMaxCapacity: parseFloat(line.quotaCessionMaxCapacity) || 0,
                        cessionRate: parseFloat(line.cessionRate) || 0,
                        retentionAmount: parseFloat(line.retentionGrossNet) || 0,
                        surplusCapacity: parseFloat(line.surplusCapacity) || 0,
                        capacityCalculated: parseFloat(line.capacityCalculateInXL) || 0,
                        perRiskRecovery: parseFloat(line.perRiskRecoveryLimit) || 0,
                        eventLimit: parseFloat(line.eventLimit) || 0,
                        cashCallLimit: parseFloat(line.cashCallLimit) || 0,
                        lossAdviceLimit: parseFloat(line.lossAdviceLimit) || 0,
                        premiumPaymentWarranty: line.premiumPaymentWarranty || 'YES',
                        alertDays: parseInt(line.alertDays) || 0,
                        riskCommission: parseFloat(line.riskCommission) || 0
                    })),
                    nonpropLayers: [],
                    portfolioTreatyAllocations: [
                        ...treaty.reinsurers.map((r, rIndex) => ({
                            participantType: 'REINSURER',
                            participantName: r.reinsurer,
                            participantCode: getParticipantCode(r.reinsurer, 'REINSURER'),
                            sharePercent: parseFloat(r.share) || 0
                        })),
                        ...treaty.brokers.map((b, bIndex) => ({
                            participantType: 'BROKER',
                            participantName: b.broker,
                            participantCode: getParticipantCode(b.broker, 'BROKER'),
                            sharePercent: parseFloat(b.share) || 0,
                            brokerBreakdowns: b.reinsurers.map((br, brIndex) => ({
                                reinsurerName: br.reinsurer,
                                sharePercent: parseFloat(br.share) || 0
                            }))
                        }))
                    ]
                }))
            }));

            return {
                ...(isEditMode && { id: editId }),
                portfolioName: portfolio,
                insurerId: companyUIN,
                startDate: formatDate(treatyStartDate),
                endDate: formatDate(treatyEndDate),
                currency: currency,
                operatingUnits: operatingUnitUINs.map((ou, index) => ({
                    ...(isEditMode && { id: index + 1 }),
                    ...(isEditMode && { portfolioId: editId }),
                    ouCode: ou
                })),
                'treaty-blocks': treatyBlocks
            };
        } else {
            // Build Non-Proportional payload
            console.log('Building non-proportional payload...');
            const treatyBlocks = nonProportionalBlocks.map((block, blockIndex) => ({
                ...(isEditMode && { id: parseInt(block.id) }),
                ...(isEditMode && { portfolioId: editId }),
                blockType: 'NON_PROPORTIONAL',
                sortOrder: blockIndex + 1,
                treaties: [{
                    ...(isEditMode && { id: parseInt(block.treaty.id) }),
                    ...(isEditMode && { blockId: block.id }),
                    treatyCode: block.treaty.treatyCode,
                    priority: block.treaty.priority || 'PRIMARY',
                    treatyType: block.treaty.treatyType || 'XOL',
                    treatyName: block.treaty.treatyName,
                    refNumber: block.treaty.businessTreatyReferenceNumber,
                    gradedRetention: false,
                    xolAttachmentType: block.treaty.basisOfAttachment || 'LOSS_OCCURRING',
                    formerTreatyCode: block.treaty.formerTreatyCode || null,
                    treatyCategory: block.treaty.treatyCategory || 'PROPERTY',
                    status: block.treaty.treatyStatus || 'ACTIVE',
                    processingMethod: block.treaty.processingPortfolioMethod === 'Clean Cut' ? 'SYSTEM' : block.treaty.processingPortfolioMethod?.toUpperCase().replace(/\s+/g, '_') || 'SYSTEM',
                    propTreatyAttribute: null,
                    nonpropTreatyAttribute: {
                        ...(isEditMode && { id: parseInt(block.treaty.id) + 100 }),
                        detailId: null,
                        ...(isEditMode && { portfolioTreatyId: parseInt(block.treaty.id) }),
                        annualAggLimit: parseFloat(block.treaty.annualAggregateLimit) || 0,
                        annualAggDeductible: parseFloat(block.treaty.annualAggDeductible) || 0,
                        totalReinstatedSi: parseFloat(block.treaty.totalReinstatedSI) || 0,
                        capacity: parseFloat(block.treaty.capacity) || 0,
                        flatRateXolPrem: parseFloat(block.treaty.flatRateXOLPrem) || 0,
                        minDepositXolPrem: parseFloat(block.treaty.minDepositXOLPrem) || 0,
                        noOfReinstatements: parseInt(block.treaty.noReinstatements) || 0,
                        proRateAmount: block.treaty.proRateToAmount === 'Yes',
                        proRateToTime: block.treaty.proRateToTime === 'Yes',
                        reserveTypeInvolved: block.treaty.reserveTypeInvolved || 'LOSS_RESERVE',
                        burningCostRate: parseFloat(block.treaty.burningCostRate) || 0,
                        premiumPaymentWarranty: block.treaty.premPaymentWarranty || 'WITHIN_45_DAYS',
                        alertDays: parseInt(block.treaty.alertDays) || 0,
                        perClaimRecoverableLimit: parseFloat(block.treaty.perClaimRecoverableLimit) || 0,
                        processingPortfolioMethod: block.treaty.processingPortfolioMethod === 'Clean Cut' ? 'AUTO' : block.treaty.processingPortfolioMethod?.toUpperCase().replace(/\s+/g, '_') || 'AUTO',
                        basisOfAttachment: block.treaty.basisOfAttachment || 'LOSS_OCCURRING'
                    },
                    propRiskDetails: [],
                    nonpropLayers: block.treaty.layerLines.map((layer: any, layerIndex: number) => ({
                        ...(isEditMode && { id: parseInt(layer.id) }),
                        ...(isEditMode && { portfolioTreatyId: parseInt(block.treaty.id) }),
                        productLob: layer.productLOB || 'PROPERTY',
                        productCode: layer.productCode || 'PROP-CAT',
                        accountLob: layer.accountingLOB || 'PROP',
                        riskCategory: layer.riskCategory || 'HIGH',
                        riskGrade: layer.riskGrade || 'A',
                        lossDeductionPriority: parseFloat(layer.lossOccurDeductibility) || 0,
                        lossLimit: parseFloat(layer.lossLimit) || 0,
                        basisOfOccurrence: layer.localNativeLayer || 'LOSS_OCCURRING',
                        availableReinstatedSi: parseFloat(layer.availableReinstatedSI) || 0,
                        shareAggDeductible: parseFloat(layer.shareOfOccurrenceDeduction) || 0,
                        shareAggLimit: parseFloat(layer.annualAggLimit) || 0,
                        aggClaimAmount: parseFloat(layer.annualAggAmount) || 0,
                        aggClaimRecovered: parseFloat(layer.aggClaimAmount) || 0,
                        lossAdviceLimit: parseFloat(layer.transactionLimitCcy) || 0,
                        mgmtExpensePercent: 2.4,
                        taxesOtherExpensePercent: 1.3
                    })),
                    portfolioTreatyAllocations: [
                        // Add direct reinsurers from layer allocations (reinsurers not under brokers)
                        ...block.treaty.layerLines.flatMap(layer =>
                            (layer.reinsurers || [])
                                .filter(r => r.reinsurer && r.reinsurer.trim() !== '') // Only include reinsurers with names
                                .map((r, rIndex) => ({
                                    participantType: 'REINSURER',
                                    participantName: r.reinsurer,
                                    participantCode: getParticipantCode(r.reinsurer, 'REINSURER'),
                                    sharePercent: parseFloat(r.share) || 0
                                }))
                        ),
                        // Add brokers from layer allocations (brokers with reinsurers under them)
                        ...block.treaty.layerLines.flatMap(layer =>
                            (layer.brokers || [])
                                .filter(b => b.broker && b.broker.trim() !== '') // Only include brokers with names
                                .map((b, bIndex) => ({
                                    participantType: 'BROKER',
                                    participantName: b.broker,
                                    participantCode: getParticipantCode(b.broker, 'BROKER'),
                                    sharePercent: parseFloat(b.share) || 0,
                                    brokerBreakdowns: (b.reinsurers || [])
                                        .filter(br => br.reinsurer && br.reinsurer.trim() !== '')
                                        .map((br, brIndex) => ({
                                            reinsurerName: br.reinsurer,
                                            sharePercent: parseFloat(br.share) || 0
                                        }))
                                }))
                        )
                    ]
                }]
            }));

            return {
                ...(isEditMode && { id: editId }),
                portfolioName: portfolio || 'Corporate Reinsurance Portfolio',
                insurerId: companyUIN || 'INS-RE-003',
                startDate: formatDate(treatyStartDate),
                endDate: formatDate(treatyEndDate),
                currency: currency,
                operatingUnits: operatingUnitUINs.length > 0
                    ? operatingUnitUINs.map((ou, index) => ({
                        ...(isEditMode && { id: index + 1 }),
                        ...(isEditMode && { portfolioId: editId }),
                        ouCode: ou
                    }))
                    : [{ id: 1, portfolioId: editId, ouCode: 'NP-IN-01' }, { id: 2, portfolioId: editId, ouCode: 'NP-IN-02' }],
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

    const handleSubmit = (values: any) => {
        console.log('handleSubmit called with values:', values);
        setIsSubmitting(true);

        try {
            // Build the actual payload from form values
            let payload = buildPayload();
            console.log('Using actual form payload:', JSON.stringify(payload, null, 2));
            console.log('Treaty mode:', values.selectMode);
            console.log('Edit mode:', isEditMode, 'Edit ID:', editId);

            if (isEditMode && editId) {
                // Update existing portfolio treaty
                console.log('Making UPDATE API call...');
                reinsuranceService.updatePortfolioTreaty(editId, payload).subscribe({
                    next: (response) => {
                        console.log('Update successful:', response);
                        alert(`${values.selectMode} treaty configuration updated successfully!`);
                        setIsSubmitting(false);
                        router.push('/reinsurance/treaty-config-4');
                    },
                    error: (error) => {
                        console.error('Update error:', error);
                        alert(`Failed to update ${values.selectMode.toLowerCase()} treaty configuration. Please try again.`);
                        setIsSubmitting(false);
                    }
                });
            } else {
                // Create new portfolio treaty
                console.log('Making CREATE API call...');
                reinsuranceService.savePortfolioTreaty(payload).subscribe({
                    next: (response) => {
                        console.log('Submit successful:', response);
                        alert(`${values.selectMode} treaty configuration saved successfully!`);
                        setIsSubmitting(false);
                        router.push('/reinsurance/treaty-config-4');
                    },
                    error: (error) => {
                        console.error('Submit error:', error);
                        alert(`Failed to save ${values.selectMode.toLowerCase()} treaty configuration. Please try again.`);
                        setIsSubmitting(false);
                    }
                });
            }
        } catch (error) {
            console.error('Error in handleSubmit:', error);
            alert('An error occurred while processing the form. Please check the console for details.');
            setIsSubmitting(false);
        }
    };

    // Show loading state for edit mode
    if (loading) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', gap: 2 }}>
                <CircularProgress size={40} sx={{ color: '#e91e63' }} />
                <Typography variant="body1" sx={{ color: '#6c757d' }}>
                    Loading portfolio data...
                </Typography>
            </Box>
        );
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ p: 4, backgroundColor: '#fafafa', minHeight: '100vh' }}>
                <Typography variant="h4" sx={{ fontWeight: 600, color: '#1a1a1a', mb: 3 }}>
                    {isEditMode ? 'Edit Reinsurance Definition' : 'Reinsurance Definition'}
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

                {/* Step 1: Basic Detail */}
                {activeStep === 0 && (
                    <Box>
                        <TopFormSection
                            portfolio={formik.values.portfolio}
                            companyUIN={formik.values.companyUIN}
                            currentOperatingUIN={formik.values.currentOperatingUIN}
                            operatingUnitUINs={formik.values.operatingUnitUINs}
                            treatyStartDate={formik.values.treatyStartDate}
                            treatyEndDate={formik.values.treatyEndDate}
                            currency={formik.values.currency}
                            selectMode={formik.values.selectMode}
                            onPortfolioChange={(value) => formik.setFieldValue('portfolio', value)}
                            onCompanyUINChange={(value) => formik.setFieldValue('companyUIN', value)}
                            onCurrentOperatingUINChange={(value) => formik.setFieldValue('currentOperatingUIN', value)}
                            onAddOperatingUIN={handleAddOperatingUIN}
                            onRemoveOperatingUIN={handleRemoveOperatingUIN}
                            onOperatingUnitUINsChange={handleOperatingUnitUINsChange}
                            onTreatyStartDateChange={(date) => formik.setFieldValue('treatyStartDate', date)}
                            onTreatyEndDateChange={(date) => formik.setFieldValue('treatyEndDate', date)}
                            onCurrencyChange={(value) => formik.setFieldValue('currency', value)}
                            onSelectModeChange={(mode) => formik.setFieldValue('selectMode', mode)}
                        />

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                            <Button
                                variant="contained"
                                onClick={handleNext}
                                disabled={false} // DISABLED validation - always allow next
                                sx={{
                                    backgroundColor: '#D80E51',
                                    '&:hover': { backgroundColor: '#b80c43' },
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
                        {formik.values.selectMode === 'Treaty (Proportional)' && (
                            <ProportionalSection
                                blocks={formik.values.blocks}
                                onAddBlock={handleAddBlock}
                                onDeleteBlock={handleDeleteBlock}
                                onAddTreaty={handleAddTreaty}
                                onDeleteTreaty={handleDeleteTreaty}
                                onTreatyChange={handleTreatyChange}
                            />
                        )}

                        {formik.values.selectMode === 'Treaty (Non Proportional)' && (
                            <NonProportionalSection
                                blocks={formik.values.nonProportionalBlocks}
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
                                    backgroundColor: '#D80E51',
                                    '&:hover': { backgroundColor: '#b80c43' },
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

                        {formik.values.selectMode === 'Treaty (Proportional)' && (
                            <Box>
                                {formik.values.blocks.map((block) => {
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

                        {formik.values.selectMode === 'Treaty (Non Proportional)' && (
                            <Box>
                                {formik.values.nonProportionalBlocks.map((block: any) => {
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
                                    backgroundColor: '#D80E51',
                                    '&:hover': { backgroundColor: '#b80c43' },
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

                {/* Step 4: Participants Reinsurance */}
                {activeStep === 3 && (
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a1a1a', mb: 3 }}>
                            Participants Reinsurance
                        </Typography>

                        {formik.values.selectMode === 'Treaty (Proportional)' && (
                            <Box>
                                {formik.values.blocks.map((block) => {
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
                                                        BLOCK {block.blockNumber} - PARTICIPANTS REINSURANCE
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

                        {formik.values.selectMode === 'Treaty (Non Proportional)' && (
                            <Box>
                                {formik.values.nonProportionalBlocks.map((block: any) => {
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
                                                        BLOCK {block.blockNumber} - PARTICIPANTS REINSURANCE
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            <Box sx={{ p: 3 }}>
                                                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a', mb: 2 }}>
                                                    {block.treaty.treatyName || `Block ${block.blockNumber} Treaty`}
                                                </Typography>

                                                {block.treaty.layerLines.map((layer: any, layerIndex: number) => (
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
                                    backgroundColor: '#D80E51',
                                    '&:hover': { backgroundColor: '#b80c43' },
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

                {/* Step 5: Special Condition */}
                {activeStep === 4 && (
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a1a1a', mb: 3 }}>
                            Special Condition
                        </Typography>

                        {formik.values.selectMode === 'Treaty (Proportional)' && (
                            <Box>
                                {formik.values.blocks.map((block) => {
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
                                                        BLOCK {block.blockNumber} - SPECIAL CONDITION
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
                                                                Special Conditions
                                                            </Typography>
                                                            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                                                                <Button
                                                                    variant="outlined"
                                                                    startIcon={<Box component="span" sx={{ fontSize: '16px' }}>📊</Box>}
                                                                    sx={{
                                                                        p: 2,
                                                                        borderColor: '#D80E51',
                                                                        color: '#D80E51',
                                                                        backgroundColor: 'white',
                                                                        textTransform: 'none',
                                                                        fontWeight: 600,
                                                                        justifyContent: 'flex-start',
                                                                        '&:hover': {
                                                                            borderColor: '#b80c43',
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

                        {formik.values.selectMode === 'Treaty (Non Proportional)' && (
                            <Box>
                                {formik.values.nonProportionalBlocks.map((block: any) => {
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
                                                        BLOCK {block.blockNumber} - SPECIAL CONDITION
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            <Box sx={{ p: 3 }}>
                                                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a', mb: 2 }}>
                                                    {block.treaty.treatyName || `Block ${block.blockNumber} Treaty`}
                                                </Typography>

                                                <Card sx={{ p: 3, backgroundColor: 'white', border: '1px solid #dee2e6' }}>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 3, color: '#495057', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                                        Special Conditions
                                                    </Typography>
                                                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                                                        <Button
                                                            variant="outlined"
                                                            startIcon={<Box component="span" sx={{ fontSize: '16px' }}>📊</Box>}
                                                            sx={{
                                                                p: 2,
                                                                borderColor: '#D80E51',
                                                                color: '#D80E51',
                                                                backgroundColor: 'white',
                                                                textTransform: 'none',
                                                                fontWeight: 600,
                                                                justifyContent: 'flex-start',
                                                                '&:hover': {
                                                                    borderColor: '#b80c43',
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
                                onClick={handleNext}
                                sx={{
                                    backgroundColor: '#D80E51',
                                    '&:hover': { backgroundColor: '#b80c43' },
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

                {/* Step 6: Preview & Submit */}
                {activeStep === 5 && (
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a1a1a', mb: 3 }}>
                            Preview & Submit
                        </Typography>

                        <Card sx={{ p: 3, mb: 3, backgroundColor: '#e7f3ff', border: '1px solid #2196f3' }}>
                            <Typography sx={{ fontSize: '14px', color: '#1565c0', fontWeight: 500 }}>
                                📝 Please review all the information below before submitting. You can go back to any step to make changes.
                            </Typography>
                        </Card>

                        <PreviewPage formValues={formik.values} />

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
                                onClick={(e) => {
                                    e.preventDefault();
                                    console.log('Submit button clicked');
                                    console.log('Formik values:', formik.values);
                                    console.log('Formik errors:', formik.errors);
                                    console.log('Formik isValid:', formik.isValid);

                                    // Direct submission - no validation blocking
                                    handleSubmit(formik.values);
                                }}
                                disabled={isSubmitting} // Only disabled when actually submitting
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
                                {isSubmitting ? <CircularProgress size={24} color="inherit" /> : (isEditMode ? 'Update' : 'Submit')}
                            </Button>
                        </Box>
                    </Box>
                )}
            </Box>
        </LocalizationProvider>
    );
};

export default TreatyConfig4CreateComponent;
