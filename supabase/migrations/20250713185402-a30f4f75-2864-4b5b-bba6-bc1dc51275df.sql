-- Add a custom title field to bookings table for user-defined ticket titles
ALTER TABLE public.bookings 
ADD COLUMN custom_title text;