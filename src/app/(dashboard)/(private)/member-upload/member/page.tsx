import React, { Suspense } from 'react'

import MembersComponent from '@/views/apps/member-upload-management/member.component'

function Member() {
  return (
    <Suspense fallback={0}>
        <MembersComponent/>
    </Suspense>
  )
}

export default Member
