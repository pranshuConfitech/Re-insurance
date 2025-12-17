import { Suspense } from "react"

import Provider, { Dashboard } from "@/views/apps/provider-service/providers"

const ProviderRoot = () => {
  return (
    <Suspense fallback={null}>
      {/* <Dashboard /> */}
      <Provider />
    </Suspense>
  )
}

export default ProviderRoot
