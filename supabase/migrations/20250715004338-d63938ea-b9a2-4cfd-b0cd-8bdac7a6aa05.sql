-- Create canon seasons table
CREATE TABLE public.canon_seasons (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  theme text NOT NULL,
  seasonal_title_rewards text[] DEFAULT '{}',
  seasonal_stamp_variants text[] DEFAULT '{}',
  active boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create user seasonal stats table
CREATE TABLE public.user_seasonal_stats (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  season_id uuid NOT NULL REFERENCES public.canon_seasons(id),
  canon_earned integer NOT NULL DEFAULT 0,
  stamps_earned integer NOT NULL DEFAULT 0,
  fusion_titles_earned integer NOT NULL DEFAULT 0,
  broadcasts_triggered integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, season_id)
);

-- Create seasonal title rewards table
CREATE TABLE public.seasonal_title_rewards (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  season_id uuid NOT NULL REFERENCES public.canon_seasons(id),
  title_id text NOT NULL,
  name text NOT NULL,
  description text,
  requirements jsonb NOT NULL DEFAULT '{}',
  icon text,
  rarity text NOT NULL DEFAULT 'seasonal',
  is_limited_time boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create user seasonal title progress table  
CREATE TABLE public.user_seasonal_title_progress (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  season_id uuid NOT NULL REFERENCES public.canon_seasons(id),
  title_id text NOT NULL,
  progress_data jsonb NOT NULL DEFAULT '{}',
  completed_at timestamp with time zone,
  equipped boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, season_id, title_id)
);

-- Add season_id to stamps and user_stamps for seasonal variants
ALTER TABLE public.stamps ADD COLUMN season_id uuid REFERENCES public.canon_seasons(id);
ALTER TABLE public.user_stamps ADD COLUMN season_earned uuid REFERENCES public.canon_seasons(id);

-- Add season tracking to canon echoes and broadcast events
ALTER TABLE public.canon_echoes ADD COLUMN season_id uuid REFERENCES public.canon_seasons(id);
ALTER TABLE public.canonical_broadcast_events ADD COLUMN season_id uuid REFERENCES public.canon_seasons(id);

-- Enable RLS
ALTER TABLE public.canon_seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_seasonal_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seasonal_title_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_seasonal_title_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for canon_seasons
CREATE POLICY "Anyone can view active seasons" 
ON public.canon_seasons FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage seasons"
ON public.canon_seasons FOR ALL
USING (EXISTS (
  SELECT 1 FROM public.users 
  WHERE id = auth.uid() AND user_role = 'admin'
));

-- RLS Policies for user_seasonal_stats
CREATE POLICY "Users can view their own seasonal stats"
ON public.user_seasonal_stats FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can view others' public seasonal stats"
ON public.user_seasonal_stats FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.network_visibility_settings
  WHERE user_id = user_seasonal_stats.user_id 
  AND is_public = true
));

CREATE POLICY "System can update seasonal stats"
ON public.user_seasonal_stats FOR ALL
USING (true);

-- RLS Policies for seasonal_title_rewards
CREATE POLICY "Anyone can view seasonal titles"
ON public.seasonal_title_rewards FOR SELECT
USING (true);

CREATE POLICY "Admins can manage seasonal titles"
ON public.seasonal_title_rewards FOR ALL
USING (EXISTS (
  SELECT 1 FROM public.users 
  WHERE id = auth.uid() AND user_role = 'admin'
));

-- RLS Policies for user_seasonal_title_progress
CREATE POLICY "Users can view their own title progress"
ON public.user_seasonal_title_progress FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own title progress"
ON public.user_seasonal_title_progress FOR ALL
USING (auth.uid() = user_id);

-- Function to get current active season
CREATE OR REPLACE FUNCTION public.get_current_season()
RETURNS canon_seasons
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT * FROM public.canon_seasons
  WHERE active = true 
  AND start_date <= CURRENT_DATE 
  AND end_date >= CURRENT_DATE
  ORDER BY created_at DESC
  LIMIT 1;
$$;

