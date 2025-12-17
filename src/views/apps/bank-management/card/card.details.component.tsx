// import * as React from "react";
// import * as yup from "yup";
'use client'
import * as React from 'react'

import { useEffect } from 'react'

import { useParams, useRouter, useSearchParams } from 'next/navigation'

import Box from '@mui/material/Box'
import { Button } from 'primereact/button'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Select from '@mui/material/Select'
import { makeStyles } from '@mui/styles'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/lab/Autocomplete'

// import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
// import 'date-fns';
import { useFormik } from 'formik'

import * as yup from 'yup'

import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

import { CardService } from '@/services/remote-api/api/banks-services'
import { CardTypeService, FeesTypeService } from '@/services/remote-api/api/master-services'
import { PlanService } from '@/services/remote-api/api/plan-services'
import { ProductService } from '@/services/remote-api/api/product-services'
import { defaultPageRequest } from '@/services/remote-api/models/page.request'
import type { Card } from '@/services/remote-api/models/card'
import Asterisk from '../../shared-component/components/red-asterisk'
import { Toast } from 'primereact/toast'

const cardservice = new CardService()
const feestype = new FeesTypeService()
const cardtype = new CardTypeService()
const productservice = new ProductService()
const planservice = new PlanService()
const reqParam: any = { pageRequest: defaultPageRequest }
const ct$ = cardtype.getCardTypes()
const ft$ = feestype.getFeesTypes()
const ps$ = planservice.getPlans()
const pdt$ = productservice.getProducts(reqParam)

