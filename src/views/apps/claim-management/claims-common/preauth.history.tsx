
import React, { useEffect, useRef, useState } from 'react'

import { useParams, useRouter } from 'next/navigation'

import { makeStyles } from '@mui/styles'
import { map, tap } from 'rxjs/operators'
import { Box, Modal, TextField, Tooltip, Typography, useTheme } from '@mui/material'

// import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { CloseOutlined } from '@mui/icons-material'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'

import RoleService from '@/services/utility/role'
import { PreAuthService } from '@/services/remote-api/api/claims-services'
import { BenefitService, ProvidersService } from '@/services/remote-api/fettle-remote-api'
import { PoliticalDot, VIPDot } from '../common/dot.comnponent'
import { PRE_AUTH_STATUS_MSG_MAP } from '../claim-preauth/preauth.shared'
import PreAuthTimeLineModal from '../claim-preauth/modals/preauth.timeline.modal.component'

import { FettleDataGrid } from '../../shared-component/components/fettle.data.grid'

// localStorage.removeItem('preauthid')
const roleService = new RoleService()

const PAGE_NAME = 'PRE_AUTH'

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

const preAuthService = new PreAuthService()
const benefitService = new BenefitService()
const providerService = new ProvidersService()

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

export default function PreAuthHistory(props: any) {
  const history = useRouter()
  const toast = useRef(null)
  const id: any = useParams().id
  const [rows, setRows] = React.useState(props.rows)
  const [openTimeLineModal, setOpenTimeLineModal] = React.useState(false)
  const [selectedPreAuth, setSelectedPreAuth] = React.useState({})
  const [searchType, setSearchType] = React.useState(0)
  const [searchModal, setSearchModal] = React.useState(false)
  const [fromExpectedDOA, setFromExpectedDOA] = React.useState(null)
  const [toExpectedDOA, setToExpectedDOA] = React.useState(null)
  const [fromExpectedDOD, setFromExpectedDOD] = React.useState(null)
  const [toExpectedDOD, setToExpectedDOD] = React.useState(null)
  const [fromDate, setFromDate] = React.useState(null)
  const [toDate, setToDate] = React.useState(null)
  const [reloadTable, setReloadTable] = React.useState(false)
  const [state, setState] = React.useState()
  const [benefits, setBenefits] = useState()
  const [providers, setProviders] = useState<any>()
  const classes = useStyles()
  const theme = useTheme()
  const [isHovered, setIsHovered] = useState(false)

  const userType = localStorage.getItem('userType')

  useEffect(() => {
    localStorage.removeItem('preauthid')
  }, [])

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

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

  const renderBenefitWithCost = (rowData: any) => {
    const benefitsWithCost = rowData.benefitsWithCost?.map((ben: any, index: number) => {
      const provider = providers?.find((p: any) => p?.id === ben?.providerId)

      return (
        <li key={`${ben?.providerId}-${ben?.benefitId}-${index}`}>
          {provider?.providerBasicDetails?.name} | {ben.benefitName} | {ben.iname} | {ben.diagnosisName} :
          <b>{ben.estimatedCost}</b>
        </li>
      )
    })

    return <p>{benefitsWithCost}</p>
  }

  const columnsDefinations = [
    {
      field: 'id',
      headerName: 'Pre-Auth No.',
      body: (rowData: any) => (
        <span style={{ lineBreak: 'anywhere', textDecoration: 'underline', cursor: 'pointer' }}>{rowData.id}</span>
      )
    },
    { field: 'memberShipNo', headerName: 'Membership No.', expand: true },
    {
      field: 'memberName',
      headerName: 'Name',
      body: (rowData: any) => (
        <div>
          <span>{rowData?.memberName}</span>
          <span onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            {rowData.vip && <VIPDot />}
          </span>
          <span>{rowData.political && <PoliticalDot />}</span>
        </div>
      )
    },
    { field: 'policyNumber', headerName: 'Policy No.', expand: true },
    { field: 'admissionDate', headerName: 'Admission Date', expand: true },
    { field: 'dischargeDate', headerName: 'Discharge Date', expand: true },
    {
      field: 'benefitWithCost',
      headerName: 'Estimated Cost',
      body: (rowData: any) => (
        <p style={{ width: '250px', whiteSpace: 'break-spaces' }}>{renderBenefitWithCost(rowData)}</p>
      )
    },
    {
      field: 'status',
      headerName: 'Status',
      body: (rowData: any) =>
        rowData.status == 'Document Requested' ? (
          <Tooltip title={rowData?.addDocRemark}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <span
                style={{
                  backgroundColor: getColor(rowData.status).background,

                  // opacity: '0.9',
                  color: getColor(rowData.status).color ? getColor(rowData.status).color : '#3c3c3c',
                  fontSize: '12px',
                  fontWeight: '600',
                  borderRadius: '8px',
                  padding: '6px'
                }}
              >
                {rowData.status}
              </span>
            </div>
          </Tooltip>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <span
              style={{
                backgroundColor: getColor(rowData.status).background,

                // opacity: '0.9',
                color: getColor(rowData.status).color ? getColor(rowData.status).color : '#3c3c3c',
                fontSize: '12px',
                fontWeight: '600',
                borderRadius: '8px',
                padding: '6px'
              }}
            >
              {rowData.status}
            </span>
          </div>
        )
    }
  ]

  const dataSource$ = (
    pageRequest: any = {
      page: 0,
      size: 10,
      summary: true,
      active: true

      // membershipNo: props?.membershipNo
    }
  ) => {
    pageRequest.sort = ['rowCreatedDate dsc']

    if (pageRequest.searchKey) {
      // pageRequest['memberShipNo'] = pageRequest.searchKey.toUpperCase().trim();
      pageRequest['preAuthStatus'] = pageRequest.searchKey.toUpperCase().trim()

      // pageRequest['policyNumber'] = pageRequest.searchKey.toUpperCase().trim();
      pageRequest['claimNo'] = pageRequest.searchKey.toUpperCase().trim()

      // pageRequest['memberName'] = pageRequest.searchKey.toUpperCase().trim();
      delete pageRequest.searchKey
    }

    if (userType === 'DOCTOR') {
      pageRequest['preAuthStatus'] = 'PENDING_GATEKEPING_DOCTOR_APPROVAL'
    }

    if (userType === 'SURVEILLANCE') {
      pageRequest['preAuthStatus'] = 'PENDING_SURVEILLANCE'
    }

    if (id) pageRequest.preauthId = id
    pageRequest.membershipNo = props?.membershipNo

    return preAuthService.getClaimHistory(pageRequest).pipe(
      tap(data => {
        setState(data?.data)
      }),
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
    history.push('/claims/claims-preauth?mode=create&auth=IPD')
  }

  React.useEffect(() => {
    setRows(props.rows)
  }, [props.rows])

  const openEditSection = (preAuth: any) => {
    history.push(`/claims/claims-preauth/${preAuth.id}?mode=edit&auth=IPD`)
  }

  const openTimeLine = (preAuth: any) => {
    setSelectedPreAuth(preAuth)
    setOpenTimeLineModal(true)
  }

  const handleCloseTimeLineModal = () => {
    setOpenTimeLineModal(false)
  }

  const onSearch = () => {
    setSearchModal(false)
    setReloadTable(true)
    setTimeout(() => {
      setReloadTable(false)
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
      key: 'timeleine_preauth',
      icon: 'pi pi-calendar-times',
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
    rowExpand: true,
    scrollHeight: '285px',
    pageSize: 10,
    actionButtons: actionButtons,

    header: {
      enable: true,
      enableDownload: true,
      downloadbleColumns: xlsColumns,
      addCreateButton: roleService.checkActionPermission(PAGE_NAME, 'CREATE'),
      onCreateButtonClick: handleOpen,
      text: 'Pre-Auth',
      enableGlobalSearch: true,
      searchText: 'Search by Claim No or Status',
      selectionMenus: [
        { icon: '', label: 'Admission Date', onClick: preAuthDOASearch },
        { icon: '', label: 'Discharge Date', onClick: preAuthDODSearch },
        { icon: '', label: 'Creation Date', onClick: preAuthCreationSearch },
        { icon: '', label: 'Clear All', onClick: clearAllClick }
      ],
      selectionMenuButtonText: 'Search'
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
        reloadtable={reloadTable}
      />

      <PreAuthTimeLineModal preAuth={selectedPreAuth} open={openTimeLineModal} onClose={handleCloseTimeLineModal} />

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
                            onChange={(date:any) =>setFromExpectedDOA(date)}
                            KeyboardButtonProps={{
                              'aria-label': 'change ing date',
                            }}
                          />
                        </MuiPickersUtilsProvider> */}
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            views={['year', 'month']}
                            value={fromExpectedDOA}
                            onChange={(date: any) => setFromExpectedDOA(date)}
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
                            onChange={(date:any) =>setToExpectedDOA(date)}
                            KeyboardButtonProps={{
                              'aria-label': 'change ing date',
                            }}
                          />
                        </MuiPickersUtilsProvider> */}
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            views={['year', 'month']}
                            value={toExpectedDOA}
                            onChange={(date: any) => setToExpectedDOA(date)}
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
                            onChange={(date:any) =>setFromExpectedDOD(date)}
                            KeyboardButtonProps={{
                              'aria-label': 'change ing date',
                            }}
                          />
                        </MuiPickersUtilsProvider> */}
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            views={['year', 'month']}
                            value={fromExpectedDOD}
                            onChange={(date: any) => setFromExpectedDOD(date)}
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
                            onChange={(date:any) =>setToExpectedDOD(date)}
                            KeyboardButtonProps={{
                              'aria-label': 'change ing date',
                            }}
                          />
                        </MuiPickersUtilsProvider> */}
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            views={['year', 'month']}
                            value={toExpectedDOD}
                            onChange={(date: any) => setToExpectedDOD(date)}
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
                            onChange={(date:any) =>setFromDate(date)}
                            KeyboardButtonProps={{
                              'aria-label': 'change ing date',
                            }}
                          />
                        </MuiPickersUtilsProvider> */}
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            views={['year', 'month']}
                            value={fromDate}
                            onChange={(date: any) => setFromDate(date)}
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
                            onChange={(date:any) =>setToDate(date)}
                            KeyboardButtonProps={{
                              'aria-label': 'change ing date',
                            }}
                          />
                        </MuiPickersUtilsProvider> */}
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            views={['year', 'month']}
                            value={toDate}
                            onChange={(date: any) => setToDate(date)}
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
