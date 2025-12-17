"use client"
import EndorsementDetails from "@/views/apps/endorsement-management/endorsements/endorsement.details.component";

const endorsementId = ({params}:{params:any})=>{
    console.log(params);
    
    return <EndorsementDetails/>;
    
}

export default endorsementId;