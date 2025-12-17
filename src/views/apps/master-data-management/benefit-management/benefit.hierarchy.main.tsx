
import React from 'react';

import { TabView, TabPanel } from 'primereact/tabview';

import BenefitHierarchyListComponent from "./benefit.hierarchy.list";



const BenefitHierarchyMainComponent = () => {
  const [activeIndex, setActiveIndex] = React.useState(0);

  return (
    <TabView scrollable  style={{fontSize: '14px'}} activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
      <TabPanel leftIcon="pi pi-sign-out mr-2" header="Signed Off">
        <BenefitHierarchyListComponent />
      </TabPanel>
      <TabPanel leftIcon="pi pi-window-maximize mr-2" header="Pending Sign Off"> 
        <BenefitHierarchyListComponent />
      </TabPanel>
    </TabView>
  );
}


export default BenefitHierarchyMainComponent;