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
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import Asterisk from "@/views/apps/shared-component/components/red-asterisk";
import { makeStyles } from "@mui/styles";
import { HierarchyService } from "@/services/remote-api/api/hierarchy-services";

const useStyles = makeStyles(theme => ({
    input1: {
        width: '50%'
    },
    clientTypeRadioGroup: {
        flexWrap: 'nowrap',
        '& label': {
            flexDirection: 'row'
        }
    },
    formControl: {
        minWidth: '80%',
        maxWidth: '90%',
        margin: '0 auto'
    },
    inputLabel: {
        textAlign: 'center'
    },
    textField: {
        '& .MuiInputBase-input': {
            padding: '8px 14px',
            height: '1.4375em',
            display: 'flex',
            alignItems: 'center'
        },
        '& .MuiInputBase-root': {
            height: '40px'
        }
    },
    select: {
        '& .MuiSelect-select': {
            padding: '8px 14px',
            height: '1.4375em',
            display: 'flex',
            alignItems: 'center'
        },
        '& .MuiOutlinedInput-root': {
            height: '40px'
        },
        '& .MuiSelect-nativeInput': {
            padding: '8px 14px',
            height: '1.4375em',
            display: 'flex',
            alignItems: 'center'
        }
    }
}))

const branchService = new HierarchyService()

