import * as React from 'react';

import { Button } from 'primereact/button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

// import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
// import 'date-fns';
import { useFormik } from 'formik';


import * as yup from 'yup';
import { MenuItem, Select } from '@mui/material';

// statics dropdown data :
const organizationCodes = [
  { value: 'code1', label: 'Code 1' },
  { value: 'code2', label: 'Code 2' },
  { value: 'code3', label: 'Code 3' },
];

const authorSigned = [
  {
    value: 'author',
    label: 'Author',
  },
];

export default function ProviderContractDetailsModal(props:any) {
  const validationSchema = yup.object({
    contractNumber: yup.string().required('Numbers is Required'),
    contractDate: yup.string().required('Date is Required'),
    contractEndDate: yup.string().required('Date is Required'),
    contractReveiwDate: yup.string().required('Date is Required'),
    contractSignedby: yup.string().required('Author is Required'),
  });

  const formik = useFormik({
    initialValues: {
      contractNumber: '',
      contractDate: new Date().getTime(),
      contractEndDate: new Date().getTime(),
      contractReveiwDate: new Date().getTime(),
      ContractSignedby: '',
    },
    validationSchema: validationSchema,
    onSubmit: values => {
      handleModalSubmit();
    },
  });

  // const [selectedProviderCode, setselectedProviderCode] = React.useState('');
  // const [selectedEndDate, setSelectedStartDate] = React.useState(new Date());
  const [selectSigned, setSelectedSigned] = React.useState('');

  const [state, setState] = React.useState({
    selectContractDate: new Date(),
    selectContractEndDate: new Date(),
    selectContractReviewDate: new Date(),
  });

  const handleChange = (event:any) => {
    // setselectedProviderCode(event.target.value);
    setSelectedSigned(event.target.value);
  };

  const handleModalSubmit = () => {
    const payload = {
      contractNumber: formik.values.contractNumber,
      contractDate: formik.values.contractDate,
      contractEndDate: formik.values.contractEndDate,
      contractReveiwDate: formik.values.contractReveiwDate,
      ContractSignedby: selectSigned,
    };

    props.handleContractDetails(payload);
  };

  const handleClose = () => {
    props.closeContractDetailsModal();
  };

  const handleContractDate = (date:any) => {
    setState({
      ...state,
      selectContractDate: date,
    });
    const timestamp = new Date(date).getTime();

    formik.setFieldValue('contractDate', timestamp);
  };

  const handleContractEndDate = (date:any) => {
    setState({
      ...state,
      selectContractEndDate: date,
    });
    const timestamp = new Date(date).getTime();

    formik.setFieldValue('contractEndDate', timestamp);
  };

  const handleContractReviewDate = (date:any) => {
    setState({
      ...state,
      selectContractReviewDate: date,
    });
    const timestamp = new Date(date).getTime();

    formik.setFieldValue('contractReviewDate', timestamp);
  };

  
return (
    <Dialog
      open={props.openContractDetailsModal}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
      disableEnforceFocus>
      <DialogTitle id="form-dialog-title">ORGANISATION CODE</DialogTitle>
      <DialogContent>
        <form onSubmit={formik.handleSubmit} style={{ maxWidth: '500px', margin: 'auto' }}>
          <Grid container spacing={3}>
            {/* <Grid item xs={12}>
              <TextField id="standard-basic" name="Organisation Code" label="ORGANIZATION CODE" fullWidth />
            </Grid> */}
            {/* commented code */}
            {/* <Grid item xs={12}>
              <Select
                labelId="organization-code-label"
                id="provider-type"
                value={selectedProviderCode}
                onChange={handleChange}
                fullWidth
                style={{ minWidth: '200px' }}>
                <MenuItem value="" disabled>
                  Select Any One
                </MenuItem>
                {organizationCodes &&
                  organizationCodes.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
              </Select>
            </Grid> */}
            {/* Other form fields */}
            {/* <Grid item xs={12}>
              <Select
                labelId="organization-code-label"
                id="provider-type"
                value={selectedProviderCode}
                onChange={handleChange}
                placeholder="Select Any One"
                fullWidth
                style={{ minWidth: '200px' }}
                displayEmpty>
                <MenuItem value="" disabled>
                  Select Any One
                </MenuItem>
                {organizationCodes &&
                  organizationCodes.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
              </Select>
            </Grid> */}

            <Grid item xs={12}>
              <TextField
                id="standard-basic"
                name="contractNumber"
                value={formik.values.contractNumber}
                onChange={formik.handleChange}
                label="CONTRACT NO"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  views={['year', 'month', 'date']}
                  variant="inline"
                  format="dd/MM/yyyy"
                  margin="normal"
                  id="date-picker-inline"
                  label="CONTRACT DATE"
                  name="contractDate"
                  value={state?.selectContractDate}
                  onChange={handleContractDate}
                  KeyboardButtonProps={{
                    'aria-label': 'change ing date',
                  }}
                  fullWidth
                />
              </MuiPickersUtilsProvider> */}
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                    views={["year", "month", "day"]}
                    label="CONTRACT DATE"
                    value={state?.selectContractDate}
                    onChange={handleContractDate}
                    renderInput={(params) => (
                        <TextField
                        {...params}
                        fullWidth = {true}
                        margin="normal"
                        style={{margin:'normal'}}
                        variant="outlined"
                        />
                    )}
                    />
                </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  views={['year', 'month', 'date']}
                  variant="inline"
                  format="dd/MM/yyyy"
                  margin="normal"
                  id="date-picker-inline"
                  label="CONTRACT END DATE"
                  name="contractEndDate"
                  value={state?.selectContractEndDate}
                  onChange={handleContractEndDate}
                  KeyboardButtonProps={{
                    'aria-label': 'change ing date',
                  }}
                  fullWidth
                />
              </MuiPickersUtilsProvider> */}
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                    views={["year", "month", "day"]}
                    label="CONTRACT END DATE"
                    value={state?.selectContractEndDate}
                    onChange={handleContractEndDate}
                    renderInput={(params) => (
                        <TextField
                        {...params}
                        fullWidth = {true}
                        margin="normal"
                        style={{margin:'normal'}}
                        variant="outlined"
                        />
                    )}
                    />
                </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  views={['year', 'month', 'date']}
                  variant="inline"
                  format="dd/MM/yyyy"
                  margin="normal"
                  id="date-picker-inline"
                  label="CONTRACT REVIEW DATE"
                  name="contractReviewDate"
                  value={state?.selectContractReviewDate}
                  onChange={handleContractReviewDate}
                  KeyboardButtonProps={{
                    'aria-label': 'change ing date',
                  }}
                  fullWidth
                />
              </MuiPickersUtilsProvider> */}
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                    views={["year", "month", "day"]}
                    label="CONTRACT REVIEW DATE"
                    value={state?.selectContractReviewDate}
                    onChange={handleContractReviewDate}
                    renderInput={(params) => (
                        <TextField
                        {...params}
                        fullWidth = {true}
                        margin="normal"
                        style={{margin:'normal'}}
                        variant="outlined"
                        />
                    )}
                    />
                </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <Select
                labelId="organization-code-label"
                id="signedBy"
                name="ContractSignedby"
                value={selectSigned}
                onChange={handleChange}
                placeholder="Select Any One"
                style={{ minWidth: '200px' }}
                fullWidth>
                <MenuItem value="" disabled>
                  Select Any One
                </MenuItem>
                {authorSigned &&
                  authorSigned.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
              </Select>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleModalSubmit} color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
