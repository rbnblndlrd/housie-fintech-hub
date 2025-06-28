
-- Add navigation preference to provider settings
ALTER TABLE provider_settings 
ADD COLUMN navigation_preference text NOT NULL DEFAULT 'google_maps';

-- Add check constraint for valid navigation preferences
ALTER TABLE provider_settings 
ADD CONSTRAINT check_navigation_preference 
CHECK (navigation_preference IN ('google_maps', 'housie_navigation', 'system_default'));

-- Add comment for documentation
COMMENT ON COLUMN provider_settings.navigation_preference IS 'Provider navigation preference: google_maps (default), housie_navigation (Mapbox), or system_default (phone default)';
