import React, { useEffect, useState } from "react";
import {
    Box, Button, Card, Grid, Typography, MenuItem, FormControl, FormLabel, InputLabel, Select, TextField, Divider, Paper, Tooltip, IconButton,
    Autocomplete,
    Checkbox,
    Snackbar,
    Alert
} from "@mui/material";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { makeStyles } from "@mui/styles";
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import { BenefitService, defaultPageRequest, ProductService } from "@/services/remote-api/fettle-remote-api";
import { ReinsuranceService } from "@/services/remote-api/api/reinsurance-services/reinsurance.service";
import { useRouter, useParams } from "next/navigation";

// const treatyTypes = ["Surplus", "Facultative", "Quota Share", "Excess of Loss(Per Risk)", "Excess of Loss(Catastrophe)", "Stop Loss XL", "Aggregate Excess of Loss"];
const treatyTypes = ["Proportional", "Non-Proportional"];

const icon = <CheckBoxOutlineBlankIcon fontSize='small' />
const checkedIcon = <CheckBoxIcon fontSize='small' />

const productService = new ProductService()
const reinsuranceService = new ReinsuranceService()

const pageRequest = { ...defaultPageRequest }
pageRequest.size = 100000

type Detail = {
    limit: string | number;
    surplusLayer: string | number;
};

const defaultForm: any = {
    configurationName: '',
    treatyName: treatyTypes[0],
    validFrom: '',
    validTo: '',
    retentionLimit: '',
    treatyProducts: [],
    obRiLimitCommission: '',
    obRiLimit: '',
    obReinsurer: '',
    facultativeReinsurance: '0',
    retentionCommission: '0',
    reinsuranceLayers: [{
        reinsurer: '',
        limit: '',
        surplusLayer: '',
        commission: '',
    } as Detail]
};

const useStyles = makeStyles(() => ({
    buttonPrimary: {
        backgroundColor: '#D80E51',
        color: '#f1f1f1'
    },
    buttonSecondary: {
        backgroundColor: '#01de74',
        color: '#f1f1f1'
    }
}));

