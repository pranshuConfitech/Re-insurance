import { Suspense } from "react"

import Commission from "@/views/apps/agent_management/commission"

const Commission_Management = ()=>{
    return(
        <Suspense fallback={null}>
           <Commission/>
        </Suspense>
    )
}

export default Commission_Management;