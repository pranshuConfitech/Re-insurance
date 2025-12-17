import { Suspense } from "react"

import Fees from "@/views/apps/fees-management/components"

const FeesComponent = () => {
  return (
    <Suspense fallback={null}>
      <Fees/>
    </Suspense>
  )
}

export default FeesComponent
