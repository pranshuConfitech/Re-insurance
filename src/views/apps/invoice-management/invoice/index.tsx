'use client'
import * as React from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import InvoiceViewListComponent from './invoice.viewList.component'
import InvoiceDetailsMain from './invoice.details.main.component'
import { AgentsService } from '@/services/remote-api/api/agents-services'

const agentsService = new AgentsService()

// function useQuery() {
//   return new URLSearchParams(useLocation().search);
// }

export default function Invoices() {
  const router = useRouter()
  const query = useSearchParams()
  const mode = query.get('mode')

  React.useEffect(() => {
    if (!mode || !['viewList', 'create'].includes(mode)) {
      router.replace('/invoices?mode=viewList')
    }
  }, [mode, router])

  return (
    <div>
      {(() => {
        switch (query.get('mode')) {
          case 'viewList':
            return <InvoiceViewListComponent />
          case 'create':
            return <InvoiceDetailsMain />
          default:
            return null
        }
      })()}
    </div>
  )
}
