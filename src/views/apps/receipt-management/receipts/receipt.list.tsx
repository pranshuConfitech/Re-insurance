import React, { useEffect } from 'react'

import { TabView, TabPanel } from 'primereact/tabview'
import FundReceiptListComponent from './fund.receipts.list.component'
import ReceiptListComponent from './receipts.list.component'


export default function ReceiptTabComponent() {

    const [activeIndex, setActiveIndex] = React.useState(0)

    return (
        <div className='card'>
            <TabView
                scrollable
                style={{ fontSize: '14px' }}
                activeIndex={activeIndex}
                onTabChange={e => setActiveIndex(e.index)}
            >
                <TabPanel leftIcon='pi pi-receipt mr-2' header='Invoiced Receipts'>
                    <ReceiptListComponent />
                </TabPanel>
                <TabPanel leftIcon='pi pi-file mr-2' header='Fund Invoiced Receipts'>
                    <FundReceiptListComponent />
                </TabPanel>
            </TabView>
        </div>
    )
}
