import { Suspense } from "react"

import Credit from "@/views/apps/claim-management/claims/credit.component"

const ClaimsCredit = () => {
  return (
    <Suspense fallback={null}>
      <Credit/>
    </Suspense>
  )
}

export default ClaimsCredit
