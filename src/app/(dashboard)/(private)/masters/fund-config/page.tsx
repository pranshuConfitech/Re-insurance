import { Suspense } from "react"

import FundAddressConfig from "@/views/apps/master-data-management/fund-config/fund-address.component"

const FundConfig = () => {
  return (
    <Suspense fallback={null}>
       <FundAddressConfig />
    </Suspense>
  )
}

export default FundConfig;
