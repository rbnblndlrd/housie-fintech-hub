
-- Fix emergency_controls table structure with all required columns

-- Add missing columns to emergency_controls table
ALTER TABLE public.emergency_controls 
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- Create trigger to automatically update the updated_at column
CREATE OR REPLACE FUNCTION public.update_emergency_controls_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists and create new one
DROP TRIGGER IF EXISTS update_emergency_controls_updated_at_trigger ON public.emergency_controls;
CREATE TRIGGER update_emergency_controls_updated_at_trigger
  BEFORE UPDATE ON public.emergency_controls
  FOR EACH ROW
  EXECUTE FUNCTION public.update_emergency_controls_updated_at();

-- Ensure all existing records have updated_at populated
UPDATE public.emergency_controls 
SET updated_at = COALESCE(updated_at, created_at, now())
WHERE updated_at IS NULL;

-- Make updated_at NOT NULL after populating existing records
ALTER TABLE public.emergency_controls 
ALTER COLUMN updated_at SET NOT NULL;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_emergency_controls_created_at ON public.emergency_controls(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_emergency_controls_updated_at ON public.emergency_controls(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_emergency_controls_normal_operations ON public.emergency_controls(normal_operations);

-- Ensure RLS is enabled
ALTER TABLE public.emergency_controls ENABLE ROW LEVEL SECURITY;

-- Create or replace the emergency status check function
CREATE OR REPLACE FUNCTION public.get_latest_emergency_controls()
RETURNS public.emergency_controls
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT * FROM public.emergency_controls
  ORDER BY updated_at DESC, created_at DESC
  LIMIT 1;
$$;
