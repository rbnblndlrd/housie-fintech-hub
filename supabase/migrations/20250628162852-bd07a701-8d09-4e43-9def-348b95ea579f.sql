
-- 1. Create point_transactions table for audit logging
CREATE TABLE IF NOT EXISTS point_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  points_amount integer NOT NULL,
  reason text NOT NULL,
  transaction_type text NOT NULL CHECK (transaction_type IN ('earned', 'penalty', 'bonus', 'adjustment')),
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on point_transactions
ALTER TABLE point_transactions ENABLE ROW LEVEL SECURITY;

-- RLS policy for point_transactions - users can view their own transactions
CREATE POLICY "Users can view their own point transactions" 
  ON point_transactions FOR SELECT 
  USING (auth.uid() = user_id);

-- 2. Create main community rating points function (replaces broken award_community_points)
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
  
  -- Also update user_credits for customers (they might not have provider_profiles)
  INSERT INTO user_credits (user_id, total_credits, remaining_credits) 
  VALUES (p_user_id, GREATEST(0, p_points), GREATEST(0, p_points))
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    total_credits = GREATEST(0, user_credits.total_credits + p_points),
    remaining_credits = GREATEST(0, user_credits.remaining_credits + p_points);
  
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

-- 3. Create network connections increment function
CREATE OR REPLACE FUNCTION increment_network_connections(
  p_provider_user_id uuid,
  p_customer_user_id uuid
) RETURNS void AS $$
DECLARE
  p_provider_id uuid;
BEGIN
  -- Get provider profile ID
  SELECT id INTO p_provider_id 
  FROM provider_profiles 
  WHERE user_id = p_provider_user_id;
  
  IF p_provider_id IS NOT NULL THEN
    -- Insert connection if it doesn't exist
    INSERT INTO network_connections (provider_id, customer_id, created_at)
    VALUES (p_provider_id, p_customer_user_id, now())
    ON CONFLICT (provider_id, customer_id) DO NOTHING;
    
    -- Update provider's network count
    UPDATE provider_profiles 
    SET network_connections = (
      SELECT COUNT(*) FROM network_connections 
      WHERE provider_id = p_provider_id
    )
    WHERE id = p_provider_id;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- 4. Complete review completion handler with tiered points, customer rewards, and elo hell
CREATE OR REPLACE FUNCTION handle_review_completion()
RETURNS trigger AS $$
DECLARE
  base_points integer;
  bonus_points integer := 0;
  streak_modifier integer := 0;
  total_points integer;
  recent_streak numeric;
  review_count integer;
  reason text;
  provider_user_id uuid;
BEGIN
  -- Get provider's user_id from provider_profiles
  SELECT user_id INTO provider_user_id 
  FROM provider_profiles 
  WHERE id = NEW.provider_id;
  
  IF provider_user_id IS NULL THEN
    RETURN NEW; -- Skip if provider not found
  END IF;

  -- Get provider's recent review stats (last 30 days for streak calculation)
  SELECT COUNT(*), COALESCE(AVG(rating), 0)
  INTO review_count, recent_streak
  FROM reviews 
  WHERE provider_id = NEW.provider_id 
  AND created_at > (NEW.created_at - INTERVAL '30 days');

  -- TIERED BASE POINTS from current review quality
  base_points := CASE 
    WHEN NEW.rating >= 4.5 THEN 3    -- 4.5-5 stars: +3 pts
    WHEN NEW.rating >= 3.5 THEN 2    -- 3.5-4.4 stars: +2 pts
    WHEN NEW.rating >= 2.5 THEN 1    -- 2.5-3.4 stars: +1 pt
    WHEN NEW.rating >= 1.5 THEN 0    -- 1.5-2.4 stars: 0 pts
    ELSE -1                          -- 1-1.4 stars: -1 pt
  END;
  
  -- EXCELLENCE BONUS for detailed 5-star reviews
  IF NEW.rating = 5 AND LENGTH(COALESCE(NEW.comment, '')) > 10 THEN
    bonus_points := 2;  -- Additional +2 for detailed excellence
  END IF;
  
  -- ELO HELL / EXCELLENCE MOMENTUM SYSTEM
  IF review_count >= 3 THEN
    IF recent_streak < 2.5 THEN
      streak_modifier := -2;  -- ELO HELL: Additional -2 penalty for bad streak
      reason := 'Review: ' || NEW.rating || '★ (elo hell penalty)';
    ELSIF recent_streak > 4.0 THEN
      streak_modifier := 1;   -- EXCELLENCE MOMENTUM: +1 bonus for great streak
      reason := 'Review: ' || NEW.rating || '★ (excellence bonus)';
    ELSE
      reason := 'Review: ' || NEW.rating || '★';
    END IF;
  ELSE
    reason := 'Review: ' || NEW.rating || '★';
  END IF;
  
  total_points := base_points + bonus_points + streak_modifier;
  
  -- AWARD POINTS TO PROVIDER (can be negative)
  PERFORM award_community_rating_points(
    provider_user_id,
    total_points,
    reason
  );
  
  -- AWARD POINTS TO CUSTOMER for leaving review (+1 always)
  PERFORM award_community_rating_points(
    NEW.reviewer_id,
    1,
    'Review submitted'
  );
  
  -- JOB COMPLETION BONUS for provider (+2 always, regardless of review quality)
  PERFORM award_community_rating_points(
    provider_user_id,
    2,
    'Job completed'
  );
  
  -- INCREMENT NETWORK CONNECTIONS (relationship building)
  PERFORM increment_network_connections(provider_user_id, NEW.reviewer_id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. Create trigger for automatic review processing
DROP TRIGGER IF EXISTS review_completion_trigger ON reviews;
CREATE TRIGGER review_completion_trigger
  AFTER INSERT ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION handle_review_completion();

-- 6. Commendation points handler
CREATE OR REPLACE FUNCTION award_commendation_points()
RETURNS trigger AS $$
DECLARE
  provider_user_id uuid;
BEGIN
  -- Get provider's user_id
  SELECT pp.user_id INTO provider_user_id
  FROM reviews r
  JOIN provider_profiles pp ON r.provider_id = pp.id
  WHERE r.id = NEW.review_id;
  
  IF provider_user_id IS NOT NULL THEN
    -- Award +1 point per commendation
    PERFORM award_community_rating_points(
      provider_user_id,
      1,
      'Commendation: ' || NEW.commendation_type
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. Create commendation trigger
DROP TRIGGER IF EXISTS commendation_points_trigger ON review_commendations;
CREATE TRIGGER commendation_points_trigger
  AFTER INSERT ON review_commendations
  FOR EACH ROW
  EXECUTE FUNCTION award_commendation_points();

-- 8. Ensure required columns exist
ALTER TABLE provider_profiles 
ADD COLUMN IF NOT EXISTS community_rating_points integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS network_connections integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_reviews integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS quality_commendations integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS reliability_commendations integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS courtesy_commendations integer DEFAULT 0;

-- 9. Drop old broken function
DROP FUNCTION IF EXISTS award_community_points(uuid, integer, text);

-- 10. Update existing provider stats triggers to work with new system
CREATE OR REPLACE FUNCTION update_provider_stats_on_review()
RETURNS trigger AS $$
BEGIN
  -- Update total_reviews count
  UPDATE provider_profiles 
  SET total_reviews = (
    SELECT COUNT(*) FROM reviews 
    WHERE provider_id = NEW.provider_id
  )
  WHERE id = NEW.provider_id;
  
  -- Update average_rating
  UPDATE provider_profiles 
  SET average_rating = (
    SELECT AVG(rating) FROM reviews 
    WHERE provider_id = NEW.provider_id
  )
  WHERE id = NEW.provider_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 11. Update commendation counts function to work with new system
CREATE OR REPLACE FUNCTION update_commendation_counts()
RETURNS trigger AS $$
BEGIN
  -- Update commendation counts for the provider
  UPDATE provider_profiles 
  SET 
    quality_commendations = (
      SELECT COUNT(*) FROM review_commendations rc
      JOIN reviews r ON rc.review_id = r.id
      WHERE r.provider_id = (
        SELECT provider_id FROM reviews WHERE id = NEW.review_id
      ) AND rc.commendation_type = 'quality'
    ),
    reliability_commendations = (
      SELECT COUNT(*) FROM review_commendations rc
      JOIN reviews r ON rc.review_id = r.id
      WHERE r.provider_id = (
        SELECT provider_id FROM reviews WHERE id = NEW.review_id
      ) AND rc.commendation_type = 'reliability'
    ),
    courtesy_commendations = (
      SELECT COUNT(*) FROM review_commendations rc
      JOIN reviews r ON rc.review_id = r.id
      WHERE r.provider_id = (
        SELECT provider_id FROM reviews WHERE id = NEW.review_id
      ) AND rc.commendation_type = 'courtesy'
    )
  WHERE id = (
    SELECT provider_id FROM reviews WHERE id = NEW.review_id
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
