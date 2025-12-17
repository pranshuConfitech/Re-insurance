import React,{ Suspense } from "react"

import Calendar from "@/views/apps/agent_management/lead/Calendar";

const Lead_management_calender =()=>{
    return(
        <Suspense fallback={null}>
            <Calendar/>
        </Suspense>
    )
}

export default Lead_management_calender;
