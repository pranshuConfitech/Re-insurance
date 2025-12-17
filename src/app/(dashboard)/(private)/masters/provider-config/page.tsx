import { Suspense } from "react";

import ProviderAddressConfig from "@/views/apps/master-data-management/provider-config/provider-address.component"

const ProviderConfig = () => {
  return (
    <Suspense fallback={null}>
      <ProviderAddressConfig/>
    </Suspense>
  )
}

export default ProviderConfig
