import { Suspense } from "react"

import ReadyForPaymentRoutersComponent from "@/views/apps/claim-management/ready-for-payment/root.component"

const ReadyForPayment = () => {
  return (
    <Suspense>
      <ReadyForPaymentRoutersComponent/>
    </Suspense>
  )
}

export default ReadyForPayment
