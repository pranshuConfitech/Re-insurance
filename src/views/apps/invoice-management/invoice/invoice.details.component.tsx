// import * as React from "react";
// import * as yup from "yup";
import * as React from 'react'

import { useEffect, useState } from 'react'

import { useRouter, useSearchParams, useParams } from 'next/navigation'

import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Box from '@mui/material/Box'

// import { Button } from 'primereact/button';
import Checkbox from '@mui/material/Checkbox'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import Select from '@mui/material/Select'
import { makeStyles } from '@mui/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import Autocomplete from '@mui/lab/Autocomplete'

// import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import 'date-fns'
import { useFormik } from 'formik'

import { filter, forkJoin, map, of, switchMap } from 'rxjs'
import * as yup from 'yup'

import { Button } from '@mui/material'

import { AgentsService } from '@/services/remote-api/api/agents-services'
import { ClientService, ProspectService } from '@/services/remote-api/api/client-services'
import { InvoiceService } from '@/services/remote-api/api/invoice-services'
import { AddressService } from '@/services/remote-api/api/master-services'
import { PlanService } from '@/services/remote-api/api/plan-services'
import { ProductService } from '@/services/remote-api/api/product-services'
import { QuotationService } from '@/services/remote-api/api/quotation-services'
import { TaxService } from '@/services/remote-api/api/tax-services'
import InvoiceAgentModal from './modals/invoice.agent.modal.component'
import InvoiceClientModal from './modals/invoice.client.modal.component'

import Asterisk from '../../shared-component/components/red-asterisk'
import throwErrorMessageEvent from '@/utils/message.event.producer'
import { defaultPageRequest } from '@/services/remote-api/models/page.request'
import { PolicyService } from '@/services/remote-api/api/policy-services/policy.service'
import { EndorsementService } from '@/services/remote-api/api/endorsement-services/endorsement.services'
import EndorsementModal from './modals/endorsement.modal.component'
import { ExpenseHeadService } from '@/services/remote-api/api/master-services/expense-head.service'
import MuiAlert from '@mui/lab/Alert'
import Snackbar from '@mui/material/Snackbar'

const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
  type: yup.string().required('Agent Type is required'),
  contact: yup
    .string()
    .required('Contact number is required')
    .test('len', 'Must be exactly 10 digit', val => val.length === 10),

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

const TypographyStyle2 = {
  fontSize: '13px',
  fontWeight: '500',
  alignItems: 'end',
  display: 'flex',
  textTransform: 'capitalize',
  width: '150px',
  marginLeft: '10px',
  opacity: '0.65'
}

const TypographyStyle1 = {
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
const quotationservice = new QuotationService()
const policyService = new PolicyService()
const endorsementservice = new EndorsementService()
const expenseHeadService = new ExpenseHeadService()

const reqParam: any = { pageRequest: defaultPageRequest }
const pdt$ = productservice.getProducts(reqParam)
const ts$ = taxservice.getTaxes(reqParam)
const addr$ = addressservice.getAddressConfig()

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
    width: '90%'
  },
  heading: {
    fontSize: theme?.typography?.pxToRem(15),
    fontWeight: theme?.typography?.fontWeightBold
  },
  inputRoot: {
    '&$disabled': {
      color: 'black'
    }
  },
  AccordionSummary: {
    backgroundColor: theme?.palette?.background?.default
  },

  disabled: {}
}))

// function useQuery1() {
//   return new URLSearchParams(useLocation().search);
// }

