import { Suspense } from "react"

import FundConfigManagementComponent from "@/views/apps/fund-management/components/fund-config/fund.config.management.component"

const FundsConfig = () => {
  return (
    <Suspense fallback={null}>
    <FundConfigManagementComponent/>
  </Suspense>
  )
}

export default FundsConfig
