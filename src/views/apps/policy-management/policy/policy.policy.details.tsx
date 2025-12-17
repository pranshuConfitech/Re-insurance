
import * as React from 'react'
import { useEffect } from 'react'

import { useParams, useRouter, useSearchParams } from 'next/navigation'

import Box from '@mui/material/Box'
import { Button } from 'primereact/button'
import Checkbox from '@mui/material/Checkbox'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import FormHelperText from '@mui/material/FormHelperText'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Select from '@mui/material/Select'
import Snackbar from '@mui/material/Snackbar'
import { makeStyles } from '@mui/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import type { AlertProps } from '@mui/lab/Alert'
import MuiAlert from '@mui/lab/Alert'
import Autocomplete from '@mui/lab/Autocomplete'

// import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import 'date-fns'
import { useFormik } from 'formik'

import { firstValueFrom, forkJoin, of, zip } from 'rxjs'
import * as yup from 'yup'

import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

import { AgentsService } from '@/services/remote-api/api/agents-services'
import { InvoiceService } from '@/services/remote-api/api/invoice-services'
import { ClientTypeService, OrganizationTypeService } from '@/services/remote-api/api/master-services'
import { PlanService } from '@/services/remote-api/api/plan-services'
import { PolicyService } from '@/services/remote-api/api/policy-services'
import { QuotationService } from '@/services/remote-api/api/quotation-services'
import { TaxService } from '@/services/remote-api/api/tax-services'
import EditConfirmationModal from './modals/edit.client.modal.component'
import ProposerAgentModal from './modals/policy.agent.import.modal.component'
import { ReceiptService } from '@/services/remote-api/fettle-remote-api'
import { defaultPageRequest } from '@/services/remote-api/models/page.request'
import { TpaService } from '@/services/remote-api/api/tpa-service'

const organizationservice = new OrganizationTypeService()
const clienttypeervice = new ClientTypeService()
const taxservice = new TaxService()
const invoiceservice = new InvoiceService()
const agentservice = new AgentsService()
const planservice = new PlanService()
const policyService = new PolicyService()
const tpaservice = new TpaService()
const quotationService = new QuotationService()
const receiptservice = new ReceiptService()
const reqParam: any = { pageRequest: defaultPageRequest }
const org$ = organizationservice.getOrganizationTypes()
const ct$ = clienttypeervice.getCleintTypes()
const ts$ = taxservice.getTaxes(reqParam)
const ps$ = planservice.getPlans()
const tp$ = tpaservice.getTpas(defaultPageRequest)

const useStyles = makeStyles(theme => ({
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
  inputRoot: {
    '&$disabled': {
      color: 'black'
    }
  },
  disabled: {}
}))

// function useQuery1() {
//   return new URLSearchParams(useLocation().search);
// }

const validationSchema = yup.object({
  tpa: yup.string().required('TPA is required field')
})

