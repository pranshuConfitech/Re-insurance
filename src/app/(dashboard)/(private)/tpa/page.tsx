import React, { Suspense } from 'react'

import Tpa from '@/views/apps/tpa'

function policies_management() {
  return (
    <Suspense fallback={null}>
      <Tpa />
    </Suspense>
  )
}

export default policies_management
