export interface ReportField {
  name: string;
  label: string;
  type: 'date' | 'autocomplete' | 'select' | 'text' | 'number' | 'month' | 'year';
  required?: boolean;
  options?: Array<{ label: string; value: string | number }>;
  multiple?: boolean;
  apiEndpoint?: string;
}

export interface ReportCategory {
  categoryKey: string;
  fields: ReportField[];
}

const generateYearOptions = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = 0; i < 10; i++) {
    const year = currentYear - i;
    years.push({ label: year.toString(), value: year });
  }
  return years;
};

const generateMonthOptions = () => [
  { label: 'January', value: 1 },
  { label: 'February', value: 2 },
  { label: 'March', value: 3 },
  { label: 'April', value: 4 },
  { label: 'May', value: 5 },
  { label: 'June', value: 6 },
  { label: 'July', value: 7 },
  { label: 'August', value: 8 },
  { label: 'September', value: 9 },
  { label: 'October', value: 10 },
  { label: 'November', value: 11 },
  { label: 'December', value: 12 },
];

export const REPORT_CATEGORIES: ReportCategory[] = [
  {
    categoryKey: 'PREMIUM_REGISTER',
    fields: [
      { name: 'startDate', label: 'Policy Start Date', type: 'date', required: true },
      { name: 'endDate', label: 'Policy End Date', type: 'date', required: true },
      {
        name: 'branch',
        label: 'Branch',
        type: 'autocomplete',
        required: false,
        apiEndpoint: '/api/branches',
      },
    ],
  },
  {
    categoryKey: 'REGISTERED_PREMIUM',
    fields: [
      { name: 'startDate', label: 'Policy Start Date', type: 'date', required: true },
      { name: 'endDate', label: 'Policy End Date', type: 'date', required: true },
    ],
  },
  {
    categoryKey: 'PREMIUM_PER_MEMBER',
    fields: [
      { name: 'startDate', label: 'Policy Start Date', type: 'date', required: true },
      { name: 'confirmedDate', label: 'Confirmed Date', type: 'date', required: true },
    ],
  },
  {
    categoryKey: 'REGISTERED_CLAIM',
    fields: [
      { name: 'startDate', label: 'Policy Start Date', type: 'date', required: true },
      { name: 'endDate', label: 'Policy End Date', type: 'date', required: true },
    ],
  },
  {
    categoryKey: 'REGISTERED_RECEIPT',
    fields: [
      { name: 'startDate', label: 'Policy Start Date', type: 'date', required: true },
      { name: 'endDate', label: 'Policy End Date', type: 'date', required: true },
    ],
  },
  {
    categoryKey: 'REGISTERED_MEMBER',
    fields: [
      { name: 'startDate', label: 'Policy Start Date', type: 'date', required: true },
      { name: 'endDate', label: 'Policy End Date', type: 'date', required: true },
    ],
  },
  {
    categoryKey: 'DETAILED_CLAIM_REGISTER',
    fields: [
      { name: 'startDate', label: 'Policy Start Date', type: 'date', required: true },
      { name: 'endDate', label: 'Policy End Date', type: 'date', required: true },
    ],
  },
  {
    categoryKey: 'DETAILED_RECEIPT_REGISTER',
    fields: [
      { name: 'startDate', label: 'Policy Start Date', type: 'date', required: true },
      { name: 'endDate', label: 'Policy End Date', type: 'date', required: true },
    ],
  },
  {
    categoryKey: 'DETAILED_PREMIUM_REGISTER',
    fields: [
      { name: 'startDate', label: 'Policy Start Date', type: 'date', required: true },
      { name: 'endDate', label: 'Policy End Date', type: 'date', required: true },
    ],
  },
  {
    categoryKey: 'DETAILED_MEMBER_REGISTER',
    fields: [
      { name: 'startDate', label: 'Policy Start Date', type: 'date', required: true },
      { name: 'endDate', label: 'Policy End Date', type: 'date', required: true },
    ],
  },
  {
    categoryKey: 'WELLNESS_ENROLLMENT',
    fields: [
      { name: 'startDate', label: 'Policy Start Date', type: 'date', required: true },
      { name: 'endDate', label: 'Policy End Date', type: 'date', required: true },
    ],
  },
  {
    categoryKey: 'PROVIDER_PANEL_LIST',
    fields: [
      { name: 'startDate', label: 'Policy Start Date', type: 'date', required: true },
      { name: 'endDate', label: 'Policy End Date', type: 'date', required: true },
    ],
  },
  {
    categoryKey: 'DETAILED_POLICY_REGISTER',
    fields: [
      { name: 'startDate', label: 'Policy Start Date', type: 'date', required: true },
      { name: 'endDate', label: 'Policy End Date', type: 'date', required: true },
    ],
  },
  {
    categoryKey: 'MEMBERSHIP_LIST',
    fields: [
      { name: 'startDate', label: 'Policy Start Date', type: 'date', required: true },
      { name: 'endDate', label: 'Policy End Date', type: 'date', required: true },
    ],
  },
  {
    categoryKey: 'NUMBER_OF_NEW_LIVES',
    fields: [
      { name: 'startDate', label: 'Policy Start Date', type: 'date', required: true },
      { name: 'endDate', label: 'Policy End Date', type: 'date', required: true },
    ],
  },
  {
    categoryKey: 'NUMBER_OF_ACTIVE_LIVES',
    fields: [
      { name: 'startDate', label: 'Policy Start Date', type: 'date', required: true },
      { name: 'endDate', label: 'Policy End Date', type: 'date', required: true },
    ],
  },
  {
    categoryKey: 'NUMBER_OF_RENEWED_LIVES',
    fields: [
      { name: 'startDate', label: 'Policy Start Date', type: 'date', required: true },
      { name: 'endDate', label: 'Policy End Date', type: 'date', required: true },
    ],
  },
  {
    categoryKey: 'HOSPITALIZATION_DETAILS',
    fields: [
      { name: 'startDate', label: 'Policy Start Date', type: 'date', required: true },
      { name: 'endDate', label: 'Policy End Date', type: 'date', required: true },
    ],
  },
  {
    categoryKey: 'DETAILED_BOOKING_REGISTER',
    fields: [
      { name: 'startDate', label: 'Policy Start Date', type: 'date', required: true },
      { name: 'endDate', label: 'Policy End Date', type: 'date', required: true },
    ],
  },
  {
    categoryKey: 'CLAIMS_SUMMARY_REGISTERED',
    fields: [
      { name: 'startDate', label: 'Policy Start Date', type: 'date', required: true },
      { name: 'endDate', label: 'Policy End Date', type: 'date', required: true },
    ],
  },
  {
    categoryKey: 'CLAIMS_SUMMARY_AUDITED',
    fields: [
      { name: 'startDate', label: 'Policy Start Date', type: 'date', required: true },
      { name: 'endDate', label: 'Policy End Date', type: 'date', required: true },
    ],
  },
  {
    categoryKey: 'CLAIMS_SUMMARY_OUTSTANDING',
    fields: [
      { name: 'startDate', label: 'Policy Start Date', type: 'date', required: true },
      { name: 'endDate', label: 'Policy End Date', type: 'date', required: true },
    ],
  },
  {
    categoryKey: 'CLAIMS_SUMMARY_PROVIDER_SUMMARY',
    fields: [
      { name: 'startDate', label: 'Policy Start Date', type: 'date', required: true },
      { name: 'endDate', label: 'Policy End Date', type: 'date', required: true },
    ],
  },
  {
    categoryKey: 'OP_VALID_MEMBERS_LIST',
    fields: [
      { name: 'startDate', label: 'Policy Start Date', type: 'date', required: true },
      { name: 'endDate', label: 'Policy End Date', type: 'date', required: true },
    ],
  },
  {
    categoryKey: 'EXPOSURE_LIST',
    fields: [
      { name: 'startDate', label: 'Policy Start Date', type: 'date', required: true },
      { name: 'endDate', label: 'Policy End Date', type: 'date', required: true },
    ],
  },
  {
    categoryKey: 'COMMISSION_DETAILS',
    fields: [
      { name: 'startDate', label: 'Policy Start Date', type: 'date', required: true },
      { name: 'endDate', label: 'Policy End Date', type: 'date', required: true },
    ],
  },
  {
    categoryKey: 'AGENT_REGISTER_LISTING',
    fields: [
      { name: 'startDate', label: 'Policy Start Date', type: 'date', required: true },
      { name: 'endDate', label: 'Policy End Date', type: 'date', required: true },
    ],
  },
  {
    categoryKey: 'AGENT_REGISTER_PORTFOLIO',
    fields: [
      { name: 'startDate', label: 'Policy Start Date', type: 'date', required: true },
      { name: 'endDate', label: 'Policy End Date', type: 'date', required: true },
    ],
  },
  {
    categoryKey: 'AGENT_REPORT',
    fields: [
      { name: 'startDate', label: 'Policy Start Date', type: 'date', required: true },
      { name: 'endDate', label: 'Policy End Date', type: 'date', required: true },
    ],
  },
  {
    categoryKey: 'PREMIUM_PRODUCTION_AGENT_WISE',
    fields: [
      { name: 'startDate', label: 'Policy Start Date', type: 'date', required: true },
      { name: 'endDate', label: 'Policy End Date', type: 'date', required: true },
    ],
  },
  {
    categoryKey: 'PREMIUM_REGISTER_SUMMARY_REGION',
    fields: [
      { name: 'startDate', label: 'Policy Start Date', type: 'date', required: true },
      { name: 'endDate', label: 'Policy End Date', type: 'date', required: true },
    ],
  },
  {
    categoryKey: 'PREMIUM_REGISTER_SUMMARY_BRANCH',
    fields: [
      { name: 'startDate', label: 'Policy Start Date', type: 'date', required: true },
      { name: 'endDate', label: 'Policy End Date', type: 'date', required: true },
    ],
  },
  {
    categoryKey: 'PREMIUM_REGISTER_SUMMARY_MARKET',
    fields: [
      { name: 'startDate', label: 'Policy Start Date', type: 'date', required: true },
      { name: 'endDate', label: 'Policy End Date', type: 'date', required: true },
    ],
  },
  {
    categoryKey: 'MEMBER_LISTING',
    fields: [
      { name: 'startDate', label: 'Policy Start Date', type: 'date', required: true },
      { name: 'endDate', label: 'Policy End Date', type: 'date', required: true },
      {
        name: 'memberStatus',
        label: 'Member Status',
        type: 'select',
        required: false,
        options: [
          { label: 'Active', value: 'Active' },
          { label: 'Deactive', value: 'Deactive' },
        ],
      },
      {
        name: 'proposer',
        label: 'Proposer',
        type: 'text',
        required: false,
      },
    ],
  },
  {
    categoryKey: 'PROVIDER_ACCREDITATION',
    fields: [
      { name: 'startDate', label: 'Policy Start Date', type: 'date', required: true },
      { name: 'endDate', label: 'Policy End Date', type: 'date', required: true },
    ],
  },
  {
    categoryKey: 'CLIENT_OVERVIEW',
    fields: [
      { name: 'startDate', label: 'Policy Start Date', type: 'date', required: true },
      { name: 'endDate', label: 'Policy End Date', type: 'date', required: true },
    ],
  },
  {
    categoryKey: 'PREMIUM_MIS_REPORT',
    fields: [
      { name: 'startDate', label: 'Policy Start Date', type: 'date', required: true },
      { name: 'endDate', label: 'Policy End Date', type: 'date', required: true },
      {
        name: 'branch',
        label: 'Branch',
        type: 'autocomplete',
        required: false,
        apiEndpoint: 'getBranches',
      },
    ],
  },
  {
    categoryKey: 'INTERMEDIARY_PREMIUM',
    fields: [
      { name: 'startDate', label: 'Policy Start Date', type: 'date', required: true },
      { name: 'endDate', label: 'Policy End Date', type: 'date', required: true },
      {
        name: 'branch',
        label: 'Branch',
        type: 'autocomplete',
        required: false,
        apiEndpoint: 'getBranches',
      },
      {
        name: 'intermediary',
        label: 'Intermediary',
        type: 'text',
        required: false,
      },
    ],
  },
  {
    categoryKey: 'LOST_BUSINESS_REPORT',
    fields: [
      { name: 'startDate', label: 'Policy Start Date', type: 'date', required: true },
      { name: 'endDate', label: 'Policy End Date', type: 'date', required: true },
    ],
  },
  {
    categoryKey: 'POLICIES_DUE_FOR_RENEWAL',
    fields: [
      {
        name: 'year',
        label: 'Year',
        type: 'select',
        required: true,
        options: generateYearOptions(),
      },
      {
        name: 'month',
        label: 'Month',
        type: 'select',
        required: true,
        options: generateMonthOptions(),
      },
      { name: 'startDate', label: 'Policy Start Date', type: 'date', required: true },
      { name: 'endDate', label: 'Policy End Date', type: 'date', required: true },
    ],
  },
  {
    categoryKey: 'POLICIES_NEW_BUSINESS_REPORT',
    fields: [
      { name: 'startDate', label: 'Policy Start Date', type: 'date', required: true },
      { name: 'endDate', label: 'Policy End Date', type: 'date', required: true },
      {
        name: 'branch',
        label: 'Branch',
        type: 'autocomplete',
        required: false,
        apiEndpoint: 'getBranches',
      },
      {
        name: 'intermediary',
        label: 'Intermediary',
        type: 'text',
        required: false,
      },
      {
        name: 'premium',
        label: 'Premium',
        type: 'number',
        required: false,
      },
      {
        name: 'productName',
        label: 'Product Name',
        type: 'text',
        required: false,
      },
    ],
  },
  {
    categoryKey: 'RELATION_MIS_PER_SCHEME',
    fields: [
      { name: 'startDate', label: 'Policy Start Date', type: 'date', required: true },
      { name: 'endDate', label: 'Policy End Date', type: 'date', required: true },
      {
        name: 'proposerName',
        label: 'Proposer Name',
        type: 'text',
        required: false,
      },
    ],
  },
  {
    categoryKey: 'TAT_FOR_PREAUTH',
    fields: [
      { name: 'startDate', label: 'Policy Start Date', type: 'date', required: true },
      { name: 'endDate', label: 'Policy End Date', type: 'date', required: true },
    ],
  },
  {
    categoryKey: 'RELATIONSHIP_MIS_PORTFOLIO',
    fields: [
      { name: 'startDate', label: 'Policy Start Date', type: 'date', required: true },
      { name: 'endDate', label: 'Policy End Date', type: 'date', required: true },
    ],
  },
  {
    categoryKey: 'PREAUTH_DATA',
    fields: [
      { name: 'startDate', label: 'Policy Start Date', type: 'date', required: true },
      { name: 'endDate', label: 'Policy End Date', type: 'date', required: true },
    ],
  },
  {
    categoryKey: 'MEMBER_STATEMENT',
    fields: [
      { name: 'startDate', label: 'Policy Start Date', type: 'date', required: true },
      { name: 'endDate', label: 'Policy End Date', type: 'date', required: true },
    ],
  },
  {
    categoryKey: 'LOSS_RATIO_PER_INDIVIDUAL',
    fields: [
      { name: 'startDate', label: 'Policy Start Date', type: 'date', required: true },
      { name: 'endDate', label: 'Policy End Date', type: 'date', required: true },
    ],
  },
  {
    categoryKey: 'CLAIMS_DATA',
    fields: [
      { name: 'startDate', label: 'Policy Start Date', type: 'date', required: true },
      { name: 'endDate', label: 'Policy End Date', type: 'date', required: true },
    ],
  },
  {
    categoryKey: 'LOSS_RATIO_PER_SCHEME',
    fields: [
      { name: 'startDate', label: 'Policy Start Date', type: 'date', required: true },
      { name: 'endDate', label: 'Policy End Date', type: 'date', required: true },
    ],
  },
  {
    categoryKey: 'FAMILY_SIZE_DISTRIBUTION',
    fields: [
      { name: 'startDate', label: 'Policy Start Date', type: 'date', required: true },
      { name: 'endDate', label: 'Policy End Date', type: 'date', required: true },
      {
        name: 'proposerName',
        label: 'Proposer Name',
        type: 'text',
        required: false,
      },
      {
        name: 'subsidiary',
        label: 'Subsidiary',
        type: 'text',
        required: false,
      },
    ],
  },
  {
    categoryKey: 'BENEFIT_LIMIT',
    fields: [
      { name: 'startDate', label: 'Policy Start Date', type: 'date', required: true },
      { name: 'endDate', label: 'Policy End Date', type: 'date', required: true },
      {
        name: 'proposerName',
        label: 'Proposer Name',
        type: 'text',
        required: false,
      },
    ],
  },
  {
    categoryKey: 'CLAIM_DATA',
    fields: [
      { name: 'startDate', label: 'Policy Start Date', type: 'date', required: true },
      { name: 'endDate', label: 'Policy End Date', type: 'date', required: true },
      {
        name: 'claimCategory',
        label: 'Claim Category',
        type: 'select',
        required: false,
        options: [
          { label: 'In-Patient', value: 'IN_PATIENT' },
          { label: 'Out-Patient', value: 'OUT_PATIENT' },
          { label: 'Maternity', value: 'MATERNITY' },
          { label: 'Dental', value: 'DENTAL' },
          { label: 'Optical', value: 'OPTICAL' },
        ],
      },
      {
        name: 'admissionDate',
        label: 'Admission Date',
        type: 'date',
        required: false,
      },
      {
        name: 'benefitName',
        label: 'Benefit Name',
        type: 'text',
        required: false,
      },
      {
        name: 'subBenefitName',
        label: 'Sub Benefit Name',
        type: 'text',
        required: false,
      },
      {
        name: 'proposerName',
        label: 'Proposer Name',
        type: 'text',
        required: false,
      },
      {
        name: 'intermediary',
        label: 'Intermediary',
        type: 'text',
        required: false,
      },
      {
        name: 'product',
        label: 'Product',
        type: 'text',
        required: false,
      },
      {
        name: 'claimStatus',
        label: 'Claim Status',
        type: 'select',
        required: false,
        options: [
          { label: 'Registered', value: 'REGISTERED' },
          { label: 'Under Process', value: 'UNDER_PROCESS' },
          { label: 'Approved', value: 'APPROVED' },
          { label: 'Rejected', value: 'REJECTED' },
          { label: 'Settled', value: 'SETTLED' },
          { label: 'Closed', value: 'CLOSED' },
        ],
      },
    ],
  },
  {
    categoryKey: 'CLAIMS_ABOVE_GIVEN_AMOUNT',
    fields: [
      { name: 'startDate', label: 'Policy Start Date', type: 'date', required: true },
      { name: 'endDate', label: 'Policy End Date', type: 'date', required: true },
      {
        name: 'treatmentCost',
        label: 'Treatment Cost',
        type: 'number',
        required: false,
      },
      {
        name: 'proposerName',
        label: 'Proposer Name',
        type: 'text',
        required: false,
      },
    ],
  },
];

export const getFieldsForCategory = (categoryKey: string): ReportField[] => {
  const category = REPORT_CATEGORIES.find(
    (cat) => cat.categoryKey === categoryKey
  );
  return category?.fields || [];
};

export const categoryExists = (categoryKey: string): boolean => {
  return REPORT_CATEGORIES.some((cat) => cat.categoryKey === categoryKey);
};

export const VALUE_MAPPINGS: { [key: string]: string } = {
  REGISTERED_PREMIUM: 'DETAILED_PREMIUM_REGISTER',
  PREMIUM_REGISTER: 'DETAILED_PREMIUM_REGISTER',
  REGISTERED_CLAIM: 'DETAILED_CLAIM_REGISTER',
  REGISTERED_RECEIPT: 'DETAILED_RECEIPT_REGISTER',
  REGISTERED_MEMBER: 'DETAILED_MEMBER_REGISTER',
  AGENT_REPORT: 'PREMIUM_PRODUCTION_AGENT_WISE',
  WELLNESS_ENROLLMENT: 'WELLNESS_ENROLLMENT',
  DETAILED_POLICY_REGISTER: 'DETAILED_POLICY_REGISTER',
};
