"use client";
import React, { useEffect, useState } from "react";
import { Box, Card, Grid, Typography, TextField, MenuItem, Button, Select, Paper } from "@mui/material";
import { ReinsuranceService } from "@/services/remote-api/api/reinsurance-services/reinsurance.service";
import { setTemplateEngine } from "@syncfusion/ej2-base";
import AccountingTable from "./table";

const insuranceOptions = ["DEMO INSURANCE", "INSURANCE B", "INSURANCE C"];
const treatyConfigOptions = ["Quota Share Treaty Setup", "XOL Treaty Setup"];

const reinsuranceService = new ReinsuranceService()

export default function ReinsuranceReports() {
    const [treatyConfigOptions, setTreatyConfigOptions] = useState<any[]>([]);
    const [treatyConfig, setTreatyConfig] = useState('');
    const [policy, setPolicy] = useState('');
    const [showTable, setShowTable] = useState(false);

    useEffect(() => {
        reinsuranceService.getAllTreaty({
            page: 0,
            size: 10000,
            summary: true,
            active: true
        }).subscribe((res: any) => {
            let temp: any = []
            res?.data?.content.forEach((el: any) => {
                let obj = {
                    label: el.configurationName,
                    value: el.id
                }
                temp.push(obj)
            })
            setTreatyConfigOptions(temp);
            if (temp.length > 0) setTreatyConfig(temp[0].value); // Optionally select first by default
        })
    }, []);

    const details = {
        product:
            policy === "Policy 1"
                ? "Retail Health 2024"
                : policy === "Policy 2"
                    ? "Health Product 2025"
                    : "",
        grade: policy === "Policy 1" ? "1" : policy === "Policy 2" ? "2" : "",
        lob:
            policy === "Policy 1"
                ? "Medicare"
                : policy === "Policy 2"
                    ? "Medicaid"
                    : "",
        share:
            policy === "Policy 1"
                ? "20,000,000"
                : policy === "Policy 2"
                    ? "40,000,000"
                    : "",
        gwp:
            policy === "Policy 1"
                ? "20,000"
                : policy === "Policy 2"
                    ? "400,000"
                    : ""
    };


    return (
        <Box sx={{ p: 4 }}>
            {/* <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#3A3A3A' }}>
                DOWNLOAD REINSURANCE REPORT
            </Typography> */}
            <Card sx={{ maxWidth: 1200, mx: 'auto', p: 6, borderRadius: 1, boxShadow: 1 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <Grid container spacing={3} direction="row" sx={{ width: '100%' }}>
                        {/* <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography sx={{ fontWeight: 500, mr: 2, minWidth: 180, textAlign: 'right' }}>INSURANCE :</Typography>
                            <TextField select size="small" value={insurance} onChange={e => setInsurance(e.target.value)} sx={{ minWidth: 260 }}>
                            {insuranceOptions.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                            </TextField>
                        </Grid> */}
                        <Grid item xs={12} md={4}>
                            <Select
                                name="treatyName"
                                label="* SELECT TREATY"
                                value={treatyConfig}
                                onChange={(e: any) => { setTreatyConfig(e.target.value); setShowTable(false); }}
                                sx={{ minWidth: 260 }}
                            >
                                {treatyConfigOptions.map((opt: any) => (
                                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                ))}
                            </Select>
                            {/* <TextField select size="small" value={treatyConfig} onChange={(e: any) => setTreatyConfig(e.target.value)} sx={{ minWidth: 260 }}>
                                {treatyConfigOptions.map((opt: any) => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
                            </TextField> */}
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Select
                                name="policy"
                                label="* Policy"
                                value={policy}
                                onChange={(e: any) => { setPolicy(e.target.value); setShowTable(false); }}
                                sx={{ minWidth: 260 }}
                            >
                                {["Policy 1", "Policy 2"].map((opt: any) => (
                                    <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                                ))}
                            </Select>
                        </Grid>
                    </Grid>
                    {treatyConfig && policy && <Paper
                        elevation={2}
                        sx={{
                            mt: 4,
                            p: 3,
                            borderRadius: 2,
                            width: "100%",
                            background: "linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)",
                            border: "1px solid #e0e0e0"
                        }}
                    >
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 600,
                                mb: 2,
                                color: "#1976d2",
                                borderBottom: "2px solid #1976d2",
                                display: "inline-block",
                                pb: 0.5
                            }}
                        >
                            Policy Summary
                        </Typography>

                        <Grid container spacing={2}>
                            {[
                                { label: "Product", value: details.product },
                                { label: "Grade", value: details.grade },
                                { label: "Accounting LOB", value: details.lob },
                                { label: "Own Share - PML RI SI", value: details.share },
                                { label: "GWP", value: details.gwp }
                            ].map((item, i) => (
                                <Grid item xs={12} sm={6} md={4} lg={2.4} key={i}>
                                    <Box
                                        sx={{
                                            p: 2,
                                            border: "1px solid #e0e0e0",
                                            borderRadius: 2,
                                            backgroundColor: "#fafafa",
                                            "&:hover": { backgroundColor: "#f5f5f5" },
                                            transition: "all 0.2s ease"
                                        }}
                                    >
                                        <Typography
                                            variant="body2"
                                            sx={{ color: "text.secondary", fontWeight: 500 }}
                                        >
                                            {item.label}
                                        </Typography>
                                        <Typography
                                            variant="subtitle1"
                                            sx={{ fontWeight: 600, color: "#333", mt: 0.5 }}
                                        >
                                            {item.value || "-"}
                                        </Typography>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Paper>}
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 6 }}>
                        <Button variant="contained" sx={{ background: '#D80E51', fontWeight: 700, fontSize: 12, px: 4, borderRadius: 1, textTransform: "capitalize" }} onClick={() => { setShowTable(true) }}>
                            Allocation
                        </Button>
                        {/* <Button variant="contained" sx={{ background: '#D80E51', fontWeight: 700, fontSize: 12, px: 4, borderRadius: 1 }}>
                            DOWNLOAD PREMIUM SHARE
                        </Button> */}
                    </Box>
                </Box>
            </Card >
            {showTable && policy && <AccountingTable policy={policy} />
            }
            {/* <Table /> */}
        </Box >
    );
} 
