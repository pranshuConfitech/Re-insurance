import * as React from 'react'

import { useEffect } from 'react'

import { useParams, useRouter, useSearchParams } from 'next/navigation'

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

import { Autocomplete } from '@mui/lab'
import { useFormik } from 'formik'

import { forkJoin, BehaviorSubject } from 'rxjs'

import Dialog from '@mui/material/Dialog'

import DialogActions from '@mui/material/DialogActions'

import DialogContent from '@mui/material/DialogContent'

import DialogTitle from '@mui/material/DialogTitle'

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'

import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

import { PreAuthService } from '@/services/remote-api/api/claims-services'
import { ServiceTypeService } from '@/services/remote-api/api/master-services'
import { BenefitService } from '@/services/remote-api/api/master-services/benefit.service'
import { MemberService } from '@/services/remote-api/api/member-services'
import { ProvidersService } from '@/services/remote-api/api/provider-services'

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
  benifitAutoComplete: {}
}))

export default function ClaimsPreAuthIPDComponent(props: any) {
  const query2 = useSearchParams()
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
  const [selectedBenefit, setSelectedBenefit] = React.useState<any>([])
  const [otherTypeList, setOtherTypeList] = React.useState([])
  const [claimModal, setClaimModal] = React.useState(false)
  const [alertMsg, setAlertMsg] = React.useState('')
  const [openSnack, setOpenSnack] = React.useState(false)
  const [searchType, setSearchType] = React.useState('membership_no')
  const [openClientModal, setOpenClientModal] = React.useState(false)
  const [selectedId, setSelectedId] = React.useState([])
  const [selectSpecId, setSelectedSpecId] = React.useState('')

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
      primaryDigonesisId: '',
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

  const [memberBasic, setMemberBasic] = React.useState<any>({
    name: '',
    policyNumber: '',
    age: 0,
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
    policyPeriod: '',
    planName: '',
    planScheme: '',
    productName: '',
    clientType: ''
  })

  const [memberName, setMemberName] = React.useState<any>({
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
    policyPeriod: '',
    planName: '',
    planScheme: '',
    productName: ''
  })

  const [providerDetailsList, setProviderDetailsList] = React.useState([
    {
      providerId: '',
      benefit: [
        {
          estimatedCost: 0,
          benefitId: ''
        }
      ]
    }
  ])

  const [benefitsWithCost, setBenefitsWithCost] = React.useState([
    {
      benefitId: '',
      estimatedCost: 0
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

  const handleClosed = () => {
    setOpenClientModal(false)
  }

  const handlerNameFunction = (valueId: any) => {
    const pageRequest = {
      page: 0,
      size: 10,
      summary: true,
      active: true,
      key: 'MEMBER_ID',
      value: valueId
    }

    memberservice.getMember(pageRequest).subscribe((res: any) => {
      if (res.content?.length > 0) {
        setMemberName({ res })
        formik.setFieldValue('contactNoOne', res.content[0].mobileNo)
        setMemberBasic({
          ...memberBasic,
          name: res.content[0].name,
          age: res.content[0].age,
          gender: res.content[0].gender,
          membershipNo: res.content[0].membershipNo,
          relations: res.content[0].relations,
          policyNumber: res.content[0].policyNumber,
          enrolentToDate: new Date(res.content[0].policyEndDate),
          enrolmentFromDate: new Date(res.content[0].policyStartDate),
          planName: res.content[0].planName,
          planScheme: res.content[0].planScheme,
          productName: res.content[0].productName
        })
      }
    })
    setOpenClientModal(false)
  }

  const handleChange = (event: any) => {
    setSearchType(event.target.value)
  }

  const handleopenClientModal = () => {
    setOpenClientModal(true)
  }

  const handleCloseClientModal = () => {
    setOpenClientModal(false)
  }

  const handleInputChangeProvider = (e: any, index: any) => {
    const { name, value } = e.target
    const isValAlreadyPresent = providerDetailsList.some((item: any) => item.providerId === value)

    if (!isValAlreadyPresent) {
      const list: any = [...providerDetailsList]

      list[index][name] = value
      setProviderDetailsList(list)
    } else {
      setAlertMsg(`Provider already selected!!!`)
      setOpenSnack(true)
    }
  }

  const handleEstimateChangeProvider = (i: any, idx: number, e: any) => {
    const { value } = e.target

    if (i >= 0 && i < providerDetailsList.length && idx >= 0 && idx < providerDetailsList[i].benefit.length) {
      const updatedA = [...providerDetailsList]

      updatedA[i].benefit[idx].estimatedCost = value
      setProviderDetailsList(updatedA)
    } else {
      alert('Index out of bounds')
    }
  }

  const handleRemoveProviderdetails = (index: any) => {
    const list: any = [...providerDetailsList]

    list.splice(index, 1)
    setProviderDetailsList(list)
  }

  const handleRemoveProviderWithBenefit = (i: any, idx: any) => {
    if (i >= 0 && i < providerDetailsList.length && idx >= 0 && idx < providerDetailsList[i].benefit.length) {
      const updatedA = [...providerDetailsList]

      updatedA[i].benefit.splice(idx, 1)
      setProviderDetailsList(updatedA)
    } else {
      alert('Index out of bounds')
    }
  }

  const handleAddProviderdetails = () => {
    setProviderDetailsList([
      ...providerDetailsList,
      {
        providerId: '',
        benefit: [
          {
            estimatedCost: 0,
            benefitId: ''
          }
        ]
      }
    ])
  }

  const handleAddProviderWithBenefit = (index: any) => {
    if (index >= 0 && index < providerDetailsList.length) {
      const newBenefitObject = { estimatedCost: 0, benefitId: '' }
      const updatedA = [...providerDetailsList]

      updatedA[index].benefit.push(newBenefitObject)
      setProviderDetailsList(updatedA)
    } else {
      alert('Index out of bounds')
    }
  }

  const handleInputChangeBenefitWithCost = (e: any, index: any) => {
    const { name, value } = e.target
    const list: any = [...benefitsWithCost]

    list[index][name] = value
    setBenefitsWithCost(list)
  }

  const handleRemoveClaimCost = (index: any) => {
    const list: any = [...benefitsWithCost]

    list.splice(index, 1)
    setBenefitsWithCost(list)
    const listSelected = [...selectedBenefit]

    listSelected.splice(index, 1)
    setSelectedBenefit(listSelected)
  }

  const handleAddClaimCost = () => {
    setBenefitsWithCost([...benefitsWithCost, { benefitId: '', estimatedCost: 0 }])
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

  const handlePrimaryDiagnosisChange = (e: any, val: any) => {
    let selectedBenifits = val
    const isSelecAll = selectedBenifits.some((item: any) => item.id === 'selectall')

    if (isSelecAll) {
      if (diagnosisList.length > 0 && diagnosisList.length === formik.values.diagnosis.length) {
        selectedBenifits = []
      } else {
        selectedBenifits = diagnosisList
      }
    }

    formik.setFieldValue('dprimaryDiagnosis', selectedBenifits)
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
    const isOptionPresent = selectedBenefit.some((item: any) => item?.value === val?.value)

    if (val === null) {
      const temp = [...selectedBenefit]

      temp.splice(index, 1)
      setSelectedBenefit(temp)
    } else {
      if (!isOptionPresent) {
        setSelectedBenefit([...selectedBenefit, val])
      }
    }

    const isValAlreadyPresent = benefitsWithCost.some((item: any) => item.benefitId === val?.value)

    if (!isValAlreadyPresent) {
      setBenefitsWithCost(prevData => [
        ...prevData.slice(0, index),
        { ...prevData[index], benefitId: val?.value },
        ...prevData.slice(index + 1)
      ])
    } else {
      setAlertMsg(`You have already added this benefit!!!`)
      setOpenSnack(true)
    }
  }

  const handleBenefitChangeInProvider = (i: any, idx: any, val: any) => {
    if (i >= 0 && i < providerDetailsList.length && idx >= 0 && idx < providerDetailsList[i].benefit.length) {
      const isValAlreadyPresent = providerDetailsList[i].benefit.some(
        benefitItem => benefitItem.benefitId === val?.value
      )

      if (!isValAlreadyPresent) {
        const updatedProviderDetailsList = [...providerDetailsList]

        updatedProviderDetailsList[i].benefit[idx].benefitId = val?.value
        setProviderDetailsList(updatedProviderDetailsList)
      } else {
        setAlertMsg(`You are selecting benefit which is already selected before`)
        setOpenSnack(true)
      }
    } else {
      alert('Index out of bounds')
    }
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
      formik.setValues({
        ...formik.values,
        memberShipNo: res.memberShipNo,
        expectedDOA: res.expectedDOA,
        expectedDOD: res.expectedDOD,
        diagnosis: res.diagnosis,
        primaryDigonesisId: res.primaryDigonesisId,
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

  useEffect(() => {
    if (query2.get('mode') === 'edit') {
      if (benefitOptions?.length) {
        const temp: any = []

        benefitOptions.forEach((el: any) => {
          if (benefitsWithCost?.find((item: any) => el?.value === item?.benefitId)) {
            temp.push(el)
          }
        })
        setSelectedBenefit(temp)
      }
    }
  }, [benefitOptions, benefitsWithCost])

  const setDiagnosisdata = (diagnosis: any) => {
    serviceDiagnosis
      .getServicesbyId('867854874246590464', {
        page: 0,
        size: 1000,
        summary: true,
        active: true,
        nonGroupedServices: false
      })
      .subscribe((ser: any) => {
        const ar: any = []

        diagnosis.forEach((diag: any) => {
          ser.content.forEach((service: any) => {
            if (diag === service.id) {
              ar.push({ id: service.id, diagnosisName: service.name })
            }
          })
        })
        formik.setFieldValue('diagnosis', ar)
      })
  }

  const getMemberDetails = (id: any) => {
    const pageRequest: any = {
      page: 0,
      size: 10,
      summary: true,
      active: true
    }

    const pageRequest11 = {
      page: 0,
      size: 10,
      summary: true,
      active: true,
      key: searchType,
      value: id
    }

    const pageRequest1 = {
      page: 0,
      size: 10,
      summary: true,
      active: true,
      name: id
    }

    if (searchType === 'name') {
      pageRequest.name = id
    }

    if (searchType === 'membership_no') {
      pageRequest.value = id
      pageRequest.key = 'MEMBERSHIP_NO'
    }

    memberservice.getMember(pageRequest).subscribe((res: any) => {
      if (res.content?.length > 0) {
        if (searchType === 'name') {
          setMemberName({ res })
          handleopenClientModal()
        } else {
          formik.setFieldValue('contactNoOne', res.content[0].mobileNo)
          setMemberBasic({
            ...memberBasic,
            name: res.content[0].name,
            clientType: res.content[0].clientType,
            age: res.content[0].age,
            gender: res.content[0].gender,
            membershipNo: res.content[0].membershipNo,
            relations: res.content[0].relations,
            policyNumber: res.content[0].policyNumber,
            enrolentToDate: new Date(res.content[0].policyEndDate),
            enrolmentFromDate: new Date(res.content[0].policyStartDate),
            planName: res.content[0].planName,
            planScheme: res.content[0].planScheme,
            productName: res.content[0].productName
          })
        }
      } else {
        setAlertMsg(`No Data found for ${id}`)
        setOpenSnack(true)
      }
    })
  }

  const handleSelect = (data: any) => {
    formik.setFieldValue('contactNoOne', data.mobileNo)
    setMemberBasic({
      ...memberBasic,
      name: data.name,
      age: data.age,
      gender: data.gender,
      membershipNo: data.membershipNo,
      relations: data.relations,
      policyNumber: data.policyNumber,
      enrolentToDate: new Date(data.policyEndDate),
      enrolmentFromDate: new Date(data.policyStartDate),
      planName: data.planName,
      planScheme: data.planScheme,
      productName: data.productName
    })
    handleClosed()
  }

  const populateMember = (type: any) => {
    if (formik.values.memberShipNo) {
      if (type === 'name') {
        getMemberDetails(formik.values.memberShipNo)
      } else {
        getMemberDetails(formik.values.memberShipNo)
      }
    }
  }

  const handleSubmit = () => {
    if (benefitsWithCost[0].benefitId) {
    } else {
      setAlertMsg('Please add Benefit!!!')
      setOpenSnack(true)

      return
    }

    if (providerDetailsList[0].benefit[0].benefitId) {
    } else {
      setAlertMsg('Please add provider!!!')
      setOpenSnack(true)

      return
    }

    providerDetailsList.forEach(pd => {
      pd.benefit.forEach((el: any) => {
        el.estimatedCost = Number(el.estimatedCost)
      })
    })
    serviceDetailsList.forEach(sd => {
      sd.estimatedCost = Number(sd.estimatedCost)
    })
    benefitsWithCost.forEach(ctc => {
      ctc.estimatedCost = Number(ctc.estimatedCost)
    })

    const isEveryBInA = providerDetailsList.every(bItem => {
      return bItem.benefit.every(bSubItem => {
        return benefitsWithCost.some(aItem => aItem.benefitId === bSubItem.benefitId)
      })
    })

    if (!isEveryBInA) {
      setAlertMsg("Your Benefit list and Provider's benefit does not match!!!")
      setOpenSnack(true)

      return
    } else {
      benefitsWithCost.forEach((ele: any) => {
        let benefitName: any

        benefitOptions.forEach((el: any) => {
          if (el.value === ele.benefitId) {
            benefitName = el.name
          }
        })

        let tempSum = 0

        providerDetailsList.forEach((el: any) => {
          el.benefit.map((item: any) => {
            if (item.benefitId === ele.benefitId) {
              tempSum += item.estimatedCost
            }
          })

          if (tempSum > ele.estimatedCost) {
            setAlertMsg(`${benefitName}'s estimated less than provider's distribution!!!`)
            setOpenSnack(true)

            return
          }
        })
      })
    }

    benefitsWithCost.forEach((ele: any) => {
      if (ele.benefitId !== 'OTHER') {
        ele.otherType = ''
      }
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
      memberShipNo: memberBasic.membershipNo,
      expectedDOA: new Date(selectedDOA).getTime(),
      expectedDOD: new Date(selectedDOD).getTime(),
      primaryDigonesisId: selectSpecId,
      contactNoOne: formik.values.contactNoOne.toString(),
      contactNoTwo: formik.values.contactNoTwo.toString(),
      referalTicketRequired: formik.values.referalTicketRequired,
      benefitsWithCost: benefitsWithCost,
      providers: providerDetailsList,
      services: serviceDetailsList,
      preAuthType: 'IPD'
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

            preAuthService.changeStatus(preauthid, 'PREAUTH_CLAIM', payload1).subscribe((res: any) => {
              props.handleNext()
            })
          } else {
            props.handleNext()
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

            preAuthService.changeStatus(id, 'PREAUTH_CLAIM', payload1).subscribe((res: any) => {
              props.handleNext()
            })
          } else {
            props.handleNext()
          }
        })
      }
    }

    if (!preauthid && !id) {
      preAuthService.savePreAuth(payload).subscribe((res: any) => {
        localStorage.setItem('preauthid', res.id)
        props.handleNext()
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

  const onMemberShipNumberChange = (e: any) => {
    formik.setFieldValue('memberShipNo', e.target.value)
  }

  const handleMsgErrorClose = () => {
    setOpenSnack(false)
    setAlertMsg('')
  }

  const populateMemberFromSearch = (type: any) => {
    if (formik.values.memberShipNo) {
      if (type === 'name') {
        getMemberDetails(formik.values.memberShipNo)
      } else {
        getMemberDetails(formik.values.memberShipNo)
      }
    }
  }

  const s = new BehaviorSubject({})

  const observable = s.asObservable()

  const doSearch = (e: any) => {
    const txt = e.target.value
  }

  const doSelectValue = (e: any, newValue: any) => {
    if (newValue && newValue.id) {
      const selectedDiagnosis: any = diagnosisList.filter((item: any) => item.id === newValue?.id)

      if (selectedDiagnosis.length > 0) {
        setSelectedId(selectedDiagnosis[0])
        setSelectedSpecId(selectedDiagnosis[0]?.id)
      }
    }
  }

  useEffect(() => {
    if (formik.values && formik.values.primaryDigonesisId) {
      const selectedDiagnosis = diagnosisList.filter((item: any) => item.id === formik.values.primaryDigonesisId)

      if (selectedDiagnosis.length > 0) {
        setSelectedId(selectedDiagnosis[0])
      }
    }
  }, [formik.values, diagnosisList])

  return (
    <>
      <ClaimModal claimModal={claimModal} handleCloseClaimModal={handleCloseClaimModal} memberBasic={memberBasic} />
      <Paper elevation={0}>
        <Box p={3} my={2}>
          <Snackbar
            open={openSnack}
            autoHideDuration={4000}
            onClose={handleMsgErrorClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Alert onClose={handleMsgErrorClose} severity='error'>
              {alertMsg}
            </Alert>
          </Snackbar>

          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={3} style={{ marginBottom: '20px' }}>
              <Grid item xs={12} sm={6} md={4} style={{ display: 'flex', alignItems: 'flex-end' }}>
                <Select label='Select' value={searchType} onChange={handleChange} fullWidth>
                  <MenuItem value='membership_no'>Membership No.</MenuItem>
                  <MenuItem value='name'>Member Name</MenuItem>
                </Select>
              </Grid>

              {searchType === 'membership_no' && (
                <Grid item xs={12} sm={6} md={4} style={{ display: 'flex' }}>
                  <TextField
                    id='standard-basic'
                    value={formik.values.memberShipNo}
                    onChange={onMemberShipNumberChange}
                    name='searchCode'
                    label='Membership Code'
                    style={{ flex: '1', marginRight: '5px' }}
                  />

                  <Button
                    className={`responsiveButton ${classes.buttonPrimary}`}
                    onClick={() => populateMemberFromSearch('number')}
                    color='#D80E51'
                    type='button'
                    style={{ borderRadius: '10px' }}
                  >
                    Search
                  </Button>
                </Grid>
              )}

              {searchType === 'name' && (
                <Grid item xs={12} sm={6} md={4} style={{ display: 'flex' }}>
                  <TextField
                    id='standard-basic'
                    value={formik.values.memberShipNo}
                    onChange={onMemberShipNumberChange}
                    name='searchCode'
                    style={{ marginLeft: '10px', flex: '1' }}
                    label='Member Name'
                  />

                  <Button
                    onClick={() => populateMemberFromSearch('name')}
                    className={classes.buttonPrimary}
                    color='primary'
                    type='button'
                    style={{ marginLeft: '3%', borderRadius: '10px' }}
                  >
                    Search
                  </Button>

                  {openClientModal && (
                    <Dialog
                      open={openClientModal}
                      onClose={handleClosed}
                      aria-labelledby='form-dialog-title'
                      disableEnforceFocus
                    >
                      <DialogTitle id='form-dialog-title'>Members</DialogTitle>

                      <DialogContent>
                        {memberName?.res?.content && memberName?.res?.content?.length > 0 ? (
                          <TableContainer>
                            <Table>
                              <TableHead>
                                <TableRow>
                                  <TableCell>Membership No</TableCell>
                                  <TableCell>Name</TableCell>
                                  <TableCell>Mobile No</TableCell>
                                  <TableCell>Action</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {memberName.res.content.map((item: any) => (
                                  <TableRow key={item.membershipNo}>
                                    <TableCell>{item.membershipNo}</TableCell>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.mobileNo}</TableCell>
                                    <TableCell>
                                      <Button onClick={() => handleSelect(item)} className={classes.buttonPrimary}>
                                        Select
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        ) : (
                          <p>No Data Found</p>
                        )}
                      </DialogContent>

                      <DialogActions>
                        <Button onClick={handleClosed} className='p-button-text'>
                          Cancel
                        </Button>
                      </DialogActions>
                    </Dialog>
                  )}
                </Grid>
              )}
            </Grid>

            <Grid container spacing={3} style={{ marginBottom: '20px' }}>
              <Grid item xs={12}>
                <span style={{ color: '#4472C4', fontWeight: 'bold' }}>BASIC DETAILS</span>
              </Grid>

              <Grid item xs={12} sm={6} md={4} style={{ display: 'flex', flexDirection: 'column' }}>
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

              <Grid item xs={12} sm={6} md={4}>
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
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  id='standard-multiline-flexible'
                  name='membershipNo'
                  value={memberBasic.membershipNo}
                  label='Membership No'
                  InputProps={{ readOnly: true }}
                  disabled
                />
              </Grid>
            </Grid>

            <Grid container spacing={3} style={{ marginBottom: '20px' }}>
              <Grid item xs={12} sm={6} md={4} style={{ display: 'flex', flexDirection: 'column' }}>
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
              <Grid item xs={12} sm={6} md={4}>
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
              <Grid item xs={12} sm={6} md={4}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    views={['year', 'month', 'day']}
                    onChange={() => { }}
                    label='Enrolment Date'
                    value={memberBasic.enrolmentDate}
                    disabled
                    InputProps={{
                      classes: {
                        root: classes.inputRoot,
                        disabled: classes.disabled
                      }
                    }}
                    renderInput={(params: any) => <TextField {...params} margin='normal' variant='outlined' />}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
            <Grid container spacing={3} style={{ marginBottom: '20px' }}>
              <Grid item xs={12} sm={6} md={4} style={{ display: 'flex', flexDirection: 'column' }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    views={['year', 'month', 'day']}
                    onChange={() => { }}
                    label='Policy From Date'
                    value={memberBasic.enrolmentFromDate}
                    disabled
                    InputProps={{
                      classes: {
                        root: classes.inputRoot,
                        disabled: classes.disabled
                      }
                    }}
                    renderInput={(params: any) => <TextField {...params} margin='normal' variant='outlined' />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    views={['year', 'month', 'day']}
                    onChange={() => { }}
                    label='Policy To Date'
                    value={memberBasic.enrolentToDate}
                    disabled
                    InputProps={{
                      classes: {
                        root: classes.inputRoot,
                        disabled: classes.disabled
                      }
                    }}
                    renderInput={(params: any) => <TextField {...params} margin='normal' variant='outlined' />}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>

            <Grid item xs={12} sm={6} md={4} style={{ marginTop: '20px', marginBottom: '15px' }}>
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
                        id="benefit-autocomplete"
                        options={benefitOptions}
                        getOptionLabel={(option: any) => option?.label || ""}
                        isOptionEqualToValue={(option: any, value: any) => option?.value === value?.value}
                        renderInput={(params: any) => <TextField {...params} label="Benefit" />}
                      />
                    </FormControl>
                  </Grid>
                  {x.benefitId === 'OTHER' && (
                    <Grid item xs={4}>
                      <FormControl className={classes.formControl}>
                        <InputLabel id="other-type-label">Other</InputLabel>
                        <Select
                          labelId="other-type-label"
                          value={x.otherType}
                          onChange={(e) => handleInputChangeBenefitWithCost(e, i)}
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
                      id="estimated-cost"
                      type="number"
                      name="estimatedCost"
                      value={x.estimatedCost}
                      onChange={(e) => handleInputChangeBenefitWithCost(e, i)}
                      label="Estimated Cost"
                    />
                  </Grid>
                  <Grid item xs={2} style={{ display: 'flex', alignItems: 'center' }}>
                    {benefitsWithCost.length !== 1 && (
                      <Button
                        className={`mr10 p-button-danger ${classes.buttonSecondary}`}
                        onClick={() => handleRemoveClaimCost(i)}
                        color="secondary"
                        style={{ marginLeft: '5px' }}
                      >
                        <DeleteIcon />
                      </Button>
                    )}
                    {benefitsWithCost.length - 1 === i && (
                      <Button
                        color="primary"
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

            <Grid item xs={12} sm={6} md={4} style={{ marginTop: '20px', marginBottom: '15px' }}>
              <Divider />
            </Grid>

            <Grid container spacing={3} style={{ marginBottom: '20px' }}>
              <Grid item xs={12} sm={3}>
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
              <Grid item xs={12} sm={3}>
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
                  id="primary-diagnosis-autocomplete"
                  options={diagnosisList}
                  value={selectedId}
                  onChange={(e, value) => doSelectValue(e, value)}
                  getOptionLabel={(option: any) => option?.diagnosisName || ""}
                  isOptionEqualToValue={(option: any, value: any) => option?.id === value?.id}
                  renderInput={(params: any) => <TextField {...params} label="Primary Diagnosis" />}
                />
              </Grid>

              <Grid item xs={12} sm={3} style={{ display: 'flex', alignItems: 'flex-end', marginBottom: '8px' }}>
                <Autocomplete
                  id="other-diagnoses-autocomplete"
                  multiple
                  options={diagnosisList}
                  value={formik.values.diagnosis}
                  onChange={handleDiagnosisChange}
                  getOptionLabel={(option: any) => option?.diagnosisName || ""}
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
                    <TextField {...params} label="Other Diagnoses" placeholder="Select Diagnosis" />
                  )}
                />
              </Grid>
            </Grid>

            <Grid container spacing={3} style={{ marginBottom: '20px' }}>
              <Grid item xs={12} sm={4}>
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
              <Grid item xs={12} sm={4}>
                <TextField
                  id='standard-basic'
                  name='contactNoTwo'
                  type='number'
                  value={formik.values.contactNoTwo}
                  onChange={formik.handleChange}
                  label='Contact No. 2'
                />
              </Grid>
              <Grid item xs={12} sm={4}>
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

            <Grid item xs={12} sm={6} md={4} style={{ marginTop: '20px' }}>
              <span style={{ color: '#4472C4', fontWeight: 'bold' }}>PROVIDER DETAILS</span>
            </Grid>

            <Grid item xs={12} sm={6} md={4} style={{ marginBottom: '15px' }}>
              <Divider />
            </Grid>
            {providerDetailsList.map((x, i) => {
              return (
                <Grid container spacing={3} key={i} style={{ marginBottom: '4px' }}>
                  <Grid item xs={12} sm={6} md={3}>
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
                  <Grid item xs={12} sm={6} md={7}>
                    {x?.benefit.map((b: any, idx: number) => (
                      <Grid container spacing={3} key={idx} style={{ marginBottom: '20px' }}>
                        <Grid item xs={12} sm={6} md={4}>
                          <FormControl className={classes.formControl} fullWidth>
                            <Autocomplete
                              defaultValue={b?.benefitId}
                              value={b?.benefitId}
                              onChange={(e: any, val: any) => handleBenefitChangeInProvider(i, idx, val)}
                              id='checkboxes-tags-demo'
                              filterOptions={autocompleteFilterChange}
                              options={selectedBenefit}
                              getOptionLabel={(option: any) =>
                                option.label ?? benefitOptions.find((benefit: any) => benefit?.value == option)?.label
                              }
                              isOptionEqualToValue={(option: any, value: any) => option?.value === value}
                              renderOption={(option: any, { selected }: { selected: any }) => (
                                <React.Fragment>{option?.label}</React.Fragment>
                              )}
                              renderInput={(params: any) => <TextField {...params} label='Benefit Provider' />}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <TextField
                            id='standard-basic'
                            type='number'
                            name='estimatedCost'
                            value={b.estimatedCost}
                            onChange={e => handleEstimateChangeProvider(i, idx, e)}
                            label='Estimated Cost'
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={2} style={{ display: 'flex', alignItems: 'center' }}>
                          {x.benefit.length !== 1 && (
                            <Button
                              className={`mr10 p-button-danger ${classes.buttonSecondary}`}
                              onClick={() => handleRemoveProviderWithBenefit(i, idx)}
                              color='secondary'
                              style={{ marginLeft: '5px', borderRadius: '50%' }}
                            >
                              <DeleteIcon />
                            </Button>
                          )}
                          {selectedBenefit.length > x.benefit.length && x.benefit.length - 1 === idx && (
                            <Button
                              color='primary'
                              className={classes.buttonPrimary}
                              style={{ marginLeft: '5px', borderRadius: '50%' }}
                              onClick={() => handleAddProviderWithBenefit(i)}
                            >
                              <AddIcon />
                            </Button>
                          )}
                        </Grid>
                      </Grid>
                    ))}
                  </Grid>
                  <Grid item xs={12} sm={6} md={2} style={{ display: 'flex', alignItems: 'center' }}>
                    {providerDetailsList.length !== 1 && (
                      <Button
                        className={`mr10 p-button-danger ${classes.buttonSecondary}`}
                        onClick={() => handleRemoveProviderdetails(i)}
                        color='secondary'
                        style={{ marginLeft: '5px' }}
                      >
                        <DeleteIcon />
                      </Button>
                    )}
                    {providerDetailsList.length - 1 === i && (
                      <Button
                        color='primary'
                        className={classes.buttonPrimary}
                        style={{ marginLeft: '5px' }}
                        onClick={handleAddProviderdetails}
                      >
                        <AddIcon />
                      </Button>
                    )}
                  </Grid>
                </Grid>
              )
            })}

            <Grid item xs={12} sm={6} md={4} style={{ marginTop: '20px' }}>
              <span style={{ color: '#4472C4', fontWeight: 'bold' }}>SERVICE DETAILS</span>
            </Grid>
            <Grid item xs={12} sm={6} md={4} style={{ marginBottom: '15px' }}>
              <Divider />
            </Grid>

            {serviceDetailsList.map((x, i) => {
              return (
                <Grid container spacing={3} key={i}>
                  <Grid item xs={12} sm={6} md={4}>
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
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      id='standard-basic'
                      type='number'
                      name='estimatedCost'
                      value={x.estimatedCost}
                      onChange={e => handleInputChangeService(e, i)}
                      label='Estimated Cost'
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={4} style={{ display: 'flex', alignItems: 'center' }}>
                    {serviceDetailsList.length !== 1 && (
                      <Button
                        className={`mr10 p-button-danger ${classes.buttonSecondary}`}
                        onClick={() => handleRemoveServicedetails(i)}
                        color='secondary'
                        style={{ marginLeft: '5px' }}
                      >
                        <DeleteIcon />
                      </Button>
                    )}
                    {serviceDetailsList.length - 1 === i && (
                      <Button
                        color='primary'
                        className={classes.buttonPrimary}
                        style={{ marginLeft: '5px' }}
                        onClick={handleAddServicedetails}
                      >
                        <AddIcon />
                      </Button>
                    )}
                  </Grid>
                </Grid>
              )
            })}

            <Grid item xs={12} sm={6} md={4} style={{ marginBottom: '15px', marginTop: '10px' }}>
              <Divider />
            </Grid>

            {query2.get('mode') !== 'viewOnly' && (
              <Grid item xs={12} className={classes.actionContainer}>
                <Button color='primary' type='submit' className={classes.buttonPrimary}>
                  Save and Next
                </Button>
                <Button
                  className={`p-button-text ${classes.saveBtn}`}
                  style={{ marginLeft: '10px' }}
                  onClick={handleClose}
                >
                  Close
                </Button>
              </Grid>
            )}
          </form>
        </Box>
      </Paper>
    </>
  )
}
