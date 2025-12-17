import { Suspense } from "react"

import RejectedClaimsPreAuth from "@/views/apps/claim-management/claim-preauth-rejected/preauth.root.component"

const RejectedClaims = () => {
  return (
    <Suspense fallback={null}>
      <RejectedClaimsPreAuth />
    </Suspense>
  )
}

export default RejectedClaims
