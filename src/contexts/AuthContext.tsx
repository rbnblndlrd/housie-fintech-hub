
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName?: string) => Promise<void>;
  signOut: () => Promise<void>;
  logout: () => Promise<void>; // Add logout alias for signOut
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  console.log('🚀 AuthProvider mounting...');

  useEffect(() => {
    console.log('🔧 Setting up auth state listener...');
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event, {
          userEmail: session?.user?.email,
          hasSession: !!session,
          userId: session?.user?.id,
          userMetadata: session?.user?.user_metadata,
          appMetadata: session?.user?.app_metadata
        });
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Handle successful OAuth sign in
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('✅ User signed in successfully via OAuth');
        }
      }
    );

    // THEN get initial session
    const getInitialSession = async () => {
      console.log('🔍 Getting initial session...');
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('❌ Error getting session:', error);
        } else {
          console.log('✅ Initial session retrieved:', {
            hasSession: !!session,
            userEmail: session?.user?.email,
            userId: session?.user?.id,
            userMetadata: session?.user?.user_metadata,
            appMetadata: session?.user?.app_metadata
          });
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error('💥 Error in getInitialSession:', error);
      } finally {
        setLoading(false);
        console.log('🏁 Initial session check complete');
      }
    };

    getInitialSession();

    return () => {
      console.log('🧹 Cleaning up auth subscription...');
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('🔑 signIn called with email:', email);
    try {
      console.log('📡 Calling Supabase signInWithPassword...');
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('❌ Supabase signIn error:', error);
        throw error;
      }
      
      console.log('✅ signIn successful');
    } catch (error) {
      console.error('💥 Error in signIn function:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    console.log('📝 signUp called with:', { email, fullName });
    try {
      console.log('📡 Calling Supabase signUp...');
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: fullName
          }
        }
      });
      
      console.log('📊 Supabase signUp response:', {
        hasUser: !!data.user,
        userEmail: data.user?.email,
        userId: data.user?.id,
        emailConfirmed: data.user?.email_confirmed_at,
        error: error ? error.message : null
      });
      
      if (error) {
        console.error('❌ Supabase signUp error:', error);
        throw error;
      }

      // Create user profile in your custom users table
      if (data.user) {
        console.log('👤 Creating user profile for:', data.user.email);
        console.log('🔍 Profile data being inserted:', {
          id: data.user.id,
          email: data.user.email,
          full_name: fullName || '',
          user_role: 'seeker',
          can_provide: false,
          can_seek: true,
          subscription_tier: 'free',
          subscription_status: 'active'
        });

        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: data.user.email,
            full_name: fullName || '',
            user_role: 'seeker',
            can_provide: false,
            can_seek: true,
            subscription_tier: 'free',
            subscription_status: 'active'
          });

        if (profileError) {
          console.error('❌ Error creating user profile:', {
            code: profileError.code,
            message: profileError.message,
            details: profileError.details,
            hint: profileError.hint
          });
          // Don't throw here - let the user continue even if profile creation fails
          console.log('⚠️ User can still continue without profile');
        } else {
          console.log('✅ User profile created successfully');
        }
      }

      // Check if email confirmation is required
      if (data.user && !data.user.email_confirmed_at) {
        console.log('📧 Email confirmation required for user:', data.user.email);
        console.log('💡 To disable email confirmation for development:');
        console.log('   1. Go to Supabase Dashboard > Authentication > Settings');
        console.log('   2. Turn OFF "Confirm email"');
        console.log('   3. Or check your email for confirmation link');
        
        // Create a custom error to inform the user about email confirmation
        const confirmationError = new Error('Email confirmation required. Please check your email or disable email confirmation in Supabase settings for development.');
        confirmationError.name = 'EmailConfirmationRequired';
        throw confirmationError;
      }

      console.log('✅ signUp process completed');
      
    } catch (error) {
      console.error('💥 Error in signUp function:', error);
      throw error;
    }
  };

  const signOut = async () => {
    console.log('🚪 signOut called');
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('❌ Error signing out:', error);
        throw error;
      }
      console.log('✅ signOut successful');
    } catch (error) {
      console.error('💥 Error in signOut function:', error);
      throw error;
    }
  };

  // Add logout as an alias for signOut
  const logout = signOut;

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    logout
  };

  console.log('🎯 AuthProvider rendering with state:', {
    hasUser: !!user,
    hasSession: !!session,
    loading,
    userEmail: user?.email,
    userId: user?.id
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
