import { Suspense } from "react"

import CommissionConfig from "@/views/apps/master-data-management/commision-config/comission-config.component"

const CommisionRoleConfig = () => {
  return (
    <Suspense fallback={null}>
      <CommissionConfig/>
    </Suspense>
  )
}

export default CommisionRoleConfig
