import React, { useEffect } from 'react'

import { TabView, TabPanel } from 'primereact/tabview'

import { PreAuthService } from '@/services/remote-api/api/claims-services/claim.preauth.services'
import IndemnityCreditClaimListComponent from './in-credit.list.component'
import IndemnityClaimListComponent from './in-claim.list.component'
import IndemnityReimClaimListComponent from './in-reim.list.component'

export default function TemplateDemo() {
  const [count, setCount] = React.useState({
    approved: 0,
    cancelled: 0,
    draft: 0,
    rejected: 0,
    requested: 0,
    total: 0
  })

  const [activeIndex, setActiveIndex] = React.useState(0)
  const preAuthService = new PreAuthService()
  const pas$ = preAuthService.getDashboardCount()

  useEffect(() => {
    pas$.subscribe(result => {
      setCount(result?.data)
    })
  }, [])

  return (
    <div className='card'>
      <TabView
        scrollable
        style={{ fontSize: '14px' }}
        activeIndex={activeIndex}
        onTabChange={e => setActiveIndex(e.index)}
      >
        <TabPanel leftIcon='pi pi-user mr-2' header='Claims'>
          <IndemnityClaimListComponent />
        </TabPanel>
        <TabPanel leftIcon='pi pi-user-minus mr-2' header='Reimburshment Claims'>
          <IndemnityReimClaimListComponent />
        </TabPanel>
        <TabPanel leftIcon='pi pi-user-minus mr-2' header='Credit Claims'>
          <IndemnityCreditClaimListComponent />
        </TabPanel>
      </TabView>
    </div>
  )
}
