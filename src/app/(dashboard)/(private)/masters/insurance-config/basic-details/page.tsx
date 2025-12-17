import { Suspense } from "react"

import BasicDetailComponent from "@/views/apps/master-data-management/insurance-config/basic-detail.component"

const InsuranceBasicConfig = () => {
  return (
    <Suspense>
      <BasicDetailComponent/>
    </Suspense>
  )
}

export default InsuranceBasicConfig;
