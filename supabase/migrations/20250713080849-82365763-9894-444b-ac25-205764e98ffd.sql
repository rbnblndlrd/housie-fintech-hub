-- Update handle_new_user function with improved version that handles conflicts and permissions
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, user_role, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.email,
    'seeker',
    now(),
    now()
  )
  ON CONFLICT (email) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;