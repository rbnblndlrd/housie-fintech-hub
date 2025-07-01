
-- Remove the existing check constraint on services.category
ALTER TABLE services DROP CONSTRAINT IF EXISTS services_category_check;

-- Add the new 7-category structure to service_subcategories table with detailed subcategories
INSERT INTO service_subcategories (category, subcategory, subcategory_id, icon, background_check_required, ccq_rbq_required, risk_category, description) VALUES

-- 1. Personal Wellness (💆)
('personal_wellness', 'Massage Therapy (Mobile/In-home)', 'massage_therapy', '💆', true, false, 'medium', 'Professional massage therapy services provided in client homes'),
('personal_wellness', 'Registered Massage Therapy', 'rmt_therapy', '🏥', true, true, 'high', 'Licensed RMT services with insurance receipts'),
('personal_wellness', 'Relaxation Massage', 'relaxation_massage', '🧘', true, false, 'medium', 'Therapeutic relaxation and stress relief massage'),
('personal_wellness', 'Deep Tissue Therapy', 'deep_tissue', '💪', true, false, 'medium', 'Targeted deep tissue massage therapy'),
('personal_wellness', 'Sports Massage', 'sports_massage', '🏃', true, false, 'medium', 'Specialized massage for athletes and active individuals'),
('personal_wellness', 'Prenatal Massage', 'prenatal_massage', '🤱', true, true, 'high', 'Specialized massage for expecting mothers'),

-- 2. Cleaning Services (🧹)
('cleaning', 'House Cleaning (Regular)', 'house_cleaning_regular', '🏠', false, false, 'low', 'Regular weekly/bi-weekly house cleaning services'),
('cleaning', 'House Cleaning (One-time)', 'house_cleaning_onetime', '🧽', false, false, 'low', 'One-time deep house cleaning service'),
('cleaning', 'Deep Cleaning', 'deep_cleaning', '🧹', false, false, 'low', 'Intensive deep cleaning for homes and offices'),
('cleaning', 'Move-in/Move-out Cleaning', 'move_cleaning', '📦', false, false, 'low', 'Specialized cleaning for moving situations'),
('cleaning', 'Post-Construction Cleanup', 'construction_cleanup', '🏗️', false, false, 'medium', 'Cleanup after construction or renovation work'),
('cleaning', 'Office/Commercial Cleaning', 'commercial_cleaning', '🏢', false, false, 'low', 'Professional office and commercial space cleaning'),
('cleaning', 'Window Cleaning', 'window_cleaning', '🪟', false, false, 'low', 'Interior and exterior window cleaning services'),

-- 3. Exterior & Grounds (🌿)
('exterior_grounds', 'Lawn Mowing & Maintenance', 'lawn_mowing', '🌱', false, false, 'low', 'Regular lawn care and maintenance services'),
('exterior_grounds', 'Landscaping & Design', 'landscaping', '🌻', false, false, 'low', 'Landscape design and installation services'),
('exterior_grounds', 'Tree Trimming & Removal (Émondage)', 'tree_service', '🌳', false, false, 'medium', 'Professional tree trimming and removal services'),
('exterior_grounds', 'Garden Care & Planting', 'garden_care', '🌺', false, false, 'low', 'Garden maintenance and planting services'),
('exterior_grounds', 'Hedge Trimming', 'hedge_trimming', '🌿', false, false, 'low', 'Professional hedge trimming and shaping'),
('exterior_grounds', 'Leaf Removal', 'leaf_removal', '🍂', false, false, 'low', 'Seasonal leaf cleanup and removal'),
('exterior_grounds', 'Pressure Washing', 'pressure_washing', '💧', false, false, 'low', 'Pressure washing for driveways, decks, and siding'),

