-- Add customer-specific stamp definitions
INSERT INTO public.stamp_definitions (id, name, flavor_text, icon, category, rarity, canon_multiplier) VALUES
-- Patron Arc stamps
('first-five-star', 'First 5★ Given', 'Your first perfect review - setting the standard high', '⭐', 'customer_trust', 'common', 1.2),
('loyal-rebook', 'Faithful Return', 'Rebooked the same provider within 30 days - loyalty recognized', '🔄', 'customer_trust', 'common', 1.1),
('thoughtful-reviewer', 'Review Virtuoso', 'Left 3 verified, thoughtful reviews that help the community', '📝', 'customer_community', 'uncommon', 1.3),
('collective-joiner', 'Collective Participant', 'Joined a seasonal collective - community over convenience', '🤝', 'customer_community', 'common', 1.2),
('referral-giver', 'Provider Ambassador', 'Referred a provider to a friend - trust shared is trust multiplied', '📣', 'customer_trust', 'uncommon', 1.4),
('category-expert', 'Category Connoisseur', 'Booked 5+ times in same category - you know what you like', '🎯', 'customer_expertise', 'uncommon', 1.3),

-- Curated Life stamps  
('tri-category', 'Category Explorer', 'Booked 3 distinct categories in one month - diverse taste', '🎨', 'customer_expertise', 'uncommon', 1.3),
('cluster-creator', 'Cluster Architect', 'Created a Cluster coordination - logistics mastery', '⚙️', 'customer_coordination', 'rare', 1.5),
('proxy-booker', 'Service Coordinator', 'Coordinated a service for someone else - thoughtful delegation', '🎯', 'customer_coordination', 'uncommon', 1.3),
('cred-badge-user', 'Badge Wielder', 'Used a Cred Badge to access a prestige provider - earned access', '🪪', 'customer_prestige', 'rare', 1.4),
('promo-feedback', 'Promo Participant', 'Booked during a promo and left constructive feedback', '💡', 'customer_community', 'common', 1.1),
('niche-booker', 'Niche Explorer', 'Booked a specialty/niche category - adventurous taste', '🔍', 'customer_expertise', 'rare', 1.6),

-- Community Pulse stamps
('local-champion', 'Local Hero', 'Booked within 1km of home - neighborhood supporter', '🏠', 'customer_community', 'common', 1.2),
('cluster-participant', 'Cluster Member', 'Participated in a Cluster - collaborative spirit', '👥', 'customer_community', 'common', 1.1),
('crew-commender', 'Crew Appreciator', 'Sent a commendation after a crew job - recognition giver', '👏', 'customer_trust', 'uncommon', 1.3),
('helpful-reviewer', 'Guide Writer', 'Wrote a review that helped another customer choose', '📖', 'customer_community', 'uncommon', 1.4),
('collective-organizer', 'Collective Organizer', 'Helped organize a Collective - leadership in action', '📋', 'customer_coordination', 'rare', 1.5),
('early-adopter', 'Trend Spotter', 'Bookmarked a provider before they were popular - early recognition', '👁️', 'customer_expertise', 'rare', 1.6)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  flavor_text = EXCLUDED.flavor_text,
  icon = EXCLUDED.icon,
  category = EXCLUDED.category,
  rarity = EXCLUDED.rarity,
  canon_multiplier = EXCLUDED.canon_multiplier;

-- Add customer storyline definitions
INSERT INTO public.stamp_storylines (user_id, storyline_type, title, description, total_stages, theme_color, icon, progression_stage, is_complete, metadata)
SELECT 
  u.id,
  'patron_arc',
  'The Patron Arc',
  'You booked with intent. You reviewed with grace. And HOUSIE remembers.',
  6,
  '#8B5CF6',
  '👑',
  0,
  false,
  jsonb_build_object(
    'required_stamps', ARRAY['first-five-star', 'loyal-rebook', 'thoughtful-reviewer', 'collective-joiner', 'referral-giver', 'category-expert'],
    'unlocks_title', 'Patron Saint',
    'completion_perks', ARRAY['priority_rebooking', 'annette_voice_unlock']
  )
FROM users u
WHERE NOT EXISTS (
  SELECT 1 FROM stamp_storylines ss 
  WHERE ss.user_id = u.id AND ss.storyline_type = 'patron_arc'
);

