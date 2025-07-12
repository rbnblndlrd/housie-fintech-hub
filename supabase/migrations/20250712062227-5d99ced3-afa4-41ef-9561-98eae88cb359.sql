-- Add new fields to annette_quotes table for quote generation
ALTER TABLE public.annette_quotes 
ADD COLUMN tier text,
ADD COLUMN source text DEFAULT 'manual',
ADD COLUMN locked boolean DEFAULT false;