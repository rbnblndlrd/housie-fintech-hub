-- Create annette_quotes table for managing the quote vault
CREATE TABLE public.annette_quotes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  text TEXT NOT NULL,
  page TEXT NOT NULL DEFAULT 'general',
  category TEXT NOT NULL DEFAULT 'Power Humblebrags™',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Enable Row Level Security
ALTER TABLE public.annette_quotes ENABLE ROW LEVEL SECURITY;

-- Create policies for admin-only access
CREATE POLICY "Admins can view all quotes" 
ON public.annette_quotes 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM users 
  WHERE users.id = auth.uid() 
  AND users.user_role = 'admin'
));

CREATE POLICY "Admins can insert quotes" 
ON public.annette_quotes 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM users 
  WHERE users.id = auth.uid() 
  AND users.user_role = 'admin'
));

CREATE POLICY "Admins can update quotes" 
ON public.annette_quotes 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM users 
  WHERE users.id = auth.uid() 
  AND users.user_role = 'admin'
));

CREATE POLICY "Admins can delete quotes" 
ON public.annette_quotes 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM users 
  WHERE users.id = auth.uid() 
  AND users.user_role = 'admin'
));

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_annette_quotes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_annette_quotes_updated_at
  BEFORE UPDATE ON public.annette_quotes
  FOR EACH ROW
  EXECUTE FUNCTION update_annette_quotes_updated_at();

-- Insert initial quotes from the existing quote vault
INSERT INTO public.annette_quotes (text, page, category) VALUES
-- Welcome page quotes
('Try not to be intimidated. I make this look easy.', 'welcome', 'Power Humblebrags™'),
('You found HOUSIE. Already smarter than most.', 'welcome', 'Power Humblebrags™'),
('This is where the journey begins — and where I get all the credit.', 'welcome', 'Power Humblebrags™'),

-- Booking page quotes  
('You touch this, people show up. Wild, right?', 'booking', 'Onboarding Lies™'),
('This button confirms the job. Big commitment. Bigger payoff.', 'booking', 'Onboarding Lies™'),
('Remember to smile. It helps your rating. Even if it''s fake.', 'booking', 'Onboarding Lies™'),

-- Calendar page quotes
('Oh look, you scheduled something. That''s cute.', 'calendar', 'Calendar Roasts™'),
('Dragging that job across the week won''t delay time, sweetie.', 'calendar', 'Calendar Roasts™'),
('This is where ''organized'' people live. Welcome.', 'calendar', 'Calendar Roasts™'),

-- Dashboard page quotes
('Everything''s working exactly how I planned. You''re just catching up.', 'dashboard', 'Power Humblebrags™'),
('Dashboard''s not broken. You just haven''t earned anything yet.', 'dashboard', 'Analytics Smacktalk'),
('Your numbers look… present.', 'dashboard', 'Analytics Smacktalk'),

-- General quotes
('No offense, but I''ll be the brains here.', 'general', 'Sarcastic Truth Bombs'),
('I''m like a GPS for humans who don''t know where they''re going… yet.', 'general', 'System Error Softens'),
('You book the job, I''ll pretend you had a plan all along.', 'general', 'Booking Encouragements'),
('Need a pro? You''ve got Annette. I know people. I *am* people.', 'general', 'Hype Mode'),
('Scroll gently. I''m sensitive to dramatic gestures.', 'general', 'System Error Softens'),
('Most platforms take 12 steps. I take two. The second one''s for show.', 'general', 'Power Humblebrags™'),
('HOUSIE''s where trust and sass come standard.', 'general', 'Hype Mode');