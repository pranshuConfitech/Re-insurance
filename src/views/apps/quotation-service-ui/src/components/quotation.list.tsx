import React from 'react'

import { useRouter } from 'next/navigation'

import {
  Alert,
  AlertTitle,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Modal,
  Slide,
  Snackbar,
  TextField,
  Typography,
  useTheme,
  Button as MuiButton
} from '@mui/material'
import { makeStyles } from '@mui/styles'
import {
  CloseOutlined,
  Download as DownloadIcon,
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material'

// import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';


import { Button } from 'primereact/button'

import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

import { QuotationService } from '@/services/remote-api/api/quotation-services'

import RoleService from '@/services/utility/role'

import type { AlertColor } from '@mui/material'
import { FettleDataGrid } from '@/views/apps/shared-component/components/fettle.data.grid'

const PAGE_NAME = 'QUOTATION'
const roleService = new RoleService()
const quotationService = new QuotationService()

function a11yProps(index: any) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`
  }
}

// Main columns (shown in main row) - Optimized alignment for quotation data
const columnsDefinationsNew = [
  { field: 'prospectName', headerName: 'Prospect Name', align: 'left' },
  {
    field: 'quotationNo',
    headerName: 'Quotation No.',
    align: 'center',
    body: (rowData: any) => <span style={{ lineBreak: 'anywhere', wordBreak: 'break-word' }}>{rowData.quotationNo}</span>
  },
  { field: 'tag', headerName: 'Tag', align: 'center' },
  {
    field: 'productId',
    headerName: 'Product',
    align: 'center',
    body: (rowData: any) => <span>{rowData.productName || rowData.productId}</span>
  },
  {
    field: 'planId',
    headerName: 'Plan',
    align: 'center',
    body: (rowData: any) => <span>{rowData.planName || rowData.planId}</span>
  }
]

// Expanded columns (shown in expanded row)
const expandedColumnsNew = [
  {
    field: 'policyStartDate',
    headerName: 'Policy Period',
    body: (rowData: any) => {
      const date = new Date(rowData.policyEndDate);
      const month = date.getUTCMonth() + 1;
      const day = date.getUTCDate();
      const year = date.getUTCFullYear();
      let ed = `${month}/${day}/${year}`;
      return (
        <span>
          {new Date(rowData.policyStartDate).toLocaleDateString()} - {ed}
        </span>
      )
    }
  },
  {
    field: 'quoteDate',
    headerName: 'Quote Date',
    body: (rowData: any) => <span>{new Date(rowData.quoteDate).toLocaleDateString()}</span>
  },
  { field: 'quotationStatus', headerName: 'Status' },
  { field: 'createdBy', headerName: 'Created By' }
]

const xlsColumns = ['prospectName', 'policyStartDate', 'quotationNo', 'productId', 'quoteDate']

// Main columns for Renewal (shown in main row) - Optimized alignment for quotation data
const columnsDefinationsRenewal = [
  { field: 'prospectName', headerName: 'Prospect Name', align: 'left' },
  {
    field: 'quotationNo',
    headerName: 'Quotation No.',
    align: 'center',
    body: (rowData: any) => <span style={{ lineBreak: 'anywhere', wordBreak: 'break-word' }}>{rowData.quotationNo}</span>
  },
  { field: 'tag', headerName: 'Tag', align: 'center' },
  {
    field: 'productId',
    headerName: 'Product',
    align: 'center',
    body: (rowData: any) => <span>{rowData.productName || rowData.productId}</span>
  },
  {
    field: 'planId',
    headerName: 'Plan',
    align: 'center',
    body: (rowData: any) => <span>{rowData.planName || rowData.planId}</span>
  }
]

// Expanded columns for Renewal (shown in expanded row)
const expandedColumnsRenewal = [
  {
    field: 'policyStartDate',
    headerName: 'Policy Period',
    body: (rowData: any) => (
      <span>
        {new Date(rowData.policyStartDate).toLocaleDateString()} -{' '}
        {new Date(rowData.policyEndDate).toLocaleDateString()}
      </span>
    )
  },
  {
    field: 'quoteDate',
    headerName: 'Quote Date',
    body: (rowData: any) => <span>{new Date(rowData.quoteDate).toLocaleDateString()}</span>
  },
  { field: 'forRenewal', headerName: 'For Renewal ?' },
  { field: 'quotationStatus', headerName: 'Status' },
  { field: 'createdBy', headerName: 'Created By' }
]

const QuotationListComponent = (props: { tabType?: 'new' | 'renewal' }) => {
  const history = useRouter()
  const tabType = props.tabType || 'new'
  const isRenewal = tabType === 'renewal'

  const useStyles = makeStyles((theme: any) => ({
    approvedButton: {
      marginLeft: '5px'
    },
    tableBg: {
      height: 505,
      width: '100%',
      backgroundColor: '#fff',
      boxShadow:
        '0px 3px 3px -2px rgb(0 0 0 / 20%), 0px 3px 4px 0px rgb(0 0 0 / 14%), 0px 1px 8px 0px rgb(0 0 0 / 12%)',
      borderRadius: '4px'
    },
    categoryButton: {
      marginLeft: '5px',
      marginBottom: '5px',
      color: 'white'
    }
  }))

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

  const [open, setOpen] = React.useState(false)
  const [quotationID, setQuotationID] = React.useState('')
  const [quotationNo, setQuotationNo] = React.useState('')
  const [quotationTag, setQuotationTag] = React.useState('')
  const [reloadTable, setReloadTable] = React.useState(false)
  const [quotationDateModal, setQuotationDateModal] = React.useState(false)
  const [quotationNumber, setQuotationNumber] = React.useState('')
  const [searchQuotationFromDate, setSearchQuotationFromDate] = React.useState(0)
  const [searchQuotationToDate, setSearchQuotationToDate] = React.useState(0)
  const [prospectName, setProspectName] = React.useState('')
  const [searchType, setSearchType] = React.useState(0)
  const [value, setValue] = React.useState(0)
  const [comment, setComment] = React.useState()
  const [openSnackbar, setOpenSnackbar] = React.useState(false)
  const [dateFilterModalOpen, setDateFilterModalOpen] = React.useState(false)
  const [filterStartDate, setFilterStartDate] = React.useState<Date | null>(null)
  const [filterEndDate, setFilterEndDate] = React.useState<Date | null>(null)

  const [alertType, setAlertType] = React.useState<AlertColor>('success')
  const [snackbarMsg, setSnackbarMsg] = React.useState('Success')
  const theme = useTheme()

  // const logoUrl = '/images/excel.jpg';
  const classes = useStyles()

  const dataSource$ = (
    pageRequest: any = {
      page: 0,
      size: 10,
      summary: true,
      active: true,
      quotationNo: quotationNumber,
      startDate: new Date(searchQuotationFromDate).getTime() || 0,
      endDate: new Date(searchQuotationToDate).getTime() || 0
    }
  ) => {
    pageRequest.sort = ['rowCreatedDate dsc']

    // Filter by renewal status based on tab type
    if (isRenewal) {
      pageRequest.forRenewal = true
    } else {
      pageRequest.forRenewal = false
    }

    if (pageRequest.searchKey) {
      pageRequest['tag'] = pageRequest.searchKey.trim()
      pageRequest['quotationNo'] = pageRequest.searchKey.trim()
      pageRequest['displayName'] = pageRequest.searchKey.trim()
      pageRequest['status'] = pageRequest.searchKey.trim()
      pageRequest['productId'] = pageRequest.searchKey.trim()
      pageRequest['planId'] = pageRequest.searchKey.trim()
    }

    if (filterStartDate) {
      const start = new Date(filterStartDate)
      start.setHours(0, 0, 0, 0)
      pageRequest.startDate = start.getTime()
    }
    if (filterEndDate) {
      const end = new Date(filterEndDate)
      end.setHours(23, 59, 59, 999)
      pageRequest.endDate = end.getTime()
    }

    return quotationService.getQuoationDetails(pageRequest)
  }

  const dataSource1$ = (
    pageRequest: any = {
      page: 0,
      size: 10,
      summary: true,
      active: true
    }
  ) => {
    pageRequest.sort = ['rowCreatedDate dsc']

    // Filter by renewal status based on tab type
    if (isRenewal) {
      pageRequest.forRenewal = true
    } else {
      pageRequest.forRenewal = false
    }

    if (pageRequest.searchKey) {
      pageRequest['name'] = pageRequest.searchKey.trim()
    }

    if (filterStartDate) {
      const start = new Date(filterStartDate)
      start.setHours(0, 0, 0, 0)
      pageRequest.startDate = start.getTime()
    }
    if (filterEndDate) {
      const end = new Date(filterEndDate)
      end.setHours(23, 59, 59, 999)
      pageRequest.endDate = end.getTime()
    }

    return quotationService.getQuoationByProspect(prospectName)
  }

  const handleOpen = () => {
    history.push('/quotations?mode=create')
  }

  const openEditSection = (quotation: any) => {
    history.push(`/quotations/${quotation.id}?mode=edit`)
  }

  const downloadQuotation = (item: any) => {
    quotationService.getQuoationDownload(item?.id).subscribe(blob => {
      const downloadUrl = window.URL.createObjectURL(blob)

      // Create a temporary anchor element
      const a = document.createElement('a')

      a.href = downloadUrl
      a.download = `Quotation_${item.id}.pdf` // Set the default file name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a) // Clean up the DOM

      // Release the object URL
      window.URL.revokeObjectURL(downloadUrl)
    })
  }

  const Transition = React.forwardRef(function Transition(props: any, ref: any) {
    return <Slide children={undefined} direction='up' ref={ref} {...props} />
  })

  const handleApproveAction = () => {
    const payload = {
      "decission": "APPROVED",
      "comment": comment
    }

    quotationService.quotationDecision(payload, quotationID!).subscribe((res: any) => {
      toggleSnackbar(true, 'success', `Quotation Approved`)
      setOpen(false)
      setReloadTable(true)
    })
  }

  const handleRejectAction = () => {
    const payload = {
      "decission": "REJECTED",
      "comment": comment
    }


    quotationService.quotationDecision(payload, quotationID).subscribe((res: any) => {
      toggleSnackbar(true, 'success', `Quotation Rejected`)
      setOpen(false)
      setReloadTable(true)
    })
  }

  const handleClickForAppoveOpen = (quotation: any) => {
    if (quotation.quotationStatus === 'PENDING_APPROVAL') {
      setQuotationID(quotation.id)
      setQuotationNo(quotation.quotationNo)
      setQuotationTag(quotation.tag)
      setOpen(true)
    } else {
      toggleSnackbar(true, 'warning', `Quotation should be in Pending Approval status to approve.`)
    }
  }

  const actionBtnList = [
    {
      key: 'update_quotation',
      icon: <DownloadIcon fontSize='small' />,
      color: '#18a2b8',
      tooltip: 'Download',
      onClick: downloadQuotation
    },
    {
      key: 'update_quotation',
      icon: <EditIcon fontSize='small' />,
      color: '#fbac05',
      tooltip: 'Edit',
      onClick: openEditSection
    },
    {
      key: 'update_quotation',
      icon: <CheckCircleIcon fontSize='small' />,
      color: '#28a745',
      tooltip: 'Approve',
      onClick: handleClickForAppoveOpen,
      disabled: (q: any) =>
        q.quotationStatus === 'APPROVED' ||
        !(
          q.premiumCalculationStatus === 'COMPLETED' &&
          q.memberUploadStatus === 'COMPLETED' &&
          q.quotationStatus !== 'APPROVED'
        )
    }
  ]

  const handleClose = () => {
    setOpen(false)
    setQuotationID('')
    setQuotationNo('')
    setQuotationTag('')
  }

  const QuotationDateClick = (type: any) => {
    setQuotationDateModal(true)
    setSearchType(1)
  }

  const QuotationNumberClick = (type: any) => {
    // setQuotationNumberModal(true);
    setQuotationDateModal(true)
    setSearchType(2)
  }

  const handleChange = (event: any, newValue: any) => {
    setValue(newValue)
  }

  const handleChangeIndex = (index: any) => {
    setValue(index)
  }

  const ProspectNameClick = (type: any) => {
    // setProspectNameModal(true);
    setQuotationDateModal(true)
    setSearchType(3)
  }

  const IntermediaryNameClick = (type: any) => {
    // setIntermediarNameModal(true);
    setQuotationDateModal(true)
    setSearchType(4)
  }

  const clearAllClick = () => {
    setQuotationNumber('')
    setProspectName('')
    setSearchQuotationFromDate(0)
    setSearchQuotationToDate(0)
    onSearch()
  }

  // Get columns based on tab type
  const mainColumns = isRenewal ? columnsDefinationsRenewal : columnsDefinationsNew
  const expandedColumns = isRenewal ? expandedColumnsRenewal : expandedColumnsNew

  const configuration: any = {
    useAccordionMode: true,
    enableSelection: false,
    scrollHeight: '600px',
    pageSize: 10,
    actionButtons: roleService.checkActionPermission(PAGE_NAME, '', () => { }, actionBtnList),
    columnOptions: {
      enableSorting: true,
      enableColumnMenu: true,
      enableFiltering: true,
      enableColumnVisibility: false,
    },
    expandableConfig: {
      // Quotation-specific grid: 60px expand, optimized columns + auto width for action buttons
      gridTemplate: '60px 1.8fr 2fr 2.5fr 1.5fr 2fr 1fr auto',
      getStatusColor: () => 'transparent',
      renderExpandedContent: (row: any) => {
        // Use 4 columns for expanded content to match provider style better
        const expandedColsCount = expandedColumns.length;
        const gridCols = expandedColsCount === 5 ? '1fr 1fr 1fr 1fr 1fr' : '1fr 1fr 1fr 1fr';

        return (
          <div style={{
            display: 'grid',
            gridTemplateColumns: gridCols,
            gap: '24px',
            padding: '16px 24px',
            backgroundColor: '#f8f9fa',
            borderTop: '1px solid #e9ecef'
          }}>
            {expandedColumns.map((col: any, idx: number) => {
              const value = col.field.includes('.')
                ? col.field.split('.').reduce((obj: any, key: string) => obj?.[key], row)
                : row[col.field];

              return (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{
                    color: '#6c757d',
                    fontSize: '11px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {col.headerName}
                  </span>
                  <span style={{
                    color: '#212529',
                    fontSize: '14px',
                    fontWeight: 500,
                    wordBreak: 'break-word'
                  }}>
                    {col.body ? col.body(row) : (value !== null && value !== undefined ? String(value) : 'N/A')}
                  </span>
                </div>
              );
            })}
          </div>
        );
      }
    },
    header: {
      enable: true,
      enableDownload: true,
      downloadbleColumns: xlsColumns,
      addCreateButton: false, // Create button is now in the tab component
      text: isRenewal ? 'Renewal Quotations' : 'New Quotations',
      enableGlobalSearch: true,
      searchText: 'Search by Id, Tag, Quotation No., Plan, Status',
      enableDateFilter: true,
      onDateFilterClick: () => setDateFilterModalOpen(true)
    }
  }

  const handleDateFilterApply = () => {
    setDateFilterModalOpen(false)
    setReloadTable(prev => !prev)
  }

  const handleDateFilterClear = () => {
    setFilterStartDate(null)
    setFilterEndDate(null)
    setDateFilterModalOpen(false)
    setReloadTable(prev => !prev)
  }

  const onSearch = () => {
    setQuotationDateModal(false)
    setReloadTable(true)
    setTimeout(() => {
      setReloadTable(false)
      setQuotationNumber('')
      setProspectName('')
      setSearchQuotationFromDate(0)
      setSearchQuotationToDate(0)
    }, 5000)
  }

  const toggleSnackbar = (
    status: boolean,
    alertType?: string,
    snackbarMsg?: string
  ) => {
    setOpenSnackbar(status)
    setAlertType((alertType as AlertColor) ?? 'success')
    setSnackbarMsg(snackbarMsg ?? '')
  }

  return (
    <>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => toggleSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => toggleSnackbar(false)} severity={alertType} variant='filled'>
          <AlertTitle>{alertType}</AlertTitle>
          {snackbarMsg}
        </Alert>
      </Snackbar>
      <Dialog open={dateFilterModalOpen} onClose={() => setDateFilterModalOpen(false)} maxWidth='sm' fullWidth>
        <DialogTitle>Filter by Date Range</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label='Start Date'
                value={filterStartDate}
                onChange={(newValue) => setFilterStartDate(newValue)}
                renderInput={(params: any) => <TextField {...params} fullWidth variant='outlined' />}
              />
              <DatePicker
                label='End Date'
                value={filterEndDate}
                onChange={(newValue) => setFilterEndDate(newValue)}
                renderInput={(params: any) => <TextField {...params} fullWidth variant='outlined' />}
              />
            </LocalizationProvider>
          </Box>
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={handleDateFilterClear} color='secondary'>
            Clear
          </MuiButton>
          <MuiButton onClick={handleDateFilterApply} variant='contained'>
            Apply Filter
          </MuiButton>
          <MuiButton onClick={() => setDateFilterModalOpen(false)}>
            Cancel
          </MuiButton>
        </DialogActions>
      </Dialog>
      <FettleDataGrid
        $datasource={prospectName ? dataSource1$ : dataSource$}
        config={configuration}
        columnsdefination={mainColumns}
        reloadtable={reloadTable}
      />

      <Dialog open={open} onClose={handleClose} aria-labelledby='form-dialog-title' fullWidth maxWidth='xs'>
        <DialogTitle id='form-dialog-title'>Qutation Decision</DialogTitle>
        <DialogContent>
          <TextField
            required
            label="Add comment"
            multiline
            fullWidth
            minRows={4}
            variant="filled"
            value={comment}
            onChange={(e: any) => setComment(e.target.value)}
          />
          {/* <DialogContentText style={{ fontSize: 12 }}>
            Are you sure to approve the quotation {quotationNo}, {quotationTag}
          </DialogContentText> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleApproveAction} className='p-button-secondary' color='primary'>
            Approve
          </Button>
          <Button onClick={handleRejectAction} className='p-button-danger' color='primary'>
            Reject
          </Button>
          <Button className='p-button-text' onClick={handleClose} color='primary'>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Modal open={quotationDateModal} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
        <Box style={modalStyle}>
          <Box>
            <Box id='alert-dialog-slide-description'>
              {searchType == 1 && (
                <>
                  <Box display={'flex'} justifyContent={'space-between'}>
                    <Box component='h3' marginBottom={'10px'}>
                      Quotation Date
                    </Box>
                    <CloseOutlined onClick={() => setQuotationDateModal(false)} style={{ cursor: 'pointer' }} />
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
                            value={searchQuotationFromDate || new Date()}
                            onChange={(e:any) =>  setSearchQuotationFromDate(e)}
                            KeyboardButtonProps={{
                              'aria-label': 'change ing date',
                            }}
                          />
                        </MuiPickersUtilsProvider> */}
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            views={['year', 'month', 'day']}
                            value={searchQuotationFromDate || new Date()}
                            onChange={(e: any) => setSearchQuotationFromDate(e)}
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
                            value={searchQuotationToDate || new Date()}
                            onChange={(e:any) =>  setSearchQuotationToDate(e)}
                            KeyboardButtonProps={{
                              'aria-label': 'change ing date',
                            }}
                          />
                        </MuiPickersUtilsProvider> */}
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            views={['year', 'month', 'day']}
                            value={searchQuotationToDate || new Date()}
                            onChange={(e: any) => setSearchQuotationToDate(e)}
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
                      Quotation Number
                    </Box>
                    <CloseOutlined onClick={() => setQuotationDateModal(false)} style={{ cursor: 'pointer' }} />
                  </Box>
                  <TextField
                    id='quotationNumber'
                    name='quotationNumber'
                    onChange={(e: any) => {
                      setQuotationNumber(e.target.value)
                    }}
                    label='Quotation Number'
                  />
                </>
              )}
              {searchType == 3 && (
                <>
                  <Box display={'flex'} justifyContent={'space-between'}>
                    <Box component='h3' marginBottom={'10px'}>
                      Prospect Name
                    </Box>
                    <CloseOutlined onClick={() => setQuotationDateModal(false)} style={{ cursor: 'pointer' }} />
                  </Box>
                  <TextField
                    id='prospectName'
                    name='prospectName'
                    onChange={(e: any) => {
                      setProspectName(e.target.value)
                    }}
                    label='Prospect Name'
                  />
                </>
              )}
              {searchType == 4 && (
                <>
                  <Box display={'flex'} justifyContent={'space-between'}>
                    <Box component='h3' marginBottom={'10px'}>
                      Intermediary Name
                    </Box>
                    <CloseOutlined onClick={() => setQuotationDateModal(false)} style={{ cursor: 'pointer' }} />
                  </Box>
                  <TextField
                    id='intermediaryName'
                    name='intermediaryName'
                    onChange={() => { }}
                    label='Intermediary Name'
                  />
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
    </>
  )
}

export default QuotationListComponent
