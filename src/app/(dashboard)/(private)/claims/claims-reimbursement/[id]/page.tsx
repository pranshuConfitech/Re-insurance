"use client"
import ClaimsReimDetails from "@/views/apps/claim-management/claim-reimbursement/cliam.reim.details.component";

const claimReimbursementId = ({params}:{params:any})=>{
    console.log(params);
    
    return <ClaimsReimDetails  />;
    
}

export default claimReimbursementId;
