import React, { Suspense } from 'react'

import Plan from '@/views/apps/plan-management/components';

function Plans() {
  return (
    <Suspense fallback={null}>
      <Plan/>
    </Suspense>
  )
}

export default Plans;