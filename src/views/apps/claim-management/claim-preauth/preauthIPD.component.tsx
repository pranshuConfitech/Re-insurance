import * as React from 'react'

import { useEffect } from 'react'

import { useParams, useRouter, useSearchParams } from 'next/navigation'

import Box from '@mui/material/Box'
import { Button } from 'primereact/button'
import Checkbox from '@mui/material/Checkbox'
import Divider from '@mui/material/Divider'
import FormControlLabel from '@mui/material/FormControlLabel'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Select from '@mui/material/Select'
import Snackbar from '@mui/material/Snackbar'
import { makeStyles } from '@mui/styles'
import TextField from '@mui/material/TextField'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import MuiAlert from '@mui/lab/Alert'

import { useFormik } from 'formik'

import { forkJoin, BehaviorSubject } from 'rxjs'

import Dialog from '@mui/material/Dialog'

import DialogActions from '@mui/material/DialogActions'

import DialogContent from '@mui/material/DialogContent'

import DialogTitle from '@mui/material/DialogTitle'

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'

import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

import { PreAuthService } from '@/services/remote-api/api/claims-services'
import { ServiceTypeService } from '@/services/remote-api/api/master-services'
import { BenefitService } from '@/services/remote-api/api/master-services/benefit.service'
import { MemberService } from '@/services/remote-api/api/member-services'
import { ProvidersService } from '@/services/remote-api/api/provider-services'

import ServiceDetails from './serviceListComponent'
import ClaimModal from '../claims-common/claim.modal.component'

import Asterisk from '../../shared-component/components/red-asterisk'
import { Roles } from '../common/util'

// If Roles is a function or object imported from '../../roles', ensure its type allows string indexing.
// For example, if you control '../../roles', update its export to something like:
// export default {} as Record<string, ({ userData }: { userData?: UsersType[] }) => Element>;

const benefitService = new BenefitService()
const providerService = new ProvidersService()
const serviceDiagnosis = new ServiceTypeService()
const preAuthService = new PreAuthService()
const memberservice = new MemberService()

const bts$ = benefitService.getAllBenefitWithChild({
  page: 0,
  size: 1000,
  summary: true,
  active: true,
  sort: ['rowCreatedDate dsc']
})

const ps$ = providerService.getProviders({
  page: 0,
  size: 10000,
  summary: true,
  active: true,
  sort: ['rowCreatedDate dsc']
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
  }
}))

