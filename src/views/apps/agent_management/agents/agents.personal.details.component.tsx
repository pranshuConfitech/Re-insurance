'use client'
import * as React from 'react'
import { useEffect } from 'react'

import { useParams, useSearchParams } from 'next/navigation'

import Box from '@mui/material/Box'
import { Button } from 'primereact/button'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Select from '@mui/material/Select'
import Snackbar from '@mui/material/Snackbar'
import TextField from '@mui/material/TextField'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import { makeStyles } from '@mui/styles'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import PublishIcon from '@mui/icons-material/Publish'
import type { AlertProps } from '@mui/lab/Alert'
import MuiAlert from '@mui/lab/Alert'
import Autocomplete from '@mui/lab/Autocomplete'
import 'date-fns'
import { useFormik } from 'formik'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

import * as yup from 'yup'

import type { Observable } from 'rxjs'

import { AgentsService } from '@/services/remote-api/api/agents-services'
import {
  AgentNatureService,
  AgentTypeService,
  OrganizationTypeService
} from '@/services/remote-api/api/master-services'
import Asterisk from '../../shared-component/components/red-asterisk'

import { EmailAvailability } from '@/services/utility'

const agentservice = new AgentsService()
const agenttypeservice = new AgentTypeService()
const orgtypeservice = new OrganizationTypeService()
const agentnatureservice = new AgentNatureService()

const at$ = agenttypeservice.getAgentTypes()
const ot$ = orgtypeservice.getOrganizationTypes()
const an$ = agentnatureservice.getAgentNature()
// const panRegExp = /^[a-zA-Z0-9]+$/



// const validatePanNumber = (panNumber: string) => {
//   const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
//   return panRegex.test(panNumber)
// }

const validationSchema = yup.object({
  name: yup
    .string()
    .matches(/^[A-Za-z\s]+$/, 'Only alphabets are allowed for this field')
    .required('Name is required'),
  type: yup.string().required('Agent Type is required'),
  contact: yup
    .string()
    .required('Contact Number is required')
    .min(10, 'Must be exactly 10 digits')
    .max(10, 'Must be exactly 10 digits'),
  email: yup
    .string()
    .matches(/^[\w-\.]+@([\w-]+\.)+(com|in)$/i, 'Email must be a .com or .in domain')
    .email('Enter a valid email')
    .required('Email is required'),
  natureOfAgent: yup.string().required('Agent Nature is required'),
  // taxPinNumber: yup
  //   .string()
  //   .required('Tax ID/PAN is required')
  //   .min(10, 'Must be exactly 11 characters')
  //   .max(10, 'Must be exactly 11 characters')
  //   .test('is-valid-pan', 'Invalid PAN Number', value => validatePanNumber(value)),
  dob: yup.date().nullable().required('Date of Birth is required')
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
    minWidth: 182,
    height: '56px'
  },
  formControl1: {
    margin: theme?.spacing ? theme.spacing(1) : '8px',
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
  // Enhanced form styling
  formSection: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e0e0e0'
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#333333',
    marginBottom: '20px',
    paddingBottom: '8px',
    borderBottom: '2px solid #f0f0f0'
  },
  textField: {
    height: '56px',
    '& .MuiInputBase-root': {
      height: '56px'
    }
  },
  autocompleteField: {
    height: '56px',
    '& .MuiInputBase-root': {
      height: '56px'
    }
  },
  formGrid: {
    marginBottom: '0px !important'
  }
}))

function Alert(props: React.JSX.IntrinsicAttributes & AlertProps) {
  return <MuiAlert elevation={6} variant='filled' {...props} />
}

