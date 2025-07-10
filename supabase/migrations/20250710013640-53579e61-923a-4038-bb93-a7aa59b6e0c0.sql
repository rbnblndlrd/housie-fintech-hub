-- Fix Annette API controls - ensure emergency_controls record exists and add annette_api_enabled column
-- Add annette_api_enabled column to emergency_controls table
ALTER TABLE public.emergency_controls 
ADD COLUMN IF NOT EXISTS annette_api_enabled boolean DEFAULT true;

-- Ensure there's at least one emergency_controls record for the RPC function to work
INSERT INTO public.emergency_controls (
  claude_api_enabled, 
  annette_api_enabled,
  daily_spend_limit, 
  current_daily_spend,
  normal_operations
) 
SELECT true, true, 100.00, 0.00, true
WHERE NOT EXISTS (SELECT 1 FROM public.emergency_controls);

-- Update existing records to have annette_api_enabled = true by default
UPDATE public.emergency_controls 
SET annette_api_enabled = true 
WHERE annette_api_enabled IS NULL;

-- Update the is_annette_api_enabled function to use the new column
CREATE OR REPLACE FUNCTION public.is_annette_api_enabled()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
AS $function$
  SELECT COALESCE(
    (SELECT annette_api_enabled 
     FROM public.emergency_controls 
     ORDER BY created_at DESC 
     LIMIT 1), 
    true
  );
$function$