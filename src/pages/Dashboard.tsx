import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import JobTicketTable from '@/components/dashboard/JobTicketTable';
import TodaysRoutePanel from '@/components/dashboard/TodaysRoutePanel';
import PerformanceWidgets from '@/components/dashboard/PerformanceWidgets';
import JobHub from '@/components/dashboard/JobHub';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const handleAnnetteRecommendation = () => {
    // This would open the chat bubble with a specific context
    console.log('Opening Annette recommendations...');
  };

  const annetteCard = (
    <Card className="fintech-card border-purple-200 bg-purple-50 mb-6">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold">A</span>
          </div>
          <div className="flex-1">
            <p className="text-purple-700 font-medium mb-1">Annette says:</p>
            <p className="text-purple-600 text-sm mb-3">
              "You've got 3 active jobs and 2 scheduled for today. Want me to recommend your next move? 
              I'd suggest prioritizing the high-priority job on Rue Saint-Denis first!"
            </p>
            <Button 
              onClick={handleAnnetteRecommendation}
              size="sm" 
              variant="outline" 
              className="border-purple-300 text-purple-700 hover:bg-purple-100"
            >
              Get Recommendations
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <DashboardLayout
      title="Job Hub"
      rightPanelTitle="Today's Route"
      rightPanelContent={<TodaysRoutePanel />}
      bottomWidgets={<PerformanceWidgets />}
    >
      {annetteCard}
      <JobHub />
    </DashboardLayout>
  );
};

export default Dashboard;