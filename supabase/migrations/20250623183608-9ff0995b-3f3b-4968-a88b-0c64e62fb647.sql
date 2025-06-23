
-- Add privacy columns to users table for location confidentiality
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS confidentiality_radius INTEGER DEFAULT 10000;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS fuzzy_location POINT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS last_fuzzy_update TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Add privacy columns to bookings table for service zone management
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS service_zone VARCHAR(100);
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS service_radius INTEGER DEFAULT 2000;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS public_location POINT;

-- Create Montreal zones lookup table for predefined neighborhoods
CREATE TABLE IF NOT EXISTS public.montreal_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_name VARCHAR(100) NOT NULL UNIQUE,
  zone_code VARCHAR(20) NOT NULL UNIQUE,
  zone_type VARCHAR(50) DEFAULT 'residential',
  demand_level VARCHAR(20) DEFAULT 'medium',
  pricing_multiplier DECIMAL(3,2) DEFAULT 1.00,
  center_coordinates POINT NOT NULL,
  zone_radius INTEGER DEFAULT 5000,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert predefined Montreal zones
INSERT INTO public.montreal_zones (zone_name, zone_code, zone_type, demand_level, pricing_multiplier, center_coordinates, zone_radius) VALUES
('Plateau-Mont-Royal', 'PLATEAU', 'residential', 'high', 1.20, POINT(-73.5794, 45.5276), 3000),
('Downtown Montreal', 'DOWNTOWN', 'commercial', 'high', 1.30, POINT(-73.5673, 45.5017), 4000),
('Westmount', 'WESTMOUNT', 'premium', 'medium', 1.50, POINT(-73.5989, 45.4869), 2500),
('Verdun', 'VERDUN', 'residential', 'medium', 1.00, POINT(-73.5684, 45.4581), 3500),
('Outremont', 'OUTREMONT', 'premium', 'medium', 1.25, POINT(-73.6103, 45.5171), 2000),
('Rosemont', 'ROSEMONT', 'residential', 'medium', 1.10, POINT(-73.5698, 45.5420), 4000),
('Villeray', 'VILLERAY', 'residential', 'low', 0.95, POINT(-73.6278, 45.5420), 3000),
('Côte-des-Neiges', 'CDN', 'mixed', 'medium', 1.15, POINT(-73.6290, 45.4945), 3500)
ON CONFLICT (zone_code) DO NOTHING;

-- Create function to generate fuzzy location within radius
CREATE OR REPLACE FUNCTION public.generate_fuzzy_location(
  original_point POINT,
  radius_meters INTEGER DEFAULT 10000
) RETURNS POINT
LANGUAGE plpgsql
AS $$
DECLARE
  random_angle FLOAT;
  random_distance FLOAT;
  lat_offset FLOAT;
  lng_offset FLOAT;
  new_lat FLOAT;
  new_lng FLOAT;
BEGIN
  -- Generate random angle (0-360 degrees) and distance within radius
  random_angle := random() * 2 * PI();
  random_distance := random() * radius_meters;
  
  -- Convert to lat/lng offsets (rough approximation for Montreal area)
  lat_offset := (random_distance * COS(random_angle)) / 111320.0;
  lng_offset := (random_distance * SIN(random_angle)) / (111320.0 * COS(RADIANS(original_point[1])));
  
  -- Calculate new coordinates
  new_lat := original_point[1] + lat_offset;
  new_lng := original_point[0] + lng_offset;
  
  RETURN POINT(new_lng, new_lat);
END;
$$;

-- Create function to assign service zone based on coordinates
CREATE OR REPLACE FUNCTION public.assign_service_zone(service_coords POINT)
RETURNS VARCHAR(20)
LANGUAGE plpgsql
AS $$
DECLARE
  closest_zone VARCHAR(20);
  min_distance FLOAT := 999999;
  zone_record RECORD;
  current_distance FLOAT;
BEGIN
  -- Find closest Montreal zone
  FOR zone_record IN SELECT zone_code, center_coordinates FROM public.montreal_zones LOOP
    -- Calculate approximate distance (simplified for performance)
    current_distance := SQRT(
      POWER((service_coords[0] - zone_record.center_coordinates[0]) * 111320 * COS(RADIANS(service_coords[1])), 2) +
      POWER((service_coords[1] - zone_record.center_coordinates[1]) * 111320, 2)
    );
    
    IF current_distance < min_distance THEN
      min_distance := current_distance;
      closest_zone := zone_record.zone_code;
    END IF;
  END LOOP;
  
  RETURN COALESCE(closest_zone, 'UNKNOWN');
END;
$$;

-- Create function to update fuzzy locations for all users (called periodically)
CREATE OR REPLACE FUNCTION public.refresh_fuzzy_locations()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  updated_count INTEGER := 0;
  user_record RECORD;
BEGIN
  -- Update fuzzy locations for users who need refresh (every 15+ minutes)
  FOR user_record IN 
    SELECT id, coordinates, confidentiality_radius 
    FROM public.users 
    WHERE coordinates IS NOT NULL 
    AND (last_fuzzy_update IS NULL OR last_fuzzy_update < now() - INTERVAL '15 minutes')
  LOOP
    UPDATE public.users 
    SET 
      fuzzy_location = public.generate_fuzzy_location(user_record.coordinates, user_record.confidentiality_radius),
      last_fuzzy_update = now()
    WHERE id = user_record.id;
    
    updated_count := updated_count + 1;
  END LOOP;
  
  RETURN updated_count;
END;
$$;

-- Enable RLS on new tables
ALTER TABLE public.montreal_zones ENABLE ROW LEVEL SECURITY;

-- Create policy for montreal_zones (public read access)
CREATE POLICY "Montreal zones are publicly readable"
ON public.montreal_zones
FOR SELECT
TO public
USING (true);

-- Update existing bookings to assign service zones
UPDATE public.bookings 
SET service_zone = public.assign_service_zone(service_coordinates)
WHERE service_coordinates IS NOT NULL AND service_zone IS NULL;
