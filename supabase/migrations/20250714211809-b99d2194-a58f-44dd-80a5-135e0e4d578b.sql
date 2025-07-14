-- Create canon_user_preferences table for Canon Customization Tools
CREATE TABLE IF NOT EXISTS public.canon_user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Echo Visibility Controls
  echo_visibility TEXT NOT NULL DEFAULT 'local' CHECK (echo_visibility IN ('public', 'local', 'hidden')),
  location_sharing_enabled BOOLEAN NOT NULL DEFAULT true,
  
  -- Annette Style Settings
  voice_style TEXT NOT NULL DEFAULT 'default' CHECK (voice_style IN ('professional', 'warm', 'sassy', 'softspoken', 'default')),
  sassiness_intensity INTEGER NOT NULL DEFAULT 2 CHECK (sassiness_intensity >= 0 AND sassiness_intensity <= 3),
  
  -- Canon Badge Display
  show_canon_badge_on_profile BOOLEAN NOT NULL DEFAULT true,
  stamp_visibility TEXT NOT NULL DEFAULT 'all' CHECK (stamp_visibility IN ('all', 'canon_only', 'private')),
  
  -- Trust Feedback Loops
  manual_stamp_review_enabled BOOLEAN NOT NULL DEFAULT false,
  canon_event_history_visible BOOLEAN NOT NULL DEFAULT true,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.canon_user_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own canon preferences"
  ON public.canon_user_preferences
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own canon preferences"
  ON public.canon_user_preferences
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own canon preferences"
  ON public.canon_user_preferences
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_canon_user_preferences_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_canon_user_preferences_updated_at
  BEFORE UPDATE ON public.canon_user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_canon_user_preferences_updated_at();

-- Create function to get user canon preferences with defaults
CREATE OR REPLACE FUNCTION public.get_canon_preferences(p_user_id UUID)
RETURNS TABLE(
  echo_visibility TEXT,
  location_sharing_enabled BOOLEAN,
  voice_style TEXT,
  sassiness_intensity INTEGER,
  show_canon_badge_on_profile BOOLEAN,
  stamp_visibility TEXT,
  manual_stamp_review_enabled BOOLEAN,
  canon_event_history_visible BOOLEAN
) 
LANGUAGE SQL
STABLE SECURITY DEFINER
AS $$
  SELECT 
    COALESCE(cup.echo_visibility, 'local') as echo_visibility,
    COALESCE(cup.location_sharing_enabled, true) as location_sharing_enabled,
    COALESCE(cup.voice_style, 'default') as voice_style,
    COALESCE(cup.sassiness_intensity, 2) as sassiness_intensity,
    COALESCE(cup.show_canon_badge_on_profile, true) as show_canon_badge_on_profile,
    COALESCE(cup.stamp_visibility, 'all') as stamp_visibility,
    COALESCE(cup.manual_stamp_review_enabled, false) as manual_stamp_review_enabled,
    COALESCE(cup.canon_event_history_visible, true) as canon_event_history_visible
  FROM (SELECT p_user_id as user_id) u
  LEFT JOIN public.canon_user_preferences cup ON cup.user_id = u.user_id;
$$;