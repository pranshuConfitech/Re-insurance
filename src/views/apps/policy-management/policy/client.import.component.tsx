import * as React from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import Box from '@mui/material/Box'
import { Button } from 'primereact/button'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormLabel from '@mui/material/FormLabel'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import Snackbar from '@mui/material/Snackbar'
import { makeStyles } from '@mui/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import SearchIcon from '@mui/icons-material/Search'
import type { AlertProps } from '@mui/lab/Alert'
import MuiAlert from '@mui/lab/Alert'
import { map } from 'rxjs/operators'

import { ClientService, ProspectService } from '@/services/remote-api/api/client-services'
import { InvoiceService } from '@/services/remote-api/api/invoice-services'
import { ReceiptService } from '@/services/remote-api/api/receipts-services'

import { FettleMultiFieldSearch } from '../../shared-component/components/fettle.multi.field.search'

const useStyles = makeStyles(theme => ({
  tableBg: {
    height: 400,
    width: '100%',
    backgroundColor: '#fff',
    boxShadow: '0px 3px 3px -2px rgb(0 0 0 / 20%), 0px 3px 4px 0px rgb(0 0 0 / 14%), 0px 1px 8px 0px rgb(0 0 0 / 12%)',
    borderRadius: '4px'
  },
  prospectImportOuterContainer: {
    padding: 20
  },
  prospectImportRadioGroup: {
    flexWrap: 'nowrap',
    '& label': {
      flexDirection: 'row'
    }
  }
}))

// function useQuery1() {
//   return new URLSearchParams(useLocation().search);
// }

function Alert(props: React.JSX.IntrinsicAttributes & AlertProps) {
  return <MuiAlert elevation={6} variant='filled' {...props} />
}

const prospectService = new ProspectService()
const clientService = new ClientService()
const invoiceservice = new InvoiceService()
const receiptservice = new ReceiptService()

