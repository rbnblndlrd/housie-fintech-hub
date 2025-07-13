-- HOUSIE: Database housekeeping and improvements

-- Add performance index for customer bookings dashboard
CREATE INDEX IF NOT EXISTS idx_bookings_customer_id_created_at 
ON public.bookings (customer_id, created_at DESC);

-- Add performance index for provider lookups
CREATE INDEX IF NOT EXISTS idx_bookings_provider_id_created_at 
ON public.bookings (provider_id, created_at DESC);

-- Backfill missing users from auth.users to public.users
-- This ensures all bookings have valid customer_id references
INSERT INTO public.users (id, email, full_name, user_role, created_at, updated_at)
SELECT id, email, COALESCE(raw_user_meta_data->>'full_name', email), 'seeker', now(), now()
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.users)
ON CONFLICT (email) DO NOTHING;