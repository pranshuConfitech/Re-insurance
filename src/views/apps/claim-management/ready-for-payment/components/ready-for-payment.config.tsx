
import React from "react";

import { useRouter } from "next/navigation";

import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper"
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid"
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { useFormik } from "formik";
import { Button } from 'primereact/button';
import { makeStyles } from "@mui/styles";
import Divider from "@mui/material/Divider";
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import * as yup from "yup";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const useStyles = makeStyles((theme:any) => ({
    serviceDesignRoot: {
        flexGrow: 1,
        minHeight: 100,
        padding: 30,
    },
    header: {
        paddingTop: 10,
        paddingBottom: 10,
        color: "#4472C4",
    },
    formControl: {
        margin: theme.spacing?theme.spacing(1):'8px',
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
    tableBg: {
        height: 400,
        width: "100%",
        backgroundColor: "#fff",
        boxShadow:
            "0px 3px 3px -2px rgb(0 0 0 / 20%), 0px 3px 4px 0px rgb(0 0 0 / 14%), 0px 1px 8px 0px rgb(0 0 0 / 12%)",
        borderRadius: "4px",
    },
    clientAutoComplete: {
        width: 500,
        "& .MuiInputBase-formControl": {
            maxHeight: 200,
            overflowX: "hidden",
            overflowY: "auto",
        }
    }
}));

const validationSchema = yup.object({
    percentageOfFundExhausted: yup.number().typeError('Must be digits')
        .required('Field is required'),
    alertMessage: yup.string().required('Field is required')
})

// function useQuery1() {
//     return new URLSearchParams(useLocation().search);
// }

const RenewalConfigForm = () => {
    const history = useRouter();

    // const query = useSearchParams();
    // const { id } = useParams();
    const [rows, setRows] = React.useState([])
    const classes = useStyles();

    const formik = useFormik({
        initialValues: {
            percentageOfFundExhausted: '',
            alertMessage: '',
            alertModeEmail: false,
            alertModeSms: false,
            alertModeWhatsapp: false,
            restrictClaim: false,
            groupClient: []

        },
        validationSchema: validationSchema,
        onSubmit: (values, { resetForm }) => {

            resetForm()
        },
    })

    const GroupClients = [
        { id: 12232, name: 'TCS' },
        { id: 323232, name: 'Acclaris' },
        { id: 23231, name: 'Accenture' },
        { id: 2321, name: 'Capgemini' },
        { id: 233231, name: 'Tech Mahindra' },
        { id: 23232, name: 'HCL' },
        { id: 72323, name: 'IBM' },
        { id: 3235454, name: 'HP' },
        { id: 32323, name: 'CTS' },
        { id: 12320, name: 'Wipro' }
    ];

    const handleSaveNExit = () => {
    }

    const handleClose = (event:any) => {
        history.push('/renewals/pending?mode=viewList');

        // window.location.reload();
    };


    return (
        <div className={classes.serviceDesignRoot}>
            <Paper elevation={0}>
                <Box p={3} my={2}>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <Grid item xs={3} className={classes.header}>
                                <h3>Renewal Config</h3>
                            </Grid>
                        </Grid>
                    </Grid>
                    <form onSubmit={formik.handleSubmit}>
                        <Grid container alignItems="center" style={{ padding: "20px" }}>
                            <Grid item style={{ paddingLeft: '10%' }} xs={4}>
                                <InputLabel id="percentage">
                                    Percentage Of Fund Exhausted
                                </InputLabel>
                            </Grid>
                            <Grid item xs={8}>
                                <TextField
                                    style={{ maxWidth: "100px" }}
                                    id="percentageOfFundExhausted"
                                    name="percentageOfFundExhausted"
                                    value={formik.values.percentageOfFundExhausted}
 
                                    onChange={formik.handleChange}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">%</InputAdornment>
                                    }}
                                    error={formik.touched.percentageOfFundExhausted && Boolean(formik.errors.percentageOfFundExhausted)}
                                    helperText={formik.touched.percentageOfFundExhausted && formik.errors.percentageOfFundExhausted}
                                />
                            </Grid>
                        </Grid>

                        <Grid container alignItems='flex-start' style={{ padding: "20px" }}>
                            <Grid item style={{ paddingLeft: '10%' }} xs={4}>
                                <InputLabel id="alertMessage">
                                    Alert Message
                                </InputLabel>
                            </Grid>
                            <Grid item xs={8}>
                                <TextField
                                    id="alertMessage"
                                    name="alertMessage"
                                    type='text'
                                    multiline
                                    rows={5}
                                    value={formik.values.alertMessage}
                                    onChange={formik.handleChange}
                                    error={formik.touched.alertMessage && Boolean(formik.errors.alertMessage)}
                                    helperText={formik.touched.alertMessage && formik.errors.alertMessage}
                                />
                            </Grid>
                        </Grid>

                        <Grid container alignItems="center" style={{ padding: "20px" }}>
                            <Grid item style={{ paddingLeft: '10%' }} xs={4}>
                                <InputLabel id="alertMessage">
                                    Alert Mode
                                </InputLabel>
                            </Grid>
                            <Grid item xs={8}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={formik.values.alertModeEmail}
                                            onChange={formik.handleChange}
                                            name="alertModeEmail"
                                            color="primary"
                                        />
                                    }
                                    label="Email"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={formik.values.alertModeSms}
                                            onChange={formik.handleChange}
                                            name="alertModeSms"
                                            color="primary"
                                        />
                                    }
                                    label="SMS"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={formik.values.alertModeWhatsapp}
                                            onChange={formik.handleChange}
                                            name="alertModeWhatsapp"
                                            color="primary"
                                        />
                                    }
                                    label="Whatsapp"
                                />
                            </Grid>
                        </Grid>
                        <Grid container alignItems="center" style={{ padding: "20px" }}>
                            <Grid item style={{ paddingLeft: '10%' }} xs={4}>
                                <InputLabel id="alertMessage">
                                    Restrict Claim Processing
                                </InputLabel>
                            </Grid>
                            <Grid item xs={8}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={formik.values.restrictClaim}
                                            onChange={formik.handleChange}
                                            name="restrictClaim"
                                            color="primary"
                                        />
                                    }
                                    label="Restrict"
                                />
                            </Grid>
                        </Grid>
                        <Grid container alignItems="center" style={{ padding: "20px" }}>
                            <Grid item style={{ paddingLeft: '10%' }} xs={4}>
                                <InputLabel id="alertMessage">
                                    Group Clients
                                </InputLabel>
                            </Grid>
                            <Grid item xs={8} >

                            </Grid>
                        </Grid>
                    </form >
                    <Divider />
                    <Box m={1} display="flex" justifyContent="flex-end" alignItems="flex-end">
                        <Button onClick={handleSaveNExit} color="primary" icon="pi pi-save" iconPos="right" >
                            SAVE & EXIT
                        </Button>
                    </Box>

                </Box >
            </Paper >
        </div>

    )
}

export default RenewalConfigForm
