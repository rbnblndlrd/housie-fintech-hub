
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, AlertTriangle, Ban, Eye, Clock, TrendingUp } from 'lucide-react';

interface FraudStatsCardsProps {
  stats: {
    totalChecks: number;
    highRiskDetected: number;
    blockedUsers: number;
    pendingReviews: number;
    todayAlerts: number;
    weeklyTrend: number;
  };
}

const FraudStatsCards: React.FC<FraudStatsCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total Checks</p>
              <p className="text-2xl font-bold">{stats.totalChecks}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-8 w-8 text-red-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">High Risk</p>
              <p className="text-2xl font-bold">{stats.highRiskDetected}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <Ban className="h-8 w-8 text-orange-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">Blocked Users</p>
              <p className="text-2xl font-bold">{stats.blockedUsers}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <Eye className="h-8 w-8 text-purple-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
              <p className="text-2xl font-bold">{stats.pendingReviews}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <Clock className="h-8 w-8 text-yellow-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Alerts</p>
              <p className="text-2xl font-bold">{stats.todayAlerts}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-sm font-medium text-gray-600">Weekly Trend</p>
              <p className={`text-2xl font-bold ${stats.weeklyTrend >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                {stats.weeklyTrend >= 0 ? '+' : ''}{stats.weeklyTrend}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FraudStatsCards;
