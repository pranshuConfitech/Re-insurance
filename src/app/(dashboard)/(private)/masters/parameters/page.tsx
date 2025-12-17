import React, { Suspense } from 'react'

import ParametersComponent from '@/views/apps/master-data-management/parameters-management/parameters.component';


function Parameters() {
  return (
    <Suspense fallback={null}>
        <ParametersComponent />
    </Suspense>
  )
}

export default Parameters;
