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
import { makeStyles } from '@mui/styles'
import TextField from '@mui/material/TextField'
import AddIcon from '@mui/icons-material/Add'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import DeleteIcon from '@mui/icons-material/Delete'
import MuiAlert from '@mui/lab/Alert'
import Autocomplete from '@mui/lab/Autocomplete'

import { useFormik } from 'formik'

import { forkJoin } from 'rxjs'

import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'

import { BenefitStructureService } from '@/services/remote-api/api/benefit-structure-services'
import { ClaimsIntimationService, PreAuthService } from '@/services/remote-api/api/claims-services'
import { ReimbursementService } from '@/services/remote-api/api/claims-services/claim.reimbursement.services'
import { CurrencyService, ServiceGroupingsService, ServiceTypeService } from '@/services/remote-api/api/master-services'
import { BenefitService } from '@/services/remote-api/api/master-services/benefit.service'
import { MemberService } from '@/services/remote-api/api/member-services'
import { ProvidersService } from '@/services/remote-api/api/provider-services'
import InvoiceDetailsModal from './modals/invoice-details.modal.component'
import SliderComponent from './slider.component'

import ClaimModal from '../claims-common/claim.modal.component'
import { Roles } from '../common/util'

const claimintimationservice = new ClaimsIntimationService()
const claimpreauthservice = new PreAuthService()
const claimtypeService = new BenefitStructureService()
const benefitService = new BenefitService()
const providerService = new ProvidersService()
const serviceGroupingsService = new ServiceGroupingsService()
const serviceDiagnosis = new ServiceTypeService()
const reimbursementService = new ReimbursementService()
const currencyservice = new CurrencyService()
const memberservice = new MemberService()

const serviceGroupingsService$ = serviceGroupingsService.getAllServiceGroupings()
const cts$ = claimtypeService.getAllBenefitStructures()

const ps$ = providerService.getProviders({
  page: 0,
  size: 10000,
  summary: true,
  active: true
})
const cs$ = currencyservice.getCurrencies()

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
  }
}))

const slideItems = [
  {
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
  },
  {
    url: 'https://i.picsum.photos/id/871/536/354.jpg?hmac=qo4tHTSoxyMyagkIxVbpDCr80KoK2eb_-0rpAZojojg'
  }
]

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

