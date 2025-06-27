
-- Create a proper reviews system that's tied to completed bookings
ALTER TABLE reviews 
ADD COLUMN IF NOT EXISTS verified_transaction BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS network_connection BOOLEAN DEFAULT false;

-- Update existing reviews to mark transaction-verified ones
UPDATE reviews 
SET verified_transaction = true 
WHERE booking_id IN (
  SELECT id FROM bookings WHERE status = 'completed'
);

-- Add constraint to ensure only one review per booking
ALTER TABLE reviews 
ADD CONSTRAINT unique_review_per_booking 
UNIQUE (booking_id, reviewer_id);

-- Create network connections table for completed service relationships
CREATE TABLE IF NOT EXISTS public.network_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_from_booking_id UUID REFERENCES bookings(id),
  connection_type TEXT DEFAULT 'service_completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(customer_id, provider_id)
);

-- Enable RLS on network connections
ALTER TABLE public.network_connections ENABLE ROW LEVEL SECURITY;

-- RLS policies for network connections
CREATE POLICY "Users can view their own network connections" 
ON public.network_connections 
FOR SELECT 
USING (customer_id = auth.uid() OR provider_id = auth.uid());

CREATE POLICY "System can create network connections" 
ON public.network_connections 
FOR INSERT 
WITH CHECK (true);

-- Add network count to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS network_count INTEGER DEFAULT 0;

-- Function to create network connection when booking is completed
CREATE OR REPLACE FUNCTION create_network_connection()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create connection when booking status changes to completed
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    -- Create network connection
    INSERT INTO public.network_connections (customer_id, provider_id, created_from_booking_id)
    VALUES (NEW.customer_id, NEW.provider_id, NEW.id)
    ON CONFLICT (customer_id, provider_id) DO NOTHING;
    
    -- Update network counts for both users
    UPDATE users 
    SET network_count = (
      SELECT COUNT(*) FROM network_connections 
      WHERE customer_id = users.id OR provider_id = users.id
    )
    WHERE id IN (NEW.customer_id, NEW.provider_id);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for network connection creation
DROP TRIGGER IF EXISTS create_network_connection_trigger ON bookings;
CREATE TRIGGER create_network_connection_trigger
  AFTER UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION create_network_connection();

-- Add messaging permissions based on completed transactions
CREATE TABLE IF NOT EXISTS public.messaging_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_one_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_two_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  granted_by_booking_id UUID REFERENCES bookings(id),
  permission_type TEXT DEFAULT 'completed_service',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_one_id, user_two_id)
);

-- Enable RLS on messaging permissions
ALTER TABLE public.messaging_permissions ENABLE ROW LEVEL SECURITY;

-- RLS policies for messaging permissions
CREATE POLICY "Users can view their messaging permissions" 
ON public.messaging_permissions 
FOR SELECT 
USING (user_one_id = auth.uid() OR user_two_id = auth.uid());

-- Function to grant messaging permissions when review is created
CREATE OR REPLACE FUNCTION grant_messaging_permission()
RETURNS TRIGGER AS $$
DECLARE
  booking_customer_id UUID;
  booking_provider_id UUID;
BEGIN
  -- Get customer and provider from the booking
  SELECT customer_id, provider_id INTO booking_customer_id, booking_provider_id
  FROM bookings WHERE id = NEW.booking_id;
  
  -- Grant messaging permission between customer and provider
  IF booking_customer_id IS NOT NULL AND booking_provider_id IS NOT NULL THEN
    INSERT INTO public.messaging_permissions (user_one_id, user_two_id, granted_by_booking_id)
    VALUES (
      LEAST(booking_customer_id, booking_provider_id),
      GREATEST(booking_customer_id, booking_provider_id),
      NEW.booking_id
    )
    ON CONFLICT (user_one_id, user_two_id) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for messaging permission creation
DROP TRIGGER IF EXISTS grant_messaging_permission_trigger ON reviews;
CREATE TRIGGER grant_messaging_permission_trigger
  AFTER INSERT ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION grant_messaging_permission();
