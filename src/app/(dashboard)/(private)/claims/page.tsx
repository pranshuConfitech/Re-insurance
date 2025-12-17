import { Suspense } from "react"

import ClaimDashboard from "@/routes/Pages/ClaimDashboard"

const Claim = () => {
  return (
    <Suspense fallback={null}>
      <ClaimDashboard/>
    </Suspense>
  )
}

export default Claim