export default function ClaimsBasicComponent(props: any) {
  const query = useSearchParams()
  const id: any = useParams().id
  const history = useRouter()
  const classes = useStyles()
  const [selectedDOD, setSelectedDOD] = React.useState(new Date())
  const [selectedDOA, setSelectedDOA] = React.useState(new Date())
  const [selectedReceiveDate, setSelectedReceiveDate] = React.useState(new Date())
  const [selectedServiceDate, setSelectedServiceDate] = React.useState(new Date())
  const [currencyList, setCurrencyList] = React.useState([])
  const [disableAllFields, setDisableAllFields] = React.useState(false)
  const [providerList, setProviderList] = React.useState([])
  const [serviceList, setServiceList] = React.useState([])
  const [benefits, setBenefits] = React.useState([])
  const [diagnosisList, setDiagnosisList] = React.useState([])
  const [claimTypeList, setClaimTypeList] = React.useState([])
  const [otherTypeList, setOtherTypeList] = React.useState([])
  const [claimModal, setClaimModal] = React.useState(false)
  const [hasDoc, setHasDoc] = React.useState(false)
  const [isInvoiceDetailModal, setInvoiceDetailModal] = React.useState(false)
  const [selectedInvoiceItems, setSelectedInvoiceItems] = React.useState([])
  const [selectedInvoiceItemIndex, setSelectedInvoiceItemIndex] = React.useState(0)
  const [alertMsg, setAlertMsg] = React.useState('')
  const [openSnack, setOpenSnack] = React.useState(false)
  const [uploadSuccess, setUploadSuccess] = React.useState(false)
  const [benefitOptions, setBenefitOptions] = React.useState([])
  const [invoiceData, setInvoiceData] = React.useState()
  const [claimreimid, setClaimreimid] = React.useState<any>(null)
  const [slideDocs, setSlideDocs] = React.useState<any>([])

  const docTempalte = {
    documentType: 'Prescription',
    docFormat: '',
    documentName: '',
    documentOriginalName: ''
  }

  const [documentList, setDocumentList] = React.useState([
    {
      documentType: '',
      docFormat: 'image/jpeg',
      documentName: '',
      document: props.imgF,
      imgLink: ''
    }
  ])

  const formik = useFormik({
    initialValues: {
      name: '',
      type: '',
      claimType: 'REIMBURSEMENT_CLAIM',
      reimbursementStatus: null,
      calculationStatus: null,
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
      daycare: false,
      diagnosis: [],
      expectedDOD: '',
      expectedDOA: '',
      estimatedCost: '',
      referalTicketRequired: '',
      contactNoOne: '',
      contactNoTwo: '',
      treatmentDepartment: '',
      receiveDate: '',
      serviceDate: '',
      primaryDigonesisId: ''
    },
    onSubmit: values => {
      handleSubmit()
    }
  })

  const allSelected =
    diagnosisList &&
    diagnosisList.length > 0 &&
    formik.values.diagnosis &&
    formik.values.diagnosis.length === diagnosisList.length

  const icon = <CheckBoxOutlineBlankIcon fontSize='small' />
  const checkedIcon = <CheckBoxIcon fontSize='small' />

  const [memberBasic, setMemberBasic] = React.useState<any>({
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

  const [specsList, setSpecsList] = React.useState([])
  const [searchType, setSearchType] = React.useState('MEMBERSHIP_NO')
  const [openClientModal, setOpenClientModal] = React.useState(false)
  const [selectedId, setSelectedId] = React.useState('')
  const [selectSpecId, setSelectedSpecId] = React.useState('')

  const [providerDetailsList, setProviderDetailsList] = React.useState([
    {
      providerId: '',
      estimatedCost: ''
    }
  ])

  const [benefitsWithCost, setBenefitsWithCost] = React.useState([
    {
      benefitId: '',
      estimatedCost: 0
    }
  ])

  const [claimTypeCostList, setClaimTypeCostList] = React.useState([
    {
      claimType: '',
      otherType: '',
      estimatedCost: 0,
      currency: '',
      rate: 0,
      convertedValue: 0
    }
  ])

  const [invoiceDetailsList, setInvoiceDetailsList] = React.useState<any>([])

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

  useObservable(cts$, setClaimTypeList)
  useObservable(cs$, setCurrencyList)

  useObservable1(ps$, setProviderList)
  useObservable3(ad$, setDiagnosisList)
  useObservable2(serviceAll$, setServiceList)

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

  useEffect(() => {
    const membershipNo = query.get('membershipNo')

    if (membershipNo) {
      formik.setFieldValue('memberShipNo', membershipNo)
      populateMember(membershipNo)
    }
  }, [])

  React.useEffect(() => {
    if (id) {
      populateStepOne(id)
    }
  }, [id])

  React.useEffect(() => {
    setClaimreimid(localStorage.getItem('claimreimid') ? localStorage.getItem('claimreimid') : '')
    if (localStorage.getItem('claimreimid')) {
      populateStepOne(localStorage.getItem('claimreimid'))
    }
  }, [])

  React.useEffect(() => {
    if (query.get('intimationid')) {
      claimintimationservice.getIntimationDetails(query.get('intimationid') as string).subscribe((res: any) => {
        formik.setFieldValue('memberShipNo', res.membershipNo)

        if (res.claimIntimationDocumentDetails.length !== 0) {
          setSlideDocs(res.claimIntimationDocumentDetails)
          setHasDoc(true)
        }

        if (res.preauthid) {
          claimpreauthservice.getPreAuthById(res.preauthid).subscribe((pre: any) => {
            console.log("1234", pre)
            populateFromPreAuth(pre)
            setDisableAllFields(true)

            if (pre.documents && pre.documents.length !== 0) {
              setSlideDocs([...res.claimIntimationDocumentDetails, ...pre.documents])
              setHasDoc(true)
            }
          })
        }
      })
    }
  }, [query.get('intimationid')])

  React.useEffect(() => {
    if (props.preauthData !== '' && props.preauthData) {
      populateFromPreAuth(props.preauthData)
      setDisableAllFields(true)
    }
  }, [props.preauthData])

  const populateFromPreAuth = (res: any) => {
    formik.setValues({
      ...formik.values,
      memberShipNo: res.memberShipNo,
      expectedDOA: res.expectedDOA,
      expectedDOD: res.expectedDOD,
      receiveDate: res.receiveDate,
      serviceDate: res.serviceDate,
      daycare: res.daycare,
      contactNoOne: res.contactNoOne,
      contactNoTwo: res.contactNoTwo,
      treatmentDepartment: res.preAuthType
    })

    setSelectedDOD(new Date(res.expectedDOD))
    setSelectedDOA(new Date(res.expectedDOA))
    setSelectedReceiveDate(new Date(res.receiveDate))
    setSelectedServiceDate(new Date(res.serviceDate))

    setBenefitsWithCost(res.benefitsWithCost)

    const inv: any = []
    const processedProviderIds = new Set()

    res.benefitsWithCost &&
      res.benefitsWithCost
        .filter((item: any) => {
          if (processedProviderIds.has(item.providerId)) {
            return false
          }

          processedProviderIds.add(item.providerId)

          return true
        })
        .forEach((el: any) => {
          const obj = {
            ...el,
            invoiceNo: '',
            invoiceDate: 0,
            provideId: el.providerId,
            invoiceDateVal: new Date(),
            invoiceAmount: el.approvedCost,
            currency: '',
            exchangeRate: 0,
            invoiceAmountKES: 0,
            transactionNo: '',
            payee: '',
            invoiceItems: [
              {
                serviceType: '',
                expenseHead: '',
                rateKes: 0,
                unit: 0,
                totalKes: 0,
                finalTotal: 0
              }
            ]
          }
          // providerService.getProviderDetails(el.providerId).subscribe((res: any) => {
          //   console.log('ress', res)
          // })

          inv.push(obj)
        })
    setInvoiceDetailsList(inv)

    getMemberDetails(res.memberShipNo)

    if (res.documents.length !== 0) {
      setSlideDocs(res.documents)
      setHasDoc(true)
    }

    if (res.diagnosis && res.diagnosis.length !== 0) {
      setDiagnosisdata(res.diagnosis)
    }
  }

  const loadPreAuthDocs = (pid: any) => {
    if (pid) {
      claimpreauthservice.getPreAuthById(pid).subscribe((res: any) => {
        if (res.documents.length !== 0) {
          setSlideDocs([...slideDocs, ...res.documents])
          setHasDoc(true)
        }
      })
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
  }

  const handleAddClaimCost = () => {
    setBenefitsWithCost([...benefitsWithCost, { benefitId: '', estimatedCost: 0 }])
  }

  const handleInputChangeProvider = (e: any, index: any) => {
    const { name, value } = e.target
    const list: any = [...providerDetailsList]

    list[index][name] = value
    setProviderDetailsList(list)
  }

  const handleRemoveProviderdetails = (index: any) => {
    const list: any = [...providerDetailsList]

    list.splice(index, 1)
    setProviderDetailsList(list)
  }

  const handleClose = () => {
    localStorage.removeItem('claimreimid')
    // history.push('/claims/claims-reimbursement?mode=viewList')
    history.push('/claims/claims?mode=viewList')
  }

  const handleAddProviderdetails = () => {
    setProviderDetailsList([...providerDetailsList, { providerId: '', estimatedCost: '' }])
  }

  const handleInputChangeDocumentType = (e: any, index: any) => {
    const { name, value } = e.target
    const list: any = [...documentList]

    list[index][name] = value
    setDocumentList(list)
  }

  const handleRemoveDocumentList = (index: any) => {
    const list: any = [...documentList]

    list.splice(index, 1)
    setDocumentList(list)
  }

  const handleAddDocumentList = () => {
    setDocumentList([
      ...documentList,
      {
        documentType: '',
        document: '',
        documentName: '',
        docFormat: 'image/jpeg',
        imgLink: ''
      }
    ])
  }

  const handleImgChange1 = (e: any, index: any) => {
    let base64String = ''
    const file = e.target['files'][0]

    const reader: any = new FileReader()

    reader.onload = function () {
      base64String = reader.result.replace('data:', '').replace(/^.+,/, '')

      const list: any = [...documentList]

      list[index]['document'] = base64String
      list[index]['docFormat'] = file.type
      list[index]['imgLink'] = reader.result
      list[index]['documentName'] = file.name

      setDocumentList(list)
    }

    reader.readAsDataURL(file)
  }

  const handleFileUploadMsgClose = (event: any, reason: any) => {
    setUploadSuccess(false)
  }

  const handleAddInvoiceItems = (i: any, x: any) => {
    setSelectedInvoiceItems(invoiceDetailsList[i].invoiceItems)
    setInvoiceData(x)
    setSelectedInvoiceItemIndex(i)
    setInvoiceDetailModal(true)
  }

  const changeInvoiceItems = (e: any, i: number, j: number, field?: string, customValue?: any) => {
    const list: any = [...invoiceDetailsList];

    if (field !== undefined) {
      // Handle non-event updates (like from Autocomplete)
      list[i].invoiceItems[j][field] = customValue;
    } else {
      // Handle standard input events
      const { name, value } = e.target;
      list[i].invoiceItems[j][name] = value;

      if (name === 'unit' || name === 'rateKes') {
        list[i].invoiceItems[j]['totalKes'] =
          Number(list[i].invoiceItems[j]['unit']) * Number(list[i].invoiceItems[j]['rateKes']);
      }
    }

    setInvoiceDetailsList(list);
  };

  useEffect(() => {
    const benefitLookup = benefits?.reduce((acc: any, el: any) => {
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

  const handleBenefitChange = (e: any, val: any) => {
    setBenefitsWithCost(prevData => [{ ...prevData[0], benefitId: val?.value }, ...prevData.slice(1)])
  }

  const handleAddInvoiceItemRow = (i: any) => {
    const list: any = [...invoiceDetailsList]

    list[i].invoiceItems.push({
      serviceType: '',
      expenseHead: '',
      rate: 0,
      unit: 0,
      totalKes: 0,
      finalTotal: 0
    })
    setInvoiceDetailsList(list)
  }

  const handleDeleteInvoiceItemRow = (i: any, j: any) => {
    const list: any = [...invoiceDetailsList]

    list[i].invoiceItems.splice(j, 1)
    setInvoiceDetailsList(list)
  }

  const handleInputChangeService = (e: any, index: any) => {
    const { name, value } = e.target
    const list: any = [...invoiceDetailsList]

    list[index][name] = value

    if (name === 'invoiceAmount' || name === 'exchangeRate') {
      list[index]['invoiceAmountKES'] = Number(list[index]['invoiceAmount']) * Number(list[index]['exchangeRate'])
    }

    setInvoiceDetailsList(list)
  }

  const handleRemoveServicedetails = (index: any) => {
    const list: any = [...invoiceDetailsList]

    list.splice(index, 1)
    setInvoiceDetailsList(list)
  }

  const handleAddServicedetails = () => {
    setInvoiceDetailsList([
      ...invoiceDetailsList,
      {
        provideId: '',
        invoiceNo: '',
        invoiceDate: 0,
        invoiceDateVal: new Date(),
        invoiceAmount: 0,
        currency: '',
        exchangeRate: 0,
        invoiceAmountKES: 0,
        transactionNo: '',
        payee: '',
        invoiceItems: [
          {
            serviceType: '',
            expenseHead: '',
            rateKes: 0,
            unit: 0,
            totalKes: 0,
            finalTotal: 0
          }
        ]
      }
    ])
  }

  const handleSelectedSpecs = (event: any) => {
    formik.setFieldValue('diagnosis', event.target.value)
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

    formik.setFieldValue('PrimaryDiagnosis', selectedBenifits)
  }

  const populateStepOne = (id: any) => {
    reimbursementService.getReimbursementById(id).subscribe((res: any) => {
      formik.setValues({
        ...formik.values,
        memberShipNo: res.memberShipNo,
        expectedDOA: res.expectedDOA,
        expectedDOD: res.expectedDOD,
        receiveDate: res.receiveDate,
        serviceDate: res.serviceDate,
        diagnosis: [],
        primaryDigonesisId: res.primaryDigonesisId,
        daycare: res.daycare,
        contactNoOne: res.contactNoOne,
        contactNoTwo: res.contactNoTwo,
        reimbursementStatus: res.reimbursementStatus,
        calculationStatus: res.calculationStatus,
        treatmentDepartment: res.claimType
      })

      res.invoices.forEach((ci: any) => {
        ci['invoiceDateVal'] = new Date(ci.invoiceDate)
      })
      setSelectedDOD(new Date(res.expectedDOD))
      setSelectedDOA(new Date(res.expectedDOA))
      setSelectedReceiveDate(new Date(res.receiveDate))
      setSelectedServiceDate(new Date(res.serviceDate))
      setBenefitsWithCost(res.benefitsWithCost)

      if (res.invoices && res.invoices.length !== 0) {
        setInvoiceDetailsList(res.invoices)
      }

      getMemberDetails(res.memberShipNo)

      if (res.documents.length !== 0) {
        const arr: any = []

        setSlideDocs(res.documents)
        setHasDoc(true)
      }

      if (res.diagnosis && res.diagnosis.length !== 0) {
        setDiagnosisdata(res.diagnosis)
      }

      if (res.source && res.source === 'PRE_AUTH' && res.reimbursementSourceId && res.reimbursementSourceId !== '') {
        loadPreAuthDocs(res.reimbursementSourceId)
        setDisableAllFields(true)
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
        getBenefit(res.content[0].memberId, res.content[0].policyNumber)
      }
    })
    setOpenClientModal(false)
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

    if (searchType === 'NAME') {
      pageRequest.name = id
    }

    if (searchType === 'MEMBERSHIP_NO') {
      pageRequest.value = id
      pageRequest.key = 'MEMBERSHIP_NO'
    }

    memberservice.getMember(pageRequest).subscribe((res: any) => {
      if (res.content?.length > 0) {
        if (searchType === 'NAME') {
          setMemberName({ res })
          handleopenClientModal()
        } else {
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
          getBenefit(res.content[0].memberId, res.content[0].policyNumber)
        }
      } else {
        setAlertMsg(`No Data found for ${id}`)
        setOpenSnack(true)
      }
    })
  }

  const handleSubmit = () => {
    if (new Date(selectedDOA).getTime() > new Date(selectedDOD).getTime()) {
      setAlertMsg('Admission date must be lower than Discharge date')
      setOpenSnack(true)

      return
    }

    if (formik.values.contactNoOne.toString().length < 10) {
      setAlertMsg('Contact One must be of 10 digits')
      setOpenSnack(true)

      return
    }

    if (formik.values.contactNoTwo !== '' && formik.values.contactNoTwo.toString().length !== 10) {
      setAlertMsg('Contact Two must be of 10 digits')
      setOpenSnack(true)
    }

    let totalAmount = 0

    benefitsWithCost.forEach((ele: any) => {
      totalAmount = Number(ele.approvedCost) + totalAmount
    })

    let totalInvoiceAmount = 0

    invoiceDetailsList.forEach((ele: any) => {
      totalInvoiceAmount = Number(ele.invoiceAmount) + totalInvoiceAmount
    })

    // if (totalInvoiceAmount > totalAmount) {
    //   alert('Total Invoice amount can not be more than total sanctioned amount!!!')

    //   return
    // }

    benefitsWithCost.forEach((ele: any) => {
      if (ele.benefitId !== 'OTHER') {
        ele.otherType = ''
      }
    })

    benefitsWithCost.forEach(ctc => {
      ctc.estimatedCost = Number(ctc.estimatedCost)
    })

    const payload: any = {
      policyNumber: memberBasic.policyNumber,
      memberShipNo: formik.values.memberShipNo,
      expectedDOA: new Date(selectedDOA).getTime(),
      expectedDOD: new Date(selectedDOD).getTime(),
      receiveDate: new Date(selectedReceiveDate).getTime(),
      serviceDate: new Date(selectedServiceDate).getTime(),
      contactNoOne: formik.values.contactNoOne,
      contactNoTwo: formik.values.contactNoTwo,
      daycare: formik.values.daycare,
      primaryDigonesisId: selectSpecId,
      benefitsWithCost: benefitsWithCost,
      invoices: invoiceDetailsList,
      claimType: formik.values.treatmentDepartment,
      source: props.source
    }

    const arr: any = []

    formik.values.diagnosis &&
      formik.values.diagnosis.forEach((di: any) => {
        arr.push(di.id.toString())
      })
    payload['diagnosis'] = arr

    if (query.get('intimationid')) {
      payload['source'] = 'CI'
      payload['reimbursementSourceId'] = query.get('intimationid')
    }

    if (props.preauthData !== '' && props.preauthData) {
      payload['source'] = 'PRE_AUTH'
      payload['reimbursementSourceId'] = props.preauthData.id
    }

    // let amt = 0;
    // serviceDetailsList.forEach((item: any) => {
    //   amt += item.estimatedCost
    // })

    const role = JSON.parse(localStorage.getItem('roles')!);
    const common = role.filter((item: any) => Roles.includes(item));
    if (common.length <= 0) {
      if (role.includes("Super_Admin")) {
        common.push("Super_Admin")
      }
    }
    // @ts-ignore
    claimpreauthservice.checkIfCanBeCreated(common[0], payload.claimType == "IPD" ? "IP" : "OP", totalInvoiceAmount).subscribe(res => {

      if (res.originate) {
        if (claimreimid || id) {
          if (claimreimid) {
            reimbursementService.editReimbursement(payload, claimreimid, '1').subscribe((res: any) => {
              props.handleNext()
            })
          }

          if (id) {
            reimbursementService.editReimbursement(payload, id, '1').subscribe((res: any) => {
              props.handleNext()
            })
          }
        }

        if (!claimreimid && !id) {
          const claimreimid = `r-${query.get('preId')}`

          localStorage.setItem('claimreimid', claimreimid)
          reimbursementService.saveReimbursement(payload).subscribe((res: any) => {
            localStorage.setItem('claimreimid', res.id)
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

  const handleReceiveDate = (date: any) => {
    setSelectedReceiveDate(date)
    const timestamp = new Date(date).getTime()

    formik.setFieldValue('receiveDate', timestamp)
  }

  const handleServiceDate = (date: any) => {
    setSelectedServiceDate(date)
    const timestamp = new Date(date).getTime()

    formik.setFieldValue('serviceDate', timestamp)
  }

  const handleInvoiceDate = (date: any, i: number) => {
    const list: any = [...invoiceDetailsList]
    const timestamp = new Date(date).getTime()

    list[i]['invoiceDate'] = timestamp
    list[i]['invoiceDateVal'] = date

    setInvoiceDetailsList(list)
  }

  const onmemberShipNoChange = (e: any) => {
    formik.setFieldValue('memberShipNo', e.target.value)
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

  const populateMember = (membershipNo: any) => {
    getMemberDetails(membershipNo || formik.values.memberShipNo)
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
      return options.filter((item: any) => item?.name?.toLowerCase().indexOf(state?.inputValue) > -1)
    }

    return [{ id: 'selectall', name: 'Select all' }, ...options]
  }

  const handleInvDetClose = () => {
    setInvoiceDetailModal(false)
    setSelectedInvoiceItems([])
    setSelectedInvoiceItemIndex(0)
  }

  const handleMsgErrorClose = () => {
    setOpenSnack(false)
    setAlertMsg('')
  }

  function Alert(props: any) {
    return <MuiAlert elevation={6} variant='filled' {...props} />
  }

  const handleChange = (event: any) => {
    setSearchType(event.target.value)
  }

  const onMemberShipNumberChange = (e: any) => {
    formik.setFieldValue('memberShipNo', e.target.value)
  }

  const handleClosed = () => {
    setOpenClientModal(false)
  }

  const handleopenClientModal = () => {
    setOpenClientModal(true)
  }

  const handleCloseClientModal = () => {
    setOpenClientModal(false)
  }

  const handleSelect = (data: any) => {
    setMemberBasic({
      ...memberBasic,
      name: data.name,
      age: data.age,
      gender: data.gender,
      membershipNo: data.membershipNo,
      policyNumber: data.policyNumber,
      relation: data.relations
    })
    handleClosed()
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
    <Paper elevation={2} sx={{ borderRadius: 3, p: 3, background: "#fafbfc" }}>
      <Box>
        <ClaimModal claimModal={claimModal} handleCloseClaimModal={handleCloseClaimModal} memberBasic={memberBasic} />
        <InvoiceDetailsModal
          handleDeleteInvoiceItemRow={handleDeleteInvoiceItemRow}
          handleAddInvoiceItemRow={handleAddInvoiceItemRow}
          selectedInvoiceItems={selectedInvoiceItems}
          selectedInvoiceItemIndex={selectedInvoiceItemIndex}
          changeInvoiceItems={changeInvoiceItems}
          isOpen={isInvoiceDetailModal}
          onClose={handleInvDetClose}
          onSubmit={handleInvDetClose}
          benefitsWithCost={benefitsWithCost}
          benefitOptions={benefitOptions}
          invoiceData={invoiceData}
          invoiceDetailsList={invoiceDetailsList}
          providerList={providerList}
        />
        <Grid container spacing={3}>
          <Grid item xs={5}>
            <SliderComponent items={slideDocs} />
          </Grid>
          <Grid item xs={7}>
            <div>


              <form onSubmit={formik.handleSubmit}>
                {/* Membership Search */}
                <Grid container spacing={3} alignItems="center" mb={3}>
                  <Grid item xs={8} sm={6} md={4}>
                    <TextField
                      value={formik.values.memberShipNo}
                      onChange={onmemberShipNoChange}
                      disabled={disableAllFields}
                      name='searchCode'
                      label='Membership Code'
                      variant="outlined"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      sx={{ background: "#fff", borderRadius: 2 }}
                    />
                  </Grid>
                  <Grid item xs={4} sm={2} md={2}>
                    <Button
                      onClick={populateMember}
                      color='primary'
                      disabled={disableAllFields}
                      type="button"
                      style={{ borderRadius: 2, height: "56px" }}
                    // fullWidth
                    >
                      Search
                    </Button>
                  </Grid>
                </Grid>

                {/* Basic Details Section */}
                <Box sx={{ background: "#e3e8f0", borderRadius: 2, px: 2, py: 1, mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight={700} color="#D80E51">
                    Basic Details
                  </Typography>
                </Box>
                <Grid container spacing={3} mb={3}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      name='memberName'
                      value={memberBasic.name}
                      disabled
                      label='Name'
                      variant="outlined"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      sx={{ background: "#fff", borderRadius: 2 }}
                    />
                    <Typography
                      variant="body2"
                      sx={{ color: '#D80E51', cursor: 'pointer', mt: 1 }}
                      onClick={viewUserDetails}
                    >
                      View Details
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      name='policyNumber'
                      disabled
                      value={memberBasic.policyNumber}
                      label='Policy Number'
                      variant="outlined"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      sx={{ background: "#fff", borderRadius: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      name='age'
                      type='number'
                      value={memberBasic.age}
                      disabled
                      label='Age'
                      variant="outlined"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      sx={{ background: "#fff", borderRadius: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      name='relation'
                      value={memberBasic.relation}
                      disabled
                      label='Relation'
                      variant="outlined"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      sx={{ background: "#fff", borderRadius: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        views={['year', 'month', 'day']}
                        label='Enrolment Date'
                        value={memberBasic.enrolmentDate}
                        disabled
                        onChange={() => { }}
                        renderInput={params => <TextField {...params} fullWidth margin='normal' variant='outlined' sx={{ background: "#fff", borderRadius: 2 }} />}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        views={['year', 'month', 'day']}
                        label='Enrolment From Date'
                        value={memberBasic.enrolmentFromDate}
                        disabled
                        onChange={() => { }}
                        renderInput={params => <TextField {...params} fullWidth margin='normal' variant='outlined' sx={{ background: "#fff", borderRadius: 2 }} />}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        views={['year', 'month', 'day']}
                        label='Enrolment To Date'
                        value={memberBasic.enrolentToDate}
                        disabled
                        onChange={() => { }}
                        renderInput={params => <TextField {...params} fullWidth margin='normal' variant='outlined' sx={{ background: "#fff", borderRadius: 2 }} />}
                      />
                    </LocalizationProvider>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* Treatment Section */}
                <Box sx={{ background: "#e3e8f0", borderRadius: 3, px: 3, py: 2, mb: 3 }}>
                  <Typography variant="subtitle1" fontWeight={700} color="#D80E51">
                    Treatment & Dates
                  </Typography>
                </Box>
                <Grid container spacing={3} mb={3} alignItems="flex-end">
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel shrink>Treatment Department</InputLabel>
                      <Select
                        name='treatmentDepartment'
                        value={formik.values.treatmentDepartment}
                        disabled
                        onChange={formik.handleChange}
                        variant="outlined"
                        sx={{ background: "#fff", borderRadius: 2, minHeight: 50 }}
                      >
                        <MenuItem value='OPD'>OPD</MenuItem>
                        <MenuItem value='IPD'>IPD</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        views={['year', 'month', 'day']}
                        label='Receive Date'
                        disabled={disableAllFields}
                        value={selectedReceiveDate}
                        onChange={handleReceiveDate}
                        renderInput={params => (
                          <TextField
                            {...params}
                            fullWidth
                            margin='normal'
                            variant='outlined'
                            InputLabelProps={{ shrink: true }}
                            sx={{ background: "#fff", borderRadius: 2, minHeight: 56 }}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        views={['year', 'month', 'day']}
                        label='Service Date'
                        value={selectedServiceDate}
                        disabled={disableAllFields}
                        onChange={handleServiceDate}
                        renderInput={params => (
                          <TextField
                            {...params}
                            fullWidth
                            margin='normal'
                            variant='outlined'
                            InputLabelProps={{ shrink: true }}
                            sx={{ background: "#fff", borderRadius: 2, minHeight: 56 }}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        views={['year', 'month', 'day']}
                        label='DOA'
                        value={selectedDOA}
                        disabled={disableAllFields}
                        onChange={handleDOA}
                        renderInput={params => <TextField {...params} fullWidth margin='normal' variant='outlined' sx={{ background: "#fff", borderRadius: 2 }} />}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        views={['year', 'month', 'day']}
                        label='DOD'
                        value={selectedDOD}
                        disabled={disableAllFields}
                        onChange={handleDODDate}
                        renderInput={params => <TextField {...params} fullWidth margin='normal' variant='outlined' sx={{ background: "#fff", borderRadius: 2 }} />}
                      />
                    </LocalizationProvider>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* Contact Section */}
                <Box sx={{ background: "#e3e8f0", borderRadius: 2, px: 2, py: 1, mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight={700} color="#D80E51">
                    Contact Details
                  </Typography>
                </Box>
                <Grid container spacing={3} mb={3}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      name='contactNoOne'
                      type='number'
                      disabled={disableAllFields}
                      value={formik.values.contactNoOne}
                      onChange={formik.handleChange}
                      label='Contact No. 1'
                      variant="outlined"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      sx={{ background: "#fff", borderRadius: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      name='contactNoTwo'
                      type='number'
                      disabled={disableAllFields}
                      value={formik.values.contactNoTwo}
                      onChange={formik.handleChange}
                      label='Contact No. 2'
                      variant="outlined"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      sx={{ background: "#fff", borderRadius: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formik.values.daycare}
                          onChange={e => handleFieldChecked(e)}
                          name='daycare'
                          color='primary'
                          disabled={disableAllFields}
                        />
                      }
                      label='Daycare'
                      sx={{ mt: 1 }}
                    />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* Invoice Details Section */}
                <Box sx={{ background: "#e3e8f0", borderRadius: 2, px: 2, py: 1, mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight={700} color="#D80E51">
                    Invoice Details
                  </Typography>
                </Box>
                {invoiceDetailsList.map((x: any, i: number) => (
                  <Box
                    key={i}
                    sx={{
                      mb: 3,
                      p: 2,
                      background: "#f7f9fc",
                      borderRadius: 2,
                      boxShadow: 1
                    }}
                  >
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={6} md={3}>
                        <FormControl fullWidth>
                          <InputLabel shrink>Provider</InputLabel>
                          <Select
                            name="providerId"
                            value={x.providerId ?? ''}
                            disabled={!!x.providerId}
                            onChange={e => handleInputChangeService(e, i)}
                            variant="outlined"
                            sx={{ background: "#fff", borderRadius: 2 }}
                          >
                            {providerList.map((ele: any) => (
                              <MenuItem key={ele.id} value={ele.id}>
                                {ele.providerBasicDetails.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <TextField
                          type="number"
                          name="invoiceAmount"
                          value={x.invoiceAmount}
                          onChange={e => handleInputChangeService(e, i)}
                          label="Invoice Amount"
                          variant="outlined"
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                          sx={{ background: "#fff", borderRadius: 2 }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <TextField
                          name="invoiceNo"
                          value={x.invoiceNo}
                          onChange={e => handleInputChangeService(e, i)}
                          label="Invoice Number"
                          variant="outlined"
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                          sx={{ background: "#fff", borderRadius: 2 }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            views={['year', 'month', 'day']}
                            label="Invoice Date"
                            value={x.invoiceDateVal}
                            onChange={date => handleInvoiceDate(date, i)}
                            renderInput={params => (
                              <TextField
                                {...params}
                                margin="normal"
                                variant="outlined"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                sx={{ background: "#fff", borderRadius: 2 }}
                              />
                            )}
                          />
                        </LocalizationProvider>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <FormControl fullWidth>
                          <InputLabel shrink>Currency</InputLabel>
                          <Select
                            name="currency"
                            value={x.currency}
                            onChange={e => handleInputChangeService(e, i)}
                            variant="outlined"
                            sx={{ background: "#fff", borderRadius: 2 }}
                          >
                            {currencyList.map((ele: any) => (
                              <MenuItem key={ele.id} value={ele.code}>
                                {ele.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <TextField
                          type="number"
                          name="exchangeRate"
                          value={x.exchangeRate}
                          onChange={e => handleInputChangeService(e, i)}
                          label="Exchange Rate"
                          variant="outlined"
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                          sx={{ background: "#fff", borderRadius: 2 }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <TextField
                          name="invoiceAmountKES"
                          value={x.invoiceAmountKES}
                          disabled
                          onChange={e => handleInputChangeService(e, i)}
                          label="Invoice Amount (KSH)"
                          variant="outlined"
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                          sx={{ background: "#fff", borderRadius: 2 }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <TextField
                          name="transactionNo"
                          value={x.transactionNo}
                          onChange={e => handleInputChangeService(e, i)}
                          label="Transaction No"
                          variant="outlined"
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                          sx={{ background: "#fff", borderRadius: 2 }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <FormControl fullWidth>
                          <InputLabel shrink>Payee</InputLabel>
                          <Select
                            name="payee"
                            value={x.payee}
                            onChange={e => handleInputChangeService(e, i)}
                            variant="outlined"
                            sx={{ background: "#fff", borderRadius: 2 }}
                          >
                            <MenuItem value="Provider">Provider</MenuItem>
                            <MenuItem value="Intermediaries">Intermediaries</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Button
                          color="primary"
                          type="button"
                          style={{ marginTop: 1, borderRadius: 2 }}
                          onClick={() => handleAddInvoiceItems(i, x)}
                        // fullWidth
                        // variant="outlined"
                        >
                          Add Invoice Items
                        </Button>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {invoiceDetailsList.length !== 1 && (
                          <Button
                            onClick={() => handleRemoveServicedetails(i)}
                            type='button'
                            style={{ background: "#dc3545", color: "#fff", borderRadius: 2, minWidth: 40, minHeight: 40 }}
                          >
                            <DeleteIcon />
                          </Button>
                        )}
                        {invoiceDetailsList.length - 1 === i && (
                          <Button
                            color="primary"
                            type='button'
                            onClick={handleAddServicedetails}
                            style={{ borderRadius: 2, minWidth: 40, minHeight: 40 }}
                          >
                            <AddIcon />
                          </Button>
                        )}
                      </Grid>
                    </Grid>
                  </Box>
                ))}

                {/* Action Buttons */}
                {query.get('mode') !== 'viewOnly' && (
                  <Grid container justifyContent="flex-end" spacing={2} mt={2}>
                    <Grid item>
                      <Button color='primary' type='submit'>
                        Save and Next
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        className={`p-button-text ${classes.saveBtn}`}
                        type='button'
                        onClick={handleClose}
                      >
                        Cancel
                      </Button>
                    </Grid>
                  </Grid>
                )}
              </form>

            </div>
          </Grid>
        </Grid>
      </Box >
    </Paper >
  )
}
