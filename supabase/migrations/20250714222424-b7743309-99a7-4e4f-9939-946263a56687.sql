-- Phase 14: Stampverse™ + Prestige Fusion Titles

-- Create fusion_titles table
CREATE TABLE public.fusion_titles (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text,
  required_prestige_tier integer NOT NULL DEFAULT 3,
  required_stamps text[] NOT NULL DEFAULT '{}',
  flavor_lines text[] NOT NULL DEFAULT '{}',
  icon text NOT NULL DEFAULT '⚡',
  rarity text NOT NULL DEFAULT 'rare',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create user_fusion_titles table
CREATE TABLE public.user_fusion_titles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title_id text NOT NULL REFERENCES public.fusion_titles(id),
  unlocked_at timestamp with time zone NOT NULL DEFAULT now(),
  is_equipped boolean NOT NULL DEFAULT false,
  unlock_context jsonb DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, title_id)
);

-- Add evolution counter to user_stamps
ALTER TABLE public.user_stamps 
ADD COLUMN evolution_count integer NOT NULL DEFAULT 1,
ADD COLUMN evolution_tier text DEFAULT 'base';

-- Create stamp evolution definitions table
CREATE TABLE public.stamp_evolutions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  base_stamp_id text NOT NULL,
  evolution_tier text NOT NULL,
  required_count integer NOT NULL,
  evolved_name text NOT NULL,
  evolved_icon text NOT NULL,
  evolved_flavor_text text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(base_stamp_id, evolution_tier)
);

-- Enable RLS
ALTER TABLE public.fusion_titles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_fusion_titles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stamp_evolutions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for fusion_titles
CREATE POLICY "Anyone can view active fusion titles"
ON public.fusion_titles FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage fusion titles"
ON public.fusion_titles FOR ALL
USING (EXISTS (
  SELECT 1 FROM public.users 
  WHERE id = auth.uid() AND user_role = 'admin'
));

-- RLS Policies for user_fusion_titles
CREATE POLICY "Users can view their own fusion titles"
ON public.user_fusion_titles FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can update their own fusion titles"
ON public.user_fusion_titles FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "System can insert fusion titles"
ON public.user_fusion_titles FOR INSERT
WITH CHECK (user_id = auth.uid());

-- RLS Policies for stamp_evolutions
CREATE POLICY "Anyone can view stamp evolutions"
ON public.stamp_evolutions FOR SELECT
USING (true);

CREATE POLICY "Admins can manage stamp evolutions"
ON public.stamp_evolutions FOR ALL
USING (EXISTS (
  SELECT 1 FROM public.users 
  WHERE id = auth.uid() AND user_role = 'admin'
));

-- Insert default fusion titles
INSERT INTO public.fusion_titles (id, name, description, required_prestige_tier, required_stamps, flavor_lines, icon, rarity) VALUES
('the-pathfinder', 'The Pathfinder', 'Master navigator who charts unknown territories', 3, ARRAY['road-warrior', 'clockwork'], ARRAY['The Pathfinder walks by compass and conscience. Annette marks her trail.', 'Distance is just another puzzle to solve.'], '🧭', 'legendary'),
('canon-queen', 'Canon Queen', 'Ruler of the broadcast waves and stamp mastery', 4, ARRAY['five-star-sweep', 'solo-operator', 'blitzmaster'], ARRAY['Canon Queen in the room! Bow or be broadcasted.', 'Your reign over the grid is absolute.'], '👑', 'mythic'),
('the-gridwalker', 'The Gridwalker', 'Phantom traveler of the HOUSIE network', 3, ARRAY['road-warrior'], ARRAY['Ah, the Gridwalker returns. Shall we map more canon tonight?', 'The grid bends to your will.'], '🌐', 'legendary'),
('one-woman-army', 'One-Woman Army', 'Self-sufficient force of productivity', 3, ARRAY['solo-operator', 'clockwork'], ARRAY['Army of one, efficiency of many.', 'Who needs backup when you ARE the backup?'], '⚔️', 'rare'),
('echo-master', 'Echo Master', 'Controller of canon broadcasts and whispers', 4, ARRAY['five-star-sweep'], ARRAY['Your echoes shape reality across the grid.', 'Every transmission carries your signature.'], '📡', 'legendary');

-- Insert stamp evolution definitions
INSERT INTO public.stamp_evolutions (base_stamp_id, evolution_tier, required_count, evolved_name, evolved_icon, evolved_flavor_text) VALUES
('road-warrior', 'evolved', 3, 'Endless Rider', '🏍️', 'Distance means nothing. The road is your domain.'),
('road-warrior', 'legendary', 7, 'Trailblazer', '🌟', 'You don''t follow paths. You create them.'),
('clockwork', 'evolved', 5, 'Time Master', '⏰', 'Punctuality is an art form you''ve perfected.'),
('clockwork', 'legendary', 10, 'Temporal Lord', '⚡', 'Time itself bends to your schedule.'),
('solo-operator', 'evolved', 5, 'Lone Wolf', '🐺', 'Independence isn''t just a choice. It''s your nature.'),
('solo-operator', 'legendary', 12, 'Ghost Operator', '👻', 'Invisible efficiency. Maximum impact.'),
('five-star-sweep', 'evolved', 3, 'Excellence Engine', '💫', 'Quality isn''t a goal. It''s your baseline.'),
('five-star-sweep', 'legendary', 8, 'Perfection Incarnate', '✨', 'You don''t aim for perfection. You embody it.'),
('blitzmaster', 'evolved', 4, 'Speed Demon', '⚡', 'Fast isn''t fast enough. You redefine velocity.'),
('blitzmaster', 'legendary', 10, 'Lightning Strike', '⚡', 'You don''t work at lightning speed. You ARE lightning.');

