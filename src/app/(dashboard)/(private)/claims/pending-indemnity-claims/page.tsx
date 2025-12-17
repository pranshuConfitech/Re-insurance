import { Suspense } from "react"

// import RejectedClaimsPreAuth from "@/views/apps/claim-management/claim-preauth-rejected/preauth.root.component"
import RejectedClaimsPreAuth from "@/views/apps/claim-management/claim-indemnity-rejected/preauth.root.component"

const RejectedInndemnityClaims = () => {
  return (
    <Suspense fallback={null}>
      <RejectedClaimsPreAuth />
    </Suspense>
  )
}

export default RejectedInndemnityClaims
