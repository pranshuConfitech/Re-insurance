
import * as React from 'react'
import { useEffect } from 'react'

import { useParams, useSearchParams } from 'next/navigation'

import Box from '@mui/material/Box'
import { Button } from 'primereact/button'
import Chip from '@mui/material/Chip'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Grid from '@mui/material/Grid'
import Input from '@mui/material/Input'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Select from '@mui/material/Select'
import Snackbar from '@mui/material/Snackbar'
import { makeStyles } from '@mui/styles'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import PublishIcon from '@mui/icons-material/Publish'
import MuiAlert from '@mui/lab/Alert'
import Autocomplete from '@mui/lab/Autocomplete'

import 'date-fns'
import { useFormik } from 'formik'

import * as yup from 'yup'

import { ProvidersService } from '@/services/remote-api/api/provider-services/provider.services'
import { ProviderTypeService } from '@/services/remote-api/api/master-services/provider.type.service'
import { OrganizationTypeService } from '@/services/remote-api/api/master-services/organization.type.service'
import { SpecializationService } from '@/services/remote-api/api/master-services/specialization.service'

import Asterisk from '../../shared-component/components/red-asterisk'
import { UsersService } from '@/services/remote-api/api/user-management-service/users.service'
import { EmailAvailability } from '@/services/utility'
import { BehaviorSubject, debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs'
import { Checkbox, FormControlLabel } from '@mui/material'

const providerservice = new ProvidersService()
const providertypeservice = new ProviderTypeService()
const orgtypeservice = new OrganizationTypeService()
const specsservice = new SpecializationService()
const userService = new UsersService()

const pt$ = providertypeservice.getProviderTypes()
const ot$ = orgtypeservice.getOrganizationTypes()
const ss$ = specsservice.getSpecialization({
  page: 0,
  size: 10,
  summary: true,
  active: true
})

const panRegExp = /^[a-zA-Z0-9]+$/

const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
  type: yup.string().required('Provider Type is required'),
  orgTypeCd: yup.string().required('Parent Type is required'),
  contact: yup
    .string()
    .required('Contact Number is required'),
  contractType: yup.string().required('Contract Type is required'),
  nationalSchemeContractType: yup.string().required('National Scheme Contract Type is required'),
  email: yup.string().email('Enter a valid email').required('Email is required'),
  abbreviation: yup.string().required('Abbreviation is required'),
  // taxPinNumber: yup.string().required('TAX ID is required').matches(panRegExp, 'Tax ID/PAN is not valid'),
  specializations: yup.array().min(1, 'At least one specialization is required')
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

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
}

// function useQuery1() {
//   return new URLSearchParams(useLocation().search);
// }

function Alert(props: any) {
  return <MuiAlert elevation={6} variant='filled' {...props} />
}

