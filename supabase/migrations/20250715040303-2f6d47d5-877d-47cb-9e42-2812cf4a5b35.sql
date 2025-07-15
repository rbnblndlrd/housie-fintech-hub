-- Create replay_fragments table for Canon event replays
CREATE TABLE public.replay_fragments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.canon_events(id) ON DELETE CASCADE,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  type TEXT NOT NULL CHECK (type IN ('quote', 'photo', 'stat', 'location', 'reaction')),
  content TEXT,
  image_url TEXT,
  audio_url TEXT,
  step_order INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.replay_fragments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view replay fragments for visible events"
ON public.replay_fragments
FOR SELECT
USING (
  event_id IN (
    SELECT id FROM public.canon_events 
    WHERE user_id = auth.uid() 
    OR echo_scope = 'public'
    OR (echo_scope = 'city' AND user_id <> auth.uid())
    OR (echo_scope = 'friends' AND user_id IN (
      SELECT DISTINCT CASE 
        WHEN service_connections.user_one_id = auth.uid() THEN service_connections.user_two_id
        ELSE service_connections.user_one_id
      END
      FROM service_connections
      WHERE (service_connections.user_one_id = auth.uid() OR service_connections.user_two_id = auth.uid())
      AND service_connections.cred_connection_established = true
    ))
  )
);

CREATE POLICY "Users can create replay fragments for their own events"
ON public.replay_fragments
FOR INSERT
WITH CHECK (
  event_id IN (
    SELECT id FROM public.canon_events WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can update replay fragments for their own events"
ON public.replay_fragments
FOR UPDATE
USING (
  event_id IN (
    SELECT id FROM public.canon_events WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete replay fragments for their own events"
ON public.replay_fragments
FOR DELETE
USING (
  event_id IN (
    SELECT id FROM public.canon_events WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Admins can manage all replay fragments"
ON public.replay_fragments
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND user_role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND user_role = 'admin'
  )
);

-- Create trigger for updated_at
CREATE TRIGGER update_replay_fragments_updated_at
  BEFORE UPDATE ON public.replay_fragments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_replay_fragments_event_id ON public.replay_fragments(event_id);
CREATE INDEX idx_replay_fragments_step_order ON public.replay_fragments(event_id, step_order);