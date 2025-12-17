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

export default function ProviderWithdrawSuspensionModal(props: any) {
    const getInitialDateValues = () => {
        const now = new Date();
        return {
            timestamp: now.getTime(),
            date: now,
        };
    };

    const initialDateValues = getInitialDateValues();

    const validationSchema = yup.object({
        remarks: yup.string().required("Remarks are required"),
        endDate: yup.number().required("End date is required"),
    });

    const formik = useFormik({
        initialValues: {
            remarks: "",
            endDate: initialDateValues.timestamp,
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            handleModalSubmit();
        },
    });

    const [selectedEndDate, setSelectedEndDate] = React.useState<Date | null>(initialDateValues.date);

    React.useEffect(() => {
        if (props.openWithdrawSuspensionModal) {
            const fresh = getInitialDateValues();
            setSelectedEndDate(fresh.date);
            formik.resetForm({
                values: {
                    remarks: "",
                    endDate: fresh.timestamp,
                }
            });
        }
    }, [props.openWithdrawSuspensionModal]);

    const handleEndDateChange = (date: Date | null) => {
        if (!date) return;
        setSelectedEndDate(date);
        formik.setFieldValue('endDate', date.getTime());
        formik.setFieldTouched('endDate', true, false);
    };

    const handleModalSubmit = () => {
        const payload = {
            remarks: formik.values.remarks,
            endDate: formik.values.endDate,
        };
        props.handleWithdrawSuspensionSubmit(payload);
    };

    const handleClose = () => {
        formik.resetForm();
        props.closeWithdrawSuspensionModal();
    };

    return (
        <Dialog open={props.openWithdrawSuspensionModal} onClose={handleClose} aria-labelledby="form-dialog-title" disableEnforceFocus>
            <DialogTitle id="form-dialog-title">Withdraw Suspension</DialogTitle>
            <DialogContent>
                <form onSubmit={formik.handleSubmit}>
                    <Grid container spacing={3} style={{ marginBottom: "20px", marginTop: "10px" }}>
                        <Grid item xs={12}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="End Date"
                                    value={selectedEndDate}
                                    onChange={handleEndDateChange}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            fullWidth
                                            variant="outlined"
                                            error={formik.touched.endDate && Boolean(formik.errors.endDate)}
                                            helperText={formik.touched.endDate && formik.errors.endDate}
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

