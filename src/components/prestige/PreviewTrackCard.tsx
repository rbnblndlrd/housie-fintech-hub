import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Crown } from 'lucide-react';
import CircularProgress from './CircularProgress';

interface PrestigeLevel {
  title: string;
  jobsRequired: number;
  timeEstimate: string;
  status: 'completed' | 'current' | 'locked';
  currentJobs?: number;
}

interface PreviewTrackCardProps {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  levels: PrestigeLevel[];
  onClick: () => void;
}

const PreviewTrackCard: React.FC<PreviewTrackCardProps> = ({
  title,
  subtitle,
  emoji,
  levels,
  onClick
}) => {
  const completedLevels = levels.filter(level => level.status === 'completed').length;
  const totalLevels = levels.length;
  const progressPercentage = totalLevels > 0 ? (completedLevels / totalLevels) * 100 : 0;
  
  const currentLevel = levels.find(level => level.status === 'current');
  const lastCompletedLevel = levels.filter(level => level.status === 'completed').slice(-1)[0];
  
  const displayTitle = currentLevel?.title || lastCompletedLevel?.title || levels[0]?.title || '';
  const isMaxLevel = completedLevels === totalLevels && totalLevels > 0;

  return (
    <Card 
      className="bg-slate-50/60 border border-slate-200 hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-[1.02]"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="relative">
              <CircularProgress 
                value={progressPercentage} 
                size={50}
                className="shrink-0"
              >
                <span className="text-lg">{emoji}</span>
              </CircularProgress>
              {isMaxLevel && (
                <Crown className="absolute -top-1 -right-1 h-4 w-4 text-yellow-600" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-foreground truncate">{title}</h4>
              <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
              
              {displayTitle && (
                <Badge 
                  variant="outline" 
                  className={`mt-1 text-xs ${
                    currentLevel ? 'bg-orange-500/10 text-orange-700 border-orange-200' :
                    isMaxLevel ? 'bg-green-500/10 text-green-700 border-green-200' :
                    'bg-slate-500/10 text-slate-700 border-slate-200'
                  }`}
                >
                  {displayTitle}
                </Badge>
              )}
              
              <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                <span>{completedLevels}/{totalLevels}</span>
                <span>•</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
            </div>
          </div>
          
          <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
        </div>
      </CardContent>
    </Card>
  );
};

export default PreviewTrackCard;