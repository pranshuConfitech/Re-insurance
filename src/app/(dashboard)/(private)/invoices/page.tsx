import { Suspense } from "react"

import Invoices from "@/views/apps/invoice-management/invoice"

const invoice_management = ()=>{
    return(
        <Suspense>
            <Invoices/>
        </Suspense>
    )
}

export default invoice_management;