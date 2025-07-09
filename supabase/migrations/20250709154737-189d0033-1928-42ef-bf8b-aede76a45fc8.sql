-- Create HOUSIE Opportunity System tables

-- Create crews table first (referenced by opportunities)
CREATE TABLE public.crews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  captain_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create crew_members table
CREATE TABLE public.crew_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  crew_id UUID NOT NULL REFERENCES public.crews(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT, -- Optional role within crew
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(crew_id, user_id)
);

-- Create status enum for opportunities
CREATE TYPE public.opportunity_status AS ENUM ('open', 'bidding', 'assigned', 'in_progress', 'completed', 'cancelled');

-- Create bid status enum
CREATE TYPE public.bid_status AS ENUM ('pending', 'accepted', 'rejected', 'withdrawn');

-- Create opportunities table
CREATE TABLE public.opportunities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location_summary TEXT NOT NULL, -- blurred neighborhood
  full_address TEXT NOT NULL, -- revealed only post-acceptance
  preferred_date DATE NOT NULL,
  time_window_start TIME NOT NULL,
  time_window_end TIME NOT NULL,
  status public.opportunity_status NOT NULL DEFAULT 'open',
  required_services JSONB NOT NULL DEFAULT '[]'::jsonb,
  achievement_requirements JSONB NOT NULL DEFAULT '{}'::jsonb, -- hidden for now
  crew_bid_deadline TIMESTAMP WITH TIME ZONE NOT NULL,
  accepted_crew_id UUID REFERENCES public.crews(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create opportunity_service_slots table
CREATE TABLE public.opportunity_service_slots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  service_type TEXT NOT NULL,
  title TEXT, -- e.g., "WhiskerWhisperer", "SPOTLESS" - not enforced for now
  required_achievement TEXT, -- ignored for now
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create opportunity_crew_bids table
CREATE TABLE public.opportunity_crew_bids (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  crew_id UUID NOT NULL REFERENCES public.crews(id) ON DELETE CASCADE,
  total_bid_amount DECIMAL(10,2) NOT NULL,
  proposed_schedule JSONB NOT NULL DEFAULT '{}'::jsonb,
  revenue_split JSONB NOT NULL DEFAULT '{}'::jsonb, -- { member_id: percentage }
  message TEXT,
  status public.bid_status NOT NULL DEFAULT 'pending',
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(opportunity_id, crew_id)
);

-- Enable RLS on all tables
ALTER TABLE public.crews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crew_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunity_service_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunity_crew_bids ENABLE ROW LEVEL SECURITY;

-- RLS Policies for crews
CREATE POLICY "Anyone can view active crews" ON public.crews
  FOR SELECT USING (is_active = true);

CREATE POLICY "Crew captains can manage their crews" ON public.crews
  FOR ALL USING (captain_id = auth.uid());

CREATE POLICY "Users can create crews" ON public.crews
  FOR INSERT WITH CHECK (captain_id = auth.uid());

-- RLS Policies for crew_members
CREATE POLICY "Crew members can view their crew" ON public.crew_members
  FOR SELECT USING (
    user_id = auth.uid() OR 
    crew_id IN (SELECT id FROM public.crews WHERE captain_id = auth.uid())
  );

CREATE POLICY "Crew captains can manage members" ON public.crew_members
  FOR ALL USING (
    crew_id IN (SELECT id FROM public.crews WHERE captain_id = auth.uid())
  );

CREATE POLICY "Users can join crews" ON public.crew_members
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- RLS Policies for opportunities
CREATE POLICY "Anyone can view open opportunities" ON public.opportunities
  FOR SELECT USING (status = 'open' OR status = 'bidding');

CREATE POLICY "Customers can view their opportunities" ON public.opportunities
  FOR SELECT USING (customer_id = auth.uid());

CREATE POLICY "Customers can create opportunities" ON public.opportunities
  FOR INSERT WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Customers can update their opportunities" ON public.opportunities
  FOR UPDATE USING (customer_id = auth.uid());

-- RLS Policies for opportunity_service_slots
CREATE POLICY "Anyone can view service slots for open opportunities" ON public.opportunity_service_slots
  FOR SELECT USING (
    opportunity_id IN (
      SELECT id FROM public.opportunities 
      WHERE status = 'open' OR status = 'bidding' OR customer_id = auth.uid()
    )
  );

CREATE POLICY "Customers can manage their opportunity service slots" ON public.opportunity_service_slots
  FOR ALL USING (
    opportunity_id IN (
      SELECT id FROM public.opportunities WHERE customer_id = auth.uid()
    )
  );

-- RLS Policies for opportunity_crew_bids
CREATE POLICY "Crew members can view bids for their crews" ON public.opportunity_crew_bids
  FOR SELECT USING (
    crew_id IN (
      SELECT crew_id FROM public.crew_members WHERE user_id = auth.uid()
    ) OR
    opportunity_id IN (
      SELECT id FROM public.opportunities WHERE customer_id = auth.uid()
    )
  );

CREATE POLICY "Crew members can create bids for their crews" ON public.opportunity_crew_bids
  FOR INSERT WITH CHECK (
    crew_id IN (
      SELECT crew_id FROM public.crew_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Crew members can update their crew bids" ON public.opportunity_crew_bids
  FOR UPDATE USING (
    crew_id IN (
      SELECT crew_id FROM public.crew_members WHERE user_id = auth.uid()
    )
  );

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_crews_updated_at
  BEFORE UPDATE ON public.crews
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_opportunities_updated_at
  BEFORE UPDATE ON public.opportunities
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_opportunity_crew_bids_updated_at
  BEFORE UPDATE ON public.opportunity_crew_bids
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();