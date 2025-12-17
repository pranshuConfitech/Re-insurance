import { Suspense } from "react"

import CaseManagement from "@/views/apps/claim-management/case-management/case.management.list.component"

const caseManagement = () => {
  return (
    <Suspense fallback={null}>
      <CaseManagement/>
    </Suspense>
  )
}

export default caseManagement
