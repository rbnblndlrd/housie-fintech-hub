
-- First, update any existing admin subscription_tier to premium before applying constraint
UPDATE public.users 
SET subscription_tier = 'premium' 
WHERE subscription_tier = 'admin';

-- Now safely remove and recreate the constraint
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_subscription_tier_check;
ALTER TABLE public.users ADD CONSTRAINT users_subscription_tier_check 
  CHECK (subscription_tier IN ('free', 'starter', 'pro', 'premium'));

-- Set admin status in auth metadata for the current admin user
UPDATE auth.users 
SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || '{"is_admin": true}'::jsonb
WHERE email = '7utile@gmail.com';
