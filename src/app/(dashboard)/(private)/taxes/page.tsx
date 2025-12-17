import { Suspense } from "react"

import Taxes from "@/views/apps/tax-management/taxes/tax.component"

const taxes = () => {
  return (
    <Suspense>
      <Taxes/>
    </Suspense>
  )
}

export default taxes;
