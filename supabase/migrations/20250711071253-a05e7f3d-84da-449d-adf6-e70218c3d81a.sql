-- Create messaging tiers and connection tracking system

-- Add columns to existing tables for connection tracking
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS creates_service_connection boolean DEFAULT true;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS messaging_tier_unlocked text DEFAULT 'inquiry_only';

-- Create service connections table
CREATE TABLE IF NOT EXISTS service_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_one_id uuid NOT NULL,
  user_two_id uuid NOT NULL,
  connection_tier text NOT NULL DEFAULT 'service' CHECK (connection_tier IN ('service', 'trusted', 'network')),
  service_connection_count integer DEFAULT 1,
  cred_connection_established boolean DEFAULT false,
  can_message boolean DEFAULT false,
  last_booked_date timestamp with time zone,
  auto_rebook_suggested boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_one_id, user_two_id)
);

-- Enable RLS
ALTER TABLE service_connections ENABLE ROW LEVEL SECURITY;

-- Create policies for service connections
CREATE POLICY "Users can view their own service connections" 
ON service_connections 
FOR SELECT 
USING (user_one_id = auth.uid() OR user_two_id = auth.uid());

CREATE POLICY "System can manage service connections" 
ON service_connections 
FOR ALL 
USING (true);

-- Create rebooking suggestions table
CREATE TABLE IF NOT EXISTS rebooking_suggestions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  provider_user_id uuid NOT NULL,
  service_type text NOT NULL,
  frequency_pattern text, -- 'weekly', 'bi_weekly', 'monthly', 'seasonal'
  last_booking_date timestamp with time zone,
  suggested_date timestamp with time zone,
  suggestion_shown boolean DEFAULT false,
  suggestion_acted_on boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE rebooking_suggestions ENABLE ROW LEVEL SECURITY;

-- Create policies for rebooking suggestions
CREATE POLICY "Users can view their own rebooking suggestions" 
ON rebooking_suggestions 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "System can manage rebooking suggestions" 
ON rebooking_suggestions 
FOR ALL 
USING (true);

-- Function to update service connections after booking completion
CREATE OR REPLACE FUNCTION update_service_connections()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
DECLARE
  customer_user_id uuid;
  provider_user_id uuid;
  ordered_user_one uuid;
  ordered_user_two uuid;
  connection_exists boolean;
  current_count integer;
  both_reviewed boolean;
BEGIN
  -- Only process completed bookings
  IF NEW.status != 'completed' OR OLD.status = 'completed' THEN
    RETURN NEW;
  END IF;

  -- Get customer and provider user IDs
  customer_user_id := NEW.customer_id;
  
  SELECT user_id INTO provider_user_id 
  FROM provider_profiles 
  WHERE id = NEW.provider_id;

  IF provider_user_id IS NULL THEN
    RETURN NEW;
  END IF;

  -- Order user IDs consistently
  IF customer_user_id < provider_user_id THEN
    ordered_user_one := customer_user_id;
    ordered_user_two := provider_user_id;
  ELSE
    ordered_user_one := provider_user_id;
    ordered_user_two := customer_user_id;
  END IF;

  -- Check if connection exists
  SELECT EXISTS(
    SELECT 1 FROM service_connections 
    WHERE user_one_id = ordered_user_one AND user_two_id = ordered_user_two
  ) INTO connection_exists;

  -- Check if both parties have reviewed
  SELECT COUNT(*) = 2 INTO both_reviewed
  FROM reviews 
  WHERE booking_id = NEW.id;

  IF connection_exists THEN
    -- Update existing connection
    UPDATE service_connections 
    SET 
      service_connection_count = service_connection_count + 1,
      last_booked_date = NEW.completed_at,
      can_message = CASE 
        WHEN both_reviewed THEN true 
        ELSE can_message 
      END,
      connection_tier = CASE 
        WHEN service_connection_count >= 2 THEN 'trusted'
        WHEN service_connection_count >= 4 THEN 'network'
        ELSE connection_tier 
      END,
      cred_connection_established = CASE 
        WHEN both_reviewed AND service_connection_count >= 1 THEN true
        ELSE cred_connection_established 
      END,
      updated_at = now()
    WHERE user_one_id = ordered_user_one AND user_two_id = ordered_user_two;
  ELSE
    -- Create new connection
    INSERT INTO service_connections (
      user_one_id, 
      user_two_id, 
      service_connection_count, 
      last_booked_date,
      can_message,
      cred_connection_established
    ) VALUES (
      ordered_user_one, 
      ordered_user_two, 
      1, 
      NEW.completed_at,
      both_reviewed,
      both_reviewed
    );
  END IF;

  -- Create rebooking suggestion for future
  INSERT INTO rebooking_suggestions (
    user_id,
    provider_user_id,
    service_type,
    last_booking_date,
    suggested_date
  ) VALUES (
    customer_user_id,
    provider_user_id,
    COALESCE(
      (SELECT category FROM services WHERE id = NEW.service_id),
      'general'
    ),
    NEW.completed_at,
    NEW.completed_at + INTERVAL '2 weeks' -- Default suggestion interval
  )
  ON CONFLICT DO NOTHING;

  RETURN NEW;
END;
$function$;

-- Create trigger for service connections
CREATE TRIGGER update_service_connections_trigger
AFTER UPDATE ON bookings
FOR EACH ROW
EXECUTE FUNCTION update_service_connections();

-- Function to check messaging permissions
CREATE OR REPLACE FUNCTION can_message_user(target_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  current_user_id uuid;
  connection_exists boolean;
  can_msg boolean;
BEGIN
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL OR current_user_id = target_user_id THEN
    RETURN false;
  END IF;

  -- Check if service connection allows messaging
  SELECT COALESCE(can_message, false) INTO can_msg
  FROM service_connections
  WHERE (user_one_id = LEAST(current_user_id, target_user_id) 
         AND user_two_id = GREATEST(current_user_id, target_user_id));

  RETURN COALESCE(can_msg, false);
END;
$function$;

-- Function to get rebooking suggestions for a user
CREATE OR REPLACE FUNCTION get_rebooking_suggestions(user_uuid uuid)
RETURNS TABLE(
  provider_name text,
  provider_user_id uuid,
  service_type text,
  last_booking_date timestamp with time zone,
  suggested_date timestamp with time zone,
  frequency_pattern text,
  total_bookings integer
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    u.full_name as provider_name,
    rs.provider_user_id,
    rs.service_type,
    rs.last_booking_date,
    rs.suggested_date,
    rs.frequency_pattern,
    sc.service_connection_count as total_bookings
  FROM rebooking_suggestions rs
  JOIN users u ON u.id = rs.provider_user_id
  LEFT JOIN service_connections sc ON (
    (sc.user_one_id = LEAST(user_uuid, rs.provider_user_id) 
     AND sc.user_two_id = GREATEST(user_uuid, rs.provider_user_id))
  )
  WHERE rs.user_id = user_uuid
    AND rs.suggested_date <= now() + INTERVAL '1 week'
    AND rs.suggestion_acted_on = false
  ORDER BY rs.last_booking_date DESC;
END;
$function$;