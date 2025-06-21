
-- Update the is_user_admin function to check user_role instead of subscription_tier
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
