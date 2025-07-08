import React from 'react';
import { Crown, Trophy } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const PrestigeHero = () => {
  // Mock user's highest prestige - in real app this would come from user data
  const userHighestPrestige = {
    title: "Technomancer",
    track: "Appliance & Tech Repair",
    emoji: "⚡",
    level: 6,
    totalJobs: 487,
    nextTitle: null // Max level achieved
  };

  return (
    <div className="text-center space-y-6">
      {/* Main Hero Card */}
      <Card className="bg-gradient-to-br from-orange-500/10 via-yellow-500/10 to-red-500/10 border-orange-200 shadow-xl overflow-hidden">
        <CardContent className="p-8 md:p-12">
          <div className="space-y-6">
            {/* Missing Cog Title */}
            <div className="space-y-2">
              <h1 className="text-3xl md:text-5xl font-bold text-foreground drop-shadow-sm">
                The Missing Cog
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Your Prestige Journey
              </p>
            </div>

            {/* Current Highest Prestige */}
            <div className="bg-slate-50/80 backdrop-blur-sm rounded-xl border border-slate-200 p-6 inline-block">
              <div className="flex items-center gap-4">
                <div className="text-4xl">{userHighestPrestige.emoji}</div>
                <div className="text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-2xl font-bold text-foreground">
                      {userHighestPrestige.title}
                    </h2>
                    <Crown className="h-6 w-6 text-yellow-600" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {userHighestPrestige.track}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="bg-orange-500/10 text-orange-700 border-orange-200">
                      Level {userHighestPrestige.level}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {userHighestPrestige.totalJobs} jobs
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Achievement Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="text-center p-4 bg-slate-50/60 rounded-lg border border-slate-200">
                <p className="text-2xl font-bold text-foreground">7</p>
                <p className="text-xs text-muted-foreground">Active Titles</p>
              </div>
              <div className="text-center p-4 bg-slate-50/60 rounded-lg border border-slate-200">
                <p className="text-2xl font-bold text-foreground">23</p>
                <p className="text-xs text-muted-foreground">Achievements</p>
              </div>
              <div className="text-center p-4 bg-slate-50/60 rounded-lg border border-slate-200">
                <p className="text-2xl font-bold text-foreground">3</p>
                <p className="text-xs text-muted-foreground">Max Ranks</p>
              </div>
              <div className="text-center p-4 bg-slate-50/60 rounded-lg border border-slate-200">
                <p className="text-2xl font-bold text-foreground">92%</p>
                <p className="text-xs text-muted-foreground">Completion</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Status Indicators */}
      <div className="flex flex-wrap justify-center gap-2">
        <Badge variant="default" className="bg-green-500/10 text-green-700 border-green-200">
          <Trophy className="h-3 w-3 mr-1" />
          Origin of Perfection
        </Badge>
        <Badge variant="default" className="bg-blue-500/10 text-blue-700 border-blue-200">
          Lightning Response
        </Badge>
        <Badge variant="default" className="bg-purple-500/10 text-purple-700 border-purple-200">
          Quality Collector
        </Badge>
        <Badge variant="outline" className="text-xs">
          +4 more titles
        </Badge>
      </div>
    </div>
  );
};

export default PrestigeHero;