import { Suspense } from "react";

import DocSourceComponent from "@/views/apps/master-data-management/doc-source/doc-source.component";

const ProviderConfig = () => {
  return (
    <Suspense fallback={null}>
      <DocSourceComponent />
    </Suspense>
  )
}

export default ProviderConfig
