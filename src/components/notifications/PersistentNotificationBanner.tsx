
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, ChevronDown, ChevronUp, Star } from 'lucide-react';
import { usePersistentNotifications } from '@/hooks/usePersistentNotifications';
import { ReviewFlow } from '@/components/reviews/ReviewFlow';

interface PersistentNotificationBannerProps {
  onReviewComplete?: () => void;
}

export const PersistentNotificationBanner: React.FC<PersistentNotificationBannerProps> = ({
  onReviewComplete
}) => {
  const { notifications, dismissNotification } = usePersistentNotifications();
  const [isMinimized, setIsMinimized] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

  const pendingReviews = notifications.filter(n => n.type === 'pending_review');

  if (pendingReviews.length === 0) return null;

  const handleNotificationClick = (bookingId: string) => {
    setSelectedBookingId(bookingId);
  };

  const handleReviewFlowComplete = (notificationId: string) => {
    dismissNotification(notificationId);
    setSelectedBookingId(null);
    onReviewComplete?.();
  };

  if (isMinimized) {
    return (
      <div className="fixed top-20 right-4 z-50">
        <Button
          onClick={() => setIsMinimized(false)}
          className="bg-orange-500 hover:bg-orange-600 text-white rounded-full p-3 shadow-lg"
        >
          <Star className="h-4 w-4 mr-2" />
          <Badge variant="secondary" className="bg-white text-orange-600">
            {pendingReviews.length}
          </Badge>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="fixed top-16 left-0 right-0 z-40 bg-gradient-to-r from-orange-500 to-red-500 shadow-lg">
        <Card className="mx-4 my-2 border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Star className="h-5 w-5 text-orange-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">Pending Reviews</h3>
                  <p className="text-sm text-gray-600">
                    {pendingReviews.length} job{pendingReviews.length > 1 ? 's' : ''} awaiting your review
                  </p>
                </div>
                <Badge className="bg-orange-100 text-orange-800">
                  {pendingReviews.length}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMinimized(true)}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="mt-3 space-y-2">
              {pendingReviews.map((notification) => (
                <div key={notification.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      Job completed - Share your experience!
                    </p>
                    <p className="text-xs text-gray-600">
                      Tap to review and earn community rewards
                    </p>
                  </div>
                  <Button
                    onClick={() => handleNotificationClick(notification.booking_id!)}
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    Review Now
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedBookingId && (
        <ReviewFlow
          bookingId={selectedBookingId}
          onComplete={() => {
            const notification = pendingReviews.find(n => n.booking_id === selectedBookingId);
            if (notification) {
              handleReviewFlowComplete(notification.id);
            }
          }}
          onClose={() => setSelectedBookingId(null)}
        />
      )}
    </>
  );
};