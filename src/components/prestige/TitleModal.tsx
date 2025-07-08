import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Trophy, Target } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface PrestigeLevel {
  title: string;
  jobsRequired: number;
  timeEstimate: string;
  status: 'completed' | 'current' | 'locked';
  currentJobs?: number;
}

interface TitleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  trackTitle: string;
  emoji: string;
  level: PrestigeLevel;
  levelIndex: number;
  totalLevels: number;
  nextLevel?: PrestigeLevel;
}

const TitleModal: React.FC<TitleModalProps> = ({
  isOpen,
  onClose,
  title,
  trackTitle,
  emoji,
  level,
  levelIndex,
  totalLevels,
  nextLevel
}) => {
  const getStatusDetails = () => {
    switch (level.status) {
      case 'completed':
        return {
          icon: <CheckCircle className="h-5 w-5 text-green-600" />,
          text: 'Achievement Unlocked!',
          color: 'bg-green-500/10 text-green-700 border-green-200'
        };
      case 'current':
        return {
          icon: <Clock className="h-5 w-5 text-orange-600" />,
          text: 'In Progress',
          color: 'bg-orange-500/10 text-orange-700 border-orange-200'
        };
      case 'locked':
        return {
          icon: <Target className="h-5 w-5 text-gray-600" />,
          text: 'Locked',
          color: 'bg-gray-500/10 text-gray-700 border-gray-200'
        };
      default:
        return {
          icon: <Target className="h-5 w-5 text-gray-600" />,
          text: 'Unknown',
          color: 'bg-gray-500/10 text-gray-700 border-gray-200'
        };
    }
  };

  const statusDetails = getStatusDetails();
  const currentProgress = level.currentJobs || 0;
  const progressPercentage = level.jobsRequired > 0 ? (currentProgress / level.jobsRequired) * 100 : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="text-2xl">{emoji}</span>
            <div>
              <h3 className="text-lg font-bold">{title}</h3>
              <p className="text-sm text-muted-foreground font-normal">{trackTitle}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Status Badge */}
          <div className="flex items-center gap-2">
            {statusDetails.icon}
            <Badge variant="outline" className={statusDetails.color}>
              {statusDetails.text}
            </Badge>
            <Badge variant="outline" className="text-xs">
              Level {levelIndex + 1} of {totalLevels}
            </Badge>
          </div>

          {/* Progress Details */}
          <div className="bg-slate-50/60 rounded-lg p-4 space-y-3">
            <div>
              <h4 className="font-medium mb-1">Requirements</h4>
              <p className="text-sm text-muted-foreground">
                {level.jobsRequired} jobs • {level.timeEstimate}
              </p>
            </div>

            {level.status === 'current' && level.currentJobs !== undefined && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm text-muted-foreground">
                    {currentProgress}/{level.jobsRequired}
                  </span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {level.jobsRequired - currentProgress} jobs remaining
                </p>
              </div>
            )}

            {level.status === 'completed' && (
              <div className="flex items-center gap-2 text-green-700">
                <Trophy className="h-4 w-4" />
                <span className="text-sm font-medium">Achievement completed!</span>
              </div>
            )}
          </div>

          {/* Next Level Preview */}
          {nextLevel && (
            <div className="bg-slate-50/30 rounded-lg p-4 border border-slate-200">
              <h4 className="font-medium mb-2 text-sm">Next Level</h4>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{nextLevel.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {nextLevel.jobsRequired} jobs • {nextLevel.timeEstimate}
                  </p>
                </div>
                <Target className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TitleModal;