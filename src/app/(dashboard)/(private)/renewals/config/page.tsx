import React, { Suspense } from 'react'

import RenewalConfigForm from '@/views/apps/renewal-management/components/renewal.config'

function Renewals_Config() {
  return (
    <Suspense fallback={null}>
        <RenewalConfigForm/>
    </Suspense>
  )
}

export default Renewals_Config;