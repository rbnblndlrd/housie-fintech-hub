
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FraudStatsCards from './FraudStatsCards';
import FraudAlertsSection from './FraudAlertsSection';
import FraudReviewQueue from './FraudReviewQueue';
import FraudHighRiskUsers from './FraudHighRiskUsers';
import FraudBlockedUsers from './FraudBlockedUsers';
import FraudLogsSection from './FraudLogsSection';
import FraudAnalyticsSection from './FraudAnalyticsSection';
import FraudTestingSection from './FraudTestingSection';

interface FraudDetectionContentProps {
  fraudLogs: any[];
  reviewQueue: any[];
  userBlocks: any[];
  highRiskUsers: any[];
  realtimeAlerts: any[];
  stats: any;
  onUpdate: () => void;
  onUnblockUser: (blockId: string) => void;
}

const FraudDetectionContent: React.FC<FraudDetectionContentProps> = ({
  fraudLogs,
  reviewQueue,
  userBlocks,
  highRiskUsers,
  realtimeAlerts,
  stats,
  onUpdate,
  onUnblockUser
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  return (
    <div className="space-y-6">
      <FraudStatsCards stats={stats} />
      <FraudAlertsSection realtimeAlerts={realtimeAlerts} />

      <Tabs defaultValue="queue" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="queue">Review Queue</TabsTrigger>
          <TabsTrigger value="risks">High Risk Users</TabsTrigger>
          <TabsTrigger value="blocks">Blocked Users</TabsTrigger>
          <TabsTrigger value="logs">Fraud Logs</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="testing">Testing</TabsTrigger>
        </TabsList>

        <TabsContent value="queue">
          <FraudReviewQueue
            reviewQueue={reviewQueue}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            onUpdate={onUpdate}
          />
        </TabsContent>

        <TabsContent value="risks">
          <FraudHighRiskUsers highRiskUsers={highRiskUsers} />
        </TabsContent>

        <TabsContent value="blocks">
          <FraudBlockedUsers 
            userBlocks={userBlocks}
            onUnblockUser={onUnblockUser}
          />
        </TabsContent>

        <TabsContent value="logs">
          <FraudLogsSection fraudLogs={fraudLogs} />
        </TabsContent>

        <TabsContent value="analytics">
          <FraudAnalyticsSection fraudLogs={fraudLogs} />
        </TabsContent>

        <TabsContent value="testing">
          <FraudTestingSection />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FraudDetectionContent;
