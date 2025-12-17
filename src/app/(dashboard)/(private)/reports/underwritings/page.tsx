
import { Suspense } from "react"

import UnderwritingsReportComponent from "@/views/apps/underwritings-reports/underwritings.reports.component"

const ReportUnderwritings = () => {
  return (
   <Suspense fallback={null}>
    <UnderwritingsReportComponent/>
   </Suspense>
  )
}

export default ReportUnderwritings
