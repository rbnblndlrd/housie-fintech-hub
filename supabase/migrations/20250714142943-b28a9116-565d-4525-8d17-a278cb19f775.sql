-- Create CBS (Canonical Broadcast System) infrastructure

-- Create canonical_broadcast_events table for tracking Canon-verified events
CREATE TABLE public.canonical_broadcast_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  source_table TEXT NOT NULL,
  source_id UUID NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT false,
  broadcast_scope TEXT NOT NULL DEFAULT 'local' CHECK (broadcast_scope IN ('local', 'city', 'global')),
  visible_to_public BOOLEAN NOT NULL DEFAULT true,
  canon_confidence NUMERIC(3,2) DEFAULT 0.8 CHECK (canon_confidence >= 0 AND canon_confidence <= 1),
  metadata JSONB DEFAULT '{}',
  geographic_location POINT,
  city TEXT,
  processed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.canonical_broadcast_events ENABLE ROW LEVEL SECURITY;

-- Create policies for CBS access
CREATE POLICY "Users can view public broadcast events" 
ON public.canonical_broadcast_events 
FOR SELECT 
USING (visible_to_public = true OR user_id = auth.uid());

CREATE POLICY "System can insert broadcast events" 
ON public.canonical_broadcast_events 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update their own broadcast events" 
ON public.canonical_broadcast_events 
FOR UPDATE 
USING (user_id = auth.uid());

-- Create indexes for performance
CREATE INDEX idx_broadcast_events_user_id ON public.canonical_broadcast_events(user_id);
CREATE INDEX idx_broadcast_events_event_type ON public.canonical_broadcast_events(event_type);
CREATE INDEX idx_broadcast_events_verified ON public.canonical_broadcast_events(verified);
CREATE INDEX idx_broadcast_events_broadcast_scope ON public.canonical_broadcast_events(broadcast_scope);
CREATE INDEX idx_broadcast_events_created_at ON public.canonical_broadcast_events(created_at DESC);
CREATE INDEX idx_broadcast_events_city ON public.canonical_broadcast_events(city) WHERE city IS NOT NULL;

-- Create function to update updated_at column
CREATE TRIGGER update_canonical_broadcast_events_updated_at
BEFORE UPDATE ON public.canonical_broadcast_events
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to broadcast Canon events
CREATE OR REPLACE FUNCTION public.broadcast_canon_event(
  p_event_type TEXT,
  p_user_id UUID,
  p_source_table TEXT,
  p_source_id UUID,
  p_verified BOOLEAN DEFAULT true,
  p_broadcast_scope TEXT DEFAULT 'local',
  p_visible_to_public BOOLEAN DEFAULT true,
  p_canon_confidence NUMERIC DEFAULT 0.9,
  p_metadata JSONB DEFAULT '{}',
  p_city TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  broadcast_id UUID;
BEGIN
  INSERT INTO public.canonical_broadcast_events (
    event_type,
    user_id,
    source_table,
    source_id,
    verified,
    broadcast_scope,
    visible_to_public,
    canon_confidence,
    metadata,
    city
  ) VALUES (
    p_event_type,
    p_user_id,
    p_source_table,
    p_source_id,
    p_verified,
    p_broadcast_scope,
    p_visible_to_public,
    p_canon_confidence,
    p_metadata,
    p_city
  ) RETURNING id INTO broadcast_id;
  
  RETURN broadcast_id;
END;
$$;