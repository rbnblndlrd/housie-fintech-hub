
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
          <Badge className="bg-purple-100 text-purple-800 border-purple-200">
            <Brain className="h-3 w-3 mr-1" />
            AI-Powered
          </Badge>
          <Button size="sm" variant="outline" onClick={handleAutoOptimize} className="bg-white/90 border-gray-300 text-gray-700 hover:bg-gray-50">
            <Zap className="h-4 w-4 mr-1" />
            Auto-Optimize
          </Button>
        </div>
      </div>

      {/* Smart Insights Panel - Solid background for readability */}
      <div className="grid grid-cols-3 gap-3 p-3 bg-gray-100/95 backdrop-blur-sm rounded-lg border border-gray-300">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-sm font-medium text-gray-700">
            <Route className="h-4 w-4 text-blue-600" />
            <span>Efficiency</span>
          </div>
          <div className="text-xl font-bold text-blue-600">{efficiencyScore.toFixed(0)}%</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-sm font-medium text-gray-700">
            <Clock className="h-4 w-4 text-green-600" />
            <span>Total Time</span>
          </div>
          <div className="text-xl font-bold text-green-600">{Math.floor(totalDuration / 60)}h {totalDuration % 60}m</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-sm font-medium text-gray-700">
            <TrendingUp className="h-4 w-4 text-orange-600" />
            <span>Revenue</span>
          </div>
          <div className="text-xl font-bold text-orange-600">${(organizedJobs.length * 180).toFixed(0)}</div>
        </div>
      </div>

      {/* Drop Zone - Solid background when has content */}
      <div 
        className={`min-h-96 border-2 border-dashed rounded-lg p-4 transition-colors ${
          isDragOver 
            ? 'border-blue-400 bg-blue-50' 
            : organizedJobs.length > 0 
              ? 'border-gray-300 bg-gray-100/95 backdrop-blur-sm' 
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
              <span className="text-sm font-medium text-gray-900">
                Optimized Route ({organizedJobs.length} jobs)
              </span>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={handleAutoOptimize} className="text-gray-700 hover:text-gray-900 hover:bg-gray-200">
                  <Zap className="h-3 w-3 mr-1" />
                  <span>Re-optimize</span>
                </Button>
              </div>
            </div>
            
            {organizedJobs.map((job, index) => (
              <div key={job.id} className="flex items-center gap-2 p-3 bg-white/95 backdrop-blur-sm rounded-lg border border-gray-300 shadow-sm">
                <div className="flex flex-col gap-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0 text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                    onClick={() => onReorderJob(job.id, 'up')}
                    disabled={index === 0}
                  >
                    <ArrowUp className="h-3 w-3" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0 text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                    onClick={() => onReorderJob(job.id, 'down')}
                    disabled={index === organizedJobs.length - 1}
                  >
                    <ArrowDown className="h-3 w-3" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-sm font-medium text-gray-900 border border-gray-300">
                  <span>{index + 1}</span>
                </div>
                
                <div className="flex-1">
                  <h4 className="font-medium text-sm text-gray-900">{job.title}</h4>
                  <div className="flex items-center gap-3 text-xs text-gray-600 mt-1">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{job.client}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{job.estimatedDuration}min</span>
                    </div>
                  </div>
                </div>
                
                {index < organizedJobs.length - 1 && (
                  <div className="text-xs text-gray-400 px-2">
                    <Route className="h-3 w-3" />
                  </div>
                )}
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => onRemoveJob(job.id)}
                >
                  <X className="h-4 w-4" />
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
