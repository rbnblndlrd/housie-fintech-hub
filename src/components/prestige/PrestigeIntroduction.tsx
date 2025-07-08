import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, Shield, Trophy, Users } from 'lucide-react';

const PrestigeIntroduction = () => {
  return (
    <div className="space-y-6">
      {/* Main Explanation */}
      <Card className="bg-slate-50/80 backdrop-blur-sm border border-slate-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Lightbulb className="h-6 w-6 text-orange-600" />
            How The Missing Cog System Works
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-foreground leading-relaxed">
            HOUSIE's revolutionary prestige system transforms traditional gig work ratings into a comprehensive 
            professional development framework. Instead of simple star ratings, you earn specific achievements 
            that showcase your expertise, reliability, and community contribution.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50/60 rounded-lg border border-slate-200">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Trophy className="h-4 w-4 text-yellow-600" />
                Beyond Star Ratings
              </h4>
              <p className="text-sm text-muted-foreground">
                Earn specific titles that reflect your actual skills and service quality, 
                not just generic ratings.
              </p>
            </div>
            <div className="p-4 bg-slate-50/60 rounded-lg border border-slate-200">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                Privacy-Gated Transparency
              </h4>
              <p className="text-sm text-muted-foreground">
                Choose what to display publicly while sharing detailed progress 
                with your professional network.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Three-Tier System */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-50/80 backdrop-blur-sm border border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">1</span>
              </div>
              Rank
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground mb-3">
              Professional service progression tracks with Guild Wars 2-inspired titles.
            </p>
            <div className="space-y-2">
              <div className="text-xs font-medium">Example:</div>
              <div className="text-xs bg-slate-50/60 rounded p-2 border border-slate-200">
                Brand Connoisseur → Technomancer 🏆
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-50/80 backdrop-blur-sm border border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">2</span>
              </div>
              Recognition
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground mb-3">
              Community acknowledgment through customer feedback and behavioral excellence.
            </p>
            <div className="space-y-2">
              <div className="text-xs font-medium">Three Types:</div>
              <div className="text-xs space-y-1">
                <div className="bg-slate-50/60 rounded p-1 border border-slate-200">Quality</div>
                <div className="bg-slate-50/60 rounded p-1 border border-slate-200">Reliability</div>
                <div className="bg-slate-50/60 rounded p-1 border border-slate-200">Courtesy</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-50/80 backdrop-blur-sm border border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-violet-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">3</span>
              </div>
              Milestones
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground mb-3">
              Platform engagement achievements and long-term commitment rewards.
            </p>
            <div className="space-y-2">
              <div className="text-xs font-medium">Examples:</div>
              <div className="text-xs bg-slate-50/60 rounded p-2 border border-slate-200">
                First Service → 1,000 Jobs Legend
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievement-Gated Opportunities */}
      <Card className="bg-gradient-to-r from-orange-500/5 to-yellow-500/5 border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-orange-600" />
            Achievement-Gated Opportunities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Premium jobs and exclusive opportunities require specific prestige achievements:
          </p>
          <div className="space-y-2">
            <div className="p-3 bg-slate-50/60 rounded-lg border border-slate-200 text-sm">
              <strong>"Kitchen Reno Crew Needed"</strong> - Must have Technomancer + Quality Collector
            </div>
            <div className="p-3 bg-slate-50/60 rounded-lg border border-slate-200 text-sm">
              <strong>"Emergency Plumbing"</strong> - Lightning Response + Same Day Savior required
            </div>
            <div className="p-3 bg-slate-50/60 rounded-lg border border-slate-200 text-sm">
              <strong>"Premium Cleaning Contract"</strong> - SPOTLESS title holders only
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrestigeIntroduction;