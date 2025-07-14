-- Create user_clip_preferences table for storing favorited commands
CREATE TABLE public.user_clip_preferences (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  clip_id text NOT NULL,
  order_index integer NOT NULL DEFAULT 0,
  is_favorited boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  
  -- Ensure unique clip per user
  UNIQUE(user_id, clip_id)
);

-- Enable RLS
ALTER TABLE public.user_clip_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their own clip preferences"
ON public.user_clip_preferences
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Index for performance
CREATE INDEX idx_user_clip_preferences_user_id ON public.user_clip_preferences(user_id);
CREATE INDEX idx_user_clip_preferences_favorited ON public.user_clip_preferences(user_id, is_favorited, order_index);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION public.update_user_clip_preferences_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_clip_preferences_updated_at
  BEFORE UPDATE ON public.user_clip_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_clip_preferences_updated_at();