import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ServiceSlot {
  service_type: string;
  title?: string;
}

export default function OpportunityCreate() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location_summary: "",
    full_address: "",
    preferred_date: "",
    time_window_start: "",
    time_window_end: "",
    crew_bid_deadline: "",
  });
  const [serviceSlots, setServiceSlots] = useState<ServiceSlot[]>([
    { service_type: "" }
  ]);

  const addServiceSlot = () => {
    setServiceSlots([...serviceSlots, { service_type: "" }]);
  };

  const removeServiceSlot = (index: number) => {
    if (serviceSlots.length > 1) {
      setServiceSlots(serviceSlots.filter((_, i) => i !== index));
    }
  };

  const updateServiceSlot = (index: number, field: keyof ServiceSlot, value: string) => {
    const updated = [...serviceSlots];
    updated[index] = { ...updated[index], [field]: value };
    setServiceSlots(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Create opportunity
      const { data: opportunity, error: oppError } = await supabase
        .from("opportunities")
        .insert({
          customer_id: user.id,
          title: formData.title,
          description: formData.description,
          location_summary: formData.location_summary,
          full_address: formData.full_address,
          preferred_date: formData.preferred_date,
          time_window_start: formData.time_window_start,
          time_window_end: formData.time_window_end,
          crew_bid_deadline: formData.crew_bid_deadline,
          required_services: serviceSlots as any,
        })
        .select()
        .single();

      if (oppError) throw oppError;

      // Create service slots
      const slotsToInsert = serviceSlots
        .filter(slot => slot.service_type.trim())
        .map(slot => ({
          opportunity_id: opportunity.id,
          service_type: slot.service_type,
          title: slot.title || null,
        }));

      if (slotsToInsert.length > 0) {
        const { error: slotsError } = await supabase
          .from("opportunity_service_slots")
          .insert(slotsToInsert);

        if (slotsError) throw slotsError;
      }

      toast({
        title: "Opportunity Created",
        description: "Your multi-service opportunity is now live for crew bids!",
      });

      navigate(`/opportunities/${opportunity.id}`);
    } catch (error) {
      console.error("Error creating opportunity:", error);
      toast({
        title: "Error",
        description: "Failed to create opportunity. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create Multi-Service Opportunity</CardTitle>
          <p className="text-muted-foreground">
            Post a job requiring multiple specialists. Crews will coordinate and bid as a team.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="title">Opportunity Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Complete home refresh - cleaning, lawn, and pet care"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe what needs to be done, special requirements, etc."
                  rows={4}
                  required
                />
              </div>

              <div>
                <Label htmlFor="location_summary">Neighborhood</Label>
                <Input
                  id="location_summary"
                  value={formData.location_summary}
                  onChange={(e) => setFormData({ ...formData, location_summary: e.target.value })}
                  placeholder="Downtown Montreal, Plateau area"
                  required
                />
              </div>

              <div>
                <Label htmlFor="full_address">Full Address</Label>
                <Input
                  id="full_address"
                  value={formData.full_address}
                  onChange={(e) => setFormData({ ...formData, full_address: e.target.value })}
                  placeholder="123 Main St, Montreal, QC H1A 1A1"
                  required
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Only revealed to accepted crew
                </p>
              </div>

              <div>
                <Label htmlFor="preferred_date">Preferred Date</Label>
                <Input
                  id="preferred_date"
                  type="date"
                  value={formData.preferred_date}
                  onChange={(e) => setFormData({ ...formData, preferred_date: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="time_window_start">Start Time</Label>
                  <Input
                    id="time_window_start"
                    type="time"
                    value={formData.time_window_start}
                    onChange={(e) => setFormData({ ...formData, time_window_start: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="time_window_end">End Time</Label>
                  <Input
                    id="time_window_end"
                    type="time"
                    value={formData.time_window_end}
                    onChange={(e) => setFormData({ ...formData, time_window_end: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="crew_bid_deadline">Bid Deadline</Label>
                <Input
                  id="crew_bid_deadline"
                  type="datetime-local"
                  value={formData.crew_bid_deadline}
                  onChange={(e) => setFormData({ ...formData, crew_bid_deadline: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg">Required Services</Label>
                <Button type="button" onClick={addServiceSlot} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Service
                </Button>
              </div>

              {serviceSlots.map((slot, index) => (
                <Card key={index} className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div>
                      <Label htmlFor={`service_type_${index}`}>Service Type</Label>
                      <Input
                        id={`service_type_${index}`}
                        value={slot.service_type}
                        onChange={(e) => updateServiceSlot(index, "service_type", e.target.value)}
                        placeholder="Cleaning, Pet Care, Lawn Care, etc."
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor={`title_${index}`}>Title (Optional)</Label>
                      <Input
                        id={`title_${index}`}
                        value={slot.title || ""}
                        onChange={(e) => updateServiceSlot(index, "title", e.target.value)}
                        placeholder="SPOTLESS, WhiskerWhisperer, etc."
                      />
                    </div>

                    <div>
                      {serviceSlots.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => removeServiceSlot(index)}
                          variant="outline"
                          size="sm"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="flex gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/opportunities")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Post Opportunity"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}