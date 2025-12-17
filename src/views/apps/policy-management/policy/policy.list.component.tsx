import React from 'react'

import { useRouter } from 'next/navigation'

import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Modal,
  TextField,
  Typography,
  useTheme
} from '@mui/material'
import { makeStyles } from '@mui/styles'
import { map } from 'rxjs/operators'

// import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { CloseOutlined } from '@mui/icons-material'
import { Button } from 'primereact/button'

import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

import RoleService from '@/services/utility/role'
import { PolicyService } from '@/services/remote-api/api/policy-services'
import { ClientService } from '@/services/remote-api/api/client-services'
import { FettleDataGrid } from '../../shared-component/components/fettle.data.grid'

const PAGE_NAME = 'POLICY'
const roleService = new RoleService()

const useStyles = makeStyles(theme => ({
  tableBg: {
    height: 400,
    width: '100%',
    backgroundColor: '#fff',
    boxShadow: '0px 3px 3px -2px rgb(0 0 0 / 20%), 0px 3px 4px 0px rgb(0 0 0 / 14%), 0px 1px 8px 0px rgb(0 0 0 / 12%)',
    borderRadius: '4px'
  },
  reassignButton: {
    marginLeft: '5px'
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
  padding: '2% 3%',
  borderRadius: '20px'
}

const policyService = new PolicyService()
const clientService = new ClientService()

const columnsDefinations = [
  { field: 'clientName', headerName: 'Name' },
  { field: 'policyNumber', headerName: 'Policy Number' },
  {
    field: 'policyStartDate',
    headerName: 'Policy Period',
    body: (rowData: any) => {
      const date = new Date(rowData.policyEndDate); // or your timestamp
      const month = date.getUTCMonth() + 1; // Months are 0-indexed
      const day = date.getUTCDate();
      const year = date.getUTCFullYear();
      let ed = `${month}/${day}/${year}`;
      return (
        <span style={{ width: '100px' }}>
          {new Date(rowData.policyStartDate).toLocaleDateString()} -{' '}
          {ed}
        </span>
      )
    }
  },
  { field: 'policyInitDate', headerName: 'Date' },
  { field: 'policyStatus', headerName: 'Policy Status' }
]

export default function PolicyListComponent(props: any) {
  const router = useRouter()
  const [rows, setRows] = React.useState(props.rows)

  const classes = useStyles()

  const [open, setOpen] = React.useState(false)
  const [reloadTable, setReloadTable] = React.useState(false)
  const [selectedPolicy, setSelectedPolicy]: any = React.useState({})
  const [invoiceModal, setInvoiceModal] = React.useState(false)
  const [searchType, setSearchType] = React.useState(0)
  const [policyStartDate, setPolicyStartDate]: any = React.useState(null)
  const [policyEndDate, setPolicyEndDate]: any = React.useState(null)

  const [toPolicyStartDate, setToPolicyStartDate]: any = React.useState(null)
  const [toPolicyEndDate, setToPolicyEndDate]: any = React.useState(null)

  const [policyCreationStart, setPolicyCreationStart]: any = React.useState(null)
  const [policyCreationEnd, setPolicyCreationEnd]: any = React.useState(null)
  const theme = useTheme()

  const dataSource$: any = (
    pageRequest: any = {
      page: 0,
      size: 10,
      summary: true,
      active: true
    },
    policyStartDatePayload = {
      page: 0,
      size: 10,
      summary: true,
      active: true,
      fromPolicyStartDate: policyStartDate === '' ? 0 : policyStartDate - 5.5 * 60 * 60 * 1000,
      toPolicyStartDate:
        policyEndDate === ''
          ? policyStartDate === ''
            ? 0
            : Number(policyStartDate) - 5.5 * 60 * 60 * 1000
          : !policyEndDate
            ? Number(policyStartDate) - 5.5 * 60 * 60 * 1000
            : Number(policyEndDate) - 5.5 * 60 * 60 * 1000
    },
    policyEndDatePayload = {
      page: 0,
      size: 10,
      summary: true,
      active: true,
      fromPolicyEndDate: toPolicyStartDate === '' ? 0 : toPolicyStartDate - 5.5 * 60 * 60 * 1000,
      toPolicyEndDate:
        toPolicyEndDate === ''
          ? toPolicyStartDate === ''
            ? 0
            : toPolicyStartDate - 5.5 * 60 * 60 * 1000
          : !toPolicyEndDate
            ? toPolicyStartDate - 5.5 * 60 * 60 * 1000
            : toPolicyEndDate - 5.5 * 60 * 60 * 1000
    },
    creationDatePayload = {
      page: 0,
      size: 10,
      summary: true,
      active: true,
      fromCreatedDate: policyCreationStart === '' ? 0 : policyCreationStart - 5.5 * 60 * 60 * 1000,
      toCreatedDate:
        policyCreationEnd === ''
          ? policyCreationStart === ''
            ? 0
            : policyCreationStart - 5.5 * 60 * 60 * 1000
          : !policyCreationEnd
            ? policyCreationStart - 5.5 * 60 * 60 * 1000
            : policyCreationEnd - 5.5 * 60 * 60 * 1000
    }
  ) => {
    pageRequest.sort = ['rowLastUpdatedDate dsc']

    // delete pageRequest.searchKey;
    if (!pageRequest.searchKey) {
      return policyService
        .getPolicy(
          searchType === 1
            ? policyStartDatePayload
            : searchType === 2
              ? policyEndDatePayload
              : searchType === 3
                ? creationDatePayload
                : pageRequest
        )
        .pipe(
          map(data => {
            const content = data.content

            const records = content.map((item: any) => {
              item['policyInitDate'] = new Date(item.policyInitDate).toLocaleDateString()

              return item
            })

            data.content = records

            return data
          })
        )
    }

    pageRequest.sort = ['rowLastUpdatedDate dsc']

    if (pageRequest.searchKey) {
      pageRequest['clientName'] = pageRequest.searchKey.trim()
      pageRequest['policyNo'] = pageRequest.searchKey.trim()

      return policyService.getPolicy(pageRequest).pipe(
        map(cdata => {
          return cdata
        })
      )
    }
  }

  const handleOpen = () => {
    router.push('/policies?mode=create')
  }

  React.useEffect(() => {
    setRows(props.rows)
  }, [props.rows])

  const downloadPolicy = (item: any) => {
    policyService.downloadPolicy(item?.id).subscribe((blob: any) => {
      const downloadUrl = window.URL.createObjectURL(blob)

      // Create a temporary anchor element
      const a = document.createElement('a')

      a.href = downloadUrl
      a.download = `Policy_${item.id}.pdf` // Set the default file name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a) // Clean up the DOM

      // Release the object URL
      window.URL.revokeObjectURL(downloadUrl)
    })
  }

  const emailPolicy = (item: any) => {
    policyService.emailPolicy(item?.id).subscribe((res: any) => {
      alert("Policy is sent to your registered email address successfully.")
    })
  }

  const openEditSection = (policy: any) => {
    const referenceID = policy.referenceNumber
    const clientID = policy.clientId

    if (policy.sourceType == 'INVOICE' && policy.sourceId) {
      router.push(`/policies/${policy.id}?mode=edit&clientid=` + clientID + `&invid=` + policy.sourceId)
    }

    if (policy.sourceType == 'RECEIPT' && policy.sourceId) {
      router.push(`/policies/${policy.id}?mode=edit&clientid=` + clientID + `&recid=` + policy.sourceId)
    }

    if (referenceID) {
      router.push(`/policies/${policy.id}?mode=edit&clientid=` + clientID + `&refid=` + referenceID)
    }
  }

  const handleClose = () => {
    setOpen(false)
    setSelectedPolicy(null)
  }

  const handleClickForReAssignOpen = (policy: any) => {
    setSelectedPolicy(policy)
    setOpen(true)
  }

  const handleReAssignButtonClick = () => {
    policyService.reAssignRequest(selectedPolicy.id).subscribe(res => {
      setOpen(false)
      setReloadTable(true)
    })
  }

  const onSearch = () => {
    setInvoiceModal(false)
    setReloadTable(true)
    setTimeout(() => {
      setReloadTable(false)
      setPolicyStartDate(null)
      setToPolicyStartDate(null)
      setPolicyCreationStart(null)
      setPolicyEndDate(null)
      setToPolicyEndDate(null)
      setPolicyCreationEnd(null)
    }, 1000)
  }

  const actionBtnList = [
    {
      key: 'update_policy',
      icon: 'pi pi-download', // Changed icon to download
      className: 'ui-button-warning',
      tooltip: 'Download',
      onClick: downloadPolicy
    },
    {
      key: 'update_policy',
      icon: 'pi pi-inbox', // Changed icon to download
      className: 'ui-button-warning',
      tooltip: 'Email',
      onClick: emailPolicy,
      disabled: (p: any) => p.policyStatus != 'ACTIVE'
    },
    {
      key: 'update_policy',
      icon: 'pi pi-user-edit',
      className: 'ui-button-warning',
      onClick: openEditSection
    },
    {
      key: 'update_policy',
      icon: 'pi pi-arrow-circle-down',
      className: classes.reassignButton,
      onClick: handleClickForReAssignOpen,
      disabled: (p: any) => p.policyStatus != 'ASSIGN_FAILED'
    }
  ]

  // PolicyStartDate
  const PolicyStartDate = () => {
    setInvoiceModal(true)
    setSearchType(1)
  }

  // PolicyEndDate
  const PolicyEndDate = () => {
    setInvoiceModal(true)
    setSearchType(2)
  }

  const PolicyCreation = () => {
    setInvoiceModal(true)
    setSearchType(3)
  }

  const xlsColumns = ['clientName', 'policyNumber', 'policyStartDate', 'policyInitDate', 'policyStatus']

  const configuration: any = {
    enableSelection: false,
    scrollHeight: '300px',
    pageSize: 10,
    actionButtons: roleService.checkActionPermission(PAGE_NAME, '', () => { }, actionBtnList),
    header: {
      enable: true,
      enableDownload: true,
      downloadbleColumns: xlsColumns,
      addCreateButton: roleService.checkActionPermission(PAGE_NAME, 'CREATE'),
      onCreateButtonClick: handleOpen,
      text: 'Policy Management',
      enableGlobalSearch: true,
      searchText: 'Search by Name, Policy Number',
      selectionMenus: [
        { icon: '', label: 'Policy StartDate', onClick: PolicyStartDate },
        { icon: '', label: 'Policy EndDate', onClick: PolicyEndDate },
        { icon: '', label: 'Policy CreationDate', onClick: PolicyCreation }
      ],
      selectionMenuButtonText: 'Advance Search'
    }
  }

  return (
    <div>
      <FettleDataGrid
        $datasource={dataSource$}
        columnsdefination={columnsDefinations}
        onEdit={openEditSection}
        config={configuration}
        reloadtable={reloadTable}
      />

      <Modal open={invoiceModal} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
        <Box style={modalStyle}>
          <Box>
            <Box id='alert-dialog-slide-description'>
              {searchType == 1 && (
                <>
                  <Box display={'flex'} justifyContent={'space-between'}>
                    <Box component='h3' marginBottom={'10px'}>
                      Policy Start Date
                    </Box>
                    <CloseOutlined onClick={() => setInvoiceModal(false)} style={{ cursor: 'pointer' }} />
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
                            value={policyStartDate}
                            onChange={(date:any) => setPolicyStartDate(date)}
                            KeyboardButtonProps={{
                              'aria-label': 'change ing date',
                            }}
                          />
                        </MuiPickersUtilsProvider> */}
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            views={['year', 'month', 'day']}
                            value={policyStartDate}
                            onChange={(date: any) => setPolicyStartDate(date)}
                            renderInput={params => (
                              <TextField
                                {...params}
                                margin='normal'
                                style={{ marginBottom: '0px' }}
                                variant='outlined'
                              />
                            )}
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
                            value={policyEndDate}
                            onChange={(date:any) => setPolicyEndDate(date)}
                            KeyboardButtonProps={{
                              'aria-label': 'change ing date',
                            }}
                          />
                        </MuiPickersUtilsProvider> */}
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            views={['year', 'month', 'day']}
                            value={policyEndDate}
                            onChange={(date: any) => setPolicyEndDate(date)}
                            renderInput={params => (
                              <TextField
                                {...params}
                                margin='normal'
                                style={{ marginBottom: '0px' }}
                                variant='outlined'
                              />
                            )}
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
                      Policy End Date
                    </Box>
                    <CloseOutlined onClick={() => setInvoiceModal(false)} style={{ cursor: 'pointer' }} />
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
                            value={toPolicyStartDate}
                            onChange={(date:any) => setToPolicyStartDate(date)}
                            KeyboardButtonProps={{
                              'aria-label': 'change ing date',
                            }}
                          />
                        </MuiPickersUtilsProvider> */}
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            views={['year', 'month', 'day']}
                            value={toPolicyStartDate}
                            onChange={(date: any) => setToPolicyStartDate(date)}
                            renderInput={params => (
                              <TextField
                                {...params}
                                margin='normal'
                                style={{ marginBottom: '0px' }}
                                variant='outlined'
                              />
                            )}
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
                            value={toPolicyEndDate}
                            onChange={(date:any) => setToPolicyEndDate(date)}
                            KeyboardButtonProps={{
                              'aria-label': 'change ing date',
                            }}
                          />
                        </MuiPickersUtilsProvider> */}
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            views={['year', 'month', 'day']}
                            value={toPolicyEndDate}
                            onChange={(date: any) => setToPolicyEndDate(date)}
                            renderInput={params => (
                              <TextField
                                {...params}
                                margin='normal'
                                style={{ marginBottom: '0px' }}
                                variant='outlined'
                              />
                            )}
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
                      Policy End Date
                    </Box>
                    <CloseOutlined onClick={() => setInvoiceModal(false)} style={{ cursor: 'pointer' }} />
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
                            value={policyCreationStart}
                            onChange={(date:any) => setPolicyCreationStart(date)}
                            KeyboardButtonProps={{
                              'aria-label': 'change ing date',
                            }}
                          />
                        </MuiPickersUtilsProvider> */}
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            views={['year', 'month', 'day']}
                            value={policyCreationStart}
                            onChange={(date: any) => setPolicyCreationStart(date)}
                            renderInput={params => (
                              <TextField
                                {...params}
                                margin='normal'
                                style={{ marginBottom: '0px' }}
                                variant='outlined'
                              />
                            )}
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
                            value={policyCreationEnd}
                            onChange={(date:any) => setPolicyCreationEnd(date)}
                            KeyboardButtonProps={{
                              'aria-label': 'change ing date',
                            }}
                          />
                        </MuiPickersUtilsProvider> */}
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            views={['year', 'month', 'day']}
                            value={policyCreationEnd}
                            onChange={(date: any) => setPolicyCreationEnd(date)}
                            renderInput={params => (
                              <TextField
                                {...params}
                                margin='normal'
                                style={{ marginBottom: '0px' }}
                                variant='outlined'
                              />
                            )}
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

      <Dialog open={open} onClose={handleClose} aria-labelledby='form-dialog-title' fullWidth maxWidth='xs'>
        <DialogTitle id='form-dialog-title'>Request reassign</DialogTitle>
        <DialogContent>
          <DialogContentText style={{ fontSize: 12 }}>
            Are you sure , want to raise reassign Request of policy {selectedPolicy?.policyNumber}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} className='p-button-text' color='primary'>
            Cancel
          </Button>
          <Button onClick={handleReAssignButtonClick} color='primary'>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
