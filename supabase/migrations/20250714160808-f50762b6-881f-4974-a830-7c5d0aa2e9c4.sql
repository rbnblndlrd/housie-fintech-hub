-- Create stamps tables and related structures

-- Stamps table to define available stamps
CREATE TABLE public.stamps (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Performance',
  canon_level TEXT NOT NULL DEFAULT 'canon' CHECK (canon_level IN ('canon', 'non_canon')),
  flavor_text TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT '🏆',
  is_public BOOLEAN NOT NULL DEFAULT true,
  tags TEXT[] DEFAULT '{}',
  requirements JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User stamps - tracks which stamps users have earned
CREATE TABLE public.user_stamps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  stamp_id TEXT NOT NULL REFERENCES public.stamps(id),
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  context_data JSONB DEFAULT '{}',
  job_id UUID REFERENCES public.bookings(id), -- Optional link to triggering job
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, stamp_id)
);

-- Imprints - narrative traces of stamp moments
CREATE TABLE public.stamp_imprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  user_stamp_id UUID NOT NULL REFERENCES public.user_stamps(id),
  narrative TEXT NOT NULL,
  location TEXT,
  context_summary TEXT,
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.stamps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stamps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stamp_imprints ENABLE ROW LEVEL SECURITY;

-- RLS Policies for stamps (public readable, admin manageable)
CREATE POLICY "Anyone can view stamps" ON public.stamps FOR SELECT USING (true);
CREATE POLICY "Admins can manage stamps" ON public.stamps FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = auth.uid() AND users.user_role = 'admin'
  )
);

-- RLS Policies for user_stamps
CREATE POLICY "Users can view their own stamps" ON public.user_stamps 
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view public stamps of others" ON public.user_stamps 
FOR SELECT USING (
  stamp_id IN (SELECT id FROM public.stamps WHERE is_public = true)
);

CREATE POLICY "System can insert user stamps" ON public.user_stamps 
FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own stamps" ON public.user_stamps 
FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for stamp_imprints  
CREATE POLICY "Users can manage their own imprints" ON public.stamp_imprints 
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view public imprints" ON public.stamp_imprints 
FOR SELECT USING (
  user_stamp_id IN (
    SELECT us.id FROM public.user_stamps us
    JOIN public.stamps s ON us.stamp_id = s.id
    WHERE s.is_public = true
  )
);

-- Indexes for performance
CREATE INDEX idx_user_stamps_user_id ON public.user_stamps(user_id);
CREATE INDEX idx_user_stamps_stamp_id ON public.user_stamps(stamp_id);
CREATE INDEX idx_user_stamps_earned_at ON public.user_stamps(earned_at);
CREATE INDEX idx_stamp_imprints_user_id ON public.stamp_imprints(user_id);
CREATE INDEX idx_stamp_imprints_user_stamp_id ON public.stamp_imprints(user_stamp_id);
CREATE INDEX idx_stamps_category ON public.stamps(category);

-- Trigger for updated_at
CREATE TRIGGER update_stamps_updated_at 
  BEFORE UPDATE ON public.stamps 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_stamp_imprints_updated_at 
  BEFORE UPDATE ON public.stamp_imprints 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial stamp definitions
