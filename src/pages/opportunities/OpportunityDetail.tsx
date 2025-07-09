import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { OpportunityBidForm } from "@/components/opportunities/OpportunityBidForm";
import { ContextualAnnetteButton } from "@/components/chat/ContextualAnnetteButton";

interface Opportunity {
  id: string;
  title: string;
  description: string;
  location_summary: string;
  full_address: string;
  preferred_date: string;
  time_window_start: string;
  time_window_end: string;
  status: string;
  crew_bid_deadline: string;
  customer_id: string;
  required_services: any;
}

interface ServiceSlot {
  id: string;
  service_type: string;
  title?: string;
}

interface CrewBid {
  id: string;
  total_bid_amount: number;
  message: string;
  status: string;
  submitted_at: string;
  crew: {
    name: string;
    captain_id: string;
  };
}

export default function OpportunityDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [serviceSlots, setServiceSlots] = useState<ServiceSlot[]>([]);
  const [crewBids, setCrewBids] = useState<CrewBid[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [showBidForm, setShowBidForm] = useState(false);

  useEffect(() => {
    if (id) {
      fetchOpportunityDetails();
      getCurrentUser();
    }
  }, [id]);

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUserId(user?.id || null);
  };

  const fetchOpportunityDetails = async () => {
    try {
      // Fetch opportunity
      const { data: oppData, error: oppError } = await supabase
        .from("opportunities")
        .select("*")
        .eq("id", id)
        .single();

      if (oppError) throw oppError;
      setOpportunity(oppData);

      // Fetch service slots
      const { data: slotsData, error: slotsError } = await supabase
        .from("opportunity_service_slots")
        .select("*")
        .eq("opportunity_id", id);

      if (slotsError) throw slotsError;
      setServiceSlots(slotsData || []);

      // Fetch crew bids
      const { data: bidsData, error: bidsError } = await supabase
        .from("opportunity_crew_bids")
        .select(`
          *,
          crew:crews(name, captain_id)
        `)
        .eq("opportunity_id", id);

      if (bidsError) throw bidsError;
      setCrewBids(bidsData || []);

    } catch (error) {
      console.error("Error fetching opportunity:", error);
      toast({
        title: "Error",
        description: "Failed to load opportunity details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-green-500";
      case "bidding": return "bg-blue-500";
      case "assigned": return "bg-yellow-500";
      case "in_progress": return "bg-orange-500";
      case "completed": return "bg-gray-500";
      case "cancelled": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const isCustomer = opportunity?.customer_id === currentUserId;
  const isDeadlinePassed = opportunity ? new Date(opportunity.crew_bid_deadline) < new Date() : false;

  if (loading) {
    return (
      <div className="container mx-auto max-w-4xl p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="container mx-auto max-w-4xl p-6">
        <Card>
          <CardContent className="text-center py-8">
            <p>Opportunity not found.</p>
            <Button onClick={() => navigate("/opportunities")} className="mt-4">
              Back to Opportunities
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl p-6 space-y-6">
      {/* AI Assistant Banner for customers */}
      {isCustomer && (
        <div className="bg-muted/50 border border-border rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 flex items-center justify-center">
              🧠
            </div>
            <div>
              <p className="text-sm font-medium">Need help comparing crew bids?</p>
              <p className="text-xs text-muted-foreground">Ask Annette for guidance on proposals and decision-making</p>
            </div>
          </div>
          <ContextualAnnetteButton variant="embedded" />
        </div>
      )}

      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{opportunity.title}</CardTitle>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {opportunity.location_summary}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(opportunity.preferred_date).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {opportunity.time_window_start} - {opportunity.time_window_end}
                </div>
              </div>
            </div>
            <Badge className={getStatusColor(opportunity.status)}>
              {opportunity.status.replace("_", " ")}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">{opportunity.description}</p>
          
          {isCustomer && (
            <div className="p-3 bg-muted rounded-md">
              <p className="text-sm">
                <strong>Full Address:</strong> {opportunity.full_address}
              </p>
            </div>
          )}

          <div className="mt-4">
            <p className="text-sm text-muted-foreground">
              <strong>Bid Deadline:</strong> {new Date(opportunity.crew_bid_deadline).toLocaleString()}
              {isDeadlinePassed && <span className="text-red-500 ml-2">(Expired)</span>}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Required Services */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Required Services
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {serviceSlots.map((slot) => (
              <div key={slot.id} className="p-3 border rounded-md">
                <div className="font-medium">{slot.service_type}</div>
                {slot.title && (
                  <div className="text-sm text-muted-foreground">Title: {slot.title}</div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Crew Bids */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Crew Bids ({crewBids.length})
            </CardTitle>
            {!isCustomer && !isDeadlinePassed && opportunity.status === "open" && (
              <Button onClick={() => setShowBidForm(true)}>
                Submit Bid
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {crewBids.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No bids submitted yet.
            </p>
          ) : (
            <div className="space-y-4">
              {crewBids.map((bid) => (
                <div key={bid.id} className="p-4 border rounded-md">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium">{bid.crew.name}</div>
                      <div className="text-lg font-semibold text-primary">
                        ${bid.total_bid_amount}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Submitted {new Date(bid.submitted_at).toLocaleString()}
                      </div>
                    </div>
                    <Badge variant="outline">
                      {bid.status}
                    </Badge>
                  </div>
                  {bid.message && (
                    <div className="mt-3 p-3 bg-muted rounded-md">
                      <p className="text-sm">{bid.message}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bid Form Modal */}
      {showBidForm && (
        <OpportunityBidForm
          opportunityId={opportunity.id}
          onClose={() => setShowBidForm(false)}
          onSuccess={() => {
            setShowBidForm(false);
            fetchOpportunityDetails();
          }}
        />
      )}
    </div>
  );
}