
-- First, let's update all subcategories to match our new structure
UPDATE public.services SET 
  subcategory = 'lawn_care_maintenance'
WHERE category = 'lawn_snow' AND subcategory = 'mowing';

UPDATE public.services SET 
  subcategory = 'residential_home_cleaning'
WHERE category = 'cleaning' AND subcategory IN ('house_cleaning', 'home_cleaning', 'residential_cleaning', 'cleaning');

UPDATE public.services SET 
  subcategory = 'handyman_minor_repairs'
WHERE category = 'construction' AND subcategory IN ('handyman', 'repairs', 'maintenance', 'construction');

UPDATE public.services SET 
  subcategory = 'personal_training_fitness'
WHERE category = 'wellness' AND subcategory IN ('fitness', 'training', 'personal_training', 'wellness');

UPDATE public.services SET 
  subcategory = 'dog_walking_exercise'
WHERE category = 'care_pets' AND subcategory IN ('dog_walking', 'pet_care', 'care_pets');

-- Update any remaining subcategories to default values based on category
UPDATE public.services SET subcategory = 'residential_home_cleaning' WHERE category = 'cleaning' AND subcategory NOT IN ('residential_home_cleaning', 'business_office_cleaning', 'move_in_out_deep_cleaning', 'carpet_window_interior_specialties', 'exterior_cleaning_pressure_washing');

UPDATE public.services SET subcategory = 'personal_training_fitness' WHERE category = 'wellness' AND subcategory NOT IN ('therapeutic_bodywork_services', 'personal_training_fitness', 'health_nutrition_coaching', 'life_wellness_coaching', 'senior_disability_support');

UPDATE public.services SET subcategory = 'dog_walking_exercise' WHERE category = 'care_pets' AND subcategory NOT IN ('dog_walking_exercise', 'mobile_grooming_care', 'pet_daycare_boarding', 'veterinary_training_services', 'pet_transportation_support');

UPDATE public.services SET subcategory = 'lawn_care_maintenance' WHERE category = 'lawn_snow' AND subcategory NOT IN ('lawn_care_maintenance', 'landscaping_garden_design', 'snow_ice_management', 'tree_yard_services', 'outdoor_seasonal_services');

UPDATE public.services SET subcategory = 'handyman_minor_repairs' WHERE category = 'construction' AND subcategory NOT IN ('handyman_minor_repairs', 'exterior_renovation_siding', 'painting_finishing_services', 'flooring_interior_work', 'pest_control_extermination', 'roofing_structural_work');

-- Drop and recreate the service_subcategories table with the new structure
DROP TABLE IF EXISTS public.service_subcategories CASCADE;

-- Create enum for professional license types
DROP TYPE IF EXISTS professional_license_type CASCADE;
CREATE TYPE professional_license_type AS ENUM ('rmt', 'physio', 'osteo', 'chiro', 'veterinary', 'ccq', 'rbq', 'pest_control');

-- Recreate service_subcategories table with new structure including icons
CREATE TABLE public.service_subcategories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  subcategory text NOT NULL,
  subcategory_id text NOT NULL,
  icon text NOT NULL,
  background_check_required boolean DEFAULT false,
  professional_license_required boolean DEFAULT false,
  professional_license_type professional_license_type,
  ccq_rbq_required boolean DEFAULT false,
  risk_category text DEFAULT 'low',
  description text,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(category, subcategory_id)
);

-- Insert the new 5-category structure with emojis and verification requirements
INSERT INTO public.service_subcategories (category, subcategory, subcategory_id, icon, background_check_required, professional_license_required, professional_license_type, ccq_rbq_required, risk_category, description) VALUES
-- CLEANING subcategories
('cleaning', 'Residential & Home Cleaning', 'residential_home_cleaning', '🏠', true, false, null, false, 'high', 'Interior home cleaning with access to private spaces'),
('cleaning', 'Business & Office Cleaning', 'business_office_cleaning', '🏢', true, false, null, false, 'high', 'Commercial office and business space cleaning'),
('cleaning', 'Move-in/Move-out & Deep Cleaning', 'move_in_out_deep_cleaning', '📦', true, false, null, false, 'high', 'Deep cleaning for property transitions'),
('cleaning', 'Carpet, Window & Interior Specialties', 'carpet_window_interior_specialties', '🪟', true, false, null, false, 'high', 'Specialized interior cleaning services'),
('cleaning', 'Exterior Cleaning & Pressure Washing', 'exterior_cleaning_pressure_washing', '🚿', false, false, null, false, 'low', 'Exterior building and surface cleaning'),

