import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";

interface Crew {
  id: string;
  name: string;
  description?: string;
}

interface CrewMember {
  id: string;
  user_id: string;
  role?: string;
}

interface OpportunityBidFormProps {
  opportunityId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function OpportunityBidForm({ opportunityId, onClose, onSuccess }: OpportunityBidFormProps) {
  const { toast } = useToast();
  const [crews, setCrews] = useState<Crew[]>([]);
  const [selectedCrewId, setSelectedCrewId] = useState<string>("");
  const [crewMembers, setCrewMembers] = useState<CrewMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    total_bid_amount: "",
    message: "",
  });
  const [revenueSplit, setRevenueSplit] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchUserCrews();
  }, []);

  useEffect(() => {
    if (selectedCrewId) {
      fetchCrewMembers();
    }
  }, [selectedCrewId]);

  const fetchUserCrews = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get crews where user is captain or member
      const { data: crewData, error } = await supabase
        .from("crews")
        .select("*")
        .or(`captain_id.eq.${user.id},id.in.(${await getUserCrewIds(user.id)})`);

      if (error) throw error;
      setCrews(crewData || []);
    } catch (error) {
      console.error("Error fetching crews:", error);
    }
  };

  const getUserCrewIds = async (userId: string) => {
    const { data } = await supabase
      .from("crew_members")
      .select("crew_id")
      .eq("user_id", userId);
    
    return data?.map(m => m.crew_id).join(",") || "";
  };

  const fetchCrewMembers = async () => {
    try {
      const { data, error } = await supabase
        .from("crew_members")
        .select(`
          id,
          user_id,
          role
        `)
        .eq("crew_id", selectedCrewId);

      if (error) throw error;
      setCrewMembers(data || []);
      
      // Initialize equal revenue split
      const equalSplit = 100 / (data?.length || 1);
      const initialSplit: Record<string, number> = {};
      data?.forEach(member => {
        initialSplit[member.user_id] = Math.round(equalSplit);
      });
      setRevenueSplit(initialSplit);
    } catch (error) {
      console.error("Error fetching crew members:", error);
    }
  };

  const updateRevenueSplit = (userId: string, percentage: number) => {
    setRevenueSplit(prev => ({
      ...prev,
      [userId]: percentage
    }));
  };

  const getTotalSplit = () => {
    return Object.values(revenueSplit).reduce((sum, val) => sum + val, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const totalSplit = getTotalSplit();
      if (Math.abs(totalSplit - 100) > 0.1) {
        throw new Error("Revenue split must total 100%");
      }

      const { error } = await supabase
        .from("opportunity_crew_bids")
        .insert({
          opportunity_id: opportunityId,
          crew_id: selectedCrewId,
          total_bid_amount: parseFloat(formData.total_bid_amount),
          revenue_split: revenueSplit,
          message: formData.message,
          proposed_schedule: {}, // Can be enhanced later
        });

      if (error) throw error;

      toast({
        title: "Bid Submitted",
        description: "Your crew bid has been submitted successfully!",
      });

      onSuccess();
    } catch (error: any) {
      console.error("Error submitting bid:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit bid. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submit Crew Bid</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="crew">Select Crew</Label>
            <Select value={selectedCrewId} onValueChange={setSelectedCrewId} required>
              <SelectTrigger>
                <SelectValue placeholder="Choose a crew" />
              </SelectTrigger>
              <SelectContent>
                {crews.map(crew => (
                  <SelectItem key={crew.id} value={crew.id}>
                    {crew.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="total_bid_amount">Total Bid Amount ($)</Label>
            <Input
              id="total_bid_amount"
              type="number"
              step="0.01"
              value={formData.total_bid_amount}
              onChange={(e) => setFormData({ ...formData, total_bid_amount: e.target.value })}
              placeholder="500.00"
              required
            />
          </div>

          {crewMembers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Revenue Split</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {crewMembers.map(member => (
                  <div key={member.id} className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="font-medium">Crew Member {member.user_id.slice(0, 8)}</div>
                      {member.role && (
                        <div className="text-sm text-muted-foreground">{member.role}</div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={revenueSplit[member.user_id] || 0}
                        onChange={(e) => updateRevenueSplit(member.user_id, parseFloat(e.target.value) || 0)}
                        className="w-20"
                      />
                      <span className="text-sm">%</span>
                    </div>
                  </div>
                ))}
                <div className="border-t pt-2">
                  <div className="flex justify-between text-sm">
                    <span>Total:</span>
                    <span className={getTotalSplit() === 100 ? "text-green-600" : "text-red-600"}>
                      {getTotalSplit().toFixed(1)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div>
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Describe your approach, timeline, or any special considerations..."
              rows={4}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !selectedCrewId || getTotalSplit() !== 100}
            >
              {loading ? "Submitting..." : "Submit Bid"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}