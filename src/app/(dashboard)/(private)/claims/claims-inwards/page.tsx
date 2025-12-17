import { Suspense } from "react"

import Inward from "../../../../../views/apps/claim-management/claim-inwards/claim.inward.component"

const ClaimsInwards = () => {
  return (
    <Suspense fallback={null}>
      <Inward />
    </Suspense>
  )
}

export default ClaimsInwards