export default function ProviderPersonalDetailsComponent(props: any) {
  const query2 = useSearchParams()
  const params = useParams()
  const id: any = params.id
  const classes = useStyles()
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [snackbarSeverity, setSnackbarSeverity] = React.useState<'success' | 'error'>('success');

  const formik = useFormik({
    initialValues: {
      name: '',
      type: '',
      partnerId: '',
      combinationPartnerId: '',
      // taxPinNumber: '',
      serviceTaxNoOrGstNo: '',
      code: '',
      contact: '',
      email: '',
      pOrgData: '',
      parentProviderId: '',
      orgTypeCd: '',
      abbreviation: '',
      contracted: false,
      contractType: '',
      nationalSchemeContractType: '',
      specializations: [],
      ownerType: '',
      acknowledgementNo: ''
    },
    validationSchema: validationSchema,
    onSubmit: values => {
      setSubmit(true);
      if (!isAltContactError) {
        handleSubmit();
      }
    }
  })

  const [contactList, setContactList] = React.useState([{ altEmail: '', altContact: '' }])
  const [specsList, setSpecsList] = React.useState([])
  const [idErrorMsg, setIdErrorMsg] = React.useState(false)

  const [identificationList, setIdentificationList]: any = React.useState([
    {
      identificationType: '',
      identificationNo: '',
      docFormat: 'image/jpeg',
      document: ''
    }
  ])

  const [providerOwnerTypes, setProviderOwnerTypes] = React.useState([])
  const [nationalSchemeContractTypes, setNationalSchemeContractTypes] = React.useState([])
  const [contractTypes, setContractTypes] = React.useState([])

  const [identificationTypes, setIdentificationTypes] = React.useState([])
  const [providerTypes, setProviderTypes] = React.useState([])
  const [orgTypes, setOrgTypes] = React.useState([])
  const [parentProviders, setParentProviders] = React.useState([])
  const [open, setOpen] = React.useState(false)
  const [openEmailMsg, setOpenEmailMsg] = React.useState(false)
  const [isAltContactError, setAltContactError] = React.useState(false)
  const [isSubmit, setSubmit] = React.useState(false)
  const [alertMsg, setAlertMsg] = React.useState('')
  const [openSnack, setOpenSnack] = React.useState(false)

  const useObservable = (observable: any, setter: any) => {
    useEffect(() => {
      const subscription = observable.subscribe((result: any) => {
        setter(result.content)
      })

      return () => subscription.unsubscribe()
    }, [observable, setter])
  }

  useEffect(() => {
    setParentProviders(props.parentProviders)

    if (id) {
      populateData(id)
    }
  }, [props.parentProviders])

  useObservable(pt$, setProviderTypes)
  useObservable(ot$, setOrgTypes)
  useObservable(ss$, setSpecsList)

  useEffect(() => {
    setIdentificationTypes(props.identificationTypes)
  }, [props.identificationTypes])

  useEffect(() => { // Add this block
    setContractTypes(props.contractTypes)
  }, [props.contractTypes])
  useEffect(() => { // Add this block
    setNationalSchemeContractTypes(props.nationalSchemeContractTypes)
  }, [props.nationalSchemeContractTypes])
  useEffect(() => { // Add this block
    setProviderOwnerTypes(props.providerOwnerTypes)
  }, [props.providerOwnerTypes])


  const handleSubmit = async () => {
    try {
      const isCreateMode = query2.get('mode') === 'create';
      console.log("isCreateMode",isCreateMode);
      
      const isEmailConfirmed = await EmailAvailability(formik.values.email);

      if (isEmailConfirmed && isCreateMode) {
        setSnackbarMessage('Email Id Already Exist, Please use another.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
        return;
      }

      // Validate Parent Provider ID for specific orgTypeCd
      if (formik.values.orgTypeCd === 'OT117246' && !formik.values.parentProviderId) {
        setSnackbarMessage('Please fill up all required fields marked with *');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
        return;
      }

      // Validate Identification List
      const isInvalidIdentification = identificationList.some(
        (id: any) => (!id.identificationType && id.identificationNo) || (id.identificationType && !id.identificationNo)
      );
      if (isInvalidIdentification) {
        setSnackbarMessage('Please provide both Identification Type and Identification Number.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
        return;
      }

      // Construct Contact and Email Lists
      const contacts = [
        { contactNo: formik.values.contact, contactType: 'PRIMARY' },
        ...contactList.map((cnt) => ({ contactNo: cnt.altContact, contactType: 'ALTERNATE' }))
      ];

      const emailsLists = [
        { emailId: formik.values.email, contactType: 'PRIMARY' },
        ...contactList.map((cnt) => ({ emailId: cnt.altEmail, contactType: 'ALTERNATE' }))
      ];

      // Construct Payload
      const providerBasicDetails = {
        name: formik.values.name,
        type: formik.values.type,
        partnerId: formik.values.partnerId,
        combinationPartnerId: formik.values.combinationPartnerId,
        // taxPinNumber: formik.values.taxPinNumber,
        licenseNumber: formik.values.serviceTaxNoOrGstNo,
        contactNos: contacts,
        emails: emailsLists,
        orgTypeCd: formik.values.orgTypeCd,
        contractType: formik.values.contractType,
        contracted: formik.values.contracted,
        nationalSchemeContractType: formik.values.nationalSchemeContractType,
        abbreviation: formik.values.abbreviation,
        ownershipType: formik.values.ownerType,
        sourceType: "CORE_PORTAL",
        ...(identificationList.length && { identifications: identificationList }),
        ...(formik.values.specializations.length && { specializations: formik.values.specializations }),
        ...(formik.values.orgTypeCd === 'OT117246' && { parentProviderId: formik.values.parentProviderId }),
        ...(!isCreateMode && { acknowledgementNo: formik.values.acknowledgementNo || '' })
      };

      const payloadOne: any = { providerBasicDetails };

      if (isCreateMode) {
        providerservice.saveProvider(payloadOne).subscribe({
          next: (res: any) => {
            localStorage.setItem("providerId", res.id);
            // Set provider ID in parent component state
            if (props.setProviderID) {
              props.setProviderID(res.id);
            }
            setSnackbarMessage('Provider details saved successfully');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
            props.handleNext();
          },
          error: (error) => {
            console.error("Error saving provider:", error);
            setSnackbarMessage('Failed to save provider details. Please try again.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
          }
        });
      } else {
        providerservice.editProvider({ ...payloadOne, code: formik.values.code }, id, '1').subscribe({
          next: () => {
            setSnackbarMessage('Provider details updated successfully');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
            props.handleNext();
          },
          error: (error) => {
            console.error("Error updating provider:", error);
            setSnackbarMessage('Failed to update provider details. Please try again.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
          }
        });
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setSnackbarMessage('An unexpected error occurred. Please try again.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleSelectedSpecs = (event: any) => {
    formik.setFieldValue('specializations', event.target.value)
  }

  // function getStyles(name, personName, theme) {
  //   return {
  //     fontWeight:
  //       personName.indexOf(name) === -1
  //         ? theme.typography.fontWeightRegular
  //         : theme.typography.fontWeightMedium,
  //   };
  // }

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

  const handleRemoveClickContact = (index: any) => {
    const list = [...contactList]

    list.splice(index, 1)
    setContactList(list)
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
      providerservice.getProviderDetails(id).subscribe((val: any) => {
        let pcontact = ''
        let pemail = ''
        const altList: any = []
        const idlist: any = []
        let pOrg: any = {
          name: '',
          id: ''
        }

        val.providerBasicDetails.contactNos.forEach((ele: any, i: number) => {
          if (ele.contactType === 'PRIMARY') {
            pcontact = ele.contactNo
          }

          if (ele.contactType === 'ALTERNATE') {
            altList.push({
              altEmail: val.providerBasicDetails.emails[i].emailId,
              altContact: ele.contactNo
            })
          }
        })

        val.providerBasicDetails.emails.forEach((ele: any) => {
          if (ele.contactType === 'PRIMARY') {
            pemail = ele.emailId
          }
        })

        if (altList.length !== 0) {
          setContactList(altList)
        }

        val.providerBasicDetails.identifications.forEach((ele: any) => {
          idlist.push({
            identificationType: ele.identificationType,
            identificationNo: ele.identificationNo,
            docFormat: ele.docFormat,
            document: ele.document
          })
        })

        if (idlist.length !== 0) {
          setIdentificationList(idlist)
        }

        props.parentProviders.forEach((ele: any) => {
          if (ele.id === val.providerBasicDetails.parentProviderId) {
            pOrg = ele
          }
        })

        formik.setValues({
          name: val.providerBasicDetails.name,
          type: val.providerBasicDetails.type,
          partnerId: val.providerBasicDetails.partnerId,
          combinationPartnerId: val.providerBasicDetails.combinationPartnerId,
          // taxPinNumber: val.providerBasicDetails.taxPinNumber,
          serviceTaxNoOrGstNo: val?.providerBasicDetails?.licenseNumber || val?.providerOtherDetails?.serviceTaxNoOrGstNo || '',
          code: val.providerBasicDetails.code,
          contact: pcontact,
          email: pemail,
          pOrgData: pOrg,
          parentProviderId: val.providerBasicDetails.parentProviderId,
          orgTypeCd: val.providerBasicDetails.orgTypeCd,
          abbreviation: val.providerBasicDetails.abbreviation,
          contracted: val.providerBasicDetails.contracted,
          contractType: val.providerBasicDetails.contractType,
          ownerType: val.providerBasicDetails.ownershipType || val.providerBasicDetails.ownerType || '',
          nationalSchemeContractType: val.providerBasicDetails.nationalSchemeContractType || '',
          specializations: val.providerBasicDetails.specializations ? val.providerBasicDetails.specializations : [],
          acknowledgementNo: val.providerBasicDetails.acknowledgementNo || ''
        })
      })
    }
  }

  const handlePChange = (e: any, value: any) => {
    formik.setFieldValue('pOrgData', value)
    formik.setFieldValue('parentProviderId', value.id)
  }

  const handleSnackClose = (event: any, reason: any) => {
    setOpen(false)
  }

  const handleEmailSnackClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    setOpenEmailMsg(false)
  }

  const handleIDErrorClose = (event: any, reason: any) => {
    setIdErrorMsg(false)
  }

  const handleImgChange1 = (e: any, i: any) => { }

  const altContactValidation = (value: any, field = '') => {
    if (field === 'altContact') {
      return value && value.length !== 10
    } else if (field === 'altEmail') {
      return value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    }
  }

  const getAltContactErrorStatus = (value: any, field = '') => {
    return isSubmit && altContactValidation(value, field)
  }

  const getAltContactHelperTxt = (value: any, field = '') => {
    if (field === 'altContact') {
      return isSubmit && altContactValidation(value, field) ? 'Must be exactly 10 digit' : ''
    } else if (field === 'altEmail') {
      return isSubmit && altContactValidation(value, field) ? 'Enter a valid email' : ''
    }

    return ''
  }

  const s = new BehaviorSubject({})
  const observable = s.asObservable()

  const specializationDataSource$: any = (
    pageRequest: any = {
      page: 0,
      size: 10,
      summary: true,
      active: true
    }
  ) => {
    pageRequest.sort = ['rowLastUpdatedDate dsc']

    if (pageRequest.searchKey) {
      pageRequest['name'] = pageRequest.searchKey.trim()
    }

    delete pageRequest.searchKey

    return specsservice.getSpecialization(pageRequest)
  }

  const doSearch = (e: any) => {
    observable
      .pipe(
        filter(searchTerm => e && e.length > 2),
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(searchKey => {
          return specializationDataSource$({ searchKey: e, page: 0, size: 10 })
        })
      )
      .subscribe((res: any) => {
        if (res?.content?.length) {
          setSpecsList(res.content)
        }
      })
  }

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Paper elevation={0}>
      <Box p={3} my={2}>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={2800}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
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
              {/* Row 1: Provider Type, Parent Provider, Name */}
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <FormControl
                      className={classes.formControl}
                      error={formik.touched.type && Boolean(formik.errors.type)}
                      fullWidth
                    >
                      <InputLabel id='provider-type-label' style={{ marginBottom: '0px' }}>
                        Provider Type <Asterisk />
                      </InputLabel>
                      <Select
                        label='Provider Type'
                        labelId='provider-type-label'
                        name='type'
                        id='provider-type-select'
                        value={formik.values.type}
                        onChange={formik.handleChange}
                      >
                        {providerTypes.map((ele: any) => {
                          return (
                            <MenuItem key={ele.code} value={ele.code}>
                              {ele.name}
                            </MenuItem>
                          )
                        })}
                      </Select>
                    </FormControl>
                    {formik.touched.type && Boolean(formik.errors.type) && (
                      <FormHelperText>{formik.touched.type && formik.errors.type}</FormHelperText>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    {query2.get('mode') === 'edit' ? (
                      <FormControl
                        className={classes.formControl}
                        error={formik.touched.orgTypeCd && Boolean(formik.errors.orgTypeCd)}
                        fullWidth
                      >
                        <InputLabel id='parent-provider-label' style={{ marginBottom: '0px' }}>
                          Parent Provider <Asterisk />
                        </InputLabel>
                        <Select
                          label='Parent Provider'
                          labelId='parent-provider-label'
                          name='orgTypeCd'
                          id='parent-provider-select'
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
                        <InputLabel id='parent-provider-label' style={{ marginBottom: '0px' }}>
                          Parent Provider <Asterisk />
                        </InputLabel>
                        <Select
                          label='Parent Provider'
                          labelId='parent-provider-label'
                          name='orgTypeCd'
                          id='parent-provider-select'
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
                  <Grid item xs={12} sm={4}>
                    <TextField
                      id='provider-name'
                      name='name'
                      value={formik.values.name}
                      onChange={formik.handleChange}
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
                </Grid>
              </Grid>

              {/* Conditional Parent Provider Autocomplete - Full Width */}
              {formik.values.orgTypeCd === 'OT117246' && (
                <Grid item xs={12}>
                  <Autocomplete
                    id='parent-provider-autocomplete'
                    options={parentProviders}
                    getOptionLabel={(option: any) => option.name}
                    value={formik.values.pOrgData}
                    className={classes.autocompleteField}
                    renderInput={params => <TextField {...params} label='Parent Provider' />}
                    onChange={handlePChange}
                  />
                </Grid>
              )}

              {/* Row 2: Abbreviation, Contact No, Email ID */}
              <Grid item xs={12} style={{ marginTop: '3px' }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      id='provider-abbreviation'
                      name='abbreviation'
                      value={formik.values.abbreviation}
                      onChange={formik.handleChange}
                      error={formik.touched.abbreviation && Boolean(formik.errors.abbreviation)}
                      helperText={formik.touched.abbreviation && formik.errors.abbreviation}
                      className={classes.textField}
                      label={
                        <span>
                          Abbreviation <Asterisk />
                        </span>
                      }
                      fullWidth
                    />
                  </Grid>
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

              {/* Row 3: Partner ID, Combination Partner ID, Tax ID/PAN */}
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
                  <Grid item xs={12} sm={4}>
                    <FormControlLabel
                      label="Contracted"
                      control={
                        <Checkbox
                          name="contracted"
                          checked={formik.values.contracted}
                          onChange={(e) => {
                            formik.setFieldValue("contracted", e.target.checked);
                          }}
                        />
                      }
                    />
                  </Grid>

                  {/* PIN / TIN moved to Other Details > Finance section */}
                </Grid>

                {/* Row 4: License / Registration No */}
                <Grid item xs={12} style={{ marginTop: '10px' }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        id='license-registration-no'
                        name='serviceTaxNoOrGstNo'
                        type='text'
                        onKeyPress={event => {
                          if (!/[a-zA-Z0-9]/.test(event.key)) {
                            event.preventDefault()
                          }
                        }}
                        value={formik.values.serviceTaxNoOrGstNo}
                        onChange={formik.handleChange}
                        className={classes.textField}
                        label='License / Registration No'
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                </Grid>

                {/* Contract Type, National Scheme Contract Type, Owner Type */}
                <Grid item xs={12}>
                  <Grid container spacing={2} style={{ marginTop: '10px' }}>
                    <Grid item xs={12} sm={4}>
                      <FormControl
                        className={classes.formControl}
                        error={formik.touched.contractType && Boolean(formik.errors.contractType)}
                        fullWidth
                      >
                        <InputLabel id='contract-type-select-label' style={{ marginBottom: '0px' }}>
                          Contract Type
                        </InputLabel>
                        <Select
                          label='Contract Type'
                          labelId='contract-type-select-label'
                          name='contractType'
                          id='contract-type-select'
                          value={formik.values.contractType}
                          onChange={formik.handleChange}
                        >
                          {contractTypes.map((ele: any) => {
                            return (
                              <MenuItem key={ele.code} value={ele.code}>
                                {ele.name}
                              </MenuItem>
                            )
                          })}
                        </Select>
                      </FormControl>
                      {formik.touched.contractType && Boolean(formik.errors.contractType) && (
                        <FormHelperText>{formik.touched.contractType && formik.errors.contractType}</FormHelperText>
                      )}
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <FormControl
                        className={classes.formControl}
                        error={formik.touched.nationalSchemeContractType && Boolean(formik.errors.nationalSchemeContractType)}
                        fullWidth
                      >
                        <InputLabel id='national-scheme-contract-type-select-label' style={{ marginBottom: '0px' }}>
                          National Scheme Contract Type
                        </InputLabel>
                        <Select
                          label='National Scheme Contract Type'
                          labelId='national-scheme-contract-type-select-label'
                          name='nationalSchemeContractType'
                          id='national-scheme-contract-type-select'
                          value={formik.values.nationalSchemeContractType}
                          onChange={formik.handleChange}
                        >
                          {nationalSchemeContractTypes.map((ele: any) => {
                            return (
                              <MenuItem key={ele.code} value={ele.code}>
                                {ele.name}
                              </MenuItem>
                            )
                          })}
                        </Select>
                      </FormControl>
                      {formik.touched.nationalSchemeContractType && Boolean(formik.errors.nationalSchemeContractType) && (
                        <FormHelperText>{formik.touched.nationalSchemeContractType && formik.errors.nationalSchemeContractType}</FormHelperText>
                      )}
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <FormControl
                        className={classes.formControl}
                        error={formik.touched.ownerType && Boolean(formik.errors.ownerType)}
                        fullWidth
                      >
                        <InputLabel id='owner-type-select-label' style={{ marginBottom: '0px' }}>
                          Ownership Type
                        </InputLabel>
                        <Select
                          label='Ownership Type'
                          labelId='owner-type-select-label'
                          name='ownerType'
                          id='owner-type-select'
                          value={formik.values.ownerType}
                          onChange={formik.handleChange}
                        >
                          {providerOwnerTypes.map((ele: any) => {
                            return (
                              <MenuItem key={ele.code} value={ele.code}>
                                {ele.name}
                              </MenuItem>
                            )
                          })}
                        </Select>
                      </FormControl>
                      {formik.touched.ownerType && Boolean(formik.errors.ownerType) && (
                        <FormHelperText>{formik.touched.ownerType && formik.errors.ownerType}</FormHelperText>
                      )}
                    </Grid>
                  </Grid>
                </Grid>

              </Grid>

              {/* Provider Code (Edit Mode Only) - Full Width */}
              {query2.get('mode') === 'edit' && (
                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        id='provider-code'
                        name='code'
                        value={formik.values.code}
                        label='Provider Code'
                        className={classes.textField}
                        InputProps={{
                          readOnly: true,
                        }}
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                </Grid>
              )}

              {/* Specializations - Full Width */}
              <Grid item xs={12} style={{ marginTop: '10px' }}>
                <FormControl
                  style={{ width: '100%' }}
                  className={classes.formControl}
                  error={formik.touched.specializations && Boolean(formik.errors.specializations)}
                >
                  <Autocomplete
                    id="specializations-autocomplete"
                    options={specsList}
                    getOptionLabel={(option: any) => option?.name || ""}
                    onChange={(event, value) => formik.setFieldValue("specializations", value)}
                    multiple
                    value={formik.values.specializations}
                    onInputChange={(event, value) => doSearch(value)}
                    className={classes.autocompleteField}
                    renderInput={(params) => (
                      <TextField {...params}
                        label={
                          <span>
                            Specializations <Asterisk />
                          </span>
                        }
                        placeholder="Select Specializations"
                        error={formik.touched.specializations && Boolean(formik.errors.specializations)}
                        helperText={formik.touched.specializations && formik.errors.specializations} />
                    )}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </div>

          {/* Alternate Contact Information Section */}
          <div className={classes.formSection}>

            {contactList.map((x, i) => {
              return (
                <Grid key={`providerPersonalGridContactList-${i}`} container spacing={2} className={classes.formGrid} style={{ marginBottom: '16px' }}>
                  <Grid item xs={12} sm={4}>
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
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      id={`alt-email-${i}`}
                      name='altEmail'
                      value={x.altEmail}
                      onChange={e => handleInputChangeContact(e, i)}
                      label='Alt. Email ID'
                      error={getAltContactErrorStatus(x.altEmail, 'altEmail')}
                      helperText={getAltContactHelperTxt(x.altEmail, 'altEmail')}
                      className={classes.textField}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={4} style={{ display: 'flex', alignItems: 'center' }}>
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

          {/* Identification Section */}
          <div className={classes.formSection}>

            {identificationList.map((x: any, i: number) => {
              return (
                <Grid key={`providerPersonalGridIdentificationList-${i}`} container spacing={2} className={classes.formGrid} style={{ marginBottom: '16px' }}>
                  <Grid item xs={12} sm={4}>
                    <FormControl className={classes.formControl} fullWidth>
                      <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                        Identification Type
                      </InputLabel>
                      <Select
                        label='Identification Type'
                        labelId='demo-simple-select-label'
                        id='demo-simple-select'
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
                  <Grid item xs={12} sm={4}>
                    <TextField
                      id='standard-basic'
                      name='identificationNo'
                      value={x.identificationNo}
                      onChange={e => handleInputChangeIndentification(e, i)}
                      label='Identification No'
                      className={classes.textField}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={4} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                      <Button color='primary'>
                        <PublishIcon />
                      </Button>
                    </label>
                    {identificationList.length !== 1 && (
                      <Button
                        className='mr10 p-button-danger'
                        onClick={() => handleRemoveClickIndentification(i)}
                        color='secondary'
                        style={{ marginRight: '2px' }}
                      >
                        <DeleteIcon />
                      </Button>
                    )}
                    {identificationList.length - 1 === i && (
                      <Button color='primary' onClick={handleAddClickIndentification}>
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
                <Button color='primary' style={{ marginRight: '5px' }} type='submit'>
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
    </Paper >
  )
}
