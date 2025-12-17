"use client"
import ProspectActionComponent from "@/views/apps/client-management/prospect/prospect-action.component";

const ProspectId = ({params}:{params:any})=>{
    console.log(params);
    
    return <ProspectActionComponent  />;
    
}

export default ProspectId;