'use client'
import * as React from 'react'
import { useEffect } from 'react'

import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { CircularProgress, Button as MuiButton } from '@mui/material'
// import DateFnsUtils from '@date-io/date-fns';
import Box from '@mui/material/Box'
import { Checkbox } from '@mui/material'

// import { Button } from 'primereact/button';
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
import Asterisk from '../../shared-component/components/red-asterisk'

// import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';

import 'date-fns'
import { useFormik } from 'formik'
import * as yup from 'yup'

// import { useHistory, useLocation, useParams } from 'react-router-dom';
// import { AgentsService } from '../../remote-api/api/agents-services';
// import { CountryService, StateService } from '../../remote-api/api/master-services';
import { Button } from 'primereact/button'

import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

import { AgentsService } from '@/services/remote-api/api/agents-services'
import { CountryService, StateService } from '@/services/remote-api/api/master-services'
import { FormControlLabel, Switch } from '@mui/material'
import { BankService } from '@/services/remote-api/api/master-services/agent.bank.service'

//Date

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

const agentservice = new AgentsService()
const stateservice = new StateService()
const countryservice = new CountryService()
const bankservice = new BankService()
const cs$ = countryservice.getCountryList()
const validatePanNumber = (panNumber: string) => {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
  return panRegex.test(panNumber)
}

// function useQuery1() {
//   return new URLSearchParams(useLocation().search);
// }

// const validationSchema = yup.object({
//   // licenseCode: yup.string().required('License Code is required'),
// })


const validationSchema = yup.object({
  taxPinNumber: yup
    .string()
    .required('Tax ID/PAN is required')
    .min(10, 'Must be exactly 10 characters')
    .max(10, 'Must be exactly 10 characters')
    .test('is-valid-pan', 'Invalid PAN Number', value => validatePanNumber(value || ''))
})

