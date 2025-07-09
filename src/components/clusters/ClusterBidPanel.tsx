import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  DollarSign, 
  Clock, 
  Users, 
  MapPin, 
  Sparkles, 
  Send,
  Calendar,
  Route 
} from 'lucide-react';

interface Cluster {
  id: string;
  title: string;
  description: string;
  service_type: string;
  location: string;
  neighborhood: string;
  participant_count: number;
  min_participants: number;
  max_participants: number;
  target_participants: number;
  status: string;
}

interface ClusterBidPanelProps {
  cluster: Cluster;
  onBidSubmitted?: () => void;
}

const ClusterBidPanel: React.FC<ClusterBidPanelProps> = ({ cluster, onBidSubmitted }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [participants, setParticipants] = useState<any[]>([]);
  const [bidData, setBidData] = useState({
    total_amount: '',
    estimated_hours: '',
    message: '',
    proposed_schedule: ''
  });

  useEffect(() => {
    fetchParticipants();
  }, [cluster.id]);

  const fetchParticipants = async () => {
    try {
      const { data, error } = await supabase
        .from('cluster_participants' as any)
        .select('display_name, unit_id, special_instructions')
        .eq('cluster_id', cluster.id);

      if (error) throw error;
      setParticipants(data || []);
    } catch (error) {
      console.error('Error fetching participants:', error);
    }
  };

  const handleClaudeAnalysis = async () => {
    setAnalyzing(true);
    try {
      // Stub for Claude route optimization
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock Claude suggestions
      const estimatedHours = cluster.participant_count * 2.5; // Rough estimate
      const suggestedAmount = estimatedHours * 45; // $45/hour base rate
      
      setBidData(prev => ({
        ...prev,
        estimated_hours: estimatedHours.toString(),
        total_amount: suggestedAmount.toString(),
        proposed_schedule: `Optimized route suggested: Start at ${cluster.location}, efficient building-by-building coordination. Estimated ${estimatedHours} total hours across ${cluster.participant_count} units.`
      }));

      toast({
        title: "Analysis Complete!",
        description: "Claude has analyzed the cluster and provided optimization suggestions."
      });
    } catch (error) {
      console.error('Error analyzing cluster:', error);
      toast({
        title: "Error",
        description: "Failed to analyze cluster. Please try again.",
        variant: "destructive"
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmitBid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to submit a bid.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('cluster_provider_bids' as any)
        .insert({
          cluster_id: cluster.id,
          provider_id: user.id, // This should be provider profile ID in real implementation
          total_amount: parseFloat(bidData.total_amount),
          estimated_hours: parseFloat(bidData.estimated_hours),
          message: bidData.message || null,
          proposed_schedule: bidData.proposed_schedule || null
        });

      if (error) throw error;

      toast({
        title: "Bid Submitted!",
        description: "Your bid has been submitted successfully. The organizer will be notified."
      });

      onBidSubmitted?.();
    } catch (error) {
      console.error('Error submitting bid:', error);
      toast({
        title: "Error",
        description: "Failed to submit bid. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const estimatedPerUnit = bidData.total_amount ? 
    (parseFloat(bidData.total_amount) / cluster.participant_count).toFixed(2) : '0.00';

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-6 w-6 text-primary" />
          Submit Bid for Cluster
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Cluster Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Cluster Details
              </h4>
              <div className="space-y-2 text-sm">
                <p><strong>Title:</strong> {cluster.title}</p>
                <p><strong>Service:</strong> {cluster.service_type}</p>
                <p className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {cluster.location}
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {cluster.participant_count} participants
                  </Badge>
                  <Badge className={
                    cluster.status === 'active' ? 'bg-green-500' : 
                    cluster.status === 'provider_bidding' ? 'bg-blue-500' : 'bg-gray-500'
                  }>
                    {cluster.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium flex items-center gap-2">
                  <Route className="h-4 w-4" />
                  Route Analysis
                </h4>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={handleClaudeAnalysis}
                  disabled={analyzing}
                  className="flex items-center gap-1"
                >
                  <Sparkles className="h-3 w-3" />
                  {analyzing ? 'Analyzing...' : 'Claude Optimize'}
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>Units to service: {cluster.participant_count}</p>
                <p>Location: {cluster.neighborhood || 'Same building/area'}</p>
                {bidData.estimated_hours && (
                  <p>Est. time: {bidData.estimated_hours} hours</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Participants Overview */}
        {participants.length > 0 && (
          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium mb-3">Participants (Display Names Only)</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {participants.map((participant, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs">
                      {participant.display_name?.charAt(0) || '?'}
                    </div>
                    <span className="text-sm truncate">{participant.display_name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Bid Form */}
        <form onSubmit={handleSubmitBid} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="total_amount">Total Bid Amount (CAD) *</Label>
              <Input
                id="total_amount"
                type="number"
                step="0.01"
                min="0"
                value={bidData.total_amount}
                onChange={(e) => setBidData(prev => ({ ...prev, total_amount: e.target.value }))}
                placeholder="0.00"
                required
              />
              {bidData.total_amount && (
                <p className="text-xs text-muted-foreground">
                  ≈ ${estimatedPerUnit} per unit
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimated_hours">Estimated Hours *</Label>
              <Input
                id="estimated_hours"
                type="number"
                step="0.5"
                min="0"
                value={bidData.estimated_hours}
                onChange={(e) => setBidData(prev => ({ ...prev, estimated_hours: e.target.value }))}
                placeholder="0.0"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="proposed_schedule">Proposed Schedule & Route</Label>
            <Textarea
              id="proposed_schedule"
              value={bidData.proposed_schedule}
              onChange={(e) => setBidData(prev => ({ ...prev, proposed_schedule: e.target.value }))}
              placeholder="Describe your proposed schedule, route optimization, and approach..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Additional Message</Label>
            <Textarea
              id="message"
              value={bidData.message}
              onChange={(e) => setBidData(prev => ({ ...prev, message: e.target.value }))}
              placeholder="Any additional information about your services, experience, or special offers..."
              rows={3}
            />
          </div>

          {/* Bid Summary */}
          {bidData.total_amount && bidData.estimated_hours && (
            <Card className="bg-muted">
              <CardContent className="p-4">
                <h4 className="font-medium mb-2">Bid Summary</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Total Amount</p>
                    <p className="font-medium">${bidData.total_amount}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Per Unit</p>
                    <p className="font-medium">${estimatedPerUnit}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Est. Hours</p>
                    <p className="font-medium">{bidData.estimated_hours}h</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Hourly Rate</p>
                    <p className="font-medium">
                      ${(parseFloat(bidData.total_amount) / parseFloat(bidData.estimated_hours) || 0).toFixed(2)}/h
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex gap-4">
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1"
              onClick={() => window.history.back()}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 flex items-center gap-2"
              disabled={loading || !bidData.total_amount || !bidData.estimated_hours}
            >
              <Send className="h-4 w-4" />
              {loading ? 'Submitting...' : 'Submit Bid'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ClusterBidPanel;