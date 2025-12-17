import { Suspense } from "react"

import Bank from "@/views/apps/bank-management/bank/bank.component"

const BankManagementBanks = () => {
  return (
    <Suspense fallback={null}>
      <Bank/>
    </Suspense>
  )
}

export default BankManagementBanks
