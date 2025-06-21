
-- Clean migration focusing on what we actually need
INSERT INTO public.users (
    id, email, full_name, user_role, subscription_tier, created_at, updated_at
) VALUES (
    '00000000-0000-4000-8000-000000000001',
    'system@housie.ca', 'Desktop Admin System',
    'admin', 'premium', now(), now()
) ON CONFLICT (id) DO NOTHING;

-- Add missing columns for Claude API control
ALTER TABLE public.emergency_controls 
ADD COLUMN IF NOT EXISTS claude_api_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS claude_access_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS last_backup_triggered TIMESTAMP WITH TIME ZONE;

-- Add performance index
CREATE INDEX IF NOT EXISTS idx_emergency_controls_updated_at 
ON public.emergency_controls(updated_at DESC);
