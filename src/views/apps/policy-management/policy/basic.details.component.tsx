
import * as React from 'react'
import { useEffect } from 'react'

import { useParams, useSearchParams } from 'next/navigation'

import Box from '@mui/material/Box'
import { Button } from 'primereact/button'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormLabel from '@mui/material/FormLabel'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import Select from '@mui/material/Select'
import Snackbar from '@mui/material/Snackbar'
import { makeStyles } from '@mui/styles'
import TextField from '@mui/material/TextField'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import MuiAlert from '@mui/lab/Alert'

// import { KeyboardDatePicker } from '@material-ui/pickers';
import Autocomplete from '@mui/lab/Autocomplete'

import 'date-fns'

import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

import EditConfirmationModal from './modals/edit.client.modal.component'

import { ClientTypeService, OrganizationTypeService } from '@/services/remote-api/api/master-services'
import { PolicyService } from '@/services/remote-api/api/policy-services'

const organizationservice = new OrganizationTypeService()
const clienttypeervice = new ClientTypeService()
const proposerservice = new PolicyService()

const org$ = organizationservice.getOrganizationTypes()
const ct$ = clienttypeervice.getCleintTypes()

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
  },
  inputRoot: {
    '&$disabled': {
      color: 'black'
    }
  },
  disabled: {}
}))

