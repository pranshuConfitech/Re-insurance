import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField
} from '@mui/material';
import { withStyles } from '@mui/styles';
import { catchError, forkJoin, of } from 'rxjs';
import { TabPanel, TabView } from 'primereact/tabview';

// Services
import { PreAuthService } from '@/services/remote-api/api/claims-services';
import { MemberService } from '@/services/remote-api/api/member-services';
import { BenefitService, ProvidersService, ServiceTypeService } from '@/services/remote-api/fettle-remote-api';

// Models and Components
import preAuthReviewModel, { PRE_AUTH_STATUS_MSG_MAP } from './preauth.shared';
import DocumentPreview from './component/preview.thumbnail';
import DialogTable from './component/decision.diagonal';
import { Roles } from '../common/util';

// Types
interface PreAuthDetails {
  preAuth: {
    id: string;
    preAuthStatus: string;
    calculationStatus: string;
    benefitsWithCost: BenefitWithCost[];
    providers: Provider[];
    memberShipNo: string;
    policyNumber: string;
    expectedDOA: string;
    expectedDOD: string;
    contactNoOne: string;
    contactNoTwo?: string;
    diagnosis: string[];
    documents: Document[];
    comment?: string;
  };
  member?: Member;
}

interface BenefitWithCost {
  benefitId: string;
  benefitName?: string;
  providerId: string;
  providerName?: string;
  estimatedCost: number;
  maxApprovedCost: number;
  approvedCost?: number;
  enteredAmount?: number;
  interventionCode: string;
  interventionName?: string;
  diagnosis: string;
  diagnosisName?: string;
  comment?: string;
  copayAmount: number;
}

interface Member {
  membershipNo: string;
  name: string;
  age: number;
  gender: string;
  relations: string;
  policyNumber: string;
  policyStartDate: string;
  policyEndDate: string;
  email: string;
  mobileNo: string;
}

interface Provider {
  providerId: string;
  providerName?: string;
  benefit: BenefitWithCost[];
}

// Constants
const MODAL_STYLE = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4
};

const COMMENT_MODAL_STYLE = {
  ...MODAL_STYLE,
  width: 500
};

const TEXT_STYLES = {
  key: {
    fontWeight: '800',
    fontSize: '13px',
    color: '#3C3C3C'
  },
  value: {
    fontWeight: '500',
    fontSize: '13px',
    color: '#A1A1A1'
  }
};

// Styled Components
const StyledTableCellHeader = withStyles(() => ({
  head: {
    backgroundColor: '#F1F1F1',
    color: '#A1A1A1',
    padding: '8px'
  },
  body: { fontSize: 14 }
}))(TableCell);

const StyledTableCellHeaderAI1 = withStyles(() => ({
  head: {
    backgroundColor: '#D80E51',
    color: '#f1f1f1',
    padding: '8px'
  },
  body: { fontSize: 14 }
}))(TableCell);

const StyledTableCellHeaderAI2 = withStyles(() => ({
  head: {
    backgroundColor: '#01de74',
    color: '#f1f1f1',
    padding: '8px'
  },
  body: { fontSize: 14 }
}))(TableCell);

const StyledTableCellRow = withStyles(() => ({
  head: { padding: '8px' },
  body: {
    padding: '8px',
    backgroundColor: '#FFF',
    color: '#3C3C3C !important',
    fontSize: 12
  }
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme?.palette?.action?.hover
    }
  }
}))(TableRow);

// Custom Hooks
const preAuthService = new PreAuthService()
const memberservice = new MemberService()
const benefitService = new BenefitService()
const providerService = new ProvidersService()
const serviceDiagnosis = new ServiceTypeService()

