import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
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
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [optimizing, setOptimizing] = useState(false);

  useEffect(() => {
    fetchTimeBlocks();
  }, [clusterId]);

  const fetchTimeBlocks = async () => {
    try {
      // Fetch time blocks with preference counts
      const { data: blocks, error } = await supabase
        .from('cluster_time_blocks')
        .select(`
          id,
          block_name,
          start_time,
          end_time
        `)
        .eq('cluster_id', clusterId);

      if (error) throw error;

      // Get preference counts for each block
      const blocksWithCounts = await Promise.all(
        (blocks || []).map(async (block) => {
          const { count, error: countError } = await supabase
            .from('cluster_participant_preferences')
            .select('*', { count: 'exact' })
            .eq('time_block_id', block.id);

          if (countError) {
            console.warn('Error counting preferences:', countError);
            return { ...block, preference_count: 0 };
          }

          return { ...block, preference_count: count || 0 };
        })
      );

      setTimeBlocks(blocksWithCounts);
    } catch (error) {
      console.error('Error fetching time blocks:', error);
      toast({
        title: "Error",
        description: "Failed to load time blocks.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClaudeOptimization = async () => {
    setOptimizing(true);
    try {
      // Stub for Claude optimization
      // In a real implementation, this would call Claude API
      
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      toast({
        title: "Optimization Complete!",
        description: "Claude has analyzed participant preferences and suggests optimal scheduling.",
      });

      // Refresh data
      fetchTimeBlocks();
    } catch (error) {
      console.error('Error optimizing schedule:', error);
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

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

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
        {timeBlocks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No time blocks defined for this cluster</p>
          </div>
        ) : (
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
        )}

        {/* Legend */}
        {timeBlocks.length > 0 && (
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
        )}
      </CardContent>
    </Card>
  );
};

export default TimeBlockPlanner;