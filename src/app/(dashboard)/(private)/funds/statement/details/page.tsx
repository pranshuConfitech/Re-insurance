import { Suspense } from "react"

import FundListComponent from "@/views/apps/fund-management/components/fund.list.component"

const FundsStatement = () => {
  return (
    <Suspense fallback={null}>
    <FundListComponent/>
  </Suspense>
  )
}

export default FundsStatement;
