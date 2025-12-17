import React,{ Suspense } from "react"

import TargetComponent from "@/views/apps/agent_management/agents/agents.target.details.component";

const Target_management =()=>{
    return(
        <Suspense fallback={null}>
            <TargetComponent/>
        </Suspense>
    )
}

export default Target_management;