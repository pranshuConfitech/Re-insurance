import { Suspense } from "react"

import NegotiationComponent from "@/views/apps/provider-service/providers/negotiation"

const ProviderNegotiation = () => {
  return (
    <Suspense fallback={null}>
      <NegotiationComponent/>
    </Suspense>
  )
}

export default ProviderNegotiation
