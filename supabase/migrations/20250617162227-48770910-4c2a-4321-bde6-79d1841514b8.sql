
-- Fix RLS policies to allow authenticated users to insert test data
-- Add policy for users table to allow inserts by authenticated users
CREATE POLICY "Allow authenticated users to insert test data" ON public.users
  FOR INSERT TO authenticated 
  WITH CHECK (true);

-- Add policy for provider_profiles to allow inserts by authenticated users  
CREATE POLICY "Allow authenticated users to insert provider profiles" ON public.provider_profiles
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Add policy for services to allow inserts by authenticated users
CREATE POLICY "Allow authenticated users to insert services" ON public.services  
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Also add select policies if they don't exist
CREATE POLICY "Allow authenticated users to view all users" ON public.users
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to view all provider profiles" ON public.provider_profiles
  FOR SELECT TO authenticated  
  USING (true);
