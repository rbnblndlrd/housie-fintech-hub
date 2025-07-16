-- Create meta-chain tracking system for "Track of Tracks" - CORRECTED VERSION

-- Meta-chain definitions table
CREATE TABLE public.meta_chain_definitions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  trigger_requirements JSONB NOT NULL DEFAULT '{}',
  required_chain_count INTEGER NOT NULL DEFAULT 5,
  required_chain_types JSONB DEFAULT NULL,
  special_conditions JSONB DEFAULT '{}',
  reward_type TEXT NOT NULL DEFAULT 'title',
  reward_data JSONB DEFAULT '{}',
  prestige_title TEXT,
  annette_voice_line TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- User meta-chain achievements
CREATE TABLE public.user_meta_chains (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  meta_chain_id TEXT NOT NULL REFERENCES meta_chain_definitions(id),
  achieved_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  sealed_chain_sequence UUID[] NOT NULL DEFAULT '{}',
  achievement_context JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, meta_chain_id)
);

-- Chain sealing order tracking (extends existing functionality)
CREATE TABLE public.chain_seal_timeline (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  chain_id UUID NOT NULL REFERENCES canonical_chains(id),
  sealed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  seal_annotation TEXT,
  chain_title TEXT NOT NULL,
  chain_theme TEXT,
  prestige_title_awarded TEXT,
  meta_significance TEXT,
  sequence_position INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add public timeline flag to user_profiles
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS allow_public_timeline BOOLEAN NOT NULL DEFAULT false;

-- Enable RLS
ALTER TABLE public.meta_chain_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_meta_chains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chain_seal_timeline ENABLE ROW LEVEL SECURITY;

-- RLS Policies for meta_chain_definitions
CREATE POLICY "Anyone can view meta chain definitions"
ON public.meta_chain_definitions FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage meta chain definitions"
ON public.meta_chain_definitions FOR ALL
USING (EXISTS (
  SELECT 1 FROM public.users 
  WHERE id = auth.uid() AND user_role = 'admin'
));

-- RLS Policies for user_meta_chains
CREATE POLICY "Users can view their own meta chains"
ON public.user_meta_chains FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "System can insert meta chain achievements"
ON public.user_meta_chains FOR INSERT
WITH CHECK (true);

-- RLS Policies for chain_seal_timeline
CREATE POLICY "Users can view their own chain timeline"
ON public.chain_seal_timeline FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can view public chain timelines"
ON public.chain_seal_timeline FOR SELECT
USING (user_id IN (
  SELECT user_id FROM user_profiles WHERE allow_public_timeline = true
));

CREATE POLICY "System can insert chain seal records"
ON public.chain_seal_timeline FOR INSERT
WITH CHECK (true);

-- Insert the first meta-chain: "Kind of a Big Deal"
INSERT INTO public.meta_chain_definitions (
  id,
  name,
  description,
  trigger_requirements,
  required_chain_count,
  prestige_title,
  annette_voice_line,
  reward_data
) VALUES (
  'kind-of-big-deal',
  'Kind of a Big Deal',
  'You don''t just finish arcs. You build universes.',
  '{"any_chains": true, "min_sealed": 5}',
  5,
  'Kind of a Big Deal',
  'Five Chains. One reality-bender. Kind of a big deal, aren''t we?',
  '{"badge_type": "prestige", "profile_enhancement": true, "special_aura": "legend"}'
);

-- Insert additional meta-chains with corrected JSONB format
INSERT INTO public.meta_chain_definitions (
  id,
  name,
  description,
  trigger_requirements,
  required_chain_count,
  required_chain_types,
  prestige_title,
  annette_voice_line
) VALUES 
(
  'legend-in-motion',
  'Legend in Motion',
  'Mastery across service zones - distance means nothing to legends.',
  '{"zone_diversity": true, "different_categories": 3}',
  3,
  '{"provider": 2, "customer": 1}',
  'Legend in Motion',
  'Three zones. One legend. Motion itself bows to your will.'
),
(
  'storybound',
  'Storybound',
  'Every seal tells a story, and you tell them all.',
  '{"annotation_requirement": true, "detailed_seals": 3}',
  3,
  NULL,
  'Storybound',
  'Words become legend when you''re the one writing the story.'
);

-- Function to detect and award meta-chains
CREATE OR REPLACE FUNCTION public.detect_meta_chain_achievements(p_user_id UUID, p_chain_id UUID)
RETURNS TABLE(meta_chain_awarded TEXT, title_earned TEXT, voice_line TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  sealed_count INTEGER;
  chain_record RECORD;
  meta_def RECORD;
  timeline_record RECORD;
  seq_position INTEGER;
BEGIN
  -- Get chain details
  SELECT * INTO chain_record 
  FROM canonical_chains 
  WHERE id = p_chain_id AND user_id = p_user_id;
  
  IF NOT FOUND THEN
    RETURN;
  END IF;
  
  -- Count current sealed chains for this user
  SELECT COUNT(*) INTO sealed_count
  FROM canonical_chains
  WHERE user_id = p_user_id AND is_complete = true;
  
  -- Determine sequence position
  seq_position := sealed_count;
  
  -- Record this seal in timeline
  INSERT INTO chain_seal_timeline (
    user_id,
    chain_id,
    chain_title,
    chain_theme,
    prestige_title_awarded,
    sequence_position,
    seal_annotation
  ) VALUES (
    p_user_id,
    p_chain_id,
    chain_record.title,
    chain_record.theme,
    chain_record.prestige_title_awarded,
    seq_position,
    chain_record.completion_annotation
  );
  
  -- Check for meta-chain achievements
  FOR meta_def IN 
    SELECT * FROM meta_chain_definitions 
    WHERE is_active = true
  LOOP
    -- Skip if already achieved
    IF EXISTS (
      SELECT 1 FROM user_meta_chains 
      WHERE user_id = p_user_id AND meta_chain_id = meta_def.id
    ) THEN
      CONTINUE;
    END IF;
    
    -- Check "Kind of a Big Deal" - 5 sealed chains
    IF meta_def.id = 'kind-of-big-deal' AND sealed_count >= 5 THEN
      -- Award the meta-chain
      INSERT INTO user_meta_chains (user_id, meta_chain_id, sealed_chain_sequence, achievement_context)
      VALUES (
        p_user_id,
        meta_def.id,
        (SELECT ARRAY_AGG(chain_id ORDER BY sealed_at) FROM chain_seal_timeline WHERE user_id = p_user_id),
        jsonb_build_object('total_chains', sealed_count, 'achievement_trigger', 'chain_count')
      );
      
      -- Broadcast meta achievement
      PERFORM broadcast_canon_event(
        'meta_chain_achieved',
        p_user_id,
        'user_meta_chains',
        (SELECT id FROM user_meta_chains WHERE user_id = p_user_id AND meta_chain_id = meta_def.id),
        true,
        'city',
        true,
        1.0,
        jsonb_build_object('meta_chain_name', meta_def.name, 'chains_sealed', sealed_count)
      );
      
      meta_chain_awarded := meta_def.name;
      title_earned := meta_def.prestige_title;
      voice_line := meta_def.annette_voice_line;
      RETURN NEXT;
    END IF;
    
    -- Check "Storybound" - 3 chains with annotations
    IF meta_def.id = 'storybound' THEN
      IF (SELECT COUNT(*) FROM chain_seal_timeline 
          WHERE user_id = p_user_id 
          AND seal_annotation IS NOT NULL 
          AND LENGTH(seal_annotation) > 10) >= 3 THEN
        
        INSERT INTO user_meta_chains (user_id, meta_chain_id, sealed_chain_sequence, achievement_context)
        VALUES (
          p_user_id,
          meta_def.id,
          (SELECT ARRAY_AGG(chain_id ORDER BY sealed_at) FROM chain_seal_timeline WHERE user_id = p_user_id),
          jsonb_build_object('annotation_chains', 3, 'achievement_trigger', 'storytelling')
        );
        
        PERFORM broadcast_canon_event(
          'meta_chain_achieved',
          p_user_id,
          'user_meta_chains',
          (SELECT id FROM user_meta_chains WHERE user_id = p_user_id AND meta_chain_id = meta_def.id),
          true,
          'city',
          true,
          1.0,
          jsonb_build_object('meta_chain_name', meta_def.name, 'storytelling_focus', true)
        );
        
        meta_chain_awarded := meta_def.name;
        title_earned := meta_def.prestige_title;
        voice_line := meta_def.annette_voice_line;
        RETURN NEXT;
      END IF;
    END IF;
  END LOOP;
  
  RETURN;
END;
$$;

-- Update the seal_canonical_chain function to trigger meta-chain detection
CREATE OR REPLACE FUNCTION public.seal_canonical_chain(p_chain_id UUID, p_final_stamp_id TEXT DEFAULT NULL, p_annotation TEXT DEFAULT NULL)
RETURNS TABLE(success BOOLEAN, prestige_title TEXT, voice_line TEXT, meta_achievement TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_id_val UUID;
  chain_record RECORD;
  title_awarded TEXT;
  voice_line_val TEXT;
  meta_result RECORD;
  meta_achievement_name TEXT;
BEGIN
  user_id_val := auth.uid();
  
  IF user_id_val IS NULL THEN
    success := false;
    RETURN NEXT;
    RETURN;
  END IF;
  
  -- Get and update the chain
  SELECT * INTO chain_record FROM canonical_chains 
  WHERE id = p_chain_id AND user_id = user_id_val AND is_complete = false;
  
  IF NOT FOUND THEN
    success := false;
    RETURN NEXT;
    RETURN;
  END IF;
  
  -- Seal the chain
  UPDATE canonical_chains 
  SET 
    is_complete = true,
    completed_at = now(),
    completion_annotation = p_annotation,
    completed_stamp_id = p_final_stamp_id,
    prestige_title_awarded = CASE 
      WHEN chain_record.theme = 'wellness_whisperer' THEN 'Wellness Whisperer'
      WHEN chain_record.theme = 'excellence_pursuit' THEN 'Excellence Embodied'
      WHEN chain_record.theme = 'neighborhood_hero' THEN 'Neighborhood Champion'
      WHEN chain_record.theme = 'patron_arc' THEN 'Patron Saint'
      WHEN chain_record.theme = 'curated_life' THEN 'Curated Taste'
      WHEN chain_record.theme = 'community_pulse' THEN 'Neighborhood Anchor'
      ELSE 'Chain Master'
    END
  WHERE id = p_chain_id;
  
  -- Get the awarded title
  SELECT prestige_title_awarded INTO title_awarded 
  FROM canonical_chains WHERE id = p_chain_id;
  
  -- Check for meta-chain achievements
  FOR meta_result IN 
    SELECT * FROM detect_meta_chain_achievements(user_id_val, p_chain_id)
  LOOP
    meta_achievement_name := meta_result.meta_chain_awarded;
    voice_line_val := meta_result.voice_line;
  END LOOP;
  
  -- Return results
  success := true;
  prestige_title := title_awarded;
  voice_line := voice_line_val;
  meta_achievement := meta_achievement_name;
  RETURN NEXT;
END;
$$;

-- Update triggers
CREATE TRIGGER update_meta_chain_definitions_updated_at
BEFORE UPDATE ON public.meta_chain_definitions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to get user's chain browser data
CREATE OR REPLACE FUNCTION public.get_user_chain_browser_data(p_user_id UUID)
RETURNS TABLE(
  chain_id UUID,
  title TEXT,
  theme TEXT,
  progression_stage INTEGER,
  total_stages INTEGER,
  is_complete BOOLEAN,
  is_public BOOLEAN,
  sealed_at TIMESTAMP WITH TIME ZONE,
  prestige_title_awarded TEXT,
  seal_annotation TEXT,
  category TEXT,
  role_type TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cc.id as chain_id,
    cc.title,
    cc.theme,
    cc.progression_stage,
    cc.total_stages,
    cc.is_complete,
    cc.is_public,
    cc.completed_at as sealed_at,
    cc.prestige_title_awarded,
    cc.completion_annotation as seal_annotation,
    CASE 
      WHEN cc.theme IN ('wellness_whisperer', 'excellence_pursuit', 'neighborhood_hero') THEN 'Provider'
      WHEN cc.theme IN ('patron_arc', 'curated_life', 'community_pulse') THEN 'Customer'
      ELSE 'General'
    END as category,
    CASE 
      WHEN cc.theme IN ('wellness_whisperer', 'excellence_pursuit', 'neighborhood_hero') THEN 'provider'
      WHEN cc.theme IN ('patron_arc', 'curated_life', 'community_pulse') THEN 'customer'
      ELSE 'general'
    END as role_type
  FROM canonical_chains cc
  WHERE cc.user_id = p_user_id
  ORDER BY 
    cc.is_complete ASC,
    cc.completed_at DESC NULLS LAST,
    cc.created_at DESC;
END;
$$;