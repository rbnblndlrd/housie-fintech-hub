import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import ClusterViewCard from '@/components/clusters/ClusterViewCard';
import TimeBlockPlanner from '@/components/clusters/TimeBlockPlanner';
import ClusterBidPanel from '@/components/clusters/ClusterBidPanel';
import VideoBackground from '@/components/common/VideoBackground';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { ChatBubble } from '@/components/chat/ChatBubble';
import { AnnetteButton } from '@/components/chat/AnnetteButton';

const ClusterView = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [cluster, setCluster] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<'organizer' | 'participant' | 'provider' | 'visitor'>('visitor');

  const shareCode = searchParams.get('code');

  useEffect(() => {
    if (id) {
      fetchCluster();
    }
  }, [id, user]);

  const fetchCluster = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch cluster data
      const { data: clusterData, error: clusterError } = await supabase
        .from('clusters')
        .select('*')
        .eq('id', id)
        .single();

      if (clusterError) {
        if (clusterError.code === 'PGRST116') {
          setError('Cluster not found');
        } else {
          throw clusterError;
        }
        return;
      }

      setCluster(clusterData);

      // Determine user role
      if (user) {
        if (clusterData.organizer_id === user.id) {
          setUserRole('organizer');
        } else {
          // Check if user is a participant
          const { data: participantData, error: participantError } = await supabase
            .from('cluster_participants')
            .select('id')
            .eq('cluster_id', id)
            .eq('user_id', user.id)
            .maybeSingle();

          if (participantError && participantError.code !== 'PGRST116') {
            console.error('Error checking participant status:', participantError);
          }

          if (participantData) {
            setUserRole('participant');
          } else {
            // Check if user is a provider (has provider profile)
            const { data: providerData, error: providerError } = await supabase
              .from('provider_profiles')
              .select('id')
              .eq('user_id', user.id)
              .maybeSingle();

            if (providerError && providerError.code !== 'PGRST116') {
              console.error('Error checking provider status:', providerError);
            }

            setUserRole(providerData ? 'provider' : 'visitor');
          }
        }
      }
    } catch (error) {
      console.error('Error fetching cluster:', error);
      setError('Failed to load cluster data');
      toast({
        title: "Error",
        description: "Failed to load cluster data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClusterUpdate = () => {
    fetchCluster();
  };

  if (loading) {
    return (
      <>
        <VideoBackground />
        <div className="relative z-10 min-h-screen">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto space-y-6">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error || !cluster) {
    return (
      <>
        <VideoBackground />
        <div className="relative z-10 min-h-screen">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {error || 'Cluster not found'}
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <VideoBackground />
      <div className="relative z-10 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Main Cluster View */}
            <ClusterViewCard
              cluster={cluster}
              isOrganizer={userRole === 'organizer'}
              onUpdate={handleClusterUpdate}
            />

            {/* Conditional Additional Views */}
            {userRole === 'organizer' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <TimeBlockPlanner 
                  clusterId={cluster.id} 
                  isOrganizer={true}
                />
                {/* Additional organizer tools could go here */}
              </div>
            )}

            {userRole === 'provider' && cluster.status === 'provider_bidding' && (
              <ClusterBidPanel 
                cluster={cluster}
                onBidSubmitted={handleClusterUpdate}
              />
            )}

            {userRole === 'participant' && (
              <TimeBlockPlanner 
                clusterId={cluster.id} 
                isOrganizer={false}
              />
            )}

            {/* Share code validation message */}
            {shareCode && (
              <Alert>
                <AlertDescription>
                  You've accessed this cluster via a share link. 
                  {user ? ' You can join if there are available spots.' : ' Sign in to join this cluster.'}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
        
        <ChatBubble defaultTab="ai" />
      </div>
    </>
  );
};

export default ClusterView;