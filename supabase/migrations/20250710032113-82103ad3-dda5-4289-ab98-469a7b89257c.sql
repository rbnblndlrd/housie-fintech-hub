-- Fix ai_credit_logs action constraint to allow all valid action names
-- Drop the existing constraint if it exists
ALTER TABLE public.ai_credit_logs DROP CONSTRAINT IF EXISTS ai_credit_logs_action_check;

-- Add new constraint with all valid action names used by Annette
ALTER TABLE public.ai_credit_logs 
ADD CONSTRAINT ai_credit_logs_action_check 
CHECK (action IN (
  'optimize_cluster', 
  'optimize_opportunity', 
  'voice_command', 
  'profile_review',
  'basic_customer_support',
  'route_optimization',
  'business_insights', 
  'advanced_scheduling'
));