
-- Add RLS policy for admin point transactions
CREATE POLICY "Admin can insert point transactions" 
ON point_transactions 
FOR INSERT 
TO authenticated
WITH CHECK (
  auth.jwt() ->> 'email' IN ('7utile@gmail.com', 'gabeleven@gmail.com', 'admin@housie.ca')
);

-- Update award_community_rating_points function with SECURITY DEFINER and correct parameters
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
$$ LANGUAGE plpgsql SECURITY DEFINER;