export default function TreatyConfigFormComponent() {
    const router = useRouter();
    const [form, setForm] = useState(defaultForm);
    const [productList, setProductList] = useState<any[]>([]);
    const [isAllBenefitSelected, setIsAllBenefitSelected] = React.useState(false)
    const [alertMsg, setAlertMsg] = React.useState('')
    const [openSnack, setOpenSnack] = React.useState(false)
    const classes = useStyles();
    const id: any = useParams().id

    useEffect(() => {
        productService.getProducts(pageRequest).subscribe(response => {
            setProductList(
                response.content.map((el: any) => ({ id: el.id, name: el.productBasicDetails.name }))
            )
        })
    }, []);

    useEffect(() => {
        if (id) {
            populateData(id)
        }
    }, [id]);

    const populateData = (id: any) => {
        reinsuranceService.getTreatyById(id).subscribe((res: any) => {
            setForm(res.data)
        })
    }

    const onSave = () => {
        let temp: any = [];
        form.reinsuranceLayers.forEach((el: any, i: number) => {
            let obj = {
                ...el,
                surplusLayer: i + 1,
            }
            temp.push(obj);
        })
        let payload = {
            ...form,
            reinsuranceLayers: temp,
            validFrom: new Date(form.validFrom).getTime(),
            validTo: new Date(form.validTo).getTime(),
        }
        if (id) {
            reinsuranceService.updateTreaty(id, payload).subscribe((res: any) => {
                setAlertMsg('Treaty Updated Successfully');
                setOpenSnack(true);
                router.replace("/reinsurance/treaty-config?mode=viewList");
            })
        } else {
            reinsuranceService.saveTreaty(payload).subscribe((res: any) => {
                setAlertMsg('Treaty Created Successfully');
                setOpenSnack(true);
                router.replace("/reinsurance/treaty-config?mode=viewList");
            })
        }
    };

    // Add/Remove reinsuranceLayers handlers
    const handleAddDetail = () => {
        const newDetails = [...form.reinsuranceLayers, {
            limit: '',
            surplusLayer: '',
            commission: '',
        }];

        setForm({ ...form, reinsuranceLayers: newDetails });
    };

    const handleDetailChange = (idx: number, field: any, value: any) => {
        const newDetails: any = [...form.reinsuranceLayers];
        newDetails[idx][field] = value;
        setForm({ ...form, reinsuranceLayers: newDetails });
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any) => {
        const { name, value } = e.target || {};
        setForm({ ...form, [name]: value });
    };

    const handleRemoveDetail = (index: any) => {
        const newDetails: any = [...form.reinsuranceLayers]

        newDetails.splice(index, 1)
        setForm({ ...form, reinsuranceLayers: newDetails });
    }

    // const handleProductChange = (e: any, val: any) => {
    //     let selectedBenefits = val
    //     const isSelecAll = selectedBenefits.some((item: any) => item.id === 'selectall')

    //     // if (isSelecAll) {
    //     //     if (benefitList.length > 0 && benefitList.length === values.benefits.length) {
    //     //         selectedBenefits = []
    //     //     } else {
    //     //         selectedBenefits = benefitList
    //     //     }
    //     // }

    //     // setFieldValue('benefits', selectedBenefits)
    // }

    const autocompleteFilterChange = (options: any, state: any) => {
        if (state.inputValue) {
            return options.filter((item: any) => item.name.toLowerCase().indexOf(state.inputValue) > -1)
        }

        return [{ id: 'selectall', name: 'Select all' }, ...options]
    }

    const handleProductChange = (e: any, val: any) => {
        let isSelectedAll
        const allSelectIndex = val.findIndex((item: { id: string }) => item.id === 'selectall')
        if (allSelectIndex > -1) {
            if (allSelectIndex === 0) {
                //'ALL is selected before and unchecking item;
                const arr = [...val]
                const toberemoved = arr.splice(1, 1)
                const toBePushed = [...productList]
                const beRemovedIndex = toBePushed.findIndex((item: { id: string }) => item?.id === toberemoved[0]?.id)

                toBePushed.splice(beRemovedIndex, 1)
                val = null
                val = [...toBePushed]
                // formik.setFieldValue('agentCommissionBenefits', toBePushed)
                setForm({ ...form, treatyProducts: toBePushed });
                setIsAllBenefitSelected(false)

                return
            }

            if ((val.length > 1 && allSelectIndex !== 0) || val.length === 1) {
                //'ALL' selected at first choice.
                val = null
                val = [{ id: 'selectall', name: 'ALL' }, ...productList]
                // formik.setFieldValue('agentCommissionBenefits', [{ id: 'selectall', name: 'ALL' }])
                setForm({ ...form, treatyProducts: [{ id: 'selectall', name: 'ALL' }] });
                setIsAllBenefitSelected(true)

                return
            }
        } else {
            if (val.length === productList.length && productList.length > 0) {
                val = null
                val = [{ id: 'selectall', name: 'ALL' }, ...productList]
                // formik.setFieldValue('agentCommissionBenefits', [{ id: 'selectall', name: 'ALL' }])
                setForm({ ...form, treatyProducts: [{ id: 'selectall', name: 'ALL' }] });
                setIsAllBenefitSelected(true)
            } else {
                // formik.setFieldValue('agentCommissionBenefits', val)
                setForm({ ...form, treatyProducts: val });
                setIsAllBenefitSelected(false)
            }
        }
    }

    const handleMsgErrorClose = () => {
        setOpenSnack(false)
        setAlertMsg('')
    }

    return (
        <Box p={4} sx={{ minHeight: '100vh', background: "#f9f9fb" }}>
            <Snackbar
                open={openSnack}
                autoHideDuration={4000}
                onClose={handleMsgErrorClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={handleMsgErrorClose} severity='success'>
                    {alertMsg}
                </Alert>
            </Snackbar>
            <Card sx={{ p: 2, maxWidth: 1100, borderRadius: 2, boxShadow: 2 }}>
                {/* <Typography variant="h5" mb={2} fontWeight={600} color="primary">
                    Treaty Configuration
                </Typography>
                <Divider sx={{ mb: 3 }} /> */}

                {/* Basic Info */}
                <Typography variant="subtitle1" fontWeight={500} gutterBottom>Basic Information</Typography>
                <Grid container spacing={2} mb={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField label="Configuration Name" name="configurationName" value={form.configurationName}
                            onChange={handleFormChange} size="small" fullWidth required />
                    </Grid>
                </Grid>
                <Grid container spacing={2} mb={2} sx={{ my: 3 }}>
                    {/* <Grid item xs={12} sm={4}>
                        <FormControl fullWidth size="small">
                            <InputLabel>* Select Treaty</InputLabel>
                            <Select name="treatyName" label="* SELECT TREATY" value={form.treatyName}
                                onChange={handleFormChange}>
                                {treatyTypes.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                            </Select>
                        </FormControl> 
                    </Grid>*/}
                    <Grid item xs={12} sm={4}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label="* Valid From"
                                value={form.validFrom || ''}
                                onChange={(date: any) => setForm({ ...form, validFrom: date })}
                                renderInput={params => <TextField {...params} name="validFrom" size="small" fullWidth required />}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label="* Valid To"
                                value={form.validTo || ''}
                                onChange={(date: any) => setForm({ ...form, validTo: date })}
                                renderInput={params => <TextField {...params} name="validTo" size="small" fullWidth required />}
                            />
                        </LocalizationProvider>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* Details Section */}
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>Obligatory Reinsurance</Typography>
                {/* <Paper variant="outlined" sx={{ p: 2, mb: 3 }}> */}
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={3}>
                        <Select
                            name="obReinsurer"
                            label="* Reinsurer"
                            value={form.obReinsurer}
                            onChange={handleFormChange}
                            sx={{ minWidth: 260 }}
                            size="small"
                        >
                            {["Reinsurer 1", "Reinsurer 2", "Reinsurer 3"].map((opt: any) => (
                                <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                            ))}
                        </Select>
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            label="Limit (%)"
                            name="obRiLimit"
                            size="small"
                            fullWidth
                            value={form.obRiLimit}
                            onChange={handleFormChange}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            label="Commission Inward (%)"
                            name="obRiLimitCommission"
                            size="small"
                            fullWidth
                            value={form.obRiLimitCommission}
                            onChange={handleFormChange}
                        />
                    </Grid>
                </Grid>
                {/* </Paper> */}
                <Divider sx={{ my: 3 }} />
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>Retention Reinsurance</Typography>
                {/* <Paper variant="outlined" sx={{ p: 2, mb: 3 }}> */}
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={3}>
                        <TextField
                            label="Retention Limit"
                            name="retentionLimit"
                            size="small"
                            fullWidth
                            value={form.retentionLimit}
                            onChange={handleFormChange}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        {/* <TextField
                            label="Retention Commission (%)"
                            name="retentionCommission"
                            size="small"
                            fullWidth
                            value={form.retentionCommission}
                            disabled
                        // onChange={handleFormChange}
                        /> */}
                    </Grid>
                </Grid>
                {/* </Paper> */}
                <Divider sx={{ my: 3 }} />

                {/* Details Section */}
                <Typography variant="subtitle1" fontWeight={500} gutterBottom>Reinsurance Layer</Typography>
                <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={2}><b>Surplus Layer</b></Grid>
                        <Grid item xs={3}><b>Re-insurer</b></Grid>
                        <Grid item xs={3}><b>Limit (%)</b></Grid>
                        <Grid item xs={3}><b>{`Comission (%)`}</b></Grid>
                        <Grid item xs={1}></Grid>
                        {form.reinsuranceLayers.map((detail: any, index: number) => (
                            <React.Fragment key={index}>
                                <Grid item xs={2}>{index + 1}</Grid>
                                <Grid item xs={3}>
                                    <Select
                                        name="obReinsurer"
                                        label="* Reinsurer"
                                        value={detail.reinsurer}
                                        onChange={e => handleDetailChange(index, "reinsurer", e.target.value)}
                                        sx={{ minWidth: 260 }}
                                        size="small"
                                    >
                                        {["Reinsurer 1", "Reinsurer 2", "Reinsurer 3"].map((opt: any) => (
                                            <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                                        ))}
                                    </Select>
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        label="Limit (%)"
                                        name="limit"
                                        value={detail.limit}
                                        onChange={e => handleDetailChange(index, "limit", e.target.value)}
                                        size="small"
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        label="Commission"
                                        name="commission"
                                        value={detail.commission}
                                        onChange={e => handleDetailChange(index, "commission", e.target.value)}
                                        size="small"
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={1} sx={{ display: "flex", alignItems: "center" }}>
                                    {form.reinsuranceLayers.length > 1 && (
                                        <Tooltip title="Remove">
                                            <IconButton color="error" onClick={() => handleRemoveDetail(index)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                    {form.reinsuranceLayers.length - 1 === index && (
                                        <Tooltip title="Add">
                                            <IconButton color="primary" onClick={handleAddDetail}>
                                                <AddIcon />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                </Grid>
                            </React.Fragment>
                        ))}
                    </Grid>
                </Paper>

                <Divider sx={{ my: 3 }} />
                {/* <Typography variant="subtitle1" fontWeight={600} gutterBottom>Facultative Layer</Typography>
                <Typography variant="subtitle2" fontWeight={500} gutterBottom>Any claim amount more than {form.reinsuranceLayers[form.reinsuranceLayers.length - 1].limit || 0} will be part of Facultative Layer.</Typography> */}
                {/* <TextField
                    label="Facultative Reinsurance"
                    name="facultativeReinsurance"
                    value={form.facultativeReinsurance}
                    onChange={handleFormChange}
                    size="small"
                    fullWidth
                />
                <Divider sx={{ my: 3 }} /> */}

                {/* Product & Benefit Section */}
                {/* <Typography variant="subtitle1" fontWeight={500} gutterBottom>Product</Typography>
                <Grid container spacing={2} mb={2}>
                    <Grid item xs={12} sm={4}>
                        <Autocomplete
                            fullWidth
                            multiple
                            value={form.treatyProducts || []}
                            onChange={handleProductChange}
                            id='checkboxes-tags-demo'
                            filterOptions={autocompleteFilterChange}
                            options={productList}
                            disableCloseOnSelect
                            getOptionLabel={option => option?.name || ''}
                            isOptionEqualToValue={(option: any, value: any) => option.id === value.id}
                            renderOption={(props: any, option: any, { selected }) => {
                                const selectedOpt = (option.id === 'selectall' && isAllBenefitSelected) || selected
                                const { key, ...restProps } = props
                                return (
                                    <li key={option.id} {...restProps}>
                                        <Checkbox
                                            icon={icon}
                                            checkedIcon={checkedIcon}
                                            style={{ marginRight: 8, color: '#626bda' }}
                                            checked={selectedOpt}
                                        />
                                        {option.name}
                                    </li>
                                )
                            }}
                            renderInput={params => (
                                <TextField {...params} label='Product' placeholder='Select Product' />
                            )}
                        />
                    </Grid>
                </Grid> */}

                <Box display="flex" justifyContent="flex-end" gap={2} mt={4}>
                    <Button variant="outlined" onClick={() => { router.push('/reinsurance/treaty-config?mode=viewList') }} color="error" sx={{ minWidth: 120, fontWeight: 600, fontSize: 16 }}>Close</Button>
                    <Button variant="contained" color="primary" onClick={onSave} sx={{ minWidth: 120, fontWeight: 600, fontSize: 16, background: '#D80E51', '&:hover': { background: '#b80c43' } }}>Save</Button>
                </Box>
            </Card >
        </Box >
    );
}
