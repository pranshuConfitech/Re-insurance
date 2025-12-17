const PreAuthReviewModel = {
  member: { membershipNo: '', name: '', relations: '', age: 0, policyNumber: '', policyStartDate: 0, policyEndDate: 0 },
  preAuth: {
    id: '',
    preAuthStatus: '',
    policyNumber: '',
    memberShipNo: '',
    expectedDOA: 0,
    expectedDOD: 0,
    contactNoOne: '',
    contactNoTwo: '',
    referalTicketRequired: '',
    benefitsWithCost: [
      {
        benefitId: '',
        estimatedCost: 0,
        maxApprovedCost: 0,
        copayAmount: 0,
        comment: '',
        ruleId: '',
        coverType: '',
        benefitName: '',
        approvedCost:''
      },
    ],
    providers: [
      {
        providerId: '',
        estimatedCost: 0,
        providerName: '',
      },
    ],
    services: [
      {
        serviceId: '',
        estimatedCost: 0,
        serviceName: '',
      },
    ],
    documents: [
      {
        documentType: '',
        documentName: '',
        documentOriginalName: '',
        docFormat: '',
      },
    ],
    decission: '',
    comment: '',
  },
};

export default function preAuthReviewModel() {
  return PreAuthReviewModel;
}

export const PRE_AUTH_STATUS_MSG_MAP = {
  PENDING_EVALUATION: 'Pending Evaluation',
  EVALUATION_INPROGRESS: 'Evaluation in progress',
  REQUESTED: 'Requested for Evaluation',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  ADD_DOC_REQUESTED: 'Document Requested',
  APPROVED_FAILED: 'Approved Failed',
  DRAFT: 'Draft',
  WAITING_FOR_CLAIM: 'Waiting for Claim',
  CANCELLED: 'Cancelled',
  REVERTED: 'Reverted',
  CLAIM_INITIATED: 'Claim Initiated',
  ADD_DOC_SUBMITTED: 'Document Submited',
  PENDING_GATEKEPING_DOCTOR_APPROVAL:"Pending Gatekeeping Doctor Approval",
  GATEKEPING_DOCTOR_APPROVED:"Gatekeeping Doctor Approved",
  PENDING_SURVEILLANCE:"Pending Surveillance",
  SURVEILANCE_NOT_NEEDED:"Surveillance not needed",
  GATEKEPING_DOCTOR_REJECTED:"Gatekeeping Doctorn Rejected"
};