export default function PolicyDetailsComponent(props: any) {
  const classes = useStyles()
  const query: any = useSearchParams()
  const invid = query.get('invid')
  const refid = query.get('refid')
  const { clientDetail } = props
  const { policyDetails, setPolicyDetails } = props
  const [organizationTypes, setOrganizationTypes] = React.useState([])
  const [clientTypes, setClientTypes] = React.useState([])
  const [groupTypes, setGroupTypes] = React.useState([])
  const [prefixes, setPrefixes] = React.useState([])
  const [suffixes, setSuffixes] = React.useState([])
  const [openRequired, setOpenRequired] = React.useState(false)
  const [idErrorMsg, setIdErrorMsg] = React.useState(false)
  const [checkContact, setCheckContact] = React.useState(false)
  const [disableClientData, setDisableClientData] = React.useState(true)
  const [confirmModal, setConfirmModal] = React.useState(false)
  const id: any = useParams().id
  const [agentsList, setAgentsList] = React.useState([])
  const [openAgentModal, setOpenAgentModal] = React.useState(false)
  const router = useRouter()

  // const [policyDetails, setPolicyDetails] = React.useState(
  //   {
  //     tpa: '',
  //     policyNumber: '',
  //     plan: '',
  //     planData: '',
  //     basePremium: 0,
  //     loadingType: 'PERCENTAGE',
  //     loadingAmount: 0,
  //     loadingValue: 0,
  //     discountType: 'PERCENTAGE',
  //     discountAmount: 0,
  //     discountValue: 0,
  //     totalAmountWithoutTax: 0,
  //     totalAmountWithTax: 0,
  //     totalTaxAmount: 0,
  //     renewalDate: new Date(),
  //     renewalDateVal: '',
  //     invNo: '',
  //     agentsList: [],
  //     taxList: [],
  //   }
  // );

  const formik = useFormik({
    initialValues: {
      tpa: '',
      policyNumber: '',
      plan: '',
      planData: '',
      basePremium: 0,
      loadingType: 'PERCENTAGE',
      loadingAmount: 0,
      loadingValue: 0,
      discountType: 'PERCENTAGE',
      discountAmount: 0,
      discountValue: 0,
      totalAmountWithoutTax: 0,
      totalAmountWithTax: 0,
      totalTaxAmount: 0,
      renewalDate: new Date(),
      renewalDateVal: '',
      invNo: ''
    },
    validationSchema: validationSchema,
    onSubmit: values => {
      if (!formik.values.tpa) {
        formik.setErrors({ tpa: 'Tpa is required' })

        return
      }

      handleSubmit()
    }
  })

  const [selectedDate, setSelectedDate] = React.useState(new Date())
  const [disableOptions, setDisableOptions] = React.useState(true)
  const [taxList, setTaxList] = React.useState([])
  const [taxList2, setTaxList2] = React.useState([])

  const [planList, setPlanList] = React.useState([])
  const [tpaList, setTpaList] = React.useState([])
  const [selectedIndex, setSelectedIndex] = React.useState('')
  const [selectedAgentsList, setSelectedAgentsList] = React.useState([])
  const [policyStartDate, setPolicyStartDate] = React.useState(new Date())
  const [policyEndDate, setPolicyEndDate] = React.useState(new Date())
  const [renewalDate, setRenewalDate] = React.useState(new Date())

  const handleStartDateChange = (date: any) => { }

  const populatePolicyDates = (policyStartDate: any, policyEndDate: any, pd: any) => {
    // var endDate=new Date(policyStartDate.getTime());
    // endDate.setTime(endDate.getTime() + (pd.policyDuration* 24 * 60 * 60 * 1000));
    const renewalDate = new Date(policyEndDate)
    // renewalDate.setUTCDate(renewalDate.getUTCDate()); // Add 1 day in UTC

    // renewalDate.setTime(renewalDate.getTime() + 24 * 60 * 60 * 1000)

    const updatedEndDate = new Date(policyEndDate)
    updatedEndDate.setUTCDate(updatedEndDate.getUTCDate() - 1); // Add 1 day in UTC

    console.log('populatePolicyDates', updatedEndDate.getTime(), policyEndDate.getTime())
    setPolicyStartDate(policyStartDate)
    // setPolicyEndDate(updatedEndDate)
    setPolicyEndDate(updatedEndDate)
    setRenewalDate(policyEndDate)

    setPolicyDetails({ ...pd, renewalDate: policyEndDate, policyEndDate: policyEndDate, policyStartDate: policyStartDate })
  }

  const handleEndDateChange = (date: any) => {
    setPolicyEndDate(date)
  }

  const useObservable = (observable: any, setter: any) => {
    useEffect(() => {
      const subscription = observable.subscribe((result: any) => {
        setter(result.content)
      })

      return () => subscription.unsubscribe()
    }, [observable, setter])
  }

  const useObservable2 = (observable: any, setter: any) => {
    useEffect(() => {
      const subscription = observable.subscribe((result: any) => {
        if (result.content && result.content.length > 0) {
          result.content.forEach((ele: any) => {
            ele['checked'] = false
            ele['taxVal'] = 0
          })

          result.content.sort((a: { sortOrder: number }, b: { sortOrder: number }) => {
            return a.sortOrder - b.sortOrder
          })
        }

        const p = { ...policyDetails, taxList: result.content }

        setPolicyDetails(p)

        setter(result.content)
      })

      return () => subscription.unsubscribe()
    }, [observable, setter])
  }

  const useObservable3 = (observable: any, setter: any) => {
    useEffect(() => {
      const subscription = observable.subscribe((result: any) => {
        if (result.content && result.content.length > 0) {
          result.content.forEach((ele: any) => {
            ele['checked'] = false
            ele['taxVal'] = 0
          })

          result.content.sort((a: { sortOrder: number }, b: { sortOrder: number }) => {
            return a.sortOrder - b.sortOrder
          })
        }

        setter(result.content)
      })

      return () => subscription.unsubscribe()
    }, [observable, setter])
  }

  useObservable2(ts$, setTaxList)
  useObservable3(ps$, setPlanList)
  useObservable3(ts$, setTaxList2)

  useObservable(org$, setOrganizationTypes)
  useObservable(ct$, setClientTypes)
  useObservable(tp$, setTpaList)

  function Alert(props: React.JSX.IntrinsicAttributes & AlertProps) {
    return <MuiAlert elevation={6} variant='filled' {...props} />
  }

  function validateEmail(email: any) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    return re.test(String(email).toLowerCase())
  }

  React.useEffect(() => {
    if (query.get('invid')) {
      populateFromInvoice(query.get('invid'))
      setDisableOptions(true)
    }
  }, [query.get('invid')])

  React.useEffect(() => {
    if (query.get('recid')) {
      populateFromReceipt()
      setDisableOptions(true)
    }
  }, [query.get('recid')])

  React.useEffect(() => {
    if (query.get('refid')) {
      setDisableOptions(false)

      if (id) {
        populatePolicyDetails()
      }
    }
  }, [query.get('refid')])

  const handleChange = (event: { target: { name: any; value: any } }) => {
    const { name, value } = event.target

    setPolicyDetails({
      ...policyDetails,
      [name]: value
    })
  }

  const populateFromReceipt = () => {
    if (query.get('recid')) {
      receiptservice.getReceiptDetails(query.get('recid')).subscribe((res: any) => {
        const pageRequest: any = {
          page: 0,
          size: 1000,
          summary: true,
          active: true
        }

        pageRequest['invoiceNumber'] = res.invoiceNo
        invoiceservice.getInvoice(pageRequest).subscribe((ele: any) => {
          if (ele.content.length !== 0) {
            populateFromInvoice(ele.content[0].id)
          }
        })
      })
    }
  }

  const populatePolicyDetails = () => {
    policyService.getPolicyDetails(id).subscribe((values: any) => {
      const pd: any = []

      if (values.policyDetails.length !== 0 && values.policyDetails) {
        values.policyDetails.forEach((pdetails: any) => {
          pd.push({
            tpa: pdetails.tpa ? pdetails.tpa : '',
            policyNumber: pdetails.policyNo ? pdetails.policyNo : '',
            plan: pdetails.planName ? pdetails.planName : '',
            planData: '',
            basePremium: pdetails.totalBeforeDiscountAndLoadingAmount
              ? pdetails.totalBeforeDiscountAndLoadingAmount
              : 0,
            loadingType: 'PERCENTAGE',
            loadingAmount: pdetails.totalLoading ? pdetails.totalLoading : 0,
            loadingValue: pdetails.loadingEnterValue ? pdetails.loadingEnterValue : 0,
            discountType: 'PERCENTAGE',
            discountAmount: pdetails.totalDiscount ? pdetails.totalDiscount : 0,
            discountValue: pdetails.discountEnterValue ? pdetails.discountEnterValue : 0,
            totalAmountWithoutTax: pdetails.totalAfterDiscountAndLoadingAmount
              ? pdetails.totalAfterDiscountAndLoadingAmount
              : 0,
            totalAmountWithTax: pdetails.totalAmountWithTax ? pdetails.totalAmountWithTax : 0,
            totalTaxAmount: pdetails.totalTaxAmount ? pdetails.totalTaxAmount : 0,
            renewalDate: pdetails.rennewalDate ? new Date(pdetails.rennewalDate) : new Date(),
            renewalDateVal: pdetails.rennewalDate ? pdetails.rennewalDate : '',
            invNo: '',
            proposerAgents: pdetails.proposerAgents,
            proposerTax: pdetails.proposerTax,
            agentsList: [],
            taxList: [],
            anniversary: pdetails.anniversary ? pdetails.anniversary : '',
            policyId: pdetails.id ? pdetails.id : ''
          })
        })

        // setPolicyDetails(pd)

        const frkPlan = pd.map((el: any, i: number) => {
          return planservice.getPlanDetails(el.plan)
        })

        forkJoin(frkPlan).subscribe((res: any) => {
          res.forEach((pdata: any, i: number) => {
            pd[i].planData = pdata
          })

          const policies$ = pd.map((p: any) => {
            return getZipped(p)
          })

          zip(policies$).subscribe(res => {
            res.forEach((policy: any, i: number) => {
              policy.agents.forEach((pa: any, j: number) => {
                pd[i].agentsList.push({
                  agentId: pd[i].proposerAgents[j].agentId,
                  commissionType: pd[i].proposerAgents[j].commissionType,
                  commissionValue: pd[i].proposerAgents[j].commissionValue,
                  finalValue: pd[i].proposerAgents[j].finalValue,
                  name: pa.agentBasicDetails?.name,
                  code: pa.agentBasicDetails?.code,
                  contactNo: pa.agentBasicDetails?.contactNos[0].contactNo
                })
              })

              policy.taxArr.content.forEach((ta: any) => {
                ta['checked'] = false
                ta['taxVal'] = 0
                pd[i].proposerTax.forEach((pt: any) => {
                  if (pt.taxId === ta.id) {
                    ta['checked'] = true
                    ta['taxVal'] = pt.taxAmount
                  }
                })
              })

              pd[i].taxList = policy.taxArr.content
            })
            setPolicyDetails(pd)
          })
        })
      }
    })
  }

  const handleTaxCalc = (pd: any[]) => {
    pd.forEach((el, i) => {
      planservice.getPlanDetails(el.plan).subscribe(pl => {
        el.planData = pl
        setPolicyDetails(pd)
      })
    })
  }

  const getZipped = (policyDetail: any) => {
    const agents$ = zip(
      policyDetail.proposerAgents.map((pa: any) => {
        return agentservice.getAgentDetails(pa.agentId)
      })
    )

    const taxes$ = zip(
      policyDetail.proposerTax.map((pt: any) => {
        return taxservice.getTaxDetails(pt.taxId)
      })
    )

    const taxList$ = taxservice.getTaxes(reqParam)

    return forkJoin({ policyDetail: of(policyDetail), agents: agents$, taxes: taxes$, taxArr: taxList$ })
  }

  const populateFromInvoice = (invid: any) => {
    invoiceservice
      .getInvoiceDetails(invid)

      .subscribe((invoiceDetail: any) => {
        const obj: any = {
          plan: invoiceDetail.planId,
          planData: '',
          basePremium: invoiceDetail.totalBeforeDiscountAndLoadingAmount,
          loadingType: 'PERCENTAGE',
          loadingAmount: invoiceDetail.totalLoading,
          loadingValue: invoiceDetail.loadingEnterValue,
          discountType: 'PERCENTAGE',
          discountAmount: invoiceDetail.totalDiscount,
          discountValue: invoiceDetail.discountEnterValue,
          totalAmountWithoutTax: invoiceDetail.totalAfterDiscountAndLoadingAmount,
          totalAmountWithTax: invoiceDetail.totalAmountWithTax,
          totalTaxAmount: invoiceDetail.totalTaxAmount,
          renewalDate: invoiceDetail.invoiceDate ? new Date(invoiceDetail.invoiceDate) : new Date(),
          renewalDateVal: invoiceDetail.invoiceDate ? invoiceDetail.invoiceDate : '',
          invNo: invoiceDetail.invoiceNumber,

          // proposerAgents: pdetails.proposerAgents,
          // proposerTax: pdetails.proposerTax,
          agentsList: [],
          taxList: [],
          policyDuration: 0
        }

        let agents$

        if (invoiceDetail.invoiceAgents.length > 0) {
          agents$ = zip(
            invoiceDetail.invoiceAgents.map((pa: any) => {
              return agentservice.getAgentDetails(pa.agentId)
            })
          )
        } else {
          agents$ = of([]) // Create an observable that emits an empty array
        }

        const quotationDetails$ = quotationService.getQuoationDetailsByID(invoiceDetail.quotationId)

        if (id) {
          forkJoin({
            policyDetail: policyService.getPolicyDetails(id),
            planDatas: planservice.getPlanDetails(invoiceDetail.planId),
            taxes: taxservice.getTaxes(reqParam),
            agents: agents$,
            quotation: quotationDetails$
          }).subscribe((res: any) => {
            obj['planData'] = res.planDatas

            if (res.policyDetail) {
              obj['tpa'] = res.policyDetail.tpa
              formik.setFieldValue('tpa', res.policyDetail.tpa)
              obj['policyId'] = res.policyDetail.id

              // obj['anniversary'] = res.policyDetail.policyDetails[0].anniversary;
              obj['policyNumber'] = res.policyDetail.policyNumber

              // obj.policyDuration= res.quotation['policyDuration'];
              obj.renewalPolicyId = res.quotation.renewalPolicyId;
            }

            const quAgentIds = res.quotation.quotationAgents?.map((el: any) => el.agentId) || []

            const pageRequest = {
              page: 0,
              size: 100,
              summary: true,
              active: true,
              agentIds: quAgentIds
            }

            agentservice.getAgents(pageRequest).subscribe(agentdta => {
              const invoiceAgentList =
                res.quotation.quotationAgents?.flatMap((invAgIds: any) =>
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

            if (res.taxes.content && res.taxes.content.length > 0) {
              res.taxes.content.forEach((re: any) => {
                re['checked'] = false
                re['taxVal'] = 0
              })

              invoiceDetail.invoiceTaxes.forEach((inv: any) => {
                res.taxes.content.forEach((tx: any) => {
                  if (tx.id === inv.taxId) {
                    tx['checked'] = true
                    tx['taxVal'] = inv.taxAmount
                  }
                })
              })
              res.taxes.content.sort((a: { sortOrder: number }, b: { sortOrder: number }) => {
                return a.sortOrder - b.sortOrder
              })
              obj['taxList'] = res.taxes.content
            }

            const agntList: any = []

            res.agents.forEach((ag: any, i: any) => {
              agntList.push({
                agentId: invoiceDetail.invoiceAgents[i].agentId,
                commissionType: invoiceDetail.invoiceAgents[i].commissionType,
                commissionValue: invoiceDetail.invoiceAgents[i].commissionValue,
                finalValue: invoiceDetail.invoiceAgents[i].finalValue,
                name: ag.agentBasicDetails?.name,
                code: ag.agentBasicDetails?.code,
                contactNo: ag.agentBasicDetails?.contactNos[0].contactNo
              })
            })
            obj['agentsList'] = agntList
            const sd = new Date(res.quotation['policyStartDate'])
            const ed = new Date(res.quotation['policyEndDate'])
            populatePolicyDates(sd, ed, obj)
            setPolicyDetails(obj)
          })
        } else {
          const proposerID = localStorage.getItem('proposerid')

          forkJoin({
            planDatas: planservice.getPlanDetails(invoiceDetail.planId),
            taxes: taxservice.getTaxes(reqParam),
            agents: agents$,
            quotation: quotationDetails$
          }).subscribe((res: any) => {
            obj['planData'] = res.planDatas
            obj['tpa'] = ''
            obj['policyId'] = ''
            obj['anniversary'] = ''
            obj['policyNumber'] = ''
            obj.policyDuration = res.quotation['policyDuration']
            obj.renewalPolicyId = res.quotation.renewalPolicyId;

            const quAgentIds = res.quotation.quotationAgents?.map((el: any) => el.agentId) || [];
            const pageRequest = {
              page: 0,
              size: 100,
              summary: true,
              active: true,
              agentIds: quAgentIds,
            };

            agentservice.getAgents(pageRequest).subscribe(agentdta => {
              const invoiceAgentList = res.quotation.quotationAgents?.flatMap((invAgIds: any) =>
                agentdta.content?.filter(ag => invAgIds.agentId === ag.id).map(ag => ({
                  agentId: invAgIds.agentId,
                  commissionType: invAgIds.commissionType,
                  commissionValue: invAgIds.commissionValue,
                  finalValue: invAgIds.finalValue,
                  name: ag.agentBasicDetails.name,
                }))
              ) || [];
              setAgentsList(invoiceAgentList);
            });

            if (res.taxes.content && res.taxes.content.length > 0) {
              res.taxes.content.forEach((re: any) => {
                re['checked'] = false
                re['taxVal'] = 0
              })

              invoiceDetail.invoiceTaxes.forEach((inv: any) => {
                res.taxes.content.forEach((tx: any) => {
                  if (tx.id === inv.taxId) {
                    tx['checked'] = true
                    tx['taxVal'] = inv.taxAmount
                  }
                })
              })
              res.taxes.content.sort((a: { sortOrder: number }, b: { sortOrder: number }) => {
                return a.sortOrder - b.sortOrder
              })
              obj['taxList'] = res.taxes.content
            }

            const agntList: any = []

            res.agents.forEach((ag: any, i: number) => {
              agntList.push({
                agentId: invoiceDetail.invoiceAgents[i].agentId,
                commissionType: invoiceDetail.invoiceAgents[i].commissionType,
                commissionValue: invoiceDetail.invoiceAgents[i].commissionValue,
                finalValue: invoiceDetail.invoiceAgents[i].finalValue,
                name: ag.agentBasicDetails?.name,
                code: ag.agentBasicDetails?.code,
                contactNo: ag.agentBasicDetails?.contactNos[0].contactNo
              })
            })
            obj['agentsList'] = agntList

            const sd = new Date(res.quotation['policyStartDate'])
            const ed = new Date(res.quotation['policyEndDate'])
            populatePolicyDates(sd, ed, obj)
          })
        }
      })
  }
  console.log("qwertyuio", policyDetails)
  const handleFieldChecked = (e: any, j: number) => {
    const { name, checked } = e.target
    const p = { ...policyDetails }

    p.taxList[j][name] = checked
    setPolicyDetails(p)

    // setTaxList(list);
    calculateTax(p.taxList, policyDetails.totalAmountWithoutTax)
  }

  const openConfirmationModal = () => {
    setConfirmModal(true)
  }

  const closeConfirmationModal = (val: string) => {
    if (val === 'yes') {
      setDisableClientData(false)
    }

    setConfirmModal(false)
  }

  const handlePlanChange = (e: any, value: any) => {
    const p = { ...policyDetails }

    p['planData'] = value
    p['plan'] = value.id

    setPolicyDetails(p)
  }

  const handleSubmit = async () => {
    const pload: any = {
      clientId: query.get('clientid'),
      policyStartDate: new Date(policyDetails.policyStartDate).getTime(),
      policyEndDate: new Date(policyDetails.policyEndDate).getTime(),
      tpa: formik.values.tpa
    }
    console.log("qwertyui", pload)
    if (query.get('invid')) {
      pload['sourceId'] = query.get('invid')
      pload['sourceType'] = 'INVOICE'
    } else if (query.get('recid')) {
      pload['sourceId'] = query.get('recid')
      pload['sourceType'] = 'RECEIPT'
    }

    try {
      if (policyDetails && policyDetails.renewalPolicyId != null) {
        pload['policyOrigin'] = 'RENEW'

        // pload['previousPolicyNumber'] = policyDetails.policyNumber;
        const values: any = await firstValueFrom(policyService.getPolicyDetails(policyDetails.renewalPolicyId))
        const anniversary = Number(values.anniversary) + 1

        pload['previousPolicyNumber'] = values.policyNumber
        pload['anniversary'] = anniversary.toString()
      } else {
        pload['policyOrigin'] = 'NEW'
      }

      if (query.get('mode') === 'create') {
        const proposerID = localStorage.getItem('proposerid')
        const response = await firstValueFrom(policyService.savePolicy(pload))

        localStorage.removeItem('proposerid')
        router.push(`/policies?mode=viewList`)
      } else if (query.get('mode') === 'edit') {
        if (id) {
          const response = await firstValueFrom(policyService.editPolicy(pload, id, '3'))

          localStorage.removeItem('proposerid')
          router.push(`/policies?mode=viewList`)
        }
      }
    } catch (error) {
      console.error('Error occurred while handling submit:', error)
    }
  }

  const handleOpenAgentModal = () => {
    setSelectedAgentsList(policyDetails.agentsList)

    //setSelectedIndex(i)
    setOpenAgentModal(true)
  }

  const handleCloseAgentModal = () => {
    setOpenAgentModal(false)

    //setSelectedIndex('');
  }

  const handleAgentModalSubmit = (selectedAgents: any) => {
    const p = { ...policyDetails }

    p.agentsList = selectedAgents
    setPolicyDetails(p)
    setOpenAgentModal(false)
  }

  const handleDateChange = (date: any) => {
    const p = { ...policyDetails }

    const timestamp = new Date(date).getTime()

    // formik.setFieldValue('renewalDateVal', timestamp);
    // formik.setFieldValue('renewalDate', date);
    p['renewalDateVal'] = timestamp
    p['renewalDate'] = date
    setPolicyDetails(p)
  }

  const handleRenualDateChange = (date: any) => { }

  const changeCommision = (e: any, j: number) => {
    const { name, value } = e.target
    const p = { ...policyDetails }

    p.agentsList[j][name] = value
    setPolicyDetails(p)
    calculateFinalValue(p, j)
  }

  const calculateFinalValue = (changedPolicyDetails: any, j: number) => {
    //
    changedPolicyDetails.agentsList[j]['finalValue'] =
      (Number(changedPolicyDetails.agentsList[j]['commissionValue']) *
        Number(changedPolicyDetails.totalAmountWithoutTax)) /
      100
    setPolicyDetails(changedPolicyDetails)
  }

  const calculateAgentValues = (totalAmountWithoutTax: any) => {
    const p = { ...policyDetails }

    p.agentsList.forEach((ag: any) => {
      ag.finalValue = (Number(ag['commissionValue']) * Number(totalAmountWithoutTax)) / 100
    })
    setPolicyDetails(p)
  }

  // const calculateAgentValues = totalAmountWithoutTax => {
  //   const list = [...agentsList];
  //   list.forEach((ele:any)=> {
  //     ele['finalValue'] = (Number(ele.commissionValue) * Number(totalAmountWithoutTax)) / 100;
  //   });
  //   setAgentsList(list);
  // };

  const handleClose = (e: any) => {
    props.handleClose(e)
  }

  const handlePChange = (e: any, value: any) => {
    setPolicyDetails({
      ...clientDetail,
      pOrgData: value,
      parentclientId: value.id
    })
  }

  const handlePremiumChange = (e: any) => {
    const { name, value } = e.target

    const p = { ...policyDetails }

    p[name] = value
    setPolicyDetails(p)

    const lv = policyDetails.loadingValue
    const dv = policyDetails.discountValue

    calculateTotalAmoutWithoutTax(lv, dv, value)
  }

  const handleLoadingChange = (e: any) => {
    const { name, value } = e.target
    const p = { ...policyDetails }

    p['loadingValue'] = value
    setPolicyDetails(p)

    // formik.setFieldValue('loadingValue', value);

    // let lv = formik.values.loadingValue;
    const dv = policyDetails.discountValue
    const tpa = policyDetails.basePremium

    calculateTotalAmoutWithoutTax(value, dv, tpa)
  }

  const handleDiscountChange = (e: any) => {
    const { name, value } = e.target
    const p = { ...policyDetails }

    p['discountValue'] = value
    setPolicyDetails(p)

    const lv = policyDetails.loadingValue

    // let dv = formik.values.discountValue;
    const tpa = policyDetails.basePremium

    calculateTotalAmoutWithoutTax(lv, value, tpa)
  }

  const calculateTotalAmoutWithoutTax = (loadingVal: any, discountVal: any, premiumTotal: any) => {
    const la = (Number(loadingVal) / 100) * Number(premiumTotal)
    const da = (Number(discountVal) / 100) * Number(premiumTotal)

    const p = { ...policyDetails }

    p['discountAmount'] = da
    p['loadingAmount'] = la

    // formik.setFieldValue('discountAmount', da);
    // formik.setFieldValue('loadingAmount', la);

    const at = Number(premiumTotal) + la - da

    // formik.setFieldValue('totalAmountWithoutTax', at);
    p['totalAmountWithoutTax'] = at

    setPolicyDetails(p)
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

    // formik.setFieldValue('totalAmountWithTax', grandTotal);
    // formik.setFieldValue('totalTaxAmount', tt);

    const p = { ...policyDetails }

    p['totalAmountWithTax'] = grandTotal
    p['totalTaxAmount'] = tt
    setPolicyDetails(p)
  }

  const handleSnackClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    setOpenRequired(false)
  }

  const handleIDErrorClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    setIdErrorMsg(false)
  }

  const handleContactCheckClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    setCheckContact(false)
  }

  const handleAddPolicyDetails = () => {
    taxservice.getTaxes(reqParam).subscribe((result: any) => {
      if (result.content && result.content.length > 0) {
        result.content.forEach((ele: any) => {
          ele['checked'] = false
          ele['taxVal'] = 0
        })

        result.content.sort((a: { sortOrder: number }, b: { sortOrder: number }) => {
          return a.sortOrder - b.sortOrder
        })
      }

      setPolicyDetails([
        ...policyDetails,
        {
          tpa: '',
          policyNumber: '',
          plan: '',
          planData: '',
          basePremium: 0,
          loadingType: 'PERCENTAGE',
          loadingAmount: 0,
          loadingValue: 0,
          discountType: 'PERCENTAGE',
          discountAmount: 0,
          discountValue: 0,
          totalAmountWithoutTax: 0,
          totalAmountWithTax: 0,
          totalTaxAmount: 0,
          renewalDate: new Date(),
          renewalDateVal: '',
          invNo: '',
          agentsList: [],
          taxList: result.content
        }
      ])
    })
  }

  const handleChangePolicyDetails = (e: any, i: number) => {
    const { name, value } = e.target
    const p = { ...policyDetails }

    p[name] = value
    setPolicyDetails(p)
  }

  return (
    <form onSubmit={formik.handleSubmit} noValidate>
      <Paper elevation={0}>
        <Box p={3} my={2}>
          <Snackbar open={openRequired} autoHideDuration={6000} onClose={handleSnackClose}>
            <Alert onClose={handleSnackClose} severity='error'>
              Please fill up all required fields marked with *
            </Alert>
          </Snackbar>
          <Snackbar open={checkContact} autoHideDuration={6000} onClose={handleContactCheckClose}>
            <Alert onClose={handleContactCheckClose} severity='error'>
              Please enter valid contact number/Email id
            </Alert>
          </Snackbar>
          <Snackbar open={idErrorMsg} autoHideDuration={6000} onClose={handleIDErrorClose}>
            <Alert onClose={handleIDErrorClose} severity='error'>
              Please provide both Identification Type and Identification Number.
            </Alert>
          </Snackbar>
          {/* <form onSubmit={handleSubmit}> */}
          {
            <>
              <Grid container spacing={3} style={{ marginBottom: '20px' }}>
                <Grid item xs={4}>
                  <FormControl
                    className={classes.formControl}
                    required
                    error={formik.touched.tpa && Boolean(formik.errors.tpa)}
                  >
                    <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                      TPA
                    </InputLabel>
                    <Select
                      labelId='demo-simple-select-label'
                      label='TPA'
                      id='demo-simple-select'
                      name='tpa'
                      // disabled={disableOptions}
                      value={formik.values.tpa}
                      onChange={formik.handleChange}
                    >
                      {tpaList.map((ele: any) => {
                        return (
                          <MenuItem key={ele.code} value={ele.code}>
                            {ele.name}
                          </MenuItem>
                        )
                      })}
                    </Select>
                    {formik.touched.tpa && Boolean(formik.errors.tpa) && (
                      <FormHelperText>{formik.touched.tpa && formik.errors.tpa}</FormHelperText>
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
                      autoOk={true}
                      id="date-picker-inline"
                      label="Policy Start Date"
                      value={policyStartDate}
                      disabled={true}
                      //onChange={handleStartDateChange}
                      KeyboardButtonProps={{
                        'aria-label': 'change ing date',
                      }}
                    />
                  </MuiPickersUtilsProvider> */}
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      views={['year', 'month', 'day']}
                      label='Policy Start Date'
                      value={policyStartDate}
                      disabled={true}
                      onChange={handleStartDateChange}
                      renderInput={params => (
                        <TextField {...params} margin='normal' style={{ marginBottom: '0px' }} variant='outlined' />
                      )}
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
                      autoOk={true}
                      id="date-picker-inline"
                      label="Policy End Date"
                      value={policyEndDate}
                      onChange={handleEndDateChange}
                      disabled={true}
                      KeyboardButtonProps={{
                        'aria-label': 'change ing date',
                      }}
                    />
                  </MuiPickersUtilsProvider> */}
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      views={['year', 'month', 'day']}
                      label='Policy End Date'
                      value={policyEndDate}
                      onChange={handleEndDateChange}
                      disabled={true}
                      renderInput={params => (
                        <TextField {...params} margin='normal' style={{ marginBottom: '0px' }} variant='outlined' />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>
                {query.get('refid') ? (
                  <Grid item xs={4}>
                    <TextField
                      size='small'
                      id='standard-basic'
                      name='referenceNo'
                      disabled={true}
                      value={query.get('refid')}
                      label='Reference Number'
                      InputProps={{
                        classes: {
                          root: classes.inputRoot,
                          disabled: classes.disabled
                        }
                      }}
                    />
                  </Grid>
                ) : (
                  <Grid item xs={4}>
                    <TextField
                      size='small'
                      id='standard-basic'
                      name='invoiceNumber'
                      disabled={true}
                      value={policyDetails.invNo}
                      label='Invoice Number'
                      InputProps={{
                        classes: {
                          root: classes.inputRoot,
                          disabled: classes.disabled
                        }
                      }}
                    />
                  </Grid>
                )}

                <Grid item xs={4}>
                  <TextField
                    size='small'
                    id='standard-basic'
                    name='policyNumber'
                    disabled={true}
                    value={policyDetails.policyNumber}
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
                  {/* <TextField size="small"
                                id="standard-basic"
                                name="plan"
                                disabled={true}
                                value={formik.values.plan}
                                onChange={formik.handleChange}
                                label="Plan"
                                InputProps={{
                                    classes: {
                                        root: classes.inputRoot,
                                        disabled: classes.disabled
                                    }
                                }}
                            /> */}
                  <Autocomplete
                    id='combo-box-demo'
                    options={planList}
                    getOptionLabel={option => option.name ?? ''}
                    value={policyDetails.planData ?? ''}
                    style={{ width: '50%' }}
                    disabled={disableOptions}
                    renderInput={params => <TextField {...params} label='Plan' />}
                    onChange={(e, value) => handlePlanChange(e, value)}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    size='small'
                    id='standard-basic'
                    name='basePremium'
                    type='number'
                    disabled={disableOptions}
                    value={policyDetails.basePremium}
                    onChange={e => handlePremiumChange(e)}
                    label='Base Premium'
                    InputProps={{
                      classes: {
                        root: classes.inputRoot,
                        disabled: classes.disabled
                      }
                    }}
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
                      disabled={disableOptions}
                      readOnly={true}
                      label="Renewal Date"
                      value={policyDetails.renewalDate}
                      //onChange={(date) => handleDateChange(date)}
                      KeyboardButtonProps={{
                        'aria-label': 'change date',
                      }}
                    />
                  </MuiPickersUtilsProvider> */}
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      views={['year', 'month', 'day']}
                      disabled={disableOptions}
                      readOnly={true}
                      label='Renewal Date'
                      // value={policyDetails.renewalDate}
                      value={renewalDate}
                      onChange={date => handleRenualDateChange(date)}
                      renderInput={params => (
                        <TextField {...params} margin='normal' style={{ marginBottom: '0px' }} variant='outlined' />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid>
              <Grid container spacing={3} style={{ marginBottom: '20px' }}></Grid>
              <Grid container spacing={3} style={{ marginBottom: '20px' }}>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                {/* <Grid item xs={12}>
                  <table style={{ width: '100%' }}>
                    <tr style={{ display: 'flex', flexDirection: 'row' }}>
                      <Grid item xs={4}>
                        <th />
                      </Grid>
                    </tr>
                    <tr style={{ display: 'flex', flexDirection: 'row' }}>
                      <Grid style={{ display: 'flex', alignItems: 'center' }} item xs={3}>
                        <td>Discount</td>
                      </Grid>

                      <Grid item xs={6}>
                        <td>
                          <TextField
                            size='small'
                            type='number'
                            id='standard-basic'
                            name='discountValue'
                            value={policyDetails.discountValue}
                            disabled={disableOptions}
                            onChange={e => handleDiscountChange(e)}
                            InputProps={{
                              classes: {
                                root: classes.inputRoot,
                                disabled: classes.disabled
                              }
                            }}
                            label='discount percentage (%)'
                          />
                        </td>
                      </Grid>
                      <Grid item xs={3} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <td>{policyDetails.discountAmount?.toFixed(2)}</td>
                      </Grid>
                    </tr>
                    <tr style={{ display: 'flex', flexDirection: 'row' }}>
                      <Grid style={{ display: 'flex', alignItems: 'center' }} item xs={3}>
                        <td>Loading</td>
                      </Grid>
                      <Grid item xs={6}>
                        <td>
                          <TextField
                            size='small'
                            type='number'
                            id='standard-basic'
                            name='loadingValue'
                            value={policyDetails.loadingValue}
                            disabled={disableOptions}
                            onChange={e => handleLoadingChange(e)}
                            InputProps={{
                              classes: {
                                root: classes.inputRoot,
                                disabled: classes.disabled
                              }
                            }}
                            label='loading percentage (%)'
                          />
                        </td>
                      </Grid>
                      <Grid item xs={3} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <td>{policyDetails.loadingAmount?.toFixed(2)}</td>
                      </Grid>
                    </tr>
                  </table>
                </Grid> */}
                <Grid container spacing={5} sx={{ padding: '20px' }}>
                  <Grid container item xs={12} alignItems="center">
                    <Grid item xs={3}>Discount</Grid>
                    <Grid item xs={6}>
                      <TextField
                        size='small'
                        type='number'
                        id='standard-basic'
                        name='discountValue'
                        value={policyDetails.discountValue}
                        disabled={disableOptions}
                        onChange={e => handleDiscountChange(e)}
                        InputProps={{
                          classes: {
                            root: classes.inputRoot,
                            disabled: classes.disabled
                          }
                        }}
                        label='discount percentage (%)'
                      />
                    </Grid>
                    <Grid item xs={3} style={{ textAlign: 'right' }}>
                      {policyDetails.discountAmount?.toFixed(2)}
                    </Grid>
                  </Grid>

                  <Grid container item xs={12} alignItems="center">
                    <Grid item xs={3}>Loading</Grid>
                    <Grid item xs={6}>
                      <TextField
                        size='small'
                        type='number'
                        id='standard-basic'
                        name='loadingValue'
                        value={policyDetails.loadingValue}
                        disabled={disableOptions}
                        onChange={e => handleLoadingChange(e)}
                        InputProps={{
                          classes: {
                            root: classes.inputRoot,
                            disabled: classes.disabled
                          }
                        }}
                        label='loading percentage (%)'
                      />
                    </Grid>
                    <Grid item xs={3} style={{ textAlign: 'right' }}>
                      {policyDetails.loadingAmount?.toFixed(2)}
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <Divider />
                </Grid>
              </Grid>
              <Grid container spacing={3} style={{ marginBottom: '20px' }}>
                <Grid item xs={6}>
                  <FormGroup row>
                    {policyDetails.taxList?.map((row: any, j: any) => (
                      <FormControlLabel
                        key={j}
                        control={
                          <Checkbox
                            checked={row.checked}
                            onChange={e => handleFieldChecked(e, j)}
                            name='checked'
                            color='primary'
                            disabled={disableOptions}

                          // InputProps={{
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
                    Total After discount and loading :{policyDetails.totalAmountWithoutTax?.toFixed(2)}
                  </span>
                </Grid>
              </Grid>
              <Grid container spacing={3} style={{ marginBottom: '20px' }}>
                <Grid item xs={12} style={{ marginTop: '10px' }}>
                  <TableContainer component={Paper}>
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
                        {policyDetails.taxList?.map((row: any, i: any) => {
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
                  <span style={{ fontWeight: 'bold' }}>
                    Grand Total :{policyDetails.totalAmountWithTax?.toFixed(2)}
                  </span>
                </Grid>
              </Grid>
              <Grid container spacing={3} style={{ marginBottom: '20px' }}>
                <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  {/* {query2.get("mode") !== 'view' ? <Button variant="contained" color="primary" onClick={handleOpenAgentModal}>
                                        Search Agent
                                     </Button> : null} */}
                  {/* {!disableOptions && (
                    <Button  color="primary" onClick={() => handleOpenAgentModal()}>
                      Search Agent
                    </Button>
                  )} */}

                  <ProposerAgentModal
                    agentsList={selectedAgentsList}
                    handleCloseAgentModal={handleCloseAgentModal}
                    openAgentModal={openAgentModal}
                    setAgentsList={setAgentsList}
                    handleAgentModalSubmit={handleAgentModalSubmit}
                  />
                </Grid>

                <Grid item xs={12} style={{ marginTop: '10px' }}>
                  <TableContainer component={Paper}>
                    <Table size='small' aria-label='a dense table'>
                      <TableHead>
                        <TableRow>
                          <TableCell>Agent name</TableCell>
                          <TableCell>Commission value</TableCell>
                          <TableCell align='right'>Final value</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {agentsList?.map((row: any, j: any) => (
                          <TableRow key={row.agentId}>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>
                              <TextField
                                size='small'
                                type='number'
                                id='standard-basic'
                                name='commissionValue'
                                value={row.commissionValue}
                                disabled={disableOptions}
                                onChange={(e: any) => {
                                  changeCommision(e, j)
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
            </>
          }

          <Grid container spacing={3} style={{ marginBottom: '20px' }}>
            <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
              {/* {!disableClientData && */}

              <Button color='primary' style={{ marginRight: '5px' }} type='submit'>
                Save and Finish
              </Button>
              {/* } */}
              {/* {disableClientData &&
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={openConfirmationModal}
                            >
                                Edit Details
                            </Button>} */}
            </Grid>
            <Grid item xs={12}>
              <EditConfirmationModal confirmModal={confirmModal} closeConfirmationModal={closeConfirmationModal} />
            </Grid>
          </Grid>
          {/* </form> */}
        </Box>
      </Paper>
    </form>
  )
}
