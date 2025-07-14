-- Create prestige titles table
CREATE TABLE public.prestige_titles (
  id text PRIMARY KEY,
  name text NOT NULL,
  flavor_text text NOT NULL,
  category text NOT NULL,
  icon text NOT NULL,
  tier integer NOT NULL DEFAULT 1,
  requirements jsonb NOT NULL DEFAULT '[]'::jsonb,
  canon_sources text[] NOT NULL DEFAULT '{}',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create prestige progress table
CREATE TABLE public.prestige_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title_id text NOT NULL REFERENCES public.prestige_titles(id),
  progress_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  canon_verified boolean NOT NULL DEFAULT false,
  completed_at timestamp with time zone,
  equipped boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, title_id),
  UNIQUE(user_id, equipped) WHERE equipped = true -- Only one equipped title per user
);

-- Enable RLS
ALTER TABLE public.prestige_titles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prestige_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for prestige_titles
CREATE POLICY "Anyone can view active titles"
ON public.prestige_titles
FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage titles"
ON public.prestige_titles
FOR ALL
USING (EXISTS (
  SELECT 1 FROM public.users 
  WHERE id = auth.uid() AND user_role = 'admin'
));

-- RLS Policies for prestige_progress
CREATE POLICY "Users can view their own progress"
ON public.prestige_progress
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
ON public.prestige_progress
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "System can manage progress"
ON public.prestige_progress
FOR ALL
USING (true);

-- Create indexes
CREATE INDEX idx_prestige_progress_user_id ON public.prestige_progress(user_id);
CREATE INDEX idx_prestige_progress_title_id ON public.prestige_progress(title_id);
CREATE INDEX idx_prestige_progress_equipped ON public.prestige_progress(user_id) WHERE equipped = true;
CREATE INDEX idx_prestige_titles_category ON public.prestige_titles(category);
CREATE INDEX idx_prestige_titles_tier ON public.prestige_titles(tier);

-- Insert initial prestige titles
INSERT INTO public.prestige_titles (id, name, flavor_text, category, icon, tier, requirements, canon_sources) VALUES
('solo_operator', 'Solo Operator', 'Alone but never outmatched.', 'Crew Feats', '🦾', 2, '[{"type": "solo_jobs", "count": 10}, {"type": "solo_five_star_reviews", "count": 5}]', ARRAY['jobs', 'reviews', 'crew_count']),
('road_warrior', 'Road Warrior', 'Distance means nothing to the determined.', 'Performance', '🚙', 2, '[{"type": "distance_jobs", "count": 5, "min_distance": 25}]', ARRAY['jobs', 'gps_data']),
('blitzmaster', 'Blitzmaster', 'Speed and quality in perfect harmony.', 'Performance', '⚡', 3, '[{"type": "daily_jobs", "count": 5, "single_day": true}, {"type": "avg_rating", "min_rating": 4.5}]', ARRAY['jobs', 'reviews']),
('clockwork', 'Clockwork', 'Precision is your middle name.', 'Reliability', '⏰', 2, '[{"type": "early_arrivals", "count": 15}, {"type": "on_time_streak", "count": 10}]', ARRAY['jobs', 'timing']),
('five_star_sweep', 'Five-Star Sweep', 'Excellence is your only standard.', 'Recognition', '⭐', 3, '[{"type": "consecutive_five_stars", "count": 10}]', ARRAY['reviews']),
('faithful_return', 'Faithful Return', 'Loyalty earns legends.', 'Loyalty', '🤝', 2, '[{"type": "repeat_clients", "count": 5}, {"type": "client_loyalty_streak", "count": 3}]', ARRAY['jobs', 'client_history']),
('network_builder', 'Network Builder', 'Connections create opportunities.', 'Community', '🌐', 3, '[{"type": "service_connections", "count": 20}, {"type": "referrals_given", "count": 5}]', ARRAY['network', 'referrals']),
('problem_solver', 'Problem Solver', 'Where others see obstacles, you see solutions.', 'Service', '🧩', 2, '[{"type": "difficult_jobs", "count": 8}, {"type": "solution_commendations", "count": 5}]', ARRAY['jobs', 'reviews', 'commendations']),
('crew_captain', 'Crew Captain', 'Leading from the front, always.', 'Leadership', '👑', 4, '[{"type": "crew_jobs_led", "count": 10}, {"type": "crew_rating", "min_rating": 4.8}]', ARRAY['crew', 'jobs', 'reviews']),
('housie_legend', 'HOUSIE Legend', 'The pinnacle of platform mastery.', 'Elite', '🏆', 5, '[{"type": "total_jobs", "count": 100}, {"type": "overall_rating", "min_rating": 4.9}, {"type": "stamps_earned", "count": 15}]', ARRAY['jobs', 'reviews', 'stamps', 'canon']);

