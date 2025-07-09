import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, MapPin, Users, Plus, Search } from "lucide-react";

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
  required_services: any;
}

export default function OpportunityList() {
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      const { data, error } = await supabase
        .from("opportunities")
        .select("*")
        .in("status", ["open", "bidding"])
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOpportunities(data || []);
    } catch (error) {
      console.error("Error fetching opportunities:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOpportunities = opportunities.filter(opp =>
    opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opp.location_summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-green-500";
      case "bidding": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  const isDeadlineSoon = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const hoursDiff = (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursDiff <= 24 && hoursDiff > 0;
  };

  const isDeadlinePassed = (deadline: string) => {
    return new Date(deadline) < new Date();
  };

  if (loading) {
    return (
      <div className="container mx-auto max-w-6xl p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Multi-Service Opportunities</h1>
          <p className="text-muted-foreground">
            Complex jobs requiring coordinated crew services
          </p>
        </div>
        <Button onClick={() => navigate("/opportunities/new")}>
          <Plus className="h-4 w-4 mr-2" />
          Post Opportunity
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search opportunities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {filteredOpportunities.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Opportunities Found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm 
                ? "No opportunities match your search." 
                : "Be the first to post a multi-service opportunity!"
              }
            </p>
            <Button onClick={() => navigate("/opportunities/new")}>
              <Plus className="h-4 w-4 mr-2" />
              Post Opportunity
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOpportunities.map((opportunity) => (
            <Card 
              key={opportunity.id} 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate(`/opportunities/${opportunity.id}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg line-clamp-2">
                    {opportunity.title}
                  </CardTitle>
                  <Badge className={getStatusColor(opportunity.status)}>
                    {opportunity.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                  {opportunity.description}
                </p>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{opportunity.location_summary}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(opportunity.preferred_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{opportunity.time_window_start} - {opportunity.time_window_end}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      Required Services ({Array.isArray(opportunity.required_services) ? opportunity.required_services.length : 0})
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {Array.isArray(opportunity.required_services) && opportunity.required_services.slice(0, 3).map((service, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {service.service_type}
                      </Badge>
                    ))}
                    {Array.isArray(opportunity.required_services) && opportunity.required_services.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{opportunity.required_services.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="text-xs text-muted-foreground">
                    <strong>Bid Deadline:</strong>{" "}
                    {new Date(opportunity.crew_bid_deadline).toLocaleString()}
                    {isDeadlinePassed(opportunity.crew_bid_deadline) && (
                      <span className="text-red-500 ml-1">(Expired)</span>
                    )}
                    {isDeadlineSoon(opportunity.crew_bid_deadline) && !isDeadlinePassed(opportunity.crew_bid_deadline) && (
                      <span className="text-orange-500 ml-1">(Soon)</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}