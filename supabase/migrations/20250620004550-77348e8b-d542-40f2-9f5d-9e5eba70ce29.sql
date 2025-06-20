
-- Update the subscription_tier constraint to include 'admin'
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_subscription_tier_check;
ALTER TABLE public.users ADD CONSTRAINT users_subscription_tier_check 
  CHECK (subscription_tier IN ('free', 'starter', 'pro', 'premium', 'admin'));

-- Set the current user as admin (you can change this email to the appropriate admin user)
UPDATE public.users 
SET subscription_tier = 'admin' 
WHERE email = '7utile@gmail.com';

-- Drop existing conflicting RLS policies on users table
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Admin users can view all profiles" ON public.users;
DROP POLICY IF EXISTS "Admin users can update subscription tiers" ON public.users;

-- Create new RLS policies that allow admin users to manage subscription tiers
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Allow admin users to view all users
CREATE POLICY "Admin users can view all profiles" ON public.users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND subscription_tier = 'admin'
    )
  );

-- Allow admin users to update subscription tiers for any user
CREATE POLICY "Admin users can update subscription tiers" ON public.users
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND subscription_tier = 'admin'
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND subscription_tier = 'admin'
    )
  );

-- Update the is_user_admin function to use subscription_tier
CREATE OR REPLACE FUNCTION public.is_user_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND subscription_tier = 'admin'
  );
$$;
