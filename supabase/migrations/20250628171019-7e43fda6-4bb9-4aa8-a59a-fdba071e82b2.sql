
-- Add shop_points column to provider_profiles
ALTER TABLE provider_profiles 
ADD COLUMN IF NOT EXISTS shop_points integer DEFAULT 0;

-- Function to calculate shop points using tiered conversion
CREATE OR REPLACE FUNCTION calculate_shop_points(community_points integer)
RETURNS integer AS $$
BEGIN
  RETURN CASE
    WHEN community_points < 10 THEN FLOOR(community_points * 0.5)
    WHEN community_points < 50 THEN FLOOR(community_points * 0.75)
    WHEN community_points < 100 THEN FLOOR(community_points * 1.0)
    WHEN community_points < 500 THEN FLOOR(community_points * 1.25)
    ELSE FLOOR(community_points * 1.5)
  END;
END;
$$ LANGUAGE plpgsql;

-- Function to update shop points for a user
CREATE OR REPLACE FUNCTION update_shop_points(p_user_id uuid)
RETURNS void AS $$
DECLARE
  community_points integer;
  calculated_shop_points integer;
BEGIN
  -- Get current community rating points
  SELECT COALESCE(community_rating_points, 0) INTO community_points
  FROM provider_profiles 
  WHERE user_id = p_user_id;
  
  -- Calculate shop points using tiered system
  calculated_shop_points := calculate_shop_points(community_points);
  
  -- Update shop points
  UPDATE provider_profiles 
  SET shop_points = calculated_shop_points
  WHERE user_id = p_user_id;
  
  -- Also update for customers (using user_credits)
  SELECT COALESCE(total_credits, 0) INTO community_points
  FROM user_credits 
  WHERE user_id = p_user_id;
  
  IF community_points > 0 THEN
    calculated_shop_points := calculate_shop_points(community_points);
    
    INSERT INTO user_credits (user_id, total_credits, remaining_credits, shop_points)
    VALUES (p_user_id, community_points, community_points, calculated_shop_points)
    ON CONFLICT (user_id) 
    DO UPDATE SET shop_points = calculated_shop_points;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Add shop_points column to user_credits for customers
ALTER TABLE user_credits 
ADD COLUMN IF NOT EXISTS shop_points integer DEFAULT 0;

-- Trigger to auto-update shop points when community points change
CREATE OR REPLACE FUNCTION auto_update_shop_points()
RETURNS trigger AS $$
BEGIN
  PERFORM update_shop_points(NEW.user_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for provider_profiles
DROP TRIGGER IF EXISTS shop_points_update_trigger ON provider_profiles;
CREATE TRIGGER shop_points_update_trigger
  AFTER UPDATE OF community_rating_points ON provider_profiles
  FOR EACH ROW
  EXECUTE FUNCTION auto_update_shop_points();

-- Create trigger for user_credits
DROP TRIGGER IF EXISTS shop_points_update_trigger_credits ON user_credits;
CREATE TRIGGER shop_points_update_trigger_credits
  AFTER UPDATE OF total_credits ON user_credits
  FOR EACH ROW
  EXECUTE FUNCTION auto_update_shop_points();

-- Admin function to create test reviews
CREATE OR REPLACE FUNCTION admin_create_test_review(
  p_provider_user_id uuid,
  p_rating integer,
  p_comment text DEFAULT 'Admin test review',
  p_add_commendations boolean DEFAULT false
) RETURNS uuid AS $$
DECLARE
  review_id uuid;
  customer_id uuid;
  provider_id uuid;
  booking_id uuid;
BEGIN
  -- Get provider profile ID
  SELECT id INTO provider_id FROM provider_profiles WHERE user_id = p_provider_user_id;
  
  IF provider_id IS NULL THEN
    RAISE EXCEPTION 'Provider profile not found for user %', p_provider_user_id;
  END IF;
  
  -- Get or create a test customer
  SELECT id INTO customer_id FROM users WHERE email = 'test@housie.com' LIMIT 1;
  
  IF customer_id IS NULL THEN
    INSERT INTO users (email, full_name) 
    VALUES ('test@housie.com', 'Test Customer') 
    RETURNING id INTO customer_id;
  END IF;
  
  -- Create a test booking
  INSERT INTO bookings (customer_id, provider_id, service_id, scheduled_date, scheduled_time, status)
  VALUES (customer_id, provider_id, gen_random_uuid(), CURRENT_DATE, '10:00', 'completed')
  RETURNING id INTO booking_id;
  
  -- Create the review
  INSERT INTO reviews (provider_id, reviewer_id, booking_id, rating, comment, verified_transaction)
  VALUES (provider_id, customer_id, booking_id, p_rating, p_comment, true)
  RETURNING id INTO review_id;
  
  -- Add random commendations if requested
  IF p_add_commendations AND p_rating >= 4 THEN
    INSERT INTO review_commendations (review_id, commendation_type)
    VALUES 
      (review_id, 'quality'),
      (review_id, 'reliability');
  END IF;
  
  RETURN review_id;
END;
$$ LANGUAGE plpgsql;

-- Function to add test commendations
CREATE OR REPLACE FUNCTION admin_add_commendation(
  p_provider_user_id uuid,
  p_commendation_type text
) RETURNS uuid AS $$
DECLARE
  commendation_id uuid;
  provider_id uuid;
  test_review_id uuid;
BEGIN
  -- Get provider profile ID
  SELECT id INTO provider_id FROM provider_profiles WHERE user_id = p_provider_user_id;
  
  -- Get or create a test review
  SELECT id INTO test_review_id FROM reviews WHERE provider_id = provider_id LIMIT 1;
  
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

-- Update all existing shop points
UPDATE provider_profiles 
SET shop_points = calculate_shop_points(COALESCE(community_rating_points, 0))
WHERE community_rating_points IS NOT NULL;

UPDATE user_credits 
SET shop_points = calculate_shop_points(COALESCE(total_credits, 0))
WHERE total_credits IS NOT NULL;
