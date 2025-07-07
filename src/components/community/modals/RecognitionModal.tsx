import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy } from 'lucide-react';

interface RecognitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  recognitionType: string;
}

const RecognitionModal = ({ isOpen, onClose, recognitionType }: RecognitionModalProps) => {
  const recognitionData = {
    quality: {
      title: 'Quality Recognition',
      count: 23,
      milestones: [
        { threshold: 10, title: 'Quality Starter', achieved: true },
        { threshold: 25, title: 'Quality Professional', achieved: false, progress: 92 },
        { threshold: 50, title: 'Quality Expert', achieved: false },
        { threshold: 100, title: 'Quality Master', achieved: false }
      ]
    },
    reliability: {
      title: 'Reliability Recognition',
      count: 18,
      milestones: [
        { threshold: 10, title: 'Reliability Starter', achieved: true },
        { threshold: 25, title: 'Reliability Professional', achieved: false, progress: 72 },
        { threshold: 50, title: 'Reliability Expert', achieved: false },
        { threshold: 100, title: 'Reliability Master', achieved: false }
      ]
    },
    courtesy: {
      title: 'Courtesy Recognition',
      count: 31,
      milestones: [
        { threshold: 10, title: 'Courtesy Starter', achieved: true },
        { threshold: 25, title: 'Courtesy Professional', achieved: true },
        { threshold: 50, title: 'Courtesy Expert', achieved: false, progress: 62 },
        { threshold: 100, title: 'Courtesy Master', achieved: false }
      ]
    }
  };

  const data = recognitionData[recognitionType as keyof typeof recognitionData];
  if (!data) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            {data.title}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-center p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white">
            <p className="text-3xl font-bold">{data.count}</p>
            <p className="opacity-90">Current Recognition Points</p>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold">Recognition Milestones</h3>
            {data.milestones.map((milestone, index) => (
              <div key={index} className="p-4 bg-muted/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{milestone.title}</span>
                  <Badge variant={milestone.achieved ? 'default' : 'outline'}>
                    {milestone.achieved ? 'Achieved' : 'Locked'}
                  </Badge>
                </div>
                <p className="text-sm opacity-70 mb-2">{milestone.threshold} recognition points required</p>
                {milestone.progress && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{milestone.progress}%</span>
                    </div>
                    <Progress value={milestone.progress} className="h-2" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecognitionModal;