import * as React from 'react'
import { useEffect } from 'react'

import { useParams, useRouter, useSearchParams } from 'next/navigation'

import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Box from '@mui/material/Box'

// import { Button } from 'primereact/button';
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
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
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import type { AlertProps } from '@mui/lab/Alert'
import MuiAlert from '@mui/lab/Alert'

// import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import 'date-fns'
import { useFormik } from 'formik'

import * as yup from 'yup'

import { Button } from '@mui/material'

import { BankService } from '@/services/remote-api/api/banks-services'
import { ClientService, ProspectService } from '@/services/remote-api/api/client-services'
import {
  AddressService,
  CurrencyService,
  DenominationService,
  TransactionModeService
} from '@/services/remote-api/api/master-services'
import { ReceiptService } from '@/services/remote-api/api/receipts-services'
import { InvoiceService } from '@/services/remote-api/fettle-remote-api'

import Asterisk from '../../shared-component/components/red-asterisk'
import type { Client } from '@/services/remote-api/models/client'
import { defaultPageRequest } from '@/services/remote-api/models/page.request'

const clientservice = new ClientService()
const prospectservice = new ProspectService()
const receiptservice = new ReceiptService()
const addressservice = new AddressService()
const bankservice = new BankService()
const currencyservice = new CurrencyService()
const tranService = new TransactionModeService()
const denoService = new DenominationService()
const invoiceservice = new InvoiceService()
const pageRequest: any = { pageRequest: defaultPageRequest }
const addr$ = addressservice.getAddressConfig()
const bnk$ = bankservice.getBanks(pageRequest)
const cs$ = currencyservice.getCurrencies()
const ts$ = tranService.getTransactionModes()
const ds$ = denoService.getDenominations(pageRequest)

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

function Alert(props: React.JSX.IntrinsicAttributes & AlertProps) {
  return <MuiAlert elevation={6} variant='filled' {...props} />
}

