import React, { Suspense } from 'react'

import MemberBalance from '@/views/apps/member-balance-management/components'

function Member_balance() {
  return (
    <Suspense fallback={null}>
        <MemberBalance/>
    </Suspense>
  )
}

export default Member_balance