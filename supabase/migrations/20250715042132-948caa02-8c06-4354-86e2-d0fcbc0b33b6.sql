-- Create canon_votes table
CREATE TABLE public.canon_votes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id uuid NOT NULL REFERENCES public.canon_events(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  vote_type text NOT NULL CHECK (vote_type IN ('upvote', 'downvote')),
  weight integer DEFAULT 1,
  timestamp timestamp with time zone DEFAULT now(),
  UNIQUE(event_id, user_id)
);

-- Add vote_score and vote_count to canon_events
ALTER TABLE public.canon_events 
ADD COLUMN vote_score integer DEFAULT 0,
ADD COLUMN vote_count integer DEFAULT 0;

-- Enable RLS on canon_votes
ALTER TABLE public.canon_votes ENABLE ROW LEVEL SECURITY;

-- RLS policies for canon_votes
CREATE POLICY "Users can create votes" ON public.canon_votes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own votes" ON public.canon_votes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own votes" ON public.canon_votes
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view votes on accessible events" ON public.canon_votes
  FOR SELECT USING (
    event_id IN (
      SELECT id FROM public.canon_events 
      WHERE echo_scope IN ('public', 'city') 
      OR user_id = auth.uid()
      OR (echo_scope = 'friends' AND user_id IN (
        SELECT DISTINCT CASE 
          WHEN service_connections.user_one_id = auth.uid() THEN service_connections.user_two_id
          ELSE service_connections.user_one_id
        END
        FROM service_connections
        WHERE (service_connections.user_one_id = auth.uid() OR service_connections.user_two_id = auth.uid())
        AND service_connections.cred_connection_established = true
      ))
    )
  );

-- Function to recalculate vote weight for an event
CREATE OR REPLACE FUNCTION public.recalculate_vote_weight(p_event_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  total_score integer := 0;
  total_count integer := 0;
BEGIN
  -- Calculate vote score and count
  SELECT 
    COALESCE(SUM(CASE 
      WHEN vote_type = 'upvote' THEN weight 
      WHEN vote_type = 'downvote' THEN -weight 
      ELSE 0 
    END), 0),
    COUNT(*)
  INTO total_score, total_count
  FROM public.canon_votes 
  WHERE event_id = p_event_id;
  
  -- Update canon_events
  UPDATE public.canon_events 
  SET 
    vote_score = total_score,
    vote_count = total_count,
    updated_at = now()
  WHERE id = p_event_id;
  
  -- Check for rank escalation based on vote score
  UPDATE public.canon_events 
  SET canon_rank = CASE 
    WHEN vote_score >= 50 AND canon_rank = 'local' THEN 'regional'
    WHEN vote_score >= 100 AND canon_rank = 'regional' THEN 'global'
    WHEN vote_score >= 200 AND canon_rank = 'global' THEN 'legendary'
    ELSE canon_rank
  END
  WHERE id = p_event_id;
END;
$$;

-- Trigger to auto-recalculate vote weight when votes change
CREATE OR REPLACE FUNCTION public.update_vote_weight_trigger()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    PERFORM public.recalculate_vote_weight(OLD.event_id);
    RETURN OLD;
  ELSE
    PERFORM public.recalculate_vote_weight(NEW.event_id);
    RETURN NEW;
  END IF;
END;
$$;

CREATE TRIGGER canon_votes_update_weight
  AFTER INSERT OR UPDATE OR DELETE ON public.canon_votes
  FOR EACH ROW EXECUTE FUNCTION public.update_vote_weight_trigger();