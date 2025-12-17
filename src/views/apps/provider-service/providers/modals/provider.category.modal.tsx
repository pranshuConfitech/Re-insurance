import * as React from "react";

import { Button } from 'primereact/button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { makeStyles } from "@mui/styles";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

// import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
// import "date-fns";
import { useFormik } from "formik";


import * as yup from "yup";
import TextField from '@mui/material/TextField';


const validationSchema = yup.object({
    categoryId: yup.string().required("Category is required"),
    planId: yup.string().required("Plan is required")
});

const useStyles = makeStyles((theme:any) => ({
    input1: {
        width: "50%",
    },
    clientTypeRadioGroup: {
        flexWrap: "nowrap",
        "& label": {
            flexDirection: "row",
        },
    },
    formControl: {
        width: "100%"
    },
    formControl1: {
        margin: theme?.spacing?theme?.spacing(1):'8px',
        minWidth: 120,
        maxWidth: 300,
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    chip: {
        margin: 2,
    },
}));

export default function ProviderCategorizeModal(props:any) {
    const classes = useStyles();

    const formik = useFormik({
        initialValues: {
            categoryId: "",
            planId: "",
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
            planId: formik.values.planId,
            categoryId: formik.values.categoryId,

            // providerIds: props.providerIds
        }

        props.handleCategorizeSubmit(payload);
    }

    const handleClose = () => {
        props.closeCategorizeModal();
    }

    const [selectedStartDate, setSelectedStartDate] = React.useState(new Date());

    const handleStartDateChange = (date:any) => {
        setSelectedStartDate(date);
        const timestamp = new Date(date).getTime();

        formik.setFieldValue('startDate', timestamp);
    };

    return (

        <Dialog open={props.openCategoryModal} onClose={handleClose} aria-labelledby="form-dialog-title" disableEnforceFocus>
            <DialogTitle id="form-dialog-title">Provider Category</DialogTitle>
            <DialogContent>
                <form onSubmit={formik.handleSubmit}>
                    <Grid container spacing={3} style={{ marginBottom: "20px" }}>
                        {/* <Grid item xs={12}>
                            <FormControl className={classes.formControl}>
                                <InputLabel
                                    id="demo-simple-select-label"
                                    style={{ marginBottom: "0px" }}
                                >
                                    Plan
                                </InputLabel>
                                <Select label=""
                                    labelId="demo-simple-select-label"
                                    name="planId"
                                    id="demo-simple-select"
                                    value={formik.values.planId}
                                    onChange={formik.handleChange}
                                    error={formik.touched.planId && Boolean(formik.errors.planId)}
                                    helperText={formik.touched.planId && formik.errors.planId}
                                >
                                    {props.planList.map((ele) => {
                                        return <MenuItem value={ele.id}>{ele.name}</MenuItem>;
                                    })}
                                </Select>
                            </FormControl>
                        </Grid> */}
                        <Grid item xs={12}>
                            <FormControl className={classes.formControl}>
                                <InputLabel
                                    id="demo-simple-select-label"
                                    style={{ marginBottom: "0px" }}
                                >
                                    Category
                                </InputLabel>
                                <Select label="Category"
                                    labelId="demo-simple-select-label"
                                    name="categoryId"
                                    id="demo-simple-select"
                                    value={formik.values.categoryId}
                                    onChange={formik.handleChange}
                                    error={formik.touched.categoryId && Boolean(formik.errors.categoryId)}

                                    // helperText={formik.touched.categoryId && formik.errors.categoryId}
                                >
                                    {props.categoryList.map((ele:any) => {
                                        return <MenuItem key={ele.id} value={ele.id}>{ele.name}</MenuItem>;
                                    })}
                                </Select>
                            </FormControl>
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
                                label="Start date"
                                value={selectedStartDate}
                                onChange={handleStartDateChange}
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
