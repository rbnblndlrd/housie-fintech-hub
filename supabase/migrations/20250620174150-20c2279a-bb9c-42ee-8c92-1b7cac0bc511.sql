
-- Add missing columns to the users table for customer profile functionality
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS preferred_contact_method text DEFAULT 'email',
ADD COLUMN IF NOT EXISTS notification_preferences boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS service_categories text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS budget_range_min integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS budget_range_max integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS accessibility_needs text DEFAULT '',
ADD COLUMN IF NOT EXISTS special_instructions text DEFAULT '',
ADD COLUMN IF NOT EXISTS preferred_timing text DEFAULT 'flexible';
