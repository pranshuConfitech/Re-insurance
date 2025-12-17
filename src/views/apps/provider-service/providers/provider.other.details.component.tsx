import * as React from 'react'

import { useEffect } from 'react'

import { useParams, useRouter, useSearchParams } from 'next/navigation'

import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Select from '@mui/material/Select'
import { makeStyles } from '@mui/styles'
import TextField from '@mui/material/TextField'
import AddIcon from '@mui/icons-material/Add'
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto'
import DeleteIcon from '@mui/icons-material/Delete'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Typography from '@mui/material/Typography'

// import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
// import 'date-fns';
import { useFormik } from 'formik'

// import { Button } from '@mui/material'
import { Button } from 'primereact/button'

import { ProvidersService } from '@/services/remote-api/api/provider-services/provider.services'
import { StateService } from '@/services/remote-api/api/master-services/state.service'
import { CountryService } from '@/services/remote-api/api/master-services/country.service'
import { BankService } from '@/services/remote-api/api/master-services/agent.bank.service'

// import { Button } from 'primereact/button';

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
    fontWeight: 600,
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
  }
}))

const providerservice = new ProvidersService()
const stateservice = new StateService()
const countryservice = new CountryService()
const bankservice = new BankService()

const MAX_UPLOAD_SIZE = 1.5 * 1024 * 1024 // 1.5 MB

const cs$ = countryservice.getCountryList()

// function useQuery1() {
//     return new URLSearchParams(useLocation().search);
// }

export default function ProviderOtherDetailsComponent(props: any) {
  const classes = useStyles()
  const query2 = useSearchParams()
  const history = useRouter()
  const params = useParams()
  const id: any = params.id

  const formik = useFormik({
    initialValues: {
      // licenseCode: '',
      licenseCountry: '',
      licenseState: '',
      serviceTaxNoOrGstNo: '',
      taxPinNumber: '',
      taxonomyCode: '',
      inaugurationDate: 0,
      inaugurationCountry: '',
      inaugurationState: '',
      websiteUrl: '',
      profilePictureDocBase64: '',
      profilePictureFileFormat: 'image/jpeg',
      enumerationDate: 0,
      npi: '',
      otherNpi: ''
    },

    // validationSchema: validationSchema,
    onSubmit: values => {
      handleSubmitStepThree()
    }
  })

  const [selectedImgLink, setSelectedImgLink] = React.useState(
    'data:image/jpeg;base64,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'
  )

  const [countries, setCountries] = React.useState<any[]>([])
  const [ingStates, setIngStates]: any = React.useState([])
  const [licStates, setLicStates]: any = React.useState([])

  const [banks, setBanks] = React.useState<any[]>([])
  const [branches, setBranches] = React.useState<{ [key: number]: any[] }>({})

  const [bankList, setBankList] = React.useState([
    {
      bankAccountHolderName: '',
      bankId: '',
      bankName: '',
      branchId: '',
      branchName: '',
      branchCode: '',
      accountNo: ''
    }
  ])

  const [selectedInagurationDate, setSelectedInagurationDate] = React.useState(new Date())
  const [selectedEnumerationdate, setSelectedEnumerationdate] = React.useState(new Date())
  const [providerId, setProviderId] = React.useState<any>(null)
  const [previewOpen, setPreviewOpen] = React.useState(false)
  const [imageError, setImageError] = React.useState(false)
  const [imageErrorMsg, setImageErrorMsg] = React.useState('')
  const [pendingInaugurationState, setPendingInaugurationState] = React.useState<string>('')
  const [pendingInaugurationCountryCode, setPendingInaugurationCountryCode] = React.useState<string>('')

  React.useEffect(() => {
    setProviderId(localStorage.getItem("providerId"))
  }, []);

  const handleInagurationDateChange = (date: any) => {
    setSelectedInagurationDate(date)
    const timestamp = new Date(date).getTime()

    formik.setFieldValue('inaugurationDate', timestamp)
  }

  const handleEnumerationDateChange = (date: any) => {
    setSelectedEnumerationdate(date)
    const timestamp = new Date(date).getTime()

    formik.setFieldValue('enumerationDate', timestamp)
  }

  const useObservable = (observable: any, setter: any) => {
    useEffect(() => {
      const subscription = observable.subscribe((result: any) => {
        setter(result.content)
      })

      return () => subscription.unsubscribe()
    }, [observable, setter])
  }

  useObservable(cs$, setCountries)

  const getBranchList = (bankId: string, index: number) => {
    if (!bankId) return
    bankservice.getBranchList(bankId).subscribe((result: any) => {
      let branchData: any[] = []
      if (Array.isArray(result)) {
        branchData = result
      } else if (result && Array.isArray(result.content)) {
        branchData = result.content
      } else if (result && Array.isArray(result.data)) {
        branchData = result.data
      }
      setBranches(prev => ({
        ...prev,
        [index]: branchData
      }))
    })
  }

  React.useEffect(() => {
    bankservice.getBankList().subscribe((result: any) => {
      let bankData: any[] = []
      if (Array.isArray(result)) {
        bankData = result
      } else if (result && Array.isArray(result.content)) {
        bankData = result.content
      } else if (result && Array.isArray(result.data)) {
        bankData = result.data
      } else {
        console.error('Unexpected banks response structure:', result)
      }
      setBanks(bankData)
    })
  }, [])

  React.useEffect(() => {
    if (!banks.length) return

    let shouldUpdate = false
    const updated = bankList.map((item, idx) => {
      if (!item.bankId && item.bankName) {
        const found = banks.find((bank: any) => bank.name === item.bankName)
        if (found) {
          shouldUpdate = true
          const bankId = found.id || found.bankId || found.code || ''
          getBranchList(bankId, idx)
          return { ...item, bankId }
        }
      }
      return item
    })

    if (shouldUpdate) {
      setBankList(updated)
    }
  }, [banks, bankList])

  // Bank List functions
  const handleInputChangeBank = (e: any, index: number) => {
    const { name, value } = e.target
    const list: any = [...bankList]

    if (name === 'accountNo') {
      if (value.length < 41) {
        list[index].accountNo = value
      }
    } else if (name === 'bankAccountHolderName') {
      if (value) {
        const regex = /^[A-Za-z\s]+$/
        if (regex.test(value)) {
          list[index].bankAccountHolderName = value
        }
      } else {
        list[index].bankAccountHolderName = value
      }
    } else if (name === 'bankName') {
      const selectedBank = banks.find((bank: any) => bank.name === value || bank.id === value || bank.code === value)
      if (selectedBank) {
        const bankId = selectedBank.id || selectedBank.bankId || selectedBank.code || ''
        list[index].bankName = selectedBank.name
        list[index].bankId = bankId
        list[index].branchName = ''
        list[index].branchId = ''
        list[index].branchCode = ''
        setBranches(prev => ({ ...prev, [index]: [] }))
        setBankList(list)
        getBranchList(bankId, index)
        return
      } else {
        list[index].bankName = value
        list[index].bankId = ''
        list[index].branchName = ''
        list[index].branchId = ''
        list[index].branchCode = ''
        setBranches(prev => ({ ...prev, [index]: [] }))
      }
    } else if (name === 'branchName') {
      const branchList = branches[index] || []
      const selectedBranch = branchList.find((branch: any) => branch.name === value || branch.id === value)
      if (selectedBranch) {
        list[index].branchName = selectedBranch.name
        list[index].branchId = selectedBranch.id || selectedBranch.branchId || ''
        list[index].branchCode = selectedBranch.code || selectedBranch.branchCode || ''
      } else {
        list[index].branchName = value
        list[index].branchId = ''
        list[index].branchCode = ''
      }
    } else {
      list[index][name] = value
    }

    setBankList(list)
  }

  const handleRemoveClickBank = (index: number) => {
    const list: any = [...bankList]

    list.splice(index, 1)
    setBankList(list)
    setBranches({})
    list.forEach((item: any, idx: number) => {
      if (item.bankId) {
        getBranchList(item.bankId, idx)
      }
    })
  }

  const handleAddClickBank = () => {
    setBankList([
      ...bankList,
      {
        bankAccountHolderName: '',
        bankId: '',
        bankName: '',
        branchId: '',
        branchName: '',
        branchCode: '',
        accountNo: ''
      }
    ])
  }

  // Bank List functions

  //convert to base64
  const handleImgChange = (e: any) => {
    let base64String = ''
    const file = e.target['files'][0]

    if (!file) return

    if (file.size > MAX_UPLOAD_SIZE) {
      setImageError(true)
      setImageErrorMsg('File size should be less than 1.5 MB')
      setSelectedImgLink('')
      formik.setFieldValue('profilePictureDocBase64', '')
      formik.setFieldValue('profilePictureFileFormat', '')
      return
    }

    const reader: any = new FileReader()

    reader.onload = function () {
      base64String = reader.result.replace('data:', '').replace(/^.+,/, '')

      // For preview: show image or indicate PDF
      if (file.type === 'application/pdf') {
        setSelectedImgLink(reader.result); // Will be data:application/pdf;base64,...
      } else {
        setSelectedImgLink(reader.result); // Will be data:image/...
      }
      setImageError(false)
      setImageErrorMsg('')
      formik.setFieldValue('profilePictureDocBase64', base64String)
      formik.setFieldValue('profilePictureFileFormat', file.type)
    }

    reader.readAsDataURL(file)
  }

  //submit provider other details
  const handleSubmitStepThree = () => {
    // Find the country code from the stored country ID
    const selectedCountry = countries?.find((country: any) => country.id === formik.values.inaugurationCountry)
    const inaugurationCountryCode = selectedCountry?.code || formik.values.inaugurationCountry

    const payloadThree: any = {
      providerOtherDetails: {
        // licenseCode: formik.values.licenseCode,
        licenseCountry: formik.values.licenseCountry,
        licenseState: formik.values.licenseState,
        serviceTaxNoOrGstNo: formik.values.serviceTaxNoOrGstNo,
        taxonomyCode: formik.values.taxonomyCode,
        tinOrPin: formik.values.taxPinNumber,
        inaugurationDate: new Date(selectedInagurationDate).getTime(),
        inaugurationCountry: inaugurationCountryCode,
        inaugurationState: formik.values.inaugurationState,
        websiteUrl: formik.values.websiteUrl,
        npi: formik.values.npi,
        otherNpi: formik.values.otherNpi,
        profilePictureDocBase64: formik.values.profilePictureDocBase64,
        profilePictureFileFormat: 'image/jpeg',
        enumerationDate: new Date(selectedEnumerationdate).getTime(),
        accountDetails: bankList.map((item: any) => ({
          accountNo: item.accountNo || '',
          bankAccountHolderName: item.bankAccountHolderName || '',
          bankId: item.bankId || '',
          bankName: item.bankName || '',
          branchId: item.branchId || '',
          branchName: item.branchName || '',
          branchCode: '4455'
        }))
      }
    }

    if (query2.get('mode') === 'create') {
      providerservice.editProvider(payloadThree, providerId, '3').subscribe(res => {
        props.handleNext()
      })
    }

    if (query2.get('mode') === 'edit') {
      providerservice.editProvider(payloadThree, id, '3').subscribe(res => {
        props.handleNext()
      })
    }
  }

  const getLicStates = (countryid: any) => {
    //API call to get License states
    countryservice.getStatesList(countryid).subscribe((result: any) => {
      setLicStates(result)
    })

    // let sl$ = stateservice.getStateList(stateparams);
    // useObservable(sl$,setLicStates)
  }

  const getIngStates = (countryid: any) => {
    //API call to get  inaguration states
    // let stateparams = {
    //     page: 0,
    //     size: 100,
    //     summary: true,
    //     active: true,
    //     countryId: countryid.toString()
    // }

    countryservice.getStatesList(countryid).subscribe((result: any) => {
      setIngStates(result)
    })
  }

  const handleLicenseCountryChange = (event: any) => {
    if (formik.values.licenseCountry !== event.target.value) {
      formik.setFieldValue('licenseCountry', event.target.value)
      formik.setFieldValue('licenseState', '')
      getLicStates(event.target.value)
    }
  }

  const handleInaugurationCountryChange = (event: any) => {
    if (formik.values.inaugurationCountry !== event.target.value) {
      formik.setFieldValue('inaugurationCountry', event.target.value)
      formik.setFieldValue('inaugurationState', '')
      getIngStates(event.target.value)
    }
  }

  //edit/view time fillup
  React.useEffect(() => {
    if (id) {
      populateData(id)
    }
  }, [id])

  //populate Form data
  const populateData = (id: any) => {
    if (id) {
      providerservice.getProviderDetails(id).subscribe((val: any) => {
        const bnkList: any = []

        // Find country by code if inaugurationCountry is a code
        let inaugurationCountryValue = val.providerOtherDetails.inaugurationCountry
        // Try to find country by code (if countries are already loaded)
        if (inaugurationCountryValue && countries && countries.length > 0) {
          const countryByCode = countries.find((c: any) => c.code === inaugurationCountryValue)
          if (countryByCode) {
            inaugurationCountryValue = countryByCode.id
          }
        } else if (inaugurationCountryValue) {
          // If countries not loaded yet, store the code to convert later
          setPendingInaugurationCountryCode(inaugurationCountryValue)
        }

        formik.setValues({
          // licenseCode: val.providerOtherDetails.licenseCode,
          licenseCountry: val.providerOtherDetails.licenseCountry,
          licenseState: val.providerOtherDetails.licenseState,
          serviceTaxNoOrGstNo: val.providerOtherDetails.serviceTaxNoOrGstNo,
          taxPinNumber: val?.providerOtherDetails?.tinOrPin || val?.providerBasicDetails?.taxPinNumber || '',
          taxonomyCode: val.providerOtherDetails.taxonomyCode,
          inaugurationDate: val.providerOtherDetails.inaugurationDate,
          inaugurationCountry: inaugurationCountryValue,
          inaugurationState: val.providerOtherDetails.inaugurationState,
          websiteUrl: val.providerOtherDetails.websiteUrl,
          npi: val.providerOtherDetails.npi,
          otherNpi: val.providerOtherDetails.otherNpi,
          profilePictureDocBase64: val.providerOtherDetails.profilePictureDocBase64,
          profilePictureFileFormat: val.providerOtherDetails.profilePictureFileFormat,
          enumerationDate: val.providerOtherDetails.enumerationDate
        })

        val.providerOtherDetails.accountDetails.forEach((ele: any) => {
          bnkList.push({
            bankAccountHolderName: ele.bankAccountHolderName,
            bankId: ele.bankId || ele.bankCode || '',
            bankName: ele.bankName,
            branchId: ele.branchId || '',
            branchName: ele.branchName,
            branchCode: ele.branchCode || '',
            accountNo: ele.accountNo
          })
        })

        if (bnkList.length !== 0) {
          setBranches({})
          setBankList(bnkList)
          bnkList.forEach((item: any, idx: number) => {
            if (item.bankId) {
              getBranchList(item.bankId, idx)
            }
          })
        }

        getLicStates(val.providerOtherDetails.licenseCountry)

        // Always store the inauguration state value to set it when states are loaded
        if (val.providerOtherDetails.inaugurationState) {
          setPendingInaugurationState(val.providerOtherDetails.inaugurationState)
        }

        // Load states if country is available
        if (inaugurationCountryValue) {
          getIngStates(inaugurationCountryValue)
        }
        setSelectedInagurationDate(new Date(val.providerOtherDetails.inaugurationDate))
        setSelectedEnumerationdate(new Date(val.providerOtherDetails.enumerationDate))

        // Set contract image preview if it exists
        if (val.providerOtherDetails.profilePictureDocBase64) {
          const fileFormat = val.providerOtherDetails.profilePictureFileFormat || 'image/jpeg'
          const lnk = `data:${fileFormat};base64,${val.providerOtherDetails.profilePictureDocBase64}`
          setSelectedImgLink(lnk)
          setImageError(false)
        } else {
          setSelectedImgLink('')
          setImageError(false)
        }
      })
    }
  }

  // Convert country code to ID when countries are loaded
  React.useEffect(() => {
    if (pendingInaugurationCountryCode && countries && countries.length > 0) {
      const countryByCode = countries.find((c: any) => c.code === pendingInaugurationCountryCode)
      if (countryByCode) {
        formik.setFieldValue('inaugurationCountry', countryByCode.id)
        getIngStates(countryByCode.id)
        setPendingInaugurationCountryCode('')
        // States will be loaded, and the pendingInaugurationState useEffect will set the value
      }
    }
  }, [countries, pendingInaugurationCountryCode])

  // Set inauguration state when states are loaded
  React.useEffect(() => {
    const statesList = Array.isArray(ingStates) ? ingStates : (ingStates?.content || [])
    if (statesList.length > 0) {
      if (pendingInaugurationState) {
        const stateExists = statesList.find((s: any) =>
          s.code === pendingInaugurationState ||
          s.id === pendingInaugurationState ||
          s.name === pendingInaugurationState
        )
        if (stateExists) {
          // Use the code value for the dropdown
          formik.setFieldValue('inaugurationState', stateExists.code || pendingInaugurationState)
          setPendingInaugurationState('')
        } else {
          // If not found, try to set it directly (might be a code that matches)
          formik.setFieldValue('inaugurationState', pendingInaugurationState)
          setPendingInaugurationState('')
        }
      } else if (formik.values.inaugurationState) {
        // If formik already has a value but it's not showing, verify it exists in the states list
        const currentValue = formik.values.inaugurationState
        const stateExists = statesList.find((s: any) =>
          s.code === currentValue ||
          s.id === currentValue ||
          s.name === currentValue
        )
        if (!stateExists) {
          // Value doesn't match any state, clear it
          formik.setFieldValue('inaugurationState', '')
        }
      }
    }
  }, [ingStates, pendingInaugurationState])

  // Set branch names when branches are loaded
  React.useEffect(() => {
    if (bankList.length > 0 && Object.keys(branches).length > 0) {
      setBankList((prevList: any[]) => {
        const updatedList = prevList.map((item: any, idx: number) => {
          const branchList = branches[idx] || []
          if (item.branchId && branchList.length > 0) {
            // Find branch by ID first, then by name
            const foundBranch = branchList.find((b: any) =>
              (b.id && b.id.toString() === item.branchId.toString()) ||
              (b.branchId && b.branchId.toString() === item.branchId.toString()) ||
              b.name === item.branchName
            )
            if (foundBranch) {
              return { ...item, branchName: foundBranch.name }
            }
          }
          return item
        })
        return updatedList
      })
    }
  }, [branches])

  return (
    <Paper elevation={0}>
      <Box p={3} my={2}>
        <form onSubmit={formik.handleSubmit}>

          <Grid container spacing={3} style={{ marginBottom: '2px' }}>
            <Grid item xs={6}>
              <span style={{ color: '#4472C4' }}>Account Details</span>
            </Grid>
          </Grid>
          {bankList.map((x, i) => (
            <Grid key={`bank-${i}`} container spacing={2} style={{ marginBottom: '20px', marginTop: '10px' }}>
              <Grid item xs={12} sm={4}>
                <FormControl className={classes.formControl} fullWidth>
                  <TextField
                    id={`bank-account-holder-${i}`}
                    name='bankAccountHolderName'
                    value={x.bankAccountHolderName}
                    onChange={e => handleInputChangeBank(e, i)}
                    label='Account Holder Name'
                    className={classes.textField}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl className={classes.formControl} fullWidth>
                  <InputLabel id={`bank-name-label-${i}`}>Bank Name</InputLabel>
                  <Select
                    labelId={`bank-name-label-${i}`}
                    name='bankName'
                    value={x.bankName}
                    onChange={e => handleInputChangeBank(e as any, i)}
                    label='Bank Name'
                  >
                    {banks.map((bank: any) => (
                      <MenuItem key={bank.id || bank.code} value={bank.name}>
                        {bank.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl className={classes.formControl} fullWidth>
                  <InputLabel id={`branch-name-label-${i}`}>Branch Name</InputLabel>
                  <Select
                    labelId={`branch-name-label-${i}`}
                    name='branchName'
                    value={x.branchName}
                    onChange={e => handleInputChangeBank(e as any, i)}
                    label='Branch Name'
                    disabled={!x.bankId}
                  >
                    {(branches[i] || []).map((branch: any) => (
                      <MenuItem key={branch.id || branch.code} value={branch.name}>
                        {branch.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl className={classes.formControl} fullWidth>
                  <TextField
                    id={`account-no-${i}`}
                    name='accountNo'
                    type='text'
                    onKeyPress={event => {
                      if (!/[0-9]/.test(event.key)) {
                        event.preventDefault()
                      }
                    }}
                    value={x.accountNo}
                    onChange={e => handleInputChangeBank(e, i)}
                    label='Account No'
                    className={classes.textField}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4} style={{ display: 'flex', alignItems: 'center' }}>
                {bankList.length !== 1 && (
                  <Button
                    className='mr10 p-button-danger'
                    onClick={() => handleRemoveClickBank(i)}
                    style={{ marginRight: '5px', background: '#dc3545' }}
                  >
                    <DeleteIcon style={{ color: '#fff' }} />
                  </Button>
                )}
                {bankList.length - 1 === i && (
                  <Button color='primary' onClick={handleAddClickBank}>
                    <AddIcon />
                  </Button>
                )}
              </Grid>
            </Grid>
          ))}
          <Divider />
          <div className={classes.formSection}>
            <div className={classes.sectionTitle}>Other Details</div>
            <Grid container spacing={2} style={{ marginBottom: '20px' }}>
              <Grid item xs={12} sm={4}>
                <TextField
                  id='tax-pin-number'
                  name='taxPinNumber'
                  value={formik.values.taxPinNumber}
                  onChange={formik.handleChange}
                  label='PIN / TIN'
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  id='taxonomy-code'
                  name='taxonomyCode'
                  type='text'
                  onKeyPress={event => {
                    if (!/[a-zA-Z0-9]/.test(event.key)) {
                      event.preventDefault()
                    }
                  }}
                  value={formik.values.taxonomyCode}
                  onChange={formik.handleChange}
                  label='Taxonomy Code'
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    views={['year', 'month', 'day']}
                    label='Start Date of Contract'
                    value={selectedInagurationDate}
                    onChange={handleInagurationDateChange}
                    renderInput={params => (
                      <TextField {...params} margin='none' variant='outlined' className={classes.textField} fullWidth />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>

            <Grid container spacing={2} style={{ marginBottom: '20px' }}>
              <Grid item xs={12} sm={4}>
                <FormControl className={classes.formControl} fullWidth style={{ margin: 0 }}>
                  <InputLabel id='inauguration-country-label' style={{ marginBottom: '0px' }}>
                    Inauguration Country
                  </InputLabel>
                  <Select
                    label='Inauguration Country'
                    labelId='inauguration-country-label'
                    name='inaugurationCountry'
                    id='inauguration-country-select'
                    value={formik.values.inaugurationCountry}
                    onChange={handleInaugurationCountryChange}
                  >
                    {countries?.map((ele: any) => (
                      <MenuItem key={ele.id} value={ele.id}>
                        {ele.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl className={classes.formControl} fullWidth style={{ margin: 0 }}>
                  <InputLabel id='inauguration-county-label' style={{ marginBottom: '0px' }}>
                    Inauguration County
                  </InputLabel>
                  <Select
                    label='Inauguration County'
                    labelId='inauguration-county-label'
                    name='inaugurationState'
                    id='inauguration-county-select'
                    value={formik.values.inaugurationState}
                    onChange={formik.handleChange}
                  >
                    {ingStates?.content?.map((ele: any) => (
                      <MenuItem key={ele.code} value={ele.code}>
                        {ele.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  id='website-url'
                  name='websiteUrl'
                  value={formik.values.websiteUrl}
                  onChange={formik.handleChange}
                  label='Website URL'
                  fullWidth
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} style={{ marginBottom: '20px' }}>
              <Grid item xs={12} sm={4}>
                <TextField
                  id='npi'
                  name='npi'
                  value={formik.values.npi}
                  onChange={formik.handleChange}
                  label='NPI'
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  id='other-npi'
                  name='otherNpi'
                  value={formik.values.otherNpi}
                  onChange={formik.handleChange}
                  label='Other NPI'
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4} />
            </Grid>
          </div>
          <Grid container spacing={2} style={{ marginBottom: '20px' }}>
            <Grid item xs={12} sm={4}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  views={['year', 'month', 'day']}
                  label='End Date of Contract'
                  value={selectedEnumerationdate}
                  onChange={handleEnumerationDateChange}
                  renderInput={params => (
                    <TextField {...params} margin='none' variant='outlined' className={classes.textField} fullWidth />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={4}>
              <span>Upload Contract</span>
              <div
                style={{
                  border: '1px solid #ccc',
                  marginBottom: '8px',
                  alignItems: 'center',
                  height: '108px',
                  width: '108px',
                  display: 'flex',
                  justifyContent: 'center',
                  cursor: selectedImgLink ? 'pointer' : 'default',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}
                onClick={() => selectedImgLink && setPreviewOpen(true)}
              >
                {selectedImgLink ? (
                  selectedImgLink.startsWith('data:application/pdf') ? (
                    <span style={{ fontSize: 12, color: '#888', textAlign: 'center', padding: '8px' }}>PDF Uploaded</span>
                  ) : imageError ? (
                    <span style={{ fontSize: 12, color: '#888', textAlign: 'center', padding: '8px' }}>Image Error</span>
                  ) : (
                    <img
                      src={selectedImgLink}
                      style={{
                        height: '100%',
                        width: '100%',
                        objectFit: 'cover',
                        display: 'block'
                      }}
                      alt="Contract preview"
                      onError={() => setImageError(true)}
                      onLoad={() => setImageError(false)}
                    />
                  )
                ) : (
                  <span style={{ fontSize: 12, color: '#999', textAlign: 'center', padding: '8px' }}>No Contract</span>
                )}
              </div>
              <input
                accept="image/*,application/pdf"
                className={classes.input1}
                id="contained-button-file"
                type="file"
                onChange={handleImgChange}
                style={{ display: 'none' }}
              />
              <label htmlFor="contained-button-file" style={{ cursor: 'pointer' }}>
                <AddAPhotoIcon color="primary" style={{ fontSize: 32 }} />
              </label>
              {imageErrorMsg && (
                <Typography variant='caption' color='error' display='block'>
                  {imageErrorMsg}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} sm={4} />
          </Grid>
          {query2.get('mode') !== 'viewOnly' && (
            <Grid container spacing={3}>
              <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button color='secondary' style={{ marginRight: '5px' }} type='submit'>
                  Save and Next
                </Button>
                <Button color='primary' onClick={props.handleClose} className='p-button-text'>
                  Cancel
                </Button>
              </Grid>
            </Grid>
          )}
        </form>
      </Box>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="md" fullWidth>
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 8 }}>
          <IconButton onClick={() => setPreviewOpen(false)}>
            <CloseIcon />
          </IconButton>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          {selectedImgLink && selectedImgLink.startsWith('data:application/pdf') ? (
            <iframe
              src={selectedImgLink}
              title="PDF Preview"
              width="90%"
              height="600px"
              style={{ border: 'none' }}
            />
          ) : (
            <img src={selectedImgLink} alt="preview" style={{ maxWidth: '90%', maxHeight: 600 }} />
          )}
        </div>
      </Dialog>
    </Paper>
  )
}
