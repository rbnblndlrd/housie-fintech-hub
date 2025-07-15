-- Create canon_subscriptions table
CREATE TABLE public.canon_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  followed_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscribed_event_types TEXT[] DEFAULT NULL,
  minimum_rank TEXT NOT NULL DEFAULT 'local',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Prevent following yourself and duplicate follows
  CONSTRAINT no_self_follow CHECK (follower_id != followed_id),
  CONSTRAINT unique_follow UNIQUE (follower_id, followed_id)
);

-- Add check constraint for minimum_rank
ALTER TABLE public.canon_subscriptions
ADD CONSTRAINT valid_minimum_rank 
CHECK (minimum_rank IN ('local', 'regional', 'global', 'legendary'));

-- Enable RLS
ALTER TABLE public.canon_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can manage their own subscriptions"
ON public.canon_subscriptions
FOR ALL
TO authenticated
USING (follower_id = auth.uid())
WITH CHECK (follower_id = auth.uid());

-- Create indexes for performance
CREATE INDEX idx_canon_subscriptions_follower ON public.canon_subscriptions(follower_id);
CREATE INDEX idx_canon_subscriptions_followed ON public.canon_subscriptions(followed_id);

-- Create function to get subscribed events for a user
CREATE OR REPLACE FUNCTION get_subscribed_canon_events(p_user_id UUID)
RETURNS TABLE(
  id UUID,
  user_id UUID,
  event_type TEXT,
  title TEXT,
  description TEXT,
  event_timestamp TIMESTAMP WITH TIME ZONE,
  canon_rank TEXT,
  echo_scope TEXT,
  annette_commentary TEXT,
  followed_user_name TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ce.id,
    ce.user_id,
    ce.event_type,
    ce.title,
    ce.description,
    ce.timestamp as event_timestamp,
    ce.canon_rank,
    ce.echo_scope,
    ce.annette_commentary,
    COALESCE(up.full_name, u.email) as followed_user_name
  FROM canon_events ce
  JOIN canon_subscriptions cs ON ce.user_id = cs.followed_id
  LEFT JOIN users u ON ce.user_id = u.id
  LEFT JOIN user_profiles up ON ce.user_id = up.user_id
  WHERE cs.follower_id = p_user_id
    AND ce.echo_scope IN ('public', 'friends')
    AND (cs.subscribed_event_types IS NULL OR ce.event_type = ANY(cs.subscribed_event_types))
    AND CASE cs.minimum_rank
      WHEN 'local' THEN ce.canon_rank IN ('local', 'regional', 'global', 'legendary')
      WHEN 'regional' THEN ce.canon_rank IN ('regional', 'global', 'legendary')
      WHEN 'global' THEN ce.canon_rank IN ('global', 'legendary')
      WHEN 'legendary' THEN ce.canon_rank = 'legendary'
      ELSE true
    END
  ORDER BY ce.timestamp DESC;
END;
$$;