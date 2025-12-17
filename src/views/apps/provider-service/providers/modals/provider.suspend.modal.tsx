import * as React from "react";

import { Button } from 'primereact/button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from "@mui/material/Grid";
import TextField from '@mui/material/TextField';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useFormik } from "formik";
import * as yup from "yup";

export default function ProviderSuspendModal(props: any) {
    const validationSchema = yup.object({
        remarks: yup.string().required("Remarks are required"),
        startDate: yup.number().required("Start date is required"),
    });

    const getInitialDateValues = () => {
        const now = new Date();
        return {
            timestamp: now.getTime(),
            date: now,
        };
    };

    const initialDateValues = getInitialDateValues();

    const formik = useFormik({
        initialValues: {
            remarks: "",
            startDate: initialDateValues.timestamp,
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            handleModalSubmit();
        },
    });

    const [selectedStartDate, setSelectedStartDate] = React.useState<Date | null>(initialDateValues.date);

    React.useEffect(() => {
        if (props.openSuspendModal) {
            const fresh = getInitialDateValues();
            setSelectedStartDate(fresh.date);
            formik.resetForm({
                values: {
                    remarks: "",
                    startDate: fresh.timestamp,
                },
            });
        }
    }, [props.openSuspendModal]);

    const handleStartDateChange = (date: Date | null) => {
        if (!date) return;
        setSelectedStartDate(date);
        formik.setFieldValue('startDate', date.getTime());
        formik.setFieldTouched('startDate', true, false);
    };

    const handleModalSubmit = () => {
        const payload = {
            remarks: formik.values.remarks,
            effectiveDate: formik.values.startDate,
        };
        props.handleSuspendSubmit(payload);
    };

    const handleClose = () => {
        formik.resetForm();
        props.closeSuspendModal();
    };

    return (
        <Dialog open={props.openSuspendModal} onClose={handleClose} aria-labelledby="form-dialog-title" disableEnforceFocus>
            <DialogTitle id="form-dialog-title">Suspend Provider</DialogTitle>
            <DialogContent>
                <form onSubmit={formik.handleSubmit}>
                    <Grid container spacing={3} style={{ marginBottom: "20px", marginTop: "10px" }}>
                        <Grid item xs={12}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="Start Date"
                                    value={selectedStartDate}
                                    onChange={handleStartDateChange}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            fullWidth
                                            variant="outlined"
                                            error={formik.touched.startDate && Boolean(formik.errors.startDate)}
                                            helperText={formik.touched.startDate && formik.errors.startDate}
                                            required
                                        />
                                    )}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                id="remarks"
                                name="remarks"
                                value={formik.values.remarks}
                                onChange={formik.handleChange}
                                error={formik.touched.remarks && Boolean(formik.errors.remarks)}
                                helperText={formik.touched.remarks && formik.errors.remarks}
                                label="Remarks"
                                multiline
                                rows={4}
                                fullWidth
                                variant="outlined"
                                required
                            />
                        </Grid>
                    </Grid>
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} label="Cancel" />
                <Button onClick={handleModalSubmit} label="Submit" />
            </DialogActions>
        </Dialog>
    );
}

