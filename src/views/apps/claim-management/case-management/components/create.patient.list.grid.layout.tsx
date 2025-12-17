import React from "react";

import { Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";

import { getDateElements } from '../../../../../utils/@jambo-utils/dateHelper'

const useStyles = makeStyles(theme => ({
    stretch: { height: "100%" },
    item: { display: "flex", flexDirection: "column" } // KEY CHANGES
}));

const wrapper = (name:any, value:any) => {
    return (
        <>
            <Grid item xs={3}><Typography>{name}</Typography></Grid>
            <Grid item xs={1}><Typography style={{ textAlign: 'center' }}>:</Typography></Grid>
            <Grid item xs={8}><Typography>{value}</Typography></Grid>
        </>

    )
}

export const createMemberGrid = (mNo:any, name:any, doa:any, dod:any, hos:any) => {
    return (
        <div>
            <Grid container>
                {wrapper('M NO', mNo)}
                {wrapper('NAME', name)}
                {wrapper('DOA', doa)}
                {wrapper('DOD', dod)}
                {wrapper('HOS', hos)}
            </Grid>
        </div>
    );
}

type MembershipDetails = {
    memberShipNo: string;  
    memberShipName: string;
    doa: string | Date;  
    dod: string | Date; 
    providers: string[]; 
    preAuthId: string; 
  };

export const MemberDetails = ({ memberShipNo, memberShipName, doa, dod, providers, preAuthId }:MembershipDetails) => {
    const dateOfAdmission = `${getDateElements(doa).date.numerical}`
    const dateOfDischarge = `${getDateElements(dod).date.numerical}`

    
return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography variant="body1" style={{ fontSize: '12px' }}>
                    <strong>Membership No.</strong> : {memberShipNo}
                </Typography>
            </Grid>

            <Grid item xs={12}>
                <Typography variant="body1" style={{ fontSize: '12px' }}>
                    <strong>Name</strong> : {memberShipName}
                </Typography>
            </Grid>

            <Grid item xs={12}>
                <Typography variant="body1" style={{ fontSize: '12px' }}>
                    <strong>Date of Admission</strong> : {dateOfAdmission}
                </Typography>
            </Grid>

            <Grid item xs={12}>
                <Typography variant="body1" style={{ fontSize: '12px' }}>
                    <strong>Date of Discharge</strong> : {dateOfDischarge}
                </Typography>
            </Grid>

            <Grid item xs={12}>
                <Typography variant="body1" style={{ fontSize: '12px' }}>
                    <strong>Claim No.</strong> : {preAuthId}
                </Typography>
            </Grid>
        </Grid>
    )
}

export const AccountGrid = ({ benefitsWithCost }:{benefitsWithCost:any}) => {
    return (
        <TableContainer >
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell style={{ fontSize: '12px' }}><b>PROVIDER</b></TableCell>
                        <TableCell style={{ fontSize: '12px' }} align="center"><b>:</b></TableCell>
                        <TableCell style={{ fontSize: '12px' }} align="right"><b>Cost</b></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {benefitsWithCost?.map((item:any,i:number) => (
                        <TableRow key={`tr-${i}`}>
                            <TableCell style={{ fontSize: '12px' }}>
                                {item.providerId || 'Not available'}
                                {' | ' + item.benefitName || 'Not available'}
                            </TableCell>
                            <TableCell style={{ fontSize: '12px' }} align="center">:</TableCell>
                            <TableCell style={{ fontSize: '12px' }} align="right">{item.estimatedCost}</TableCell>
                        </TableRow>
                    ))

                    }
                    {/* <TableRow>
                        <TableCell style={{ fontSize: '12px' }} align="right" colSpan={3}>12,000.00</TableCell>
                    </TableRow> */}
                </TableBody>
            </Table>
        </TableContainer>

        //  </div>
    );
}

export const createAccountGrid = ({ provider, amount, total }:{provider:any, amount:any, total:any}) => {
    return (
        <TableContainer >
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell style={{ fontSize: '12px' }}><b>PROVIDER</b></TableCell>
                        <TableCell style={{ fontSize: '12px' }} align="center"><b>:</b></TableCell>
                        <TableCell style={{ fontSize: '12px' }} align="right"><b>AMOUNT</b></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell style={{ fontSize: '12px' }}>
                            THE AGA KHAN UNIVERSITY HOSPITAL NAIROBI
                        </TableCell>
                        <TableCell style={{ fontSize: '12px' }} align="center">:</TableCell>
                        <TableCell style={{ fontSize: '12px' }} align="right">12,000.00</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell style={{ fontSize: '12px' }} align="right" colSpan={3}>12,000.00</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>

        //  </div>
    );
}

export const createDiagnosisGrid = (diagnosis:any, procedure:any) => {
    return (
        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <Grid container>
                <Grid item xs={5}>
                    <Typography>DIAGNOSIS</Typography>
                </Grid>
                <Grid item xs={7}>
                    <Typography>{diagnosis}</Typography>
                </Grid>
                <Grid item xs={5}>
                    <Typography>PROCEDURE</Typography>
                </Grid>
                <Grid item xs={7}>
                    <Typography>{procedure}</Typography>
                </Grid>
            </Grid>
        </div>
    );
}

export const DiagnosisGrid = ({ diagnosis, procedure }:{ diagnosis:any, procedure:any }) => {
    return (
        <Grid container spacing={8} >
            <Grid item container xs={12}>
                <Grid item >
                    <Typography variant="body1" style={{ fontSize: '12px' }}>
                        <strong>Diagnosis</strong> :
                    </Typography>
                </Grid>
                <Grid item xs>
                    <Typography variant="body1" style={{ fontSize: '12px' }}>
                        {diagnosis}
                    </Typography>
                </Grid>
            </Grid>
            <Grid item container xs={12}>
                <Grid item>
                    <Typography variant="body1" style={{ fontSize: '12px' }}>
                        <strong>Procedure</strong> :
                    </Typography>
                </Grid>
                <Grid item xs>
                    <Typography variant="body1" style={{ fontSize: '12px' }}>
                        {procedure}
                    </Typography>
                </Grid>
            </Grid>
        </Grid >
    );
}
