import { Suspense } from "react"

import RequestedIndemnity from "@/views/apps/claim-management/inndemnity-requested/preauth.root.component"

const RejectedIndemnityClaims = () => {
  return (
    <Suspense fallback={null}>
      <RequestedIndemnity />
    </Suspense>
  )
}

export default RejectedIndemnityClaims
