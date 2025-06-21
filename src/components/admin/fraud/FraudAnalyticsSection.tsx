
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface FraudLog {
  id: string;
  action_type: string;
  risk_score: number;
}

interface FraudAnalyticsSectionProps {
  fraudLogs: FraudLog[];
}

const FraudAnalyticsSection: React.FC<FraudAnalyticsSectionProps> = ({ fraudLogs }) => {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Fraud Trends & Analytics</CardTitle>
          <CardDescription>
            Platform security insights and fraud prevention metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Risk Distribution</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Low Risk (0-39)</span>
                  <span className="text-sm font-medium">
                    {fraudLogs.filter(log => log.risk_score < 40).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Medium Risk (40-59)</span>
                  <span className="text-sm font-medium">
                    {fraudLogs.filter(log => log.risk_score >= 40 && log.risk_score < 60).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">High Risk (60-79)</span>
                  <span className="text-sm font-medium">
                    {fraudLogs.filter(log => log.risk_score >= 60 && log.risk_score < 80).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Critical Risk (80+)</span>
                  <span className="text-sm font-medium">
                    {fraudLogs.filter(log => log.risk_score >= 80).length}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Action Types</h4>
              <div className="space-y-2">
                {['registration', 'booking', 'payment', 'messaging', 'login'].map(type => (
                  <div key={type} className="flex justify-between">
                    <span className="text-sm capitalize">{type}</span>
                    <span className="text-sm font-medium">
                      {fraudLogs.filter(log => log.action_type === type).length}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FraudAnalyticsSection;