-- WELLNESS subcategories
('wellness', 'Therapeutic & Bodywork Services', 'therapeutic_bodywork_services', '🩺', false, true, 'rmt', false, 'medium', 'Licensed therapeutic services (RMT, Physio, Osteo, Chiro)'),
('wellness', 'Personal Training & Fitness', 'personal_training_fitness', '💪', false, false, null, false, 'low', 'Outdoor and gym-based fitness training'),
('wellness', 'Health & Nutrition Coaching', 'health_nutrition_coaching', '🥗', false, false, null, false, 'low', 'Health and nutritional guidance services'),
('wellness', 'Life & Wellness Coaching', 'life_wellness_coaching', '🧘', false, false, null, false, 'low', 'Life coaching and wellness mentoring'),
('wellness', 'Senior & Disability Support', 'senior_disability_support', '👴', true, false, null, false, 'high', 'Support services for seniors and disabled individuals'),

-- CARE_PETS subcategories
('care_pets', 'Dog Walking & Exercise', 'dog_walking_exercise', '🚶', false, false, null, false, 'low', 'Outdoor dog walking and exercise services'),
('care_pets', 'Mobile Grooming & Care', 'mobile_grooming_care', '✂️', false, false, null, false, 'low', 'Mobile pet grooming and care services'),
('care_pets', 'Pet Daycare & Boarding', 'pet_daycare_boarding', '🏨', false, false, null, false, 'low', 'Pet daycare and boarding services'),
('care_pets', 'Veterinary & Training Services', 'veterinary_training_services', '🩹', false, true, 'veterinary', false, 'medium', 'Licensed veterinary and professional pet training'),
('care_pets', 'Pet Transportation & Support', 'pet_transportation_support', '🚗', false, false, null, false, 'low', 'Pet transportation and support services'),

-- LAWN_SNOW subcategories (all outdoor, no background checks)
('lawn_snow', 'Lawn Care & Maintenance', 'lawn_care_maintenance', '🏡', false, false, null, false, 'low', 'Regular lawn mowing and maintenance'),
('lawn_snow', 'Landscaping & Garden Design', 'landscaping_garden_design', '🌳', false, false, null, false, 'low', 'Landscape design and garden installation'),
('lawn_snow', 'Snow & Ice Management', 'snow_ice_management', '❄️', false, false, null, false, 'low', 'Snow removal and winter maintenance'),
('lawn_snow', 'Tree & Yard Services', 'tree_yard_services', '🌲', false, false, null, false, 'medium', 'Tree trimming, removal, and yard services'),
('lawn_snow', 'Outdoor Seasonal Services', 'outdoor_seasonal_services', '🎄', false, false, null, false, 'low', 'Holiday decorations, seasonal cleanup, event setup'),

-- CONSTRUCTION subcategories (all require background check + professional licenses)
('construction', 'Handyman & Minor Repairs', 'handyman_minor_repairs', '🔧', true, false, null, true, 'high', 'Handyman services and minor repairs requiring CCQ/RBQ'),
('construction', 'Exterior Renovation & Siding', 'exterior_renovation_siding', '🏗️', true, false, null, true, 'high', 'Exterior renovation and siding work requiring CCQ/RBQ'),
('construction', 'Painting & Finishing Services', 'painting_finishing_services', '🎨', true, false, null, true, 'high', 'Professional painting and finishing requiring CCQ/RBQ'),
('construction', 'Flooring & Interior Work', 'flooring_interior_work', '🪵', true, false, null, true, 'high', 'Flooring installation and interior work requiring CCQ/RBQ'),
('construction', 'Pest Control & Extermination', 'pest_control_extermination', '🐛', true, true, 'pest_control', false, 'high', 'Professional pest control requiring license'),
('construction', 'Roofing & Structural Work', 'roofing_structural_work', '🏠', true, false, null, true, 'high', 'Roofing and structural work requiring CCQ/RBQ');

-- Add professional license type to provider profiles
ALTER TABLE public.provider_profiles ADD COLUMN IF NOT EXISTS professional_license_type professional_license_type;
ALTER TABLE public.provider_profiles ADD COLUMN IF NOT EXISTS professional_license_verified boolean DEFAULT false;

-- Enable RLS
ALTER TABLE public.service_subcategories ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Public can view service subcategories" ON public.service_subcategories
FOR SELECT USING (true);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_service_subcategories_category ON public.service_subcategories(category);
CREATE INDEX IF NOT EXISTS idx_service_subcategories_verification ON public.service_subcategories(background_check_required, professional_license_required, ccq_rbq_required);
