import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Zap, Target, Crown } from 'lucide-react';

interface ProgressPreviewCardsProps {
  onProgressClick: (type: string) => void;
}

const ProgressPreviewCards = ({ onProgressClick }: ProgressPreviewCardsProps) => {
  const progressData = [
    {
      type: 'behavioral',
      title: 'Behavioral Progress',
      current: 3,
      total: 8,
      description: 'Professional achievements',
      icon: Zap,
      color: 'from-blue-600 to-cyan-600',
      progress: 37.5
    },
    {
      type: 'milestones',
      title: 'Platform Milestones',
      current: 4,
      total: 6,
      description: 'Service milestones',
      icon: Target,
      color: 'from-green-600 to-emerald-600',
      progress: 66.7
    },
    {
      type: 'meta',
      title: 'Kind of a Big Deal',
      current: 3,
      total: 5,
      description: 'Meta achievement progress',
      icon: Crown,
      color: 'from-purple-600 to-violet-600',
      progress: 60
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {progressData.map((item) => {
        const IconComponent = item.icon;
        return (
          <Card 
            key={item.type}
            className="fintech-metric-card hover:scale-105 transition-transform cursor-pointer"
            onClick={() => onProgressClick(item.type)}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <p className="text-sm font-medium opacity-80 mb-1">{item.title}</p>
                  <p className="text-2xl font-bold">{item.current}/{item.total}</p>
                  <p className="text-sm opacity-70">{item.description}</p>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center`}>
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{Math.round(item.progress)}%</span>
                </div>
                <Progress value={item.progress} className="h-2" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ProgressPreviewCards;