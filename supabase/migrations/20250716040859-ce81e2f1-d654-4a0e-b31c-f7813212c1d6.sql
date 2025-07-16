-- Create stamp storylines table
CREATE TABLE public.stamp_storylines (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  storyline_type text NOT NULL, -- 'neighborhood_hero', 'wellness_whisperer', 'crew_commander', etc.
  title text NOT NULL,
  description text,
  progression_stage integer NOT NULL DEFAULT 0,
  total_stages integer NOT NULL DEFAULT 3,
  is_complete boolean NOT NULL DEFAULT false,
  theme_color text DEFAULT '#6B7280',
  icon text DEFAULT '📜',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  completed_at timestamp with time zone,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Create canonical chains table
CREATE TABLE public.canonical_chains (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  is_public boolean NOT NULL DEFAULT false,
  chain_sequence integer[], -- Array of stamp IDs in order
  storyline_ids uuid[], -- Associated storylines
  prestige_score integer NOT NULL DEFAULT 0,
  theme text DEFAULT 'freelance_saga',
  visual_style text DEFAULT 'scroll',
  annotations jsonb DEFAULT '[]'::jsonb, -- User annotations per stamp
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  last_stamp_added_at timestamp with time zone,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Create storyline progressions table (links stamps to storylines)
CREATE TABLE public.storyline_progressions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  storyline_id uuid NOT NULL REFERENCES public.stamp_storylines(id) ON DELETE CASCADE,
  user_stamp_id uuid NOT NULL,
  stage_number integer NOT NULL,
  narrative_text text,
  trigger_context jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.stamp_storylines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.canonical_chains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.storyline_progressions ENABLE ROW LEVEL SECURITY;

-- RLS policies for stamp_storylines
CREATE POLICY "Users can view their own storylines" ON public.stamp_storylines
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own storylines" ON public.stamp_storylines
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own storylines" ON public.stamp_storylines
  FOR UPDATE USING (user_id = auth.uid());

-- RLS policies for canonical_chains
CREATE POLICY "Users can view their own chains" ON public.canonical_chains
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Anyone can view public chains" ON public.canonical_chains
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can manage their own chains" ON public.canonical_chains
  FOR ALL USING (user_id = auth.uid());

-- RLS policies for storyline_progressions
CREATE POLICY "Users can view progressions for their storylines" ON public.storyline_progressions
  FOR SELECT USING (
    storyline_id IN (
      SELECT id FROM public.stamp_storylines WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "System can manage storyline progressions" ON public.storyline_progressions
  FOR ALL USING (true);

-- Indexes for performance
CREATE INDEX idx_stamp_storylines_user_id ON public.stamp_storylines(user_id);
CREATE INDEX idx_stamp_storylines_type ON public.stamp_storylines(storyline_type);
CREATE INDEX idx_canonical_chains_user_id ON public.canonical_chains(user_id);
CREATE INDEX idx_canonical_chains_public ON public.canonical_chains(is_public);
CREATE INDEX idx_storyline_progressions_storyline ON public.storyline_progressions(storyline_id);

-- Update triggers for updated_at
CREATE OR REPLACE FUNCTION update_stamp_storylines_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_canonical_chains_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_stamp_storylines_timestamp
  BEFORE UPDATE ON public.stamp_storylines
  FOR EACH ROW
  EXECUTE FUNCTION update_stamp_storylines_updated_at();

CREATE TRIGGER update_canonical_chains_timestamp
  BEFORE UPDATE ON public.canonical_chains
  FOR EACH ROW
  EXECUTE FUNCTION update_canonical_chains_updated_at();

-- Function to evaluate and progress storylines when stamps are awarded
CREATE OR REPLACE FUNCTION evaluate_storyline_progression(p_user_id uuid, p_stamp_id text, p_context_data jsonb)
RETURNS TABLE(storyline_id uuid, stage_advanced boolean, storyline_complete boolean) AS $$
DECLARE
  user_stamp_record record;
  storyline_record record;
  user_stamps_count integer;
  progression_record record;
BEGIN
  -- Get the user_stamp record
  SELECT * INTO user_stamp_record 
  FROM user_stamps 
  WHERE user_id = p_user_id AND stamp_id = p_stamp_id
  ORDER BY earned_at DESC 
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN;
  END IF;

  -- Evaluate storyline triggers based on stamp category and patterns
  
  -- Neighborhood Hero storyline
  IF NOT EXISTS (SELECT 1 FROM stamp_storylines WHERE user_id = p_user_id AND storyline_type = 'neighborhood_hero') THEN
    -- Check if this stamp could start the storyline
    IF p_stamp_id IN ('faithful-return', 'cleanup-queen', 'early-bird') THEN
      INSERT INTO stamp_storylines (user_id, storyline_type, title, description, total_stages, theme_color, icon)
      VALUES (
        p_user_id,
        'neighborhood_hero',
        'Rise of a Neighborhood Hero',
        'From first local job to beloved neighborhood fixture',
        5,
        '#10B981',
        '🏘️'
      );
    END IF;
  END IF;

  -- Wellness Whisperer storyline
  IF NOT EXISTS (SELECT 1 FROM stamp_storylines WHERE user_id = p_user_id AND storyline_type = 'wellness_whisperer') THEN
    -- Check wellness-related stamps
    IF p_stamp_id IN ('five-star-sweep', 'faithful-return') THEN
      INSERT INTO stamp_storylines (user_id, storyline_type, title, description, total_stages, theme_color, icon)
      VALUES (
        p_user_id,
        'wellness_whisperer',
        'The Wellness Whisperer',
        'Mastering the art of personal care and wellness services',
        4,
        '#8B5CF6',
        '🧘‍♀️'
      );
    END IF;
  END IF;

  -- Road Warrior storyline
  IF NOT EXISTS (SELECT 1 FROM stamp_storylines WHERE user_id = p_user_id AND storyline_type = 'road_warrior') THEN
    IF p_stamp_id IN ('road-warrior', 'storm-rider', 'blitzmaster') THEN
      INSERT INTO stamp_storylines (user_id, storyline_type, title, description, total_stages, theme_color, icon)
      VALUES (
        p_user_id,
        'road_warrior',
        'Road Warrior Chronicles',
        'Conquering distance, weather, and time across the city',
        4,
        '#F59E0B',
        '🛣️'
      );
    END IF;
  END IF;

  -- Excellence Pursuit storyline
  IF NOT EXISTS (SELECT 1 FROM stamp_storylines WHERE user_id = p_user_id AND storyline_type = 'excellence_pursuit') THEN
    IF p_stamp_id IN ('five-star-sweep', 'clockwork', 'solo-operator') THEN
      INSERT INTO stamp_storylines (user_id, storyline_type, title, description, total_stages, theme_color, icon)
      VALUES (
        p_user_id,
        'excellence_pursuit',
        'Pursuit of Excellence',
        'The relentless quest for perfect service delivery',
        6,
        '#EF4444',
        '⭐'
      );
    END IF;
  END IF;

  -- Process existing storylines
  FOR storyline_record IN 
    SELECT * FROM stamp_storylines 
    WHERE user_id = p_user_id AND is_complete = false
  LOOP
    -- Check if this stamp progresses the storyline
    CASE storyline_record.storyline_type
      WHEN 'neighborhood_hero' THEN
        IF p_stamp_id IN ('faithful-return', 'cleanup-queen', 'early-bird', 'five-star-sweep') THEN
          -- Advance stage
          UPDATE stamp_storylines 
          SET progression_stage = LEAST(progression_stage + 1, total_stages),
              is_complete = (progression_stage + 1 >= total_stages),
              completed_at = CASE WHEN (progression_stage + 1 >= total_stages) THEN now() ELSE completed_at END
          WHERE id = storyline_record.id;
          
          -- Create progression record
          INSERT INTO storyline_progressions (storyline_id, user_stamp_id, stage_number, narrative_text, trigger_context)
          VALUES (
            storyline_record.id,
            user_stamp_record.id,
            storyline_record.progression_stage + 1,
            'Another step in becoming the neighborhood hero',
            p_context_data
          );
          
          storyline_id := storyline_record.id;
          stage_advanced := true;
          storyline_complete := (storyline_record.progression_stage + 1 >= storyline_record.total_stages);
          RETURN NEXT;
        END IF;
        
      WHEN 'wellness_whisperer' THEN
        IF p_stamp_id IN ('five-star-sweep', 'faithful-return', 'cleanup-queen') THEN
          UPDATE stamp_storylines 
          SET progression_stage = LEAST(progression_stage + 1, total_stages),
              is_complete = (progression_stage + 1 >= total_stages),
              completed_at = CASE WHEN (progression_stage + 1 >= total_stages) THEN now() ELSE completed_at END
          WHERE id = storyline_record.id;
          
          INSERT INTO storyline_progressions (storyline_id, user_stamp_id, stage_number, narrative_text, trigger_context)
          VALUES (
            storyline_record.id,
            user_stamp_record.id,
            storyline_record.progression_stage + 1,
            'Advancing in the wellness mastery journey',
            p_context_data
          );
          
          storyline_id := storyline_record.id;
          stage_advanced := true;
          storyline_complete := (storyline_record.progression_stage + 1 >= storyline_record.total_stages);
          RETURN NEXT;
        END IF;
        
      WHEN 'road_warrior' THEN
        IF p_stamp_id IN ('road-warrior', 'storm-rider', 'blitzmaster', 'early-bird') THEN
          UPDATE stamp_storylines 
          SET progression_stage = LEAST(progression_stage + 1, total_stages),
              is_complete = (progression_stage + 1 >= total_stages),
              completed_at = CASE WHEN (progression_stage + 1 >= total_stages) THEN now() ELSE completed_at END
          WHERE id = storyline_record.id;
          
          INSERT INTO storyline_progressions (storyline_id, user_stamp_id, stage_number, narrative_text, trigger_context)
          VALUES (
            storyline_record.id,
            user_stamp_record.id,
            storyline_record.progression_stage + 1,
            'Journey continues on the roads less traveled',
            p_context_data
          );
          
          storyline_id := storyline_record.id;
          stage_advanced := true;
          storyline_complete := (storyline_record.progression_stage + 1 >= storyline_record.total_stages);
          RETURN NEXT;
        END IF;
        
      WHEN 'excellence_pursuit' THEN
        IF p_stamp_id IN ('five-star-sweep', 'clockwork', 'solo-operator', 'blitzmaster') THEN
          UPDATE stamp_storylines 
          SET progression_stage = LEAST(progression_stage + 1, total_stages),
              is_complete = (progression_stage + 1 >= total_stages),
              completed_at = CASE WHEN (progression_stage + 1 >= total_stages) THEN now() ELSE completed_at END
          WHERE id = storyline_record.id;
          
          INSERT INTO storyline_progressions (storyline_id, user_stamp_id, stage_number, narrative_text, trigger_context)
          VALUES (
            storyline_record.id,
            user_stamp_record.id,
            storyline_record.progression_stage + 1,
            'Excellence is not an act, but a habit',
            p_context_data
          );
          
          storyline_id := storyline_record.id;
          stage_advanced := true;
          storyline_complete := (storyline_record.progression_stage + 1 >= storyline_record.total_stages);
          RETURN NEXT;
        END IF;
    END CASE;
  END LOOP;
  
  RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create or update canonical chains
CREATE OR REPLACE FUNCTION update_canonical_chain(p_user_id uuid)
RETURNS void AS $$
DECLARE
  chain_record record;
  user_stamps_sequence integer[];
  storyline_ids_array uuid[];
BEGIN
  -- Get user's stamps in chronological order
  SELECT ARRAY_AGG(stamp_id ORDER BY earned_at) INTO user_stamps_sequence
  FROM user_stamps 
  WHERE user_id = p_user_id;
  
  -- Get associated storyline IDs
  SELECT ARRAY_AGG(DISTINCT id) INTO storyline_ids_array
  FROM stamp_storylines 
  WHERE user_id = p_user_id;
  
  -- Calculate prestige score (simplified)
  -- Check if user has a canonical chain
  IF EXISTS (SELECT 1 FROM canonical_chains WHERE user_id = p_user_id) THEN
    -- Update existing chain
    UPDATE canonical_chains 
    SET 
      chain_sequence = user_stamps_sequence,
      storyline_ids = COALESCE(storyline_ids_array, ARRAY[]::uuid[]),
      prestige_score = COALESCE(array_length(user_stamps_sequence, 1), 0) * 10,
      last_stamp_added_at = now(),
      updated_at = now()
    WHERE user_id = p_user_id;
  ELSE
    -- Create new chain
    INSERT INTO canonical_chains (
      user_id, 
      title, 
      description, 
      chain_sequence, 
      storyline_ids, 
      prestige_score,
      last_stamp_added_at
    ) VALUES (
      p_user_id,
      'My Canonical Chain',
      'The verified story of my journey through HOUSIE',
      user_stamps_sequence,
      COALESCE(storyline_ids_array, ARRAY[]::uuid[]),
      COALESCE(array_length(user_stamps_sequence, 1), 0) * 10,
      now()
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;