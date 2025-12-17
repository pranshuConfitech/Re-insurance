import React, { useEffect, useRef, useState } from 'react'

import { useRouter } from 'next/navigation'

import { makeStyles } from '@mui/styles'
import { forkJoin } from 'rxjs'
import { map, tap } from 'rxjs/operators'

import { Box, Divider, Grid, Modal, TextField, Tooltip, Typography, useTheme } from '@mui/material'

import { CloseOutlined, Edit, Visibility, Cancel, EventNote, AttachMoney, AttachFile, Check, Close, CheckCircle, Block } from '@mui/icons-material'

import { Button } from 'primereact/button'

import { TreeItem, TreeView } from '@mui/lab'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

import ChevronRightIcon from '@mui/icons-material/ChevronRight'

import { Toast } from 'primereact/toast'

import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

import { PreAuthService } from '@/services/remote-api/api/claims-services'
import { MemberService } from '@/services/remote-api/api/member-services'
import PreAuthTimeLineModal from './modals/preauth.timeline.modal.component'
import preAuthReviewModel, { PRE_AUTH_STATUS_MSG_MAP } from './preauth.shared'

// import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
// import DateFnsUtils from '@date-io/date-fns';

import { PoliticalDot, VIPDot } from '../common/dot.comnponent'

import AdmisssionUpdationModal from '../case-management/modal/waiting-for-hospitalisation/admission.updation.modal'
import HospitalVisitUpdationModal from '../case-management/modal/waiting-for-hospitalisation/hospital.visit.updation.modal'

import RoleService from '@/services/utility/role'
import { BenefitService } from '@/services/remote-api/api/master-services/benefit.service'
import { ProvidersService, ServiceTypeService } from '@/services/remote-api/fettle-remote-api'

import { FettleDataGrid } from '../../shared-component/components/fettle.data.grid'

// localStorage.removeItem('preauthid')
const roleService = new RoleService()

const PAGE_NAME = 'PRE_AUTH'

const style: any = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
}

const modalStyle: any = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  background: '#fff',

  // border: '2px solid #000',
  boxShadow: 24,
  padding: '2% 3%'
}

const useStyles = makeStyles(theme => ({
  tableBg: {
    height: 505,
    width: '100%',
    backgroundColor: '#fff',
    boxShadow: '0px 3px 3px -2px rgb(0 0 0 / 20%), 0px 3px 4px 0px rgb(0 0 0 / 14%), 0px 1px 8px 0px rgb(0 0 0 / 12%)',
    borderRadius: '4px'
  },
  agentListButton: {
    marginLeft: '5px'
  },
  categoryButton: {
    marginLeft: '5px',
    marginBottom: '5px'
  },
  root: {}
}))

const memberservice = new MemberService()
const preAuthService = new PreAuthService()
const benefitService = new BenefitService()
const providerService = new ProvidersService()
const serviceDiagnosis = new ServiceTypeService()

const commentModalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4
}

const getColor = (status: any) => {
  switch (status) {
    case 'Pending Evaluation':
      return { background: 'rgba(149,48,55,0.5)', border: 'rgba(149,48,55,1)' }
    case 'Evaluation in progress':
      return {
        background: 'rgba(255, 252, 127, 0.5)'
      }
    case 'Requested for evaluation':
      return {
        background: '#002776',
        border: 'rgba(4, 59, 92, 1)',
        color: '#f1f1f1'
      }
    case 'Approved':
      return {
        background: 'rgba(1, 222, 116, 0.5)',
        border: 'rgba(1, 222, 116, 1)'
      }
    case 'Rejected':
      return { background: 'rgba(255,50,67,0.5)', border: 'rgba(255,50,67,1)' }
    case 'Document Requested':
      return {
        background: '#ffc107',
        color: '#212529'
      }
    case 'Approved failed':
      return { background: 'rgb(139, 0, 0,0.5)', border: 'rgb(139, 0, 0)' }
    case 'Draft':
      return {
        background: '#17a2b8',
        color: '#f1f1f1'
      }
    case 'Waiting for Claim':
      return {
        background: '#ffc107',
        color: '#212529'
      }
    case 'Cancelled':
      return { background: '#c70000', color: '#f1f1f1' }
    case 'Reverted':
      return {
        background: '#808000',
        color: '#f1f1f1'
      }
    case 'Claim Initiated':
      return {
        background: 'rgba(38,194, 129, 0.5)',
        border: 'rgba(38, 194, 129, 1)'
      }
    case 'Document Submited':
      return {
        background: '#D80E51',
        color: '#f1f1f1'
      }
    default:
      return {
        background: 'rgba(227, 61, 148, 0.5)',
        border: 'rgba(227, 61, 148, 1)'
      }
  }
}

const docTempalte = {
  documentType: '',
  docFormat: '',
  documentName: '',
  documentOriginalName: ''
}

