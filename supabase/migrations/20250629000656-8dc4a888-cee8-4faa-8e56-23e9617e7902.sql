
-- Remove admin rights from laurentlamarre@hotmail.ca
UPDATE public.users 
SET user_role = NULL, updated_at = now()
WHERE email = 'laurentlamarre@hotmail.ca';

-- Verify the update worked
SELECT email, user_role, updated_at 
FROM public.users 
WHERE email = 'laurentlamarre@hotmail.ca';
