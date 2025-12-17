import { Suspense } from "react"

import ClaimsAuditDetailsComponent from "@/views/apps/claim-management/claim-audit/audit.component"

const claimsAudit = () => {
  return (
    <Suspense>
      <ClaimsAuditDetailsComponent/>
    </Suspense>
  )
}

export default claimsAudit
