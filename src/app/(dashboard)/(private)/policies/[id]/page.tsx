"use client"
import PolicyDetails from "@/views/apps/policy-management/policy/policy.details.component";

const policiesId = ({params}:{params:any})=>{
    console.log(params);
    
    return <PolicyDetails  />;
    
}

export default policiesId;