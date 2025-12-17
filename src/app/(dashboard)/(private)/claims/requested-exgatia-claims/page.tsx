import { Suspense } from "react"

import RequestedExgratia from "@/views/apps/claim-management/exgratia-requested/preauth.root.component"

const RejectedClaims = () => {
  return (
    <Suspense fallback={null}>
      <RequestedExgratia />
    </Suspense>
  )
}

export default RejectedClaims
