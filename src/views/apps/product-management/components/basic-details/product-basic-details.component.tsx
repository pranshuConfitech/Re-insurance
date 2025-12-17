import React, { useEffect } from 'react'

import { Button } from 'primereact/button'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Snackbar from '@mui/material/Snackbar'
// import TextField from '@mui/material/TextField'
import { makeStyles } from '@mui/styles'
import Alert from '@mui/lab/Alert'
import { Autocomplete, TextField } from '@mui/material'

// import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

import { Paper } from '@mui/material'

import {
  ClientTypeService,
  CurrencyService,
  GroupTypeService,
  ProductMarketService,
  ProductTypeService
} from '@/services/remote-api/api/master-services'
import { ProductService } from '@/services/remote-api/api/product-services'

const useStyles = makeStyles((theme: any) => ({
  root: {
    flexGrow: 1,
    minHeight: 100,
    padding: 30
  },
  paper: {
    padding: theme?.spacing ? theme.spacing(2) : '8px',
    textAlign: 'center',
    color: theme?.palette?.text?.secondary
  },
  formControl: {
    margin: theme?.spacing ? theme.spacing(1) : '8px',
    minWidth: 182,
    width: '90%'
  },
  header: {
    paddingTop: 10,
    paddingBottom: 10,
    color: 'primary'
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    fontWeight: 500
  },
  gridItem: {
    marginBottom: theme?.spacing ? theme.spacing(2) : '8px'
  },
  selectEmpty: {},
  datePickerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%'
  },
  lastRowContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    marginTop: '16px'
  },
  formControlWrapper: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%'
  }
}))

const producttypeservice = new ProductTypeService()
const currencyservice = new CurrencyService()
const prodmarketservice = new ProductMarketService()
const grouptypeservice = new GroupTypeService()
const clienttypeservice = new ClientTypeService()
const productservice = new ProductService()

const cs$ = currencyservice.getCurrencies()
const pt$ = producttypeservice.getProductTypes()
const gt$ = grouptypeservice.getGroupTypes()
const ct$ = clienttypeservice.getCleintTypes()
const pm$ = prodmarketservice.getProductMarket()

