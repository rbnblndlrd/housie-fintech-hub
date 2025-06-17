
-- Create users table (main table with role switching)
CREATE TABLE public.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text,
  full_name text NOT NULL,
  phone text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  
  -- Profile switching (renamed from current_role to avoid reserved keyword)
  user_role text CHECK (user_role IN ('seeker', 'provider')) DEFAULT 'seeker',
  can_provide boolean DEFAULT false,
  can_seek boolean DEFAULT true,
  
  -- Basic info
  profile_image text,
  address text,
  city text,
  province text,
  postal_code text,
  coordinates point,
  
  -- Subscription
  subscription_tier text CHECK (subscription_tier IN ('free', 'starter', 'pro', 'premium')) DEFAULT 'free',
  subscription_status text CHECK (subscription_status IN ('active', 'cancelled', 'trial')) DEFAULT 'trial',
  stripe_customer_id text
);

-- Create provider_profiles table (only when user becomes provider)
CREATE TABLE public.provider_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Business info
  business_name text,
  description text,
  years_experience integer,
  hourly_rate decimal,
  service_radius_km integer,
  
  -- Verification
  cra_compliant boolean DEFAULT false,
  verified boolean DEFAULT false,
  insurance_verified boolean DEFAULT false,
  
  -- Performance
  total_bookings integer DEFAULT 0,
  average_rating decimal DEFAULT 0,
  response_time_hours decimal,
  
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create services table (what providers offer)
CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid REFERENCES public.provider_profiles(id) ON DELETE CASCADE NOT NULL,
  
  category text CHECK (category IN ('cleaning', 'lawn_care', 'construction', 'wellness', 'care_pets')) NOT NULL,
  subcategory text,
  title text NOT NULL,
  description text,
  
  pricing_type text CHECK (pricing_type IN ('hourly', 'flat', 'custom')) DEFAULT 'hourly',
  base_price decimal,
  
  active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now()
);

-- Create bookings table (core transactions)
CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  provider_id uuid REFERENCES public.provider_profiles(id) ON DELETE CASCADE NOT NULL,
  service_id uuid REFERENCES public.services(id) ON DELETE CASCADE NOT NULL,
  
  -- Booking details
  scheduled_date date NOT NULL,
  scheduled_time time NOT NULL,
  duration_hours decimal,
  total_amount decimal,
  
  -- Address
  service_address text,
  service_coordinates point,
  
  -- Status
  status text CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')) DEFAULT 'pending',
  payment_status text CHECK (payment_status IN ('pending', 'paid', 'refunded')) DEFAULT 'pending',
  
  -- Stripe
  stripe_payment_intent_id text,
  
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create messages table (built-in chat)
CREATE TABLE public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
  sender_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  
  content text NOT NULL,
  message_type text CHECK (message_type IN ('text', 'image', 'system')) DEFAULT 'text',
  
  created_at timestamp with time zone DEFAULT now(),
  read_at timestamp with time zone
);

-- Create reviews table (rating system)
CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
  reviewer_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  provider_id uuid REFERENCES public.provider_profiles(id) ON DELETE CASCADE NOT NULL,
  
  rating integer CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment text,
  
  created_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users table
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Create RLS policies for provider_profiles
CREATE POLICY "Anyone can view provider profiles" ON public.provider_profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can manage their own provider profile" ON public.provider_profiles
  FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for services
CREATE POLICY "Anyone can view active services" ON public.services
  FOR SELECT USING (active = true);

CREATE POLICY "Providers can manage their own services" ON public.services
  FOR ALL USING (
    provider_id IN (
      SELECT id FROM public.provider_profiles WHERE user_id = auth.uid()
    )
  );

-- Create RLS policies for bookings
CREATE POLICY "Users can view their own bookings" ON public.bookings
  FOR SELECT USING (
    customer_id = auth.uid() OR 
    provider_id IN (
      SELECT id FROM public.provider_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create bookings as customer" ON public.bookings
  FOR INSERT WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Users can update their own bookings" ON public.bookings
  FOR UPDATE USING (
    customer_id = auth.uid() OR 
    provider_id IN (
      SELECT id FROM public.provider_profiles WHERE user_id = auth.uid()
    )
  );

-- Create RLS policies for messages
CREATE POLICY "Users can view messages from their bookings" ON public.messages
  FOR SELECT USING (
    booking_id IN (
      SELECT id FROM public.bookings 
      WHERE customer_id = auth.uid() OR 
      provider_id IN (
        SELECT id FROM public.provider_profiles WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can send messages to their bookings" ON public.messages
  FOR INSERT WITH CHECK (
    sender_id = auth.uid() AND
    booking_id IN (
      SELECT id FROM public.bookings 
      WHERE customer_id = auth.uid() OR 
      provider_id IN (
        SELECT id FROM public.provider_profiles WHERE user_id = auth.uid()
      )
    )
  );

-- Create RLS policies for reviews
CREATE POLICY "Anyone can view reviews" ON public.reviews
  FOR SELECT USING (true);

CREATE POLICY "Customers can create reviews for completed bookings" ON public.reviews
  FOR INSERT WITH CHECK (
    reviewer_id = auth.uid() AND
    booking_id IN (
      SELECT id FROM public.bookings 
      WHERE customer_id = auth.uid() AND status = 'completed'
    )
  );
