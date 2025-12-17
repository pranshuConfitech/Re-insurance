import { Suspense } from "react"

import BenefitAddressComponent from "@/views/apps/master-data-management/benefit-config/benefit-address.component"

const InsuranceBenefitConfig = () => {
  return (
    <Suspense fallback={null}>
      <BenefitAddressComponent/>
    </Suspense>
  )
}

export default InsuranceBenefitConfig