export default function ClaimsPreAuthIPDComponent(props: any) {
  const query2 = useSearchParams()
  const history = useRouter()
  const id: any = useParams().id
  const classes = useStyles()
  const [selectedDOD, setSelectedDOD] = React.useState(new Date())
  const [selectedDOA, setSelectedDOA] = React.useState(new Date())

  const [providerList, setProviderList] = React.useState([])

  const [diagnosisList, setDiagnosisList] = React.useState([])
  const [benefits, setBenefits] = React.useState([])
  const [benefitOptions, setBenefitOptions] = React.useState([])
  const [selectedBenefit, setSelectedBenefit] = React.useState<any>([])
  const [otherTypeList, setOtherTypeList] = React.useState([])
  const [claimModal, setClaimModal] = React.useState(false)
  const [alertMsg, setAlertMsg] = React.useState('')
  const [openSnack, setOpenSnack] = React.useState(false)
  const [searchType, setSearchType] = React.useState('membership_no')
  const [openClientModal, setOpenClientModal] = React.useState(false)
  const [selectedId, setSelectedId] = React.useState([])
  const [selectSpecId, setSelectedSpecId] = React.useState('')
  const [serviceTypeList, setServiceTypeList] = React.useState()
  const [expenseHeadList, setExpenseHeadList] = React.useState()
  const [interventions, setInterventions] = React.useState<any>({})
  const [serviceList, setServiceList] = React.useState<any>([] as any)

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

  const [memberBasic, setMemberBasic] = React.useState({
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
    memberId: '',
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
      estimatedCost: 0,
      benefitStructureId: ''
    }
  ])

  const [serviceDetailsList, setServiceDetailsList] = React.useState([
    {
      providerId: '',
      estimatedCost: 0,
      benefitId: '',
      codeStandard: 'ICD',
      interventionCode: '',
      diagnosis: ''
    }
  ])

  const useObservable = (observable: any, setter: any) => {
    useEffect(() => {
      const subscription = observable.subscribe((result: any) => {
        setter(result)
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
    const benefitLookup: any = benefits?.reduce((acc: any, el: any) => {
      acc[el.benefitStructureId] = el.name

      return acc
    }, {})

    const temp: any = []

    const X = benefits?.forEach((ele: any) => {
      const parentBenefitName = benefitLookup[ele.parentBenefitStructureId]

      const obj = {
        label: `${parentBenefitName != undefined ? `${parentBenefitName} >` : ''} ${ele.name}`,
        name: ele.name,
        value: ele.id,
        benefitStructureId: ele.benefitStructureId
      }

      temp.push(obj)
    })

    setBenefitOptions(temp)
  }, [benefits])

  useObservable1(ps$, setProviderList)

  const getServiceTypes = () => {
    const serviceTypeService$ = serviceDiagnosis.getServiceTypes()

    serviceTypeService$.subscribe(response => {
      const temp: any = []

      response.content.forEach((el: any) => {
        temp.push(el)
      })
      setServiceTypeList(temp)
    })
  }

  const getBenefit = (id: any, policyNo: any) => {
    const bts$ = benefitService.getAllBenefitWithChild({
      page: 0,
      size: 1000,
      memberId: id,
      policyNumber: policyNo,
      claimType: 'IPD'
    })

    bts$.subscribe((result: any) => {
      setBenefits(result)
    })
  }

  React.useEffect(() => {
    getServiceTypes()
  }, [])

  const getExpenseHead = (id: any) => {
    const expenseHeadService$ = serviceDiagnosis.getExpenseHead(id)

    expenseHeadService$.subscribe(response => {
      const temp: any = []

      response.content.forEach((el: any) => {
        const obj = {
          label: el?.name,
          value: el?.id
        }

        temp.push(obj)
      })
      setExpenseHeadList(temp)
    })
  }

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

    memberservice.getMember(pageRequest).subscribe(res => {
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
          memberId: res.content[0].memberId,
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

  const handleProviderChangeInService = (e: any, index: any) => {
    const { name, value } = e.target
    const list: any = [...serviceDetailsList]

    list[index][name] = value
    setServiceDetailsList(list)
  }

  const handleChangeInService = (e: any, index: any) => {
    const { name, value } = e.target
    const isValAlreadyPresent = serviceDetailsList.some((item: any) => item.providerId === value)

    if (!isValAlreadyPresent) {
      const list: any = [...serviceDetailsList]

      list[index][name] = value
      setServiceDetailsList(list)
    } else {
      setAlertMsg(`Provider already selected!!!`)
      setOpenSnack(true)
    }
  }

  const handleEstimateCostInService = (e: any, index: any) => {
    const { name, value } = e.target
    const isValAlreadyPresent = serviceDetailsList.some((item: any) => item.providerId === value)

    if (!isValAlreadyPresent) {
      const list: any = [...serviceDetailsList]

      list[index][name] = value
      setServiceDetailsList(list)
    } else {
      setAlertMsg(`Provider already selected!!!`)
      setOpenSnack(true)
    }
  }

  const handleExpenseChangeInService = (e: any, index: any) => {
    const { name, value } = e.target
    const isValAlreadyPresent = serviceDetailsList.some((item: any) => item.providerId === value)

    if (!isValAlreadyPresent) {
      const list: any = [...serviceDetailsList]

      list[index][name] = value
      setServiceDetailsList(list)
    } else {
      setAlertMsg(`Provider already selected!!!`)
      setOpenSnack(true)
    }
  }

  const handleBenefitChangeInService = (e: any, index: any) => {
    const isValAlreadyPresent = serviceDetailsList.some((item: any) => item.benefitId === e.value)

    if (!isValAlreadyPresent) {
      const list: any = [...serviceDetailsList]

      if (index >= 0 && index < list.length) {
        list[index] = { ...list[index], benefitId: e.benefitStructureId ? e.benefitStructureId : '' }
        setServiceDetailsList(list)
      } else {
        console.error('Index out of bounds:', index)
      }
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

  const handleRemoveProviderWithBenefit = (i: number, idx: number) => {
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
    setBenefitsWithCost([...benefitsWithCost, { benefitId: '', benefitStructureId: '', estimatedCost: 0 }])
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
    setServiceDetailsList([
      ...serviceDetailsList,
      { providerId: '', estimatedCost: 0, benefitId: '', codeStandard: 'ICD', interventionCode: '', diagnosis: '' }
    ])
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

  const handleBenefitChange = (index: number, val: any) => {
    const isOptionPresent = selectedBenefit.some((item: any) => item?.value === val?.value)

    if (val === null) {
      const temp: any = [...selectedBenefit]

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
        { ...prevData[index], benefitId: val?.value, benefitStructureId: val?.benefitStructureId },
        ...prevData.slice(index + 1)
      ])
    } else {
      setAlertMsg(`You have already added this benefit!!!`)
      setOpenSnack(true)
    }
  }

  const handleBenefitChangeInProvider = (i: number, idx: number, val: any) => {
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
    if (localStorage.getItem('preauthid') || id) {
      populateStepOne(localStorage.getItem('preauthid') || id)
    }
  }, [localStorage.getItem('preauthid') || id])

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

      props.setMembershipNumber(res.memberShipNo)

      setSelectedDOD(new Date(res.expectedDOD))
      setSelectedDOA(new Date(res.expectedDOA))
      setProviderDetailsList(res.providers)
      setBenefitsWithCost(res.benefitsWithCost)
      setServiceDetailsList(res.benefitsWithCost)
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
    const pageRequest: any = {
      page: 0,
      size: 10,
      summary: true,
      active: true,
      policyStatus: 'ACTIVE',
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
            memberId: res.content[0].memberId,
            planScheme: res.content[0].planScheme,
            productName: res.content[0].productName
          })
          getBenefit(res.content[0].memberId, res.content[0].policyNumber)
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
      productName: data.productName,
      memberId: data.memberId
    })
    getBenefit(data?.memberId, data?.policyNumber)
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
    if (serviceDetailsList[0].benefitId) {
    } else {
      setAlertMsg('Please add Benefit!!!')
      setOpenSnack(true)

      return
    }

    if (serviceDetailsList[0].providerId) {
    } else {
      setAlertMsg('Please add provider!!!')
      setOpenSnack(true)

      return
    }

    serviceDetailsList.forEach(sd => {
      sd.estimatedCost = Number(sd.estimatedCost)
    })

    if (new Date(selectedDOA).getTime() > new Date(selectedDOD).getTime()) {
      setAlertMsg('Admission date must be lower than Discharge date')
      setOpenSnack(true)

      return
    }

    if (formik.values.contactNoOne.toString().length > 10 && formik.values.contactNoOne.toString().length < 15) {
      setAlertMsg('Provide right conact details')
      setOpenSnack(true)

      return
    }

    if (
      formik.values.contactNoTwo &&
      formik.values.contactNoTwo?.toString().length > 10 &&
      formik.values.contactNoTwo?.toString().length < 15
    ) {
      setAlertMsg('Provide right conact details')
      setOpenSnack(true)

      return
    }



    const payload: any = {
      preAuthStatus: formik.values.preAuthStatus,
      memberShipNo: memberBasic.membershipNo,
      expectedDOA: new Date(selectedDOA).getTime(),
      expectedDOD: new Date(selectedDOD).getTime(),
      primaryDigonesisId: serviceDetailsList[0]?.diagnosis,
      contactNoOne: formik.values?.contactNoOne?.toString(),
      contactNoTwo: formik.values.contactNoTwo?.toString(),
      referalTicketRequired: formik.values.referalTicketRequired,
      benefitsWithCost: serviceDetailsList,

      preAuthType: 'IPD'
    }

    let amt = 0;
    serviceDetailsList.forEach((item: any) => {
      amt += item.estimatedCost
    })

    const role = JSON.parse(localStorage.getItem('roles')!);
    const common = role.filter((item: any) => Roles.includes(item));
    if (common.length <= 0) {
      if (role.includes("Super_Admin")) {
        common.push("Super_Admin")
      }
    }

    // @ts-ignore
    preAuthService.checkIfCanBeCreated(common[0], payload.preAuthType == "IPD" ? "IP" : "OP", amt).subscribe(res => {

      if (res.originate) {
        const preauthid = localStorage.getItem('preauthid') ? localStorage.getItem('preauthid') : ''

        if (preauthid || id) {
          if (preauthid) {
            preAuthService.editPreAuth(payload, preauthid, '1').subscribe(res => {
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

                preAuthService.changeStatus(preauthid, 'PREAUTH_CLAIM', payload1).subscribe(res => {
                  props.handleNext()
                })
              } else {
                props.handleNext()
              }
            })
          }

          if (id) {
            preAuthService.editPreAuth(payload, id, '1').subscribe(res => {
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

                preAuthService.changeStatus(id, 'PREAUTH_CLAIM', payload1).subscribe(res => {
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
      } else {
        setAlertMsg('You are not allowed to originate this pre-auth!');
        setOpenSnack(true);
        return;
      }
    });
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

  const handleChangeIntervention = (e: any, index: any) => {
    const list: any = [...serviceDetailsList]

    list[index].interventionCode = e.value ? e.value : ''
    setServiceDetailsList(list)
  }

  const handleChangeCodeStandard = (e: any, index: any) => {
    const list: any = [...serviceDetailsList]

    list[index].codeStandard = e ? e : ''
    setServiceDetailsList(list)
  }

  const handleChangeDiagnosis = (e: any, index: any) => {
    const list: any = [...serviceDetailsList]

    list[index].diagnosis = e?.value
    setServiceDetailsList(list)
  }

  const getInterventions = async (benefitStructureId: any, index: any) => {
    const result: any = await benefitService.getBenefitInterventions(benefitStructureId).toPromise()

    const temp: any = result.map((el: any) => ({
      label: el.code + '|' + el.name,
      value: el?.interventionId,
      code: el?.code
    }))

    setInterventions((prev: any) => ({ ...prev, [index]: temp }))
  }

  const getServices = async () => {
    serviceDiagnosis
      .getServicesbyId('867854874246590464', {
        page: 0,
        size: 1000,
        summary: true,
        active: true,
        nonGroupedServices: false,
      })
      .subscribe((result) => {
        if (result?.content && Array.isArray(result.content)) {
          const arr = result.content.map((ele: any) => ({
            label: `${ele?.code || ''} | ${ele?.name || ''}`,
            value: ele?.code || '',
          }));

          console.log('Mapped Services:', arr);

          setServiceList(arr)
        } else {
          console.error('Invalid response structure:', result);
        }
      });
  }

  React.useEffect(() => {
    getServiceTypes();
    getServices();
  }, []);

  return (
    <>
      <ClaimModal claimModal={claimModal} handleCloseClaimModal={handleCloseClaimModal} memberBasic={memberBasic} />
      <Paper elevation={2} sx={{ borderRadius: 3, p: 3, background: "#fafbfc" }}>
        <Box>
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
            {/* Search Section */}
            <Grid container spacing={2} alignItems="flex-end" mb={3}>
              <Grid item xs={12} sm={4}>
                <Select label='Search By' value={searchType} onChange={handleChange} fullWidth>
                  <MenuItem value='membership_no'>Membership No.</MenuItem>
                  <MenuItem value='name'>Member Name</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Grid container spacing={2}>
                  <Grid item xs={8}>
                    <TextField
                      value={formik.values.memberShipNo}
                      onChange={onMemberShipNumberChange}
                      name='searchCode'
                      label={searchType === 'membership_no' ? 'Membership Code' : 'Member Name'}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Button
                      // variant="contained"
                      type='button'
                      className={classes.buttonPrimary}
                      onClick={() => populateMemberFromSearch(searchType === 'name' ? 'name' : 'number')}
                      // fullWidth
                      style={{ borderRadius: 2 }}
                    >
                      Search
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
              {openClientModal && (
                <Dialog
                  open={openClientModal}
                  onClose={handleClosed}
                  aria-labelledby="form-dialog-title"
                  disableEnforceFocus
                >
                  <DialogTitle id="form-dialog-title">Members</DialogTitle>
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
                            {memberName?.res?.content?.map((item: any) => (
                              <TableRow key={item.membershipNo}>
                                <TableCell>{item.membershipNo}</TableCell>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.mobileNo}</TableCell>
                                <TableCell>
                                  <Button
                                    onClick={() => handleSelect(item)}
                                    className={classes.buttonPrimary}
                                  >
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
                    <Button onClick={handleClosed} className="p-button-text">
                      Cancel
                    </Button>
                  </DialogActions>
                </Dialog>
              )}
            </Grid>

            {/* Section Header */}
            <Box sx={{ background: "#e3e8f0", borderRadius: 2, px: 2, py: 1, mb: 2 }}>
              <Typography variant="subtitle1" fontWeight={700} color="#D80E51">
                Basic Details
              </Typography>
            </Box>

            {/* Basic Details */}
            <Grid container spacing={2} mb={3}>
              <Grid item xs={12} sm={4}>
                <TextField
                  name='memberName'
                  value={memberBasic.name}
                  disabled
                  label='Name'
                  fullWidth
                  InputProps={{
                    classes: { root: classes.inputRoot, disabled: classes.disabled }
                  }}
                />
                {memberBasic?.membershipNo && (
                  <Typography
                    variant="body2"
                    sx={{ color: '#4472C4', cursor: 'pointer', mt: 1 }}
                    onClick={viewUserDetails}
                  >
                    View Details
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  name='policyNumber'
                  disabled
                  value={memberBasic.policyNumber}
                  label='Policy Number'
                  fullWidth
                  InputProps={{
                    classes: { root: classes.inputRoot, disabled: classes.disabled }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  name='membershipNo'
                  value={memberBasic.membershipNo}
                  label='Membership No'
                  fullWidth
                  InputProps={{ readOnly: true }}
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  name='age'
                  type='number'
                  value={memberBasic.age}
                  disabled
                  label='Age'
                  fullWidth
                  InputProps={{
                    classes: { root: classes.inputRoot, disabled: classes.disabled }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  name='gender'
                  value={memberBasic.gender}
                  disabled
                  label='Gender'
                  fullWidth
                  InputProps={{
                    classes: { root: classes.inputRoot, disabled: classes.disabled }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  name='relation'
                  value={memberBasic.relations}
                  disabled
                  label='Relation'
                  fullWidth
                  InputProps={{
                    classes: { root: classes.inputRoot, disabled: classes.disabled }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    views={['year', 'month', 'day']}
                    label='Enrolment Date'
                    value={memberBasic.enrolmentDate}
                    onChange={() => { }}
                    disabled
                    renderInput={params => <TextField {...params} fullWidth margin='normal' variant='outlined' />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={4}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    views={['year', 'month', 'day']}
                    label='Policy From Date'
                    value={memberBasic.enrolmentFromDate}
                    onChange={() => { }}
                    disabled
                    renderInput={params => <TextField {...params} fullWidth margin='normal' variant='outlined' />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={4}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    views={['year', 'month', 'day']}
                    label='Policy To Date'
                    value={memberBasic.enrolentToDate}
                    onChange={() => { }}
                    disabled
                    renderInput={params => <TextField {...params} fullWidth margin='normal' variant='outlined' />}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>

            {/* Contact Section */}
            <Box sx={{ background: "#e3e8f0", borderRadius: 4, px: 3, py: 2, mb: 3, display: 'flex', alignItems: 'center' }}>
              <Typography variant="subtitle1" fontWeight={700} color="#D80E51">
                Contact & Admission Details
              </Typography>
            </Box>
            <Grid container spacing={3} mb={3}>
              <Grid item xs={12} sm={3}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    views={['year', 'month', 'day']}
                    label='Expected/Actual DOA'
                    value={selectedDOA}
                    onChange={handleDOA}
                    disabled={query2.get('mode') === 'viewOnly'}
                    renderInput={params => (
                      <TextField
                        {...params}
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        sx={{ background: "#fff", borderRadius: 2 }}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={3}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    views={['year', 'month', 'day']}
                    label='Expected/Actual DOD'
                    value={selectedDOD}
                    onChange={handleDODDate}
                    disabled={query2.get('mode') === 'viewOnly'}
                    renderInput={params => (
                      <TextField
                        {...params}
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        sx={{ background: "#fff", borderRadius: 2 }}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  name='contactNoOne'
                  type='number'
                  value={formik.values.contactNoOne}
                  onChange={formik.handleChange}
                  label={<span>Contact No. 1 <Asterisk /></span>}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  sx={{ background: "#fff", borderRadius: 2 }}
                  disabled={query2.get('mode') === 'viewOnly'}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  name='contactNoTwo'
                  type='number'
                  value={formik.values.contactNoTwo}
                  onChange={formik.handleChange}
                  label='Contact No. 2'
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  sx={{ background: "#fff", borderRadius: 2 }}
                  disabled={query2.get('mode') === 'viewOnly'}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formik.values.referalTicketRequired}
                      onChange={e => handleFieldChecked(e)}
                      name='referalTicketRequired'
                      color='primary'
                      disabled={query2.get('mode') === 'viewOnly'}
                    />
                  }
                  label='Referral Ticket Required'
                  sx={{ mt: 1 }}
                />
              </Grid>
            </Grid>

            {/* Service Details Section */}
            <Box sx={{ background: "#e3e8f0", borderRadius: 2, px: 2, py: 1, mb: 2 }}>
              <Typography variant="subtitle1" fontWeight={700} color="#D80E51">
                Service Details
              </Typography>
            </Box>
            <Grid container spacing={2} mb={3}>
              {serviceDetailsList?.map((x, i) => (
                <ServiceDetails
                  x={x}
                  i={i}
                  key={i}
                  handleProviderChangeInService={handleProviderChangeInService}
                  providerList={providerList}
                  handleBenefitChangeInService={handleBenefitChangeInService}
                  autocompleteFilterChange={autocompleteFilterChange}
                  benefitOptions={benefitOptions}
                  handleChangeDiagnosis={handleChangeDiagnosis}
                  handleChangeIntervention={handleChangeIntervention}
                  handleChangeCodeStandard={handleChangeCodeStandard}
                  handleEstimateCostInService={handleEstimateCostInService}
                  handleRemoveServicedetails={handleRemoveServicedetails}
                  handleAddServicedetails={handleAddServicedetails}
                  serviceDetailsList={serviceDetailsList}
                  classes={classes}
                  interventions={interventions[i] || []}
                  serviceList={serviceList}
                />
              ))}
            </Grid>

            {/* Action Buttons */}
            {query2.get('mode') !== 'viewOnly' && (
              <Grid container justifyContent="flex-end" spacing={2} mt={2}>
                <Grid item>
                  <Button color='primary' type='submit' className={classes.buttonPrimary}>
                    Save and Next
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    className={`p-button-text ${classes.saveBtn}`}
                    // variant="outlined"
                    onClick={handleClose}
                  >
                    Close
                  </Button>
                </Grid>
              </Grid>
            )}
          </form>
        </Box>
      </Paper>
    </>
  )
}
