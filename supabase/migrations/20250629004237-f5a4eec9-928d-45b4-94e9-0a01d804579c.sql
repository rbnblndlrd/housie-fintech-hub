
-- COMPREHENSIVE DATABASE CLEANUP & OPTIMIZATION (Fixed)

-- 1. Fix RLS policy conflicts on provider_profiles - drop all existing policies first
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    -- Drop all existing policies on provider_profiles to start clean
    FOR policy_record IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'public' AND tablename = 'provider_profiles'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || policy_record.policyname || '" ON public.provider_profiles';
    END LOOP;
END $$;

-- Create clean, specific RLS policies for provider_profiles
CREATE POLICY "Users can view their own provider profile" 
  ON public.provider_profiles 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own provider profile" 
  ON public.provider_profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own provider profile" 
  ON public.provider_profiles 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own provider profile" 
  ON public.provider_profiles 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- 2. Add missing foreign key indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON public.bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_provider_id ON public.bookings(provider_id);
CREATE INDEX IF NOT EXISTS idx_bookings_service_id ON public.bookings(service_id);
CREATE INDEX IF NOT EXISTS idx_reviews_provider_id ON public.reviews(provider_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewer_id ON public.reviews(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_booking_id ON public.reviews(booking_id);
CREATE INDEX IF NOT EXISTS idx_messages_booking_id ON public.messages(booking_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_provider_profiles_user_id ON public.provider_profiles(user_id);

-- 3. Clean up unused/duplicate functions
DROP FUNCTION IF EXISTS public.emergency_disable_claude();
DROP FUNCTION IF EXISTS public.enable_claude_access();
DROP FUNCTION IF EXISTS public.get_daily_claude_stats();

-- 4. Fix the admin test functions with proper error handling and debugging
DROP FUNCTION IF EXISTS public.admin_create_test_review(uuid, integer, text, boolean);
DROP FUNCTION IF EXISTS public.admin_add_commendation(uuid, text);

-- Create improved admin_create_test_review function
CREATE OR REPLACE FUNCTION public.admin_create_test_review(
  p_provider_user_id uuid,
  p_rating integer,
  p_comment text DEFAULT 'Admin test review',
  p_add_commendations boolean DEFAULT false
) RETURNS jsonb AS $$
DECLARE
  result jsonb;
  review_id uuid;
  customer_id uuid;
  provider_profile_id uuid;
  booking_id uuid;
  existing_service_id uuid;
  test_user_email text := 'admin-test-customer@housie.com';
BEGIN
  -- Initialize result object
  result := jsonb_build_object('success', false, 'debug_info', jsonb_build_object());
  
  -- Step 1: Validate provider user exists and get profile
  SELECT pp.id INTO provider_profile_id 
  FROM provider_profiles pp 
  WHERE pp.user_id = p_provider_user_id;
  
  IF provider_profile_id IS NULL THEN
    result := jsonb_set(result, '{error}', '"Provider profile not found"');
    result := jsonb_set(result, '{debug_info,step}', '"validate_provider"');
    result := jsonb_set(result, '{debug_info,provider_user_id}', to_jsonb(p_provider_user_id));
    RETURN result;
  END IF;
  
  result := jsonb_set(result, '{debug_info,provider_profile_id}', to_jsonb(provider_profile_id));
  
  -- Step 2: Get an active service
  SELECT s.id INTO existing_service_id 
  FROM services s 
  WHERE s.active = true 
  LIMIT 1;
  
  IF existing_service_id IS NULL THEN
    result := jsonb_set(result, '{error}', '"No active services found"');
    result := jsonb_set(result, '{debug_info,step}', '"find_service"');
    RETURN result;
  END IF;
  
  result := jsonb_set(result, '{debug_info,service_id}', to_jsonb(existing_service_id));
  
  -- Step 3: Get or create test customer
  SELECT u.id INTO customer_id 
  FROM users u 
  WHERE u.email = test_user_email;
  
  IF customer_id IS NULL THEN
    -- Create test user with all dependencies
    INSERT INTO users (email, full_name, user_role, created_at, updated_at) 
    VALUES (test_user_email, 'Admin Test Customer', 'seeker', now(), now()) 
    RETURNING id INTO customer_id;
    
    -- Create user profile
    INSERT INTO user_profiles (user_id, username, full_name, created_at, updated_at)
    VALUES (customer_id, 'admin-test-customer', 'Admin Test Customer', now(), now());
    
    -- Create role preferences
    INSERT INTO user_role_preferences (user_id, primary_role, created_at, updated_at)
    VALUES (customer_id, 'customer', now(), now());
    
    result := jsonb_set(result, '{debug_info,customer_created}', 'true');
  ELSE
    -- Ensure dependencies exist for existing user
    INSERT INTO user_profiles (user_id, username, full_name, created_at, updated_at)
    VALUES (customer_id, 'admin-test-customer', 'Admin Test Customer', now(), now())
    ON CONFLICT (user_id) DO NOTHING;
    
    INSERT INTO user_role_preferences (user_id, primary_role, created_at, updated_at)
    VALUES (customer_id, 'customer', now(), now())
    ON CONFLICT (user_id) DO NOTHING;
    
    result := jsonb_set(result, '{debug_info,customer_found}', 'true');
  END IF;
  
  result := jsonb_set(result, '{debug_info,customer_id}', to_jsonb(customer_id));
  
  -- Step 4: Create test booking
  INSERT INTO bookings (
    customer_id, 
    provider_id, 
    service_id, 
    scheduled_date, 
    scheduled_time, 
    status,
    total_amount,
    service_address,
    created_at,
    updated_at
  )
  VALUES (
    customer_id, 
    provider_profile_id, 
    existing_service_id,
    CURRENT_DATE, 
    '10:00', 
    'completed',
    50.00,
    'ADMIN_TEST_LOCATION',
    now(),
    now()
  )
  RETURNING id INTO booking_id;
  
  result := jsonb_set(result, '{debug_info,booking_id}', to_jsonb(booking_id));
  
  -- Step 5: Create the review
  INSERT INTO reviews (
    provider_id, 
    reviewer_id, 
    booking_id, 
    rating, 
    comment, 
    verified_transaction,
    created_at
  )
  VALUES (
    provider_profile_id, 
    customer_id, 
    booking_id, 
    p_rating, 
    p_comment, 
    true,
    now()
  )
  RETURNING id INTO review_id;
  
  result := jsonb_set(result, '{debug_info,review_id}', to_jsonb(review_id));
  
  -- Step 6: Add commendations if requested
  IF p_add_commendations AND p_rating >= 4 THEN
    INSERT INTO review_commendations (review_id, commendation_type, created_at)
    VALUES 
      (review_id, 'quality', now()),
      (review_id, 'reliability', now());
    
    result := jsonb_set(result, '{debug_info,commendations_added}', 'true');
  END IF;
  
  -- Success!
  result := jsonb_set(result, '{success}', 'true');
  result := jsonb_set(result, '{review_id}', to_jsonb(review_id));
  result := jsonb_set(result, '{message}', '"Test review created successfully"');
  
  RETURN result;
  
EXCEPTION WHEN OTHERS THEN
  result := jsonb_set(result, '{error}', to_jsonb(SQLERRM));
  result := jsonb_set(result, '{debug_info,sql_state}', to_jsonb(SQLSTATE));
  result := jsonb_set(result, '{debug_info,step}', '"exception_caught"');
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create improved admin_add_commendation function
CREATE OR REPLACE FUNCTION public.admin_add_commendation(
  p_provider_user_id uuid,
  p_commendation_type text
) RETURNS jsonb AS $$
DECLARE
  result jsonb;
  commendation_id uuid;
  provider_profile_id uuid;
  test_review_id uuid;
  review_result jsonb;
BEGIN
  -- Initialize result
  result := jsonb_build_object('success', false, 'debug_info', jsonb_build_object());
  
  -- Validate commendation type
  IF p_commendation_type NOT IN ('quality', 'reliability', 'courtesy') THEN
    result := jsonb_set(result, '{error}', '"Invalid commendation type"');
    RETURN result;
  END IF;
  
  -- Get provider profile ID
  SELECT pp.id INTO provider_profile_id 
  FROM provider_profiles pp 
  WHERE pp.user_id = p_provider_user_id;
  
  IF provider_profile_id IS NULL THEN
    result := jsonb_set(result, '{error}', '"Provider profile not found"');
    result := jsonb_set(result, '{debug_info,provider_user_id}', to_jsonb(p_provider_user_id));
    RETURN result;
  END IF;
  
  -- Look for existing test review
  SELECT r.id INTO test_review_id 
  FROM reviews r 
  WHERE r.provider_id = provider_profile_id 
  AND r.comment LIKE '%Admin test%'
  ORDER BY r.created_at DESC
  LIMIT 1;
  
  -- Create review if none exists
  IF test_review_id IS NULL THEN
    SELECT admin_create_test_review(p_provider_user_id, 5, 'Admin test review for commendation', false) INTO review_result;
    
    IF (review_result->>'success')::boolean = false THEN
      RETURN review_result;
    END IF;
    
    test_review_id := (review_result->>'review_id')::uuid;
  END IF;
  
  result := jsonb_set(result, '{debug_info,review_id}', to_jsonb(test_review_id));
  
  -- Add the commendation
  INSERT INTO review_commendations (review_id, commendation_type, created_at)
  VALUES (test_review_id, p_commendation_type, now())
  RETURNING id INTO commendation_id;
  
  result := jsonb_set(result, '{success}', 'true');
  result := jsonb_set(result, '{commendation_id}', to_jsonb(commendation_id));
  result := jsonb_set(result, '{message}', to_jsonb('Commendation added successfully'));
  
  RETURN result;
  
EXCEPTION WHEN OTHERS THEN
  result := jsonb_set(result, '{error}', to_jsonb(SQLERRM));
  result := jsonb_set(result, '{debug_info,sql_state}', to_jsonb(SQLSTATE));
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Update the is_user_admin function to use user_role instead of subscription_tier
CREATE OR REPLACE FUNCTION public.is_user_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND user_role = 'admin'
  );
$$;

-- 6. Clean up any dangling data
DELETE FROM public.point_transactions WHERE user_id NOT IN (SELECT id FROM public.users);
DELETE FROM public.user_credits WHERE user_id NOT IN (SELECT id FROM public.users);
DELETE FROM public.reviews WHERE provider_id NOT IN (SELECT id FROM public.provider_profiles);

-- 7. Update table statistics for better query planning
ANALYZE public.users;
ANALYZE public.provider_profiles;
ANALYZE public.bookings;
ANALYZE public.reviews;
ANALYZE public.services;
