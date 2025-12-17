"use client";
import React, { useState } from "react";
import { Box, Button, Card, Grid, Step, StepLabel, Stepper, TextField, Typography, MenuItem, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, InputLabel, Select } from "@mui/material";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'

const treatyTypes = ["Facultative", "Quota Share", "Excess of Loss(Per Risk)", "Excess of Loss(Catastrophe)", "Stop Loss XL", "Aggregate Excess of Loss"];
const brokerOptions = ["Broker A", "Broker B"];
const reinsurerOptions = ["Reinsurer X", "Reinsurer Y"];
const productTypes = ["ALL", "TYPE1", "TYPE2"];
const productOptions = ["ALL", "Product1", "Product2"];
const benefitOptions = ["ALL", "Benefit1", "Benefit2"];

const defaultForm = {
    configurationName: '',
    layer: '',
    treatyType: treatyTypes[0],
    validFrom: '',
    validUpto: '',
    brokerRequired: 'NO',
    broker: '',
    brokerSelect: '',
    reinsurer: '',
    reinsurerSelect: '',
    productType: productTypes[0],
    product: '',
    productSelect: productOptions[0],
    benefit: benefitOptions[0],
    currency: '',
    annualAggregateLimit: '',
    reinstate: '',
    entryDate: '',
    details: [{
        broker: '',
        reinsurer: '',
        share: '',
    }]
};

