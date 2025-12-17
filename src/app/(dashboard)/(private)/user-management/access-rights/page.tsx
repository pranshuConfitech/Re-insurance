import { Suspense } from "react"

import AccessRightsComponent from "@/views/apps/user-management/access-rights/access.rights.component"

const AccessRights = () => {
  return (
    <Suspense fallback={null}>
      <AccessRightsComponent/>
    </Suspense>
  )
}

export default AccessRights
