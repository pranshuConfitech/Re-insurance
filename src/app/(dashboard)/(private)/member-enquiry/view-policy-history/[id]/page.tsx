import React, { Suspense } from 'react'

import ViewPolicyHistory from '@/views/apps/member-enquiry/components/member.details.view.policy.history';

function View_Policy_Hisitory() {
  return (
    <Suspense fallback={0}>
        <ViewPolicyHistory/>
    </Suspense>
  )
}

export default View_Policy_Hisitory;