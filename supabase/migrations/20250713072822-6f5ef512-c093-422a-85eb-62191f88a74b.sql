-- Fix provider_id constraint issue in bookings table
-- Make provider_id nullable since tickets are created before providers claim them

ALTER TABLE public.bookings 
ALTER COLUMN provider_id DROP NOT NULL;

-- Add helpful comment
COMMENT ON COLUMN public.bookings.provider_id IS 'NULL when ticket is unclaimed, populated when provider accepts the job';