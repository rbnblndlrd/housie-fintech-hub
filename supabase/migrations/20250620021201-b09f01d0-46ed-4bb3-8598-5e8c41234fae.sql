
-- Add user 7utile@gmail.com to admin_users table if not already present
INSERT INTO public.admin_users (user_id, email, created_by)
SELECT 
  u.id,
  '7utile@gmail.com',
  u.id
FROM public.users u 
WHERE u.email = '7utile@gmail.com'
AND NOT EXISTS (
  SELECT 1 FROM public.admin_users au 
  WHERE au.user_id = u.id
)
LIMIT 1;
