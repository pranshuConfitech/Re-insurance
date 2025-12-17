
import React from 'react'

import { useRouter } from 'next/navigation'

import { makeStyles } from '@mui/styles'
import { forkJoin } from 'rxjs'
import { map, tap } from 'rxjs/operators'

import { Box, Grid, Modal, TextField, Typography, useTheme } from '@mui/material'

import { CloseOutlined } from '@mui/icons-material'

import { Button } from 'primereact/button'

import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

import { PreAuthService } from '@/services/remote-api/api/claims-services'
import { MemberService } from '@/services/remote-api/api/member-services'
import PreAuthTimeLineModal from './modals/preauth.timeline.modal.component'
import preAuthReviewModel, { PRE_AUTH_STATUS_MSG_MAP } from './preauth.shared'

// import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
// import DateFnsUtils from '@date-io/date-fns';

import RoleService from '@/services/utility/role'
import { BenefitService, ProvidersService, ServiceTypeService } from '@/services/remote-api/fettle-remote-api'

import { FettleDataGrid } from '../../shared-component/components/fettle.data.grid'
import { REIM_STATUS_MSG_MAP } from '../claim-reimbursement/reim.shared'


// const roleService = new RoleService()

const PAGE_NAME = 'PRE_AUTH'

const style = {
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
  }
}))

const memberservice = new MemberService()
const preAuthService = new PreAuthService()
const benefitService = new BenefitService()
const providerService = new ProvidersService()
const serviceDiagnosis = new ServiceTypeService()

const getColor = (status: any) => {
  switch (status) {
    case 'Pending Evaluation':
      return { background: 'rgba(149,48,55,0.5)', border: 'rgba(149,48,55,1)' }
    case 'Evaluation in progress':
      return { background: 'rgba(255, 252, 127, 0.5)', border: 'rgba(255, 252, 255, 1)' }
    case 'Requested for evaluation':
      return { background: 'rgba(4, 59, 92, 0.5)', border: 'rgba(4, 59, 92, 1)', color: '#f1f1f1' }
    case 'Approved':
      return { background: 'rgba(1, 222, 116, 0.5)', border: 'rgba(1, 222, 116, 1)' }
    case 'REJECTED':
      return { background: 'rgba(255,50,67,0.5)', border: 'rgba(255,50,67,1)' }
    case 'Document requested':
      return { background: 'rgba(165, 55, 253, 0.5)', border: 'rgba(165, 55, 253, 1)' }
    case 'Approved failed':
      return { background: 'rgb(139, 0, 0,0.5)', border: 'rgb(139, 0, 0)' }
    case 'Draft':
      return { background: 'rgba(128,128,128,0.5)', border: 'rgba(128,128,128,1)' }
    case 'Waiting for Claim':
      return { background: 'rgba(245, 222, 179, 0.5)', border: 'rgba(245, 222, 179,1)' }
    case 'Cancelled':
      return { background: 'rgba(149,48,55,0.5)', border: 'rgba(149,48,55,1)' }
    case 'Reverted':
      return { background: 'rgba(241, 241, 241, 0.5)', border: 'rgba(241, 241, 241, 1)' }
    default:
      return { background: 'rgba(227, 61, 148, 0.5)', border: 'rgba(227, 61, 148, 1)' }
  }
}

