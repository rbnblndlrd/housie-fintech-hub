
-- First remove the constraint entirely
ALTER TABLE public.services DROP CONSTRAINT IF EXISTS services_category_check;

-- Update any existing lawn_care to lawn_snow
UPDATE public.services 
SET category = 'lawn_snow' 
WHERE category = 'lawn_care';

-- Now add the constraint with the correct categories
ALTER TABLE public.services ADD CONSTRAINT services_category_check 
CHECK (category IN ('cleaning', 'wellness', 'care_pets', 'lawn_snow', 'construction'));
