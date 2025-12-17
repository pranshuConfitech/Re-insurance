"use client"
import CommissionDetailsComponent from "@/views/apps/agent_management/commission/commision.details.component";

const CommissionId = ({params}:{params:any})=>{
    console.log(params);
    
    return <CommissionDetailsComponent  />;
    
}

export default CommissionId;