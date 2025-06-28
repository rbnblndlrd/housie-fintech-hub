export const PersistentNotificationBanner: React.FC<PersistentNotificationBannerProps> = ({
  onReviewComplete,
  setIsMinimized,
  usePersistentNotifications
}) => {
  const [selectedBookingId, setSelectedBookingId] = useStateString | null>(null);
  const [isMinimized, setIsMinimizedLocal] = useStateString<boolean>(false);

  const { notifications, dismissNotification } = usePersistentNotifications();
  
  // Fix: Access the data property and ensure it's an array
  const notificationsData = notifications?.data || [];
  const pendingReviews = notificationsData.filter(n => n.type === 'pending_review');

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
          onClick={() => setIsMinimizedLocal(false)}
          className="bg-orange-500 hover:bg-orange-600 text-white rounded-full p-3 shadow-lg"
        >
          <Star className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed top-20 right-4 z-50">
      <Button
        onClick={() => setIsMinimizedLocal(false)}
        className="bg-orange-500 hover:bg-orange-600 text-white rounded-full p-3 shadow-lg"
      >
        💡 REVIEWS EARN REWARDS" (clickable to community rewards explanation)
        - Star rating (1-5) + optional text
        - Photo upload: "Share photos of completed work?"
        - Checkbox: "Allow provider to use in portfolio"

Close review window → Notification disappears (mission accomplished!)
      </Button>
    </div>
  );
};
