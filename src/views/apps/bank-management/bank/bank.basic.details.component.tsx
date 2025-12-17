import * as React from 'react'
import { useEffect } from 'react'

import { useParams, useSearchParams } from 'next/navigation'

import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Select from '@mui/material/Select'
import Snackbar from '@mui/material/Snackbar'
import { makeStyles } from '@mui/styles'
import TextField from '@mui/material/TextField'
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto'
import MuiAlert from '@mui/lab/Alert'
import Autocomplete from '@mui/lab/Autocomplete'
import 'date-fns'
import { useFormik } from 'formik'

import * as yup from 'yup'

import { Button, FormHelperText } from '@mui/material'

import { BankService } from '@/services/remote-api/api/banks-services'
import {
  AgentNatureService,
  AgentTypeService,
  OrganizationTypeService
} from '@/services/remote-api/api/master-services'

import Asterisk from '../../shared-component/components/red-asterisk'
import { Toast } from 'primereact/toast'

const bankservice = new BankService()
const agenttypeservice = new AgentTypeService()
const orgtypeservice = new OrganizationTypeService()
const agentnatureservice = new AgentNatureService()

const at$ = agenttypeservice.getAgentTypes()
const ot$ = orgtypeservice.getOrganizationTypes()
const an$ = agentnatureservice.getAgentNature()
const phoneRegExp = '([^d])d{10}([^d])'

const validationSchema = yup.object({
  bankName: yup
    .string()
    .matches(/^[A-Za-z\s]+$/, 'Only alphabets are allowed for this field')
    .required('Bank Name is required'),
  orgTypeCd: yup.string().required('Parent Bank is required'),
  contactNo: yup
    .string()
    .required('Contact number is required')
    ['min'](10, 'Must be exactly 10 digit')
    ['max'](10, 'Must be exactly 10 digit'),
  alternativeContactNo: yup.string()['min'](10, 'Must be exactly 10 digit')['max'](10, 'Must be exactly 10 digit'),
  email: yup
    .string()
    .email('Enter a valid email')
    .matches(/^[\w-\.]+@([\w-]+\.)+(com|in)$/i, 'Email must be a .com or .in domain')
    .required('Email is required'),
  alternativeEmail: yup
    .string()
    .email('Enter a valid email')
    .matches(/^[\w-\.]+@([\w-]+\.)+(com|in)$/i, 'Email must be a .com or .in domain')
})