export default function InvoiceDetails(props: any) {
  const query2 = useSearchParams()
  const invoiceNumber = localStorage.getItem('InvoiceNumber')
  const param = useParams()
  const id: any = param.id
  const router = useRouter()
  const classes = useStyles()
  const [productList, setProductList]: any = React.useState([])
  const [planList, setPlanList]: any = React.useState([])
  const [categoryList, setCategoryList] = React.useState([])
  const [openClientModal, setOpenClientModal] = React.useState(false)
  const [openEndorsementModal, setOpenEndorsementModal] = React.useState(false)
  const [openAgentModal, setOpenAgentModal] = React.useState(false)
  const [agentsList, setAgentsList] = React.useState([])
  const [taxList, setTaxList] = React.useState([])
  const [expenseHeadList, setExpenseHeadList] = React.useState([])

  const [clientData, setClientData] = React.useState({
    clientName: '',
    clientMobile: '',
    clientEmail: '',
    clientId: '',
    clientType: ''
  })

  const [addressConfig, setAddressConfig]: any = React.useState([])
  const [selectedDate, setSelectedDate] = React.useState(new Date())
  const [revertedMessage, setRevertedMessage] = React.useState(false)
  const [headerTitle, setHeaderTitle] = React.useState('Invoice Management- Create Invoice')
  const [invoiceType, setInvoiceType] = React.useState('SELF_FUND')
  const [clientType, setClientType] = React.useState()

  const [fundDetailsData, setFundDetailsData] = React.useState({
    availableFundBalanceAsOn: 0,
    adminFees: 0,
    careFees: 0,
    topupAmount: 0,
    depositAmount: 0,
    totalInvoiceAmount: 0
  })

  const [quotation, setQuotation]: any = React.useState({})
  const [expandClientDetails, setExpandClientDetails] = React.useState(false)
  const [expandInvoiceDetails, setExapandInvoiceDetails] = React.useState(false)
  const [endorsements, setEndorsements] = React.useState<any>()
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [snackbarSeverity, setSnackbarSeverity] = React.useState<'success' | 'error'>('success');

  const handleInvoiceDate = (date: any) => {
    setSelectedDate(date)

    const timestamp = new Date(date).getTime()

    formik.setFieldValue('invoiceDate', timestamp)
  }

  const formik: any = useFormik({
    initialValues: {
      invoiceDate: new Date().getTime(),
      invoiceType: 'invoiceFromQuotation',
      quotationNumber: '',
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
      expenseHead: '',
      expenseHeadData: '',
    },

    // validationSchema: validationSchema,
    onSubmit: values => {
      handleSubmit()
    }
  })

  useEffect(() => {
    if (query2.get('policy')) {
      formik.setFieldValue('invoiceType', 'invoiceFromEndorsement')
      policyService.getPolicyDetails(query2.get('policy') as string).subscribe((values: any) => {
        planservice.getPlanDetails(values.planId).subscribe(val => {
          formik.setFieldValue('planData', val)
          formik.setFieldValue('plan', val.id)
        })
        productservice.getProductDetails(values.productId).subscribe(pd => {
          if (pd && pd.productBasicDetails) {
            const prodObj = {
              name: pd.productBasicDetails.name,
              id: pd.id
            }

            formik.setFieldValue('productData', prodObj)
            formik.setFieldValue('product', pd.id)
          }
        })
      })
      clientservice.getClientDetails(query2.get('client') as string).subscribe((cdata: any) => {
        setClientData({
          clientName: cdata.clientBasicDetails.displayName,
          clientMobile: cdata.clientBasicDetails.contactNos[0].contactNo,
          clientEmail: cdata.clientBasicDetails.emails[0].emailId,
          clientId: cdata.id,
          clientType: 'Client'
        })
      })
      const endorsementIds = query2.get('id')?.split(',')
      const cdata: any = []
      const endorsements: any = []

      const GetEndorsementDetail = (id: any) => {
        return new Promise<void>((resolve, reject) => {
          endorsementservice.getEndorsementDetail(id).subscribe(
            res => {
              endorsements.push(res)
              res.categoryRules.forEach((categoryRule: any, index: any) => {
                const transformedCategory = {
                  name: categoryRule.categoryName,
                  id: index,
                  noOfMembers: categoryRule.headCount,
                  premiumAmount: categoryRule.premiumAmount
                }

                cdata.push(transformedCategory)
              })
              resolve()
            },
            err => {
              reject(err)
            }
          )
        })
      }

      const fetchDataAndSetCategoryData = async () => {
        try {
          const promises = endorsementIds?.map((el: any) => GetEndorsementDetail(el)) || [];

          await Promise.all(promises)
          formik.setFieldValue('categorydata', cdata)
          let sum = 0

          cdata.map((el: any) => {
            sum += el.premiumAmount
          })
          formik.setFieldValue('totalPremiumAmount', sum)
        } catch (error) {
          console.error('Error fetching endorsement details:', error)
        }

        setEndorsements(endorsements)
      }

      fetchDataAndSetCategoryData()
    }
  }, [])

  // useEffect(() => {
  //   let subscription = addr$.subscribe(result => {
  //     if (result && result.length !== 0) {
  //       result.forEach((prop, i) => {
  //         prop.addressConfigurationFieldMappings.forEach((field, j) => {
  //           // let fname = "field"+i+j;
  //           field['value'] = '';
  //           if (field.sourceId !== null && field.sourceId !== '') {
  //             field['sourceList'] = [];
  //           }
  //           if (field.type === 'dropdown' && field.sourceId === null) {
  //             if (field.addressConfigurationFieldCustomValueMappings.length !== 0) {
  //               field['sourceList'] = field.addressConfigurationFieldCustomValueMappings;
  //             }
  //             // if(field.addressConfigurationFieldCustomValueMappings.length === 0 || field.addressConfigurationFieldCustomValueMappings === null){
  //             //   field['sourceList'] = [];
  //             // }
  //           }
  //         });
  //       });

  //       setAddressConfig(result);

  //       result.forEach((prop, i) => {
  //         prop.addressConfigurationFieldMappings.map((field, j) => {
  //           //   frmObj[field.fieldName] = field.defaultValue;
  //           if (field.dependsOn == '' && field.type == 'dropdown' && field.modifyApiURL) {
  //             addressservice.getSourceList(field.modifyApiURL).subscribe(res => {
  //               // field.sourceList =res.content;
  //               const list = [...result];
  //               list[i].addressConfigurationFieldMappings[j].sourceList = res.content;
  //               setAddressConfig(list);
  //               // frmLst[field.fieldName] = res.content;
  //             });
  //           }
  //         });
  //       });
  //     }
  //   });
  //   return () => subscription.unsubscribe();
  // }, [addr$]);

  const handleopenClientModal = () => {
    setOpenClientModal(true)
  }

  const handleOpenAgentModal = () => {
    setOpenAgentModal(true)
  }

  const handleCloseAgentModal = () => {
    setOpenAgentModal(false)
  }

  const handleCloseClientModal = () => {
    setOpenClientModal(false)
    setOpenEndorsementModal(true)
  }

  const handleCloseEndorsementModal = () => {
    setOpenEndorsementModal(false)
  }

  const fetchQuotationDetails = (quId: any) => {
    const getPayload = () => ({
      quotationNo: query2.get('mode') === 'edit' ? JSON.parse(decodeURIComponent(id)) : formik.values.quotationNumber.trim()
    })

    const fetchAgentDetails = (qu: any, quAgentIds: any) => {
      const pageRequest = {
        page: 0,
        size: 1000,
        summary: true,
        active: true,
        agentIds: quAgentIds
      }

      agentservice.getAgents(pageRequest).subscribe(agentdta => {
        const invoiceAgentList =
          qu?.quotationAgents?.flatMap((invAgIds: any) =>
            agentdta.content
              ?.filter(ag => invAgIds.agentId === ag.id)
              .map(ag => ({
                agentId: invAgIds.agentId,
                commissionType: invAgIds.commissionType,
                commissionValue: invAgIds.commissionValue,
                finalValue: invAgIds.finalValue,
                name: ag.agentBasicDetails.name
              }))
          ) || []

        setAgentsList(invoiceAgentList)
      })
    }

    const processQuotationResponse = (response: any) => {
      const { qu, pd, pl, clientPage } = response

      const prodObj = { name: pd.productBasicDetails.name, id: pd.id }

      setExapandInvoiceDetails(true)
      formik.setFieldValue('productData', prodObj)
      formik.setFieldValue('product', pd.id)
      formik.setFieldValue('planData', pl)
      formik.setFieldValue('plan', pl.id)

      if (qu.categoryMemberHeadCountPremiumAmounts) {
        const cdata = Object.entries(qu.categoryMemberHeadCountPremiumAmounts).map(
          ([key, value]: [key: any, value: any], index: number) => ({
            name: key,
            id: index,
            description: '',
            noOfMembers: value.headCount,
            premiumAmount: value.premiumAmount
          })
        )

        formik.setFieldValue('categorydata', cdata)
        formik.setFieldValue('totalPremiumAmount', qu.totalPremium)
        calculateData(cdata)
      }

      setQuotation(qu)
      setProductList([prodObj])
      setPlanList([pl])

      const quAgentIds = qu?.quotationAgents?.map((el: any) => el.agentId) || []

      fetchAgentDetails(qu, quAgentIds)

      if (clientPage.content?.length) {
        const client = clientPage.content[0]
        setClientData({
          ...clientData,
          clientName: client.clientBasicDetails.displayName,
          clientMobile: client.clientBasicDetails.contactNos[0]?.contactNo || '',
          clientEmail: client.clientBasicDetails.emails?.[0]?.emailId || '',
          clientId: client.id,
          clientType: 'Client'
        })
        populateDynamicAddress(client, addressConfig)
      }
    }

    const fetchDetails = (fetchFn: any) => {
      fetchFn
        .pipe(
          switchMap((qu: any) => {
            const pd$ = productservice.getProductDetails(qu.productId)
            const plan$ = planservice.getPlanDetails(qu.planId)
            const clientPayload = { prospectId: qu.prospectId, summary: false, active: true }
            const client$ = clientservice.getClients(clientPayload)

            return forkJoin({ qu: of(qu), pd: pd$, pl: plan$, clientPage: client$ })
          })
        )
        .subscribe(processQuotationResponse)
    }

    const mode = query2.get('mode')

    if (mode === 'view') {
      fetchDetails(
        quotationservice.getQuoationDetailsByID(quId).pipe(
          filter(qPage => {
            if (!qPage) {
              throwErrorMessageEvent('', 'Quotation not found')
            }

            return !!qPage
          })
        )
      )
    } else {
      fetchDetails(
        quotationservice.getQuoationDetails(getPayload()).pipe(
          filter(qPage => {
            const hasContent = !!qPage.content.length

            if (!hasContent) {
              throwErrorMessageEvent('', 'Quotation not found')
            }

            return hasContent
          }),
          map(qPage => qPage.content[0]),
          filter(qu => {
            const isApproved = qu.quotationStatus === 'APPROVED'

            if (!isApproved) {
              throwErrorMessageEvent('', 'Quotation not approved')
            }

            if (qu.isInvoiceGenerated) {
              throwErrorMessageEvent('', 'Invoice already created')
            }

            setHeaderTitle(
              qu.renewalPolicyId
                ? "'Invoice Management- Create Renewal Invoice'"
                : "'Invoice Management- Create Invoice'"
            )

            return isApproved
          })
        )
      )
    }
  }

  const handleSubmitClientModal = (item: any) => {
    setClientData({
      ...clientData,
      clientName: item.name,
      clientMobile: item.contactNo,
      clientEmail: item.email,
      clientId: item.id,
      clientType: item.clientType
    })
    setClientType(item?.clientBasicDetails?.clientTypeCd)
    populateDynamicAddress(item, addressConfig)
    setOpenClientModal(false)
  }

  const handleSubmitEndorsementModal = (item: any) => {
    setEndorsements(item)
    policyService.getPolicyDetails(item[0].policyId).subscribe((values: any) => {
      planservice.getPlanDetails(values.planId).subscribe(val => {
        formik.setFieldValue('planData', val)
        formik.setFieldValue('plan', val.id)
      })
      productservice.getProductDetails(values.productId).subscribe(pd => {
        if (pd && pd.productBasicDetails) {
          const prodObj = {
            name: pd.productBasicDetails.name,
            id: pd.id
          }

          formik.setFieldValue('productData', prodObj)
          formik.setFieldValue('product', pd.id)
        }
      })
    })

    const cdata: any = []

    const GetEndorsementDetail = (id: any) => {
      return new Promise<void>((resolve, reject) => {
        endorsementservice.getEndorsementDetail(id).subscribe(
          res => {
            res.categoryRules.forEach((categoryRule: any, index: any) => {
              const transformedCategory = {
                name: categoryRule.categoryName,
                id: index,
                noOfMembers: categoryRule.headCount,
                premiumAmount: categoryRule.premiumAmount
              }

              cdata.push(transformedCategory)
            })
            resolve()
          },
          err => {
            reject(err)
          }
        )
      })
    }

    const fetchDataAndSetCategoryData = async () => {
      try {
        const promises = item.map((el: any) => GetEndorsementDetail(el.id))

        await Promise.all(promises)
        formik.setFieldValue('categorydata', cdata)
        let sum = 0

        cdata.map((el: any) => {
          sum += el.premiumAmount
        })
        formik.setFieldValue('totalPremiumAmount', sum)
      } catch (error) {
        console.error('Error fetching endorsement details:', error)
      }
    }

    fetchDataAndSetCategoryData()
  }

  const callAPiFunc = (
    field: any,
    prop: { addressConfigurationFieldMappings?: any[]; dependOnfields: any },
    resultarr: any[],
    addrrList: { addressConfigurationFieldMappings: any[]; dependOnfields: null }[]
  ) => {
    addrrList.forEach((pr: { addressConfigurationFieldMappings: any[]; dependOnfields: null }, i: any) => {
      pr.addressConfigurationFieldMappings.forEach((fi, j) => {
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

  const populateDynamicAddress = (item: any, addressConfigList: any) => {
    if (addressConfigList && addressConfigList.length != 0) {
      const addrrList: any = [...addressConfigList]

      if (item.clientAddress) {
        item.clientAddress.addresses.forEach((val: any) => {
          addrrList.forEach((prop: any, i: number) => {
            prop.addressConfigurationFieldMappings.forEach((field: any, j: number) => {
              if (Object.keys(val.addressDetails)[0] === field.fieldName) {
                field['value'] = val.addressDetails[field.fieldName]
              }
            })
          })
        })

        setAddressConfig((prv: any) => [...new Set([...addressConfigList, ...addrrList])])

        addrrList.forEach((prop: { addressConfigurationFieldMappings: any; dependOnfields: any }, i: number) => {
          prop.addressConfigurationFieldMappings.forEach((field: any, j: any) => {
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
            }
          })
        })
      }
    }
  }

  const changeCommision = (e: any, i: number) => {
    const { name, value } = e.target
    const list: any = [...agentsList]

    list[i][name] = value
    setAgentsList(list)
    calculateFinalValue(list, i)
  }

  const calculateFinalValue = (list: any, i: number) => {
    list[i]['finalValue'] = (Number(list[i]['commissionValue']) * Number(formik.values.totalAmountWithoutTax)) / 100
    setAgentsList(list)
  }

  const calculateAgentValues = (totalAmountWithoutTax: number) => {
    const list = [...agentsList]

    list.forEach((ele: any) => {
      ele['finalValue'] = (Number(ele.commissionValue) * Number(totalAmountWithoutTax)) / 100
    })
    setAgentsList(list)
  }

  const handleAgentModalSubmit = (selectedAgents: any) => {
    // const finalArr = [...agentsList,...selectedAgents];
    setAgentsList(selectedAgents)
    setOpenAgentModal(false)
  }

  const handleSubmit = () => {
    if (!clientData.clientId) {
      setSnackbarMessage('You must convert the prospect to a client before invoice creation.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }
    const payload: any = {
      invoiceType: formik.values.invoiceType,
      invoiceDate: new Date(selectedDate).getTime(),
      clientOrProspectId: clientData.clientId,
      clientOrProspectType: clientData.clientType,
      productId: formik.values.product,
      planId: formik.values.plan,
      expenseHeadId: formik.values.expenseHead,
      totalBeforeDiscountAndLoadingAmount: Number(formik.values.totalPremiumAmount),
      discountType: formik.values.discountType,
      discountEnterValue: formik.values.discountValue,
      totalDiscount: Number(formik.values.discountAmount),
      loadingType: formik.values.loadingType,
      loadingEnterValue: formik.values.loadingValue,
      totalLoading: Number(formik.values.loadingAmount),
      totalAfterDiscountAndLoadingAmount: Number(formik.values.totalAmountWithoutTax),
      totalTaxAmount: Number(formik.values.totalTaxAmount),
      totalAmountWithTax: formik.values.totalAmountWithTax ? Number(formik.values.totalAmountWithTax) : formik.values.totalAmountWithoutTax ? Number(formik.values.totalAmountWithoutTax) : Number(formik.values.totalPremiumAmount),
      quotationId: formik.values.invoiceType === 'invoiceFromQuotation' ? quotation.id : null
    }

    const invArr: any = []

    formik.values.categorydata.forEach((ele: any) => {
      invArr.push({ categoryId: ele.id, noOfMenber: ele.noOfMembers, premiumAmount: Number(ele.premiumAmount) })
    })
    payload['invoiceCategories'] = invArr

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

    const endsm =
      endorsements && endorsements.length > 0
        ? endorsements.map((element: any) => ({
          endorsementId: element.id,
          amount: element.totalPremium
        }))
        : []

    payload.endorsements = endsm
    invoiceservice.saveInvoice(payload).subscribe({
      next: (res) => {
        setSnackbarMessage('Invoice generated successfully');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
        // Wait for toast to be visible before redirecting
        setTimeout(() => {
          router.push(`/invoices?mode=viewList`);
        }, 1000);
      },
      error: (error) => {
        setSnackbarMessage(error?.response?.data?.message || 'Failed to save invoice. Please try again.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    })
  }

  const useObservable = (observable: any, setter: any) => {
    useEffect(() => {
      const subscription = observable.subscribe((result: any) => {
        setter(result.content)
      })

      return () => subscription.unsubscribe()
    }, [observable, setter])
  }

  //tax API
  const useObservable2 = (observable: any, setter: any) => {
    useEffect(() => {
      const subscription = observable.subscribe((result: any) => {
        if (result.content && result.content.length > 0) {
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
  const useObservable3 = (observable: any, setter: any) => {
    useEffect(() => {
      const pageRequest: any = {
        page: 0,
        size: 100,
        summary: true,
        active: true
      }

      const subscription = productservice.getProducts(pageRequest).subscribe(result => {
        const tableArr: any = []

        if (result.content && result.content.length > 0) {
          result.content.forEach((ele: any) => {
            tableArr.push({
              name: ele.productBasicDetails.name,
              id: ele.id
            })
          })
        }

        setter(tableArr)
        populateProduct(tableArr)
      })

      return () => subscription.unsubscribe()
    }, [observable, setter])
  }

  // useObservable(ct$, setCardTypes);
  // useObservable(ft$, setFeesTypes);
  useObservable2(ts$, setTaxList)

  // useObservable2(ps$, setPlanList);
  useObservable3(pdt$, setProductList)

  const populateProduct = (prodList: any) => {
    setExapandInvoiceDetails(true)
    setExpandClientDetails(true)

    if (query2.get('mode') === 'edit') {
      return
    }

    if (id) {
      invoiceservice.getInvoiceDetails(id).subscribe((res: any) => {
        formik.setFieldValue('invoiceDate', res.invoiceDate)
        formik.setFieldValue('invoiceType', res.invoiceType)
        formik.setFieldValue('clientOrProspectId', res.clientOrProspectId)
        formik.setFieldValue('clientOrProspectType', res.clientOrProspectType)
        formik.setFieldValue('discountType', res.discountType)
        formik.setFieldValue('discountValue', res.discountEnterValue)
        formik.setFieldValue('loadingType', res.loadingType)
        formik.setFieldValue('loadingValue', res.loadingEnterValue)
        formik.setFieldValue('discountAmount', res.totalDiscount)
        formik.setFieldValue('loadingAmount', res.totalLoading)
        formik.setFieldValue('totalPremiumAmount', res.totalBeforeDiscountAndLoadingAmount)
        formik.setFieldValue('totalAmountWithoutTax', res.totalAfterDiscountAndLoadingAmount)
        formik.setFieldValue('totalTaxAmount', res.totalTaxAmount)
        formik.setFieldValue('totalAmountWithTax', res.totalAmountWithTax)

        if (res.quotationId) {
          formik.setFieldValue('quotationNumber', res.quotationId)
        }

        setRevertedMessage(res.reverted)
        fetchQuotationDetails(res.quotationId)
        setSelectedDate(new Date(res.invoiceDate))

        // prodList.forEach(p => {
        // if (p.id === res.productId) {
        productservice.getProductDetails(res.productId).subscribe(p => {
          const productObj: any = {
            name: p?.productBasicDetails?.name,
            id: p?.id
          }

          formik.setFieldValue('productData', productObj)
          formik.setFieldValue('product', res.productId)
          planservice.getPlanFromProduct(res.productId).subscribe((pl: any) => {
            if (pl.length > 0) {
              setPlanList(pl)
              pl.forEach((plan: any) => {
                if (plan.id === res.planId) {
                  formik.setFieldValue('planData', plan)
                  formik.setFieldValue('plan', res.planId)
                  planservice.getCategoriesFromPlan(res.planId).subscribe(catList => {
                    if (catList.length > 0) {
                      const catArr: any = []

                      catList.forEach((cat: any) => {
                        cat['noOfMembers'] = 0
                        cat['premiumAmount'] = 0
                        catArr.push(cat)
                      })
                      setCategoryList(catArr)
                      const cData: any = []

                      res.invoiceCategories.forEach((invCat: any) => {
                        catArr.forEach((cate: any) => {
                          if (Number(invCat.categoryId) === cate.id) {
                            cate['noOfMembers'] = invCat.noOfMenber
                            cate['premiumAmount'] = invCat.premiumAmount
                            cData.push(cate)
                          }
                        })
                      })
                      formik.setFieldValue('categorydata', cData)
                    }
                  })
                }
              })
            }
          })

          // }
        })

        taxservice.getTaxes(reqParam).subscribe((result: any) => {
          if (result.content) {
            result.content.forEach((re: any) => {
              re['checked'] = false
              re['taxVal'] = 0
            })
          }

          const txList = []

          res.invoiceTaxes.forEach((inv: any) => {
            if (result.content && result.content.length > 0) {
              result.content.forEach((tx: any) => {
                if (tx.id === inv.taxId) {
                  tx['checked'] = true
                  tx['taxVal'] = inv.taxAmount
                }
              })
            }
          })
          result.content.sort((a: { sortOrder: number }, b: { sortOrder: number }) => {
            return a.sortOrder - b.sortOrder
          })

          setTaxList(result.content)
        })

        const agentIDs = []

        // res.invoiceAgents.forEach(invAgIds => {
        //     agentIDs.push(invAgIds.agentId);
        // })

        const pageRequest = {
          page: 0,
          size: 100,
          summary: true,
          active: true

          // agentIds:agentIDs
        }

        const invoiceAgentList: any = []

        agentservice.getAgents(pageRequest).subscribe(agentdta => {
          res.invoiceAgents.forEach((invAgIds: any) => {
            if (agentdta.content && agentdta.content.length > 0) {
              agentdta.content.forEach(ag => {
                if (invAgIds.agentId === ag.id) {
                  invoiceAgentList.push({
                    agentId: invAgIds.agentId,
                    commissionType: invAgIds.commissionType,
                    commissionValue: invAgIds.commissionValue,
                    finalValue: invAgIds.finalValue,
                    name: ag.agentBasicDetails.name
                  })
                }
              })
            }
          })
          setAgentsList(invoiceAgentList)
        })

        if (res.clientOrProspectType === 'Client') {
          clientservice.getClientDetails(res.clientOrProspectId).subscribe((cdata: any) => {
            setClientData({
              clientName: cdata.clientBasicDetails.displayName,
              clientEmail: cdata.clientBasicDetails.contactNos[0].contactNo,
              clientMobile: cdata.clientBasicDetails.emails[0].emailId,
              clientId: cdata.id,
              clientType: 'Client'
            })
            addr$.subscribe(result => {
              if (result && result.length !== 0) {
                result.forEach((prop: { addressConfigurationFieldMappings: any[] }, i: any) => {
                  prop.addressConfigurationFieldMappings.forEach((field, j) => {
                    // let fname = "field"+i+j;
                    // field['value'] = '';
                    if (field.sourceId !== null && field.sourceId !== '') {
                      field['sourceList'] = []
                    }

                    if (field.type === 'dropdown' && field.sourceId === null) {
                      if (field.addressConfigurationFieldCustomValueMappings.length !== 0) {
                        field['sourceList'] = field.addressConfigurationFieldCustomValueMappings
                      }

                      // if(field.addressConfigurationFieldCustomValueMappings.length === 0 || field.addressConfigurationFieldCustomValueMappings === null){
                      //   field['sourceList'] = [];
                      // }
                    }
                  })
                })

                setAddressConfig(result)

                //
                result.forEach((prop: { addressConfigurationFieldMappings: any[] }, i: number) => {
                  prop.addressConfigurationFieldMappings.map((field: any, j: any) => {
                    //   frmObj[field.fieldName] = field.defaultValue;
                    if (field.dependsOn == '' && field.type == 'dropdown' && field.modifyApiURL) {
                      addressservice.getSourceList(field.modifyApiURL).subscribe((res: any) => {
                        // field.sourceList =res.content;
                        const list = [...result]

                        result[i].addressConfigurationFieldMappings[j].sourceList = res.content

                        // frmLst[field.fieldName] = res.content;
                        populateDynamicAddress(cdata, result)
                      })
                    }
                  })
                })
              }
            })
          })
        }

        if (res.clientOrProspectType === 'Prospect') {
          prospectservice.getProspectDetails(res.clientOrProspectId).subscribe((cdata: any) => {
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

  const handleLoadingChange = (e: any) => {
    const { name, value } = e.target

    formik.setFieldValue('loadingValue', value)

    // let lv = formik.values.loadingValue;
    const dv = formik.values.discountValue
    const tpa = formik.values.totalPremiumAmount

    calculateTotalAmoutWithoutTax(value, dv, tpa)
  }

  const handleDiscountChange = (e: any) => {
    const { name, value } = e.target

    formik.setFieldValue('discountValue', value)

    const lv = formik.values.loadingValue

    // let dv = formik.values.discountValue;
    const tpa = formik.values.totalPremiumAmount

    calculateTotalAmoutWithoutTax(lv, value, tpa)
  }

  const calculateTotalAmoutWithoutTax = (loadingVal: number, discountVal: number, premiumTotal: number) => {
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
    if (taxList.length) calculateTax(taxList, at)
  }

  //called after category select or premium amount change
  const calculateData = (list: any[]) => {
    let total = 0

    if (list.length > 0) {
      list.forEach(ele => {
        total = total + Number(ele.premiumAmount)
      })
    }

    formik.setFieldValue('totalPremiumAmount', total)

    const lv = formik.values.loadingValue
    const dv = formik.values.discountValue

    calculateTotalAmoutWithoutTax(lv, dv, total)
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

  const handleFieldChecked = (e: any, index: number) => {
    const { name, checked } = e.target
    const list: any = [...taxList]

    list[index][name] = checked

    setTaxList(list)
    calculateTax(list, formik.values.totalAmountWithoutTax)
  }

  React.useEffect(() => {
    if (query2.get('mode') === 'view' && id) {
      populateData(id)
    }

    if (query2.get('mode') === 'edit' && id) {

      formik.setFieldValue('quotationNo', JSON.parse(decodeURIComponent(id)))
      formik.setFieldValue('invoiceType', 'invoiceFromQuotation')
      fetchQuotationDetails(null)
    }
  }, [id])

  const populateData = (id: any) => { }

  const getPlans = (productId: any) => {
    planservice.getPlanFromProduct(productId).subscribe((res: any) => {
      if (res.length > 0) {
        setPlanList(res)
      }
    })
  }

  const getCategories = (planid: any) => {
    planservice.getCategoriesFromPlan(planid).subscribe(res => {
      if (res.length > 0) {
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
    router.push(`/invoices?mode=viewList`)

    // window.location.reload();
  }

  const handlePlanChange = (e: any, value: any) => {
    formik.setFieldValue('planData', value)
    formik.setFieldValue('plan', value?.id)
    getCategories(value?.id)
  }

  const handleProductChange = (e: any, value: any) => {
    formik.setFieldValue('productData', value)
    formik.setFieldValue('product', value?.id)
    getPlans(value?.id)
  }

  const handleCategorySelect = (e: any, value: any) => {
    formik.setFieldValue('categorydata', value)
    calculateData(value)
  }

  const changeCategoryData = (e: any, i: number) => {
    const { name, value } = e.target
    const list: any = formik.values.categorydata

    list[i][name] = value
    formik.setFieldValue('categorydata', list)
    calculateData(list)
  }

  const changePremiumAmount = (e: any, i: number) => {
    const { name, value } = e.target
    const list: any = formik.values.categorydata

    list[i][name] = value
    formik.setFieldValue('categorydata', list)
  }

  const handleExpenseHeadChange = (e: any, value: any) => {
    formik.setFieldValue('expenseHeadData', value)
    formik.setFieldValue('expenseHead', value?.id)
  }

  const useObservable4 = (observable: any, setter: any) => {
    useEffect(() => {
      const pageRequest: any = {
        page: 0,
        size: 100,
        summary: true,
        active: true
      }

      const subscription = expenseHeadService.getExpenseHeads(pageRequest).subscribe((result: { content: Array<{ name: string; id: string }> }) => {
        const tableArr: Array<{ name: string; id: string }> = []

        if (result.content && result.content.length > 0) {
          result.content.forEach((ele: { name: string; id: string }) => {
            tableArr.push({
              name: ele.name,
              id: ele.id
            })
          })
        }

        setter(tableArr)
      })

      return () => subscription.unsubscribe()
    }, [observable, setter])
  }

  useObservable4(null, setExpenseHeadList)

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  function Alert(props: any) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  return (
    <form onSubmit={formik.handleSubmit}>
      {query2.get('mode') === 'create' ? (
        <Grid
          item
          xs={12}
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            marginBottom: '20px',
            height: '2em',
            color: '#000',
            fontSize: '18px',
            fontWeight: 600
          }}
        >
          <span
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            {headerTitle}
          </span>
        </Grid>
      ) : null}
      {/* {query2.get('mode') === 'create' ? (
        <Grid
          item
          xs={12}
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            marginBottom: '20px',
            height: '2em',
            color: 'inherit',
            fontSize: '18px',
            fontWeight: 600,
          }}>
          <span
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            Invoice Management- Create Invoice
          </span>
        </Grid>
      ) : null} */}
      {query2.get('mode') !== 'edit' && (
        <Paper elevation={0}>
          <Box p={3} my={2}>
            <Grid container alignItems='flex-end' spacing={3} style={{ marginBottom: '20px' }}>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl className={classes.formControl}>
                  {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      views={['year', 'month', 'date']}
                      variant="inline"
                      format="dd/MM/yyyy"
                      margin="normal"
                      id="date-picker-inline"
                      label="Invoice Date"
                      value={selectedDate}
                      disabled={query2.get('mode') === 'view' ? true : false}
                      InputProps={{
                        classes: {
                          root: classes.inputRoot,
                          disabled: classes.disabled,
                        },
                      }}
                      onChange={handleInvoiceDate}
                      KeyboardButtonProps={{
                        'aria-label': 'change ing date',
                      }}
                    />
                  </MuiPickersUtilsProvider> */}
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      views={['year', 'month', 'day']}
                      label='Invoice Date'
                      value={selectedDate}
                      onChange={handleInvoiceDate}
                      disabled={query2.get('mode') === 'view' ? true : false}
                      InputProps={{
                        classes: {
                          root: classes.inputRoot,
                          disabled: classes.disabled
                        }
                      }}
                      renderInput={params => (
                        <TextField {...params} margin='normal' style={{ marginBottom: '0px' }} variant='outlined' />
                      )}
                    />
                  </LocalizationProvider>
                </FormControl>
              </Grid>
              <Grid item style={{ flex: 1 }}>
                {/* <FormControl classes={classes.formControl}> */}
                <FormControl component='fieldset'>
                  <RadioGroup
                    row
                    aria-label='position'
                    name='invoiceType'
                    value={formik.values.invoiceType}
                    onChange={formik.handleChange}
                  >
                    <FormControlLabel
                      value='invoiceFromQuotation'
                      control={<Radio color='primary' size='small' />}
                      label='Invoice from Quotation'
                      labelPlacement='end'
                    />
                    <FormControlLabel
                      value='invoiceFromEndorsement'
                      control={<Radio color='primary' size='small' />}
                      label='Invoice from Edorsement'
                      labelPlacement='end'
                      disabled={query2.get('mode') === 'view' ? true : false}

                    // InputProps={{
                    //   classes: {
                    //     root: classes.inputRoot,
                    //     disabled: classes.disabled,
                    //   },
                    // }}
                    />
                    {/* <FormControlLabel
                      value="invoiceWithoutQuotation"
                      control={<Radio color="primary" size="small" />}
                      label="Invoice without Quotation"
                      labelPlacement="end"
                      disabled={query2.get('mode') === 'view' ? true : false}

                      // InputProps={{
                      //   classes: {
                      //     root: classes.inputRoot,
                      //     disabled: classes.disabled,
                      //   },
                      // }}
                    /> */}
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12} container justifyContent='flex-end'>
                {query2.get('mode') !== 'view' &&
                  (formik.values.invoiceType === 'invoiceWithoutQuotation' ||
                    formik.values.invoiceType === 'invoiceFromEndorsement') && (
                    <Button
                      type='button'
                      className='mr-2 mb-2'
                      variant='contained'
                      color='secondary'
                      onClick={handleopenClientModal}
                    >
                      Search Client
                    </Button>
                  )}
                {/* {query2.get('mode') === 'view' && revertedMessage && (
                <span style={{ color: 'red', fontWeight: 'bold' }}>REVERTED</span>
              )} */}
                <InvoiceClientModal
                  setOpenClientModal={setOpenClientModal}
                  openClientModal={openClientModal}
                  handleCloseClientModal={handleCloseClientModal}
                  handleSubmitClientModal={handleSubmitClientModal}
                />
                <EndorsementModal
                  setOpenEndorsementModal={setOpenEndorsementModal}
                  openEndorsementModal={openEndorsementModal}
                  handleCloseEndorsementModal={handleCloseEndorsementModal}
                  handleSubmitEndorsementModal={handleSubmitEndorsementModal}
                  clientData={clientData}
                />
              </Grid>
            </Grid>

            {formik.values.invoiceType === 'invoiceFromQuotation' && (
              <Grid container spacing={3} style={{ marginBottom: '20px' }}>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    size='small'
                    id='standard-basic'
                    name='quotationNumber'
                    label='Quotation Number'
                    value={formik.values.quotationNumber}
                    onChange={formik.handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  {query2.get('mode') !== 'view' ? (
                    <Button type='button' variant='contained' color='primary' onClick={fetchQuotationDetails}>
                      Search Quotation
                    </Button>
                  ) : null}
                </Grid>
              </Grid>
            )}
          </Box>
        </Paper>
      )}
      <Paper elevation={0}>
        <Box p={3} my={2}>
          <Accordion expanded={expandClientDetails} elevation={0}>
            <AccordionSummary
              className={classes.AccordionSummary}
              expandIcon={<ExpandMoreIcon />}
              aria-controls='panel1a-content'
              id='panel1a-header'
              onClick={() => setExpandClientDetails(!expandClientDetails)}
            >
              <Typography className={classes.heading}>Client Details</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3} style={{ marginBottom: '20px' }}>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl className={classes.formControl}>
                    <TextField
                      size='small'
                      id='standard-basic'
                      name='clientName'
                      InputProps={{
                        readOnly: true
                      }}
                      label='Name'
                      value={clientData.clientName}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl className={classes.formControl}>
                    <TextField
                      size='small'
                      id='standard-basic'
                      name='clientEmail'
                      InputProps={{
                        readOnly: true
                      }}
                      label='Email'
                      value={clientData.clientEmail}
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <FormControl className={classes.formControl}>
                    <TextField
                      size='small'
                      id='standard-basic'
                      name='clientMobile'
                      label='Contact'
                      InputProps={{
                        readOnly: true
                      }}
                      value={clientData.clientMobile}
                    />
                  </FormControl>
                </Grid>
                {addressConfig && addressConfig.length !== 0 && (
                  <Grid item xs={12} container style={{ marginBottom: '20px' }}>
                    {addressConfig.map((prop: any, i: number) => {
                      return prop.addressConfigurationFieldMappings.length !== 1 ? (
                        <Grid item xs={12} sm={6} md={3} key={i + Math.random()}>
                          <div style={{ display: 'flex', flexDirection: 'row' }}>
                            <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                              {prop.levelName}
                            </InputLabel>
                            {prop.iButtonRequired === 'true' && (
                              <Tooltip title={prop.iButtonMessage} placement='top'>
                                <InfoOutlinedIcon style={{ fontSize: 'medium' }} />
                              </Tooltip>
                            )}
                          </div>
                          {prop.addressConfigurationFieldMappings.map((field: any, j: number) => {
                            return (
                              <div key={j + Math.random()}>
                                {field.type === 'dropdown' && !field.readOnly && (
                                  <FormControl className={classes.formControl}>
                                    <Select
                                      labelId='demo-simple-select-label'
                                      name={field.fieldName}
                                      id='demo-simple-select'
                                      required={field.required === 'true' ? true : false}
                                      style={{ marginRight: '8px' }}
                                      value={field.value}
                                      readOnly
                                    >
                                      {field.sourceList.map((ele: any) => {
                                        return (
                                          <MenuItem value={ele.code} key={ele.code}>
                                            {ele.name}
                                          </MenuItem>
                                        )
                                      })}
                                    </Select>
                                  </FormControl>
                                )}
                                {field.type === 'textbox' && !field.readOnly && (
                                  <FormControl className={classes.formControl}>
                                    <TextField
                                      id='standard-basic'
                                      name={field.fieldName}
                                      type={field.dataType === 'numeric' ? 'number' : 'text'}
                                      style={{ marginTop: '8px' }}
                                      value={field.value}
                                      InputProps={{
                                        readOnly: true
                                      }}
                                    />
                                  </FormControl>
                                )}

                                {field.type === 'textarea' && !field.readOnly && (
                                  <FormControl className={classes.formControl}>
                                    <TextField
                                      required={field.required === 'true' ? true : false}
                                      id='standard-multiline-flexible'
                                      multiline
                                      name={field.fieldName}
                                      maxRows={field.lengthValidation ? Number(prop.size) : 5}
                                      value={field.value}
                                      InputProps={{
                                        readOnly: true
                                      }}
                                    />
                                  </FormControl>
                                )}
                                {field.readOnly && (
                                  <FormControl className={classes.formControl}>
                                    <TextField
                                      id='standard-basic'
                                      name={field.fieldName}
                                      // value={field.defaultValue}
                                      defaultValue={field.defaultValue}
                                      InputProps={{
                                        readOnly: true
                                      }}
                                      style={{ marginTop: '10px', marginRight: '8px', width: '15%' }}
                                      size='small'
                                    />
                                  </FormControl>
                                )}
                              </div>
                            )
                          })}
                        </Grid>
                      ) : (
                        <Grid item xs={12} sm={6} md={3} key={i + 50}>
                          {prop.addressConfigurationFieldMappings.map((field: any, j: number) => {
                            return (
                              <div key={j + Math.random()}>
                                {field.type === 'dropdown' && !field.readOnly && (
                                  <FormControl className={classes.formControl}>
                                    <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                                      {prop.levelName}
                                    </InputLabel>
                                    <Select
                                      labelId='demo-simple-select-label'
                                      label={prop.levelName}
                                      name={field.fieldName}
                                      required={field.required === 'true' ? true : false}
                                      id='demo-simple-select'
                                      value={field.value}
                                      readOnly
                                    >
                                      {field.customValuePresent === 'CUSTOM' &&
                                        field.sourceList.map((ele: any) => {
                                          return (
                                            <MenuItem value={ele.id} key={ele.id}>
                                              {ele.value}
                                            </MenuItem>
                                          )
                                        })}
                                      {field.customValuePresent === 'DYNAMIC' &&
                                        field.sourceList.map((ele: any) => {
                                          return (
                                            <MenuItem value={ele.code} key={ele.code}>
                                              {ele.name}
                                            </MenuItem>
                                          )
                                        })}
                                    </Select>
                                  </FormControl>
                                )}

                                {field.type === 'textbox' && !field.readOnly && (
                                  <FormControl className={classes.formControl}>
                                    <TextField
                                      required={field.required === 'true' ? true : false}
                                      id='standard-basic'
                                      name={field.fieldName}
                                      type={field.dataType === 'numeric' ? 'number' : 'text'}
                                      value={field.value}
                                      // defaultValue={field.value}
                                      // value={formObj[field.fieldName] ? formObj[field.fieldName] : ""}
                                      label={prop.levelName}
                                      InputProps={{
                                        readOnly: true
                                      }}
                                    />
                                  </FormControl>
                                )}

                                {field.type === 'textarea' && !field.readOnly && (
                                  <FormControl className={classes.formControl}>
                                    <TextField
                                      id='standard-multiline-flexible'
                                      required={field.required === 'true' ? true : false}
                                      multiline
                                      name={field.fieldName}
                                      maxRows={field.lengthValidation ? Number(prop.size) : 5}
                                      value={field.value}
                                      // value={values.addressData[field.fieldName] ? values.addressData[field.fieldName] : ""}
                                      InputProps={{
                                        readOnly: true
                                      }}
                                      label={prop.levelName}
                                    />
                                  </FormControl>
                                )}
                                {field.readOnly && (
                                  <FormControl className={classes.formControl}>
                                    <TextField
                                      id='standard-basic'
                                      name={field.fieldName}
                                      value={field.defaultValue}
                                      label={prop.levelName}
                                      defaultValue={field.defaultValue}
                                      InputProps={{
                                        readOnly: true
                                      }}
                                    />
                                  </FormControl>
                                )}
                                {prop.iButtonRequired === 'true' && (
                                  <Tooltip title={prop.iButtonMessage} placement='top'>
                                    <InfoOutlinedIcon
                                      style={{ fontSize: 'medium', marginTop: '23px', marginLeft: '-23px' }}
                                    />
                                  </Tooltip>
                                )}
                              </div>
                            )
                          })}
                        </Grid>
                      )
                    })}
                  </Grid>
                )}
              </Grid>
            </AccordionDetails>
          </Accordion>
          <Accordion expanded={expandInvoiceDetails} elevation={0}>
            <AccordionSummary
              className={classes.AccordionSummary}
              expandIcon={<ExpandMoreIcon />}
              aria-controls='panel1a-content'
              id='panel1a-header'
              onClick={() => setExapandInvoiceDetails(!expandInvoiceDetails)}
            >
              <Typography className={classes.heading}>Invoice Details</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3} style={{ marginBottom: '20px' }}>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl className={classes.formControl}>
                    <Autocomplete
                      id='combo-box-demo'
                      options={productList}
                      getOptionLabel={(option: any) => option.name || ''}
                      value={formik.values.productData}
                      disabled={
                        query2.get('mode') === 'view' || formik.values.invoiceType === 'invoiceFromQuotation'
                          ? true
                          : false
                      }
                      renderInput={(params: any) => (
                        <TextField
                          {...params}
                          label={
                            <span>
                              Product <Asterisk />
                            </span>
                          }
                        />
                      )}
                      onChange={handleProductChange}
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <FormControl className={classes.formControl}>
                    <Autocomplete
                      id='combo-box-demo'
                      options={planList}
                      getOptionLabel={(option: any) => option.name || ''}
                      value={formik.values.planData}
                      disabled={
                        query2.get('mode') === 'view' || formik.values.invoiceType === 'invoiceFromQuotation'
                          ? true
                          : false
                      }
                      renderInput={(params: any) => (
                        <TextField
                          {...params}
                          label={
                            <span>
                              Plan <Asterisk />
                            </span>
                          }
                        />
                      )}
                      onChange={handlePlanChange}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl className={classes.formControl}>
                    <Autocomplete
                      id='expense-head-combo-box'
                      options={expenseHeadList}
                      getOptionLabel={(option: any) => option.name || ''}
                      value={formik.values.expenseHeadData}
                      disabled={query2.get('mode') === 'view' || formik.values.invoiceType === 'invoiceFromQuotation'}
                      renderInput={(params: any) => (
                        <TextField
                          {...params}
                          label={
                            <span>
                              Expense Head <Asterisk />
                            </span>
                          }
                        />
                      )}
                      onChange={handleExpenseHeadChange}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl className={classes.formControl}>
                    <Autocomplete
                      multiple
                      id='tags-standard'
                      options={categoryList}
                      getOptionLabel={(option: any) => option.name || ''}
                      value={formik.values.categorydata}
                      disabled={
                        query2.get('mode') === 'view' || formik.values.invoiceType === 'invoiceFromQuotation'
                          ? true
                          : false
                      }
                      renderInput={(params: any) => <TextField {...params} variant='standard' label='Categories' />}
                      onChange={handleCategorySelect}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TableContainer component={Paper} elevation={0} className={classes.AccordionSummary}>
                    <Table size='small' aria-label='a dense table'>
                      <TableHead>
                        <TableRow>
                          <TableCell>Category</TableCell>
                          <TableCell>No. of members</TableCell>
                          <TableCell align='right'>Premium Amount</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {formik.values.categorydata.map((prop: any, i: number) => {
                          return (
                            <TableRow key={i}>
                              <TableCell>{prop.name}</TableCell>
                              <TableCell>
                                {' '}
                                <TextField
                                  size='small'
                                  type='number'
                                  id='standard-basic'
                                  name='noOfMembers'
                                  disabled={
                                    query2.get('mode') === 'view' ||
                                      formik.values.invoiceType === 'invoiceFromQuotation'
                                      ? true
                                      : false
                                  }
                                  value={prop.noOfMembers}
                                  InputProps={{
                                    classes: {
                                      root: classes.inputRoot,
                                      disabled: classes.disabled
                                    }
                                  }}
                                  onChange={e => {
                                    changeCategoryData(e, i)
                                  }}
                                />
                              </TableCell>
                              <TableCell align='right'>
                                <TextField
                                  size='small'
                                  type='number'
                                  inputProps={{ min: 0, style: { textAlign: 'right' } }}
                                  id='standard-basic'
                                  name='premiumAmount'
                                  InputProps={{
                                    classes: {
                                      root: classes.inputRoot,
                                      disabled: classes.disabled
                                    }
                                  }}
                                  disabled={
                                    query2.get('mode') === 'view' ||
                                      formik.values.invoiceType === 'invoiceFromQuotation'
                                      ? true
                                      : false
                                  }
                                  value={prop.premiumAmount}
                                  onChange={e => {
                                    changeCategoryData(e, i)
                                  }}
                                />
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>

                <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <span style={{ fontWeight: 'bold' }}>
                    Total Premium Amount :{formik.values.totalPremiumAmount.toFixed(2)}{' '}
                  </span>
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>

                <Grid item xs={12}>
                  <table style={{ width: '100%' }}>
                    <thead>
                      <tr>
                        <th style={{ textAlign: 'left' }} colSpan={3}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Discount Row */}
                      <tr>
                        <td style={{ width: '30%' }}>Discount</td>
                        <td style={{ width: '40%' }}>
                          <TextField
                            size='small'
                            type='number'
                            id='standard-basic'
                            name='discountValue'
                            value={formik.values.discountValue}
                            disabled={query2.get('mode') === 'view'}
                            onChange={handleDiscountChange}
                            InputProps={{
                              classes: {
                                root: classes.inputRoot,
                                disabled: classes.disabled
                              }
                            }}
                            label='Discount Percentage (%)'
                          />
                        </td>
                        <td style={{ width: '30%', textAlign: 'right' }}>{formik.values.discountAmount.toFixed(2)}</td>
                      </tr>

                      {/* Loading Row */}
                      <tr>
                        <td>Loading</td>
                        <td>
                          <TextField
                            size='small'
                            type='number'
                            id='standard-basic'
                            name='loadingValue'
                            value={formik.values.loadingValue}
                            disabled={query2.get('mode') === 'view'}
                            onChange={handleLoadingChange}
                            InputProps={{
                              classes: {
                                root: classes.inputRoot,
                                disabled: classes.disabled
                              }
                            }}
                            label='Loading Percentage (%)'
                          />
                        </td>
                        <td style={{ textAlign: 'right' }}>{formik.values.loadingAmount.toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>
                </Grid>

                <Grid item xs={12}>
                  <Divider />
                </Grid>

                <Grid item xs={6}>
                  <FormGroup row>
                    {taxList.map((row: any, i: number) => (
                      <FormControlLabel
                        key={i}
                        control={
                          <Checkbox
                            checked={row.checked}
                            onChange={e => handleFieldChecked(e, i)}
                            name='checked'
                            color='primary'
                            disabled={query2.get('mode') === 'view' ? true : false}

                          // inputProps={{
                          //   classes: {
                          //     root: classes.inputRoot,
                          //     disabled: classes.disabled,
                          //   },
                          // }}
                          />
                        }
                        label={row.name}
                      />
                    ))}
                  </FormGroup>
                </Grid>

                <Grid item xs={6} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <span style={{ fontWeight: 'bold' }}>
                    Total After discount and loading :{formik.values.totalAmountWithoutTax.toFixed(2)}
                  </span>
                </Grid>

                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12} style={{ marginTop: '10px' }}>
                  <TableContainer component={Paper} elevation={0} className={classes.AccordionSummary}>
                    <Table size='small' aria-label='a dense table'>
                      <TableHead>
                        <TableRow>
                          <TableCell>Tax name</TableCell>
                          <TableCell>Tax value</TableCell>
                          <TableCell>Tax type</TableCell>
                          <TableCell align='right'>Tax Amount</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {taxList.map((row: any, i: number) => {
                          return (
                            row.checked && (
                              <TableRow key={row.id}>
                                <TableCell>{row.name}</TableCell>
                                <TableCell>{row.value}</TableCell>
                                <TableCell>{row.type}</TableCell>
                                <TableCell align='right'>{row.taxVal.toFixed(2)}</TableCell>
                              </TableRow>
                            )
                          )
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>

                <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <span style={{ fontWeight: 'bold' }}>Grand Total :{formik.values.totalAmountWithTax.toFixed(2)}</span>
                </Grid>

                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  {query2.get('mode') !== 'view' ? (
                    <Button variant='contained' color='secondary' onClick={handleOpenAgentModal}>
                      Search Agent
                    </Button>
                  ) : null}

                  <InvoiceAgentModal
                    agentsList={agentsList}
                    handleCloseAgentModal={handleCloseAgentModal}
                    openAgentModal={openAgentModal}
                    setAgentsList={setAgentsList}
                    handleAgentModalSubmit={handleAgentModalSubmit}
                  />
                </Grid>
                <Grid item xs={12} style={{ marginTop: '10px' }}>
                  <TableContainer component={Paper} elevation={0} className={classes.AccordionSummary}>
                    <Table size='small' aria-label='a dense table'>
                      <TableHead>
                        <TableRow>
                          <TableCell>Agent name</TableCell>
                          <TableCell>Commission value</TableCell>
                          <TableCell align='right'>Final value</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {agentsList.map((row: any, i: number) => (
                          <TableRow key={row.agentId}>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>
                              <TextField
                                size='small'
                                type='number'
                                id='standard-basic'
                                name='commissionValue'
                                value={row.commissionValue}
                                disabled={query2.get('mode') === 'view' ? true : false}
                                onChange={e => {
                                  changeCommision(e, i)
                                }}
                                label='Commission value (%)'
                                InputProps={{
                                  classes: {
                                    root: classes.inputRoot,
                                    disabled: classes.disabled
                                  }
                                }}
                              />
                            </TableCell>
                            <TableCell align='right'>{Number(row.finalValue).toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
              {/* <Grid container spacing={3} style={{ marginBottom: "20px" }}>
                              
                          </Grid> */}
            </AccordionDetails>
          </Accordion>
        </Box>
      </Paper>
      <Paper elevation={0}>
        <Box p={3} my={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
              {query2.get('mode') !== 'view' ? (
                <Button variant='contained' color='primary' style={{ marginRight: '5px' }} type='submit'>
                  Save
                </Button>
              ) : null}
              <Button variant='contained' color='primary' style={{ marginRight: '5px' }}>
                Update
              </Button>
              <Button
                variant='text'
                color='primary'
                className={`${query2.get('mode') === 'view' ? 'p-button' : 'p-button-text'}`}
                onClick={handleClose}
              >
                {query2.get('mode') === 'view' ? 'Ok' : 'Cancel'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
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
    </form>
  )
}
