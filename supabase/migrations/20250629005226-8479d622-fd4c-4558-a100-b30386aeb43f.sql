
-- Fix admin test functions to handle user creation more robustly and avoid conflicts

-- Update admin_create_test_review function with better user creation and unique test emails
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
  test_user_email text;
  timestamp_suffix text;
BEGIN
  -- Initialize result object
  result := jsonb_build_object('success', false, 'debug_info', jsonb_build_object());
  
  -- Generate unique test user email with timestamp
  timestamp_suffix := extract(epoch from now())::text || '_' || floor(random() * 1000)::text;
  test_user_email := 'admin-test-customer-' || timestamp_suffix || '@housie.com';
  
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
  result := jsonb_set(result, '{debug_info,test_user_email}', to_jsonb(test_user_email));
  
  -- Step 3: Create unique test customer with all dependencies
  BEGIN
    -- Create test user with proper user_role
    INSERT INTO users (email, full_name, user_role, created_at, updated_at) 
    VALUES (test_user_email, 'Admin Test Customer', 'seeker', now(), now()) 
    RETURNING id INTO customer_id;
    
    -- Create user profile
    INSERT INTO user_profiles (user_id, username, full_name, created_at, updated_at)
    VALUES (customer_id, replace(test_user_email, '@housie.com', ''), 'Admin Test Customer', now(), now());
    
    -- Create role preferences
    INSERT INTO user_role_preferences (user_id, primary_role, created_at, updated_at)
    VALUES (customer_id, 'customer', now(), now());
    
    result := jsonb_set(result, '{debug_info,customer_created}', 'true');
    
  EXCEPTION WHEN OTHERS THEN
    result := jsonb_set(result, '{error}', to_jsonb('Failed to create test customer: ' || SQLERRM));
    result := jsonb_set(result, '{debug_info,step}', '"create_customer"');
    result := jsonb_set(result, '{debug_info,sql_state}', to_jsonb(SQLSTATE));
    RETURN result;
  END;
  
  result := jsonb_set(result, '{debug_info,customer_id}', to_jsonb(customer_id));
  
  -- Step 4: Create test booking
  BEGIN
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
    
  EXCEPTION WHEN OTHERS THEN
    result := jsonb_set(result, '{error}', to_jsonb('Failed to create test booking: ' || SQLERRM));
    result := jsonb_set(result, '{debug_info,step}', '"create_booking"');
    result := jsonb_set(result, '{debug_info,sql_state}', to_jsonb(SQLSTATE));
    RETURN result;
  END;
  
  result := jsonb_set(result, '{debug_info,booking_id}', to_jsonb(booking_id));
  
  -- Step 5: Create the review
  BEGIN
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
    
  EXCEPTION WHEN OTHERS THEN
    result := jsonb_set(result, '{error}', to_jsonb('Failed to create review: ' || SQLERRM));
    result := jsonb_set(result, '{debug_info,step}', '"create_review"');
    result := jsonb_set(result, '{debug_info,sql_state}', to_jsonb(SQLSTATE));
    RETURN result;
  END;
  
  result := jsonb_set(result, '{debug_info,review_id}', to_jsonb(review_id));
  
  -- Step 6: Add commendations if requested
  IF p_add_commendations AND p_rating >= 4 THEN
    BEGIN
      INSERT INTO review_commendations (review_id, commendation_type, created_at)
      VALUES 
        (review_id, 'quality', now()),
        (review_id, 'reliability', now());
      
      result := jsonb_set(result, '{debug_info,commendations_added}', 'true');
      
    EXCEPTION WHEN OTHERS THEN
      -- Don't fail the whole operation for commendation errors
      result := jsonb_set(result, '{debug_info,commendation_error}', to_jsonb(SQLERRM));
    END;
  END IF;
  
  -- Success!
  result := jsonb_set(result, '{success}', 'true');
  result := jsonb_set(result, '{review_id}', to_jsonb(review_id));
  result := jsonb_set(result, '{message}', '"Test review created successfully"');
  
  RETURN result;
  
EXCEPTION WHEN OTHERS THEN
  result := jsonb_set(result, '{error}', to_jsonb('Unexpected error: ' || SQLERRM));
  result := jsonb_set(result, '{debug_info,sql_state}', to_jsonb(SQLSTATE));
  result := jsonb_set(result, '{debug_info,step}', '"exception_caught"');
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update admin_add_commendation function to use the improved review creation
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
  
  -- Look for existing test review (from recent admin tests)
  SELECT r.id INTO test_review_id 
  FROM reviews r 
  JOIN bookings b ON r.booking_id = b.id
  WHERE r.provider_id = provider_profile_id 
  AND b.service_address = 'ADMIN_TEST_LOCATION'
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
  BEGIN
    INSERT INTO review_commendations (review_id, commendation_type, created_at)
    VALUES (test_review_id, p_commendation_type, now())
    RETURNING id INTO commendation_id;
    
  EXCEPTION WHEN OTHERS THEN
    result := jsonb_set(result, '{error}', to_jsonb('Failed to add commendation: ' || SQLERRM));
    result := jsonb_set(result, '{debug_info,sql_state}', to_jsonb(SQLSTATE));
    RETURN result;
  END;
  
  result := jsonb_set(result, '{success}', 'true');
  result := jsonb_set(result, '{commendation_id}', to_jsonb(commendation_id));
  result := jsonb_set(result, '{message}', to_jsonb('Commendation added successfully'));
  
  RETURN result;
  
EXCEPTION WHEN OTHERS THEN
  result := jsonb_set(result, '{error}', to_jsonb('Unexpected error: ' || SQLERRM));
  result := jsonb_set(result, '{debug_info,sql_state}', to_jsonb(SQLSTATE));
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fix any existing users with null user_role to prevent cascade issues
UPDATE users 
SET user_role = 'seeker', updated_at = now()
WHERE user_role IS NULL;
