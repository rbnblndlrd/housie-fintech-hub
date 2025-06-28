
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Handshake, Smile, X } from 'lucide-react';

interface CommendationSelectorProps {
  onComplete: (selectedCommendations: string[]) => void;
  onClose: () => void;
}

export const CommendationSelector: React.FC<CommendationSelectorProps> = ({
  onComplete,
  onClose
}) => {
  const [selectedCommendations, setSelectedCommendations] = useState<string[]>([]);

  const commendations = [
    {
      type: 'quality',
      icon: Star,
      title: 'Quality',
      description: 'Excellent workmanship',
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600'
    },
    {
      type: 'reliability',
      icon: Handshake,
      title: 'Reliability',
      description: 'On time, trustworthy',
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      type: 'courtesy',
      icon: Smile,
      title: 'Courtesy',
      description: 'Friendly, professional',
      color: 'bg-green-500',
      textColor: 'text-green-600'
    }
  ];

  const toggleCommendation = (type: string) => {
    setSelectedCommendations(prev => 
      prev.includes(type) 
        ? prev.filter(c => c !== type)
        : [...prev, type]
    );
  };

  const handleContinue = () => {
    onComplete(selectedCommendations);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md animate-scale-in">
        <CardHeader className="text-center border-b">
          <div className="flex items-center justify-between">
            <div className="flex-1" />
            <CardTitle className="text-xl font-bold">What made this provider great?</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="p-2">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-gray-600 mt-2">Select all that apply (optional)</p>
        </CardHeader>
        
        <CardContent className="p-6 space-y-4">
          {commendations.map((commendation) => {
            const Icon = commendation.icon;
            const isSelected = selectedCommendations.includes(commendation.type);
            
            return (
              <div
                key={commendation.type}
                onClick={() => toggleCommendation(commendation.type)}
                className={`
                  p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                  ${isSelected 
                    ? `border-${commendation.color.replace('bg-', '')}-500 bg-${commendation.color.replace('bg-', '')}-50` 
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full ${commendation.color} text-white`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-semibold ${isSelected ? commendation.textColor : 'text-gray-900'}`}>
                      {commendation.title}
                    </h3>
                    <p className="text-sm text-gray-600">{commendation.description}</p>
                  </div>
                  {isSelected && (
                    <Badge className={`${commendation.color} text-white`}>
                      Selected
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}

          <div className="flex gap-3 mt-6">
            <Button 
              variant="outline" 
              onClick={() => onComplete([])} 
              className="flex-1"
            >
              Skip
            </Button>
            <Button 
              onClick={handleContinue} 
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
            >
              Continue ({selectedCommendations.length})
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
