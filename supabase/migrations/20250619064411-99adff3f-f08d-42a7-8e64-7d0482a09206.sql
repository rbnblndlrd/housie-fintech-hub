
-- First, let's check if there are existing policies and drop them if needed
DROP POLICY IF EXISTS "Admins can manage emergency controls" ON public.emergency_controls;

-- Create a security definer function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_user_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND user_role = 'admin'
  );
$$;

-- Create comprehensive RLS policies for emergency controls
CREATE POLICY "Admins can view emergency controls" ON public.emergency_controls
FOR SELECT USING (public.is_user_admin());

CREATE POLICY "Admins can insert emergency controls" ON public.emergency_controls
FOR INSERT WITH CHECK (public.is_user_admin());

CREATE POLICY "Admins can update emergency controls" ON public.emergency_controls
FOR UPDATE USING (public.is_user_admin());

CREATE POLICY "Admins can delete emergency controls" ON public.emergency_controls
FOR DELETE USING (public.is_user_admin());

-- Allow system functions to access emergency controls (security definer functions)
CREATE POLICY "System functions can access emergency controls" ON public.emergency_controls
FOR ALL USING (current_setting('role') = 'supabase_admin');
