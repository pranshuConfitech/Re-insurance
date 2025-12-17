"use client"
import ClaimMatrixComponent from '@/views/apps/master-data-management/claimMatrix/claims-matrix';
import React, { Suspense } from 'react'

function ClaimMatrix() {
  return (
    <Suspense fallback={null}>
      <ClaimMatrixComponent />
    </Suspense>
  )
}

export default ClaimMatrix;
