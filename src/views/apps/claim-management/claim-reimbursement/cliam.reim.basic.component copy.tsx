import * as React from 'react'
import { useEffect } from 'react'

import { useParams, useRouter, useSearchParams } from 'next/navigation'

import Box from '@mui/material/Box'

// import { Button } from 'primereact/button';
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

// import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import 'date-fns'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

// import { FettleMultiFieldSearch } from 'fettle-react-components';
import { useFormik } from 'formik'

import { forkJoin } from 'rxjs'

import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
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
import * as yup from 'yup';
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
const bts$ = benefitService.getAllBenefit({ page: 0, size: 1000, summary: true })
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

const validationSchema = yup.object({
  // memberShipNo: yup.string().required('Membership Number is required'),
  treatmentDepartment: yup.string().required('Treatment Department is required'),
});

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
    minWidth: '90%'
  },
  formControl1: {
    margin: theme.spacing ? theme?.spacing(1) : '8px',
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

// function useQuery1() {
//   return new URLSearchParams(useLocation().search);
// }

// function Alert(props) {
//     return <MuiAlert elevation={6} variant="filled" {...props} />;
// }

export default function ClaimsReimBasicComponent(props: any) {
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
  const [benefitOptions, setBenefitOptions] = React.useState<any>([])
  const [searchType, setSearchType] = React.useState('MEMBERSHIP_NO')
  const [openClientModal, setOpenClientModal] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(true)
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

  const [selectedId, setSelectedId] = React.useState('')
  const [selectSpecId, setSelectedSpecId] = React.useState('')

  const [slideDocs, setSlideDocs] = React.useState<any>([
    // {
    //   url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
    // },
    // {
    //   url: 'https://i.picsum.photos/id/871/536/354.jpg?hmac=qo4tHTSoxyMyagkIxVbpDCr80KoK2eb_-0rpAZojojg'
    // }
  ])

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

  const formik: any = useFormik({
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

      // claimType: [],
      // othersType: [],
      daycare: false,
      diagnosis: [],
      primaryDigonesisId: '',
      expectedDOD: '',
      expectedDOA: '',
      estimatedCost: '',
      referalTicketRequired: '',
      contactNoOne: '',
      contactNoTwo: '',
      treatmentDepartment: '',
      receiveDate: '',
      serviceDate: ''
    },

    validationSchema: validationSchema,
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
    relation: '',
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

  const [specsList, setSpecsList] = React.useState([])

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

  const [invoiceDetailsList, setInvoiceDetailsList] = React.useState<any>([
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
          benefitId: '',
          totalKes: 0,
          finalTotal: 0
        }
      ]
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
          arr.push({ id: ele.id, diagnosisName: ele.name, code: ele.code })
        })
        setter(arr)
      })

      return () => subscription.unsubscribe()
    }, [observable, setter])
  }

  useObservable(cts$, setClaimTypeList)
  useObservable(cs$, setCurrencyList)

  // useObservable(bts$, setBenefits);
  // useObservable(bts$, setOtherTypeList);//query
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

  // const useObservable = (observable:any, setter:any) => {
  //     useEffect(() => {
  //         let subscription = observable.subscribe((result) => {
  //             setter(result.content);
  //         });
  //         return () => subscription.unsubscribe();
  //     }, [observable, setter]);
  // };

  useEffect(() => {
    const membershipNo = query.get('membershipNo')

    if (membershipNo) {
      formik.setFieldValue('memberShipNo', membershipNo)
      populateMember()
    }
  }, [])

  React.useEffect(() => {
    if (id) {
      populateStepOne(id)
    }
  }, [id])

  React.useEffect(() => {
    if (localStorage.getItem('claimreimid')) {
      populateStepOne(localStorage.getItem('claimreimid'))
    }
  }, [localStorage.getItem('claimreimid')])

  React.useEffect(() => {
    if (query.get('intimationid')) {
      claimintimationservice.getIntimationDetails(query.get('intimationid') as string).subscribe((res: any) => {
        formik.setFieldValue('memberShipNo', res.membershipNo)

        // let arr:any = [];
        if (res.claimIntimationDocumentDetails.length !== 0) {
          // res.claimIntimationDocumentDetails.forEach(el => {
          //   let docURL =
          //     config.rootUrl +
          //     'claim-query-service/v1/claimintimations/' +
          //     query.get('intimationid').toString() +
          //     '/docs/' +
          //     el.documentName + "?attatched=false";
          //   arr.push({ url: docURL });
          // });

          setSlideDocs(res.claimIntimationDocumentDetails)
          setHasDoc(true)
        }

        if (res.preauthid) {
          claimpreauthservice.getPreAuthById(res.preauthid).subscribe((pre: any) => {
            populateFromPreAuth(pre)
            setDisableAllFields(true)

            if (pre.documents && pre.documents.length !== 0) {
              // let arr1 = [];
              // // setDocumentList(pre.documents)
              // pre.documents.forEach(dc => {
              //   let docURL =
              //     config.rootUrl +
              //     'claim-query-service/v1/preauths/' +
              //     res.preauthid.toString() +
              //     '/docs/' +
              //     dc.documentName + "?attatched=false";
              //   arr1.push({ url: docURL });
              // });
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

      // diagnosis: res.diagnosis,
      daycare: res.daycare,
      contactNoOne: res.contactNoOne,
      contactNoTwo: res.contactNoTwo
    })

    // res.claimInvoices.forEach(ci => {
    //   ci['invoiceDateVal'] = new Date(ci.invoiceDate);
    // });
    setSelectedDOD(new Date(res.expectedDOD))
    setSelectedDOA(new Date(res.expectedDOA))
    setSelectedReceiveDate(new Date(res.receiveDate))
    setSelectedServiceDate(new Date(res.serviceDate))
    res.benefitsWithCost.forEach((bf: any) => {
      bf.estimatedCost = bf.maxApprovedCost
    })
    setBenefitsWithCost(res.benefitsWithCost)

    // setClaimTypeCostList(res.claimTypeWithCost);
    // setInvoiceDetailsList(res.claimInvoices);
    const prArr: any = []

    res.providers.forEach((pr: any) => {
      prArr.push({
        provideId: pr.providerId,
        invoiceNo: '',
        invoiceDate: 0,
        invoiceDateVal: new Date(),
        invoiceAmount: pr.estimatedCost,
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
      })
    })

    if (prArr.length > 0) {
      setInvoiceDetailsList(prArr)
    }

    getMemberDetails(res.memberShipNo)

    if (res.documents.length !== 0) {
      // setDocumentList(res.documents);
      // let arr:any = [];
      // res.documents.forEach(dc => {
      //   let docURL = config.rootUrl + 'claim-query-service/v1/preauths/' + res.id.toString() + '/docs/' + dc.documentName + "?attatched=false";
      //   arr.push({ url: docURL });
      // });
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
          // setDocumentList(res.documents);
          // let arr:any = [];
          // res.documents.forEach(dc => {
          //   let docURL =
          //     config.rootUrl + 'claim-query-service/v1/preauths/' + res.id.toString() + '/docs/' + dc.documentName + "?attatched=false";
          //   arr.push({ url: docURL });
          // });
          setSlideDocs([...slideDocs, ...res.documents])
          setHasDoc(true)
        }
      })

      // setImportMode(false)
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
    console.log("working....");
    history.push('/claims/claims-reimbursement?mode=viewList')

    // window.location.reload();
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

      // imageBase64Stringsep = base64String;

      // alert(imageBase64Stringsep);

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

  const handleAddInvoiceItems = (i: any) => {
    setSelectedInvoiceItems(invoiceDetailsList[i].invoiceItems)
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
    if (!benefits || benefits.length === 0) return
    const benefitLookup = benefits?.reduce((acc: any, el: any) => {
      acc[el.benefitStructureId] = el.name

      return acc
    }, {})

    let temp: any = []

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

  // const handleBenefitChange = (e, val) => {
  //   setBenefitsWithCost(prevData => [{ ...prevData[0], benefitId: val?.value }, ...prevData.slice(1)]);
  // };

  const handleBenefitChange = (e: any, val: any, i: any) => {
    setBenefitsWithCost(prevData => {
      const newData = [...prevData]

      newData[i] = { ...newData[i], benefitId: val?.value }

      return newData
    })
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

  const handleDeleteInvoiceItemRow = (i: number, j: any) => {
    const list: any = [...invoiceDetailsList]

    list[i].invoiceItems.splice(j, 1)
    setInvoiceDetailsList(list)
  }

  //remove
  // const handleInputChangeClaimCost = (e:any,index:any) => {
  //   const { name, value } = e.target;
  //   const list:any = [...claimTypeCostList];
  //   list[index][name] = value;
  //   if (name === 'rate' || name === 'estimatedCost') {
  //     list[index]['convertedValue'] = Number(list[index]['rate']) * Number(list[index]['estimatedCost']);
  //   }
  //   setClaimTypeCostList(list);
  // };

  // const handleRemoveClaimCost = (index:any) => {
  //   const list:any = [...claimTypeCostList];
  //   list.splice(index, 1);
  //   setClaimTypeCostList(list);
  // };

  // const handleAddClaimCost = () => {
  //   setClaimTypeCostList([
  //     ...claimTypeCostList,
  //     {
  //       claimType: '',
  //       otherType: '',
  //       estimatedCost: 0,
  //       currency: '',
  //       rate: 0,
  //       convertedValue: 0,
  //     },
  //   ]);
  // };
  //remove

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
            finalTotal: 0,
            benefitId: ''
          }
        ]
      }
    ])
  }

  const handleSelectedSpecs = (event: any) => {
    formik.setFieldValue('diagnosis', event.target.value)
  }

  // const handleDiagnosisChange = (e, val) => {
  //   let selectedBenifits = val;
  //   const isSelecAll = selectedBenifits.some((item:any) =>  item.id === 'selectall');
  //   if (isSelecAll) {
  //     if (diagnosisList.length > 0 && diagnosisList.length === formik.values.diagnosis.length) {
  //       selectedBenifits = [];
  //     } else {
  //       selectedBenifits = diagnosisList;
  //     }
  //   }
  //   formik.setFieldValue('PrimaryDiagnosis', selectedBenifits);
  // };
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
    setIsLoading(true)
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

      // setClaimTypeCostList(res.claimTypeWithCost);
      if (res.invoices && res.invoices.length !== 0) {
        setInvoiceDetailsList(res.invoices)
      }

      getMemberDetails(res.memberShipNo)

      if (res.documents.length !== 0) {
        // setDocumentList(res.documents);
        const arr: any = []

        // res.documents.forEach(dc => {
        //   let docURL =
        //     config.rootUrl + 'claim-query-service/v1/reimbursements/' + res.id.toString() + '/docs/' + dc.documentName + "?attatched=false";
        //   arr.push({ url: docURL });
        // });
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
    setIsLoading(false)
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
          console.log('res.content', res)
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

    //   if(searchType === "MEMBERSHIP_NO"){
    //      memberservice.getMember(pageRequest11).subscribe((res:any) => {
    //     if (res.content?.length > 0) {
    //       // formik.setFieldValue('contactNoOne', res.content.mobileNo);
    //       setMemberName({ res });
    //     }
    //   });
    //   }
    //   if(searchType === "NAME"){
    //     memberservice.getMember(pageRequest1).subscribe((res:any) => {
    //    if (res.content?.length > 0) {
    //      // formik.setFieldValue('contactNoOne', res.content.mobileNo);
    //      setMemberName({ res });
    //    }
    //  });
    //  }
  }

  const handleSubmit = () => {
    try {
      if (!formik.values.memberShipNo) {
        setAlertMsg('Please select the member first');
        setOpenSnack(true)
        return
      }

      if (new Date(selectedDOA).getTime() > new Date(selectedDOD).getTime()) {
        setAlertMsg('Admission date must be lower than Discharge date')
        setOpenSnack(true)
        return
      }

      if (formik.values.contactNoOne && formik.values.contactNoOne.toString().length !== 10) {
        setAlertMsg('Contact One must be of 10 digits')
        setOpenSnack(true)
        return
      }

      if (formik.values.contactNoTwo && formik.values.contactNoTwo.toString().length !== 10) {
        setAlertMsg('Contact Two must be of 10 digits')
        setOpenSnack(true)
        return
      }

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
        memberShipNo: memberBasic.membershipNo,
        expectedDOA: new Date(selectedDOA).getTime(),
        expectedDOD: new Date(selectedDOD).getTime(),
        receiveDate: new Date(selectedReceiveDate).getTime(),
        serviceDate: new Date(selectedServiceDate).getTime(),
        contactNoOne: formik.values.contactNoOne,
        contactNoTwo: formik.values.contactNoTwo,
        claimType: formik.values.treatmentDepartment,
        daycare: formik.values.daycare,
        primaryDigonesisId: selectSpecId,
        benefitsWithCost: benefitsWithCost,
        invoices: invoiceDetailsList
      }

      const arr: any = []
      formik.values.diagnosis &&
        formik.values.diagnosis.forEach((di: any) => {
          arr.push(di.id.toString())
        })
      payload['diagnosis'] = arr

      // if (query.get('intimationid')) {
      //   payload['source'] = 'CI'
      //   payload['reimbursementSourceId'] = query.get('intimationid')
      // }

      // if (props.preauthData !== '' && props.preauthData) {
      //   payload['source'] = 'PRE_AUTH'
      //   payload['reimbursementSourceId'] = props.preauthData.id
      // } 

      payload['source'] = 'NONE'

      const claimreimid = localStorage.getItem('claimreimid') ? localStorage.getItem('claimreimid') : ''

      const temp: any[] = [];

      invoiceDetailsList.forEach((item: any) => {
        const benefitTotals: { [key: string]: { estimatedCost: number, providerId: any } } = {};

        item.invoiceItems.forEach((subItem: any) => {
          if (subItem.benefitId) {
            if (!benefitTotals[subItem.benefitId]) {
              benefitTotals[subItem.benefitId] = {
                estimatedCost: 0,
                providerId: item.provideId
              };
            }
            benefitTotals[subItem.benefitId].estimatedCost += Number(subItem.totalKes) || 0;
          }
        });

        // Push each benefitId summary for this item
        Object.entries(benefitTotals).forEach(([benefitId, data]) => {
          temp.push({
            benefitId,
            estimatedCost: data.estimatedCost,
            providerId: data.providerId
          });
        });
      });

      payload['benefitsWithCost'] = temp

      let amt = 0;
      invoiceDetailsList.forEach((item: any) => {
        amt += item.invoiceAmount
      })

      const role = JSON.parse(localStorage.getItem('roles')!);
      const common = role.filter((item: any) => Roles.includes(item));
      if (common.length <= 0) {
        if (role.includes("Super_Admin")) {
          common.push("Super_Admin")
        }
      }
      // @ts-ignore
      claimpreauthservice.checkIfCanBeCreated(common[0], payload.claimType == "IPD" ? "IP" : "OP", amt).subscribe(res => {

        if (res.originate) {
          if (claimreimid || id) {
            if (claimreimid) {
              reimbursementService.editReimbursement(payload, claimreimid, '1').subscribe({
                next: (res: any) => {
                  console.log("Edit successful:", res);
                  props.handleNext()
                },
                error: (error: any) => {
                  console.error("Edit failed:", error);
                  setAlertMsg('Failed to save changes. Please try again.')
                  setOpenSnack(true)
                }
              })
            }

            if (id) {
              reimbursementService.editReimbursement(payload, id, '1').subscribe({
                next: (res: any) => {
                  console.log("Edit successful:", res);
                  props.handleNext()
                },
                error: (error: any) => {
                  console.error("Edit failed:", error);
                  setAlertMsg('Failed to save changes. Please try again.')
                  setOpenSnack(true)
                }
              })
            }
          } else {
            const claimreimid = `r-${query.get('preId')}`
            localStorage.setItem('claimreimid', claimreimid)

            reimbursementService.saveReimbursement(payload).subscribe({
              next: (res: any) => {
                console.log("Save successful:", res);
                localStorage.setItem('claimreimid', res.id)
                props.handleNext()
              },
              error: (error: any) => {
                console.error("Save failed:", error);
                setAlertMsg('Failed to save. Please try again.')
                setOpenSnack(true)
              }
            })
          }
        } else {
          setAlertMsg('You are not allowed to originate this pre-auth!');
          setOpenSnack(true);
          return;
        }
      });
    } catch (error) {
      console.error("Form submission error:", error);
      setAlertMsg('An unexpected error occurred. Please try again.')
      setOpenSnack(true)
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

  const handleInvoiceDate = (date: any, i: any) => {
    const list: any = [...invoiceDetailsList]
    const timestamp = new Date(date).getTime()

    list[i]['invoiceDate'] = timestamp
    list[i]['invoiceDateVal'] = date

    setInvoiceDetailsList(list)
  }

  const onmemberShipNoChange = (e: any) => {
    formik.setFieldValue('memberShipNo', e.target.value)
  }

  const populateMember = () => {
    const membershipNo = query.get('membershipNo')

    if (membershipNo) {
      getMemberDetails(membershipNo)
    } else {
      getMemberDetails(formik.values.memberShipNo)
    }

    // setMemberBasic({
    //     name: 'Samiran',
    //     policyNumber: '8788909989088767',
    //     age: '34',
    //     relation: 'Son',
    //     enrolmentDate: new Date(),
    //     enrolentToDate: new Date(),
    //     enrolmentFromDate: new Date(),
    // })
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

  const handlerNameFunction = (valueId: any) => {
    const pageRequest: any = {
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

  const handleMsgErrorClose = () => {
    setOpenSnack(false)
    setAlertMsg('')
  }

  function Alert(props: any) {
    return <MuiAlert elevation={6} variant='filled' {...props} />
  }

  const populateMemberFromSearch = (type: any) => {
    console.log('name', formik.values.memberShipNo, type)
    if (formik.values.memberShipNo) {
      if (type === 'name') {
        getMemberDetails(formik.values.memberShipNo)
      } else {
        getMemberDetails(formik.values.memberShipNo)
      }
    }
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
    getBenefit(data?.memberId, data?.policyNumber)
    handleClosed()
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
      {/* {
        isLoading ? (
          <Box display={"flex"} justifyContent={"center"} alignItems={"center"} height={"75vh"} >
            <CircularProgress color="secondary" />
          </Box>
        )
          : */}
      <Paper elevation={0}>
        <Box p={3} my={2}>
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
          />
          {/* <Snackbar open={openSnack} autoHideDuration={4000} onClose={handleMsgErrorClose}>
          <Alert onClose={handleMsgErrorClose} severity="error">
            {alertMsg}
          </Alert>
        </Snackbar> */}
          {hasDoc ? (
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <SliderComponent items={slideDocs} />
              </Grid>
              <Grid item xs={6}>
                <div>
                  <form onSubmit={formik.handleSubmit}>
                    <Grid container spacing={3} style={{ marginBottom: '50px' }}>
                      <TextField
                        id='standard-basic'
                        value={formik.values.memberShipNo}
                        onChange={onmemberShipNoChange}
                        disabled={disableAllFields ? true : false}
                        name='searchCode'
                        style={{ marginLeft: '10px' }}
                        label='Membership code'
                      />
                      <Button
                        variant='contained'
                        onClick={populateMember}
                        color='primary'
                        disabled={disableAllFields ? true : false}
                        style={{ marginLeft: '10px', marginTop: 10, height: '50%' }}
                      >
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
                          value={memberBasic.relation}
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
                    </Grid>
                    <Grid container spacing={3} style={{ marginBottom: '20px' }}>
                      <Grid item xs={4}>
                        {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                          views={['year', 'month', 'date']}
                          variant="inline"
                          format="dd/MM/yyyy"
                          margin="normal"
                          id="date-picker-inline"
                          label="Enrolment Date"
                          value={memberBasic.enrolmentDate}
                          disabled
                          InputProps={{
                            classes: {
                              root: classes.inputRoot,
                              disabled: classes.disabled,
                            },
                          }}
                          KeyboardButtonProps={{
                            'aria-label': 'change ing date',
                          }}
                        />
                      </MuiPickersUtilsProvider> */}
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
                      <Grid item xs={4}>
                        {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                          views={['year', 'month', 'date']}
                          variant="inline"
                          format="dd/MM/yyyy"
                          margin="normal"
                          id="date-picker-inline"
                          label="Enrolment From Date"
                          value={memberBasic.enrolmentFromDate}
                          disabled
                          InputProps={{
                            classes: {
                              root: classes.inputRoot,
                              disabled: classes.disabled,
                            },
                          }}
                          KeyboardButtonProps={{
                            'aria-label': 'change ing date',
                          }}
                        />
                      </MuiPickersUtilsProvider> */}
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            views={['year', 'month', 'day']}
                            label='Enrolment From Date'
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
                        {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                          views={['year', 'month', 'date']}
                          variant="inline"
                          format="dd/MM/yyyy"
                          margin="normal"
                          id="date-picker-inline"
                          label="Enrolent To Date"
                          value={memberBasic.enrolentToDate}
                          disabled
                          InputProps={{
                            classes: {
                              root: classes.inputRoot,
                              disabled: classes.disabled,
                            },
                          }}
                          KeyboardButtonProps={{
                            'aria-label': 'change ing date',
                          }}
                        />
                      </MuiPickersUtilsProvider> */}
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            views={['year', 'month', 'day']}
                            label='Enrolent To Date'
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
                    {benefitsWithCost.map((x: any, i: number) => (
                      <Grid container spacing={3} key={i} style={{ marginBottom: '20px' }}>
                        {/* Benefit Autocomplete */}
                        <Grid item xs={5}>
                          <FormControl className={classes.formControl} fullWidth>
                            <Autocomplete
                              value={
                                x.benefitId
                                  ? benefitOptions.find((item: any) => item.value === x.benefitId) || null
                                  : null
                              }
                              onChange={(e, val) => handleBenefitChange(e, val, i)}
                              id='benefit-autocomplete'
                              options={benefitOptions}
                              getOptionLabel={(option: any) => option?.label || ''}
                              isOptionEqualToValue={(option: any, value: any) => option?.value === value?.value}
                              renderInput={(params: any) => <TextField {...params} label='Benefit' />}
                            />
                          </FormControl>
                        </Grid>

                        {/* Other Type Select */}
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

                        {/* Estimated Cost */}
                        <Grid item xs={3}>
                          <TextField
                            id='estimated-cost'
                            type='number'
                            name='estimatedCost'
                            value={x.estimatedCost}
                            onChange={e => handleInputChangeBenefitWithCost(e, i)}
                            label='Estimated Cost'
                          />
                        </Grid>

                        {/* Add/Remove Buttons */}
                        <Grid item xs={2} style={{ display: 'flex', alignItems: 'center' }}>
                          {benefitsWithCost.length !== 1 && (
                            <Button
                              className='mr10'
                              onClick={() => handleRemoveClaimCost(i)}
                              color='secondary'
                              style={{ marginLeft: '5px' }}
                            >
                              <DeleteIcon />
                            </Button>
                          )}
                          {benefitsWithCost.length - 1 === i && (
                            <Button color='primary' style={{ marginLeft: '5px' }} onClick={handleAddClaimCost}>
                              <AddIcon />
                            </Button>
                          )}
                        </Grid>
                      </Grid>
                    ))}

                    <Grid item xs={12} style={{ marginTop: '20px', marginBottom: '15px' }}>
                      <Divider />
                    </Grid>
                    <Grid container spacing={3} style={{ marginBottom: '20px' }}>
                      <Grid item xs={4}>
                        <FormControl className={classes.formControl}>
                          <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                            Treatment Department
                          </InputLabel>
                          <Select
                            labelId='demo-simple-select-label'
                            label='Treatment Department'
                            id='demo-simple-select'
                            name='treatmentDepartment'
                            value={formik.values.treatmentDepartment || ''}
                            // disabled={disableAllFields ? true : false}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          >
                            <MenuItem value='OPD'>OPD</MenuItem>
                            <MenuItem value='IPD'>IPD</MenuItem>
                          </Select>
                          {formik.touched.treatmentDepartment && formik.errors.treatmentDepartment && (
                            <span style={{ color: 'red', fontSize: 12 }}>{formik.errors.treatmentDepartment}</span>
                          )}
                        </FormControl>
                      </Grid>
                      <Grid item xs={4}>
                        {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                          views={['year', 'month', 'date']}
                          variant="inline"
                          format="dd/MM/yyyy"
                          margin="normal"
                          id="date-picker-inline"
                          autoOk={true}
                          label="Receive date"
                          disabled={disableAllFields ? true : false}
                          value={selectedReceiveDate}
                          onChange={handleReceiveDate}
                          KeyboardButtonProps={{
                            'aria-label': 'change DOD date',
                          }}
                        />
                      </MuiPickersUtilsProvider> */}
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            views={['year', 'month', 'day']}
                            label='Receive date'
                            disabled={disableAllFields ? true : false}
                            value={selectedReceiveDate}
                            onChange={handleReceiveDate}
                            renderInput={(params: any) => <TextField {...params} margin='normal' variant='outlined' />}
                          />
                        </LocalizationProvider>
                      </Grid>
                      <Grid item xs={4}>
                        {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                          views={['year', 'month', 'date']}
                          variant="inline"
                          format="dd/MM/yyyy"
                          margin="normal"
                          id="date-picker-inline"
                          autoOk={true}
                          label="Service Date"
                          value={selectedServiceDate}
                          disabled={disableAllFields ? true : false}
                          onChange={handleServiceDate}
                          KeyboardButtonProps={{
                            'aria-label': 'change DOD date',
                          }}
                        />
                      </MuiPickersUtilsProvider> */}
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            views={['year', 'month', 'day']}
                            label='Service Date'
                            value={selectedServiceDate}
                            disabled={disableAllFields ? true : false}
                            onChange={handleServiceDate}
                            renderInput={(params: any) => <TextField {...params} margin='normal' variant='outlined' />}
                          />
                        </LocalizationProvider>
                      </Grid>
                    </Grid>

                    <Grid container spacing={3} style={{ marginBottom: '20px' }}>
                      <Grid item xs={3}>
                        {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                          views={['year', 'month', 'date']}
                          variant="inline"
                          format="dd/MM/yyyy"
                          margin="normal"
                          id="date-picker-inline"
                          label="DOA"
                          autoOk={true}
                          value={selectedDOA}
                          disabled={disableAllFields ? true : false}
                          onChange={handleDOA}
                          KeyboardButtonProps={{
                            'aria-label': 'change ing date',
                          }}
                        />
                      </MuiPickersUtilsProvider> */}
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            views={['year', 'month', 'day']}
                            label='DOA'
                            value={selectedDOA}
                            disabled={disableAllFields ? true : false}
                            onChange={handleDOA}
                            renderInput={(params: any) => <TextField {...params} margin='normal' variant='outlined' />}
                          />
                        </LocalizationProvider>
                      </Grid>
                      <Grid item xs={3}>
                        {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                          views={['year', 'month', 'date']}
                          variant="inline"
                          format="dd/MM/yyyy"
                          margin="normal"
                          id="date-picker-inline"
                          autoOk={true}
                          label="DOD"
                          value={selectedDOD}
                          disabled={disableAllFields ? true : false}
                          onChange={handleDODDate}
                          KeyboardButtonProps={{
                            'aria-label': 'change DOD date',
                          }}
                        />
                      </MuiPickersUtilsProvider> */}
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            views={['year', 'month', 'day']}
                            label='DOD'
                            value={selectedDOD}
                            disabled={disableAllFields ? true : false}
                            onChange={handleDODDate}
                            renderInput={(params: any) => <TextField {...params} margin='normal' variant='outlined' />}
                          />
                        </LocalizationProvider>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Autocomplete
                          value={selectedId ?? ''}
                          onChange={(e, value) => doSelectValue(e, value)}
                          id='primary-diagnosis-autocomplete'
                          options={diagnosisList}
                          getOptionLabel={(option: any) => option?.diagnosisName || ''}
                          isOptionEqualToValue={(option: any, value: any) => option?.id === value?.id}
                          renderInput={(params: any) => <TextField {...params} label='Primary Diagnosis' />}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6} md={3}>
                        <Autocomplete
                          multiple
                          value={formik.values.diagnosis}
                          onChange={handleDiagnosisChange}
                          id='other-diagnoses-autocomplete'
                          options={diagnosisList}
                          disableCloseOnSelect
                          getOptionLabel={(option: any) => option?.diagnosisName || ''}
                          isOptionEqualToValue={(option: any, value: any) => option?.id === value?.id}
                          renderOption={(props: any, option: any, { selected }: { selected: any }) => (
                            <li {...props}>
                              <Checkbox
                                icon={icon}
                                checkedIcon={checkedIcon}
                                style={{ marginRight: 8, color: '#626bda' }}
                                checked={selected}
                              />
                              {option.diagnosisName}
                            </li>
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
                          disabled={disableAllFields ? true : false}
                          value={formik.values.contactNoOne}
                          onChange={formik.handleChange}
                          label='Contact No. 1'
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <TextField
                          id='standard-basic'
                          name='contactNoTwo'
                          type='number'
                          disabled={disableAllFields ? true : false}
                          value={formik.values.contactNoTwo}
                          onChange={formik.handleChange}
                          label='Contact No. 2'
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={!!formik.values.daycare}
                              onChange={e => handleFieldChecked(e)}
                              name='daycare'
                              color='primary'

                            // disabled={disableAllFields ? true : false}
                            />
                          }
                          label='Daycare'
                        />
                      </Grid>
                      {/* <Grid item xs={4}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={formik.values.referalTicketRequired}
                                        onChange={e => handleFieldChecked(e)}
                                        name="referalTicketRequired"
                                        color="primary"
                                    />
                                }
                                label="Referral Ticket Required"
                            />
                        </Grid> */}
                    </Grid>

                    <Grid item xs={12} style={{ marginBottom: '15px' }}>
                      <Divider />
                    </Grid>

                    <Grid item xs={12} style={{ marginTop: '20px' }}>
                      <span style={{ color: '#4472C4', fontWeight: 'bold' }}>INVOICE DETAILS</span>
                    </Grid>

                    <Grid item xs={12} style={{ marginBottom: '15px' }}>
                      <Divider />
                    </Grid>

                    {invoiceDetailsList.map((x: any, i: any) => {
                      return (
                        <div key={`invoiceDetails-${i}`}>
                          <Grid container spacing={3} key={i}>
                            <Grid item xs={4}>
                              <Autocomplete
                                options={providerList}
                                getOptionLabel={(option: any) => option?.providerBasicDetails?.name || ''}
                                value={providerList.find((p: any) => p.id === x.provideId) || null}
                                onChange={(_, newValue) => {
                                  handleInputChangeService(
                                    { target: { name: 'provideId', value: newValue ? newValue.id : '' } },
                                    i
                                  );
                                }}
                                disabled={disableAllFields ? true : false}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Provider"
                                    variant="outlined"
                                    margin="normal"
                                  />
                                )}
                              />
                            </Grid>
                            <Grid item xs={4}>
                              <TextField
                                id='standard-basic'
                                type='number'
                                name='invoiceAmount'
                                value={x.invoiceAmount}
                                disabled={disableAllFields ? true : false}
                                onChange={e => handleInputChangeService(e, i)}
                                label='Invoice Amount'
                              />
                            </Grid>
                            <Grid item xs={4}>
                              <TextField
                                id='standard-basic'
                                name='invoiceNo'
                                value={x.invoiceNo}
                                // disabled={disableAllFields ? true : false}
                                onChange={e => handleInputChangeService(e, i)}
                                label='Invoice number'
                              />
                            </Grid>
                            <Grid item xs={4}>
                              {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
                              <KeyboardDatePicker
                                views={['year', 'month', 'date']}
                                variant="inline"
                                format="dd/MM/yyyy"
                                margin="normal"
                                id="date-picker-inline"
                                label="Invoice Date"
                                autoOk={true}
                                value={x.invoiceDateVal}
                                // disabled={disableAllFields ? true : false}
                                onChange={(date:any) => {
                                  handleInvoiceDate(date, i);
                                }}
                                KeyboardButtonProps={{
                                  'aria-label': 'change ing date',
                                }}
                              />
                            </MuiPickersUtilsProvider> */}
                              <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                  views={['year', 'month', 'day']}
                                  label='Invoice Date'
                                  value={x.invoiceDateVal}
                                  // disabled={disableAllFields ? true : false}
                                  onChange={(date: any) => {
                                    handleInvoiceDate(date, i)
                                  }}
                                  renderInput={(params: any) => (
                                    <TextField {...params} margin='normal' variant='outlined' />
                                  )}
                                />
                              </LocalizationProvider>
                            </Grid>
                            <Grid item xs={4}>
                              <FormControl className={classes.formControl}>
                                <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                                  Currency
                                </InputLabel>
                                <Select
                                  labelId='demo-simple-select-label'
                                  label='Currency'
                                  id='demo-simple-select'
                                  name='currency'
                                  value={x.currency}
                                  // disabled={disableAllFields ? true : false}
                                  onChange={e => handleInputChangeService(e, i)}
                                >
                                  {currencyList.map((ele: any) => {
                                    return (
                                      <MenuItem key={ele.id} value={ele.code}>
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
                                name='exchangeRate'
                                value={x.exchangeRate}
                                // disabled={disableAllFields ? true : false}
                                onChange={e => handleInputChangeService(e, i)}
                                label='Exchange Rate'
                              />
                            </Grid>
                            <Grid item xs={4}>
                              <TextField
                                id='standard-basic'
                                name='invoiceAmountKES'
                                value={x.invoiceAmountKES}
                                disabled
                                onChange={e => handleInputChangeService(e, i)}
                                label='Invoice Amount(KSH)'
                              />
                            </Grid>

                            <Grid item xs={4}>
                              <TextField
                                id='standard-basic'
                                name='transactionNo'
                                value={x.transactionNo}
                                // disabled={disableAllFields ? true : false}
                                onChange={e => handleInputChangeService(e, i)}
                                label='Transaction No'
                              />
                            </Grid>
                            <Grid item xs={4}>
                              <FormControl className={classes.formControl}>
                                <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                                  Payee
                                </InputLabel>
                                <Select
                                  labelId='demo-simple-select-label'
                                  label='Payee'
                                  id='demo-simple-select'
                                  name='payee'
                                  value={x.payee}
                                  onChange={e => handleInputChangeService(e, i)}
                                >
                                  {/* {serviceList.map((ele:any) => {
                                                    return (
                                                        <MenuItem key={ele.id} value={ele.name}>
                                                            {ele.name}
                                                        </MenuItem>
                                                    );
                                                })} */}
                                  <MenuItem value='Provider'>Provider</MenuItem>
                                  <MenuItem value='Member'>Member</MenuItem>
                                  <MenuItem value='Intermediaries'>Intermediaries</MenuItem>
                                  <MenuItem value='Corporate'>Corporate</MenuItem>
                                </Select>
                              </FormControl>
                            </Grid>
                            <Grid item xs={5}>
                              <Button
                                variant='contained'
                                color='primary'
                                type='button'
                                style={{ marginLeft: '5px', marginTop: '10px' }}
                                // disabled={disableAllFields ? true : false}
                                onClick={() => handleAddInvoiceItems(i)}
                              >
                                Add Invoice items
                              </Button>
                            </Grid>

                            <Grid item xs={2} style={{ display: 'flex', alignItems: 'center' }}>
                              {invoiceDetailsList.length !== 1 && (
                                <Button
                                  className='mr10'
                                  onClick={() => handleRemoveServicedetails(i)}
                                  variant='contained'
                                  // color="secondary"
                                  disabled={disableAllFields ? true : false}
                                  style={{ marginLeft: '5px', background: '#dc3545', color: '#f1f1f1' }}
                                >
                                  <DeleteIcon />
                                </Button>
                              )}
                              {invoiceDetailsList.length - 1 === i && (
                                <Button
                                  variant='contained'
                                  color='primary'
                                  style={{ marginLeft: '5px' }}
                                  disabled={disableAllFields ? true : false}
                                  onClick={handleAddServicedetails}
                                >
                                  <AddIcon />
                                </Button>
                              )}
                            </Grid>
                          </Grid>
                          <Grid item xs={12} style={{ marginBottom: '15px', marginTop: '10px' }}>
                            <Divider />
                          </Grid>
                        </div>
                      )
                    })}

                    {query.get('mode') !== 'viewOnly' && (
                      <Grid item xs={12} className={classes.actionContainer}>
                        <Button variant='contained' color='primary' type='submit'>
                          Save and Next
                        </Button>
                        <Button
                          className={classes.saveBtn}
                          style={{ marginLeft: '10px' }}
                          variant='text'
                          // color="primary"
                          onClick={handleClose}
                        >
                          Cancel
                        </Button>
                      </Grid>
                    )}
                  </form>
                </div>
              </Grid>
            </Grid>
          ) : (
            <div>
              <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={3} style={{ marginBottom: '20px' }}>
                  <Grid item xs={12} sm={6} md={4} style={{ display: 'flex', alignItems: 'flex-end' }}>
                    <Select label='Select' value={searchType} onChange={handleChange} fullWidth>
                      <MenuItem value='MEMBERSHIP_NO'>Membership No.</MenuItem>
                      <MenuItem value='NAME'>Member Name</MenuItem>
                    </Select>
                  </Grid>

                  {searchType === 'MEMBERSHIP_NO' && (
                    <Grid item xs={12} sm={6} md={4} style={{ display: 'flex' }}>
                      <TextField
                        id='standard-basic'
                        value={formik.values.memberShipNo}
                        onChange={onMemberShipNumberChange}
                        name='searchCode'
                        label='Membership Code'
                        style={{ flex: '1', marginRight: '5px' }} // Adjust margin and flex as needed
                      />

                      <Button
                        className='responsiveButton'
                        variant='contained'
                        onClick={() => populateMemberFromSearch('number')}
                        color='primary'
                        style={{ borderRadius: '10px' }}
                      >
                        Search
                      </Button>
                    </Grid>
                  )}

                  {searchType === 'NAME' && (
                    <Grid item xs={12} sm={6} md={4} style={{ display: 'flex' }}>
                      <TextField
                        id='standard-basic'
                        value={formik.values.memberShipNo}
                        onChange={onMemberShipNumberChange}
                        name='searchCode'
                        style={{ marginLeft: '10px', flex: '1' }} // Adjust margin and flex as needed
                        label='Member Name'
                      />

                      <Button
                        variant='contained'
                        onClick={() => { console.log("rewa"); populateMemberFromSearch('name') }}
                        color='primary'
                        style={{ marginLeft: '3%', borderRadius: '10px' }}
                      >
                        Search
                      </Button>

                      {/* Dialog component goes here */}
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
                                          <Button
                                            onClick={() => handleSelect(item)}
                                            style={{ background: '#D80E51', color: '#f1f1f1' }}
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
                            <Button onClick={handleClosed} variant='text'>
                              Cancel
                            </Button>
                            {/* <Button onClick={} color="primary">
                        Submit
                      </Button> */}
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
                      value={memberBasic.relation}
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
                    {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      views={['year', 'month', 'date']}
                      variant="inline"
                      format="dd/MM/yyyy"
                      margin="normal"
                      id="date-picker-inline"
                      label="Enrolment Date"
                      value={memberBasic.enrolmentDate}
                      disabled
                      InputProps={{
                        classes: {
                          root: classes.inputRoot,
                          disabled: classes.disabled,
                        },
                      }}
                      KeyboardButtonProps={{
                        'aria-label': 'change ing date',
                      }}
                    />
                  </MuiPickersUtilsProvider> */}
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
                  <Grid item xs={12} sm={6} md={4} style={{ display: 'flex', flexDirection: 'column' }}>
                    {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      views={['year', 'month', 'date']}
                      variant="inline"
                      format="dd/MM/yyyy"
                      margin="normal"
                      id="date-picker-inline"
                      label="Enrolment From Date"
                      value={memberBasic.enrolmentFromDate}
                      disabled
                      InputProps={{
                        classes: {
                          root: classes.inputRoot,
                          disabled: classes.disabled,
                        },
                      }}
                      KeyboardButtonProps={{
                        'aria-label': 'change ing date',
                      }}
                    />
                  </MuiPickersUtilsProvider> */}
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        views={['year', 'month', 'day']}
                        label='Enrolment From Date'
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
                  <Grid item xs={12} sm={6} md={4}>
                    {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      views={['year', 'month', 'date']}
                      variant="inline"
                      format="dd/MM/yyyy"
                      margin="normal"
                      id="date-picker-inline"
                      label="Enrolent To Date"
                      value={memberBasic.enrolentToDate}
                      disabled
                      InputProps={{
                        classes: {
                          root: classes.inputRoot,
                          disabled: classes.disabled,
                        },
                      }}
                      KeyboardButtonProps={{
                        'aria-label': 'change ing date',
                      }}
                    />
                  </MuiPickersUtilsProvider> */}
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        views={['year', 'month', 'day']}
                        label='Enrolent To Date'
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
                <Grid container spacing={3} style={{ marginBottom: '20px' }}>
                  <Grid item xs={12} sm={6} md={4} style={{ display: 'flex', alignItems: 'center' }}>
                    <FormControl className={classes.formControl}>
                      <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                        Treatment Department
                      </InputLabel>
                      <Select
                        label='Treatment Department'
                        labelId='demo-simple-select-label'
                        id='demo-simple-select'
                        name='treatmentDepartment'
                        value={formik.values.treatmentDepartment || ''}
                        // disabled={disableAllFields ? true : false}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      >
                        <MenuItem value='OPD'>OPD</MenuItem>
                        <MenuItem value='IPD'>IPD</MenuItem>
                      </Select>
                      {formik.touched.treatmentDepartment && formik.errors.treatmentDepartment && (
                        <span style={{ color: 'red', fontSize: 12 }}>{formik.errors.treatmentDepartment}</span>
                      )}
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
                      autoOk={true}
                      label="Receive date"
                      disabled={disableAllFields ? true : false}
                      value={selectedReceiveDate}
                      onChange={handleReceiveDate}
                      KeyboardButtonProps={{
                        'aria-label': 'change DOD date',
                      }}
                    />
                  </MuiPickersUtilsProvider> */}
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        views={['year', 'month', 'day']}
                        label='Receive date'
                        disabled={disableAllFields ? true : false}
                        value={selectedReceiveDate}
                        onChange={handleReceiveDate}
                        renderInput={(params: any) => <TextField {...params} margin='normal' variant='outlined' />}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      views={['year', 'month', 'date']}
                      variant="inline"
                      format="dd/MM/yyyy"
                      margin="normal"
                      id="date-picker-inline"
                      autoOk={true}
                      label="Service Date"
                      value={selectedServiceDate}
                      disabled={disableAllFields ? true : false}
                      onChange={handleServiceDate}
                      KeyboardButtonProps={{
                        'aria-label': 'change DOD date',
                      }}
                    />
                  </MuiPickersUtilsProvider> */}
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        views={['year', 'month', 'day']}
                        label='Service Date'
                        value={selectedServiceDate}
                        disabled={disableAllFields ? true : false}
                        onChange={handleServiceDate}
                        renderInput={(params: any) => <TextField {...params} margin='normal' variant='outlined' />}
                      />
                    </LocalizationProvider>
                  </Grid>
                </Grid>

                <Grid container spacing={3} style={{ marginBottom: '20px' }}>
                  <Grid item xs={12} sm={6} md={3}>
                    {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      views={['year', 'month', 'date']}
                      variant="inline"
                      format="dd/MM/yyyy"
                      margin="normal"
                      id="date-picker-inline"
                      label="DOA"
                      autoOk={true}
                      value={selectedDOA}
                      disabled={disableAllFields ? true : false}
                      onChange={handleDOA}
                      KeyboardButtonProps={{
                        'aria-label': 'change ing date',
                      }}
                    />
                  </MuiPickersUtilsProvider> */}
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        views={['year', 'month', 'day']}
                        label='DOA'
                        value={selectedDOA}
                        disabled={disableAllFields ? true : false}
                        onChange={handleDOA}
                        renderInput={(params: any) => <TextField {...params} margin='normal' variant='outlined' />}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      views={['year', 'month', 'date']}
                      variant="inline"
                      format="dd/MM/yyyy"
                      margin="normal"
                      id="date-picker-inline"
                      autoOk={true}
                      label="DOD"
                      value={selectedDOD}
                      disabled={disableAllFields ? true : false}
                      onChange={handleDODDate}
                      KeyboardButtonProps={{
                        'aria-label': 'change DOD date',
                      }}
                    />
                  </MuiPickersUtilsProvider> */}
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        views={['year', 'month', 'day']}
                        label='DOD'
                        value={selectedDOD}
                        disabled={disableAllFields ? true : false}
                        onChange={handleDODDate}
                        renderInput={(params: any) => <TextField {...params} margin='normal' variant='outlined' />}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Autocomplete
                      value={selectedId ?? null}
                      onChange={(e, value) => doSelectValue(e, value)}
                      id='primary-diagnosis-autocomplete'
                      options={diagnosisList}
                      getOptionLabel={(option: any) =>
                        option && typeof option === 'object' ? `${option.code} | ${option.diagnosisName}` : ''
                      }
                      isOptionEqualToValue={(option: any, value: any) => option?.id === value?.id}
                      renderInput={(params: any) => <TextField {...params} label='Primary Diagnosis' />}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Autocomplete
                      multiple
                      value={formik.values.diagnosis}
                      onChange={handleDiagnosisChange}
                      id='other-diagnoses-autocomplete'
                      options={diagnosisList}
                      disableCloseOnSelect
                      getOptionLabel={(option: any) =>
                        option && typeof option === 'object' ? `${option.code} | ${option.diagnosisName}` : ''
                      }
                      isOptionEqualToValue={(option: any, value: any) => option?.id === value?.id}
                      renderOption={(props: any, option: any, { selected }: { selected: any }) => (
                        <li {...props}>
                          <Checkbox
                            icon={icon}
                            checkedIcon={checkedIcon}
                            style={{ marginRight: 8, color: '#626bda' }}
                            checked={selected}
                          />
                          {`${option.code} | ${option.diagnosisName}`}
                        </li>
                      )}
                      renderInput={(params: any) => (
                        <TextField {...params} label='Other Diagnosis' placeholder='Select Diagnosis' />
                      )}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3} style={{ marginBottom: '20px' }}>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      id='standard-basic'
                      name='contactNoOne'
                      type='number'
                      value={formik.values.contactNoOne}
                      disabled={disableAllFields ? true : false}
                      onChange={formik.handleChange}
                      label='Contact No. 1'
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      id='standard-basic'
                      name='contactNoTwo'
                      type='number'
                      value={formik.values.contactNoTwo}
                      disabled={disableAllFields ? true : false}
                      onChange={formik.handleChange}
                      label='Contact No. 2'
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formik.values.daycare}
                          onChange={e => handleFieldChecked(e)}
                          name='daycare'
                          color='primary'

                        // disabled={disableAllFields ? true : false}
                        />
                      }
                      label='Daycare'
                    />
                  </Grid>
                  {/* <Grid item xs={4}>
        <FormControlLabel
            control={
                <Checkbox
                    checked={formik.values.referalTicketRequired}
                    onChange={e => handleFieldChecked(e)}
                    name="referalTicketRequired"
                    color="primary"
                />
            }
            label="Referral Ticket Required"
        />
    </Grid> */}
                </Grid>

                {/* <Grid item xs={12} style={{ marginTop: '20px' }}>
    <span style={{ color: '#4472C4', fontWeight: 'bold' }}>PROVIDER DETAILS</span>
</Grid> */}

                <Grid item xs={12} style={{ marginBottom: '15px' }}>
                  <Divider />
                </Grid>

                <Grid item xs={12} style={{ marginTop: '20px' }}>
                  <span style={{ color: '#4472C4', fontWeight: 'bold' }}>INVOICE DETAILS</span>
                </Grid>
                <Grid item xs={12} style={{ marginBottom: '15px' }}>
                  <Divider />
                </Grid>

                {invoiceDetailsList.map((x: any, i: any) => {
                  return (
                    <div key={`invoiceDetails-${i}`}>
                      <Grid container spacing={3} key={i}>
                        <Grid item xs={12} sm={6} md={3}>
                          <Autocomplete
                            options={providerList}
                            getOptionLabel={(option: any) => option?.providerBasicDetails?.name || ''}
                            value={providerList.find((p: any) => p.id === x.provideId) || null}
                            onChange={(_, newValue) => {
                              handleInputChangeService(
                                { target: { name: 'provideId', value: newValue ? newValue.id : '' } },
                                i
                              );
                            }}
                            disabled={disableAllFields ? true : false}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Provider"
                                variant="outlined"
                                margin="normal"
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <TextField
                            id='standard-basic'
                            type='number'
                            name='invoiceAmount'
                            value={x.invoiceAmount}
                            disabled={disableAllFields ? true : false}
                            onChange={e => handleInputChangeService(e, i)}
                            label='Invoice Amount'
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <TextField
                            id='standard-basic'
                            name='invoiceNo'
                            value={x.invoiceNo}
                            onChange={e => handleInputChangeService(e, i)}
                            label='Invoice number'
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <KeyboardDatePicker
                            views={['year', 'month', 'date']}
                            variant="inline"
                            format="dd/MM/yyyy"
                            margin="normal"
                            id="date-picker-inline"
                            label="Invoice Date"
                            autoOk={true}
                            value={x.invoiceDateVal}
                            onChange={(date:any) => {
                              handleInvoiceDate(date, i);
                            }}
                            KeyboardButtonProps={{
                              'aria-label': 'change ing date',
                            }}
                          />
                        </MuiPickersUtilsProvider> */}
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                              views={['year', 'month', 'day']}
                              label='Invoice Date'
                              value={x.invoiceDateVal}
                              onChange={(date: any) => {
                                handleInvoiceDate(date, i)
                              }}
                              renderInput={(params: any) => (
                                <TextField {...params} margin='normal' variant='outlined' />
                              )}
                            />
                          </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <FormControl className={classes.formControl}>
                            <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                              Currency
                            </InputLabel>
                            <Select
                              labelId='demo-simple-select-label'
                              label='Currency'
                              id='demo-simple-select'
                              name='currency'
                              value={x.currency}
                              onChange={e => handleInputChangeService(e, i)}
                            >
                              {currencyList.map((ele: any) => {
                                return (
                                  <MenuItem key={ele.id} value={ele.code}>
                                    {ele.name}
                                  </MenuItem>
                                )
                              })}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <TextField
                            id='standard-basic'
                            type='number'
                            name='exchangeRate'
                            value={x.exchangeRate}
                            onChange={e => handleInputChangeService(e, i)}
                            label='Exchange Rate'
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <TextField
                            id='standard-basic'
                            name='invoiceAmountKES'
                            value={x.invoiceAmountKES}
                            disabled
                            onChange={e => handleInputChangeService(e, i)}
                            label='Invoice Amount(KSH)'
                          />
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                          <TextField
                            id='standard-basic'
                            name='transactionNo'
                            value={x.transactionNo}
                            onChange={e => handleInputChangeService(e, i)}
                            label='Transaction No'
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <FormControl className={classes.formControl}>
                            <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                              Payee
                            </InputLabel>
                            <Select
                              labelId='demo-simple-select-label'
                              label='Payee'
                              id='demo-simple-select'
                              name='payee'
                              value={x.payee}
                              onChange={e => handleInputChangeService(e, i)}
                            >
                              {/* {serviceList.map((ele:any) => {
                                return (
                                    <MenuItem key={ele.id} value={ele.name}>
                                        {ele.name}
                                    </MenuItem>
                                );
                            })} */}
                              {/* <MenuItem value="Provider">Provider</MenuItem> */}
                              <MenuItem value='Member'>Member</MenuItem>
                              <MenuItem value='Intermediaries'>Intermediaries</MenuItem>
                              <MenuItem value='Corporate'>Corporate</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <Button
                            variant='contained'
                            color='primary'
                            type='button'
                            style={{ marginLeft: '5px', marginTop: '10px' }}
                            onClick={() => handleAddInvoiceItems(i)}
                          >
                            Add Invoice items
                          </Button>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3} style={{ display: 'flex', alignItems: 'center' }}>
                          {invoiceDetailsList.length !== 1 && (
                            <Button
                              className='mr10'
                              onClick={() => handleRemoveServicedetails(i)}
                              variant='contained'
                              // color="secondary"
                              disabled={disableAllFields ? true : false}
                              style={{ marginLeft: '5px', background: '#dc3545', color: '#f1f1f1' }}
                            >
                              <DeleteIcon />
                            </Button>
                          )}
                          {invoiceDetailsList.length - 1 === i && (
                            <Button
                              variant='contained'
                              color='primary'
                              style={{ marginLeft: '5px' }}
                              disabled={disableAllFields ? true : false}
                              onClick={handleAddServicedetails}
                            >
                              <AddIcon />
                            </Button>
                          )}
                        </Grid>
                      </Grid>
                      <Grid item xs={12} style={{ marginBottom: '15px', marginTop: '10px' }}>
                        <Divider />
                      </Grid>
                    </div>
                  )
                })}

                {query.get('mode') !== 'viewOnly' && (
                  <Grid item xs={12} className={classes.actionContainer}>
                    <Button variant='contained' color='primary' type='submit'>
                      Save and Next
                    </Button>
                    <Button
                      className={classes.saveBtn}
                      style={{ marginLeft: '10px' }}
                      variant='text'
                      // color="primary"
                      onClick={handleClose}
                    >
                      Cancel
                    </Button>
                  </Grid>
                )}
              </form>
            </div>
          )}
        </Box>
      </Paper>
      {/* } */}
    </>
  )
}
