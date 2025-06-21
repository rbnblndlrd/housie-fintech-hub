
-- Fix the emergency Claude control functions to update the emergency_controls table

CREATE OR REPLACE FUNCTION public.emergency_disable_claude()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Update the emergency_controls table instead of user_security_status
    UPDATE public.emergency_controls 
    SET 
        claude_api_enabled = false,
        claude_access_enabled = false,
        disabled_at = now(),
        disabled_reason = 'Emergency disable triggered via admin dashboard',
        last_updated_at = now(),
        updated_at = now()
    WHERE id = (
        SELECT id FROM public.emergency_controls 
        ORDER BY created_at DESC 
        LIMIT 1
    );
    
    -- Also update user_security_status for existing users
    UPDATE public.user_security_status 
    SET claude_access_level = 'disabled', updated_at = now()
    WHERE claude_access_level != 'disabled';
    
    -- Log the action
    INSERT INTO public.admin_actions (action_type, description, created_at) 
    VALUES ('emergency_claude_disable', 'Emergency disable of Claude AI platform-wide via emergency controls', now());
    
    RETURN json_build_object('success', true, 'message', 'Claude AI disabled platform-wide');
END;
$$;

CREATE OR REPLACE FUNCTION public.enable_claude_access()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Update the emergency_controls table
    UPDATE public.emergency_controls 
    SET 
        claude_api_enabled = true,
        claude_access_enabled = true,
        disabled_at = null,
        disabled_reason = null,
        last_updated_at = now(),
        updated_at = now()
    WHERE id = (
        SELECT id FROM public.emergency_controls 
        ORDER BY created_at DESC 
        LIMIT 1
    );
    
    -- Restore user access levels
    UPDATE public.user_security_status 
    SET claude_access_level = CASE WHEN phone_verified = true THEN 'basic' ELSE 'none' END,
        updated_at = now()
    WHERE claude_access_level = 'disabled';
    
    -- Log the action
    INSERT INTO public.admin_actions (action_type, description, created_at) 
    VALUES ('claude_access_restored', 'Claude AI access restored platform-wide via emergency controls', now());
    
    RETURN json_build_object('success', true, 'message', 'Claude AI access restored');
END;
$$;
