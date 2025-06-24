
-- Add missing privacy and service columns to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS show_on_map boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS service_type text DEFAULT 'customer_location',
ADD COLUMN IF NOT EXISTS service_radius integer DEFAULT 15000;

-- Add check constraint for service_type values
ALTER TABLE public.users 
ADD CONSTRAINT check_service_type 
CHECK (service_type IN ('provider_location', 'customer_location', 'both'));
