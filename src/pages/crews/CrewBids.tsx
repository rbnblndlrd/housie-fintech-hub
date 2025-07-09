import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import VideoBackground from '@/components/common/VideoBackground';
import { 
  DollarSign, 
  Clock, 
  Users, 
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CrewBid {
  id: string;
  opportunity_id: string;
  crew_id: string;
  total_bid_amount: number;
  proposed_schedule: any;
  revenue_split: any;
  message?: string;
  status: string;
  submitted_at: string;
  updated_at: string;
  opportunity: {
    title: string;
    description: string;
    location_summary: string;
    preferred_date: string;
    time_window_start: string;
    time_window_end: string;
    status: string;
  };
}

const CrewBids = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [bids, setBids] = useState<CrewBid[]>([]);
  const [loading, setLoading] = useState(true);
  const [userCrew, setUserCrew] = useState<any>(null);

  useEffect(() => {
    if (user) {
      checkCrewMembership();
    }
  }, [user]);

  useEffect(() => {
    if (userCrew) {
      fetchCrewBids();
    }
  }, [userCrew]);

  const checkCrewMembership = async () => {
    try {
      // Check if user is crew captain
      const { data: crewData, error: crewError } = await supabase
        .from('crews')
        .select('*')
        .eq('captain_id', user?.id)
        .maybeSingle();

      if (crewError && crewError.code !== 'PGRST116') {
        throw crewError;
      }

      if (!crewData) {
        // Check if user is a crew member
        const { data: memberData, error: memberError } = await supabase
          .from('crew_members')
          .select('*, crews(*)')
          .eq('user_id', user?.id)
          .maybeSingle();

        if (memberError && memberError.code !== 'PGRST116') {
          throw memberError;
        }

        setUserCrew(memberData?.crews || null);
      } else {
        setUserCrew(crewData);
      }
    } catch (error) {
      console.error('Error checking crew membership:', error);
      toast({
        title: "Error",
        description: "Failed to verify crew membership.",
        variant: "destructive"
      });
    }
  };

  const fetchCrewBids = async () => {
    try {
      setLoading(true);

      const { data: bidsData, error: bidsError } = await supabase
        .from('opportunity_crew_bids')
        .select(`
          *,
          opportunity:opportunities(*)
        `)
        .eq('crew_id', userCrew.id)
        .order('submitted_at', { ascending: false });

      if (bidsError) throw bidsError;

      setBids(bidsData || []);
    } catch (error) {
      console.error('Error fetching crew bids:', error);
      toast({
        title: "Error",
        description: "Failed to load crew bids.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'accepted':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'withdrawn':
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500';
      case 'accepted':
        return 'bg-green-500';
      case 'rejected':
        return 'bg-red-500';
      case 'withdrawn':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (!user) {
    return (
      <>
        <VideoBackground />
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-6 text-center">
              <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
              <p className="text-muted-foreground mb-4">
                Please sign in to view crew bids.
              </p>
              <Button onClick={() => navigate('/auth')}>
                Sign In
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  if (!userCrew) {
    return (
      <>
        <VideoBackground />
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-6 text-center">
              <h2 className="text-xl font-semibold mb-2">Crew Membership Required</h2>
              <p className="text-muted-foreground mb-4">
                You need to be part of a crew to view bids.
              </p>
              <Button onClick={() => navigate('/crews')}>
                Find or Create a Crew
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <VideoBackground />
      <div className="relative z-10 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-white">Crew Bids</h1>
                  <p className="text-white/80 mt-1">
                    Track bid status and responses for {userCrew.name}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="secondary" className="px-3 py-1">
                    {userCrew.name}
                  </Badge>
                  <Button onClick={() => navigate('/crews/opportunities')}>
                    Find Opportunities
                  </Button>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <DollarSign className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Total Bids</p>
                      <p className="text-2xl font-bold">{bids.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Clock className="h-8 w-8 text-yellow-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Pending</p>
                      <p className="text-2xl font-bold">
                        {bids.filter(bid => bid.status === 'pending').length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Accepted</p>
                      <p className="text-2xl font-bold">
                        {bids.filter(bid => bid.status === 'accepted').length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <XCircle className="h-8 w-8 text-red-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Rejected</p>
                      <p className="text-2xl font-bold">
                        {bids.filter(bid => bid.status === 'rejected').length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Bids List */}
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : bids.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Bids Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start bidding on multi-skill opportunities to grow your crew's business
                  </p>
                  <Button onClick={() => navigate('/crews/opportunities')}>
                    Find Opportunities
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {bids.map(bid => (
                  <Card key={bid.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h4 className="font-medium text-lg">{bid.opportunity.title}</h4>
                            <Badge className={`${getStatusColor(bid.status)} text-white`}>
                              {bid.status.toUpperCase()}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-4">
                            {bid.opportunity.description}
                          </p>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Bid Amount</p>
                              <p className="font-medium text-lg">${bid.total_bid_amount}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Opportunity Date</p>
                              <p className="font-medium">{new Date(bid.opportunity.preferred_date).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Time Window</p>
                              <p className="font-medium">{bid.opportunity.time_window_start} - {bid.opportunity.time_window_end}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Submitted</p>
                              <p className="font-medium">{new Date(bid.submitted_at).toLocaleDateString()}</p>
                            </div>
                          </div>

                          {/* Revenue Split Preview */}
                          {bid.revenue_split && Object.keys(bid.revenue_split).length > 0 && (
                            <div className="mb-4">
                              <p className="text-sm font-medium text-muted-foreground mb-2">Revenue Split:</p>
                              <div className="flex flex-wrap gap-2">
                                {Object.entries(bid.revenue_split).map(([memberId, percentage]: [string, any]) => (
                                  <Badge key={memberId} variant="outline" className="text-xs">
                                    Member {memberId.slice(-4)}: {percentage}%
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {bid.message && (
                            <div className="mt-3 p-3 bg-muted rounded">
                              <p className="text-sm font-medium mb-1">Bid Message:</p>
                              <p className="text-sm">{bid.message}</p>
                            </div>
                          )}

                          <div className="flex items-center gap-2 mt-4 text-sm">
                            {getStatusIcon(bid.status)}
                            <span className="font-medium capitalize">
                              {bid.status === 'pending' ? 'Waiting for response' : bid.status}
                            </span>
                            {bid.status === 'pending' && (
                              <span className="text-muted-foreground">
                                • Updated {new Date(bid.updated_at).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate(`/opportunities/${bid.opportunity_id}`)}
                            className="flex items-center gap-1"
                          >
                            <Eye className="h-4 w-4" />
                            View Opportunity
                          </Button>
                          {bid.status === 'accepted' && (
                            <Badge className="bg-green-500 text-white text-center">
                              🎉 WON BID
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CrewBids;