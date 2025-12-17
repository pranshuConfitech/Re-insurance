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
import { useFormik } from 'formik'

import * as yup from 'yup'

import { AddressService, PrefixTypeService } from '@/services/remote-api/api/master-services'
import { HierarchyService } from '@/services/remote-api/api/hierarchy-services'

const addressservice = new AddressService()
const branchService = new HierarchyService()
const prefixservice = new PrefixTypeService()

const addr$ = addressservice.getAddressConfig()
const prefx$ = prefixservice.getPrefixTypes()

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

// function useQuery1() {
//   return new URLSearchParams(useLocation().search);
// }

const schemaObject = {
  mobileNo: yup.string()['min'](10, 'Must be exactly 10 digit')['max'](10, 'Must be exactly 10 digit').nullable(),

  // .matches(new RegExp('[0-9]{10}'),'Contact number is not valid'),
  alternateMobileNo: yup
    .string()
  ['min'](10, 'Must be exactly 10 digit')
  ['max'](10, 'Must be exactly 10 digit')
    .nullable(),
  emailId: yup.string().email('Enter a valid email').nullable(),
  alternateEmailId: yup.string().email('Enter a valid email').nullable(),
  addressData: yup.object().shape({})

  // alternateMobileNo: yup
  //   .string("Enter your Contact Number")
  //   .test('len', 'Must be exactly 10 digit', val => val.length === 10),
  // .matches(new RegExp('[0-9]{10}'),'Contact number is not valid'),
  // alternateEmailId: yup
  //   .string('Enter your email')
  //   .email('Enter a valid email'),
}

const validationSchema = yup.object(schemaObject)

const initialValues = {
  addressData: {},
  personDetailPrefix: '',
  personDetailFirstName: '',
  personDetailMiddleName: '',
  personDetailLastName: '',
  personDetailPhoneNo: '',
  personDetailMobile: '',
  personDetailMailId: '',
  name: '',
  code: '',
  productCode: '',
  productCurrency: '',
  premiumCurrency: '',
  clientType: '',
  groupType: '',
  description: '',
  productId: '',
  productData: {},
  regionId: ''
}

export default function BranchContactPersonDetailsComponent(props: any) {
  const classes = useStyles()
  const query2 = useSearchParams()
  const history = useRouter()
  const id: any = useParams().id
  const [addressConfiguration, setAddressConfiguration] = React.useState([])
  const [addressConfig, setAddressConfig] = React.useState([])
  const [prefixes, setPrefixes] = React.useState([])
  const [formObj, setFormObj] = React.useState({})
  const [branchForm, setBranchForm] = React.useState({ ...initialValues })

  const formik = useFormik({
    initialValues: {
      ...initialValues
    },
    validationSchema: validationSchema,
    onSubmit: values => {
      handleSubmitPlan()
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

  useObservable(prefx$, setPrefixes)

  React.useEffect(() => {
    if (id) {
      populateData(id)
    }
  }, [id])

  const populateData = (id: any, prodList = []) => {
    branchService.getBranchDetails(id).subscribe((value: any) => {
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
        ...formik.values,
        ...value,
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
    const payload = {
      branchContactPersonDetails: {
        personDetailPrefix: formik.values.personDetailPrefix,
        personDetailFirstName: formik.values.personDetailFirstName,
        personDetailMiddleName: formik.values.personDetailMiddleName,
        personDetailLastName: formik.values.personDetailLastName,
        personDetailPhoneNo: formik.values.personDetailPhoneNo,
        personDetailMobile: formik.values.personDetailMobile,
        personDetailMailId: formik.values.personDetailMailId
      }
    }

    if (query2.get('mode') === 'create') {
      branchService.SaveBranchOtherDetails(formik.values.regionId, payload, props.branchId, 2).subscribe(res => {
        props.handleClose()
      })
    }

    if (query2.get('mode') === 'edit') {
      branchService.SaveBranchOtherDetails(formik.values.regionId, payload, id, 2).subscribe(res => {
        props.handleClose()
      })
    }
  }

  const handleClose = (event: any) => {
    history.push(`/branch?mode=viewList`)

    // window.location.reload();
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
                  name='personDetailFirstName'
                  value={formik.values.personDetailFirstName}
                  onChange={formik.handleChange}
                  error={formik.touched.personDetailFirstName && Boolean(formik.errors.personDetailFirstName)}
                  helperText={formik.touched.personDetailFirstName && formik.errors.personDetailFirstName}
                  label='First Name'
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl className={classes.formControl}>
                <TextField
                  size='small'
                  id='standard-basic'
                  name='personDetailMiddleName'
                  value={formik.values.personDetailMiddleName}
                  onChange={formik.handleChange}
                  error={formik.touched.personDetailMiddleName && Boolean(formik.errors.personDetailMiddleName)}
                  helperText={formik.touched.personDetailMiddleName && formik.errors.personDetailMiddleName}
                  label='Middle Name'
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl className={classes.formControl}>
                <TextField
                  size='small'
                  id='standard-basic'
                  name='personDetailLastName'
                  value={formik.values.personDetailLastName}
                  onChange={formik.handleChange}
                  error={formik.touched.personDetailLastName && Boolean(formik.errors.personDetailLastName)}
                  helperText={formik.touched.personDetailLastName && formik.errors.personDetailLastName}
                  label='Last Name'
                />
              </FormControl>
            </Grid>
          </Grid>

          <Grid container spacing={3} style={{ marginBottom: '20px' }}>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl className={classes.formControl}>
                <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                  Prefix
                </InputLabel>
                <Select
                  labelId='demo-simple-select-label'
                  label='Prefix'
                  name='personDetailPrefix'
                  value={formik.values.personDetailPrefix}
                  onChange={formik.handleChange}
                >
                  {prefixes.map((ele: any) => {
                    return (
                      <MenuItem key={ele.code} value={ele.code}>
                        {ele.abbreviation}
                      </MenuItem>
                    )
                  })}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid container spacing={3} style={{ marginBottom: '20px' }}>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl className={classes.formControl}>
                <TextField
                  size='small'
                  id='standard-basic'
                  name='personDetailPhoneNo'
                  value={formik.values.personDetailPhoneNo}
                  onChange={formik.handleChange}
                  error={formik.touched.personDetailPhoneNo && Boolean(formik.errors.personDetailPhoneNo)}
                  helperText={formik.touched.personDetailPhoneNo && formik.errors.personDetailPhoneNo}
                  label='Phone'
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl className={classes.formControl}>
                <TextField
                  size='small'
                  id='standard-basic'
                  name='personDetailMobile'
                  value={formik.values.personDetailMobile}
                  onChange={formik.handleChange}
                  error={formik.touched.personDetailMobile && Boolean(formik.errors.personDetailMobile)}
                  helperText={formik.touched.personDetailMobile && formik.errors.personDetailMobile}
                  label='Mobile Number'
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl className={classes.formControl}>
                <TextField
                  size='small'
                  id='standard-basic'
                  name='personDetailMailId'
                  value={formik.values.personDetailMailId}
                  onChange={formik.handleChange}
                  error={formik.touched.personDetailMailId && Boolean(formik.errors.personDetailMailId)}
                  helperText={formik.touched.personDetailMailId && formik.errors.personDetailMailId}
                  label='Email'
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
