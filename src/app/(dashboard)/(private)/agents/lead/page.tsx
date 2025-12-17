import React,{ Suspense } from "react"

import Dashboard from "@/views/apps/agent_management/lead/Dashboard";

const Lead_management =()=>{
    return(
        <Suspense fallback={null}>
            <Dashboard/>
        </Suspense>
    )
}

export default Lead_management;
