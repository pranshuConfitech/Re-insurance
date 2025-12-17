import React from 'react';
import CommonDashboard from '../../shared-component/components/CommonDashboard';
import LeadStats from '../../agent_management/lead/LeadStats';
import ForecastChart from '../../agent_management/lead/ForecastChart';
import RecentActivities from '../../agent_management/lead/RecentActivities';


const InvoiceDashboard = () => {
  return (
    <CommonDashboard
      title="Invoice Overview"
      statsComponent={LeadStats}
      chartComponent={ForecastChart}
      activitiesComponent={RecentActivities}
    />
  );
};

export default InvoiceDashboard; 
