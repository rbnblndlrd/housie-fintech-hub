import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Users, 
  MapPin, 
  Clock, 
  Target, 
  Shield, 
  Share2, 
  Play, 
  Settings,
  UserPlus,
  Brain,
  Route
} from 'lucide-react';

interface Cluster {
  id: string;
  title: string;
  description: string;
  service_type: string;
  location: string;
  neighborhood: string;
  status: string;
  min_participants: number;
  max_participants: number;
  target_participants: number;
  participant_count: number;
  organizer_id: string;
  share_code: string;
  requires_verification: boolean;
  created_at: string;
  housie_optimization?: {
    success: boolean;
    summary: string;
    route: Array<{
      unit: string;
      start: string;
      end: string;
    }>;
    preferred_block_id: string;
    confidence: 'high' | 'medium' | 'low';
  };
}

interface ClusterViewCardProps {
  cluster: Cluster;
  isOrganizer?: boolean;
  onUpdate?: () => void;
}

const ClusterViewCard: React.FC<ClusterViewCardProps> = ({ 
  cluster, 
  isOrganizer = false,
  onUpdate 
}) => {
  const { toast } = useToast();
  const [activating, setActivating] = useState(false);
  const [optimizing, setOptimizing] = useState(false);

  const progressPercentage = (cluster.participant_count / cluster.target_participants) * 100;
  const canActivate = cluster.participant_count >= cluster.min_participants && cluster.status === 'pending';

  const handleOptimizeSchedule = async () => {
    setOptimizing(true);
    try {
      const { data, error } = await supabase.functions.invoke('optimize-cluster', {
        body: { cluster_id: cluster.id }
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: "Schedule Optimized!",
          description: data.summary
        });
        onUpdate?.();
      } else {
        throw new Error(data.error || 'Optimization failed');
      }
    } catch (error) {
      console.error('Error optimizing cluster:', error);
      toast({
        title: "Optimization Failed",
        description: error.message || "Failed to optimize schedule. Please try again.",
        variant: "destructive"
      });
    } finally {
      setOptimizing(false);
    }
  };

  const handleActivateCluster = async () => {
    setActivating(true);
    try {
      // Simulate activation
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: "Cluster Activated!",
        description: "Your cluster is now active and available for provider bids."
      });

      onUpdate?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to activate cluster. Please try again.",
        variant: "destructive"
      });
    } finally {
      setActivating(false);
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/clusters/${cluster.id}?code=${cluster.share_code}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: cluster.title,
          text: `Join our service cluster: ${cluster.title}`,
          url: shareUrl,
        });
      } catch (error) {
        copyToClipboard(shareUrl);
      }
    } else {
      copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Link Copied!",
        description: "Share link has been copied to clipboard."
      });
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'active': return 'bg-blue-500';
      case 'provider_bidding': return 'bg-purple-500';
      case 'assigned': return 'bg-green-500';
      case 'completed': return 'bg-gray-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              {cluster.title}
            </CardTitle>
            <div className="flex items-center gap-4 mt-2">
              <Badge className={`${getStatusColor(cluster.status)} text-white`}>
                {cluster.status.replace('_', ' ').toUpperCase()}
              </Badge>
              <span className="text-sm text-muted-foreground capitalize">
                {cluster.service_type}
              </span>
              {cluster.requires_verification && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  Verified Only
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleShare}
              className="flex items-center gap-1"
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            {isOrganizer && (
              <Button size="sm" variant="outline">
                <Settings className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {cluster.description && (
          <p className="text-muted-foreground">{cluster.description}</p>
        )}

        {/* Location */}
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span>{cluster.location}</span>
          {cluster.neighborhood && (
            <Badge variant="secondary">{cluster.neighborhood}</Badge>
          )}
        </div>

        {/* Participant Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Participants
            </span>
            <span className="font-medium">
              {cluster.participant_count} of {cluster.target_participants} joined
            </span>
          </div>
          
          <Progress value={progressPercentage} className="h-2" />
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Min: {cluster.min_participants}</span>
            <span>Target: {cluster.target_participants}</span>
            <span>Max: {cluster.max_participants}</span>
          </div>
        </div>

        {/* HOUSIE Optimization Results */}
        {isOrganizer && cluster.housie_optimization && (
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="h-4 w-4 text-purple-600" />
                <h4 className="font-medium text-purple-900">HOUSIE Schedule Optimization</h4>
                <Badge variant="outline" className="text-xs">
                  {cluster.housie_optimization.confidence} confidence
                </Badge>
              </div>
              <p className="text-sm text-purple-800 mb-3">{cluster.housie_optimization.summary}</p>
              {cluster.housie_optimization.route.length > 0 && (
                <div className="space-y-2">
                  <h5 className="text-xs font-medium text-purple-700">Optimized Route:</h5>
                  <div className="grid grid-cols-2 gap-1">
                    {cluster.housie_optimization.route.slice(0, 4).map((stop, index) => (
                      <div key={index} className="text-xs bg-white/50 rounded px-2 py-1">
                        Unit {stop.unit}: {stop.start}-{stop.end}
                      </div>
                    ))}
                  </div>
                  {cluster.housie_optimization.route.length > 4 && (
                    <p className="text-xs text-purple-600">
                      +{cluster.housie_optimization.route.length - 4} more units
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          {isOrganizer ? (
            <div className="flex gap-2 w-full">
              {cluster.participant_count >= cluster.min_participants && !cluster.housie_optimization && (
                <Button 
                  onClick={handleOptimizeSchedule}
                  disabled={optimizing}
                  variant="outline"
                  className="flex-1 flex items-center gap-2"
                >
                  <Brain className="h-4 w-4" />
                  {optimizing ? 'Optimizing...' : 'Optimize Schedule (HOUSIE)'}
                </Button>
              )}
              {canActivate && (
                <Button 
                  onClick={handleActivateCluster}
                  disabled={activating}
                  className="flex-1 flex items-center gap-2"
                >
                  <Play className="h-4 w-4" />
                  {activating ? 'Activating...' : 'Activate Cluster'}
                </Button>
              )}
            </div>
          ) : (
            cluster.status === 'pending' && (
              <Button 
                className="flex-1 flex items-center gap-2"
                disabled={cluster.participant_count >= cluster.max_participants}
              >
                <UserPlus className="h-4 w-4" />
                {cluster.participant_count >= cluster.max_participants ? 'Full' : 'Join Cluster'}
              </Button>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ClusterViewCard;