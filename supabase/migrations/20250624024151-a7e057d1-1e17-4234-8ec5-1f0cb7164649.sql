
-- Update the notification types constraint to include missing types needed for chat and booking updates
ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_type_check;
ALTER TABLE public.notifications ADD CONSTRAINT notifications_type_check 
CHECK (type IN ('new_booking', 'booking_confirmed', 'payment_received', 'review_received', 'booking_cancelled', 'new_message', 'booking_update', 'system'));
