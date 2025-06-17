
-- Create notifications table
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  type text CHECK (type IN ('new_booking', 'booking_confirmed', 'payment_received', 'review_received', 'booking_cancelled')) NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  booking_id uuid REFERENCES public.bookings(id) ON DELETE CASCADE,
  read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own notifications" 
  ON public.notifications 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" 
  ON public.notifications 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy for system to insert notifications
CREATE POLICY "System can create notifications" 
  ON public.notifications 
  FOR INSERT 
  WITH CHECK (true);

-- Create index for better performance
CREATE INDEX idx_notifications_user_id_read ON public.notifications(user_id, read);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);

-- Enable realtime for notifications
ALTER TABLE public.notifications REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
