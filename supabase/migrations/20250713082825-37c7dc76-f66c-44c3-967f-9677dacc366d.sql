-- Create placeholder service templates for all subcategories
-- First, add metadata columns to bookings table for fallback data
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS subcategory TEXT,
ADD COLUMN IF NOT EXISTS service_title TEXT;

-- Create placeholder services for all defined subcategories with a fixed UUID 
-- (representing system/placeholder services)
INSERT INTO services (provider_id, title, description, category, subcategory, base_price, pricing_type, active)
SELECT 
  '00000000-0000-0000-0000-000000000000',
  'Generic ' || subcategory_label,
  'Placeholder service for subcategory ' || subcategory_value,
  category_value,
  subcategory_value,
  0,
  pricing,
  false
FROM (VALUES 
  -- Personal Wellness
  ('wellness', 'massage', 'Massage Therapy', 'hourly'),
  ('wellness', 'tattoo', 'Tattooing', 'project'),
  ('wellness', 'haircuts', 'Haircuts / Styling', 'hourly'),
  ('wellness', 'makeup', 'Makeup Services', 'hourly'),
  
  -- Cleaning Services
  ('cleaning', 'house_cleaning', 'House Cleaning', 'hourly'),
  ('cleaning', 'deep_cleaning', 'Deep Cleaning', 'project'),
  ('cleaning', 'move_cleaning', 'Move-in / Move-out Cleaning', 'project'),
  ('cleaning', 'post_reno_cleanup', 'Post-Renovation Cleanup', 'project'),
  
  -- Exterior & Grounds
  ('exterior', 'lawn_mowing', 'Lawn Mowing', 'hourly'),
  ('exterior', 'snow_removal', 'Snow Removal', 'hourly'),
  ('exterior', 'leaf_removal', 'Leaf Removal', 'hourly'),
  ('exterior', 'hedge_trimming', 'Hedge Trimming', 'hourly'),
  ('exterior', 'pressure_washing', 'Pressure Washing', 'hourly'),
  ('exterior', 'gutter_cleaning', 'Gutter Cleaning', 'project'),
  
  -- Pet Care Services
  ('petcare', 'dog_walking', 'Dog Walking', 'hourly'),
  ('petcare', 'pet_sitting', 'Pet Sitting', 'hourly'),
  ('petcare', 'litter_change', 'Litter Change', 'hourly'),
  ('petcare', 'pet_feeding', 'Pet Feeding', 'hourly'),
  
  -- Appliance & Tech Repair
  ('repairs', 'washer_dryer_repair', 'Washer / Dryer Repair', 'project'),
  ('repairs', 'fridge_repair', 'Fridge / Freezer Repair', 'project'),
  ('repairs', 'dishwasher_repair', 'Dishwasher Repair', 'project'),
  ('repairs', 'tv_setup', 'Smart TV / Device Setup', 'project'),
  ('repairs', 'computer_support', 'Computer / Tech Support', 'hourly'),
  
  -- Event Services
  ('events', 'event_setup', 'Event Setup / Teardown', 'project'),
  ('events', 'furniture_moving', 'Furniture Moving', 'hourly'),
  ('events', 'decor', 'Balloon / Decor', 'project'),
  ('events', 'event_cleaning', 'On-site Cleaning', 'hourly'),
  ('events', 'bartending', 'Bartending', 'hourly'),
  
  -- Moving & Delivery
  ('moving', 'furniture_moving', 'Furniture Moving', 'hourly'),
  ('moving', 'truck_delivery', 'Small Truck Delivery', 'project'),
  ('moving', 'packing_help', 'Packing Help', 'hourly'),
  ('moving', 'box_service', 'Box Drop-off / Return', 'project')
) AS data(category_value, subcategory_value, subcategory_label, pricing)
WHERE NOT EXISTS (
  SELECT 1 FROM services 
  WHERE category = data.category_value 
  AND subcategory = data.subcategory_value 
  AND title = 'Generic ' || data.subcategory_label
);