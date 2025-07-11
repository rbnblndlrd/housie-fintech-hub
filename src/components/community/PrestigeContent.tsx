import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Crown, Award, Star, Zap, Lock } from 'lucide-react';

const PrestigeContent = () => {
  const [selectedTitle, setSelectedTitle] = useState('Technomancer');

  const availableTitles = [
    { name: 'Technomancer', emoji: '⚡', unlocked: true, category: 'Overall' },
    { name: 'Sparkmate', emoji: '✨', unlocked: true, category: 'Cleaning' },
    { name: 'Fixmaster', emoji: '🔧', unlocked: true, category: 'Handyman' },
    { name: 'Greenthumb', emoji: '🌱', unlocked: false, category: 'Landscaping' }
  ];

  const prestigeMilestones = [
    { name: 'First Steps', level: 1, unlocked: true, description: 'Complete 5 jobs' },
    { name: 'Rising Star', level: 2, unlocked: true, description: 'Earn 4.5+ rating' },
    { name: 'Professional', level: 3, unlocked: true, description: 'Complete 25 jobs' },
    { name: 'Master', level: 4, unlocked: false, description: 'Complete 100 jobs' }
  ];

  const rankProgress = [
    { category: 'Cleaning', current: 'Expert', progress: 85, next: 'Master', color: 'from-blue-600 to-cyan-600' },
    { category: 'Handyman', current: 'Advanced', progress: 65, next: 'Expert', color: 'from-orange-600 to-red-600' },
    { category: 'Landscaping', current: 'Intermediate', progress: 40, next: 'Advanced', color: 'from-green-600 to-emerald-600' },
    { category: 'Overall', current: 'Technomancer', progress: 75, next: 'Grandmaster', color: 'from-purple-600 to-violet-600' }
  ];

  return (
    <div className="space-y-6">
      {/* Current Prestige */}
      <Card className="bg-card/95 backdrop-blur-md border-border/20">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="mb-4">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Crown className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-2">{selectedTitle} ⚡</h2>
              <Badge variant="secondary" className="text-sm">Prestige Level 3</Badge>
            </div>
            <p className="text-muted-foreground mb-4">Your current equipped title</p>
            <Button variant="outline" onClick={() => {}}>
              Change Title
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Available Titles */}
        <Card className="bg-card/95 backdrop-blur-md border-border/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Available Titles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {availableTitles.map((title, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-lg border transition-colors cursor-pointer ${
                  selectedTitle === title.name 
                    ? 'bg-primary/20 border-primary' 
                    : title.unlocked 
                      ? 'bg-muted/20 hover:bg-muted/30 border-border' 
                      : 'bg-muted/10 border-muted opacity-60'
                }`}
                onClick={() => title.unlocked && setSelectedTitle(title.name)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{title.unlocked ? title.emoji : <Lock className="h-6 w-6" />}</span>
                    <div>
                      <h3 className="font-medium">{title.name}</h3>
                      <p className="text-sm text-muted-foreground">{title.category}</p>
                    </div>
                  </div>
                  {selectedTitle === title.name && (
                    <Badge variant="default">Equipped</Badge>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Prestige Milestones */}
        <Card className="bg-card/95 backdrop-blur-md border-border/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Prestige Milestones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {prestigeMilestones.map((milestone, index) => (
              <div key={index} className={`p-4 rounded-lg ${milestone.unlocked ? 'bg-green-500/20' : 'bg-muted/20'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    milestone.unlocked ? 'bg-green-500' : 'bg-muted'
                  }`}>
                    {milestone.unlocked ? (
                      <Star className="h-5 w-5 text-white" />
                    ) : (
                      <Lock className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{milestone.name}</h3>
                    <p className="text-sm text-muted-foreground">{milestone.description}</p>
                  </div>
                  <Badge variant={milestone.unlocked ? 'default' : 'secondary'}>
                    Level {milestone.level}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Rank Progress */}
      <Card className="bg-card/95 backdrop-blur-md border-border/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Rank Progression
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {rankProgress.map((category, index) => (
            <div key={index} className="p-4 bg-muted/20 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-medium">{category.category}</h3>
                  <p className="text-sm text-muted-foreground">Current: {category.current}</p>
                </div>
                <Badge variant="outline">Next: {category.next}</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress to {category.next}</span>
                  <span>{category.progress}%</span>
                </div>
                <Progress value={category.progress} className="h-2" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default PrestigeContent;