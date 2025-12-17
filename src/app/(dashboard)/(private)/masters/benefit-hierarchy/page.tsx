import React, { Suspense } from 'react'

import BenefitManagement from '@/views/apps/master-data-management/benefit-management/benefit.management'

function Benefit_Hierarchy() {
  return (
    <Suspense fallback={null}>
      <BenefitManagement/>
    </Suspense>
  )
}

export default Benefit_Hierarchy