const useStyles = makeStyles((theme: any) => ({
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

function Alert(props: any) {
  return <MuiAlert elevation={6} variant='filled' {...props} />
}

export default function BankBasicDetailsComponent(props: any) {
  const query2 = useSearchParams()
  const params = useParams()
  const id: any = params.id
  const classes = useStyles()

  const formik = useFormik({
    initialValues: {
      bankName: '',
      code: '',
      contactNo: '',
      alternativeContactNo: '',
      email: '',
      alternativeEmail: '',
      fax: '',
      partnerId: '',
      combinationPartnerId: '',
      logoBase64: '',
      logoFormat: 'image/jpeg',
      parentBankId: '',
      orgTypeCd: '',
      pOrgData: ''
    },
    validationSchema: validationSchema,
    onSubmit: values => {
      handleSubmit()
    }
  })

  const [orgTypes, setOrgTypes] = React.useState([])
  const [parentBanks, setParentBanks] = React.useState([])
  const [agentNatures, setagentNatures] = React.useState([])
  const [open, setOpen] = React.useState(false)

  const [selectedImgLink, setSelectedImgLink] = React.useState(
    'data:image/jpeg;base64,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'
  )

  const toast = React.useRef<any>(null)

  const buildOpsMenu = (orgTypes: any) => {
    const menuOpt = []

    // orgTypes.forEach(ele => {
    //   menuOpt.push(<MenuItem value={ele.code}>{ele.name}</MenuItem>)
    // }
    // );
    return [
      <MenuItem key={`OP1`} value='OP1'>
        OPTION
      </MenuItem>
    ]
  }

  const useObservable = (observable: any, setter: any) => {
    useEffect(() => {
      const subscription = observable.subscribe((result: any) => {
        setter(result.content)
      })

      return () => subscription.unsubscribe()
    }, [observable, setter])
  }

  useEffect(() => {
    setParentBanks(props.parentBanks)

    if (id) {
      //   props.parentBanks.forEach((ele) => {
      //     if (ele.id === formik.values.parentBankId) {
      //       formik.setFieldValue("pOrgData", ele);
      //     }
      //   });
      populateData(id)
    }
  }, [props.parentBanks])

  // useObservable(at$, setAgentTypes);
  useObservable(ot$, setOrgTypes)

  // useObservable(an$, setagentNatures);

  const handleSubmit = () => {
    if (
      formik.values.orgTypeCd === 'OT117246' &&
      (formik.values.parentBankId === '' || formik.values.parentBankId === null)
    ) {
      setOpen(true)
      return
    }

    const payloadOne: any = {
      bankBasicDetails: {
        bankName: formik.values.bankName,
        contactNo: formik.values.contactNo,
        alternativeContactNo: formik.values.alternativeContactNo,
        email: formik.values.email,
        alternativeEmail: formik.values.alternativeEmail,
        fax: formik.values.fax,
        partnerId: formik.values.partnerId,
        combinationPartnerId: formik.values.combinationPartnerId,
        logoBase64: formik.values.logoBase64,
        logoFormat: formik.values.logoFormat,
        orgTypeCd: formik.values.orgTypeCd
      }
    }

    payloadOne['bankBasicDetails']['orgTypeCd'] = formik.values.orgTypeCd

    if (formik.values.orgTypeCd === 'OT117246') {
      payloadOne['bankBasicDetails']['parentBankId'] = formik.values.parentBankId
    }

    if (query2.get('mode') === 'create') {
      bankservice.saveBank(payloadOne).subscribe({
        next: (res: any) => {
          toast.current?.show({
            severity: 'success',
            summary: 'Success',
            detail: 'Bank created successfully',
            life: 2000
          })
          props.setBankID(res.id)
          setTimeout(() => props.handleNext(), 1000)
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
      payloadOne['bankBasicDetails']['code'] = formik.values.code
      bankservice.editBank(payloadOne, id, '1').subscribe({
        next: (res: any) => {
          toast.current?.show({
            severity: 'success',
            summary: 'Success',
            detail: 'Bank updated successfully',
            life: 2000
          })
          setTimeout(() => props.handleNext(), 1000)
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

  const handleImgChange = (e: any) => {
    let base64String = ''
    const file = e.target['files'][0]

    const reader: any = new FileReader()

    reader.onload = function () {
      base64String = reader.result.replace('data:', '').replace(/^.+,/, '')

      setSelectedImgLink(reader.result)
      formik.setFieldValue('logoBase64', base64String)
    }

    reader.readAsDataURL(file)
  }

  //close and move back to list page
  const handleClose = (e: any) => {
    props.handleClose(e)
  }

  React.useEffect(() => {
    if (id) {
      populateData(id)
    }
  }, [id])

  const populateData = (id: any) => {
    if (id) {
      bankservice.getBankDetails(id).subscribe(val => {
        // props.parentBanks.forEach((ele) => {
        //   if (ele.id === val.bankBasicDetails.parentBankId) {
        //     pOrg = ele;
        //   }
        // });

        formik.setValues({
          bankName: val.bankBasicDetails.bankName,
          contactNo: val.bankBasicDetails.contactNo,
          alternativeContactNo: val.bankBasicDetails.alternativeContactNo,
          email: val.bankBasicDetails.email,
          alternativeEmail: val.bankBasicDetails.alternativeEmail,
          fax: val.bankBasicDetails.fax,
          code: val.bankBasicDetails.code,
          partnerId: val.bankBasicDetails.partnerId,
          combinationPartnerId: val.bankBasicDetails.combinationPartnerId,
          parentBankId: val.bankBasicDetails.parentBankId,
          logoBase64: val.bankBasicDetails.logoBase64,
          logoFormat: val.bankBasicDetails.logoFormat,
          orgTypeCd: val.bankBasicDetails.orgTypeCd,
          pOrgData: ''
        })

        const lnk = 'data:image/jpeg;base64,' + val.bankBasicDetails.logoBase64

        setSelectedImgLink(lnk)
      })
    }
  }

  const handlePChange = (e: any, value: any) => {
    formik.setFieldValue('pOrgData', value)
    formik.setFieldValue('parentBankId', value.id)
  }

  const handleSnackClose = (event: any, reason: any) => {
    setOpen(false)
  }

  const handleNameChange = (e: any) => {
    if (e.target.value) {
      const regex = /^[A-Za-z\s]+$/

      if (regex.test(e.target.value)) {
        formik.handleChange(e)
      }
    } else {
      formik.handleChange(e)
    }
  }

  return (
    <Paper elevation={0}>
      <Toast ref={toast} />
      <Box p={3} my={2}>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleSnackClose}>
          <Alert onClose={handleSnackClose} severity='error'>
            Please fill up all required fields marked with <Asterisk />
          </Alert>
        </Snackbar>

        <form onSubmit={formik.handleSubmit} noValidate>
          <Grid container spacing={3} style={{ marginBottom: '20px' }}>
            <Grid item xs={4}>
              {query2.get('mode') === 'edit' ? (
                <FormControl
                  className={classes.formControl}
                  error={formik.touched.orgTypeCd && Boolean(formik.errors.orgTypeCd)}

                  // helperText={formik.touched.orgTypeCd && formik.errors.orgTypeCd}
                >
                  <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                    Parent Bank <Asterisk />
                  </InputLabel>
                  <Select
                    labelId='demo-simple-select-label'
                    label='Parent Bank'
                    name='orgTypeCd'
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
                  error={formik.touched.orgTypeCd && Boolean(formik.errors.orgTypeCd)}

                  // helperText={formik.touched.orgTypeCd && formik.errors.orgTypeCd}
                >
                  <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                    Parent Bank
                    <Asterisk />
                  </InputLabel>
                  <Select
                    labelId='demo-simple-select-label'
                    name='orgTypeCd'
                    label='Parent Bank'
                    id='demo-simple-select'
                    value={formik.values.orgTypeCd}
                    onChange={formik.handleChange}
                  >
                    {/* <MenuItem value="Option1">OPTION 1</MenuItem> */}
                    {/* {buildOpsMenu(orgTypes)} */}
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

            {/* <FormControl className={classes.formControl}>
              <InputLabel
                id="demo-simple-select-label"
                style={{ marginBottom: "0px" }}
              >
                Parent Bank*
                    </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                name="orgTypeCd"
                id="demo-simple-select"
                value={formik.values.orgTypeCd}
                onChange={formik.handleChange}
                error={
                  formik.touched.orgTypeCd &&
                  Boolean(formik.errors.orgTypeCd)
                }
                helperText={
                  formik.touched.orgTypeCd && formik.errors.orgTypeCd
                }
              >
                {orgTypes.map((ele) => {
                  return <MenuItem value={ele.code}>{ele.name}</MenuItem>;
                })}
              </Select>
            </FormControl> */}
            {formik.values.orgTypeCd === 'OT117246' ? (
              <Grid item xs={4}>
                <Autocomplete
                  id='combo-box-demo'
                  options={parentBanks}
                  getOptionLabel={(option: any) => option.name}
                  value={formik.values.pOrgData}
                  style={{ width: '50%' }}
                  renderInput={params => <TextField {...params} label='' />}
                  onChange={handlePChange}
                />
              </Grid>
            ) : null}
            <Grid item xs={4}>
              {query2.get('mode') === 'edit' ? (
                <TextField
                  id='standard-basic'
                  name='code'
                  value={formik.values.code}
                  label='Bank Code'

                  // readonly={true}
                />
              ) : null}
            </Grid>
          </Grid>
          <Grid container spacing={3} style={{ marginBottom: '20px' }}>
            <Grid item xs={4}>
              <TextField
                id='standard-basic'
                name='bankName'
                value={formik.values.bankName}
                // onChange={formik.handleChange}
                onChange={e => handleNameChange(e)}
                // onKeyUp={}
                error={formik.touched.bankName && Boolean(formik.errors.bankName)}
                helperText={formik.touched.bankName && formik.errors.bankName}
                label={
                  <span>
                    Bank Name
                    <Asterisk />
                  </span>
                }
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                id='standard-basic'
                type='text'
                onKeyPress={event => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault()
                  }
                }}
                name='contactNo'
                value={formik.values.contactNo}
                onChange={formik.handleChange}
                error={formik.touched.contactNo && Boolean(formik.errors.contactNo)}
                helperText={formik.touched.contactNo && formik.errors.contactNo}
                // label="Contact No."
                label={
                  <span>
                    Contact No.
                    <Asterisk />
                  </span>
                }

                // required
              />
            </Grid>

            <Grid item xs={4}>
              <TextField
                id='standard-basic'
                name='email'
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                // label="Email"
                label={
                  <span>
                    Email
                    <Asterisk />
                  </span>
                }
              />
            </Grid>
          </Grid>
          <Grid container spacing={3} style={{ marginBottom: '20px' }}>
            <Grid item xs={4}>
              <TextField
                type='text'
                onKeyPress={event => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault()
                  }
                }}
                id='standard-basic'
                name='alternativeContactNo'
                value={formik.values.alternativeContactNo}
                onChange={formik.handleChange}
                error={formik.touched.alternativeContactNo && Boolean(formik.errors.alternativeContactNo)}
                helperText={formik.touched.alternativeContactNo && formik.errors.alternativeContactNo}
                label='Alt Contact No'
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                id='standard-basic'
                name='alternativeEmail'
                value={formik.values.alternativeEmail}
                onChange={formik.handleChange}
                error={formik.touched.alternativeEmail && Boolean(formik.errors.alternativeEmail)}
                helperText={formik.touched.alternativeEmail && formik.errors.alternativeEmail}
                label='Alt Email'
              />
            </Grid>

            <Grid item xs={4}>
              <TextField
                id='standard-basic'
                name='fax'
                value={formik.values.fax}
                onChange={formik.handleChange}
                error={formik.touched.fax && Boolean(formik.errors.fax)}
                helperText={formik.touched.fax && formik.errors.fax}
                label='FAX'
              />
            </Grid>
          </Grid>
          <Grid container spacing={3} style={{ marginBottom: '20px' }}>
            <Grid item xs={4}>
              <TextField
                id='standard-basic'
                name='partnerId'
                value={formik.values.partnerId}
                onChange={formik.handleChange}
                label='Partner ID'
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                id='standard-basic'
                name='combinationPartnerId'
                value={formik.values.combinationPartnerId}
                onChange={formik.handleChange}
                label='Combination Partner ID'
              />
            </Grid>
            <Grid item xs={2}>
              <span>Upload Logo</span>
              <div
                style={{
                  border: '1px solid',
                  marginBottom: '8px',
                  alignItems: 'center',
                  height: '108px',
                  width: '108px',
                  display: 'flex',
                  justifyContent: 'center'
                }}
              >
                <img src={selectedImgLink} style={{ height: '100px', width: '100px' }} />
              </div>
              <input
                accept='image/*'
                className={classes.input1}
                id='contained-button-file'
                type='file'
                onChange={handleImgChange}
                style={{ display: 'none' }}
              />
              <label htmlFor='contained-button-file'>
                <Button color='primary' type='button'>
                  <AddAPhotoIcon />
                </Button>
              </label>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant='contained' color='primary' style={{ marginRight: '5px' }} type='submit'>
                Save and Next
              </Button>
              <Button variant='text' onClick={handleClose} className='p-button-text'>
                Cancel
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Paper>
  )
}
