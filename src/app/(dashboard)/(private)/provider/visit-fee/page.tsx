import { Suspense } from "react"

import VisitFeeComponent from "@/views/apps/provider-service/providers/visitFee"

const ProviderVisitFee = () => {
  return (
    <Suspense fallback={null}>
    <VisitFeeComponent/>
  </Suspense>
  )
}

export default ProviderVisitFee
