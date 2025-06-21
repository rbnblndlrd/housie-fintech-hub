
-- Create fraud_logs table to store all fraud check results
CREATE TABLE public.fraud_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL CHECK (action_type IN ('registration', 'booking', 'payment', 'messaging', 'login')),
  ip_address INET,
  user_agent TEXT,
  device_fingerprint TEXT,
  risk_score INTEGER NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
  action_taken TEXT NOT NULL CHECK (action_taken IN ('allow', 'review', 'block', 'require_verification')),
  risk_factors JSONB NOT NULL DEFAULT '{}',
  reasons TEXT[] NOT NULL DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create payment_attempts table to track payment patterns
CREATE TABLE public.payment_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'CAD',
  payment_method TEXT,
  stripe_payment_intent_id TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'succeeded', 'failed', 'cancelled', 'requires_action')),
  failure_reason TEXT,
  fraud_score INTEGER CHECK (fraud_score >= 0 AND fraud_score <= 100),
  ip_address INET,
  device_fingerprint TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_blocks table to manage blocked users
CREATE TABLE public.user_blocks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  blocked_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  block_type TEXT NOT NULL CHECK (block_type IN ('temporary', 'permanent', 'review_pending')),
  reason TEXT NOT NULL,
  fraud_session_id UUID,
  blocked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  unblocked_at TIMESTAMP WITH TIME ZONE,
  unblocked_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  metadata JSONB DEFAULT '{}'
);

-- Create review_queue table for manual review of risky transactions
CREATE TABLE public.review_queue (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  fraud_session_id UUID NOT NULL,
  action_type TEXT NOT NULL,
  risk_score INTEGER NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_review', 'approved', 'rejected', 'escalated')),
  assigned_to UUID REFERENCES public.users(id) ON DELETE SET NULL,
  reviewed_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  review_notes TEXT,
  evidence JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  assigned_at TIMESTAMP WITH TIME ZONE,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Create verification_required table to track additional verification needs
CREATE TABLE public.verification_required (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  verification_type TEXT NOT NULL CHECK (verification_type IN ('identity', 'payment_method', 'phone', 'email', 'address', 'business')),
  triggered_by_session UUID,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'failed', 'expired')),
  required_documents TEXT[],
  submitted_documents JSONB DEFAULT '{}',
  verification_data JSONB DEFAULT '{}',
  expires_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create supporting tables for fraud detection tracking
CREATE TABLE public.fraud_ip_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address INET NOT NULL,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  first_seen TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_seen TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  total_sessions INTEGER DEFAULT 1,
  risk_level TEXT DEFAULT 'low' CHECK (risk_level IN ('low', 'medium', 'high')),
  UNIQUE(ip_address, user_id)
);

CREATE TABLE public.fraud_device_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  device_fingerprint TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  user_agent TEXT,
  first_seen TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_seen TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  total_sessions INTEGER DEFAULT 1,
  risk_level TEXT DEFAULT 'low' CHECK (risk_level IN ('low', 'medium', 'high')),
  UNIQUE(device_fingerprint, user_id)
);

CREATE TABLE public.fraud_session_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  session_id UUID NOT NULL,
  ip_address INET,
  user_agent TEXT,
  action_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_fraud_logs_user_id ON public.fraud_logs(user_id);
CREATE INDEX idx_fraud_logs_session_id ON public.fraud_logs(session_id);
CREATE INDEX idx_fraud_logs_action_type ON public.fraud_logs(action_type);
CREATE INDEX idx_fraud_logs_risk_score ON public.fraud_logs(risk_score);
CREATE INDEX idx_fraud_logs_created_at ON public.fraud_logs(created_at);

CREATE INDEX idx_payment_attempts_user_id ON public.payment_attempts(user_id);
CREATE INDEX idx_payment_attempts_status ON public.payment_attempts(status);
CREATE INDEX idx_payment_attempts_created_at ON public.payment_attempts(created_at);
CREATE INDEX idx_payment_attempts_fraud_score ON public.payment_attempts(fraud_score);

CREATE INDEX idx_user_blocks_user_id ON public.user_blocks(user_id);
CREATE INDEX idx_user_blocks_is_active ON public.user_blocks(is_active);
CREATE INDEX idx_user_blocks_expires_at ON public.user_blocks(expires_at);

CREATE INDEX idx_review_queue_status ON public.review_queue(status);
CREATE INDEX idx_review_queue_priority ON public.review_queue(priority);
CREATE INDEX idx_review_queue_assigned_to ON public.review_queue(assigned_to);
CREATE INDEX idx_review_queue_created_at ON public.review_queue(created_at);