-- Create function to update prestige progress
CREATE OR REPLACE FUNCTION public.update_prestige_progress(
  p_user_id uuid,
  p_title_id text,
  p_progress_data jsonb,
  p_canon_verified boolean DEFAULT false
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  progress_id uuid;
  is_completed boolean := false;
  title_requirements jsonb;
BEGIN
  -- Get title requirements
  SELECT requirements INTO title_requirements
  FROM public.prestige_titles
  WHERE id = p_title_id AND is_active = true;
  
  IF title_requirements IS NULL THEN
    RAISE EXCEPTION 'Title not found or inactive: %', p_title_id;
  END IF;
  
  -- Check if all requirements are met
  -- This is a simplified check - in practice you'd implement complex requirement validation
  is_completed := true; -- Placeholder logic
  
  -- Insert or update progress
  INSERT INTO public.prestige_progress (user_id, title_id, progress_data, canon_verified, completed_at)
  VALUES (
    p_user_id, 
    p_title_id, 
    p_progress_data, 
    p_canon_verified,
    CASE WHEN is_completed THEN now() ELSE NULL END
  )
  ON CONFLICT (user_id, title_id) 
  DO UPDATE SET 
    progress_data = EXCLUDED.progress_data,
    canon_verified = EXCLUDED.canon_verified,
    completed_at = CASE WHEN is_completed AND prestige_progress.completed_at IS NULL THEN now() ELSE prestige_progress.completed_at END,
    updated_at = now()
  RETURNING id INTO progress_id;
  
  RETURN progress_id;
END;
$$;

-- Create function to equip title
CREATE OR REPLACE FUNCTION public.equip_title(p_user_id uuid, p_title_id text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if user has completed this title
  IF NOT EXISTS (
    SELECT 1 FROM public.prestige_progress 
    WHERE user_id = p_user_id 
    AND title_id = p_title_id 
    AND completed_at IS NOT NULL
  ) THEN
    RETURN false;
  END IF;
  
  -- Unequip all titles for this user
  UPDATE public.prestige_progress 
  SET equipped = false, updated_at = now()
  WHERE user_id = p_user_id AND equipped = true;
  
  -- Equip the new title
  UPDATE public.prestige_progress 
  SET equipped = true, updated_at = now()
  WHERE user_id = p_user_id AND title_id = p_title_id;
  
  RETURN true;
END;
$$;

-- Create function to get user equipped title
CREATE OR REPLACE FUNCTION public.get_equipped_title(p_user_id uuid)
RETURNS TABLE(title_id text, title_name text, icon text, flavor_text text)
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT pt.id, pt.name, pt.icon, pt.flavor_text
  FROM public.prestige_progress pp
  JOIN public.prestige_titles pt ON pp.title_id = pt.id
  WHERE pp.user_id = p_user_id AND pp.equipped = true
  LIMIT 1;
$$;

-- Create triggers for updated_at
CREATE TRIGGER update_prestige_titles_updated_at
  BEFORE UPDATE ON public.prestige_titles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_prestige_progress_updated_at
  BEFORE UPDATE ON public.prestige_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();