
-- Remove fleet management and analytics tables
DROP TABLE IF EXISTS public.montreal_zones CASCADE;
DROP TABLE IF EXISTS public.territory_claims CASCADE;
DROP TABLE IF EXISTS public.leaderboards CASCADE;

-- Remove fleet-related columns from existing tables
ALTER TABLE public.bookings DROP COLUMN IF EXISTS service_zone;
ALTER TABLE public.bookings DROP COLUMN IF EXISTS public_location;
ALTER TABLE public.bookings DROP COLUMN IF EXISTS service_coordinates;

-- Remove analytics columns from provider profiles
ALTER TABLE public.provider_profiles DROP COLUMN IF EXISTS territory_score;
ALTER TABLE public.provider_profiles DROP COLUMN IF EXISTS weekly_earnings;
ALTER TABLE public.provider_profiles DROP COLUMN IF EXISTS monthly_earnings;
ALTER TABLE public.provider_profiles DROP COLUMN IF EXISTS community_rating_points;
ALTER TABLE public.provider_profiles DROP COLUMN IF EXISTS response_time_score;

-- Remove gamification related tables that were zone-specific
DROP TABLE IF EXISTS public.point_transactions CASCADE;
DROP TABLE IF EXISTS public.user_achievements CASCADE;
DROP TABLE IF EXISTS public.loyalty_points CASCADE;

-- Clean up any functions that reference removed tables
DROP FUNCTION IF EXISTS public.assign_service_zone(point);
DROP FUNCTION IF EXISTS public.claim_territory(uuid, character varying);
DROP FUNCTION IF EXISTS public.award_points(uuid, integer, text, text, uuid);
DROP FUNCTION IF EXISTS public.update_leaderboards();
DROP FUNCTION IF EXISTS public.award_community_points(uuid, integer, text);