export default function UnitAssignModal(props: any) {
    const classes = useStyles()
    const [units, setUnits] = React.useState([])
    const [branches, setBranches] = React.useState([])
    const [region, setRegion]: any[] = React.useState([])

    const validationSchema = yup.object({
        region: yup.string().required("Region is required"),
        branch: yup.string().required("Branch is required"),
        unit: yup.string().required("Unit is required"),
        startDate: yup.string().required("Start date is required"),
        comment: yup.string(),
    });

    const formik = useFormik({
        initialValues: {
            region: "",
            branch: '',
            unit: "",
            startDate: new Date().getTime(),
            comment: "",
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            handleModalSubmit();
        },
    });

    React.useEffect(() => {
        populateRegion()
    }, [])

    React.useEffect(() => {
        if (props.unitAssignModal) {
            formik.resetForm({
                values: {
                    region: "",
                    branch: '',
                    unit: "",
                    startDate: new Date().getTime(),
                    comment: "",
                }
            })
            setSelectedStartDate(new Date())
        }
    }, [props.unitAssignModal])

    const populateRegion = () => {
        let pageRequest: any = {
            page: 0,
            size: 1000,
            summary: true,
            active: true
        }
        branchService.getRegion(pageRequest).subscribe(value => {
            let temp: any[] = []
            value.content.map((item: any) => {
                let obj = {
                    value: item.id,
                    label: item.name
                }
                temp.push(obj);
            })
            setRegion(temp);
        })
    }

    React.useEffect(() => {
        if (formik.values.region) {
            loadBranches()
        } else {
            setBranches([])
            formik.setFieldValue('branch', '')
        }
    }, [formik.values.region])

    const loadBranches = () => {
        branchService.getBranchesFromRegion(formik.values.region).subscribe({
            next: (response: any) => {
                const branchList = response.branches.map((branch: any) => ({
                    value: branch.id,
                    label: branch.centerName
                }))
                setBranches(branchList)
            }
        })
    }

    React.useEffect(() => {
        if (formik.values.branch) {
            loadUnit()
        } else {
            setUnits([])
            formik.setFieldValue('unit', '')
        }
    }, [formik.values.branch])

    const loadUnit = () => {
        branchService.getUnitsFromBranch(formik.values.branch).subscribe({
            next: (response: any) => {
                const unitList = response.units.map((unit: any) => ({
                    value: unit.id,
                    label: unit.name
                }))
                setUnits(unitList)
            }
        })
    }

    const handleModalSubmit = () => {
        const payload = {
            startDate: formik.values.startDate,
            unitId: formik.values.unit,
            comment: formik.values.comment,
        }
        props.handleAssignUnitSubmit(payload);
    }

    const handleClose = () => {
        formik.resetForm()
        props.closeAssignUnitModal();
    }

    const [selectedStartDate, setSelectedStartDate] = React.useState(new Date());

    const handleStartDateChange = (date: any) => {
        setSelectedStartDate(date);
        const timestamp = new Date(date).getTime();
        formik.setFieldValue('startDate', timestamp);
    };

    return (
        <Dialog
            open={props.unitAssignModal}
            onClose={handleClose}
            aria-labelledby="form-dialog-title"
            disableEnforceFocus
            maxWidth="md"
            fullWidth={true}
        >
            <DialogTitle id="form-dialog-title">Assign Unit</DialogTitle>
            <DialogContent >
                <form onSubmit={formik.handleSubmit}>
                    <Grid container spacing={2} sx={{ pt: 1 }}>
                        <Grid item xs={12} sm={6} md={3}>
                            <FormControl
                                fullWidth
                                size="small"
                                error={formik.touched.region && Boolean(formik.errors.region)}
                            >
                                <InputLabel id="region-label">
                                    Region <Asterisk />
                                </InputLabel>
                                <Select
                                    labelId="region-label"
                                    id="region"
                                    name="region"
                                    value={formik.values.region}
                                    onChange={formik.handleChange}
                                    label="Region *"
                                    MenuProps={{
                                        disablePortal: false,
                                        anchorOrigin: {
                                            vertical: "bottom",
                                            horizontal: "left",
                                        },
                                        transformOrigin: {
                                            vertical: "top",
                                            horizontal: "left",
                                        },
                                        PaperProps: {
                                            style: {
                                                maxHeight: 250
                                            }
                                        }
                                    }}
                                >
                                    {region.map((item: any) => (
                                        <MenuItem
                                            key={item.value}
                                            value={item.value}
                                        >
                                            {item.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <FormControl
                                fullWidth
                                size="small"
                                error={formik.touched.branch && Boolean(formik.errors.branch)}
                            >
                                <InputLabel id="branch-label">
                                    Branch <Asterisk />
                                </InputLabel>
                                <Select
                                    labelId="branch-label"
                                    id="branch"
                                    name="branch"
                                    value={formik.values.branch}
                                    onChange={formik.handleChange}
                                    label="Branch *"
                                    disabled={!formik.values.region || branches.length === 0}
                                    MenuProps={{
                                        disablePortal: false,
                                        anchorOrigin: {
                                            vertical: "bottom",
                                            horizontal: "left",
                                        },
                                        transformOrigin: {
                                            vertical: "top",
                                            horizontal: "left",
                                        },
                                        PaperProps: {
                                            style: {
                                                maxHeight: 250
                                            }
                                        }
                                    }}
                                >
                                    {branches.map((branch: any) => (
                                        <MenuItem key={branch.value} value={branch.value}>
                                            {branch.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <FormControl
                                fullWidth
                                size="small"
                                error={formik.touched.unit && Boolean(formik.errors.unit)}
                            >
                                <InputLabel id="unit-label">
                                    Unit <Asterisk />
                                </InputLabel>
                                <Select
                                    labelId="unit-label"
                                    id="unit"
                                    name="unit"
                                    value={formik.values.unit}
                                    onChange={formik.handleChange}
                                    label="Unit *"
                                    disabled={!formik.values.branch || units.length === 0}
                                    MenuProps={{
                                        disablePortal: false,
                                        anchorOrigin: {
                                            vertical: "bottom",
                                            horizontal: "left",
                                        },
                                        transformOrigin: {
                                            vertical: "top",
                                            horizontal: "left",
                                        },
                                        PaperProps: {
                                            style: {
                                                maxHeight: 250
                                            }
                                        }
                                    }}
                                >
                                    {units.map((unit: any) => (
                                        <MenuItem key={unit.value} value={unit.value}>
                                            {unit.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    views={['year', 'month', 'day']}
                                    label='Start Date *'
                                    value={selectedStartDate}
                                    onChange={handleStartDateChange}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            fullWidth
                                            size="small"
                                            required
                                            error={formik.touched.startDate && Boolean(formik.errors.startDate)}
                                            helperText={formik.touched.startDate && formik.errors.startDate}
                                        />
                                    )}
                                />
                            </LocalizationProvider>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                id="comment"
                                name="comment"
                                label="Comment/Message"
                                placeholder="Enter approval comment or message..."
                                value={formik.values.comment}
                                onChange={formik.handleChange}
                                variant="outlined"
                                size="small"
                            />
                        </Grid>
                    </Grid>
                </form>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button onClick={handleClose}>
                    Cancel
                </Button>
                <Button onClick={() => formik.handleSubmit()}>
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
}
