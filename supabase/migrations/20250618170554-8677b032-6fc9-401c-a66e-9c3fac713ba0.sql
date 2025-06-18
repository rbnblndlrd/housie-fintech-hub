
-- Create a table for calendar appointments that persists across sessions
CREATE TABLE public.calendar_appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  scheduled_date DATE NOT NULL,
  scheduled_time TIME NOT NULL,
  client_name TEXT NOT NULL,
  location TEXT,
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  amount NUMERIC DEFAULT 0,
  notes TEXT,
  appointment_type TEXT NOT NULL DEFAULT 'personal' CHECK (appointment_type IN ('personal', 'service')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to ensure users can only see their own appointments
ALTER TABLE public.calendar_appointments ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to SELECT their own appointments
CREATE POLICY "Users can view their own appointments" 
  ON public.calendar_appointments 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy that allows users to INSERT their own appointments
CREATE POLICY "Users can create their own appointments" 
  ON public.calendar_appointments 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to UPDATE their own appointments
CREATE POLICY "Users can update their own appointments" 
  ON public.calendar_appointments 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy that allows users to DELETE their own appointments
CREATE POLICY "Users can delete their own appointments" 
  ON public.calendar_appointments 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create an index for better performance on date queries
CREATE INDEX idx_calendar_appointments_user_date ON public.calendar_appointments(user_id, scheduled_date);
