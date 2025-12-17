import { useEffect } from 'react'

import * as React from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import { makeStyles } from '@mui/styles'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import type { AlertProps } from '@mui/material'
import { Grid, Paper, InputLabel, Select, MenuItem, Snackbar, TextField, Button } from '@mui/material'

import { useFormik } from 'formik'
import * as yup from 'yup'

import Autocomplete from '@mui/lab/Autocomplete'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

import 'date-fns'

import UploadFileIcon from '@mui/icons-material/UploadFile'
import DownloadIcon from '@mui/icons-material/Download'

import MuiAlert from '@mui/lab/Alert'

import { PlanService } from '@/services/remote-api/api/plan-services'
import {
  ClientTypeService,
  ProviderTypeService,
  GroupTypeService,
  CategoryService,
  ProviderNegotiationService
} from '@/services/remote-api/api/master-services'

import { ProvidersService } from '@/services/remote-api/api/provider-services'

import Asterisk from '@/views/apps/shared-component/components/red-asterisk'

const providerservice = new ProvidersService()
const providertypeservice = new ProviderTypeService()
const clienttypeervice = new ClientTypeService()
const grouptypeService = new GroupTypeService()
const planservice = new PlanService()
const categoryservice = new CategoryService()
const negotitationService = new ProviderNegotiationService()

const pt$ = providertypeservice.getProviderTypes()
const ct$ = clienttypeervice.getCleintTypes()
const ps$ = providerservice.getProviders({
  page: 0,
  size: 10000,
  summary: true,
  active: true
})
const gt$ = grouptypeService.getGroupTypes()
const pls$ = planservice.getPlans()
const cs$ = categoryservice.getCategories()

const validationSchema = yup.object({
  type: yup.string().required('Provider Type is required'),
  providerId: yup.string().required('Provider Name is required'),
  providerCategory: yup.string().required('Provider Category is required')
})

const useStyles = makeStyles((theme: any) => ({
  input: {
    width: '100%'
  },
  root: {
    flexGrow: 1,
    minHeight: 100
  },
  paper: {
    padding: theme?.spacing ? theme?.spacing(2) : '16px',
    textAlign: 'center',
    color: theme?.palette?.text?.secondary
  },
  formControl: {
    margin: theme?.spacing ? theme?.spacing(1) : '8px',
    minWidth: 276,
    width: '100%'
  },
  header: {
    paddingTop: 10,
    paddingBottom: 10,
    color: '#4472C4'
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    fontWeight: 500
  },
  uploadButton: {
    backgroundColor: '#1976d2',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#1565c0'
    }
  },
  downloadButton: {
    backgroundColor: '#1976d2',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#1565c0'
    }
  },
  fileInput: {
    display: 'none'
  },
  fileInputLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  formGrid: {
    marginBottom: '20px'
  },
  actionButtons: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '20px'
  }
}))

