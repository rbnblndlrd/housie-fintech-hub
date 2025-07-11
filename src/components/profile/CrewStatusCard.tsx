import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  MapPin, 
  Crown,
  UserPlus,
  Star
} from 'lucide-react';
import { UnifiedUserProfile } from '@/types/userProfile';

interface CrewStatusCardProps {
  profile: UnifiedUserProfile;
}

const CrewStatusCard: React.FC<CrewStatusCardProps> = ({ profile }) => {
  // Mock data for nearby crews - this would come from Supabase query
  const nearbyCrews = [
    {
      id: '1',
      name: 'Montreal Elite Cleaners',
      captain: 'Sarah L.',
      members: 8,
      averageRating: 4.9,
      distance: '2.3 km',
      specialties: ['Residential', 'Commercial']
    },
    {
      id: '2', 
      name: 'Laval Home Services',
      captain: 'Mike D.',
      members: 12,
      averageRating: 4.7,
      distance: '5.1 km',
      specialties: ['Home Repair', 'Maintenance']
    },
    {
      id: '3',
      name: 'North Shore Pros',
      captain: 'Emma R.',
      members: 6,
      averageRating: 4.8,
      distance: '8.7 km',
      specialties: ['Landscaping', 'Outdoor']
    }
  ];

  const hasActiveCrew = false; // This would check crew_members table

  return (
    <Card className="bg-muted/30 backdrop-blur-md border-muted-foreground/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Crew Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasActiveCrew ? (
          // If user has a crew
          <div className="p-3 bg-green-50/50 border border-green-200/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="h-4 w-4 text-yellow-600" />
              <span className="font-medium text-foreground text-sm">Active Member</span>
            </div>
            <p className="text-sm text-muted-foreground mb-2">Montreal Elite Cleaners</p>
            <Badge variant="secondary" className="text-xs">
              Captain: Sarah L.
            </Badge>
          </div>
        ) : (
          // If user has no crew
          <div className="p-3 bg-muted/20 border border-muted-foreground/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <UserPlus className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-foreground text-sm">Crew Status: Unaffiliated</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Join a crew to collaborate on larger projects and boost your credibility
            </p>
          </div>
        )}

        {!hasActiveCrew && nearbyCrews.length > 0 && (
          <>
            <div>
              <h4 className="font-medium text-foreground mb-3 text-sm">Local Crews Near You</h4>
              <div className="space-y-2">
                {nearbyCrews.slice(0, 3).map((crew) => (
                  <div key={crew.id} className="flex items-center justify-between p-2 bg-muted/20 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-foreground text-sm truncate">{crew.name}</p>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                          <span className="text-xs text-muted-foreground">{crew.averageRating}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>Captain: {crew.captain}</span>
                        <span>{crew.members} members</span>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {crew.distance}
                        </div>
                      </div>
                      <div className="flex gap-1 mt-1">
                        {crew.specialties.map((specialty, index) => (
                          <Badge key={index} variant="outline" className="text-xs px-1 py-0">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="ml-2 text-xs">
                      Request Invite
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CrewStatusCard;