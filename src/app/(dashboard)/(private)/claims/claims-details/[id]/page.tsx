"use client"

import ClaimsDetails from "@/views/apps/claim-management/claims/claim.details.component";

const claimDetailsId = ({params}:{params:any})=>{
    console.log(params);
    
    return <ClaimsDetails  />;
    
}

export default claimDetailsId;