const NegotiationFormComponent = () => {
  const query = useSearchParams()
  const history = useRouter()
  const classes = useStyles()
  const [radioValue, setRadioValue] = React.useState('')
  const [selectValue, setSelectValue] = React.useState('')
  const [providerTypes, setProviderTypes] = React.useState([])
  const [clientTypes, setClientTypes] = React.useState([])
  const [groupTypes, setGroupTypes] = React.useState([])
  const [providers, setProviders] = React.useState([])
  const [providerCategories, setProviderCategories] = React.useState([])
  const [validFromDate, setValidFromDate] = React.useState(new Date())
  const [validToDate, setValidToDate] = React.useState(new Date())
  const [planList, setPlanList] = React.useState([])
  const [planCategoryList, setPlanCategoryList] = React.useState([])
  const [selectedFile, setSelectedFile]: any = React.useState(null)
  const [alertMsg, setAlertMsg] = React.useState('')
  const [alertSeverity, setAlertSeverity] = React.useState<'success' | 'error'>('success')

  const [openSnack, setOpenSnack] = React.useState(false)

  const formik: any = useFormik({
    initialValues: {
      name: '',
      providerId: '',
      providerData: '',
      type: '',
      clientType: '',
      providerCategory: '',
      validFromDate: '',
      validToDate: '',
      groupTypeCd: '',
      plan: '',
      planId: '',
      planCategory: '',
      providerService: ''
    },
    validationSchema: validationSchema,
    onSubmit: values => {
      handleSubmit(values)
    }
  })

  const useObservable = (observable: any, setter: any) => {
    useEffect(() => {
      const subscription = observable.subscribe((result: any) => {
        setter(result.content)
      })

      return () => subscription.unsubscribe()
    }, [observable, setter])
  }

  const useObservable1 = (observable: any, setter: any) => {
    useEffect(() => {
      const subscription = observable.subscribe((result: any) => {
        const arr: any = []

        result.content.forEach((el: any) => {
          arr.push({
            id: el.id,
            name: el.providerBasicDetails.name
          })
        })
        setter(arr)
      })

      return () => subscription.unsubscribe()
    }, [observable, setter])
  }

  useObservable(pt$, setProviderTypes)
  useObservable(ct$, setClientTypes)
  useObservable1(ps$, setProviders)
  useObservable(gt$, setGroupTypes)
  useObservable(pls$, setPlanList)
  useObservable(cs$, setProviderCategories)

  const handleChange = (event: any) => {
    const { name, value } = event.target

    setSelectValue(value)
  }

  const handleSubmit = (values: any) => {
    const payload: any = {
      providerType: values.type,
      providerId: values.providerId,
      providerCategory: values.providerCategory,
      validFrom: values.validFromDate,
      validTo: values.validToDate,
      industryType: values.clientType,
      corporate: values.groupTypeCd,
      plan: values.planId,
      category: values.planCategory
    }

    negotitationService.saveNegotiation(selectedFile, payload).subscribe({
      next: res => {
        setAlertMsg('Negotiation Created Successfully!')
        setAlertSeverity('success')
        setOpenSnack(true)
        setTimeout(() => {
          history.push('/provider/negotiation?mode=viewList')
        }, 3000)
      },
      error: err => {
        setAlertMsg('Something went wrong')
        setAlertSeverity('error')
        setOpenSnack(true)
      }
    })
  }

  const handleValidFromDateChange = (date: any) => {
    setValidFromDate(date)
    const timestamp = new Date(date).getTime()

    formik.setFieldValue('validFromDate', timestamp)
  }

  const handleValidToDateChange = (date: any) => {
    setValidToDate(date)
    const timestamp = new Date(date).getTime()

    formik.setFieldValue('validToDate', timestamp)
  }

  const handlePChange = (e: any, value: { id: any }) => {
    formik.setFieldValue('providerData', value)
    formik.setFieldValue('providerId', value?.id)
  }

  const handlePlanSelect = (e: any) => {
    const selectedPlan = e.target.value
    if (!selectedPlan || !selectedPlan.planCategorys) {
      console.error('Invalid plan selected')
      return
    }

    formik.setFieldValue('plan', selectedPlan)
    formik.setFieldValue('planId', selectedPlan.id)
    setPlanCategoryList(selectedPlan.planCategorys)
  }

  const handleUpload = (e: any) => {
    const file = e.target.files?.[0]

    if (!file) {
      console.error('No file selected')
      setAlertMsg('Please select a valid file')
      setAlertSeverity('error')
      setOpenSnack(true)
      return
    }

    setSelectedFile(file)
  }

  const handleClose = (event: any) => {
    history.push(`/provider/negotiation?mode=viewList`)
  }

  const handleMsgErrorClose = () => {
    setOpenSnack(false)
    setAlertMsg('')
  }

  function Alert(props: React.JSX.IntrinsicAttributes & AlertProps) {
    return <MuiAlert elevation={6} variant='filled' {...props} />
  }

  const handleExcelDownload = () => {
    negotitationService.downloadExcel().subscribe({
      next: blob => {
        console.log('response', blob)
        const downloadUrl = window.URL.createObjectURL(blob);

        // Create a temporary anchor element
        const a = document.createElement("a");

        a.href = downloadUrl;
        a.download = "Negotiation_Sample_Excel"; // Set the default file name
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a); // Clean up the DOM

        // Release the object URL
        window.URL.revokeObjectURL(downloadUrl);
        // const { data, headers } = response
        // const fileName = headers['content-disposition'].replace(/\w+; filename=(.*)/, '$1')
        // const blob = new Blob([data], { type: headers['content-type'] })
        // const dom: any = document.createElement('a')
        // const url = window.URL.createObjectURL(blob)

        // dom.href = url
        // dom.download = decodeURI(fileName)
        // dom.style.display = 'none'
        // document.body.appendChild(dom)
        // dom.click()
        // dom?.parentNode?.removeChild(dom)
        // window.URL.revokeObjectURL(url)
      },
      error: err => {
        console.error('Error downloading Excel file:', err)
        setAlertMsg('Failed to download Excel file')
        setAlertSeverity('error')
        setOpenSnack(true)
      }
    })
  }

  return (
    <div>
      <Snackbar
        open={openSnack}
        autoHideDuration={2800}
        onClose={handleMsgErrorClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleMsgErrorClose} severity={alertSeverity}>
          {alertMsg}
        </Alert>
      </Snackbar>

      {query.get('mode') === 'create' ? (
        <Grid
          item
          xs={12}
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            marginBottom: '20px',
            height: '2em',
            color: '#000',
            fontSize: '18px'
          }}
        >
          <span
            style={{
              fontWeight: '600',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: '5px'
            }}
          >
            Provider Management- Create Provider Negotiation
          </span>
        </Grid>
      ) : (
        <Grid
          item
          xs={12}
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            marginBottom: '20px',
            height: '2em',
            color: '#000',
            fontSize: '18px'
          }}
        >
          <span
            style={{
              fontWeight: '600',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: '5px'
            }}
          >
            Provider Management- Edit Provider Negotiation
          </span>
        </Grid>
      )}
      <div className={classes.root}>
        <Paper elevation={0} style={{ padding: '20px' }}>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={3} className={classes.formGrid}>
              <Grid item xs={12} md={4}>
                <FormControl
                  className={classes.formControl}
                  error={formik.touched.type && Boolean(formik.errors.type)}
                >
                  <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                    Provider Type <Asterisk />
                  </InputLabel>
                  <Select
                    label='Provider Type'
                    labelId='demo-simple-select-label'
                    name='type'
                    id='demo-simple-select'
                    value={formik.values.type}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    {providerTypes.map((ele: any) => (
                      <MenuItem key={ele.code} value={ele.code}>
                        {ele.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.type && formik.errors.type && (
                    <FormHelperText>{formik.errors.type}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} md={4}>
                <Autocomplete
                  id='combo-box-demo'
                  options={providers}
                  getOptionLabel={(option: any) => option.name ?? ''}
                  value={formik.values.providerData}
                  className={classes.formControl}
                  renderInput={(params: any) => (
                    <TextField
                      {...params}
                      label='Provider Name'
                      error={formik.touched.providerId && Boolean(formik.errors.providerId)}
                      helperText={formik.touched.providerId && formik.errors.providerId}
                      onBlur={formik.handleBlur}
                    />
                  )}
                  onChange={handlePChange}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControl
                  className={classes.formControl}
                  error={formik.touched.providerCategory && Boolean(formik.errors.providerCategory)}
                >
                  <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                    Provide Category <Asterisk />
                  </InputLabel>
                  <Select
                    label='Provide Category'
                    labelId='demo-simple-select-label'
                    name='providerCategory'
                    id='demo-simple-select'
                    value={formik.values.providerCategory}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    {providerCategories.map((ele: any) => (
                      <MenuItem key={ele.code} value={ele.code}>
                        {ele.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.providerCategory && formik.errors.providerCategory && (
                    <FormHelperText>{formik.errors.providerCategory}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} md={4}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    views={['year', 'month', 'day']}
                    label='Valid from'
                    value={validFromDate}
                    onChange={handleValidFromDateChange}
                    renderInput={params => (
                      <TextField {...params} className={classes.formControl} variant='outlined' />
                    )}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12} md={4}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    views={['year', 'month', 'day']}
                    label='Valid to'
                    value={validToDate}
                    onChange={handleValidToDateChange}
                    renderInput={params => (
                      <TextField {...params} className={classes.formControl} variant='outlined' />
                    )}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControl className={classes.formControl}>
                  <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                    Client Type
                  </InputLabel>
                  <Select
                    label='Client Type'
                    labelId='demo-simple-select-label'
                    name='clientType'
                    id='demo-simple-select'
                    value={formik.values.clientType}
                    onChange={formik.handleChange}
                  >
                    {clientTypes.map((ele: any) => (
                      <MenuItem key={ele.code} value={ele.code}>
                        {ele.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {formik.values.clientType === 'GROUP' && (
                <Grid item xs={12} md={4}>
                  <FormControl className={classes.formControl}>
                    <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                      Group Type*
                    </InputLabel>
                    <Select
                      label='Group Type'
                      labelId='demo-simple-select-label'
                      name='groupTypeCd'
                      id='demo-simple-select'
                      value={formik.values.groupTypeCd}
                      onChange={formik.handleChange}
                    >
                      {groupTypes.map((ele: any) => (
                        <MenuItem key={ele.code} value={ele.code}>
                          {ele.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}

              <Grid item xs={12} md={4}>
                <FormControl className={classes.formControl}>
                  <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                    Plan
                  </InputLabel>
                  <Select
                    label='Plan'
                    labelId='demo-simple-select-label'
                    name='plan'
                    id='demo-simple-select'
                    value={formik.values.plan}
                    onChange={handlePlanSelect}
                    error={formik.touched.plan && Boolean(formik.errors.plan)}
                  >
                    {planList.map((ele: any) => (
                      <MenuItem key={ele.code} value={ele}>
                        {ele.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {formik.values.plan && (
                <Grid item xs={12} md={4}>
                  <FormControl className={classes.formControl}>
                    <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                      Plan Category
                    </InputLabel>
                    <Select
                      label='Plan Category'
                      labelId='demo-simple-select-label'
                      name='planCategory'
                      id='demo-simple-select'
                      value={formik.values.planCategory}
                      onChange={formik.handleChange}
                    >
                      {planCategoryList.map((ele: any) => (
                        <MenuItem key={ele.id} value={ele.id}>
                          {ele.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}
            </Grid>

            <Grid container spacing={3} className={classes.formGrid}>
              <Grid item xs={12} md={4} style={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                  id='standard-basic'
                  className={classes.formControl}
                  name='selectedDocName'
                  value={selectedFile?.name}
                  label='Document name'
                  disabled
                />
              </Grid>

              <Grid item xs={12} md={4} style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  className={classes.fileInput}
                  id='contained-button-file'
                  name='document'
                  type='file'
                  accept='.xlsx, .xls'
                  onChange={handleUpload}
                />
                <label htmlFor='contained-button-file' className={classes.fileInputLabel}>
                  <Button
                    variant='contained'
                    component='span'
                    className={classes.uploadButton}
                    style={{ backgroundColor: '#d90d51' }}
                    startIcon={<UploadFileIcon />}
                  >
                    Upload File
                  </Button>
                  {!selectedFile?.name && (
                    <FormHelperText>Select .xlsx /.xls file only</FormHelperText>
                  )}
                </label>
              </Grid>

              <Grid item xs={12} md={4} style={{ display: 'flex', alignItems: 'center' }}>
                <Button
                  variant='contained'
                  className={classes.downloadButton}
                  onClick={handleExcelDownload}
                  style={{ backgroundColor: '#d90d51' }}
                  startIcon={<DownloadIcon />}
                >
                  Download Sample Excel
                </Button>
              </Grid>
            </Grid>

            <Grid container className={classes.actionButtons}>
              <Button variant='contained' color='primary' type='submit'>
                Save and Next
              </Button>
              <Button variant='outlined' onClick={handleClose}>
                Cancel
              </Button>
            </Grid>
          </form>
        </Paper>
      </div>
    </div>
  )
}

export default NegotiationFormComponent
