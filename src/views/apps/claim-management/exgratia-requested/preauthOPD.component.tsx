import * as React from 'react'

import { useEffect, useState } from 'react'

import { useParams, useRouter } from 'next/navigation'

import Box from '@mui/material/Box'
import { Button } from 'primereact/button'
import Checkbox from '@mui/material/Checkbox'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Select from '@mui/material/Select'
import Snackbar from '@mui/material/Snackbar'
import { makeStyles } from '@mui/styles'
import TextField from '@mui/material/TextField'
import AddIcon from '@mui/icons-material/Add'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import DeleteIcon from '@mui/icons-material/Delete'
import MuiAlert from '@mui/lab/Alert'

import { useFormik } from 'formik'

import { forkJoin } from 'rxjs'

import { Autocomplete } from '@mui/lab'

import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

import { PreAuthService } from '@/services/remote-api/api/claims-services'
import { ServiceTypeService } from '@/services/remote-api/api/master-services'
import { BenefitService } from '@/services/remote-api/api/master-services/benefit.service'
import { MemberService } from '@/services/remote-api/api/member-services'
import { ProvidersService } from '@/services/remote-api/api/provider-services'
import ClaimsDocumentOPDComponent from './document.OPD.component'
import ClaimModal from '../claims-common/claim.modal.component'

const benefitService = new BenefitService()
const providerService = new ProvidersService()
const serviceDiagnosis = new ServiceTypeService()
const preAuthService = new PreAuthService()
const memberservice = new MemberService()

const bts$ = benefitService.getAllBenefit({ page: 0, size: 1000, summary: true })
const ps$ = providerService.getProviders({
  page: 0,
  size: 10000,
  summary: true,
  active: true
})

const ad$ = serviceDiagnosis.getServicesbyId('867854874246590464', {
  page: 0,
  size: 1000,
  summary: true,
  active: true,
  nonGroupedServices: false
})

const serviceAll$ = forkJoin(
  serviceDiagnosis.getServicesbyId('867854950947827712', {
    page: 0,
    size: 1000,
    summary: true,
    active: true,
    nonGroupedServices: false
  }),
  serviceDiagnosis.getServicesbyId('867855014529282048', {
    page: 0,
    size: 1000,
    summary: true,
    active: true,
    nonGroupedServices: false
  }),
  serviceDiagnosis.getServicesbyId('867855088575524864', {
    page: 0,
    size: 1000,
    summary: true,
    active: true,
    nonGroupedServices: false
  }),
  serviceDiagnosis.getServicesbyId('867855148155613184', {
    page: 0,
    size: 1000,
    summary: true,
    active: true,
    nonGroupedServices: false
  })
)

const serviceTypeOptions = [
  {
    value: '1',
    label: 'Contact lenses (disposible)'
  },
  {
    value: '2',
    label: 'Contact lenses (non-disposible)'
  },
  {
    value: '3',
    label: 'Room / Bed'
  },
  {
    value: '4',
    label: 'Spectacle Frame'
  },
  {
    value: '5',
    label: 'Spectacle Glass'
  }
]

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
  formControl1: {
    margin: theme.spacing ? theme.spacing(1) : '8px',
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
  inputRoot: {
    '&$disabled': {
      color: 'black'
    },
    benifitAutoComplete: {
      width: 500,
      '& .MuiInputBase-formControl': {
        maxHeight: 200,
        overflowX: 'hidden',
        overflowY: 'auto'
      }
    }
  },
  benifitAutoComplete: {
    width: 500,
    '& .MuiInputBase-formControl': {
      maxHeight: 200,
      overflowX: 'hidden',
      overflowY: 'auto'
    }
  },
  disabled: {},
  actionContainer: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  saveBtn: {
    marginRight: '5px'
  },
  buttonPrimary: {
    backgroundColor: '#D80E51',
    color: '#f1f1f1'
  },
  buttonSecondary: {
    backgroundColor: '#01de74',
    color: '#f1f1f1'
  },
}))