export default function ProductBasicDetailsComponent(props: any) {
  const classes = useStyles()

  const today = new Date()
  const tommorow = new Date()

  const [currencyList, setCurrencyList] = React.useState([])
  const [productTypes, setProductTypes]: any = React.useState([])
  const [productMarkets, setProductMarkets]: any = React.useState([])
  const [clientTypes, setClientTypes]: any = React.useState([])
  const [groupTypes, setGroupMarkets]: any = React.useState([])

  const [state, setState] = React.useState({
    productBasicDetailsForm: {
      productTypeId: 'PT585526',
      productTypeName: productTypes?.find((p: any) => p.code === 'PT585526')?.name,
      name: '',
      productMarketId: 'PM243607',
      productMarketName: productMarkets?.find((p: any) => p.code === 'PM243607')?.name,
      description: '',
      clientTypeId: '',
      groupTypeId: '',
      productCurrencyCd: '',
      validFrom: today,
      validUpTo: new Date(tommorow.setDate(today.getDate() + 365)),
      premiumCurrencyCd: ''
    }
  })

  const [showMessage, setShowMessage] = React.useState(false)

  const useObservable = (observable: any, setter: any) => {
    useEffect(() => {
      const subscription = observable.subscribe((result: any) => {
        setter(result.content)
      })

      return () => subscription.unsubscribe()
    }, [observable, setter])
  }

  useObservable(cs$, setCurrencyList)
  useObservable(pt$, setProductTypes)
  useObservable(pm$, setProductMarkets)
  useObservable(gt$, setGroupMarkets)
  useObservable(ct$, setClientTypes)

  useEffect(() => {
    if ('productBasicDetails' in props.productDetails) {
      setState({
        productBasicDetailsForm: {
          ...props.productDetails.productBasicDetails
        }
      })
    }

    // setFieldNamefromIds();
  }, [props.productDetails])

  const setFieldNamefromIds = () => {
    const prodDetails = props.productDetails?.productBasicDetails

    if (!prodDetails?.productTypeName && prodDetails?.productTypeId) {
      const formObj = {
        ...prodDetails,
        productTypeName: productTypes.find((p: any) => p.code === prodDetails.productTypeId)?.name || '',
        productMarketName: productMarkets.find((p: any) => p.code === prodDetails.productMarketId)?.name || '',
        clientTypeName: clientTypes.find((p: any) => p.id === prodDetails.clientTypeId)?.name || '',
        groupTypeName:
          (prodDetails.groupTypeId && groupTypes.find((p: any) => p.id === prodDetails.groupTypeId)?.name) || ''
      }

      setState({
        productBasicDetailsForm: formObj
      })
      props.updateBasiDetails({
        productBasicDetailsForm: formObj
      })
    }
  }

  const handleChange = (event: any) => {
    const { name, value } = event.target

    const formObj: any = {
      ...state.productBasicDetailsForm,
      [name]: value,
      ...(name === 'productTypeId' &&
        value && { productTypeName: productTypes?.find((p: any) => p.code === value).name }),
      ...(name === 'productMarketId' &&
        value && { productMarketName: productMarkets?.find((p: any) => p.code === value).name }),
      ...(name === 'clientTypeId' && value && { clientTypeName: clientTypes?.find((p: any) => p.id === value).name }),
      ...(name === 'groupTypeId' && value && { groupTypeName: groupTypes?.find((p: any) => p.id === value).name })
    }

    setState({
      productBasicDetailsForm: formObj
    })

    props.updateBasiDetails({
      productBasicDetailsForm: formObj
    })
  }

  const handleValidFromChange = (date: any) => {
    const formObj = {
      ...state.productBasicDetailsForm,
      validFrom: date
    }

    setState({
      productBasicDetailsForm: formObj
    })
    props.updateBasiDetails({
      productBasicDetailsForm: formObj
    })
  }

  const handleValidToChange = (date: any) => {
    const formObj = {
      ...state.productBasicDetailsForm,
      validUpTo: date
    }

    setState({
      productBasicDetailsForm: formObj
    })
    props.updateBasiDetails({
      productBasicDetailsForm: formObj
    })
  }

  const handleSubmit = (e: any) => {
    if (state.productBasicDetailsForm.validFrom > state.productBasicDetailsForm.validUpTo) {
      setShowMessage(true)

      return
    }

    const payload: any = {
      productBasicDetails: {
        ...state.productBasicDetailsForm,
        validFrom: new Date(state.productBasicDetailsForm.validFrom).getTime(),
        validUpTo: new Date(state.productBasicDetailsForm.validUpTo).getTime()
      }
    }

    const productId = localStorage.getItem('productId')

    if (productId) {
      productservice.editProduct(payload.productBasicDetails, productId, '1').subscribe(res => {
        if (res.status === 200) {
          props.handleNextStep()
        }
      })
    } else {
      productservice.saveProductBasicDetails(payload.productBasicDetails).subscribe((res: any) => {
        if (res.status === 201) {
          localStorage.setItem('productId', res.data.id)
          props.handleNextStep()
        }
      })
    }
  }

  const handleSnackClose = () => {
    setShowMessage(false)
  }

  return (
    <Paper elevation={0} style={{ padding: '16px' }}>
      <Grid container alignItems='center'>
        <Snackbar open={showMessage} autoHideDuration={6000} onClose={handleSnackClose}>
          <Alert onClose={handleSnackClose} variant='filled' severity='error'>
            Valid upto should be greater than valid from
          </Alert>
        </Snackbar>

        <Grid item container>
          <Grid item xs={12}>
            <Grid item xs={12} sm={6} md={4} className={classes.header} color='inherit'>
              <span>Product Basic Details</span>
            </Grid>
          </Grid>
        </Grid>

        <Grid item container alignItems='center' className={classes.gridItem}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl className={classes.formControl} fullWidth>
              <Autocomplete
                options={productTypes}
                getOptionLabel={(option: any) => option.name}
                isOptionEqualToValue={(option: any, value: any) => option.code === value.code}
                value={productTypes.find((p: any) => p.code === state.productBasicDetailsForm.productTypeId) || null}
                onChange={(event, newValue) => {
                  handleChange({
                    target: {
                      name: 'productTypeId',
                      value: newValue ? newValue.code : ''
                    }
                  })
                }}
                renderInput={params => (
                  <TextField
                    {...params}
                    label='Product Type'
                    placeholder='Select Product Type'
                    variant='outlined'
                    fullWidth
                  />
                )}
                className={classes.formControl}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl className={classes.formControl}>
              <TextField
                id='product-name'
                name='name'
                value={state.productBasicDetailsForm.name}
                onChange={handleChange}
                label='Name'
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl className={classes.formControl} fullWidth>
              <Autocomplete
                options={productMarkets}
                getOptionLabel={(option: any) => option.name}
                isOptionEqualToValue={(option: any, value: any) => option.code === value.code}
                value={productMarkets.find((p: any) => p.code === state.productBasicDetailsForm.productMarketId) || null}
                onChange={(event, newValue) => {
                  handleChange({
                    target: {
                      name: 'productMarketId',
                      value: newValue ? newValue.code : ''
                    }
                  })
                }}
                renderInput={params => (
                  <TextField
                    {...params}
                    label='Product Market'
                    placeholder='Select Product Market'
                    variant='outlined'
                    fullWidth
                  />
                )}
                className={classes.formControl}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl className={classes.formControl}>
              <TextField
                id='product-desc'
                label='Description'
                name='description'
                multiline
                maxRows={10}
                rows={1}
                value={state.productBasicDetailsForm.description}
                onChange={handleChange}
              />
            </FormControl>
          </Grid>
        </Grid>

        <Grid item container alignItems='center' className={classes.gridItem}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl className={classes.formControl} fullWidth>
              <Autocomplete
                options={clientTypes}
                getOptionLabel={(option: any) => option.name}
                isOptionEqualToValue={(option: any, value: any) => option.id === value.id}
                value={clientTypes.find((p: any) => p.id === state.productBasicDetailsForm.clientTypeId) || null}
                onChange={(event, newValue) => {
                  handleChange({
                    target: {
                      name: 'clientTypeId',
                      value: newValue ? newValue.id : ''
                    }
                  })
                }}
                renderInput={params => (
                  <TextField
                    {...params}
                    label='Client Type'
                    placeholder='Select Client Type'
                    variant='outlined'
                    fullWidth
                  />
                )}
                className={classes.formControl}
              />
            </FormControl>
          </Grid>
          {state.productBasicDetailsForm.clientTypeId === 'GROUP' && (
            <Grid item xs={12} sm={6} md={3}>
              <FormControl className={classes.formControl} fullWidth>
                <Autocomplete
                  options={groupTypes}
                  getOptionLabel={(option: any) => option.name}
                  isOptionEqualToValue={(option: any, value: any) => option.id === value.id}
                  value={groupTypes.find((p: any) => p.id === state.productBasicDetailsForm.groupTypeId) || null}
                  onChange={(event, newValue) => {
                    handleChange({
                      target: {
                        name: 'groupTypeId',
                        value: newValue ? newValue.id : ''
                      }
                    })
                  }}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label='Group Type'
                      placeholder='Select Group Type'
                      variant='outlined'
                      fullWidth
                    />
                  )}
                  className={classes.formControl}
                />
              </FormControl>
            </Grid>
          )}
        </Grid>

        <Grid item container alignItems='center' className={classes.gridItem}>
          <Grid item xs={12} sm={6} md={3} className={classes.lastRowContainer}>
            <div className={classes.formControlWrapper}>
              <FormControl className={classes.formControl} fullWidth>
                <Autocomplete
                  options={currencyList}
                  getOptionLabel={(option: any) => option.name}
                  isOptionEqualToValue={(option: any, value: any) => option.code === value.code}
                  value={currencyList.find((p: any) => p.code === state.productBasicDetailsForm.productCurrencyCd) || null}
                  onChange={(event, newValue) => {
                    handleChange({
                      target: {
                        name: 'productCurrencyCd',
                        value: newValue ? newValue.code : ''
                      }
                    })
                  }}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label='Product Currency'
                      placeholder='Select Product Currency'
                      variant='outlined'
                      fullWidth
                    />
                  )}
                  className={classes.formControl}
                />
              </FormControl>
            </div>
          </Grid>

          <Grid item xs={12} sm={6} md={3} className={classes.datePickerContainer}>
            <div className={classes.formControlWrapper}>
              <FormControl className={classes.formControl} fullWidth>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    views={['year', 'month', 'day']}
                    label='Valid From'
                    value={state.productBasicDetailsForm.validFrom}
                    onChange={handleValidFromChange}
                    renderInput={params => (
                      <TextField 
                        {...params} 
                        margin='normal' 
                        style={{ marginBottom: '0px' }} 
                        variant='outlined'
                        fullWidth
                      />
                    )}
                  />
                </LocalizationProvider>
              </FormControl>
            </div>
          </Grid>

          <Grid item xs={12} sm={6} md={3} className={classes.datePickerContainer}>
            <div className={classes.formControlWrapper}>
              <FormControl className={classes.formControl} fullWidth>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    views={['year', 'month', 'day']}
                    label='Valid Upto'
                    value={state.productBasicDetailsForm.validUpTo}
                    onChange={handleValidToChange}
                    renderInput={params => (
                      <TextField 
                        {...params} 
                        margin='normal' 
                        style={{ marginBottom: '0px' }} 
                        variant='outlined'
                        fullWidth
                      />
                    )}
                  />
                </LocalizationProvider>
              </FormControl>
            </div>
          </Grid>

          <Grid item xs={12} sm={6} md={3} className={classes.lastRowContainer}>
            <div className={classes.formControlWrapper}>
              <FormControl className={classes.formControl} fullWidth>
                <Autocomplete
                  options={currencyList}
                  getOptionLabel={(option: any) => option.name}
                  isOptionEqualToValue={(option: any, value: any) => option.code === value.code}
                  value={currencyList.find((p: any) => p.code === state.productBasicDetailsForm.premiumCurrencyCd) || null}
                  onChange={(event, newValue) => {
                    handleChange({
                      target: {
                        name: 'premiumCurrencyCd',
                        value: newValue ? newValue.code : ''
                      }
                    })
                  }}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label='Premium Currency'
                      placeholder='Select Premium Currency'
                      variant='outlined'
                      fullWidth
                    />
                  )}
                  className={classes.formControl}
                />
              </FormControl>
            </div>
          </Grid>
        </Grid>

        <Grid item container alignItems='center' className={classes.gridItem}>
          <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end', padding: '8px' }}>
            {!localStorage.getItem('productId') && <Button onClick={handleSubmit}>Save and Next</Button>}
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  )
}
