
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Fraud Detection Logs</CardTitle>
        <CardDescription>
          Real-time fraud detection results and risk assessments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px]">
          <div className="space-y-4">
            {fraudLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${getRiskColor(log.risk_score)}`} />
                  <div>
                    <p className="font-medium">
                      {log.users?.full_name || 'Unknown User'} • {log.action_type}
                    </p>
                    <p className="text-sm text-gray-600">{log.users?.email}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(log.created_at).toLocaleString()}
                    </p>
                    {log.reasons.length > 0 && (
                      <p className="text-xs text-gray-500">
                        Reasons: {log.reasons.join(', ')}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">Risk: {log.risk_score}</Badge>
                  <Badge variant={getActionColor(log.action_taken)}>
                    {log.action_taken}
                  </Badge>
                </div>
              </div>
            ))}
            {fraudLogs.length === 0 && (
              <p className="text-center text-gray-500 py-8">No fraud logs found</p>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default FraudLogsSection;
