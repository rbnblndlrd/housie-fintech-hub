import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useNetworkGraph } from '@/hooks/useNetworkGraph';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Network, 
  Radio, 
  Users, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  Crown,
  Sparkles,
  Settings
} from 'lucide-react';
import { NetworkGraph } from '@/components/network/NetworkGraph';
import { TrustConnectionCard } from '@/components/network/TrustConnectionCard';
import { useToast } from '@/hooks/use-toast';

export default function NetworkLens() {
  const { username } = useParams<{ username: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // For now, we'll use the current user's ID - in production, you'd resolve username to userId
  const targetUserId = user?.id;
  const isOwnNetwork = targetUserId === user?.id;

  const {
    graphData,
    visibilitySettings,
    loading,
    error,
    generateTrustGraph,
    updateVisibilitySettings,
    getConnectionsByType,
    refreshNetworkData
  } = useNetworkGraph(targetUserId);

  const [selectedMode, setSelectedMode] = useState<'all' | 'canon' | 'crew' | 'broadcast'>('all');
  const [showSettings, setShowSettings] = useState(false);
  const [generating, setGenerating] = useState(false);

  // Show Annette's voice line on entry
  useEffect(() => {
    if (isOwnNetwork && graphData && !loading) {
      toast({
        title: "Annette Network Lens™",
        description: "These are the echoes of your grid, sugar. Canon leaves traces.",
      });
    }
  }, [isOwnNetwork, graphData, loading, toast]);

  const handleGenerateGraph = async () => {
    try {
      setGenerating(true);
      await generateTrustGraph();
      toast({
        title: "Trust Graph Updated",
        description: "Your network lens has been refreshed with the latest Canon data.",
      });
    } catch (err) {
      toast({
        title: "Generation Failed", 
        description: err instanceof Error ? err.message : "Failed to generate trust graph",
        variant: "destructive"
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleVisibilityChange = async (setting: string, value: boolean) => {
    try {
      await updateVisibilitySettings({ [setting]: value });
      toast({
        title: "Privacy Updated",
        description: `Network ${setting.replace('_', ' ')} ${value ? 'enabled' : 'disabled'}.`,
      });
    } catch (err) {
      toast({
        title: "Update Failed",
        description: "Failed to update privacy settings",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-96 bg-muted rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!visibilitySettings?.is_public && !isOwnNetwork) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <EyeOff className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">Private Network</h2>
            <p className="text-muted-foreground">
              This trust network is private and cannot be viewed.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const connections = getConnectionsByType(selectedMode);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <div className="border-b border-border/40 bg-card/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Network className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Network Lens™
                </h1>
                <p className="text-muted-foreground">
                  {username && `@${username} • `}Canon-weighted trust connections
                </p>
              </div>
            </div>

            {isOwnNetwork && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSettings(!showSettings)}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Privacy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateGraph}
                  disabled={generating}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${generating ? 'animate-spin' : ''}`} />
                  Update Graph
                </Button>
              </div>
            )}
          </div>

          {/* Privacy Settings Panel */}
          {showSettings && isOwnNetwork && visibilitySettings && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Network Visibility Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="public">Make network public</Label>
                  <Switch
                    id="public"
                    checked={visibilitySettings.is_public}
                    onCheckedChange={(checked) => handleVisibilityChange('is_public', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="partial">Show partial graph on profile</Label>
                  <Switch
                    id="partial"
                    checked={visibilitySettings.show_partial_graph}
                    onCheckedChange={(checked) => handleVisibilityChange('show_partial_graph', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="anonymize">Anonymize connection names</Label>
                  <Switch
                    id="anonymize"
                    checked={visibilitySettings.anonymize_connections}
                    onCheckedChange={(checked) => handleVisibilityChange('anonymize_connections', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Graph Mode Tabs */}
        <Tabs value={selectedMode} onValueChange={(value) => setSelectedMode(value as any)} className="mb-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Network className="h-4 w-4" />
              All Connections
            </TabsTrigger>
            <TabsTrigger value="canon" className="flex items-center gap-2">
              <Crown className="h-4 w-4" />
              Canon Mode
            </TabsTrigger>
            <TabsTrigger value="crew" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Crew Lens
            </TabsTrigger>
            <TabsTrigger value="broadcast" className="flex items-center gap-2">
              <Radio className="h-4 w-4" />
              Broadcast Mesh
            </TabsTrigger>
          </TabsList>

          {/* Graph Visualization */}
          <div className="mt-6">
            {graphData ? (
              <Card className="p-6 min-h-[500px]">
                <NetworkGraph 
                  connections={connections}
                  mode={selectedMode}
                  centerUserId={targetUserId}
                  anonymize={visibilitySettings?.anonymize_connections || false}
                />
              </Card>
            ) : (
              <Card className="p-8">
                <div className="text-center">
                  <Network className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No Network Data</h3>
                  <p className="text-muted-foreground mb-4">
                    {isOwnNetwork ? 
                      "Generate your trust graph to see your Canon-powered connections." :
                      "This user hasn't generated their trust graph yet."
                    }
                  </p>
                  {isOwnNetwork && (
                    <Button onClick={handleGenerateGraph} disabled={generating}>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Trust Graph
                    </Button>
                  )}
                </div>
              </Card>
            )}
          </div>
        </Tabs>

        {/* Connection Details */}
        {connections.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Network className="h-5 w-5" />
              Connection Details ({connections.length})
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {connections.slice(0, 9).map((connection, index) => (
                <TrustConnectionCard 
                  key={connection.target_id}
                  connection={connection}
                  anonymize={visibilitySettings?.anonymize_connections || false}
                  rank={index + 1}
                />
              ))}
            </div>
          </div>
        )}

        {/* Graph Stats */}
        {graphData && (
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{graphData.connections.length}</div>
                <div className="text-sm text-muted-foreground">Total Connections</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-500">
                  {graphData.connections.filter(c => c.canon_event_ids.length > 0).length}
                </div>
                <div className="text-sm text-muted-foreground">Canon Links</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-500">
                  {Math.round(graphData.connections.reduce((sum, c) => sum + c.trust_score, 0) / graphData.connections.length) || 0}
                </div>
                <div className="text-sm text-muted-foreground">Avg Trust Score</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-500">
                  {graphData.connections.filter(c => new Date(c.last_seen) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}
                </div>
                <div className="text-sm text-muted-foreground">Active (30d)</div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}