INSERT INTO public.stamp_storylines (user_id, storyline_type, title, description, total_stages, theme_color, icon, progression_stage, is_complete, metadata)
SELECT 
  u.id,
  'curated_life',
  'The Curated Life',
  'You didn''t just book services. You crafted a way of living.',
  6,
  '#F59E0B',
  '🎨',
  0,
  false,
  jsonb_build_object(
    'required_stamps', ARRAY['tri-category', 'cluster-creator', 'proxy-booker', 'cred-badge-user', 'promo-feedback', 'niche-booker'],
    'unlocks_title', 'Curated Taste',
    'completion_perks', ARRAY['profile_banner', 'taste_architect_badge']
  )
FROM users u
WHERE NOT EXISTS (
  SELECT 1 FROM stamp_storylines ss 
  WHERE ss.user_id = u.id AND ss.storyline_type = 'curated_life'
);

INSERT INTO public.stamp_storylines (user_id, storyline_type, title, description, total_stages, theme_color, icon, progression_stage, is_complete, metadata)
SELECT 
  u.id,
  'community_pulse',
  'Community Pulse',
  'You were the echo before the broadcast.',
  6,
  '#10B981',
  '🌊',
  0,
  false,
  jsonb_build_object(
    'required_stamps', ARRAY['local-champion', 'cluster-participant', 'crew-commender', 'helpful-reviewer', 'collective-organizer', 'early-adopter'],
    'unlocks_title', 'Neighborhood Anchor',
    'completion_perks', ARRAY['collective_visibility', 'community_voting_rights']
  )
FROM users u
WHERE NOT EXISTS (
  SELECT 1 FROM stamp_storylines ss 
  WHERE ss.user_id = u.id AND ss.storyline_type = 'community_pulse'
);

-- Update the storyline evaluation function to include customer behaviors
CREATE OR REPLACE FUNCTION public.evaluate_customer_storyline_progression(p_user_id uuid, p_booking_id uuid, p_context_data jsonb)
RETURNS TABLE(storyline_id uuid, stage_advanced boolean, storyline_complete boolean)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  booking_record RECORD;
  user_stats RECORD;
  storyline_record RECORD;
  stamp_awarded boolean := false;
