import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { StampStoryline } from '@/hooks/useStorylines';
import { Clock, Trophy, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface StorylineCardProps {
  storyline: StampStoryline;
}

export const StorylineCard: React.FC<StorylineCardProps> = ({ storyline }) => {
  const progressPercentage = (storyline.progression_stage / storyline.total_stages) * 100;
  const isComplete = storyline.is_complete;

  const getStorylineTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      neighborhood_hero: 'Neighborhood Hero',
      wellness_whisperer: 'Wellness Whisperer',
      road_warrior: 'Road Warrior',
      excellence_pursuit: 'Pursuit of Excellence'
    };
    return labels[type] || type.replace('_', ' ');
  };

  return (
    <Card 
      className={`relative overflow-hidden transition-all hover:shadow-lg ${
        isComplete ? 'border-primary/50 bg-primary/5' : 'border-border'
      }`}
    >
      {/* Theme color accent */}
      <div 
        className="absolute top-0 left-0 right-0 h-1"
        style={{ backgroundColor: storyline.theme_color }}
      />
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="text-xl">{storyline.icon}</span>
              {storyline.title}
            </CardTitle>
            <Badge 
              variant={isComplete ? 'default' : 'secondary'}
              className="text-xs"
            >
              {getStorylineTypeLabel(storyline.storyline_type)}
            </Badge>
          </div>
          {isComplete && (
            <Trophy className="h-5 w-5 text-primary" />
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {storyline.description}
        </p>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">
              {storyline.progression_stage}/{storyline.total_stages}
            </span>
          </div>
          <Progress 
            value={progressPercentage} 
            className="h-2"
            style={{
              '--progress-color': storyline.theme_color
            } as React.CSSProperties}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Started {format(new Date(storyline.created_at), 'MMM d')}
          </div>
          {isComplete && storyline.completed_at && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Completed {format(new Date(storyline.completed_at), 'MMM d')}
            </div>
          )}
        </div>

        {isComplete && (
          <Badge variant="default" className="w-full justify-center">
            ✅ Storyline Complete
          </Badge>
        )}
      </CardContent>
    </Card>
  );
};