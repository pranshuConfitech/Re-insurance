
import { Suspense } from "react"

import Claims from "@/views/apps/claim-management/claims/claim.component"

const ClaimClaims = () => {
  return (
    <Suspense fallback={null}>
      <Claims/>
    </Suspense>
  )
}

export default ClaimClaims
