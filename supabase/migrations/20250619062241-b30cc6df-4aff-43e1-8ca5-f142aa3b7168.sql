
-- Create emergency controls table to manage API access and spending limits
CREATE TABLE IF NOT EXISTS public.emergency_controls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  claude_api_enabled boolean DEFAULT true,
  daily_spend_limit numeric DEFAULT 100.00,
  current_daily_spend numeric DEFAULT 0.00,
  spend_reset_date date DEFAULT CURRENT_DATE,
  disabled_reason text,
  disabled_at timestamp with time zone,
  disabled_by_user_id uuid,
  last_updated_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now()
);

-- Insert default emergency control settings
INSERT INTO public.emergency_controls (claude_api_enabled, daily_spend_limit, current_daily_spend)
VALUES (true, 100.00, 0.00)
ON CONFLICT DO NOTHING;

-- Create API usage tracking table for spend monitoring
CREATE TABLE IF NOT EXISTS public.api_usage_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  session_id uuid,
  tokens_used integer DEFAULT 0,
  estimated_cost numeric DEFAULT 0.00,
  request_type text DEFAULT 'claude-chat',
  status text DEFAULT 'success',
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.emergency_controls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_usage_logs ENABLE ROW LEVEL SECURITY;

-- Create policies - only admins can view/modify emergency controls
CREATE POLICY "Admins can manage emergency controls" ON public.emergency_controls
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND user_role = 'admin'
  )
);

-- Users can view their own API usage logs, admins can view all
CREATE POLICY "Users can view own API logs" ON public.api_usage_logs
FOR SELECT USING (
  user_id = auth.uid() OR 
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND user_role = 'admin'
  )
);

-- Only system can insert API usage logs
CREATE POLICY "System can log API usage" ON public.api_usage_logs
FOR INSERT WITH CHECK (true);

-- Create function to check if Claude API is enabled
CREATE OR REPLACE FUNCTION public.is_claude_api_enabled()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT COALESCE(
    (SELECT claude_api_enabled 
     FROM public.emergency_controls 
     ORDER BY created_at DESC 
     LIMIT 1), 
    true
  );
$$;

-- Create function to get current daily spend
CREATE OR REPLACE FUNCTION public.get_current_daily_spend()
RETURNS numeric
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT COALESCE(
    (SELECT current_daily_spend 
     FROM public.emergency_controls 
     ORDER BY created_at DESC 
     LIMIT 1), 
    0.00
  );
$$;

-- Create function to update daily spend and check limits
CREATE OR REPLACE FUNCTION public.update_daily_spend(spend_amount numeric)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_limit numeric;
  new_total numeric;
  reset_date date;
  today_date date := CURRENT_DATE;
BEGIN
  -- Get current settings
  SELECT daily_spend_limit, current_daily_spend, spend_reset_date
  INTO current_limit, new_total, reset_date
  FROM public.emergency_controls
  ORDER BY created_at DESC
  LIMIT 1;
  
  -- Reset daily spend if it's a new day
  IF reset_date < today_date THEN
    new_total := 0.00;
  END IF;
  
  -- Add new spend
  new_total := new_total + spend_amount;
  
  -- Update the record
  UPDATE public.emergency_controls
  SET 
    current_daily_spend = new_total,
    spend_reset_date = today_date,
    claude_api_enabled = CASE 
      WHEN new_total >= current_limit THEN false 
      ELSE claude_api_enabled 
    END,
    disabled_reason = CASE 
      WHEN new_total >= current_limit AND claude_api_enabled THEN 'Daily spend limit exceeded'
      ELSE disabled_reason
    END,
    disabled_at = CASE 
      WHEN new_total >= current_limit AND claude_api_enabled THEN now()
      ELSE disabled_at
    END,
    last_updated_at = now()
  WHERE id = (
    SELECT id FROM public.emergency_controls 
    ORDER BY created_at DESC 
    LIMIT 1
  );
  
  -- Return whether API is still enabled
  RETURN new_total < current_limit;
END;
$$;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_api_usage_logs_user_date ON public.api_usage_logs(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_api_usage_logs_date ON public.api_usage_logs(created_at);
