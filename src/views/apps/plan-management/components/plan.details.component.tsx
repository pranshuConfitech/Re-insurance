import * as React from 'react'

import { useEffect } from 'react'

import { useParams, useRouter, useSearchParams } from 'next/navigation'

import Box from '@mui/material/Box'
import { Button } from 'primereact/button'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Select from '@mui/material/Select'
import { makeStyles } from '@mui/styles'
import TextField from '@mui/material/TextField'

/* import Autocomplete from "@material-ui/lab/Autocomplete"; */
import { useFormik } from 'formik'

import * as yup from 'yup'

import type { Observable } from 'rxjs'

import { PlanService } from '@/services/remote-api/api/plan-services'
import { ProductService } from '@/services/remote-api/api/product-services'
import { ClientTypeService, CurrencyService, GroupTypeService } from '@/services/remote-api/api/master-services'
import { defaultPageRequest } from '@/services/remote-api/models/page.request'

import Asterisk from '../../shared-component/components/red-asterisk'
import { FettleAutocomplete } from '../../shared-component/components/fettle.autocomplete'

const planservice = new PlanService()
const productservice = new ProductService()
const currencyservice = new CurrencyService()
const clienttypeservice = new ClientTypeService()
const grouptypeservice = new GroupTypeService()
const reqParam: any = { pageRequest: defaultPageRequest }
const ps$ = productservice.getProducts(reqParam)
const cs$ = currencyservice.getCurrencies()
const ct$ = clienttypeservice.getCleintTypes()
const gt$ = grouptypeservice.getGroupTypes()

const productDataSourceCallback$ = (params = {}, action: any, pageRequest = defaultPageRequest) => {
  let reqParam: any = { ...pageRequest, ...params }

  reqParam.size = 1000
  delete reqParam.page

  if (action?.searchText && action?.searchText.length > 2) {
    reqParam = {
      ...reqParam,
      name: action.searchText
    }
    delete reqParam.active
  }

  return productservice.getProducts(reqParam)
}

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
    minWidth: '90%'
  }
}))

const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
  productId: yup.string().required('Product Name is required')
})

// function useQuery1() {
//   return new URLSearchParams(useLocation().search);
// }

export default function PlanDetailsComponent(props: any) {
  const classes = useStyles()
  const query2 = useSearchParams()
  const router = useRouter()
  const params = useParams()
  const id: any = params.id
  const [productList, setProductList] = React.useState([])
  const [currencyList, setCurrencyList] = React.useState([])
  const [clientTypeList, setClientTypeList]: any = React.useState([])
  const [groupTypeList, setGroupTypeList] = React.useState([])

  const formik = useFormik({
    initialValues: {
      name: '',
      code: '',
      productCode: '',
      productCurrency: '',
      premiumCurrency: '',
      clientType: '',
      groupType: '',
      description: '',
      productId: '',
      productData: {}
    },
    validationSchema: validationSchema,
    onSubmit: values => {
      handleSubmitPlan()
    }
  })

  const useObservable = (observable: Observable<any>, setter: any) => {
    useEffect(() => {
      const subscription = observable.subscribe(result => {
        setter(result.content)
      })

      return () => subscription.unsubscribe()
    }, [observable, setter])
  }

  const useObservable2 = (observable: Observable<any>, setter: any) => {
    useEffect(() => {
      const pageRequest: any = {
        page: 0,
        size: 10000,
        summary: true,
        active: true
      }

      const subscription = productservice.getProducts(pageRequest).subscribe(result => {
        const tableArr: any = []

        if (result.content && result.content.length > 0) {
          result.content.forEach((ele: any) => {
            tableArr.push({
              name: ele.productBasicDetails.name,
              id: ele.id
            })
          })
        }

        setter(tableArr)

        if (id) {
          populateData(id, tableArr)
        }
      })

      return () => subscription.unsubscribe()
    }, [observable, setter])
  }

  useObservable(cs$, setCurrencyList)
  useObservable(ct$, setClientTypeList)
  useObservable(gt$, setGroupTypeList)
  useObservable2(ps$, setProductList)

  React.useEffect(() => {
    if (id) {
      populateData(id)
    }
  }, [id])

  const populateData = (id: string, prodList = []) => {
    planservice.getPlanDetails(id).subscribe((value: any) => {
      let pdata = {
        name: '',
        id: ''
      }

      prodList.forEach((ele: any) => {
        if (ele.id === value.productId) {
          pdata = ele
        }
      })
      formik.setValues({
        name: value.name,
        code: value.code,
        productCode: value.productCode,
        productCurrency: value.productCurrency,
        premiumCurrency: value.premiumCurrency,
        clientType: value.clientType,
        groupType: value.groupType,
        description: value.description,
        productId: value.productId,
        productData: pdata
      })

      // if(value.clientType === 'GROUP'){
      //     formik.setFieldValue('groupType',value.groupType)
      // }
    })
  }

  const handleSubmitPlan = () => {
    const payload: any = {
      name: formik.values.name,
      productCode: formik.values.productCode,
      productCurrency: formik.values.productCurrency,
      premiumCurrency: formik.values.premiumCurrency,
      clientType: formik.values.clientType,
      description: formik.values.description,
      productId: formik.values.productId
    }

    if (formik.values.clientType === 'GROUP') {
      payload['groupType'] = formik.values.groupType
    }

    if (query2.get('mode') === 'create') {
      planservice.savePlan(payload).subscribe(res => {
        handleClose('close')
      })
    }

    if (query2.get('mode') === 'edit') {
      payload['code'] = formik.values.code
      planservice.editPlan(payload, id).subscribe(res => {
        handleClose('close')
      })
    }
  }

  const handleClose = (event: any) => {
    router.push(`/plans?mode=viewList`)

    // window.location.reload();
  }

  const handlePChange = (e: any, value: { id: any }) => {
    if (!value) {
      formik.setFieldValue('productData', '')
      formik.setFieldValue('productId', '')
      formik.setFieldValue('productCode', '')
      formik.setFieldValue('productCurrency', '')
      formik.setFieldValue('premiumCurrency', '')
      formik.setFieldValue('clientType', '')
      formik.setFieldValue('groupType', '')
    }

    if (value) {
      formik.setFieldValue('productData', value)
      formik.setFieldValue('productId', value.id)
      populateProductValues(value.id)
    }
  }

  const populateProductValues = (productid: string) => {
    productservice.getProductDetails(productid).subscribe((value: any) => {
      if (value && value.productBasicDetails) {
        formik.setFieldValue('productCode', value.code)
        formik.setFieldValue('productCurrency', value.productBasicDetails.productCurrencyCd)
        formik.setFieldValue('premiumCurrency', value.productBasicDetails.premiumCurrencyCd)
        formik.setFieldValue('clientType', value.productBasicDetails.clientTypeId)

        const clientType: any = clientTypeList.find((ct: any) => ct.id === value.productBasicDetails.clientTypeId)?.name

        if (clientType?.toLowerCase() === 'group') {
          formik.setFieldValue('groupType', value.groupTypeId.groupTypeId)
        }
      }
    })
  }

  return (
    <Paper elevation={0}>
      <Box p={3} my={2}>
        <form onSubmit={formik.handleSubmit} noValidate>
          <Grid container spacing={3} style={{ marginBottom: '20px' }}>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl className={classes.formControl}>
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
                      Name <Asterisk />
                    </span>
                  }
                />
              </FormControl>
            </Grid>
            {/* <Grid item xs={12} sm={6} md={4}>
                            <Autocomplete
                                id="combo-box-demo"
                                options={productList}
                                getOptionLabel={(option) => option.name}
                                value={formik.values.productData}
                                style={{ width: "50%" }}
                                renderInput={(params) => (
                                    <TextField {...params} label="Product Name"
                                        error={formik.touched.productId && Boolean(formik.errors.productId)}
                                        helperText={formik.touched.productId && formik.errors.productId}
                                        required />
                                )}
                                name="productId"
                                onChange={handlePChange}
                            />
                        </Grid> */}
            <Grid item xs={12} sm={6} md={4}>
              <FormControl className={classes.formControl}>
                <FettleAutocomplete
                  id='product'
                  name='product'
                  label={
                    <span>
                      Product Name <Asterisk />
                    </span>
                  }
                  displayKey='productBasicDetails.name'
                  $datasource={productDataSourceCallback$}
                  value={formik.values.productData}
                  changeDetect={true}
                  onChange={handlePChange}
                  error={formik.touched.productId && Boolean(formik.errors.productId)}
                  helperText={formik.touched.productId && formik.errors.productId}

                // required
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              {query2.get('mode') === 'edit' ? (
                <FormControl className={classes.formControl}>
                  <TextField
                    id='standard-basic'
                    name='code'
                    value={formik.values.code}
                    label='Plan Code'

                  // readonly={true}
                  />
                </FormControl>
              ) : null}
            </Grid>
          </Grid>
          <Grid container spacing={3} style={{ marginBottom: '20px' }}>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl className={classes.formControl} disabled>
                <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                  Client Type
                </InputLabel>
                <Select
                  labelId='demo-simple-select-label'
                  label='Client Type'
                  name='clientType'
                  id='demo-simple-select'
                  readOnly={true}
                  value={formik.values.clientType}
                  onChange={formik.handleChange}
                >
                  {clientTypeList.map((ele: any) => {
                    return (
                      <MenuItem key={ele.id} value={ele.id}>
                        {ele.name}
                      </MenuItem>
                    )
                  })}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl className={classes.formControl} disabled>
                <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                  Product Currency
                </InputLabel>
                <Select
                  labelId='demo-simple-select-label'
                  label='Product Currency'
                  name='productCurrency'
                  id='demo-simple-select'
                  readOnly={true}
                  value={formik.values.productCurrency}
                  onChange={formik.handleChange}
                >
                  {currencyList.map((ele: any) => {
                    return (
                      <MenuItem key={ele.code} value={ele.code}>
                        {ele.name}
                      </MenuItem>
                    )
                  })}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl className={classes.formControl} disabled>
                <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                  Premium Currency
                </InputLabel>
                <Select
                  labelId='demo-simple-select-label'
                  name='premiumCurrency'
                  label='Premium Currency'
                  id='demo-simple-select'
                  readOnly={true}
                  value={formik.values.premiumCurrency}
                  onChange={formik.handleChange}
                >
                  {currencyList.map((ele: any) => {
                    return (
                      <MenuItem key={ele.code} value={ele.code}>
                        {ele.name}
                      </MenuItem>
                    )
                  })}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid container spacing={3} style={{ marginBottom: '20px' }} alignItems='flex-start'>
            {formik.values.clientType === 'GROUP' ? (
              <Grid item xs={12} sm={6} md={4}>
                <FormControl className={classes.formControl} disabled>
                  <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                    Group Type
                  </InputLabel>
                  <Select
                    labelId='demo-simple-select-label'
                    name='groupType'
                    label=' Group Type'
                    id='demo-simple-select'
                    readOnly={true}
                    value={formik.values.groupType}
                    onChange={formik.handleChange}
                  >
                    {groupTypeList.map((ele: any) => {
                      return (
                        <MenuItem key={ele.code} value={ele.id}>
                          {ele.name}
                        </MenuItem>
                      )
                    })}
                  </Select>
                </FormControl>
              </Grid>
            ) : null}

            <Grid item xs={12} sm={6} md={4}>
              <FormControl className={classes.formControl}>
                <TextField
                  id='standard-basic'
                  name='productCode'
                  value={formik.values.productCode}
                  label='Product Code'
                  disabled
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl className={classes.formControl}>
                <TextField
                  id='plan-description'
                  multiline
                  maxRows={10}
                  name='description'
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  label='Description'
                />
              </FormControl>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button color='secondary' style={{ marginRight: '5px' }} type='submit'>
                Save
              </Button>
              <Button color='primary' onClick={handleClose} className='p-button-text'>
                Cancel
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Paper>
  )
}
