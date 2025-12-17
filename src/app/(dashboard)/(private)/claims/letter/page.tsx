import { Suspense } from "react"

import Letter from "@/views/apps/claim-management/letter-management/components/letter.component"

const ClaimsLetter = () => {
  return (
   <Suspense fallback={null}>
    <Letter/>
   </Suspense>
  )
}

export default ClaimsLetter
