import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ClusterBidPanel from '@/components/clusters/ClusterBidPanel';
import VideoBackground from '@/components/common/VideoBackground';
import { 
  DollarSign, 
  Clock, 
  Users, 
  MapPin, 
  Calendar,
  TrendingUp,
  CheckCircle,
  XCircle,
  Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProviderBids = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [availableClusters, setAvailableClusters] = useState<any[]>([]);
  const [myBids, setMyBids] = useState<any[]>([]);
  const [selectedCluster, setSelectedCluster] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isProvider, setIsProvider] = useState(false);

  useEffect(() => {
    if (user) {
      checkProviderStatus();
    }
  }, [user]);

  useEffect(() => {
    if (isProvider && user) {
      fetchData();
    }
  }, [isProvider, user]);

  const checkProviderStatus = async () => {
    try {
      const { data: providerProfile, error } = await supabase
        .from('provider_profiles')
        .select('id')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setIsProvider(!!providerProfile);
    } catch (error) {
      console.error('Error checking provider status:', error);
      toast({
        title: "Error",
        description: "Failed to verify provider status.",
        variant: "destructive"
      });
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch available clusters for bidding
      const { data: clusters, error: clustersError } = await supabase
        .from('clusters')
        .select('*')
        .in('status', ['active', 'provider_bidding'])
        .order('created_at', { ascending: false });

      if (clustersError) throw clustersError;

      // Fetch user's bids
      const { data: bids, error: bidsError } = await supabase
        .from('cluster_bids')
        .select(`
          *,
          clusters (*)
        `)
        .eq('provider_id', user?.id)
        .order('created_at', { ascending: false });

      if (bidsError) throw bidsError;

      setAvailableClusters(clusters || []);
      setMyBids(bids || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load bidding data.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'accepted':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500';
      case 'accepted':
        return 'bg-green-500';
      case 'rejected':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
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
                Please sign in to view bidding opportunities.
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

  if (!isProvider) {
    return (
      <>
        <VideoBackground />
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-6 text-center">
              <h2 className="text-xl font-semibold mb-2">Provider Profile Required</h2>
              <p className="text-muted-foreground mb-4">
                You need a provider profile to access bidding features.
              </p>
              <Button onClick={() => navigate('/profile')}>
                Set Up Provider Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  if (selectedCluster) {
    return (
      <>
        <VideoBackground />
        <div className="relative z-10 min-h-screen">
          <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
              <Button 
                variant="outline" 
                onClick={() => setSelectedCluster(null)}
                className="mb-4"
              >
                ← Back to Opportunities
              </Button>
            </div>
            <ClusterBidPanel 
              cluster={selectedCluster}
              onBidSubmitted={() => {
                setSelectedCluster(null);
                fetchData();
              }}
            />
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
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white">Provider Bidding Hub</h1>
              <p className="text-white/80 mt-1">
                Discover and bid on cluster coordination opportunities
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <TrendingUp className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Available</p>
                      <p className="text-2xl font-bold">{availableClusters.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <DollarSign className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">My Bids</p>
                      <p className="text-2xl font-bold">{myBids.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <CheckCircle className="h-8 w-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Accepted</p>
                      <p className="text-2xl font-bold">
                        {myBids.filter(bid => bid.status === 'accepted').length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Bidding Tabs */}
            <Tabs defaultValue="opportunities" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="opportunities">Available Opportunities</TabsTrigger>
                <TabsTrigger value="my-bids">My Bids</TabsTrigger>
              </TabsList>

              <TabsContent value="opportunities" className="space-y-6">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  </div>
                ) : availableClusters.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Opportunities Available</h3>
                      <p className="text-muted-foreground">
                        Check back later for new cluster bidding opportunities
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {availableClusters.map(cluster => (
                      <Card key={cluster.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-lg">{cluster.title}</CardTitle>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge className={`${cluster.status === 'active' ? 'bg-green-500' : 'bg-blue-500'} text-white`}>
                                  {cluster.status.replace('_', ' ').toUpperCase()}
                                </Badge>
                                <span className="text-sm text-muted-foreground capitalize">
                                  {cluster.service_type}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          {cluster.description && (
                            <p className="text-sm text-muted-foreground">{cluster.description}</p>
                          )}

                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span>{cluster.location}</span>
                            </div>

                            <div className="flex items-center gap-2 text-sm">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span>{cluster.participant_count} participants</span>
                            </div>

                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>Created {new Date(cluster.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>

                          <div className="flex gap-3 pt-4">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => navigate(`/clusters/${cluster.id}`)}
                              className="flex items-center gap-1"
                            >
                              <Eye className="h-4 w-4" />
                              View Details
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => setSelectedCluster(cluster)}
                              className="flex-1"
                            >
                              Submit Bid
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="my-bids" className="space-y-6">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  </div>
                ) : myBids.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Bids Yet</h3>
                      <p className="text-muted-foreground">
                        Submit your first bid on available cluster opportunities
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {myBids.map(bid => (
                      <Card key={bid.id}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <h4 className="font-medium">{bid.clusters?.title}</h4>
                                <Badge className={`${getStatusColor(bid.status)} text-white`}>
                                  {bid.status.toUpperCase()}
                                </Badge>
                              </div>
                              
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                                <div>
                                  <p className="text-muted-foreground">Bid Amount</p>
                                  <p className="font-medium">${bid.total_amount}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Est. Hours</p>
                                  <p className="font-medium">{bid.estimated_hours}h</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Submitted</p>
                                  <p className="font-medium">{new Date(bid.created_at).toLocaleDateString()}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Status</p>
                                  <div className="flex items-center gap-1">
                                    {getStatusIcon(bid.status)}
                                    <span className="font-medium capitalize">{bid.status}</span>
                                  </div>
                                </div>
                              </div>

                              {bid.message && (
                                <div className="mt-3 p-3 bg-muted rounded">
                                  <p className="text-sm">{bid.message}</p>
                                </div>
                              )}
                            </div>

                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => navigate(`/clusters/${bid.clusters?.id}`)}
                            >
                              View Cluster
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
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

export default ProviderBids;