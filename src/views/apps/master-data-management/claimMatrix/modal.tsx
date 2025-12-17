import * as React from 'react';

import { useRouter } from 'next/navigation';

import { Button, DialogActions, FormControl, FormControlLabel, FormLabel, Grid, InputLabel, MenuItem, Radio, RadioGroup, Select } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import 'date-fns';


export default function ClaimMatrixModal(props: any) {


    const { preAuth } = props;
    const history = useRouter();
    const [fullWidth, setFullWidth] = React.useState(true);

    const handleClose = () => {
        props.onClose();
    };

    return (
        <Dialog
            open={props.open}
            onClose={handleClose}
            fullWidth={fullWidth}

            aria-labelledby="form-dialog-title"
            disableEnforceFocus>
            <DialogContent>
                <Grid container spacing={3} style={{ marginBottom: '20px' }}>
                    <Grid item xs={12} sm={6} md={4}>
                        <FormControl component='fieldset'>
                            <FormLabel component='legend'>Client type*</FormLabel>
                            <RadioGroup
                                aria-label='clientTypeCd'
                                value={props.type}
                                name='clientType'
                                // onChange={formik.handleChange}
                                row
                            // className={classes.clientTypeRadioGroup}
                            >
                                {["IP", "OP"].map((ele: any) => {
                                    return <FormControlLabel key={ele} value={ele} control={<Radio />} label={ele} />
                                })}
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid container spacing={3} style={{ marginBottom: '20px' }}>
                    <Grid item xs={12} sm={6} md={4}>
                        {props.type == "IP" ? <FormControl style={{ width: "100%" }}>
                            <InputLabel
                                id="demo-simple-select-label"
                                style={{ marginBottom: "0px" }}
                            >
                                Amount From
                            </InputLabel>
                            <Select
                                label="Amount Greater than"
                                name="amountGreaterThan"
                                variant="standard"
                                style={{ fontSize: "14px" }}
                                fullWidth
                            >
                                <MenuItem style={{ fontSize: "14px" }} value="0">0</MenuItem>
                                <MenuItem style={{ fontSize: "14px" }} value=" 150,000">150,000</MenuItem>
                                <MenuItem style={{ fontSize: "14px" }} value="450,000">450,000</MenuItem>
                                <MenuItem style={{ fontSize: "14px" }} value="1,000,000">1,000,000</MenuItem>
                                <MenuItem style={{ fontSize: "14px" }} value="2,000,000">2,000,000</MenuItem>
                            </Select>
                        </FormControl> : <FormControl style={{ width: "100%" }}>
                            <InputLabel
                                id="demo-simple-select-label"
                                style={{ marginBottom: "0px" }}
                            >
                                Amount From
                            </InputLabel>
                            <Select
                                label="Amount Greater than"
                                name="amountGreaterThan"
                                variant="standard"
                                style={{ fontSize: "14px" }}
                                fullWidth
                            >
                                <MenuItem style={{ fontSize: "14px" }} value="0">0</MenuItem>
                                <MenuItem style={{ fontSize: "14px" }} value="25,000">25,000</MenuItem>
                                <MenuItem style={{ fontSize: "14px" }} value="45,000">45,000</MenuItem>
                                <MenuItem style={{ fontSize: "14px" }} value="100,000">100,000</MenuItem>
                                <MenuItem style={{ fontSize: "14px" }} value="200,000">200,000</MenuItem>
                            </Select>
                        </FormControl>}
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        {props.type == "IP" ? <FormControl style={{ width: "100%" }}>
                            <InputLabel
                                id="demo-simple-select-label"
                                style={{ marginBottom: "0px" }}
                            >
                                Amount To
                            </InputLabel>
                            <Select
                                label="Amount Greater than"
                                name="amountGreaterThan"
                                variant="standard"
                                style={{ fontSize: "14px" }}
                                fullWidth
                            >
                                <MenuItem style={{ fontSize: "14px" }} value=" 150,000">150,000</MenuItem>
                                <MenuItem style={{ fontSize: "14px" }} value="450,000">450,000</MenuItem>
                                <MenuItem style={{ fontSize: "14px" }} value="1,000,000">1,000,000</MenuItem>
                                <MenuItem style={{ fontSize: "14px" }} value="2,000,000">2,000,000</MenuItem>
                            </Select>
                        </FormControl> : <FormControl style={{ width: "100%" }}>
                            <InputLabel
                                id="demo-simple-select-label"
                                style={{ marginBottom: "0px" }}
                            >
                                Amount To
                            </InputLabel>
                            <Select
                                label="Amount Greater than"
                                name="amountGreaterThan"
                                variant="standard"
                                style={{ fontSize: "14px" }}
                                fullWidth
                            >
                                <MenuItem style={{ fontSize: "14px" }} value="25,000">25,000</MenuItem>
                                <MenuItem style={{ fontSize: "14px" }} value="45,000">45,000</MenuItem>
                                <MenuItem style={{ fontSize: "14px" }} value="100,000">100,000</MenuItem>
                                <MenuItem style={{ fontSize: "14px" }} value="200,000">200,000</MenuItem>
                            </Select>
                        </FormControl>}
                    </Grid>
                </Grid>
                <Grid container spacing={3} style={{ marginBottom: '20px' }}>
                    <Grid item xs={12} sm={6} md={4}>
                        <FormControl style={{ width: "100%" }}>
                            <InputLabel
                                id="demo-simple-select-label"
                                style={{ marginBottom: "0px" }}
                            >
                                Originator Role
                            </InputLabel>
                            <Select
                                label="Role"
                                name="role"
                                variant="standard"
                                style={{ fontSize: "14px" }}
                                fullWidth
                            >
                                <MenuItem style={{ fontSize: "14px" }} value="Claims Assessor">Claims Assessor</MenuItem>
                                <MenuItem style={{ fontSize: "14px" }} value="Supervisor">Supervisor</MenuItem>
                                <MenuItem style={{ fontSize: "14px" }} value="Claims Manager">Claims Manager</MenuItem>
                                <MenuItem style={{ fontSize: "14px" }} value="General Manager">General Manager</MenuItem>
                                <MenuItem style={{ fontSize: "14px" }} value="Board Representative">Board Representative</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <FormControl style={{ width: "100%" }}>
                            <InputLabel
                                id="demo-simple-select-label"
                                style={{ marginBottom: "0px" }}
                            >
                                Approver Role
                            </InputLabel>
                            <Select
                                label="Role"
                                name="role"
                                variant="standard"
                                style={{ fontSize: "14px" }}
                                fullWidth
                            >
                                <MenuItem style={{ fontSize: "14px" }} value="Claims Assessor">Claims Assessor</MenuItem>
                                <MenuItem style={{ fontSize: "14px" }} value="Supervisor">Supervisor</MenuItem>
                                <MenuItem style={{ fontSize: "14px" }} value="Claims Manager">Claims Manager</MenuItem>
                                <MenuItem style={{ fontSize: "14px" }} value="General Manager">General Manager</MenuItem>
                                <MenuItem style={{ fontSize: "14px" }} value="Board Representative">Board Representative</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button type='button' onClick={props.onClose} variant='contained'>Save</Button>
                <Button type='button' onClick={props.onClose}>Exit</Button>
            </DialogActions>
        </Dialog>
    );
}
