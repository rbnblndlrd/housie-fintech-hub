
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
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event, {
          userEmail: session?.user?.email,
          hasSession: !!session,
          userId: session?.user?.id
        });
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Get initial session
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
            userId: session?.user?.id
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
          emailRedirectTo: window.location.origin + '/welcome',
          data: {
            full_name: fullName
          }
        }
      });
      
      console.log('📊 Supabase signUp response:', {
        hasUser: !!data.user,
        userEmail: data.user?.email,
        userId: data.user?.id,
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
          user_role: 'seeker', // Fixed: using user_role instead of current_role
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
            user_role: 'seeker', // Fixed: using user_role instead of current_role
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

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut
  };

  console.log('🎯 AuthProvider rendering with state:', {
    hasUser: !!user,
    hasSession: !!session,
    loading,
    userEmail: user?.email
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
