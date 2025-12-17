import { Suspense } from "react"

import DynamicAddressComponent from "@/views/apps/master-data-management/address-management/dynamic-address.component"

const InsuranceAddressConfig = () => {
  return (
    <Suspense fallback={null}>
      <DynamicAddressComponent/>
    </Suspense>
  )
}

export default InsuranceAddressConfig
