import { Suspense } from "react"

import FundInvoiceDetails from "@/views/apps/fund-management/components"

const FundsStatement = () => {
  return (
    <Suspense fallback={null}>
    <FundInvoiceDetails/>
  </Suspense>
  )
}

export default FundsStatement
