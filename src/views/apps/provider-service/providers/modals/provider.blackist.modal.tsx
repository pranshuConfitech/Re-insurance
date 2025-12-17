import * as React from "react";

import { Button } from 'primereact/button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from "@mui/material/Grid";
import TextField from '@mui/material/TextField';

// import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
// import "date-fns";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useFormik } from "formik";


import * as yup from "yup";


export default function ProviderBlacklistModal(props:any) {
    const validationSchema = yup.object({
        remarks: yup.string().required("remark is required"),

    });

    const formik = useFormik({
        initialValues: {
            remarks: "",
            startDate: new Date().getTime()
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            handleModalSubmit();
        },
    });

    const [openBlacklistModal, setOpenBlacklistModal] = React.useState(false);

    // useEffect(() => {
    //     setOpenBlacklistModal(props.openBlacklistModal);
    // }, [props.openBlacklistModal]);


    const handleModalSubmit = () => {
        const payload = {
            startDate: formik.values.startDate,
            remarks: formik.values.remarks,
        }

        props.handleBlacklistSubmit(payload);
    }

    const handleClose = () => {
        props.closeBlacklistModal();
    }

    const [selectedStartDate, setSelectedStartDate] = React.useState(new Date());

    const handleStartDateChange = (date:any) => {
        setSelectedStartDate(date);
        const timestamp = new Date(date).getTime();

        formik.setFieldValue('startDate', timestamp);
    };


    return (

        <Dialog open={props.openBlacklistModal} onClose={handleClose} aria-labelledby="form-dialog-title" disableEnforceFocus>
            <DialogTitle id="form-dialog-title">Provider Blacklisting</DialogTitle>
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
                                    label="Start date"
                                    value={selectedStartDate}
                                    onChange={handleStartDateChange}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change ing date',
                                    }}
                                />
                            </MuiPickersUtilsProvider> */}
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                views={["year", "month", "day"]}

                                // value={selectedEnumerationdate}
                                // onChange={handleEnumerationDateChange}
                                label="Start date"
                                value={selectedStartDate}
                                onChange={handleStartDateChange}
                                renderInput={(params) => (
                                    <TextField
                                    {...params}
                                    margin="normal"
                                    style={{ width: '75%' }}
                                    variant="outlined" />
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
