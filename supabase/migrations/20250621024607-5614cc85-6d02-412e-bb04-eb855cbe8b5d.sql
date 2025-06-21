
-- Fix RLS policies for fraud detection tables to allow admin access and test data insertion

-- Update RLS policies for fraud_logs table
DROP POLICY IF EXISTS "Admins can view all fraud logs" ON public.fraud_logs;
DROP POLICY IF EXISTS "System can insert fraud logs" ON public.fraud_logs;

-- Create policies that allow admin users to manage fraud logs
CREATE POLICY "Admins can manage all fraud logs" ON public.fraud_logs
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND user_role = 'admin')
  );

CREATE POLICY "System can insert fraud logs" ON public.fraud_logs
  FOR INSERT WITH CHECK (true);

-- Update RLS policies for review_queue
DROP POLICY IF EXISTS "Admins can manage review queue" ON public.review_queue;

CREATE POLICY "Admins can manage review queue" ON public.review_queue
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND user_role = 'admin')
  );

-- Update RLS policies for user_blocks  
DROP POLICY IF EXISTS "Admins can manage all blocks" ON public.user_blocks;

CREATE POLICY "Admins can manage all blocks" ON public.user_blocks
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND user_role = 'admin')
  );

-- Update RLS policies for payment_attempts
DROP POLICY IF EXISTS "Admins can view all payment attempts" ON public.payment_attempts;

CREATE POLICY "Admins can manage all payment attempts" ON public.payment_attempts
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND user_role = 'admin')
  );

-- Update other fraud detection tracking tables
DROP POLICY IF EXISTS "Admins can view IP tracking" ON public.fraud_ip_tracking;
DROP POLICY IF EXISTS "System can manage IP tracking" ON public.fraud_ip_tracking;

CREATE POLICY "Admins can manage IP tracking" ON public.fraud_ip_tracking
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND user_role = 'admin')
  );

CREATE POLICY "System can insert IP tracking" ON public.fraud_ip_tracking
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view device tracking" ON public.fraud_device_tracking;
DROP POLICY IF EXISTS "System can manage device tracking" ON public.fraud_device_tracking;

CREATE POLICY "Admins can manage device tracking" ON public.fraud_device_tracking
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND user_role = 'admin')
  );

CREATE POLICY "System can insert device tracking" ON public.fraud_device_tracking
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view session logs" ON public.fraud_session_logs;
DROP POLICY IF EXISTS "System can manage session logs" ON public.fraud_session_logs;

CREATE POLICY "Admins can manage session logs" ON public.fraud_session_logs
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND user_role = 'admin')
  );

CREATE POLICY "System can insert session logs" ON public.fraud_session_logs
  FOR INSERT WITH CHECK (true);
