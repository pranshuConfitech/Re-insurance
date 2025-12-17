import React,{ Suspense } from "react"

import Leads from "@/views/apps/agent_management/lead/Leads";

const Lead_management_leads =()=>{
    return(
        <Suspense fallback={null}>
            <Leads/>
        </Suspense>
    )
}

export default Lead_management_leads;
