
-- Fix RLS policies for emergency controls tables with proper IF EXISTS handling

-- Drop existing policies with IF EXISTS
DROP POLICY IF EXISTS "Admins can view emergency controls" ON public.emergency_controls;
DROP POLICY IF EXISTS "Admins can insert emergency controls" ON public.emergency_controls;
DROP POLICY IF EXISTS "Admins can update emergency controls" ON public.emergency_controls;
DROP POLICY IF EXISTS "System can manage emergency controls" ON public.emergency_controls;
DROP POLICY IF EXISTS "Admins can manage emergency controls" ON public.emergency_controls;

DROP POLICY IF EXISTS "Admins can view emergency actions log" ON public.emergency_actions_log;
DROP POLICY IF EXISTS "System can insert emergency actions log" ON public.emergency_actions_log;
DROP POLICY IF EXISTS "Admins can manage emergency actions log" ON public.emergency_actions_log;

DROP POLICY IF EXISTS "Admins can view emergency notifications" ON public.emergency_notifications;
DROP POLICY IF EXISTS "Admins can insert emergency notifications" ON public.emergency_notifications;
DROP POLICY IF EXISTS "Admins can update emergency notifications" ON public.emergency_notifications;
DROP POLICY IF EXISTS "System can manage emergency notifications" ON public.emergency_notifications;
DROP POLICY IF EXISTS "Admins can manage emergency notifications" ON public.emergency_notifications;

-- Emergency Controls Table - Admin access
CREATE POLICY "Admins can manage all emergency controls" ON public.emergency_controls
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND user_role = 'admin')
  );

CREATE POLICY "System can manage emergency controls" ON public.emergency_controls
  FOR ALL WITH CHECK (true);

-- Emergency Actions Log Table - Admin access + system inserts
CREATE POLICY "Admins can manage emergency actions log" ON public.emergency_actions_log
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND user_role = 'admin')
  );

CREATE POLICY "System can insert emergency actions log" ON public.emergency_actions_log
  FOR INSERT WITH CHECK (true);

-- Emergency Notifications Table - Admin access + system operations
CREATE POLICY "Admins can manage emergency notifications" ON public.emergency_notifications
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND user_role = 'admin')
  );

CREATE POLICY "System can manage emergency notifications" ON public.emergency_notifications
  FOR ALL WITH CHECK (true);
