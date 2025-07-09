-- Drop existing function first
DROP FUNCTION IF EXISTS public.get_user_credits(uuid);

-- Create AI credits table to track user credit balances
CREATE TABLE public.ai_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  balance INTEGER NOT NULL DEFAULT 10,
  last_granted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create AI credit logs table to track usage
CREATE TABLE public.ai_credit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('optimize_cluster', 'optimize_opportunity', 'voice_command', 'profile_review')),
  credits_used INTEGER NOT NULL DEFAULT 1,
  result TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.ai_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_credit_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies for ai_credits
CREATE POLICY "Users can view their own AI credits" ON public.ai_credits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own AI credits" ON public.ai_credits
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can manage AI credits" ON public.ai_credits
  FOR ALL USING (true);

-- RLS policies for ai_credit_logs  
CREATE POLICY "Users can view their own AI credit logs" ON public.ai_credit_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert AI credit logs" ON public.ai_credit_logs
  FOR INSERT WITH CHECK (true);

-- Function to get user AI credits
CREATE OR REPLACE FUNCTION public.get_user_ai_credits(user_uuid UUID)
RETURNS INTEGER
LANGUAGE SQL
STABLE SECURITY DEFINER
AS $$
  SELECT COALESCE(balance, 0) 
  FROM public.ai_credits 
  WHERE user_id = user_uuid;
$$;

-- Function to deduct AI credits
CREATE OR REPLACE FUNCTION public.deduct_ai_credits(
  user_uuid UUID, 
  amount INTEGER, 
  action_name TEXT,
  result_text TEXT DEFAULT NULL,
  metadata_json JSONB DEFAULT '{}'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_balance INTEGER;
  new_balance INTEGER;
BEGIN
  -- Get current balance
  SELECT COALESCE(balance, 0) INTO current_balance
  FROM public.ai_credits 
  WHERE user_id = user_uuid;
  
  -- If no credits record exists, create one with default balance
  IF current_balance IS NULL THEN
    INSERT INTO public.ai_credits (user_id, balance)
    VALUES (user_uuid, 10)
    ON CONFLICT (user_id) DO NOTHING;
    current_balance := 10;
  END IF;
  
  -- Check if sufficient credits
  IF current_balance < amount THEN
    RETURN jsonb_build_object(
      'success', false,
      'reason', 'insufficient_credits',
      'current_balance', current_balance,
      'required', amount
    );
  END IF;
  
  -- Deduct credits
  new_balance := current_balance - amount;
  
  UPDATE public.ai_credits 
  SET balance = new_balance, updated_at = now()
  WHERE user_id = user_uuid;
  
  -- Log the usage
  INSERT INTO public.ai_credit_logs (user_id, action, credits_used, result, metadata)
  VALUES (user_uuid, action_name, amount, result_text, metadata_json);
  
  RETURN jsonb_build_object(
    'success', true,
    'new_balance', new_balance,
    'credits_used', amount
  );
END;
$$;

-- Trigger to update updated_at column
CREATE OR REPLACE FUNCTION public.update_ai_credits_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_ai_credits_updated_at
  BEFORE UPDATE ON public.ai_credits
  FOR EACH ROW
  EXECUTE FUNCTION public.update_ai_credits_updated_at();