import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  MapPin, 
  DollarSign, 
  Clock,
  Camera,
  FileText,
  CheckCircle,
  Lock,
  User
} from 'lucide-react';
import { useRouteOptimizer, Job, JobExecutionPhase } from '@/hooks/useRouteOptimizer';
import PhotoVerificationSection from './PhotoVerificationSection';

interface JobExecutionModeProps {
  job: Job;
  phases: JobExecutionPhase[];
  progressPercentage: number;
  onBack: () => void;
  onCompleteJob: (jobId: string) => void;
  onUpdatePhotoRequirement: (phaseId: string, requirementId: string, file: File, thumbnail: string) => void;
}

const JobExecutionMode: React.FC<JobExecutionModeProps> = ({
  job,
  phases,
  progressPercentage,
  onBack,
  onCompleteJob,
  onUpdatePhotoRequirement
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'emergency': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const allPhasesComplete = phases.every(phase => phase.completed);

  return (
    <Card className="fintech-card">
      <CardHeader className="pb-2 px-3 pt-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <CheckCircle className="h-4 w-4" />
            Job Execution Mode
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Route
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 px-3 pb-3 space-y-4">
        {/* Job Brief */}
        <div className="fintech-card-secondary p-3 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-sm">
              JOB BRIEF: {job.serviceType} - {job.customerName}
            </h3>
            <Badge className={getPriorityColor(job.priority)}>
              {job.priority}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <User className="h-3 w-3 text-gray-500" />
              <span className="font-medium">CLIENT:</span>
              <span>{job.customerName}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-3 w-3 text-gray-500" />
              <span className="font-medium">LOCATION:</span>
              <span>{job.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-3 w-3 text-green-600" />
              <span className="font-medium">EARNINGS:</span>
              <span className="font-semibold text-green-600">${job.amount}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3 text-blue-600" />
              <span className="font-medium">DURATION:</span>
              <span>{job.estimatedDuration} min</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium">Progress:</span>
            <span className="font-semibold">{progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Phases */}
        <div className="space-y-3">
          {phases.map((phase, index) => (
            <div key={phase.id} className="border rounded-lg">
              <div className={`p-3 border-b ${phase.unlocked ? 'bg-white' : 'bg-gray-50'}`}>
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    {phase.unlocked ? (
                      phase.completed ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <div className="w-4 h-4 border-2 border-blue-600 rounded-full" />
                      )
                    ) : (
                      <Lock className="h-4 w-4 text-gray-400" />
                    )}
                    PHASE {index + 1}: {phase.name}
                  </h4>
                  {phase.completed && (
                    <Badge className="bg-green-100 text-green-800">Complete</Badge>
                  )}
                </div>
              </div>
              
              <div className="p-3">
                {phase.unlocked ? (
                  <div className="space-y-2">
                    {phase.requirements.map((requirement) => (
                      <PhotoVerificationSection
                        key={requirement.id}
                        requirement={requirement}
                        onPhotoCapture={(file, thumbnail) => 
                          onUpdatePhotoRequirement(phase.id, requirement.id, file, thumbnail)
                        }
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    🔒 Complete Phase {index} first
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          {allPhasesComplete ? (
            <Button 
              onClick={() => onCompleteJob(job.id)}
              className="flex-1 fintech-button-primary"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Complete Job & Release Payment
            </Button>
          ) : (
            <Button 
              disabled 
              className="flex-1"
              variant="outline"
            >
              Complete All Phases First
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default JobExecutionMode;