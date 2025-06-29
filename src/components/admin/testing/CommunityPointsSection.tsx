
import React from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CommunityPointsSectionProps {
  onAddPoints: (points: number, reason: string) => void;
  disabled: boolean;
}

const CommunityPointsSection: React.FC<CommunityPointsSectionProps> = ({ 
  onAddPoints, 
  disabled 
}) => {
  const pointOptions = [
    { points: 10, label: '+10 Points' },
    { points: 25, label: '+25 Points' },
    { points: 50, label: '+50 Points' },
    { points: 100, label: '+100 Points' },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Star className="h-5 w-5" />
        Community Points
      </h3>
      <div className="flex flex-wrap gap-2">
        {pointOptions.map((option) => (
          <Button
            key={option.points}
            onClick={() => onAddPoints(option.points, `Admin test - ${option.points} points`)}
            disabled={disabled}
            variant="outline"
            size="sm"
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CommunityPointsSection;
