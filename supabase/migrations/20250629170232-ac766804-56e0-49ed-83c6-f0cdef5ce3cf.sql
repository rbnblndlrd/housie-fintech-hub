
-- Fix role switching data inconsistency for user 7utile@gmail.com
-- The issue is that user_profiles.active_role is 'provider' but user_role_preferences.primary_role is 'customer'
-- We'll synchronize both to match the current active role in user_profiles

-- First, let's update the user_role_preferences to match the active_role in user_profiles
UPDATE user_role_preferences 
SET primary_role = (
    SELECT active_role 
    FROM user_profiles 
    WHERE user_profiles.user_id = user_role_preferences.user_id
)
WHERE user_id = (
    SELECT id FROM auth.users WHERE email = '7utile@gmail.com'
)
AND EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE user_profiles.user_id = user_role_preferences.user_id 
    AND user_profiles.active_role IS NOT NULL
);

-- Also ensure the user has provider capabilities enabled in user_profiles
UPDATE user_profiles 
SET can_provide_services = true
WHERE user_id = (
    SELECT id FROM auth.users WHERE email = '7utile@gmail.com'
)
AND active_role = 'provider';

-- Verify the fix by checking both tables are now consistent
-- This query should return matching roles for the user
SELECT 
    up.active_role as profile_active_role,
    urp.primary_role as preferences_primary_role,
    up.can_provide_services,
    up.can_book_services
FROM user_profiles up
JOIN user_role_preferences urp ON up.user_id = urp.user_id
WHERE up.user_id = (
    SELECT id FROM auth.users WHERE email = '7utile@gmail.com'
);
