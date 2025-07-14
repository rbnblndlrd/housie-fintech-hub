import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Award, Settings, Stamp } from 'lucide-react';
import PrestigeProfilePreview from './PrestigeProfilePreview';
import RecentStampsWall from '@/components/stamps/RecentStampsWall';

interface RecognitionCardsProps {
  onRecognitionClick: (type: string) => void;
  onRankClick: () => void;
  onCustomizeClick: () => void;
}

const RecognitionCards = ({ onRecognitionClick, onRankClick, onCustomizeClick }: RecognitionCardsProps) => {
  const [showPrestigePreview, setShowPrestigePreview] = useState(false);
  const recognitionData = [
    {
      type: 'quality',
      title: 'Quality Recognition',
      count: 23,
      icon: Trophy,
      color: 'from-blue-600 to-cyan-600'
    },
    {
      type: 'reliability',
      title: 'Reliability Recognition',
      count: 18,
      icon: Trophy,
      color: 'from-green-600 to-emerald-600'
    },
    {
      type: 'courtesy',
      title: 'Courtesy Recognition',
      count: 31,
      icon: Trophy,
      color: 'from-purple-600 to-violet-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Recognition Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recognitionData.map((recognition) => {
          const IconComponent = recognition.icon;
          return (
            <Card 
              key={recognition.type}
              className="fintech-metric-card hover:scale-105 transition-transform cursor-pointer"
              onClick={() => onRecognitionClick(recognition.type)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium opacity-80 mb-1">{recognition.title}</p>
                    <p className="text-3xl font-bold">{recognition.count}</p>
                    <p className="text-sm opacity-70 mt-1">Recognition Points</p>
                  </div>
                  <div className={`w-12 h-12 bg-gradient-to-r ${recognition.color} rounded-xl flex items-center justify-center`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Current Rank and Customize Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card 
          className="fintech-metric-card hover:scale-105 transition-transform cursor-pointer"
          onClick={() => setShowPrestigePreview(true)}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium opacity-80 mb-1">Current Rank</p>
                <p className="text-2xl font-bold">Technomancer ⚡</p>
                <p className="text-sm opacity-70 mt-1">Preview Prestige Profile</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl flex items-center justify-center">
                <Award className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="fintech-metric-card hover:scale-105 transition-transform cursor-pointer"
          onClick={onCustomizeClick}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium opacity-80 mb-1">Customize Display</p>
                <p className="text-lg font-bold">Public Profile</p>
                <p className="text-sm opacity-70 mt-1">Choose what others see</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Settings className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Stamps Showcase */}
      <div className="mt-6">
        <RecentStampsWall limit={6} />
      </div>

      {/* Prestige Profile Preview Modal */}
      <PrestigeProfilePreview 
        isOpen={showPrestigePreview}
        onClose={() => setShowPrestigePreview(false)}
      />
    </div>
  );
};

export default RecognitionCards;