-- Phase 13: Broadcast Beacon System - Add range and broadcast enhancements

-- Add range column to canon_echoes
ALTER TABLE public.canon_echoes 
ADD COLUMN IF NOT EXISTS broadcast_range TEXT DEFAULT 'local' 
CHECK (broadcast_range IN ('local', 'city', 'global', 'whisper'));

-- Add range column to canonical_broadcast_events
ALTER TABLE public.canonical_broadcast_events 
ADD COLUMN IF NOT EXISTS broadcast_range TEXT DEFAULT 'local' 
CHECK (broadcast_range IN ('local', 'city', 'global', 'whisper'));

-- Add pulse/notification state for new broadcasts
ALTER TABLE public.canonical_broadcast_events 
ADD COLUMN IF NOT EXISTS is_unread BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS pulse_active BOOLEAN DEFAULT false;

-- Create function to determine broadcast range based on event rarity and context
CREATE OR REPLACE FUNCTION public.determine_broadcast_range(
  p_event_type TEXT,
  p_canon_confidence NUMERIC,
  p_user_context JSONB DEFAULT '{}'::jsonb
) 
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  range_result TEXT := 'local';
  prestige_tier INTEGER;
  total_stamps INTEGER;
BEGIN
  -- Extract context data
  prestige_tier := COALESCE((p_user_context->>'prestige_rank')::INTEGER, 0);
  total_stamps := COALESCE((p_user_context->>'total_stamps')::INTEGER, 0);
  
  -- Global event criteria (rare achievements)
  IF p_event_type = 'prestige_unlock' AND prestige_tier >= 5 THEN
    range_result := 'global';
  ELSIF p_event_type = 'stamp_combo' AND total_stamps >= 10 THEN
    range_result := 'global';
  ELSIF p_canon_confidence >= 0.95 AND p_event_type = 'canon_record' THEN
    range_result := 'global';
  -- City-wide events (notable achievements)
  ELSIF p_event_type = 'prestige_unlock' AND prestige_tier >= 3 THEN
    range_result := 'city';
  ELSIF p_event_type = 'stamp_milestone' AND total_stamps >= 5 THEN
    range_result := 'city';
  ELSIF p_canon_confidence >= 0.8 THEN
    range_result := 'city';
  -- Everything else stays local
  ELSE
    range_result := 'local';
  END IF;
  
  RETURN range_result;
END;
$$;

-- Create function to get filtered Canon Echo Feed
CREATE OR REPLACE FUNCTION public.get_filtered_canon_echoes(
  p_user_id UUID,
  p_range_filter TEXT DEFAULT 'all',
  p_limit INTEGER DEFAULT 20,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE(
  id UUID,
  user_id UUID,
  message TEXT,
  broadcast_range TEXT,
  canon_confidence NUMERIC,
  location TEXT,
  city TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  is_unread BOOLEAN,
  pulse_active BOOLEAN,
  tags TEXT[],
  engagement_count INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ce.id,
    ce.user_id,
    ce.message,
    ce.broadcast_range,
    ce.canon_confidence,
    ce.location,
    ce.city,
    ce.created_at,
    COALESCE(cbe.is_unread, false) as is_unread,
    COALESCE(cbe.pulse_active, false) as pulse_active,
    ce.tags,
    ce.engagement_count
  FROM public.canon_echoes ce
  LEFT JOIN public.canonical_broadcast_events cbe ON cbe.source_id::TEXT = ce.id::TEXT
  WHERE 
    ce.visibility = 'public'
    AND ce.is_active = true
    AND (p_range_filter = 'all' OR ce.broadcast_range = p_range_filter)
    AND (
      -- User can see their own echoes
      ce.user_id = p_user_id
      -- Or public echoes within their scope
      OR (
        ce.broadcast_range IN ('global', 'city') 
        OR (ce.broadcast_range = 'local' AND ce.city = (
          SELECT city FROM users WHERE id = p_user_id LIMIT 1
        ))
      )
    )
  ORDER BY ce.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$;

-- Create function to mark echoes as read and disable pulse
CREATE OR REPLACE FUNCTION public.mark_echoes_read(p_user_id UUID, p_echo_ids UUID[])
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.canonical_broadcast_events 
  SET 
    is_unread = false,
    pulse_active = false,
    updated_at = now()
  WHERE source_id = ANY(p_echo_ids::TEXT[]);
  
  RETURN true;
END;
$$;

-- Create trigger to auto-determine broadcast range when canon events are created
CREATE OR REPLACE FUNCTION public.auto_set_broadcast_range()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  user_context JSONB;
  computed_range TEXT;
BEGIN
  -- Get user context for range calculation
  SELECT jsonb_build_object(
    'prestige_rank', COALESCE((
      SELECT COUNT(*) FROM prestige_progress 
      WHERE user_id = NEW.user_id AND completed_at IS NOT NULL
    ), 0),
    'total_stamps', COALESCE((
      SELECT COUNT(*) FROM user_stamps 
      WHERE user_id = NEW.user_id
    ), 0)
  ) INTO user_context;
  
  -- Determine range
  computed_range := determine_broadcast_range(
    NEW.event_type,
    COALESCE(NEW.canon_confidence, 0.5),
    user_context
  );
  
  NEW.broadcast_range := computed_range;
  NEW.pulse_active := true; -- Enable pulse for new events
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER auto_set_broadcast_range_trigger
  BEFORE INSERT ON public.canonical_broadcast_events
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_set_broadcast_range();

-- Update existing records with default ranges
UPDATE public.canon_echoes 
SET broadcast_range = 'local' 
WHERE broadcast_range IS NULL;

UPDATE public.canonical_broadcast_events 
SET broadcast_range = 'local' 
WHERE broadcast_range IS NULL;