CREATE INDEX idx_verification_required_user_id ON public.verification_required(user_id);
CREATE INDEX idx_verification_required_status ON public.verification_required(status);
CREATE INDEX idx_verification_required_expires_at ON public.verification_required(expires_at);

CREATE INDEX idx_fraud_ip_tracking_ip ON public.fraud_ip_tracking(ip_address);
CREATE INDEX idx_fraud_device_tracking_fingerprint ON public.fraud_device_tracking(device_fingerprint);
CREATE INDEX idx_fraud_session_logs_user_id ON public.fraud_session_logs(user_id);
CREATE INDEX idx_fraud_session_logs_created_at ON public.fraud_session_logs(created_at);

-- Enable Row Level Security
ALTER TABLE public.fraud_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_required ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fraud_ip_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fraud_device_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fraud_session_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for fraud_logs (admin and system access)
CREATE POLICY "Admins can view all fraud logs" ON public.fraud_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND subscription_tier = 'admin')
  );

CREATE POLICY "System can insert fraud logs" ON public.fraud_logs
  FOR INSERT WITH CHECK (true);

-- RLS Policies for payment_attempts
CREATE POLICY "Users can view their payment attempts" ON public.payment_attempts
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all payment attempts" ON public.payment_attempts
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND subscription_tier = 'admin')
  );

CREATE POLICY "System can manage payment attempts" ON public.payment_attempts
  FOR ALL WITH CHECK (true);

-- RLS Policies for user_blocks
CREATE POLICY "Users can view their blocks" ON public.user_blocks
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all blocks" ON public.user_blocks
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND subscription_tier = 'admin')
  );

-- RLS Policies for review_queue
CREATE POLICY "Admins can manage review queue" ON public.review_queue
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND subscription_tier = 'admin')
  );

-- RLS Policies for verification_required
CREATE POLICY "Users can view their verification requirements" ON public.verification_required
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their verification" ON public.verification_required
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all verifications" ON public.verification_required
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND subscription_tier = 'admin')
  );

CREATE POLICY "System can insert verification requirements" ON public.verification_required
  FOR INSERT WITH CHECK (true);

-- RLS Policies for tracking tables (admin only)
CREATE POLICY "Admins can view IP tracking" ON public.fraud_ip_tracking
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND subscription_tier = 'admin')
  );

CREATE POLICY "System can manage IP tracking" ON public.fraud_ip_tracking
  FOR ALL WITH CHECK (true);

CREATE POLICY "Admins can view device tracking" ON public.fraud_device_tracking
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND subscription_tier = 'admin')
  );

CREATE POLICY "System can manage device tracking" ON public.fraud_device_tracking
  FOR ALL WITH CHECK (true);

CREATE POLICY "Admins can view session logs" ON public.fraud_session_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND subscription_tier = 'admin')
  );

CREATE POLICY "System can manage session logs" ON public.fraud_session_logs
  FOR ALL WITH CHECK (true);

-- Create trigger functions for automatic updates
CREATE OR REPLACE FUNCTION update_payment_attempts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_verification_required_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER payment_attempts_updated_at
  BEFORE UPDATE ON public.payment_attempts
  FOR EACH ROW EXECUTE FUNCTION update_payment_attempts_updated_at();

CREATE TRIGGER verification_required_updated_at
  BEFORE UPDATE ON public.verification_required
  FOR EACH ROW EXECUTE FUNCTION update_verification_required_updated_at();

-- Create function to check if user is blocked
CREATE OR REPLACE FUNCTION public.is_user_blocked(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_blocks 
    WHERE user_id = user_uuid 
    AND is_active = true 
    AND (expires_at IS NULL OR expires_at > now())
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get user risk level
CREATE OR REPLACE FUNCTION public.get_user_risk_level(user_uuid UUID)
RETURNS TEXT AS $$
DECLARE
  avg_risk_score NUMERIC;
BEGIN
  SELECT AVG(risk_score) INTO avg_risk_score
  FROM public.fraud_logs 
  WHERE user_id = user_uuid 
  AND created_at > now() - INTERVAL '30 days'
  LIMIT 10;
  
  IF avg_risk_score IS NULL THEN
    RETURN 'unknown';
  ELSIF avg_risk_score < 30 THEN
    RETURN 'low';
  ELSIF avg_risk_score < 60 THEN
    RETURN 'medium';
  ELSE
    RETURN 'high';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
