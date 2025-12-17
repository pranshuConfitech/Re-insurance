import React, { useEffect, useRef } from 'react'

import { useParams, useRouter, useSearchParams } from 'next/navigation'

import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  TextField
} from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useFormik } from 'formik'
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto'
import moment from 'moment'

import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

import { ClientService } from '@/services/remote-api/api/client-services/client.services'
import { FundService } from '@/services/remote-api/api/fund-services/fund.services'
import { defaultPageRequest } from '@/services/remote-api/models/page.request'

const useStyles = makeStyles((theme: any) => ({
  root: {
    // width: '100%',
    flexDirection: 'column'

    // marginLeft: '1%',
  },
  inputRoot: {
    '&$disabled': {
      color: 'black'
    }
  },
  disabled: {},
  formControl: {
    minWidth: '90%'
  },
  backButton: {
    marginRight: theme?.spacing ? theme.spacing(1) : '8px'
  },
  instructions: {
    marginTop: theme?.spacing ? theme.spacing(1) : '8px',
    marginBottom: theme?.spacing ? theme.spacing(1) : '8px'
  },
  stepText: {
    '& span': {
      fontSize: '16px'
    }
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

const reqParam: any = { pageRequest: defaultPageRequest }

const feesTypeOption = [
  {
    value: 'Per member per month',
    label: 'Per member per month'
  },
  {
    value: 'per member per year',
    label: 'per member per year'
  },
  {
    value: 'per claim',
    label: 'per claim'
  },
  {
    value: '% of claim amount',
    label: '% of claim amount'
  }
]

const clientService = new ClientService()
const feesService = new FundService()

// function useQuery() {
//     return new URLSearchParams(useLocation().search);
// }

const FeesDetailsComponent = () => {
  const classes = useStyles()
  const history = useRouter()
  const hiddenFileInput: any = useRef(null)
  const [selectedChoice, setSelectedChoice] = React.useState('TPA_FEES')
  const [corporateOptions, setCorporateOptions] = React.useState([])
  const [contractDate, setContractDate] = React.useState('')
  const [validityFromDate, setValidityFromDate] = React.useState('')
  const [validityToDate, setValidityToDate] = React.useState('')
  const params = useParams()
  const id: any = params.id
  const query = useSearchParams()

  useEffect(() => {
    populateData()
    clientService.getClients(reqParam).subscribe(res => {
      const temp: any = []

      const p =
        res &&
        res?.content?.map(ele => {
          if (ele?.clientBasicDetails?.clientTypeCd === 'GROUP') {
            const obj = {
              label: ele?.clientBasicDetails?.displayName,
              value: ele?.id
            }

            temp.push(obj)
          }
        })

      setCorporateOptions(temp)
    })
  }, [])

  const handleChoice = (event: any) => {
    setSelectedChoice(event.target.value)
  }

  const formik = useFormik({
    initialValues: {
      contractNumber: '',
      contractDate: '',
      contractDocument: '',
      feesType: '',
      feesValue: '',
      commission: '',
      validityFrom: '',
      validityTo: '',
      corporate: ''
    },

    // validationSchema: validationSchema,
    onSubmit: values => {
      handleSubmit()
    }
  })

  const populateData = () => {
    feesService.getFeeConfigDetails(id).subscribe((res: any) => {
      setSelectedChoice(res?.feeConfigType)
      setContractDate(moment(res?.contractDate).format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ (Z)'))
      setValidityFromDate(moment(res?.validatityFrom).format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ (Z)'))
      setValidityToDate(moment(res?.validityTo).format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ (Z)'))
      formik.setValues({
        corporate: res?.corporate || '',
        contractNumber: res?.contractNumber || '',
        feesType: res?.feesType || '',
        feesValue: res?.feesValue || '',
        commission: res?.percentageOfCommision || '',
        contractDate: '',
        contractDocument: '',
        validityFrom: '',
        validityTo: ''
      })
    })
  }

  const handleSubmit = () => {
    const payload = {
      corporate: formik.values.corporate,
      contractNumber: formik.values.contractNumber,
      contractDate: new Date(contractDate).getTime(),
      feesType: formik.values.feesType,
      feesValue: formik.values.feesValue,
      percentageOfCommision: formik.values.commission,
      validatityFrom: new Date(validityFromDate).getTime(),
      validityTo: new Date(validityToDate).getTime(),
      feeConfigType: selectedChoice
    }

    if (query.get('mode') === 'create') {
      feesService.saveFeesConfig(payload).subscribe(res => {
        if (res.status === 201) {
          alert('Fees config created!')
          history.push('/fees?mode=viewList')
        } else {
          alert('Something went wrong!')
        }
      })
    } else {
      feesService.editFeeConfig(payload, id).subscribe(res => {
        alert('Fees config updated!')
        history.push('/fees?mode=viewList')
      })
    }
  }

  const handleClick = (event: any) => {
    hiddenFileInput.current.click()
  }

  const handleChange = (event: any) => {
    alert('changed')
    const fileUploaded = event.target.files[0]

    // handleFile(fileUploaded);
  }

  const handleClose = () => {
    history.push('/fees?mode=viewList')
  }

  return (
    <>
      <Paper elevation={0} className={classes.prospectImportOuterContainer}>
        <Grid container spacing={3} style={{ marginBottom: '20px' }}>
          <Grid item xs={6}>
            <FormControl component='fieldset'>
              <RadioGroup
                aria-label='preauthimport'
                name='preauthimport'
                value={selectedChoice}
                onChange={handleChoice}
                row
                className={classes.prospectImportRadioGroup}
              >
                <FormControlLabel value='TPA_FEES' control={<Radio />} label='TPA FEES' />
                <FormControlLabel value='SELF_FUND' control={<Radio />} label='SELF FUND' />
              </RadioGroup>
            </FormControl>
          </Grid>
        </Grid>

        <form onSubmit={formik.handleSubmit} noValidate>
          <Grid container spacing={3} style={{ marginBottom: '20px' }}>
            {selectedChoice === 'SELF_FUND' && (
              <Grid item xs={12}>
                <FormControl className={classes.formControl}>
                  <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                    Corporate
                  </InputLabel>
                  <Select
                    labelId='demo-simple-select-label'
                    label='Corporate'
                    name='corporate'
                    id='demo-simple-select'
                    style={{ width: '200px' }}
                    value={formik.values.corporate}
                    onChange={formik.handleChange}
                  >
                    {corporateOptions?.map((ele: any) => {
                      return (
                        <MenuItem key={ele.value} value={ele.value}>
                          {ele.label}
                        </MenuItem>
                      )
                    })}
                  </Select>
                </FormControl>
              </Grid>
            )}
            <Grid item xs={6}>
              <TextField
                size='small'
                id='standard-basic'
                name='contractNumber'
                value={formik.values.contractNumber}
                onChange={formik.handleChange}
                // error={formik.touched.name && Boolean(formik.errors.name)}
                // helperText={formik.touched.name && formik.errors.name}
                label='Contract Number'
              />
            </Grid>
            <Grid item xs={6}>
              {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardDatePicker
                                    views={['year', 'month', 'date']}
                                    variant="inline"
                                    format="dd/MM/yyyy"
                                    margin="normal"
                                    id="date-picker-inline"
                                    label="Contract Date"
                                    name="contractDate"
                                    value={contractDate}
                                    onChange={(date:any) => setContractDate(date)}
                                    InputProps={{
                                        classes: {
                                            root: classes.inputRoot,
                                            disabled: classes.disabled,
                                        },
                                    }}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change ing date',
                                    }}
                                />
                            </MuiPickersUtilsProvider> */}
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  views={['year', 'month', 'day']}
                  label='Contract Date'
                  value={contractDate}
                  onChange={(date: any) => setContractDate(date)}
                  // disabled
                  InputProps={{
                    classes: {
                      root: classes.inputRoot,
                      disabled: classes.disabled
                    }
                  }}
                  renderInput={params => (
                    <TextField {...params} margin='normal' style={{ margin: 'normal' }} variant='outlined' />
                  )}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={6}>
              <FormControl className={classes.formControl}>
                <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                  Fees Type
                </InputLabel>
                <Select
                  labelId='demo-simple-select-label'
                  name='feesType'
                  label='Fees Type'
                  id='demo-simple-select'
                  style={{ width: '200px' }}
                  value={formik.values.feesType}
                  onChange={formik.handleChange}
                >
                  {feesTypeOption.map(ele => {
                    return (
                      <MenuItem key={ele.value} value={ele.value}>
                        {ele.label}
                      </MenuItem>
                    )
                  })}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                size='small'
                id='standard-basic'
                name='feesValue'
                value={formik.values.feesValue}
                onChange={formik.handleChange}
                // error={formik.touched.name && Boolean(formik.errors.name)}
                // helperText={formik.touched.name && formik.errors.name}
                label='Fees Value'
              />
            </Grid>
            <Grid item xs={6} style={{ marginTop: '3%' }}>
              <TextField
                size='small'
                id='standard-basic'
                name='commission'
                value={formik.values.commission}
                onChange={formik.handleChange}
                // error={formik.touched.name && Boolean(formik.errors.name)}
                // helperText={formik.touched.name && formik.errors.name}
                label='% of Commission'
              />
            </Grid>

            <Grid item xs={6} style={{ marginTop: '3%' }}>
              <input
                type='file'
                onChange={handleChange}
                ref={hiddenFileInput}
                style={{ display: 'none' }} // Make the file input element invisible
              />

              <Button
                variant='contained'
                color='primary'
                component='span'
                onClick={handleClick}
                style={{ marginTop: '10px' }}
              >
                Add Contract Document <AddAPhotoIcon />
              </Button>
            </Grid>
            <Grid item xs={6}>
              {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardDatePicker
                                    views={['year', 'month', 'date']}
                                    variant="inline"
                                    format="dd/MM/yyyy"
                                    margin="normal"
                                    id="date-picker-inline"
                                    label="validityFrom"
                                    name="Validity From"
                                    value={validityFromDate}
                                    onChange={(date:any) => setValidityFromDate(date)}
                                    InputProps={{
                                        classes: {
                                            root: classes.inputRoot,
                                            disabled: classes.disabled,
                                        },
                                    }}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change ing date',
                                    }}
                                />
                            </MuiPickersUtilsProvider> */}
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  views={['year', 'month', 'day']}
                  label='Validity From'
                  value={validityFromDate}
                  onChange={(date: any) => setValidityFromDate(date)}
                  // disabled
                  InputProps={{
                    classes: {
                      root: classes.inputRoot,
                      disabled: classes.disabled
                    }
                  }}
                  renderInput={params => (
                    <TextField {...params} margin='normal' style={{ margin: 'normal' }} variant='outlined' />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={6}>
              {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardDatePicker
                                    views={['year', 'month', 'date']}
                                    variant="inline"
                                    format="dd/MM/yyyy"
                                    margin="normal"
                                    id="date-picker-inline"
                                    label="validityTo"
                                    name="Validity To"
                                    value={validityToDate}
                                    onChange={(date:any) => setValidityToDate(date)}
                                    // disabled
                                    InputProps={{
                                        classes: {
                                            root: classes.inputRoot,
                                            disabled: classes.disabled,
                                        },
                                    }}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change ing date',
                                    }}
                                />
                            </MuiPickersUtilsProvider> */}
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  views={['year', 'month', 'day']}
                  label='Validity To'
                  value={validityToDate}
                  onChange={(date: any) => setValidityToDate(date)}
                  // disabled
                  InputProps={{
                    classes: {
                      root: classes.inputRoot,
                      disabled: classes.disabled
                    }
                  }}
                  renderInput={params => (
                    <TextField {...params} margin='normal' style={{ margin: 'normal' }} variant='outlined' />
                  )}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>

          <Box display={'flex'} justifyContent={'end'}>
            <Button variant='text' color='primary' component='span' onClick={handleClose} style={{ marginTop: '10px' }}>
              Close
            </Button>
            <Button
              variant='contained'
              color='primary'
              component='span'
              onClick={handleSubmit}
              style={{ marginTop: '10px' }}
            >
              Save
            </Button>
          </Box>
        </form>
      </Paper>
    </>
  )
}

export default FeesDetailsComponent
