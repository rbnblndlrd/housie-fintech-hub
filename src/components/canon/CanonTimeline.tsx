import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserStamp } from '@/utils/stampEngine';
// Types will be imported inline
import { formatDistanceToNow } from 'date-fns';
import { 
  Star, 
  Crown, 
  MapPin, 
  Shield,
  Calendar,
  Zap
} from 'lucide-react';

interface CanonTimelineProps {
  userId: string;
  stamps: UserStamp[];
  fusionTitles: any[];
  imprints: any[];
  limit?: number;
}

interface TimelineEvent {
  id: string;
  type: 'stamp' | 'title' | 'imprint' | 'broadcast';
  timestamp: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  isCanon: boolean;
  context?: string;
}

const CanonTimeline: React.FC<CanonTimelineProps> = ({
  stamps,
  fusionTitles,
  imprints,
  limit = 10
}) => {
  // Combine all events into a timeline
  const events: TimelineEvent[] = [
    // Stamp events
    ...stamps.map((userStamp): TimelineEvent => ({
      id: `stamp-${userStamp.id}`,
      type: 'stamp',
      timestamp: userStamp.earnedAt,
      title: `Earned ${userStamp.stamp?.name || 'Unknown Stamp'}`,
      description: userStamp.stamp?.flavorText || 'Stamp earned through exceptional service',
      icon: <Star className="h-4 w-4" />,
      isCanon: userStamp.contextData?.canonVerified || false,
      context: userStamp.contextData?.narrative
    })),
    
    // Fusion title events
    ...fusionTitles
      .filter(title => title.earned_at)
      .map((title): TimelineEvent => ({
        id: `title-${title.id}`,
        type: 'title',
        timestamp: title.earned_at!,
        title: `Unlocked "${title.fusion_title?.name || 'Unknown Title'}"`,
        description: title.fusion_title?.description || 'Elite title earned',
        icon: <Crown className="h-4 w-4" />,
        isCanon: true,
        context: `Fusion requirements met`
      })),
    
    // Imprint events
    ...imprints.map((imprint): TimelineEvent => ({
      id: `imprint-${imprint.id}`,
      type: 'imprint',
      timestamp: imprint.timestamp,
      title: `Left imprint at ${imprint.drop_point?.name || 'Unknown Location'}`,
      description: imprint.optional_note || `${imprint.action_type} action recorded`,
      icon: <MapPin className="h-4 w-4" />,
      isCanon: imprint.canonical,
      context: imprint.service_type ? `Service: ${imprint.service_type}` : undefined
    }))
  ];

  // Sort by timestamp (newest first) and limit
  const sortedEvents = events
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);

  const getEventColor = (event: TimelineEvent) => {
    if (event.isCanon) {
      switch (event.type) {
        case 'stamp': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
        case 'title': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
        case 'imprint': return 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20';
        default: return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      }
    }
    return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
  };

  if (sortedEvents.length === 0) {
    return (
      <Card className="bg-gray-900/50 border-gray-700">
        <CardContent className="p-6 text-center">
          <p className="text-gray-400">No canon events recorded yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-900/50 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Calendar className="h-5 w-5 text-purple-400" />
          Canon Event Timeline
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {sortedEvents.map((event, index) => (
            <div key={event.id} className="relative">
              {/* Timeline line */}
              {index < sortedEvents.length - 1 && (
                <div className="absolute left-5 top-10 bottom-0 w-px bg-gray-600" />
              )}
              
              <div className="flex gap-4">
                {/* Event icon */}
                <div className={`
                  flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center
                  ${getEventColor(event)}
                `}>
                  {event.icon}
                </div>
                
                {/* Event content */}
                <div className="flex-1 min-w-0 pb-6">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-white font-medium">{event.title}</h4>
                    {event.isCanon && (
                      <Badge className="bg-yellow-500 text-black text-xs font-bold">
                        <Shield className="h-3 w-3 mr-1" />
                        Canon
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-2">
                    {event.description}
                  </p>
                  
                  {event.context && (
                    <p className="text-purple-300 text-xs italic mb-2">
                      {event.context}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {events.length > limit && (
            <div className="text-center pt-4 border-t border-gray-700">
              <p className="text-gray-400 text-sm">
                Showing {limit} of {events.length} events
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CanonTimeline;