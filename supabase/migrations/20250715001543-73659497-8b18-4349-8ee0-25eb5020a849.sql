-- Create user trust graph snapshots table
CREATE TABLE public.user_trust_graph_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  connections jsonb NOT NULL DEFAULT '[]',
  graph_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, graph_date)
);

-- Create network visibility settings table
CREATE TABLE public.network_visibility_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  is_public boolean DEFAULT false,
  show_partial_graph boolean DEFAULT true,
  anonymize_connections boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_trust_graph_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.network_visibility_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_trust_graph_snapshots
CREATE POLICY "Users can view their own trust graph" ON public.user_trust_graph_snapshots
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can manage trust graphs" ON public.user_trust_graph_snapshots
  FOR ALL USING (true);

CREATE POLICY "Users can view public trust graphs" ON public.user_trust_graph_snapshots
  FOR SELECT USING (
    user_id IN (
      SELECT user_id FROM network_visibility_settings 
      WHERE is_public = true
    )
  );

-- RLS Policies for network_visibility_settings
CREATE POLICY "Users can manage their own network settings" ON public.network_visibility_settings
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view public network settings" ON public.network_visibility_settings
  FOR SELECT USING (is_public = true);

-- Function to calculate trust score between two users
CREATE OR REPLACE FUNCTION public.calculate_trust_score(p_user_one_id uuid, p_user_two_id uuid)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  job_count integer := 0;
  avg_rating numeric := 0;
  shared_canon_events integer := 0;
  days_since_last_interaction integer := 365;
  prestige_overlap numeric := 0;
  final_score numeric := 0;
BEGIN
  -- Count jobs together
  SELECT COUNT(*) INTO job_count
  FROM bookings b
  JOIN provider_profiles pp ON b.provider_id = pp.id
  WHERE ((b.customer_id = p_user_one_id AND pp.user_id = p_user_two_id) OR
         (b.customer_id = p_user_two_id AND pp.user_id = p_user_one_id))
    AND b.status = 'completed';
  
  -- Get average rating between them
  SELECT COALESCE(AVG(r.rating), 0) INTO avg_rating
  FROM reviews r
  JOIN bookings b ON r.booking_id = b.id
  JOIN provider_profiles pp ON b.provider_id = pp.id
  WHERE ((b.customer_id = p_user_one_id AND pp.user_id = p_user_two_id AND r.reviewer_id = p_user_one_id) OR
         (b.customer_id = p_user_two_id AND pp.user_id = p_user_one_id AND r.reviewer_id = p_user_two_id));
  
  -- Count shared Canon events (simplified - using broadcast events)
  SELECT COUNT(DISTINCT cbe1.id) INTO shared_canon_events
  FROM canonical_broadcast_events cbe1
  JOIN canonical_broadcast_events cbe2 ON cbe1.city = cbe2.city 
    AND ABS(EXTRACT(EPOCH FROM (cbe1.created_at - cbe2.created_at))) <= 3600
  WHERE cbe1.user_id = p_user_one_id AND cbe2.user_id = p_user_two_id
    AND cbe1.verified = true AND cbe2.verified = true;
  
  -- Days since last interaction
  SELECT COALESCE(
    EXTRACT(DAY FROM (now() - MAX(b.completed_at))), 
    365
  ) INTO days_since_last_interaction
  FROM bookings b
  JOIN provider_profiles pp ON b.provider_id = pp.id
  WHERE ((b.customer_id = p_user_one_id AND pp.user_id = p_user_two_id) OR
         (b.customer_id = p_user_two_id AND pp.user_id = p_user_one_id))
    AND b.status = 'completed';
  
  -- Calculate final trust score
  final_score := 
    (job_count * 10) +                              -- Base trust from jobs
    (avg_rating * 5) +                              -- Rating quality boost
    (shared_canon_events * 15) +                    -- Canon event multiplier
    (GREATEST(0, 100 - days_since_last_interaction)) + -- Freshness factor
    prestige_overlap;                               -- Future: prestige synergy
  
  RETURN GREATEST(0, final_score);
END;
$$;

-- Function to generate trust graph for a user
CREATE OR REPLACE FUNCTION public.generate_user_trust_graph(p_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  connections jsonb := '[]'::jsonb;
  connection_record record;
  trust_score numeric;
  canon_events text[];
BEGIN
  -- Get all users this person has interacted with through bookings
  FOR connection_record IN
    SELECT DISTINCT 
      CASE 
        WHEN b.customer_id = p_user_id THEN pp.user_id
        ELSE b.customer_id
      END as target_user_id,
      MAX(b.completed_at) as last_interaction
    FROM bookings b
    JOIN provider_profiles pp ON b.provider_id = pp.id
    WHERE (b.customer_id = p_user_id OR pp.user_id = p_user_id)
      AND b.status = 'completed'
      AND (
        CASE 
          WHEN b.customer_id = p_user_id THEN pp.user_id
          ELSE b.customer_id
        END
      ) != p_user_id
  LOOP
    -- Calculate trust score
    SELECT calculate_trust_score(p_user_id, connection_record.target_user_id) INTO trust_score;
    
    -- Get shared Canon event IDs (simplified)
    SELECT array_agg(DISTINCT cbe.id::text) INTO canon_events
    FROM canonical_broadcast_events cbe
    WHERE cbe.user_id IN (p_user_id, connection_record.target_user_id)
      AND cbe.verified = true
    LIMIT 5;
    
    -- Add to connections if trust score is meaningful
    IF trust_score > 10 THEN
      connections := connections || jsonb_build_object(
        'target_id', connection_record.target_user_id,
        'trust_score', trust_score,
        'last_seen', connection_record.last_interaction,
        'canon_event_ids', COALESCE(canon_events, ARRAY[]::text[])
      );
    END IF;
  END LOOP;
  
  RETURN connections;
END;
$$;

-- Function to update daily trust graph snapshots
CREATE OR REPLACE FUNCTION public.update_trust_graph_snapshots()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  updated_count integer := 0;
  user_record record;
  graph_data jsonb;
BEGIN
  -- Update trust graphs for active users
  FOR user_record IN 
    SELECT DISTINCT u.id
    FROM users u
    JOIN bookings b ON (b.customer_id = u.id OR EXISTS (
      SELECT 1 FROM provider_profiles pp WHERE pp.user_id = u.id AND pp.id = b.provider_id
    ))
    WHERE b.completed_at > now() - INTERVAL '30 days'
  LOOP
    -- Generate trust graph
    SELECT generate_user_trust_graph(user_record.id) INTO graph_data;
    
    -- Upsert snapshot
    INSERT INTO user_trust_graph_snapshots (user_id, connections, graph_date)
    VALUES (user_record.id, graph_data, CURRENT_DATE)
    ON CONFLICT (user_id, graph_date) 
    DO UPDATE SET 
      connections = EXCLUDED.connections,
      updated_at = now();
    
    updated_count := updated_count + 1;
  END LOOP;
  
  RETURN updated_count;
END;
$$;

-- Add trigger for updated_at
CREATE TRIGGER update_user_trust_graph_snapshots_updated_at
  BEFORE UPDATE ON public.user_trust_graph_snapshots
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_network_visibility_settings_updated_at
  BEFORE UPDATE ON public.network_visibility_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();