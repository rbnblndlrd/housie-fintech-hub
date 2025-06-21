
-- First, let's see what the current check constraint allows
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'public.users'::regclass 
AND contype = 'c' 
AND conname LIKE '%user_role%';

-- Drop the existing check constraint and create a new one that includes 'admin'
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_user_role_check;

-- Create a new check constraint that includes 'admin'
ALTER TABLE public.users ADD CONSTRAINT users_user_role_check 
CHECK (user_role IN ('seeker', 'provider', 'admin'));

-- Now update the user roles to 'admin'
UPDATE public.users 
SET user_role = 'admin', updated_at = now()
WHERE email IN (
  'admin@housie.ca',
  'gabeleven@gmail.com', 
  'laurentlamarre1@gmail.com',
  '7utile@gmail.com'
);

-- Verify the updates worked
SELECT email, user_role, updated_at 
FROM public.users 
WHERE email IN (
  'admin@housie.ca',
  'gabeleven@gmail.com', 
  'laurentlamarre1@gmail.com',
  '7utile@gmail.com'
);
