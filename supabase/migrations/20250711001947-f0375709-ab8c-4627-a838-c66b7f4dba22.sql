-- Add parse tracking fields to bookings table
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS parsed boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS parsed_at timestamp with time zone DEFAULT NULL,
ADD COLUMN IF NOT EXISTS ai_analysis jsonb DEFAULT NULL;

-- Create job_events table for tracking
CREATE TABLE IF NOT EXISTS public.job_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id uuid NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  event_type text NOT NULL,
  metadata jsonb DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS for job_events table
ALTER TABLE public.job_events ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for job_events
CREATE POLICY "Users can view their own job events" 
ON public.job_events 
FOR SELECT 
USING (user_id = auth.uid() OR job_id IN (
  SELECT id FROM public.bookings 
  WHERE customer_id = auth.uid() OR provider_id IN (
    SELECT id FROM provider_profiles WHERE user_id = auth.uid()
  )
));

CREATE POLICY "Users can create job events for their jobs" 
ON public.job_events 
FOR INSERT 
WITH CHECK (user_id = auth.uid() AND job_id IN (
  SELECT id FROM public.bookings 
  WHERE customer_id = auth.uid() OR provider_id IN (
    SELECT id FROM provider_profiles WHERE user_id = auth.uid()
  )
));