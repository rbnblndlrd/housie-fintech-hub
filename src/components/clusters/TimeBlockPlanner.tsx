import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Clock, Users, Sparkles, BarChart3 } from 'lucide-react';

interface TimeBlock {
  id: string;
  block_name: string;
  start_time: string;
  end_time: string;
  preference_count?: number;
}

interface TimeBlockPlannerProps {
  clusterId: string;
  isOrganizer: boolean;
}

const TimeBlockPlanner: React.FC<TimeBlockPlannerProps> = ({ clusterId, isOrganizer }) => {
  const { toast } = useToast();
  const [optimizing, setOptimizing] = useState(false);

  // Mock time blocks data
  const timeBlocks: TimeBlock[] = [
    {
      id: '1',
      block_name: 'Early Morning',
      start_time: '06:00',
      end_time: '09:00',
      preference_count: 3
    },
    {
      id: '2', 
      block_name: 'Morning',
      start_time: '09:00',
      end_time: '12:00',
      preference_count: 7
    },
    {
      id: '3',
      block_name: 'Afternoon', 
      start_time: '12:00',
      end_time: '17:00',
      preference_count: 5
    },
    {
      id: '4',
      block_name: 'Evening',
      start_time: '17:00',
      end_time: '20:00',
      preference_count: 2
    }
  ];

  const handleClaudeOptimization = async () => {
    setOptimizing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Optimization Complete!",
        description: "Claude has analyzed participant preferences and suggests optimal scheduling.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to optimize schedule. Please try again.",
        variant: "destructive"
      });
    } finally {
      setOptimizing(false);
    }
  };

  const formatTime = (timeStr: string) => {
    const time = new Date(`2000-01-01T${timeStr}`);
    return time.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getPopularityColor = (count: number, maxCount: number) => {
    if (maxCount === 0) return 'bg-gray-200';
    
    const ratio = count / maxCount;
    if (ratio >= 0.8) return 'bg-green-500';
    if (ratio >= 0.6) return 'bg-yellow-500';
    if (ratio >= 0.3) return 'bg-orange-500';
    return 'bg-red-200';
  };

  const maxPreferenceCount = Math.max(...timeBlocks.map(b => b.preference_count || 0));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Time Block Preferences
          </CardTitle>
          {isOrganizer && (
            <Button 
              onClick={handleClaudeOptimization}
              disabled={optimizing}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              {optimizing ? 'Optimizing...' : 'Claude Suggest'}
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-3">
          {timeBlocks.map(block => (
            <div 
              key={block.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <h4 className="font-medium">{block.block_name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {formatTime(block.start_time)} - {formatTime(block.end_time)}
                    </p>
                  </div>
                  
                  {/* Preference Count */}
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <Badge 
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {block.preference_count || 0} prefer{(block.preference_count || 0) !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                </div>
                
                {/* Popularity Bar */}
                <div className="mt-2">
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${getPopularityColor(block.preference_count || 0, maxPreferenceCount)}`}
                      style={{ 
                        width: maxPreferenceCount > 0 
                          ? `${((block.preference_count || 0) / maxPreferenceCount) * 100}%` 
                          : '0%' 
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h5 className="text-sm font-medium mb-2 flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Popularity Legend
          </h5>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>High (80%+)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span>Good (60%+)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded"></div>
              <span>Some (30%+)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-200 rounded"></div>
              <span>Low</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimeBlockPlanner;