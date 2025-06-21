
-- First, let's check and update the existing emergency_controls table structure
-- Add missing columns to the existing emergency_controls table

-- Platform Controls (some may already exist)
ALTER TABLE public.emergency_controls 
ADD COLUMN IF NOT EXISTS bookings_paused boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS maintenance_mode boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS new_registrations_disabled boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS force_logout_users boolean DEFAULT false;

-- Security Controls
ALTER TABLE public.emergency_controls 
ADD COLUMN IF NOT EXISTS fraud_lockdown_active boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS manual_review_all_bookings boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS geographic_blocking_enabled boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS payment_restrictions_active boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS blocked_countries text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS allowed_payment_methods text[] DEFAULT '{"card", "bank_transfer"}';

-- Communication Controls
ALTER TABLE public.emergency_controls 
ADD COLUMN IF NOT EXISTS messaging_disabled boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS emergency_notification_active boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS provider_broadcast_active boolean DEFAULT false;

-- System Status
ALTER TABLE public.emergency_controls 
ADD COLUMN IF NOT EXISTS normal_operations boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS last_backup_triggered timestamp with time zone;

-- Metadata
ALTER TABLE public.emergency_controls 
ADD COLUMN IF NOT EXISTS activated_by uuid REFERENCES public.users(id),
ADD COLUMN IF NOT EXISTS activated_at timestamp with time zone DEFAULT now(),
ADD COLUMN IF NOT EXISTS deactivated_by uuid REFERENCES public.users(id),
ADD COLUMN IF NOT EXISTS deactivated_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS reason text;

-- Create emergency actions log table
CREATE TABLE IF NOT EXISTS public.emergency_actions_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES public.users(id) NOT NULL,
  action_type text NOT NULL,
  action_details jsonb DEFAULT '{}',
  previous_state jsonb DEFAULT '{}',
  new_state jsonb DEFAULT '{}',
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone DEFAULT now()
);

-- Create emergency notifications table
CREATE TABLE IF NOT EXISTS public.emergency_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES public.users(id) NOT NULL,
  notification_type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  target_audience text NOT NULL,
  priority text DEFAULT 'high',
  sent_at timestamp with time zone,
  recipients_count integer DEFAULT 0,
  status text DEFAULT 'pending',
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.emergency_actions_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_notifications ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies for emergency controls to ensure they're correct
DROP POLICY IF EXISTS "Admins can manage emergency controls" ON public.emergency_controls;
CREATE POLICY "Admins can manage emergency controls" ON public.emergency_controls
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND user_role = 'admin')
  );

-- Create RLS policies for new tables
CREATE POLICY "Admins can manage emergency actions log" ON public.emergency_actions_log
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND user_role = 'admin')
  );

CREATE POLICY "Admins can manage emergency notifications" ON public.emergency_notifications
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND user_role = 'admin')
  );

-- Update existing record or insert if none exists
INSERT INTO public.emergency_controls (normal_operations) 
VALUES (true)
ON CONFLICT (id) DO UPDATE SET normal_operations = true
WHERE emergency_controls.id = (
  SELECT id FROM public.emergency_controls ORDER BY created_at DESC LIMIT 1
);

-- If no records exist, just insert one
INSERT INTO public.emergency_controls (normal_operations) 
SELECT true 
WHERE NOT EXISTS (SELECT 1 FROM public.emergency_controls);

-- Create function to check if emergency controls are active
CREATE OR REPLACE FUNCTION public.get_emergency_status()
RETURNS jsonb
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT row_to_json(ec)::jsonb
  FROM public.emergency_controls ec
  ORDER BY created_at DESC
  LIMIT 1;
$$;

-- Create function to log emergency actions
CREATE OR REPLACE FUNCTION public.log_emergency_action(
  p_admin_id uuid,
  p_action_type text,
  p_action_details jsonb DEFAULT '{}',
  p_previous_state jsonb DEFAULT '{}',
  p_new_state jsonb DEFAULT '{}',
  p_ip_address inet DEFAULT NULL,
  p_user_agent text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  action_id uuid;
BEGIN
  INSERT INTO public.emergency_actions_log (
    admin_id,
    action_type,
    action_details,
    previous_state,
    new_state,
    ip_address,
    user_agent
  ) VALUES (
    p_admin_id,
    p_action_type,
    p_action_details,
    p_previous_state,
    p_new_state,
    p_ip_address,
    p_user_agent
  ) RETURNING id INTO action_id;
  
  RETURN action_id;
END;
$$;
