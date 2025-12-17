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

// import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
// import "date-fns";
import { useFormik } from "formik";


import * as yup from "yup";


export default function ProviderUnBlacklistModal(props:any) {
    const validationSchema = yup.object({
        remarks: yup.string().required("remark is required"),

    });

    const formik = useFormik({
        initialValues: {
            remarks: "",
            endDate: new Date().getTime()
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            handleModalSubmit();
        },
    });

    const [openUnBlacklistModal, setOpenBlacklistModal] = React.useState(false);


    const handleModalSubmit = () => {
        const payload = {
            endDate: formik.values.endDate,
            remarks: formik.values.remarks,
        }

        props.handleUnBlacklistSubmit(payload);
    }

    const handleClose = () => {
        props.closeUnBlacklistModal();
    }

    const [selectedEndDate, setSelectedStartDate] = React.useState(new Date());

    const handleEndDateChange = (date:any) => {
        setSelectedStartDate(date);
        const timestamp = new Date(date).getTime();

        formik.setFieldValue('endDate', timestamp);
    };


    return (

        <Dialog open={props.openUnBlacklistModal} onClose={handleClose} aria-labelledby="form-dialog-title" disableEnforceFocus>
            <DialogTitle id="form-dialog-title">Provider Un-Blacklisting</DialogTitle>
            <DialogContent>
                <form onSubmit={formik.handleSubmit}>
                    <Grid container spacing={3} style={{ marginBottom: "20px" }}>
                        <Grid item xs={12}>
                            <TextField
                                id="standard-basic"
                                name="remarks"
                                value={formik.values.remarks}
                                onChange={formik.handleChange}
                                label="Remarks"
                            />

                        </Grid>
                        <Grid item xs={12}>
                            {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardDatePicker
                                    views={["year", "month", "date"]}
                                    variant="inline"
                                    format="dd/MM/yyyy"
                                    margin="normal"
                                    id="date-picker-inline"
                                    label="End date"
                                    value={selectedEndDate}
                                    onChange={handleEndDateChange}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change ing date',
                                    }}
                                />
                            </MuiPickersUtilsProvider> */}
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                views={["year", "month", "day"]}
                                label="End date"
                                value={selectedEndDate}
                                onChange={handleEndDateChange}
                                renderInput={(params) => (
                                    <TextField
                                    {...params}
                                    margin="normal"
                                    style={{margin:'normal'}}
                                    variant="outlined"
                                    />
                                )}
                                />
                            </LocalizationProvider>
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
