import React, { useEffect, useState } from 'react'
import { Box, Divider, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'

interface AdminFeesState {
    adminFeesType: string;
    fundAmount: string;
    tax: string;
    adminFees: string;
}

export const AdminFees: React.FC<any> = ({ rows, benefitRuleIdsOfFunded, classes }) => {
    const [show, setShow] = useState<number[]>([])
    const [formData, setFormData] = useState<AdminFeesState>({
        adminFeesType: '',
        fundAmount: '',
        tax: '',
        adminFees: ''
    });


    useEffect(() => {
        if (rows?.length) {
            const ids: number[] = []

            rows.forEach((row: any) => {
                row.premiumRules?.forEach((pr: any) => {
                    if (benefitRuleIdsOfFunded.includes(pr.id)) {
                        ids.push(pr.id)
                    }
                })
            })

            setShow(ids)
        }
    }, [rows, benefitRuleIdsOfFunded])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
        const { name, value } = e.target;

        setFormData((prev: any) => {
            const newData = { ...prev, [name as string]: value };

            // Calculate admin fees based on type and inputs
            if (name === 'fundAmount' || name === 'tax' || name === 'adminFeesType') {
                const fundAmount = Number(newData.fundAmount) || 0;
                const tax = Number(newData.tax) || 0;

                let adminFees = 0;
                if (newData.adminFeesType === 'per member per month') {
                    adminFees = fundAmount + (fundAmount * (tax / 100));
                } else if (newData.adminFeesType === 'percentage of fund') {
                    adminFees = (fundAmount * (tax / 100));
                }

                newData.adminFees = adminFees.toString();
            }

            return newData;
        });
    };

    console.log("qwerty", benefitRuleIdsOfFunded, rows, show)

    // if (!benefitRuleIdsOfFunded.length) return null

    return (
        <Box sx={{ marginTop: "8px" }}>
            <Typography variant='h6'>Admin Fees</Typography>
            <Divider style={{ margin: '8px 0' }} />
            <Grid container spacing={1}>
                <Grid item xs={12} sm={6} md={3}>
                    <FormControl className={classes?.formControl} style={{ margin: "0" }}>
                        <InputLabel id='select-search-by-label'>Admin Fees Type</InputLabel>
                        <Select
                            name='adminFeesType'
                            size='small'
                            label='Admin Fees Type'
                            displayEmpty
                            className={classes?.selectEmpty}
                            inputProps={{ 'aria-label': 'Without label' }}
                            value={formData.adminFeesType}
                        // onChange={handleInputChange}
                        >
                            <MenuItem value="per member per month">
                                Per member per month
                            </MenuItem>
                            <MenuItem value="per member per year">
                                Per member per year
                            </MenuItem>
                            <MenuItem value="percentage of fund">
                                Percentage of fund
                            </MenuItem>
                            <MenuItem value="percentage of claim">
                                Percentage of claim
                            </MenuItem>
                            gent
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        size='small'
                        type='number'
                        id='standard-basic'
                        name='fundAmount'
                        value={formData.fundAmount}
                        onChange={handleInputChange}
                        label='Fund Amount'
                        InputProps={{
                            classes: {
                                root: classes.inputRoot,
                                disabled: classes.disabled
                            }
                        }}
                    />
                </Grid>
                {/* <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        size='small'
                        type='number'
                        id='standard-basic'
                        name='tax'
                        value=''
                        // disabled={this.mode === 'view' ? true : false}
                        // onChange={(e: any) => {
                        //     this.changeCommision(e, i)
                        // }}
                        label='Tax'
                        InputProps={{
                            classes: {
                                root: classes.inputRoot,
                                disabled: classes.disabled
                            }
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <TextField
                        size='small'
                        type='number'
                        id='standard-basic'
                        name='adminFees'
                        value=''
                        disabled={true}
                        // onChange={(e: any) => {
                        //     this.changeCommision(e, i)
                        // }}
                        label='Admin Fees'
                        InputProps={{
                            classes: {
                                root: classes.inputRoot,
                                disabled: classes.disabled
                            }
                        }}
                    />
                </Grid> */}
            </Grid>
        </Box>
    )
}
