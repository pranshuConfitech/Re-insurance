import React from "react"

import { Grid } from "@mui/material"

export const ClaimDetails = ({ claimId, memberShipNo, data }:{ claimId:any, memberShipNo:any, data:any }) => {

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <p><strong>Membership No.</strong> : {memberShipNo}</p>
            </Grid>

            <Grid item xs={12}>
                <p><strong>Claim No.</strong> : {claimId}</p>
            </Grid>

            <Grid item xs={12}>
                <p><strong>Claim Sub-Type</strong> : {data?.claimSubType}</p>
            </Grid>

            <Grid item xs={12}>
                <p><strong>Name</strong> : {data?.memberName}</p>
            </Grid>

            <Grid item xs={12}>
                <p><strong>Barcode</strong> : {data?.barcode}</p>
            </Grid>
        </Grid>

    )
}
