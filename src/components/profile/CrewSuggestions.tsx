import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Users, MapPin, Plus, Crown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Crew {
  id: string;
  name: string;
  description: string;
  captain_id: string;
  is_active: boolean;
  member_count?: number;
}

const CrewSuggestions = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [crews, setCrews] = useState<Crew[]>([]);
  const [loading, setLoading] = useState(true);
  const [joiningCrew, setJoiningCrew] = useState<string | null>(null);

  useEffect(() => {
    loadNearbyCrews();
  }, []);

  const loadNearbyCrews = async () => {
    try {
      const { data, error } = await supabase
        .from('crews')
        .select(`
          id,
          name,
          description,
          captain_id,
          is_active,
          crew_members(count)
        `)
        .eq('is_active', true)
        .limit(5);

      if (error) throw error;

      const crewsWithCount = data?.map(crew => ({
        ...crew,
        member_count: crew.crew_members?.[0]?.count || 0
      })) || [];

      setCrews(crewsWithCount);
    } catch (error) {
      console.error('Error loading crews:', error);
    } finally {
      setLoading(false);
    }
  };

  const joinCrew = async (crewId: string) => {
    if (!user) return;

    setJoiningCrew(crewId);
    try {
      const { error } = await supabase
        .from('crew_members')
        .insert({
          crew_id: crewId,
          user_id: user.id,
          role: 'member'
        });

      if (error) throw error;

      toast({
        title: "Joined Crew!",
        description: "You've successfully joined the crew. Collaborate on opportunities together.",
      });

      // Refresh crew data
      loadNearbyCrews();
    } catch (error: any) {
      console.error('Error joining crew:', error);
      toast({
        title: "Failed to Join",
        description: error.message || "Could not join crew. Please try again.",
        variant: "destructive",
      });
    } finally {
      setJoiningCrew(null);
    }
  };

  if (loading) {
    return (
      <Card className="bg-muted/30 backdrop-blur-md border-muted-foreground/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Loading Crews...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-muted/20 rounded-lg animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-muted/30 backdrop-blur-md border-muted-foreground/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Join a Crew
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Collaborate with other providers to take on bigger opportunities
        </p>
      </CardHeader>
      <CardContent>
        {crews.length === 0 ? (
          <div className="text-center py-6">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground mb-4">
              No crews nearby — you can create your own!
            </p>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Create Crew
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {crews.map((crew) => (
              <div
                key={crew.id}
                className="flex items-center justify-between p-3 bg-muted/20 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-foreground">{crew.name}</h4>
                    <Crown className="h-3 w-3 text-yellow-500" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {crew.description || 'Professional service crew'}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      <Users className="h-3 w-3 mr-1" />
                      {crew.member_count} members
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      <MapPin className="h-3 w-3 mr-1" />
                      Local
                    </Badge>
                  </div>
                </div>
                <Button
                  onClick={() => joinCrew(crew.id)}
                  disabled={joiningCrew === crew.id}
                  size="sm"
                >
                  {joiningCrew === crew.id ? 'Joining...' : 'Join'}
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CrewSuggestions;