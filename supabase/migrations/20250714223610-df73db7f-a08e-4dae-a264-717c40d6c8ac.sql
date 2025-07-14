-- Create drop_points table
CREATE TABLE public.drop_points (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  coordinates point NOT NULL,
  radius_m integer NOT NULL DEFAULT 500,
  type text NOT NULL DEFAULT 'community',
  bonus_stamp_id text,
  active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  
  CONSTRAINT drop_points_type_check CHECK (type IN ('community', 'historic', 'event', 'seasonal')),
  CONSTRAINT drop_points_radius_check CHECK (radius_m > 0 AND radius_m <= 5000)
);

-- Create user_imprints table
CREATE TABLE public.user_imprints (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  drop_point_id uuid NOT NULL REFERENCES public.drop_points(id) ON DELETE CASCADE,
  action_type text NOT NULL DEFAULT 'visit',
  timestamp timestamp with time zone NOT NULL DEFAULT now(),
  canonical boolean NOT NULL DEFAULT false,
  service_type text,
  optional_note text,
  stamp_triggered_id text,
  coordinates point,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  
  CONSTRAINT user_imprints_action_type_check CHECK (action_type IN ('job', 'visit', 'event', 'rebook', 'stamp_unlock'))
);

-- Enable RLS on drop_points
ALTER TABLE public.drop_points ENABLE ROW LEVEL SECURITY;

-- Drop points are publicly visible
CREATE POLICY "Anyone can view active drop points" ON public.drop_points
  FOR SELECT USING (active = true);

-- Admins can manage drop points
CREATE POLICY "Admins can manage drop points" ON public.drop_points
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND user_role = 'admin'
    )
  );

-- Enable RLS on user_imprints
ALTER TABLE public.user_imprints ENABLE ROW LEVEL SECURITY;

-- Users can view their own imprints
CREATE POLICY "Users can view their own imprints" ON public.user_imprints
  FOR SELECT USING (auth.uid() = user_id);

-- Users can create their own imprints
CREATE POLICY "Users can create their own imprints" ON public.user_imprints
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- System can create imprints
CREATE POLICY "System can create imprints" ON public.user_imprints
  FOR INSERT WITH CHECK (true);

-- Users can view public canonical imprints for discovery
CREATE POLICY "Users can view public canonical imprints" ON public.user_imprints
  FOR SELECT USING (canonical = true);

-- Create function to check if coordinates are within drop point
CREATE OR REPLACE FUNCTION public.is_within_drop_point(
  p_coordinates point,
  p_drop_point_id uuid
) RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
AS $$
DECLARE
  drop_point_record RECORD;
  distance_m NUMERIC;
BEGIN
  -- Get drop point details
  SELECT coordinates, radius_m INTO drop_point_record
  FROM public.drop_points
  WHERE id = p_drop_point_id AND active = true;
  
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  
  -- Calculate distance using PostGIS point distance (rough approximation)
  -- For Montreal area: 1 degree ≈ 111km
  distance_m := (
    SELECT SQRT(
      POWER((p_coordinates[0] - drop_point_record.coordinates[0]) * 111320 * COS(RADIANS(drop_point_record.coordinates[1])), 2) +
      POWER((p_coordinates[1] - drop_point_record.coordinates[1]) * 111320, 2)
    )
  );
  
  RETURN distance_m <= drop_point_record.radius_m;
END;
$$;

