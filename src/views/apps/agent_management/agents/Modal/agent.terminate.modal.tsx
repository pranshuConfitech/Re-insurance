import * as React from "react";

import { Button } from 'primereact/button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from "@mui/material/Grid";
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

// import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
// import "date-fns";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useFormik } from "formik";

import * as yup from "yup";
import { ClientRemarkService } from "@/services/remote-api/api/master-services";


export default function AgentTerminateModal(props: any) {
    const clientRemarkService = new ClientRemarkService();
    const [standardRemarkOptions, setStandardRemarkOptions] = React.useState<Array<{ name: string }>>([]);

    const validationSchema = yup.object({
        standardRemark: yup.string().required("Standard remark is required"),
        userRemark: yup.string(),
    });

    const formik = useFormik({
        initialValues: {
            standardRemark: "",
            userRemark: "",
            startDate: new Date().getTime()
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            handleModalSubmit();
        },
    });


    const handleModalSubmit = () => {
        const payload = {
            startDate: formik.values.startDate,
            remarks: formik.values.standardRemark, // Dropdown value
            standardRemarks: formik.values.userRemark, // Client input field
            agentIds: props.agentIds || [] // Array of agent IDs to terminate
        }

        props.handleTerminateSubmit(payload);
    }

    const handleClose = () => {
        props.closeTerminateModal();
    }

    const [selectedStartDate, setSelectedStartDate] = React.useState(new Date());

    const handleStartDateChange = (date: any) => {
        setSelectedStartDate(date);
        const timestamp = new Date(date).getTime();

        formik.setFieldValue('startDate', timestamp);
    };

    // Fetch client remarks on component mount
    React.useEffect(() => {
        const subscription = clientRemarkService.getClientRemarks({
            page: 0,
            size: 10,
            summary: true,
            active: true
        }).subscribe({
            next: (response) => {
                if (response.content) {
                    setStandardRemarkOptions(response.content);
                }
            },
            error: (error) => {
                console.error('Error fetching client remarks:', error);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    // Reset form when modal opens
    React.useEffect(() => {
        if (props.openTerminateModal) {
            formik.resetForm();
            setSelectedStartDate(new Date());
        }
    }, [props.openTerminateModal]);


    return (

        <Dialog open={props.openTerminateModal} onClose={handleClose} aria-labelledby="form-dialog-title" disableEnforceFocus>
            <DialogTitle id="form-dialog-title">Agent Suspension</DialogTitle>
            <DialogContent>
                <form onSubmit={formik.handleSubmit}>
                    <Grid container spacing={3} style={{ marginBottom: "20px" }}>
                        <Grid item xs={12}>
                            <FormControl fullWidth variant="outlined" error={formik.touched.standardRemark && Boolean(formik.errors.standardRemark)}>
                                <InputLabel id="standard-remark-label">Standard Remark *</InputLabel>
                                <Select
                                    labelId="standard-remark-label"
                                    id="standard-remark"
                                    name="standardRemark"
                                    value={formik.values.standardRemark}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    label="Standard Remark *"
                                    error={formik.touched.standardRemark && Boolean(formik.errors.standardRemark)}
                                >
                                    {standardRemarkOptions.map((option) => (
                                        <MenuItem key={option.name} value={option.name}>
                                            {option.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {formik.touched.standardRemark && formik.errors.standardRemark && (
                                    <span style={{ color: '#d32f2f', fontSize: '0.75rem', marginTop: '3px', marginLeft: '14px' }}>
                                        {formik.errors.standardRemark}
                                    </span>
                                )}
                            </FormControl>
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
                        <Grid item xs={12}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    views={["year", "month", "day"]}
                                    label="Start date"
                                    value={selectedStartDate}
                                    onChange={handleStartDateChange}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            margin="normal"
                                            style={{ width: '100%' }}
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
                <Button onClick={() => formik.handleSubmit()} color="primary">
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
}
