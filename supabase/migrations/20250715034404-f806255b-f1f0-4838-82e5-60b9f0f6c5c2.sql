-- Create stamp_usages table for tracking stamp assignments to canon events
CREATE TABLE public.stamp_usages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  stamp_id uuid NOT NULL REFERENCES public.stamp_definitions(id) ON DELETE CASCADE,
  canon_event_id uuid NOT NULL REFERENCES public.canon_events(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  timestamp timestamp with time zone NOT NULL DEFAULT now(),
  assigned_by uuid, -- User who assigned the stamp (could be different from event owner)
  metadata jsonb DEFAULT '{}',
  UNIQUE(stamp_id, canon_event_id) -- One stamp per event
);

-- Enable RLS
ALTER TABLE public.stamp_usages ENABLE ROW LEVEL SECURITY;

-- RLS policies for stamp_usages
CREATE POLICY "Users can view stamp usages on public events" ON public.stamp_usages
  FOR SELECT USING (
    canon_event_id IN (
      SELECT id FROM canon_events 
      WHERE echo_scope IN ('public', 'city', 'friends') OR user_id = auth.uid()
    )
  );

CREATE POLICY "Users can assign stamps to their own events" ON public.stamp_usages
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND 
    canon_event_id IN (
      SELECT id FROM canon_events WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can assign stamps to any event" ON public.stamp_usages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND user_role = 'admin'
    )
  );

CREATE POLICY "Users can update their own stamp assignments" ON public.stamp_usages
  FOR UPDATE USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND user_role = 'admin'
    )
  );

CREATE POLICY "Users can delete their own stamp assignments" ON public.stamp_usages
  FOR DELETE USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND user_role = 'admin'
    )
  );

-- Index for performance
CREATE INDEX idx_stamp_usages_event_id ON public.stamp_usages(canon_event_id);
CREATE INDEX idx_stamp_usages_stamp_id ON public.stamp_usages(stamp_id);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_stamp_usages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.timestamp = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_stamp_usages_timestamp
  BEFORE UPDATE ON public.stamp_usages
  FOR EACH ROW
  EXECUTE FUNCTION update_stamp_usages_updated_at();