-- 4. Pet Care Services (🐕)
('pet_care', 'Dog Walking', 'dog_walking', '🐕', true, false, 'medium', 'Professional dog walking services'),
('pet_care', 'Pet Sitting (In-home)', 'pet_sitting', '🏠', true, false, 'medium', 'In-home pet sitting and care services'),
('pet_care', 'Pet Feeding (Vacation care)', 'pet_feeding', '🍽️', true, false, 'medium', 'Pet feeding and care during owner absences'),
('pet_care', 'Overnight Pet Care', 'overnight_pet_care', '🌙', true, false, 'high', 'Overnight pet sitting and monitoring'),
('pet_care', 'Dog Training', 'dog_training', '🎾', true, false, 'medium', 'Professional dog training and behavior services'),
('pet_care', 'Pet Transportation', 'pet_transport', '🚗', true, false, 'medium', 'Safe transportation for pets to vet, grooming, etc.'),

-- 5. Appliance & Tech Repair (🔧)
('appliance_tech', 'Appliance Repair', 'appliance_repair', '🔧', false, false, 'low', 'Repair services for household appliances'),
('appliance_tech', 'Small Electronics Repair', 'electronics_repair', '📱', false, false, 'low', 'Repair of small electronic devices'),
('appliance_tech', 'Furniture Assembly', 'furniture_assembly', '🪑', false, false, 'low', 'Professional furniture assembly services'),
('appliance_tech', 'TV Mounting & Setup', 'tv_mounting', '📺', false, false, 'low', 'TV wall mounting and entertainment setup'),
('appliance_tech', 'Smart Home Installation', 'smart_home', '🏠', false, false, 'low', 'Smart home device installation and setup'),
('appliance_tech', 'Computer/Tech Support', 'tech_support', '💻', false, false, 'low', 'Computer and technology support services'),

-- 6. Event Services (🎪)
('event_services', 'Event Setup & Breakdown', 'event_setup', '🎪', false, false, 'low', 'Complete event setup and breakdown services'),
('event_services', 'Sound Equipment Setup', 'sound_setup', '🔊', false, false, 'low', 'Professional sound system setup for events'),
('event_services', 'Lighting Installation', 'lighting_setup', '💡', false, false, 'medium', 'Event lighting installation and design'),
('event_services', 'Tent & Canopy Setup', 'tent_setup', '⛺', false, false, 'low', 'Tent and canopy installation for outdoor events'),
('event_services', 'Party Equipment Rental Setup', 'party_equipment', '🎉', false, false, 'low', 'Setup of rented party equipment and supplies'),
('event_services', 'Wedding/Event Coordination', 'event_coordination', '💒', false, false, 'low', 'Professional event and wedding coordination'),

-- 7. Moving Services (🚚)
('moving_services', 'Local Moving Services', 'local_moving', '🚚', false, false, 'medium', 'Local residential and commercial moving'),
('moving_services', 'Furniture Delivery', 'furniture_delivery', '🛋️', false, false, 'low', 'Furniture delivery and placement services'),
('moving_services', 'Heavy Item Moving', 'heavy_moving', '📦', false, false, 'medium', 'Specialized moving for heavy or bulky items'),
('moving_services', 'Packing Services', 'packing_services', '📦', false, false, 'low', 'Professional packing and unpacking services'),
('moving_services', 'Storage Organization', 'storage_organization', '🗄️', false, false, 'low', 'Storage and organization services');

-- Update existing services to map to new categories
-- Map old 'wellness' to new 'personal_wellness'
UPDATE services SET category = 'personal_wellness' WHERE category = 'wellness';

-- Map old 'lawn_snow' to new 'exterior_grounds'
UPDATE services SET category = 'exterior_grounds' WHERE category = 'lawn_snow';

-- Map old 'care_pets' to new 'pet_care'
UPDATE services SET category = 'pet_care' WHERE category = 'care_pets';

-- Add new check constraint with all 7 categories
ALTER TABLE services ADD CONSTRAINT services_category_check 
CHECK (category IN ('cleaning', 'personal_wellness', 'exterior_grounds', 'pet_care', 'appliance_tech', 'event_services', 'moving_services'));

-- Update any existing provider profiles with migrated categories
UPDATE provider_profiles pp
SET updated_at = now()
WHERE EXISTS (
  SELECT 1 FROM services s 
  WHERE s.provider_id = pp.id 
  AND s.category IN ('cleaning', 'personal_wellness', 'exterior_grounds', 'pet_care')
);