export default function ClientImportComponent(props: any) {
  const classes = useStyles()
  const router = useRouter()
  const query1 = useSearchParams()
  const [showClientSearch, setShowClientSearch] = React.useState(false)
  const [openRequired, setOpenRequired] = React.useState(false)
  const [snackMsg, setSnackMsg] = React.useState('')

  const [clientData, setClientData]: any = React.useState(null)

  const [state, setState]: any = React.useState({
    showSearch: false,
    showProspectTable: false,
    selectedCode: '',
    selectedMobile: '',
    selectedDisplayName: '',
    rows: [],
    selectedChoice: '',
    selectedChoice1: '',
    selectedNo: '',
    referenceNo: '',
    invID: '',
    recID: ''
  })

  const dataSource$ = (fields: any, pageRequest = { page: 0, size: 10 }) => {
    const pagerequestquery: any = {
      page: pageRequest.page,
      size: pageRequest.size,
      summary: false
    }

    pagerequestquery.sort = ['rowLastUpdatedDate dsc']
    Object.keys(fields)
      .filter(key => !!fields[key])
      .forEach(key => (pagerequestquery[key] = fields[key]))

    return clientService.getClients(pagerequestquery).pipe(
      map(data => {
        const content = data.content

        const records = content.map((item: any) => {
          item['clientBasicDetails']['primaryContact'] = item.clientBasicDetails.contactNos[0].contactNo

          return item
        })

        data.content = records

        return data
      })
    )
  }

  const fields = [
    { label: 'Code', propertyName: 'code' },
    { label: 'Name', propertyName: 'name' }

    // { label: "Contact", propertyName: "mobileNo" }
  ]

  const columnsDefinations = [
    { field: 'clientBasicDetails.code', headerName: 'Client Code' },

    // { field: "clientBasicDetails.clientTypeCd", headerName: "Client Type" },
    { field: 'clientBasicDetails.displayName', headerName: 'Name' },
    { field: 'clientBasicDetails.primaryContact', headerName: 'Contact Number' }
  ]

  const handleImport = (item: any) => {
    if (state.referenceNo === '') {
      setOpenRequired(true)
      setSnackMsg('Please enter the reference Number')
    }

    if (state.referenceNo !== '') {
      router.push(`/policies?mode=create&clientid=` + item.id + `&refid=` + state.referenceNo)
    }
  }

  const getProspects = () => {
    const pgequery: any = {
      page: 0,
      size: 10,
      summary: false

      // active: true,
      // sort: [
      //   string
      // ],
    }

    if (state.selectedCode) {
      pgequery['code'] = state.selectedCode
    }

    if (state.selectedDisplayName) {
      pgequery['displayName'] = state.selectedDisplayName
    }

    if (state.selectedMobile) {
      pgequery['mobileNo'] = state.selectedMobile
    }

    prospectService.importProspectData(pgequery).subscribe(res => {
      setState({
        ...state,
        rows: res.content,
        showProspectTable: true
      })
    })
  }

  const handleCancel = () => {
    setState({
      showProspectTable: false,
      selectedChoice: '',
      selectedChoice1: '',
      selectedCode: '',
      selectedMobile: '',
      selectedDisplayName: ''
    })
    props.closeProspectimport()
  }

  if (query1.get('clientid')) {
    const clientID: any = query1.get('clientid')

    clientService.getClientDetails(clientID).subscribe(cd => {
      props.handleProspectImport(cd, clientID)
    })
  }

  const createClient = () => {
    if (state.referenceNo === '') {
      setOpenRequired(true)
      setSnackMsg('Please enter the reference Number')
    }

    if (state.referenceNo !== '') {
      router.push(`/client/clients?mode=create&for=proposer&refid=` + state.referenceNo)
    }
  }

  const importClient = () => {
    if (state.selectedChoice1 === 'invoice') {
      router.push(`/policies?mode=create&clientid=` + clientData.id + `&invid=` + state.invID)
    }

    if (state.selectedChoice1 === 'receipt') {
      router.push(`/policies?mode=create&clientid=` + clientData.id + `&recid=` + state.recID)
    }

    // props.handleProspectImport(clientData,clientData.id)
  }

  const handleChange = (e: any) => {
    if (e.target.name === 'prosimport') {
      setState({
        ...state,
        selectedChoice: e.target.value
      })

      if (e.target.value === 'No') {
        // handleCancel();
      }
    }

    if (e.target.name === 'clientimport') {
      if (e.target.value === 'others') {
        setShowClientSearch(true)
      }

      setState({
        ...state,
        selectedChoice1: e.target.value,
        selectedNo: ''
      })
      setClientData('')
    }

    if (e.target.name === 'selectedNo') {
      setState({
        ...state,
        selectedNo: e.target.value
      })
    }

    if (e.target.name === 'referenceNo') {
      setState({
        ...state,
        referenceNo: e.target.value
      })
    }

    if (e.target.name === 'selectedDisplayName') {
      setState({
        ...state,
        selectedDisplayName: e.target.value
      })
    }

    if (e.target.name === 'selectedMobile') {
      setState({
        ...state,
        selectedMobile: e.target.value
      })
    }
  }

  const searchFromInvoiceReceipt = () => {
    if (state.selectedChoice1 === 'invoice') {
      const pageRequest: any = {
        page: 0,
        size: 1000,
        summary: true,
        active: true
      }

      pageRequest['invoiceNumber'] = state.selectedNo
      invoiceservice.getInvoice(pageRequest).subscribe((ele: any) => {
        if (ele?.content.length !== 0 && ele?.content[0]?.clientOrProspectId && !ele?.content[0]?.reverted) {
          setShowClientSearch(false)
          setState({
            ...state,
            invID: ele?.content[0]?.id
          })
          clientService.getClientDetails(ele.content[0].clientOrProspectId).subscribe(cd => {
            setClientData(cd)
          })
        }

        if (ele.content.length === 0) {
          setShowClientSearch(true)
        }

        if (ele.content[0].reverted) {
          setOpenRequired(true)
          setSnackMsg('The entered Invoice/receipt number is reverted, Please enter a different number')
        }
      })
    }

    if (state.selectedChoice1 === 'receipt') {
      const pageRequest: any = {
        page: 0,
        size: 1000,
        summary: true,
        active: true
      }

      pageRequest['receiptNumber'] = state.selectedNo
      receiptservice.getReceipts(pageRequest).subscribe((ele: any) => {
        if (ele.content[0].clientOrProspectId) {
          setShowClientSearch(false)
          setState({
            ...state,
            recID: ele.content[0].id
          })
          clientService.getClientDetails(ele.content[0].clientOrProspectId).subscribe((cd: any) => {
            setClientData(cd)
          })
        } else {
          setShowClientSearch(true)
        }
      })
    }
  }

  const handleSnackClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    setOpenRequired(false)
    setSnackMsg('')
  }

  return (
    <div>
      <Snackbar open={openRequired} autoHideDuration={6000} onClose={handleSnackClose}>
        <Alert onClose={handleSnackClose} severity='error'>
          {snackMsg}
        </Alert>
      </Snackbar>
      {!showClientSearch && (
        <Paper elevation={0} className={classes.prospectImportOuterContainer}>
          <FormControl component='fieldset'>
            <FormLabel component='legend'>Do you want to import data from</FormLabel>
            <RadioGroup
              aria-label='clientimport'
              name='clientimport'
              value={state.selectedChoice1}
              onChange={handleChange}
              row
              className={classes.prospectImportRadioGroup}
            >
              <FormControlLabel value='invoice' control={<Radio size='small' />} label='Invoice' />
              <FormControlLabel value='receipt' control={<Radio size='small' />} label='Receipt' />
              <FormControlLabel value='others' control={<Radio size='small' />} label='No Invoice/Receipt' />
            </RadioGroup>
          </FormControl>
        </Paper>
      )}
      {state.selectedChoice1 !== '' && state.selectedChoice !== null && !showClientSearch ? (
        <Paper elevation={0} className={classes.prospectImportOuterContainer}>
          <Box p={3} my={2}>
            <Grid container spacing={3} style={{ marginBottom: '20px' }}>
              <Grid item xs={3}>
                <TextField
                  size='small'
                  id='standard-basic'
                  name='selectedNo'
                  value={state.selectedNo}
                  onChange={handleChange}
                  label={state.selectedChoice1 === 'receipt' ? 'Receipt Number' : 'Invoice Number'}
                />
              </Grid>
              <Grid item xs={2}>
                <Button color='primary' onClick={searchFromInvoiceReceipt}>
                  <SearchIcon />
                  Search
                </Button>
              </Grid>
            </Grid>
            {clientData !== '' && (
              <Grid container spacing={3} style={{ marginBottom: '20px' }}>
                <Grid item xs={12}>
                  <TableContainer component={Paper} elevation={0}>
                    <Table size='small' aria-label='a dense table'>
                      <TableHead>
                        <TableRow>
                          <TableCell>Code</TableCell>
                          <TableCell>Name</TableCell>
                          <TableCell>Contact</TableCell>
                          <TableCell>Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>{clientData.clientBasicDetails.code}</TableCell>
                          <TableCell>{clientData.clientBasicDetails.displayName}</TableCell>
                          <TableCell>{clientData.clientBasicDetails.contactNos[0].contactNo}</TableCell>
                          <TableCell>
                            <Button color='primary' onClick={importClient}>
                              Import Client
                            </Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            )}
          </Box>
        </Paper>
      ) : null}
      {showClientSearch ? (
        <div>
          <Paper elevation={0} className={classes.prospectImportOuterContainer}>
            <Grid container spacing={3} style={{ marginBottom: '20px' }}>
              <Grid item xs={6}>
                <FormControl component='fieldset'>
                  <FormLabel component='legend'>
                    Invoice/Receipt No not found.Do you want to import data from Client
                  </FormLabel>
                  <RadioGroup
                    aria-label='prosimport'
                    name='prosimport'
                    value={state.selectedChoice}
                    onChange={handleChange}
                    row
                    className={classes.prospectImportRadioGroup}
                  >
                    <FormControlLabel value='Yes' control={<Radio size='small' />} label='Yes' />
                    <FormControlLabel value='No' control={<Radio size='small' />} label='No' />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <TextField
                  style={{ width: '100%' }}
                  id='standard-basic'
                  name='referenceNo'
                  value={state.referenceNo}
                  onChange={handleChange}
                  label='Reference No for Invoice/Receipt'
                />
              </Grid>
              <Grid item xs={2}>
                {state.selectedChoice === 'No' && (
                  <Button color='primary' onClick={createClient}>
                    Create Client
                  </Button>
                )}
              </Grid>
            </Grid>
          </Paper>

          {state.selectedChoice === 'Yes' && (
            <div>
              <Paper elevation={0}>
                <Box p={3} my={2}>
                  <FettleMultiFieldSearch
                    $datasource={dataSource$}
                    fields={fields}
                    onSelect={(item: any) => {
                      handleImport(item)
                    }}
                    columnsDefinations={columnsDefinations}
                    dataGridPageSize={10}
                    dataGridScrollHeight='400px'
                  />
                </Box>
              </Paper>
            </div>
          )}
        </div>
      ) : null}
    </div>
  )
}
