-- Add echo_score field to canon_events
ALTER TABLE public.canon_events 
ADD COLUMN echo_score INTEGER NOT NULL DEFAULT 0;

-- Create canon_reactions table
CREATE TABLE public.canon_reactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.canon_events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reaction_type TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Prevent duplicate reactions from same user on same event
  CONSTRAINT unique_user_event_reaction UNIQUE (event_id, user_id, reaction_type)
);

-- Add check constraint for reaction_type
ALTER TABLE public.canon_reactions
ADD CONSTRAINT valid_reaction_type 
CHECK (reaction_type IN ('cheer', 'awe', 'hilarious', 'repost', 'boost', 'tearjerker'));

-- Enable RLS
ALTER TABLE public.canon_reactions ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can create reactions"
ON public.canon_reactions
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own reactions"
ON public.canon_reactions
FOR DELETE
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Anyone can view reactions on public events"
ON public.canon_reactions
FOR SELECT
TO authenticated
USING (
  event_id IN (
    SELECT id FROM public.canon_events 
    WHERE echo_scope IN ('public', 'friends', 'city')
  )
);

-- Create indexes for performance
CREATE INDEX idx_canon_reactions_event_id ON public.canon_reactions(event_id);
CREATE INDEX idx_canon_reactions_user_id ON public.canon_reactions(user_id);
CREATE INDEX idx_canon_reactions_type ON public.canon_reactions(reaction_type);

-- Create function to calculate echo score
CREATE OR REPLACE FUNCTION calculate_echo_score(p_event_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  total_score INTEGER := 0;
  reaction_record RECORD;
BEGIN
  -- Calculate weighted score based on reaction types
  FOR reaction_record IN
    SELECT reaction_type, COUNT(*) as count
    FROM public.canon_reactions 
    WHERE event_id = p_event_id
    GROUP BY reaction_type
  LOOP
    total_score := total_score + (
      CASE reaction_record.reaction_type
        WHEN 'cheer' THEN 1
        WHEN 'hilarious' THEN 1
        WHEN 'awe' THEN 2
        WHEN 'repost' THEN 3
        WHEN 'tearjerker' THEN 4
        WHEN 'boost' THEN 5
        ELSE 1
      END * reaction_record.count
    );
  END LOOP;
  
  RETURN total_score;
END;
$$;

-- Create function to update echo score
CREATE OR REPLACE FUNCTION update_echo_score()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  target_event_id UUID;
  new_score INTEGER;
BEGIN
  -- Get the event ID from either NEW or OLD record
  IF TG_OP = 'DELETE' THEN
    target_event_id := OLD.event_id;
  ELSE
    target_event_id := NEW.event_id;
  END IF;
  
  -- Calculate new score
  SELECT calculate_echo_score(target_event_id) INTO new_score;
  
  -- Update the canon_events table
  UPDATE public.canon_events 
  SET echo_score = new_score
  WHERE id = target_event_id;
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$;

-- Create triggers to automatically update echo scores
CREATE TRIGGER update_echo_score_on_reaction_change
  AFTER INSERT OR DELETE ON public.canon_reactions
  FOR EACH ROW EXECUTE FUNCTION update_echo_score();

-- Add index on echo_score for sorting
CREATE INDEX idx_canon_events_echo_score ON public.canon_events(echo_score DESC);