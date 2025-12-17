export interface Invoice {
  clientOrProspectType: any
  invoiceType: "",
  invoiceDate: 0,
  clientOrProspectId: "",
  type: "",
  productId: "",
  planId: "",
  totalBeforeDiscountAndLoadingAmount: 0,
  discountType: "",
  discountEnterValue: "",
  totalDiscount: 0,
  loadingType: "",
  loadingEnterValue: "",
  totalLoading: 0,
  totalAfterDiscountAndLoadingAmount: 0,
  totalTaxAmount: 0,
  totalAmountWithTax: 0,
  invoiceCategories: [
    {
      categoryId: "",
      noOfMenber: "",
      premiumAmount: 0
    }
  ],
  invoiceTaxes: [
    {
      taxAmount: 0,
      taxId: "",
      invoiceId: ""
    }
  ],
  invoiceAgents: [
    {
      agentId: "",
      commissionType: "",
      commissionValue: "",
      finalValue: ""
    }
  ]
  quotationId:""
}