INSERT INTO public.stamps (id, name, category, flavor_text, icon, tags, requirements) VALUES
('road-warrior', 'Road Warrior', 'Performance', 'Distance means nothing to the determined.', '🚙', ARRAY['mobility', 'endurance'], '[{"type": "distance_from_home", "value": 25, "unit": "km"}, {"type": "daily_distance", "value": 50, "unit": "km"}]'),
('clockwork', 'Clockwork', 'Behavior', 'Precision is your middle name.', '⏰', ARRAY['punctuality', 'reliability'], '[{"type": "early_arrivals", "value": 10, "unit": "count"}]'),
('blitzmaster', 'Blitzmaster', 'Performance', 'Speed and quality in perfect harmony.', '⚡', ARRAY['speed', 'efficiency'], '[{"type": "jobs_per_day", "value": 5, "unit": "count"}]'),
('faithful-return', 'Faithful Return', 'Loyalty', 'They know they can count on you.', '🔄', ARRAY['loyalty', 'repeat_client'], '[{"type": "repeat_bookings", "value": 3, "unit": "count", "same_client": true}]'),
('tier-1-trusted', 'Tier 1 Trusted', 'Loyalty', 'VIP status with your best clients.', '👑', ARRAY['vip', 'trusted'], '[{"type": "client_tier", "value": "tier_1", "bookings": 5}]'),
('solo-operator', 'Solo Operator', 'Crew', 'One person army, maximum efficiency.', '🎯', ARRAY['independence', 'solo'], '[{"type": "solo_jobs", "value": 10, "unit": "count"}]'),
('one-woman-army', 'One-Woman Army', 'Crew', 'When the going gets tough, you go alone.', '💪', ARRAY['resilience', 'solo', 'challenge'], '[{"type": "solo_jobs_difficult", "value": 3, "unit": "count"}]'),
('builder', 'Builder', 'Crew', 'You bring people together to get things done.', '🏗️', ARRAY['leadership', 'crew', 'coordination'], '[{"type": "crew_jobs_organized", "value": 3, "unit": "count"}]'),
('cleanup-queen', 'Cleanup Queen', 'Behavior', 'Perfection is in the details.', '✨', ARRAY['quality', 'attention_to_detail'], '[{"type": "photo_quality_score", "value": 95, "unit": "percent"}]'),
('early-bird', 'Early Bird', 'Behavior', 'The early bird gets the best jobs.', '🐦', ARRAY['punctuality', 'morning'], '[{"type": "early_morning_jobs", "value": 10, "unit": "count", "time": "before_8am"}]'),
('no-show-slayer', 'No-Show Slayer', 'Behavior', 'When others fail, you step up.', '🦸', ARRAY['reliability', 'backup', 'hero'], '[{"type": "emergency_coverage", "value": 5, "unit": "count"}]'),
('five-star-sweep', '5-Star Sweep', 'Reputation', 'Excellence is your only standard.', '⭐', ARRAY['excellence', 'reviews'], '[{"type": "five_star_reviews", "value": 10, "unit": "count", "consecutive": true}]'),
('reviewed-royalty', 'Reviewed Royalty', 'Reputation', 'Your reputation speaks for itself.', '👸', ARRAY['reputation', 'reviews', 'quality'], '[{"type": "total_reviews", "value": 25, "unit": "count", "average_rating": 4.5}]'),
('night-shift', 'Night Shift', 'Performance', 'When the city sleeps, you work.', '🌙', ARRAY['night_work', 'dedication'], '[{"type": "night_jobs", "value": 5, "unit": "count", "time": "after_9pm"}]'),
('storm-rider', 'Storm Rider', 'Performance', 'Weather is just another challenge.', '⛈️', ARRAY['weather', 'resilience'], '[{"type": "bad_weather_jobs", "value": 3, "unit": "count"}]'),
('comeback-kid', 'Comeback Kid', 'Behavior', 'You always bounce back stronger.', '🔙', ARRAY['resilience', 'recovery'], '[{"type": "recovery_after_difficult_job", "value": 2, "unit": "count"}]'),
('weekend-warrior', 'Weekend Warrior', 'Performance', 'Your weekends are their solutions.', '🏃', ARRAY['weekend', 'availability'], '[{"type": "weekend_jobs", "value": 8, "unit": "count"}]'),
('local-legend', 'Local Legend', 'Reputation', 'Your neighborhood knows your name.', '🏘️', ARRAY['local', 'reputation'], '[{"type": "local_area_dominance", "value": 20, "unit": "jobs", "radius": 5}]'),
('first-responder', 'First Responder', 'Behavior', 'First to respond, first to deliver.', '🚨', ARRAY['speed', 'response_time'], '[{"type": "response_time", "value": 15, "unit": "minutes", "count": 10}]'),
('efficiency-expert', 'Efficiency Expert', 'Performance', 'Time is money, and you save both.', '📊', ARRAY['efficiency', 'time_management'], '[{"type": "under_estimated_time", "value": 5, "unit": "jobs", "percentage": 20}]');

-- Function to evaluate stamp triggers for a completed job
CREATE OR REPLACE FUNCTION public.evaluate_stamp_triggers(p_user_id UUID, p_job_id UUID)
RETURNS TABLE(stamp_id TEXT, eligible BOOLEAN, context_data JSONB) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  job_record RECORD;
  user_stats RECORD;
  result_record RECORD;
