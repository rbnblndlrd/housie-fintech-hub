
-- Add the missing instructions column to the bookings table
ALTER TABLE public.bookings 
ADD COLUMN instructions text;
