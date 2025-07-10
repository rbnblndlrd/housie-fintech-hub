-- Fix the admin_give_credits function 
CREATE OR REPLACE FUNCTION admin_give_credits(
  target_user_id uuid,
  credit_amount integer
) RETURNS void AS $$
BEGIN
  -- Add credits to user_credits table
  INSERT INTO user_credits (user_id, total_credits, used_credits, remaining_credits)
  VALUES (target_user_id, credit_amount, 0, credit_amount)
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    total_credits = user_credits.total_credits + credit_amount,
    remaining_credits = user_credits.remaining_credits + credit_amount,
    updated_at = now();

  -- Add credits to ai_credits table (without ON CONFLICT since there's no unique constraint)
  DELETE FROM ai_credits WHERE user_id = target_user_id;
  INSERT INTO ai_credits (user_id, balance)
  VALUES (target_user_id, (SELECT remaining_credits FROM user_credits WHERE user_id = target_user_id));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a simple free credits grant for testing
CREATE OR REPLACE FUNCTION grant_test_credits() 
RETURNS void AS $$
BEGIN
  -- Give 50 credits to user with this specific email for testing
  INSERT INTO user_credits (user_id, total_credits, used_credits, remaining_credits)
  SELECT id, 50, 0, 50 
  FROM users 
  WHERE email = '7utile@gmail.com'
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    total_credits = 50,
    remaining_credits = 50,
    used_credits = 0,
    updated_at = now();
END;
$$ LANGUAGE plpgsql;