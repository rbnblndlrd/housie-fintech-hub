
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, AlertTriangle, Ban, Eye, Clock, TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface FraudStatsCardsProps {
  stats: {
    totalChecks: number;
    highRiskDetected: number;
    blockedUsers: number;
    pendingReviews: number;
    todayAlerts: number;
    weeklyTrend: number;
  };
  loading?: boolean;
}

const FraudStatsCards: React.FC<FraudStatsCardsProps> = ({ stats, loading = false }) => {
  console.log('📊 FraudStatsCards rendering with stats:', stats, 'loading:', loading);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-12" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Checks',
      value: stats.totalChecks,
      icon: Shield,
      color: 'text-blue-600',
      description: 'All fraud detection runs'
    },
    {
      title: 'High Risk (50+)',
      value: stats.highRiskDetected,
      icon: AlertTriangle,
      color: 'text-red-600',
      description: 'Risk score >= 50'
    },
    {
      title: 'Blocked Users',
      value: stats.blockedUsers,
      icon: Ban,
      color: 'text-orange-600',
      description: 'Currently active blocks'
    },
    {
      title: 'Pending Reviews',
      value: stats.pendingReviews,
      icon: Eye,
      color: 'text-purple-600',
      description: 'Awaiting manual review'
    },
    {
      title: "Today's Alerts",
      value: stats.todayAlerts,
      icon: Clock,
      color: 'text-yellow-600',
      description: 'Last 24 hours'
    },
    {
      title: 'Weekly Trend',
      value: `${stats.weeklyTrend >= 0 ? '+' : ''}${stats.weeklyTrend}%`,
      icon: TrendingUp,
      color: stats.weeklyTrend >= 0 ? 'text-red-600' : 'text-green-600',
      description: 'vs previous week'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
      {statCards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Icon className={`h-8 w-8 ${card.color}`} />
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p 
                    className="text-2xl font-bold" 
                    title={`${card.description} - Actual value: ${typeof card.value === 'number' ? card.value : card.value}`}
                  >
                    {typeof card.value === 'number' ? card.value : card.value}
                  </p>
                  <p className="text-xs text-gray-500">{card.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default FraudStatsCards;
