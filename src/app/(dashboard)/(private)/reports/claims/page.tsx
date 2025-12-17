import { Suspense } from "react"

import ClaimsReportComponent from "@/views/apps/claim-reports/claims.reports.component"

const ReportClaims = () => {
  return (
    <Suspense fallback={null}>
      <ClaimsReportComponent/>
    </Suspense>
  )
}

export default ReportClaims
