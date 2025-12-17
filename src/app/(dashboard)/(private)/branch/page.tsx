import { Suspense } from "react"

import Branch from "@/views/apps/branch-management/components/branch.component"

const branch = () => {
  return (
    <Suspense>
      <Branch/>
    </Suspense>
  )
}

export default branch
