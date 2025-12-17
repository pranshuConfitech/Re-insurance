// import * as React from "react";
// import * as yup from "yup";

import * as React from 'react'
import { useEffect } from 'react'

import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { styled } from '@mui/material/styles'

import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Box from '@mui/material/Box'
import { Button } from 'primereact/button'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'

// import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import 'date-fns'
import { useFormik } from 'formik'

import type { Observable } from 'rxjs'
import * as yup from 'yup'

import { AgentsService } from '@/services/remote-api/api/agents-services'
import { ClientService, ProspectService } from '@/services/remote-api/api/client-services'
import { InvoiceService } from '@/services/remote-api/api/invoice-services'
import { AddressService } from '@/services/remote-api/api/master-services'
import { PlanService } from '@/services/remote-api/api/plan-services'
import { ProductService } from '@/services/remote-api/api/product-services'
import { QuotationService } from '@/services/remote-api/api/quotation-services'
import { TaxService } from '@/services/remote-api/api/tax-services'
import InvoiceClientModal from './modals/invoice.client.modal.component'

import type { Client } from '@/services/remote-api/models/client'
import Asterisk from '../../shared-component/components/red-asterisk'
import { defaultPageRequest } from '@/services/remote-api/models/page.request'

const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
  type: yup.string().required('Agent Type is required'),
  contact: yup
    .string()
    .required('Contact number is required')
    .test('len', 'Must be exactly 10 digit', val => val?.length === 10),

  // .matches(new RegExp('[0-9]{10}'),'Contact number is not valid'),
  email: yup.string().email('Enter a valid email'),
  natureOfAgent: yup.string().required('Agent Nature is required')
})

const invoiceTypeOptions = [
  {
    value: 'SELF_FUND',
    label: 'Self Fund'
  },
  {
    value: 'INDEMNITY',
    label: 'Indemnity'
  },
  {
    value: 'CORPORATE_BUFFER',
    label: 'Corporate Buffer/SBP'
  }
]

const TypographyStyle2: any = {
  fontSize: '13px',
  fontWeight: '500',
  alignItems: 'end',
  display: 'flex',
  textTransform: 'capitalize',
  width: '150px',
  marginLeft: '10px',
  opacity: '0.65'
}

const TypographyStyle1: any = {
  fontSize: '16px',
  fontWeight: '700',
  textTransform: 'capitalize',
  opacity: '0.75'
}

const invoiceservice = new InvoiceService()
const taxservice = new TaxService()
const productservice = new ProductService()
const planservice = new PlanService()
const agentservice = new AgentsService()
const clientservice = new ClientService()
const prospectservice = new ProspectService()
const addressservice = new AddressService()
const quotationService = new QuotationService()
const reqParam: any = { pageRequest: defaultPageRequest }
const pdt$ = productservice.getProducts(reqParam)
const ts$ = taxservice.getTaxes(reqParam)
const addr$ = addressservice.getAddressConfig()

// Create styled components
const StyledForm = styled('form')(({ theme }) => ({
  padding: theme.spacing(3),
  '& .MuiAccordion-root': {
    marginBottom: theme.spacing(2),
    boxShadow: 'none',
    border: '1px solid #e0e0e0',
    '&:before': {
      display: 'none'
    }
  },
  '& .MuiAccordionSummary-root': {
    backgroundColor: '#f5f5f5',
    minHeight: 48
  }
}))

const FormSection = styled(Paper)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  padding: theme.spacing(3)
}))

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  width: '100%',
  marginBottom: theme.spacing(2)
}))

const InputField = styled(TextField)(({ theme }) => ({
  width: '100%',
  marginBottom: theme.spacing(2)
}))

const GridContainer = styled(Grid)(({ theme }) => ({
  marginBottom: theme.spacing(3)
}))

const GridItem = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(1)
}))

const HeaderTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  fontWeight: 600,
  marginBottom: theme.spacing(3),
  color: theme.palette.text.primary
}))

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
  fontWeight: 500,
  marginBottom: theme.spacing(2)
}))

const ButtonContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  marginTop: theme.spacing(3)
}))

const DividerStyled = styled(Divider)(({ theme }) => ({
  margin: theme.spacing(2, 0)
}))

const AddressField = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(2)
}))

const LabelContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(1)
}))

// Create a theme instance
const theme = createTheme({
  // You can customize your theme here
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
})

// Create a wrapper component that provides the theme
function FundInvoiceDetailsWithTheme(props: any) {
  return (
    <ThemeProvider theme={theme}>
      <FundInvoiceDetails {...props} />
    </ThemeProvider>
  )
}

export default FundInvoiceDetailsWithTheme

function FundInvoiceDetails(props: any) {
  const query2 = useSearchParams()
  const [invoiceNumber, setInvoiceNumber] = React.useState<string | null>(null)
  const params = useParams()
  const id: any = params.id
  const history = useRouter()
  const [productList, setProductList] = React.useState([])
  const [planList, setPlanList] = React.useState([])
  const [categoryList, setCategoryList] = React.useState([])
  const [openClientModal, setOpenClientModal] = React.useState(false)
  const [openAgentModal, setOpenAgentModal] = React.useState(false)
  const [agentsList, setAgentsList] = React.useState([])
  const [taxList, setTaxList] = React.useState([])
  const [expandClientDetails, setExpandClientDetails] = React.useState(false)

  const [clientData, setClientData] = React.useState({
    clientName: '',
    clientMobile: '',
    clientEmail: '',
    clientId: '',
    clientType: ''
  })

  const [addressConfig, setAddressConfig] = React.useState([])
  const [selectedDate, setSelectedDate] = React.useState(new Date())
  const [revertedMessage, setRevertedMessage] = React.useState(false)
  const [headerTitle, setHeaderTitle] = React.useState('Fund Invoice Management- Create Invoice')
  const [invoiceType, setInvoiceType] = React.useState('SELF_FUND')
  const [formObj, setFormObj]: any = React.useState({})
  const [clientType, setClientType] = React.useState()
  const [sourceList, setSourceList] = React.useState({})
  const [quotationList, setQUotationList] = React.useState([])

  const [fundDetailsData, setFundDetailsData] = React.useState({
    availableFundBalanceAsOn: 0,
    adminFees: 0,
    careFees: 0,
    topupAmount: 0,
    depositAmount: 0,
    totalInvoiceAmount: 0
  })

  const [quotation, setQuotation]: any = React.useState({})

  const handleInvoiceDate = (date: any) => {
    setSelectedDate(date)
    const timestamp = new Date(date).getTime()

    formik.setFieldValue('invoiceDate', timestamp)
  }

  const formik: any = useFormik({
    initialValues: {
      invoiceDate: new Date().getTime(),
      invoiceType: 'SELF_FUND',
      quotationNumber: '',
      quotationId: '',
      clientOrProspectId: '',
      clientOrProspectType: '',
      product: '',
      plan: '',
      description: '',
      planData: '',
      productData: '',
      categorydata: [],
      discountType: 'PERCENTAGE',
      discountValue: 0,
      loadingType: 'PERCENTAGE',
      loadingValue: 0,
      discountAmount: 0,
      loadingAmount: 0,
      totalPremiumAmount: 0,
      totalTaxAmount: 0,
      totalAmountWithoutTax: 0,
      totalAmountWithTax: 0,
      availableFundBalanceAsOn: 0,
      adminFees: 0,
      careFees: 0,
      topupAmount: 0,
      depositAmount: 0,
      totalInvoiceAmount: 0
    },

    // validationSchema: validationSchema,
    onSubmit: values => {
      handleSubmit()
    }
  })

  useEffect(() => {
    const storedInvoiceNumber = localStorage.getItem('InvoiceNumber')
    setInvoiceNumber(storedInvoiceNumber)
  }, [])

  useEffect(() => {
    const subscription = addr$.subscribe((result: any) => {
      if (result && result?.length !== 0) {
        result.forEach((prop: { addressConfigurationFieldMappings: any[] }, i: any) => {
          prop.addressConfigurationFieldMappings.forEach((field, j) => {
            // let fname = "field"+i+j;
            field['value'] = ''

            if (field.sourceId !== null && field.sourceId !== '') {
              field['sourceList'] = []
            }

            if (field.type === 'dropdown' && field.sourceId === null) {
              if (field.addressConfigurationFieldCustomValueMappings?.length !== 0) {
                field['sourceList'] = field.addressConfigurationFieldCustomValueMappings
              }

              // if(field.addressConfigurationFieldCustomValueMappings?.length === 0 || field.addressConfigurationFieldCustomValueMappings === null){
              //   field['sourceList'] = [];
              // }
            }
          })
        })

        setAddressConfig(result)

        result.forEach((prop: { addressConfigurationFieldMappings: any[] }, i: string | number) => {
          prop.addressConfigurationFieldMappings.map((field, j) => {
            //   frmObj[field.fieldName] = field.defaultValue;
            if (field.dependsOn == '' && field.type == 'dropdown' && field.modifyApiURL) {
              addressservice.getSourceList(field.modifyApiURL).subscribe((res: any) => {
                // field.sourceList =res.content;
                const list: any = [...result]

                list[i].addressConfigurationFieldMappings[j].sourceList = res.content
                setAddressConfig(list)

                // frmLst[field.fieldName] = res.content;
              })
            }
          })
        })
      }
    })

    return () => subscription.unsubscribe()
  }, [addr$, setAddressConfig])

  const handleopenClientModal = () => {
    setOpenClientModal(true)
  }

  const handleCloseClientModal = () => {
    setOpenClientModal(false)
  }

  const handleSubmitClientModal = (item: any) => {
    quotationService.getQuoationByProspect(item.clientBasicDetails.displayName).subscribe((res: any) => {
      let temp: any = [];
      if (res.content && res.content.length > 0) {
        res.content.forEach((ele: any) => {
          if (ele.quotationStatus === "APPROVED") {
            temp.push({
              id: ele.id,
              label: `${ele.quotationNo} - ${new Date(ele.quoteDate).toLocaleDateString('en-GB')}`,
            })
          }
        })
      }

      if (temp.length > 0) {
        setClientData({
          ...setClientData,
          clientName: item.name,
          clientMobile: item.contactNo,
          clientEmail: item.email,
          clientId: item.id,
          clientType: item.clientType
        })
        setClientType(item.clientBasicDetails.clientTypeCd)
        populateDynamicAddress(item, addressConfig)
        setExpandClientDetails(true);
        setQUotationList(temp)
        setOpenClientModal(false)
      } else {
        alert('No approved quotation found for this client.')
      }
    })
  }

  const callAPiFunc: any = (field: any, prop: any, resultarr: any[], addrrList: any[]) => {
    addrrList.forEach((pr, i) => {
      pr.addressConfigurationFieldMappings.forEach((fi: { fieldName: any; value: any }, j: any) => {
        if (fi.fieldName === prop.dependOnfields[0]) {
          resultarr.push(fi.value)

          if (pr.dependOnfields !== null) {
            callAPiFunc(fi, pr, resultarr, addrrList)
          }
        }
      })
    })

    return resultarr
  }

  const populateDynamicAddress = (item: Client, addressConfigList: any[]) => {
    if (addressConfigList && addressConfigList?.length != 0) {
      const addrrList: any = [...addressConfigList]

      if (item.clientAddress) {
        item.clientAddress.addresses.forEach((val: any) => {
          addrrList.forEach((prop: { addressConfigurationFieldMappings: any[] }, i: any) => {
            prop.addressConfigurationFieldMappings.forEach((field: any, j: any) => {
              if (Object.keys(val.addressDetails)[0] === field.fieldName) {
                field['value'] = val.addressDetails[field.fieldName]
              }
            })
          })
        })

        // setAddressConfig(addrrList);

        addrrList.forEach((prop: { addressConfigurationFieldMappings?: any; dependOnfields: any }, i: number) => {
          prop.addressConfigurationFieldMappings.forEach(
            (field: { type: string; dependsOn: string; modifyApiURL: any }, j: any) => {
              if (field.type === 'dropdown' && field.dependsOn !== '' && prop.dependOnfields !== null) {
                const arr: any = []
                const dArr = callAPiFunc(field, prop, arr, addrrList)

                const word = '{code}'
                let apiURL = field.modifyApiURL

                dArr.forEach((cd: any) => {
                  apiURL =
                    apiURL.slice(0, apiURL.lastIndexOf(word)) + apiURL.slice(apiURL.lastIndexOf(word)).replace(word, cd)
                })
                addressservice.getSourceList(apiURL).subscribe((res: any) => {
                  addrrList[i].addressConfigurationFieldMappings[j].sourceList = res.content

                  setAddressConfig(addrrList)
                })
              } else {
                // setAddressConfig(addrrList);
              }
            }
          )
        })
      }

      // setAddressConfig(addrrList);
    }
  }

  const calculateAgentValues = (totalAmountWithoutTax: number) => {
    const list = [...agentsList]

    list.forEach((ele: any) => {
      ele['finalValue'] = (Number(ele.commissionValue) * Number(totalAmountWithoutTax)) / 100
    })
    setAgentsList(list)
  }

  const handleSubmit = () => {
    const payload: any = {
      invoiceType: formik.values.invoiceType,
      invoiceDate: new Date(selectedDate).getTime(),
      clientOrProspectId: clientData.clientId,
      clientOrProspectType: clientData.clientType,
      productId: formik.values.product,
      planId: formik.values.plan,
      totalBeforeDiscountAndLoadingAmount: Number(formik.values.totalPremiumAmount),
      discountType: formik.values.discountType,
      discountEnterValue: formik.values.discountValue,
      totalDiscount: Number(formik.values.discountAmount),
      loadingType: formik.values.loadingType,
      loadingEnterValue: formik.values.loadingValue,
      totalLoading: Number(formik.values.loadingAmount),
      totalAfterDiscountAndLoadingAmount: Number(formik.values.totalAmountWithoutTax),
      totalTaxAmount: Number(formik.values.totalTaxAmount),
      totalAmountWithTax: Number(formik.values.totalAmountWithTax),
      quotationId: formik.values.quotationId
    }

    const invArr: any = []

    formik.values.categorydata.forEach((ele: any) => {
      invArr.push({ categoryId: ele.id, noOfMenber: ele.noOfMembers, premiumAmount: Number(ele.premiumAmount) })
    })
    payload['invoiceCategories'] = invArr

    const invAgents: any = []

    agentsList.forEach((ag: any) => {
      invAgents.push({
        agentId: ag.agentId,
        commissionType: ag.commissionType,
        commissionValue: ag.commissionValue,
        finalValue: ag.finalValue
      })
    })

    payload['invoiceAgents'] = invAgents

    const invTaxes: any = []

    taxList.forEach((tx: any) => {
      if (tx.checked) {
        invTaxes.push({
          taxAmount: tx.taxVal,
          taxId: tx.id
        })
      }
    })
    payload['invoiceTaxes'] = invTaxes

    invoiceservice.saveInvoice(payload).subscribe(res => {
      history.push(`/invoices?mode=viewList`)

      // window.location.reload();
    })
  }

  //tax API
  const useObservable2 = (observable: Observable<any>, setter: any) => {
    useEffect(() => {
      const subscription = observable.subscribe(result => {
        if (result.content && result.content?.length > 0) {
          result.content.forEach((ele: any) => {
            ele['checked'] = false
            ele['taxVal'] = 0
          })
        }

        result.content.sort((a: { sortOrder: number }, b: { sortOrder: number }) => {
          return a.sortOrder - b.sortOrder
        })
        setter(result.content)
      })

      return () => subscription.unsubscribe()
    }, [observable, setter])
  }

  //product API
  const useObservable3 = (observable: Observable<any>, setter: any) => {
    useEffect(() => {
      const subscription = observable.subscribe((result: any) => {
        const tableArr: any = []

        if (result.content && result.content?.length > 0) {
          result.content.forEach((ele: any) => {
            tableArr.push({
              name: ele.productBasicDetails.name,
              id: ele.id
            })
          })
        }

        setter(tableArr)
      })

      return () => subscription.unsubscribe()
    }, [observable, setter])
  }

  useObservable2(ts$, setTaxList)
  useObservable3(pdt$, setProductList)

  const populateProductFund = () => {
    if (invoiceNumber) {
      const pagerequestquery2: any = {
        page: 0,
        size: 10,
        summary: false
      }
      setExpandClientDetails(true);
      pagerequestquery2.sort = ['rowCreatedDate dsc']
      pagerequestquery2.invoiceNumber = invoiceNumber
      invoiceservice.getFundInvoice(pagerequestquery2).subscribe((res: any) => {
        formik.setFieldValue('invoiceDate', res.content[0].invoiceDate)
        formik.setFieldValue('invoiceType', res.content[0].invoiceType)
        formik.setFieldValue('clientOrProspectId', res.content[0].clientOrProspectId)
        formik.setFieldValue('clientOrProspectType', res.content[0].clientOrProspectType)
        formik.setFieldValue('adminFees', res.content[0].adminFee)
        formik.setFieldValue('availableFundBalance', res.content[0].availableFundBalance)
        formik.setFieldValue('careFees', res.content[0].careFee)
        formik.setFieldValue('topupAmount', res.content[0].topupAmount)
        formik.setFieldValue('totalInvoiceAmount', res.content[0].totalInvoiceAmount)
        formik.setFieldValue('depositAmount', res.content[0].depositAmount)
        setRevertedMessage(res.content[0].reverted)

        if (res.content[0].clientOrProspectType === 'Client') {
          let frmOb: any = {}
          const temp: any = []

          clientservice.getClientDetails(res.content[0].clientOrProspectId).subscribe((cdata: any) => {
            setClientData({
              clientName: cdata.clientBasicDetails.displayName,
              clientEmail: cdata.clientBasicDetails.contactNos[0].contactNo,
              clientMobile: cdata.clientBasicDetails.emails[0].emailId,
              clientId: cdata.id,
              clientType: 'Client'
            })
            addr$.subscribe(result => {
              temp.push(result)

              if (result && result?.length !== 0) {
                result.forEach((prop: { addressConfigurationFieldMappings: any[] }, i: any) => {
                  prop.addressConfigurationFieldMappings.forEach((field, j) => {
                    // let fname = "field"+i+j;
                    field['value'] = ''

                    if (field.sourceId !== null && field.sourceId !== '') {
                      field['sourceList'] = []
                    }

                    if (field.type === 'dropdown' && field.sourceId === null) {
                      if (field.addressConfigurationFieldCustomValueMappings?.length !== 0) {
                        field['sourceList'] = field.addressConfigurationFieldCustomValueMappings
                      }

                      if (
                        field.addressConfigurationFieldCustomValueMappings?.length === 0 ||
                        field.addressConfigurationFieldCustomValueMappings === null
                      ) {
                        field['sourceList'] = []
                      }
                    }
                  })
                })

                setAddressConfig(result)

                result.forEach((prop: { addressConfigurationFieldMappings: any[] }, i: string | number) => {
                  prop.addressConfigurationFieldMappings.map((field, j) => {
                    //   frmObj[field.fieldName] = field.defaultValue;
                    if (field.dependsOn == '' && field.type == 'dropdown' && field.modifyApiURL) {
                      addressservice.getSourceList(field.modifyApiURL).subscribe((res: any) => {
                        field.sourceList = res.content
                        const list = [...result]

                        result[i].addressConfigurationFieldMappings[j].sourceList = res.content

                        // frmLst[field.fieldName] = res.content;
                        populateDynamicAddress(cdata, result)
                      })
                    }
                  })
                })

                // setAddressConfig(result);
              }

              // populateDynamicAddress(cdata,result)

              if (temp && temp?.length !== 0) {
                cdata.clientAddress.addresses.forEach((addr: { addressDetails: any }) => {
                  frmOb = { ...frmOb, ...addr.addressDetails }
                })
                setFormObj(frmOb)

                cdata.clientAddress.addresses.forEach((item: any) => {
                  addressConfig.forEach((prop: any, i: number) => {
                    prop.addressConfigurationFieldMappings.forEach((field: any, j: number) => {
                      if (Object.keys(item.addressDetails)[0] === field.fieldName) {
                        field['value'] = item.addressDetails[field.fieldName]
                      }
                    })
                  })
                })

                const abc = result.forEach((prop: any, i: number) => {
                  prop.addressConfigurationFieldMappings.map((field: any, j: number) => {
                    if (field.type == 'dropdown') {
                      const arr: any = []
                      const dArr: any = callAPiFunc(field, prop, arr)

                      const word = '{code}'
                      let apiURL = field.modifyApiURL

                      dArr.forEach((cd: any) => {
                        apiURL =
                          apiURL.slice(0, apiURL.lastIndexOf(word)) +
                          apiURL.slice(apiURL.lastIndexOf(word)).replace(word, cd)
                      })

                      addressservice.getSourceList(apiURL).subscribe((res: any) => {
                        const list: any = [...props.addressConfig]

                        list[i].addressConfigurationFieldMappings[j].sourceList = res.content
                        setAddressConfig(list)
                      })
                    }
                  })
                })
              }
            })
          })
        }

        if (res.content[0].clientOrProspectType === 'Prospect') {
          prospectservice.getProspectDetails(res.content[0].clientOrProspectId).subscribe((cdata: any) => {
            setClientData({
              clientName: cdata.displayName,
              clientEmail: cdata.emailId,
              clientMobile: cdata.mobileNo,
              clientId: cdata.id,
              clientType: 'Prospect'
            })
          })
        }
      })
    }
  }

  useEffect(() => {
    if (invoiceNumber) {
      populateProductFund()
    }
  }, [invoiceNumber])

  const calculateTotalAmoutWithoutTax = (loadingVal: any, discountVal: any, premiumTotal: number) => {
    let la = (Number(loadingVal) / 100) * premiumTotal
    let da = (Number(discountVal) / 100) * premiumTotal

    if (formik.values.loadingType === 'PERCENTAGE') {
      formik.setFieldValue('loadingAmount', la)
    }

    if (formik.values.loadingType === 'FIXED') {
      la = Number(loadingVal)
      formik.setFieldValue('loadingAmount', la)
    }

    if (formik.values.discountType === 'PERCENTAGE') {
      formik.setFieldValue('discountAmount', da)
    }

    if (formik.values.discountType === 'FIXED') {
      da = Number(discountVal)
      formik.setFieldValue('discountAmount', da)
    }

    const at = premiumTotal + la - da

    formik.setFieldValue('totalAmountWithoutTax', at)
    calculateAgentValues(at)
    calculateTax(taxList, at)
  }

  const calculateTax = (txlist: any, totalAmountWithoutTax: number) => {
    txlist.forEach((ele: any) => {
      if (ele.checked) {
        if (ele.type === 'PERCENTAGE') {
          ele.taxVal = (Number(ele.value) * Number(totalAmountWithoutTax)) / 100
        }

        if (ele.type === 'FIXED') {
          ele.taxVal = Number(ele.value)
        }
      }
    })
    setTaxList(txlist)
    let grandTotal = Number(totalAmountWithoutTax)
    let tt = 0

    txlist.forEach((v: any) => {
      if (v.checked) {
        grandTotal = grandTotal + Number(v.taxVal)
        tt = tt + Number(v.taxVal)
      }
    })

    formik.setFieldValue('totalAmountWithTax', grandTotal)

    formik.setFieldValue('totalTaxAmount', tt)
  }

  const getCategories = (planid: string) => {
    planservice.getCategoriesFromPlan(planid).subscribe(res => {
      if (res?.length > 0) {
        const arr: any = []

        res.forEach((ele: any) => {
          ele['noOfMembers'] = 0
          ele['premiumAmount'] = 0
          arr.push(ele)
        })
        setCategoryList(arr)
      }
    })
  }

  const handleClose = () => {
    history.push(`/invoices?mode=viewList`)

    // window.location.reload();
  }

  const handleFundDetailsChanges = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target

    setFundDetailsData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  useEffect(() => {
    // Calculate totalInvoiceAmount based on other fields
    const adminFees = parseFloat(formik.values.adminFees || 0)
    const careFees = parseFloat(formik.values.careFees || 0)
    const topupAmount = parseFloat(formik.values.topupAmount || 0)
    const depositAmount = parseFloat(formik.values.depositAmount || 0)
    const totalInvoiceAmount = (adminFees + careFees + topupAmount + depositAmount).toFixed(2)

    formik.setFieldValue('totalInvoiceAmount', totalInvoiceAmount)
  }, [formik.values.adminFees, formik.values.careFees, formik.values.topupAmount, formik.values.depositAmount])

  const generateFundInvoice = () => {
    const currDate = new Date()

    const payload = {
      invoiceType: formik.values.invoiceType,
      invoiceDate: currDate.getTime(),
      clientOrProspectId: clientData.clientId,
      clientOrProspectType: clientData.clientType,
      generateInvoiceBy: 'F',
      availableFundBalance: parseFloat(formik.values.availableFundBalanceAsOn),
      adminFee: parseFloat(formik.values.adminFees),
      careFee: parseFloat(formik.values.careFees),
      topupAmount: parseFloat(formik.values.topupAmount),
      depositAmount: parseFloat(formik.values.depositAmount),
      totalInvoiceAmount: parseFloat(formik.values.totalInvoiceAmount),
      quotationId: formik.values.quotationId
    }
    invoiceservice.generateFundInvoice(payload).subscribe((res: any) => {
      if (res.id) {
        history.push('/invoices?mode=viewList')
      }
    })
  }

  const handleDynamicAddressChange = (e: any, field: any, prop: any) => {
    const { value } = e.target
    const updatedConfig = [...addressConfig]

    updatedConfig.forEach((config: any) => {
      config.addressConfigurationFieldMappings.forEach((f: any) => {
        if (f.fieldName === field.fieldName) {
          f.value = value
        }
      })
    })

    setAddressConfig(updatedConfig)
  }

  return (
    <StyledForm onSubmit={formik.handleSubmit}>
      {query2.get('mode') === 'create' && (
        <HeaderTitle>
          {headerTitle}
        </HeaderTitle>
      )}

      <FormSection elevation={0}>
        <GridContainer container spacing={2}>
          <GridItem item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                views={['year', 'month', 'day']}
                label='Invoice Date'
                value={selectedDate}
                onChange={handleInvoiceDate}
                disabled={query2.get('mode') === 'view'}
                renderInput={params => (
                  <InputField
                    {...params}
                    variant='outlined'
                    fullWidth
                  />
                )}
              />
            </LocalizationProvider>
          </GridItem>
          <GridItem item xs={12} md={6}>
            <Box display="flex" alignItems="center" height="100%">
              {query2.get('mode') !== 'view' ? (
                <Button
                  color='primary'
                  onClick={handleopenClientModal}
                  className="p-button-raised"
                >
                  Search Client
                </Button>
              ) : (
                revertedMessage && (
                  <Typography color="error" fontWeight="bold">
                    REVERTED
                  </Typography>
                )
              )}
            </Box>
          </GridItem>
        </GridContainer>
      </FormSection>

      <FormSection elevation={0}>
        <Accordion expanded={expandClientDetails}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls='client-details-content'
            id='client-details-header'
          >
            <SectionTitle>Client Details</SectionTitle>
          </AccordionSummary>
          <AccordionDetails>
            <GridContainer container spacing={2}>
              <GridItem item xs={12} md={4}>
                <InputField
                  label='Name'
                  value={clientData.clientName}
                  InputProps={{ readOnly: true }}
                />
              </GridItem>
              <GridItem item xs={12} md={4}>
                <InputField
                  label='Email'
                  value={clientData.clientEmail}
                  InputProps={{ readOnly: true }}
                />
              </GridItem>
              <GridItem item xs={12} md={4}>
                <InputField
                  label='Contact'
                  value={clientData.clientMobile}
                  InputProps={{ readOnly: true }}
                />
              </GridItem>

              {addressConfig && addressConfig?.length > 0 && (
                <>
                  <GridItem item xs={12}>
                    <DividerStyled />
                  </GridItem>
                  {addressConfig.map((prop: any, i: number) => (
                    <GridItem item xs={12} md={prop.addressConfigurationFieldMappings?.length === 1 ? 4 : 6} key={i}>
                      <LabelContainer>
                        <Typography variant="subtitle2">{prop.levelName}</Typography>
                        {prop.iButtonRequired === 'true' && (
                          <Tooltip title={prop.iButtonMessage} placement='top'>
                            <InfoOutlinedIcon fontSize="small" />
                          </Tooltip>
                        )}
                      </LabelContainer>
                      {prop.addressConfigurationFieldMappings.map((field: any, j: number) => (
                        <AddressField key={j}>
                          {field.type === 'dropdown' && !field.readOnly && (
                            <StyledFormControl>
                              <Select
                                label={field.required === 'true' ? `${field.fieldName} *` : field.fieldName}
                                value={field.value || ''}
                                onChange={(e) => handleDynamicAddressChange(e, field, prop)}
                              >
                                {field.sourceList?.map((ele: any) => (
                                  <MenuItem key={ele.code} value={ele.code}>
                                    {ele.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </StyledFormControl>
                          )}
                          {field.type === 'textbox' && !field.readOnly && (
                            <InputField
                              label={field.required === 'true' ? `${field.fieldName} *` : field.fieldName}
                              type={field.dataType === 'numeric' ? 'number' : 'text'}
                              value={field.value || ''}
                            />
                          )}
                          {field.type === 'textarea' && !field.readOnly && (
                            <InputField
                              multiline
                              rows={field.lengthValidation ? Number(prop.size) : 4}
                              label={field.required === 'true' ? `${field.fieldName} *` : field.fieldName}
                              value={field.value || ''}
                            />
                          )}
                          {field.readOnly && (
                            <InputField
                              label={field.fieldName}
                              value={field.defaultValue}
                              InputProps={{ readOnly: true }}
                            />
                          )}
                        </AddressField>
                      ))}
                    </GridItem>
                  ))}
                </>
              )}
            </GridContainer>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls='fund-details-content'
            id='fund-details-header'
          >
            <SectionTitle>Fund Details</SectionTitle>
          </AccordionSummary>
          <AccordionDetails>
            <GridContainer container spacing={2}>
              <GridItem item xs={12} md={6}>
                <StyledFormControl>
                  <InputLabel>Quotation</InputLabel>
                  <Select
                    label='Quotation'
                    name='quotationId'
                    value={formik.values.quotationId}
                    onChange={formik.handleChange}
                  >
                    {quotationList.map((ele: any) => (
                      <MenuItem key={ele.id} value={ele.id}>
                        {ele.label}
                      </MenuItem>
                    ))}
                  </Select>
                </StyledFormControl>
              </GridItem>
              <GridItem item xs={12} md={6}>
                <StyledFormControl>
                  <InputLabel>Invoice Type</InputLabel>
                  <Select
                    name='invoiceType'
                    value={formik.values.invoiceType}
                    label='Invoice Type'
                    onChange={formik.handleChange}
                  >
                    {invoiceTypeOptions.map(ele => (
                      <MenuItem key={ele.value} value={ele.value}>
                        {ele.label}
                      </MenuItem>
                    ))}
                  </Select>
                </StyledFormControl>
              </GridItem>
              <GridItem item xs={12} md={6}>
                <InputField
                  label='Available Fund Balance'
                  name='availableFundBalanceAsOn'
                  value={formik.values.availableFundBalanceAsOn}
                  InputProps={{ readOnly: true }}
                />
              </GridItem>
              <GridItem item xs={12} md={6}>
                <InputField
                  label='Admin Fees'
                  name='adminFees'
                  value={formik.values.adminFees}
                  onChange={formik.handleChange}
                />
              </GridItem>
              <GridItem item xs={12} md={6}>
                <InputField
                  label='Care Fees'
                  name='careFees'
                  value={formik.values.careFees}
                  onChange={formik.handleChange}
                />
              </GridItem>
              <GridItem item xs={12} md={6}>
                <InputField
                  label='Topup Amount'
                  name='topupAmount'
                  value={formik.values.topupAmount}
                  onChange={formik.handleChange}
                />
              </GridItem>
              <GridItem item xs={12} md={6}>
                <InputField
                  label='Deposit Amount'
                  name='depositAmount'
                  value={formik.values.depositAmount}
                  onChange={formik.handleChange}
                />
              </GridItem>
              <GridItem item xs={12} md={6}>
                <InputField
                  label='Total Invoice Amount'
                  name='totalInvoiceAmount'
                  value={formik.values.totalInvoiceAmount}
                  InputProps={{ readOnly: true }}
                />
              </GridItem>
            </GridContainer>
            <ButtonContainer>
              <Button
                color='primary'
                onClick={generateFundInvoice}
                className="p-button-raised"
              >
                Generate Invoice
              </Button>
            </ButtonContainer>
          </AccordionDetails>
        </Accordion>
      </FormSection>

      <InvoiceClientModal
        openClientModal={openClientModal}
        setOpenClientModal={setOpenClientModal}
        handleCloseClientModal={handleCloseClientModal}
        handleSubmitClientModal={handleSubmitClientModal}
        fundInvoice={true}
      />
    </StyledForm>
  )
}