-- Create function to find nearby drop points
CREATE OR REPLACE FUNCTION public.find_nearby_drop_points(
  p_coordinates point,
  p_max_distance_m integer DEFAULT 1000
) RETURNS TABLE(
  drop_point_id uuid,
  name text,
  type text,
  distance_m numeric,
  bonus_stamp_id text
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    dp.id,
    dp.name,
    dp.type,
    SQRT(
      POWER((p_coordinates[0] - dp.coordinates[0]) * 111320 * COS(RADIANS(dp.coordinates[1])), 2) +
      POWER((p_coordinates[1] - dp.coordinates[1]) * 111320, 2)
    ) AS distance_m,
    dp.bonus_stamp_id
  FROM public.drop_points dp
  WHERE dp.active = true
  AND SQRT(
    POWER((p_coordinates[0] - dp.coordinates[0]) * 111320 * COS(RADIANS(dp.coordinates[1])), 2) +
    POWER((p_coordinates[1] - dp.coordinates[1]) * 111320, 2)
  ) <= p_max_distance_m
  ORDER BY distance_m;
END;
$$;

-- Create function to log imprint
CREATE OR REPLACE FUNCTION public.log_imprint(
  p_user_id uuid,
  p_coordinates point,
  p_action_type text,
  p_service_type text DEFAULT NULL,
  p_note text DEFAULT NULL
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  nearby_drops RECORD;
  imprint_id uuid;
  stamp_awarded text;
  total_imprints integer;
  result jsonb;
BEGIN
  result := jsonb_build_object('success', false, 'imprints_created', 0);
  
  -- Find nearby drop points
  FOR nearby_drops IN 
    SELECT * FROM public.find_nearby_drop_points(p_coordinates, 500)
  LOOP
    -- Create imprint
    INSERT INTO public.user_imprints (
      user_id, 
      drop_point_id, 
      action_type, 
      service_type, 
      optional_note, 
      coordinates,
      canonical
    ) VALUES (
      p_user_id,
      nearby_drops.drop_point_id,
      p_action_type,
      p_service_type,
      p_note,
      p_coordinates,
      p_action_type IN ('job', 'stamp_unlock') -- Jobs and stamp unlocks are canonical
    ) RETURNING id INTO imprint_id;
    
    -- Check for stamp awards
    SELECT COUNT(*) INTO total_imprints
    FROM public.user_imprints
    WHERE user_id = p_user_id AND drop_point_id = nearby_drops.drop_point_id;
    
    -- Award location-based stamps
    IF total_imprints >= 5 AND NOT EXISTS (
      SELECT 1 FROM public.user_stamps 
      WHERE user_id = p_user_id AND stamp_id = 'faithful-footprint'
    ) THEN
      stamp_awarded := 'faithful-footprint';
      -- Award the stamp (would call stamp awarding function here)
    END IF;
    
    -- Award bonus stamp if specified
    IF nearby_drops.bonus_stamp_id IS NOT NULL AND NOT EXISTS (
      SELECT 1 FROM public.user_stamps 
      WHERE user_id = p_user_id AND stamp_id = nearby_drops.bonus_stamp_id
    ) THEN
      stamp_awarded := nearby_drops.bonus_stamp_id;
    END IF;
    
    result := jsonb_set(result, '{success}', 'true');
    result := jsonb_set(result, '{imprints_created}', (COALESCE((result->>'imprints_created')::integer, 0) + 1)::text::jsonb);
    
    IF stamp_awarded IS NOT NULL THEN
      result := jsonb_set(result, '{stamp_awarded}', to_jsonb(stamp_awarded));
    END IF;
  END LOOP;
  
  RETURN result;
END;
$$;

-- Create triggers for updated_at
CREATE TRIGGER update_drop_points_updated_at
  BEFORE UPDATE ON public.drop_points
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample drop points for Montreal
INSERT INTO public.drop_points (name, coordinates, radius_m, type, bonus_stamp_id) VALUES
  ('Parc Lafontaine', POINT(-73.5728, 45.5198), 300, 'community', 'nature-networker'),
  ('Old Montreal', POINT(-73.5546, 45.5048), 500, 'historic', 'heritage-hero'),
  ('Plateau Mont-Royal', POINT(-73.5787, 45.5236), 400, 'community', 'local-legend'),
  ('Mount Royal Park', POINT(-73.5878, 45.5035), 600, 'community', 'peak-performer'),
  ('Downtown Core', POINT(-73.5693, 45.5017), 800, 'community', NULL),
  ('Mile End', POINT(-73.6020, 45.5276), 350, 'community', 'cultural-curator'),
  ('Griffintown', POINT(-73.5556, 45.4925), 300, 'event', NULL),
  ('Little Italy', POINT(-73.6169, 45.5356), 400, 'community', 'heritage-hero');

COMMENT ON TABLE public.drop_points IS 'GPS zones that trigger special events and imprints';
COMMENT ON TABLE public.user_imprints IS 'Records of user actions within drop points';
COMMENT ON FUNCTION public.is_within_drop_point IS 'Check if coordinates are within a drop point radius';
COMMENT ON FUNCTION public.find_nearby_drop_points IS 'Find drop points near given coordinates';
COMMENT ON FUNCTION public.log_imprint IS 'Log an imprint event at user coordinates';