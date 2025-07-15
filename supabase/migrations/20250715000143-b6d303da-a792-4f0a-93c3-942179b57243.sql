-- Create fusion stamp definitions table
CREATE TABLE public.fusion_stamp_definitions (
  id text PRIMARY KEY,
  name text NOT NULL,
  required_stamp_ids text[] NOT NULL,
  flavor_text text NOT NULL,
  annette_voice_lines text[] DEFAULT '{}',
  icon_url text,
  canon_multiplier numeric DEFAULT 1.0,
  unlockable_at_tier integer DEFAULT 1,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create user fusion stamps table
CREATE TABLE public.user_fusion_stamps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  fusion_stamp_id text NOT NULL REFERENCES fusion_stamp_definitions(id),
  source_stamp_ids text[] NOT NULL,
  crafted_at timestamp with time zone DEFAULT now(),
  is_equipped boolean DEFAULT false,
  display_position integer,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, fusion_stamp_id)
);

-- Create user showcase settings table
CREATE TABLE public.user_showcase_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  room_title text DEFAULT 'Achievement Gallery',
  room_theme text DEFAULT 'dark',
  annette_intro_line text,
  widget_layout jsonb DEFAULT '{}',
  is_public boolean DEFAULT true,
  featured_stamp_ids text[] DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.fusion_stamp_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_fusion_stamps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_showcase_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for fusion_stamp_definitions
CREATE POLICY "Anyone can view fusion stamp definitions" ON public.fusion_stamp_definitions
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage fusion stamp definitions" ON public.fusion_stamp_definitions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND user_role = 'admin'
    )
  );

-- RLS Policies for user_fusion_stamps
CREATE POLICY "Users can view their own fusion stamps" ON public.user_fusion_stamps
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own fusion stamps" ON public.user_fusion_stamps
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own fusion stamps" ON public.user_fusion_stamps
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view public user fusion stamps" ON public.user_fusion_stamps
  FOR SELECT USING (
    user_id IN (
      SELECT user_id FROM user_showcase_settings 
      WHERE is_public = true
    )
  );

-- RLS Policies for user_showcase_settings
CREATE POLICY "Users can manage their own showcase settings" ON public.user_showcase_settings
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view public showcase settings" ON public.user_showcase_settings
  FOR SELECT USING (is_public = true);

-- Insert sample fusion stamp definitions with proper array syntax
INSERT INTO public.fusion_stamp_definitions (id, name, required_stamp_ids, flavor_text, annette_voice_lines, canon_multiplier, unlockable_at_tier) VALUES
('master-craftsman', 'Master Craftsman', ARRAY['quality-assured', 'repeat-customer', 'five-star-sweep'], 'Excellence refined through repetition. When skill meets consistency, legends are born.', ARRAY['Fusion complete. Excellence just got evolutionary.', 'Three stamps, one truth: mastery demands dedication.'], 1.5, 2),
('speed-demon', 'Speed Demon', ARRAY['blitzmaster', 'clockwork', 'efficiency-expert'], 'Time bends to those who master its rhythm. Speed without sacrifice, precision without pause.', ARRAY['Velocity fused with precision. That''s how you bend time.', 'Three speeds, one blur. Efficiency just got personal.'], 1.3, 1),
('canon-guardian', 'Canon Guardian', ARRAY['road-warrior', 'solo-operator', 'network-builder'], 'Protector of the grid. Guardian of the Canon. When trust needs a champion, they answer.', ARRAY['Canon Guardian unlocked. The grid has its sentinel.', 'Trust weaponized. Guardian mode: activated.'], 2.0, 3),
('echo-amplifier', 'Echo Amplifier', ARRAY['broadcaster', 'influencer', 'community-voice'], 'Voice that carries across cities. Echo that shapes the Canon. When words become power.', ARRAY['Echo Amplifier online. Your voice just got citywide range.', 'Three voices, one signal. Broadcasting excellence.'], 1.8, 2);

-- Create fusion eligibility check function
CREATE OR REPLACE FUNCTION public.check_fusion_eligibility(p_user_id uuid, p_fusion_id text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  required_stamps text[];
  user_stamps text[];
  user_tier integer;
  required_tier integer;
BEGIN
  -- Get required stamps and tier for fusion
  SELECT required_stamp_ids, unlockable_at_tier 
  INTO required_stamps, required_tier
  FROM fusion_stamp_definitions 
  WHERE id = p_fusion_id;
  
  IF required_stamps IS NULL THEN
    RETURN false;
  END IF;
  
  -- Get user's prestige tier (simplified - use community rating points for now)
  SELECT COALESCE(
    FLOOR(COALESCE(community_rating_points, 0) / 50) + 1,
    1
  ) INTO user_tier
  FROM provider_profiles 
  WHERE user_id = p_user_id;
  
  -- Default to tier 1 if no provider profile
  user_tier := COALESCE(user_tier, 1);
  
  -- Check tier requirement
  IF user_tier < required_tier THEN
    RETURN false;
  END IF;
  
  -- Get user's earned stamps
  SELECT array_agg(stamp_id) 
  INTO user_stamps
  FROM user_stamps 
  WHERE user_id = p_user_id;
  
  -- Check if user has all required stamps
  RETURN required_stamps <@ COALESCE(user_stamps, ARRAY[]::text[]);
END;
$$;

-- Create fusion stamp crafting function
CREATE OR REPLACE FUNCTION public.craft_fusion_stamp(p_user_id uuid, p_fusion_id text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
  fusion_record record;
BEGIN
  -- Check eligibility
  IF NOT check_fusion_eligibility(p_user_id, p_fusion_id) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Not eligible for this fusion');
  END IF;
  
  -- Check if already crafted
  IF EXISTS (SELECT 1 FROM user_fusion_stamps WHERE user_id = p_user_id AND fusion_stamp_id = p_fusion_id) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Fusion stamp already crafted');
  END IF;
  
  -- Get fusion details
  SELECT * INTO fusion_record FROM fusion_stamp_definitions WHERE id = p_fusion_id;
  
  -- Craft the fusion stamp
  INSERT INTO user_fusion_stamps (user_id, fusion_stamp_id, source_stamp_ids)
  VALUES (p_user_id, p_fusion_id, fusion_record.required_stamp_ids);
  
  -- Create broadcast event for fusion crafting
  PERFORM broadcast_canon_event(
    'fusion_stamp_crafted',
    p_user_id,
    'user_fusion_stamps',
    (SELECT id FROM user_fusion_stamps WHERE user_id = p_user_id AND fusion_stamp_id = p_fusion_id),
    true,
    'local',
    true,
    0.9,
    jsonb_build_object('fusion_name', fusion_record.name)
  );
  
  RETURN jsonb_build_object(
    'success', true, 
    'fusion_name', fusion_record.name,
    'voice_line', COALESCE(fusion_record.annette_voice_lines[1], 'Fusion complete.')
  );
END;
$$;

-- Add triggers for updated_at
CREATE TRIGGER update_fusion_stamp_definitions_updated_at
  BEFORE UPDATE ON public.fusion_stamp_definitions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_showcase_settings_updated_at
  BEFORE UPDATE ON public.user_showcase_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();