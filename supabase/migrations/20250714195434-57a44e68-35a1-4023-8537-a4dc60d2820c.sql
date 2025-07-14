-- Add missing columns to user_stamps table for Phase 10
ALTER TABLE public.user_stamps 
ADD COLUMN IF NOT EXISTS canon_status text DEFAULT 'non-canon',
ADD COLUMN IF NOT EXISTS trigger_context jsonb DEFAULT '{}',
ADD COLUMN IF NOT EXISTS is_displayed boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS location point;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_user_stamps_canon_status ON public.user_stamps(canon_status);
CREATE INDEX IF NOT EXISTS idx_user_stamps_earned_at ON public.user_stamps(earned_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_stamps_user_earned ON public.user_stamps(user_id, earned_at DESC);