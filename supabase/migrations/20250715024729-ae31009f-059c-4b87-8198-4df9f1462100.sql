-- Create stamp_definitions table
CREATE TABLE public.stamp_definitions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  icon_url text,
  rarity text NOT NULL DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'legendary')),
  emotion_flavor text,
  is_enabled boolean NOT NULL DEFAULT true,
  description text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create canon_events table
CREATE TABLE public.canon_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  related_user_ids uuid[],
  event_type text NOT NULL CHECK (event_type IN ('prestige_milestone', 'cluster_built', 'crew_saved_the_day', 'broadcast_custom', 'opportunity_formed', 'rare_unlock', 'review_commendation')),
  title text NOT NULL,
  description text,
  timestamp timestamp with time zone NOT NULL DEFAULT now(),
  canon_rank text NOT NULL DEFAULT 'local' CHECK (canon_rank IN ('local', 'regional', 'global', 'legendary')),
  echo_scope text NOT NULL DEFAULT 'public' CHECK (echo_scope IN ('private', 'friends', 'city', 'public')),
  origin_dashboard text,
  event_source_type text,
  stamp_id uuid REFERENCES public.stamp_definitions(id),
  annette_commentary text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.stamp_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.canon_events ENABLE ROW LEVEL SECURITY;

-- RLS policies for stamp_definitions
CREATE POLICY "Anyone can view active stamps" ON public.stamp_definitions
  FOR SELECT USING (is_enabled = true);

CREATE POLICY "Admins can manage stamp definitions" ON public.stamp_definitions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND user_role = 'admin'
    )
  );

-- RLS policies for canon_events
CREATE POLICY "Users can view appropriate canon events" ON public.canon_events
  FOR SELECT USING (
    user_id = auth.uid() OR 
    (echo_scope = 'public') OR
    (echo_scope = 'city' AND user_id != auth.uid()) OR
    (echo_scope = 'friends' AND user_id IN (
      SELECT DISTINCT
        CASE
          WHEN service_connections.user_one_id = auth.uid() THEN service_connections.user_two_id
          ELSE service_connections.user_one_id
        END
      FROM service_connections
      WHERE (service_connections.user_one_id = auth.uid() OR service_connections.user_two_id = auth.uid())
        AND service_connections.cred_connection_established = true
    ))
  );

CREATE POLICY "Users can create their own canon events" ON public.canon_events
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own canon events" ON public.canon_events
  FOR UPDATE USING (user_id = auth.uid());

-- Create function to broadcast canon events
CREATE OR REPLACE FUNCTION public.create_canon_event(
  p_event_type text,
  p_title text,
  p_description text DEFAULT NULL,
  p_canon_rank text DEFAULT 'local',
  p_echo_scope text DEFAULT 'public',
  p_origin_dashboard text DEFAULT NULL,
  p_event_source_type text DEFAULT NULL,
  p_stamp_id uuid DEFAULT NULL,
  p_related_user_ids uuid[] DEFAULT NULL
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  event_id uuid;
BEGIN
  INSERT INTO public.canon_events (
    user_id,
    event_type,
    title,
    description,
    canon_rank,
    echo_scope,
    origin_dashboard,
    event_source_type,
    stamp_id,
    related_user_ids
  ) VALUES (
    auth.uid(),
    p_event_type,
    p_title,
    p_description,
    p_canon_rank,
    p_echo_scope,
    p_origin_dashboard,
    p_event_source_type,
    p_stamp_id,
    p_related_user_ids
  ) RETURNING id INTO event_id;
  
  RETURN event_id;
END;
$$;

-- Insert some default stamp definitions
INSERT INTO public.stamp_definitions (name, icon_url, rarity, emotion_flavor, description) VALUES
('Excellence', '⭐', 'common', 'Proud', 'For outstanding service quality'),
('Teamwork', '🤝', 'common', 'United', 'For exceptional collaboration'),
('Innovation', '💡', 'rare', 'Creative', 'For thinking outside the box'),
('Leadership', '👑', 'rare', 'Commanding', 'For leading others to success'),
('Legend', '🏆', 'legendary', 'Immortal', 'For legendary achievements');

-- Create indexes for better performance
CREATE INDEX idx_canon_events_user_id ON public.canon_events(user_id);
CREATE INDEX idx_canon_events_timestamp ON public.canon_events(timestamp DESC);
CREATE INDEX idx_canon_events_canon_rank ON public.canon_events(canon_rank);
CREATE INDEX idx_canon_events_echo_scope ON public.canon_events(echo_scope);

-- Create triggers for updated_at
CREATE TRIGGER update_canon_events_updated_at
  BEFORE UPDATE ON public.canon_events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_stamp_definitions_updated_at
  BEFORE UPDATE ON public.stamp_definitions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();