export default function ClaimsPreAuthOPDComponent(props: any) {
  const history = useRouter()
  const id: any = useParams().id
  const classes = useStyles()
  const [selectedDOD, setSelectedDOD] = React.useState(new Date())
  const [selectedDOA, setSelectedDOA] = React.useState(new Date())
  const [providerList, setProviderList] = React.useState([])
  const [serviceList, setServiceList] = React.useState([])
  const [diagnosisList, setDiagnosisList] = React.useState([])
  const [benefits, setBenefits] = React.useState([])
  const [benefitOptions, setBenefitOptions] = React.useState<any>([])
  const [otherTypeList, setOtherTypeList] = React.useState([])
  const [claimModal, setClaimModal] = React.useState(false)
  const [alertMsg, setAlertMsg] = React.useState('')
  const [openSnack, setOpenSnack] = React.useState(false)
  const [providerData, setProviderData] = useState<any>([])
  const [maxApprovableAmount, setMaxApprovableAmount] = React.useState(0)
  const [selectedId, setSelectedId] = React.useState(null)

  const formik = useFormik({
    initialValues: {
      name: '',
      type: '',
      preAuthStatus: null,
      partnerId: '',
      combinationPartnerId: '',
      taxPinNumber: '',
      code: '',
      contact: '',
      email: '',
      pOrgData: '',
      parentAgentId: '',
      natureOfAgent: '',
      orgTypeCd: '',
      memberShipNo: '',
      diagnosis: [],
      expectedDOD: '',
      expectedDOA: '',
      estimatedCost: '',
      referalTicketRequired: false,
      contactNoOne: 0,
      contactNoTwo: 0
    },

    onSubmit: values => {
      handleSubmit()
    }
  })

  function Alert(props: any) {
    return <MuiAlert elevation={6} variant='filled' {...props} />
  }

  const allSelected =
    diagnosisList && diagnosisList.length > 0 && formik.values.diagnosis.length === diagnosisList.length

  const icon = <CheckBoxOutlineBlankIcon fontSize='small' />
  const checkedIcon = <CheckBoxIcon fontSize='small' />

  const [memberBasic, setMemberBasic] = React.useState({
    name: '',
    policyNumber: '',
    age: '',
    relations: '',
    enrolmentDate: new Date(),
    enrolentToDate: new Date(),
    enrolmentFromDate: new Date(),
    insuranceCompany: '',
    corporateName: '',
    membershipNo: '',
    memberName: '',
    gender: '',
    policyCode: '',
    policyType: '',
    policyPeriod: ''
  })

  const [sanctionButton, setSanctionButton] = React.useState(false)

  const [providerDetailsList, setProviderDetailsList] = React.useState([
    {
      providerId: '',
      estimatedCost: 0
    }
  ])

  const [serviceTypeDetailsList, setServiceTypeDetailsList] = React.useState([
    {
      serviceTypeId: '',
      serviceCost: 0
    }
  ])

  const [benefitsWithCost, setBenefitsWithCost] = React.useState([
    {
      benefitId: '',
      estimatedCost: 0,
      maxApprovedCost: 0
    }
  ])

  const [serviceDetailsList, setServiceDetailsList] = React.useState([
    {
      serviceId: '',
      estimatedCost: 0
    }
  ])

  const useObservable = (observable: any, setter: any) => {
    useEffect(() => {
      const subscription = observable.subscribe((result: any) => {
        setter(result.content)
      })

      return () => subscription.unsubscribe()
    }, [observable, setter])
  }

  const useObservable1 = (observable: any, setter: any) => {
    useEffect(() => {
      const subscription = observable.subscribe((result: any) => {
        const arr: any = []

        result.content.forEach((ele: any) => {
          if (!ele.blackListed) {
            arr.push(ele)
          }
        })
        setter(arr)
      })

      return () => subscription.unsubscribe()
    }, [observable, setter])
  }

  const useObservable2 = (observable: any, setter: any) => {
    useEffect(() => {
      const subscription = observable.subscribe((result: any) => {
        const arr: any = []

        result.forEach((elearr: any) => {
          elearr.content.forEach((el: any) => {
            arr.push(el)
          })
        })
        setter(arr)
      })

      return () => subscription.unsubscribe()
    }, [observable, setter])
  }

  const useObservable3 = (observable: any, setter: any) => {
    useEffect(() => {
      const subscription = observable.subscribe((result: any) => {
        const arr: any = []

        result.content.forEach((ele: any) => {
          arr.push({ id: ele.id, diagnosisName: ele.name })
        })
        setter(arr)
      })

      return () => subscription.unsubscribe()
    }, [observable, setter])
  }

  useEffect(() => {
    let sum = 0

    benefitsWithCost.forEach((item: any) => {
      sum = sum + item?.copayAmount + item?.maxApprovedCost
    })
    setMaxApprovableAmount(sum)
  }, [benefitsWithCost])

  useEffect(() => {
    const temp: any = []

    const X = benefits?.forEach((ele: any) => {
      const obj = {
        label: ele.code + ' | ' + ele.name,
        name: ele.code + ' | ' + ele.name,
        value: ele.id
      }

      temp.push(obj)
    })

    setBenefitOptions(temp)
  }, [benefits])

  useObservable(bts$, setBenefits)

  useObservable1(ps$, setProviderList)
  useObservable3(ad$, setDiagnosisList)
  useObservable2(serviceAll$, setServiceList)

  const handleClose = () => {
    localStorage.removeItem('preauthid')
    history.push('/claims/claims-preauth?mode=viewList')
  }

  const handleInputChangeProvider = (e: any, index: any) => {
    const { name, value } = e.target
    const list: any = [...providerDetailsList]

    list[index][name] = value
    setProviderDetailsList(list)
  }

  const handleInputChangeServiceType = (e: any, index: any) => {
    const { name, value } = e.target
    const list: any = [...serviceTypeDetailsList]

    list[index][name] = value
    setServiceTypeDetailsList(list)
  }

  const handleRemoveProviderdetails = (index: any) => {
    const list: any = [...serviceTypeDetailsList]

    list.splice(index, 1)
    setProviderDetailsList(list)
  }

  const handleRemoveServiceTypeDetails = (index: any) => {
    const list: any = [...providerDetailsList]

    list.splice(index, 1)
    setServiceTypeDetailsList(list)
  }

  const handleAddProviderdetails = () => {
    setProviderDetailsList([...providerDetailsList, { providerId: '', estimatedCost: 0 }])
  }

  const handleAddServiceTypeDtails = () => {
    setServiceTypeDetailsList([...serviceTypeDetailsList])
  }

  const handleInputChangeBenefitWithCost = (e: any, index: any) => {
    const list: any = [...benefitsWithCost]

    list[index][e?.target?.name] = e?.target?.value
    setBenefitsWithCost(list)
  }

  const handleRemoveClaimCost = (index: any) => {
    const list: any = [...benefitsWithCost]

    list.splice(index, 1)
    setBenefitsWithCost(list)
  }

  const handleAddClaimCost = () => {
    setBenefitsWithCost([...benefitsWithCost, { benefitId: '', estimatedCost: 0, maxApprovedCost: 0 }])
  }

  const handleInputChangeService = (e: any, index: any) => {
    const { name, value } = e.target
    const list: any = [...serviceDetailsList]

    list[index][name] = value
    setServiceDetailsList(list)
  }

  const handleRemoveServicedetails = (index: any) => {
    const list: any = [...serviceDetailsList]

    list.splice(index, 1)
    setServiceDetailsList(list)
  }

  const handleAddServicedetails = () => {
    setServiceDetailsList([...serviceDetailsList, { serviceId: '', estimatedCost: 0 }])
  }

  const handleDiagnosisChange = (e: any, val: any) => {
    let selectedBenifits = val
    const isSelecAll = selectedBenifits.some((item: any) => item.id === 'selectall')

    if (isSelecAll) {
      if (diagnosisList.length > 0 && diagnosisList.length === formik.values.diagnosis.length) {
        selectedBenifits = []
      } else {
        selectedBenifits = diagnosisList
      }
    }

    formik.setFieldValue('diagnosis', selectedBenifits)
  }

  const handleBenefitChange = (index: any, val: any) => {
    setBenefitsWithCost(prevData => [
      ...prevData.slice(0, index),
      { ...prevData[index], benefitId: val?.value },
      ...prevData.slice(index + 1)
    ])
  }

  React.useEffect(() => {
    if (id) {
      populateStepOne(id)
    }
  }, [id])

  React.useEffect(() => {
    if (localStorage.getItem('preauthid')) {
      populateStepOne(localStorage.getItem('preauthid'))
    }
  }, [localStorage.getItem('preauthid')])

  const populateStepOne = (preAuthId: any) => {
    preAuthService.getPreAuthById(preAuthId).subscribe((res: any) => {
      setSanctionButton(true)
      formik.setValues({
        ...formik.values,
        memberShipNo: res.memberShipNo,
        expectedDOA: res.expectedDOA,
        expectedDOD: res.expectedDOD,
        diagnosis: res.diagnosis,
        contactNoOne: Number(res.contactNoOne),
        contactNoTwo: Number(res.contactNoTwo),
        referalTicketRequired: res.referalTicketRequired,
        preAuthStatus: res.preAuthStatus
      })

      setSelectedDOD(new Date(res.expectedDOD))
      setSelectedDOA(new Date(res.expectedDOA))
      setProviderDetailsList(res.providers)
      setBenefitsWithCost(res.benefitsWithCost)
      setServiceDetailsList(res.services)
      getMemberDetails(res.memberShipNo)

      if (res.diagnosis && res.diagnosis.length !== 0) {
        setDiagnosisdata(res.diagnosis)
      }
    })
  }

  const setDiagnosisdata = (diagnosis: any) => {
    serviceDiagnosis
      .getServicesbyId('867854874246590464', {
        page: 0,
        size: 1000,
        summary: true,
        active: true,
        nonGroupedServices: false
      })
      .subscribe(ser => {
        const ar: any = []

        diagnosis.forEach((diag: any) => {
          ser.content.forEach(service => {
            if (diag === service.id) {
              ar.push({ id: service.id, diagnosisName: service.name })
            }
          })
        })
        formik.setFieldValue('diagnosis', ar)
      })
  }

  const getMemberDetails = (id: any) => {
    const pageRequest = {
      page: 0,
      size: 10,
      summary: true,
      active: true,
      key: 'MEMBERSHIP_NO',
      value: id
    }

    memberservice.getMember(pageRequest).subscribe((res: any) => {
      if (res.content?.length > 0) {
        setMemberBasic({
          ...memberBasic,
          name: res.content[0].name,
          age: res.content[0].age,
          gender: res.content[0].gender,
          membershipNo: res.content[0].membershipNo,
          relations: res.content[0].relations,
          policyNumber: res.content[0].policyNumber,
          enrolentToDate: new Date(res.content[0].policyEndDate),
          enrolmentFromDate: new Date(res.content[0].policyStartDate)
        })
      }
    })
  }

  const populateMember = () => {
    getMemberDetails(formik.values.memberShipNo)
  }

  const handleSubmit = () => {
    benefitsWithCost.forEach((ele: any) => {
      if (ele.benefitId !== 'OTHER') {
        ele.otherType = ''
      }
    })

    providerDetailsList.forEach(pd => {
      pd.estimatedCost = Number(pd.estimatedCost)
    })
    serviceDetailsList.forEach(sd => {
      sd.estimatedCost = Number(sd.estimatedCost)
    })
    benefitsWithCost.forEach(ctc => {
      ctc.estimatedCost = Number(ctc.estimatedCost)
    })

    if (new Date(selectedDOA).getTime() > new Date(selectedDOD).getTime()) {
      setAlertMsg('Admission date must be lower than Discharge date')
      setOpenSnack(true)

      return
    }

    if (formik.values.contactNoOne.toString().length !== 10) {
      setAlertMsg('Contact One must be of 10 digits')
      setOpenSnack(true)

      return
    }

    if (formik.values.contactNoTwo && formik.values.contactNoTwo.toString().length !== 10) {
      setAlertMsg('Contact Two must be of 10 digits')
      setOpenSnack(true)

      return
    }

    const payload: any = {
      preAuthStatus: formik.values.preAuthStatus,
      memberShipNo: formik.values.memberShipNo,
      expectedDOA: new Date(selectedDOA).getTime(),
      expectedDOD: new Date(selectedDOD).getTime(),

      contactNoOne: formik.values.contactNoOne.toString(),
      contactNoTwo: formik.values.contactNoTwo.toString(),
      referalTicketRequired: formik.values.referalTicketRequired,
      benefitsWithCost: benefitsWithCost,
      providers: providerDetailsList,
      services: serviceDetailsList,
      preAuthType: 'OPD'
    }

    const arr: any = []

    formik.values.diagnosis.forEach((di: any) => {
      arr.push(di.id.toString())
    })
    payload['diagnosis'] = arr
    const preauthid = localStorage.getItem('preauthid') ? localStorage.getItem('preauthid') : ''

    if (preauthid || id) {
      if (preauthid) {
        preAuthService.editPreAuth(payload, preauthid, '1').subscribe((res: any) => {
          if (
            formik.values.preAuthStatus === 'PRE_AUTH_REQUESTED' ||
            formik.values.preAuthStatus === 'PRE_AUTH_APPROVED' ||
            formik.values.preAuthStatus === 'ADD_DOC_APPROVED' ||
            formik.values.preAuthStatus === 'ENHANCEMENT_APPROVED'
          ) {
            const payload1 = {
              claimStatus: formik.values.preAuthStatus,
              actionForClaim: 'ENHANCE'
            }

            preAuthService.changeStatus(preauthid, 'PREAUTH_CLAIM', payload1).subscribe((res: any) => { })
          } else {
          }
        })
      }

      if (id) {
        preAuthService.editPreAuth(payload, id, '1').subscribe((res: any) => {
          if (
            formik.values.preAuthStatus === 'PRE_AUTH_REQUESTED' ||
            formik.values.preAuthStatus === 'PRE_AUTH_APPROVED' ||
            formik.values.preAuthStatus === 'ADD_DOC_APPROVED' ||
            formik.values.preAuthStatus === 'ENHANCEMENT_APPROVED'
          ) {
            const payload1 = {
              claimStatus: formik.values.preAuthStatus,
              actionForClaim: 'ENHANCE'
            }

            preAuthService.changeStatus(id, 'PREAUTH_CLAIM', payload1).subscribe((res: any) => { })
          } else {
          }
        })
      }
    }

    if (!preauthid && !id) {
      preAuthService.savePreAuth(payload).subscribe((res: any) => {
        localStorage.setItem('preauthid', res.id)
        setSanctionButton(true)
        preAuthService.editPreAuth({}, res.id, 'calculate').subscribe(r => {
          history.push(`/claims/claims-preauth/${res.id}?mode=edit&auth=OPD`)
        })
      })
    }
  }

  const handleDODDate = (date: any) => {
    setSelectedDOD(date)
    const timestamp = new Date(date).getTime()

    formik.setFieldValue('expectedDOD', timestamp)
  }

  const handleDOA = (date: any) => {
    setSelectedDOA(date)
    const timestamp = new Date(date).getTime()

    formik.setFieldValue('expectedDOA', timestamp)
  }

  const handleFieldChecked = (e: any) => {
    const { name, checked } = e.target

    formik.setFieldValue(name, checked)
  }

  const viewUserDetails = () => {
    setClaimModal(true)
  }

  const handleCloseClaimModal = () => {
    setClaimModal(false)
  }

  const autocompleteFilterChange = (options: any, state: any) => {
    if (state.inputValue) {
      return options?.filter((item: any) => item?.name?.toLowerCase().indexOf(state?.inputValue) > -1)
    }

    return [{ id: 'selectall', name: 'Select all' }, ...options]
  }

  const onMemberShipNumberChange = (e: any) => formik.setFieldValue('memberShipNo', e.target.value)

  const handleMsgErrorClose = () => {
    setOpenSnack(false)
    setAlertMsg('')
  }

  const handleApproveProviderAmount = (e: any, provider: any) => {
    const { id, value } = e.target

    const newValue = parseFloat(value)

    if (isNaN(newValue)) {
      return
    }

    if (newValue > provider.estimatedCost) {
      alert('Approved amount cannot exceed estimated amount!')

      return
    }

    const providerIndex = providerData.findIndex((item: any) => item.providerId === provider.providerId)

    if (providerIndex !== -1) {
      const updatedProviderData: any = [...providerData]

      updatedProviderData[providerIndex].approvedCost = newValue
      setProviderData(updatedProviderData)
    } else {
      const newProvider = {
        providerId: provider.providerId,
        approvedCost: newValue
      }

      setProviderData([...providerData, newProvider])
    }
  }

  const sanctionPreAuth = () => {
    let sum = 0

    const p = providerData?.forEach((item: any) => {
      sum = sum + item?.approvedCost
    })

    if (sum < maxApprovableAmount) {
      preAuthService
        .editPreAuth(
          { decission: 'APPROVED', comment: 'Approve', providersWithApprovedCost: providerData },
          id,
          'decission'
        )
        .subscribe(r => {
          window.location.reload()
        })
    } else {
      alert('Total approved amount cannot exceed total approvable amount!')
    }
  }

  const doSelectValue = (e: any, value: any) => {
    setSelectedId(value)
  }

  return (
    <>
      <ClaimModal claimModal={claimModal} handleCloseClaimModal={handleCloseClaimModal} memberBasic={memberBasic} />
      <Paper elevation={0}>
        <Box p={3} my={2}>
          <Snackbar open={openSnack} autoHideDuration={4000} onClose={handleMsgErrorClose}>
            <Alert onClose={handleMsgErrorClose} severity='error'>
              {alertMsg}
            </Alert>
          </Snackbar>

          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={3} style={{ marginBottom: '50px' }}>
              <TextField
                id='standard-basic'
                value={formik.values.memberShipNo}
                onChange={onMemberShipNumberChange}
                name='searchCode'
                style={{ marginLeft: '10px' }}
                label='Membership code'
              />
              <Button onClick={populateMember} color='primary' style={{ marginLeft: '10px', height: '50%' }}>
                Search
              </Button>
            </Grid>
            <Grid container spacing={3} style={{ marginBottom: '20px' }}>
              <Grid item xs={12}>
                <span style={{ color: '#4472C4', fontWeight: 'bold' }}>BASIC DETAILS</span>
              </Grid>

              <Grid item xs={4} style={{ display: 'flex', flexDirection: 'column' }}>
                <TextField
                  id='standard-basic'
                  name='memberName'
                  value={memberBasic.name}
                  disabled
                  label='Name'
                  InputProps={{
                    classes: {
                      root: classes.inputRoot,
                      disabled: classes.disabled
                    }
                  }}
                />
                {memberBasic?.membershipNo && (
                  <a style={{ color: '#4472C4', cursor: 'pointer' }} onClick={viewUserDetails}>
                    View Details
                  </a>
                )}
              </Grid>
              <Grid item xs={4}>
                <TextField
                  id='standard-basic'
                  name='policyNumber'
                  disabled
                  value={memberBasic.policyNumber}
                  label='Policy Number'
                  InputProps={{
                    classes: {
                      root: classes.inputRoot,
                      disabled: classes.disabled
                    }
                  }}
                />
              </Grid>
            </Grid>
            <Grid container spacing={3} style={{ marginBottom: '20px' }}>
              <Grid item xs={4}>
                <TextField
                  id='standard-basic'
                  name='age'
                  type='number'
                  value={memberBasic.age}
                  disabled
                  label='Age'
                  InputProps={{
                    classes: {
                      root: classes.inputRoot,
                      disabled: classes.disabled
                    }
                  }}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  id='standard-basic'
                  name='relation'
                  value={memberBasic.relations}
                  disabled
                  label='Relation'
                  InputProps={{
                    classes: {
                      root: classes.inputRoot,
                      disabled: classes.disabled
                    }
                  }}
                />
              </Grid>
              <Grid item xs={4}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    views={['year', 'month', 'day']}
                    label='Enrolment Date'
                    value={memberBasic.enrolmentDate}
                    disabled
                    InputProps={{
                      classes: {
                        root: classes.inputRoot,
                        disabled: classes.disabled
                      }
                    }}
                    onChange={() => { }}
                    renderInput={(params: any) => <TextField {...params} margin='normal' variant='outlined' />}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
            <Grid container spacing={3} style={{ marginBottom: '20px' }}>
              <Grid item xs={4}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    views={['year', 'month', 'day']}
                    label='Policy From Date'
                    value={memberBasic.enrolmentFromDate}
                    disabled
                    InputProps={{
                      classes: {
                        root: classes.inputRoot,
                        disabled: classes.disabled
                      }
                    }}
                    onChange={() => { }}
                    renderInput={(params: any) => <TextField {...params} margin='normal' variant='outlined' />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={4}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    views={['year', 'month', 'day']}
                    label='Policy To Date'
                    value={memberBasic.enrolentToDate}
                    disabled
                    InputProps={{
                      classes: {
                        root: classes.inputRoot,
                        disabled: classes.disabled
                      }
                    }}
                    onChange={() => { }}
                    renderInput={(params: any) => <TextField {...params} margin='normal' variant='outlined' />}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>

            <Grid item xs={12} style={{ marginTop: '20px', marginBottom: '15px' }}>
              <Divider />
            </Grid>

            {benefitsWithCost.map((x: any, i: number) => {
              return (
                <Grid container spacing={3} key={i} style={{ marginBottom: '20px' }}>
                  <Grid item xs={4}>
                    <FormControl className={classes.formControl} fullWidth>
                      <Autocomplete
                        value={
                          x.benefitId
                            ? benefitOptions.find((item: any) => item.value === x.benefitId) || null
                            : null
                        }
                        onChange={(e, val) => handleBenefitChange(i, val)}
                        id='benefit-autocomplete'
                        options={benefitOptions}
                        getOptionLabel={(option: any) => option?.label || ''}
                        isOptionEqualToValue={(option: any, value: any) => option?.value === value?.value}
                        renderInput={(params: any) => <TextField {...params} label='Benefit' />}
                      />
                    </FormControl>
                  </Grid>

                  {x.benefitId === 'OTHER' && (
                    <Grid item xs={4}>
                      <FormControl className={classes.formControl}>
                        <InputLabel id='other-type-label'>Other</InputLabel>
                        <Select
                          labelId='other-type-label'
                          value={x.otherType}
                          onChange={e => handleInputChangeBenefitWithCost(e, i)}
                        >
                          {otherTypeList.map((ele: any) => (
                            <MenuItem key={ele.code} value={ele.code}>
                              {ele.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  )}

                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      id='estimated-cost'
                      type='number'
                      name='estimatedCost'
                      value={x.estimatedCost}
                      onChange={e => handleInputChangeBenefitWithCost(e, i)}
                      label='Estimated Cost'
                    />
                  </Grid>

                  <Grid item xs={2} style={{ display: 'flex', alignItems: 'center' }}>
                    {benefitsWithCost.length !== 1 && (
                      <Button
                        className={`mr10 p-button-danger ${classes.buttonSecondary}`}
                        onClick={() => handleRemoveClaimCost(i)}
                        color='secondary'
                        style={{ marginLeft: '5px' }}
                      >
                        <DeleteIcon />
                      </Button>
                    )}
                    {benefitsWithCost.length - 1 === i && (
                      <Button
                        color='primary'
                        className={classes.buttonPrimary}
                        style={{ marginLeft: '5px' }}
                        onClick={handleAddClaimCost}
                      >
                        <AddIcon />
                      </Button>
                    )}
                  </Grid>
                </Grid>
              )
            })}

            <Grid item xs={12} style={{ marginTop: '20px', marginBottom: '15px' }}>
              <Divider />
            </Grid>

            <Grid container spacing={3} style={{ marginBottom: '20px' }}>
              <Grid item xs={4}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    views={['year', 'month', 'day']}
                    label='Expected DOA'
                    value={selectedDOA}
                    onChange={handleDOA}
                    renderInput={(params: any) => <TextField {...params} margin='normal' variant='outlined' />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={4}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    views={['year', 'month', 'day']}
                    label='Expected DOD'
                    value={selectedDOD}
                    onChange={handleDODDate}
                    renderInput={(params: any) => <TextField {...params} margin='normal' variant='outlined' />}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12} sm={3} style={{ display: 'flex', alignItems: 'flex-end', marginBottom: '8px' }}>
                <Autocomplete
                  id='primary-diagnosis-autocomplete'
                  options={diagnosisList}
                  value={selectedId}
                  onChange={(e, value) => doSelectValue(e, value)}
                  getOptionLabel={(option: any) => option?.diagnosisName || ''}
                  isOptionEqualToValue={(option: any, value: any) => option?.id === value?.id}
                  renderInput={(params: any) => <TextField {...params} label='Primary Diagnosis' />}
                />
              </Grid>

              <Grid item xs={12} sm={3} style={{ display: 'flex', alignItems: 'flex-end', marginBottom: '8px' }}>
                <Autocomplete
                  id='other-diagnoses-autocomplete'
                  multiple
                  options={diagnosisList}
                  value={formik.values.diagnosis}
                  onChange={handleDiagnosisChange}
                  getOptionLabel={(option: any) => option?.diagnosisName || ''}
                  isOptionEqualToValue={(option: any, value: any) => option?.id === value?.id}
                  renderOption={(option: any, { selected }: { selected: any }) => (
                    <React.Fragment>
                      <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8, color: '#626bda' }}
                        checked={selected}
                      />
                      {option.diagnosisName}
                    </React.Fragment>
                  )}
                  renderInput={(params: any) => (
                    <TextField {...params} label='Other Diagnoses' placeholder='Select Diagnosis' />
                  )}
                />
              </Grid>
            </Grid>

            <Grid container spacing={3} style={{ marginBottom: '20px' }}>
              <Grid item xs={4}>
                <TextField
                  id='standard-basic'
                  name='contactNoOne'
                  type='number'
                  value={formik.values.contactNoOne}
                  onChange={formik.handleChange}
                  label='Contact No. 1'
                  required
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  id='standard-basic'
                  name='contactNoTwo'
                  type='number'
                  value={formik.values.contactNoTwo}
                  onChange={formik.handleChange}
                  label='Contact No. 2'
                />
              </Grid>
              <Grid item xs={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formik.values.referalTicketRequired}
                      onChange={e => handleFieldChecked(e)}
                      name='referalTicketRequired'
                      color='primary'
                    />
                  }
                  label='Referral Ticket Required'
                />
              </Grid>
            </Grid>

            <Grid item xs={12} style={{ marginTop: '20px' }}>
              <span style={{ color: '#4472C4', fontWeight: 'bold' }}>Service Type Details</span>
            </Grid>

            <Grid item xs={12} style={{ marginBottom: '15px' }}>
              <Divider />
            </Grid>

            {serviceTypeDetailsList.map((x, i) => {
              return (
                <Grid container spacing={3} key={i}>
                  <Grid item xs={4}>
                    <FormControl className={classes.formControl}>
                      <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                        Service Type
                      </InputLabel>
                      <Select
                        labelId='demo-simple-select-label'
                        label='Service Type'
                        id='demo-simple-select'
                        name='providerId'
                        value={x?.serviceTypeId}
                        onChange={e => handleInputChangeServiceType(e, i)}
                      >
                        {serviceTypeOptions.map((ele: any) => {
                          return (
                            <MenuItem value={ele.value} key={ele.value}>
                              {ele.label}
                            </MenuItem>
                          )
                        })}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      size='small'
                      type='number'
                      id='standard-basic'
                      name='serviceAmount'
                      label='Service Amount'
                      value={x?.serviceCost}
                      onChange={e => handleInputChangeServiceType(e, i)}
                    />
                  </Grid>

                  <Grid item xs={4} style={{ display: 'flex', alignItems: 'center' }}>
                    {serviceTypeDetailsList.length !== 1 && (
                      <Button
                        className='mr10 p-button-danger'
                        onClick={() => handleRemoveServiceTypeDetails(i)}
                        color='secondary'
                        style={{ marginLeft: '5px' }}
                      >
                        <DeleteIcon />
                      </Button>
                    )}
                    {serviceTypeDetailsList.length - 1 === i && (
                      <Button color='primary' style={{ marginLeft: '5px' }} onClick={handleAddServiceTypeDtails}>
                        <AddIcon />
                      </Button>
                    )}
                  </Grid>
                </Grid>
              )
            })}
            <Grid item xs={12} style={{ marginTop: '20px' }}>
              <span style={{ color: '#4472C4', fontWeight: 'bold' }}>Provider Details</span>
            </Grid>

            <Grid item xs={12} style={{ marginBottom: '15px' }}>
              <Divider />
            </Grid>

            {providerDetailsList.map((x: any, i: number) => {
              return (
                <Grid container spacing={3} key={i}>
                  <Grid item xs={4}>
                    <FormControl className={classes.formControl}>
                      <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                        Provider
                      </InputLabel>
                      <Select
                        labelId='demo-simple-select-label'
                        label='Provider'
                        id='demo-simple-select'
                        name='providerId'
                        value={x.providerId}
                        onChange={e => handleInputChangeProvider(e, i)}
                      >
                        {providerList.map((ele: any) => {
                          return (
                            <MenuItem key={ele.id} value={ele.id}>
                              {ele.providerBasicDetails.name}
                            </MenuItem>
                          )
                        })}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      id='standard-basic'
                      type='number'
                      name='estimatedCost'
                      value={x.estimatedCost}
                      onChange={e => handleInputChangeProvider(e, i)}
                      label='Estimated Cost'
                    />
                  </Grid>
                  {sanctionButton && (
                    <Grid item xs={3}>
                      <TextField
                        type='number'
                        value={x?.approvedCost}
                        id={`approveProviderAmount-${x.providerId}`}
                        name={`approveProviderAmount-${x.providerId}`}
                        onChange={(e: any) => {
                          const updatedProviders = providerDetailsList.map((item: any) => {
                            if (item.providerId == x.providerId) {
                              item.approvedCost = e.target.value
                            }

                            return item
                          })

                          setProviderDetailsList(updatedProviders)
                          handleApproveProviderAmount(e, x)
                        }}
                        label='Approve Amount'
                      />
                    </Grid>
                  )}
                  <Grid item xs={2} style={{ display: 'flex', alignItems: 'center' }}>
                    {providerDetailsList.length !== 1 && (
                      <Button
                        className='mr10 p-button-danger'
                        onClick={() => handleRemoveProviderdetails(i)}
                        color='secondary'
                        style={{ marginLeft: '5px' }}
                      >
                        <DeleteIcon />
                      </Button>
                    )}
                    {providerDetailsList.length - 1 === i && (
                      <Button color='primary' style={{ marginLeft: '5px' }} onClick={handleAddProviderdetails}>
                        <AddIcon />
                      </Button>
                    )}
                  </Grid>
                </Grid>
              )
            })}

            <Grid item xs={12} style={{ marginTop: '20px' }}>
              <span style={{ color: '#4472C4', fontWeight: 'bold' }}>Service Details</span>
            </Grid>
            <Grid item xs={12} style={{ marginBottom: '15px' }}>
              <Divider />
            </Grid>

            {serviceDetailsList.map((x, i) => {
              return (
                <Grid container spacing={3} key={i}>
                  <Grid item xs={4}>
                    <FormControl className={classes.formControl}>
                      <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                        Service
                      </InputLabel>
                      <Select
                        labelId='demo-simple-select-label'
                        label='Service'
                        id='demo-simple-select'
                        name='serviceId'
                        value={x.serviceId}
                        onChange={e => handleInputChangeService(e, i)}
                      >
                        {serviceList.map((ele: any) => {
                          return (
                            <MenuItem key={ele.id} value={ele.id}>
                              {ele.name}
                            </MenuItem>
                          )
                        })}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      id='standard-basic'
                      type='number'
                      name='estimatedCost'
                      value={x.estimatedCost}
                      onChange={e => handleInputChangeService(e, i)}
                      label='Estimated Cost'
                    />
                  </Grid>

                  <Grid item xs={4} style={{ display: 'flex', alignItems: 'center' }}>
                    {serviceDetailsList.length !== 1 && (
                      <Button
                        className='mr10 p-button-danger'
                        onClick={() => handleRemoveServicedetails(i)}
                        color='secondary'
                        style={{ marginLeft: '5px' }}
                      >
                        <DeleteIcon />
                      </Button>
                    )}
                    {serviceDetailsList.length - 1 === i && (
                      <Button color='primary' style={{ marginLeft: '5px' }} onClick={handleAddServicedetails}>
                        <AddIcon />
                      </Button>
                    )}
                  </Grid>
                </Grid>
              )
            })}

            <Grid item xs={12} style={{ marginBottom: '15px', marginTop: '10px' }}>
              <Divider />
            </Grid>

            {sanctionButton && (
              <Grid container spacing={3} style={{ marginBottom: '20px' }}>
                <Grid item xs={6}>
                  <TextField
                    id='standard-basic'
                    name='maxAmountThatCanBeApproved'
                    type='number'
                    InputProps={{ readOnly: true }}
                    value={benefitsWithCost[0].maxApprovedCost}
                    label='MAX AMOUNT THAT CAN BE APPROVED'
                    style={{ width: '100%' }}
                  />
                </Grid>
              </Grid>
            )}

            {sanctionButton && <ClaimsDocumentOPDComponent />}

            {sanctionButton && formik.values.preAuthStatus != 'APPROVED' ? (
              <Grid item xs={12} className={classes.actionContainer}>
                <Button
                  color='primary'
                  onClick={() => {
                    sanctionPreAuth()
                  }}
                >
                  Sanction
                </Button>
              </Grid>
            ) : (
              formik.values.preAuthStatus != 'APPROVED' && (
                <Grid item xs={12} className={classes.actionContainer}>
                  <Button color='primary' type='submit'>
                    Evaluate
                  </Button>
                  <Button
                    className={`p-button-text ${classes.saveBtn}`}
                    style={{ marginLeft: '10px' }}
                    color='primary'
                    onClick={handleClose}
                  >
                    Close
                  </Button>
                </Grid>
              )
            )}
          </form>
        </Box>
      </Paper>
    </>
  )
}
