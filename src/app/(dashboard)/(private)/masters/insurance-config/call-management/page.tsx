import { Suspense } from "react"

import CallDetailComponent from "@/views/apps/master-data-management/insurance-config/endorsement-detail.component"

const InsuranceCallManagement = () => {
  return (
    <Suspense fallback={null}>
      <CallDetailComponent/>
    </Suspense>
  )
}

export default InsuranceCallManagement
