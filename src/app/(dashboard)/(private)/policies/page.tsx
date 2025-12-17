import React, { Suspense } from 'react'

import Policy from '@/views/apps/policy-management/policy'

function policies_management() {
  return (
    <Suspense fallback={null}>
      <Policy />
    </Suspense>
  )
}

export default policies_management
