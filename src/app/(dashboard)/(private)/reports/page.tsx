
import { Suspense } from "react"
import Reports from "@/views/apps/underwritings-reports/reports"

const ReportUnderwritings = () => {
  return (
    <Suspense fallback={null}>
      <Reports />
    </Suspense>
  )
}

export default ReportUnderwritings
