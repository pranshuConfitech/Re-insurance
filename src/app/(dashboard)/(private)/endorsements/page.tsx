import React, { Suspense } from 'react'

import Endorsement from '@/views/apps/endorsement-management/endorsements'

function endorsement() {
  return (
    <Suspense fallback={null}>
        <Endorsement/>
    </Suspense>
  )
}

export default endorsement