export default function IndemnityClaimListComponent(props: any) {
  const history = useRouter()
  const [rows, setRows] = React.useState(props.rows)
  const [openReviewModal, setOpenReviewModal] = React.useState(false)
  const [cancelModal, setCancelModal] = React.useState(false)
  const [cancelReason, setCancelReason] = React.useState()
  const [openTimeLineModal, setOpenTimeLineModal] = React.useState(false)
  const [cancelPreAuthId, setCancelPreAuthId] = React.useState<any>()
  const [selectedPreAuthForReview, setSelectedPreAuthForReview] = React.useState(preAuthReviewModel())
  const [selectedPreAuth, setSelectedPreAuth] = React.useState({})
  const [searchType, setSearchType] = React.useState(0)
  const [searchModal, setSearchModal] = React.useState(false)
  const [fromExpectedDOA, setFromExpectedDOA] = React.useState<any>(new Date())
  const [toExpectedDOA, setToExpectedDOA] = React.useState<any>('')
  const [fromExpectedDOD, setFromExpectedDOD] = React.useState<any>(new Date())
  const [toExpectedDOD, setToExpectedDOD] = React.useState<any>('')
  const [fromDate, setFromDate] = React.useState<any>(new Date())
  const [toDate, setToDate] = React.useState<any>('')
  const [reloadTable, setReloadTable] = React.useState(false)
  const [state, setState] = React.useState()
  const classes = useStyles()
  const theme = useTheme()

  // const utclongDate = date => {
  //   if (!date) return undefined;
  //   return date.getTime();
  // };

  const columnsDefinations = [
    {
      field: 'id',
      headerName: 'Claim No.',
      // body: (rowData: any) => (
      //   <span
      //     style={{ lineBreak: 'anywhere', textDecoration: 'underline', cursor: 'pointer' }}
      //     onClick={() => {
      //       history.push(`/claims/claims-preauth/${rowData?.id}?mode=viewOnly&auth=IPD`)
      //     }}
      //   >
      //     {rowData.id}
      //   </span>
      // )
    },
    { field: 'memberShipNo', headerName: 'Membership No.' },
    { field: 'memberName', headerName: 'Name' },
    { field: 'policyNumber', headerName: 'Policy No.' },
    { field: 'admissionDate', headerName: 'Admission Date' },
    { field: 'dischargeDate', headerName: 'Discharge Date' },
    {
      field: 'reimbursementStatus',
      headerName: 'Status',
      body: (rowData: any) => (
        <span
          style={{
            backgroundColor: getColor(rowData.reimbursementStatus).background,
            color: getColor(rowData.reimbursementStatus).color ? getColor(rowData.reimbursementStatus).color : '#3c3c3c',
            border: '1px solid',
            borderColor: getColor(rowData?.reimbursementStatus).border,
            borderRadius: '8px',
            padding: '4px'
          }}
        >
          {rowData.status}
        </span>
      )
    }
  ]

  const dataSource$ = (
    pageRequest: any = {
      page: 0,
      size: 10,
      summary: true,
      active: true,
      // claimStatus: 'REJECTED',
      // claimCategory: 'CLAIM',
      // claimSource: 'PRE_AUTH'
      source: "PRE_AUTH",
      claimStatus: "REJECTED",
      claimSubStatus: "PARTIALLY_APPROVED"
    }
  ) => {
    pageRequest.sort = ['rowCreatedDate dsc']

    if (pageRequest.searchKey) {
      pageRequest['id'] = pageRequest.searchKey.toUpperCase().trim()
      pageRequest['memberShipNo'] = pageRequest.searchKey.toUpperCase().trim()
      // pageRequest['policyNumber'] = pageRequest.searchKey.toUpperCase().trim()
      delete pageRequest.searchKey
    }

    return preAuthService.getIndemnityClaims(pageRequest).pipe(
      tap(data => {
        // props.setCount(data?.data?.totalElements);
      }),
      map(data => {
        const content = data?.data?.content
        const records = content.map((item: any) => {
          item['admissionDate'] = new Date(item.expectedDOA).toLocaleDateString()
          item['dischargeDate'] = new Date(item.expectedDOD).toLocaleDateString()
          item['status'] = item.subStatus == "PARTIALLY_APPROVED" ? REIM_STATUS_MSG_MAP[item.subStatus as keyof typeof REIM_STATUS_MSG_MAP] : REIM_STATUS_MSG_MAP[item.reimbursementStatus as keyof typeof REIM_STATUS_MSG_MAP]

          return item
        })

        data.content = records

        return data
      })
    )
  }
  React.useEffect(() => {
    if (localStorage.getItem('preauthid')) {
      localStorage.removeItem('preauthid')
    }
  }, [localStorage.getItem('preauthid')])
  // const dataSource$ = (
  //   pageRequest = {
  //     page: 0,
  //     size: 10,
  //     summary: true,
  //     active: true,
  //     preAuthType: 'IPD',
  //   },
  // ) => {
  //   pageRequest.sort = ['rowCreatedDate dsc'];
  //   if (pageRequest.searchKey) {
  //     pageRequest['memberShipNo'] = pageRequest.searchKey.toUpperCase().trim();
  //     pageRequest['preAuthStatus'] = pageRequest.searchKey.toUpperCase().trim();
  //     pageRequest['policyNumber'] = pageRequest.searchKey.toUpperCase().trim();
  //     pageRequest['id'] = pageRequest.searchKey.toUpperCase().trim();
  //     pageRequest['name'] = pageRequest.searchKey.toUpperCase().trim();
  //     delete pageRequest.searchKey;
  //   }

  //   const querytype = {
  //     1: {
  //       fromExpectedDOA: utclongDate(fromExpectedDOA),
  //       toExpectedDOA: toExpectedDOA ? utclongDate(toExpectedDOA) : utclongDate(fromExpectedDOA),
  //     },
  //     2: {
  //       fromExpectedDOD: utclongDate(fromExpectedDOD),
  //       toExpectedDOD: toExpectedDOD ? utclongDate(toExpectedDOD) : utclongDate(fromExpectedDOD),
  //     },
  //     3: {
  //       fromDate: utclongDate(fromDate),
  //       toDate: toDate ? utclongDate(toDate) : utclongDate(fromDate),
  //     },
  //   };

  //   const pagerequestquery = {
  //     page: pageRequest.page,
  //     size: pageRequest.size,
  //     summary: true,
  //     active: true,
  //     ...(searchType && querytype[searchType]),
  //   };

  //   return preAuthService.getAllPreAuths(searchType ? pagerequestquery : pageRequest).pipe(
  //     tap(data => {
  //       // props.setCount(data?.data?.totalElements);
  //       setState(data?.data);
  //     }),
  //     map(data => {
  //       let content = data?.data?.content;
  //       let records = content.map( ( item:any) => {
  //         item['admissionDate'] = new Date(item.expectedDOA).toLocaleDateString();
  //         item['dischargeDate'] = new Date(item.expectedDOD).toLocaleDateString();
  //         item['status'] = PRE_AUTH_STATUS_MSG_MAP[item.preAuthStatus];
  //         return item;
  //       });
  //       data.content = records;
  //       return data?.data;
  //     }),
  //   );
  // };

  const handleOpen = () => {
    history.push('/claims/claims-preauth?mode=create&auth=IPD')
  }

  React.useEffect(() => {
    setRows(props.rows)
  }, [props.rows])

  const openEditSection = (preAuth: any) => {
    history.push(`/claims/claims-to-be-processed/${preAuth?.id}?mode=indemnity`)
  }

  const openReviewSection = (preAuth: any) => {
    history.push(`/claims/claims-preauth/review/${preAuth.id}?auth=IPD`)
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
    const ps$ = providerService.getProviders({
      page: 0,
      size: 10000,
      summary: true,
      active: true
    })

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

  const openReimbursement = (preAuth: any) => {
    history.push(`/claims/claims?mode=create&type=preauth&preId=` + preAuth.id)
  }

  const openDocumentsSection = (preAuth: any) => {
    history.push(`/claims/claims-preauth/${preAuth.id}?mode=edit&auth=IPD&addDoc=true`)
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
      item.preAuthStatus != 'PENDING_EVALUATION'
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
      setFromExpectedDOA('')
      setToExpectedDOA('')
      setFromExpectedDOD('')
      setToExpectedDOD('')
      setFromDate('')
      setToDate('')
    }, 1000)
  }

  // const preAuthDOASearch = type => {
  //   setSearchModal(true);
  //   setSearchType(1);
  // };

  // const preAuthDODSearch = type => {
  //   setSearchModal(true);
  //   setSearchType(2);
  // };
  // const preAuthCreationSearch = type => {
  //   setSearchModal(true);
  //   setSearchType(3);
  // };

  const clearAllClick = () => {
    setFromExpectedDOA('')
    setToExpectedDOA('')
    setFromExpectedDOD('')
    setToExpectedDOD('')
    setFromDate('')
    setToDate('')
    setSearchType(0)
    setReloadTable(true)
  }

  const xlsColumns = ['id', 'memberShipNo', 'memberName', 'policyNumber', 'admissionDate', 'dischargeDate', 'comment']

  const configuration: any = {
    enableSelection: false,
    scrollHeight: '285px',
    pageSize: 10,
    actionButtons: [
      {
        key: 'update_preauth',
        icon: 'pi pi-eye',
        className: classes.categoryButton,
        onClick: openEditSection,
        tooltip: 'View'
      }
    ],

    header: {
      enable: true,
      enableDownload: true,
      downloadbleColumns: xlsColumns,
      onCreateButtonClick: handleOpen,
      text: 'Indemnity Claims',
      enableGlobalSearch: true,
      searchText: 'Search by Claim No, Membership No, Name',
      selectionMenuButtonText: 'Search'
    }
  }

  return (
    <div>
      <FettleDataGrid
        $datasource={dataSource$}
        config={configuration}
        columnsdefination={columnsDefinations}
        // onEdit={openEditSection}
        reloadtable={reloadTable}
      />
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
            <Button className='p-button-text'>No</Button>
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
                            renderInput={(params: any) => <TextField {...params} margin='normal' variant='outlined' />}
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
                            renderInput={(params: any) => <TextField {...params} margin='normal' variant='outlined' />}
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
                            renderInput={(params: any) => <TextField {...params} margin='normal' variant='outlined' />}
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
                            renderInput={(params: any) => <TextField {...params} margin='normal' variant='outlined' />}
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
                            renderInput={(params: any) => <TextField {...params} margin='normal' variant='outlined' />}
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
                            renderInput={(params: any) => <TextField {...params} margin='normal' variant='outlined' />}
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
    </div>
  )
}
