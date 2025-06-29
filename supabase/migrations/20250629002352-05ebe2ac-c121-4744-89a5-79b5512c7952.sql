
-- Fix admin test functions to properly create test users with all required dependencies
-- This addresses foreign key constraint violations in user_profiles and user_role_preferences

-- Update admin_create_test_review function to handle test user creation properly
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
  -- Get provider profile ID
  SELECT pp.id INTO provider_profile_id 
  FROM provider_profiles pp 
  WHERE pp.user_id = p_provider_user_id;
  
  IF provider_profile_id IS NULL THEN
    RAISE EXCEPTION 'Provider profile not found for user %', p_provider_user_id;
  END IF;
  
  -- Get an existing service ID
  SELECT s.id INTO existing_service_id 
  FROM services s 
  WHERE s.active = true 
  LIMIT 1;
  
  IF existing_service_id IS NULL THEN
    RAISE EXCEPTION 'No active services found in database';
  END IF;
  
  -- Get or create test customer with all required dependencies
  SELECT u.id INTO customer_id 
  FROM users u 
  WHERE u.email = 'test@housie.com' 
  LIMIT 1;
  
  IF customer_id IS NULL THEN
    -- Create test user
    INSERT INTO users (email, full_name, created_at, updated_at) 
    VALUES ('test@housie.com', 'Test Customer', now(), now()) 
    RETURNING id INTO customer_id;
    
    -- Create user profile (required for foreign key constraints)
    INSERT INTO user_profiles (user_id, username, full_name, created_at, updated_at)
    VALUES (customer_id, 'test-customer', 'Test Customer', now(), now());
    
    -- Create role preferences (required for foreign key constraints)
    INSERT INTO user_role_preferences (user_id, primary_role, created_at, updated_at)
    VALUES (customer_id, 'customer', now(), now());
  ELSE
    -- Ensure existing test user has all required dependencies
    INSERT INTO user_profiles (user_id, username, full_name, created_at, updated_at)
    VALUES (customer_id, 'test-customer', 'Test Customer', now(), now())
    ON CONFLICT (user_id) DO NOTHING;
    
    INSERT INTO user_role_preferences (user_id, primary_role, created_at, updated_at)
    VALUES (customer_id, 'customer', now(), now())
    ON CONFLICT (user_id) DO NOTHING;
  END IF;
  
  -- Create test booking
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
    NULL,  -- NULL marks this as a test booking
    now(),
    now()
  )
  RETURNING id INTO booking_id;
  
  -- Create the review
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

-- Update admin_add_commendation function to use the improved test user logic
CREATE OR REPLACE FUNCTION admin_add_commendation(
  p_provider_user_id uuid,
  p_commendation_type text
) RETURNS uuid AS $$
DECLARE
  commendation_id uuid;
  provider_profile_id uuid;
  test_review_id uuid;
BEGIN
  -- Get provider profile ID
  SELECT pp.id INTO provider_profile_id 
  FROM provider_profiles pp 
  WHERE pp.user_id = p_provider_user_id;
  
  IF provider_profile_id IS NULL THEN
    RAISE EXCEPTION 'Provider profile not found for user %', p_provider_user_id;
  END IF;
  
  -- Get or create a test review using the improved function
  SELECT r.id INTO test_review_id 
  FROM reviews r 
  WHERE r.provider_id = provider_profile_id 
  AND r.comment LIKE '%test%'
  LIMIT 1;
  
  IF test_review_id IS NULL THEN
    test_review_id := admin_create_test_review(p_provider_user_id, 5, 'Test review for commendation', false);
  END IF;
  
  -- Add commendation
  INSERT INTO review_commendations (review_id, commendation_type, created_at)
  VALUES (test_review_id, p_commendation_type, now())
  RETURNING id INTO commendation_id;
  
  RETURN commendation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
