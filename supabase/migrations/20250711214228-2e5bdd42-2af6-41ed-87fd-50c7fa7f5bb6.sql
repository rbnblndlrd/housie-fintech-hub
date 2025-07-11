-- Create storage buckets for booking photos and review photos
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('booking-photos', 'booking-photos', false),
  ('review-photos', 'review-photos', false)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for booking photos
CREATE POLICY "Users can upload their own booking photos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'booking-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view booking photos for their bookings" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'booking-photos' 
  AND (
    auth.uid()::text = (storage.foldername(name))[1] 
    OR EXISTS (
      SELECT 1 FROM bookings b 
      WHERE b.id::text = (storage.foldername(name))[1] 
      AND (b.customer_id = auth.uid() OR b.provider_id IN (
        SELECT id FROM provider_profiles WHERE user_id = auth.uid()
      ))
    )
  )
);

-- Create storage policies for review photos (public readable)
CREATE POLICY "Anyone can view review photos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'review-photos');

CREATE POLICY "Users can upload review photos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'review-photos');

-- Ensure review_photos table exists with proper structure
CREATE TABLE IF NOT EXISTS public.review_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  review_id UUID REFERENCES public.reviews(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  allow_portfolio_use BOOLEAN DEFAULT false,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on review_photos
ALTER TABLE public.review_photos ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for review_photos
CREATE POLICY "Anyone can view review photos" 
ON public.review_photos 
FOR SELECT 
USING (true);

CREATE POLICY "Users can upload photos for their reviews" 
ON public.review_photos 
FOR INSERT 
WITH CHECK (
  review_id IN (
    SELECT id FROM reviews WHERE reviewer_id = auth.uid()
  )
);

-- Create function to handle service connections after booking completion
CREATE OR REPLACE FUNCTION public.update_service_connections()
RETURNS TRIGGER AS $$
DECLARE
  customer_user_id uuid;
  provider_user_id uuid;
  ordered_user_one uuid;
  ordered_user_two uuid;
  connection_exists boolean;
  current_count integer;
  both_reviewed boolean;
BEGIN
  -- Only process completed bookings
  IF NEW.status != 'completed' OR OLD.status = 'completed' THEN
    RETURN NEW;
  END IF;

  -- Get customer and provider user IDs
  customer_user_id := NEW.customer_id;
  
  SELECT user_id INTO provider_user_id 
  FROM provider_profiles 
  WHERE id = NEW.provider_id;

  IF provider_user_id IS NULL THEN
    RETURN NEW;
  END IF;

  -- Order user IDs consistently
  IF customer_user_id < provider_user_id THEN
    ordered_user_one := customer_user_id;
    ordered_user_two := provider_user_id;
  ELSE
    ordered_user_one := provider_user_id;
    ordered_user_two := customer_user_id;
  END IF;

  -- Check if connection exists
  SELECT EXISTS(
    SELECT 1 FROM service_connections 
    WHERE user_one_id = ordered_user_one AND user_two_id = ordered_user_two
  ) INTO connection_exists;

  -- Check if both parties have reviewed
  SELECT COUNT(*) = 2 INTO both_reviewed
  FROM reviews 
  WHERE booking_id = NEW.id;

  IF connection_exists THEN
    -- Update existing connection
    UPDATE service_connections 
    SET 
      service_connection_count = service_connection_count + 1,
      last_booked_date = NEW.completed_at,
      can_message = CASE 
        WHEN both_reviewed THEN true 
        ELSE can_message 
      END,
      connection_tier = CASE 
        WHEN service_connection_count >= 2 THEN 'trusted'
        WHEN service_connection_count >= 4 THEN 'network'
        ELSE connection_tier 
      END,
      cred_connection_established = CASE 
        WHEN both_reviewed AND service_connection_count >= 1 THEN true
        ELSE cred_connection_established 
      END,
      updated_at = now()
    WHERE user_one_id = ordered_user_one AND user_two_id = ordered_user_two;
  ELSE
    -- Create new connection
    INSERT INTO service_connections (
      user_one_id, 
      user_two_id, 
      service_connection_count, 
      last_booked_date,
      can_message,
      cred_connection_established
    ) VALUES (
      ordered_user_one, 
      ordered_user_two, 
      1, 
      NEW.completed_at,
      both_reviewed,
      both_reviewed
    );
  END IF;

  -- Create rebooking suggestion for future
  INSERT INTO rebooking_suggestions (
    user_id,
    provider_user_id,
    service_type,
    last_booking_date,
    suggested_date
  ) VALUES (
    customer_user_id,
    provider_user_id,
    COALESCE(
      (SELECT category FROM services WHERE id = NEW.service_id),
      'general'
    ),
    NEW.completed_at,
    NEW.completed_at + INTERVAL '2 weeks' -- Default suggestion interval
  )
  ON CONFLICT DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for service connections
DROP TRIGGER IF EXISTS update_service_connections_trigger ON bookings;
CREATE TRIGGER update_service_connections_trigger
  AFTER UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_service_connections();