export default function AgentOtherDetailsComponent(props: any) {
  const classes = useStyles()

  // const query2 = useQuery1();
  const query = useSearchParams()
  const router = useRouter()

  // const id = query.get('id');
  const params = useParams()
  const id: any = params.id

  const formik = useFormik({
    initialValues: {
      licenseCode: '',
      licenseCountry: '',
      licenseState: '',
      serviceTaxNoOrGstNo: '',
      taxonomyCode: '',
      ein: '',
      inaugurationDate: 0,
      inaugurationCountry: '',
      inaugurationState: '',
      licenseStatus: false,
      websiteUrl: '',
      profilePictureDocBase64: '',
      profilePictureFileFormat: 'image/jpeg',
      enumerationDate: 0,
      taxPinNumber: '',
      taxExempted: false
    },
    validationSchema: validationSchema,
    onSubmit: values => {
      handleSubmitStepThree()
    }
  })
  const DEFAULT_PROFILE_IMAGE = 'data:image/jpeg;base64,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'

  const [selectedImgLink, setSelectedImgLink] = React.useState(
    'data:image/jpeg;base64,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'
  )

  const [countries, setCountries] = React.useState([])
  const [ingStates, setIngStates] = React.useState([])
  const [licStates, setLicStates] = React.useState([])
  const [banks, setBanks] = React.useState<any[]>([])
  const [branches, setBranches] = React.useState<{ [key: number]: any[] }>({})

  const [bankList, setBankList] = React.useState([
    {
      bankAccountHolderName: '',
      bankId: '',           // Add bankId
      bankName: '',         // Keep for display
      branchId: '',         // Add branchId
      branchName: '',       // Keep for display
      accountNo: ''
    }
  ])

  const getBranchList = (bankId: string, index: number) => {
    bankservice.getBranchList(bankId).subscribe((result: any) => {
      // Handle different response structures
      let branchData = []
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

      // Handle different response structures
      if (Array.isArray(result)) {
        setBanks(result)
      } else if (result && Array.isArray(result.content)) {
        setBanks(result.content)
      } else if (result && Array.isArray(result.data)) {
        setBanks(result.data)
      } else {
        console.error('Unexpected banks response structure:', result)
        setBanks([])
      }
    })
  }, [])

  const [selectedInagurationDate, setSelectedInagurationDate] = React.useState(new Date())
  const [selectedEnumerationdate, setSelectedEnumerationdate] = React.useState(new Date())
  const [hasProfilePicture, setHasProfilePicture] = React.useState(false)


  const [profilePictureDocId, setProfilePictureDocId] = React.useState<string | null>(null)
  const [profilePictureLoading, setProfilePictureLoading] = React.useState(false)

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
      const subscription = observable.subscribe((result: { content: any }) => {
        setter(result.content)
      })

      return () => subscription.unsubscribe()
    }, [observable, setter])
  }

  useObservable(cs$, setCountries)

  // Bank List functions
  const handleInputChangeBank = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, index: number) => {
    const { name, value } = e.target
    const list = [...bankList]
    const key = name as keyof typeof list[0]

    if (name === 'accountNo') {
      if (value.length < 41) {
        list[index][key] = value.toUpperCase()
      }
    } else if (name === 'bankAccountHolderName') {
      if (value) {
        const regex = /^[A-Za-z\s]+$/
        if (regex.test(e.target.value)) {
          list[index][key] = value
        }
      } else {
        list[index][key] = value
      }
    } else if (name === 'bankName') {
      // Find the selected bank to get its ID
      const selectedBank = banks.find((bank: any) => bank.name === value)
      if (selectedBank) {
        list[index].bankName = selectedBank.name
        list[index].bankId = selectedBank.id
        list[index].branchName = ''  // Reset branch when bank changes
        list[index].branchId = ''

        // Fetch branches for this bank
        getBranchList(selectedBank.id, index)
      }
    } else if (name === 'branchName') {
      // Find the selected branch to get its ID
      const branchList = branches[index] || []
      const selectedBranch = branchList.find((branch: any) => branch.name === value)
      if (selectedBranch) {
        list[index].branchName = selectedBranch.name
        list[index].branchId = selectedBranch.id
      }
    } else {
      list[index][key] = value
    }

    setBankList(list)
  }



  const handleRemoveClickBank = (index: number) => {
    const list = [...bankList]

    list.splice(index, 1)
    setBankList(list)
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
        accountNo: ''
      }
    ])
  }




  const uploadProfilePicture = (file: File) => {
    const agentId = localStorage.getItem('agentId')

    if (!agentId) {
      console.warn('Agent ID not found for profile picture upload')
      alert('Agent ID not found. Please save agent basic details first.')
      return
    }

    const formData = new FormData()
    formData.append('docType', 'PROFILE')
    formData.append('filePart', file)

    agentservice.uploadAgentDocument(agentId, formData).subscribe({
      next: (res) => {
        setHasProfilePicture(true) // Mark as having profile picture
        fetchProfilePicture(agentId)
      },
      error: (err) => {
        console.error('Error uploading profile picture', err)
        alert('Failed to upload profile picture. Please try again.')
      }
    })
  }

  const fetchProfilePicture = async (agentId: string) => {
    setProfilePictureLoading(true)
    try {
      const documents = await agentservice.getAgentDocuments(agentId).toPromise()

      if (documents && documents.length > 0) {
        const profileDoc = documents.find((doc: any) => doc.documentType === 'PROFILE')

        if (profileDoc && profileDoc.id) {
          setProfilePictureDocId(profileDoc.id)
          setHasProfilePicture(true) // Mark as having profile picture

          const blob = await agentservice.getDocumentById(profileDoc.id).toPromise()
          if (blob) {
            const imageUrl = URL.createObjectURL(blob)
            setSelectedImgLink(imageUrl)
            formik.setFieldValue('profilePictureFileFormat', profileDoc.docFormat || 'image/jpeg')
          }
        } else {
          console.log('No profile picture found')
          setHasProfilePicture(false)
        }
      } else {
        setHasProfilePicture(false)
      }
    } catch (error) {
      console.error('❌ Error fetching profile picture:', error)
      setHasProfilePicture(false)
    } finally {
      setProfilePictureLoading(false)
    }
  }


  const handleDeleteProfilePicture = () => {
    const agentId = localStorage.getItem('agentId')

    if (!agentId) {
      alert('Agent ID not found')
      return
    }

    if (!profilePictureDocId) {
      // If no document uploaded yet, just reset to default
      setSelectedImgLink(DEFAULT_PROFILE_IMAGE)
      setHasProfilePicture(false)
      formik.setFieldValue('profilePictureDocBase64', '')
      formik.setFieldValue('profilePictureFileFormat', 'image/jpeg')
      alert('Profile picture reset to default')
      return
    }

    // Confirm before deletion
    if (window.confirm('Are you sure you want to delete the profile picture?')) {
      agentservice.deleteAgentDocument(agentId, profilePictureDocId).subscribe({
        next: () => {
          // Reset to default image
          setSelectedImgLink(DEFAULT_PROFILE_IMAGE)
          setProfilePictureDocId(null)
          setHasProfilePicture(false) // Mark as not having profile picture
          formik.setFieldValue('profilePictureDocBase64', '')
          formik.setFieldValue('profilePictureFileFormat', 'image/jpeg')
          alert('Profile picture deleted successfully')
        },
        error: (err) => {
          console.error('Error deleting profile picture:', err)
          alert('Failed to delete profile picture. Please try again.')
        }
      })
    }
  }



  const handleImgChange = (e: any) => {
    // Prevent upload if profile picture already exists
    if (hasProfilePicture) {
      alert('Please delete the existing profile picture before uploading a new one.')
      e.target.value = null // Reset file input
      return
    }

    const file = e.target.files[0]

    if (!file) return

    const reader = new FileReader()

    reader.onload = function () {
      if (!reader.result) {
        console.error('Failed to read file')
        return
      }

      const base64String = reader.result.toString().replace('data:', '').replace(/^.+,/, '')

      // Update UI preview
      setSelectedImgLink(reader.result.toString())

      // Store base64 in formik for form submission (if needed later)
      formik.setFieldValue('profilePictureDocBase64', base64String)
      formik.setFieldValue('profilePictureFileFormat', file.type)

      // Upload the actual file (not base64)
      uploadProfilePicture(file)
    }

    reader.readAsDataURL(file)
  }




  //submit agent other details
  const handleSubmitStepThree = () => {
    const payloadThree: any = {
      agentOtherDetails: {
        // licenseCode: formik.values.licenseCode,
        // licenseCountry: formik.values.licenseCountry,
        // licenseState: formik.values.licenseState,
        licenseCode: "",
        licenseCountry: "",
        licenseState: "",
        serviceTaxNoOrGstNo: formik.values.serviceTaxNoOrGstNo,
        taxonomyCode: formik.values.taxonomyCode,
        ein: formik.values.ein,
        inaugurationDate: new Date(selectedInagurationDate).getTime(),
        inaugurationCountry: formik.values.inaugurationCountry,
        inaugurationState: formik.values.inaugurationState,
        licenseStatus: formik.values.licenseStatus,
        websiteUrl: formik.values.websiteUrl,
        profilePictureDocBase64: null,
        profilePictureFileFormat: formik.values.profilePictureFileFormat,
        enumerationDate: new Date(selectedEnumerationdate).getTime(),
        taxPinNumber: formik.values.taxPinNumber,
        taxExempted: formik.values.taxExempted,
        accountDetails: bankList.map(bank => ({
          bankAccountHolderName: bank.bankAccountHolderName,
          bankId: bank.bankId,
          branchId: bank.branchId,
          accountNo: bank.accountNo
        }))
      }
    }

    /* if (query2.get("mode") === "create") {
            agentservice
                .editAgent(payloadThree, props.agentID, "3")
                .subscribe((res) => {
                    router.push(`/agents?mode=viewList`);
                    window.location.reload();

                });
        }
        if (query2.get("mode") === "edit") {
            agentservice.editAgent(payloadThree, id, "3").subscribe((res) => {
                router.push(`/agents?mode=viewList`);
                window.location.reload();
            });
        } */

    const agentId: any = localStorage.getItem('agentId')

    agentservice.editAgent(payloadThree, agentId, '3').subscribe(res => {
      props.handleNext()

      // window.location.reload();
    })
  }

  const getLicStates = (countryid: string) => {
    //API call to get License states
    // let stateparams = {
    //     page: 0,
    //     size: 100,
    //     summary: true,
    //     active: true,
    //     countryId: countryid.toString()
    // }
    countryservice.getStatesList(countryid).subscribe((result: any) => {
      setLicStates(result.content)
    })

    // let sl$ = stateservice.getStateList(stateparams);
    // useObservable(sl$,setLicStates)
  }

  const getIngStates = (countryid: string) => {
    //API call to get  inaguration states
    countryservice.getStatesList(countryid).subscribe((result: any) => {
      setIngStates(result.content)
    })
  }

  const handleLicenseCountryChange = (event: { target: { value: string } }) => {
    if (formik.values.licenseCountry !== event.target.value) {
      formik.setFieldValue('licenseCountry', event.target.value)
      formik.setFieldValue('licenseState', '')
      getLicStates(event.target.value)
    }
  }

  const handleInaugurationCountryChange = (event: { target: { value: string } }) => {
    if (formik.values.inaugurationCountry !== event.target.value) {
      formik.setFieldValue('inaugurationCountry', event.target.value)
      formik.setFieldValue('inaugurationState', '')
      getIngStates(event.target.value)
    }
  }

  //edit/view time fillup
  // React.useEffect(() => {
  //   const agentId = localStorage.getItem('agentId');

  //   if (agentId) {
  //     populateData(agentId);
  //   }
  // }, [id,populateData]);

  //populate Form data
  const populateData = async (id: string) => {
    if (id) {
      agentservice.getAgentDetails(id).subscribe(async val => {
        const bnkList: any = []

        formik.setValues({
          licenseCode: val.agentOtherDetails.licenseCode,
          licenseCountry: val.agentOtherDetails.licenseCountry,
          licenseState: val.agentOtherDetails.licenseState,
          serviceTaxNoOrGstNo: val.agentOtherDetails.serviceTaxNoOrGstNo,
          taxonomyCode: val.agentOtherDetails.taxonomyCode,
          ein: val.agentOtherDetails.ein,
          inaugurationDate: val.agentOtherDetails.inaugurationDate,
          inaugurationCountry: val.agentOtherDetails.inaugurationCountry,
          inaugurationState: val.agentOtherDetails.inaugurationState,
          licenseStatus: val.agentOtherDetails.licenseStatus,
          websiteUrl: val.agentOtherDetails.websiteUrl,
          profilePictureDocBase64: val.agentOtherDetails.profilePictureDocBase64,
          profilePictureFileFormat: val.agentOtherDetails.profilePictureFileFormat,
          enumerationDate: val.agentOtherDetails.enumerationDate,
          taxPinNumber: (val.agentOtherDetails as any).taxPinNumber || '',
          taxExempted: (val.agentOtherDetails as any).taxExempted || false

        })
        fetchProfilePicture(id)

        // First, collect all unique bank IDs
        const uniqueBankIds = [...new Set(val.agentOtherDetails.accountDetails
          .map((ele: any) => ele.bankId)
          .filter((id: any) => id)
        )] as string[]

        // Fetch branches for all banks upfront
        const branchesMap: { [key: string]: any[] } = {}
        for (const bankId of uniqueBankIds) {
          try {
            const branchResult: any = await new Promise((resolve) => {
              bankservice.getBranchList(bankId).subscribe((result: any) => {
                resolve(result)
              })
            })

            let branchData = []
            if (Array.isArray(branchResult)) {
              branchData = branchResult
            } else if (branchResult && Array.isArray(branchResult.content)) {
              branchData = branchResult.content
            } else if (branchResult && Array.isArray(branchResult.data)) {
              branchData = branchResult.data
            }

            // ✅ Normalize branch IDs to strings
            branchData = branchData.map((branch: any) => ({
              ...branch,
              id: String(branch.id)
            }))

            console.log(`✅ Branches fetched for bankId ${bankId}:`, branchData)
            branchesMap[bankId] = branchData
          } catch (error) {
            console.error('❌ Error fetching branches for bankId:', bankId, error)
            branchesMap[bankId] = []
          }
        }

        console.log('📦 All branches map:', branchesMap)

        // Process each account detail now that we have all branch data
        const updatedBranches: any = {}
        for (let idx = 0; idx < val.agentOtherDetails.accountDetails.length; idx++) {
          const ele = val.agentOtherDetails.accountDetails[idx]

          // Find bank name from banks state
          const selectedBank = banks.find((bank: any) => String(bank.id) === String(ele.bankId))

          // Get branches for this bank from the pre-fetched data
          const branchData = branchesMap[ele.bankId] || []
          updatedBranches[idx] = branchData

          // ✅ Convert branchId to string for comparison
          const branchIdToMatch = String(ele.branchId)

          // Find branch by ID
          let selectedBranch = branchData.find((branch: any) =>
            String(branch.id) === branchIdToMatch
          )

          // Fallback: try matching by code if id doesn't match
          if (!selectedBranch && ele.branchCode) {
            selectedBranch = branchData.find((branch: any) =>
              String(branch.code) === String(ele.branchCode)
            )
          }

          const branchName = selectedBranch ? selectedBranch.name : ''

          console.log(`🔍 Branch lookup for account ${idx}:`, {
            bankId: ele.bankId,
            searchingFor: branchIdToMatch,
            availableBranches: branchData.map((b: any) => ({ id: b.id, name: b.name })),
            foundBranch: selectedBranch,
            branchName
          })

          bnkList.push({
            bankAccountHolderName: ele.bankAccountHolderName,
            bankId: String(ele.bankId) || '',
            bankName: selectedBank ? selectedBank.name : '',
            branchId: branchIdToMatch, // ✅ Store as string
            branchName: branchName,
            accountNo: ele.accountNo
          })
        }

        // ✅ Update branches state BEFORE setting bankList
        setBranches(updatedBranches)

        console.log('✅ Final bnkList before setting:', bnkList)
        if (bnkList.length !== 0) {
          setBankList(bnkList)
          console.log('✅ BankList state updated')
        }

        if (val.agentOtherDetails.licenseCountry) {
          getLicStates(val.agentOtherDetails.licenseCountry)
        }
        if (val.agentOtherDetails.inaugurationCountry) {
          getIngStates(val.agentOtherDetails.inaugurationCountry)
        }
        setSelectedInagurationDate(new Date(val.agentOtherDetails.inaugurationDate))
        setSelectedEnumerationdate(new Date(val.agentOtherDetails.enumerationDate))

        if (val.agentOtherDetails.profilePictureDocBase64) {
          const lnk = 'data:image/jpeg;base64,' + val.agentOtherDetails.profilePictureDocBase64
          setSelectedImgLink(lnk)
        }
      })
    }
  }


  // Flag to prevent multiple calls to populateData
  const dataPopulatedRef = React.useRef(false)

  React.useEffect(() => {
    const agentId = localStorage.getItem('agentId')

    if (agentId && banks.length > 0 && !dataPopulatedRef.current) {
      console.log('Populating data for agentId:', agentId)
      populateData(agentId)
      dataPopulatedRef.current = true
    }
  }, [id, banks])

  // Reset flag when id changes
  React.useEffect(() => {
    dataPopulatedRef.current = false
  }, [id])
  React.useEffect(() => {
    // Cleanup function to revoke blob URLs
    return () => {
      if (selectedImgLink && selectedImgLink.startsWith('blob:')) {
        URL.revokeObjectURL(selectedImgLink)
      }
    }
  }, [selectedImgLink])

  return (
    <Paper elevation={0}>
      <Box p={3} my={2}>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3} style={{ marginBottom: '2px' }}>
            <Grid item xs={6}>
              <span style={{ color: '#4472C4' }}>Account Details</span>
            </Grid>
          </Grid>
          {bankList.map((x, i) => {
            return (
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
                      color='secondary'
                      style={{ marginRight: '5px' }}
                    >
                      <DeleteIcon />
                    </Button>
                  )}
                  {bankList.length - 1 === i && (
                    <Button color='primary' onClick={handleAddClickBank}>
                      <AddIcon />
                    </Button>
                  )}
                </Grid>
              </Grid>
            )
          })}
          <Divider />
          <div className={classes.formSection}>
            <div className={classes.sectionTitle}>Other Details</div>
            <Grid container spacing={2} style={{ marginBottom: '20px' }}>
              <Grid item xs={12} sm={4}>
                <TextField
                  id='service-tax-no'
                  name='serviceTaxNoOrGstNo'
                  value={formik.values.serviceTaxNoOrGstNo}
                  onChange={formik.handleChange}
                  label='Service Tax No.'
                  className={classes.textField}
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
                  className={classes.textField}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  id='ein'
                  name='ein'
                  value={formik.values.ein}
                  onChange={formik.handleChange}
                  label='EIN'
                  className={classes.textField}
                  fullWidth
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} style={{ marginBottom: '20px' }}>
              <Grid item xs={12} sm={4}>
                <TextField
                  id='tax-pin-number'
                  name='taxPinNumber'
                  value={formik.values.taxPinNumber}
                  onChange={e => {
                    const upperCaseValue = e.target.value.toUpperCase()
                    formik.setFieldValue('taxPinNumber', upperCaseValue)
                  }}
                  label={
                    <span>
                      PIN / TIN No. <Asterisk />
                    </span>
                  }
                  error={formik.touched.taxPinNumber && Boolean(formik.errors.taxPinNumber)}
                  helperText={formik.touched.taxPinNumber && formik.errors.taxPinNumber}
                  inputProps={{ maxLength: 10 }}
                  className={classes.textField}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formik.values.taxExempted}
                      onChange={e => formik.setFieldValue('taxExempted', e.target.checked)}
                      name="taxExempted"
                      color="primary"
                    />
                  }
                  label="Is Tax Exempted"
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} style={{ marginBottom: '20px' }}>
              <Grid item xs={12} sm={4}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    views={['year', 'month', 'day']}
                    label='Date Of Inauguration'
                    value={selectedInagurationDate}
                    onChange={handleInagurationDateChange}
                    renderInput={params => (
                      <TextField {...params} margin='none' variant='outlined' className={classes.textField} fullWidth />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl className={classes.formControl} fullWidth>
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
                    {countries.map((ele: any) => (
                      <MenuItem key={ele.code} value={ele.code}>
                        {ele.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl className={classes.formControl} fullWidth>
                  <InputLabel id='inauguration-state-label' style={{ marginBottom: '0px' }}>
                    Inauguration State
                  </InputLabel>
                  <Select
                    label='Inauguration State'
                    labelId='inauguration-state-label'
                    name='inaugurationState'
                    id='inauguration-state-select'
                    value={formik.values.inaugurationState}
                    onChange={formik.handleChange}
                  >
                    {ingStates.map((ele: any) => (
                      <MenuItem key={ele.code} value={ele.code}>
                        {ele.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Grid container spacing={2} style={{ marginBottom: '20px' }}>
              <Grid item xs={12} sm={4}>
                <TextField
                  id='website-url'
                  name='websiteUrl'
                  value={formik.values.websiteUrl}
                  onChange={formik.handleChange}
                  label='Website URL'
                  className={classes.textField}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    views={['year', 'month', 'day']}
                    label='Date Of Enumeration'
                    value={selectedEnumerationdate}
                    onChange={handleEnumerationDateChange}
                    renderInput={params => (
                      <TextField {...params} margin='none' variant='outlined' className={classes.textField} fullWidth />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
          </div>
          <Grid container spacing={3} style={{ marginBottom: '20px' }}>
            <Grid item xs={4}>
              <span>Upload Profile picture</span>
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
              >
                {profilePictureLoading ? (
                  <CircularProgress size={24} />
                ) : (
                  <img
                    src={selectedImgLink}
                    style={{ height: '100%', width: '100%', objectFit: 'cover', display: 'block' }}
                    alt="Profile"
                  />
                )}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  accept='image/*'
                  className={classes.input1}
                  id='contained-button-file'
                  type='file'
                  onChange={handleImgChange}
                  style={{ display: 'none' }}
                  disabled={hasProfilePicture}
                />
                <label htmlFor='contained-button-file' style={{ cursor: 'pointer' }}>
                  <MuiButton
                    color='primary'
                    component="span"
                    variant="contained"
                    disabled={hasProfilePicture}
                  >
                    <AddAPhotoIcon />
                  </MuiButton>
                </label>
                <MuiButton
                  color='secondary'
                  variant="contained"
                  onClick={handleDeleteProfilePicture}
                  disabled={!hasProfilePicture && selectedImgLink === DEFAULT_PROFILE_IMAGE}
                >
                  <DeleteIcon />
                </MuiButton>
              </div>
            </Grid>
          </Grid>

          {query.get('mode') !== 'viewOnly' && (
            <Grid container spacing={3}>
              <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button color='primary' style={{ marginRight: '5px' }} type='submit'>
                  Save and Next
                </Button>
                <Button className='p-button-text' onClick={props.handleClose}>
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
