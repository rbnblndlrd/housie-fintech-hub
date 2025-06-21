
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertCircle, Clock, Shield } from 'lucide-react';

interface FraudLog {
  id: string;
  session_id: string;
  user_id: string | null;
  action_type: string;
  risk_score: number;
  action_taken: string;
  reasons: string[];
  created_at: string;
  users?: {
    full_name: string;
    email: string;
  } | null;
}

interface FraudLogsSectionProps {
  fraudLogs: FraudLog[];
}

const FraudLogsSection: React.FC<FraudLogsSectionProps> = ({ fraudLogs }) => {
  const getRiskColor = (score: number) => {
    if (score >= 80) return 'bg-red-500';
    if (score >= 60) return 'bg-orange-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'block': return 'destructive';
      case 'require_verification': return 'secondary';
      case 'review': return 'outline';
      default: return 'default';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'block': return AlertCircle;
      case 'require_verification': return Shield;
      case 'review': return Clock;
      default: return Shield;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Recent Fraud Detection Logs
          <Badge variant="outline" className="ml-auto">
            {fraudLogs.length} entries
          </Badge>
        </CardTitle>
        <CardDescription>
          Real-time fraud detection results and risk assessments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px]">
          <div className="space-y-4">
            {fraudLogs.map((log) => {
              const ActionIcon = getActionIcon(log.action_taken);
              return (
                <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${getRiskColor(log.risk_score)}`} />
                    <ActionIcon className="h-4 w-4 text-gray-500" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">
                          {log.users?.full_name || 'Unknown User'} • {log.action_type}
                        </p>
                        {log.users?.email?.includes('test.fraud.local') && (
                          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                            TEST
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{log.users?.email}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(log.created_at).toLocaleString()}
                      </p>
                      {log.reasons.length > 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                          Reasons: {log.reasons.join(', ')}
                        </p>
                      )}
                      <p className="text-xs text-gray-400">
                        Session: {log.session_id.substring(0, 8)}...
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className={`font-mono ${
                      log.risk_score >= 80 ? 'bg-red-50 text-red-700' :
                      log.risk_score >= 60 ? 'bg-orange-50 text-orange-700' :
                      log.risk_score >= 40 ? 'bg-yellow-50 text-yellow-700' :
                      'bg-green-50 text-green-700'
                    }`}>
                      Risk: {log.risk_score}
                    </Badge>
                    <Badge variant={getActionColor(log.action_taken)}>
                      {log.action_taken}
                    </Badge>
                  </div>
                </div>
              );
            })}
            {fraudLogs.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <Shield className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-lg font-medium">No fraud logs found</p>
                <p className="text-sm">Run some test scenarios to generate fraud detection data</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default FraudLogsSection;
