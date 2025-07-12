import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Crown, Star, Trophy, Shield, Users, Sparkles, Target, CheckCircle } from 'lucide-react';

interface PrestigeDetailsModalProps {
  children: React.ReactNode;
  currentTitle: string;
  credScore: number;
  proofOfWorth: number;
  nextMilestone: number;
}

const PrestigeDetailsModal: React.FC<PrestigeDetailsModalProps> = ({ 
  children, 
  currentTitle,
  credScore,
  proofOfWorth,
  nextMilestone
}) => {
  const [open, setOpen] = useState(false);

  const allTitles = [
    { 
      name: 'New Member', 
      icon: Star, 
      unlocked: true, 
      requirements: 'Sign up and complete profile',
      credRequired: 0,
      powRequired: 0
    },
    { 
      name: 'Trusted Patron', 
      icon: Shield, 
      unlocked: credScore >= 50, 
      current: currentTitle === 'Trusted Patron',
      requirements: 'Complete 3 jobs with positive reviews',
      credRequired: 50,
      powRequired: 3
    },
    { 
      name: 'Neighborhood Connector', 
      icon: Users, 
      unlocked: credScore >= 100, 
      current: currentTitle === 'Neighborhood Connector',
      requirements: 'Build 5+ trusted provider connections',
      credRequired: 100,
      powRequired: 10
    },
    { 
      name: 'Elite Customer', 
      icon: Crown, 
      unlocked: credScore >= 200, 
      current: currentTitle === 'Elite Customer',
      requirements: '15+ completed jobs, 4.5+ average rating',
      credRequired: 200,
      powRequired: 25
    },
    { 
      name: 'Community Champion', 
      icon: Trophy, 
      unlocked: credScore >= 500, 
      current: currentTitle === 'Community Champion',
      requirements: 'Help 50+ providers, mentor new users',
      credRequired: 500,
      powRequired: 50
    }
  ];

  const nextTitle = allTitles.find(title => !title.unlocked);
  const missingRequirements = nextTitle ? {
    cred: Math.max(0, nextTitle.credRequired - credScore),
    pow: Math.max(0, nextTitle.powRequired - proofOfWorth)
  } : null;

  const progressToNext = nextTitle ? 
    ((credScore / nextTitle.credRequired) * 100) : 100;

  const getTips = () => {
    if (!nextTitle) return ["🎉 You've reached the highest title! Keep being awesome!"];
    
    const tips = [];
    
    if (missingRequirements?.cred > 0) {
      tips.push(`🌟 Earn ${missingRequirements.cred} more Cred Score points by:`);
      tips.push("• Complete more jobs with high ratings");
      tips.push("• Leave detailed reviews for providers");
      tips.push("• Rebook with trusted providers");
    }
    
    if (missingRequirements?.pow > 0) {
      tips.push(`🎯 Complete ${missingRequirements.pow} more Proof of Worth milestones:`);
      tips.push("• Book jobs in new service categories");
      tips.push("• Build long-term provider relationships");
      tips.push("• Help other customers find good providers");
    }
    
    return tips;
  };

  const encouragementMessages = [
    "You're killing it out there, honey! 💪",
    "Look at you building that empire! 👑",
    "Your reputation game is STRONG! 🔥",
    "The providers love working with you! ❤️",
    "You're almost there - don't stop now! 🚀"
  ];

  const randomEncouragement = encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="fintech-card max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Prestige Progress & Tips
          </DialogTitle>
        </DialogHeader>
        
        {/* Annette Header */}
        <div className="fintech-inner-box p-4 bg-primary/5">
          <div className="flex items-start gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/avatars/annette.jpg" alt="Annette" />
              <AvatarFallback className="bg-primary text-primary-foreground">A</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h4 className="font-medium text-sm mb-1">
                💅 Annette's Prestige Coaching
              </h4>
              <p className="text-sm text-muted-foreground mb-2">
                Want to know how to level up? I've got tips, baby. {randomEncouragement}
              </p>
              {nextTitle && (
                <p className="text-sm text-primary font-medium">
                  Next up: {nextTitle.name} - You're {Math.round(progressToNext)}% there! 
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Current Status */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center space-y-2">
            <div className="text-2xl font-bold text-primary">{credScore}</div>
            <div className="text-sm text-muted-foreground">Cred Score</div>
          </div>
          <div className="text-center space-y-2">
            <div className="text-2xl font-bold text-primary">{proofOfWorth}</div>
            <div className="text-sm text-muted-foreground">Proof of Worth</div>
          </div>
        </div>

        {/* Progress to Next Title */}
        {nextTitle && (
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Progress to {nextTitle.name}</span>
              <span>{credScore}/{nextTitle.credRequired} Cred</span>
            </div>
            <Progress value={progressToNext} className="h-3" />
          </div>
        )}

        {/* All Titles */}
        <div className="space-y-4">
          <h4 className="font-medium">Title Progression</h4>
          {allTitles.map((title, index) => {
            const IconComponent = title.icon;
            return (
              <div 
                key={title.name} 
                className={`flex items-start gap-3 p-3 rounded-lg border ${
                  title.current 
                    ? 'bg-primary/10 border-primary/30' 
                    : title.unlocked 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-muted/30 border-muted opacity-60'
                }`}
              >
                <div className={`p-2 rounded-lg ${
                  title.current ? 'bg-primary/20' : title.unlocked ? 'bg-green-100' : 'bg-muted'
                }`}>
                  <IconComponent className={`h-4 w-4 ${
                    title.current ? 'text-primary' : title.unlocked ? 'text-green-600' : 'text-muted-foreground'
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`font-medium ${title.current ? 'text-primary' : ''}`}>
                      {title.name}
                    </span>
                    {title.current && (
                      <Badge variant="default" className="text-xs">Current</Badge>
                    )}
                    {title.unlocked && !title.current && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {title.requirements}
                  </p>
                  <div className="text-xs text-muted-foreground">
                    Requires: {title.credRequired} Cred Score, {title.powRequired} PoW
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tips Section */}
        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <Target className="h-4 w-4" />
            How to Level Up
          </h4>
          <div className="fintech-inner-box p-4">
            {getTips().map((tip, index) => (
              <p key={index} className="text-sm text-muted-foreground mb-1">
                {tip}
              </p>
            ))}
          </div>
        </div>

        {/* Close Button */}
        <Button onClick={() => setOpen(false)} className="w-full">
          Got it! Let's level up! 🚀
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default PrestigeDetailsModal;