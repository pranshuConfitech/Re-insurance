import { Suspense } from "react"

import ClaimsToBeProcessed from "@/views/apps/claim-management/claim-to-be-processed/cliam.to.be.processed.component"

const claimsToBeProcessed = () => {
  return (
    <Suspense fallback={null}>
      <ClaimsToBeProcessed/>
    </Suspense>
  )
}

export default claimsToBeProcessed
