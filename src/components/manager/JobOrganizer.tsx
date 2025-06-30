
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, User, ArrowUp, ArrowDown, X } from 'lucide-react';

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

interface JobOrganizerProps {
  organizedJobs: Ticket[];
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onRemoveJob: (jobId: string) => void;
  onReorderJob: (jobId: string, direction: 'up' | 'down') => void;
  isDragOver: boolean;
}

const JobOrganizer: React.FC<JobOrganizerProps> = ({ 
  organizedJobs, 
  onDrop, 
  onDragOver, 
  onRemoveJob, 
  onReorderJob,
  isDragOver 
}) => {
  return (
    <Card className="bg-white/95 backdrop-blur-sm hover:shadow-lg transition-shadow h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>🗂️</span>
          Job Organizer
        </CardTitle>
        <p className="text-sm text-gray-600">Drag tickets here to organize routes</p>
      </CardHeader>
      <CardContent>
        <div 
          className={`min-h-96 border-2 border-dashed rounded-lg p-4 transition-colors ${
            isDragOver 
              ? 'border-blue-500 bg-blue-50' 
              : organizedJobs.length > 0 
                ? 'border-gray-200 bg-gray-50' 
                : 'border-gray-300 bg-gray-100'
          }`}
          onDrop={onDrop}
          onDragOver={onDragOver}
        >
          {organizedJobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <div className="text-4xl mb-2">📋</div>
              <p className="text-sm text-center">Drop tickets here to organize them for routing</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-700">
                  Route Order ({organizedJobs.length} jobs)
                </span>
                <span className="text-xs text-gray-500">
                  Total: {organizedJobs.reduce((total, job) => total + job.estimatedDuration, 0)}min
                </span>
              </div>
              
              {organizedJobs.map((job, index) => (
                <div key={job.id} className="flex items-center gap-2 p-3 bg-white rounded-lg border">
                  <div className="flex flex-col gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0"
                      onClick={() => onReorderJob(job.id, 'up')}
                      disabled={index === 0}
                    >
                      <ArrowUp className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0"
                      onClick={() => onReorderJob(job.id, 'down')}
                      disabled={index === organizedJobs.length - 1}
                    >
                      <ArrowDown className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full text-sm font-medium text-blue-600">
                    {index + 1}
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-medium text-sm text-gray-900">{job.title}</h4>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
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
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => onRemoveJob(job.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default JobOrganizer;
