
-- Update some providers to have available status and Montreal coordinates
-- Using a subquery to limit the number of rows updated
UPDATE public.users 
SET 
  status = 'available',
  current_location = POINT(-73.5673, 45.5017)
WHERE id IN (
  SELECT id 
  FROM public.users 
  WHERE can_provide = true 
  AND city ILIKE '%montreal%'
  LIMIT 10
);

-- Create some sample emergency bookings for testing if they don't exist
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
  u.id as customer_id,
  s.id as service_id,
  'emergency' as priority,
  'pending' as status,
  150 as total_amount,
  'Downtown Montreal, QC' as service_address,
  CURRENT_DATE as scheduled_date,
  '14:30:00' as scheduled_time,
  2 as duration_hours,
  NOW() - INTERVAL '5 minutes' as created_at
FROM (SELECT id FROM public.users LIMIT 1) u
CROSS JOIN (SELECT id FROM public.services WHERE title ILIKE '%cleaning%' LIMIT 1) s
WHERE NOT EXISTS (
  SELECT 1 FROM public.bookings WHERE priority = 'emergency' AND service_address = 'Downtown Montreal, QC'
);

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
  u.id as customer_id,
  s.id as service_id,
  'emergency' as priority,
  'pending' as status,
  200 as total_amount,
  'Plateau Mont-Royal, QC' as service_address,
  CURRENT_DATE as scheduled_date,
  '16:00:00' as scheduled_time,
  3 as duration_hours,
  NOW() - INTERVAL '12 minutes' as created_at
FROM (SELECT id FROM public.users OFFSET 1 LIMIT 1) u
CROSS JOIN (SELECT id FROM public.services WHERE title ILIKE '%electrical%' OR category = 'construction' LIMIT 1) s
WHERE NOT EXISTS (
  SELECT 1 FROM public.bookings WHERE priority = 'emergency' AND service_address = 'Plateau Mont-Royal, QC'
);
