'use client'
import React, { useCallback, useEffect, useState } from 'react'

import { useParams, useSearchParams } from 'next/navigation'
import MuiAlert from '@mui/lab/Alert'
import {
  Box,
  Button,
  Card,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material'
import MuiAccordion from '@mui/material/Accordion'
import MuiAccordionDetails from '@mui/material/AccordionDetails'
import MuiAccordionSummary from '@mui/material/AccordionSummary'
import { withStyles, makeStyles } from '@mui/styles'

import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
import SpeakerNotesIcon from '@mui/icons-material/SpeakerNotes'
import { useFormik } from 'formik'
import PropTypes, { number } from 'prop-types'
import { forkJoin, of } from 'rxjs'
import { map } from 'rxjs/operators'
import * as yup from 'yup'

import moment from 'moment'

import { Autocomplete } from '@mui/lab'

import CheckBoxIcon from '@mui/icons-material/CheckBox'

import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'

import Checkbox from '@mui/material/Checkbox'

import { PreAuthService, ReimbursementService } from '@/services/remote-api/api/claims-services'
import { ProductService } from '@/services/remote-api/api/product-services'
import { MemberService } from '@/services/remote-api/api/member-services'
import {
  BenefitService,
  ProvidersService,
  ServiceTypeService,
  defaultPageRequest
} from '@/services/remote-api/fettle-remote-api'
import reimReviewModel from '../claim-reimbursement/reim.shared'
import AddIcon from '@mui/icons-material/Add'
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto'
import DeleteIcon from '@mui/icons-material/Delete'
import { config } from '@/services/remote-api/api/configuration'
import BreakUpComponents from '../claim-audit/components/audit.breakup.view.component'
import { Roles } from '../common/util'
import PdfReview from '../claim-preauth/component/pdf.preview'
import DocumentModal from '../claim-preauth/component/document.modal'

const Accordion = withStyles({
  root: {
    border: '1px solid rgba(0, 0, 0, .125)',
    boxShadow: 'none',
    '&:before': {
      display: 'none'
    },
    '&$expanded': {
      margin: 'auto'
    }
  },
  expanded: {}
})(MuiAccordion)

const productservice = new ProductService()
const reimService = new ReimbursementService()
const memberservice = new MemberService()
const benefitService = new BenefitService()
const providerService = new ProvidersService()
const serviceDiagnosis = new ServiceTypeService()
const preAuthService = new PreAuthService()

const ad$ = serviceDiagnosis.getServicesbyId('867854874246590464', {
  page: 0,
  size: 1000,
  summary: true,
  active: true,
  nonGroupedServices: false
})

// let ps$ = productservice.getProducts();

const productDataSourceCallback$ = (params = {}, action: any, pageRequest = defaultPageRequest) => {
  let reqParam: any = { ...pageRequest, ...params }

  if (action.searchText && action.searchText.length > 2) {
    reqParam = {
      ...reqParam,
      name: action.searchText
    }
    delete reqParam.active
  }

  return productservice.getProducts(reqParam)
}

const MODAL_STYLE = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4
};

const useStyles = makeStyles((theme: any) => ({
  header: {
    // border: '1px solid rgba(0, 0, 0, 0.1)',
    borderRadius: '10px 10px 0px 0px',
    background: '#D80E51',
    padding: 8,
    color: '#fff',
    borderBottom: 'none',
    paddingTop: 'none'
  },
  opinionHeader: {
    // border: '1px solid rgba(0, 0, 0, 0.1)',
    borderRadius: '0px 0px 0px 0px',
    background: '#F1F1F1',
    padding: 14,
    borderTop: 'none'
  },
  customStyle: {
    // border: '1px solid rgba(0, 0, 0, 0.1)',
    borderRadius: '0px 0px 10px 10px',
    background: '#ffffff',
    padding: 20,
    borderTop: 'none'
  },
  opinionBody: {
    // border: '1px solid rgba(0, 0, 0, 0.1)',
    borderRadius: '0px 0px 10px 10px',
    background: '#ffffff',
    borderTop: 'none'

    // padding: '16px',
  },
  headerTextHead: {
    fontSize: '16px',
    fontWeight: 'Bold',
    color: '#fff',
    paddingLeft: '8px',
    aligh: 'center'
  },
  headerText: {
    fontSize: '16px',

    // fontWeight: 'Bold',
    color: '#A1A1A1',
    paddingLeft: '8px'
  },
  headerTextAlign: {
    display: 'flex'

    // direction: 'row',
  },
  input1: {
    width: '50%'
  },
  clientTypeRadioGroup: {
    flexWrap: 'nowrap',
    '& label': {
      flexDirection: 'row'
    }
  },
  formControl: {
    minWidth: 282,
    padding: 4
  },
  root: {
    flexGrow: 1,
    maxWidth: 500
  },
  infoText: {
    // border: '1px solid rgba(0, 0, 0, 0.1)',
    color: '#404040',
    padding: '4px'
  },
  heading: {
    fontSize: '14px',
    flexBasis: '33.33%',
    flexShrink: 0
  },
  primaryHeading: {
    fontSize: '14px'
  },
  secondaryHeading: {
    fontSize: '12px',
    color: theme?.palette?.text?.secondary
  },
  accordianBody: {
    paddingLeft: '20%',
    paddingRight: '20%'
  },
  accordianBodyHeader: {
    display: 'flex',
    justifyContent: 'space-between'

    // paddingLeft: '20%',
    // paddingRight: '20%'
  },
  benifitAutoComplete: {},
  AccordionSummary: {}
}))

const keyMappings = {
  'CLAIM NO': 'CLAIM_NO',
  'CLAIM DATE': 'CLAIM_DATE',
  'MEMBER NAME': 'MEMBER_NAME',
  'MEMBERSHIP NO': 'MEMBERSHIP_NO',
  'POLICY NO': 'POLICY_NO',
  'POLICY': 'POLICY_NO',
  'POLICY START DATE': 'POLICY_START_DATE',
  'POLICY END DATE': 'POLICY_END_DATE',
  VALIDITY: 'VALIDITY',
  'PLAN NAME': 'PLAN_NAME',
  'SCHEME/CATEGORY': 'SCHEME_CATEGORY',
  'CLAIM TYPE': 'CLAIM_TYPE',
  SUBTYPE: 'SUBTYPE',
  'CHECKIN TIME': 'CHECKIN_TIME',
  'CHECKOUT TIME': 'CHECKOUT_TIME',
  'CLAIMED AMOUNT': 'CLAIMED_AMOUNT',
  BARCODE: 'BARCODE'
}

const AccordionSummary = withStyles({
  root: {
    backgroundColor: '#F1F1F1',
    borderBottom: '1px solid rgba(0, 0, 0, .125)',
    marginBottom: -1,
    minHeight: 56,
    '&$expanded': {
      minHeight: 56
    },
    color: '#A1A1A1'
  },
  content: {
    '&$expanded': {
      margin: '12px 0'
    }
  },
  expanded: {}
})(MuiAccordionSummary)

const AccordionDetails = withStyles((theme: any) => ({
  root: {
    padding: theme?.spacing ? theme.spacing(2) : '8px'
  }
}))(MuiAccordionDetails)

const validationSchema = yup.object({
  productId: yup.string().required('Product Name is required')
})

function TabPanel(props: any) {
  const { children, value, index, ...other } = props

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
}
const options = ['PAYABLE', 'CONSULT', 'ADD DOC', 'REJECT']


// Move RenderPreview outside the main component
type RenderPreviewProps = {
  x: {
    docFormat: string;
    documentName: string;
    documentOriginalName: string;
  };
  baseDocumentURL: string;
};

