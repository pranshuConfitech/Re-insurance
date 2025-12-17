
import { Suspense } from "react"

import QuotationsComponent from "@/views/apps/quotation-service-ui/src/components/quotation.component"

const quotations= () => {
  return (
    <Suspense fallback={null}>
      <QuotationsComponent/>
    </Suspense>
  )
}

export default quotations;
