
-- Create enum types for gamification
CREATE TYPE achievement_category AS ENUM ('speed', 'quality', 'consistency', 'volume', 'customer_service', 'loyalty');
CREATE TYPE achievement_tier AS ENUM ('bronze', 'silver', 'gold', 'platinum', 'diamond');
CREATE TYPE territory_status AS ENUM ('claimed', 'contested', 'abandoned');
CREATE TYPE leaderboard_type AS ENUM ('weekly_earnings', 'monthly_bookings', 'customer_rating', 'response_time', 'territory_control');

-- User achievements table
CREATE TABLE public.user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  achievement_type achievement_category NOT NULL,
  achievement_name TEXT NOT NULL,
  achievement_tier achievement_tier NOT NULL DEFAULT 'bronze',
  points_awarded INTEGER DEFAULT 0,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Loyalty points system
CREATE TABLE public.loyalty_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  total_points INTEGER DEFAULT 0,
  available_points INTEGER DEFAULT 0,
  lifetime_earned INTEGER DEFAULT 0,
  tier_level TEXT DEFAULT 'bronze',
  tier_benefits JSONB DEFAULT '{}',
  last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Territory claims for providers
CREATE TABLE public.territory_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES public.provider_profiles(id) ON DELETE CASCADE,
  zone_code VARCHAR(20) NOT NULL REFERENCES public.montreal_zones(zone_code),
  status territory_status DEFAULT 'claimed',
  claimed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  jobs_completed_in_zone INTEGER DEFAULT 0,
  territory_score INTEGER DEFAULT 0,
  challenger_id UUID REFERENCES public.provider_profiles(id),
  challenge_expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(provider_id, zone_code)
);

-- Leaderboards
CREATE TABLE public.leaderboards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  leaderboard_type leaderboard_type NOT NULL,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES public.provider_profiles(id) ON DELETE CASCADE,
  zone_code VARCHAR(20) REFERENCES public.montreal_zones(zone_code),
  score NUMERIC NOT NULL DEFAULT 0,
  rank_position INTEGER,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Point transactions log
CREATE TABLE public.point_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  transaction_type TEXT NOT NULL, -- 'earned', 'spent', 'bonus', 'penalty'
  points_amount INTEGER NOT NULL,
  reason TEXT NOT NULL,
  booking_id UUID REFERENCES public.bookings(id),
  achievement_id UUID REFERENCES public.user_achievements(id),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Review quality scoring
CREATE TABLE public.review_quality_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  quality_score INTEGER NOT NULL CHECK (quality_score >= 0 AND quality_score <= 100),
  helpfulness_rating INTEGER CHECK (helpfulness_rating >= 1 AND helpfulness_rating <= 5),
  detail_score INTEGER DEFAULT 0,
  photo_bonus INTEGER DEFAULT 0,
  verified_booking BOOLEAN DEFAULT false,
  points_awarded INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add gamification columns to existing tables
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS gamification_level INTEGER DEFAULT 1;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS total_gamification_points INTEGER DEFAULT 0;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS preferred_customer_status BOOLEAN DEFAULT false;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS booking_streak INTEGER DEFAULT 0;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS last_booking_date DATE;

ALTER TABLE public.provider_profiles ADD COLUMN IF NOT EXISTS territory_score INTEGER DEFAULT 0;
ALTER TABLE public.provider_profiles ADD COLUMN IF NOT EXISTS achievement_badges JSONB DEFAULT '[]';
ALTER TABLE public.provider_profiles ADD COLUMN IF NOT EXISTS weekly_earnings NUMERIC DEFAULT 0;
ALTER TABLE public.provider_profiles ADD COLUMN IF NOT EXISTS monthly_earnings NUMERIC DEFAULT 0;
ALTER TABLE public.provider_profiles ADD COLUMN IF NOT EXISTS response_time_score INTEGER DEFAULT 0;

-- Create indexes for performance
CREATE INDEX idx_user_achievements_user_id ON public.user_achievements(user_id);
CREATE INDEX idx_loyalty_points_user_id ON public.loyalty_points(user_id);
CREATE INDEX idx_territory_claims_provider_zone ON public.territory_claims(provider_id, zone_code);
CREATE INDEX idx_leaderboards_type_period ON public.leaderboards(leaderboard_type, period_start, period_end);
CREATE INDEX idx_point_transactions_user_id ON public.point_transactions(user_id);

