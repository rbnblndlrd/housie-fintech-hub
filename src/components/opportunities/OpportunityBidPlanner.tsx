import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useAICredits } from '@/hooks/useAICredits';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Users, 
  DollarSign, 
  Clock, 
  Brain,
  AlertTriangle,
  CheckCircle,
  Zap
} from 'lucide-react';

interface ServiceSlot {
  id: string;
  service_type: string;
  title?: string;
}

interface CrewMember {
  id: string;
  user_id: string;
  role?: string;
  user_profiles?: {
    full_name: string;
    username: string;
  };
}

interface OpportunityBidPlannerProps {
  opportunityId: string;
  serviceSlots: ServiceSlot[];
  onClose: () => void;
  onSuccess: () => void;
}

const OpportunityBidPlanner: React.FC<OpportunityBidPlannerProps> = ({
  opportunityId,
  serviceSlots,
  onClose,
  onSuccess
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { credits, checkCredits } = useAICredits();
  
  const [userCrew, setUserCrew] = useState<any>(null);
  const [crewMembers, setCrewMembers] = useState<CrewMember[]>([]);
  const [roleAssignments, setRoleAssignments] = useState<{ [slotId: string]: string }>({});
  const [revenueSplit, setRevenueSplit] = useState<{ [memberId: string]: number }>({});
  const [totalBidAmount, setTotalBidAmount] = useState<number>(0);
  const [proposedSchedule, setProposedSchedule] = useState<any>({});
  const [bidMessage, setBidMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [housieOptimizing, setHousieOptimizing] = useState(false);

  useEffect(() => {
    if (user) {
      fetchCrewData();
    }
  }, [user]);

  useEffect(() => {
    // Initialize revenue split equally among crew members
    if (crewMembers.length > 0) {
      const equalSplit = Math.floor(100 / crewMembers.length);
      const newSplit: { [memberId: string]: number } = {};
      crewMembers.forEach((member, index) => {
        newSplit[member.user_id] = index === 0 ? 100 - (equalSplit * (crewMembers.length - 1)) : equalSplit;
      });
      setRevenueSplit(newSplit);
    }
  }, [crewMembers]);

  const fetchCrewData = async () => {
    try {
      // Get user's crew
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

      // Get crew members
      const crewId = crewData?.id || (await supabase
        .from('crew_members')
        .select('crew_id')
        .eq('user_id', user?.id)
        .single())?.data?.crew_id;

      if (crewId) {
        const { data: membersData, error: membersError } = await supabase
          .from('crew_members')
          .select('*')
          .eq('crew_id', crewId);

        if (membersError) throw membersError;

        // Get user profiles separately
        const userIds = membersData?.map(m => m.user_id) || [];
        const { data: profilesData } = await supabase
          .from('user_profiles')
          .select('*')
          .in('user_id', userIds);

        // Merge the data
        const membersWithProfiles = membersData?.map(member => ({
          ...member,
          user_profiles: profilesData?.find(p => p.user_id === member.user_id)
        })) || [];

        setCrewMembers(membersWithProfiles);
      }
    } catch (error) {
      console.error('Error fetching crew data:', error);
      toast({
        title: "Error",
        description: "Failed to load crew data.",
        variant: "destructive"
      });
    }
  };

  const handleRoleAssignment = (slotId: string, memberId: string) => {
    setRoleAssignments(prev => ({
      ...prev,
      [slotId]: memberId
    }));
  };

  const handleRevenueSplitChange = (memberId: string, value: number[]) => {
    setRevenueSplit(prev => ({
      ...prev,
      [memberId]: value[0]
    }));
  };

  const optimizeWithAnnette = async () => {
    setHousieOptimizing(true);
    try {
      // Check AI credits first
      const hasCredits = await checkCredits(1);
      if (!hasCredits) {
        toast({
          title: "Insufficient AI Credits",
          description: `You need 1 AI credit to use Annette optimization. You have ${credits.balance} credits.`,
          variant: "destructive"
        });
        return;
      }

      // Validate that we have role assignments
      const unassignedSlots = serviceSlots.filter(slot => !roleAssignments[slot.id]);
      if (unassignedSlots.length > 0) {
        toast({
          title: "Incomplete Assignments",
          description: "Please assign crew members to all required roles before optimizing.",
          variant: "destructive"
        });
        return;
      }

      if (!userCrew?.id) {
        toast({
          title: "No Crew Found",
          description: "Unable to find your crew information.",
          variant: "destructive"
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke("optimize-opportunity", {
        body: {
          opportunity_id: opportunityId,
          crew_id: userCrew.id
        }
      });

      if (error) {
        throw error;
      }

      if (data?.success) {
        // Update the schedule with Annette's suggestions
        setProposedSchedule(data.crew_schedule || {});
        
        // Update revenue split with Annette's suggestions
        if (data.revenue_split) {
          const newSplit: { [memberId: string]: number } = {};
          Object.entries(data.revenue_split).forEach(([userId, percentage]) => {
            newSplit[userId] = Math.round((percentage as number) * 100);
          });
          setRevenueSplit(newSplit);
        }

        // Show Annette's summary
        toast({
          title: "Annette Optimization Complete",
          description: data.summary || "Your crew schedule has been optimized.",
        });
      } else {
        throw new Error(data?.error || "Optimization failed");
      }
    } catch (error) {
      console.error('Error optimizing with Annette:', error);
      toast({
        title: "Optimization Failed",
        description: "Annette couldn't optimize the schedule. Please set manually.",
        variant: "destructive"
      });
    } finally {
      setHousieOptimizing(false);
    }
  };

  const submitBid = async () => {
    try {
      setLoading(true);

      // Validate assignments
      const unassignedSlots = serviceSlots.filter(slot => !roleAssignments[slot.id]);
      if (unassignedSlots.length > 0) {
        toast({
          title: "Incomplete Assignments",
          description: "Please assign crew members to all required roles.",
          variant: "destructive"
        });
        return;
      }

      // Validate revenue split
      const totalSplit = Object.values(revenueSplit).reduce((sum, val) => sum + val, 0);
      if (Math.abs(totalSplit - 100) > 0.1) {
        toast({
          title: "Invalid Revenue Split",
          description: "Revenue split must total exactly 100%.",
          variant: "destructive"
        });
        return;
      }

      // Submit bid
      const { error: bidError } = await supabase
        .from('opportunity_crew_bids')
        .insert({
          opportunity_id: opportunityId,
          crew_id: userCrew.id,
          total_bid_amount: totalBidAmount,
          proposed_schedule: proposedSchedule,
          revenue_split: revenueSplit,
          message: bidMessage
        });

      if (bidError) throw bidError;

      toast({
        title: "Bid Submitted Successfully",
        description: "Your crew's bid has been submitted for review.",
      });

      onSuccess();
    } catch (error) {
      console.error('Error submitting bid:', error);
      toast({
        title: "Submission Failed",
        description: "Failed to submit bid. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const revenueSplitTotal = Object.values(revenueSplit).reduce((sum, val) => sum + val, 0);
  const isValidSplit = Math.abs(revenueSplitTotal - 100) < 0.1;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Plan Crew Bid
            </CardTitle>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Zap className="h-4 w-4" />
                <span>{credits.balance} AI credits</span>
              </div>
              <Button variant="ghost" onClick={onClose}>×</Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Role Assignments */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Role Assignments</h3>
            <div className="space-y-4">
              {serviceSlots.map(slot => (
                <div key={slot.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="flex-1">
                    <Badge variant="outline">{slot.service_type}</Badge>
                    {slot.title && (
                      <p className="text-sm text-muted-foreground mt-1">{slot.title}</p>
                    )}
                  </div>
                  <Select
                    value={roleAssignments[slot.id] || ""}
                    onValueChange={(value) => handleRoleAssignment(slot.id, value)}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Assign crew member" />
                    </SelectTrigger>
                    <SelectContent>
                      {crewMembers.map(member => (
                        <SelectItem key={member.user_id} value={member.user_id}>
                          {member.user_profiles?.full_name || member.user_profiles?.username}
                          {member.role && ` (${member.role})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Split */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Revenue Split</h3>
            <div className="space-y-4">
              {crewMembers.map(member => (
                <div key={member.user_id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>
                      {member.user_profiles?.full_name || member.user_profiles?.username}
                      {member.role && ` (${member.role})`}
                    </Label>
                    <span className="text-sm font-medium">{revenueSplit[member.user_id] || 0}%</span>
                  </div>
                  <Slider
                    value={[revenueSplit[member.user_id] || 0]}
                    onValueChange={(value) => handleRevenueSplitChange(member.user_id, value)}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
              ))}
              <div className="flex items-center gap-2 text-sm">
                {isValidSplit ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                )}
                <span className={isValidSplit ? "text-green-600" : "text-red-600"}>
                  Total: {revenueSplitTotal.toFixed(1)}% {isValidSplit ? "(Valid)" : "(Must equal 100%)"}
                </span>
              </div>
            </div>
          </div>

          {/* Bid Amount & Schedule */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="bidAmount">Total Bid Amount ($)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="bidAmount"
                  type="number"
                  value={totalBidAmount}
                  onChange={(e) => setTotalBidAmount(Number(e.target.value))}
                  className="pl-10"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <Button
                variant="outline"
                onClick={optimizeWithAnnette}
                disabled={housieOptimizing || Object.keys(roleAssignments).length === 0}
                className="w-full"
              >
                {housieOptimizing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                    Annette is planning your schedule...
                  </>
                 ) : (
                   <>
                     <Brain className="h-4 w-4 mr-2" />
                     Optimize with Annette
                     <Badge variant="secondary" className="ml-2 text-xs">1 credit</Badge>
                   </>
                 )}
              </Button>
            </div>
          </div>

          {/* Proposed Schedule */}
          <div>
            <Label htmlFor="schedule">Proposed Schedule</Label>
            {Array.isArray(proposedSchedule) && proposedSchedule.length > 0 ? (
              <div className="space-y-2 p-4 border rounded-lg bg-muted/50">
                <div className="text-sm font-medium text-muted-foreground">Annette's Schedule:</div>
                {proposedSchedule.map((item: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-background rounded">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{item.member}</span>
                      <Badge variant="outline" className="text-xs">{item.role}</Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {item.start} - {item.end}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <Textarea
                id="schedule"
                value={typeof proposedSchedule === 'object' ? JSON.stringify(proposedSchedule, null, 2) : proposedSchedule}
                onChange={(e) => {
                  try {
                    setProposedSchedule(JSON.parse(e.target.value));
                  } catch {
                    setProposedSchedule(e.target.value);
                  }
                }}
                placeholder="Enter schedule details or use Annette optimization..."
                className="min-h-[100px]"
              />
            )}
          </div>

          {/* Bid Message */}
          <div>
            <Label htmlFor="message">Bid Message (Optional)</Label>
            <Textarea
              id="message"
              value={bidMessage}
              onChange={(e) => setBidMessage(e.target.value)}
              placeholder="Explain your crew's value proposition..."
              className="min-h-[100px]"
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={submitBid} 
              disabled={loading || !isValidSplit || totalBidAmount <= 0}
              className="flex-1"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                'Submit Bid'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OpportunityBidPlanner;
