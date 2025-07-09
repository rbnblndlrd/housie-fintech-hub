-- Create cluster management system tables

-- Create clusters table
CREATE TABLE public.clusters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  service_type TEXT NOT NULL,
  location TEXT NOT NULL,
  neighborhood TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  min_participants INTEGER NOT NULL DEFAULT 3,
  max_participants INTEGER NOT NULL DEFAULT 20,
  target_participants INTEGER NOT NULL DEFAULT 8,
  participant_count INTEGER NOT NULL DEFAULT 0,
  organizer_id UUID NOT NULL,
  share_code TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(6), 'base64'),
  requires_verification BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create cluster_participants table
CREATE TABLE public.cluster_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cluster_id UUID NOT NULL REFERENCES public.clusters(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  display_name TEXT NOT NULL,
  unit_id TEXT,
  preferred_time_blocks TEXT[] DEFAULT '{}',
  special_instructions TEXT,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(cluster_id, user_id)
);

-- Create cluster_time_blocks table
CREATE TABLE public.cluster_time_blocks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cluster_id UUID NOT NULL REFERENCES public.clusters(id) ON DELETE CASCADE,
  block_name TEXT NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  preference_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create cluster_bids table
CREATE TABLE public.cluster_bids (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cluster_id UUID NOT NULL REFERENCES public.clusters(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL,
  bid_amount NUMERIC(10,2) NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(cluster_id, provider_id)
);

-- Enable Row Level Security
ALTER TABLE public.clusters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cluster_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cluster_time_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cluster_bids ENABLE ROW LEVEL SECURITY;

-- RLS Policies for clusters
CREATE POLICY "Anyone can view pending clusters" 
  ON public.clusters 
  FOR SELECT 
  USING (status = 'pending' OR status = 'active' OR status = 'provider_bidding');

CREATE POLICY "Users can create clusters" 
  ON public.clusters 
  FOR INSERT 
  WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "Organizers can update their clusters" 
  ON public.clusters 
  FOR UPDATE 
  USING (auth.uid() = organizer_id);

CREATE POLICY "Organizers can delete their clusters" 
  ON public.clusters 
  FOR DELETE 
  USING (auth.uid() = organizer_id);

-- RLS Policies for cluster_participants
CREATE POLICY "Participants can view cluster participants" 
  ON public.cluster_participants 
  FOR SELECT 
  USING (
    cluster_id IN (
      SELECT id FROM public.clusters 
      WHERE organizer_id = auth.uid()
    ) OR user_id = auth.uid()
  );

CREATE POLICY "Users can join clusters" 
  ON public.cluster_participants 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their participation" 
  ON public.cluster_participants 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can leave clusters" 
  ON public.cluster_participants 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- RLS Policies for cluster_time_blocks
CREATE POLICY "Anyone can view time blocks" 
  ON public.cluster_time_blocks 
  FOR SELECT 
  USING (true);

CREATE POLICY "Organizers can manage time blocks" 
  ON public.cluster_time_blocks 
  FOR ALL 
  USING (
    cluster_id IN (
      SELECT id FROM public.clusters 
      WHERE organizer_id = auth.uid()
    )
  );

-- RLS Policies for cluster_bids
CREATE POLICY "Cluster participants can view bids" 
  ON public.cluster_bids 
  FOR SELECT 
  USING (
    cluster_id IN (
      SELECT cp.cluster_id FROM public.cluster_participants cp 
      WHERE cp.user_id = auth.uid()
    ) OR 
    cluster_id IN (
      SELECT id FROM public.clusters 
      WHERE organizer_id = auth.uid()
    ) OR
    provider_id = auth.uid()
  );

CREATE POLICY "Providers can create bids" 
  ON public.cluster_bids 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.provider_profiles 
      WHERE user_id = auth.uid()
    ) AND provider_id = auth.uid()
  );

CREATE POLICY "Providers can update their bids" 
  ON public.cluster_bids 
  FOR UPDATE 
  USING (provider_id = auth.uid());

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_clusters_updated_at
  BEFORE UPDATE ON public.clusters
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cluster_bids_updated_at
  BEFORE UPDATE ON public.cluster_bids
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to update participant count
CREATE OR REPLACE FUNCTION update_cluster_participant_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.clusters 
    SET participant_count = (
      SELECT COUNT(*) 
      FROM public.cluster_participants 
      WHERE cluster_id = NEW.cluster_id
    )
    WHERE id = NEW.cluster_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.clusters 
    SET participant_count = (
      SELECT COUNT(*) 
      FROM public.cluster_participants 
      WHERE cluster_id = OLD.cluster_id
    )
    WHERE id = OLD.cluster_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_participant_count_on_insert
  AFTER INSERT ON public.cluster_participants
  FOR EACH ROW
  EXECUTE FUNCTION update_cluster_participant_count();

CREATE TRIGGER update_participant_count_on_delete
  AFTER DELETE ON public.cluster_participants
  FOR EACH ROW
  EXECUTE FUNCTION update_cluster_participant_count();

-- Insert default time blocks for new clusters
CREATE OR REPLACE FUNCTION create_default_time_blocks()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.cluster_time_blocks (cluster_id, block_name, start_time, end_time) VALUES
    (NEW.id, 'Early Morning', '06:00', '09:00'),
    (NEW.id, 'Morning', '09:00', '12:00'),
    (NEW.id, 'Afternoon', '12:00', '17:00'),
    (NEW.id, 'Evening', '17:00', '20:00');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_time_blocks_on_cluster_creation
  AFTER INSERT ON public.clusters
  FOR EACH ROW
  EXECUTE FUNCTION create_default_time_blocks();