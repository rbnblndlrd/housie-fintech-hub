
-- User credits and subscription tracking
CREATE TABLE IF NOT EXISTS public.user_credits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  total_credits integer DEFAULT 0,
  used_credits integer DEFAULT 0,
  remaining_credits integer GENERATED ALWAYS AS (total_credits - used_credits) STORED,
  last_purchase_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id)
);

-- Credit packages for purchase
CREATE TABLE IF NOT EXISTS public.credit_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price_cad numeric(10,2) NOT NULL,
  base_credits integer NOT NULL,
  bonus_credits integer DEFAULT 0,
  total_credits integer GENERATED ALWAYS AS (base_credits + bonus_credits) STORED,
  is_popular boolean DEFAULT false,
  description text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now()
);

-- Insert default credit packages
INSERT INTO public.credit_packages (name, price_cad, base_credits, bonus_credits, is_popular, description) VALUES
('Starter Pack', 5.00, 50, 0, false, 'Perfect for trying AI features'),
('Professional', 20.00, 250, 50, true, 'Best value for active providers'),
('Enterprise', 50.00, 700, 200, false, 'For high-volume service providers')
ON CONFLICT DO NOTHING;

-- Rate limiting tracking (daily reset)
CREATE TABLE IF NOT EXISTS public.user_rate_limits (
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  date date NOT NULL DEFAULT CURRENT_DATE,
  basic_messages_used integer DEFAULT 0,
  last_message_time timestamp with time zone,
  abuse_flags integer DEFAULT 0,
  status text DEFAULT 'normal' CHECK (status IN ('normal', 'warning', 'limited', 'blocked')),
  cooldown_until timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (user_id, date)
);

-- Credit usage tracking for profitability analysis
CREATE TABLE IF NOT EXISTS public.credit_usage_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  feature_used text NOT NULL CHECK (feature_used IN ('photo_analysis', 'route_optimization', 'advanced_scheduling', 'business_insights', 'basic_customer_support')),
  credits_spent integer NOT NULL,
  api_cost_estimate numeric(10,4) DEFAULT 0.0000,
  profit_margin numeric(5,2) GENERATED ALWAYS AS (
    CASE 
      WHEN api_cost_estimate > 0 THEN ((credits_spent * 0.10) - api_cost_estimate) / api_cost_estimate * 100
      ELSE 0
    END
  ) STORED,
  session_id uuid,
  created_at timestamp with time zone DEFAULT now()
);

-- Abuse monitoring and tracking
CREATE TABLE IF NOT EXISTS public.abuse_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  abuse_type text NOT NULL CHECK (abuse_type IN ('rapid_fire', 'repetitive', 'long_messages', 'daily_abuse', 'spam_detection')),
  action_taken text NOT NULL CHECK (action_taken IN ('warning', 'cooldown', 'block', 'credit_only_mode')),
  severity text DEFAULT 'low' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  metadata jsonb DEFAULT '{}',
  expires_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now()
);

-- AI feature costs configuration
CREATE TABLE IF NOT EXISTS public.ai_feature_costs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_name text NOT NULL UNIQUE,
  credit_cost integer NOT NULL,
  estimated_api_cost numeric(10,4) DEFAULT 0.0000,
  min_profit_margin numeric(5,2) DEFAULT 200.00,
  is_free_tier boolean DEFAULT false,
  daily_free_limit integer DEFAULT 0,
  description text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Insert default AI feature costs (200%+ profit margin)
INSERT INTO public.ai_feature_costs (feature_name, credit_cost, estimated_api_cost, is_free_tier, daily_free_limit, description) VALUES
('basic_customer_support', 0, 0.0050, true, 5, 'Basic Q&A and platform help'),
('photo_analysis', 5, 0.0500, false, 0, 'AI photo analysis and optimization'),
('route_optimization', 3, 0.1500, false, 0, 'Smart route planning and optimization'),
('advanced_scheduling', 2, 0.0300, false, 0, 'AI-powered scheduling suggestions'),
('business_insights', 2, 0.0250, false, 0, 'Business analytics and recommendations')
ON CONFLICT (feature_name) DO NOTHING;

