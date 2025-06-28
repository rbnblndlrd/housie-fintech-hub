
-- Fix admin test functions to use real service IDs instead of random UUIDs
-- This fixes the foreign key constraint violations for Test Reviews and Commendations

-- Update admin_create_test_review function to use existing service IDs
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
  
  -- Get or create a test customer
  SELECT u.id INTO customer_id 
  FROM users u 
  WHERE u.email = 'test@housie.com' 
  LIMIT 1;
  
  IF customer_id IS NULL THEN
    INSERT INTO users (email, full_name) 
    VALUES ('test@housie.com', 'Test Customer') 
    RETURNING id INTO customer_id;
  END IF;
  
  -- Create a test booking with real service ID
  INSERT INTO bookings (
    customer_id, 
    provider_id, 
    service_id, 
    scheduled_date, 
    scheduled_time, 
    status,
    total_amount,
    service_address
  )
  VALUES (
    customer_id, 
    provider_profile_id, 
    existing_service_id,  -- Use real service ID
    CURRENT_DATE, 
    '10:00', 
    'completed',
    50.00,
    NULL  -- NULL service_address marks this as a test booking
  )
  RETURNING id INTO booking_id;
  
  -- Create the review (explicit table references)
  INSERT INTO reviews (
    provider_id, 
    reviewer_id, 
    booking_id, 
    rating, 
    comment, 
    verified_transaction
  )
  VALUES (
    provider_profile_id, 
    customer_id, 
    booking_id, 
    p_rating, 
    p_comment, 
    true
  )
  RETURNING id INTO review_id;
  
  -- Add commendations if requested
  IF p_add_commendations AND p_rating >= 4 THEN
    INSERT INTO review_commendations (review_id, commendation_type)
    VALUES 
      (review_id, 'quality'),
      (review_id, 'reliability');
  END IF;
  
  RETURN review_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update admin_add_commendation function to use existing service IDs
CREATE OR REPLACE FUNCTION admin_add_commendation(
  p_provider_user_id uuid,
  p_commendation_type text
) RETURNS uuid AS $$
DECLARE
  commendation_id uuid;
  provider_profile_id uuid;
  test_review_id uuid;
BEGIN
  -- Get provider profile ID with explicit table reference
  SELECT pp.id INTO provider_profile_id 
  FROM provider_profiles pp 
  WHERE pp.user_id = p_provider_user_id;
  
  -- Get or create a test review with explicit table references
  SELECT r.id INTO test_review_id 
  FROM reviews r 
  WHERE r.provider_id = provider_profile_id 
  LIMIT 1;
  
  IF test_review_id IS NULL THEN
    test_review_id := admin_create_test_review(p_provider_user_id, 5, 'Test review for commendation', false);
  END IF;
  
  -- Add commendation
  INSERT INTO review_commendations (review_id, commendation_type)
  VALUES (test_review_id, p_commendation_type)
  RETURNING id INTO commendation_id;
  
  RETURN commendation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
