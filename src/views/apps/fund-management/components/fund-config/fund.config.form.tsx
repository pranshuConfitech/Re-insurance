'use client'
import React from 'react'

import { useParams, useRouter, useSearchParams } from 'next/navigation'

import { makeStyles } from '@mui/styles'
import Box from '@mui/material/Box'
import { Button } from 'primereact/button'
import Checkbox from '@mui/material/Checkbox'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import Grid from '@mui/material/Grid'
import InputAdornment from '@mui/material/InputAdornment'
import InputLabel from '@mui/material/InputLabel'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import Autocomplete from '@mui/lab/Autocomplete'
import { useFormik } from 'formik'
import * as yup from 'yup'

import RenewalTable from './fund-config-table'
import { FundService } from '@/services/remote-api/api/fund-services/fund.services'

const icon = <CheckBoxOutlineBlankIcon fontSize='small' />
const checkedIcon = <CheckBoxIcon fontSize='small' />

const useStyles = makeStyles((theme: any) => ({
  serviceDesignRoot: {
    flexGrow: 1,
    minHeight: 100,
    padding: 30
  },
  header: {
    paddingTop: 10,
    paddingBottom: 10,
    color: '#4472C4'
  },
  formControl: {
    margin: theme?.spacing ? theme?.spacing(1) : '8px',
    minWidth: 120,
    maxWidth: 300
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  chip: {
    margin: 2
  },
  tableBg: {
    height: 400,
    width: '100%',
    backgroundColor: '#fff',
    boxShadow: '0px 3px 3px -2px rgb(0 0 0 / 20%), 0px 3px 4px 0px rgb(0 0 0 / 14%), 0px 1px 8px 0px rgb(0 0 0 / 12%)',
    borderRadius: '4px'
  },
  clientAutoComplete: {
    width: 500,
    '& .MuiInputBase-formControl': {
      maxHeight: 200,
      overflowX: 'hidden',
      overflowY: 'auto'
    }
  }
}))

const validationSchema = yup.object({
  percentageOfFundExhausted: yup.number().typeError('Must be digits').required('Field is required'),
  alertMessage: yup.string().required('Field is required')
})

const fundService = new FundService()

// function useQuery1() {
//     return new URLSearchParams(useLocation().search);
// }

const FundConfigForm = () => {
  const history = useRouter()
  const query = useSearchParams()
  const params = useParams()
  const id = params.id
  const [rows, setRows]: any = React.useState([])
  const classes = useStyles()

  const formik = useFormik({
    initialValues: {
      percentageOfFundExhausted: '',
      alertMessage: '',
      alertModeEmail: '',
      alertModeSms: '',
      alertModeWhatsapp: '',
      restrictClaim: '',
      groupClient: []
    },
    validationSchema: validationSchema,
    onSubmit: (values: any, { resetForm }) => {
      if (clients.length === values.groupClient.length) {
        values = { ...values, ['groupClient']: ['ALL'] }
      }

      if (values.groupClient.length > 0 && values.groupClient[0] !== 'ALL') {
        values = { ...values, ['groupClient']: values.groupClient.map((item: any) => item.name) }
      }

      addRow(values)
      resetForm()
    }
  })

  const clients = [
    { id: 12232, name: 'TCS' },
    { id: 323232, name: 'Acclaris' },
    { id: 23231, name: 'Accenture' },
    { id: 2321, name: 'Capgemini' },
    { id: 233231, name: 'Tech Mahindra' },
    { id: 23232, name: 'HCL' },
    { id: 72323, name: 'IBM' },
    { id: 3235454, name: 'HP' },
    { id: 32323, name: 'CTS' },
    { id: 12320, name: 'Wipro' }
  ]

  const handleGroupClientChange = (e: any, val: any) => {
    let selectedClients = val
    const isSelecAll = selectedClients.some((item: any) => item.id === 'selectall')

    selectedClients = isSelecAll ? clients : val
    formik.setFieldValue('groupClient', selectedClients)
  }

  const autocompleteFilterChange = (options: any, state: any) => {
    if (state.inputValue) {
      return options.filter((item: any) => item.name.toLowerCase().indexOf(state.inputValue) > -1)
    }

    return [{ id: 'selectall', name: 'Select all' }, ...options]
  }

  const ITEM_HEIGHT = 48
  const ITEM_PADDING_TOP = 8

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250
      }
    }
  }

  const addRow = (values: any) => {
    setRows([...rows, values])
  }

  React.useEffect(() => {
    if (id) {
      populateData(id)
    }
  }, [id])

  const populateData = (id: any) => {
    fundService.getConfigDetails(id).subscribe(value => {
      formik.setValues({
        percentageOfFundExhausted: value.percentageOfFundExhausted,
        alertMessage: value.alertMessage,
        alertModeEmail: value.alertModeEmail,
        alertModeSms: value.alertModeSms,
        alertModeWhatsapp: value.alertModeWhatsapp,
        restrictClaim: value.restrictClaim,
        groupClient: value.groupClient
      })
      const clientArrayWithId = clients.filter(item => value.groupClient.includes(item.name))

      formik.setFieldValue('groupClient', clientArrayWithId)
    })
  }

  const handleSaveNExit = () => {
    if (query.get('mode') === 'create') {
      const items = [...rows]

      items.map(payload => {
        fundService.saveConfig(payload).subscribe(res => {
          if (res.status === 201) {
            console.log('Submit status: ', res.status, ', ', ' Sucessful!')
          } else {
            console.log('Submit status: ', res.status, ', ', ' Unsucessful!')
          }
        })
      })
      handleClose()
    }

    if (query.get('mode') === 'edit') {
      let payload = { ...formik.values }

      if (clients.length > 0 && clients.length === formik.values.groupClient.length) {
        payload = { ...payload, ['groupClient']: ['ALL'] }
      }

      if (formik.values.groupClient.length > 0 && formik.values.groupClient[0] !== 'ALL') {
        payload = { ...payload, ['groupClient']: formik.values.groupClient.map((item: any) => item.name) }
      }

      const configId: any = id

      fundService.editConfig(payload, configId).subscribe(res => {
        console.log('Submit status: ', res, ', ', ' Sucessful!')
      })
      handleClose()
    }
  }

  const handleClose = () => {
    history.push('/funds/config?mode=viewList')

    // window.location.reload();
  }

  const allSelected = clients.length > 0 && formik.values.groupClient.length === clients.length

  return (
    <div className={classes.serviceDesignRoot}>
      <Paper elevation={0}>
        <Box p={3} my={2}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Grid item xs={3} className={classes.header}>
                <h3>Service Design</h3>
              </Grid>
            </Grid>
          </Grid>
          <form onSubmit={formik.handleSubmit}>
            <Grid container alignItems='center' style={{ padding: '20px' }}>
              <Grid item style={{ paddingLeft: '10%' }} xs={4}>
                <InputLabel id='percentage'>Percentage Of Fund Exhausted</InputLabel>
              </Grid>
              <Grid item xs={8}>
                <TextField
                  style={{ maxWidth: '100px' }}
                  id='percentageOfFundExhausted'
                  name='percentageOfFundExhausted'
                  value={formik.values.percentageOfFundExhausted}
                  onChange={formik.handleChange}
                  InputProps={{
                    endAdornment: <InputAdornment position='end'>%</InputAdornment>
                  }}
                  error={formik.touched.percentageOfFundExhausted && Boolean(formik.errors.percentageOfFundExhausted)}

                  // helperText={formik.touched.percentageOfFundExhausted && formik.errors.percentageOfFundExhausted}
                />
              </Grid>
            </Grid>

            <Grid container alignItems='flex-start' style={{ padding: '20px' }}>
              <Grid item style={{ paddingLeft: '10%' }} xs={4}>
                <InputLabel id='alertMessage'>Alert Message</InputLabel>
              </Grid>
              <Grid item xs={8}>
                <TextField
                  id='alertMessage'
                  name='alertMessage'
                  type='text'
                  multiline
                  rows={5}
                  value={formik.values.alertMessage}
                  onChange={formik.handleChange}
                  error={formik.touched.alertMessage && Boolean(formik.errors.alertMessage)}

                  // helperText={formik.touched.alertMessage && formik.errors.alertMessage}
                />
              </Grid>
            </Grid>

            <Grid container alignItems='center' style={{ padding: '20px' }}>
              <Grid item style={{ paddingLeft: '10%' }} xs={4}>
                <InputLabel id='alertMessage'>Alert Mode</InputLabel>
              </Grid>
              <Grid item xs={8}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formik.values.alertModeEmail}
                      onChange={formik.handleChange}
                      name='alertModeEmail'
                      color='primary'
                    />
                  }
                  label='Email'
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formik.values.alertModeSms}
                      onChange={formik.handleChange}
                      name='alertModeSms'
                      color='primary'
                    />
                  }
                  label='SMS'
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formik.values.alertModeWhatsapp}
                      onChange={formik.handleChange}
                      name='alertModeWhatsapp'
                      color='primary'
                    />
                  }
                  label='Whatsapp'
                />
              </Grid>
            </Grid>
            <Grid container alignItems='center' style={{ padding: '20px' }}>
              <Grid item style={{ paddingLeft: '10%' }} xs={4}>
                <InputLabel id='alertMessage'>Restrict Claim Processing</InputLabel>
              </Grid>
              <Grid item xs={8}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formik.values.restrictClaim}
                      onChange={formik.handleChange}
                      name='restrictClaim'
                      color='primary'
                    />
                  }
                  label='Restrict'
                />
              </Grid>
            </Grid>
            <Grid container alignItems='center' style={{ padding: '20px' }}>
              <Grid item style={{ paddingLeft: '10%' }} xs={4}>
                <InputLabel id='alertMessage'>Group Clients</InputLabel>
              </Grid>
              <Grid item xs={8}>
                <FormControl className={classes.formControl}>
                  <Autocomplete
                    className={classes.clientAutoComplete}
                    multiple
                    value={formik.values.groupClient}
                    onChange={handleGroupClientChange}
                    id='checkboxes-tags-demo'
                    filterOptions={autocompleteFilterChange}
                    options={clients}
                    disableCloseOnSelect
                    getOptionLabel={option => option.name}
                    isOptionEqualToValue={(option: any, value: any) => option.id === value.id}
                    renderOption={(props, option: any, { selected }) => {
                      const selectedOpt = (option.id === 'selectall' && allSelected) || selected

                      return (
                        <li {...props}>
                          <Checkbox
                            icon={icon}
                            checkedIcon={checkedIcon}
                            style={{ marginRight: 8, color: '#626bda' }}
                            checked={selectedOpt}
                          />
                          {option.name}
                        </li>
                      )
                    }}
                    renderInput={params => <TextField {...params} label='Clients' placeholder='Select Client' />}
                  />
                </FormControl>
              </Grid>
            </Grid>

            <Grid container spacing={1}>
              {query.get('mode') === 'edit' ? (
                ''
              ) : (
                <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                  <Button type='submit' color='primary' label='Add' icon='pi pi-plus' iconPos='right'>
                    Add
                  </Button>
                </Grid>
              )}
            </Grid>
          </form>

          <Divider />
          <Grid container spacing={1} style={{ marginTop: 30 }}>
            {query.get('mode') === 'edit' ? (
              ''
            ) : (
              <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                {/*  editTableRule={'this.editTableRule'}  */}
                <div className={classes.tableBg}>
                  {/* copied from product-management\components\service-design\service-design-table.js*/}
                  <RenewalTable designList={rows} action={true} />
                </div>
              </Grid>
            )}
            <Grid item xs={3}>
              <Button onClick={handleSaveNExit} color='primary' icon='pi pi-save' iconPos='right'>
                SAVE & EXIT
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </div>
  )
}

export default FundConfigForm