-- Enable RLS on all new tables
ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.abuse_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_feature_costs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_credits
CREATE POLICY "Users can view own credits" ON public.user_credits
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own credits" ON public.user_credits
FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "System can manage credits" ON public.user_credits
FOR ALL USING (true);

-- RLS Policies for credit_packages (public read)
CREATE POLICY "Anyone can view active packages" ON public.credit_packages
FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage packages" ON public.credit_packages
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND user_role = 'admin'
  )
);

-- RLS Policies for rate limits
CREATE POLICY "Users can view own rate limits" ON public.user_rate_limits
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can manage rate limits" ON public.user_rate_limits
FOR ALL USING (true);

-- RLS Policies for credit usage logs
CREATE POLICY "Users can view own usage" ON public.credit_usage_logs
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all usage" ON public.credit_usage_logs
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND user_role = 'admin'
  )
);

CREATE POLICY "System can log usage" ON public.credit_usage_logs
FOR INSERT WITH CHECK (true);

-- RLS Policies for abuse logs
CREATE POLICY "Admins can view abuse logs" ON public.abuse_logs
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND user_role = 'admin'
  )
);

CREATE POLICY "System can log abuse" ON public.abuse_logs
FOR INSERT WITH CHECK (true);

-- RLS Policies for AI feature costs (public read for active features)
CREATE POLICY "Anyone can view active features" ON public.ai_feature_costs
FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage features" ON public.ai_feature_costs
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND user_role = 'admin'
  )
);

-- Functions for credit management
CREATE OR REPLACE FUNCTION public.get_user_credits(user_uuid uuid)
RETURNS TABLE(total_credits integer, used_credits integer, remaining_credits integer)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT 
    COALESCE(uc.total_credits, 0) as total_credits,
    COALESCE(uc.used_credits, 0) as used_credits,
    COALESCE(uc.remaining_credits, 0) as remaining_credits
  FROM public.user_credits uc
  WHERE uc.user_id = user_uuid
  UNION ALL
  SELECT 0, 0, 0
  WHERE NOT EXISTS (SELECT 1 FROM public.user_credits WHERE user_id = user_uuid)
  LIMIT 1;
$$;

-- Function to check and enforce rate limits
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  user_uuid uuid, 
  feature_name text,
  message_length integer DEFAULT 0
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_date_val date := CURRENT_DATE;
  rate_record record;
  feature_record record;
  user_has_credits boolean := false;
  daily_limit integer;
  time_diff interval;
  required_cooldown interval;
  result jsonb;
BEGIN
  -- Get feature configuration
  SELECT * INTO feature_record 
  FROM public.ai_feature_costs 
  WHERE ai_feature_costs.feature_name = check_rate_limit.feature_name 
  AND is_active = true;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('allowed', false, 'reason', 'Feature not found or inactive');
  END IF;
  
  -- Check if user has credits (for enhanced limits)
  SELECT remaining_credits > 0 INTO user_has_credits
  FROM public.user_credits 
  WHERE user_id = user_uuid;
  
  user_has_credits := COALESCE(user_has_credits, false);
  
  -- Get or create rate limit record
  INSERT INTO public.user_rate_limits (user_id, date) 
  VALUES (user_uuid, current_date_val)
  ON CONFLICT (user_id, date) DO NOTHING;
  
  SELECT * INTO rate_record
  FROM public.user_rate_limits
  WHERE user_id = user_uuid AND date = current_date_val;
  
  -- Check if user is blocked
  IF rate_record.status IN ('blocked', 'limited') THEN
    IF rate_record.cooldown_until IS NOT NULL AND rate_record.cooldown_until > now() THEN
      RETURN jsonb_build_object(
        'allowed', false, 
        'reason', 'User is in cooldown',
        'cooldown_until', rate_record.cooldown_until
      );
    END IF;
  END IF;
  
  -- Determine daily limit based on feature and user status
  IF feature_record.is_free_tier THEN
    daily_limit := feature_record.daily_free_limit;
    IF user_has_credits THEN
      daily_limit := daily_limit * 4; -- 4x limit for credit users
    END IF;
  ELSE
    daily_limit := 0; -- Paid features have no free daily limit
  END IF;
  
  -- Check daily message limit for free features
  IF feature_record.is_free_tier AND rate_record.basic_messages_used >= daily_limit THEN
    RETURN jsonb_build_object('allowed', false, 'reason', 'Daily limit exceeded');
  END IF;
  
  -- Check cooldown between messages
  IF rate_record.last_message_time IS NOT NULL THEN
    time_diff := now() - rate_record.last_message_time;
    required_cooldown := CASE 
      WHEN user_has_credits THEN interval '30 seconds'
      ELSE interval '60 seconds'
    END;
    
    IF time_diff < required_cooldown THEN
      RETURN jsonb_build_object(
        'allowed', false, 
        'reason', 'Cooldown period active',
        'retry_after', rate_record.last_message_time + required_cooldown
      );
    END IF;
  END IF;
  
  -- Check message length limits
  IF message_length > 0 THEN
    IF NOT user_has_credits AND message_length > 150 THEN
      RETURN jsonb_build_object('allowed', false, 'reason', 'Message too long for free tier');
    ELSIF user_has_credits AND message_length > 300 THEN
      RETURN jsonb_build_object('allowed', false, 'reason', 'Message exceeds maximum length');
    END IF;
  END IF;
  
  -- All checks passed
  RETURN jsonb_build_object('allowed', true, 'daily_used', rate_record.basic_messages_used, 'daily_limit', daily_limit);
