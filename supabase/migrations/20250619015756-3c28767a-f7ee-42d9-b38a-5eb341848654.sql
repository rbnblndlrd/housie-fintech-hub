
-- Add CASCADE deletion to foreign key constraints to prevent deletion failures
-- First, let's drop existing foreign key constraints and recreate them with CASCADE

-- Update calendar_appointments table
ALTER TABLE public.calendar_appointments 
DROP CONSTRAINT IF EXISTS calendar_appointments_user_id_fkey;

ALTER TABLE public.calendar_appointments 
ADD CONSTRAINT calendar_appointments_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- Update provider_profiles table  
ALTER TABLE public.provider_profiles 
DROP CONSTRAINT IF EXISTS provider_profiles_user_id_fkey;

ALTER TABLE public.provider_profiles 
ADD CONSTRAINT provider_profiles_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- Update bookings table
ALTER TABLE public.bookings 
DROP CONSTRAINT IF EXISTS bookings_customer_id_fkey;

ALTER TABLE public.bookings 
ADD CONSTRAINT bookings_customer_id_fkey 
FOREIGN KEY (customer_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- Update messages table
ALTER TABLE public.messages 
DROP CONSTRAINT IF EXISTS messages_sender_id_fkey;

ALTER TABLE public.messages 
ADD CONSTRAINT messages_sender_id_fkey 
FOREIGN KEY (sender_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- Update chat_messages table
ALTER TABLE public.chat_messages 
DROP CONSTRAINT IF EXISTS chat_messages_sender_id_fkey,
DROP CONSTRAINT IF EXISTS chat_messages_receiver_id_fkey;

ALTER TABLE public.chat_messages 
ADD CONSTRAINT chat_messages_sender_id_fkey 
FOREIGN KEY (sender_id) REFERENCES public.users(id) ON DELETE CASCADE,
ADD CONSTRAINT chat_messages_receiver_id_fkey 
FOREIGN KEY (receiver_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- Update conversations table
ALTER TABLE public.conversations 
DROP CONSTRAINT IF EXISTS conversations_participant_one_id_fkey,
DROP CONSTRAINT IF EXISTS conversations_participant_two_id_fkey;

ALTER TABLE public.conversations 
ADD CONSTRAINT conversations_participant_one_id_fkey 
FOREIGN KEY (participant_one_id) REFERENCES public.users(id) ON DELETE CASCADE,
ADD CONSTRAINT conversations_participant_two_id_fkey 
FOREIGN KEY (participant_two_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- Update reviews table
ALTER TABLE public.reviews 
DROP CONSTRAINT IF EXISTS reviews_reviewer_id_fkey;

ALTER TABLE public.reviews 
ADD CONSTRAINT reviews_reviewer_id_fkey 
FOREIGN KEY (reviewer_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- Update notifications table
ALTER TABLE public.notifications 
DROP CONSTRAINT IF EXISTS notifications_user_id_fkey;

ALTER TABLE public.notifications 
ADD CONSTRAINT notifications_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- Update user_sessions table  
ALTER TABLE public.user_sessions 
DROP CONSTRAINT IF EXISTS user_sessions_user_id_fkey;

ALTER TABLE public.user_sessions 
ADD CONSTRAINT user_sessions_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- Update ai_chat_sessions table
ALTER TABLE public.ai_chat_sessions 
DROP CONSTRAINT IF EXISTS ai_chat_sessions_user_id_fkey;

ALTER TABLE public.ai_chat_sessions 
ADD CONSTRAINT ai_chat_sessions_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- Update ai_messages table
ALTER TABLE public.ai_messages 
DROP CONSTRAINT IF EXISTS ai_messages_user_id_fkey;

ALTER TABLE public.ai_messages 
ADD CONSTRAINT ai_messages_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
