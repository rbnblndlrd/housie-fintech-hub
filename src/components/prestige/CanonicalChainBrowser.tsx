import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Crown, 
  Calendar, 
  Trophy, 
  Scroll, 
  Filter,
  Eye,
  Lock,
  CheckCircle,
  Clock,
  Star,
  Sparkles
} from 'lucide-react';
import { format } from 'date-fns';

interface ChainData {
  chain_id: string;
  title: string;
  theme: string;
  progression_stage: number;
  total_stages: number;
  is_complete: boolean;
  is_public: boolean;
  sealed_at: string | null;
  prestige_title_awarded: string | null;
  seal_annotation: string | null;
  category: string;
  role_type: string;
}

interface MetaChainData {
  id: string;
  meta_chain_id: string;
  achieved_at: string;
  achievement_context: any;
  meta_chain_name: string;
  prestige_title: string;
  description: string;
}

const CanonicalChainBrowser: React.FC = () => {
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedChain, setSelectedChain] = useState<string | null>(null);

  // Fetch user's canonical chains
  const { data: chains = [], isLoading: chainsLoading } = useQuery({
    queryKey: ['user-chains', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .rpc('get_user_chain_browser_data', { p_user_id: user.id });
        
      if (error) throw error;
      return data as ChainData[];
    },
    enabled: !!user?.id
  });

  // Fetch user's meta-chain achievements
  const { data: metaChains = [], isLoading: metaChainsLoading } = useQuery({
    queryKey: ['user-meta-chains', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('user_meta_chains')
        .select(`
          *,
          meta_chain_definitions (
            name,
            description,
            prestige_title
          )
        `)
        .eq('user_id', user.id)
        .order('achieved_at', { ascending: false });
        
      if (error) throw error;
      
      return data.map(item => ({
        id: item.id,
        meta_chain_id: item.meta_chain_id,
        achieved_at: item.achieved_at,
        achievement_context: item.achievement_context,
        meta_chain_name: item.meta_chain_definitions?.name || '',
        prestige_title: item.meta_chain_definitions?.prestige_title || '',
        description: item.meta_chain_definitions?.description || ''
      })) as MetaChainData[];
    },
    enabled: !!user?.id
  });

  // Filter chains based on status and category
  const filteredChains = chains.filter(chain => {
    const statusMatch = statusFilter === 'all' || 
      (statusFilter === 'sealed' && chain.is_complete) ||
      (statusFilter === 'progress' && !chain.is_complete) ||
      (statusFilter === 'public' && chain.is_public);
      
    const categoryMatch = categoryFilter === 'all' || 
      chain.role_type === categoryFilter;
      
    return statusMatch && categoryMatch;
  });

  const getStatusIcon = (chain: ChainData) => {
    if (chain.is_complete) return <CheckCircle className="h-4 w-4 text-green-400" />;
    return <Clock className="h-4 w-4 text-amber-400" />;
  };

  const getProgressPercentage = (chain: ChainData) => {
    return Math.round((chain.progression_stage / chain.total_stages) * 100);
  };

  const ChainCard: React.FC<{ chain: ChainData }> = ({ chain }) => (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-slate-700 bg-slate-800/50 backdrop-blur-sm ${
        selectedChain === chain.chain_id ? 'ring-2 ring-primary' : ''
      }`}
      onClick={() => setSelectedChain(selectedChain === chain.chain_id ? null : chain.chain_id)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon(chain)}
            <CardTitle className="text-sm font-medium text-slate-200">
              {chain.title}
            </CardTitle>
          </div>
          <div className="flex gap-1">
            <Badge variant="outline" className="text-xs">
              {chain.category}
            </Badge>
            {chain.is_public && (
              <Badge variant="outline" className="text-xs">
                <Eye className="h-3 w-3 mr-1" />
                Public
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Progress</span>
              <span>{chain.progression_stage}/{chain.total_stages}</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-primary to-primary-glow h-2 rounded-full transition-all duration-300"
                style={{ width: `${getProgressPercentage(chain)}%` }}
              />
            </div>
          </div>

          {/* Seal Information */}
          {chain.is_complete && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-green-400">
                <Trophy className="h-3 w-3" />
                <span>Sealed {chain.sealed_at ? format(new Date(chain.sealed_at), 'MMM dd, yyyy') : ''}</span>
              </div>
              
              {chain.prestige_title_awarded && (
                <Badge variant="outline" className="text-xs bg-amber-900/30 text-amber-300 border-amber-700">
                  <Crown className="h-3 w-3 mr-1" />
                  {chain.prestige_title_awarded}
                </Badge>
              )}

              {chain.seal_annotation && (
                <div className="text-xs text-slate-400 italic">
                  "{chain.seal_annotation}"
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const MetaChainCard: React.FC<{ metaChain: MetaChainData }> = ({ metaChain }) => (
    <Card className="border-amber-600/30 bg-gradient-to-br from-amber-900/20 to-amber-800/10 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-400" />
          <CardTitle className="text-amber-200">{metaChain.meta_chain_name}</CardTitle>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          <p className="text-sm text-slate-300">{metaChain.description}</p>
          
          <div className="flex items-center gap-2">
            <Badge className="bg-amber-700/30 text-amber-200 border-amber-600">
              <Star className="h-3 w-3 mr-1" />
              {metaChain.prestige_title}
            </Badge>
          </div>
          
          <div className="text-xs text-slate-400">
            <Calendar className="h-3 w-3 inline mr-1" />
            Achieved {format(new Date(metaChain.achieved_at), 'MMM dd, yyyy')}
          </div>
          
          {metaChain.achievement_context && (
            <div className="text-xs text-amber-300/70">
              {metaChain.achievement_context.total_chains && 
                `${metaChain.achievement_context.total_chains} chains sealed`}
              {metaChain.achievement_context.annotation_chains && 
                `${metaChain.achievement_context.annotation_chains} annotated chains`}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (chainsLoading || metaChainsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Meta-Chain Achievements */}
      {metaChains.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-400" />
            <h2 className="text-lg font-semibold text-slate-200">Meta-Chain Achievements</h2>
            <Badge className="bg-amber-700/30 text-amber-200 border-amber-600">
              Kind of a Big Deal
            </Badge>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            {metaChains.map((metaChain) => (
              <MetaChainCard key={metaChain.id} metaChain={metaChain} />
            ))}
          </div>
        </div>
      )}

      {/* Chain Browser */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scroll className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-slate-200">Canonical Chain Archive</h2>
          </div>
          
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="progress">In Progress</SelectItem>
                <SelectItem value="sealed">Sealed</SelectItem>
                <SelectItem value="public">Public</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="provider">Provider</SelectItem>
                <SelectItem value="customer">Customer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Chain Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-700">
            <div className="text-2xl font-bold text-primary">{chains.length}</div>
            <div className="text-sm text-slate-400">Total Chains</div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-700">
            <div className="text-2xl font-bold text-green-400">{chains.filter(c => c.is_complete).length}</div>
            <div className="text-sm text-slate-400">Sealed</div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-700">
            <div className="text-2xl font-bold text-amber-400">{chains.filter(c => !c.is_complete).length}</div>
            <div className="text-sm text-slate-400">In Progress</div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-700">
            <div className="text-2xl font-bold text-purple-400">{metaChains.length}</div>
            <div className="text-sm text-slate-400">Meta-Achievements</div>
          </div>
        </div>

        {/* Chain Grid */}
        {filteredChains.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredChains.map((chain) => (
              <ChainCard key={chain.chain_id} chain={chain} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Scroll className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-400 mb-2">No chains found</h3>
            <p className="text-slate-500">
              {statusFilter !== 'all' || categoryFilter !== 'all' 
                ? 'Try adjusting your filters to see more chains.'
                : 'Start completing prestige tracks to build your canonical chain legacy.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CanonicalChainBrowser;