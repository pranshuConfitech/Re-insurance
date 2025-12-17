// import * as React from "react";
// import * as yup from "yup";
'use client'
import * as React from 'react'

import { useEffect } from 'react'

import { useParams, useRouter, useSearchParams } from 'next/navigation'

import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Select from '@mui/material/Select'
import Snackbar from '@mui/material/Snackbar'
import { makeStyles } from '@mui/styles'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
import Alert from '@mui/lab/Alert'
import Autocomplete from '@mui/lab/Autocomplete'

// import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
// import 'date-fns';
import { useFormik } from 'formik'

import * as yup from 'yup'
import { Button } from 'primereact/button'

import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

import { TaxService } from '@/services/remote-api/api/tax-services/tax.services'
import { OrganizationTypeService } from '@/services/remote-api/api/master-services/organization.type.service'
import { Toast } from 'primereact/toast'

const taxservice = new TaxService()
const orgtypeservice = new OrganizationTypeService()
const pt$ = taxservice.getParentTaxes()
const ot$ = orgtypeservice.getOrganizationTypes()

const taxvalueRegExp = /^[+-]?([0-9]+\.?[0-9]*|\.[0-9]+)$/

const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
  type: yup.string().required('Tax Type is required'),
  taxvalue: yup.string().required('Tax Value is required').matches(taxvalueRegExp, 'Tax value is not valid'),
  sortOrder: yup.string().required('Sort order is required'),
  orgTypeCd: yup.string().required('Parent Tax is required'),
  effectiveFrom: yup.string().required('Effective from Date is required')
})

const useStyles = makeStyles(theme => ({
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
    minWidth: 182
  }
}))

// function useQuery1() {
//   return new URLSearchParams(useLocation().search);
// }