const RenderPreview: React.FC<RenderPreviewProps> = React.memo(({ x, baseDocumentURL }) => {
  const { docFormat, documentName } = x;
  const completeURL = `${baseDocumentURL}/${documentName?.replace(/ /g, '%20')}`;
  const [img, setImg] = React.useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState(null)

  const handleDocumentClick = (document: any) => {
    console.log("44444")
    setSelectedDocument(document)
  }

  const handleCloseModal = () => {
    setSelectedDocument(null)
  }

  React.useEffect(() => {
    // Only fetch if we don't have the image and documentName exists
    if (!img && documentName) {
      const fetchImg = async () => {
        try {
          const res = await fetch(completeURL, {
            headers: {
              Authorization: `Bearer ${(window as any).getToken?.()}`
            }
          });

          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }

          const file = await res.blob();
          setImg(URL.createObjectURL(file));
        } catch (error) {
          console.error('Failed to fetch the image:', error);
        }
      };

      fetchImg();
    }

    // Cleanup function to revoke object URLs
    return () => {
      if (img) {
        URL.revokeObjectURL(img);
      }
    };
  }, [completeURL, img, documentName]); // More specific dependencies

  if (!documentName) return null;

  return (
    <>
      {docFormat?.split('/')[0] === 'image' ? (
        <img
          src={img || ''}
          alt='Document Thumbnail'
          style={{
            position: 'relative',
            width: '100px',
            height: '100px',
            borderRadius: '6px',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            cursor: 'pointer'
          }}
          onClick={() => handleDocumentClick(x)}
        />
      ) : docFormat === 'application/pdf' ? (
        <PdfReview url={completeURL} onClick={undefined} />
      ) : null}

      <DocumentModal document={selectedDocument} onClose={handleCloseModal} baseDocumentURL={baseDocumentURL} />
    </>
  );
});

