import { Suspense } from "react"

import ClientHierarchyComponent from "@/views/apps/hr-management/hr/client.hierarchy.component"

const EmployeeHierarchy = () => {
  return (
    <Suspense fallback={null}>
      <ClientHierarchyComponent/>
    </Suspense>
  )
}

export default EmployeeHierarchy