-- RLS Policies
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.territory_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.point_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_quality_scores ENABLE ROW LEVEL SECURITY;

-- User achievements policies
CREATE POLICY "Users can view their own achievements" ON public.user_achievements
  FOR SELECT USING (auth.uid() = user_id);

-- Loyalty points policies
CREATE POLICY "Users can view their own loyalty points" ON public.loyalty_points
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own loyalty points" ON public.loyalty_points
  FOR UPDATE USING (auth.uid() = user_id);

-- Territory claims policies (providers can view all, but only modify their own)
CREATE POLICY "Anyone can view territory claims" ON public.territory_claims
  FOR SELECT USING (true);

CREATE POLICY "Providers can manage their own territory claims" ON public.territory_claims
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.provider_profiles pp 
      WHERE pp.id = provider_id AND pp.user_id = auth.uid()
    )
  );

-- Leaderboards policies (public viewing)
CREATE POLICY "Anyone can view leaderboards" ON public.leaderboards
  FOR SELECT USING (true);

-- Point transactions policies
CREATE POLICY "Users can view their own point transactions" ON public.point_transactions
  FOR SELECT USING (auth.uid() = user_id);

-- Review quality scores policies
CREATE POLICY "Users can view review quality scores" ON public.review_quality_scores
  FOR SELECT USING (true);

-- Gamification helper functions
CREATE OR REPLACE FUNCTION public.award_points(
  target_user_id UUID,
  points INTEGER,
  reason TEXT,
  transaction_type TEXT DEFAULT 'earned',
  related_booking_id UUID DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
  -- Insert transaction log
  INSERT INTO public.point_transactions (user_id, transaction_type, points_amount, reason, booking_id)
  VALUES (target_user_id, transaction_type, points, reason, related_booking_id);
  
  -- Update user's total points
  UPDATE public.users 
  SET total_gamification_points = total_gamification_points + points
  WHERE id = target_user_id;
  
  -- Update loyalty points if earning points
  IF transaction_type = 'earned' THEN
    INSERT INTO public.loyalty_points (user_id, total_points, available_points, lifetime_earned)
    VALUES (target_user_id, points, points, points)
    ON CONFLICT (user_id) DO UPDATE SET
      total_points = loyalty_points.total_points + points,
      available_points = loyalty_points.available_points + points,
      lifetime_earned = loyalty_points.lifetime_earned + points,
      last_activity_at = now(),
      updated_at = now();
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.claim_territory(
  claiming_provider_id UUID,
  target_zone_code VARCHAR(20)
) RETURNS BOOLEAN AS $$
DECLARE
  existing_claim_count INTEGER;
BEGIN
  -- Check if zone is already claimed by this provider
  SELECT COUNT(*) INTO existing_claim_count
  FROM public.territory_claims
  WHERE provider_id = claiming_provider_id AND zone_code = target_zone_code;
  
  IF existing_claim_count > 0 THEN
    RETURN false; -- Already claimed
  END IF;
  
  -- Insert new territory claim
  INSERT INTO public.territory_claims (provider_id, zone_code, status)
  VALUES (claiming_provider_id, target_zone_code, 'claimed');
  
  -- Award territory points
  PERFORM public.award_points(
    (SELECT user_id FROM public.provider_profiles WHERE id = claiming_provider_id),
    100,
    'Territory claimed: ' || target_zone_code,
    'earned'
  );
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.update_leaderboards() RETURNS VOID AS $$
BEGIN
  -- Update weekly earnings leaderboard
  INSERT INTO public.leaderboards (leaderboard_type, user_id, provider_id, score, period_start, period_end)
  SELECT 
    'weekly_earnings'::leaderboard_type,
    pp.user_id,
    pp.id,
    pp.weekly_earnings,
    CURRENT_DATE - INTERVAL '7 days',
    CURRENT_DATE
  FROM public.provider_profiles pp
  WHERE pp.weekly_earnings > 0
  ON CONFLICT DO NOTHING;
  
  -- Update rankings
  UPDATE public.leaderboards SET rank_position = subquery.rank
  FROM (
    SELECT id, ROW_NUMBER() OVER (PARTITION BY leaderboard_type, period_start ORDER BY score DESC) as rank
    FROM public.leaderboards
    WHERE period_start >= CURRENT_DATE - INTERVAL '7 days'
  ) AS subquery
  WHERE public.leaderboards.id = subquery.id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
