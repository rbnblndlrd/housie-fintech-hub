import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, Calendar, Star, Users } from 'lucide-react';
import { ServiceConnection } from '@/hooks/useServiceConnections';
import { cn } from '@/lib/utils';

interface ServiceNetworkCardProps {
  connection: ServiceConnection;
  onMessage?: (userId: string) => void;
  onRebook?: (userId: string) => void;
  className?: string;
}

export const ServiceNetworkCard: React.FC<ServiceNetworkCardProps> = ({
  connection,
  onMessage,
  onRebook,
  className
}) => {
  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'network':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'trusted':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTierLabel = (tier: string) => {
    switch (tier) {
      case 'network':
        return 'Network Member';
      case 'trusted':
        return 'Trusted Partner';
      default:
        return 'Service Connection';
    }
  };

  const timeSinceLastJob = connection.last_booked_date 
    ? Math.ceil((Date.now() - new Date(connection.last_booked_date).getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <Card className={cn("w-full hover:shadow-md transition-shadow", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-12 h-12">
              <AvatarImage 
                src={connection.other_user?.profile_image} 
                alt={connection.other_user?.full_name}
              />
              <AvatarFallback className="bg-blue-600 text-white">
                {connection.other_user?.full_name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg font-semibold">
                {connection.other_user?.full_name || 'Unknown User'}
              </CardTitle>
              <Badge 
                variant="outline" 
                className={cn("text-xs mt-1", getTierColor(connection.connection_tier))}
              >
                {getTierLabel(connection.connection_tier)}
              </Badge>
            </div>
          </div>
          
          <div className="text-right text-sm text-muted-foreground">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              {connection.service_connection_count} job{connection.service_connection_count !== 1 ? 's' : ''}
            </div>
            {timeSinceLastJob && (
              <div className="mt-1">
                {timeSinceLastJob} days ago
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            {connection.cred_connection_established && (
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-1 text-yellow-500" />
                Cred Established
              </div>
            )}
          </div>
          
          <div className="flex space-x-2">
            {connection.can_message && onMessage && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onMessage(connection.other_user?.id || '')}
                className="flex items-center space-x-1"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Message</span>
              </Button>
            )}
            
            {onRebook && (
              <Button
                size="sm"
                onClick={() => onRebook(connection.other_user?.id || '')}
                className="flex items-center space-x-1"
              >
                <Calendar className="h-4 w-4" />
                <span>Rebook</span>
              </Button>
            )}
          </div>
        </div>

        {!connection.can_message && (
          <div className="mt-3 p-2 bg-muted/50 rounded-lg text-xs text-muted-foreground">
            💬 Complete another job together to unlock messaging
          </div>
        )}
      </CardContent>
    </Card>
  );
};