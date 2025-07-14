// CBS Event Display Component - Shows Canon-verified events

import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Shield, Star, Award, Users, CheckCircle, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CBSEvent } from '@/lib/cbs/types';
import { useCBS } from './CBSProvider';

interface CBSEventDisplayProps {
  showUserEvents?: boolean;
  showGlobalEvents?: boolean;
  maxEvents?: number;
  className?: string;
}

const getEventIcon = (eventType: string) => {
  switch (eventType) {
    case 'booking_completed':
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case 'excellent_review_received':
      return <Star className="w-4 h-4 text-yellow-500" />;
    case 'review_received':
      return <Star className="w-4 h-4 text-blue-500" />;
    case 'trust_connection_established':
      return <Shield className="w-4 h-4 text-purple-500" />;
    case 'loyal_return_stamp':
      return <Award className="w-4 h-4 text-orange-500" />;
    case 'provider_verified':
      return <Shield className="w-4 h-4 text-emerald-500" />;
    case 'excellence_rating_achieved':
      return <Zap className="w-4 h-4 text-gold-500" />;
    default:
      return <Award className="w-4 h-4 text-gray-500" />;
  }
};

const getEventTitle = (event: CBSEvent): string => {
  switch (event.event_type) {
    case 'booking_completed':
      return 'Service Completed';
    case 'excellent_review_received':
      return 'Excellent Review Received';
    case 'review_received':
      return 'Review Received';
    case 'trust_connection_established':
      return 'Trust Connection Established';
    case 'loyal_return_stamp':
      return 'Loyal Return Milestone';
    case 'provider_verified':
      return 'Provider Verification Complete';
    case 'excellence_rating_achieved':
      return 'Excellence Rating Achieved';
    default:
      return event.event_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
};

const getEventDescription = (event: CBSEvent): string => {
  const metadata = event.metadata || {};
  
  switch (event.event_type) {
    case 'booking_completed':
      return `${metadata.service_type || 'Service'} completed successfully`;
    case 'excellent_review_received':
      return `Received ${metadata.rating}/5 stars with glowing feedback`;
    case 'review_received':
      return `Received ${metadata.rating}/5 stars`;
    case 'trust_connection_established':
      return 'Unlocked messaging with trusted connection';
    case 'loyal_return_stamp':
      return `${metadata.service_count} successful services completed`;
    case 'provider_verified':
      return 'Background check and credentials verified';
    case 'excellence_rating_achieved':
      return `${metadata.average_rating}/5 average rating with ${metadata.total_reviews} reviews`;
    default:
      return 'Canon-verified achievement';
  }
};

const getBroadcastScopeColor = (scope: string) => {
  switch (scope) {
    case 'global':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'city':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'local':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const CBSEventDisplay: React.FC<CBSEventDisplayProps> = ({
  showUserEvents = true,
  showGlobalEvents = false,
  maxEvents = 10,
  className = ''
}) => {
  const { isInitialized, recentEvents, eventStats } = useCBS();

  if (!isInitialized) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Canon Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Initializing Canon detection...</p>
        </CardContent>
      </Card>
    );
  }

  const displayEvents = recentEvents.slice(0, maxEvents);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          Canon Events
          {eventStats.verifiedEvents > 0 && (
            <Badge variant="secondary" className="ml-auto">
              {eventStats.verifiedEvents} verified
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {displayEvents.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            No Canon events detected yet
          </p>
        ) : (
          displayEvents.map((event) => (
            <div
              key={event.id}
              className="flex items-start gap-3 p-3 border rounded-lg bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="flex-shrink-0 mt-1">
                {getEventIcon(event.event_type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-sm">
                      {getEventTitle(event)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {getEventDescription(event)}
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-end gap-1">
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getBroadcastScopeColor(event.broadcast_scope)}`}
                    >
                      {event.broadcast_scope}
                    </Badge>
                    {event.verified && (
                      <div className="flex items-center gap-1">
                        <Shield className="w-3 h-3 text-green-600" />
                        <span className="text-xs text-green-600 font-medium">
                          {Math.round(event.canon_confidence * 100)}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDistanceToNow(new Date(event.created_at), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))
        )}
        
        {eventStats.totalEvents > maxEvents && (
          <p className="text-xs text-muted-foreground text-center pt-2">
            Showing {maxEvents} of {eventStats.totalEvents} Canon events
          </p>
        )}
      </CardContent>
    </Card>
  );
};