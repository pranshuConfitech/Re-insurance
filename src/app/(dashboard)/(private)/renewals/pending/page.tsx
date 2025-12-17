import React, { Suspense } from 'react'

import RenewalManagementComponent from '@/views/apps/renewal-management/components/renewal-management';

function Renewals_Pending() {
  return (
    <Suspense fallback={null}>
        <RenewalManagementComponent/>
    </Suspense>
  )
}

export default Renewals_Pending;