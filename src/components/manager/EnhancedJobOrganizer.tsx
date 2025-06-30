
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Clock, 
  User, 
  ArrowUp, 
  ArrowDown, 
  X, 
  Zap, 
  Route,
  Brain,
  TrendingUp
} from 'lucide-react';

interface Ticket {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  assignee: string;
  client: string;
  location: string;
  estimatedDuration: number;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  tags: string[];
  createdAt: string;
}

interface EnhancedJobOrganizerProps {
  organizedJobs: Ticket[];
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onRemoveJob: (jobId: string) => void;
  onReorderJob: (jobId: string, direction: 'up' | 'down') => void;
  isDragOver: boolean;
}

const EnhancedJobOrganizer: React.FC<EnhancedJobOrganizerProps> = ({ 
  organizedJobs, 
  onDrop, 
  onDragOver, 
  onRemoveJob, 
  onReorderJob,
  isDragOver 
}) => {
  const totalDuration = organizedJobs.reduce((total, job) => total + job.estimatedDuration, 0);
  const efficiencyScore = Math.min(95, Math.max(60, 85 + Math.random() * 10)); // Mock efficiency calculation
  
  const handleAutoOptimize = () => {
    console.log('Auto-optimizing route based on location and priority...');
    // Future: Implement smart route optimization
  };

  const handleLearnPatterns = () => {
    console.log('Learning from historical patterns...');
    // Future: Implement pattern learning
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white drop-shadow-md text-shadow">Smart Job Organizer</h3>
        <div className="flex items-center gap-2">
          <Badge className="bg-purple-500/30 text-white border-white/30 backdrop-blur-sm drop-shadow-md">
            <Brain className="h-3 w-3 mr-1 drop-shadow-sm" />
            <span className="drop-shadow-sm">AI-Powered</span>
          </Badge>
          <Button size="sm" variant="outline" onClick={handleAutoOptimize} className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm drop-shadow-md">
            <Zap className="h-4 w-4 mr-1 drop-shadow-sm" />
            <span className="drop-shadow-sm">Auto-Optimize</span>
          </Button>
        </div>
      </div>

      {/* Smart Insights Panel - Enhanced readability */}
      <div className="grid grid-cols-3 gap-3 p-3 bg-black/20 backdrop-blur-sm rounded-lg border border-white/30">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-sm font-medium text-white/90 drop-shadow-md">
            <Route className="h-4 w-4 text-blue-400 drop-shadow-sm" />
            <span className="drop-shadow-sm text-shadow">Efficiency</span>
          </div>
          <div className="text-xl font-bold text-blue-400 drop-shadow-lg text-shadow-lg">{efficiencyScore.toFixed(0)}%</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-sm font-medium text-white/90 drop-shadow-md">
            <Clock className="h-4 w-4 text-green-400 drop-shadow-sm" />
            <span className="drop-shadow-sm text-shadow">Total Time</span>
          </div>
          <div className="text-xl font-bold text-green-400 drop-shadow-lg text-shadow-lg">{Math.floor(totalDuration / 60)}h {totalDuration % 60}m</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-sm font-medium text-white/90 drop-shadow-md">
            <TrendingUp className="h-4 w-4 text-orange-400 drop-shadow-sm" />
            <span className="drop-shadow-sm text-shadow">Revenue</span>
          </div>
          <div className="text-xl font-bold text-orange-400 drop-shadow-lg text-shadow-lg">${(organizedJobs.length * 180).toFixed(0)}</div>
        </div>
      </div>

      {/* Drop Zone - Enhanced readability */}
      <div 
        className={`min-h-96 border-2 border-dashed rounded-lg p-4 transition-colors ${
          isDragOver 
            ? 'border-blue-400 bg-blue-500/20 backdrop-blur-sm' 
            : organizedJobs.length > 0 
              ? 'border-white/30 bg-black/10 backdrop-blur-sm' 
              : 'border-white/40 bg-black/20 backdrop-blur-sm'
        }`}
        onDrop={onDrop}
        onDragOver={onDragOver}
      >
        {organizedJobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-white/80">
            <div className="text-4xl mb-4 drop-shadow-md">🤖</div>
            <p className="text-sm text-center mb-2 drop-shadow-md text-shadow">Drop tickets here for AI-powered route optimization</p>
            <Button size="sm" variant="ghost" onClick={handleLearnPatterns} className="text-white/80 hover:text-white hover:bg-white/20 drop-shadow-md">
              <Brain className="h-4 w-4 mr-1 drop-shadow-sm" />
              <span className="drop-shadow-sm">Learn from my patterns</span>
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-white/90 drop-shadow-md text-shadow">
                Optimized Route ({organizedJobs.length} jobs)
              </span>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={handleAutoOptimize} className="text-white/80 hover:text-white hover:bg-white/20 drop-shadow-md">
                  <Zap className="h-3 w-3 mr-1 drop-shadow-sm" />
                  <span className="drop-shadow-sm">Re-optimize</span>
                </Button>
              </div>
            </div>
            
            {organizedJobs.map((job, index) => (
              <div key={job.id} className="flex items-center gap-2 p-3 bg-black/20 backdrop-blur-sm rounded-lg border border-white/20 shadow-sm">
                <div className="flex flex-col gap-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0 text-white/70 hover:text-white hover:bg-white/20 drop-shadow-md"
                    onClick={() => onReorderJob(job.id, 'up')}
                    disabled={index === 0}
                  >
                    <ArrowUp className="h-3 w-3 drop-shadow-sm" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0 text-white/70 hover:text-white hover:bg-white/20 drop-shadow-md"
                    onClick={() => onReorderJob(job.id, 'down')}
                    disabled={index === organizedJobs.length - 1}
                  >
                    <ArrowDown className="h-3 w-3 drop-shadow-sm" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full text-sm font-medium text-white border border-white/30 drop-shadow-md">
                  <span className="drop-shadow-sm text-shadow">{index + 1}</span>
                </div>
                
                <div className="flex-1">
                  <h4 className="font-medium text-sm text-white drop-shadow-md text-shadow">{job.title}</h4>
                  <div className="flex items-center gap-3 text-xs text-white/80 mt-1">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3 drop-shadow-sm" />
                      <span className="drop-shadow-sm">{job.client}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 drop-shadow-sm" />
                      <span className="drop-shadow-sm">{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 drop-shadow-sm" />
                      <span className="drop-shadow-sm">{job.estimatedDuration}min</span>
                    </div>
                  </div>
                </div>
                
                {index < organizedJobs.length - 1 && (
                  <div className="text-xs text-white/40 px-2">
                    <Route className="h-3 w-3 drop-shadow-sm" />
                  </div>
                )}
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/20 drop-shadow-md"
                  onClick={() => onRemoveJob(job.id)}
                >
                  <X className="h-4 w-4 drop-shadow-sm" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedJobOrganizer;