export default function AgentPersonalDetailsComponent(props: any) {
  const query2 = useSearchParams()
  const params = useParams()
  const id: any = params.id
  const classes = useStyles()

  const formik: any = useFormik({
    initialValues: {
      name: '',
      type: '',
      partnerId: '',
      combinationPartnerId: '',
      // taxPinNumber: '',
      code: '',
      contact: '',
      email: '',
      pOrgData: '',
      parentAgentId: '',
      natureOfAgent: '',
      orgTypeCd: '',
      dob: null,
      // taxExempted: false
    },
    validationSchema: validationSchema,
    onSubmit: values => {
      setSubmit(true)
      handleSubmit()
    }
  })

  const [contactList, setContactList] = React.useState([{ altEmail: '', altContact: '' }])
  const [allowNext, setAllowNext] = React.useState(true)
  const [identificationTypes, setIdentificationTypes] = React.useState([])
  const [agentTypes, setAgentTypes] = React.useState([])
  const [orgTypes, setOrgTypes] = React.useState([])
  const [parentAgents, setParentAgents] = React.useState([])
  const [agentNatures, setagentNatures] = React.useState([])
  const [open, setOpen] = React.useState(false)
  const [openEmailMsg, setOpenEmailMsg] = React.useState(false)
  const [idErrorMsg, setIdErrorMsg] = React.useState(false)
  const [isAltContactError, setAltContactError] = React.useState(false)
  const [isSubmit, setSubmit] = React.useState(false)
  const [agentsList, setAgentsList] = React.useState([])

  const useObservable = (observable: Observable<any>, setter: any) => {
    useEffect(() => {
      const subscription = observable.subscribe(result => {
        setter(result.content)
      })

      return () => subscription.unsubscribe()
    }, [observable, setter])
  }

  const populateData = (id: string | null) => {
    if (id) {
      agentservice.getAgentDetails(id).subscribe((val: any) => {
        let pcontact = ''
        let pemail = ''
        const altList: any = []
        let pOrg = {
          name: '',
          id: ''
        }

        val.agentBasicDetails.contactNos.forEach(
          (ele: { contactType: string; contactNo: string }, i: string | number) => {
            if (ele.contactType === 'PRIMARY') {
              pcontact = ele.contactNo
            }

            if (ele.contactType === 'ALTERNATE') {
              altList.push({
                altEmail: val.agentBasicDetails.emails[i].emailId,
                altContact: ele.contactNo
              })
            }
          }
        )

        val.agentBasicDetails.emails.forEach((ele: { contactType: string; emailId: string }) => {
          if (ele.contactType === 'PRIMARY') {
            pemail = ele.emailId
          }
        })

        if (altList.length !== 0) {
          setContactList(altList)
        }

        props.parentAgents.forEach((ele: any) => {
          if (ele.id === val.agentBasicDetails.parentAgentId) {
            pOrg = ele
          }
        })

        formik.setValues({
          name: val.agentBasicDetails.name,
          type: val.agentBasicDetails.type,
          partnerId: val.agentBasicDetails.partnerId,
          combinationPartnerId: val.agentBasicDetails.combinationPartnerId,
          // taxPinNumber: val.agentBasicDetails.taxPinNumber,
          code: val.agentBasicDetails.code,
          contact: pcontact,
          email: pemail,
          pOrgData: pOrg,
          parentAgentId: val.agentBasicDetails.parentAgentId,
          natureOfAgent: val.agentBasicDetails.natureOfAgent,
          orgTypeCd: val.agentBasicDetails.orgTypeCd,
          dob: val.agentBasicDetails.dob ? new Date(val.agentBasicDetails.dob).getTime() : null,
          // taxExempted: val.agentBasicDetails.taxExempted || false
        })
      })
    }
  }

  useEffect(() => {
    setParentAgents(props.parentAgents)

    if (id || localStorage.getItem('agentId')) {
      if (id) {
        localStorage.setItem('agentId', id)
      }

      const agentId = localStorage.getItem('agentId')
      populateData(agentId)
    }
  }, [props.parentAgents])

  useObservable(at$, setAgentTypes)
  useObservable(ot$, setOrgTypes)
  useObservable(an$, setagentNatures)


  useEffect(() => {
    setIdentificationTypes(props.identificationTypes)
  }, [props.identificationTypes])

  const handleSubmit = async () => {
    const agentId = localStorage.getItem('agentId')
    const isEmailConfirmed = await EmailAvailability(formik.values.email)

    if (isEmailConfirmed && !agentId) {
      setOpenEmailMsg(true)
      return
    }

    const selectedNatureOfAgent: any = agentNatures.filter(
      (na: { code: any }) => na.code === formik.values.natureOfAgent
    )

    const contacts = []
    const emailsLists = []

    contacts.push({ contactNo: formik.values.contact, contactType: 'PRIMARY' })
    emailsLists.push({ emailId: formik.values.email, contactType: 'PRIMARY' })
    contactList.forEach(cnt => {
      contacts.push({ contactNo: cnt.altContact, contactType: 'ALTERNATE' })
      emailsLists.push({ emailId: cnt.altEmail, contactType: 'ALTERNATE' })
    })

    const payloadOne: any = {
      agentBasicDetails: {
        name: formik.values.name,
        type: formik.values.type,
        partnerId: formik.values.partnerId,
        combinationPartnerId: formik.values.combinationPartnerId,
        // taxPinNumber: formik.values.taxPinNumber,
        contactNos: contacts,
        emails: emailsLists,
        natureOfAgent: formik.values.natureOfAgent,
        dob: formik.values.dob ? new Date(formik.values.dob).getTime() : null,
        // taxExempted: formik.values.taxExempted,
        agentSourceType: "CORE_PORTAL"
      }
    }

    if (selectedNatureOfAgent[0].name.toUpperCase() === 'ORGANIZATION') {
      payloadOne['agentBasicDetails']['orgTypeCd'] = formik.values.orgTypeCd

      if (formik.values.orgTypeCd === 'OT117246') {
        payloadOne['agentBasicDetails']['parentAgentId'] = formik.values.parentAgentId
      }
    }

    const invAgents: any = []

    agentsList.forEach((ag: { agentId: any; commissionType: any; commissionValue: any; finalValue: any }) => {
      invAgents.push({
        agentId: ag.agentId,
        commissionType: ag.commissionType,
        commissionValue: ag.commissionValue,
        finalValue: ag.finalValue
      })
    })

    payloadOne['invoiceAgents'] = invAgents

    if (agentId) {
      payloadOne['agentBasicDetails']['code'] = formik.values.code
      agentservice.editAgent(payloadOne, agentId, '1').subscribe(res => {
        props.handleNext()
      })
    } else {
      agentservice.saveAgent(payloadOne).subscribe((res: any) => {
        props.setAgentID(res.id)
        localStorage.setItem('agentId', res.id)
        props.handleNext()
      })
    }
  }

  //Contact list functions
  const handleInputChangeContact = (e: any, index: number) => {
    const { name, value } = e.target
    const list: any = [...contactList]

    list[index][name] = value
    setContactList(list)

    setAltContactError(altContactValidation(value, name))
  }

  const handleAddClickContact = () => {
    setContactList([...contactList, { altEmail: '', altContact: '' }])
  }

  const handleRemoveClickContact = (index: number) => {
    const list = [...contactList]

    list.splice(index, 1)
    setContactList(list)
  }

  //close and move back to list page
  const handleClose = (e: any) => {
    props.handleClose(e)
  }

  React.useEffect(() => {
    if (id || localStorage.getItem('agentId')) {
      if (id) {
        localStorage.setItem('agentId', id)
      }

      const agentId = localStorage.getItem('agentId')
      populateData(agentId)
    }
  }, [id])

  const handlePChange = (e: any, value: { id: any }) => {
    formik.setFieldValue('pOrgData', value)
    formik.setFieldValue('parentAgentId', value.id)
  }

  const handleSnackClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    setOpen(false)
  }

  const handleEmailSnackClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    setOpenEmailMsg(false)
  }

  const handleIDErrorClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    setIdErrorMsg(false)
  }

  const altContactValidation = (value: any, field = '') => {
    if (field === 'altContact') {
      return value && value.length !== 10
    } else if (field === 'altEmail') {
      return value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    }
  }

  const getAltContactErrorStatus = (value: string, field = '') => {
    return isSubmit && altContactValidation(value, field)
  }

  const getAltContactHelperTxt = (value: string, field = '') => {
    if (field === 'altContact') {
      return isSubmit && altContactValidation(value, field) ? 'Must be exactly 10 digit' : ''
    } else if (field === 'altEmail') {
      return isSubmit && altContactValidation(value, field) ? 'Enter a valid email' : ''
    }

    return ''
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
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
      <Box p={3} my={2}>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleSnackClose}>
          <Alert onClose={handleSnackClose} severity='error'>
            Please fill up all required fields marked with *
          </Alert>
        </Snackbar>
        <Snackbar open={openEmailMsg} autoHideDuration={6000} onClose={handleEmailSnackClose}>
          <Alert onClose={handleEmailSnackClose} severity='error'>
            Email Id Already Exist, Please use another.
          </Alert>
        </Snackbar>
        <Snackbar open={idErrorMsg} autoHideDuration={6000} onClose={handleIDErrorClose}>
          <Alert onClose={handleIDErrorClose} severity='error'>
            Please provide both Identification Type and Identification Number.
          </Alert>
        </Snackbar>
        <form onSubmit={formik.handleSubmit} noValidate>
          {/* Basic Details Section - 3 Inputs Per Row Layout */}
          <div className={classes.formSection} style={{ marginBottom: '32px' }}>
            <Grid container spacing={3}>
              {/* Row 1: Agent Category, Parent Agent (conditional), Agent Type */}
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <FormControl
                      className={classes.formControl}
                      error={formik.touched.natureOfAgent && Boolean(formik.errors.natureOfAgent)}
                      fullWidth
                    >
                      <InputLabel id='agent-category-label' style={{ marginBottom: '0px' }}>
                        Agent Category <Asterisk />
                      </InputLabel>
                      <Select
                        label='Agent Category'
                        labelId='agent-category-label'
                        name='natureOfAgent'
                        id='agent-category-select'
                        value={formik.values.natureOfAgent}
                        onChange={formik.handleChange}
                      >
                        {agentNatures.map((ele: any) => {
                          return (
                            <MenuItem key={ele.code} value={ele.code}>
                              {ele.name}
                            </MenuItem>
                          )
                        })}
                      </Select>
                      {formik.touched.natureOfAgent && Boolean(formik.errors.natureOfAgent) && (
                        <FormHelperText>{formik.touched.natureOfAgent && formik.errors.natureOfAgent}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  {formik.values.natureOfAgent === 'NOA185739' ? (
                    <Grid item xs={12} sm={4}>
                      {query2.get('mode') === 'edit' ? (
                        <FormControl
                          className={classes.formControl}
                          error={formik.touched.orgTypeCd && Boolean(formik.errors.orgTypeCd)}
                          fullWidth
                        >
                          <InputLabel id='parent-agent-label' style={{ marginBottom: '0px' }}>
                            Parent Agent <Asterisk />
                          </InputLabel>
                          <Select
                            label='Parent Agent'
                            labelId='parent-agent-label'
                            name='orgTypeCd'
                            id='parent-agent-select'
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
                          fullWidth
                        >
                          <InputLabel id='parent-agent-label' style={{ marginBottom: '0px' }}>
                            Parent Agent <Asterisk />
                          </InputLabel>
                          <Select
                            label='Parent Agent'
                            labelId='parent-agent-label'
                            name='orgTypeCd'
                            id='parent-agent-select'
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
                  ) : null}
                  <Grid item xs={12} sm={4}>
                    <FormControl
                      className={classes.formControl}
                      error={formik.touched.type && Boolean(formik.errors.type)}
                      fullWidth
                    >
                      <InputLabel id='agent-type-label' style={{ marginBottom: '0px' }}>
                        Agent Type <Asterisk />
                      </InputLabel>
                      <Select
                        label='Agent Type'
                        labelId='agent-type-label'
                        name='type'
                        id='agent-type-select'
                        value={formik.values.type}
                        onChange={formik.handleChange}
                      >
                        {agentTypes.map((ele: any) => {
                          return (
                            <MenuItem key={ele.code} value={ele.code}>
                              {ele.name}
                            </MenuItem>
                          )
                        })}
                      </Select>
                      {formik.touched.type && Boolean(formik.errors.type) && (
                        <FormHelperText>{formik.touched.type && formik.errors.type}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>

              {/* Conditional Parent Agent Autocomplete - Full Width */}
              {formik.values.natureOfAgent === 'NOA185739' && formik.values.orgTypeCd === 'OT117246' ? (
                <Grid item xs={12}>
                  <Autocomplete
                    id='parent-agent-autocomplete'
                    options={parentAgents}
                    getOptionLabel={(option: any) => option.name}
                    value={formik.values.pOrgData}
                    className={classes.autocompleteField}
                    renderInput={params => <TextField {...params} label='Parent Agent' />}
                    onChange={handlePChange}
                  />
                </Grid>
              ) : null}

              {/* Row 2: Name, Date of Birth, Agent Code (Edit Mode Only) */}
              <Grid item xs={12} style={{ marginTop: '3px' }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      id='agent-name'
                      name='name'
                      value={formik.values.name}
                      onChange={e => handleNameChange(e)}
                      error={formik.touched.name && Boolean(formik.errors.name)}
                      helperText={formik.touched.name && formik.errors.name}
                      className={classes.textField}
                      label={
                        <span>
                          Name <Asterisk />
                        </span>
                      }
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label={<span>Date of Birth <Asterisk /></span>}
                        value={formik.values.dob}
                        onChange={value => formik.setFieldValue('dob', value)}
                        renderInput={params => (
                          <TextField {...params} margin='none' variant='outlined' fullWidth
                            error={formik.touched.dob && Boolean(formik.errors.dob)}
                            helperText={formik.touched.dob && formik.errors.dob}
                            className={classes.textField}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </Grid>
                  {query2.get('mode') === 'edit' ? (
                    <Grid item xs={12} sm={4}>
                      <TextField
                        id='agent-code'
                        name='code'
                        value={formik.values.code}
                        label='Agent Code'
                        className={classes.textField}
                        InputProps={{
                          readOnly: true,
                        }}
                        fullWidth
                      />
                    </Grid>
                  ) : null}
                </Grid>
              </Grid>

              {/* Row 3: Partner ID, Combination Partner ID */}
              <Grid item xs={12} style={{ marginTop: '10px' }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      id='partner-id'
                      name='partnerId'
                      value={formik.values.partnerId}
                      onChange={formik.handleChange}
                      label='Partner ID'
                      className={classes.textField}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      id='combination-partner-id'
                      name='combinationPartnerId'
                      value={formik.values.combinationPartnerId}
                      onChange={formik.handleChange}
                      label='Combination Partner ID'
                      className={classes.textField}
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Grid>

              {/* Row 4: Contact No, Email ID */}
              <Grid item xs={12} style={{ marginTop: '10px' }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      id='contact-number'
                      onKeyPress={event => {
                        if (!/[0-9]/.test(event.key)) {
                          event.preventDefault()
                        }
                      }}
                      name='contact'
                      value={formik.values.contact}
                      onChange={formik.handleChange}
                      error={formik.touched.contact && Boolean(formik.errors.contact)}
                      helperText={formik.touched.contact && formik.errors.contact}
                      className={classes.textField}
                      label={
                        <span>
                          Contact No <Asterisk />
                        </span>
                      }
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      id='email-id'
                      name='email'
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      error={formik.touched.email && Boolean(formik.errors.email)}
                      helperText={formik.touched.email && formik.errors.email}
                      className={classes.textField}
                      label={
                        <span>
                          Email ID <Asterisk />
                        </span>
                      }
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </div>

          {/* Alternate Contact Information Section */}
          <div className={classes.formSection}>
            {contactList.map((x, i) => {
              return (
                <Grid key={`agentPersonalGridContactList-${i}`} container spacing={0} className={classes.formGrid}>
                  <Grid item xs={3}>
                    <TextField
                      id={`alt-contact-${i}`}
                      onKeyPress={event => {
                        if (!/[0-9]/.test(event.key)) {
                          event.preventDefault()
                        }
                      }}
                      name='altContact'
                      value={x.altContact}
                      onChange={e => handleInputChangeContact(e, i)}
                      label='Alt. Contact No'
                      error={getAltContactErrorStatus(x.altContact, 'altContact')}
                      helperText={getAltContactHelperTxt(x.altContact, 'altContact')}
                      className={classes.textField}
                      style={{ minWidth: '236px' }}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      id={`alt-email-${i}`}
                      name='altEmail'
                      value={x.altEmail}
                      onChange={e => handleInputChangeContact(e, i)}
                      label='Alt. Email ID'
                      error={getAltContactErrorStatus(x.altEmail, 'altEmail')}
                      helperText={getAltContactHelperTxt(x.altEmail, 'altEmail')}
                      className={classes.textField}
                      style={{ minWidth: '236px' }}
                    />
                  </Grid>
                  <Grid item xs={1} style={{ display: 'flex', alignItems: 'center' }}>
                    {contactList.length !== 1 && (
                      <Button
                        className='mr10 p-button-danger'
                        onClick={() => handleRemoveClickContact(i)}
                        color='secondary'
                        style={{ marginRight: '2px' }}
                      >
                        <DeleteIcon />
                      </Button>
                    )}
                    {contactList.length - 1 === i && (
                      <Button color='primary' onClick={handleAddClickContact}>
                        <AddIcon />
                      </Button>
                    )}
                  </Grid>
                </Grid>
              )
            })}
          </div>

          {query2.get('mode') !== 'viewOnly' && (
            <Grid container spacing={3}>
              <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button color='primary' style={{ marginRight: '5px' }} type='submit' disabled={!allowNext && true}>
                  Save and Next
                </Button>
                <Button className='p-button-text' onClick={handleClose}>
                  Cancel
                </Button>
              </Grid>
            </Grid>
          )}
        </form>
      </Box>
    </Paper>
  )
}
