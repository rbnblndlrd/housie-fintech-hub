
-- First, let's check current RLS policies on provider_profiles
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'provider_profiles';

-- Drop any conflicting ALL policies that might be blocking INSERTs
DROP POLICY IF EXISTS "Users can manage their own provider profiles" ON public.provider_profiles;
DROP POLICY IF EXISTS "Provider profiles policy" ON public.provider_profiles;

-- Create specific, clear RLS policies for provider_profiles
CREATE POLICY "Users can view their own provider profile" 
  ON public.provider_profiles 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own provider profile" 
  ON public.provider_profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own provider profile" 
  ON public.provider_profiles 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own provider profile" 
  ON public.provider_profiles 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create the missing provider profile for laurentlamarre@hotmail.ca
INSERT INTO provider_profiles (
  user_id, 
  business_name, 
  description, 
  years_experience, 
  hourly_rate, 
  service_radius_km,
  cra_compliant,
  verified,
  insurance_verified,
  created_at,
  updated_at
)
SELECT 
  u.id,
  'Test Provider Profile',
  'Admin test provider profile for testing purposes',
  5,
  50.00,
  25,
  true,
  true,
  true,
  now(),
  now()
FROM users u
WHERE u.email = 'laurentlamarre@hotmail.ca'
AND NOT EXISTS (
  SELECT 1 FROM provider_profiles pp WHERE pp.user_id = u.id
);

-- Verify the policies and profile creation
SELECT 
  u.email, 
  pp.business_name, 
  pp.verified, 
  pp.created_at,
  'Profile exists' as status
FROM users u
JOIN provider_profiles pp ON u.id = pp.user_id
WHERE u.email = 'laurentlamarre@hotmail.ca';
