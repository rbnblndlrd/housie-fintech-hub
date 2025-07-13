-- Create placeholder service templates for all subcategories
-- This allows bookings with service_id to still link to something meaningful

-- First, add metadata columns to bookings table for fallback data
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS subcategory TEXT,
ADD COLUMN IF NOT EXISTS service_title TEXT;

-- Create placeholder services for all defined subcategories
-- Personal Wellness
INSERT INTO services (title, description, category, subcategory, base_price, pricing_type, active, created_at, updated_at)
VALUES 
  ('Generic Massage Therapy', 'Placeholder service for subcategory massage', 'wellness', 'massage', 0, 'hourly', false, now(), now()),
  ('Generic Tattooing', 'Placeholder service for subcategory tattoo', 'wellness', 'tattoo', 0, 'project', false, now(), now()),
  ('Generic Haircuts / Styling', 'Placeholder service for subcategory haircuts', 'wellness', 'haircuts', 0, 'hourly', false, now(), now()),
  ('Generic Makeup Services', 'Placeholder service for subcategory makeup', 'wellness', 'makeup', 0, 'hourly', false, now(), now()),

  -- Cleaning Services  
  ('Generic House Cleaning', 'Placeholder service for subcategory house_cleaning', 'cleaning', 'house_cleaning', 0, 'hourly', false, now(), now()),
  ('Generic Deep Cleaning', 'Placeholder service for subcategory deep_cleaning', 'cleaning', 'deep_cleaning', 0, 'project', false, now(), now()),
  ('Generic Move-in / Move-out Cleaning', 'Placeholder service for subcategory move_cleaning', 'cleaning', 'move_cleaning', 0, 'project', false, now(), now()),
  ('Generic Post-Renovation Cleanup', 'Placeholder service for subcategory post_reno_cleanup', 'cleaning', 'post_reno_cleanup', 0, 'project', false, now(), now()),

  -- Exterior & Grounds
  ('Generic Lawn Mowing', 'Placeholder service for subcategory lawn_mowing', 'exterior', 'lawn_mowing', 0, 'hourly', false, now(), now()),
  ('Generic Snow Removal', 'Placeholder service for subcategory snow_removal', 'exterior', 'snow_removal', 0, 'hourly', false, now(), now()),
  ('Generic Leaf Removal', 'Placeholder service for subcategory leaf_removal', 'exterior', 'leaf_removal', 0, 'hourly', false, now(), now()),
  ('Generic Hedge Trimming', 'Placeholder service for subcategory hedge_trimming', 'exterior', 'hedge_trimming', 0, 'hourly', false, now(), now()),
  ('Generic Pressure Washing', 'Placeholder service for subcategory pressure_washing', 'exterior', 'pressure_washing', 0, 'hourly', false, now(), now()),
  ('Generic Gutter Cleaning', 'Placeholder service for subcategory gutter_cleaning', 'exterior', 'gutter_cleaning', 0, 'project', false, now(), now()),

  -- Pet Care Services
  ('Generic Dog Walking', 'Placeholder service for subcategory dog_walking', 'petcare', 'dog_walking', 0, 'hourly', false, now(), now()),
  ('Generic Pet Sitting', 'Placeholder service for subcategory pet_sitting', 'petcare', 'pet_sitting', 0, 'hourly', false, now(), now()),
  ('Generic Litter Change', 'Placeholder service for subcategory litter_change', 'petcare', 'litter_change', 0, 'hourly', false, now(), now()),
  ('Generic Pet Feeding', 'Placeholder service for subcategory pet_feeding', 'petcare', 'pet_feeding', 0, 'hourly', false, now(), now()),

  -- Appliance & Tech Repair
  ('Generic Washer / Dryer Repair', 'Placeholder service for subcategory washer_dryer_repair', 'repairs', 'washer_dryer_repair', 0, 'project', false, now(), now()),
  ('Generic Fridge / Freezer Repair', 'Placeholder service for subcategory fridge_repair', 'repairs', 'fridge_repair', 0, 'project', false, now(), now()),
  ('Generic Dishwasher Repair', 'Placeholder service for subcategory dishwasher_repair', 'repairs', 'dishwasher_repair', 0, 'project', false, now(), now()),
  ('Generic Smart TV / Device Setup', 'Placeholder service for subcategory tv_setup', 'repairs', 'tv_setup', 0, 'project', false, now(), now()),
  ('Generic Computer / Tech Support', 'Placeholder service for subcategory computer_support', 'repairs', 'computer_support', 0, 'hourly', false, now(), now()),

  -- Event Services
  ('Generic Event Setup / Teardown', 'Placeholder service for subcategory event_setup', 'events', 'event_setup', 0, 'project', false, now(), now()),
  ('Generic Furniture Moving', 'Placeholder service for subcategory furniture_moving', 'events', 'furniture_moving', 0, 'hourly', false, now(), now()),
  ('Generic Balloon / Decor', 'Placeholder service for subcategory decor', 'events', 'decor', 0, 'project', false, now(), now()),
  ('Generic On-site Cleaning', 'Placeholder service for subcategory event_cleaning', 'events', 'event_cleaning', 0, 'hourly', false, now(), now()),
  ('Generic Bartending', 'Placeholder service for subcategory bartending', 'events', 'bartending', 0, 'hourly', false, now(), now()),

  -- Moving & Delivery
  ('Generic Furniture Moving', 'Placeholder service for subcategory furniture_moving', 'moving', 'furniture_moving', 0, 'hourly', false, now(), now()),
  ('Generic Small Truck Delivery', 'Placeholder service for subcategory truck_delivery', 'moving', 'truck_delivery', 0, 'project', false, now(), now()),
  ('Generic Packing Help', 'Placeholder service for subcategory packing_help', 'moving', 'packing_help', 0, 'hourly', false, now(), now()),
  ('Generic Box Drop-off / Return', 'Placeholder service for subcategory box_service', 'moving', 'box_service', 0, 'project', false, now(), now())

ON CONFLICT (title, category, subcategory) DO NOTHING;