-- Function to check fusion title eligibility
CREATE OR REPLACE FUNCTION public.check_fusion_title_eligibility(p_user_id uuid, p_title_id text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  title_record RECORD;
  user_prestige_tier integer;
  stamp_count integer;
  required_stamp text;
BEGIN
  -- Get title requirements
  SELECT * INTO title_record FROM public.fusion_titles WHERE id = p_title_id;
  
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  
  -- Check prestige tier (using prestige_progress table)
  SELECT COUNT(*) INTO user_prestige_tier
  FROM public.prestige_progress 
  WHERE user_id = p_user_id AND completed_at IS NOT NULL;
  
  IF user_prestige_tier < title_record.required_prestige_tier THEN
    RETURN false;
  END IF;
  
  -- Check required stamps
  FOREACH required_stamp IN ARRAY title_record.required_stamps
  LOOP
    SELECT COUNT(*) INTO stamp_count
    FROM public.user_stamps 
    WHERE user_id = p_user_id AND stamp_id = required_stamp;
    
    IF stamp_count = 0 THEN
      RETURN false;
    END IF;
  END LOOP;
  
  RETURN true;
END;
$$;

-- Function to award fusion title
CREATE OR REPLACE FUNCTION public.award_fusion_title(p_user_id uuid, p_title_id text, p_context jsonb DEFAULT '{}')
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  fusion_title_id uuid;
  title_record RECORD;
BEGIN
  -- Check eligibility
  IF NOT public.check_fusion_title_eligibility(p_user_id, p_title_id) THEN
    RAISE EXCEPTION 'User does not meet requirements for fusion title: %', p_title_id;
  END IF;
  
  -- Get title details
  SELECT * INTO title_record FROM public.fusion_titles WHERE id = p_title_id;
  
  -- Insert user fusion title (ignore if already exists)
  INSERT INTO public.user_fusion_titles (user_id, title_id, unlock_context)
  VALUES (p_user_id, p_title_id, p_context)
  ON CONFLICT (user_id, title_id) DO NOTHING
  RETURNING id INTO fusion_title_id;
  
  -- If already unlocked, return existing ID
  IF fusion_title_id IS NULL THEN
    SELECT id INTO fusion_title_id 
    FROM public.user_fusion_titles 
    WHERE user_id = p_user_id AND title_id = p_title_id;
    
    RETURN fusion_title_id;
  END IF;
  
  -- Broadcast fusion unlock as global Canon event
  PERFORM public.broadcast_canon_event(
    'fusion_title_unlocked',
    p_user_id,
    'user_fusion_titles',
    fusion_title_id,
    true,
    'global',
    true,
    0.95,
    jsonb_build_object(
      'title_name', title_record.name,
      'title_icon', title_record.icon,
      'rarity', title_record.rarity
    )
  );
  
  RETURN fusion_title_id;
END;
$$;

-- Function to evolve stamps
CREATE OR REPLACE FUNCTION public.evolve_stamp(p_user_id uuid, p_stamp_id text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_count integer;
  evolution_record RECORD;
  new_tier text;
BEGIN
  -- Get current evolution count
  SELECT evolution_count INTO current_count
  FROM public.user_stamps 
  WHERE user_id = p_user_id AND stamp_id = p_stamp_id;
  
  IF current_count IS NULL THEN
    RETURN 'base'; -- Stamp not found
  END IF;
  
  -- Increment count
  UPDATE public.user_stamps 
  SET evolution_count = evolution_count + 1
  WHERE user_id = p_user_id AND stamp_id = p_stamp_id;
  
  current_count := current_count + 1;
  
  -- Check for evolution eligibility
  SELECT * INTO evolution_record
  FROM public.stamp_evolutions 
  WHERE base_stamp_id = p_stamp_id 
    AND required_count <= current_count
  ORDER BY required_count DESC
  LIMIT 1;
  
  IF FOUND THEN
    new_tier := evolution_record.evolution_tier;
    
    -- Update evolution tier if it's higher than current
    UPDATE public.user_stamps 
    SET evolution_tier = new_tier
    WHERE user_id = p_user_id 
      AND stamp_id = p_stamp_id 
      AND evolution_tier = 'base';
    
    -- Broadcast evolution as local Canon event
    PERFORM public.broadcast_canon_event(
      'stamp_evolved',
      p_user_id,
      'user_stamps',
      (SELECT id FROM public.user_stamps WHERE user_id = p_user_id AND stamp_id = p_stamp_id),
      true,
      'local',
      true,
      0.7,
      jsonb_build_object(
        'stamp_id', p_stamp_id,
        'evolution_tier', new_tier,
        'evolution_count', current_count,
        'evolved_name', evolution_record.evolved_name
      )
    );
    
    RETURN new_tier;
  END IF;
  
  RETURN 'base';
END;
$$;