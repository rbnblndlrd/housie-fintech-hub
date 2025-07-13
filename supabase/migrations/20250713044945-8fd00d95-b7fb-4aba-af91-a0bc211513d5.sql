-- Fix RLS infinite recursion by creating security definer function and updating policies

-- Create a security definer function to safely get user role without RLS recursion
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT user_role FROM public.users WHERE id = auth.uid();
$$;

-- Drop problematic policies that cause infinite recursion
DROP POLICY IF EXISTS "Admin users can view all profiles" ON public.users;

-- Create new admin policy using the security definer function
CREATE POLICY "Admin users can view all profiles" ON public.users
FOR SELECT 
USING (
  public.get_current_user_role() = 'admin'
);

-- Ensure users can read their own data
CREATE POLICY "Users can read their own profile" ON public.users
FOR SELECT 
USING (auth.uid() = id);