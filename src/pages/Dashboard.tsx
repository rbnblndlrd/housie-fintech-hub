import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import JobTicketTable from '@/components/dashboard/JobTicketTable';
import TodaysRoutePanel from '@/components/dashboard/TodaysRoutePanel';
import PerformanceWidgets from '@/components/dashboard/PerformanceWidgets';

const Dashboard = () => {
  return (
    <DashboardLayout
      title="Job Hub"
      rightPanelTitle="Today's Route"
      rightPanelContent={<TodaysRoutePanel />}
      bottomWidgets={<PerformanceWidgets />}
    >
      <JobTicketTable />
    </DashboardLayout>
  );
};

export default Dashboard;