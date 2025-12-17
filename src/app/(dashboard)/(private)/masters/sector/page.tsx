import { Suspense } from "react";

import Sector from "@/views/apps/master-data-management/sector/sector.component"

const ProviderConfig = () => {
  return (
    <Suspense fallback={null}>
      <Sector />
    </Suspense>
  )
}

export default ProviderConfig