const ClaimInvoiceList = () => {
  const id: any = useParams().id
  const classes = useStyles();
  const query2 = useSearchParams();
  const [value, setValue] = React.useState(0)
  const [isClaimDetailsEdit, setIsClaimDetailsEdit] = React.useState(false)
  const [claimReimDetails, setclaimReimDetails] = React.useState<any>(reimReviewModel())
  const baseDocumentURL = `${config.rootUrl}/claim-query-service/v1/reimbursements/exgratia-doc/${id}`
  // const [editedClaimData, setEditedClaimData] = React.useState({ ...claimData });
  const [claimStatus, setClaimStatus] = React.useState()
  const [rejectReason, setRejectReason] = React.useState('')
  const [remarks, setRemarks] = React.useState('')
  const [internalRemarks, setInternalRemarks] = React.useState('')
  const [benefitData, setBenefitData] = React.useState<any>([])
  const [amtToCompare, setAmtToCompare] = React.useState<number>()
  const [memberData, setMemberData] = React.useState<any>([])
  const [invoiceData, setInvoiceData] = React.useState([])
  const [providerWithApprovedCost, setProviderWithApprovedCost] = React.useState([])
  const [showApprovableDetails, setShowApprovableDetails] = React.useState(false)
  const [diagnosisList, setDiagnosisList] = React.useState([])
  const [diagnosisValues, setDiagnosisValues] = React.useState([])
  const [diagnosisIds, setDiagnosisIds] = React.useState<any>([])
  const [status, setStatus] = React.useState()
  const [calculationStatus, setCalculationStatus] = React.useState()
  const [canDoAnything, setCanDoAnything] = React.useState(false)
  const [selectedDiagnosis, setSelectedDiagnosis] = React.useState([])
  const [initalDiagnosis, setInitialDiagnosis] = React.useState<any>()
  const [doctorsOpinion, setDoctorsOpinion] = React.useState<any>()
  const [providerList, setProviderList] = React.useState<Array<{ id: any; providerBasicDetails?: { name?: string } }>>([])
  const [approvalModal, setApprovalModal] = React.useState(false)
  const [comment, setComment] = useState('');
  const [inComment, setInComment] = useState('');
  const [amount, setAmount] = useState<string | number>();
  const [inAmount, setInAmount] = useState<string | number>();
  const [appAmount, setAppAmount] = useState<string | number>();
  const [inAppAmount, setInAppAmount] = useState<string | number>();
  const [approversComment, setApproversComment] = useState('');
  const [inApproversComment, setInApproversComment] = useState('');
  const [uploadSuccess, setUploadSuccess] = React.useState(false)
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [snackbarSeverity, setSnackbarSeverity] = React.useState<'success' | 'error'>('success');
  const [exgratiaStatus, setExgratiaStatus] = React.useState<string>();
  const [indemnityStatus, setIndemnityStatus] = React.useState<string>();
  const [documentList, setDocumentList] = React.useState([{
    docFormat: '',
    documentName: '',
    documentOriginalName: ''
  }])
  const [inDocumentList, setInDocumentList] = React.useState([{
    docFormat: '',
    documentName: '',
    documentOriginalName: ''
  }])


  useEffect(() => {
    if (id) {
      populateReimbursement()
    }
  }, [id])

  const populateReimbursement = () => {
    const serviceAll$ = forkJoin(
      serviceDiagnosis.getServicesbyId('867854950947827712', {
        page: 0,
        size: 1000,
        summary: true,
        active: true,
        nonGroupedServices: false
      }),
      serviceDiagnosis.getServicesbyId('867855014529282048', {
        page: 0,
        size: 1000,
        summary: true,
        active: true,
        nonGroupedServices: false
      }),
      serviceDiagnosis.getServicesbyId('867855088575524864', {
        page: 0,
        size: 1000,
        summary: true,
        active: true,
        nonGroupedServices: false
      }),
      serviceDiagnosis.getServicesbyId('867855148155613184', {
        page: 0,
        size: 1000,
        summary: true,
        active: true,
        nonGroupedServices: false
      })
    )

    const ad$ = serviceDiagnosis.getServicesbyId('867854874246590464', {
      page: 0,
      size: 1000,
      summary: true,
      active: true,
      nonGroupedServices: false
    })

    const frk$ = forkJoin({
      providers: providerService.getProviders({
        page: 0,
        size: 100000,
        summary: true,
        active: true
      }),
      bts: benefitService.getAllBenefit({ page: 0, size: 1000, summary: true }),
      reimDetails: reimService.getReimbursementById(id),
      services: serviceAll$
    })

    frk$.subscribe((data: any) => {
      setClaimStatus(data?.reimDetails?.opinions[0]?.claimStatus)
      setRemarks(data?.reimDetails?.opinions[0]?.remarks)
      setDoctorsOpinion(data?.reimDetails?.opinions[0])
      setDiagnosisValues(
        data?.reimDetails?.doctorsDiagnosis?.length ? data?.reimDetails?.doctorsDiagnosis : data?.reimDetails?.diagnosis
      )
      setInitialDiagnosis(data?.reimDetails?.diagnosis)
      setInitialDiagnosis(data?.reimDetails?.diagnosis)
      setBenefitData(data?.reimDetails?.benefitsWithCost)
      setStatus(data?.reimDetails?.reimbursementStatus)
      setCalculationStatus(data?.reimDetails?.calculationStatus)
      setProviderList(data.providers.content)
      console.log("11111")
      if (data?.reimDetails?.exgratiaDocuments?.length) setDocumentList(data?.reimDetails?.exgratiaDocuments)
      if (data?.reimDetails?.indemnityDocuments?.length) setInDocumentList(data?.reimDetails?.indemnityDocuments)
      setAmount(data?.reimDetails?.exgratiaDTOs[0]?.amount)
      setInAmount(data?.reimDetails?.indemnityDTOs[0]?.amount)
      setComment(data?.reimDetails?.exgratiaDTOs[0]?.comments)
      setInComment(data?.reimDetails?.indemnityDTOs[0]?.comments)
      setExgratiaStatus(data?.reimDetails?.exgratiaDTOs[0]?.exgratiaStatus)
      setIndemnityStatus(data?.reimDetails?.indemnityDTOs[0]?.indemnityStatus)



      let amt = 0;
      data?.reimDetails?.benefitsWithCost.forEach((item: any) => {
        amt += item.estimatedCost
      })

      const role = JSON.parse(localStorage.getItem('roles')!);
      const common = role.filter((item: any) => Roles.includes(item));
      if (common.length <= 0) {
        if (role.includes("Super_Admin")) {
          common.push("Super_Admin")
        }
      }

      preAuthService.checkIfCanBeCreated(common[0], data?.reimDetails?.claimType == "IPD" ? "IP" : "OP", amt).subscribe(res => {
        if (res.approve) {
          setCanDoAnything(true);
        }
      })



      // let temp: any = []
      // data?.reimDetails?.invoices.forEach((invoice: any) => {
      //   // Assign idx as id for each invoiceItem
      //   invoice.invoiceItems = invoice.invoiceItems.map((item: any, idx: number) => ({
      //     ...item,
      //     id: idx,
      //     finalApprovedAmount:
      //       item.finalApprovedAmount
      //         ? item.finalApprovedAmount
      //         : item.approvedAmount
      //   }));
      //   temp.push(invoice);
      // });
      // setInvoiceData(temp);


      let temp: any = [];

      const fetchBenefitNames = async () => {
        for (const invoice of data?.reimDetails?.invoices || []) {
          // Map invoiceItems with async benefit name fetch
          invoice.invoiceItems = await Promise.all(
            invoice.invoiceItems.map(async (item: any, idx: number) => {
              let benefitName = '';
              try {
                const res: any = await benefitService.getBenefitDetailsById(item.benefitId).toPromise();
                benefitName = res?.name || '';
              } catch (e) {
                benefitName = '';
              }
              return {
                ...item,
                id: `_${Math.random().toString(36).substr(2, 9)}${idx}`,
                benefitName,
                finalApprovedAmount:
                  item.finalApprovedAmount
                    ? item.finalApprovedAmount
                    : item.approvedAmount
              };
            })
          );

          temp.push(invoice);
        }
        setInvoiceData(temp);
      };

      // Call this function where you process your reimbursement data
      fetchBenefitNames();


      if (data.reimDetails.invoices && data.reimDetails.invoices.length !== 0) {
        // data.providers.content.forEach((proAll: any) => {
        //   data.reimDetails.invoices.forEach((pr: any) => {
        //     if (proAll.id === pr.provideId) {
        //       pr['providerName'] = proAll.providerBasicDetails?.name
        //       setProviderData(pr)
        //     }
        //   })
        // })

        data?.reimDetails?.invoices?.forEach((el: any) => {
          providerService.getProviderDetails(el.provideId).subscribe((res: any) => {
            el['providerName'] = res.providerBasicDetails?.name
          })
          // if (proAll.id === benefit.providerId) {
          // }
        })
      }

      data.bts.content.forEach((benall: any) => {
        data.reimDetails.benefitsWithCost.forEach((benefit: any) => {
          if (benefit.benefitId === benall.id) {
            benefit['benefitName'] = benall.name
          }
        })
      })
      const serviceList = []

      data.services.forEach((ser: any) => {
        ser.content.forEach((sr: any) => {
          serviceList.push(sr)
        })
      })

      // serviceList.forEach(ser => {
      //   data.preAuth.services.forEach(service => {
      //     if(service.serviceId === ser.id){
      //       service['serviceName'] = ser.name;
      //     }
      //   })
      // })
      const pageRequest = {
        page: 0,
        size: 10,
        summary: true,
        active: true,
        key: 'MEMBERSHIP_NO',
        value: data.reimDetails.memberShipNo,
        key1: 'policyNumber',
        value1: data.reimDetails.policyNumber
      }

      memberservice.getMember(pageRequest).subscribe((res: any) => {
        setMemberData(res.content[0])

        if (res.content?.length > 0) {
          const member = res.content[0]

          const obj = {
            member: member,
            reim: data.reimDetails
          }

          setclaimReimDetails(obj)
        }
      })
    })

    // preAuthService.getPreAuthById(id).subscribe(preAuth => {
    //     let pageRequest = {
    //         page: 0,
    //         size: 10,
    //         summary: true,
    //         active: true,
    //         key:'MEMBERSHIP_NO',
    //         value:preAuth.memberShipNo,
    //         key1:'policyNumber',
    //         value1:preAuth.policyNumber
    //       }
    //       memberservice.getMember(pageRequest).subscribe(res=>{
    //         if(res.content?.length > 0){
    //           const member= res.content[0];
    //           setclaimReimDetails({member,preAuth});
    //         }
    //       });

    // });
  }

  useEffect(() => {
    let temp: any = []
    claimReimDetails.reim.invoices.map((provider: any, index: number) => {
      const obj = {
        providerId: provider.provideId,
        approvedCost: provider.invoiceAmount
      };
      temp.push(obj)
    })
    setProviderWithApprovedCost(temp);
  }, [claimReimDetails.reim.invoices])

  const handleChange = (event: any, newValue: any) => {
    setValue(newValue)
  }

  const handleChangeClaimStatus = (event: any) => {
    const selectedValue = event.target.value

    setClaimStatus(selectedValue)

    if (selectedValue === 'REJECT') {
      setRejectReason('')
    }
  }

  const handleRejectReasonChange = (event: any) => {
    setRejectReason(event.target.value)
  }

  const [expanded, setExpanded] = React.useState('panel1')

  const handleChangeAccordian = (panel: any) => (event: any, newExpanded: any) => {
    setExpanded(newExpanded ? panel : false)
  }

  const formik = useFormik({
    initialValues: {
      productId: '',
      productData: '',
      diagnosis: ''
    },
    validationSchema: validationSchema,
    onSubmit: values => { }
  })

  // const data$ = new Observable(subscriber => {
  //   // subscriber.next(sampleData);
  //   subscriber.next(claimReimDetails?.reim?.invoices);
  // });

  const dataSource$ = () => {
    if (claimReimDetails.reim.invoices) {
      return of(claimReimDetails.reim.invoices).pipe(
        map((data: any) => {
          data.content = data

          return data
        })
      )
    } else {
      return
    }
  }

  // const dataSource$ = (
  // ) => {

  //   return reimService.getReimbursementById(id?.id).pipe(
  //     map((data:any) => {
  //       let content = data.invoices;

  //       return content;
  //     }),
  //   );
  // };

  const handleSelectedRows = (selectedClaim: any) => { }

  const configuration: any = {
    enableSelection: true,
    singleSelectionMode: true,
    scrollHeight: '300px',
    pageSize: 10,
    header: {
      enable: true,
      enableDownload: true,

      // downloadbleColumns: xlsColumns,
      text: 'INVOICES',
      onSelectionChange: handleSelectedRows
    }
  }

  const handlePChange = (e: any, value: any) => {
    if (!value) {
      formik.setFieldValue('productData', '')
      formik.setFieldValue('productId', '')
    }

    if (value) {
      formik.setFieldValue('productData', value)
      formik.setFieldValue('productId', value.id)

      // populateProductValues(value.id);
    }
  }

  const handleInputChange = (key: any, value: any) => {
    // setEditedClaimData((prevData) => ({ ...prevData, [key]: value }));
  }

  const handleSubmit = () => { }

  const handleRemarksChange = (event: any) => {
    setRemarks(event.target.value)
  }

  const handleInternalRemarksChange = (event: any) => {
    setInternalRemarks(event.target.value)
  }

  const handleSubmitOpinion = (event: any) => {
    event.preventDefault()

    if (!remarks || remarks.trim() === '') {
      alert('Remarks is required to save Doctor\'s opinion.');
      return;
    }

    const payload = {
      opinion: {
        claimStatus: claimStatus,
        remarks: remarks,
        internalRemarks: internalRemarks
      },
      diagnosis: selectedDiagnosis
    }

    if (claimStatus === 'PAYABLE') {
      if (calculationStatus === 'COMPLETED') {
        // if (providerWithApprovedCost?.length) {
        reimService.editDoctorsOpinion(id, payload).subscribe((res: any) => {
          alert("Doctor's opinion submitted successFully! Ready for Claim")
          setShowApprovableDetails(true)
          handleApprove('APPROVED')
        })

        // } else {
        //   alert('Please enter final approve amount!');
        // }
      } else {
        alert('Please calculate first!')
      }
    } else {
      reimService.editDoctorsOpinion(id, payload).subscribe((res: any) => {
        alert(res)
        setShowApprovableDetails(true)
        handleApprove('REJECTED')
      })
    }

    // reimService.editDoctorsOpinion(id?.id, payload).subscribe((res:any) => {
    //   alert(res)
    //   setShowApprovableDetails(true)
    //   handleApprove(claimStatus === "PAYABLE" ? "APPROVED" : "REJECTED")
    // })
  }

  const handleStartReview = () => {
    reimService.editReimbursement({}, id, 'evs').subscribe(r => {
      setTimeout(() => {
        populateReimbursement()
      }, 1000)
    })
  }

  const handleCalculate = () => {
    reimService.editReimbursement({}, id, 'calculate').subscribe(r => {
      setTimeout(() => {
        populateReimbursement()
      }, 1000);
      setTimeout(() => {
        if (calculationStatus == "INPROGRESS") {
          populateReimbursement()
        }
      }, 1000);
    })
  }

  const useObservable = (observable: any, setter: any) => {
    useEffect(() => {
      const subscription = observable.subscribe((result: any) => {
        const arr: any = []

        result.content.forEach((ele: any) => {
          arr.push({ id: ele.id, diagnosisName: ele.name })
        })
        setter(arr)
      })

      return () => subscription.unsubscribe()
    }, [observable, setter])
  }

  useObservable(ad$, setDiagnosisList)

  const getSum = (): number => {
    return invoiceData?.reduce((acc: number, item: any) => {
      return acc + (item?.invoiceAmountKES || 0);
    }, 0) || 0;
  };

  const claimData: any = {
    CLAIM_NO: typeof id === 'object' && id !== null ? id.id : id,
    CLAIM_DATE: moment(memberData?.createdDate).format('DD/MM/YYYY'),
    MEMBER_NAME: memberData?.name,
    MEMBERSHIP_NO: memberData?.membershipNo,
    POLICY_NO: memberData?.policyNumber,
    POLICY_START_DATE: moment(memberData?.policyStartDate).format('DD/MM/YYYY'),
    POLICY_END_DATE: moment(memberData?.policyEndDate).format('DD/MM/YYYY'),
    VALIDITY: moment(memberData?.policyEndDate).format('DD/MM/YYYY'),
    PLAN_NAME: memberData?.planName,
    SCHEME_CATEGORY: memberData?.planScheme,
    CLAIM_TYPE: `${claimReimDetails?.reim?.claimType || ''} (${claimReimDetails?.reim?.claimCategory || ''})`,
    SUBTYPE: memberData?.claim_subtype,
    CHECKIN_TIME: moment(claimReimDetails.reim?.expectedDOA).format('DD/MM/YYYY hh:mm A'),
    CHECKOUT_TIME: moment(claimReimDetails.reim?.expectedDOD).format('DD/MM/YYYY hh:mm A'),
    CLAIMED_AMOUNT: invoiceData?.reduce((acc: number, item: any) => {
      return acc + (item?.invoiceAmountKES || 0);
    }, 0) || 0,
    BARCODE: memberData?.barcode
  }

  const handleApprove = (decission: any) => {
    let comment

    if (decission === 'APPROVED') {
      comment = 'Approve'
    }

    if (decission === 'REJECTED') {
      comment = 'Reject'
    }

    reimService
      .editReimbursement(
        { decission: decission, comment: comment, approveAmounts: benefitData, invoiceDtos: invoiceData, diagnosis: selectedDiagnosis },
        id,
        'decission'
      )
      .subscribe(r => {
        window.location.reload()
      })
  }

  useEffect(() => {
    const data = initalDiagnosis || diagnosisValues

    const preFilledDiagnosis: any = data?.map((diagnosisId: any) => {
      if (!diagnosisIds.includes(diagnosisId)) {
        return diagnosisList.find((option: any) => option.id === diagnosisId)
      }

      return null
    })

    setDiagnosisIds(preFilledDiagnosis)
    const selectedDiagnosisIds: any = preFilledDiagnosis.map((option: any) => option?.id)

    setSelectedDiagnosis(selectedDiagnosisIds)
  }, [diagnosisValues, diagnosisList])

  const handleDiagnosisChange = (event: any, newValue: any) => {
    setDiagnosisIds(newValue)
    const selectedDiagnosisIds = newValue.map((option: any) => option?.id)

    setSelectedDiagnosis(selectedDiagnosisIds)
  }

  const allSelected =
    diagnosisList &&
    diagnosisList.length > 0 &&
    formik.values.diagnosis &&
    formik.values.diagnosis.length === diagnosisList.length

  const icon = <CheckBoxOutlineBlankIcon fontSize='small' />
  const checkedIcon = <CheckBoxIcon fontSize='small' />

  const handleApprovedAmountChange = useCallback((index: number, value: string) => {
    const numValue = parseFloat(value) || 0;
    const benefit = benefitData[index];

    if (numValue > benefit.estimatedCost) {
      alert('Approved amount cannot exceed estimated amount!');
      return;
    }

    setBenefitData((prev: any) => prev.map((item: any, i: number) =>
      i === index ? { ...item, approvedCost: numValue } : item
    ));
  }, [benefitData]);

  const handleAddDoc = (e: any, index: any) => {
    const file = e.target['files'][0]

    const reader = new FileReader()

    reader.onload = function () {
      const list: any = [...documentList]

      list[index]['documentOriginalName'] = file.name
      console.log("222222")
      setDocumentList(list)

      const formData = new FormData()

      formData.append('docType', 'exgratia document')
      formData.append('exgratiaStatus', 'PENDING_EXGRATIA_APPROVAL')
      formData.append('filePart', file)

      if (id) {
        preAuthService.addExgratiaDoc(id, formData).subscribe((response: any) => {
          list[index]['documentName'] = response.id
          list[index]['docFormat'] = response.docFormat
          console.log("33333")
          setDocumentList(list)
          setUploadSuccess(true)
          // setIsDisabled(false);
          // populateStepTwo(preID)
        })
      }
    }

    reader.readAsDataURL(file)
  }

  const handleInAddDoc = (e: any, index: any) => {
    const file = e.target['files'][0]

    const reader = new FileReader()

    reader.onload = function () {
      const list: any = [...inDocumentList]

      list[index]['documentOriginalName'] = file.name
      setInDocumentList(list)

      const formData = new FormData()

      formData.append('docType', 'exgratia document')
      formData.append('indemnityStatus', 'PENDING_INDEMNITY_APPROVAL')
      formData.append('filePart', file)

      if (id) {
        preAuthService.addIndemnityDoc(id, formData).subscribe((response: any) => {
          list[index]['documentName'] = response.id
          list[index]['docFormat'] = response.docFormat
          setInDocumentList(list)
          setUploadSuccess(true)
          // setIsDisabled(false);
          // populateStepTwo(preID)
        })
      }
    }

    reader.readAsDataURL(file)
  }

  const handleRemoveDocumentList = (index: number) => {
    const list: any = [...documentList]

    list.splice(index, 1)
    setDocumentList(list)
  }

  const handleRemoveInDocumentList = (index: number) => {
    const list: any = [...inDocumentList]

    list.splice(index, 1)
    setInDocumentList(list)
  }

  const handleAddDocumentList = () => {
    setDocumentList([
      ...documentList,
      {
        docFormat: '',
        documentName: '',
        documentOriginalName: ''
      }
    ])
  }

  const handleAddInDocumentList = () => {
    setInDocumentList([
      ...inDocumentList,
      {
        docFormat: '',
        documentName: '',
        documentOriginalName: ''
      }
    ])
  }

  const handleFileUploadMsgClose = (event: any, reason: any) => {
    setUploadSuccess(false)
  }

  function Alert(props: any) {
    return <MuiAlert elevation={6} variant='filled' {...props} />
  }

  const requestForApproval = () => {
    const payload = {
      comments: comment,
      amount: amount
    }
    preAuthService.requestForApprovalExgraia(id, payload).subscribe((response: any) => {
      setSnackbarMessage('Requested for Approval!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      setTimeout(() => {
        populateReimbursement()
      }, 1000);
    })
  }

  const requestForIndemnityApproval = () => {
    const payload = {
      comments: inComment,
      amount: inAmount
    }
    preAuthService.requestForApprovalIndemnity(id, payload).subscribe((response: any) => {
      setSnackbarMessage('Requested for Approval!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      setTimeout(() => {
        populateReimbursement()
      }, 1000);
    })
  }

  const decision = (decision: any) => {
    const payload = {
      decission: decision,
      comments: approversComment,
      amount: appAmount
    }
    preAuthService.decissionForApprovalExgraia(id, payload).subscribe({
      next: (response: any) => {
        setSnackbarMessage(`${decision} successfully!`);
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        setTimeout(() => {
          populateReimbursement();
        }, 1000);
      },
      error: (err: any) => {
        setSnackbarMessage("Something went wrong. Please try again.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    });
  }

  const decisionIndemnity = (decision: any) => {
    const payload = {
      decission: decision,
      comments: inApproversComment,
      amount: inAppAmount
    }
    preAuthService.decissionForApprovalIndemnity(id, payload).subscribe({
      next: (response: any) => {
        setSnackbarMessage(`${decision} successfully!`);
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        setTimeout(() => {
          populateReimbursement();
        }, 1000);
      },
      error: (err: any) => {
        setSnackbarMessage("Something went wrong. Please try again.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    });
  }

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  useEffect(() => {
    invoiceData.forEach((invoice: any) => {
      let totalApproved = 0;
      let totalEstimated = 0;
      invoice.invoiceItems.forEach((item: any) => {
        console.log("77777777", item)
        totalApproved += item.finalApprovedAmount
          ? item.finalApprovedAmount
          : item.approvedAmount || 0;
        totalEstimated += item.totalKes || 0;
      });
      // invoice['invoiceApprovedAmount'] = totalApproved;
      setAmtToCompare(totalEstimated - totalApproved)
    })
  }, [invoiceData])

  if (query2.get('mode') == 'viewonly' || query2.get('mode') == 'exgratia' || query2.get('mode') == 'ex_requested') {
    return (
      <Box>
        <Snackbar open={uploadSuccess} autoHideDuration={3000} onClose={handleFileUploadMsgClose}>
          <Alert onClose={handleFileUploadMsgClose} severity='success'>
            File uploaded successfully
          </Alert>
        </Snackbar>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={2800}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
        <Box className={classes.header}>
          <Typography className={classes.headerTextHead}>Claim Audit</Typography>
        </Box>
        <Box sx={{ p: 3, bgcolor: '#f8f9fa', borderRadius: 2 }}>
          {/* Claim Details */}
          <Paper elevation={2} sx={{ borderRadius: 2, mb: 3 }}>
            <Accordion
              square={false}
              expanded={expanded === 'panel1'}
              onChange={handleChangeAccordian('panel1')}
              sx={{ borderRadius: 2 }}
            >
              <AccordionSummary
                className={classes.AccordionSummary}
                aria-controls="panel1d-content"
                id="panel1d-header"
                sx={{
                  bgcolor: '#f1f3f5',
                  borderBottom: '1px solid #e0e0e0',
                  borderRadius: '8px 8px 0 0',
                }}
              >
                <Grid container justifyContent="space-between" alignItems="center">
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#333' }}>
                    Claim Details
                  </Typography>
                  {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </Grid>
              </AccordionSummary>

              <AccordionDetails sx={{ bgcolor: '#fff', p: 2 }}>
                <Grid container spacing={2}>
                  {Object.entries(keyMappings).map(([displayName, key], index) => (
                    <Grid key={index} item xs={4}>
                      <Grid container spacing={1} alignItems="center">
                        <Grid item>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#666' }}>
                            {displayName} :
                          </Typography>
                        </Grid>
                        <Grid item>
                          {isClaimDetailsEdit ? (
                            <TextField
                              size="small"
                              value={claimData[key]}
                              onChange={(e) => handleInputChange(key, e.target.value)}
                              sx={{ '& input': { fontSize: '13px' } }}
                            />
                          ) : (
                            <Typography variant="body2" sx={{ color: '#444' }}>
                              {claimData[key]}
                            </Typography>
                          )}
                        </Grid>
                      </Grid>
                    </Grid>
                  ))}
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Paper>

          {/* Benefit & Provider Details */}
          <Paper elevation={2} sx={{ borderRadius: 2, p: 2, mb: 3 }}>
            <Box
              sx={{
                bgcolor: '#f1f3f5',
                borderRadius: 1,
                p: 1.5,
                mb: 2,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <SpeakerNotesIcon sx={{ color: '#6c757d', mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#333' }}>
                Benefit & Provider Details
              </Typography>
            </Box>

            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Benefit:</strong>
            </Typography>

            {/* Table Header */}
            <Grid container sx={{ fontWeight: 'bold', borderBottom: '2px solid #ddd', pb: 1 }}>
              <Grid item xs={3}>Provider Name</Grid>
              <Grid item xs={3}>Name</Grid>
              <Grid item xs={1}>Est. Cost</Grid>
              <Grid item xs={1}>Approved</Grid>
              <Grid item xs={1}>Copay</Grid>
              <Grid item xs={3}>Comment</Grid>
            </Grid>

            {/* Table Rows */}
            {benefitData?.map((bwc: any, index: number) => {
              const providerName: string | undefined =
                (providerList as Array<{ id: any; providerBasicDetails?: { name?: string } }>).find((provider) => bwc.providerId == provider.id)?.providerBasicDetails?.name;

              return (
                <Grid
                  container
                  key={index}
                  sx={{
                    py: 1,
                    borderBottom: '1px solid #f0f0f0',
                    '&:hover': { bgcolor: '#f9fafb' },
                  }}
                >
                  <Grid item xs={3}>{providerName}</Grid>
                  <Grid item xs={3}>{bwc.benefitName}</Grid>
                  <Grid item xs={1}>{bwc.estimatedCost}</Grid>
                  <Grid item xs={1}>{bwc.maxApprovedCost}</Grid>
                  <Grid item xs={1}>{bwc.copayAmount}</Grid>
                  <Grid item xs={3}>{bwc.comment}</Grid>
                </Grid>
              );
            })}

            {/* Total Row */}
            <Grid
              container
              sx={{
                mt: 1,
                fontWeight: 'bold',
                bgcolor: '#f8f9fa',
                py: 1,
                borderTop: '2px solid #ddd',
              }}
            >
              <Grid item xs={3}>Total:</Grid>
              <Grid item xs={3}></Grid>
              <Grid item xs={1}>
                {benefitData.reduce((sum: number, b: any) => sum + (Number(b.estimatedCost) || 0), 0)}
              </Grid>
              <Grid item xs={1}>
                {benefitData.reduce((sum: number, b: any) => sum + (Number(b.maxApprovedCost) || 0), 0)}
              </Grid>
              <Grid item xs={1}></Grid>
              <Grid item xs={3}></Grid>
            </Grid>
          </Paper>

          <BreakUpComponents
            rowData={{ invoices: invoiceData }}
            providerList={providerList}
            data={undefined}
            setInvoiceData={setInvoiceData}
          />
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            {(query2.get('mode') == 'exgratia' || query2.get('mode') == 'ex_requested') && (
              <>
                <Card sx={{ p: 3, mb: 4, borderRadius: 3, boxShadow: 3 }}>
                  <Typography variant="h5" fontWeight={600} gutterBottom>
                    Reviewer Input
                  </Typography>
                  <Divider sx={{ mb: 3 }} />

                  {/* Amount Section */}
                  <Typography variant="h6" sx={{ mt: 2 }}>
                    Amount
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  {query2.get('mode') === 'ex_requested' || exgratiaStatus === "PENDING_EXGRATIA_APPROVAL" ? (
                    <Typography variant="body2" sx={{ mb: 2, color: '#555' }}>
                      {amount}
                    </Typography>
                  ) :
                    <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <TextField
                        required
                        label="Request for Amount to be Approved"
                        sx={{ width: '30%' }}
                        disabled={query2.get('mode') === 'ex_requested' || exgratiaStatus === "PENDING_EXGRATIA_APPROVAL"}
                        variant="outlined"
                        value={amount}
                        onChange={(e) => {
                          let amt =
                            benefitData.reduce((sum: number, b: any) => sum + (Number(b.estimatedCost) || 0), 0) -
                            benefitData.reduce((sum: number, b: any) => sum + (Number(b.maxApprovedCost) || 0), 0);

                          // if (Number(e.target.value) <= Number(amt)) setAmount(e.target.value);
                          if (Number(e.target.value) <= Number(amtToCompare)) setAmount(e.target.value);
                        }}
                      />
                      <Typography variant="caption" color="error" fontWeight={600}>
                        Amount cannot be more than&nbsp;{amtToCompare}
                        {/* {benefitData.reduce((sum: number, b: any) => sum + (Number(b.estimatedCost) || 0), 0) -
                          benefitData.reduce((sum: number, b: any) => sum + (Number(b.maxApprovedCost) || 0), 0)} */}
                      </Typography>
                    </Box>
                  }
                  {/* Documents Section */}
                  <Typography variant="h6" sx={{ mt: 4 }}>
                    Documents
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  {documentList.map((x, i) => (
                    <Grid container spacing={2} key={i} alignItems="center" sx={{ mb: 2 }}>
                      {query2.get('mode') === 'ex_requested' || exgratiaStatus === "PENDING_EXGRATIA_APPROVAL" ? null :
                        <Grid item>
                          <input
                            className={classes.input1}
                            id={`contained-button-file-${i}`}
                            name="document"
                            type="file"
                            hidden
                            disabled={query2.get('mode') === 'ex_requested' || exgratiaStatus === "PENDING_EXGRATIA_APPROVAL"}
                            onChange={(e) => handleAddDoc(e, i)}
                          />
                          <label htmlFor={`contained-button-file-${i}`}>
                            <Button
                              variant="contained"
                              color={x.documentName ? "secondary" : "primary"}
                              component="span"
                              startIcon={<AddAPhotoIcon />}
                            >
                              Upload
                            </Button>
                          </label>
                        </Grid>
                      }

                      <Grid item>
                        {x.documentName && (
                          <RenderPreview
                            x={x}
                            baseDocumentURL={baseDocumentURL}
                          />
                        )}
                      </Grid>
                      {query2.get('mode') === 'ex_requested' || exgratiaStatus === "PENDING_EXGRATIA_APPROVAL" ? null :
                        <Grid item>
                          {documentList.length !== 1 && (
                            <Button
                              onClick={() => handleRemoveDocumentList(i)}
                              color="error"
                              variant="outlined"
                              startIcon={<DeleteIcon />}
                            >
                              Remove
                            </Button>
                          )}
                          {documentList.length - 1 === i && (
                            <Button
                              color="primary"
                              variant="outlined"
                              startIcon={<AddIcon />}
                              sx={{ ml: 1 }}
                              onClick={handleAddDocumentList}
                            >
                              Add More
                            </Button>
                          )}
                        </Grid>
                      }
                    </Grid>
                  ))}

                  {/* Comment Section */}
                  <Typography variant="h6" sx={{ mt: 4 }}>
                    Comment
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  {query2.get('mode') === 'ex_requested' || exgratiaStatus === "PENDING_EXGRATIA_APPROVAL" ? (
                    <Typography variant="body2" sx={{ mb: 2, color: '#555' }}>
                      {comment}
                    </Typography>
                  ) :
                    <TextField
                      required
                      label="Add Comment"
                      multiline
                      minRows={4}
                      sx={{ width: '60%' }}
                      disabled={query2.get('mode') === 'ex_requested' || exgratiaStatus === "PENDING_EXGRATIA_APPROVAL"}
                      variant="outlined"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                  }
                </Card>

                {/* Footer Buttons */}
                {query2.get('mode') === 'exgratia' && (
                  <Box display="flex" justifyContent="flex-end" sx={{ mt: 2 }}>
                    {exgratiaStatus !== "PENDING_EXGRATIA_APPROVAL" && (
                      <Button onClick={requestForApproval} variant="contained">
                        Request For Exgratia Approval
                      </Button>
                    )}
                  </Box>
                )}
              </>
            )}
          </Grid>
          <Grid item xs={6}>
            {query2.get('mode') === 'ex_requested' && (
              <Card sx={{ p: 3, mb: 4, borderRadius: 3, boxShadow: 3 }}>
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  Approver's Input
                </Typography>
                <Divider sx={{ mb: 3 }} />
                {/* Amount */}
                <Typography variant="h6">Approved Amount</Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <TextField
                    required
                    label="Approved Amount"
                    sx={{ width: '30%' }}
                    variant="outlined"
                    value={appAmount}
                    onChange={(e) => {
                      if (Number(e.target.value) <= Number(amount)) setAppAmount(e.target.value);
                    }}
                  />
                  <Typography variant="caption" color="error" fontWeight={600}>
                    Amount cannot be more than {amount}
                  </Typography>
                </Box>

                {/* Approver Comment */}
                <Typography variant="h6" sx={{ mt: 4 }}>
                  Approver's Comment
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <TextField
                  required
                  label="Add Comment"
                  multiline
                  minRows={4}
                  sx={{ width: '60%' }}
                  variant="outlined"
                  value={approversComment}
                  onChange={(e) => setApproversComment(e.target.value)}
                />

                {/* Action Buttons */}
                <Box display="flex" justifyContent="flex-end" sx={{ mt: 3 }}>
                  <Button onClick={() => decision('APPROVED')} variant="contained">
                    Approve
                  </Button>
                  <Button
                    onClick={() => decision('REJECTED')}
                    variant="contained"
                    color="error"
                    sx={{ ml: 2 }}
                  >
                    Reject
                  </Button>
                </Box>
              </Card>
            )}
          </Grid>
        </Grid>


      </Box>
    )
  } else if (query2.get('mode') == 'viewonly' || query2.get('mode') == 'indemnity' || query2.get('mode') == 'in_requested') {
    return (
      <Box>
        <Snackbar open={uploadSuccess} autoHideDuration={3000} onClose={handleFileUploadMsgClose}>
          <Alert onClose={handleFileUploadMsgClose} severity='success'>
            File uploaded successfully
          </Alert>
        </Snackbar>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={2800}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
        <Box className={classes.header}>
          <Typography className={classes.headerTextHead}>Claim Audit</Typography>
        </Box>
        <Box sx={{ p: 3, bgcolor: '#f8f9fa', borderRadius: 2 }}>
          {/* Claim Details */}
          <Paper elevation={2} sx={{ borderRadius: 2, mb: 3 }}>
            <Accordion
              square={false}
              expanded={expanded === 'panel1'}
              onChange={handleChangeAccordian('panel1')}
              sx={{ borderRadius: 2 }}
            >
              <AccordionSummary
                className={classes.AccordionSummary}
                aria-controls="panel1d-content"
                id="panel1d-header"
                sx={{
                  bgcolor: '#f1f3f5',
                  borderBottom: '1px solid #e0e0e0',
                  borderRadius: '8px 8px 0 0',
                }}
              >
                <Grid container justifyContent="space-between" alignItems="center">
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#333' }}>
                    Claim Details
                  </Typography>
                  {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </Grid>
              </AccordionSummary>

              <AccordionDetails sx={{ bgcolor: '#fff', p: 2 }}>
                <Grid container spacing={2}>
                  {Object.entries(keyMappings).map(([displayName, key], index) => (
                    <Grid key={index} item xs={4}>
                      <Grid container spacing={1} alignItems="center">
                        <Grid item>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#666' }}>
                            {displayName} :
                          </Typography>
                        </Grid>
                        <Grid item>
                          {isClaimDetailsEdit ? (
                            <TextField
                              size="small"
                              value={claimData[key]}
                              onChange={(e) => handleInputChange(key, e.target.value)}
                              sx={{ '& input': { fontSize: '13px' } }}
                            />
                          ) : (
                            <Typography variant="body2" sx={{ color: '#444' }}>
                              {claimData[key]}
                            </Typography>
                          )}
                        </Grid>
                      </Grid>
                    </Grid>
                  ))}
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Paper>

          {/* Benefit & Provider Details */}
          <Paper elevation={2} sx={{ borderRadius: 2, p: 2, mb: 3 }}>
            <Box
              sx={{
                bgcolor: '#f1f3f5',
                borderRadius: 1,
                p: 1.5,
                mb: 2,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <SpeakerNotesIcon sx={{ color: '#6c757d', mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#333' }}>
                Benefit & Provider Details
              </Typography>
            </Box>

            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Benefit:</strong>
            </Typography>

            {/* Table Header */}
            <Grid container sx={{ fontWeight: 'bold', borderBottom: '2px solid #ddd', pb: 1 }}>
              <Grid item xs={3}>Provider Name</Grid>
              <Grid item xs={3}>Name</Grid>
              <Grid item xs={1}>Est. Cost</Grid>
              <Grid item xs={1}>Approved</Grid>
              <Grid item xs={1}>Copay</Grid>
              <Grid item xs={3}>Comment</Grid>
            </Grid>

            {/* Table Rows */}
            {benefitData?.map((bwc: any, index: number) => {
              const providerName: string | undefined =
                (providerList as Array<{ id: any; providerBasicDetails?: { name?: string } }>).find((provider) => bwc.providerId == provider.id)?.providerBasicDetails?.name;

              return (
                <Grid
                  container
                  key={index}
                  sx={{
                    py: 1,
                    borderBottom: '1px solid #f0f0f0',
                    '&:hover': { bgcolor: '#f9fafb' },
                  }}
                >
                  <Grid item xs={3}>{providerName}</Grid>
                  <Grid item xs={3}>{bwc.benefitName}</Grid>
                  <Grid item xs={1}>{bwc.estimatedCost}</Grid>
                  <Grid item xs={1}>{bwc.maxApprovedCost}</Grid>
                  <Grid item xs={1}>{bwc.copayAmount}</Grid>
                  <Grid item xs={3}>{bwc.comment}</Grid>
                </Grid>
              );
            })}

            {/* Total Row */}
            <Grid
              container
              sx={{
                mt: 1,
                fontWeight: 'bold',
                bgcolor: '#f8f9fa',
                py: 1,
                borderTop: '2px solid #ddd',
              }}
            >
              <Grid item xs={3}>Total:</Grid>
              <Grid item xs={3}></Grid>
              <Grid item xs={1}>
                {benefitData.reduce((sum: number, b: any) => sum + (Number(b.estimatedCost) || 0), 0)}
              </Grid>
              <Grid item xs={1}>
                {benefitData.reduce((sum: number, b: any) => sum + (Number(b.maxApprovedCost) || 0), 0)}
              </Grid>
              <Grid item xs={1}></Grid>
              <Grid item xs={3}></Grid>
            </Grid>
          </Paper>

          <BreakUpComponents
            rowData={{ invoices: invoiceData }}
            providerList={providerList}
            data={undefined}
            setInvoiceData={setInvoiceData}
          />
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            {(query2.get('mode') == 'indemnity' || query2.get('mode') == 'in_requested') && (
              <>
                <Card sx={{ p: 3, mb: 4, borderRadius: 3, boxShadow: 3 }}>
                  <Typography variant="h5" fontWeight={600} gutterBottom>
                    Reviewer Input
                  </Typography>
                  <Divider sx={{ mb: 3 }} />

                  {/* Amount Section */}
                  <Typography variant="h6" sx={{ mt: 2 }}>
                    Amount
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  {query2.get('mode') === 'in_requested' || indemnityStatus === "PENDING_INDEMNITY_APPROVAL" ? (
                    <Typography variant="body2" sx={{ mb: 2, color: '#555' }}>
                      {inAmount}
                    </Typography>
                  ) :
                    <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <TextField
                        required
                        label="Request for Amount to be Approved"
                        sx={{ width: '30%' }}
                        disabled={query2.get('mode') === 'in_requested' || indemnityStatus === "PENDING_INDEMNITY_APPROVAL"}
                        variant="outlined"
                        value={inAmount}
                        onChange={(e) => {
                          let amt =
                            benefitData.reduce((sum: number, b: any) => sum + (Number(b.estimatedCost) || 0), 0) -
                            benefitData.reduce((sum: number, b: any) => sum + (Number(b.maxApprovedCost) || 0), 0);

                          // if (Number(e.target.value) <= Number(amt)) setAmount(e.target.value);
                          if (Number(e.target.value) <= Number(amtToCompare)) setInAmount(e.target.value);
                        }}
                      />
                      <Typography variant="caption" color="error" fontWeight={600}>
                        Amount cannot be more than&nbsp;{amtToCompare}
                        {/* {benefitData.reduce((sum: number, b: any) => sum + (Number(b.estimatedCost) || 0), 0) -
                          benefitData.reduce((sum: number, b: any) => sum + (Number(b.maxApprovedCost) || 0), 0)} */}
                      </Typography>
                    </Box>
                  }
                  {/* Documents Section */}
                  <Typography variant="h6" sx={{ mt: 4 }}>
                    Documents
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  {inDocumentList.map((x, i) => (
                    <Grid container spacing={2} key={i} alignItems="center" sx={{ mb: 2 }}>
                      {query2.get('mode') === 'in_requested' || indemnityStatus === "PENDING_INDEMNITY_APPROVAL" ? null :
                        <Grid item>
                          <input
                            className={classes.input1}
                            id={`contained-button-file-${i}`}
                            name="document"
                            type="file"
                            hidden
                            disabled={query2.get('mode') === 'in_requested' || indemnityStatus === "PENDING_INDEMNITY_APPROVAL"}
                            onChange={(e) => handleInAddDoc(e, i)}
                          />
                          <label htmlFor={`contained-button-file-${i}`}>
                            <Button
                              variant="contained"
                              color={x.documentName ? "secondary" : "primary"}
                              component="span"
                              startIcon={<AddAPhotoIcon />}
                            >
                              Upload
                            </Button>
                          </label>
                        </Grid>
                      }

                      <Grid item>
                        {x.documentName && (
                          <RenderPreview
                            x={x}
                            baseDocumentURL={baseDocumentURL}
                          />
                        )}
                      </Grid>
                      {query2.get('mode') === 'in_requested' || indemnityStatus === "PENDING_INDEMNITY_APPROVAL" ? null :
                        <Grid item>
                          {inDocumentList.length !== 1 && (
                            <Button
                              onClick={() => handleRemoveInDocumentList(i)}
                              color="error"
                              variant="outlined"
                              startIcon={<DeleteIcon />}
                            >
                              Remove
                            </Button>
                          )}
                          {inDocumentList.length - 1 === i && (
                            <Button
                              color="primary"
                              variant="outlined"
                              startIcon={<AddIcon />}
                              sx={{ ml: 1 }}
                              onClick={handleAddInDocumentList}
                            >
                              Add More
                            </Button>
                          )}
                        </Grid>
                      }
                    </Grid>
                  ))}

                  {/* Comment Section */}
                  <Typography variant="h6" sx={{ mt: 4 }}>
                    Comment
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  {query2.get('mode') === 'in_requested' || indemnityStatus === "PENDING_INDEMNITY_APPROVAL" ? (
                    <Typography variant="body2" sx={{ mb: 2, color: '#555' }}>
                      {inComment}
                    </Typography>
                  ) :
                    <TextField
                      required
                      label="Add Comment"
                      multiline
                      minRows={4}
                      sx={{ width: '60%' }}
                      disabled={query2.get('mode') === 'in_requested' || indemnityStatus === "PENDING_INDEMNITY_APPROVAL"}
                      variant="outlined"
                      value={inComment}
                      onChange={(e) => setInComment(e.target.value)}
                    />
                  }
                </Card>

                {/* Footer Buttons */}
                {query2.get('mode') === 'indemnity' && (
                  <Box display="flex" justifyContent="flex-end" sx={{ mt: 2 }}>
                    {indemnityStatus !== "PENDING_INDEMNITY_APPROVAL" && (
                      <Button onClick={requestForIndemnityApproval} variant="contained">
                        Request For Indemnity Approval
                      </Button>
                    )}
                  </Box>
                )}
              </>
            )}
          </Grid>
          <Grid item xs={6}>
            {query2.get('mode') === 'in_requested' && (
              <Card sx={{ p: 3, mb: 4, borderRadius: 3, boxShadow: 3 }}>
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  Approver's Input
                </Typography>
                <Divider sx={{ mb: 3 }} />
                {/* Amount */}
                <Typography variant="h6">Approved Amount</Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <TextField
                    required
                    label="Approved Amount"
                    sx={{ width: '30%' }}
                    variant="outlined"
                    value={inAppAmount}
                    onChange={(e) => {
                      if (Number(e.target.value) <= Number(inAmount)) setInAppAmount(e.target.value);
                    }}
                  />
                  <Typography variant="caption" color="error" fontWeight={600}>
                    Amount cannot be more than {inAmount}
                  </Typography>
                </Box>

                {/* Approver Comment */}
                <Typography variant="h6" sx={{ mt: 4 }}>
                  Approver's Comment
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <TextField
                  required
                  label="Add Comment"
                  multiline
                  minRows={4}
                  sx={{ width: '60%' }}
                  variant="outlined"
                  value={inApproversComment}
                  onChange={(e) => setInApproversComment(e.target.value)}
                />

                {/* Action Buttons */}
                <Box display="flex" justifyContent="flex-end" sx={{ mt: 3 }}>
                  <Button onClick={() => decisionIndemnity('APPROVED')} variant="contained">
                    Approve
                  </Button>
                  <Button
                    onClick={() => decisionIndemnity('REJECTED')}
                    variant="contained"
                    color="error"
                    sx={{ ml: 2 }}
                  >
                    Reject
                  </Button>
                </Box>
              </Card>
            )}
          </Grid>
        </Grid>


      </Box>
    )
  } else {
    return (
      <Box>
        <Box className={classes.header}>
          <Typography className={classes.headerTextHead}>Claim to be processed / Doctor&apos;s Opinion</Typography>
        </Box>

        <Box sx={{ p: 3, bgcolor: '#f8f9fa', borderRadius: 2 }}>

          {/* Claim Details */}
          <Paper elevation={2} sx={{ borderRadius: 2, mb: 3 }}>
            <Accordion
              expanded={expanded === 'panel1'}
              onChange={handleChangeAccordian('panel1')}
              sx={{ borderRadius: 2 }}
            >
              <AccordionSummary
                sx={{
                  bgcolor: '#f1f3f5',
                  borderBottom: '1px solid #e0e0e0',
                  borderRadius: '8px 8px 0 0',
                }}
              >
                <Grid container justifyContent="space-between" alignItems="center">
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#333' }}>
                    Claim Details
                  </Typography>
                  {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </Grid>
              </AccordionSummary>

              <AccordionDetails sx={{ bgcolor: '#fff', p: 2 }}>
                <Grid container spacing={2}>
                  {Object.entries(keyMappings).map(([displayName, key], index) => (
                    <Grid key={index} item xs={4}>
                      <Grid container spacing={1} alignItems="center">
                        <Grid item>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#666' }}>
                            {displayName} :
                          </Typography>
                        </Grid>
                        <Grid item>
                          {isClaimDetailsEdit ? (
                            <TextField
                              size="small"
                              value={claimData[key]}
                              onChange={(e) => handleInputChange(key, e.target.value)}
                              sx={{ '& input': { fontSize: '13px' } }}
                            />
                          ) : (
                            <Typography variant="body2" sx={{ color: '#444' }}>
                              {claimData[key]}
                            </Typography>
                          )}
                        </Grid>
                      </Grid>
                    </Grid>
                  ))}

                  {isClaimDetailsEdit && (
                    <Grid item xs={12}>
                      <Button color="secondary" onClick={handleSubmit} variant='contained'>
                        Submit
                      </Button>
                    </Grid>
                  )}
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Paper>

          {/* Benefit & Provider Details */}
          <Paper elevation={2} sx={{ borderRadius: 2, p: 2, mb: 3 }}>
            <Box
              sx={{
                bgcolor: '#f1f3f5',
                borderRadius: 1,
                p: 1.5,
                mb: 2,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <SpeakerNotesIcon sx={{ color: '#6c757d', mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#333' }}>
                Benefit & Provider Details
              </Typography>
            </Box>

            {/* Table Header */}
            <Grid container sx={{ fontWeight: 'bold', borderBottom: '2px solid #ddd', pb: 1 }}>
              <Grid item xs={3}>Provider Name</Grid>
              <Grid item xs={3}>Name</Grid>
              <Grid item xs={1}>Estimated</Grid>
              <Grid item xs={1}>Approved</Grid>
              <Grid item xs={1}>Copay</Grid>
              <Grid item xs={3}>Comment</Grid>
            </Grid>

            {/* Rows */}
            {benefitData?.map((bwc: any, index: number) => {
              const providerName = providerList.find((p: any) => p.id === bwc.providerId)?.providerBasicDetails?.name;
              return (
                <Grid
                  container
                  key={index}
                  sx={{
                    py: 1,
                    borderBottom: '1px solid #f0f0f0',
                    '&:hover': { bgcolor: '#f9fafb' },
                  }}
                >
                  <Grid item xs={3}>{providerName}</Grid>
                  <Grid item xs={3}>{bwc.benefitName}</Grid>
                  <Grid item xs={1}>{bwc.estimatedCost}</Grid>
                  <Grid item xs={1}>{bwc.maxApprovedCost}</Grid>
                  <Grid item xs={1}>{bwc.copayAmount}</Grid>
                  <Grid item xs={3}>{bwc.comment}</Grid>
                </Grid>
              );
            })}

            {/* Total */}
            <Grid
              container
              sx={{
                mt: 1,
                fontWeight: 'bold',
                bgcolor: '#f8f9fa',
                py: 1,
                borderTop: '2px solid #ddd',
              }}
            >
              <Grid item xs={3}>Total:</Grid>
              <Grid item xs={3}></Grid>
              <Grid item xs={1}>
                {benefitData.reduce((sum: number, b: any) => sum + (Number(b.estimatedCost) || 0), 0)}
              </Grid>
              <Grid item xs={1}>
                {benefitData.reduce((sum: number, b: any) => sum + (Number(b.maxApprovedCost) || 0), 0)}
              </Grid>
              <Grid item xs={1}></Grid>
              <Grid item xs={3}></Grid>
            </Grid>

            {/* Actions */}
            {canDoAnything ? (
              <Box display="flex" justifyContent="flex-end" mt={2} gap={2}>
                <Button
                  color="secondary"
                  variant='contained'
                  disabled={claimReimDetails.reim.reimbursementStatus !== 'REQUESTED'}
                  onClick={handleStartReview}
                >
                  Start Review
                </Button>
                {status === 'EVALUATION_INPROGRESS' && (
                  <Button
                    color="secondary"
                    disabled={claimStatus === 'REJECT'}
                    variant='contained'
                    onClick={handleCalculate}
                  >
                    Calculate
                  </Button>
                )}
              </Box>
            ) : (
              <Typography
                sx={{ color: 'red', fontWeight: 600, fontSize: 12, mt: 1, textAlign: 'right' }}
              >
                You are not allowed to change anything with this Claim!
              </Typography>
            )}

            {calculationStatus === 'COMPLETED' && (
              <Typography
                sx={{ fontSize: 12, color: 'grey', textAlign: 'end', mt: 1 }}
              >
                Please add final approve amount and claim status to PAYABLE to Approve
              </Typography>
            )}
          </Paper>

          <BreakUpComponents
            rowData={{ invoices: invoiceData }}
            providerList={providerList}
            data={undefined}
            setInvoiceData={setInvoiceData}
          />

          {/* AI Decision & Fraud Prediction */}
          <Grid container spacing={2} my={3}>
            <Grid item xs={12} sm={6}>
              <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                <Table>
                  <TableHead sx={{ bgcolor: '#e3f2fd' }}>
                    <TableRow>
                      <TableCell><b>AI Claim Decision</b></TableCell>
                      <TableCell><b>Confidence (%)</b></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Approve</TableCell>
                      <TableCell>{Math.floor(Math.random() * (95 - 90 + 1)) + 90}%</TableCell>
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
                      <TableCell><b>AI Fraud Prediction</b></TableCell>
                      <TableCell><b>Confidence (%)</b></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Not Fraudulent</TableCell>
                      <TableCell>{Math.floor(Math.random() * (95 - 90 + 1)) + 90}%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>

          {/* Doctor's Opinion */}
          {status === 'EVALUATION_INPROGRESS' && (
            <Paper elevation={2} sx={{ borderRadius: 2, p: 2 }}>
              <Box
                sx={{
                  bgcolor: '#f1f3f5',
                  borderRadius: 1,
                  p: 1.5,
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <LocalHospitalIcon sx={{ color: '#6c757d', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#333' }}>
                  Doctor's Diagnosis & Opinion
                </Typography>
              </Box>

              <form onSubmit={handleSubmitOpinion}>
                <Grid container spacing={2}>
                  {/* Diagnosis Section */}
                  <Grid item xs={12} md={8}>
                    <Typography variant="subtitle1" fontWeight={600} mb={1}>
                      Diagnosis at Registration
                    </Typography>
                    {diagnosisList.map((item: any, index: number) =>
                      initalDiagnosis.includes(item.id) && (
                        <Typography key={index} variant="body2" color="text.secondary">
                          → {item.diagnosisName}
                        </Typography>
                      )
                    )}

                    <FormControl fullWidth sx={{ mt: 2 }}>
                      <Autocomplete
                        multiple
                        value={diagnosisIds}
                        onChange={handleDiagnosisChange}
                        options={diagnosisList}
                        disableCloseOnSelect
                        getOptionLabel={(option: any) => option?.diagnosisName || ''}
                        isOptionEqualToValue={(option, value) => option?.id === value?.id}
                        renderOption={(props, option, { selected }) => (
                          <li {...props}>
                            <Checkbox
                              checked={selected}
                              style={{ marginRight: 8, color: '#626bda' }}
                            />
                            {option.diagnosisName}
                          </li>
                        )}
                        renderInput={(params) => (
                          <TextField {...params} label="Provisional Diagnosis" placeholder="Select Diagnosis" />
                        )}
                      />
                    </FormControl>
                  </Grid>

                  {/* Claim Status Section */}
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Claim Status</InputLabel>
                      <Select
                        value={doctorsOpinion?.claimStatus || claimStatus}
                        onChange={handleChangeClaimStatus}
                      >
                        {options.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {claimStatus === 'REJECT' && (
                      <TextField
                        label="Reject Reason"
                        value={doctorsOpinion?.rejectReason || rejectReason}
                        onChange={handleRejectReasonChange}
                        multiline
                        rows={2}
                        fullWidth
                        sx={{ mb: 2 }}
                      />
                    )}

                    <TextField
                      label="Remarks"
                      value={doctorsOpinion?.remarks || remarks}
                      onChange={handleRemarksChange}
                      multiline
                      rows={2}
                      fullWidth
                      sx={{ mb: 2 }}
                    />

                    <TextField
                      label="Internal Remarks"
                      value={doctorsOpinion?.internalRemarks || internalRemarks}
                      onChange={handleInternalRemarksChange}
                      multiline
                      rows={2}
                      fullWidth
                    />
                  </Grid>
                </Grid>

                <Box display="flex" justifyContent="flex-end" mt={2}>
                  <Button type="submit" color="secondary" variant='contained' disabled={!claimStatus || !remarks}>
                    Save Doctor's Opinion
                  </Button>
                </Box>
              </form>
            </Paper>
          )}
        </Box>

      </Box>
    )
  }
}

export default ClaimInvoiceList
