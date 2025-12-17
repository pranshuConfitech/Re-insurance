import React, { Suspense } from 'react'

import DenominationComponent from '@/views/apps/master-data-management/denomination-management/denomination.main.component';

function Denomination() {
  return (
    <Suspense fallback={null}>
      <DenominationComponent/>
    </Suspense>
  )
}

export default Denomination;
