
-- Fix messaging permissions trigger to skip test bookings and ensure proper test user creation
-- This prevents foreign key constraint violations for admin test operations

-- Update the grant_messaging_permission trigger to skip test bookings
CREATE OR REPLACE FUNCTION grant_messaging_permission()
RETURNS trigger AS $$
DECLARE
  booking_customer_id UUID;
  booking_provider_id UUID;
BEGIN
  -- Skip messaging permissions for test bookings (identified by NULL service_address)
  IF NEW.service_address IS NULL THEN
    RETURN NEW;
  END IF;
  
  -- Get customer and provider from the booking
  SELECT customer_id, provider_id INTO booking_customer_id, booking_provider_id
  FROM bookings WHERE id = NEW.booking_id;
  
  -- Grant messaging permission between customer and provider for real bookings only
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

-- Update admin_create_test_review to ensure test customer exists properly
CREATE OR REPLACE FUNCTION admin_create_test_review(
  p_provider_user_id uuid,
  p_rating integer,
  p_comment text DEFAULT 'Admin test review',
  p_add_commendations boolean DEFAULT false
) RETURNS uuid AS $$
DECLARE
  review_id uuid;
  customer_id uuid;
  provider_profile_id uuid;
  booking_id uuid;
  existing_service_id uuid;
BEGIN
  -- Get provider profile ID (explicit table reference)
  SELECT pp.id INTO provider_profile_id 
  FROM provider_profiles pp 
  WHERE pp.user_id = p_provider_user_id;
  
  IF provider_profile_id IS NULL THEN
    RAISE EXCEPTION 'Provider profile not found for user %', p_provider_user_id;
  END IF;
  
  -- Get an existing service ID instead of generating random UUID
  SELECT s.id INTO existing_service_id 
  FROM services s 
  WHERE s.active = true 
  LIMIT 1;
  
  IF existing_service_id IS NULL THEN
    RAISE EXCEPTION 'No active services found in database';
  END IF;
  
  -- Get or create a test customer with proper user setup
  SELECT u.id INTO customer_id 
  FROM users u 
  WHERE u.email = 'test@housie.com' 
  LIMIT 1;
  
  IF customer_id IS NULL THEN
    INSERT INTO users (email, full_name, created_at, updated_at) 
    VALUES ('test@housie.com', 'Test Customer', now(), now()) 
    RETURNING id INTO customer_id;
    
    -- Create user profile for the test customer
    INSERT INTO user_profiles (user_id, username, full_name, created_at, updated_at)
    VALUES (customer_id, 'test-customer', 'Test Customer', now(), now())
    ON CONFLICT (user_id) DO NOTHING;
    
    -- Create role preferences for the test customer
    INSERT INTO user_role_preferences (user_id, primary_role, created_at, updated_at)
    VALUES (customer_id, 'customer', now(), now())
    ON CONFLICT (user_id) DO NOTHING;
  END IF;
  
  -- Create a test booking with real service ID (NULL service_address marks it as test)
  INSERT INTO bookings (
    customer_id, 
    provider_id, 
    service_id, 
    scheduled_date, 
    scheduled_time, 
    status,
    total_amount,
    service_address,
    created_at,
    updated_at
  )
  VALUES (
    customer_id, 
    provider_profile_id, 
    existing_service_id,
    CURRENT_DATE, 
    '10:00', 
    'completed',
    50.00,
    NULL,  -- NULL service_address marks this as a test booking
    now(),
    now()
  )
  RETURNING id INTO booking_id;
  
  -- Create the review (explicit table references)
  INSERT INTO reviews (
    provider_id, 
    reviewer_id, 
    booking_id, 
    rating, 
    comment, 
    verified_transaction,
    created_at
  )
  VALUES (
    provider_profile_id, 
    customer_id, 
    booking_id, 
    p_rating, 
    p_comment, 
    true,
    now()
  )
  RETURNING id INTO review_id;
  
  -- Add commendations if requested
  IF p_add_commendations AND p_rating >= 4 THEN
    INSERT INTO review_commendations (review_id, commendation_type, created_at)
    VALUES 
      (review_id, 'quality', now()),
      (review_id, 'reliability', now());
  END IF;
  
  RETURN review_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
