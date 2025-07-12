-- Create photo checklist fallbacks table for audit trail
CREATE TABLE IF NOT EXISTS photo_checklist_fallbacks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE,
  checklist_item_id text NOT NULL,
  submitted_by uuid REFERENCES users(id) ON DELETE SET NULL,
  reason text NOT NULL,
  fallback_photo_url text NOT NULL,
  client_approved boolean DEFAULT false,
  admin_override boolean DEFAULT false,
  approved_by uuid REFERENCES users(id) ON DELETE SET NULL,
  approved_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on fallbacks table
ALTER TABLE photo_checklist_fallbacks ENABLE ROW LEVEL SECURITY;

-- Policy for users to view fallbacks for their bookings
CREATE POLICY "Users can view fallbacks for their bookings" 
ON photo_checklist_fallbacks 
FOR SELECT 
USING (
  booking_id IN (
    SELECT id FROM bookings 
    WHERE customer_id = auth.uid() 
    OR provider_id IN (
      SELECT id FROM provider_profiles WHERE user_id = auth.uid()
    )
  )
);

-- Policy for providers to create fallbacks
CREATE POLICY "Providers can create fallbacks for their bookings" 
ON photo_checklist_fallbacks 
FOR INSERT 
WITH CHECK (
  submitted_by = auth.uid() 
  AND booking_id IN (
    SELECT id FROM bookings 
    WHERE provider_id IN (
      SELECT id FROM provider_profiles WHERE user_id = auth.uid()
    )
  )
);

-- Policy for customers to update approval status
CREATE POLICY "Customers can approve fallbacks for their bookings" 
ON photo_checklist_fallbacks 
FOR UPDATE 
USING (
  booking_id IN (
    SELECT id FROM bookings WHERE customer_id = auth.uid()
  )
);

-- Policy for admins to override
CREATE POLICY "Admins can override fallbacks" 
ON photo_checklist_fallbacks 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() AND user_role = 'admin'
  )
);

-- Create admin settings table for fallback configuration
CREATE TABLE IF NOT EXISTS admin_fallback_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enable_checklist_fallback_flow boolean DEFAULT false,
  allow_retroactive_photo_unlocks boolean DEFAULT false,
  auto_remind_client_before_service boolean DEFAULT true,
  fallback_approval_timeout_hours integer DEFAULT 24,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Insert default settings
INSERT INTO admin_fallback_settings (
  enable_checklist_fallback_flow,
  allow_retroactive_photo_unlocks,
  auto_remind_client_before_service
) VALUES (false, false, true)
ON CONFLICT DO NOTHING;

-- Enable RLS on admin settings
ALTER TABLE admin_fallback_settings ENABLE ROW LEVEL SECURITY;

-- Policy for admins to manage settings
CREATE POLICY "Admins can manage fallback settings" 
ON admin_fallback_settings 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() AND user_role = 'admin'
  )
);

-- Policy for system to read settings
CREATE POLICY "System can read fallback settings" 
ON admin_fallback_settings 
FOR SELECT 
USING (true);

-- Function to check if fallback flow is enabled
CREATE OR REPLACE FUNCTION public.is_fallback_flow_enabled()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT COALESCE(
    (SELECT enable_checklist_fallback_flow 
     FROM admin_fallback_settings 
     ORDER BY created_at DESC 
     LIMIT 1), 
    false
  );
$$;

-- Function to approve fallback
CREATE OR REPLACE FUNCTION public.approve_checklist_fallback(
  fallback_id uuid,
  is_approved boolean
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  booking_owner uuid;
  current_user_id uuid := auth.uid();
BEGIN
  -- Check if user is customer for this booking
  SELECT customer_id INTO booking_owner
  FROM bookings b
  JOIN photo_checklist_fallbacks f ON b.id = f.booking_id
  WHERE f.id = fallback_id;
  
  IF booking_owner != current_user_id THEN
    RETURN false;
  END IF;
  
  -- Update the fallback
  UPDATE photo_checklist_fallbacks 
  SET 
    client_approved = is_approved,
    approved_by = current_user_id,
    approved_at = now(),
    updated_at = now()
  WHERE id = fallback_id;
  
  RETURN true;
END;
$$;

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_fallback_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_photo_checklist_fallbacks_updated_at
  BEFORE UPDATE ON photo_checklist_fallbacks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_fallback_updated_at();