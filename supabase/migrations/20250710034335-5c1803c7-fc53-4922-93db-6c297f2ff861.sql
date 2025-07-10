-- Give user some initial credits to test Annette
INSERT INTO user_credits (user_id, total_credits, used_credits, remaining_credits)
VALUES (auth.uid(), 10, 0, 10)
ON CONFLICT (user_id) 
DO UPDATE SET 
  total_credits = GREATEST(user_credits.total_credits, 10),
  remaining_credits = user_credits.total_credits + 10 - user_credits.used_credits,
  updated_at = now();

-- Also give AI credits for the new system
INSERT INTO ai_credits (user_id, balance)
VALUES (auth.uid(), 10)
ON CONFLICT (user_id)
DO UPDATE SET balance = GREATEST(ai_credits.balance, 10);