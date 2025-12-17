import { Suspense } from "react"

import ProspectComponent from "@/views/apps/client-management/prospect"

const Prospect_Management = ()=>{
    return(
        <Suspense fallback={null}>
           <ProspectComponent/>
        </Suspense>
    )
}

export default Prospect_Management;