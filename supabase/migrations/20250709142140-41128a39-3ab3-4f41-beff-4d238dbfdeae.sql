-- Add housie_optimization field to clusters table
ALTER TABLE public.clusters 
ADD COLUMN housie_optimization JSONB DEFAULT NULL;