-- Add completion fields to canonical_chains table
ALTER TABLE public.canonical_chains 
ADD COLUMN IF NOT EXISTS is_complete boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS completion_timestamp timestamp with time zone,
ADD COLUMN IF NOT EXISTS sealed_by_user_id uuid REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS completed_stamp_id text,
ADD COLUMN IF NOT EXISTS mint_token_id text,
ADD COLUMN IF NOT EXISTS completion_annotation text;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_canonical_chains_completion 
ON public.canonical_chains(user_id, is_complete);

-- Add trigger to update completion timestamp
CREATE OR REPLACE FUNCTION public.update_chain_completion_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_complete = true AND OLD.is_complete = false THEN
    NEW.completion_timestamp = now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_chain_completion_timestamp
  BEFORE UPDATE ON public.canonical_chains
  FOR EACH ROW
  EXECUTE FUNCTION public.update_chain_completion_timestamp();

-- Function to seal a canonical chain
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
      'stamps_count', array_length(chain_record.chain_sequence, 1)
    )
  );
  
  RETURN jsonb_build_object(
    'success', true,
    'prestige_title', prestige_title,
    'broadcast_created', true
  );
END;
$$;