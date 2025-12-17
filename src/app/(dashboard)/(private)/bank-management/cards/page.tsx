import { Suspense } from "react"

import Cards from "@/views/apps/bank-management/card/card.component"

const BankManagementCards = () => {
  return (
    <Suspense fallback={null}>
    <Cards/>
  </Suspense>
  )
}

export default BankManagementCards