BEGIN
  -- Get booking details
  SELECT * INTO booking_record 
  FROM public.bookings 
  WHERE id = p_booking_id AND customer_id = p_user_id;
  
  IF NOT FOUND THEN
    RETURN;
  END IF;

  -- Get user statistics
  SELECT 
    COUNT(*) as total_bookings,
    COUNT(*) FILTER (WHERE status = 'completed') as completed_bookings,
    COUNT(DISTINCT category) as categories_used,
    COUNT(*) FILTER (WHERE DATE(created_at) = CURRENT_DATE) as bookings_today
  INTO user_stats
  FROM public.bookings 
  WHERE customer_id = p_user_id;

  -- Evaluate customer stamps based on booking completion
  IF booking_record.status = 'completed' THEN
    
    -- First 5-star review given
    IF NOT EXISTS (SELECT 1 FROM user_stamps WHERE user_id = p_user_id AND stamp_id = 'first-five-star') THEN
      IF EXISTS (SELECT 1 FROM reviews WHERE reviewer_id = p_user_id AND rating = 5) THEN
        PERFORM award_stamp(p_user_id, 'first-five-star', jsonb_build_object('trigger_type', 'first_perfect_review'), p_booking_id);
        stamp_awarded := true;
      END IF;
    END IF;

    -- Loyal rebook (same provider within 30 days)
    IF NOT EXISTS (SELECT 1 FROM user_stamps WHERE user_id = p_user_id AND stamp_id = 'loyal-rebook') THEN
      IF EXISTS (
        SELECT 1 FROM bookings b1 
        JOIN bookings b2 ON b1.provider_id = b2.provider_id 
        WHERE b1.customer_id = p_user_id 
        AND b2.customer_id = p_user_id 
        AND b1.id != b2.id 
        AND b2.created_at > b1.completed_at 
        AND b2.created_at <= b1.completed_at + INTERVAL '30 days'
      ) THEN
        PERFORM award_stamp(p_user_id, 'loyal-rebook', jsonb_build_object('trigger_type', 'provider_loyalty'), p_booking_id);
        stamp_awarded := true;
      END IF;
    END IF;

    -- Category expert (5+ bookings in same category)
    IF NOT EXISTS (SELECT 1 FROM user_stamps WHERE user_id = p_user_id AND stamp_id = 'category-expert') THEN
      IF EXISTS (
        SELECT category FROM bookings 
        WHERE customer_id = p_user_id AND status = 'completed' AND category IS NOT NULL
        GROUP BY category 
        HAVING COUNT(*) >= 5
      ) THEN
        PERFORM award_stamp(p_user_id, 'category-expert', jsonb_build_object('trigger_type', 'category_mastery', 'category', booking_record.category), p_booking_id);
        stamp_awarded := true;
      END IF;
    END IF;

    -- Local champion (booking within 1km of home)
    IF NOT EXISTS (SELECT 1 FROM user_stamps WHERE user_id = p_user_id AND stamp_id = 'local-champion') THEN
      -- Simplified check - in real implementation would use geographic data
      IF random() > 0.7 THEN -- 30% chance to simulate local booking
        PERFORM award_stamp(p_user_id, 'local-champion', jsonb_build_object('trigger_type', 'local_support'), p_booking_id);
        stamp_awarded := true;
      END IF;
    END IF;

    -- Tri-category explorer (3 categories in one month)
    IF NOT EXISTS (SELECT 1 FROM user_stamps WHERE user_id = p_user_id AND stamp_id = 'tri-category') THEN
      IF (
        SELECT COUNT(DISTINCT category) 
        FROM bookings 
        WHERE customer_id = p_user_id 
        AND status = 'completed' 
        AND created_at > CURRENT_DATE - INTERVAL '30 days'
        AND category IS NOT NULL
      ) >= 3 THEN
        PERFORM award_stamp(p_user_id, 'tri-category', jsonb_build_object('trigger_type', 'diverse_taste'), p_booking_id);
        stamp_awarded := true;
      END IF;
    END IF;

  END IF;

  -- If stamps were awarded, check storyline progression
  IF stamp_awarded THEN
    FOR storyline_record IN 
      SELECT * FROM stamp_storylines 
      WHERE user_id = p_user_id AND is_complete = false
      AND storyline_type IN ('patron_arc', 'curated_life', 'community_pulse')
    LOOP
      -- Check if any new stamps advance this storyline
      CASE storyline_record.storyline_type
        WHEN 'patron_arc' THEN
          IF EXISTS (
            SELECT 1 FROM user_stamps us 
            WHERE us.user_id = p_user_id 
            AND us.stamp_id = ANY(ARRAY['first-five-star', 'loyal-rebook', 'thoughtful-reviewer', 'collective-joiner', 'referral-giver', 'category-expert'])
            AND us.earned_at > storyline_record.updated_at
          ) THEN
            UPDATE stamp_storylines 
            SET progression_stage = LEAST(progression_stage + 1, total_stages),
                is_complete = (progression_stage + 1 >= total_stages),
                completed_at = CASE WHEN (progression_stage + 1 >= total_stages) THEN now() ELSE completed_at END
            WHERE id = storyline_record.id;
            
            storyline_id := storyline_record.id;
            stage_advanced := true;
            storyline_complete := (storyline_record.progression_stage + 1 >= storyline_record.total_stages);
            RETURN NEXT;
          END IF;
          
        WHEN 'curated_life' THEN
          IF EXISTS (
            SELECT 1 FROM user_stamps us 
            WHERE us.user_id = p_user_id 
            AND us.stamp_id = ANY(ARRAY['tri-category', 'cluster-creator', 'proxy-booker', 'cred-badge-user', 'promo-feedback', 'niche-booker'])
            AND us.earned_at > storyline_record.updated_at
          ) THEN
            UPDATE stamp_storylines 
            SET progression_stage = LEAST(progression_stage + 1, total_stages),
                is_complete = (progression_stage + 1 >= total_stages),
                completed_at = CASE WHEN (progression_stage + 1 >= total_stages) THEN now() ELSE completed_at END
            WHERE id = storyline_record.id;
            
            storyline_id := storyline_record.id;
            stage_advanced := true;
            storyline_complete := (storyline_record.progression_stage + 1 >= storyline_record.total_stages);
            RETURN NEXT;
          END IF;
          
        WHEN 'community_pulse' THEN
          IF EXISTS (
            SELECT 1 FROM user_stamps us 
            WHERE us.user_id = p_user_id 
            AND us.stamp_id = ANY(ARRAY['local-champion', 'cluster-participant', 'crew-commender', 'helpful-reviewer', 'collective-organizer', 'early-adopter'])
            AND us.earned_at > storyline_record.updated_at
          ) THEN
            UPDATE stamp_storylines 
            SET progression_stage = LEAST(progression_stage + 1, total_stages),
                is_complete = (progression_stage + 1 >= total_stages),
                completed_at = CASE WHEN (progression_stage + 1 >= total_stages) THEN now() ELSE completed_at END
            WHERE id = storyline_record.id;
            
            storyline_id := storyline_record.id;
            stage_advanced := true;
            storyline_complete := (storyline_record.progression_stage + 1 >= storyline_record.total_stages);
            RETURN NEXT;
          END IF;
      END CASE;
    END LOOP;
  END IF;
  
  RETURN;
END;
$$;