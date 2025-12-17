export interface Policy {
    clientId: "",
    referenceNumber:"",
    invoiceNumber:"",
    receiptNumber:"",
    policyAndOtherDetails: {
      tpa: "",
      policyNo: "",
      planName: "",
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
      rennewalDate: 0,
      proposerAgents: [
        {
          agentId: "",
          commissionType: "",
          commissionValue: "",
          finalValue: ""
        }
      ],
      proposerTax: [
        {
          taxAmount: 0,
          taxId: ""
        }
      ]
    }
  }