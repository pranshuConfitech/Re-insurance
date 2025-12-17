import React, { Suspense } from 'react'

import SLAConfiguration from '@/views/apps/sla-configuration/sla'

function sla_configuration() {
  return (
    <Suspense fallback={null}>
        <SLAConfiguration/>
    </Suspense>
  )
}

export default sla_configuration