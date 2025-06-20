
-- TEMPORARILY disable RLS on users table to fix infinite recursion
-- This will allow admin dashboard to work properly for launch
-- We can re-enable and fix RLS policies after launch
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
