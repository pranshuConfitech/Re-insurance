import ForecastChart from '@/views/apps/agent_management/lead/ForecastChart';
import LeadStats from '@/views/apps/agent_management/lead/LeadStats';
import RecentActivities from '@/views/apps/agent_management/lead/RecentActivities';
import CommonDashboard from '@/views/apps/shared-component/components/CommonDashboard';
import React from 'react';


const QuotationDashboard = () => {
  return (
    <CommonDashboard
      title="Quotation Overview"
      statsComponent={LeadStats}
      chartComponent={ForecastChart}
      activitiesComponent={RecentActivities}
    />
  );
};

export default QuotationDashboard; 
