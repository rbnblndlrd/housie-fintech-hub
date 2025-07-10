-- Create new RPC function for Annette API status
CREATE OR REPLACE FUNCTION public.is_annette_api_enabled()
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
AS $function$
  SELECT COALESCE(
    (SELECT claude_api_enabled 
     FROM public.emergency_controls 
     ORDER BY created_at DESC 
     LIMIT 1), 
    true
  );
$function$