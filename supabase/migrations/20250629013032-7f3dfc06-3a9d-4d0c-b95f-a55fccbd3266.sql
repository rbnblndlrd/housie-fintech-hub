
-- Add all missing columns to user_profiles table for the unified profile system
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS community_rating_points integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS shop_points integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_reviews_received integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_bookings integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS quality_commendations integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS reliability_commendations integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS courtesy_commendations integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS achievement_badges jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS can_provide_services boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS can_book_services boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS active_role text DEFAULT 'customer',
ADD COLUMN IF NOT EXISTS profile_type text DEFAULT 'individual',
ADD COLUMN IF NOT EXISTS business_name text,
ADD COLUMN IF NOT EXISTS description text,
ADD COLUMN IF NOT EXISTS years_experience integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS hourly_rate numeric,
ADD COLUMN IF NOT EXISTS service_radius_km integer DEFAULT 25,
ADD COLUMN IF NOT EXISTS verification_level text DEFAULT 'basic',
ADD COLUMN IF NOT EXISTS verified boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS background_check_verified boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS professional_license_verified boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS professional_license_type text,
ADD COLUMN IF NOT EXISTS insurance_verified boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS cra_compliant boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS rbq_verified boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS ccq_verified boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS rbq_license_number text,
ADD COLUMN IF NOT EXISTS ccq_license_number text,
ADD COLUMN IF NOT EXISTS response_time_hours numeric;

-- Check the updated structure
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position;
