import React, { Suspense } from 'react'

import PremiumDesignComponent from '@/views/apps/premium-management/components'

function Premium() {
  return (
    <Suspense fallback={null}>
        <PremiumDesignComponent />
    </Suspense>
  )
}

export default Premium
