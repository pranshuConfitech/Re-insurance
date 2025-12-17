import { Suspense } from "react"

import ClaimsPreAuth from "@/views/apps/claim-management/claim-preauth/preauth.root.component"

const claimsPreAuth = () => {
  return (
    <Suspense fallback={null}>
      <ClaimsPreAuth/>
    </Suspense>
  )
}

export default claimsPreAuth
