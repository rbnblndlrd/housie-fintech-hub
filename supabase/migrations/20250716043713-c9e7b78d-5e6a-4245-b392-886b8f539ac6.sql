-- Add customer-specific stamp definitions (using correct column names)
INSERT INTO public.stamp_definitions (id, name, description, icon_url, rarity) VALUES
-- Patron Arc stamps
('first-five-star', 'First 5★ Given', 'Your first perfect review - setting the standard high', '⭐', 'common'),
('loyal-rebook', 'Faithful Return', 'Rebooked the same provider within 30 days - loyalty recognized', '🔄', 'common'),
('thoughtful-reviewer', 'Review Virtuoso', 'Left 3 verified, thoughtful reviews that help the community', '📝', 'uncommon'),
('collective-joiner', 'Collective Participant', 'Joined a seasonal collective - community over convenience', '🤝', 'common'),
('referral-giver', 'Provider Ambassador', 'Referred a provider to a friend - trust shared is trust multiplied', '📣', 'uncommon'),
('category-expert', 'Category Connoisseur', 'Booked 5+ times in same category - you know what you like', '🎯', 'uncommon'),

-- Curated Life stamps  
('tri-category', 'Category Explorer', 'Booked 3 distinct categories in one month - diverse taste', '🎨', 'uncommon'),
('cluster-creator', 'Cluster Architect', 'Created a Cluster coordination - logistics mastery', '⚙️', 'rare'),
('proxy-booker', 'Service Coordinator', 'Coordinated a service for someone else - thoughtful delegation', '🎯', 'uncommon'),
('cred-badge-user', 'Badge Wielder', 'Used a Cred Badge to access a prestige provider - earned access', '🪪', 'rare'),
('promo-feedback', 'Promo Participant', 'Booked during a promo and left constructive feedback', '💡', 'common'),
('niche-booker', 'Niche Explorer', 'Booked a specialty/niche category - adventurous taste', '🔍', 'rare'),

-- Community Pulse stamps
('local-champion', 'Local Hero', 'Booked within 1km of home - neighborhood supporter', '🏠', 'common'),
('cluster-participant', 'Cluster Member', 'Participated in a Cluster - collaborative spirit', '👥', 'common'),
('crew-commender', 'Crew Appreciator', 'Sent a commendation after a crew job - recognition giver', '👏', 'uncommon'),
('helpful-reviewer', 'Guide Writer', 'Wrote a review that helped another customer choose', '📖', 'uncommon'),
('collective-organizer', 'Collective Organizer', 'Helped organize a Collective - leadership in action', '📋', 'rare'),
('early-adopter', 'Trend Spotter', 'Bookmarked a provider before they were popular - early recognition', '👁️', 'rare')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon_url = EXCLUDED.icon_url,
  rarity = EXCLUDED.rarity;

-- Update seal_canonical_chain function to handle customer titles
CREATE OR REPLACE FUNCTION public.seal_canonical_chain(
  p_chain_id uuid,
  p_user_id uuid,
  p_final_stamp_id text DEFAULT NULL,
  p_annotation text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  chain_record record;
  prestige_title text;
  result jsonb;
BEGIN
  -- Get the chain and verify ownership
  SELECT * INTO chain_record 
  FROM public.canonical_chains 
  WHERE id = p_chain_id AND user_id = p_user_id AND is_complete = false;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Chain not found or already sealed');
  END IF;
  
  -- Determine prestige title based on chain theme and progression
  prestige_title := CASE chain_record.theme
    WHEN 'wellness_whisperer' THEN 'Wellness Whisperer'
    WHEN 'neighborhood_hero' THEN 'Neighborhood Hero'
    WHEN 'road_warrior' THEN 'Road Warrior'
    WHEN 'excellence_pursuit' THEN 'Excellence Seeker'
    -- Customer titles
    WHEN 'patron_arc' THEN 'Patron Saint'
    WHEN 'curated_life' THEN 'Curated Taste'
    WHEN 'community_pulse' THEN 'Neighborhood Anchor'
    ELSE 'Chain Completer'
  END;
  
  -- Seal the chain
  UPDATE public.canonical_chains 
  SET 
    is_complete = true,
    sealed_by_user_id = p_user_id,
    completed_stamp_id = p_final_stamp_id,
    completion_annotation = p_annotation,
    prestige_score = prestige_score + 50 -- Bonus for completion
  WHERE id = p_chain_id;
  
  -- Create broadcast event
  PERFORM public.broadcast_canon_event(
    'canonical_chain_sealed',
    p_user_id,
    'canonical_chains',
    p_chain_id,
    true,
    'local',
    true,
    0.95,
    jsonb_build_object(
      'chain_title', chain_record.title,
      'prestige_title', prestige_title,
      'stamps_count', array_length(chain_record.chain_sequence, 1),
      'chain_type', CASE 
        WHEN chain_record.theme IN ('patron_arc', 'curated_life', 'community_pulse') THEN 'customer'
        ELSE 'provider'
      END
    )
  );
  
  RETURN jsonb_build_object(
    'success', true,
    'prestige_title', prestige_title,
    'broadcast_created', true
  );
END;
$$;