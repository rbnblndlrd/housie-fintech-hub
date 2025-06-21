
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, AlertCircle } from 'lucide-react';
import FraudStatsCards from './FraudStatsCards';
import FraudAlertsSection from './FraudAlertsSection';
import FraudReviewQueue from './FraudReviewQueue';
import FraudHighRiskUsers from './FraudHighRiskUsers';
import FraudBlockedUsers from './FraudBlockedUsers';
import FraudLogsSection from './FraudLogsSection';
import FraudAnalyticsSection from './FraudAnalyticsSection';
import FraudTestingSection from './FraudTestingSection';
import FraudDebugSection from './FraudDebugSection';

interface FraudDetectionContentProps {
  fraudLogs: any[];
  reviewQueue: any[];
  userBlocks: any[];
  highRiskUsers: any[];
  realtimeAlerts: any[];
  stats: any;
  error?: string | null;
  onUpdate: () => void;
  onUnblockUser: (blockId: string) => void;
  onForceRefresh?: () => void;
}

const FraudDetectionContent: React.FC<FraudDetectionContentProps> = ({
  fraudLogs,
  reviewQueue,
  userBlocks,
  highRiskUsers,
  realtimeAlerts,
  stats,
  error,
  onUpdate,
  onUnblockUser,
  onForceRefresh
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const handleForceRefresh = async () => {
    setRefreshing(true);
    try {
      if (onForceRefresh) {
        await onForceRefresh();
      } else {
        await onUpdate();
      }
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleForceRefresh}
              className="ml-2"
              disabled={refreshing}
            >
              {refreshing ? <RefreshCw className="h-3 w-3 animate-spin" /> : "Retry"}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Manual Refresh Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Fraud Detection Dashboard</h2>
        <Button 
          variant="outline" 
          onClick={handleForceRefresh}
          disabled={refreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh Data'}
        </Button>
      </div>

      <FraudStatsCards stats={stats} />
      <FraudAlertsSection realtimeAlerts={realtimeAlerts} />

      <Tabs defaultValue="queue" className="space-y-4">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="queue">Review Queue</TabsTrigger>
          <TabsTrigger value="risks">High Risk Users</TabsTrigger>
          <TabsTrigger value="blocks">Blocked Users</TabsTrigger>
          <TabsTrigger value="logs">Fraud Logs</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="testing">Testing</TabsTrigger>
          <TabsTrigger value="debug">Debug</TabsTrigger>
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
          <FraudTestingSection onDataUpdated={onUpdate} />
        </TabsContent>

        <TabsContent value="debug">
          <FraudDebugSection />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FraudDetectionContent;
