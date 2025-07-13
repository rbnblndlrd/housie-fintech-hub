-- Create placeholder service templates for all subcategories
-- First, add metadata columns to bookings table for fallback data
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS subcategory TEXT,
ADD COLUMN IF NOT EXISTS service_title TEXT;

-- Find a system provider_id to use, or create one if needed
DO $$
DECLARE 
    system_provider_id UUID;
BEGIN
    -- Try to find existing system provider
    SELECT id INTO system_provider_id 
    FROM provider_profiles 
    WHERE business_name = 'HOUSIE System Services' 
    LIMIT 1;
    
    -- If no system provider exists, we'll use a default UUID
    -- This should be updated later to link to an actual system provider
    IF system_provider_id IS NULL THEN
        system_provider_id := '00000000-0000-0000-0000-000000000000';
    END IF;

    -- Create placeholder services for all defined subcategories
    -- Personal Wellness
    INSERT INTO services (provider_id, title, description, category, subcategory, base_price, pricing_type, active)
    VALUES 
      (system_provider_id, 'Generic Massage Therapy', 'Placeholder service for subcategory massage', 'wellness', 'massage', 0, 'hourly', false),
      (system_provider_id, 'Generic Tattooing', 'Placeholder service for subcategory tattoo', 'wellness', 'tattoo', 0, 'project', false),
      (system_provider_id, 'Generic Haircuts / Styling', 'Placeholder service for subcategory haircuts', 'wellness', 'haircuts', 0, 'hourly', false),
      (system_provider_id, 'Generic Makeup Services', 'Placeholder service for subcategory makeup', 'wellness', 'makeup', 0, 'hourly', false),

      -- Cleaning Services  
      (system_provider_id, 'Generic House Cleaning', 'Placeholder service for subcategory house_cleaning', 'cleaning', 'house_cleaning', 0, 'hourly', false),
      (system_provider_id, 'Generic Deep Cleaning', 'Placeholder service for subcategory deep_cleaning', 'cleaning', 'deep_cleaning', 0, 'project', false),
      (system_provider_id, 'Generic Move-in / Move-out Cleaning', 'Placeholder service for subcategory move_cleaning', 'cleaning', 'move_cleaning', 0, 'project', false),
      (system_provider_id, 'Generic Post-Renovation Cleanup', 'Placeholder service for subcategory post_reno_cleanup', 'cleaning', 'post_reno_cleanup', 0, 'project', false),

      -- Exterior & Grounds
      (system_provider_id, 'Generic Lawn Mowing', 'Placeholder service for subcategory lawn_mowing', 'exterior', 'lawn_mowing', 0, 'hourly', false),
      (system_provider_id, 'Generic Snow Removal', 'Placeholder service for subcategory snow_removal', 'exterior', 'snow_removal', 0, 'hourly', false),
      (system_provider_id, 'Generic Leaf Removal', 'Placeholder service for subcategory leaf_removal', 'exterior', 'leaf_removal', 0, 'hourly', false),
      (system_provider_id, 'Generic Hedge Trimming', 'Placeholder service for subcategory hedge_trimming', 'exterior', 'hedge_trimming', 0, 'hourly', false),
      (system_provider_id, 'Generic Pressure Washing', 'Placeholder service for subcategory pressure_washing', 'exterior', 'pressure_washing', 0, 'hourly', false),
      (system_provider_id, 'Generic Gutter Cleaning', 'Placeholder service for subcategory gutter_cleaning', 'exterior', 'gutter_cleaning', 0, 'project', false),

      -- Pet Care Services
      (system_provider_id, 'Generic Dog Walking', 'Placeholder service for subcategory dog_walking', 'petcare', 'dog_walking', 0, 'hourly', false),
      (system_provider_id, 'Generic Pet Sitting', 'Placeholder service for subcategory pet_sitting', 'petcare', 'pet_sitting', 0, 'hourly', false),
      (system_provider_id, 'Generic Litter Change', 'Placeholder service for subcategory litter_change', 'petcare', 'litter_change', 0, 'hourly', false),
      (system_provider_id, 'Generic Pet Feeding', 'Placeholder service for subcategory pet_feeding', 'petcare', 'pet_feeding', 0, 'hourly', false),

      -- Appliance & Tech Repair
      (system_provider_id, 'Generic Washer / Dryer Repair', 'Placeholder service for subcategory washer_dryer_repair', 'repairs', 'washer_dryer_repair', 0, 'project', false),
      (system_provider_id, 'Generic Fridge / Freezer Repair', 'Placeholder service for subcategory fridge_repair', 'repairs', 'fridge_repair', 0, 'project', false),
      (system_provider_id, 'Generic Dishwasher Repair', 'Placeholder service for subcategory dishwasher_repair', 'repairs', 'dishwasher_repair', 0, 'project', false),
      (system_provider_id, 'Generic Smart TV / Device Setup', 'Placeholder service for subcategory tv_setup', 'repairs', 'tv_setup', 0, 'project', false),
      (system_provider_id, 'Generic Computer / Tech Support', 'Placeholder service for subcategory computer_support', 'repairs', 'computer_support', 0, 'hourly', false),

      -- Event Services
      (system_provider_id, 'Generic Event Setup / Teardown', 'Placeholder service for subcategory event_setup', 'events', 'event_setup', 0, 'project', false),
      (system_provider_id, 'Generic Furniture Moving', 'Placeholder service for subcategory furniture_moving', 'events', 'furniture_moving', 0, 'hourly', false),
      (system_provider_id, 'Generic Balloon / Decor', 'Placeholder service for subcategory decor', 'events', 'decor', 0, 'project', false),
      (system_provider_id, 'Generic On-site Cleaning', 'Placeholder service for subcategory event_cleaning', 'events', 'event_cleaning', 0, 'hourly', false),
      (system_provider_id, 'Generic Bartending', 'Placeholder service for subcategory bartending', 'events', 'bartending', 0, 'hourly', false),

      -- Moving & Delivery
      (system_provider_id, 'Generic Furniture Moving', 'Placeholder service for subcategory furniture_moving', 'moving', 'furniture_moving', 0, 'hourly', false),
      (system_provider_id, 'Generic Small Truck Delivery', 'Placeholder service for subcategory truck_delivery', 'moving', 'truck_delivery', 0, 'project', false),
      (system_provider_id, 'Generic Packing Help', 'Placeholder service for subcategory packing_help', 'moving', 'packing_help', 0, 'hourly', false),
      (system_provider_id, 'Generic Box Drop-off / Return', 'Placeholder service for subcategory box_service', 'moving', 'box_service', 0, 'project', false)

    ON CONFLICT (provider_id, title, category) DO NOTHING;
END $$;