import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Crown, Star, Trophy, Shield, Users } from 'lucide-react';
import PrestigeDetailsModal from '@/components/modals/PrestigeDetailsModal';

const CustomerPrestigePanel = () => {
  // Mock data - in real app this would come from user profile/prestige tables
  const customerPrestige = {
    currentTitle: 'Trusted Patron',
    credScore: 85,
    proofOfWorth: 6,
    nextMilestone: 10,
    recentCommendations: [
      { type: 'Reliable Customer', date: '2024-01-15', provider: 'Jean D.' },
      { type: 'Clear Communicator', date: '2024-01-08', provider: 'Marie T.' },
      { type: 'Respectful', date: '2023-12-20', provider: 'Pierre G.' }
    ],
    titles: [
      { name: 'New Member', unlocked: true, icon: Star },
      { name: 'Trusted Patron', unlocked: true, icon: Shield, current: true },
      { name: 'Neighborhood Connector', unlocked: false, icon: Users },
      { name: 'Elite Customer', unlocked: false, icon: Crown },
      { name: 'Community Champion', unlocked: false, icon: Trophy }
    ]
  };

  const progressToNext = (customerPrestige.proofOfWorth / customerPrestige.nextMilestone) * 100;

  const getTitleIcon = (IconComponent: any) => <IconComponent className="h-4 w-4" />;

  return (
    <Card className="fintech-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5" />
          Customer Prestige
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Status */}
        <PrestigeDetailsModal
          currentTitle={customerPrestige.currentTitle}
          credScore={customerPrestige.credScore}
          proofOfWorth={customerPrestige.proofOfWorth}
          nextMilestone={customerPrestige.nextMilestone}
        >
          <div className="text-center space-y-2 cursor-pointer hover:bg-primary/5 p-4 rounded-lg transition-colors">
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {customerPrestige.currentTitle}
            </Badge>
            <div className="text-2xl font-bold text-primary">
              {customerPrestige.credScore} Cred Score
            </div>
            <p className="text-xs text-muted-foreground">Click to see how to level up!</p>
          </div>
        </PrestigeDetailsModal>

        {/* Progress to Next Title */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress to next title</span>
            <span>{customerPrestige.proofOfWorth}/{customerPrestige.nextMilestone} PoW</span>
          </div>
          <Progress value={progressToNext} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {customerPrestige.nextMilestone - customerPrestige.proofOfWorth} more milestones to unlock Neighborhood Connector
          </p>
        </div>

        {/* Title Progress */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Title Progress</h4>
          {customerPrestige.titles.map((title, index) => (
            <div 
              key={title.name} 
              className={`flex items-center gap-3 p-2 rounded-lg ${
                title.current 
                  ? 'bg-primary/10 border border-primary/20' 
                  : title.unlocked 
                    ? 'bg-muted/50' 
                    : 'opacity-50'
              }`}
            >
              {getTitleIcon(title.icon)}
              <span className={`text-sm ${title.current ? 'font-medium' : ''}`}>
                {title.name}
              </span>
              {title.current && (
                <Badge variant="secondary" className="ml-auto text-xs">
                  Current
                </Badge>
              )}
              {title.unlocked && !title.current && (
                <div className="ml-auto w-2 h-2 bg-green-500 rounded-full" />
              )}
            </div>
          ))}
        </div>

        {/* Recent Commendations */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Recent Commendations</h4>
          {customerPrestige.recentCommendations.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No commendations yet. Complete more jobs to earn recognition!
            </p>
          ) : (
            <div className="space-y-2">
              {customerPrestige.recentCommendations.slice(0, 3).map((commendation, index) => (
                <div key={index} className="fintech-inner-box p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">{commendation.type}</div>
                      <div className="text-xs text-muted-foreground">
                        from {commendation.provider}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(commendation.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerPrestigePanel;