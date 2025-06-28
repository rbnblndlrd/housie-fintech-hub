
-- Fix Testing Dashboard Database Issues Migration (Corrected)
-- This migration addresses: generated column issue, ambiguous column references, and RLS policy blocks

-- 1. Fix the remaining_credits generated column issue
-- We need to drop and recreate it as a regular column
ALTER TABLE user_credits DROP COLUMN remaining_credits;

-- Add it back as a regular column with proper default
ALTER TABLE user_credits 
ADD COLUMN remaining_credits integer DEFAULT 0;

-- Update existing rows to have proper remaining_credits values
UPDATE user_credits 
SET remaining_credits = COALESCE(total_credits - used_credits, 0);

-- 2. Add RLS policy to allow admin testing operations on bookings table
CREATE POLICY "Admin testing operations allowed" 
ON bookings
FOR INSERT 
TO authenticated
WITH CHECK (
  -- Allow if user is admin (based on email or role)
  auth.jwt() ->> 'email' IN ('7utile@gmail.com', 'gabeleven@gmail.com', 'admin@housie.ca')
  OR
  -- Or if it's a test booking (has specific test characteristics)
  service_address IS NULL
);

-- 3. Fix the admin_create_test_review function to avoid ambiguous column references
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
BEGIN
  -- Get provider profile ID (explicit table reference)
  SELECT pp.id INTO provider_profile_id 
  FROM provider_profiles pp 
  WHERE pp.user_id = p_provider_user_id;
  
  IF provider_profile_id IS NULL THEN
    RAISE EXCEPTION 'Provider profile not found for user %', p_provider_user_id;
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
  
  -- Create a test booking (explicit column references)
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
    gen_random_uuid(), 
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
$$ LANGUAGE plpgsql;

-- 4. Fix the admin_add_commendation function with explicit references
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
$$ LANGUAGE plpgsql;

-- 5. Update the award_community_rating_points function to handle remaining_credits properly
CREATE OR REPLACE FUNCTION award_community_rating_points(
  p_user_id uuid,
  p_points integer,
  p_reason text
) RETURNS void AS $$
BEGIN
  -- Update provider points (never go below 0)
  UPDATE provider_profiles 
  SET community_rating_points = GREATEST(
    0, 
    COALESCE(community_rating_points, 0) + p_points
  )
  WHERE user_id = p_user_id;
  
  -- Handle user_credits for customers (with proper remaining_credits calculation)
  INSERT INTO user_credits (user_id, total_credits, used_credits, remaining_credits) 
  VALUES (
    p_user_id, 
    GREATEST(0, p_points), 
    0,
    GREATEST(0, p_points)
  )
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    total_credits = GREATEST(0, user_credits.total_credits + p_points),
    remaining_credits = GREATEST(0, user_credits.total_credits + p_points - user_credits.used_credits),
    updated_at = now();
  
  -- Log the transaction
  INSERT INTO point_transactions (user_id, points_amount, reason, transaction_type, created_at)
  VALUES (
    p_user_id, 
    p_points, 
    p_reason, 
    CASE WHEN p_points >= 0 THEN 'earned' ELSE 'penalty' END,
    now()
  );
END;
$$ LANGUAGE plpgsql;

-- 6. Add helpful indexes for admin testing performance
CREATE INDEX IF NOT EXISTS idx_provider_profiles_user_id ON provider_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_provider_id ON reviews(provider_id);
CREATE INDEX IF NOT EXISTS idx_bookings_provider_customer ON bookings(provider_id, customer_id);
CREATE INDEX IF NOT EXISTS idx_user_credits_user_id ON user_credits(user_id);
