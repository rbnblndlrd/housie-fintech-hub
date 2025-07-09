import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import VideoBackground from '@/components/common/VideoBackground';
import { 
  MapPin, 
  Calendar,
  Clock,
  Users,
  Search,
  Filter,
  DollarSign
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Opportunity {
  id: string;
  title: string;
  description: string;
  location_summary: string;
  preferred_date: string;
  time_window_start: string;
  time_window_end: string;
  status: string;
  crew_bid_deadline: string;
  customer_id: string;
}

interface ServiceSlot {
  id: string;
  service_type: string;
  title?: string;
}

const CrewOpportunities = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [serviceSlots, setServiceSlots] = useState<{ [key: string]: ServiceSlot[] }>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [serviceFilter, setServiceFilter] = useState("");
  const [userCrew, setUserCrew] = useState<any>(null);

  useEffect(() => {
    if (user) {
      checkCrewMembership();
    }
  }, [user]);

  useEffect(() => {
    if (userCrew) {
      fetchOpportunities();
    }
  }, [userCrew]);

  const checkCrewMembership = async () => {
    try {
      // Check if user is in any crew or is a crew captain
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

  const fetchOpportunities = async () => {
    try {
      setLoading(true);

      // Fetch open opportunities
      const { data: oppData, error: oppError } = await supabase
        .from('opportunities')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (oppError) throw oppError;

      // Fetch service slots for each opportunity
      const opportunityIds = oppData?.map(opp => opp.id) || [];
      const { data: slotsData, error: slotsError } = await supabase
        .from('opportunity_service_slots')
        .select('*')
        .in('opportunity_id', opportunityIds);

      if (slotsError) throw slotsError;

      // Group service slots by opportunity_id
      const slotsMap: { [key: string]: ServiceSlot[] } = {};
      slotsData?.forEach(slot => {
        if (!slotsMap[slot.opportunity_id]) {
          slotsMap[slot.opportunity_id] = [];
        }
        slotsMap[slot.opportunity_id].push(slot);
      });

      setOpportunities(oppData || []);
      setServiceSlots(slotsMap);
    } catch (error) {
      console.error('Error fetching opportunities:', error);
      toast({
        title: "Error",
        description: "Failed to load opportunities.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredOpportunities = opportunities.filter(opp => {
    const matchesSearch = opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opp.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const oppSlots = serviceSlots[opp.id] || [];
    const matchesService = !serviceFilter || 
                          oppSlots.some(slot => slot.service_type.toLowerCase().includes(serviceFilter.toLowerCase()));
    
    return matchesSearch && matchesService;
  });

  const uniqueServiceTypes = Array.from(new Set(
    Object.values(serviceSlots).flat().map(slot => slot.service_type)
  ));

  if (!user) {
    return (
      <>
        <VideoBackground />
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-6 text-center">
              <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
              <p className="text-muted-foreground mb-4">
                Please sign in to view crew opportunities.
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
                You need to be part of a crew to access opportunity bidding.
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
                  <h1 className="text-3xl font-bold text-white">Crew Opportunities</h1>
                  <p className="text-white/80 mt-1">
                    Multi-skill job opportunities for {userCrew.name}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="secondary" className="px-3 py-1">
                    {userCrew.name}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Filters */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search opportunities..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={serviceFilter} onValueChange={setServiceFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        <SelectValue placeholder="Service type" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Services</SelectItem>
                      {uniqueServiceTypes.map(service => (
                        <SelectItem key={service} value={service}>
                          {service}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Opportunities Grid */}
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : filteredOpportunities.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Opportunities Found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm || serviceFilter ? 
                      "Try adjusting your filters" : 
                      "Check back later for new multi-skill opportunities"
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredOpportunities.map(opportunity => {
                  const oppSlots = serviceSlots[opportunity.id] || [];
                  const deadline = new Date(opportunity.crew_bid_deadline);
                  const isUrgent = deadline.getTime() - Date.now() < 24 * 60 * 60 * 1000; // Less than 24 hours

                  return (
                    <Card key={opportunity.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{opportunity.title}</CardTitle>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge className="bg-blue-500 text-white">
                                OPEN
                              </Badge>
                              {isUrgent && (
                                <Badge variant="destructive">
                                  URGENT
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">{opportunity.description}</p>

                        {/* Required Services */}
                        <div>
                          <h4 className="font-medium mb-2">Required Services:</h4>
                          <div className="flex flex-wrap gap-2">
                            {oppSlots.map(slot => (
                              <Badge key={slot.id} variant="outline">
                                {slot.service_type}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Details */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{opportunity.location_summary}</span>
                          </div>

                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{new Date(opportunity.preferred_date).toLocaleDateString()}</span>
                          </div>

                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{opportunity.time_window_start} - {opportunity.time_window_end}</span>
                          </div>

                          <div className="flex items-center gap-2 text-sm">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>Deadline: {deadline.toLocaleDateString()} at {deadline.toLocaleTimeString()}</span>
                          </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate(`/opportunities/${opportunity.id}`)}
                            className="flex-1"
                          >
                            View Details
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => navigate(`/opportunities/${opportunity.id}/bid`)}
                            className="flex-1"
                          >
                            Plan Bid
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CrewOpportunities;