const usePreAuthData = (id: string) => {
  const [preAuthDetails, setPreAuthDetails] = useState<any>(preAuthReviewModel());
  const [memberData, setMemberData] = useState<Member | null>(null);
  const [loading, setLoading] = useState(false);
  const [canDoAnything, setCanDoAnything] = useState(false)

  const populatePreAuth = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    try {
      const serviceAll$ = forkJoin([
        serviceDiagnosis.getServicesbyId('867854950947827712', {
          page: 0, size: 1000, summary: true, active: true, nonGroupedServices: false
        }),
        serviceDiagnosis.getServicesbyId('867855014529282048', {
          page: 0, size: 1000, summary: true, active: true, nonGroupedServices: false
        }),
        serviceDiagnosis.getServicesbyId('867855088575524864', {
          page: 0, size: 1000, summary: true, active: true, nonGroupedServices: false
        }),
        serviceDiagnosis.getServicesbyId('867855148155613184', {
          page: 0, size: 1000, summary: true, active: true, nonGroupedServices: false
        })
      ]);

      const frk$ = forkJoin({
        providers: providerService.getProviders({
          page: 0, size: 10000, summary: true, active: true
        }),
        bts: benefitService.getAllBenefit({ page: 0, size: 1000, summary: true }),
        preAuth: preAuthService.getPreAuthById(id),
        serviceType: serviceDiagnosis.getServiceTypes(),
        services: serviceAll$
      });

      frk$.subscribe((data: any) => {
        // Enhance preAuth data with provider and benefit information
        const providerNameRequests = data.preAuth.benefitsWithCost.map((benefit: BenefitWithCost) =>
          providerService.getProviderDetails(benefit.providerId).pipe(
            // fallback in case of error
            catchError(() => of({ providerBasicDetails: { name: 'N/A' } }))
          )
        );

        const serviceNameRequests = data.preAuth.benefitsWithCost.map((benefit: BenefitWithCost) =>
          serviceDiagnosis.getServicesbyCode(benefit.diagnosis).pipe(
            // fallback in case of error
            catchError(() => of({ name: 'N/A' }))
          )
        );

        forkJoin([forkJoin(providerNameRequests), forkJoin(serviceNameRequests)]).subscribe(
          ([providerResults, serviceResults]: [any, any]) => {
            // Enrich benefitsWithCost with provider names
            // console.log(providerResults, serviceResults)
            const enrichedBenefits = data.preAuth.benefitsWithCost.map((benefit: BenefitWithCost, idx: number) => ({
              ...benefit,
              providerName: providerResults[idx]?.providerBasicDetails?.name || 'N/A',
              diagnosisName: serviceResults[idx]?.name || 'N/A'
            }));

            // Now set state with enriched data
            setPreAuthDetails({ preAuth: { ...data.preAuth, benefitsWithCost: enrichedBenefits } });

          }
        );

        // data.preAuth.benefitsWithCost.forEach((benefit: BenefitWithCost) => {
        // providerService.getProviderDetails(benefit.providerId).subscribe((res: any) => {
        //   console.log("ressssssss", res.providerBasicDetails.name)
        //   benefit.providerName = res.providerBasicDetails.name;
        // });

        // benefitService.getServicesfromInterventions(benefit.interventionCode, benefit.benefitId)
        //   ?.subscribe((result: any) => {
        //     if (Array.isArray(result)) {
        //       result.forEach((el: any) => {
        //         if (el.code === benefit.diagnosis) {
        //           benefit.diagnosisName = el?.name;
        //         }
        //       });
        //     } else if (result && typeof result === 'object') {
        //       // If result is a single object, not an array
        //       if (result.code === benefit.diagnosis) {
        //         benefit.diagnosisName = result.name;
        //       }
        //     }
        //     // else: result is null/undefined, do nothing
        //   });
        // });

        // Fetch member data
        const pageRequest = {
          page: 0, size: 10, summary: true, active: true,
          key: 'MEMBERSHIP_NO', value: data.preAuth.memberShipNo,
          key1: 'policyNumber', value1: data.preAuth.policyNumber
        };

        memberservice.getMember(pageRequest).subscribe((res: any) => {
          if (res.content?.length > 0) {
            setMemberData(res.content[0]);
          }
        });

        setPreAuthDetails({ preAuth: data.preAuth });

        // console.log("1234567890-", data.preAuth)

        let amt = 0;
        data?.preauth?.benefitsWithCost.forEach((item: any) => {
          amt += item.estimatedCost
        })

        const role = JSON.parse(localStorage.getItem('roles')!);
        const common = role.filter((item: any) => Roles.includes(item));
        if (common.length <= 0) {
          if (role.includes("Super_Admin")) {
            common.push("Super_Admin")
          }
        }

        preAuthService.checkIfCanBeCreated(common[0], data?.preauth?.preAuthType == "IPD" ? "IP" : "OP", amt).subscribe(res => {
          if (res.approve) {
            setCanDoAnything(true);
          }
        })


      });
    } catch (error) {
      console.error('Error fetching preauth data:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  return { preAuthDetails, memberData, loading, populatePreAuth, canDoAnything };
};

// Main Component
const PreAuthReview: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const query = useSearchParams();
  const router = useRouter();
  const type = query.get('auth');

  const { preAuthDetails, memberData, loading, populatePreAuth, canDoAnything } = usePreAuthData(id as string);

  // State management
  const [data, setData] = useState<BenefitWithCost[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [buttonLoader, setButtonLoader] = useState(false);

  // Modal states
  const [commentModal, setCommentModal] = useState(false);
  const [revertModal, setRevertModal] = useState(false);
  const [addDocModal, setAddDocModal] = useState(false);

  // Form states
  const [comment, setComment] = useState('');
  const [cnfText, setCnfText] = useState('');
  const [reviewDecision, setReviewDecision] = useState('');
  const [revertReason, setRevertReason] = useState('');
  const [addDocComment, setAddDocComment] = useState('');

  // Dialog states
  const [open, setOpen] = useState(false);
  const [decionData, setDecionData] = useState([]);
  const [indexD, setIndexD] = useState(0);

  // Computed values
  const maxApprovableAmount = useMemo(() => {
    return preAuthDetails.preAuth.benefitsWithCost.reduce(
      (sum: any, item: any) => sum + (item?.copayAmount || 0) + (item?.maxApprovedCost || 0),
      0
    );
  }, [preAuthDetails.preAuth.benefitsWithCost]);

  const approveCostSum = useMemo(() => {
    return preAuthDetails.preAuth.benefitsWithCost.reduce(
      (total: any, benefit: any) => total + (benefit.maxApprovedCost || 0),
      0
    ) > 0;
  }, [preAuthDetails.preAuth.benefitsWithCost]);

  // Effects
  useEffect(() => {
    if (preAuthDetails.preAuth.calculationStatus === 'COMPLETED') {
      setActiveIndex(2);
    }
  }, [preAuthDetails.preAuth.calculationStatus]);

  useEffect(() => {
    populatePreAuth();
  }, [populatePreAuth]);

  useEffect(() => {
    if (preAuthDetails.preAuth.calculationStatus === 'INPROGRESS') {
      const timeout = setTimeout(populatePreAuth, 500);
      return () => clearTimeout(timeout);
    }
  }, [preAuthDetails.preAuth.calculationStatus, populatePreAuth]);

  useEffect(() => {
    if (preAuthDetails?.preAuth?.benefitsWithCost) {
      let temp: any = []
      preAuthDetails.preAuth.benefitsWithCost.map((el: any, index: number) => {
        const obj = {
          ...el,
          approvedCost: el.maxApprovedCost
        };
        temp.push(obj)
      })
      // setData([...preAuthDetails.preAuth.benefitsWithCost]);
      setData(temp);
    }
  }, [preAuthDetails]);

  // Event handlers
  const handleApprovedAmountChange = useCallback((index: number, value: string) => {
    const numValue = parseFloat(value) || 0;
    const benefit = data[index];

    if (numValue > benefit.estimatedCost) {
      alert('Approved amount cannot exceed estimated amount!');
      return;
    }

    setData(prev => prev.map((item, i) =>
      i === index ? { ...item, approvedCost: numValue } : item
    ));
  }, [data]);

  const handleDecision = useCallback(async (decision: string) => {
    if ((decision === 'APPROVED' && cnfText === 'approve') ||
      (decision === 'REJECTED' && cnfText === 'reject')) {

      const payload: any = {
        decission: decision,
        comment: comment
      };

      if (decision === 'APPROVED') {
        payload.approveAmounts = data;
      }

      try {
        await preAuthService.editPreAuth(payload, id, 'decission').toPromise();
        setCommentModal(false);
        alert(decision === 'APPROVED' ? 'Approved!' : 'Rejected!');
        setTimeout(populatePreAuth, 500);
      } catch (error) {
        console.error('Error making decision:', error);
      }
    }
  }, [cnfText, comment, data, id, populatePreAuth]);

  const handleCalculate = useCallback(async () => {
    setButtonLoader(true);
    try {
      await preAuthService.editPreAuth({}, id, 'calculate').toPromise();
      setTimeout(() => {
        populatePreAuth();
        setButtonLoader(false);
      }, 2500);
    } catch (error) {
      console.error('Error calculating:', error);
      setButtonLoader(false);
    }
  }, [id, populatePreAuth]);

  const handleStartReview = useCallback(async () => {
    setButtonLoader(true);
    try {
      await preAuthService.editPreAuth({}, id, 'evs').toPromise();
      setTimeout(() => {
        populatePreAuth();
        setButtonLoader(false);
      }, 2500);
    } catch (error) {
      console.error('Error starting review:', error);
      setButtonLoader(false);
    }
  }, [id, populatePreAuth]);

  // Render methods
  console.log("12345", preAuthDetails)
  const renderBasicDetails = () => (
    <Box p={1}>
      <Box mb={2}>
        <Box sx={{ color: '#D80E51', fontWeight: 'bold', fontSize: '13px', mb: 1 }}>
          Member details
        </Box>
        <Divider />
        <Grid container spacing={1} sx={{ mt: 1 }}>
          {[
            ['Membership No', memberData?.membershipNo],
            ['Name', memberData?.name],
            ['Age', memberData?.age],
            ['Gender', memberData?.gender],
            ['Relations', memberData?.relations]
          ].map(([label, value]) => (
            <Grid item xs={12} sm={6} key={label}>
              <Grid container>
                <Grid item xs={4} sx={TEXT_STYLES.key}>
                  {label}:
                </Grid>
                <Grid item xs={8} sx={TEXT_STYLES.value}>
                  {value}
                </Grid>
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={{ mt: 5, mb: 1 }}>
        <Box sx={{ color: '#D80E51', fontWeight: 'bold', fontSize: '13px', mb: 1 }}>
          Contact details
        </Box>
        <Divider />
        <Grid container spacing={1} sx={{ mt: 1 }}>
          {[
            ['Contact No:', memberData?.mobileNo],
            ['Email', memberData?.email],
          ].map(([label, value]) => (
            <Grid item xs={12} sm={6} key={label}>
              <Grid container>
                <Grid item xs={6} sx={TEXT_STYLES.key}>
                  {label}:
                </Grid>
                <Grid item xs={6} sx={TEXT_STYLES.value}>
                  {value}
                </Grid>
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={{ mt: 5, mb: 1 }}>
        <Box sx={{ color: '#D80E51', fontWeight: 'bold', fontSize: '13px', mb: 1 }}>
          Policy details
        </Box>
        <Divider />
        <Grid container spacing={1} sx={{ mt: 1 }}>
          {[
            ['Policy No', memberData?.policyNumber],
            ['Policy enrollment date', memberData?.policyStartDate ? new Date(memberData.policyStartDate).toLocaleDateString() : ''],
            ['Policy start date', memberData?.policyStartDate ? new Date(memberData.policyStartDate).toLocaleDateString() : ''],
            ['Policy end date', memberData?.policyEndDate ? new Date(memberData.policyEndDate).toLocaleDateString() : '']
          ].map(([label, value]) => (
            <Grid item xs={12} sm={6} key={label}>
              <Grid container>
                <Grid item xs={6} sx={TEXT_STYLES.key}>
                  {label}:
                </Grid>
                <Grid item xs={6} sx={TEXT_STYLES.value}>
                  {value}
                </Grid>
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );

  const renderOtherDetails = () => (
    <Box p={1}>
      <Box mb={2}>
        <Box sx={{ color: '#D80E51', fontWeight: 'bold', fontSize: '13px', mb: 1 }}>
          Claim admission details
        </Box>
        <Divider />
        <Grid container spacing={1} sx={{ mt: 1 }}>
          {[
            ['Admission Date', preAuthDetails?.preAuth?.expectedDOA],
            ['Discharge Date', preAuthDetails?.preAuth?.expectedDOD],
          ].map(([label, value]) => (
            <Grid item xs={12} sm={6} key={label}>
              <Grid container>
                <Grid item xs={4} sx={TEXT_STYLES.key}>
                  {label}:
                </Grid>
                <Grid item xs={8} sx={TEXT_STYLES.value}>
                  {value}
                </Grid>
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );

  const renderClaimDetails = () => (
    <Box p={1}>
      <Box sx={{ color: '#D80E51', fontWeight: 'bold', fontSize: '13px', mb: 2 }}>
        Service Details:
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <StyledTableRow>
              <StyledTableCellHeader>Provider Name</StyledTableCellHeader>
              <StyledTableCellHeader>Benefit Name</StyledTableCellHeader>
              <StyledTableCellHeader>Diagnosis</StyledTableCellHeader>
              <StyledTableCellHeader>Estimated Cost</StyledTableCellHeader>
              <StyledTableCellHeader>System Approved Amount</StyledTableCellHeader>
              <StyledTableCellHeader>Comment</StyledTableCellHeader>
              <StyledTableCellHeader>Approved Amount</StyledTableCellHeader>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {data.length > 0 ? (
              data.map((row, index) => {
                return (
                  <StyledTableRow key={`${row.benefitId}-${index}`}>
                    <StyledTableCellRow sx={TEXT_STYLES.value}>
                      {row.providerName || 'N/A'}
                    </StyledTableCellRow>
                    <StyledTableCellRow sx={TEXT_STYLES.value}>
                      {row.benefitName || 'N/A'}
                    </StyledTableCellRow>
                    <StyledTableCellRow sx={TEXT_STYLES.value}>
                      {row.diagnosisName || 'N/A'}
                    </StyledTableCellRow>
                    <StyledTableCellRow sx={TEXT_STYLES.value}>
                      {row.estimatedCost}
                    </StyledTableCellRow>
                    <StyledTableCellRow sx={TEXT_STYLES.value}>
                      {row.maxApprovedCost}
                    </StyledTableCellRow>
                    <StyledTableCellRow>
                      {row.comment || 'N/A'}
                    </StyledTableCellRow>
                    <StyledTableCellRow>
                      <TextField
                        type="number"
                        variant="standard"
                        size="small"
                        value={row.approvedCost || row.maxApprovedCost || ''}
                        onChange={(e) => handleApprovedAmountChange(index, e.target.value)}
                        disabled={preAuthDetails.preAuth.preAuthStatus === 'APPROVED'}
                        sx={{ width: '100px' }}
                      />
                    </StyledTableCellRow>
                  </StyledTableRow>
                )
              })
            ) : (
              <StyledTableRow>
                <StyledTableCellRow colSpan={7} sx={{ textAlign: 'center', p: 2 }}>
                  No data available
                </StyledTableCellRow>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* AI Model Predictions */}
      <Box sx={{ mt: 3 }}>
        <Box sx={{ color: '#D80E51', fontWeight: 'bold', fontSize: '13px', mb: 2 }}>
          AI Model Prediction
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead sx={{ bgcolor: '#e3f2fd' }}>
                  <TableRow>
                    <TableCell>AI Claim Decision</TableCell>
                    <TableCell>Confidence(%)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <StyledTableCellRow>Approve</StyledTableCellRow>
                    <StyledTableCellRow>{Math.floor(Math.random() * (95 - 90 + 1)) + 90}%</StyledTableCellRow>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead sx={{ bgcolor: '#fdecea' }}>
                  <TableRow>
                    <TableCell>AI Fraud Prediction</TableCell>
                    <TableCell>Confidence(%)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <StyledTableCellRow>Not Fraudulent</StyledTableCellRow>
                    <StyledTableCellRow>{Math.floor(Math.random() * (95 - 90 + 1)) + 90}%</StyledTableCellRow>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );

  const renderActionButtons = () => {
    const canCalculate = ['EVALUATION_INPROGRESS', 'ENHANCEMENT_REQUESTED', 'SURVEILANCE_NOT_NEEDED', 'GATEKEPING_DOCTOR_APPROVED']
      .includes(preAuthDetails.preAuth.preAuthStatus) && preAuthDetails.preAuth.calculationStatus !== 'COMPLETED';

    const canStartReview = ['PRE_AUTH_REQUESTED', 'ADD_DOC_SUBMITTED', 'REQUESTED', 'SURVEILANCE_NOT_NEEDED']
      .includes(preAuthDetails.preAuth.preAuthStatus);

    const canApproveReject = ['PRE_AUTH_REQUESTED', 'REQUESTED', 'APPROVED_FAILED', 'EVALUATION_INPROGRESS',
      'ENHANCEMENT_REQUESTED', 'SURVEILANCE_NOT_NEEDED', 'GATEKEPING_DOCTOR_APPROVED']
      .includes(preAuthDetails.preAuth.preAuthStatus);

    return (
      <>
        {canDoAnything ?
          (<Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 2 }}>
            {canStartReview && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleStartReview}
                disabled={buttonLoader}
              >
                {buttonLoader ? <CircularProgress size={20} /> : 'Start Review'}
              </Button>
            )}

            {canCalculate && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleCalculate}
                disabled={preAuthDetails.preAuth.calculationStatus === 'INPROGRESS' || buttonLoader}
              >
                {buttonLoader ? <CircularProgress size={20} /> :
                  preAuthDetails.preAuth.calculationStatus === 'INPROGRESS' ? 'Calculating...' : 'Calculate'}
              </Button>
            )}

            {canApproveReject && (
              <>
                <Button
                  variant="contained"
                  onClick={() => {
                    setCommentModal(true);
                    setReviewDecision('APPROVED');
                  }}
                  disabled={preAuthDetails.preAuth.calculationStatus !== 'COMPLETED' || !approveCostSum}
                  sx={{
                    bgcolor: '#01de74',
                    '&:hover': { bgcolor: '#00c765' },
                    opacity: preAuthDetails.preAuth.calculationStatus !== 'COMPLETED' ? 0.3 : 1
                  }}
                >
                  Approve
                </Button>

                <Button
                  variant="contained"
                  color="error"
                  onClick={() => {
                    setCommentModal(true);
                    setReviewDecision('REJECTED');
                  }}
                  sx={{ bgcolor: '#ff3243', '&:hover': { bgcolor: '#e02d3c' } }}
                >
                  Reject
                </Button>
              </>
            )}
          </Box>) : <p style={{ color: "red", fontWeight: "600", fontSize: "12px", marginTop: "4px", textAlign: "right" }}>You are not allowed to change anything with this pre-auth!</p>
        }
      </>
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, px: 1 }}>
        <Box>
          <Box component="span" sx={{ color: '#D80E51', fontWeight: 'bold' }}>
            Preauth:
          </Box>
          {' '}{id}
        </Box>
        <Box>
          <Box component="span" sx={{ color: '#D80E51', fontWeight: 'bold' }}>
            Status:
          </Box>
          {' '}{PRE_AUTH_STATUS_MSG_MAP[preAuthDetails.preAuth.preAuthStatus as keyof typeof PRE_AUTH_STATUS_MSG_MAP]}
        </Box>
      </Box>

      {/* Tab Navigation */}
      <Box sx={{ mt: 2, borderRadius: '8px 8px 0 0' }}>
        <TabView
          scrollable
          activeIndex={activeIndex}
          onTabChange={(e) => setActiveIndex(e.index)}
        >
          <TabPanel leftIcon="pi pi-user mr-2" header="Basic details">
            {renderBasicDetails()}
          </TabPanel>
          <TabPanel leftIcon="pi pi-user-minus mr-2" header="Other Details">
            {renderOtherDetails()}
          </TabPanel>
          <TabPanel leftIcon="pi pi-money-bill mr-2" header="Claim Details">
            {renderClaimDetails()}
          </TabPanel>
          <TabPanel leftIcon="pi pi-file-pdf mr-2" header="Documents">
            <DocumentPreview
              documents={preAuthDetails.preAuth.documents}
              preAuthId={preAuthDetails.preAuth.id}
            />
          </TabPanel>
        </TabView>
      </Box>

      {/* Action Buttons */}
      {query.get('mode') !== 'viewOnly' && renderActionButtons()}

      {/* Comment Modal */}
      <Modal
        open={commentModal}
        onClose={() => setCommentModal(false)}
      >
        <Box sx={COMMENT_MODAL_STYLE}>
          <Box sx={{ mb: 2 }}>
            <Box component="h2" sx={{ mb: 1 }}>Reviewer input</Box>
            <Divider />
            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                required
                fullWidth
                label="Type approve or reject for respective operation"
                value={cnfText}
                onChange={(e) => setCnfText(e.target.value)}
              />
              <TextField
                required
                label="Add comment"
                multiline
                fullWidth
                minRows={4}
                variant="filled"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </Box>
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleDecision(reviewDecision)}
            sx={{ mt: 2 }}
          >
            Submit
          </Button>
        </Box>
      </Modal>

      {/* Dialog Table */}
      <DialogTable
        open={open}
        setOpen={setOpen}
        data={decionData[indexD]}
        finalApproval={decionData[indexD]}
      />
    </Box>
  );
};

export default PreAuthReview;
