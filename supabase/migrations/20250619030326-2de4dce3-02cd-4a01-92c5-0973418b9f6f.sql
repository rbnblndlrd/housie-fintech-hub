
-- Add professional license requirements to services table
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS background_check_required boolean DEFAULT false;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS ccq_rbq_required boolean DEFAULT false;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS risk_category text DEFAULT 'low';

-- Add license verification to provider_profiles table
ALTER TABLE public.provider_profiles ADD COLUMN IF NOT EXISTS ccq_license_number text;
ALTER TABLE public.provider_profiles ADD COLUMN IF NOT EXISTS rbq_license_number text;
ALTER TABLE public.provider_profiles ADD COLUMN IF NOT EXISTS ccq_verified boolean DEFAULT false;
ALTER TABLE public.provider_profiles ADD COLUMN IF NOT EXISTS rbq_verified boolean DEFAULT false;
ALTER TABLE public.provider_profiles ADD COLUMN IF NOT EXISTS background_check_verified boolean DEFAULT false;
ALTER TABLE public.provider_profiles ADD COLUMN IF NOT EXISTS professional_license_verified boolean DEFAULT false;

-- Create enum for verification levels
CREATE TYPE verification_level AS ENUM ('basic', 'background_check', 'professional_license');

-- Add verification level to provider profiles
ALTER TABLE public.provider_profiles ADD COLUMN IF NOT EXISTS verification_level verification_level DEFAULT 'basic';

-- Create subcategories lookup table
CREATE TABLE IF NOT EXISTS public.service_subcategories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  subcategory text NOT NULL,
  background_check_required boolean DEFAULT false,
  ccq_rbq_required boolean DEFAULT false,
  risk_category text DEFAULT 'low',
  description text,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(category, subcategory)
);

-- Insert standardized subcategories
INSERT INTO public.service_subcategories (category, subcategory, background_check_required, ccq_rbq_required, risk_category, description) VALUES
-- CLEANING subcategories
('cleaning', 'residential_interior', true, false, 'high', 'Interior home cleaning with access to private spaces'),
('cleaning', 'commercial_cleaning', false, false, 'low', 'Commercial and office space cleaning'),
('cleaning', 'post_construction', false, false, 'medium', 'Post-construction cleanup and debris removal'),
('cleaning', 'exterior_washing', false, false, 'low', 'Exterior building, window, and surface washing'),
('cleaning', 'extermination_pest_control', true, false, 'high', 'Pest control and extermination services requiring home access'),

-- LAWN_CARE subcategories (all outdoor, no background check)
('lawn_care', 'lawn_mowing', false, false, 'low', 'Regular lawn mowing and maintenance'),
('lawn_care', 'landscaping_design', false, false, 'low', 'Landscape design and installation services'),
('lawn_care', 'snow_removal', false, false, 'low', 'Snow removal and winter maintenance'),
('lawn_care', 'garden_maintenance', false, false, 'low', 'Garden care and plant maintenance'),
('lawn_care', 'tree_services', false, false, 'medium', 'Tree trimming, removal, and arboriculture'),

-- CONSTRUCTION subcategories
('construction', 'handyman_repairs', true, true, 'high', 'Indoor repairs and maintenance requiring CCQ/RBQ license'),
('construction', 'exterior_renovation', false, true, 'medium', 'Exterior renovations, roofing, siding, and patio work requiring CCQ/RBQ'),
('construction', 'painting_services', true, false, 'medium', 'Interior and exterior painting services'),
('construction', 'flooring_installation', true, true, 'high', 'Floor installation and refinishing requiring CCQ/RBQ license'),
('construction', 'roofing_siding', false, true, 'medium', 'Specialized roofing and siding work requiring CCQ/RBQ license'),

-- WELLNESS subcategories (all require background check)
('wellness', 'massage_therapy', true, false, 'high', 'Professional massage therapy services'),
('wellness', 'personal_training', true, false, 'medium', 'Personal fitness training and coaching'),
('wellness', 'nutrition_consulting', true, false, 'medium', 'Nutritional counseling and meal planning'),
('wellness', 'mental_health_coaching', true, false, 'high', 'Mental health and wellness coaching'),
('wellness', 'elder_care_assistance', true, false, 'high', 'Elder care and assistance services'),

-- CARE_PETS subcategories (all require background check)
('care_pets', 'dog_walking', true, false, 'medium', 'Dog walking and pet exercise services'),
('care_pets', 'pet_sitting_home', true, false, 'high', 'In-home pet sitting and care'),
('care_pets', 'grooming_mobile', true, false, 'medium', 'Mobile pet grooming services'),
('care_pets', 'veterinary_home_visits', true, false, 'high', 'Mobile veterinary and health services'),
('care_pets', 'pet_training', true, false, 'medium', 'Pet training and behavioral services')

ON CONFLICT (category, subcategory) DO UPDATE SET
  background_check_required = EXCLUDED.background_check_required,
  ccq_rbq_required = EXCLUDED.ccq_rbq_required,
  risk_category = EXCLUDED.risk_category,
  description = EXCLUDED.description;

-- Enable RLS on subcategories table
ALTER TABLE public.service_subcategories ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access to subcategories
CREATE POLICY "Public can view service subcategories" ON public.service_subcategories
FOR SELECT USING (true);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_services_category_subcategory ON public.services(category, subcategory);
CREATE INDEX IF NOT EXISTS idx_services_background_check ON public.services(background_check_required);
CREATE INDEX IF NOT EXISTS idx_services_ccq_rbq ON public.services(ccq_rbq_required);
CREATE INDEX IF NOT EXISTS idx_provider_profiles_verification ON public.provider_profiles(verification_level);
