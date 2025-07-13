-- Create placeholder service templates for all subcategories
-- First, add metadata columns to bookings table for fallback data
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS subcategory TEXT,
ADD COLUMN IF NOT EXISTS service_title TEXT;

-- Create system user and provider profile if they don't exist
DO $$
DECLARE 
    system_user_id UUID := '00000000-0000-0000-0000-000000000000';
    system_provider_id UUID;
BEGIN
    -- Insert system user if it doesn't exist
    INSERT INTO users (id, email, full_name, user_role)
    VALUES (system_user_id, 'system@housie.ca', 'HOUSIE System Services', 'provider')
    ON CONFLICT (id) DO NOTHING;
    
    -- Insert system provider profile if it doesn't exist  
    INSERT INTO provider_profiles (id, user_id, business_name, description, verified)
    VALUES (system_user_id, system_user_id, 'HOUSIE System Services', 'System-generated placeholder services', true)
    ON CONFLICT (id) DO NOTHING;
    
    -- Now create placeholder services using the system provider
    INSERT INTO services (provider_id, title, description, category, subcategory, base_price, pricing_type, active)
    SELECT 
      system_user_id,
      'Generic ' || subcategory_label,
      'Placeholder service for subcategory ' || subcategory_value,
      category_value,
      subcategory_value,
      0,
      pricing,
      false
    FROM (VALUES 
      -- Personal Wellness
      ('personal_wellness', 'massage', 'Massage Therapy', 'hourly'),
      ('personal_wellness', 'tattoo', 'Tattooing', 'flat'),
      ('personal_wellness', 'haircuts', 'Haircuts / Styling', 'hourly'),
      ('personal_wellness', 'makeup', 'Makeup Services', 'hourly'),
      
      -- Cleaning Services
      ('cleaning', 'house_cleaning', 'House Cleaning', 'hourly'),
      ('cleaning', 'deep_cleaning', 'Deep Cleaning', 'flat'),
      ('cleaning', 'move_cleaning', 'Move-in / Move-out Cleaning', 'flat'),
      ('cleaning', 'post_reno_cleanup', 'Post-Renovation Cleanup', 'flat'),
      
      -- Exterior & Grounds
      ('exterior_grounds', 'lawn_mowing', 'Lawn Mowing', 'hourly'),
      ('exterior_grounds', 'snow_removal', 'Snow Removal', 'hourly'),
      ('exterior_grounds', 'leaf_removal', 'Leaf Removal', 'hourly'),
      ('exterior_grounds', 'hedge_trimming', 'Hedge Trimming', 'hourly'),
      ('exterior_grounds', 'pressure_washing', 'Pressure Washing', 'hourly'),
      ('exterior_grounds', 'gutter_cleaning', 'Gutter Cleaning', 'flat'),
      
      -- Pet Care Services
      ('pet_care', 'dog_walking', 'Dog Walking', 'hourly'),
      ('pet_care', 'pet_sitting', 'Pet Sitting', 'hourly'),
      ('pet_care', 'litter_change', 'Litter Change', 'hourly'),
      ('pet_care', 'pet_feeding', 'Pet Feeding', 'hourly'),
      
      -- Appliance & Tech Repair
      ('appliance_tech', 'washer_dryer_repair', 'Washer / Dryer Repair', 'flat'),
      ('appliance_tech', 'fridge_repair', 'Fridge / Freezer Repair', 'flat'),
      ('appliance_tech', 'dishwasher_repair', 'Dishwasher Repair', 'flat'),
      ('appliance_tech', 'tv_setup', 'Smart TV / Device Setup', 'flat'),
      ('appliance_tech', 'computer_support', 'Computer / Tech Support', 'hourly'),
      
      -- Event Services
      ('event_services', 'event_setup', 'Event Setup / Teardown', 'flat'),
      ('event_services', 'furniture_moving', 'Furniture Moving', 'hourly'),
      ('event_services', 'decor', 'Balloon / Decor', 'flat'),
      ('event_services', 'event_cleaning', 'On-site Cleaning', 'hourly'),
      ('event_services', 'bartending', 'Bartending', 'hourly'),
      
      -- Moving & Delivery
      ('moving_services', 'furniture_moving', 'Furniture Moving', 'hourly'),
      ('moving_services', 'truck_delivery', 'Small Truck Delivery', 'flat'),
      ('moving_services', 'packing_help', 'Packing Help', 'hourly'),
      ('moving_services', 'box_service', 'Box Drop-off / Return', 'flat')
    ) AS data(category_value, subcategory_value, subcategory_label, pricing)
    WHERE NOT EXISTS (
      SELECT 1 FROM services 
      WHERE category = data.category_value 
      AND subcategory = data.subcategory_value 
      AND title = 'Generic ' || data.subcategory_label
    );
END $$;