-- Function to update seasonal stats when user earns stamps/titles
CREATE OR REPLACE FUNCTION public.update_seasonal_stats(
  p_user_id uuid,
  p_stat_type text,
  p_increment integer DEFAULT 1
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_season_record canon_seasons;
BEGIN
  -- Get current active season
  SELECT * INTO current_season_record FROM public.get_current_season();
  
  IF current_season_record.id IS NULL THEN
    RETURN; -- No active season
  END IF;
  
  -- Insert or update seasonal stats
  INSERT INTO public.user_seasonal_stats (
    user_id, 
    season_id, 
    canon_earned,
    stamps_earned,
    fusion_titles_earned,
    broadcasts_triggered
  ) VALUES (
    p_user_id,
    current_season_record.id,
    CASE WHEN p_stat_type = 'canon' THEN p_increment ELSE 0 END,
    CASE WHEN p_stat_type = 'stamps' THEN p_increment ELSE 0 END,
    CASE WHEN p_stat_type = 'fusion_titles' THEN p_increment ELSE 0 END,
    CASE WHEN p_stat_type = 'broadcasts' THEN p_increment ELSE 0 END
  )
  ON CONFLICT (user_id, season_id)
  DO UPDATE SET
    canon_earned = CASE WHEN p_stat_type = 'canon' 
      THEN user_seasonal_stats.canon_earned + p_increment 
      ELSE user_seasonal_stats.canon_earned END,
    stamps_earned = CASE WHEN p_stat_type = 'stamps'
      THEN user_seasonal_stats.stamps_earned + p_increment 
      ELSE user_seasonal_stats.stamps_earned END,
    fusion_titles_earned = CASE WHEN p_stat_type = 'fusion_titles'
      THEN user_seasonal_stats.fusion_titles_earned + p_increment 
      ELSE user_seasonal_stats.fusion_titles_earned END,
    broadcasts_triggered = CASE WHEN p_stat_type = 'broadcasts'
      THEN user_seasonal_stats.broadcasts_triggered + p_increment 
      ELSE user_seasonal_stats.broadcasts_triggered END,
    updated_at = now();
END;
$$;

-- Function to check if user earned a seasonal title
CREATE OR REPLACE FUNCTION public.check_seasonal_title_eligibility(
  p_user_id uuid,
  p_title_id text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  title_requirements jsonb;
  user_stats user_seasonal_stats;
  current_season_id uuid;
BEGIN
  -- Get current season
  SELECT id INTO current_season_id FROM public.get_current_season();
  
  IF current_season_id IS NULL THEN
    RETURN false;
  END IF;
  
  -- Get title requirements
  SELECT requirements INTO title_requirements
  FROM public.seasonal_title_rewards
  WHERE title_id = p_title_id AND season_id = current_season_id;
  
  IF title_requirements IS NULL THEN
    RETURN false;
  END IF;
  
  -- Get user seasonal stats
  SELECT * INTO user_stats
  FROM public.user_seasonal_stats
  WHERE user_id = p_user_id AND season_id = current_season_id;
  
  IF user_stats IS NULL THEN
    RETURN false;
  END IF;
  
  -- Check requirements (simplified - can be expanded)
  IF (title_requirements->>'min_stamps')::int IS NOT NULL THEN
    IF user_stats.stamps_earned < (title_requirements->>'min_stamps')::int THEN
      RETURN false;
    END IF;
  END IF;
  
  IF (title_requirements->>'min_canon')::int IS NOT NULL THEN
    IF user_stats.canon_earned < (title_requirements->>'min_canon')::int THEN
      RETURN false;
    END IF;
  END IF;
  
  RETURN true;
END;
$$;

-- Insert default seasons
INSERT INTO public.canon_seasons (name, start_date, end_date, theme, active, seasonal_title_rewards, seasonal_stamp_variants) VALUES
('Echoes of Autumn', '2024-09-01', '2024-11-30', 'autumn', true, 
 ARRAY['the-harvester', 'leaf-whisperer', 'autumn-sage'], 
 ARRAY['autumn-glow', 'maple-accent', 'harvest-border']),
('Frost Pulse', '2024-12-01', '2025-02-28', 'winter', false,
 ARRAY['frost-walker', 'winter-guardian', 'snow-architect'],
 ARRAY['frost-overlay', 'ice-crystals', 'winter-shimmer']),
('Solar Surge', '2025-06-01', '2025-08-31', 'summer', false,
 ARRAY['sun-forged', 'heat-master', 'solar-commander'],
 ARRAY['solar-flare', 'heat-waves', 'summer-brilliance']);

-- Insert sample seasonal titles
INSERT INTO public.seasonal_title_rewards (season_id, title_id, name, description, requirements, icon, rarity) VALUES
((SELECT id FROM public.canon_seasons WHERE name = 'Echoes of Autumn'), 
 'the-harvester', 'The Harvester', 'Master of autumn achievements', 
 '{"min_stamps": 15, "min_canon": 10}', '🌾', 'legendary'),
((SELECT id FROM public.canon_seasons WHERE name = 'Echoes of Autumn'), 
 'leaf-whisperer', 'Leaf Whisperer', 'Connected to nature''s rhythm', 
 '{"min_stamps": 8, "seasonal_broadcasts": 5}', '🍃', 'rare');

-- Add triggers to update seasonal stats
CREATE OR REPLACE FUNCTION public.update_seasonal_stats_trigger()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_TABLE_NAME = 'user_stamps' AND TG_OP = 'INSERT' THEN
    PERFORM public.update_seasonal_stats(NEW.user_id, 'stamps', 1);
  ELSIF TG_TABLE_NAME = 'user_fusion_stamps' AND TG_OP = 'INSERT' THEN
    PERFORM public.update_seasonal_stats(NEW.user_id, 'fusion_titles', 1);
  ELSIF TG_TABLE_NAME = 'canon_echoes' AND TG_OP = 'INSERT' THEN
    PERFORM public.update_seasonal_stats(NEW.user_id, 'broadcasts', 1);
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create triggers
CREATE TRIGGER update_seasonal_stats_on_stamp
  AFTER INSERT ON public.user_stamps
  FOR EACH ROW EXECUTE FUNCTION public.update_seasonal_stats_trigger();

CREATE TRIGGER update_seasonal_stats_on_fusion
  AFTER INSERT ON public.user_fusion_stamps  
  FOR EACH ROW EXECUTE FUNCTION public.update_seasonal_stats_trigger();

CREATE TRIGGER update_seasonal_stats_on_echo
  AFTER INSERT ON public.canon_echoes
  FOR EACH ROW EXECUTE FUNCTION public.update_seasonal_stats_trigger();