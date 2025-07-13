-- Make service_id nullable in bookings table to allow tickets without assigned services
ALTER TABLE public.bookings 
ALTER COLUMN service_id DROP NOT NULL;

-- Add helpful comment
COMMENT ON COLUMN public.bookings.service_id IS 'NULL when ticket is unclaimed/no specific service match, populated when provider accepts or service is matched';