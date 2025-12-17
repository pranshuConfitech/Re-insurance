import * as React from "react";

import { Button } from 'primereact/button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from "@mui/material/Grid";
import TextField from '@mui/material/TextField';

import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useFormik } from "formik";
import * as yup from "yup";

interface WithdrawTerminationModalProps {
  visible: boolean
  onHide: () => void
  onSubmit: (payload: any) => void
  agentId: string
}

export default function AgentWithdrawTerminationModal({
  visible,
  onHide,
  onSubmit,
  agentId
}: WithdrawTerminationModalProps) {

  const validationSchema = yup.object({
    endDate: yup.date().required("End date is required").nullable(),
    userRemark: yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      endDate: new Date().getTime(),
      userRemark: ""
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleModalSubmit();
    },
  });

  const handleModalSubmit = () => {
    const payload = {
      endDate: formik.values.endDate,
      withdrawRemarks: formik.values.userRemark,
      agentIds: [agentId]
    }

    onSubmit(payload);
    handleClose();
  }

  const handleClose = () => {
    formik.resetForm();
    setSelectedEndDate(new Date());
    onHide();
  }

  const [selectedEndDate, setSelectedEndDate] = React.useState(new Date());

  const handleEndDateChange = (date: any) => {
    setSelectedEndDate(date);
    const timestamp = new Date(date).getTime();
    formik.setFieldValue('endDate', timestamp);
  };

  return (
    <Dialog
      open={visible}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
      disableEnforceFocus
    >
      <DialogTitle id="form-dialog-title">Withdraw Termination</DialogTitle>
      <DialogContent>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3} style={{ marginBottom: "20px" }}>
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  views={["year", "month", "day"]}
                  label="End Date *"
                  value={selectedEndDate}
                  onChange={handleEndDateChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      margin="normal"
                      style={{ width: '100%' }}
                      variant="outlined"
                      error={formik.touched.endDate && Boolean(formik.errors.endDate)}
                      helperText={formik.touched.endDate && formik.errors.endDate}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="user-remark"
                name="userRemark"
                value={formik.values.userRemark}
                onChange={formik.handleChange}
                label="User Remark"
                variant="outlined"
                multiline
                rows={3}
                error={formik.touched.userRemark && Boolean(formik.errors.userRemark)}
                helperText={formik.touched.userRemark && formik.errors.userRemark}
              />
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