END;
$$;

-- Function to consume credits and update usage
CREATE OR REPLACE FUNCTION public.consume_credits(
  user_uuid uuid,
  feature_name text,
  api_cost_estimate numeric DEFAULT 0.0000,
  session_uuid uuid DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  feature_record record;
  credits_available integer;
  result jsonb;
BEGIN
  -- Get feature cost
  SELECT * INTO feature_record 
  FROM public.ai_feature_costs 
  WHERE ai_feature_costs.feature_name = consume_credits.feature_name 
  AND is_active = true;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'reason', 'Feature not found');
  END IF;
  
  -- For free features, just log usage
  IF feature_record.is_free_tier AND feature_record.credit_cost = 0 THEN
    -- Update rate limit counter
    UPDATE public.user_rate_limits 
    SET 
      basic_messages_used = basic_messages_used + 1,
      last_message_time = now(),
      updated_at = now()
    WHERE user_id = user_uuid AND date = CURRENT_DATE;
    
    RETURN jsonb_build_object('success', true, 'credits_spent', 0, 'is_free', true);
  END IF;
  
  -- Check available credits
  SELECT COALESCE(remaining_credits, 0) INTO credits_available
  FROM public.user_credits 
  WHERE user_id = user_uuid;
  
  credits_available := COALESCE(credits_available, 0);
  
  IF credits_available < feature_record.credit_cost THEN
    RETURN jsonb_build_object('success', false, 'reason', 'Insufficient credits', 'required', feature_record.credit_cost, 'available', credits_available);
  END IF;
  
  -- Consume credits
  UPDATE public.user_credits 
  SET 
    used_credits = used_credits + feature_record.credit_cost,
    updated_at = now()
  WHERE user_id = user_uuid;
  
  -- Log usage for analytics
  INSERT INTO public.credit_usage_logs (user_id, feature_used, credits_spent, api_cost_estimate, session_id)
  VALUES (user_uuid, feature_name, feature_record.credit_cost, api_cost_estimate, session_uuid);
  
  -- Update rate limits
  UPDATE public.user_rate_limits 
  SET 
    last_message_time = now(),
    updated_at = now()
  WHERE user_id = user_uuid AND date = CURRENT_DATE;
  
  RETURN jsonb_build_object('success', true, 'credits_spent', feature_record.credit_cost, 'remaining', credits_available - feature_record.credit_cost);
END;
$$;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_credits_user_id ON public.user_credits(user_id);
CREATE INDEX IF NOT EXISTS idx_rate_limits_user_date ON public.user_rate_limits(user_id, date);
CREATE INDEX IF NOT EXISTS idx_rate_limits_status ON public.user_rate_limits(status) WHERE status != 'normal';
CREATE INDEX IF NOT EXISTS idx_credit_usage_user_date ON public.credit_usage_logs(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_credit_usage_feature ON public.credit_usage_logs(feature_used, created_at);
CREATE INDEX IF NOT EXISTS idx_abuse_logs_user ON public.abuse_logs(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_abuse_logs_type ON public.abuse_logs(abuse_type, created_at);
