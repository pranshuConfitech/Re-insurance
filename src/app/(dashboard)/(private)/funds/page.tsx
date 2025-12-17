
import { Suspense } from "react"

import FundInvoiceDetails from "@/views/apps/fund-management/components"

const Funds = () => {
  return (
    <Suspense fallback={null}>
      <FundInvoiceDetails/>
    </Suspense>
  )
}

export default Funds