export default function PreAuthOPDListComponent(props: any) {
  const history = useRouter()
  const toast: any = useRef(null)
  const [rows, setRows] = React.useState(props.rows)
  const [openReviewModal, setOpenReviewModal] = React.useState(false)
  const [cancelModal, setCancelModal] = React.useState(false)
  const [cancelReason, setCancelReason] = React.useState()
  const [openTimeLineModal, setOpenTimeLineModal] = React.useState(false)
  const [cancelPreAuthId, setCancelPreAuthId] = React.useState('')
  const [selectedPreAuthForReview, setSelectedPreAuthForReview] = React.useState(preAuthReviewModel())
  const [selectedPreAuth, setSelectedPreAuth] = React.useState({})
  const [searchType, setSearchType] = React.useState(0)
  const [searchModal, setSearchModal] = React.useState(false)
  const [fromExpectedDOA, setFromExpectedDOA] = React.useState(null)
  const [toExpectedDOA, setToExpectedDOA] = React.useState(null)
  const [fromExpectedDOD, setFromExpectedDOD] = React.useState(null)
  const [toExpectedDOD, setToExpectedDOD] = React.useState(null)
  const [fromDate, setFromDate] = React.useState(null)
  const [toDate, setToDate] = React.useState(null)
  const [reloadTable, setReloadTable] = React.useState<boolean>(false)
  const [state, setState] = React.useState()
  const [benefits, setBenefits] = useState()
  const [commentModal, setCommentModal] = React.useState(false)
  const [approvalRemark, setApprovalRemark] = React.useState('')
  const [approvalId, setApprovalId] = React.useState('')
  const [decision, setDecision] = React.useState('')
  const [providers, setProviders] = useState<any>()
  const classes = useStyles()
  const theme = useTheme()
  const [isHovered, setIsHovered] = useState(false)
  const [admissionUpdationModal, setAdmissionUpdationModal] = React.useState(false)
  const [hospitaVisitUpdation, setHospitaVisitUpdation] = React.useState(false)
  const [preAuthId, setPreAuthId] = React.useState('')
  const [memberShipNo, setMemberShipNo] = React.useState()
  const [documentList, setDocumentList] = React.useState([{ ...docTempalte }])
  const [userType, setUserType] = useState<string | null>(null)

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  const utclongDate = (date: any) => {
    if (!date) return undefined

    return date.getTime()
  }

  useEffect(() => {
    localStorage.removeItem('preauthid')
    const storedUserType = localStorage.getItem('userType')

    setUserType(storedUserType)
  }, [])

  useEffect(() => {
    const subscription = benefitService
      .getAllBenefit({ page: 0, size: 1000, summary: true, active: true, sort: ['rowCreatedDate dsc'] })
      .subscribe((result: any) => {
        setBenefits(result.content)
      })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const subscription = providerService
      .getProviders({ page: 0, size: 10000, summary: true, active: true, sort: ['rowCreatedDate dsc'] })
      .subscribe((result: any) => {
        setProviders(result.content)
      })

    return () => subscription.unsubscribe()
  }, [])

  const handleProvider = (rowData: any) => {
    const length = rowData?.providers?.length

    const invoiceProviders = rowData?.benefit?.map((prov: any, i: number) => {
      const provider = providers?.find((p: any) => p?.id === prov?.providerId)

      if (provider) {
        if (prov?.benefit?.length) {
          return (
            <TreeItem
              key={`TreeItemOPD1-${i}`}
              itemID={prov?.providerId}
              nodeId='999'
              label={
                <Typography
                  sx={{ fontSize: '12px' }}
                >{`${provider?.providerBasicDetails?.name}: ${prov?.estimatedCost}`}</Typography>
              }
            >
              {renderBenefitWithCost({ benefitsWithCost: prov?.benefit })}
            </TreeItem>
          )
        } else {
          return (
            <TreeItem
              key={`TreeItemOPD2-${i}`}
              itemID={prov?.providerId}
              label={
                <Typography
                  sx={{ fontSize: '12px' }}
                >{`${provider?.providerBasicDetails?.name}: ${prov?.estimatedCost}`}</Typography>
              }
            ></TreeItem>
          )
        }
      } else {
        return (
          <TreeItem
            key={`TreeItemOPD3-${i}`}
            itemID={prov?.providerId}
            label={<Typography sx={{ fontSize: '12px' }}>{`Unknown: ${prov?.estimatedCost || null}`}</Typography>}
          ></TreeItem>
        )
      }
    })

    const totalAmount = rowData?.providers?.reduce((acc: any, curr: any) => acc + curr?.estimatedCost, 0)

    return (
      <TreeView
        className={classes.root}
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
      >
        <TreeItem
          itemID='grid'
          nodeId='1'
          label={
            <Typography sx={{ fontSize: '12px' }}>{`${length} ${length === 1 ? 'Provider: ' : 'Providers: '
              } ${totalAmount}`}</Typography>
          }
        >
          {invoiceProviders}
        </TreeItem>
      </TreeView>
    )
  }

  const renderBenefitWithCost = (rowData: any) => {
    // console.log("rowData", rowData);
    const length = rowData?.benefitsWithCost?.length

    // const benefitsWithCost = rowData.benefitsWithCost?.map((ben) => {
    //   const benefitName = benefits?.find(
    //     (item) => item.id === ben?.benefitId
    //   )?.name;
    //   return ben?.benefitName ? (
    //     <TreeItem
    //       itemId={ben?.benefitId}
    //       label={
    //         <Typography
    //           sx={{ fontSize: "12px" }}
    //         >{`${ben?.benefitName}: ${ben?.estimatedCost}`}</Typography>
    //       }
    //     ></TreeItem>
    //   ) : (
    //     <TreeItem
    //       itemId={ben?.benefitId}
    //       label={
    //         <Typography sx={{ fontSize: "12px" }}>{`Unknown: ${
    //           ben?.estimatedCost || null
    //         }`}</Typography>
    //       }
    //     ></TreeItem>
    //   );
    // });
    // const benefitsWithCost = rowData?.benefitsWithCost?.map((benefit) => {
    //   const provider = providers?.find(p => p?.id === benefit?.providerId);

    //   // if (providerId == benefit.providerId) {
    //     return (
    //       <TreeItem
    //         // itemId={benefit?.providerId}
    //         nodeId={"_" + Math.random().toString(24).substring(2, 9)}
    //         label={
    //           <Typography
    //             sx={{ fontSize: "12px" }}
    //           >{`${provider?.providerBasicDetails?.name}: ${benefit?.estimatedCost}`}</Typography>
    //           // >{`${benefit?.providerId}: ${benefit?.estimatedCost}`}</Typography>
    //         }
    //       >
    //         <TreeItem
    //           nodeId={"_" + Math.random().toString(24).substring(2, 9)}
    //           // itemID={benefit?.benefitId}
    //           label={
    //             <Typography
    //               sx={{ fontSize: "12px" }}
    //             >{`${benefit?.benefitName}: ${benefit?.estimatedCost}`}</Typography>
    //           }
    //         >
    //           <TreeItem
    //             nodeId={"_" + Math.random().toString(24).substring(2, 9)}
    //             // itemID={benefit?.interventionCode}
    //             label={
    //               <Typography
    //                 sx={{ fontSize: "12px" }}
    //               >{`${benefit?.iname}: ${benefit?.estimatedCost}`}</Typography>
    //             }
    //           >
    //             <TreeItem
    //               nodeId={"_" + Math.random().toString(24).substring(2, 9)}
    //               // itemID={benefit?.diagnosis}
    //               label={
    //                 <Typography
    //                   sx={{ fontSize: "12px" }}
    //                 >{`${benefit?.diagnosisName}: ${benefit?.estimatedCost}`}</Typography>
    //               }
    //             ></TreeItem>
    //           </TreeItem>
    //         </TreeItem>
    //       </TreeItem>
    //     );
    //   // }
    // });

    // console.log(
    //   "benefits",
    //   // benefitsWithCost,
    //   // rowData?.benefitWithCost
    // );
    const totalAmount = rowData.benefitsWithCost.reduce((acc: any, curr: any) => acc + curr.estimatedCost, 0)

    const benefitsWithCost = rowData.benefitsWithCost?.map((ben: any, index: number) => {
      const provider = providers?.find((p: any) => p?.id === ben?.providerId)

      return (
        <li key={`${ben?.providerId}-${ben?.benefitId}-${index}`}>
          {provider?.providerBasicDetails?.name} | {ben.benefitName} | {ben.diagnosisName} :
          <b>{ben.estimatedCost}</b>
        </li>
      )
    })

    return (
      // <TreeView defaultCollapseIcon={<ExpandMoreIcon />} defaultExpandIcon={<ChevronRightIcon />}>
      //   <TreeItem
      //     nodeId={0}
      //     // nodeId={"_" + Math.random().toString(24).substring(2, 9)}
      //     // itemID="provider"
      //     label={
      //       <Typography sx={{ fontSize: "12px" }}>{`${length} ${
      //         length === 1 ? "Provider: " : "Providers: "
      //       } ${totalAmount}`}</Typography>
      //     }
      //   >
      //     {benefitsWithCost}
      //   </TreeItem>
      // </TreeView>
      <span>{benefitsWithCost}</span>
    )
  }

  // const renderBenefitWithCost =  (rowData:any) => {
  //   const benefitsWithCost = rowData?.benefitsWithCost?.map(ben => {
  //     const benefitName = benefits?.find(item => item.id === ben?.benefitId)?.name;
  //     return benefitName ? (
  //       <TreeItem
  //         itemID={ben?.benefitId}
  //         label={<Typography sx={{ fontSize: '12px' }}>{`${ben?.benefitName}: ${ben?.estimatedCost}`}</Typography>}></TreeItem>
  //     ) : (
  //       <TreeItem
  //         itemID={ben?.benefitId}
  //         label={<Typography sx={{ fontSize: '12px' }}>{`Unknown: ${ben?.estimatedCost || null}`}</Typography>}></TreeItem>
  //     );
  //   });

  //   const totalAmount = rowData?.benefitsWithCost?.reduce((acc, curr) => acc + curr?.estimatedCost, 0);

  //   return (
  //     <TreeView className={classes.root} defaultCollapseIcon={<ExpandMoreIcon />} defaultExpandIcon={<ChevronRightIcon />}>
  //       <TreeItem
  //         nodeId="1"
  //         itemID="grid"
  //         label={<Typography sx={{ fontSize: '12px' }}>{`Benifits: ${totalAmount}`}</Typography>}>
  //         {benefitsWithCost}
  //       </TreeItem>
  //     </TreeView>
  //   );
  // };

  // Main columns visible in collapsed row
  const mainColumns = [
    {
      field: 'id',
      headerName: 'Pre-Auth No.',
      body: (rowData: any) => (
        <span
          style={{ lineBreak: 'anywhere', textDecoration: 'underline', cursor: 'pointer' }}
          onClick={() => {
            history.push(`/claims/claims-preauth/review/${rowData.id}?mode=viewOnly&auth=OPD`)
          }}
        >
          {rowData.id}
        </span>
      )
    },
    { field: 'memberShipNo', headerName: 'Membership No.' },
    {
      field: 'memberName',
      headerName: 'Name',
      body: (rowData: any) => (
        <div>
          <span>{rowData?.memberName}</span>
          <span onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            {rowData.vip && <VIPDot />}
          </span>
          <span>
            {rowData.political && (
              <PoliticalDot />
            )}
          </span>
        </div>
      )
    },
    { field: 'policyNumber', headerName: 'Policy No.' },
    {
      field: 'status',
      headerName: 'Status',
      body: (rowData: any) =>
        rowData.status == 'Document Requested' ? (
          <Tooltip title={rowData?.addDocRemark}>
            <span
              style={{
                backgroundColor: getColor(rowData.status).background,
                color: getColor(rowData.status).color ? getColor(rowData.status).color : '#3c3c3c',
                fontSize: '12px',
                fontWeight: '600',
                borderRadius: '8px',
                padding: '6px'
              }}
            >
              {rowData.status}
            </span>
          </Tooltip>
        ) : (
          <span
            style={{
              backgroundColor: getColor(rowData.status).background,
              color: getColor(rowData.status).color ? getColor(rowData.status).color : '#3c3c3c',
              fontSize: '12px',
              fontWeight: '600',
              borderRadius: '8px',
              padding: '6px'
            }}
          >
            {rowData.status}
          </span>
        )
    }
  ]

  // Expanded columns visible when row is expanded
  const expandedColumns = [
    { field: 'admissionDate', headerName: 'Admission Date' },
    { field: 'dischargeDate', headerName: 'Discharge Date' },
    {
      field: 'benefitWithCost',
      headerName: 'Estimated Cost',
      body: (rowData: any) => (
        <span style={{ whiteSpace: 'break-spaces' }}>{renderBenefitWithCost(rowData)}</span>
      )
    }
  ]

  // Keep original for backward compatibility
  const columnsDefinations = mainColumns

  const dataSource$: any = (
    pageRequest: any = {
      page: 0,
      size: 10,
      summary: true,
      active: true,
      preAuthType: 'OPD'

      // fromExpectedDOA: fromExpectedDOA,
      // toExpectedDOA: fromExpectedDOA,
      // fromExpectedDOD: fromExpectedDOD,
      // toExpectedDOD: toExpectedDOD,
      // fromDate: fromDate,
      // toDate: toDate,
    }
  ) => {
    pageRequest.sort = ['rowCreatedDate dsc']

    if (pageRequest.searchKey) {
      pageRequest['memberShipNo'] = pageRequest.searchKey.toUpperCase().trim()
      pageRequest['preAuthStatus'] = pageRequest.searchKey.toUpperCase().trim()
      pageRequest['policyNumber'] = pageRequest.searchKey.toUpperCase().trim()
      pageRequest['id'] = pageRequest.searchKey.toUpperCase().trim()
      pageRequest['memberName'] = pageRequest.searchKey.toUpperCase().trim()
      delete pageRequest.searchKey
    }

    if (userType === 'DOCTOR') {
      pageRequest['preAuthStatus'] = 'PENDING_GATEKEPING_DOCTOR_APPROVAL'
    }

    if (userType === 'SURVEILLANCE') {
      pageRequest['preAuthStatus'] = 'PENDING_SURVEILLANCE'
    }

    const querytype = {
      1: {
        fromExpectedDOA: utclongDate(fromExpectedDOA),
        toExpectedDOA: toExpectedDOA ? utclongDate(toExpectedDOA) : utclongDate(fromExpectedDOA)
      },
      2: {
        fromExpectedDOD: utclongDate(fromExpectedDOD),
        toExpectedDOD: toExpectedDOD ? utclongDate(toExpectedDOD) : utclongDate(fromExpectedDOD)
      },
      3: {
        fromDate: utclongDate(fromDate),
        toDate: toDate ? utclongDate(toDate) : utclongDate(fromDate)
      }
    }

    const pagerequestquery = {
      page: pageRequest.page,
      size: pageRequest.size,
      summary: true,
      active: true,
      ...(searchType && querytype[searchType as keyof typeof querytype])
    }

    return preAuthService.getAllPreAuths(searchType ? pagerequestquery : pageRequest).pipe(
      map(data => {
        const content = data?.data?.content

        const records = content.map((item: any) => {
          item['admissionDate'] = new Date(item.expectedDOA).toLocaleDateString()
          item['dischargeDate'] = new Date(item.expectedDOD).toLocaleDateString()
          item['status'] = PRE_AUTH_STATUS_MSG_MAP[item.preAuthStatus as keyof typeof PRE_AUTH_STATUS_MSG_MAP]

          return item
        })

        data.content = records

        return data?.data
      })
    )
  }

  const handleOpen = () => {
    history.push('/claims/claims-preauth?mode=create&auth=OPD')
  }

  React.useEffect(() => {
    setRows(props.rows)
  }, [props.rows])

  const openEditSection = (preAuth: any) => {
    history.push(`/claims/claims-preauth/${preAuth.id}?mode=edit&auth=OPD`)
  }

  const openReviewSection = (preAuth: any) => {
    history.push(`/claims/claims-preauth/review/${preAuth.id}?auth=OPD`)
  }

  const cancelPreAuth = (preAuth: any) => {
    setCancelModal(true)
    setCancelPreAuthId(preAuth.id)
  }

  const onConfirmCancel = () => {
    const payload = {
      reasonForCancellation: cancelReason
    }

    preAuthService.cancelPreAuth(payload, cancelPreAuthId).subscribe(res => {
      setTimeout(() => {
        window.location.reload()
      }, 300)
    })
  }

  const onConfirmCancels = () => {
    setCancelModal(false)
  }

  const openForReview = (preAuth: any) => {
    const pageRequest = {
      page: 0,
      size: 10,
      summary: true,
      active: true,
      key: 'MEMBERSHIP_NO',
      value: preAuth.memberShipNo,
      key1: 'policyNumber',
      value1: preAuth.policyNumber
    }

    const bts$ = benefitService.getAllBenefit({ page: 0, size: 1000, summary: true })
    const ps$ = providerService.getProviders()

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

    memberservice.getMember(pageRequest).subscribe(res => {
      if (res.content?.length > 0) {
        const member = res.content[0]

        setSelectedPreAuthForReview({ member, preAuth })
        setOpenReviewModal(true)
      }
    })
  }

  const openTimeLine = (preAuth: any) => {
    setSelectedPreAuth(preAuth)
    setOpenTimeLineModal(true)
  }

  const approvalFromDoctor = () => {
    const body = {
      decission: decision,
      coment: approvalRemark
    }

    preAuthService.approvePreAuth(body, approvalId).subscribe(res => {
      setReloadTable(true)
      setTimeout(() => {
        setReloadTable(false)
      }, 1000)
      setCommentModal(false)
    })
  }

  const approveFromDoctor = (preAuth: any) => {
    setApprovalId(preAuth.id)
    setCommentModal(true)
    setDecision('APPROVED')
  }

  const rejectFromDoctor = (preAuth: any) => {
    setApprovalId(preAuth.id)
    setCommentModal(true)
    setDecision('REJECTED')
  }

  const openReimbursement = (preAuth: any) => {
    history.push(`/claims/claims?mode=create&type=preauth&preId=` + preAuth.id)
  }

  const openDocumentsSection = (preAuth: any) => {
    history.push(`/claims/claims-preauth/${preAuth.id}?mode=edit&auth=OPD&addDoc=true`)
  }

  const handleCloseReviewModal = () => {
    setOpenReviewModal(false)
  }

  const handleCloseTimeLineModal = () => {
    setOpenTimeLineModal(false)
  }

  const disableEnhance = (item: any) => {
    return (
      item.preAuthStatus != 'DRAFT' &&
      item.preAuthStatus != 'REVERTED' &&
      item.preAuthStatus != 'APPROVED' &&
      item.preAuthStatus != 'REJECTED'
    )
  }

  const disableClaimReimburse = (item: any) => {
    return item.preAuthStatus != 'WAITING_FOR_CLAIM'
  }

  const disableAddDocs = (item: any) => {
    return item.preAuthStatus != 'ADD_DOC_REQUESTED'
  }

  const disableReviewButton = (item: any) => {
    return (
      item.preAuthStatus != 'IN REVIEW' &&
      item.preAuthStatus != 'REQUESTED' &&
      item.preAuthStatus != 'EVALUATION_INPROGRESS' &&
      item.preAuthStatus != 'PENDING_EVALUATION' &&
      item.preAuthStatus != 'ADD_DOC_SUBMITTED' &&
      item.preAuthStatus != 'GATEKEPING_DOCTOR_APPROVED' &&
      item.preAuthStatus != 'SURVEILANCE_NOT_NEEDED'
    )
  }

  const disableCancelButton = (item: any) => {
    return item.preAuthStatus == 'CANCELLED'
  }

  const onSearch = () => {
    setSearchModal(false)
    setReloadTable(true)
    setTimeout(() => {
      setReloadTable(false)

      // setSearchDischargeDate('');
      // setSearchAdmissionDate('');
      setFromExpectedDOA(null)
      setToExpectedDOA(null)
      setFromExpectedDOD(null)
      setToExpectedDOD(null)
      setFromDate(null)
      setToDate(null)
    }, 1000)
  }

  const preAuthDOASearch = (type: any) => {
    setSearchModal(true)
    setSearchType(1)
  }

  const preAuthDODSearch = (type: any) => {
    setSearchModal(true)
    setSearchType(2)
  }

  const preAuthCreationSearch = (type: any) => {
    setSearchModal(true)
    setSearchType(3)
  }

  const clearAllClick = () => {
    setFromExpectedDOA(null)
    setToExpectedDOA(null)
    setFromExpectedDOD(null)
    setToExpectedDOD(null)
    setFromDate(null)
    setToDate(null)
    setSearchType(0)
    setReloadTable(true)
  }

  const actionButtons = [
    {
      key: 'update_preauth',
      icon: <Edit fontSize="small" />,
      color: '#fbac05',
      disabled: disableEnhance,
      className: classes.categoryButton,
      onClick: openEditSection,
      tooltip: 'Enhance'
    },
    {
      key: 'review_preauth',
      icon: <Visibility fontSize="small" />,
      color: '#18a2b8',
      disabled: disableReviewButton,
      className: classes.categoryButton,
      onClick: openReviewSection,
      tooltip: 'Review'
    },
    {
      key: 'review_cancel',
      icon: <Cancel fontSize="small" />,
      color: '#dc3545',
      className: classes.categoryButton,
      disabled: disableCancelButton,
      onClick: cancelPreAuth,
      tooltip: 'Cancel'
    },
    {
      key: 'timeleine_preauth',
      icon: <EventNote fontSize="small" />,
      color: '#6f42c1',
      className: classes.categoryButton,
      onClick: openTimeLine,
      tooltip: 'Timeline'
    },
    {
      key: 'claim_preauth',
      icon: <AttachMoney fontSize="small" />,
      color: '#28a745',
      className: classes.categoryButton,
      disabled: disableClaimReimburse,
      onClick: openReimbursement,
      tooltip: 'Claim'
    },
    {
      key: 'add_docs_preauth',
      icon: <AttachFile fontSize="small" />,
      color: '#17a2b8',
      className: classes.categoryButton,
      onClick: openDocumentsSection,
      tooltip: 'Add Documents'
    }
  ]

  const DoctorsApproveButtons = [
    {
      key: 'timeleine_preauth',
      icon: <EventNote fontSize="small" />,
      color: '#6f42c1',
      className: classes.categoryButton,
      onClick: openTimeLine,
      tooltip: 'Timeline'
    },
    {
      key: 'approve_preauth',
      icon: <Check fontSize="small" />,
      color: '#28a745',
      className: classes.categoryButton,
      onClick: approveFromDoctor,
      tooltip: 'Approve'
    },
    {
      key: 'reject_preauth',
      icon: <Close fontSize="small" />,
      color: '#dc3545',
      className: classes.categoryButton,
      onClick: rejectFromDoctor,
      tooltip: 'Reject'
    }
  ]

  const handleAdmissionUpdate = (rowData: any) => {
    const { id, memberShipNo } = rowData

    setAdmissionUpdationModal(true)
    setPreAuthId(id)
    setMemberShipNo(memberShipNo)
  }

  const handleHospitalVisitUpdate = (rowData: any) => {
    const { id, memberShipNo } = rowData

    setHospitaVisitUpdation(true)
    setPreAuthId(id)
    setMemberShipNo(memberShipNo)
  }

  const handleCloseAdmissionModal = () => {
    setAdmissionUpdationModal(false)
  }

  const handleCloseHospitalVisitUpdate = () => {
    setHospitaVisitUpdation(false)
  }

  const admissionUpdationModalSubmit = (values: any) => {
    handleCloseAdmissionModal()
    handleCloseHospitalVisitUpdate()

    const payload = {
      memberShipNo: memberShipNo,
      preauthId: preAuthId,
      ...values
    }

    preAuthService.admissionUpdate(preAuthId, payload).subscribe(res => {
      toast.current.show({ severity: 'success', summary: 'Success', detail: 'Content Updated', life: 2000 })
    })
    const reader = new FileReader()
    const readers = new FileReader()

    readers.onload = function () {
      const list: any = [...documentList]

      list['documentOriginalName'] = payload?.feedbackForm?.name
      setDocumentList(list)
      const formData = new FormData()

      formData.append('docType', 'FEEDBACK_FORM')
      formData.append('filePart', payload?.feedbackForm)
      preAuthService.downloadDischargeDocs(preAuthId, formData).subscribe(response => {
        // list[0]['documentName']=response.get('id');
        // list[1]['docFormat']=response.get('docFormat');
        // setDocumentList(list);
      })
    }

    reader.onload = function () {
      const list: any = [...documentList]

      list['documentOriginalName'] = payload?.dischargeCertificate?.name
      setDocumentList(list)
      const formData = new FormData()

      formData.append('docType', 'DISCHARGE_CERTIFICATE')
      formData.append('filePart', payload?.dischargeCertificate)
      preAuthService.downloadDischargeDocs(preAuthId, formData).subscribe(response => {
        // list[0]['documentName']=response.get('id');
        // list[1]['docFormat']=response.get('docFormat');
        // setDocumentList(list);
      })
    }

    reader.readAsDataURL(payload?.dischargeCertificate)
    readers.readAsDataURL(payload?.feedbackForm)
  }

  const SurveillacneButtons = [
    {
      key: 'admitted_preauth',
      icon: <CheckCircle fontSize="small" />,
      color: '#28a745',
      className: 'ui-button-warning',
      tooltip: 'Admitted',
      onClick: handleAdmissionUpdate
    },
    {
      key: 'not_admitted_preauth',
      icon: <Block fontSize="small" />,
      color: '#dc3545',
      className: classes.categoryButton,
      tooltip: 'Not Admitted',
      onClick: handleHospitalVisitUpdate
    },
    {
      key: 'timeleine_preauth',
      icon: <EventNote fontSize="small" />,
      color: '#6f42c1',
      className: classes.categoryButton,
      onClick: openTimeLine,
      tooltip: 'Timeline'
    }
  ]

  const xlsColumns = [
    'id',
    'memberShipNo',
    'memberName',
    'policyNumber',
    'admissionDate',
    'dischargeDate',
    'benefitWithCost',
    'status'
  ]

  const configuration: any = {
    enableSelection: false,
    useAccordionMode: true,
    scrollHeight: '600px',
    pageSize: 10,
    actionButtons:
      userType === 'DOCTOR'
        ? DoctorsApproveButtons
        : userType === 'SURVEILLANCE'
          ? SurveillacneButtons
          : userType === 'TPA'
            ? ''
            : actionButtons,
    columnOptions: {
      enableSorting: true,
      enableColumnMenu: true,
      enableFiltering: true,
      enableColumnVisibility: false
    },
    expandableConfig: {
      gridTemplate: '60px 1.5fr 1.5fr 1fr 1fr 1.1fr 1.4fr',
      // Color dot removed as per requirement
      getStatusColor: () => 'transparent',
      renderExpandedContent: (row: any) => (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', padding: '0 20px' }}>
          {expandedColumns.map((col: any, index: number) => (
            <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ color: '#6c757d', fontSize: '12px', fontWeight: 500, textTransform: 'uppercase' }}>
                {col.headerName}
              </span>
              <span style={{ color: '#212529', fontSize: '14px', fontWeight: 500 }}>
                {col.body ? col.body(row) : (row[col.field] || 'N/A')}
              </span>
            </div>
          ))}
        </div>
      )
    },
    header: {
      enable: true,
      enableDownload: true,
      downloadbleColumns: xlsColumns,
      // Plus button commented out - using Create button in PreAuthTabComponent instead
      // addCreateButton: userType !== 'TPA' && roleService.checkActionPermission(PAGE_NAME, 'CREATE'),
      // onCreateButtonClick: handleOpen,
      text: 'Pre-Auth - OPD',
      enableGlobalSearch: true,
      searchText: 'Search by Claim No, Membership No, Name, Policy id or Status',
      // Dropdown arrow near searchbar commented out as per requirement
      // selectionMenus: [
      //   { icon: 'pi pi-calendar', label: 'Admission Date', onClick: preAuthDOASearch },
      //   { icon: 'pi pi-calendar', label: 'Discharge Date', onClick: preAuthDODSearch },
      //   { icon: 'pi pi-calendar-plus', label: 'Creation Date', onClick: preAuthCreationSearch },
      //   { icon: 'pi pi-times-circle', label: 'Clear All', onClick: clearAllClick }
      // ],
      // selectionMenuButtonText: 'Search'
    }
  }

  return (
    <div>
      <Toast ref={toast} />
      <FettleDataGrid
        $datasource={dataSource$}
        config={configuration}
        columnsdefination={columnsDefinations}
        onEdit={openEditSection}

      // reloadtable={reloadTable}
      />

      {/* <PreAuthReviewModal preAuthReviewModel={selectedPreAuthForReview} open={openReviewModal} onClose={handleCloseReviewModal} setState={setSelectedPreAuthForReview}></PreAuthReviewModal> */}
      <PreAuthTimeLineModal preAuth={selectedPreAuth} open={openTimeLineModal} onClose={handleCloseTimeLineModal} />

      <Modal
        open={cancelModal}
        onClose={() => {
          setCancelModal(false)
        }}
      >
        <Box sx={style}>
          <div style={{ padding: '5px' }}>
            <strong>Cancel Reason</strong>
            <Grid container rowSpacing={5} style={{ marginTop: '10px' }}>
              <Grid item xs={12}>
                <TextField
                  required
                  id='filled-multiline-static'
                  label='Add comment'
                  multiline
                  fullWidth
                  minRows={4}
                  variant='filled'
                  onChange={(e: any) => {
                    setCancelReason(e.target.value)
                  }}
                />
              </Grid>
            </Grid>
          </div>
          <Box display={'flex'} justifyContent={'end'} marginTop={'15px'}>
            <Button color='primary' onClick={onConfirmCancel}>
              Cancel PreAuth
            </Button>
            <Button className='p-button-text' onClick={onConfirmCancels}>
              No
            </Button>
          </Box>
        </Box>
      </Modal>

      <Modal open={searchModal} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
        <Box style={modalStyle}>
          <Box>
            <Box id='alert-dialog-slide-description'>
              {searchType == 1 && (
                <>
                  <Box display={'flex'} justifyContent={'space-between'}>
                    <Box component='h3' marginBottom={'10px'}>
                      Search By Date of Admission
                    </Box>
                    <CloseOutlined onClick={() => setSearchModal(false)} style={{ cursor: 'pointer' }} />
                  </Box>
                  <Box display={'flex'} marginBottom={'10px'}>
                    <Box display={'flex'}>
                      <Typography
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          fontSize: '14px',
                          fontWeight: '700',
                          textTransform: 'capitalize'
                        }}
                      >
                        From
                      </Typography>
                      &nbsp;
                      <span style={{ display: 'flex', alignItems: 'center' }}>:</span>&nbsp;
                      <Box style={{ marginBottom: '10px' }}>
                        {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <KeyboardDatePicker
                            views={['year', 'month', 'date']}
                            variant="inline"
                            format="dd/MM/yyyy"
                            margin="normal"
                            autoOk={true}
                            id="date-picker-inline"
                            value={fromExpectedDOA}
                            onChange={date => setFromExpectedDOA(date)}
                            KeyboardButtonProps={{
                              'aria-label': 'change ing date',
                            }}
                          />
                        </MuiPickersUtilsProvider> */}
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            views={['year', 'month', 'day']}
                            value={fromExpectedDOA}
                            onChange={date => setFromExpectedDOA(date)}
                            renderInput={params => <TextField {...params} margin='normal' variant='outlined' />}
                          />
                        </LocalizationProvider>
                      </Box>
                    </Box>
                    <Box display={'flex'} marginLeft={'3%'}>
                      <Typography
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          fontSize: '14px',
                          fontWeight: '700',
                          textTransform: 'capitalize'
                        }}
                      >
                        To
                      </Typography>
                      &nbsp;
                      <span style={{ display: 'flex', alignItems: 'center' }}>:</span>&nbsp;
                      <Box style={{ marginBottom: '10px' }}>
                        {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <KeyboardDatePicker
                            views={['year', 'month', 'date']}
                            variant="inline"
                            format="dd/MM/yyyy"
                            margin="normal"
                            autoOk={true}
                            id="date-picker-inline"
                            value={toExpectedDOA}
                            onChange={date => setToExpectedDOA(date)}
                            KeyboardButtonProps={{
                              'aria-label': 'change ing date',
                            }}
                          />
                        </MuiPickersUtilsProvider> */}
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            views={['year', 'month', 'day']}
                            value={toExpectedDOA}
                            onChange={date => setToExpectedDOA(date)}
                            renderInput={params => <TextField {...params} margin='normal' variant='outlined' />}
                          />
                        </LocalizationProvider>
                      </Box>
                    </Box>
                  </Box>
                </>
              )}
              {searchType == 2 && (
                <>
                  <Box display={'flex'} justifyContent={'space-between'}>
                    <Box component='h3' marginBottom={'10px'}>
                      Seach by Date of Discharge
                    </Box>
                    <CloseOutlined onClick={() => setSearchModal(false)} style={{ cursor: 'pointer' }} />
                  </Box>
                  <Box display={'flex'} marginBottom={'10px'}>
                    <Box display={'flex'}>
                      <Typography
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          fontSize: '14px',
                          fontWeight: '700',
                          textTransform: 'capitalize'
                        }}
                      >
                        From
                      </Typography>
                      &nbsp;
                      <span style={{ display: 'flex', alignItems: 'center' }}>:</span>&nbsp;
                      <Box style={{ marginBottom: '10px' }}>
                        {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <KeyboardDatePicker
                            views={['year', 'month', 'date']}
                            variant="inline"
                            format="dd/MM/yyyy"
                            margin="normal"
                            autoOk={true}
                            id="date-picker-inline"
                            value={fromExpectedDOD}
                            onChange={date => setFromExpectedDOD(date)}
                            KeyboardButtonProps={{
                              'aria-label': 'change ing date',
                            }}
                          />
                        </MuiPickersUtilsProvider> */}
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            views={['year', 'month', 'day']}
                            value={fromExpectedDOD}
                            onChange={date => setFromExpectedDOD(date)}
                            renderInput={params => <TextField {...params} margin='normal' variant='outlined' />}
                          />
                        </LocalizationProvider>
                      </Box>
                    </Box>
                    <Box display={'flex'} marginLeft={'3%'}>
                      <Typography
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          fontSize: '14px',
                          fontWeight: '700',
                          textTransform: 'capitalize'
                        }}
                      >
                        To
                      </Typography>
                      &nbsp;
                      <span style={{ display: 'flex', alignItems: 'center' }}>:</span>&nbsp;
                      <Box style={{ marginBottom: '10px' }}>
                        {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <KeyboardDatePicker
                            views={['year', 'month', 'date']}
                            variant="inline"
                            format="dd/MM/yyyy"
                            margin="normal"
                            autoOk={true}
                            id="date-picker-inline"
                            value={toExpectedDOD}
                            onChange={date => setToExpectedDOD(date)}
                            KeyboardButtonProps={{
                              'aria-label': 'change ing date',
                            }}
                          />
                        </MuiPickersUtilsProvider> */}
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            views={['year', 'month', 'day']}
                            value={toExpectedDOD}
                            onChange={date => setToExpectedDOD(date)}
                            renderInput={params => <TextField {...params} margin='normal' variant='outlined' />}
                          />
                        </LocalizationProvider>
                      </Box>
                    </Box>
                  </Box>
                </>
              )}
              {searchType == 3 && (
                <>
                  <Box display={'flex'} justifyContent={'space-between'}>
                    <Box component='h3' marginBottom={'10px'}>
                      Search By Creation Date
                    </Box>
                    <CloseOutlined onClick={() => setSearchModal(false)} style={{ cursor: 'pointer' }} />
                  </Box>
                  <Box display={'flex'} marginBottom={'10px'}>
                    <Box display={'flex'}>
                      <Typography
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          fontSize: '14px',
                          fontWeight: '700',
                          textTransform: 'capitalize'
                        }}
                      >
                        From
                      </Typography>
                      &nbsp;
                      <span style={{ display: 'flex', alignItems: 'center' }}>:</span>&nbsp;
                      <Box style={{ marginBottom: '10px' }}>
                        {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <KeyboardDatePicker
                            views={['year', 'month', 'date']}
                            variant="inline"
                            format="dd/MM/yyyy"
                            margin="normal"
                            autoOk={true}
                            id="date-picker-inline"
                            value={fromDate}
                            onChange={date => setFromDate(date)}
                            KeyboardButtonProps={{
                              'aria-label': 'change ing date',
                            }}
                          />
                        </MuiPickersUtilsProvider> */}
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            views={['year', 'month', 'day']}
                            value={fromDate}
                            onChange={date => setFromDate(date)}
                            renderInput={params => <TextField {...params} margin='normal' variant='outlined' />}
                          />
                        </LocalizationProvider>
                      </Box>
                    </Box>
                    <Box display={'flex'} marginLeft={'3%'}>
                      <Typography
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          fontSize: '14px',
                          fontWeight: '700',
                          textTransform: 'capitalize'
                        }}
                      >
                        To
                      </Typography>
                      &nbsp;
                      <span style={{ display: 'flex', alignItems: 'center' }}>:</span>&nbsp;
                      <Box style={{ marginBottom: '10px' }}>
                        {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <KeyboardDatePicker
                            views={['year', 'month', 'date']}
                            variant="inline"
                            format="dd/MM/yyyy"
                            margin="normal"
                            autoOk={true}
                            id="date-picker-inline"
                            value={toDate}
                            onChange={date => setToDate(date)}
                            KeyboardButtonProps={{
                              'aria-label': 'change ing date',
                            }}
                          />
                        </MuiPickersUtilsProvider> */}
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            views={['year', 'month', 'day']}
                            value={toDate}
                            onChange={date => setToDate(date)}
                            renderInput={params => <TextField {...params} margin='normal' variant='outlined' />}
                          />
                        </LocalizationProvider>
                      </Box>
                    </Box>
                  </Box>
                </>
              )}
            </Box>
          </Box>
          <Box marginTop={'10%'}>
            <Button
              style={{ backgroundColor: theme?.palette?.primary?.main || '#D80E51', color: '#fff' }}
              onClick={onSearch}
            >
              Search
            </Button>
          </Box>
        </Box>
      </Modal>

      <Modal
        open={commentModal}
        onClose={() => {
          setCommentModal(false)
        }}
      >
        <Box sx={commentModalStyle}>
          <div>
            <h2>Reviewer input</h2>
            <Divider />
            <Grid container rowSpacing={5}>
              <Grid item xs={12} style={{ marginBottom: '5px' }}>
                <TextField
                  required
                  fullWidth
                  label='Remark'
                  id='fullWidth'
                  onChange={e => {
                    setApprovalRemark(e.target.value)
                  }}
                />
              </Grid>

              {/* <Grid item xs={12} style={{ marginTop: '5px' }}>
                  <TextField
                    required
                    id="filled-multiline-static"
                    label="Add comment"
                    multiline
                    fullWidth
                    minRows={4}
                    variant="filled"
                    onChange={handleChangeOfCommentText}
                  />
                </Grid> */}
            </Grid>
          </div>
          <Button
            style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '15px', border: 'none' }}
            color='primary'
            onClick={approvalFromDoctor}
          >
            Submit
          </Button>
        </Box>
      </Modal>

      <AdmisssionUpdationModal
        data={{ estimatedAmount: 12000, sanctionAmount: 12000 }}
        admissionUpdationModal={admissionUpdationModal}
        handleCloseClaimModal={handleCloseAdmissionModal}
        admissionUpdationModalSubmit={admissionUpdationModalSubmit}
      />

      <HospitalVisitUpdationModal
        data={{ estimatedAmount: 12000, sanctionAmount: 12000 }}
        admissionUpdationModal={hospitaVisitUpdation}
        handleCloseClaimModal={handleCloseHospitalVisitUpdate}
        admissionUpdationModalSubmit={admissionUpdationModalSubmit}
      />
    </div>
  )
}
