import * as React from 'react'
import { useEffect } from 'react'

import { useSearchParams } from 'next/navigation'

import Box from '@mui/material/Box'
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
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto'
import DeleteIcon from '@mui/icons-material/Delete'
import PublishIcon from '@mui/icons-material/Publish'
import MuiAlert from '@mui/lab/Alert'

// import { KeyboardDatePicker } from '@material-ui/pickers';
import Autocomplete from '@mui/lab/Autocomplete'

// import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

import 'date-fns'

import type { AlertProps } from '@mui/material'
import { Button } from '@mui/material'

import type { Observable } from 'rxjs'

import { ClientTypeService, OrganizationTypeService } from '@/services/remote-api/api/master-services'

import Asterisk from '../../shared-component/components/red-asterisk'
import { EmailAvailability } from '@/services/utility'

const organizationservice = new OrganizationTypeService()
const clienttypeervice = new ClientTypeService()

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
  }
}))

// function useQuery1() {
//   return new URLSearchParams(useLocation().search);
// }

export default function BasicDetailsStepComponent(props: any) {
  const classes = useStyles()
  const query = useSearchParams()

  const { clientDetail } = props
  const [organizationTypes, setOrganizationTypes] = React.useState([])
  const [clientTypes, setClientTypes] = React.useState([])
  const [groupTypes, setGroupTypes] = React.useState([])
  const [prefixes, setPrefixes] = React.useState([])
  const [suffixes, setSuffixes] = React.useState([])
  const [openRequired, setOpenRequired] = React.useState(false)
  const [idErrorMsg, setIdErrorMsg] = React.useState(false)
  const [checkContact, setCheckContact] = React.useState(false)
  const [openEmailMsg, setOpenEmailMsg] = React.useState(false)
  const [panCheck, setPanCheck] = React.useState(false)
  const [checkDuplicateContact, setCheckDuplicateContact] = React.useState(false)

  const [contactList, setContactList] = React.useState([{ altEmail: '', altContact: '' }])
  const [selectedDate, setSelectedDate] = React.useState(new Date())
  const [selectedImgLink, setSelectedImgLink] = React.useState('')

  const [identificationList, setIdentificationList]: any = React.useState([
    {
      identificationType: '',
      identificationNo: '',
      docFormat: 'image/jpeg',
      document: props.imgF
    }
  ])

  const [identificationTypes, setIdentificationTypes] = React.useState([])
  const [parentClients, setParentClients] = React.useState([])

  const useObservable = (observable: Observable<any>, setter: any, type = '') => {
    useEffect(() => {
      const subscription = observable.subscribe(result => {
        if (type === 'clientType') {
          const clType = result.content.filter((ct: any) => ct.name === clientDetail.clientTypeName)

          if (clType.length > 0) {
            setClientDetail({
              ...clientDetail,
              clientTypeCd: clType[0].code
            })
          }
        }

        setter(result.content)
      })

      return () => subscription.unsubscribe()
    }, [observable, setter])
  }

  useObservable(org$, setOrganizationTypes)
  useObservable(ct$, setClientTypes, 'clientType')

  function Alert(props: React.JSX.IntrinsicAttributes & AlertProps) {
    return <MuiAlert elevation={6} variant='filled' {...props} />
  }

  function validateEmail(email: any) {
    const re = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/

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
  useEffect(() => {
    if (!props.clientDetail.clientTypeName) {
      const clientTypeDetails: any = clientTypes.filter((ct: any) => ct.code == clientDetail.clientTypeCd)

      if (clientTypeDetails.length > 0) {
        setClientDetail({
          ...clientDetail,
          clientTypeName: clientTypeDetails[0].name
        })
      }
    }
  }, [props.clientDetail])

  const setName = (value: string, pos = '') => {
    console.log(value)
    if (!pos) return value

    if (pos === 'a') {
      return value ? value + ' ' : ''
    } else {
      return value ? ' ' + value : ''
    }
  }

  const handleChange = (event: any) => {
    const { name, value } = event.target

    console.log(name, value)
    let dname = {}

    if (clientDetail.clientTypeName !== 'Group') {
      if (name === 'firstName') {
        dname = {
          displayName: setName(value) + setName(clientDetail.middleName, 'b') + setName(clientDetail.lastName, 'b')
        }
      } else if (name === 'middleName') {
        dname = {
          displayName: setName(clientDetail.firstName, 'a') + setName(value) + setName(clientDetail.lastName, 'b')
        }
      } else if (name === 'lastName') {
        dname = {
          displayName: setName(clientDetail.firstName, 'a') + setName(clientDetail.middleName, 'a') + setName(value)
        }
      }
    } else if (name === 'firstName') {
      dname = { displayName: value }
    }

    // console.log(value)
    let clientTypeName = ''

    if (name === 'clientTypeCd') {
      const clType: any = clientTypes.filter((ct: any) => ct.code === value)

      if (clType.length > 0) {
        clientTypeName = clType[0].name
      }
    }

    if (name === 'panNumber') {
      setClientDetail({
        ...clientDetail,
        [name]: value.toUpperCase(),
        ...(name === 'clientTypeCd' && { clientTypeName }),
        ...dname
      })
    } else if (name !== 'panNumber') {
      setClientDetail({
        ...clientDetail,
        [name]: value,
        ...(name === 'clientTypeCd' && { clientTypeName }),
        ...dname
      })
    }
  }

  const handleSubmit = async (event: any) => {
    if (clientDetail.email) {
      if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(clientDetail.email)) {
        setCheckContact(true)

        return
      }

      const isEmailConfirmed = await EmailAvailability(clientDetail.email)

      if (isEmailConfirmed && query.get('mode') === 'create') {
        setOpenEmailMsg(true)

        return // Stop execution if email is confirmed
      }
    }

    if (
      clientDetail.firstName == '' ||
      clientDetail.displayName == '' ||
      clientDetail.panNumber == '' ||
      clientDetail.contact == '' ||
      clientDetail.firstName == null ||
      clientDetail.clientTypeCd == '' ||
      clientDetail.clientTypeCd == null ||
      clientDetail.displayName == null ||
      clientDetail.panNumber == null ||
      clientDetail.contact == null
    ) {
      setOpenRequired(true)

      return
    }

    if (!/^[a-zA-Z0-9]+$/i.test(clientDetail.panNumber)) {
      setPanCheck(true)

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
      identificationList.forEach((val: { identificationType: string; identificationNo: string }) => {
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

    /** Duplicate Contact no & Emial Check */
    const duplicateContactList = contactList.filter(ctList => {
      return (
        ctList.altContact === clientDetail.contact || (clientDetail.email && ctList.altEmail === clientDetail.email)
      )
    })

    if (duplicateContactList.length > 0) {
      setCheckDuplicateContact(true)

      return
    }

    /** Alternate Contact & email validation */
    for (let i = 0; i < contactList.length; i++) {
      const v = contactList[i]

      if (v.altContact && v.altContact.length !== 10) {
        setCheckContact(true)

        return
      } else if (v.altEmail && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(v.altEmail)) {
        setCheckContact(true)

        return
      }
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
        prospectId: clientDetail.prospectId ? clientDetail.prospectId : null,
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

    if (clientDetail.clientTypeName === 'Group') {
      if (clientDetail.groupTypeCd === '') {
        setOpenRequired(true)

        return
      }

      payloadOne['clientBasicDetails']['groupTypeCd'] = clientDetail.groupTypeCd
    }

    if (clientDetail.clientTypeName === 'Retail') {
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

    if (query.get('mode') === 'edit') {
      payloadOne['clientBasicDetails']['code'] = clientDetail.code
    }

    props.handleSubmitStepOne(payloadOne)
  }

  //Contact list functions
  const handleInputChangeContact = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, index: number) => {
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
    props.setSelectedDate(date)
    const timestamp = new Date(date).getTime()

    setClientDetail({
      ...clientDetail,
      dataOfIncorporation: new Date(date).getTime()
    })
  }

  const handleImgChange = (e: any) => {
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
      props.setUploadSuccess(true)
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
    props.setUploadSuccess(true)
  }

  //Indentification Type
  const handleInputChangeIndentification = (e: any, index: number) => {
    const { name, value } = e.target
    const list: any = [...identificationList]

    list[index][name] = value
    setIdentificationList(list)
  }

  const handleRemoveClickIndentification = (index: number) => {
    const list = [...identificationList]

    list.splice(index, 1)
    setIdentificationList(list)
  }

  const handleAddClickIndentification = () => {
    setIdentificationList([
      ...identificationList,
      {
        identificationType: '',
        identificationNo: ''
      }
    ])
  }

  const setClientDetail = (e: any) => {
    props.setClientDetail(e)
  }

  const handleClose = (e: any) => {
    props.handleClose(e)
  }

  const handlePChange = (e: any, value: { id: any }) => {
    setClientDetail({
      ...clientDetail,
      pOrgData: value,
      parentclientId: value.id
    })
  }

  const validatePanNumber = (panNumber: string) => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/

    return panRegex.test(panNumber)
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

  const handlePANCheckClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    setPanCheck(false)
  }

  const handleDuplicateContactCheckClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    setCheckDuplicateContact(false)
  }

  const handleEmailSnackClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    setOpenEmailMsg(false)
  }

  return (
    <Paper elevation={0}>
      <Box p={3} my={2}>
        <Snackbar open={openEmailMsg} autoHideDuration={6000} onClose={handleEmailSnackClose}>
          <Alert onClose={handleEmailSnackClose} severity='error'>
            Email Id Already Exist, Please use another.
          </Alert>
        </Snackbar>
        <Snackbar open={panCheck} autoHideDuration={3000} onClose={handlePANCheckClose}>
          <Alert onClose={handlePANCheckClose} severity='error'>
            Please enter a valid PAN number (only alphanumeric allowed)
          </Alert>
        </Snackbar>
        <Snackbar open={openRequired} autoHideDuration={3000} onClose={handleSnackClose}>
          <Alert onClose={handleSnackClose} severity='error'>
            Please fill up all required fields marked with *
          </Alert>
        </Snackbar>
        <Snackbar open={checkContact} autoHideDuration={6000} onClose={handleContactCheckClose}>
          <Alert onClose={handleContactCheckClose} severity='error'>
            Please enter valid Contact number/Email id
          </Alert>
        </Snackbar>
        <Snackbar open={checkDuplicateContact} autoHideDuration={6000} onClose={handleDuplicateContactCheckClose}>
          <Alert onClose={handleDuplicateContactCheckClose} severity='error'>
            Alternate contact/Email cant be same with the priamry contact/email
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
                  return <FormControlLabel key={ele.code} value={ele.code} control={<Radio />} label={ele.name} />
                })}
              </RadioGroup>
            </FormControl>
          </Grid>
        </Grid>
        <Grid container spacing={3} style={{ marginBottom: '20px' }}>
          {clientDetail.clientTypeName === 'Group' && (
            <div style={{ display: 'flex', gap: 70 }}>
              <Grid item xs={12} sm={6} md={4} style={{ marginBottom: '20px' }}>
                <FormControl className={classes.formControl}>
                  <InputLabel id='demo-simple-select-label' style={{ marginBottom: '10px' }}>
                    Group Type <Asterisk />
                  </InputLabel>
                  <Select
                    labelId='demo-simple-select-label'
                    name='groupTypeCd'
                    label='Group Type'
                    id='demo-simple-select'
                    value={clientDetail.groupTypeCd}
                    style={{ width: 200 }}
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
                  <InputLabel id='demo-simple-select-label' style={{ marginBottom: '10px' }}>
                    Organization type <Asterisk />
                  </InputLabel>
                  <Select
                    labelId='demo-simple-select-label'
                    id='demo-simple-select'
                    label='Organization Type'
                    name='orgTypeCd'
                    value={clientDetail.orgTypeCd}
                    style={{ width: 200 }}
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
            </div>
          )}
          {clientDetail.clientTypeName === 'Group' && clientDetail.orgTypeCd === 'OT117246' ? (
            <Grid item xs={12} sm={6} md={4}>
              <Autocomplete
                id='combo-box-demo'
                options={parentClients}
                getOptionLabel={(option: any) => option.name}
                value={clientDetail.pOrgData}
                style={{ width: '50%' }}
                renderInput={params => <TextField {...params} label='Parent Organization*' />}
                onChange={handlePChange}
              />
            </Grid>
          ) : (
            <div />
          )}
        </Grid>
        <Grid container spacing={3} style={{ marginBottom: '20px' }} />

        <Box pb={3}>
          <Divider />
        </Box>

        {clientDetail.clientTypeName === 'Group' ? (
          <Grid container spacing={3} style={{ marginBottom: '20px' }}>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl className={classes.formControl}>
                <TextField
                  size='small'
                  id='standard-basic'
                  name='firstName'
                  value={clientDetail.firstName}
                  onChange={handleChange}
                  label={
                    <span>
                      Name <Asterisk />
                    </span>
                  }
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl className={classes.formControl}>
                <TextField
                  id='standard-basic'
                  name='displayName'
                  value={clientDetail.displayName}
                  onChange={handleChange}
                  label={
                    <span>
                      Display Name <Asterisk />
                    </span>
                  }
                />
              </FormControl>
            </Grid>
          </Grid>
        ) : (
          <div>
            <Grid container spacing={3} style={{ marginBottom: '20px' }}>
              <Grid item xs={12} sm={6} md='auto'>
                <FormControl style={{ minWidth: 'content' }}>
                  <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                    Prefix
                  </InputLabel>
                  <Select
                    labelId='demo-simple-select-label'
                    name='prefixCd'
                    label='Prefix'
                    value={clientDetail.prefixCd}
                    style={{ width: 100 }}
                    onChange={handleChange}
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
              <Grid item xs={12} sm={6} md>
                <FormControl className={classes.formControl}>
                  <TextField
                    id='standard-basic'
                    name='firstName'
                    label={
                      <span>
                        First Name <Asterisk />
                      </span>
                    }
                    value={clientDetail.firstName}
                    onChange={handleChange}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md>
                <FormControl className={classes.formControl}>
                  <TextField
                    id='standard-basic'
                    name='middleName'
                    value={clientDetail.middleName}
                    onChange={handleChange}
                    label='Middle Name'
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md>
                <FormControl className={classes.formControl}>
                  <TextField
                    id='standard-basic'
                    name='lastName'
                    value={clientDetail.lastName}
                    onChange={handleChange}
                    label={
                      <span>
                        Last Name <Asterisk />
                      </span>
                    }
                  />
                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={3} style={{ marginBottom: '20px' }}>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl className={classes.formControl}>
                  <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                    Suffix
                  </InputLabel>
                  <Select
                    labelId='demo-simple-select-label'
                    name='suffixCd'
                    label='Suffix'
                    value={clientDetail.suffixCd}
                    onChange={handleChange}
                  >
                    {suffixes.map((ele: any) => {
                      return (
                        <MenuItem key={ele.id} value={ele.id}>
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
                    value={clientDetail.displayName}
                    onChange={handleChange}
                    label={
                      <span>
                        Display Name <Asterisk />
                      </span>
                    }
                  />
                </FormControl>
              </Grid>
            </Grid>
          </div>
        )}
        <Grid container spacing={3} style={{ marginBottom: '20px' }}>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl className={classes.formControl}>
              <TextField
                id='standard-basic'
                type='text'
                onKeyPress={event => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault()
                  }
                }}
                name='contact'
                value={clientDetail.contact}
                onChange={handleChange}
                label={
                  <span>
                    Contact No <Asterisk />
                  </span>
                }
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl className={classes.formControl}>
              <TextField
                id='standard-basic'
                name='email'
                value={clientDetail.email}
                onChange={handleChange}
                label='Email id'
              />
            </FormControl>
          </Grid>
          {query.get('mode') === 'edit' ? (
            <Grid item xs={12} sm={6} md={4}>
              <FormControl className={classes.formControl}>
                <TextField
                  id='standard-basic'
                  name='code'
                  value={clientDetail.code}
                  onChange={handleChange}
                  label='Client Code'
                  disabled
                />
              </FormControl>
            </Grid>
          ) : null}
        </Grid>
        {contactList.map((x, i) => {
          return (
            <Grid container spacing={3} style={{ marginBottom: '20px' }} key={i}>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl className={classes.formControl}>
                  <TextField
                    id='standard-basic'
                    type='text'
                    onKeyPress={event => {
                      if (!/[0-9]/.test(event.key)) {
                        event.preventDefault()
                      }
                    }}
                    name='altContact'
                    value={x.altContact}
                    onChange={e => handleInputChangeContact(e, i)}
                    label='Alt. Contact No'
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl className={classes.formControl}>
                  <TextField
                    id='standard-basic'
                    name='altEmail'
                    value={x.altEmail}
                    onChange={e => handleInputChangeContact(e, i)}
                    label='Alt. Email id'
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4} style={{ display: 'flex', alignItems: 'center' }}>
                {contactList.length !== 1 && (
                  <Button
                    className='mr10 p-button-danger'
                    onClick={() => handleRemoveClickContact(i)}
                    variant='contained'
                    color='secondary'
                    style={{ marginRight: '5px' }}
                  >
                    <DeleteIcon />
                  </Button>
                )}
                {contactList.length - 1 === i && (
                  <Button variant='contained' color='primary' onClick={handleAddClickContact}>
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
                value={clientDetail.incorporationNumber}
                onChange={handleChange}
                label='Incorporation No'
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl className={classes.formControl}>
              {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  views={['year', 'month', 'date']}
                  variant="inline"
                  format="dd/MM/yyyy"
                  margin="normal"
                  id="date-picker-inline"
                  autoOk={true}
                  label="Date Of Incorporation"
                  maxDate={new Date()}
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
                  label='Date Of Incorporation'
                  value={selectedDate}
                  onChange={handleDateChange}
                  maxDate={new Date()}
                  renderInput={params => (
                    <TextField {...params} margin='normal' style={{ marginBottom: '0px' }} variant='outlined' />
                  )}
                />
              </LocalizationProvider>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl className={classes.formControl}>
              <TextField
                style={{ minWidth: 240 }}
                id='standard-basic'
                name='countryOfIncorporation'
                onInput={(e: any) => {
                  e.target.value = e.target.value.replace(/[^a-zA-Z]/g, '')
                }}
                value={clientDetail.countryOfIncorporation}
                onChange={handleChange}
                label='Country of Incorporation'
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
                value={clientDetail.policeStation}
                onChange={handleChange}
                label='Police Station'
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <FormControl className={classes.formControl}>
              <TextField
                id='standard-basic'
                name='websiteUrl'
                value={clientDetail.websiteUrl}
                onChange={handleChange}
                label='Website URL'
              />
            </FormControl>
          </Grid>
          <Grid item xs={1}>
            <span>Profile Picture</span>
            <div
              style={{
                border: '1px solid',
                marginBottom: '8px',
                alignItems: 'center',
                height: '105px',
                width: '105px',
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
              <Button variant='contained' color='primary' component='span'>
                <AddAPhotoIcon />
              </Button>
            </label>
          </Grid>
        </Grid>
        <Grid container spacing={3} style={{ marginBottom: '20px' }}>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl className={classes.formControl}>
              <TextField
                id='standard-basic'
                name='partnerNumber'
                value={clientDetail.partnerNumber}
                onChange={handleChange}
                label='Partner No'
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl className={classes.formControl}>
              <TextField
                style={{ minWidth: 220 }}
                id='standard-basic'
                name='combinationPartnerId'
                value={clientDetail.combinationPartnerId}
                onChange={handleChange}
                label='Combination Partner No.'
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl className={classes.formControl}>
              <TextField
                id='standard-basic'
                name='panNumber'
                value={clientDetail.panNumber}
                error={clientDetail.panNumber.length > 9 && !validatePanNumber(clientDetail.panNumber)}
                helperText={
                  clientDetail.panNumber.length > 9 && !validatePanNumber(clientDetail.panNumber)
                    ? 'Invalid PAN number'
                    : ''
                }
                onChange={handleChange}
                label={
                  <span>
                    PAN No. <Asterisk />
                  </span>
                }
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
                value={clientDetail.gstNo}
                onChange={handleChange}
                label='GST No.'
              />
            </FormControl>
          </Grid>
        </Grid>

        {identificationList.map((x: any, i: number) => {
          return (
            <Grid container spacing={3} key={i}>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl className={classes.formControl}>
                  <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                    Identification Type
                  </InputLabel>
                  <Select
                    labelId='demo-simple-select-label'
                    id='demo-simple-select'
                    label='Identification Type'
                    name='identificationType'
                    value={x.identificationType}
                    onChange={e => handleInputChangeIndentification(e, i)}
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
              <Grid item xs={12} sm={6} md={3} container alignItems='flex-end'>
                <FormControl style={{ flex: 1 }} className='mr-2'>
                  <TextField
                    id='standard-basic'
                    name='identificationNo'
                    value={x.identificationNo}
                    onChange={e => handleInputChangeIndentification(e, i)}
                    label='Identification No'
                  />
                </FormControl>
                {/* </Grid>
              <Grid item xs={1} style={{ display: 'flex', alignItems: 'center' }}> */}
                <input
                  accept='image/*'
                  className={classes.input1}
                  id={'contained-button-file' + i.toString()}
                  name='document'
                  type='file'
                  onChange={e => handleImgChange1(e, i)}
                  style={{ display: 'none' }}
                />
                <label htmlFor={'contained-button-file' + i.toString()} style={{ marginBottom: 0 }}>
                  <Button variant='contained' color='primary' component='span'>
                    <PublishIcon />
                  </Button>
                </label>

                {/* </label> */}
              </Grid>

              <Grid item xs={12} sm={12} md={3} container alignItems='flex-end'>
                {identificationList.length !== 1 && (
                  <Button
                    className='mr10 p-button-danger'
                    onClick={() => handleRemoveClickIndentification(i)}
                    variant='contained'
                    color='secondary'
                    style={{ marginLeft: '5px' }}
                  >
                    <DeleteIcon />
                  </Button>
                )}
                {identificationList.length - 1 === i && (
                  <Button
                    variant='contained'
                    color='primary'
                    style={{ marginLeft: '5px' }}
                    onClick={handleAddClickIndentification}
                  >
                    <AddIcon />
                  </Button>
                )}
              </Grid>
            </Grid>
          )
        })}
        <Grid container spacing={3} className='p-2'>
          <Grid item xs={12} container justifyContent='flex-end'>
            <Button variant='contained' color='primary' style={{ marginRight: '5px' }} onClick={handleSubmit}>
              Save and Next
            </Button>
            <Button variant='text' color='primary' className='p-button-text' onClick={handleClose}>
              Cancel
            </Button>
          </Grid>
        </Grid>
        {/* </form> */}
      </Box>
    </Paper>
  )
}
