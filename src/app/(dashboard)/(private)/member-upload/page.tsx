import React, { Suspense } from 'react'

import MemberUploadComponent from '@/views/apps/member-upload-management'

function Member_upload() {
  return (
    <Suspense fallback={0}>
        <MemberUploadComponent/>
    </Suspense>
  )
}

export default Member_upload
