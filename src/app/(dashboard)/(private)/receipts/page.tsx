import React, { Suspense } from 'react'

import Receipts from '@/views/apps/receipt-management/receipts';

function receipt_management() {
  return (
    <Suspense fallback={null}>
        <Receipts/>
    </Suspense>
  )
}

export default receipt_management;