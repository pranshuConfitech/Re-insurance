import React, { Suspense } from 'react'

import MembersDetails from '@/views/apps/member-enquiry/components/members.list.component'

function Member_enquiry() {
  return (
    <Suspense fallback={0}>
        <MembersDetails/>
    </Suspense>
  )
}

export default Member_enquiry