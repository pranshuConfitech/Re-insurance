"use client"

import ServiceGroupingAction from "@/views/apps/master-data-management/service-grouping/service.grouping.action";

const ProviderId = ({params}:{params:any})=>{
    console.log(params);
    
    return <ServiceGroupingAction  />;
    
}

export default ProviderId;
