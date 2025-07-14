-- Create equipped stamps table to track user's 3 favorite displayed stamps
CREATE TABLE public.user_equipped_stamps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stamp_id TEXT NOT NULL,
  position INTEGER NOT NULL CHECK (position >= 1 AND position <= 3),
  equipped_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Ensure unique position per user and unique stamp per user
  UNIQUE(user_id, position),
  UNIQUE(user_id, stamp_id)
);

-- Enable RLS
ALTER TABLE public.user_equipped_stamps ENABLE ROW LEVEL SECURITY;

-- Users can manage their own equipped stamps
CREATE POLICY "Users can manage their own equipped stamps" 
ON public.user_equipped_stamps 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Anyone can view equipped stamps (for public profiles)
CREATE POLICY "Anyone can view equipped stamps" 
ON public.user_equipped_stamps 
FOR SELECT 
USING (true);

-- Create function to get user's equipped stamps in order
CREATE OR REPLACE FUNCTION public.get_user_equipped_stamps(p_user_id UUID)
RETURNS TABLE(
  stamp_id TEXT,
  position INTEGER,
  equipped_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT ues.stamp_id, ues.position, ues.equipped_at
  FROM public.user_equipped_stamps ues
  WHERE ues.user_id = p_user_id
  ORDER BY ues.position;
$$;