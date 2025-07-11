-- Create service_drafts table for provider onboarding
CREATE TABLE public.service_drafts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'My First Service',
  category TEXT NOT NULL DEFAULT 'cleaning',
  description TEXT NOT NULL DEFAULT 'Professional service, customizable to your needs.',
  status TEXT NOT NULL DEFAULT 'draft',
  price_per_hour DECIMAL(10,2),
  duration_hours INTEGER,
  service_area TEXT,
  requirements TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.service_drafts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their own service drafts" ON public.service_drafts
  FOR ALL USING (auth.uid() = user_id);

-- Add updated_at trigger
CREATE TRIGGER update_service_drafts_updated_at
  BEFORE UPDATE ON public.service_drafts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Add comfort_km to user_profiles if not exists (provider comfort zone)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'comfort_km') THEN
    ALTER TABLE public.user_profiles ADD COLUMN comfort_km INTEGER DEFAULT 5;
  END IF;
END $$;