const validationSchema = yup.object({
  cardType: yup.string().required('Card Type is required'),
  feesType: yup.string().required('Fees Type is required'),
  cardRate: yup.string().required('Card Rate is required'),
  productData: yup.object().shape({
    name: yup.string().required('Product is required')
  }),
  planData: yup.object().shape({
    name: yup.string().required('Plan is required')
  })
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

export default function CardDetailsComponent(props: any) {
  const query2 = useSearchParams()
  const params = useParams()
  const id: any = params.id
  const router = useRouter()
  const classes = useStyles()
  const [cardTypes, setCardTypes] = React.useState([])
  const [feesTypes, setFeesTypes] = React.useState([])
  const [productList, setProductList] = React.useState([])
  const [planList, setPlanList] = React.useState([])
  const [cardCode, setCardCode] = React.useState('')
  const [selectedDate, setSelectedDate] = React.useState(new Date())
  const toast = React.useRef<any>(null)

  const handleValidFromDate = (date: any) => {
    setSelectedDate(date)
    const timestamp = new Date(date).getTime()

    formik.setFieldValue('validFrom', timestamp)
  }

  const formik = useFormik({
    initialValues: {
      code: '',
      cardType: '',
      feesType: '',
      currency: '',
      cardRate: '',
      withPhoto: false,
      validFrom: new Date().getTime(),
      product: '',
      plan: '',
      description: '',
      planData: '',
      productData: ''
    },
    validationSchema: validationSchema,
    onSubmit: values => {
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

  //plan API
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
        }
      })

      return () => subscription.unsubscribe()
    }, [observable, setter])
  }

  //product API
  const useObservable3 = (observable: any, setter: any) => {
    useEffect(() => {
      const subscription = observable.subscribe((result: any) => {
        const tableArr = []

        tableArr.push({
          name: 'All',
          id: 'all'
        })

        if (result.content && result.content.length > 0) {
          result.content.forEach((ele: any) => {
            tableArr.push({
              name: ele.productBasicDetails.name,
              id: ele.id
            })
          })
          setter(tableArr)
        }

        populateData(tableArr)
      })

      return () => subscription.unsubscribe()
    }, [observable, setter])
  }

  useObservable(ct$, setCardTypes)
  useObservable(ft$, setFeesTypes)

  // useObservable2(ps$, setPlanList);
  useObservable3(pdt$, setProductList)

  const handleSwitchChange = (e: any) => {
    const { name, checked } = e.target

    formik.setFieldValue('withPhoto', checked)
  }

  const handleSubmit = () => {
    const payload: any = {
      cardType: formik.values.cardType,
      feesType: formik.values.feesType,
      currency: formik.values.currency,
      cardRate: formik.values.cardRate,
      withPhoto: formik.values.withPhoto,
      validFrom: new Date(selectedDate).getTime(),
      product: formik.values.product,
      plan: formik.values.plan,
      description: formik.values.description,
      code: cardCode
    }

    if (query2.get('mode') === 'create') {
      cardservice.saveCard(payload).subscribe({
        next: (res: any) => {
          toast.current?.show({
            severity: 'success',
            summary: 'Success',
            detail: 'Card created successfully',
            life: 2000
          })
          setTimeout(() => router.push(`/bank-management/cards?mode=viewList`), 1000)
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
      cardservice.editCard(payload, id).subscribe({
        next: (res: any) => {
          toast.current?.show({
            severity: 'success',
            summary: 'Success',
            detail: 'Card updated successfully',
            life: 2000
          })
          setTimeout(() => router.push(`/bank-management/cards?mode=viewList`), 1000)
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

  const populateData = (prodlist: any) => {
    if (id) {
      cardservice.getCardDetails(id).subscribe((values: Card) => {
        setCardCode(values.code)
        formik.setValues({
          ...formik.initialValues,
          cardType: values.cardType,
          feesType: values.feesType,
          currency: values.currency,
          cardRate: values.cardRate,
          withPhoto: values.withPhoto,
          validFrom: values.validFrom,
          product: values.product,
          plan: values.plan,
          description: values.description
        })

        setSelectedDate(new Date(values.validFrom))

        prodlist.forEach((p: any) => {
          if (p.id === values.product && values.product !== '') {
            formik.setFieldValue('productData', p)
            formik.setFieldValue('product', values.product)
            planservice.getPlanFromProduct(values.product).subscribe((pl: any) => {
              if (pl.length > 0) {
                // pl.push({
                //   name: 'All',
                //   id: '',
                // });
                setPlanList(pl)
                pl.forEach((plandata: any) => {
                  if (plandata.id === values.plan) {
                    formik.setFieldValue('planData', plandata)
                    formik.setFieldValue('plan', values.plan)
                  }
                })
              }
            })
          }

          if (values.product === '') {
            // formik.setFieldValue('productData', {
            //   name: 'All',
            //   id: '',
            // });
            formik.setFieldValue('product', '')

            // formik.setFieldValue('planData', {
            //   name: 'All',
            //   id: '',
            // });
            formik.setFieldValue('plan', '')
          }
        })

        // getPlans(values.product);
      })
    }
  }

  const getPlans = (productId: any) => {
    if (productId === 'all') {
      const pageRequest = {
        page: 0,
        size: 10000,
        summary: true,
        active: true
      }

      planservice.getPlans(pageRequest).subscribe((res: any) => {
        const data: any = [
          {
            name: 'All',
            id: 'all'
          },
          ...res.content
        ]

        if (res.content.length > 0) {
          setPlanList(data)
        }
      })
    } else {
      planservice.getPlanFromProduct(productId).subscribe((res: any) => {
        const data: any = [
          {
            name: 'All',
            id: 'all'
          },
          ...res
        ]

        if (res.length > 0) {
          setPlanList(data)
        }
      })
    }
  }

  const handleClose = () => {
    router.push(`/bank-management/cards?mode=viewList`)

    // window.location.reload();
  }

  const handlePlanChange = (e: any, value: any) => {
    if (value && value.id !== '') {
      formik.setFieldValue('planData', value)
      formik.setFieldValue('plan', value.id)
    }

    if (!value || value.id === '') {
      // formik.setFieldValue('planData', {
      //   name: 'All',
      //   id: '',
      // });
      formik.setFieldValue('plan', '')
    }
  }

  const handleProductChange = (e: any, value: any) => {
    if (value && value.id !== '') {
      formik.setFieldValue('productData', value)
      formik.setFieldValue('product', value.id)
      setPlanList([])
      getPlans(value.id)
    }

    formik.setFieldValue('planData', {
      name: 'All',
      id: ''
    })

    // if (!value || value.id === '') {
    // formik.setFieldValue('productData', {
    //   name: 'All',
    //   id: '',
    // });
    // formik.setFieldValue('product', '');
    // formik.setFieldValue('plan', '');
    // }
  }
  console.log("asdfg", formik.values)
  return (
    <Paper elevation={0}>
      <Toast ref={toast} />
      <Box p={3} my={2}>
        <form onSubmit={formik.handleSubmit} noValidate>
          <Grid container spacing={3} style={{ marginBottom: '20px' }}>
            <Grid item xs={4}>
              <FormControl
                className={classes.formControl}
                // required
                error={formik.touched.cardType && Boolean(formik.errors.cardType)}

              // helperText={formik.touched.cardType && formik.errors.cardType}
              >
                <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                  Card Type <Asterisk />
                </InputLabel>
                <Select
                  labelId='demo-simple-select-label'
                  label='Card Type'
                  name='cardType'
                  id='demo-simple-select'
                  value={formik.values.cardType}
                  onChange={formik.handleChange}
                >
                  {cardTypes.map((ele: any) => {
                    return (
                      <MenuItem key={ele.code} value={ele.code}>
                        {ele.name}
                      </MenuItem>
                    )
                  })}
                  {/* <MenuItem value="Individual">Individual</MenuItem>
                                    <MenuItem value="Organization">Organization</MenuItem> */}
                </Select>
                {formik.touched.cardType && Boolean(formik.errors.cardType) && (
                  <FormHelperText>{formik.touched.cardType && formik.errors.cardType}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl
                className={classes.formControl}
                // required
                error={formik.touched.feesType && Boolean(formik.errors.feesType)}

              // helperText={formik.touched.feesType && formik.errors.feesType}
              >
                <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                  Fees Type <Asterisk />
                </InputLabel>
                <Select
                  labelId='demo-simple-select-label'
                  label='Fees Type'
                  name='feesType'
                  id='demo-simple-select'
                  value={formik.values.feesType}
                  onChange={formik.handleChange}
                >
                  {feesTypes.map((ele: any) => {
                    return (
                      <MenuItem key={ele.code} value={ele.code}>
                        {ele.name}
                      </MenuItem>
                    )
                  })}
                  {/* <MenuItem value="Individual">Individual</MenuItem>
                                    <MenuItem value="Organization">Organization</MenuItem> */}
                </Select>
                {formik.touched.feesType && Boolean(formik.errors.feesType) && (
                  <FormHelperText>{formik.touched.feesType && formik.errors.feesType}</FormHelperText>
                )}
              </FormControl>
            </Grid>
          </Grid>
          <Grid container spacing={3} style={{ marginBottom: '20px' }}>
            <Grid item xs={4}>
              <TextField
                size='small'
                id='standard-basic'
                name='cardRate'
                value={formik.values.cardRate}
                onChange={formik.handleChange}
                error={formik.touched.cardRate && Boolean(formik.errors.cardRate)}
                helperText={formik.touched.cardRate && formik.errors.cardRate}
                label={
                  <span>
                    Card Rate <Asterisk />
                  </span>
                }

              // required
              />
            </Grid>

            <Grid item xs={4}>
              {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  views={['year', 'month', 'date']}
                  variant="inline"
                  format="dd/MM/yyyy"
                  margin="normal"
                  autoOk
                  id="date-picker-inline"
                  label="Date Of Inauguration"
                  value={selectedDate}
                  onChange={handleValidFromDate}
                  KeyboardButtonProps={{
                    'aria-label': 'change ing date',
                  }}
                />
              </MuiPickersUtilsProvider> */}
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  views={['year', 'month', 'day']}
                  label='Date Of Inauguration'
                  value={selectedDate}
                  onChange={handleValidFromDate}
                  renderInput={params => (
                    <TextField {...params} margin='normal' style={{ marginBottom: '0px' }} variant='outlined' />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formik.values.withPhoto}
                    color='primary'
                    onChange={handleSwitchChange}
                    name='checkedA'
                  />
                }
                label='With Photo'
              />
            </Grid>
          </Grid>
          <Grid container spacing={3} style={{ marginBottom: '20px' }}>
            <Grid item xs={4}>
              <Autocomplete
                id="product-autocomplete"
                options={productList || []} // Ensure options is always an array
                getOptionLabel={(option: any) => option?.name || ''} // Handle missing name property
                // value={
                //   productList.find((item: any) => item.id === formik.values.productData?.id) || null
                // } // Ensure value matches an option in options
                value={formik.values.productData}
                style={{ width: '50%' }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={
                      <span>
                        Product <Asterisk />
                      </span>
                    }
                  // error={formik.touched.productData && Boolean(formik.errors.productData)}
                  // helperText={formik.touched.productData && formik.errors.productData}
                  />
                )}
                onChange={(event, value) => {
                  handleProductChange(event, value); // Update the product selection
                }}
              />
            </Grid>
            <Grid item xs={4}>
              <Autocomplete
                id="plan-autocomplete"
                options={planList || []} // Ensure options is always an array
                getOptionLabel={(option: any) => option?.name || ''} // Handle missing name property
                // value={
                //   planList.find((item: any) => item.id === formik.values.planData?.id) || null
                // } // Ensure value matches an option in options
                value={formik.values.planData}
                style={{ width: '50%' }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={
                      <span>
                        Plan <Asterisk />
                      </span>
                    }
                  // error={formik.touched.planData && Boolean(formik.errors.planData)}
                  // helperText={formik.touched.planData && formik.errors.planData}
                  />
                )}
                onChange={(event, value) => {
                  handlePlanChange(event, value); // Update the plan selection
                }}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                id='standard-multiline-flexible'
                label='Description'
                multiline
                maxRows={4}
                name='description'
                value={formik.values.description}
                onChange={formik.handleChange}
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