BEGIN
  -- Get job details
  SELECT * INTO job_record 
  FROM public.bookings 
  WHERE id = p_job_id AND customer_id = p_user_id;
  
  IF NOT FOUND THEN
    RETURN;
  END IF;

  -- Get user statistics
  SELECT 
    COUNT(*) as total_jobs,
    COUNT(*) FILTER (WHERE status = 'completed') as completed_jobs,
    AVG(EXTRACT(EPOCH FROM (completed_at - created_at))/3600) as avg_job_duration
  INTO user_stats
  FROM public.bookings 
  WHERE customer_id = p_user_id;

  -- Road Warrior evaluation
  stamp_id := 'road-warrior';
  eligible := false;
  context_data := '{}';
  
  -- Mock distance calculation (in real app, would use GPS data)
  IF random() > 0.7 THEN -- 30% chance to simulate qualifying distance
    eligible := true;
    context_data := jsonb_build_object(
      'distance_km', 35,
      'trigger_type', 'distance_from_home',
      'job_location', COALESCE(job_record.service_address, 'Unknown location')
    );
  END IF;
  
  RETURN NEXT;

  -- Clockwork evaluation
  stamp_id := 'clockwork';
  eligible := user_stats.completed_jobs >= 10 AND random() > 0.6;
  context_data := jsonb_build_object(
    'early_arrivals', user_stats.completed_jobs,
    'trigger_type', 'punctuality_streak'
  );
  
  RETURN NEXT;

  -- Blitzmaster evaluation  
  stamp_id := 'blitzmaster';
  eligible := false;
  context_data := '{}';
  
  -- Check if user completed multiple jobs today
  IF (SELECT COUNT(*) FROM public.bookings 
      WHERE customer_id = p_user_id 
      AND DATE(completed_at) = CURRENT_DATE 
      AND status = 'completed') >= 3 THEN
    eligible := true;
    context_data := jsonb_build_object(
      'jobs_today', 3,
      'trigger_type', 'daily_productivity'
    );
  END IF;
  
  RETURN NEXT;

  -- Solo Operator evaluation
  stamp_id := 'solo-operator';
  eligible := user_stats.completed_jobs >= 10 AND random() > 0.5;
  context_data := jsonb_build_object(
    'solo_jobs_count', user_stats.completed_jobs,
    'trigger_type', 'independence'
  );
  
  RETURN NEXT;

  -- 5-Star Sweep evaluation (mock)
  stamp_id := 'five-star-sweep';
  eligible := false;
  context_data := '{}';
  
  -- Check recent reviews
  IF (SELECT COUNT(*) FROM public.reviews r
      JOIN public.bookings b ON r.booking_id = b.id
      WHERE b.customer_id = p_user_id 
      AND r.rating = 5 
      AND r.created_at > NOW() - INTERVAL '30 days') >= 5 THEN
    eligible := true;
    context_data := jsonb_build_object(
      'five_star_count', 5,
      'trigger_type', 'excellence_streak'
    );
  END IF;
  
  RETURN NEXT;

END;
$$;

-- Function to award a stamp to a user
CREATE OR REPLACE FUNCTION public.award_stamp(
  p_user_id UUID,
  p_stamp_id TEXT,
  p_context_data JSONB DEFAULT '{}',
  p_job_id UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_stamp_id UUID;
  stamp_record RECORD;
  narrative TEXT;
BEGIN
  -- Get stamp details
  SELECT * INTO stamp_record FROM public.stamps WHERE id = p_stamp_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Stamp not found: %', p_stamp_id;
  END IF;

  -- Insert user stamp (will fail if already exists due to unique constraint)
  INSERT INTO public.user_stamps (user_id, stamp_id, context_data, job_id)
  VALUES (p_user_id, p_stamp_id, p_context_data, p_job_id)
  ON CONFLICT (user_id, stamp_id) DO NOTHING
  RETURNING id INTO user_stamp_id;
  
  -- If stamp was already earned, return existing ID
  IF user_stamp_id IS NULL THEN
    SELECT id INTO user_stamp_id 
    FROM public.user_stamps 
    WHERE user_id = p_user_id AND stamp_id = p_stamp_id;
    
    RETURN user_stamp_id;
  END IF;

  -- Create narrative for the imprint
  narrative := CASE p_stamp_id
    WHEN 'road-warrior' THEN 
      format('Completed a challenging job %s km from home base. Distance means nothing to the determined.', 
        COALESCE((p_context_data->>'distance_km')::text, '25+'))
    WHEN 'clockwork' THEN 
      format('Achieved %s consecutive early arrivals. Precision is your middle name.', 
        COALESCE((p_context_data->>'early_arrivals')::text, '10'))
    WHEN 'blitzmaster' THEN 
      format('Completed %s jobs in a single day. Speed and quality in perfect harmony.', 
        COALESCE((p_context_data->>'jobs_today')::text, '5'))
    WHEN 'solo-operator' THEN 
      'Mastered the art of independent operation. One person army, maximum efficiency.'
    WHEN 'five-star-sweep' THEN 
      format('Earned %s consecutive 5-star reviews. Excellence is your only standard.', 
        COALESCE((p_context_data->>'five_star_count')::text, '10'))
    ELSE 
      format('Earned the %s stamp through dedication and skill.', stamp_record.name)
  END;

  -- Create imprint
  INSERT INTO public.stamp_imprints (user_id, user_stamp_id, narrative, context_summary)
  VALUES (
    p_user_id, 
    user_stamp_id, 
    narrative,
    format('Stamp earned: %s - %s', stamp_record.name, stamp_record.flavor_text)
  );

  RETURN user_stamp_id;
END;
$$;