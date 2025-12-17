export interface Parameter {
    id: string;
    name: string;
    paramterComparisonTypeIds: string[];
    paramterDataTypeId: string;
    paramterUiRenderTypeId: string;
    internalName: string;
    parameterValues: string;
    paramterComparisonTypeNames: string[];
    paramterDataTypeName: string;
    paramterUiRenderTypeName: string;
    isEligibleForProduct: boolean;
    isEligibleForPremium: boolean;
}