export default function ReceiptDetails(props: any) {
  const query2 = useSearchParams()
  const params = useParams()
  const id: any = params.id
  const history = useRouter()
  const classes = useStyles()
  const [openClientModal, setOpenClientModal] = React.useState(false)
  const [bankList, setBankList] = React.useState([])
  const [currencyList, setCurrencyList] = React.useState([])
  const [transactionModeList, setTransactionModeList] = React.useState([])
  const [selectedTransactionMode, setSelectedTransactionMode]: any = React.useState([])
  const [openSnack, setOpenSnack] = React.useState(false)
  const [openSnack1, setOpenSnack1] = React.useState(false)
  const [openSnack2, setOpenSnack2] = React.useState(false)
  const [expandClientDetails, setExpandClientDetails] = React.useState(false)
  const [expandTransactionDetails, setExapandTransactionDetails] = React.useState(false)
  const [denominations, setDenomination] = React.useState([])
  const [openSuccessSnack, setOpenSuccessSnack] = React.useState(false)
  const [openErrorSnack, setOpenErrorSnack] = React.useState(false)
  const [snackMessage, setSnackMessage] = React.useState('')

  const validationSchema = yup.object({
    depositBank: yup.string().required('Bank is required'),
    depositAccountNo: yup.string().required('Account No. is required'),
    fundAmount: yup.string().required('Fund amount is required'),
    premiumAmount: yup.string().when([], {
      is: () => query2.get('type') !== 'fund',
      then: schema => schema.required('Premium amount is required'),
      otherwise: schema => schema.notRequired()
    })
  })

  const [transactionList, setTransactionList]: any = React.useState([
    {
      transactionMode: '',
      transactionModeName: '',
      transactionAmount: 0,
      transactionCurrency: '',
      exchangeRate: 0,
      exchangeAmount: 0,
      denominations: null,
      chequeDetails: null,
      mpesaDetail: null,
      eftDetail: null,
      demandDraftDetail: null,
      creditCardDetail: null
    }
  ])

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

  const handleInvoiceDate = (date: any) => {
    setSelectedDate(date)

    const timestamp = new Date(date).getTime()

    formik.setFieldValue('receiptDate', timestamp)
  }

  const handleChequeDate = (date: any, i: number) => {
    // const { name, value } = e.target;
    const list: any = [...transactionList]

    list[i].chequeDetails['chequeDateVal'] = date
    list[i].chequeDetails['chequeDate'] = new Date(date).getTime()

    setTransactionList(list)
  }

  const handleCheque = (e: any, i: number) => {
    const { name, value } = e.target
    const list: any = [...transactionList]

    list[i].chequeDetails[name] = value

    setTransactionList(list)
  }

  const handleDraftDate = (date: string | number | Date, i: number) => {
    // const { name, value } = e.target;
    const list: any = [...transactionList]

    list[i].demandDraftDetail['draftDateVal'] = date
    list[i].demandDraftDetail['demandDraftDate'] = new Date(date).getTime()

    setTransactionList(list)
  }

  const handleDraft = (e: any, i: number) => {
    const { name, value } = e.target;
    const list: any = [...transactionList];

    // Ensure demandDraftDetail is initialized
    if (!list[i].demandDraftDetail) {
      list[i].demandDraftDetail = {};
    }

    list[i].demandDraftDetail[name] = value;
    setTransactionList(list);
  };

  const handleCardDetails = (e: any, i: number) => {
    const { name, value } = e.target
    const list: any = [...transactionList]

    list[i].creditCardDetail[name] = value

    setTransactionList(list)
  }

  const handleDebitCardDetails = (e: any, i: number) => {
    const { name, value } = e.target
    const list: any = [...transactionList]

    list[i].debitCardDetail[name] = value

    setTransactionList(list)
  }

  const handleTransactionDate = (date: any, i: number) => {
    // const { name, value } = e.target;
    const list: any = [...transactionList]

    list[i].creditCardDetail['cardTransactionDateVal'] = date
    list[i].creditCardDetail['transactionDate'] = new Date(date).getTime()

    setTransactionList(list)
  }

  const handleDebitTransactionDate = (date: any, i: number) => {
    // const { name, value } = e.target;
    const list: any = [...transactionList]

    list[i].debitCardDetail['cardTransactionDateVal'] = date
    list[i].debitCardDetail['transactionDate'] = new Date(date).getTime()

    setTransactionList(list)
  }

  const handleExpireDate = (date: any, i: number) => {
    // const { name, value } = e.target;
    const list: any = [...transactionList]

    list[i].creditCardDetail['cardExpireDateVal'] = date
    list[i].creditCardDetail['expireDate'] = new Date(date).getTime()

    setTransactionList(list)
  }

  const handleDebitExpireDate = (date: any, i: number) => {
    // const { name, value } = e.target;
    const list: any = [...transactionList]

    list[i].debitCardDetail['cardExpireDateVal'] = date
    list[i].debitCardDetail['expireDate'] = new Date(date).getTime()

    setTransactionList(list)
  }

  const handleMPESADate = (date: any, i: number) => {
    // const { name, value } = e.target;
    const list: any = [...transactionList]

    list[i].mpesaDetail['mpesaDateVal'] = date
    list[i].mpesaDetail['mpsaDate'] = new Date(date).getTime()

    setTransactionList(list)
  }

  const handleMPESA = (e: any, i: number) => {
    const { name, value } = e.target;
    const list: any = [...transactionList];

    // Ensure mpesaDetail is initialized
    if (!list[i].mpesaDetail) {
      list[i].mpesaDetail = {};
    }
    list[i].mpesaDetail[name] = value;
    console.log("asdf", list)
    setTransactionList(list);
  };

  const handleEFTDate = (date: any, i: number) => {
    // const { name, value } = e.target;
    const list: any = [...transactionList]

    list[i].eftDetail['eftDateVal'] = date
    list[i].eftDetail['eftDate'] = new Date(date).getTime()

    setTransactionList(list)
  }

  const handleEFT = (e: any, i: number) => {
    const { name, value } = e.target
    const list: any = [...transactionList]

    list[i].eftDetail[name] = value
    setTransactionList(list)
  }

  const handleDenominationAmount = (e: any, i: any, j: any) => {
    const { name, value } = e.target
    const list: any = [...transactionList]

    list[i].denominations[j][name] = Number(value)

    setTransactionList(list)
  }

  // Transaction List functions
  const handleInputChangeTransaction = (e: any, index: number) => {
    const { name, value } = e.target
    const list: any = [...transactionList]

    list[index][name] = value

    if (name === 'transactionAmount' || name === 'exchangeRate') {
      list[index]['exchangeAmount'] = Number(list[index]['transactionAmount']) * Number(list[index]['exchangeRate'])
    }

    setTransactionList(list)
    // setInvoiceDetailsList(list)
  }

  const handleTransactionModeChange = (e: any, index: number) => {
    const { name, value } = e.target
    const list: any = [...transactionList]
    const list2: any = [...selectedTransactionMode]

    if (list2.indexOf(value) === -1) {
      //Not in the array, the value is pushed to the index assigned for that transaction row, so that if he changes again, it will overwrite the value in that position
      list2[index] = value
      setSelectedTransactionMode(list2)
    } else {
      //In the array!
    }

    list[index][name] = value

    /**
     * Get the Transaction Mode name
     */
    const selectedMode: any = transactionModeList.filter((tm: any) => tm.code === value)

    if (selectedMode.length > 0) {
      list[index]['transactionModeName'] = selectedMode[0].name
    }

    // cash
    if (list[index]['transactionModeName'].toLowerCase() === 'cash') {
      const arr: any = []

      denominations.forEach(ele => {
        arr.push(ele)
      })

      list[index]['denominations'] = arr
      list[index]['chequeDetails'] = null
      list[index]['mpesaDetail'] = null
      list[index]['eftDetail'] = null
      list[index]['creditCardDetail'] = null
      list[index]['demandDraftDetail'] = null
    }

    //cheque
    if (list[index]['transactionModeName'].toLowerCase() === 'cheque') {
      list[index]['chequeDetails'] = {
        chequeNo: '',
        chequeDateVal: new Date(),
        chequeDate: new Date().getTime(),
        bankName: '',
        otherBankName: '',
        branch: ''
      }
      list[index]['denominations'] = null
      list[index]['mpesaDetail'] = null
      list[index]['eftDetail'] = null
      list[index]['creditCardDetail'] = null
      list[index]['demandDraftDetail'] = null
    }

    //MPESA
    if (list[index]['transactionModeName'].toLowerCase() === 'mpesa') {
      list[index]['mpesaDetail'] = {
        mpsaNo: '',
        mpesaDateVal: new Date(),
        mpsaDate: new Date().getTime()
      }
      list[index]['denominations'] = null
      list[index]['chequeDetails'] = null
      list[index]['eftDetail'] = null
      list[index]['creditCardDetail'] = null
      list[index]['demandDraftDetail'] = null
    }

    //EFT
    if (list[index]['transactionModeName'].toLowerCase() === 'eft') {
      list[index]['eftDetail'] = {
        eftNo: '',
        eftDateVal: new Date(),
        eftDate: new Date().getTime(),
        bankName: '',
        otherBankName: ''
      }
      list[index]['denominations'] = null
      list[index]['chequeDetails'] = null
      list[index]['mpesaDetail'] = null
      list[index]['demandDraftDetail'] = null
      list[index]['creditCardDetail'] = null
    }

    //DD
    if (list[index]['transactionModeName'].toLowerCase() === 'dd') {
      list[index]['demandDraftDetail'] = {
        demandDraftNo: '',
        draftDateVal: new Date(),
        demandDraftDate: new Date().getTime(),
        bankName: '',
        otherBankName: '',
        branch: ''
      }
      list[index]['denominations'] = null
      list[index]['chequeDetails'] = null
      list[index]['mpesaDetail'] = null
      list[index]['eftDetail'] = null
      list[index]['creditCardDetail'] = null
    }

    //CREDIT CARD
    if (list[index]['transactionModeName'].toLowerCase() === 'credit card') {
      list[index]['creditCardDetail'] = {
        cardNumber: '',
        cardTransactionDateVal: new Date(),
        transactionDate: new Date().getTime(),
        cardExpireDateVal: new Date(),
        expireDate: new Date().getTime(),
        bankName: '',
        otherBankName: '',
        branch: '',
        cardType: ''
      }
      list[index]['denominations'] = null
      list[index]['chequeDetails'] = null
      list[index]['mpesaDetail'] = null
      list[index]['eftDetail'] = null
      list[index]['demandDraftDetail'] = null
    }

    //DEBIT CARD
    if (list[index]['transactionModeName'].toLowerCase() === 'debit card') {
      list[index]['debitCardDetail'] = {
        cardNumber: '',
        cardTransactionDateVal: new Date(),
        transactionDate: new Date().getTime(),
        cardExpireDateVal: new Date(),
        expireDate: new Date().getTime(),
        bankName: '',
        otherBankName: '',
        branch: '',
        cardType: ''
      }
      list[index]['denominations'] = null
      list[index]['chequeDetails'] = null
      list[index]['mpesaDetail'] = null
      list[index]['eftDetail'] = null
      list[index]['demandDraftDetail'] = null
    }

    setTransactionList(list)
  }

  const getdisabledStatus = (value: any) => {
    if (selectedTransactionMode.indexOf(value) > -1) {
      return true
    } else {
      return false
    }
  }

  const handleRemoveClickTransaction = (index: number) => {
    const list: any = [...transactionList]
    const list2 = [...selectedTransactionMode]

    list.splice(index, 1)
    list2.splice(index, 1)
    setSelectedTransactionMode(list2)
    setTransactionList(list)
  }

  const handleAddClickTransaction = () => {
    setTransactionList([
      ...transactionList,
      {
        transactionMode: '',
        transactionAmount: 0,
        transactionCurrency: '',
        exchangeRate: 0,
        exchangeAmount: 0,
        denominations: null,
        chequeDetails: null,
        mpesaDetail: null,
        eftDetail: null,
        demandDraftDetail: null,
        creditCardDetail: null
      }
    ])
  }

  // Transaction List functions

  const formik = useFormik({
    initialValues: {
      receiptDate: new Date().getTime(),
      receiptType: 'receiptWithInvoice',
      clientOrProspectId: '',
      clientOrProspectType: '',
      type: '',
      premiumAmount: 0,
      fundAmount: 0,
      depositAccountNo: '',
      depositBank: '',
      invoiceNo: ''
    },
    validationSchema: validationSchema,
    onSubmit: values => {
      handleSubmit()
    }
  })

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
        const tableArr: any = []

        if (result.content && result.content.length > 0) {
          result.content.forEach((ele: any) => {
            tableArr.push({
              name: ele.bankBasicDetails.bankName,
              id: ele.id
            })
          })
        }

        setter(tableArr)
      })

      return () => subscription.unsubscribe()
    }, [observable, setter])
  }

  const useObservable3 = (observable: any, setter: any) => {
    useEffect(() => {
      const subscription = observable.subscribe((result: any) => {
        const tableArr: any = []

        if (result.content && result.content.length > 0) {
          result.content.forEach((ele: any) => {
            if (ele.flag) {
              tableArr.push({
                currencyValue: Number(ele.currencyValue),
                id: ele.id,
                noOfCurrency: ''
              })
            }
          })
        }

        setter(tableArr)
      })

      return () => subscription.unsubscribe()
    }, [observable, setter])
  }

  useObservable3(ds$, setDenomination)
  useObservable2(bnk$, setBankList)
  useObservable(cs$, setCurrencyList)
  useObservable(ts$, setTransactionModeList)

  useEffect(() => {
    const subscription = addr$.subscribe(result => {
      if (result && result.length !== 0) {
        result.forEach((prop: { addressConfigurationFieldMappings: any[] }, i: any) => {
          prop.addressConfigurationFieldMappings.forEach((field, j) => {
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

        result.forEach((prop: { addressConfigurationFieldMappings: any[] }, i: number) => {
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

  const fetchInvoiceDetails = () => {
    const payload = {
      invoiceNumber: formik.values.invoiceNo
    }
    if (query2.get('type') == 'fund') {
      invoiceservice.getFundInvoice(payload).subscribe(res => {
        if (res.content.length) {
          const inv = res.content[0]

          formik.setFieldValue('fundAmount', inv?.totalInvoiceAmount)

          if (inv.clientOrProspectId) {
            clientservice.getClientDetails(inv?.clientOrProspectId).subscribe((client: any) => {
              if (client) {
                setClientData({
                  ...setClientData,
                  clientName: client.clientBasicDetails.displayName,
                  clientMobile: client.clientBasicDetails.contactNos[0].contactNo,
                  clientEmail: client.clientBasicDetails.emails[0].emailId,
                  clientId: client.id,
                  clientType: 'Client'
                })
                populateDynamicAddress(client, addressConfig)
                setExpandClientDetails(true);
                setExapandTransactionDetails(true);
              }
            })
          } else {
            setSnackMessage("Client details not found")
            setOpenErrorSnack(true)
          }
        } else {
          setSnackMessage("This invoice either does not exist or a receipt has already been generated.")
          setOpenErrorSnack(true)
        }
      })
    } else {
      invoiceservice.getInvoice(payload).subscribe((res: any) => {
        if (res.content.length) {
          const inv = res.content[0]
          let amount = inv.totalAmountWithTax ? inv.totalAmountWithTax : inv.totalBeforeDiscountAndLoadingAmount ? inv.totalBeforeDiscountAndLoadingAmount : inv.totalAfterDiscountAndLoadingAmount
          // formik.setFieldValue('premiumAmount', inv?.totalAmountWithTax)
          formik.setFieldValue('premiumAmount', amount)

          if (inv.clientOrProspectId) {
            clientservice.getClientDetails(inv?.clientOrProspectId).subscribe((client: any) => {
              if (client) {
                setClientData({
                  ...setClientData,
                  clientName: client.clientBasicDetails.displayName,
                  clientMobile: client.clientBasicDetails.contactNos[0].contactNo,
                  clientEmail: client.clientBasicDetails.emails[0].emailId,
                  clientId: client.id,
                  clientType: 'Client'
                })
                populateDynamicAddress(client, addressConfig)
                setExpandClientDetails(true);
                setExapandTransactionDetails(true);
              }
            })
          } else {
            setSnackMessage("Client details not found")
            setOpenErrorSnack(true)
          }
        } else {
          setSnackMessage("This invoice either does not exist or a receipt has already been generated.")
          setOpenErrorSnack(true)
        }
      })
    }
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
    setOpenClientModal(false)
  }

  const callAPiFunc = (field: any, prop: { dependOnfields: any[] }, resultarr: any[], addrrList: any[]) => {
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
    if (addressConfigList && addressConfigList.length !== 0) {
      const addrrList: any = [...addressConfigList]

      item.clientAddress.addresses.forEach((val: any) => {
        addrrList.forEach((prop: any, i: number) => {
          prop.addressConfigurationFieldMappings.forEach((field: any, j: number) => {
            if (Object.keys(val.addressDetails)[0] === field.fieldName) {
              field['value'] = val.addressDetails[field.fieldName]
            }
          })
        })
      })

      // setAddressConfig(addrrList);

      addrrList.forEach((prop: any, i: any) => {
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
          } else {
            // setAddressConfig(addrrList);
          }
        })
      })

      // setAddressConfig(addrrList);
    }
  }

  const handleSubmit = () => {
    let totalTrans = 0

    transactionList.forEach((ele: any) => {
      ele.transactionAmount = Number(ele.transactionAmount)
      ele.exchangeRate = Number(ele.exchangeRate)
      ele.exchangeAmount = Number(ele.exchangeAmount)
      totalTrans = totalTrans + Number(ele.transactionAmount)

      if (ele.transactionMode === 'TM278553') {
        let deTotal = 0

        ele.denominations.forEach((de: any) => {
          deTotal = deTotal + Number(de.noOfCurrency) * Number(de.currencyValue)
        })

        if (deTotal !== Number(ele.transactionAmount)) {
          setOpenSnack2(true)
          return
        }
      }
    })
    const fp = Number(formik.values.premiumAmount) + Number(formik.values.fundAmount)

    if (query2.get('type') == 'fund') {
      if (formik.values.fundAmount != totalTrans) {
        setOpenSnack1(true)
        return;
      }
    }

    // if (totalTrans !== fp) {
    //   setOpenSnack(true)
    //   return
    // }

    const payload: any = {
      receiptDate: new Date(selectedDate).getTime(),
      receiptType: formik.values.receiptType,
      clientOrProspectId: clientData.clientId,
      clientOrProspectType: clientData.clientType,
      depositAccountNo: formik.values.depositAccountNo,
      depositBank: formik.values.depositBank,
      transactionDetails: transactionList,
      invoiceNo: formik.values.receiptType === 'receiptWithInvoice' ? formik.values.invoiceNo : null,
      subType: query2.get('type') == 'fund' ? "FUND_RECEIPT" : "RECEIPT"
    }

    if (query2.get('type') != 'fund') {
      payload['premiumAmount'] = Number(formik.values.premiumAmount)
    }
    if (query2.get('type') == 'fund') {
      payload['fundAmount'] = Number(formik.values.fundAmount)
    }

    receiptservice.saveReceipt(payload).subscribe({
      next: (res) => {
        setSnackMessage('Receipt saved successfully')
        setOpenSuccessSnack(true)
        setTimeout(() => {
          history.push(`/receipts?mode=viewList`)
        }, 2000)
      },
      error: (error) => {
        // console.log(error?.response?.data?.message);
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to save receipt'
        setSnackMessage(errorMessage)
        setOpenErrorSnack(true)
      }
    })
  }

  React.useEffect(() => {
    if (id) {
      populateData(id)
    }
  }, [id])

  const populateData = (id: string) => {
    setExapandTransactionDetails(true)
    setExpandClientDetails(true)

    if (id) {
      receiptservice.getReceiptDetails(id).subscribe((res: any) => {
        formik.setFieldValue('receiptDate', res.receiptDate)
        formik.setFieldValue('receiptType', res.receiptType)
        formik.setFieldValue('clientOrProspectId', res.clientOrProspectId)
        formik.setFieldValue('clientOrProspectType', res.clientOrProspectType)
        formik.setFieldValue('premiumAmount', res.premiumAmount)
        formik.setFieldValue('fundAmount', res.fundAmount)
        formik.setFieldValue('depositAccountNo', res.depositAccountNo)
        formik.setFieldValue('depositBank', res.depositBank)

        if (res.invoiceNo) {
          formik.setFieldValue('invoiceNo', res.invoiceNo)
        }

        res.transactionDetails.forEach((el: any) => {
          //cheque
          if (el.transactionMode === 'TM686778') {
            el.chequeDetails['chequeDateVal'] = new Date(el.chequeDetails.chequeDate)
          }

          // MPESA
          if (el.transactionMode === 'TM653068') {
            el.mpesaDetail['mpesaDateVal'] = new Date(el.mpesaDetail.mpsaDate)
          }

          //EFT
          if (el.transactionMode === 'TM773795') {
            el.eftDetail['eftDateVal'] = new Date(el.eftDetail.eftDate)
          }

          //DD
          if (el.transactionMode === 'TM227403') {
            el.demandDraftDetail['draftDateVal'] = new Date(el.demandDraftDetail.demandDraftDate)
          }

          // credit card
          if (el.transactionMode === 'TM838619') {
            el.creditCardDetail['cardTransactionDateVal'] = new Date(el.creditCardDetail.transactionDate)
            el.creditCardDetail['cardExpireVal'] = new Date(el.creditCardDetail.expireDate)
          }

          //debit
          if (el.transactionMode === 'TM309835') {
            el.debitCardDetail['cardTransactionDateVal'] = new Date(el.debitCardDetail.transactionDate)
            el.debitCardDetail['cardExpireVal'] = new Date(el.debitCardDetail.expireDate)
          }
        })

        setSelectedDate(new Date(res.receiptDate))
        setTransactionList(res.transactionDetails)
        setRevertedMessage(res.reverted)

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

                result.forEach((prop: { addressConfigurationFieldMappings: any[] }, i: number) => {
                  prop.addressConfigurationFieldMappings.map((field, j) => {
                    //   frmObj[field.fieldName] = field.defaultValue;
                    if (field.dependsOn == '' && field.type == 'dropdown' && field.modifyApiURL) {
                      addressservice.getSourceList(field.modifyApiURL).subscribe((res: any) => {
                        // field.sourceList =res.content;
                        const list: any = [...result]

                        result[i].addressConfigurationFieldMappings[j].sourceList = res.content

                        // frmLst[field.fieldName] = res.content;
                        populateDynamicAddress(cdata, result)
                      })
                    }
                  })
                })

                // setAddressConfig(result);

                // populateDynamicAddress(cdata,result)
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

  const handleClose = () => {
    history.push(`/receipts?mode=viewList`)

    // window.location.reload();
  }

  const handleSnackClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    setOpenSnack(false)
  }

  const handleSnackClose1 = (event: React.SyntheticEvent | Event, reason?: string) => {
    setOpenSnack1(false)
  }

  const handleSnackClose2 = (event: React.SyntheticEvent | Event, reason?: string) => {
    setOpenSnack2(false)
  }

  const handleSuccessSnackClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    setOpenSuccessSnack(false)
  }

  const handleErrorSnackClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    setOpenErrorSnack(false)
  }

  return (
    <form onSubmit={formik.handleSubmit}>
      <Paper elevation={0}>
        <Box p={3} my={2}>
          <Snackbar
            open={openSnack}
            autoHideDuration={6000}
            onClose={handleSnackClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Alert onClose={handleSnackClose} severity='error'>
              Amount mismatch.The total transaction amount and summation of fund Amount and premium amount must be equal
            </Alert>
          </Snackbar>
          <Snackbar
            open={openSnack1}
            autoHideDuration={6000}
            onClose={handleSnackClose1}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Alert onClose={handleSnackClose} severity='error'>
              Amount mismatch.The total transaction amount and fund Amount equal.
            </Alert>
          </Snackbar>
          <Snackbar
            open={openSnack2}
            autoHideDuration={6000}
            onClose={handleSnackClose2}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Alert onClose={handleSnackClose2} severity='error'>
              Amount mismatch.The sum of denominations not matching transaction Amount
            </Alert>
          </Snackbar>
          <Snackbar
            open={openSuccessSnack}
            autoHideDuration={6000}
            onClose={handleSuccessSnackClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Alert onClose={handleSuccessSnackClose} severity='success'>
              {snackMessage}
            </Alert>
          </Snackbar>
          <Snackbar
            open={openErrorSnack}
            autoHideDuration={6000}
            onClose={handleErrorSnackClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Alert onClose={handleErrorSnackClose} severity='error'>
              {snackMessage}
            </Alert>
          </Snackbar>
          <Grid container alignItems='flex-end' spacing={3} style={{ marginBottom: '20px' }}>
            <Grid item xs={12} sm={6} md={4}>
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
                  disabled={query2.get('mode') === 'view' ? true : false}
                  onChange={handleInvoiceDate}
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
            </Grid>
            {/* <Grid item xs={12} sm={6} md={5}>
              <FormControl component="fieldset">
                <RadioGroup
                  row
                  aria-label="position"
                  name="receiptType"
                  value={formik.values.receiptType}
                  onChange={formik.handleChange}
                  defaultValue="top">
                  <FormControlLabel
                    value="receiptWithInvoice"
                    control={<Radio color="primary" />}
                    label="Receipt from invoice"
                    labelPlacement="end"
                   
                  />
                  <FormControlLabel
                    value="receiptWithInvoice"
                    control={<Radio color="primary" />}
                    label="Receipt without invoice"
                    labelPlacement="end"
                    disabled={query2.get('mode') === 'view' ? true : false}

                    // InputProps={{
                    //   classes: {
                    //     root: classes.inputRoot,
                    //     disabled: classes.disabled,
                    //   },
                    // }}
                  />
                </RadioGroup>
              </FormControl>
            </Grid> */}
            {/* <Grid item xs={12} sm={12} md={3} container justifyContent="flex-end" alignItems="flex-end">
              {query2.get('mode') !== 'view' && (
                <Button color="secondary" onClick={handleopenClientModal}>
                  Search Client
                </Button>
              )}

              {query2.get('mode') === 'view' && revertedMessage && (
                <span style={{ color: 'red', fontWeight: 'bold' }}>REVERTED</span>
              )}

              <ReceiptClientModal
                openClientModal={openClientModal}
                handleCloseClientModal={handleCloseClientModal}
                handleSubmitClientModal={handleSubmitClientModal}
              />
            </Grid> */}
          </Grid>
          {formik.values.receiptType === 'receiptWithInvoice' && (
            <Grid container spacing={3} style={{ marginBottom: '20px' }} alignItems='flex-end'>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl className={classes.formControl}>
                  <TextField
                    size='small'
                    id='standard-basic'
                    name='invoiceNo'
                    label='Invoice Number'
                    value={formik.values.invoiceNo}
                    onChange={formik.handleChange}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={8} container justifyContent='flex-end'>
                {query2.get('mode') !== 'view' ? (
                  <Button variant='contained' type='button' color='secondary' onClick={() => {
                    setClientData({
                      clientName: '',
                      clientMobile: '',
                      clientEmail: '',
                      clientId: '',
                      clientType: ''
                    });
                    fetchInvoiceDetails();
                  }}>
                    Search Invoice
                  </Button>
                ) : null}
              </Grid>
            </Grid>
          )}
        </Box>
      </Paper>
      <Paper elevation={0}>
        <Box p={3} my={2}>
          <Accordion expanded={expandClientDetails} elevation={0}>
            <AccordionSummary
              className={classes.AccordionSummary}
              expandIcon={<ExpandMoreIcon />}
              aria-controls='panel1a-content'
              id='panel1a-header'
              onClick={e => setExpandClientDetails(!expandClientDetails)}
            >
              <Typography className={classes.heading}>Client Details</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3} style={{ marginBottom: '20px' }}>
                <Grid item xs={12} sm={6} md={4}>
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
                <Grid item xs={12} sm={6} md={4}>
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

                <Grid item xs={12} sm={6} md={4}>
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
                  <Grid item xs={12} style={{ marginBottom: '20px' }} container>
                    {addressConfig.map((prop: any, i: number) => {
                      return prop.addressConfigurationFieldMappings.length !== 1 ? (
                        <Grid item xs={12} sm={6} md={4} key={i} container>
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
                          {prop.addressConfigurationFieldMappings.map((field: any, j: any) => {
                            return (
                              <Grid key={`reeipt-${j}`} item xs={12} sm={6} md={4}>
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
                                    InputProps={{
                                      readOnly: true
                                    }}
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
                                    InputProps={{
                                      readOnly: true
                                    }}
                                  />
                                )}
                                {field.readOnly && (
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
                                )}
                              </Grid>
                            )
                          })}
                        </Grid>
                      ) : (
                        <Grid item xs={12} sm={6} md={4} key={i + 50}>
                          {prop.addressConfigurationFieldMappings.map((field: any, j: any) => {
                            return (
                              <div key={j + 2}>
                                {field.type === 'dropdown' && !field.readOnly && (
                                  <FormControl className={classes.formControl}>
                                    <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                                      {prop.levelName}
                                    </InputLabel>
                                    <Select
                                      label={prop.levelName}
                                      labelId='demo-simple-select-label'
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
                                      // required={field.required === 'true' ? true : false}
                                      multiline
                                      name={field.fieldName}
                                      maxRows={field.lengthValidation ? Number(prop.size) : 5}
                                      value={field.value}
                                      // value={values.addressData[field.fieldName] ? values.addressData[field.fieldName] : ""}
                                      InputProps={{
                                        readOnly: true
                                      }}
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
          <Accordion expanded={expandTransactionDetails} elevation={0}>
            <AccordionSummary
              className={classes.AccordionSummary}
              expandIcon={<ExpandMoreIcon />}
              aria-controls='panel1a-content'
              id='panel1a-header'
              onClick={e => setExapandTransactionDetails(!expandTransactionDetails)}
            >
              <Typography className={classes.heading}>Transaction Details</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3} style={{ marginBottom: '20px' }}>
                <Grid item xs={12}>
                  <span style={{ color: '#4472C4' }}>Deposit Details</span>
                </Grid>
                {/* <Grid item xs={12}>
                                    <Divider />
                                </Grid> */}
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl className={classes.formControl}>
                    <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                      Deposit Bank
                    </InputLabel>
                    <Select
                      label='Deposit Bank'
                      labelId='demo-simple-select-label'
                      name='depositBank'
                      id='demo-simple-select'
                      disabled={query2.get('mode') === 'view' ? true : false}
                      value={formik.values.depositBank}
                      onChange={formik.handleChange}
                      error={formik.touched.depositBank && Boolean(formik.errors.depositBank)}

                    // helperText={formik.touched.depositBank && formik.errors.depositBank}
                    >
                      {bankList.map((ele: any) => {
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
                  <FormControl className={classes.formControl}>
                    <TextField
                      id='standard-basic'
                      name='depositAccountNo'
                      value={formik.values.depositAccountNo}
                      onChange={formik.handleChange}
                      disabled={query2.get('mode') === 'view' ? true : false}
                      error={formik.touched.depositAccountNo && Boolean(formik.errors.depositAccountNo)}
                      helperText={formik.touched.depositAccountNo && formik.errors.depositAccountNo}
                      label='Deposit account no'
                      InputProps={{
                        classes: {
                          root: classes.inputRoot,
                          disabled: classes.disabled
                        }
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  <span style={{ color: '#4472C4' }}>Receipt Details</span>
                </Grid>
                {/* <Grid item xs={12}>
                                    <Divider />
                                </Grid> */}
                {query2.get('type') != 'fund' && <Grid item xs={12} sm={6} md={4}>
                  <FormControl className={classes.formControl}>
                    <TextField
                      id='standard-basic'
                      name='premiumAmount'
                      type='number'
                      disabled={
                        query2.get('mode') === 'view' || formik.values.receiptType === 'receiptWithInvoice'
                          ? true
                          : false
                      }
                      value={formik.values.premiumAmount}
                      onChange={formik.handleChange}
                      error={formik.touched.premiumAmount && Boolean(formik.errors.premiumAmount)}
                      helperText={formik.touched.premiumAmount && formik.errors.premiumAmount}
                      label='Premium Amount'
                      InputProps={{
                        classes: {
                          root: classes.inputRoot,
                          disabled: classes.disabled
                        }
                      }}
                    />
                  </FormControl>
                </Grid>}
                {query2.get('type') == 'fund' && <Grid item xs={12} sm={6} md={4}>
                  <FormControl className={classes.formControl}>
                    <TextField
                      id='standard-basic'
                      name='fundAmount'
                      type='number'
                      disabled={query2.get('mode') === 'view' ? true : false}
                      value={formik.values.fundAmount}
                      onChange={formik.handleChange}
                      error={formik.touched.fundAmount && Boolean(formik.errors.fundAmount)}
                      helperText={formik.touched.fundAmount && formik.errors.fundAmount}
                      label='Fund Amount'
                      InputProps={{
                        classes: {
                          root: classes.inputRoot,
                          disabled: classes.disabled
                        }
                      }}
                    />
                  </FormControl>
                </Grid>
                }
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  <span style={{ color: '#4472C4' }}>Transaction Details</span>
                </Grid>
                {/* <Grid item xs={12}>
                                    <Divider />
                                </Grid> */}
                {transactionList.map((x: any, i: any) => {
                  return (
                    <Grid container spacing={3} key={i} style={{ marginBottom: '20px', marginTop: '30px' }}>
                      <Grid item xs={12} sm={6} md={4}>
                        <FormControl className={classes.formControl}>
                          <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                            Transaction Mode
                          </InputLabel>
                          <Select
                            label='Transaction Mode'
                            labelId='demo-simple-select-label'
                            id='demo-simple-select'
                            name='transactionMode'
                            value={x.transactionMode}
                            disabled={query2.get('mode') === 'view' ? true : false}
                            onChange={e => handleTransactionModeChange(e, i)}
                            error={x.transactionMode === null || x.transactionMode === ''}
                          >
                            {transactionModeList.map((ele: any) => {
                              return (
                                <MenuItem key={ele.code} disabled={getdisabledStatus(ele.code)} value={ele.code}>
                                  {ele.name}
                                </MenuItem>
                              )
                            })}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <FormControl className={classes.formControl}>
                          <TextField
                            id='standard-basic'
                            name='transactionAmount'
                            type='number'
                            value={x.transactionAmount}
                            disabled={query2.get('mode') === 'view' ? true : false}
                            onChange={e => handleInputChangeTransaction(e, i)}
                            label='Transaction Amount'
                            error={x.transactionAmount === null || x.transactionAmount === ''}
                            helperText={x.transactionAmount === '' ? 'required field' : ' '}
                            InputProps={{
                              classes: {
                                root: classes.inputRoot,
                                disabled: classes.disabled
                              }
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <FormControl className={classes.formControl}>
                          <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                            Transaction Currency
                          </InputLabel>
                          <Select
                            labelId='demo-simple-select-label'
                            label='Transaction Currency'
                            id='demo-simple-select'
                            name='transactionCurrency'
                            value={x.transactionCurrency}
                            disabled={query2.get('mode') === 'view' ? true : false}
                            onChange={e => handleInputChangeTransaction(e, i)}
                            error={x.transactionCurrency === null || x.transactionCurrency === ''}
                          >
                            {currencyList.map((ele: any) => {
                              return (
                                <MenuItem key={ele.code} value={ele.code}>
                                  {ele.name}
                                </MenuItem>
                              )
                            })}
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} sm={6} md={4}>
                        <FormControl className={classes.formControl}>
                          <TextField
                            id='standard-basic'
                            name='exchangeRate'
                            type='number'
                            value={x.exchangeRate}
                            disabled={query2.get('mode') === 'view' ? true : false}
                            onChange={e => handleInputChangeTransaction(e, i)}
                            error={x.exchangeRate === null}
                            helperText={x.exchangeRate === '' ? 'required field' : ' '}
                            label='Exchange Rate'
                            InputProps={{
                              classes: {
                                root: classes.inputRoot,
                                disabled: classes.disabled
                              }
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <FormControl className={classes.formControl}>
                          <TextField
                            id='standard-basic'
                            name='exchangeAmount'
                            type='number'
                            value={x.exchangeAmount}
                            // disabled={query2.get('mode') === 'view' ? true : false}
                            disabled
                            onChange={e => handleInputChangeTransaction(e, i)}
                            error={x.exchangeAmount === null}
                            helperText={x.exchangeAmount === '' ? 'required field' : ' '}
                            label='Exchange Amount'
                            InputProps={{
                              classes: {
                                root: classes.inputRoot,
                                disabled: classes.disabled
                              }
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6} md={4} style={{ display: 'flex', alignItems: 'center' }}>
                        {transactionList.length !== 1 && (
                          <Button
                            variant='contained'
                            type='button'
                            className='mr10'
                            onClick={() => handleRemoveClickTransaction(i)}
                            color='secondary'
                            disabled={query2.get('mode') === 'view' ? true : false}
                            style={{ marginRight: '5px' }}
                          >
                            <DeleteIcon style={{ color: '#dc3545' }} />
                          </Button>
                        )}
                        {transactionList.length - 1 === i && (
                          <Button
                            color='primary'
                            variant='contained'
                            type='button'
                            disabled={query2.get('mode') === 'view' ? true : false}
                            onClick={handleAddClickTransaction}
                          >
                            <AddIcon />
                          </Button>
                        )}
                      </Grid>

                      {/* Transaction Mode Specific Fields */}
                      <Grid item xs={12}>
                        <Grid container spacing={3}>
                          {/* Cash */}
                          {x.transactionModeName?.toLowerCase() === 'cash' && (
                            <Grid item xs={12}>
                              <TableContainer component={Paper}>
                                <Table size='small' aria-label='a dense table'>
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>Denominations</TableCell>
                                      <TableCell>No of Notes/Coins</TableCell>
                                      <TableCell align='right'>Total Value</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {x.denominations.map((y: any, j: any) => (
                                      <TableRow key={j}>
                                        <TableCell>
                                          <span>{y.currencyValue} X</span>
                                        </TableCell>
                                        <TableCell>
                                          <TextField
                                            id='standard-basic'
                                            name='noOfCurrency'
                                            type='number'
                                            disabled={query2.get('mode') === 'view' ? true : false}
                                            value={y.noOfCurrency}
                                            onChange={e => handleDenominationAmount(e, i, j)}
                                          />
                                        </TableCell>
                                        <TableCell align='right'>
                                          <span>{y.noOfCurrency * y.currencyValue}</span>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                            </Grid>
                          )}

                          {/* Cheque */}
                          {x.transactionModeName?.toLowerCase() === 'cheque' && (
                            <Grid item xs={12}>
                              <Grid container spacing={3}>
                                <Grid item xs={12} sm={6} md={3}>
                                  <FormControl className={classes.formControl}>
                                    <TextField
                                      id='standard-basic'
                                      name='chequeNo'
                                      value={x.chequeDetails.chequeNo}
                                      onChange={e => handleCheque(e, i)}
                                      label='Cheque No'
                                      disabled={query2.get('mode') === 'view' ? true : false}
                                      error={x.chequeDetails.chequeNo === null || x.chequeDetails.chequeNo === ''}
                                      helperText={x.chequeDetails.chequeNo === '' ? 'required field' : ' '}
                                      InputProps={{
                                        classes: {
                                          root: classes.inputRoot,
                                          disabled: classes.disabled
                                        }
                                      }}
                                    />
                                  </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                  <FormControl className={classes.formControl}>
                                    <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                                      Bank
                                    </InputLabel>
                                    <Select
                                      labelId='demo-simple-select-label'
                                      label='Bank'
                                      name='bankName'
                                      id='demo-simple-select'
                                      disabled={query2.get('mode') === 'view' ? true : false}
                                      value={x.chequeDetails.bankName}
                                      onChange={e => handleCheque(e, i)}
                                      error={x.chequeDetails.bankName === null || x.chequeDetails.bankName === ''}
                                    >
                                      {bankList.map((ele: any) => {
                                        return (
                                          <MenuItem key={ele.id} value={ele.id}>
                                            {ele.name}
                                          </MenuItem>
                                        )
                                      })}
                                      <MenuItem key='1111' value='other'>
                                        Other
                                      </MenuItem>
                                    </Select>
                                  </FormControl>
                                </Grid>
                                {x.chequeDetails.bankName === 'other' && (
                                  <Grid item xs={12} sm={6} md={3}>
                                    <FormControl className={classes.formControl}>
                                      <TextField
                                        id='standard-basic'
                                        name='otherBankName'
                                        value={x.chequeDetails.otherBankName}
                                        onChange={e => handleCheque(e, i)}
                                        disabled={query2.get('mode') === 'view' ? true : false}
                                        label='Other Bank'
                                        error={x.chequeDetails.otherBankName === null || x.chequeDetails.otherBankName === ''}
                                        helperText={x.chequeDetails.otherBankName === '' ? 'required field' : ' '}
                                      />
                                    </FormControl>
                                  </Grid>
                                )}
                                <Grid item xs={12} sm={6} md={3}>
                                  <FormControl className={classes.formControl}>
                                    <TextField
                                      id='standard-basic'
                                      name='branch'
                                      value={x.chequeDetails.branch}
                                      onChange={e => handleCheque(e, i)}
                                      disabled={query2.get('mode') === 'view' ? true : false}
                                      label='Branch'
                                      error={x.chequeDetails.branch === null || x.chequeDetails.branch === ''}
                                      helperText={x.chequeDetails.branch === '' ? 'required field' : ' '}
                                    />
                                  </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                  <FormControl className={classes.formControl}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                      <DatePicker
                                        views={['year', 'month', 'day']}
                                        label='Cheque Date'
                                        value={x.chequeDetails.chequeDateVal}
                                        disabled={query2.get('mode') === 'view' ? true : false}
                                        InputProps={{
                                          classes: {
                                            root: classes.inputRoot,
                                            disabled: classes.disabled
                                          }
                                        }}
                                        onChange={(e: any) => handleChequeDate(e, i)}
                                        renderInput={params => (
                                          <TextField
                                            {...params}
                                            margin='normal'
                                            style={{ marginBottom: '0px' }}
                                            variant='outlined'
                                            fullWidth
                                          />
                                        )}
                                      />
                                    </LocalizationProvider>
                                  </FormControl>
                                </Grid>
                              </Grid>
                            </Grid>
                          )}

                          {/* MPESA */}
                          {x.transactionModeName === 'M-Pesa' && (
                            <Grid item xs={12}>
                              <Grid container spacing={3}>
                                <Grid item xs={12} sm={6} md={4}>
                                  <FormControl className={classes.formControl}>
                                    <TextField
                                      id='standard-basic'
                                      name='mpsaNo'
                                      value={x?.mpesaDetail?.mpsaNo}
                                      disabled={query2.get('mode') === 'view' ? true : false}
                                      onChange={e => handleMPESA(e, i)}
                                      label='MPESA No'
                                      error={x?.mpesaDetail?.mpsaNo === null || x?.mpesaDetail?.mpsaNo === ''}
                                      helperText={x?.mpesaDetail?.mpsaNo === '' ? 'required field' : ' '}
                                      InputProps={{
                                        classes: {
                                          root: classes.inputRoot,
                                          disabled: classes.disabled
                                        }
                                      }}
                                    />
                                  </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                  <FormControl className={classes.formControl}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                      <DatePicker
                                        views={['year', 'month', 'day']}
                                        label='MPESA Date'
                                        value={x?.mpesaDetail?.mpesaDateVal}
                                        disabled={query2.get('mode') === 'view' ? true : false}
                                        InputProps={{
                                          classes: {
                                            root: classes.inputRoot,
                                            disabled: classes.disabled
                                          }
                                        }}
                                        onChange={(e: any) => handleMPESADate(e, i)}
                                        renderInput={params => (
                                          <TextField
                                            {...params}
                                            margin='normal'
                                            style={{ marginBottom: '0px' }}
                                            variant='outlined'
                                          />
                                        )}
                                      />
                                    </LocalizationProvider>
                                  </FormControl>
                                </Grid>
                              </Grid>
                            </Grid>
                          )}

                          {/* EFT */}
                          {x.transactionModeName?.toLowerCase() === 'eft' && (
                            <Grid item xs={12}>
                              <Grid container spacing={3}>
                                <Grid item xs={12} sm={6} md={4}>
                                  <FormControl className={classes.formControl}>
                                    <TextField
                                      id='standard-basic'
                                      name='eftNo'
                                      value={x.eftDetail.eftNo}
                                      disabled={query2.get('mode') === 'view' ? true : false}
                                      onChange={e => handleEFT(e, i)}
                                      label='EFT No'
                                      error={x.eftDetail.eftNo === null || x.eftDetail.eftNo === ''}
                                      helperText={x.eftDetail.eftNo === '' ? 'required field' : ' '}
                                      InputProps={{
                                        classes: {
                                          root: classes.inputRoot,
                                          disabled: classes.disabled
                                        }
                                      }}
                                    />
                                  </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                  <FormControl className={classes.formControl}>
                                    <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                                      Bank
                                    </InputLabel>
                                    <Select
                                      labelId='demo-simple-select-label'
                                      name='bankName'
                                      label='Bank'
                                      id='demo-simple-select'
                                      disabled={query2.get('mode') === 'view' ? true : false}
                                      value={x.eftDetail.bankName}
                                      onChange={e => handleEFT(e, i)}
                                      error={x.eftDetail.bankName === null || x.eftDetail.bankName === ''}
                                    >
                                      {bankList.map((ele: any) => {
                                        return (
                                          <MenuItem key={ele.id} value={ele.id}>
                                            {ele.name}
                                          </MenuItem>
                                        )
                                      })}
                                      <MenuItem key='1111' value='other'>
                                        Other
                                      </MenuItem>
                                    </Select>
                                  </FormControl>
                                </Grid>
                                {x.eftDetail.bankName === 'other' && (
                                  <Grid item xs={12} sm={6} md={4}>
                                    <FormControl className={classes.formControl}>
                                      <TextField
                                        id='standard-basic'
                                        name='otherBankName'
                                        value={x.eftDetail.otherBankName}
                                        onChange={e => handleEFT(e, i)}
                                        label='Other Bank'
                                        error={x.eftDetail.otherBankName === null || x.eftDetail.otherBankName === ''}
                                        helperText={x.eftDetail.otherBankName === '' ? 'required field' : ' '}
                                      />
                                    </FormControl>
                                  </Grid>
                                )}
                                <Grid item xs={12} sm={6} md={4}>
                                  <FormControl className={classes.formControl}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                      <DatePicker
                                        views={['year', 'month', 'day']}
                                        label='EFT Date'
                                        value={x.eftDetail.eftDateVal}
                                        disabled={query2.get('mode') === 'view' ? true : false}
                                        InputProps={{
                                          classes: {
                                            root: classes.inputRoot,
                                            disabled: classes.disabled
                                          }
                                        }}
                                        onChange={(e: any) => handleEFTDate(e, i)}
                                        renderInput={params => (
                                          <TextField
                                            {...params}
                                            margin='normal'
                                            style={{ marginBottom: '0px' }}
                                            variant='outlined'
                                          />
                                        )}
                                      />
                                    </LocalizationProvider>
                                  </FormControl>
                                </Grid>
                              </Grid>
                            </Grid>
                          )}

                          {/* Demand Draft */}
                          {x.transactionModeName === "Demand Draft" && (
                            <Grid item xs={12}>
                              <Grid container spacing={3}>
                                <Grid item xs={12} sm={6} md={4}>
                                  <FormControl className={classes.formControl}>
                                    <TextField
                                      id='standard-basic'
                                      name='demandDraftNo'
                                      value={x?.demandDraftDetail?.demandDraftNo}
                                      disabled={query2.get('mode') === 'view' ? true : false}
                                      onChange={e => handleDraft(e, i)}
                                      label='Demand draft No'
                                      error={
                                        x?.demandDraftDetail?.demandDraftNo === null || x?.demandDraftDetail?.demandDraftNo === ''
                                      }
                                      helperText={x?.demandDraftDetail?.demandDraftNo === '' ? 'required field' : ' '}
                                      InputProps={{
                                        classes: {
                                          root: classes.inputRoot,
                                          disabled: classes.disabled
                                        }
                                      }}
                                    />
                                  </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                  <FormControl className={classes.formControl}>
                                    <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                                      Bank
                                    </InputLabel>
                                    <Select
                                      labelId='demo-simple-select-label'
                                      name='bankName'
                                      label='Bank'
                                      id='demo-simple-select'
                                      disabled={query2.get('mode') === 'view' ? true : false}
                                      value={x?.demandDraftDetail?.bankName}
                                      onChange={e => handleDraft(e, i)}
                                      error={x?.demandDraftDetail?.bankName === null || x?.demandDraftDetail?.bankName === ''}
                                    >
                                      {bankList?.map((ele: any) => {
                                        return (
                                          <MenuItem key={ele.id} value={ele.id}>
                                            {ele?.name}
                                          </MenuItem>
                                        )
                                      })}
                                      <MenuItem key='1111' value='other'>
                                        Other
                                      </MenuItem>
                                    </Select>
                                  </FormControl>
                                </Grid>
                                {x?.demandDraftDetail?.bankName === 'other' && (
                                  <Grid item xs={12} sm={6} md={4}>
                                    <FormControl className={classes.formControl}>
                                      <TextField
                                        id='standard-basic'
                                        name='otherBankName'
                                        value={x?.demandDraftDetail?.otherBankName}
                                        disabled={query2.get('mode') === 'view' ? true : false}
                                        onChange={e => handleDraft(e, i)}
                                        label='Other Bank'
                                        error={
                                          x?.demandDraftDetail?.otherBankName === null ||
                                          x?.demandDraftDetail?.otherBankName === ''
                                        }
                                        helperText={x?.demandDraftDetail?.otherBankName === '' ? 'required field' : ' '}
                                      />
                                    </FormControl>
                                  </Grid>
                                )}
                                <Grid item xs={12} sm={6} md={4}>
                                  <FormControl className={classes.formControl}>
                                    <TextField
                                      id='standard-basic'
                                      name='branch'
                                      value={x?.demandDraftDetail?.branch}
                                      disabled={query2.get('mode') === 'view' ? true : false}
                                      onChange={e => handleDraft(e, i)}
                                      label='Branch'
                                      error={x?.demandDraftDetail?.branch === null || x?.demandDraftDetail?.branch === ''}
                                      helperText={x?.demandDraftDetail?.branch === '' ? 'required field' : ' '}
                                    />
                                  </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                  <FormControl className={classes.formControl}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                      <DatePicker
                                        views={['year', 'month', 'day']}
                                        label='Draft Date'
                                        value={x?.demandDraftDetail?.draftDateVal}
                                        disabled={query2.get('mode') === 'view' ? true : false}
                                        InputProps={{
                                          classes: {
                                            root: classes.inputRoot,
                                            disabled: classes.disabled
                                          }
                                        }}
                                        onChange={(e: any) => handleDraftDate(e, i)}
                                        renderInput={params => (
                                          <TextField
                                            {...params}
                                            margin='normal'
                                            style={{ marginBottom: '0px' }}
                                            variant='outlined'
                                          />
                                        )}
                                      />
                                    </LocalizationProvider>
                                  </FormControl>
                                </Grid>
                              </Grid>
                            </Grid>
                          )}

                          {/* Credit Card */}
                          {x.transactionModeName?.toLowerCase() === 'credit card' && (
                            <Grid item xs={12}>
                              <Grid container spacing={3}>
                                <Grid item xs={12} sm={6} md={4}>
                                  <FormControl className={classes.formControl}>
                                    <TextField
                                      id='standard-basic'
                                      name='cardNumber'
                                      value={x.creditCardDetail.cardNumber}
                                      disabled={query2.get('mode') === 'view' ? true : false}
                                      onChange={e => handleCardDetails(e, i)}
                                      label='Credit No'
                                      error={x.creditCardDetail.cardNumber === null || x.creditCardDetail.cardNumber === ''}
                                      helperText={x.creditCardDetail.cardNumber === '' ? 'required field' : ' '}
                                      InputProps={{
                                        classes: {
                                          root: classes.inputRoot,
                                          disabled: classes.disabled
                                        }
                                      }}
                                    />
                                  </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                  <FormControl className={classes.formControl}>
                                    <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                                      Bank
                                    </InputLabel>
                                    <Select
                                      labelId='demo-simple-select-label'
                                      name='bankName'
                                      label='Bank'
                                      id='demo-simple-select'
                                      value={x.creditCardDetail.bankName}
                                      onChange={e => handleCardDetails(e, i)}
                                      error={x.creditCardDetail.bankName === null || x.creditCardDetail.bankName === ''}
                                    >
                                      {bankList.map((ele: any) => {
                                        return (
                                          <MenuItem key={ele.id} value={ele.id}>
                                            {ele.name}
                                          </MenuItem>
                                        )
                                      })}
                                      <MenuItem key='1111' value='other'>
                                        Other
                                      </MenuItem>
                                    </Select>
                                  </FormControl>
                                </Grid>
                                {x.creditCardDetail.bankName === 'other' && (
                                  <Grid item xs={12} sm={6} md={4}>
                                    <FormControl className={classes.formControl}>
                                      <TextField
                                        id='standard-basic'
                                        name='otherBankName'
                                        value={x.creditCardDetail.otherBankName}
                                        onChange={e => handleCardDetails(e, i)}
                                        label='Other Bank'
                                        error={
                                          x.creditCardDetail.otherBankName === null || x.creditCardDetail.otherBankName === ''
                                        }
                                        helperText={x.creditCardDetail.otherBankName === '' ? 'required field' : ' '}
                                      />
                                    </FormControl>
                                  </Grid>
                                )}
                                <Grid item xs={12} sm={6} md={4}>
                                  <FormControl className={classes.formControl}>
                                    <TextField
                                      id='standard-basic'
                                      name='branch'
                                      value={x.creditCardDetail.branch}
                                      disabled={query2.get('mode') === 'view' ? true : false}
                                      onChange={e => handleCardDetails(e, i)}
                                      label='Branch'
                                      error={x.creditCardDetail.branch === null || x.creditCardDetail.branch === ''}
                                      helperText={x.creditCardDetail.branch === '' ? 'required field' : ' '}
                                    />
                                  </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                  <FormControl className={classes.formControl}>
                                    <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                                      Card Type
                                    </InputLabel>
                                    <Select
                                      labelId='demo-simple-select-label'
                                      name='cardType'
                                      label='Card Type'
                                      id='demo-simple-select'
                                      value={x.creditCardDetail.cardType}
                                      onChange={e => handleCardDetails(e, i)}
                                      error={x.creditCardDetail.cardType === null || x.creditCardDetail.cardType === ''}
                                    >
                                      <MenuItem key='1234' value='master'>
                                        Master Card
                                      </MenuItem>
                                      <MenuItem key='5678' value='visa'>
                                        VISA
                                      </MenuItem>
                                    </Select>
                                  </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                  <FormControl className={classes.formControl}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                      <DatePicker
                                        views={['year', 'month', 'day']}
                                        label='Expire Date'
                                        value={x.creditCardDetail.cardExpireDateVal}
                                        disabled={query2.get('mode') === 'view' ? true : false}
                                        InputProps={{
                                          classes: {
                                            root: classes.inputRoot,
                                            disabled: classes.disabled
                                          }
                                        }}
                                        onChange={(e: any) => handleExpireDate(e, i)}
                                        renderInput={params => (
                                          <TextField
                                            {...params}
                                            margin='normal'
                                            style={{ marginBottom: '0px' }}
                                            variant='outlined'
                                          />
                                        )}
                                      />
                                    </LocalizationProvider>
                                  </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                  <FormControl className={classes.formControl}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                      <DatePicker
                                        views={['year', 'month', 'day']}
                                        label='Transaction Date'
                                        value={x.creditCardDetail.cardTransactionDateVal}
                                        disabled={query2.get('mode') === 'view' ? true : false}
                                        InputProps={{
                                          classes: {
                                            root: classes.inputRoot,
                                            disabled: classes.disabled
                                          }
                                        }}
                                        onChange={(e: any) => handleTransactionDate(e, i)}
                                        renderInput={params => (
                                          <TextField
                                            {...params}
                                            margin='normal'
                                            style={{ marginBottom: '0px' }}
                                            variant='outlined'
                                          />
                                        )}
                                      />
                                    </LocalizationProvider>
                                  </FormControl>
                                </Grid>
                              </Grid>
                            </Grid>
                          )}

                          {/* Debit Card */}
                          {x.transactionModeName?.toLowerCase() === 'debit card' && (
                            <Grid item xs={12}>
                              <Grid container spacing={3}>
                                <Grid item xs={12} sm={6} md={4}>
                                  <FormControl className={classes.formControl}>
                                    <TextField
                                      id='standard-basic'
                                      name='cardNumber'
                                      value={x.debitCardDetail.cardNumber}
                                      disabled={query2.get('mode') === 'view' ? true : false}
                                      onChange={e => handleDebitCardDetails(e, i)}
                                      label='Debit card No'
                                      error={x.debitCardDetail.cardNumber === null || x.debitCardDetail.cardNumber === ''}
                                      helperText={x.debitCardDetail.cardNumber === '' ? 'required field' : ' '}
                                      InputProps={{
                                        classes: {
                                          root: classes.inputRoot,
                                          disabled: classes.disabled
                                        }
                                      }}
                                    />
                                  </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                  <FormControl className={classes.formControl}>
                                    <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                                      Bank
                                    </InputLabel>
                                    <Select
                                      labelId='demo-simple-select-label'
                                      name='bankName'
                                      label='Bank'
                                      id='demo-simple-select'
                                      disabled={query2.get('mode') === 'view' ? true : false}
                                      value={x.debitCardDetail.bankName}
                                      onChange={e => handleDebitCardDetails(e, i)}
                                      error={x.debitCardDetail.bankName === null || x.debitCardDetail.bankName === ''}
                                    >
                                      {bankList.map((ele: any) => {
                                        return (
                                          <MenuItem key={ele.id} value={ele.id}>
                                            {ele.name}
                                          </MenuItem>
                                        )
                                      })}
                                      <MenuItem key='1111' value='other'>
                                        Other
                                      </MenuItem>
                                    </Select>
                                  </FormControl>
                                </Grid>
                                {x.debitCardDetail.bankName === 'other' && (
                                  <Grid item xs={12} sm={6} md={4}>
                                    <FormControl className={classes.formControl}>
                                      <TextField
                                        id='standard-basic'
                                        name='otherBankName'
                                        value={x.debitCardDetail.otherBankName}
                                        onChange={e => handleDebitCardDetails(e, i)}
                                        label='Other Bank'
                                        error={
                                          x.debitCardDetail.otherBankName === null || x.debitCardDetail.otherBankName === ''
                                        }
                                        helperText={x.debitCardDetail.otherBankName === '' ? 'required field' : ' '}
                                      />
                                    </FormControl>
                                  </Grid>
                                )}
                                <Grid item xs={12} sm={6} md={4}>
                                  <FormControl className={classes.formControl}>
                                    <TextField
                                      id='standard-basic'
                                      name='branch'
                                      value={x.debitCardDetail.branch}
                                      disabled={query2.get('mode') === 'view' ? true : false}
                                      onChange={e => handleDebitCardDetails(e, i)}
                                      label='Branch'
                                      error={x.debitCardDetail.branch === null || x.debitCardDetail.branch === ''}
                                      helperText={x.debitCardDetail.branch === '' ? 'required field' : ' '}
                                    />
                                  </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                  <FormControl className={classes.formControl}>
                                    <InputLabel id='demo-simple-select-label' style={{ marginBottom: '0px' }}>
                                      Card Type
                                    </InputLabel>
                                    <Select
                                      labelId='demo-simple-select-label'
                                      name='cardType'
                                      label='Card Type'
                                      id='demo-simple-select'
                                      value={x.debitCardDetail.cardType}
                                      onChange={e => handleDebitCardDetails(e, i)}
                                      error={x.debitCardDetail.cardType === null || x.debitCardDetail.cardType === ''}
                                    >
                                      <MenuItem key='1234' value='master'>
                                        Master Card
                                      </MenuItem>
                                      <MenuItem key='5678' value='visa'>
                                        VISA
                                      </MenuItem>
                                    </Select>
                                  </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                  <FormControl className={classes.formControl}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                      <DatePicker
                                        views={['year', 'month', 'day']}
                                        label='Expire Date'
                                        value={x.debitCardDetail.cardExpireDateVal}
                                        disabled={query2.get('mode') === 'view' ? true : false}
                                        InputProps={{
                                          classes: {
                                            root: classes.inputRoot,
                                            disabled: classes.disabled
                                          }
                                        }}
                                        onChange={(e: any) => handleDebitExpireDate(e, i)}
                                        renderInput={params => (
                                          <TextField
                                            {...params}
                                            margin='normal'
                                            style={{ marginBottom: '0px' }}
                                            variant='outlined'
                                          />
                                        )}
                                      />
                                    </LocalizationProvider>
                                  </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                  <FormControl className={classes.formControl}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                      <DatePicker
                                        views={['year', 'month', 'day']}
                                        label='Transaction Date'
                                        value={x.debitCardDetail.cardTransactionDateVal}
                                        disabled={query2.get('mode') === 'view' ? true : false}
                                        InputProps={{
                                          classes: {
                                            root: classes.inputRoot,
                                            disabled: classes.disabled
                                          }
                                        }}
                                        onChange={(e: any) => handleDebitTransactionDate(e, i)}
                                        renderInput={params => (
                                          <TextField
                                            {...params}
                                            margin='normal'
                                            style={{ marginBottom: '0px' }}
                                            variant='outlined'
                                          />
                                        )}
                                      />
                                    </LocalizationProvider>
                                  </FormControl>
                                </Grid>
                              </Grid>
                            </Grid>
                          )}
                        </Grid>
                      </Grid>
                    </Grid>
                  )
                })}
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Box>
      </Paper>
      <Paper elevation={0}>
        <Box p={3} my={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
              {query2.get('mode') !== 'view' ? (
                <Button variant='contained' color='secondary' style={{ marginRight: '5px' }} type='submit'>
                  Save
                </Button>
              ) : null}
              <Button
                type='button'
                className={`${query2.get('mode') === 'view' ? 'p-button' : 'p-button-text'}`}
                onClick={handleClose}
              >
                {query2.get('mode') === 'view' ? 'Ok' : 'Cancel'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </form >
  )
}
