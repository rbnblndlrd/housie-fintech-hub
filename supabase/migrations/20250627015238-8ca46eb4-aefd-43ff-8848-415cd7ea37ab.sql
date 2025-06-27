
-- Create user profiles table with all social network fields
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  profile_image_url TEXT,
  bio TEXT,
  location TEXT,
  profession TEXT,
  company TEXT,
  website TEXT,
  phone TEXT,
  social_linkedin TEXT,
  social_facebook TEXT,
  network_connections_count INTEGER DEFAULT 0,
  total_reviews_received INTEGER DEFAULT 0,
  average_rating NUMERIC(3,2) DEFAULT 0.00,
  is_verified BOOLEAN DEFAULT false,
  privacy_level TEXT DEFAULT 'public', -- public, connections, private
  show_contact_info BOOLEAN DEFAULT true,
  show_location BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Create user role preferences table (moved from navigation)
CREATE TABLE IF NOT EXISTS public.user_role_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  primary_role TEXT NOT NULL DEFAULT 'customer', -- customer, provider, fleet_manager
  secondary_roles TEXT[] DEFAULT '{}',
  auto_switch_based_on_context BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS on user profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_role_preferences ENABLE ROW LEVEL SECURITY;

-- RLS policies for user profiles
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.user_profiles FOR SELECT 
  USING (privacy_level = 'public');

CREATE POLICY "Users can view their own profile" 
  ON public.user_profiles FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
  ON public.user_profiles FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
  ON public.user_profiles FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- RLS policies for role preferences
CREATE POLICY "Users can manage their own role preferences" 
  ON public.user_role_preferences FOR ALL 
  USING (auth.uid() = user_id);

-- Function to get user's current role
CREATE OR REPLACE FUNCTION public.get_user_current_role(target_user_id UUID)
RETURNS TEXT
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT COALESCE(primary_role, 'customer')
  FROM public.user_role_preferences 
  WHERE user_id = target_user_id;
$$;

-- Function to automatically create user profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, username, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', LOWER(REPLACE(COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), ' ', '-'))),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  
  INSERT INTO public.user_role_preferences (user_id, primary_role)
  VALUES (NEW.id, 'customer');
  
  RETURN NEW;
END;
$$;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_profile();
