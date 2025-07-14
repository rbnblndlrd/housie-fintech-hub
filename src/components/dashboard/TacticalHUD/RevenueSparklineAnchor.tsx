import React from 'react';
import { AnchorCard } from './AnchorCard';
import { TrendingUp, DollarSign, Calendar } from 'lucide-react';

export const RevenueSparklineAnchor: React.FC = () => {
  // Mock sparkline data for the week
  const weeklyData = [120, 180, 160, 210, 240, 280, 220];
  const maxValue = Math.max(...weeklyData);
  const minValue = Math.min(...weeklyData);
  
  const normalizeValue = (value: number) => {
    return ((value - minValue) / (maxValue - minValue)) * 100;
  };

  const currentRevenue = weeklyData[weeklyData.length - 1];
  const previousRevenue = weeklyData[weeklyData.length - 2];
  const change = currentRevenue - previousRevenue;
  const changePercent = ((change / previousRevenue) * 100).toFixed(1);

  return (
    <AnchorCard title="Revenue Pulse" icon={TrendingUp}>
      <div className="space-y-3 h-full">
        {/* Current Revenue */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-500" />
            <span className="text-lg font-bold text-foreground">${currentRevenue}</span>
          </div>
          <div className={`text-xs ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {change >= 0 ? '+' : ''}{changePercent}%
          </div>
        </div>

        {/* Sparkline */}
        <div className="relative h-12 bg-muted/20 rounded p-1">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polyline
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              points={weeklyData.map((value, index) => 
                `${(index / (weeklyData.length - 1)) * 100},${100 - normalizeValue(value)}`
              ).join(' ')}
            />
            {/* Gradient fill */}
            <polygon
              fill="url(#gradient)"
              points={`0,100 ${weeklyData.map((value, index) => 
                `${(index / (weeklyData.length - 1)) * 100},${100 - normalizeValue(value)}`
              ).join(' ')} 100,100`}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3"/>
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.05"/>
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Week Overview */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
            <div key={index} className="text-xs">
              <div className="text-muted-foreground">{day}</div>
              <div className={`text-xs font-medium ${
                index === weeklyData.length - 1 ? 'text-primary' : 'text-foreground'
              }`}>
                ${weeklyData[index]}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">This Week</span>
          </div>
          <span className="font-medium text-foreground">
            ${weeklyData.reduce((a, b) => a + b, 0).toLocaleString()}
          </span>
        </div>
      </div>
    </AnchorCard>
  );
};