import * as React from 'react';

import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
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

const useStyles = makeStyles((theme:any) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme?.spacing?theme.spacing(1):'8px',
    marginRight: theme?.spacing?theme.spacing(1):'8px',
    width: 200,
  },
}));


const validationSchema = yup.object().shape({
  dod: yup
    .date()
    .typeError('Admission Date must be a valid date')
    .required('Admission Date is required'),

});

export default function DischargeCanellationModal(props:any) {
  const classes = useStyles();

  const formik = useFormik({
    initialValues: {
      action: 'AWAITING_DISCHARGE_CANCELATION',
      reasonForDischargeCancelation: 'MEMBER HAS NOT TAKEN ADMISSION AS CONFIRMED BY THE HOSPITAL',
      dod: '',
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
      <DialogTitle id="form-dialog-title">Discharge Cancellation</DialogTitle>
      <DialogContent>
        <Grid container spacing={3} style={{ marginBottom: '20px' }}>

          <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel
              id="demo-simple-select-label"
              style={{ marginBottom: "0px" }}
            >
              Reason For Admission Cancellation
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              label="Reason For Admission Cancellation"
              id="reasonForDischargeCancelation"
              name="reasonForDischargeCancelation"
              value={formik.values.reasonForDischargeCancelation}
              onChange={formik.handleChange}
            >
              <MenuItem value="MEMBER HAS NOT TAKEN ADMISSION AS CONFIRMED BY THE HOSPITAL">
                MEMBER HAS NOT TAKEN ADMISSION AS CONFIRMED BY THE HOSPITAL
              </MenuItem>
              <MenuItem value="MEMBER WENT FOR REIMBURSEMENT">
                MEMBER WENT FOR REIMBURSEMENT
              </MenuItem>
              <MenuItem value="MEMBER HAS SENT A LETTER TO CANCEL HIS CASHLESS APPROVAL">
                MEMBER HAS SENT A LETTER TO CANCEL HIS CASHLESS APPROVAL
              </MenuItem>
              <MenuItem value="WE ARE NOT THE TPA OF THIS DO">
                WE ARE NOT THE TPA OF THIS DO
              </MenuItem>
              <MenuItem value="SELF PAYMENT">
                SELF PAYMENT
              </MenuItem>
            </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl>
              <TextField
                id="dod"
                name="dod"
                onChange={formik.handleChange}
                label="Discharge Date *"
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
            <FormControl fullWidth>
              <TextField id="remarks"
                onChange={formik.handleChange}
                name="remarks"
                value={formik.values.remarks}
                label="Remark"
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
