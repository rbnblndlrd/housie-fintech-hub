-- Create user_broadcast_preferences table for canon identity settings
CREATE TABLE IF NOT EXISTS public.user_broadcast_preferences (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  public_echo_participation BOOLEAN NOT NULL DEFAULT true,
  show_location BOOLEAN NOT NULL DEFAULT true,
  canon_lock BOOLEAN NOT NULL DEFAULT false,
  annette_voice_style TEXT NOT NULL DEFAULT 'default' CHECK (annette_voice_style IN ('default', 'sassy', 'classic')),
  canon_badge_display BOOLEAN NOT NULL DEFAULT true,
  live_echo_participation BOOLEAN NOT NULL DEFAULT true,
  auto_broadcast_achievements BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id)
);

-- Enable RLS
ALTER TABLE public.user_broadcast_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own broadcast preferences"
ON public.user_broadcast_preferences
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_user_broadcast_preferences_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_broadcast_preferences_updated_at
BEFORE UPDATE ON public.user_broadcast_preferences
FOR EACH ROW
EXECUTE FUNCTION public.update_user_broadcast_preferences_updated_at();