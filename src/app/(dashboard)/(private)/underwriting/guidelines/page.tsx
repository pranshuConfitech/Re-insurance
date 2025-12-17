import { Suspense } from "react"

import GuidelinesComponent from "@/views/apps/guidelines/guidelines.component"

const UnderwritingGuidelines = () => {
  return (
    <Suspense>
      <GuidelinesComponent/>
    </Suspense>
  )
}

export default UnderwritingGuidelines
