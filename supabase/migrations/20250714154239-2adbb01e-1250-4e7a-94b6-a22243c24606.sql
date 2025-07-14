-- Create broadcast events table for Canonical Broadcast System
CREATE TABLE public.broadcast_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  event_type TEXT NOT NULL, -- 'title_earned', 'stamp', 'booking_streak', 'achievement', etc.
  content TEXT NOT NULL,
  canon_level TEXT NOT NULL DEFAULT 'canon', -- 'canon' or 'non_canon'
  scope TEXT NOT NULL DEFAULT 'local', -- 'local', 'city', 'global'
  location_lat NUMERIC,
  location_lng NUMERIC,
  city TEXT,
  neighborhood TEXT,
  metadata JSONB DEFAULT '{}',
  is_public BOOLEAN NOT NULL DEFAULT false,
  engagement_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create broadcast reactions table for user engagement
CREATE TABLE public.broadcast_reactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  broadcast_id UUID NOT NULL REFERENCES public.broadcast_events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  reaction_type TEXT NOT NULL, -- 'clap', 'comment', 'insight', etc.
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(broadcast_id, user_id, reaction_type)
);

-- Create user broadcast preferences table
CREATE TABLE public.user_broadcast_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  public_echo_participation BOOLEAN NOT NULL DEFAULT true,
  show_location BOOLEAN NOT NULL DEFAULT true,
  auto_broadcast_achievements BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.broadcast_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.broadcast_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_broadcast_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for broadcast_events
CREATE POLICY "Users can view public broadcast events"
ON public.broadcast_events
FOR SELECT
USING (is_public = true OR user_id = auth.uid());

CREATE POLICY "Users can create their own broadcast events"
ON public.broadcast_events
FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own broadcast events"
ON public.broadcast_events
FOR UPDATE
USING (user_id = auth.uid());

-- RLS Policies for broadcast_reactions
CREATE POLICY "Users can view reactions on public broadcasts"
ON public.broadcast_reactions
FOR SELECT
USING (broadcast_id IN (
  SELECT id FROM public.broadcast_events WHERE is_public = true
));

CREATE POLICY "Users can create reactions"
ON public.broadcast_reactions
FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own reactions"
ON public.broadcast_reactions
FOR UPDATE
USING (user_id = auth.uid());

-- RLS Policies for user_broadcast_preferences
CREATE POLICY "Users can manage their own broadcast preferences"
ON public.user_broadcast_preferences
FOR ALL
USING (user_id = auth.uid());

-- Create indexes for performance
CREATE INDEX idx_broadcast_events_public_scope ON public.broadcast_events(is_public, scope) WHERE is_public = true;
CREATE INDEX idx_broadcast_events_location ON public.broadcast_events(location_lat, location_lng) WHERE is_public = true;
CREATE INDEX idx_broadcast_events_city ON public.broadcast_events(city) WHERE is_public = true;
CREATE INDEX idx_broadcast_reactions_broadcast ON public.broadcast_reactions(broadcast_id);

-- Create function to update engagement count
CREATE OR REPLACE FUNCTION update_broadcast_engagement_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.broadcast_events 
    SET engagement_count = engagement_count + 1 
    WHERE id = NEW.broadcast_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.broadcast_events 
    SET engagement_count = GREATEST(0, engagement_count - 1) 
    WHERE id = OLD.broadcast_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for engagement count
CREATE TRIGGER update_engagement_count_trigger
AFTER INSERT OR DELETE ON public.broadcast_reactions
FOR EACH ROW EXECUTE FUNCTION update_broadcast_engagement_count();

-- Create function to auto-update timestamps
CREATE OR REPLACE FUNCTION update_broadcast_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_broadcast_events_updated_at
BEFORE UPDATE ON public.broadcast_events
FOR EACH ROW EXECUTE FUNCTION update_broadcast_updated_at();

CREATE TRIGGER update_broadcast_preferences_updated_at
BEFORE UPDATE ON public.user_broadcast_preferences
FOR EACH ROW EXECUTE FUNCTION update_broadcast_updated_at();