export default function TreatyConfigFormComponent({ onSave, onClose, initialData }: any) {
    const [form, setForm] = useState(initialData || defaultForm);
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any) => {
        const { name, value } = e.target || {};
        setForm({ ...form, [name]: value });
    };
    return (
        <Box p={4} sx={{ minHeight: '100vh' }}>
            <Card sx={{ p: 4, maxWidth: 1100, mx: 'auto', borderRadius: 1, boxShadow: 1 }}>
                <Typography variant="h6" mb={4} fontWeight={500}>
                    Treaty Configuration
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField label="Configuration Name" name="configurationName" value={form.configurationName} onChange={handleFormChange} size="small" fullWidth required />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField label="Layer" name="layer" value={form.layer} onChange={handleFormChange} size="small" fullWidth required />
                    </Grid>
                    <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center' }}>
                        <FormControl fullWidth size="small" sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <FormLabel sx={{ mr: 0, mb: 0, alignSelf: 'center' }}>* SELECT TREATY</FormLabel>
                            <TextField select name="treatyType" value={form.treatyType} onChange={handleFormChange} size="small" fullWidth sx={{ alignSelf: 'center' }}>
                                {treatyTypes.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                            </TextField>
                        </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label="* VALID FROM"
                                value={form.validFrom || ''}
                                onChange={date => setForm({ ...form, validFrom: date ? (typeof date === 'string' ? date : date.toISOString().slice(0, 10)) : '' })}
                                renderInput={params => <TextField {...params} name="validFrom" size="small" fullWidth required />}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={4}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label="* VALID TO"
                                value={form.validUpto || ''}
                                onChange={date => setForm({ ...form, validUpto: date ? (typeof date === 'string' ? date : date.toISOString().slice(0, 10)) : '' })}
                                renderInput={params => <TextField {...params} name="validUpto" size="small" fullWidth required />}
                            />
                        </LocalizationProvider>
                    </Grid>

                    {form.details.map((detail: any, index: number) => {
                        return (
                            <>
                                <Grid item xs={12} sm={6} md={3}>
                                    <FormControl style={{ width: "100%" }}>
                                        <InputLabel
                                            id="demo-simple-select-label"
                                            style={{ marginBottom: "0px" }}
                                        >
                                            Broker
                                        </InputLabel>
                                        <Select
                                            label="Broker"
                                            name="broker"
                                            value={detail.broker}
                                            variant="standard"
                                            style={{ fontSize: "14px" }}
                                            fullWidth
                                        >
                                            <MenuItem style={{ fontSize: "14px" }} value="ICD">1</MenuItem>
                                            <MenuItem style={{ fontSize: "14px" }} value="SHA">2</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <FormControl style={{ width: "100%" }}>
                                        <InputLabel
                                            id="demo-simple-select-label"
                                            style={{ marginBottom: "0px" }}
                                        >
                                            Re-insurer
                                        </InputLabel>
                                        <Select
                                            label="Re-insurer"
                                            name="reinsurer"
                                            value={detail.reinsurer}
                                            variant="standard"
                                            style={{ fontSize: "14px" }}
                                            fullWidth
                                        >
                                            <MenuItem style={{ fontSize: "14px" }} value="ICD">1</MenuItem>
                                            <MenuItem style={{ fontSize: "14px" }} value="SHA">2</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <TextField
                                        label="Share"
                                        name="share"
                                        value={detail.share}
                                        onChange={(e) => {
                                            const newDetails = [...form.details];
                                            newDetails[index].share = e.target.value;
                                            setForm({ ...form, details: newDetails });
                                        }}
                                        size="small"
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={3} style={{ display: "flex", alignItems: "center" }}>
                                    {form.details.length !== 1 && (
                                        <Button
                                            // className={`mr10 p-button-danger ${classes.buttonSecondary}`}
                                            // onClick={() => handleRemoveServicedetails(i)}
                                            color="secondary"
                                            style={{ marginLeft: "5px" }}
                                        >
                                            <DeleteIcon />
                                        </Button>
                                    )}
                                    {form.details.length - 1 === index && (
                                        <Button
                                            color="primary"
                                            // className={classes.buttonPrimary}
                                            style={{ marginLeft: "5px" }}
                                        // onClick={handleAddServicedetails}
                                        >
                                            <AddIcon />
                                        </Button>
                                    )}
                                </Grid>
                            </>
                        )
                    })}


                    {/* <Grid item xs={12}>
                        <FormControl component="fieldset" sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <FormLabel component="legend" sx={{ mr: 2 }}>* BROKER REQUIRED :</FormLabel>
                            <RadioGroup row name="brokerRequired" value={form.brokerRequired} onChange={handleFormChange}>
                                <FormControlLabel value="NO" control={<Radio />} label="NO" />
                                <FormControlLabel value="YES" control={<Radio />} label="YES" />
                            </RadioGroup>
                        </FormControl>
                    </Grid> */}
                    {/* {form.brokerRequired === 'YES' && ( */}
                    {/* <Grid item xs={12}>
                        <FormControl component="fieldset" sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <TextField label="* BROKER" name="broker" value={form.broker} onChange={handleFormChange} size="small" sx={{ mx: 2, width: 180 }} />
                            <TextField select name="brokerSelect" value={form.brokerSelect} onChange={handleFormChange} size="small" sx={{ width: 180 }}>
                                {brokerOptions.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                            </TextField>
                            <Button variant="contained" color="primary" sx={{ ml: 1, minWidth: 60, background: '#D80E51' }}>ADD</Button>
                        </FormControl>
                    </Grid> */}
                    {/* )} */}
                    {/* <Grid item xs={12}>
                        <FormControl component="fieldset" sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <FormLabel component="legend" sx={{ mr: 2 }}>* REINSURER :</FormLabel>
                            <TextField label="* REINSURER" name="reinsurer" value={form.reinsurer} onChange={handleFormChange} size="small" sx={{ mx: 2, width: 180 }} />
                            <TextField select name="reinsurerSelect" value={form.reinsurerSelect} onChange={handleFormChange} size="small" sx={{ width: 180 }}>
                                {reinsurerOptions.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                            </TextField>
                            <Button variant="contained" color="primary" sx={{ ml: 1, minWidth: 60, background: '#D80E51' }}>ADD</Button>
                        </FormControl>
                    </Grid> */}
                    <Grid item xs={12}>
                        <FormControl component="fieldset" sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <FormLabel component="legend" sx={{ mr: 2 }}>* PRODUCT TYPE :</FormLabel>
                            <TextField select name="productType" value={form.productType} onChange={handleFormChange} size="small" sx={{ width: 120, mr: 2 }}>
                                {productTypes.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                            </TextField>
                            <TextField label="PRODUCT" name="product" value={form.product} onChange={handleFormChange} size="small" sx={{ width: 180, mr: 2 }} />
                            <TextField select name="productSelect" value={form.productSelect} onChange={handleFormChange} size="small" sx={{ width: 120, mr: 2 }}>
                                {productOptions.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                            </TextField>
                            <Button variant="contained" color="primary" sx={{ minWidth: 60, background: '#D80E51' }}>ADD</Button>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl component="fieldset" sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <FormLabel component="legend" sx={{ mr: 2 }}>* BENEFIT :</FormLabel>
                            <TextField select name="benefit" value={form.benefit} onChange={handleFormChange} size="small" sx={{ width: 120, mr: 2 }}>
                                {benefitOptions.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                            </TextField>
                            <Button variant="contained" color="primary" sx={{ minWidth: 60, background: '#D80E51' }}>ADD</Button>
                        </FormControl>
                    </Grid>
                </Grid>
                <Box display="flex" justifyContent="flex-end" gap={2} mt={6}>
                    <Button variant="outlined" color="error" onClick={onClose} sx={{ minWidth: 120, fontWeight: 600, fontSize: 16 }}>Close</Button>
                    <Button variant="contained" color="primary" onClick={() => onSave(form)} sx={{ minWidth: 120, fontWeight: 600, fontSize: 16, background: '#D80E51', '&:hover': { background: '#b80c43' } }}>Save</Button>
                </Box>
            </Card>
        </Box>
    );
} 
