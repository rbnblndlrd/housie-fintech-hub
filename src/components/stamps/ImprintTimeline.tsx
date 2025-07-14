import React, { useState } from 'react';
import { Clock, MapPin, Star, Filter, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUserImprints, UserImprint } from '@/hooks/useDropPoints';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';

interface ImprintTimelineProps {
  className?: string;
}

export const ImprintTimeline: React.FC<ImprintTimelineProps> = ({ className }) => {
  const { user } = useAuth();
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [canonicalFilter, setCanonicalFilter] = useState<string>('all');
  
  const { data: imprints = [], isLoading } = useUserImprints(user?.id);

  const filteredImprints = imprints.filter(imprint => {
    if (actionFilter !== 'all' && imprint.action_type !== actionFilter) return false;
    if (canonicalFilter === 'canonical' && !imprint.canonical) return false;
    if (canonicalFilter === 'non-canonical' && imprint.canonical) return false;
    return true;
  });

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'job': return '💼';
      case 'visit': return '👋';
      case 'event': return '🎉';
      case 'rebook': return '🔄';
      case 'stamp_unlock': return '⭐';
      default: return '📍';
    }
  };

  const getActionColor = (actionType: string) => {
    switch (actionType) {
      case 'job': return 'bg-blue-500/10 text-blue-700 border-blue-200';
      case 'visit': return 'bg-green-500/10 text-green-700 border-green-200';
      case 'event': return 'bg-purple-500/10 text-purple-700 border-purple-200';
      case 'rebook': return 'bg-orange-500/10 text-orange-700 border-orange-200';
      case 'stamp_unlock': return 'bg-yellow-500/10 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Imprint Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Imprint Timeline
          <Badge variant="outline" className="ml-auto">
            {filteredImprints.length} records
          </Badge>
        </CardTitle>
        
        <div className="flex flex-wrap gap-2">
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Action Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="job">Jobs</SelectItem>
              <SelectItem value="visit">Visits</SelectItem>
              <SelectItem value="event">Events</SelectItem>
              <SelectItem value="rebook">Rebooks</SelectItem>
              <SelectItem value="stamp_unlock">Stamps</SelectItem>
            </SelectContent>
          </Select>

          <Select value={canonicalFilter} onValueChange={setCanonicalFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Canon Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Records</SelectItem>
              <SelectItem value="canonical">📜 Canonical</SelectItem>
              <SelectItem value="non-canonical">📝 Non-Canon</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        {filteredImprints.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="font-medium">No imprints yet</p>
            <p className="text-sm">Visit drop points to start logging imprints</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredImprints.map((imprint) => (
              <ImprintCard key={imprint.id} imprint={imprint} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface ImprintCardProps {
  imprint: UserImprint;
}

const ImprintCard: React.FC<ImprintCardProps> = ({ imprint }) => {
  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'job': return '💼';
      case 'visit': return '👋';
      case 'event': return '🎉';
      case 'rebook': return '🔄';
      case 'stamp_unlock': return '⭐';
      default: return '📍';
    }
  };

  const getActionColor = (actionType: string) => {
    switch (actionType) {
      case 'job': return 'bg-blue-500/10 text-blue-700 border-blue-200';
      case 'visit': return 'bg-green-500/10 text-green-700 border-green-200';
      case 'event': return 'bg-purple-500/10 text-purple-700 border-purple-200';
      case 'rebook': return 'bg-orange-500/10 text-orange-700 border-orange-200';
      case 'stamp_unlock': return 'bg-yellow-500/10 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  const actionIcon = getActionIcon(imprint.action_type);
  const actionColor = getActionColor(imprint.action_type);

  return (
    <div className="border border-border/50 rounded-lg p-4 hover:bg-muted/30 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="text-xl">{actionIcon}</div>
          <div>
            <h4 className="font-medium flex items-center gap-2">
              {imprint.drop_point?.name || 'Unknown Location'}
              {imprint.canonical && (
                <Badge variant="outline" className="text-xs">📜 Canon</Badge>
              )}
            </h4>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="outline" className={`text-xs ${actionColor}`}>
                {imprint.action_type.replace('_', ' ')}
              </Badge>
              {imprint.service_type && (
                <Badge variant="outline" className="text-xs">
                  {imprint.service_type}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="text-right text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDistanceToNow(new Date(imprint.timestamp), { addSuffix: true })}
          </div>
          {imprint.drop_point?.type && (
            <div className="text-xs opacity-70 mt-1">
              {imprint.drop_point.type} zone
            </div>
          )}
        </div>
      </div>

      {imprint.optional_note && (
        <p className="text-sm text-muted-foreground bg-muted/50 rounded p-2 mt-2">
          "{imprint.optional_note}"
        </p>
      )}

      {imprint.stamp_triggered_id && (
        <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
          <div className="flex items-center gap-2 text-yellow-800">
            <Star className="h-4 w-4" />
            <span className="font-medium">Stamp Unlocked: {imprint.stamp_triggered_id}</span>
          </div>
        </div>
      )}
    </div>
  );
};