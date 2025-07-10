-- Create admin function to give credits to specific user
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

  -- Add credits to ai_credits table
  INSERT INTO ai_credits (user_id, balance)
  VALUES (target_user_id, credit_amount)
  ON CONFLICT (user_id)
  DO UPDATE SET balance = ai_credits.balance + credit_amount;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;