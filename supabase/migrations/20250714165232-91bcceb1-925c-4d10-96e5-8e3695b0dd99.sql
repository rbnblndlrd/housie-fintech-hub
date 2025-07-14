-- Canon Echo System Migration
-- Creates the enhanced Canon Echo broadcast system

-- Create Canon Echo table with comprehensive metadata
CREATE TABLE IF NOT EXISTS public.canon_echoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  source TEXT NOT NULL DEFAULT 'custom', -- "job", "stamp", "prestige", "map", "custom"
  message TEXT NOT NULL,
  canonical BOOLEAN NOT NULL DEFAULT false,
  location TEXT NOT NULL DEFAULT 'none', -- "profile", "city-board", "map", "none"
  visibility TEXT NOT NULL DEFAULT 'private', -- "public", "private", "network-only"
  tags TEXT[] DEFAULT '{}',
  
  -- Linked data references
  job_id UUID NULL,
  stamp_id TEXT NULL,
  prestige_title_id TEXT NULL,
  
  -- Canon metadata
  canon_confidence NUMERIC DEFAULT 0.5,
  verified_data BOOLEAN DEFAULT false,
  generated_by TEXT DEFAULT 'system',
  command TEXT NULL,
  
  -- Geographic data
  geographic_location POINT NULL,
  city TEXT DEFAULT 'Montreal',
  
  -- Engagement tracking
  engagement_count INTEGER DEFAULT 0,
  reactions_count INTEGER DEFAULT 0,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NULL
);

-- Create broadcast preferences table if not exists
CREATE TABLE IF NOT EXISTS public.user_broadcast_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  public_echo_participation BOOLEAN DEFAULT true,
  show_location BOOLEAN DEFAULT true,
  auto_broadcast_achievements BOOLEAN DEFAULT false,
  broadcast_radius_km INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on canon_echoes
ALTER TABLE public.canon_echoes ENABLE ROW LEVEL SECURITY;

-- Canon Echoes policies
CREATE POLICY "Users can create their own canon echoes" 
ON public.canon_echoes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own canon echoes" 
ON public.canon_echoes 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can view public canon echoes" 
ON public.canon_echoes 
FOR SELECT 
USING (
  visibility = 'public' OR 
  user_id = auth.uid() OR 
  (visibility = 'network-only' AND user_id IN (
    SELECT DISTINCT(CASE WHEN user_one_id = auth.uid() THEN user_two_id ELSE user_one_id END)
    FROM service_connections 
    WHERE (user_one_id = auth.uid() OR user_two_id = auth.uid()) 
    AND cred_connection_established = true
  ))
);

CREATE POLICY "Users can delete their own canon echoes" 
ON public.canon_echoes 
FOR DELETE 
USING (auth.uid() = user_id);

-- Enable RLS on broadcast preferences
ALTER TABLE public.user_broadcast_preferences ENABLE ROW LEVEL SECURITY;

-- Broadcast preferences policies
CREATE POLICY "Users can manage their own broadcast preferences" 
ON public.user_broadcast_preferences 
FOR ALL 
USING (auth.uid() = user_id);

-- Create canon echo reactions table
CREATE TABLE IF NOT EXISTS public.canon_echo_reactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  echo_id UUID NOT NULL REFERENCES public.canon_echoes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  reaction_type TEXT NOT NULL, -- 'clap', 'insight', 'canon_verified', 'question'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(echo_id, user_id, reaction_type)
);

-- Enable RLS on reactions
ALTER TABLE public.canon_echo_reactions ENABLE ROW LEVEL SECURITY;

-- Reactions policies
CREATE POLICY "Users can create reactions" 
ON public.canon_echo_reactions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view reactions on public echoes" 
ON public.canon_echo_reactions 
FOR SELECT 
USING (
  echo_id IN (
    SELECT id FROM public.canon_echoes 
    WHERE visibility = 'public' OR user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete their own reactions" 
ON public.canon_echo_reactions 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_canon_echoes_user_id ON public.canon_echoes(user_id);
CREATE INDEX IF NOT EXISTS idx_canon_echoes_location ON public.canon_echoes(location);
CREATE INDEX IF NOT EXISTS idx_canon_echoes_visibility ON public.canon_echoes(visibility);
CREATE INDEX IF NOT EXISTS idx_canon_echoes_canonical ON public.canon_echoes(canonical);
CREATE INDEX IF NOT EXISTS idx_canon_echoes_created_at ON public.canon_echoes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_canon_echoes_city ON public.canon_echoes(city);
CREATE INDEX IF NOT EXISTS idx_canon_echoes_tags ON public.canon_echoes USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_canon_echoes_geographic_location ON public.canon_echoes USING GIST(geographic_location);

-- Create function to update echo engagement count
CREATE OR REPLACE FUNCTION public.update_echo_engagement_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.canon_echoes 
    SET 
      engagement_count = engagement_count + 1,
      reactions_count = reactions_count + 1
    WHERE id = NEW.echo_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.canon_echoes 
    SET 
      engagement_count = GREATEST(0, engagement_count - 1),
      reactions_count = GREATEST(0, reactions_count - 1)
    WHERE id = OLD.echo_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for engagement count
CREATE TRIGGER update_canon_echo_engagement_count
  AFTER INSERT OR DELETE ON public.canon_echo_reactions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_echo_engagement_count();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_canon_echoes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_canon_echoes_updated_at
  BEFORE UPDATE ON public.canon_echoes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_canon_echoes_updated_at();

-- Create trigger for broadcast preferences updated_at
CREATE TRIGGER update_broadcast_preferences_updated_at
  BEFORE UPDATE ON public.user_broadcast_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_broadcast_preferences_updated_at();

-- Create function to automatically clean up old echoes
CREATE OR REPLACE FUNCTION public.cleanup_expired_canon_echoes()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.canon_echoes 
  WHERE expires_at IS NOT NULL AND expires_at < now();
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert default broadcast preferences for existing users
INSERT INTO public.user_broadcast_preferences (user_id, public_echo_participation, show_location, auto_broadcast_achievements)
SELECT 
  id,
  true,
  true,
  false
FROM users
WHERE id NOT IN (SELECT user_id FROM public.user_broadcast_preferences)
ON CONFLICT (user_id) DO NOTHING;