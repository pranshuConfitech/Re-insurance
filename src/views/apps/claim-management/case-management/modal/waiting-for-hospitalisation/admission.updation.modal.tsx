import * as React from 'react';

import { FormControl } from '@mui/material';
import { Button } from 'primereact/button';
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

const useStyles = makeStyles((theme: any) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme?.spacing ? theme.spacing(1) : '8px',
    marginRight: theme?.spacing ? theme.spacing(1) : '8px',
    width: 200,
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
  doa: yup
    .date()
    .typeError('Admission Date must be a valid date')
    .required('Admission Date is required'),
  remarks: yup.string().required('Remark is required'),
});

export default function DischargeUpdationModal(props: any) {
  const classes = useStyles();


  const formik = useFormik({
    initialValues: {
      action: 'ADMISSION_UPDATION',
      estimatedCost: props.data?.estimatedCost || '',
      approvedAmount: props.data?.approvedAmount || '',
      costSavings: 0,
      mobileNo: '',
      doa: '',
      remarks: '',
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const doa = new Date(values.doa);
      const timestampMilliseconds = doa.getTime();

      const updatedValues = {
        ...values,
        doa: timestampMilliseconds,
      };

      props.admissionUpdationModalSubmit(updatedValues)
      props.handleCloseClaimModal();
    },
  });

  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState<any>('sm');

  React.useEffect(() => {
    let estimatedCost = 0;
    let approvedAmount = 0;

    if (Array.isArray(props.data)) {
      props.data.forEach((el: any) => {
        estimatedCost += Number(el.estimatedCost) || 0;
        approvedAmount += Number(el.approvedAmount) || 0;
      });
    }

    formik.setValues({
      ...formik.values,
      estimatedCost,
      approvedAmount,
    });
  }, [props.data]);

  const handleClose = () => {
    props.handleCloseClaimModal();
  };

  const handleEdit = () => {
    // setState({ [`${e.target.name}`]: e.target.value });
  }

  const handleModalSubmit = () => {
    formik.handleSubmit();

  };

  return (
    <Dialog
      open={props.admissionUpdationModal}
      onClose={handleClose}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      aria-labelledby="form-dialog-title"
      disableEnforceFocus>
      <DialogTitle id="form-dialog-title">Admission Updation</DialogTitle>
      <DialogContent>
        <Grid container spacing={3} style={{ marginBottom: '20px' }}>

          <Grid item xs={6}>
            <TextField
              id="estimatedCost"
              name="estimatedCost"
              value={formik.values.estimatedCost}
              onChange={formik.handleChange}
              label="Estimated Amount"
              inputProps={
                { readOnly: true, }
              }
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              id="approvedAmount"
              name="approvedAmount"
              value={formik.values.approvedAmount}
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
                id="doa"
                name="doa"
                onChange={formik.handleChange}
                label="Admisssion Date *"
                type="datetime-local"
                defaultValue="2017-05-24T10:30"
                value={formik.values.doa}
                className={classes.textField}
                helperText={formik.touched.doa && formik.errors.doa}
                error={formik.touched.doa && Boolean(formik.errors.doa)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
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
