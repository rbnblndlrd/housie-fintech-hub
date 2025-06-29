
import React from 'react';
import { Award } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CommendationsSectionProps {
  onAddCommendation: (type: string) => void;
  disabled: boolean;
}

const CommendationsSection: React.FC<CommendationsSectionProps> = ({ 
  onAddCommendation, 
  disabled 
}) => {
  const commendationTypes = [
    { type: 'quality', label: 'Quality' },
    { type: 'reliability', label: 'Reliability' },
    { type: 'courtesy', label: 'Courtesy' },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Award className="h-5 w-5" />
        Commendations
      </h3>
      <div className="flex flex-wrap gap-2">
        {commendationTypes.map((commendation) => (
          <Button
            key={commendation.type}
            onClick={() => onAddCommendation(commendation.type)}
            disabled={disabled}
            variant="outline"
            size="sm"
          >
            {commendation.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CommendationsSection;
