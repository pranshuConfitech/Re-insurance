const ReimReviewModel = {
  member: { membershipNo: "", name: "", relations: "", age: 0, policyNumber: "", policyStartDate: 0, policyEndDate: 0 },
  reim: {
    id: "",
    preAuthStatus: "",
    policyNumber: "",
    memberShipNo: "",
    expectedDOA: 0,
    expectedDOD: 0,
    contactNoOne: "",
    contactNoTwo: "",
    referalTicketRequired: "",
    benefitsWithCost: [{
      benefitId: "",
      estimatedCost: 0,
      maxApprovedCost: 0,
      copayAmount: 0,
      comment: "",
      ruleId: "",
      coverType: "",
      benefitName: ""
    }],
    providers: [{
      providerId: "",
      estimatedCost: 0,
      providerName: ""
    }],
    services: [{
      serviceId: "",
      estimatedCost: 0,
      serviceName: ""
    }],
    documents: [{
      documentType: "",
      documentName: "",
      documentOriginalName: "",
      docFormat: ""
    }],
    invoices: [{
      provideId: '',
      invoiceNo: '',
      invoiceDate: 0,
      invoiceDateVal: new Date(),
      invoiceAmount: 0,
      currency: '',
      exchangeRate: 0,
      invoiceAmountKES: 0,
      transactionNo: '',
      payee: '',
      invoiceItems: [
        {
          serviceType: '',
          expenseHead: '',
          rateKes: 0,
          unit: 0,
          totalKes: 0,
          finalTotal: 0,
        },
      ],
    }],
    decission: "",
    comment: ""
  }
};




export default function reimReviewModel() {
  return ReimReviewModel;
}

;

export const REIM_STATUS_MSG_MAP = {
  "PENDING_EVALUATION": "Pending Evaluation",
  "EVALUATION_INPROGRESS": "Evaluation in progress",
  "REQUESTED": "Requested for evaluation",
  "APPROVED": "Approved",
  "REJECTED": "Rejected",
  "ADD_DOC_REQUESTED": "Document requested",
  "APPROVED_FAILED": "Approved failed",
  "READY_FOR_PAYMENT": "Ready for Payment",
  "DRAFT": "Draft",
  "PARTIALLY_APPROVED": "Partially Approved",
  "PENDING_EXGRATIA_APPROVAL": "Pending Exgratia Approval",
  "PENDING_INDEMNITY_APPROVAL": "Pending Indemnity Approval"
}
