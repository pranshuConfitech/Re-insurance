export interface IProduct {
  groupTypeId: any;
  id?: string,
  code?: string,
  productBasicDetails?: IProductBasicDetails,
  productRules?: IProductRule[],
  productServices?: IProductService[]
  summary?: boolean,
  active?: boolean
}

export const defaultProductRequest: IProduct = {
  productBasicDetails: {
    productTypeId: "",
    productMarketId: "",
    clientTypeId: "",
    groupTypeId: "",
    name: "",
    description: "",
    validFrom: 0,
    validUpTo: 0,
    productCurrencyCd: "",
    premiumCurrencyCd: ""
  },
  productRules: [],
  groupTypeId: ""
};

export interface IProductBasicDetails {
  productTypeId: string,
  productMarketId: string,
  clientTypeId: string,
  groupTypeId: string,
  name: string,
  description: string,
  validFrom: number,
  validUpTo: number,
  productCurrencyCd: string,
  premiumCurrencyCd: string
}

export interface IProductConfigurations {
  rules: IProductRule[]
}

export interface IProductRule {
  id: string,
  name: string,
  expression: string,
  expressionConfiugrationStub: string,
  benefitStructureId: string,
  benefitId: string,
  parentId: string
}

export interface IProductService {

  id: number;
  groupId: string;
  serviceIds: string[];
  maxLimitValue: number,
  derievedMaxLimitDto: {
    benefitId: string;
    percentage: number;
    expression: string;
  },
  frequencies: [
    {
      limitFrequencyId: string;
      maxLimit: number;
    }
  ],
  waitingPeriod: number;
  coShareOrPayPercentage: number;
  toBeExcluded: boolean;
}
