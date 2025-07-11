import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, MessageCircle, UserPlus, Crown } from 'lucide-react';

const NetworkContent = () => {
  const connections = [
    {
      name: 'Sarah M.',
      title: 'Sparkmate',
      service: 'Cleaning Services',
      status: 'Active',
      lastSeen: '2 hours ago',
      avatar: 'SM'
    },
    {
      name: 'Mike T.',
      title: 'Fixmaster',
      service: 'Handyman',
      status: 'Active',
      lastSeen: '1 day ago',
      avatar: 'MT'
    },
    {
      name: 'Lisa K.',
      title: 'Greenthumb',
      service: 'Landscaping',
      status: 'Connected',
      lastSeen: '3 days ago',
      avatar: 'LK'
    },
    {
      name: 'Alex R.',
      title: 'Flowfix',
      service: 'Plumbing',
      status: 'Active',
      lastSeen: '5 hours ago',
      avatar: 'AR'
    }
  ];

  const crews = [
    {
      name: 'Montreal Cleaners Unite',
      role: 'Member',
      members: 45,
      lastActivity: 'Active',
      type: 'crew'
    },
    {
      name: 'Home Service Collective',
      role: 'Coordinator',
      members: 128,
      lastActivity: '2 hours ago',
      type: 'collective'
    },
    {
      name: 'Quality First Alliance',
      role: 'Member',
      members: 67,
      lastActivity: '1 day ago',
      type: 'crew'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Network Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card/95 backdrop-blur-md border-border/20">
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">127</p>
            <p className="text-sm text-muted-foreground">Connections</p>
          </CardContent>
        </Card>
        <Card className="bg-card/95 backdrop-blur-md border-border/20">
          <CardContent className="p-4 text-center">
            <Crown className="h-8 w-8 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">3</p>
            <p className="text-sm text-muted-foreground">Crews</p>
          </CardContent>
        </Card>
        <Card className="bg-card/95 backdrop-blur-md border-border/20">
          <CardContent className="p-4 text-center">
            <MessageCircle className="h-8 w-8 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">89</p>
            <p className="text-sm text-muted-foreground">Conversations</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Your Connections */}
        <Card className="bg-card/95 backdrop-blur-md border-border/20">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Your Connections
              </div>
              <Button variant="outline" size="sm">
                <UserPlus className="h-4 w-4 mr-2" />
                Invite
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {connections.map((connection, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                    {connection.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{connection.name}</h3>
                      <Badge variant="secondary" className="text-xs">{connection.title}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{connection.service}</p>
                    <p className="text-xs text-muted-foreground">Last active: {connection.lastSeen}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge variant={connection.status === 'Active' ? 'default' : 'secondary'}>
                    {connection.status}
                  </Badge>
                  <Button variant="outline" size="sm" disabled>
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Crews & Collectives */}
        <Card className="bg-card/95 backdrop-blur-md border-border/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5" />
              Crews & Collectives
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {crews.map((crew, index) => (
              <div key={index} className="p-4 bg-muted/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{crew.name}</h3>
                  <Badge variant="outline">{crew.role}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{crew.members} members</span>
                  <span>Last activity: {crew.lastActivity}</span>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-3">
                  View Crew
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NetworkContent;