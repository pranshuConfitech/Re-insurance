import Intimation from "@/views/apps/claim-management/claim-intimation/claim.intimation.component"
import { Suspense } from "react"

const ClaimsIntimation = () => {
  return (
    <Suspense fallback={null}>
      <Intimation />
    </Suspense>
  )
}

export default ClaimsIntimation