export default function TaxDetails(props: any) {
  const sortinOrders = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  const id: any = useParams().id
  const query2 = useSearchParams()
  const router = useRouter()
  const classes = useStyles()

  const [effectiveFromDate, setEffectiveFromDate] = React.useState(new Date())
  const [effectiveToDate, setEffectiveToDate] = React.useState<any>(null)
  const [parentTaxes, setParentTaxes] = React.useState([])
  const [orgTypes, setOrgTypes] = React.useState([])
  const [showMessage, setShowMessage] = React.useState(false)
  const toast = React.useRef<any>(null)

  const handleEffectiveFromDate = (date: any) => {
    setEffectiveFromDate(date)
    const timestamp = new Date(date).getTime()

    formik.setFieldValue('effectiveFrom', timestamp)

    const oneYearLater = new Date(timestamp)

    oneYearLater.setFullYear(oneYearLater.getFullYear() + 1)

    setEffectiveToDate(oneYearLater.getTime())

    // setEffectiveToDate(timestamp)
  }

  useEffect(() => {
    const currentDate = new Date() // Get the current date
    const timestamp = currentDate.getTime()

    formik.setFieldValue('effectiveFrom', timestamp)

    const oneYearLater = new Date(timestamp)

    oneYearLater.setFullYear(oneYearLater.getFullYear() + 1)

    setEffectiveToDate(oneYearLater.getTime())
  }, [])

  const handleEffectiveToDate = (date: any) => {
    console.log(date)
    setEffectiveToDate(date)
    const timestamp = new Date(date).getTime()

    formik.setFieldValue('effectiveUpto', timestamp)
  }

  const formik = useFormik({
    initialValues: {
      name: '',
      type: '',
      taxvalue: '',
      sortOrder: 1,
      isRefundable: false,
      effectiveFrom: new Date().getTime(),
      effectiveUpto: null,
      parentTaxId: '',
      orgTypeCd: '',
      pOrgData: {},
      isRequired: [],
    },
    validationSchema: validationSchema,
    onSubmit: values => {
      if (formik.values.effectiveUpto && formik.values.effectiveFrom > formik.values.effectiveUpto) {
        setShowMessage(true)

        return
      }

      handleSubmit()
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

  useObservable(ot$, setOrgTypes)

  const useObservable2 = (observable: any, setter: any) => {
    useEffect(() => {
      const subscription = observable.subscribe((result: any) => {
        const tableArr: any = []

        if (result.content && result.content.length > 0) {
          result.content.forEach((ele: any) => {
            tableArr.push({
              name: ele.name,
              id: ele.id
            })
          })
          setter(tableArr)

          if (id) {
            populateData(tableArr)
          }
        }
      })

      return () => subscription.unsubscribe()
    }, [observable, setter])
  }

  useObservable2(pt$, setParentTaxes)

  const handleSwitchChange = (e: any) => {
    const { name, checked } = e.target

    formik.setFieldValue('isRefundable', checked)
  }

  const handleSubmit = () => {
    const payload: any = {
      name: formik.values.name,
      type: formik.values.type,
      value: formik.values.taxvalue,
      sortOrder: formik.values.sortOrder,
      isRefundable: formik.values.isRefundable,
      effectiveFrom: new Date(effectiveFromDate).getTime(),
      orgTypeCd: formik.values.orgTypeCd,
      mandatory: formik.values.isRequired
    }

    if (formik.values.orgTypeCd === 'OT117246') {
      payload['parentTaxId'] = formik.values.parentTaxId
    }

    if (effectiveToDate !== '' && effectiveToDate !== null) {
      payload['effectiveUpto'] = new Date(effectiveToDate).getTime()
    }

    if (query2.get('mode') === 'create') {
      taxservice.saveTax(payload).subscribe({
        next: (res: any) => {
          toast.current?.show({
            severity: 'success',
            summary: 'Success',
            detail: 'Tax created successfully',
            life: 2000
          })
          setTimeout(() => router.push(`/taxes?mode=viewList`), 1000)
        },
        error: (err: any) => {
          toast.current?.show({
            severity: 'error',
            summary: 'Error',
            detail: 'Something went wrong',
            life: 2000
          })
        }
      })
    }

    if (query2.get('mode') === 'edit') {
      taxservice.editTax(payload, id).subscribe({
        next: (res: any) => {
          toast.current?.show({
            severity: 'success',
            summary: 'Success',
            detail: 'Tax updated successfully',
            life: 2000
          })
          setTimeout(() => router.push(`/taxes?mode=viewList`), 1000)
        },
        error: (err: any) => {
          toast.current?.show({
            severity: 'error',
            summary: 'Error',
            detail: 'Something went wrong',
            life: 2000
          })
        }
      })
    }
  }

  // React.useEffect(() => {
  //     if (id) {
  //         populateData(id);
  //     }
  // }, [id]);

  const populateData = (tableArr: any) => {
    if (id) {
      taxservice.getTaxDetails(id).subscribe((values: any) => {
        let pOrg = {
          name: 'All',
          id: ''
        }

        tableArr.forEach((ele: any) => {
          if (ele.id === values.parentTaxId) {
            pOrg = ele
          }
        })

        formik.setValues({
          name: values.name,
          type: values.type,
          taxvalue: values.value,
          sortOrder: values.sortOrder,
          isRefundable: values.isRefundable,
          effectiveFrom: values.effectiveFrom,
          effectiveUpto: values.effectiveUpto,
          parentTaxId: values.parentTaxId,
          pOrgData: pOrg,
          orgTypeCd: values.orgTypeCd,
          isRequired: Array.isArray(values.mandatory)
            ? values.mandatory
            : values.mandatory
              ? [values.mandatory]
              : [], //
        })

        setEffectiveFromDate(new Date(values.effectiveFrom))
        console.log(values.effectiveUpto)

        if (values.effectiveUpto) {
          setEffectiveToDate(new Date(values.effectiveUpto))
        }
      })
    }
  }

  const handlePChange = (e: any, value: any) => {
    formik.setFieldValue('pOrgData', value)
    formik.setFieldValue('parentTaxId', value.id)
  }

  const handleClose = () => {
    router.push(`/taxes?mode=viewList`)

    // window.location.reload();
  }

  const handleSnackClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    setShowMessage(false)
  }

  return (
    <Paper elevation={0}>
      <Toast ref={toast} />
      <Snackbar open={showMessage} autoHideDuration={6000} onClose={handleSnackClose}>
        <Alert onClose={handleSnackClose} variant='filled' severity='error'>
          Effective upto should be greater than Effective from
        </Alert>
      </Snackbar>
      <Box p={3} my={2}>
        <form onSubmit={formik.handleSubmit} noValidate>
          <Grid container spacing={3} style={{ marginBottom: '20px' }}>
            <Grid item xs={4}>
              <TextField
                size='small'
                id='standard-basic'
                name='name'
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                label={
                  <span>
                    Name<span style={{ color: 'red' }}>*</span>
                  </span>
                }
                InputLabelProps={{
                  shrink: true
                }}
              />
            </Grid>
            <Grid item xs={4}>
              <FormControl
                className={classes.formControl}
                // required
                error={formik.touched.type && Boolean(formik.errors.type)}
              >
                <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                  <span>
                    Tax Type<span style={{ color: 'red' }}>*</span>
                  </span>
                </InputLabel>
                <Select
                  labelId='demo-simple-select-label'
                  name='type'
                  label='Tax Type'
                  id='demo-simple-select'
                  value={formik.values.type}
                  onChange={formik.handleChange}
                >
                  <MenuItem key='percentage' value='PERCENTAGE'>
                    PERCENTAGE
                  </MenuItem>
                  <MenuItem key='fixed' value='FIXED'>
                    FIXED
                  </MenuItem>
                </Select>
                {formik.touched.type && Boolean(formik.errors.type) && (
                  <FormHelperText>{formik.errors.type}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <TextField
                size='small'
                id='standard-basic'
                name='taxvalue'
                value={formik.values.taxvalue}
                onChange={formik.handleChange}
                error={formik.touched.taxvalue && Boolean(formik.errors.taxvalue)}
                helperText={formik.touched.taxvalue && formik.errors.taxvalue}
                label={
                  <span>
                    Tax Value<span style={{ color: 'red' }}>*</span>
                  </span>
                }
                InputLabelProps={{
                  shrink: true
                }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={3} style={{ marginBottom: '20px' }}>
            <Grid item xs={4}>
              <FormControl
                className={classes.formControl}
                // required
                error={formik.touched.sortOrder && Boolean(formik.errors.sortOrder)}

              // helperText={formik.touched.sortOrder && formik.errors.sortOrder}
              >
                <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                  <span>
                    Sort Order<span style={{ color: 'red' }}>*</span>
                  </span>
                </InputLabel>
                <Select
                  labelId='demo-simple-select-label'
                  name='sortOrder'
                  label='Sort Order'
                  id='demo-simple-select'
                  value={formik.values.sortOrder}
                  onChange={formik.handleChange}
                >
                  {sortinOrders.map((ele: any) => {
                    return (
                      <MenuItem key={ele} value={ele}>
                        {ele}
                      </MenuItem>
                    )
                  })}
                </Select>
                {formik.touched.sortOrder && Boolean(formik.errors.sortOrder) && (
                  <FormHelperText>{formik.touched.sortOrder && formik.errors.sortOrder}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              {query2.get('mode') === 'edit' ? (
                <FormControl
                  className={classes.formControl}
                  //   required
                  error={formik.touched.orgTypeCd && Boolean(formik.errors.orgTypeCd)}

                // helperText={formik.touched.orgTypeCd && formik.errors.orgTypeCd}
                >
                  <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                    <span>
                      Parent Tax<span style={{ color: 'red' }}>*</span>
                    </span>
                  </InputLabel>
                  <Select
                    labelId='demo-simple-select-label'
                    name='orgTypeCd'
                    label='Parent Tax'
                    id='demo-simple-select'
                    readOnly={true}
                    value={formik.values.orgTypeCd}
                    onChange={formik.handleChange}
                  >
                    {orgTypes.map((ele: any) => {
                      return (
                        <MenuItem key={ele.code} value={ele.code}>
                          {ele.name}
                        </MenuItem>
                      )
                    })}
                  </Select>
                  {formik.touched.orgTypeCd && Boolean(formik.errors.orgTypeCd) && (
                    <FormHelperText>{formik.touched.orgTypeCd && formik.errors.orgTypeCd}</FormHelperText>
                  )}
                </FormControl>
              ) : (
                <FormControl
                  className={classes.formControl}
                  //   required
                  error={formik.touched.orgTypeCd && Boolean(formik.errors.orgTypeCd)}

                // helperText={formik.touched.orgTypeCd && formik.errors.orgTypeCd}
                >
                  <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                    <span>
                      Parent Tax<span style={{ color: 'red' }}>*</span>
                    </span>
                  </InputLabel>
                  <Select
                    labelId='demo-simple-select-label'
                    name='orgTypeCd'
                    id='demo-simple-select'
                    label='Parent Tax'
                    value={formik.values.orgTypeCd}
                    onChange={formik.handleChange}
                  >
                    {orgTypes.map((ele: any) => {
                      return (
                        <MenuItem key={ele.code} value={ele.code}>
                          {ele.name}
                        </MenuItem>
                      )
                    })}
                  </Select>
                  {formik.touched.orgTypeCd && Boolean(formik.errors.orgTypeCd) && (
                    <FormHelperText>{formik.touched.orgTypeCd && formik.errors.orgTypeCd}</FormHelperText>
                  )}
                </FormControl>
              )}
            </Grid>
            <Grid item xs={4}>
              {formik.values.orgTypeCd === 'OT117246' && (
                <Grid item xs={4}>
                  <Autocomplete
                    id='combo-box-demo'
                    options={parentTaxes}
                    getOptionLabel={(option: any) => option.name}
                    value={formik.values.pOrgData}
                    // style={{ width: "50%" }}
                    renderInput={params => <TextField {...params} label='' />}
                    onChange={handlePChange}
                  />
                </Grid>
              )}
            </Grid>
          </Grid>

          <Grid item xs={4}>
            <FormControl
              className={classes.formControl}
              // required
              error={formik.touched.type && Boolean(formik.errors.type)}
            >
              <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                <span>
                  Is Required<span style={{ color: 'red' }}>*</span>
                </span>
              </InputLabel>
              <Select
                labelId='demo-simple-select-label'
                name='isRequired'
                label='Is Required'
                id='demo-simple-select'
                value={formik.values.isRequired}
                onChange={(event) => {
                  const { value } = event.target;
                  formik.setFieldValue(
                    'isRequired',
                    typeof value === 'string' ? value.split(',') : value
                  );
                }}
                multiple
              >
                <MenuItem key='quotation' value='QUOTATION'>
                  Quotation
                </MenuItem>
                <MenuItem key='renewal' value='RENEWAL'>
                  Renewal
                </MenuItem>
                <MenuItem key='endorsement' value='ENDORSEMENT'>
                  Endorsement
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid container spacing={3} style={{ marginBottom: '20px' }}>
            <Grid item xs={4}>
              {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  views={['year', 'month', 'date']}
                  variant="inline"
                  format="dd/MM/yyyy"
                  margin="normal"
                  autoOk={true}
                  id="date-picker-inline"
                  label="Effective from"
                  value={effectiveFromDate}
                  onChange={handleEffectiveFromDate}
                  KeyboardButtonProps={{
                    'aria-label': 'change ing date',
                  }}
                />
              </MuiPickersUtilsProvider> */}
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  views={['year', 'month', 'day']}
                  label='Effective from'
                  value={effectiveFromDate}
                  onChange={handleEffectiveFromDate}
                  renderInput={params => <TextField {...params} margin='normal' variant='outlined' />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={4}>
              {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  views={['year', 'month', 'date']}
                  variant="inline"
                  format="dd/MM/yyyy"
                  margin="normal"
                  autoOk={true}
                  id="date-picker-inline"
                  label="Effective upto"
                  value={effectiveToDate}
                  onChange={handleEffectiveToDate}
                  KeyboardButtonProps={{
                    'aria-label': 'change ing date',
                  }}
                />
              </MuiPickersUtilsProvider> */}
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  views={['year', 'month', 'day']}
                  label='Effective upto'
                  value={effectiveToDate}
                  onChange={handleEffectiveToDate}
                  renderInput={params => <TextField {...params} margin='normal' variant='outlined' />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formik.values.isRefundable}
                    color='primary'
                    onChange={handleSwitchChange}
                    name='checkedA'
                  />
                }
                label='Is Refundable'
              />
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button color='primary' style={{ marginRight: '5px' }} type='submit'>
                Save
              </Button>
              <Button onClick={handleClose} className='p-button-text'>
                Cancel
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Paper>
  )
}
