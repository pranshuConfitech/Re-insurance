import * as React from 'react';

import { FormControl } from '@mui/material';

// import { Button } from 'primereact/button';
import { Button } from '@mui/material';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { makeStyles } from '@mui/styles';
import 'date-fns';
import { useFormik } from 'formik';


import * as yup from 'yup';

const useStyles = makeStyles((theme:any) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme?.spacing?theme.spacing(1):'8px',
    marginRight:  theme?.spacing?theme.spacing(1):'8px',
    width: 200,
  },
  textArea: {
    width: '100%',
    minHeight: '100px', // Set the height as needed
    padding: '10px',
    border: '1px solid #ced4da',
    borderRadius: '4px',
    fontSize: '16px',
    lineHeight: '1.5',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
    '&:focus': {
      outline: '0',
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0, 123, 255, 0.25)',
    },
  },
}));


const validationSchema = yup.object().shape({
  costSavings: yup
    .number()
    .typeError('Cost Saving must be a number')
    .required('Cost Saving is required'),
  mobileNo: yup
    .string()
    .matches(/^\d{10}$/, 'Mobile Number must be 10 digits')
    .required('Mobile Number is required'),
  dod: yup
    .date()
    .typeError('Admission Date must be a valid date')
    .required('Admission Date is required'),
  remarks: yup.string().required('Remark is required'),
});

export default function DischargeUpdationModal(props:any) {
  const classes = useStyles();

  const formik = useFormik({
    initialValues: {
      action: 'AWAITING_DISCHARGE_UPDATION',
      estimatedAmount: props.data?.estimatedAmount || '',
      sanctionAmount: props.data?.sanctionAmount || '',
      costSavings: 0,
      mobileNo: '',
      dod: '',
      dischargeCertificate: { name: '' },
      feedbackForm: { name: '' },
      remarks: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const dod = new Date(values.dod);
      const timestampMilliseconds = dod.getTime();

      const updatedValues = {
        ...values,
        dod: timestampMilliseconds,
      };

      props.admissionUpdationModalSubmit(updatedValues)
      props.handleCloseClaimModal();
    },
  });

  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState<any>('sm');


  const handleClose = () => {
    props.handleCloseClaimModal();
  };

  const handleModalSubmit = () => {
    formik.handleSubmit();
  };

  return (
    <Dialog
      open={props.dishargeUpdationModal}
      onClose={handleClose}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      aria-labelledby="form-dialog-title"
      disableEnforceFocus>
      <DialogTitle id="form-dialog-title">Discharge Updation</DialogTitle>
      <DialogContent>
        <Grid container spacing={3} style={{ marginBottom: '20px' }}>

          <Grid item xs={6}>
            <TextField
              id="estimatedAmount"
              name="estimatedAmount"
              value={formik.values.estimatedAmount}
              onChange={formik.handleChange}
              label="Estimated Amount"
              inputProps={
                { readOnly: true, }
              }
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              id="sanctionAmount"
              name="sanctionAmount"
              value={formik.values.sanctionAmount}
              onChange={formik.handleChange}
              label="Sanction Amount"
              inputProps={
                { readOnly: true, }
              }
            />
          </Grid>
          
          <Grid item xs={6}>
            <FormControl>

              <TextField
                id="costSavings"
                name="costSavings"
                value={formik.values.costSavings}
                onChange={formik.handleChange}
                type="number"
                label="Cost Savings *"
                helperText={formik.touched.costSavings && formik.errors.costSavings}
                error={formik.touched.costSavings && Boolean(formik.errors.costSavings)}
              />
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl>
              <TextField
                id="mobileNo"
                name="mobileNo"
                value={formik.values.mobileNo}
                onChange={formik.handleChange}
                label="Mobile Number *"
                helperText={formik.touched.mobileNo && formik.errors.mobileNo}
                error={formik.touched.mobileNo && Boolean(formik.errors.mobileNo)}
              />
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl>
              <TextField
                id="dod"
                name="dod"
                onChange={formik.handleChange}
                label="Admisssion Date *"
                type="datetime-local"
                defaultValue="2017-05-24T10:30"
                value={formik.values.dod}
                className={classes.textField}
                helperText={formik.touched.dod && formik.errors.dod}
                error={formik.touched.dod && Boolean(formik.errors.dod)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl>
              <input
                accept=".pdf,.doc,.docx"
                id="dischargeCertificate"
                name="dischargeCertificate"
                type="file"
                style={{ display: 'none' }}
                onChange={(event:any) => {
                  formik.setFieldValue("dischargeCertificate", event?.currentTarget?.files[0]);
                }}
              />
              <label htmlFor="dischargeCertificate">
                <Button variant="contained" component="span">
                  Upload Discharge Certificate
                </Button>
              </label>
              <div>{formik.values.dischargeCertificate?.name}</div>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl>
              <input
                accept=".pdf,.doc,.docx"
                id="feedbackForm"
                name="feedbackForm"
                type="file"
                style={{ display: 'none' }}
                onChange={(event:any) => {
                  formik.setFieldValue("feedbackForm", event?.currentTarget?.files[0]);
                }}
              />
              <label htmlFor="feedbackForm">
                <Button variant="contained" component="span">
                  Upload Feedback Form
                </Button>
              </label>
              <div>{formik.values?.feedbackForm?.name}</div>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <TextField id="remarks"
                onChange={formik.handleChange}
                name="remarks"
                value={formik.values.remarks}
                label="Remark *"
                multiline
                minRows={5}
                helperText={formik.touched.remarks && formik.errors.remarks}
                error={formik.touched.remarks && Boolean(formik.errors.remarks)}
              />
            </FormControl>
          </Grid>

        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" className='p-button-text'>
          Cancel
        </Button>
        <Button onClick={handleModalSubmit} color="primary">
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}
