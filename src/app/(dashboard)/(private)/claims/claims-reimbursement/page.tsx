import { Suspense } from "react"

import ClaimsReimbursement from "@/views/apps/claim-management/claim-reimbursement/cliam.reim.component"

const claimsReimbursement = () => {
  return (
    <Suspense>
      <ClaimsReimbursement/>
    </Suspense>
  )
}

export default claimsReimbursement
