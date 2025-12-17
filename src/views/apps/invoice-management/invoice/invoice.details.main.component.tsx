// import * as React from "react";
// import * as yup from "yup";
// import DateFnsUtils from '@date-io/date-fns';
// import Accordion from '@material-ui/core/Accordion';
// import AccordionDetails from '@material-ui/core/AccordionDetails';
// import AccordionSummary from '@material-ui/core/AccordionSummary';
// import Box from '@material-ui/core/Box';
// import { Button } from 'primereact/button';
// import Checkbox from '@material-ui/core/Checkbox';
// import Divider from '@material-ui/core/Divider';
// import FormControl from '@material-ui/core/FormControl';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import FormGroup from '@material-ui/core/FormGroup';
// import Grid from '@material-ui/core/Grid';
// import InputLabel from '@material-ui/core/InputLabel';
// import MenuItem from '@material-ui/core/MenuItem';
// import Paper from '@material-ui/core/Paper';
// import Radio from '@material-ui/core/Radio';
// import RadioGroup from '@material-ui/core/RadioGroup';
// import Select from '@material-ui/core/Select';
'use clients'

// import Table from '@material-ui/core/Table';
// import TableBody from '@material-ui/core/TableBody';
// import TableCell from '@material-ui/core/TableCell';
// import TableContainer from '@material-ui/core/TableContainer';
// import TableHead from '@material-ui/core/TableHead';
// import TableRow from '@material-ui/core/TableRow';
// import TextField from '@material-ui/core/TextField';
// import Tooltip from '@material-ui/core/Tooltip';
// import Typography from '@material-ui/core/Typography';
// import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
// import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
// import Autocomplete from '@material-ui/lab/Autocomplete';
// import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';

// import { useFormik } from 'formik';
import * as React from 'react'

// import { useEffect } from 'react';
// import { useHistory, useLocation, useParams } from 'react-router-dom';
// import { filter, forkJoin, map, of, switchMap, tap, throwIfEmpty } from 'rxjs';
import { useSearchParams } from 'next/navigation'

import { makeStyles } from '@mui/styles'
import * as yup from 'yup'

// import throwErrorMessageEvent from '../../util/message.event.producer';
// import InvoiceAgentModal from './modals/invoice.agent.modal.component';
// import InvoiceClientModal from './modals/invoice.client.modal.component';
import FundInvoiceDetails from './fundInvoice.details.component'
import InvoiceDetails from './invoice.details.component'
import { InvoiceService } from '@/services/remote-api/api/invoice-services'
import { TaxService } from '@/services/remote-api/api/tax-services'
import { ProductService } from '@/services/remote-api/api/product-services'
import { PlanService } from '@/services/remote-api/api/plan-services'
import { AgentsService } from '@/services/remote-api/api/agents-services'
import { ClientService, ProspectService } from '@/services/remote-api/api/client-services'
import { AddressService } from '@/services/remote-api/api/master-services'
import { QuotationService } from '@/services/remote-api/api/quotation-services/quotation.service'

import { defaultPageRequest } from '@/services/remote-api/models/page.request'

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

const reqParam: any = { pageRequest: defaultPageRequest }
const invoiceservice = new InvoiceService()
const taxservice = new TaxService()
const productservice = new ProductService()
const planservice = new PlanService()
const agentservice = new AgentsService()
const clientservice = new ClientService()
const prospectservice = new ProspectService()
const addressservice = new AddressService()
const quotationservice = new QuotationService()

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
    minWidth: 182
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightBold
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

export default function InvoiceDetailsMain(props: any) {
  const query2 = useSearchParams()

  return <>{query2.get('type') === 'fund' ? <FundInvoiceDetails /> : <InvoiceDetails />}</>
}
