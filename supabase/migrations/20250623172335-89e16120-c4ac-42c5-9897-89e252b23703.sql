
-- Add missing columns to existing tables
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS priority VARCHAR DEFAULT 'normal',
ADD COLUMN IF NOT EXISTS accepted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS response_time_minutes INTEGER,
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS status VARCHAR DEFAULT 'available',
ADD COLUMN IF NOT EXISTS current_location POINT;

-- Update existing users with Montreal coordinates (copy from coordinates if available)
UPDATE public.users 
SET current_location = coordinates,
    status = 'available'
WHERE coordinates IS NOT NULL 
AND city ILIKE '%montreal%'
AND id IN (
  SELECT id FROM public.users WHERE city ILIKE '%montreal%' AND coordinates IS NOT NULL LIMIT 10
);

-- Set default coordinates for Montreal users without coordinates
UPDATE public.users 
SET current_location = POINT(-73.5673, 45.5017),
    status = 'available'
WHERE city ILIKE '%montreal%' 
AND current_location IS NULL
AND id IN (
  SELECT id FROM public.users WHERE city ILIKE '%montreal%' AND current_location IS NULL LIMIT 5
);

-- Insert sample emergency bookings using existing user/service IDs
INSERT INTO public.bookings (
  customer_id, 
  service_id, 
  priority, 
  status, 
  total_amount, 
  service_address, 
  scheduled_date,
  scheduled_time,
  duration_hours,
  created_at
) 
SELECT 
  u1.id as customer_id,
  s.id as service_id,
  'emergency' as priority,
  'pending' as status,
  150 as total_amount,
  'Downtown Montreal, QC' as service_address,
  CURRENT_DATE as scheduled_date,
  '14:30:00' as scheduled_time,
  2 as duration_hours,
  NOW() - INTERVAL '5 minutes' as created_at
FROM public.users u1
CROSS JOIN public.services s
WHERE u1.city ILIKE '%montreal%'
AND s.title ILIKE '%cleaning%'
AND NOT EXISTS (
  SELECT 1 FROM public.bookings WHERE priority = 'emergency' AND service_address = 'Downtown Montreal, QC'
)
LIMIT 1;

INSERT INTO public.bookings (
  customer_id, 
  service_id, 
  priority, 
  status, 
  total_amount, 
  service_address, 
  scheduled_date,
  scheduled_time,
  duration_hours,
  created_at
) 
SELECT 
  u1.id as customer_id,
  s.id as service_id,
  'emergency' as priority,
  'pending' as status,
  200 as total_amount,
  'Plateau Mont-Royal, QC' as service_address,
  CURRENT_DATE as scheduled_date,
  '16:00:00' as scheduled_time,
  3 as duration_hours,
  NOW() - INTERVAL '12 minutes' as created_at
FROM public.users u1
CROSS JOIN public.services s
WHERE u1.city ILIKE '%montreal%'
AND (s.title ILIKE '%electrical%' OR s.category = 'construction')
AND NOT EXISTS (
  SELECT 1 FROM public.bookings WHERE priority = 'emergency' AND service_address = 'Plateau Mont-Royal, QC'
)
LIMIT 1;
