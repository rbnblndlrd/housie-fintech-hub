import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Repeat, X } from 'lucide-react';
import { RebookingSuggestion } from '@/hooks/useServiceConnections';
import { cn } from '@/lib/utils';

interface RebookingSuggestionCardProps {
  suggestion: RebookingSuggestion;
  onRebook?: (providerUserId: string) => void;
  onDismiss?: (providerUserId: string) => void;
  className?: string;
}

export const RebookingSuggestionCard: React.FC<RebookingSuggestionCardProps> = ({
  suggestion,
  onRebook,
  onDismiss,
  className
}) => {
  const daysSince = Math.ceil(
    (Date.now() - new Date(suggestion.last_booking_date).getTime()) / (1000 * 60 * 60 * 24)
  );

  const getFrequencyLabel = (pattern?: string) => {
    switch (pattern) {
      case 'weekly':
        return 'Weekly';
      case 'bi_weekly':
        return 'Bi-weekly';
      case 'monthly':
        return 'Monthly';
      case 'seasonal':
        return 'Seasonal';
      default:
        return 'As needed';
    }
  };

  const getUrgencyColor = () => {
    if (daysSince > 30) return 'bg-red-100 text-red-800 border-red-200';
    if (daysSince > 14) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  return (
    <Card className={cn("w-full hover:shadow-md transition-shadow", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold flex items-center">
              <Repeat className="h-5 w-5 mr-2 text-blue-600" />
              Rebook {suggestion.provider_name}?
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {suggestion.service_type} • {suggestion.total_bookings} previous job{suggestion.total_bookings !== 1 ? 's' : ''}
            </p>
          </div>
          
          {onDismiss && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDismiss(suggestion.provider_user_id)}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-muted-foreground">
                <Clock className="h-4 w-4 mr-1" />
                {daysSince} days ago
              </div>
              
              {suggestion.frequency_pattern && (
                <Badge variant="outline" className="text-xs">
                  {getFrequencyLabel(suggestion.frequency_pattern)}
                </Badge>
              )}
            </div>
            
            <Badge 
              variant="outline"
              className={cn("text-xs", getUrgencyColor())}
            >
              {daysSince > 30 ? 'Overdue' : daysSince > 14 ? 'Due Soon' : 'On Schedule'}
            </Badge>
          </div>

          <div className="flex space-x-2">
            <Button
              onClick={() => onRebook?.(suggestion.provider_user_id)}
              className="flex-1 flex items-center justify-center space-x-2"
            >
              <Calendar className="h-4 w-4" />
              <span>Book Again</span>
            </Button>
            
            <Button
              variant="outline"
              onClick={() => onDismiss?.(suggestion.provider_user_id)}
              className="px-3"
            >
              Later
            </Button>
          </div>

          <div className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-2">
            💡 Annette noticed your booking pattern and suggests reconnecting with {suggestion.provider_name}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};