"use client"

import ClaimInvoiceList from "@/views/apps/claim-management/claim-to-be-processed/claim.invoice.list.componnet";

const claimProcessedId = ({params}:{params:any})=>{
    console.log(params);
    
    return <ClaimInvoiceList  />;
    
}

export default claimProcessedId;
