import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ClusterViewCard from '@/components/clusters/ClusterViewCard';
import VideoBackground from '@/components/common/VideoBackground';
import { Plus, Users, Briefcase, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ClusterDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [organizerClusters, setOrganizerClusters] = useState<any[]>([]);
  const [participantClusters, setParticipantClusters] = useState<any[]>([]);
  const [availableClusters, setAvailableClusters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<'customer' | 'provider'>('customer');

  useEffect(() => {
    if (user) {
      fetchClusters();
      checkUserRole();
    }
  }, [user]);

  const checkUserRole = async () => {
    try {
      const { data: providerProfile } = await supabase
        .from('provider_profiles')
        .select('id')
        .eq('user_id', user?.id)
        .maybeSingle();

      setUserRole(providerProfile ? 'provider' : 'customer');
    } catch (error) {
      console.error('Error checking user role:', error);
    }
  };

  const fetchClusters = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch clusters organized by user
      const { data: organizedClusters, error: organizedError } = await supabase
        .from('clusters')
        .select('*')
        .eq('organizer_id', user.id)
        .order('created_at', { ascending: false });

      if (organizedError) throw organizedError;

      // Fetch clusters user is participating in
      const { data: participations, error: participationError } = await supabase
        .from('cluster_participants')
        .select(`
          cluster_id,
          clusters (*)
        `)
        .eq('user_id', user.id);

      if (participationError) throw participationError;

      const participatedClusters = participations?.map(p => p.clusters).filter(Boolean) || [];

      // Fetch available clusters (not organized by user, not participating in)
      const organizedIds = organizedClusters?.map(c => c.id) || [];
      const participatedIds = participatedClusters.map(c => c.id);
      const excludeIds = [...organizedIds, ...participatedIds];

      let availableQuery = supabase
        .from('clusters')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(10);

      if (excludeIds.length > 0) {
        availableQuery = availableQuery.not('id', 'in', `(${excludeIds.join(',')})`);
      }

      const { data: availableClustersData, error: availableError } = await availableQuery;

      if (availableError) throw availableError;

      setOrganizerClusters(organizedClusters || []);
      setParticipantClusters(participatedClusters);
      setAvailableClusters(availableClustersData || []);
    } catch (error) {
      console.error('Error fetching clusters:', error);
      toast({
        title: "Error",
        description: "Failed to load clusters. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClusterUpdate = () => {
    fetchClusters();
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
                Please sign in to view your cluster dashboard.
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

  return (
    <>
      <VideoBackground />
      <div className="relative z-10 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white">Cluster Dashboard</h1>
                <p className="text-white/80 mt-1">
                  Coordinate bulk services with your neighbors
                </p>
              </div>
              <Button 
                onClick={() => navigate('/clusters/new')}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Create Cluster
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Organized</p>
                      <p className="text-2xl font-bold">{organizerClusters.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Target className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Participating</p>
                      <p className="text-2xl font-bold">{participantClusters.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Briefcase className="h-8 w-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Available</p>
                      <p className="text-2xl font-bold">{availableClusters.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Cluster Tabs */}
            <Tabs defaultValue="organized" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="organized">My Clusters</TabsTrigger>
                <TabsTrigger value="participating">Participating</TabsTrigger>
                <TabsTrigger value="available">Available</TabsTrigger>
              </TabsList>

              <TabsContent value="organized" className="space-y-6">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  </div>
                ) : organizerClusters.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Clusters Yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Create your first cluster to start coordinating with neighbors
                      </p>
                      <Button onClick={() => navigate('/clusters/new')}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create First Cluster
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {organizerClusters.map(cluster => (
                      <ClusterViewCard
                        key={cluster.id}
                        cluster={cluster}
                        isOrganizer={true}
                        onUpdate={handleClusterUpdate}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="participating" className="space-y-6">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  </div>
                ) : participantClusters.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Not Participating Yet</h3>
                      <p className="text-muted-foreground">
                        Join available clusters to coordinate services with neighbors
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {participantClusters.map(cluster => (
                      <ClusterViewCard
                        key={cluster.id}
                        cluster={cluster}
                        isOrganizer={false}
                        onUpdate={handleClusterUpdate}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="available" className="space-y-6">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  </div>
                ) : availableClusters.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Available Clusters</h3>
                      <p className="text-muted-foreground">
                        Check back later or create your own cluster
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {availableClusters.map(cluster => (
                      <ClusterViewCard
                        key={cluster.id}
                        cluster={cluster}
                        isOrganizer={false}
                        onUpdate={handleClusterUpdate}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClusterDashboard;