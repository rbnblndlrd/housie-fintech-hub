import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, MessageCircle, Calendar, Star } from 'lucide-react';

interface AnnetteCompletionNotificationProps {
  bookingId: string;
  providerName: string;
  serviceName: string;
  previousBookings?: number;
  averageRating?: number;
  onRebookSuggestion?: () => void;
  onDismiss: () => void;
}

export const AnnetteCompletionNotification: React.FC<AnnetteCompletionNotificationProps> = ({
  bookingId,
  providerName,
  serviceName,
  previousBookings = 0,
  averageRating = 0,
  onRebookSuggestion,
  onDismiss
}) => {
  const [currentInsight, setCurrentInsight] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const insights = [
    {
      type: 'completion',
      icon: '🎉',
      title: 'Job Complete!',
      message: `Great work completing the ${serviceName} job! Your review helps build trust in the community.`
    },
    {
      type: 'connection',
      icon: '🤝',
      title: 'Credibility Connection Unlocked!',
      message: `You can now message ${providerName} directly for future bookings. Your professional network is growing!`
    },
    ...(previousBookings >= 2 ? [{
      type: 'rebook',
      icon: '🔄',
      title: 'Rebook Suggestion',
      message: `That's job #${previousBookings + 1} with ${providerName}! Based on your history, want to schedule your next ${serviceName}?`
    }] : []),
    ...(averageRating >= 4.5 ? [{
      type: 'excellence',
      icon: '⭐',
      title: 'Excellence Streak!',
      message: `Your ${averageRating.toFixed(1)}-star average is impressive! Keep up the great work.`
    }] : [])
  ];

  // Rotate insights every 4 seconds
  useEffect(() => {
    if (insights.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentInsight(prev => (prev + 1) % insights.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [insights.length]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => onDismiss(), 300);
  };

  if (!isVisible) return null;

  const currentNotification = insights[currentInsight];

  return (
    <Card 
      className={`fixed bottom-4 right-4 w-80 border-purple-200 bg-purple-50 shadow-lg transition-all duration-300 z-50 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <div>
              <p className="font-medium text-purple-700 text-sm">Annette says:</p>
              <Badge variant="outline" className="text-xs">
                {currentNotification.type}
              </Badge>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <span className="text-lg">{currentNotification.icon}</span>
            <div className="flex-1">
              <h4 className="font-medium text-purple-800 text-sm mb-1">
                {currentNotification.title}
              </h4>
              <p className="text-purple-600 text-sm leading-relaxed">
                {currentNotification.message}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            {currentNotification.type === 'connection' && (
              <Button
                size="sm"
                variant="outline"
                className="flex-1 border-purple-300 text-purple-700 hover:bg-purple-100"
              >
                <MessageCircle className="h-3 w-3 mr-1" />
                Message
              </Button>
            )}
            
            {currentNotification.type === 'rebook' && onRebookSuggestion && (
              <Button
                size="sm"
                variant="outline"
                onClick={onRebookSuggestion}
                className="flex-1 border-purple-300 text-purple-700 hover:bg-purple-100"
              >
                <Calendar className="h-3 w-3 mr-1" />
                Schedule Next
              </Button>
            )}

            {currentNotification.type === 'excellence' && (
              <Button
                size="sm"
                variant="outline"
                className="flex-1 border-purple-300 text-purple-700 hover:bg-purple-100"
              >
                <Star className="h-3 w-3 mr-1" />
                View Profile
              </Button>
            )}
          </div>

          {/* Progress Dots */}
          {insights.length > 1 && (
            <div className="flex justify-center gap-1 pt-2">
              {insights.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentInsight ? 'bg-purple-500' : 'bg-purple-200'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};