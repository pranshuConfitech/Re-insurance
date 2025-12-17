import * as React from 'react';

import { Button } from 'primereact/button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import 'date-fns';
import { useFormik } from 'formik';


import * as yup from 'yup';

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

export default function ProviderSendNotificationModal(props:any) {
  const validationSchema = yup.object({
    message: yup.string().required('Numbers is Required'),
   
  });

  const formik = useFormik({
    initialValues: {
      message: '',
   
    },
    validationSchema: validationSchema,
    onSubmit: values => {
      handleModalSubmit();
    },
  });


  const handleChange = () => {
    // setselectedProviderCode(event.target.value);
    // setSelectedSigned(event.target.value);
  };

  const handleModalSubmit = () => {
   
  };

  const handleClose = () => {
    props.closeContractDetailsModal();
  };

  
  return (
    <Dialog
      open={props.openContractDetailsModal}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
      disableEnforceFocus>
      <DialogTitle id="form-dialog-title">Message</DialogTitle>
      <DialogContent>
        <form onSubmit={formik.handleSubmit} style={{ maxWidth: '500px', margin: 'auto',minWidth:"400px" }}>
          <Grid container spacing={3}>
           
            <Grid item xs={12}>
              <TextField
                id="standard-basic"
                name="contractNumber"

                // value={formik.values.contractNumber}
                // onChange={formik.handleChange}
                label="Write message....."
                fullWidth
              />
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        {/* <Button onClick={handleClose} color="primary">
          Cancel
        </Button> */}
        <Button onClick={handleModalSubmit} color="primary">
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
}
