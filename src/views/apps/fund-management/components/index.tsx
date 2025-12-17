// import * as React from "react";
// import * as yup from "yup";
'use client'

import * as React from 'react'
import { useEffect } from 'react'

import { useParams, useRouter, useSearchParams } from 'next/navigation'

import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Box from '@mui/material/Box'
import { Button } from 'primereact/button'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Select from '@mui/material/Select'
import { makeStyles } from '@mui/styles'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import 'date-fns'
import { useFormik } from 'formik'

import * as yup from 'yup'

import { AgentsService } from '@/services/remote-api/api/agents-services'
import { ClientService, ProspectService } from '@/services/remote-api/api/client-services'
import { InvoiceService } from '@/services/remote-api/api/invoice-services'
import { AddressService } from '@/services/remote-api/api/master-services'
import { PlanService } from '@/services/remote-api/api/plan-services'
import { ProductService } from '@/services/remote-api/api/product-services'
import { TaxService } from '@/services/remote-api/api/tax-services'
import InvoiceClientModal from '../../invoice-management/invoice/modals/invoice.client.modal.component'
import { defaultPageRequest } from '@/services/remote-api/models/page.request'

import Asterisk from '../../shared-component/components/red-asterisk'
import { QuotationService } from '@/services/remote-api/api/quotation-services'
import FundStatementTable from './FundStatementTable'
import { FundService } from '@/services/remote-api/api/fund-services'
import { setValue } from '@syncfusion/ej2-base'

const reqParam: any = { pageRequest: defaultPageRequest }

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

const invoiceservice = new InvoiceService()
const taxservice = new TaxService()
const productservice = new ProductService()
const planservice = new PlanService()
const agentservice = new AgentsService()
const clientservice = new ClientService()
const prospectservice = new ProspectService()
const addressservice = new AddressService()
const quotationService = new QuotationService()
const fundService = new FundService()


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
    minWidth: '90%'
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

