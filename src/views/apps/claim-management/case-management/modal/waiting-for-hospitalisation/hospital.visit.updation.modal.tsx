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
  remarks: yup.string().required('Remark is required'),
});

export default function HospitalVisitUpdationModal(props: any) {
  const classes = useStyles();

  const formik = useFormik({
    initialValues: {
      action: 'HOSPITAL_VISIT_UPDATION',
      estimatedCost: props.data?.estimatedCost || '',
      maxApprovedCost: props.data?.maxApprovedCost || '',
      costSavings: 0,
      remarks: '',
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: values => {
      props.admissionUpdationModalSubmit(values);
      props.handleCloseClaimModal();
    },
  });

  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState<any>('sm');

  React.useEffect(() => {
    let estimatedCost = 0;
    let maxApprovedCost = 0;

    if (Array.isArray(props.data)) {
      props.data.forEach((el: any) => {
        estimatedCost += Number(el.estimatedCost) || 0;
        maxApprovedCost += Number(el.approvedCost) || 0;
      });
    }

    formik.setValues({
      ...formik.values,
      estimatedCost,
      maxApprovedCost,
    });
  }, [props.data]);

  const handleClose = () => {
    props.handleCloseClaimModal();
  };

  const handleEdit = () => {
    // setState({ [`${e.target.name}`]: e.target.value });
  };

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
      <DialogTitle id="form-dialog-title">Hospital Visit Updation</DialogTitle>
      <DialogContent>
        <Grid container spacing={3} style={{ marginBottom: '20px' }}>
          <Grid item xs={6}>
            <TextField
              id="estimatedCost"
              name="estimatedCost"
              value={formik.values.estimatedCost}
              onChange={formik.handleChange}
              label="Estimated Amount"
              inputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              id="maxApprovedCost"
              name="maxApprovedCost"
              value={formik.values.maxApprovedCost}
              onChange={formik.handleChange}
              label="Sanction Amount"
              inputProps={{ readOnly: true }}
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
          <Grid item xs={12}>
            <FormControl fullWidth>
              <TextField
                id="remarks"
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
        <Button onClick={handleClose} color="primary" className="p-button-text">
          Cancel
        </Button>
        <Button onClick={handleModalSubmit} color="primary">
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}
