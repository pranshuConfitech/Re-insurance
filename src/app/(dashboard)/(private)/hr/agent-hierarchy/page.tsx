import { Suspense } from "react"

import AgentHierarchyComponent from "@/views/apps/hr-management/hr/agent.hierarchy.component"

const AgentHierarchy = () => {
  return (
    <Suspense fallback={null}>
      <AgentHierarchyComponent/>
    </Suspense>
  )
}

export default AgentHierarchy