export default function FundInvoiceDetails(props: any) {
  const query2 = useSearchParams()
  const params = useParams()
  const id: any = params.id
  const history = useRouter()
  const classes = useStyles()
  const [cardTypes, setCardTypes] = React.useState([])
  const [feesTypes, setFeesTypes] = React.useState([])
  const [productList, setProductList] = React.useState([])
  const [planList, setPlanList] = React.useState([])
  const [categoryList, setCategoryList] = React.useState([])
  const [openClientModal, setOpenClientModal] = React.useState(false)
  const [openAgentModal, setOpenAgentModal] = React.useState(false)
  const [agentsList, setAgentsList] = React.useState([])
  const [taxList, setTaxList] = React.useState([])
  const [quotationList, setQuotationList] = React.useState([])
  const [selectedQuotation, setSelectedQuotation] = React.useState('')

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
  const [expanded, setExpanded] = React.useState(true)
  const [codeForSearch, setCodeForSearch] = React.useState()
  const [nameForSearch, setNameForSearch] = React.useState()
  const [viewTable, setViewTable] = React.useState(false);
  const [data, setData] = React.useState([])

  const handleInvoiceDate = (date: any) => {
    setSelectedDate(date)

    const timestamp = new Date(date).getTime()

    formik.setFieldValue('invoiceDate', timestamp)
  }

  const formik = useFormik({
    initialValues: {
      invoiceDate: new Date().getTime(),
      invoiceType: 'invoiceWithoutQuotation',
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
      totalAmountWithTax: 0
    },

    // validationSchema: validationSchema,
    onSubmit: values => {
      handleSubmit()
    }
  })

  useEffect(() => {
    const subscription = addr$.subscribe(result => {
      if (result && result.length !== 0) {
        result.forEach((prop: any, i: number) => {
          prop.addressConfigurationFieldMappings.forEach((field: any, j: number) => {
            // let fname = "field"+i+j;
            field['value'] = ''

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

        result.forEach((prop: any, i: number) => {
          prop.addressConfigurationFieldMappings.map((field: any, j: number) => {
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

  const handleOpenAgentModal = () => {
    setOpenAgentModal(true)
  }

  const handleCloseAgentModal = () => {
    setOpenAgentModal(false)
  }

  const handleCloseClientModal = () => {
    setOpenClientModal(false)
  }

  const handleSubmitClientModal = (item: any) => {
    setClientData({
      ...setClientData,
      clientName: item.name,
      clientMobile: item.contactNo,
      clientEmail: item.email,
      clientId: item.id,
      clientType: item.clientType
    })
    populateDynamicAddress(item, addressConfig)
    // Fetch quotations for the selected client
    quotationService.getQuoationByProspect(item.clientBasicDetails.displayName).subscribe((res: any) => {
      let temp: any = [];
      if (res.content && res.content.length > 0) {
        res.content.forEach((ele: any) => {
          temp.push({
            id: ele.id,
            label: `${ele.quotationNo} - ${new Date(ele.quoteDate).toLocaleDateString('en-GB')}`,
          })
        })
      }
      setQuotationList(temp)
      setOpenClientModal(false)
    })
  }

  const callAPiFunc = (field: any, prop: any, resultarr: any[], addrrList: any[]) => {
    addrrList.forEach((pr, i) => {
      pr.addressConfigurationFieldMappings.forEach((fi: any, j: number) => {
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
    const addrrList: any = [...addressConfigList]

    const p = item?.clientAddress?.addresses.forEach((val: any) => {
      const q = addrrList?.forEach((prop: any, i: number) => {
        const r = prop.addressConfigurationFieldMappings?.forEach((field: any, j: number) => {
          if (Object.keys(val?.addressDetails)[0] === field?.fieldName) {
            field['value'] = val?.addressDetails[field?.fieldName]
          }
        })
      })
    })

    // setAddressConfig(addrrList);

    addrrList.forEach((prop: any, i: number) => {
      prop.addressConfigurationFieldMappings.forEach((field: any, j: number) => {
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
      })
    })

    // setAddressConfig(addrrList);
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

  const calculateAgentValues = (totalAmountWithoutTax: any) => {
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
      totalAmountWithTax: Number(formik.values.totalAmountWithTax)
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

    invoiceservice.saveInvoice(payload).subscribe((res: any) => {
      history.push(`/invoices?mode=viewList`)

      // window.location.reload();
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

        result.content.sort((a: any, b: any) => {
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
      const subscription = observable.subscribe((result: any) => {
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

        setRevertedMessage(res.reverted)

        setSelectedDate(new Date(res.invoiceDate))
        prodList.forEach((p: any) => {
          if (p.id === res.productId) {
            formik.setFieldValue('productData', p)
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
          }
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
          result.content.sort((a: any, b: any) => {
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
            addr$.subscribe((result: any) => {
              result.forEach((prop: any, i: number) => {
                prop.addressConfigurationFieldMappings.forEach((field: any, j: number) => {
                  // let fname = "field"+i+j;
                  field['value'] = ''

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

              result.forEach((prop: any, i: number) => {
                prop.addressConfigurationFieldMappings.map((field: any, j: number) => {
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

              // setAddressConfig(result);

              // populateDynamicAddress(cdata,result)
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
    calculateTax(taxList, at)
  }

  //called after category select or premium amount change
  const calculateData = (list: any) => {
    let total = 0

    if (list.length > 0) {
      list.forEach((ele: any) => {
        total = total + Number(ele.premiumAmount)
      })
    }

    formik.setFieldValue('totalPremiumAmount', total)

    const lv = formik.values.loadingValue
    const dv = formik.values.discountValue

    calculateTotalAmoutWithoutTax(lv, dv, total)
  }

  const calculateTax = (txlist: any, totalAmountWithoutTax: any) => {
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
    if (id) {
      populateData(id)
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
    planservice.getCategoriesFromPlan(planid).subscribe((res: any) => {
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
    history.push(`/invoices?mode=viewList`)

    // window.location.reload();
  }

  const handlePlanChange = (e: any, value: any) => {
    formik.setFieldValue('planData', value)
    formik.setFieldValue('plan', value.id)
    getCategories(value.id)
  }

  const handleProductChange = (e: any, value: any) => {
    formik.setFieldValue('productData', value)
    formik.setFieldValue('product', value.id)
    getPlans(value.id)
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

  const expandAccordian = () => {
    setExpanded(expanded => (expanded ? false : true))
  }

  const generateFundStatement = () => {
    if (!selectedQuotation) {
      // TODO: Add proper error handling/notification
      console.error('Please select a quotation');
      return;
    }

    const payload = {
      quotationId: selectedQuotation,
      clientOrProspectId: clientData.clientId,
      clientOrProspectType: clientData.clientType,
      generateStatementBy: 'Q' // Q for quotation
    };

    invoiceservice.generateFundInvoice(payload).subscribe((res: any) => {
      if (res.id) {
        history.push('/invoices?mode=viewList');
      }
    });
  };

  React.useEffect(() => {
    if (selectedQuotation) {
      populateTableData(selectedQuotation)
    }
  }, [selectedQuotation])

  const populateTableData = (id: any) => {
    let pageRequest = {
      page: 0,
      size: 10,
      summary: true,
      active: true,
      quotationId: id
    }
    fundService.getFundStatement(pageRequest).subscribe((value: any) => {
      setData(value.content)
    })
  }
  console.log("qwertyuiop", data?.length, viewTable)
  return (
    <form onSubmit={formik.handleSubmit}>
      {/* <Paper elevation='none'>
                <Box p={3} my={2}>
                    <Grid container spacing={3} style={{ marginBottom: "20px" }}>
                        <Grid item xs={12} sm={6} md={4}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardDatePicker
                                    views={["year", "month", "date"]}
                                    variant="inline"
                                    format="dd/MM/yyyy"
                                    margin="normal"
                                    id="date-picker-inline"
                                    label="Invoice Date"
                                    value={selectedDate}
                                    onChange={handleInvoiceDate}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change ing date',
                                    }}
                                />
                            </MuiPickersUtilsProvider>
                        </Grid>
                    </Grid>
                </Box>
            </Paper> */}
      <Paper elevation={0}>
        <Box p={3} my={2}>
          <Grid container spacing={3} style={{ marginBottom: '20px' }}>
            <Grid item xs={12} sm={6} md={4}>
              {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardDatePicker
                                views={["year", "month", "date"]}
                                variant="inline"
                                format="dd/MM/yyyy"
                                margin="normal"
                                id="date-picker-inline"
                                label="Invoice Date"
                                value={selectedDate}
                                disabled={query2.get("mode") === 'view' ? true : false}
                                InputProps={{
                                    classes: {
                                        root: classes.inputRoot,
                                        disabled: classes.disabled
                                    }
                                }}
                                onChange={handleInvoiceDate}
                                KeyboardButtonProps={{
                                    'aria-label': 'change ing date',
                                }}
                                />
                            </MuiPickersUtilsProvider> */}
              {/* <FormControl className={classes.formControl}>
                <TextField
                  size='small'
                  id='standard-basic'
                  name='code'
                  value={codeForSearch}
                  onChange={(e: any) => setCodeForSearch(e.target.value)}
                  label='Code'
                />
              </FormControl> */}
              <h2 style={{ paddingTop: "0.5rem", marginLeft: "10px" }}>Fund Statement</h2>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              {/* <FormControl className={classes.formControl}>
                <TextField
                  size='small'
                  id='standard-basic'
                  name='name'
                  value={nameForSearch}
                  onChange={(e: any) => setNameForSearch(e.target.value)}
                  label='Name'
                />
              </FormControl> */}
            </Grid>
            <Grid item xs={12} sm={6} md={4} container justifyContent='flex-end'>
              {query2.get('mode') !== 'view' && (
                <Button color='secondary' onClick={handleopenClientModal}>
                  Search Client
                </Button>
              )}
              {query2.get('mode') === 'view' && revertedMessage && (
                <span style={{ color: 'red', fontWeight: 'bold' }}>REVERTED</span>
              )}
              <InvoiceClientModal
                openClientModal={openClientModal}
                code={codeForSearch}
                name={nameForSearch}
                fundInvoice={true}
                setOpenClientModal={setOpenClientModal}
                handleCloseClientModal={handleCloseClientModal}
                handleSubmitClientModal={handleSubmitClientModal}
              />
            </Grid>
          </Grid>
        </Box>
      </Paper>

      <Paper elevation={0}>
        <Box p={3} my={2}>
          <Accordion expanded={expanded} onChange={expandAccordian} elevation={0}>
            <AccordionSummary
              className={classes.AccordionSummary}
              expandIcon={<ExpandMoreIcon />}
              aria-controls='panel1a-content'
              id='panel1a-header'
            >
              <Typography className={classes.heading}>Client Details</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3} style={{ marginBottom: '20px' }}>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    size='small'
                    id='standard-basic'
                    name='clientName'
                    InputProps={{ readOnly: true }}
                    label='Name'
                    value={clientData.clientName}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    size='small'
                    id='standard-basic'
                    name='clientEmail'
                    InputProps={{ readOnly: true }}
                    label='Email'
                    value={clientData.clientEmail}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    size='small'
                    id='standard-basic'
                    name='clientMobile'
                    label='Contact'
                    InputProps={{ readOnly: true }}
                    value={clientData.clientMobile}
                  />
                </Grid>

                {addressConfig && addressConfig.length !== 0 && (
                  <Grid item xs={12} style={{ marginBottom: '20px', display: 'flex', flexDirection: 'row' }}>
                    {addressConfig.map((prop: any, i: number) => {
                      return prop.addressConfigurationFieldMappings.length !== 1 ? (
                        <Grid item xs={6} key={i}>
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
                              <>
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
                                  <TextField
                                    id='standard-basic'
                                    name={field.fieldName}
                                    type={field.dataType === 'numeric' ? 'number' : 'text'}
                                    style={{ marginTop: '8px' }}
                                    value={field.value}
                                    InputProps={{ readOnly: true }}
                                  />
                                )}

                                {field.type === 'textarea' && !field.readOnly && (
                                  <TextField
                                    required={field.required === 'true' ? true : false}
                                    id='standard-multiline-flexible'
                                    multiline
                                    name={field.fieldName}
                                    maxRows={field.lengthValidation ? Number(prop.size) : 5}
                                    value={field.value}
                                    InputProps={{ readOnly: true }}
                                  />
                                )}
                                {field.readOnly && (
                                  <TextField
                                    id='standard-basic'
                                    name={field.fieldName}
                                    // value={field.defaultValue}
                                    defaultValue={field.defaultValue}
                                    InputProps={{ readOnly: true }}
                                    style={{ marginTop: '10px', marginRight: '8px', width: '15%' }}
                                    size='small'
                                  />
                                )}
                              </>
                            )
                          })}
                        </Grid>
                      ) : (
                        <Grid item xs={12} sm={6} md={4} key={i + 50}>
                          {prop.addressConfigurationFieldMappings.map((field: any, j: number) => {
                            return (
                              <div key={j + 2}>
                                {field.type === 'dropdown' && !field.readOnly && (
                                  <FormControl className={classes.formControl}>
                                    <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                                      {prop?.levelName}
                                    </InputLabel>
                                    <Select
                                      labelId='demo-simple-select-label'
                                      name={field.fieldName}
                                      label={prop.levelName}
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
                                  <TextField
                                    required={field.required === 'true' ? true : false}
                                    id='standard-basic'
                                    name={field.fieldName}
                                    type={field.dataType === 'numeric' ? 'number' : 'text'}
                                    value={field.value}
                                    // value={formObj[field.fieldName] ? formObj[field.fieldName] : ""}
                                    label={prop.levelName}
                                    InputProps={{ readOnly: true }}
                                  />
                                )}

                                {field.type === 'textarea' && !field.readOnly && (
                                  <TextField
                                    id='standard-multiline-flexible'
                                    // required={field.required === 'true' ? true : false}
                                    multiline
                                    name={field.fieldName}
                                    maxRows={field.lengthValidation ? Number(prop.size) : 5}
                                    value={field.value}
                                    // value={values.addressData[field.fieldName] ? values.addressData[field.fieldName] : ""}
                                    InputProps={{ readOnly: true }}
                                    // label={prop.levelName}
                                    label={
                                      field.required === 'true' ? (
                                        <span>
                                          {prop.levelName} <Asterisk />
                                        </span>
                                      ) : (
                                        prop.levelName
                                      )
                                    }
                                  />
                                )}
                                {field.readOnly && (
                                  <TextField
                                    id='standard-basic'
                                    name={field.fieldName}
                                    value={field.defaultValue}
                                    label={prop.levelName}
                                    defaultValue={field.defaultValue}
                                    InputProps={{ readOnly: true }}
                                  />
                                )}
                                {prop.iButtonRequired === 'true' && (
                                  <Tooltip title={prop.iButtonMessage} placement='top'>
                                    <InfoOutlinedIcon style={{ fontSize: 'medium', marginTop: '23px' }} />
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
            {/* <Box p={3} my={2}></Box> */}
            <Grid container spacing={3} alignItems="center" style={{ padding: '20px' }}>
              <Grid item xs={6}>
                <FormControl className={classes.formControl}>
                  <InputLabel
                    id="fund-statement-quotation-label"
                    style={{ marginBottom: "0px" }}
                  >
                    Quotation
                  </InputLabel>
                  <Select
                    label='Quotation'
                    value={selectedQuotation}
                    onChange={(e) => setSelectedQuotation(e.target.value)}
                    style={{ marginRight: '8px' }}
                  >
                    {quotationList.map((ele: any) => {
                      return (
                        <MenuItem key={ele.id} value={ele.id}>
                          {ele.label}
                        </MenuItem>
                      )
                    })}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                {query2.get('mode') !== 'view' ? (
                  <Button
                    color='primary'
                    type="button"
                    style={{ marginRight: '5px' }}
                    // onClick={() => history.push('/funds/statement/table')}
                    onClick={() => setViewTable(true)}
                  >
                    View Fund Statement Table
                  </Button>
                ) : null}
              </Grid>
            </Grid>
            {/* </Box> */}
          </Accordion>
          {viewTable && (data?.length > 0 ? (
            <Paper>
              <FundStatementTable data={data} />
            </Paper>
          ) : <>No Data Found</>)}
        </Box>
      </Paper>

    </form>
  )
}
