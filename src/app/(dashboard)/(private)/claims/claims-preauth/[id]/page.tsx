"use client"
import ClaimsPreAuthDetails from "@/views/apps/claim-management/claim-preauth/preauth.details.component";

const claimPreauthId = ({params}:{params:any})=>{
    console.log(params);
    
    return <ClaimsPreAuthDetails  />;
    
}

export default claimPreauthId;
