"use client"
import SLAConfigurationComponent from "@/views/apps/sla-configuration/sla/sla.configuration.component";

const slatId = ({params}:{params:any})=>{
    console.log(params);
    
    return <SLAConfigurationComponent/>;
    
}

export default slatId;