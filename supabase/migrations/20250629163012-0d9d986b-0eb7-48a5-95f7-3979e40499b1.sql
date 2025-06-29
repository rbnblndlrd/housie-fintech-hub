
-- First, let's create the missing user profile for the user 7utile@gmail.com
-- We need to get the user_id from auth.users and create a corresponding profile

INSERT INTO user_profiles (
  user_id, 
  username, 
  full_name, 
  active_role, 
  can_provide_services, 
  can_book_services
)
SELECT 
  id,
  'lamarre',
  'Lamarre',
  'customer',
  false,
  true
FROM auth.users 
WHERE email = '7utile@gmail.com'
AND NOT EXISTS (
  SELECT 1 FROM user_profiles WHERE user_id = auth.users.id
);

-- Also create role preferences for this user
INSERT INTO user_role_preferences (
  user_id,
  primary_role
)
SELECT 
  id,
  'customer'
FROM auth.users 
WHERE email = '7utile@gmail.com'
AND NOT EXISTS (
  SELECT 1 FROM user_role_preferences WHERE user_id = auth.users.id
);
