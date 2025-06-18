
-- Drop all existing policies first to avoid conflicts
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    -- Drop policies for bookings
    FOR r IN (SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'bookings') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.bookings';
    END LOOP;
    
    -- Drop policies for messages
    FOR r IN (SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'messages') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.messages';
    END LOOP;
    
    -- Drop policies for chat_messages
    FOR r IN (SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'chat_messages') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.chat_messages';
    END LOOP;
    
    -- Drop policies for conversations
    FOR r IN (SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'conversations') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.conversations';
    END LOOP;
    
    -- Drop policies for ai_chat_sessions
    FOR r IN (SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'ai_chat_sessions') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.ai_chat_sessions';
    END LOOP;
    
    -- Drop policies for ai_messages
    FOR r IN (SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'ai_messages') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.ai_messages';
    END LOOP;
END $$;

-- Enable RLS on all critical tables
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;

-- Create secure RLS policies for bookings
CREATE POLICY "Users can view their own bookings" ON public.bookings
  FOR SELECT USING (
    customer_id = auth.uid() OR 
    provider_id IN (
      SELECT id FROM public.provider_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create bookings as customer" ON public.bookings
  FOR INSERT WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Users can update their own bookings" ON public.bookings
  FOR UPDATE USING (
    customer_id = auth.uid() OR 
    provider_id IN (
      SELECT id FROM public.provider_profiles WHERE user_id = auth.uid()
    )
  );

-- Create secure RLS policies for messages
CREATE POLICY "Users can view messages from their bookings" ON public.messages
  FOR SELECT USING (
    booking_id IN (
      SELECT id FROM public.bookings 
      WHERE customer_id = auth.uid() OR 
      provider_id IN (
        SELECT id FROM public.provider_profiles WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can send messages to their bookings" ON public.messages
  FOR INSERT WITH CHECK (
    sender_id = auth.uid() AND
    booking_id IN (
      SELECT id FROM public.bookings 
      WHERE customer_id = auth.uid() OR 
      provider_id IN (
        SELECT id FROM public.provider_profiles WHERE user_id = auth.uid()
      )
    )
  );

-- Create secure RLS policies for chat_messages
CREATE POLICY "Users can view their own chat messages" ON public.chat_messages
  FOR SELECT USING (
    sender_id = auth.uid() OR receiver_id = auth.uid()
  );

CREATE POLICY "Users can send chat messages" ON public.chat_messages
  FOR INSERT WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can update their own sent messages" ON public.chat_messages
  FOR UPDATE USING (sender_id = auth.uid() OR receiver_id = auth.uid());

-- Create secure RLS policies for conversations
CREATE POLICY "Users can view their own conversations" ON public.conversations
  FOR SELECT USING (
    participant_one_id = auth.uid() OR participant_two_id = auth.uid()
  );

CREATE POLICY "Users can create conversations they participate in" ON public.conversations
  FOR INSERT WITH CHECK (
    participant_one_id = auth.uid() OR participant_two_id = auth.uid()
  );

CREATE POLICY "Users can update their own conversations" ON public.conversations
  FOR UPDATE USING (
    participant_one_id = auth.uid() OR participant_two_id = auth.uid()
  );

-- Create secure RLS policies for AI chat sessions
CREATE POLICY "Users can view their own AI chat sessions" ON public.ai_chat_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own AI chat sessions" ON public.ai_chat_sessions
  FOR ALL USING (auth.uid() = user_id);

-- Create secure RLS policies for AI messages
CREATE POLICY "Users can view their own AI messages" ON public.ai_messages
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own AI messages" ON public.ai_messages
  FOR ALL USING (auth.uid() = user_id);

-- Add performance indexes for RLS queries
CREATE INDEX IF NOT EXISTS idx_bookings_customer_provider ON public.bookings(customer_id, provider_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_participants ON public.chat_messages(sender_id, receiver_id);
CREATE INDEX IF NOT EXISTS idx_conversations_participants ON public.conversations(participant_one_id, participant_two_id);
CREATE INDEX IF NOT EXISTS idx_ai_sessions_user_id ON public.ai_chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_messages_user_session ON public.ai_messages(user_id, session_id);
