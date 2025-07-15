-- Create canon_threads table for conversational memory
CREATE TABLE public.canon_threads (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  title text NOT NULL,
  root_message text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  tags text[] DEFAULT ARRAY[]::text[],
  is_public boolean DEFAULT false,
  is_starred boolean DEFAULT false,
  emoji_tag text,
  summary text
);

-- Create canon_thread_entries table for individual thread entries
CREATE TABLE public.canon_thread_entries (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  thread_id uuid NOT NULL REFERENCES public.canon_threads(id) ON DELETE CASCADE,
  entry_id text NOT NULL,
  message text NOT NULL,
  source_type text NOT NULL DEFAULT 'user_prompt',
  canon_level text NOT NULL DEFAULT 'non-canon',
  timestamp timestamp with time zone NOT NULL DEFAULT now(),
  linked_event_id uuid,
  metadata jsonb DEFAULT '{}'::jsonb,
  CONSTRAINT valid_source_type CHECK (source_type IN ('voice_line', 'data_pull', 'user_prompt', 'system')),
  CONSTRAINT valid_canon_level CHECK (canon_level IN ('canon', 'non-canon', 'inferred'))
);

-- Enable Row Level Security
ALTER TABLE public.canon_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.canon_thread_entries ENABLE ROW LEVEL SECURITY;

-- RLS Policies for canon_threads
CREATE POLICY "Users can manage their own canon threads"
  ON public.canon_threads
  FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view public canon threads"
  ON public.canon_threads
  FOR SELECT
  USING (is_public = true OR auth.uid() = user_id);

-- RLS Policies for canon_thread_entries
CREATE POLICY "Users can manage their own thread entries"
  ON public.canon_thread_entries
  FOR ALL
  USING (thread_id IN (
    SELECT id FROM public.canon_threads WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can view entries from accessible threads"
  ON public.canon_thread_entries
  FOR SELECT
  USING (thread_id IN (
    SELECT id FROM public.canon_threads 
    WHERE is_public = true OR user_id = auth.uid()
  ));

-- Create indexes for performance
CREATE INDEX idx_canon_threads_user_id ON public.canon_threads(user_id);
CREATE INDEX idx_canon_threads_created_at ON public.canon_threads(created_at DESC);
CREATE INDEX idx_canon_threads_tags ON public.canon_threads USING GIN(tags);
CREATE INDEX idx_canon_thread_entries_thread_id ON public.canon_thread_entries(thread_id);
CREATE INDEX idx_canon_thread_entries_timestamp ON public.canon_thread_entries(timestamp DESC);

-- Function to update thread updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_canon_thread_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  UPDATE public.canon_threads 
  SET updated_at = now()
  WHERE id = NEW.thread_id;
  RETURN NEW;
END;
$function$;

-- Trigger to update thread timestamp when entries are added
CREATE TRIGGER update_thread_timestamp
  AFTER INSERT OR UPDATE ON public.canon_thread_entries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_canon_thread_updated_at();

-- Function to create a new canon thread
CREATE OR REPLACE FUNCTION public.create_canon_thread(
  p_user_id uuid,
  p_title text,
  p_root_message text,
  p_tags text[] DEFAULT ARRAY[]::text[],
  p_is_public boolean DEFAULT false
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  thread_id uuid;
BEGIN
  INSERT INTO public.canon_threads (user_id, title, root_message, tags, is_public)
  VALUES (p_user_id, p_title, p_root_message, p_tags, p_is_public)
  RETURNING id INTO thread_id;
  
  -- Add the root message as first entry
  INSERT INTO public.canon_thread_entries (thread_id, entry_id, message, source_type, canon_level)
  VALUES (thread_id, 'root', p_root_message, 'user_prompt', 'non-canon');
  
  RETURN thread_id;
END;
$function$;

-- Function to add entry to canon thread
CREATE OR REPLACE FUNCTION public.add_canon_thread_entry(
  p_thread_id uuid,
  p_entry_id text,
  p_message text,
  p_source_type text DEFAULT 'user_prompt',
  p_canon_level text DEFAULT 'non-canon',
  p_linked_event_id uuid DEFAULT NULL,
  p_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  entry_uuid uuid;
BEGIN
  INSERT INTO public.canon_thread_entries (
    thread_id, entry_id, message, source_type, canon_level, linked_event_id, metadata
  )
  VALUES (
    p_thread_id, p_entry_id, p_message, p_source_type, p_canon_level, p_linked_event_id, p_metadata
  )
  RETURNING id INTO entry_uuid;
  
  RETURN entry_uuid;
END;
$function$;

-- Function to search canon threads
CREATE OR REPLACE FUNCTION public.search_canon_threads(
  p_user_id uuid,
  p_query text,
  p_limit integer DEFAULT 10
)
RETURNS TABLE(
  thread_id uuid,
  title text,
  root_message text,
  created_at timestamp with time zone,
  tags text[],
  entry_count bigint
)
LANGUAGE sql
STABLE SECURITY DEFINER
AS $function$
  SELECT 
    ct.id as thread_id,
    ct.title,
    ct.root_message,
    ct.created_at,
    ct.tags,
    COUNT(cte.id) as entry_count
  FROM public.canon_threads ct
  LEFT JOIN public.canon_thread_entries cte ON ct.id = cte.thread_id
  WHERE ct.user_id = p_user_id
    AND (
      ct.title ILIKE '%' || p_query || '%' 
      OR ct.root_message ILIKE '%' || p_query || '%'
      OR p_query = ANY(ct.tags)
    )
  GROUP BY ct.id, ct.title, ct.root_message, ct.created_at, ct.tags
  ORDER BY ct.updated_at DESC
  LIMIT p_limit;
$function$;