export default function BasicDetailsStepComponent(props: any) {
  const classes = useStyles()
  const query = useSearchParams()
  const id: any = useParams().id
  const { clientDetail } = props
  const [organizationTypes, setOrganizationTypes] = React.useState([])
  const [clientTypes, setClientTypes] = React.useState([])
  const [groupTypes, setGroupTypes] = React.useState([])
  const [prefixes, setPrefixes] = React.useState([])
  const [suffixes, setSuffixes] = React.useState([])
  const [openRequired, setOpenRequired] = React.useState(false)
  const [idErrorMsg, setIdErrorMsg] = React.useState(false)
  const [checkContact, setCheckContact] = React.useState(false)
  const [disableClientData, setDisableClientData] = React.useState(true)
  const [confirmModal, setConfirmModal] = React.useState(false)

  const [contactList, setContactList] = React.useState([{ altEmail: '', altContact: '' }])
  const [selectedDate, setSelectedDate] = React.useState(new Date())
  const [selectedImgLink, setSelectedImgLink] = React.useState('')

  const [identificationList, setIdentificationList]: any = React.useState([
    { identificationType: '', identificationNo: '', docFormat: 'image/jpeg', document: props.imgF }
  ])

  const [identificationTypes, setIdentificationTypes] = React.useState([])
  const [parentClients, setParentClients] = React.useState([])

  const useObservable = (observable: any, setter: any) => {
    useEffect(() => {
      const subscription = observable.subscribe((result: any) => {
        setter(result.content)
      })

      return () => subscription.unsubscribe()
    }, [observable, setter])
  }

  useObservable(org$, setOrganizationTypes)
  useObservable(ct$, setClientTypes)

  function Alert(props: any) {
    return <MuiAlert elevation={6} variant='filled' {...props} />
  }

  function validateEmail(email: any) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    return re.test(String(email).toLowerCase())
  }

  useEffect(() => {
    setPrefixes(props.prefixes)
  }, [props.prefixes])
  useEffect(() => {
    setSuffixes(props.suffixes)
  }, [props.suffixes])
  useEffect(() => {
    setIdentificationTypes(props.identificationTypes)
  }, [props.identificationTypes])
  useEffect(() => {
    setContactList(props.contactList)
  }, [props.contactList])
  useEffect(() => {
    setIdentificationList(props.identificationList)
  }, [props.identificationList])
  useEffect(() => {
    setSelectedDate(props.selectedDate)
  }, [props.selectedDate])
  useEffect(() => {
    setSelectedImgLink(props.selectedImgLink)
  }, [props.selectedImgLink])
  useEffect(() => {
    setGroupTypes(props.groupTypes)
  }, [props.groupTypes])
  useEffect(() => {
    setParentClients(props.parentClients)
  }, [props.parentClients])

  const handleChange = (event: any) => {
    const { name, value } = event.target

    let dname = {}

    if (clientDetail.lastName !== 'GROUP') {
      if (name === 'firstName') {
        dname = { displayName: value + ' ' + clientDetail.middleName + ' ' + clientDetail.lastName }
      } else if (name === 'middleName') {
        dname = { displayName: clientDetail.firstName + ' ' + value + ' ' + clientDetail.lastName }
      } else if (name === 'lastName') {
        dname = { displayName: clientDetail.firstName + ' ' + clientDetail.middleName + ' ' + value }
      }
    } else if (name === 'firstName') {
      dname = { displayName: clientDetail.firstName }
    }

    setClientDetail({
      ...clientDetail,
      [name]: value,
      ...dname
    })
  }

  const openConfirmationModal = () => {
    setConfirmModal(true)
  }

  const closeConfirmationModal = (val: string) => {
    if (val === 'yes') {
      setDisableClientData(false)
    }

    setConfirmModal(false)
  }

  const handleSubmit = (event: any) => {
    if (!disableClientData) {
      if (
        clientDetail.firstName == '' ||
        clientDetail.displayName == '' ||
        clientDetail.panNumber == '' ||
        clientDetail.contact == ''
      ) {
        setOpenRequired(true)

        return
      }

      if (identificationList.length === 1) {
        if (identificationList[0].identificationType !== '' && identificationList[0].identificationNo === '') {
          setIdErrorMsg(true)

          return
        }

        if (identificationList[0].identificationType === '' && identificationList[0].identificationNo !== '') {
          setIdErrorMsg(true)

          return
        }
      }

      if (identificationList.length > 1) {
        identificationList.forEach((val: any) => {
          if (val.identificationType === '' || val.identificationNo === '') {
            setIdErrorMsg(true)

            return
          }
        })
      }

      if (clientDetail.contact.length !== 10) {
        setCheckContact(true)

        return
      }

      // if (clientDetail.contact.email !== '' && validateEmail(clientDetail.contact.email) === false) {
      //     setCheckContact(true);
      //     return;
      // }
      // contactList.forEach(cnt => {
      //     if (cnt.altContact.length !== 0) {
      //         setCheckContact(true);
      //         return;
      //     }
      //     if (validateEmail(cnt.altEmail) === false) {
      //         setCheckContact(true);
      //         return;
      //     }

      // })

      const contacts = []
      const emailsLists = []

      contacts.push({ contactNo: clientDetail.contact, contactType: 'PRIMARY' })
      emailsLists.push({ emailId: clientDetail.email, contactType: 'PRIMARY' })
      contactList.forEach(cnt => {
        contacts.push({ contactNo: cnt.altContact, contactType: 'ALTERNATE' })
        emailsLists.push({ emailId: cnt.altEmail, contactType: 'ALTERNATE' })
      })

      const payloadOne: any = {
        clientBasicDetails: {
          // prefixCd: clientDetail.prefixCd,
          // middleName: clientDetail.middleName,
          // lastName: clientDetail.lastName,
          // suffixCd: clientDetail.suffixCd,
          firstName: clientDetail.firstName,
          displayName: clientDetail.displayName,
          clientTypeCd: clientDetail.clientTypeCd,
          orgTypeCd: clientDetail.orgTypeCd,
          partnerNumber: clientDetail.partnerNumber,
          combinationPartnerId: clientDetail.combinationPartnerId,
          gstNo: clientDetail.gstNo,
          panNumber: clientDetail.panNumber,
          incorporationNumber: clientDetail.incorporationNumber,
          dataOfIncorporation: new Date(selectedDate).getTime(),
          countryOfIncorporation: clientDetail.countryOfIncorporation,
          policeStation: clientDetail.policeStation,
          logoFormat: clientDetail.logoFormat,
          websiteUrl: clientDetail.websiteUrl,

          // prospectId: clientDetail.string,
          logo: clientDetail.logo || props.imgF,
          contactNos: contacts,
          emails: emailsLists
        }
      }

      if (
        identificationList.length === 1 &&
        identificationList[0].identificationType !== '' &&
        identificationList[0].identificationNo !== ''
      ) {
        payloadOne['clientBasicDetails']['identifications'] = identificationList
      }

      if (identificationList.length > 1) {
        payloadOne['clientBasicDetails']['identifications'] = identificationList
      }

      if (clientDetail.clientTypeCd === 'GROUP') {
        if (clientDetail.groupTypeCd === '') {
          setOpenRequired(true)

          return
        }

        payloadOne['clientBasicDetails']['groupTypeCd'] = clientDetail.groupTypeCd
      }

      if (clientDetail.clientTypeCd === 'RETAIL') {
        if (clientDetail.lastName === '') {
          setOpenRequired(true)

          return
        }

        payloadOne['clientBasicDetails']['prefixCd'] = clientDetail.prefixCd
        payloadOne['clientBasicDetails']['suffixCd'] = clientDetail.suffixCd
        payloadOne['clientBasicDetails']['middleName'] = clientDetail.middleName
        payloadOne['clientBasicDetails']['lastName'] = clientDetail.lastName
      }

      if (clientDetail.orgTypeCd === 'OT117246') {
        if (clientDetail.parentclientId === '') {
          setOpenRequired(true)

          return
        }

        payloadOne['clientBasicDetails']['parentclientId'] = clientDetail.parentclientId
      }

      payloadOne['clientBasicDetails']['code'] = clientDetail.code

      const cid = query.get('clientid')

      props.handleSubmitStepOne(payloadOne, cid)
    }

    if (disableClientData) {
      const cid = query.get('clientid')

      if (query.get('mode') === 'create') {
        const pload: any = { clientId: cid }

        if (query.get('invid')) {
          pload['invoiceNumber'] = query.get('invid')
        }

        if (query.get('refid')) {
          pload['referenceNumber'] = query.get('refid')
        }

        if (query.get('recid')) {
          pload['receiptNumber'] = query.get('recid')
        }

        proposerservice.savePolicy(pload).subscribe((ele: any) => {
          props.setProposerID(ele.id)
          localStorage.setItem('proposerid', ele.id)
          props.handleNext()
        })
      }

      if (query.get('mode') === 'edit') {
        if (id) {
          const pload: any = { clientId: cid }

          if (query.get('invid')) {
            pload['invoiceNumber'] = query.get('invid')
          }

          if (query.get('refid')) {
            pload['referenceNumber'] = query.get('refid')
          }

          if (query.get('recid')) {
            pload['receiptNumber'] = query.get('recid')
          }

          proposerservice.editPolicy(pload, id, '1').subscribe(ele => {
            props.handleNext()
          })
        }
      }
    }
  }

  //Contact list functions
  const handleInputChangeContact = (e: any, index: number) => {
    const { name, value } = e.target
    const list: any = [...contactList]

    list[index][name] = value
    setContactList(list)
  }

  const handleAddClickContact = () => {
    setContactList([...contactList, { altEmail: '', altContact: '' }])
  }

  const handleRemoveClickContact = (index: number) => {
    const list = [...contactList]

    list.splice(index, 1)
    setContactList(list)
  }

  const handleDateChange = (date: any) => {
    setSelectedDate(date)

    const timestamp = new Date(date).getTime()

    setClientDetail({
      ...clientDetail,
      dataOfIncorporation: new Date(date).getTime()
    })
  }

  const handleImgChange = (e: { target: any }) => {
    let base64String = ''
    const file = e.target['files'][0]

    const reader: any = new FileReader()

    reader.onload = function () {
      base64String = reader.result.replace('data:', '').replace(/^.+,/, '')

      setSelectedImgLink(reader.result)
      setClientDetail({
        ...clientDetail,
        logo: base64String
      })
    }

    reader.readAsDataURL(file)
  }

  const handleImgChange1 = (e: any, index: number) => {
    let base64String = ''
    const file = e.target['files'][0]

    const reader: any = new FileReader()

    reader.onload = function () {
      base64String = reader.result.replace('data:', '').replace(/^.+,/, '')

      // imageBase64Stringsep = base64String;

      // alert(imageBase64Stringsep);

      const list = [...identificationList]

      list[index]['document'] = base64String
      list[index]['docFormat'] = file.type
      setIdentificationList(list)
    }

    reader.readAsDataURL(file)
  }

  //Indentification Type
  const handleInputChangeIndentification = (e: any, index: number) => {
    const { name, value } = e.target
    const list: any = [...identificationList]

    list[index][name] = value
    setIdentificationList(list)
  }

  const handleRemoveClickIndentification = (index: any) => {
    const list = [...identificationList]

    list.splice(index, 1)
    setIdentificationList(list)
  }

  const handleAddClickIndentification = () => {
    setIdentificationList([...identificationList, { identificationType: '', identificationNo: '' }])
  }

  const setClientDetail = (e: any) => {
    props.setClientDetail(e)
  }

  const handleClose = (e: any) => {
    props.handleClose(e)
  }

  const handlePChange = (e: any, value: any) => {
    setClientDetail({
      ...clientDetail,
      pOrgData: value,
      parentclientId: value.id
    })
  }

  const handleSnackClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    setOpenRequired(false)
  }

  const handleIDErrorClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    setIdErrorMsg(false)
  }

  const handleContactCheckClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    setCheckContact(false)
  }

  return (
    <Paper elevation={0}>
      <Box p={3} my={2}>
        <Snackbar open={openRequired} autoHideDuration={6000} onClose={handleSnackClose}>
          <Alert onClose={handleSnackClose} severity='error'>
            Please fill up all required fields marked with *
          </Alert>
        </Snackbar>
        <Snackbar open={checkContact} autoHideDuration={6000} onClose={handleContactCheckClose}>
          <Alert onClose={handleContactCheckClose} severity='error'>
            Please enter valid contact number/Email id
          </Alert>
        </Snackbar>
        <Snackbar open={idErrorMsg} autoHideDuration={6000} onClose={handleIDErrorClose}>
          <Alert onClose={handleIDErrorClose} severity='error'>
            Please provide both Identification Type and Identification Number.
          </Alert>
        </Snackbar>
        {/* <form onSubmit={handleSubmit}> */}
        <Grid container spacing={3} style={{ marginBottom: '20px' }}>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl component='fieldset'>
              <FormLabel component='legend'>Client type*</FormLabel>
              <RadioGroup
                aria-label='clientTypeCd'
                name='clientTypeCd'
                value={clientDetail.clientTypeCd}
                onChange={handleChange}
                row
                className={classes.clientTypeRadioGroup}
              >
                {clientTypes.map((ele: any) => {
                  return (
                    <FormControlLabel
                      key={ele.code}
                      disabled={disableClientData}
                      value={ele.code}
                      control={<Radio />}
                      label={ele.name}
                    />
                  )
                })}
              </RadioGroup>
            </FormControl>
          </Grid>
        </Grid>
        <Grid container spacing={3} style={{ marginBottom: '20px' }}>
          {clientDetail.clientTypeCd === 'GROUP' && (
            <>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl className={classes.formControl}>
                  <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                    Group Type*
                  </InputLabel>
                  <Select
                    labelId='demo-simple-select-label'
                    label='Group Type'
                    name='groupTypeCd'
                    id='demo-simple-select'
                    disabled={disableClientData}
                    value={clientDetail.groupTypeCd}
                    onChange={handleChange}
                  >
                    {groupTypes.map((ele: any) => {
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
                <FormControl className={classes.formControl}>
                  <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                    Organization type*
                  </InputLabel>
                  <Select
                    labelId='demo-simple-select-label'
                    label='Organization Type'
                    id='demo-simple-select'
                    name='orgTypeCd'
                    disabled={disableClientData}
                    value={clientDetail.orgTypeCd}
                    onChange={handleChange}
                  >
                    {organizationTypes.map((ele: any) => {
                      return (
                        <MenuItem key={ele.code} value={ele.code}>
                          {ele.name}
                        </MenuItem>
                      )
                    })}
                  </Select>
                </FormControl>
              </Grid>
            </>
          )}
          {clientDetail.clientTypeCd === 'GROUP' && clientDetail.orgTypeCd === 'OT117246' ? (
            <Grid item xs={12} sm={6} md={4}>
              <FormControl className={classes.formControl}>
                <Autocomplete
                  id='combo-box-demo'
                  options={parentClients}
                  getOptionLabel={(option: any) => option.name}
                  value={clientDetail.pOrgData}
                  disabled={disableClientData}
                  style={{ width: '50%' }}
                  renderInput={params => <TextField {...params} label='Parent Organization*' />}
                  onChange={handlePChange}
                />
              </FormControl>
            </Grid>
          ) : (
            <></>
          )}
        </Grid>
        <Grid container spacing={3} style={{ marginBottom: '20px' }}></Grid>

        <Box pb={3}>
          <Divider />
        </Box>

        {clientDetail.clientTypeCd === 'GROUP' ? (
          <Grid container spacing={3} style={{ marginBottom: '20px' }}>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl className={classes.formControl}>
                <TextField
                  size='small'
                  id='standard-basic'
                  name='firstName'
                  disabled={disableClientData}
                  value={clientDetail.firstName}
                  onChange={handleChange}
                  label='Name*'
                  InputProps={{
                    classes: {
                      root: classes.inputRoot,
                      disabled: classes.disabled
                    }
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl className={classes.formControl}>
                <TextField
                  id='standard-basic'
                  name='displayName'
                  disabled={disableClientData}
                  value={clientDetail.displayName}
                  onChange={handleChange}
                  label='Display Name*'
                  InputProps={{
                    classes: {
                      root: classes.inputRoot,
                      disabled: classes.disabled
                    }
                  }}
                />
              </FormControl>
            </Grid>
          </Grid>
        ) : (
          <>
            <Grid container spacing={3} style={{ marginBottom: '20px' }}>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl className={classes.formControl}>
                  <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                    Prefix
                  </InputLabel>
                  <Select
                    labelId='demo-simple-select-label'
                    label='Prefix'
                    name='prefixCd'
                    disabled={disableClientData}
                    value={clientDetail.prefixCd}
                    onChange={handleChange}

                    // InputProps={{
                    //   classes: {
                    //     root: classes.inputRoot,
                    //     disabled: classes.disabled,
                    //   },
                    // }}
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
              <Grid item xs={12} sm={6} md={4}>
                <FormControl className={classes.formControl}>
                  <TextField
                    id='standard-basic'
                    name='firstName'
                    disabled={disableClientData}
                    label='First Name*'
                    value={clientDetail.firstName}
                    onChange={handleChange}
                    InputProps={{
                      classes: {
                        root: classes.inputRoot,
                        disabled: classes.disabled
                      }
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl className={classes.formControl}>
                  <TextField
                    id='standard-basic'
                    name='middleName'
                    disabled={disableClientData}
                    value={clientDetail.middleName}
                    onChange={handleChange}
                    label='Middle Name'
                    InputProps={{
                      classes: {
                        root: classes.inputRoot,
                        disabled: classes.disabled
                      }
                    }}
                  />
                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={3} style={{ marginBottom: '20px' }}>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl className={classes.formControl}>
                  <TextField
                    id='standard-basic'
                    name='lastName'
                    disabled={disableClientData}
                    value={clientDetail.lastName}
                    onChange={handleChange}
                    label='Last Name*'
                    InputProps={{
                      classes: {
                        root: classes.inputRoot,
                        disabled: classes.disabled
                      }
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl className={classes.formControl}>
                  <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                    Suffix
                  </InputLabel>
                  <Select
                    labelId='demo-simple-select-label'
                    name='suffixCd'
                    label='Suffix'
                    disabled={disableClientData}
                    value={clientDetail.suffixCd}
                    onChange={handleChange}

                    // InputProps={{
                    //   classes: {
                    //     root: classes.inputRoot,
                    //     disabled: classes.disabled,
                    //   },
                    // }}
                  >
                    {suffixes.map((ele: any) => {
                      return (
                        <MenuItem key={ele.code} value={ele.id}>
                          {ele.abbreviation}
                        </MenuItem>
                      )
                    })}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl className={classes.formControl}>
                  <TextField
                    id='standard-basic'
                    name='displayName'
                    disabled={disableClientData}
                    value={clientDetail.displayName}
                    onChange={handleChange}
                    label='Display Name*'
                    InputProps={{
                      classes: {
                        root: classes.inputRoot,
                        disabled: classes.disabled
                      }
                    }}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </>
        )}
        <Grid container spacing={3} style={{ marginBottom: '20px' }}>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl className={classes.formControl}>
              <TextField
                id='standard-basic'
                type='number'
                name='contact'
                disabled={disableClientData}
                value={clientDetail.contact}
                onChange={handleChange}
                label='Contact No*'
                InputProps={{
                  classes: {
                    root: classes.inputRoot,
                    disabled: classes.disabled
                  }
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl className={classes.formControl}>
              <TextField
                id='standard-basic'
                name='email'
                disabled={disableClientData}
                value={clientDetail.email}
                onChange={handleChange}
                label='Email id'
                InputProps={{
                  classes: {
                    root: classes.inputRoot,
                    disabled: classes.disabled
                  }
                }}
              />
            </FormControl>
          </Grid>
          {query.get('mode') === 'edit' ? (
            <Grid item xs={12} sm={6} md={4}>
              <FormControl className={classes.formControl}>
                <TextField
                  id='standard-basic'
                  name='code'
                  disabled={disableClientData}
                  value={clientDetail.code}
                  onChange={handleChange}
                  label='Client Code'
                  InputProps={{
                    classes: {
                      root: classes.inputRoot,
                      disabled: classes.disabled
                    }
                  }}
                />
              </FormControl>
            </Grid>
          ) : null}
        </Grid>
        {contactList.map((x, i) => {
          return (
            <Grid key={i} container spacing={3} style={{ marginBottom: '20px' }}>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl className={classes.formControl}>
                  <TextField
                    id='standard-basic'
                    type='number'
                    disabled={disableClientData}
                    name='altContact'
                    value={x.altContact}
                    onChange={e => handleInputChangeContact(e, i)}
                    label='Alt. Contact No'
                    InputProps={{
                      classes: {
                        root: classes.inputRoot,
                        disabled: classes.disabled
                      }
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl className={classes.formControl}>
                  <TextField
                    id='standard-basic'
                    name='altEmail'
                    disabled={disableClientData}
                    value={x.altEmail}
                    onChange={e => handleInputChangeContact(e, i)}
                    label='Alt. Email id'
                    InputProps={{
                      classes: {
                        root: classes.inputRoot,
                        disabled: classes.disabled
                      }
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4} style={{ display: 'flex', alignItems: 'center' }}>
                {contactList.length !== 1 && !disableClientData && (
                  <Button
                    className='mr10'
                    onClick={() => handleRemoveClickContact(i)}
                    color='secondary'
                    style={{ marginRight: '5px' }}
                  >
                    <DeleteIcon style={{ color: '#dc3545' }} />
                  </Button>
                )}
                {contactList.length - 1 === i && !disableClientData && (
                  <Button color='primary' onClick={handleAddClickContact}>
                    <AddIcon />
                  </Button>
                )}
              </Grid>
            </Grid>
          )
        })}

        <Box pb={3}>
          <Divider />
        </Box>

        <Grid container spacing={3} style={{ marginBottom: '20px' }}>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl className={classes.formControl}>
              <TextField
                id='standard-basic'
                name='incorporationNumber'
                disabled={disableClientData}
                value={clientDetail.incorporationNumber}
                onChange={handleChange}
                label='Incorporation No'
                InputProps={{
                  classes: {
                    root: classes.inputRoot,
                    disabled: classes.disabled
                  }
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                views={['year', 'month', 'date']}
                variant="inline"
                format="dd/MM/yyyy"
                margin="normal"
                id="date-picker-inline"
                disabled={disableClientData}
                label="Date Of Incorporation"
                value={selectedDate}
                onChange={handleDateChange}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
            </MuiPickersUtilsProvider> */}
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                views={['year', 'month', 'day']}
                disabled={disableClientData}
                label='Date Of Incorporation'
                value={selectedDate}
                onChange={handleDateChange}
                renderInput={params => (
                  <TextField {...params} margin='normal' style={{ marginBottom: '0px' }} variant='outlined' />
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl className={classes.formControl}>
              <TextField
                id='standard-basic'
                name='countryOfIncorporation'
                disabled={disableClientData}
                value={clientDetail.countryOfIncorporation}
                onChange={handleChange}
                label='Country of Incorporation'
                InputProps={{
                  classes: {
                    root: classes.inputRoot,
                    disabled: classes.disabled
                  }
                }}
              />
            </FormControl>
          </Grid>
        </Grid>
        <Grid container spacing={3} style={{ marginBottom: '20px' }}>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl className={classes.formControl}>
              <TextField
                id='standard-basic'
                name='policeStation'
                disabled={disableClientData}
                value={clientDetail.policeStation}
                onChange={handleChange}
                label='Police station'
                InputProps={{
                  classes: {
                    root: classes.inputRoot,
                    disabled: classes.disabled
                  }
                }}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <FormControl className={classes.formControl}>
              <TextField
                id='standard-basic'
                name='websiteUrl'
                disabled={disableClientData}
                value={clientDetail.websiteUrl}
                onChange={handleChange}
                label='Website URL'
                InputProps={{
                  classes: {
                    root: classes.inputRoot,
                    disabled: classes.disabled
                  }
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={1}>
            <span>Profile Picture</span>
            <div
              style={{
                border: '5px solid',
                marginBottom: '8px',
                alignItems: 'center',
                height: '105px',
                width: '105px',
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              {
                selectedImgLink && (

                  <img src={selectedImgLink} style={{ height: '100px', width: '100px' }} />
                )
              }
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
              {/* <Button variant="contained" color="primary" component="span">
                                <AddAPhotoIcon />
                            </Button> */}
            </label>
          </Grid>
        </Grid>
        <Grid container spacing={3} style={{ marginBottom: '20px' }}>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl className={classes.formControl}>
              <TextField
                id='standard-basic'
                name='partnerNumber'
                disabled={disableClientData}
                value={clientDetail.partnerNumber}
                onChange={handleChange}
                label='Partner no'
                InputProps={{
                  classes: {
                    root: classes.inputRoot,
                    disabled: classes.disabled
                  }
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl className={classes.formControl}>
              <TextField
                id='standard-basic'
                name='combinationPartnerId'
                disabled={disableClientData}
                value={clientDetail.combinationPartnerId}
                onChange={handleChange}
                label='Combination Partner No.'
                InputProps={{
                  classes: {
                    root: classes.inputRoot,
                    disabled: classes.disabled
                  }
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl className={classes.formControl}>
              <TextField
                id='standard-basic'
                name='panNumber'
                disabled={disableClientData}
                value={clientDetail.panNumber}
                onChange={handleChange}
                label='PAN No.'
                InputProps={{
                  classes: {
                    root: classes.inputRoot,
                    disabled: classes.disabled
                  }
                }}
              />
            </FormControl>
          </Grid>
        </Grid>
        <Grid container spacing={3} style={{ marginBottom: '20px' }}>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl className={classes.formControl}>
              <TextField
                id='standard-basic'
                name='gstNo'
                disabled={disableClientData}
                value={clientDetail.gstNo}
                onChange={handleChange}
                label='GST No.'
                InputProps={{
                  classes: {
                    root: classes.inputRoot,
                    disabled: classes.disabled
                  }
                }}
              />
            </FormControl>
          </Grid>
        </Grid>

        {identificationList.map((x: any, i: number) => {
          return (
            <Grid key={i} container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl className={classes.formControl}>
                  <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                    Identification type
                  </InputLabel>
                  <Select
                    labelId='demo-simple-select-label'
                    id='demo-simple-select'
                    label='Identification Type'
                    name='identificationType'
                    disabled={disableClientData}
                    value={x.identificationType}
                    onChange={e => handleInputChangeIndentification(e, i)}

                    // InputProps={{
                    //   classes: {
                    //     root: classes.inputRoot,
                    //     disabled: classes.disabled,
                    //   },
                    // }}
                  >
                    {identificationTypes.map((ele: any) => {
                      return (
                        <MenuItem key={ele.code} value={ele.code}>
                          {ele.name}
                        </MenuItem>
                      )
                    })}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <FormControl className={classes.formControl}>
                  <TextField
                    id='standard-basic'
                    name='identificationNo'
                    disabled={disableClientData}
                    value={x.identificationNo}
                    onChange={e => handleInputChangeIndentification(e, i)}
                    label='Identification No'
                    InputProps={{
                      classes: {
                        root: classes.inputRoot,
                        disabled: classes.disabled
                      }
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={1} style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  accept='image/*'
                  className={classes.input1}
                  id={'contained-button-file' + i.toString()}
                  name='document'
                  type='file'
                  onChange={e => handleImgChange1(e, i)}
                  style={{ display: 'none' }}
                />
                <label htmlFor={'contained-button-file' + i.toString()} style={{ width: '50%', marginBottom: 0 }}>
                  {/* <Button variant="contained" color="primary" component="span" style={{ backgroundColor: '#C9DEFF' }}>
                                        <PublishIcon />
                                    </Button> */}
                </label>

                {/* </label> */}
              </Grid>

              <Grid item xs={2} style={{ display: 'flex', alignItems: 'center' }}>
                {identificationList.length !== 1 && !disableClientData && (
                  <Button
                    className='mr10'
                    onClick={() => handleRemoveClickIndentification(i)}
                    color='secondary'
                    style={{ marginLeft: '5px' }}
                  >
                    <DeleteIcon style={{ color: '#dc3545' }} />
                  </Button>
                )}
                {identificationList.length - 1 === i && !disableClientData && (
                  <Button color='primary' style={{ marginLeft: '5px' }} onClick={handleAddClickIndentification}>
                    <AddIcon />
                  </Button>
                )}
              </Grid>
            </Grid>
          )
        })}
        <Grid container spacing={3} style={{ marginBottom: '40px' }}>
          {/* <Grid
                        item
                        xs={12}
                        style={{ display: "flex", justifyContent: "flex-end" }}
                    >
                       

                            <Button
                                variant="contained"
                                color="primary"
                                style={{ marginRight: "5px" }}
                                onClick={handleSubmit}
                            >
                                Save and Next
                            </Button>
                        
                        {disableClientData &&
                         <Button
                                variant="contained"
                                color="primary"
                                onClick={openConfirmationModal}
                            >
                               Edit Details
                            </Button>}
                        
                </Grid> */}
          <Grid item xs={12}>
            <EditConfirmationModal confirmModal={confirmModal} closeConfirmationModal={closeConfirmationModal} />
          </Grid>
        </Grid>
        {/* </form> */}
      </Box>
    </Paper>
  )
}
