
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
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Cleanup function to clear any conflicting auth state
const cleanupAuthState = () => {
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
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
          userId: session?.user?.id
        });
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Handle successful sign in with profile creation
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('✅ User signed in successfully');
          setTimeout(() => {
            ensureUserProfile(session.user);
          }, 0);
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
            userId: session?.user?.id
          });
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            setTimeout(() => {
              ensureUserProfile(session.user);
            }, 0);
          }
        }
      } catch (error) {
        console.error('💥 Error in getInitialSession:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    return () => {
      console.log('🧹 Cleaning up auth subscription...');
      subscription.unsubscribe();
    };
  }, []);

  const ensureUserProfile = async (user: User) => {
    try {
      console.log('👤 Ensuring user profile exists for:', user.email);
      
      // Check if profile exists
      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!existingProfile) {
        console.log('📝 Creating user profile...');
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            user_id: user.id,
            username: user.email?.split('@')[0] || 'user',
            full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
            active_role: 'customer',
            can_provide_services: false,
            can_book_services: true
          });

        if (profileError) {
          console.error('❌ Error creating user profile:', profileError);
        } else {
          console.log('✅ User profile created successfully');
        }
      } else {
        console.log('✅ User profile already exists');
      }
    } catch (error) {
      console.error('💥 Error in ensureUserProfile:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log('🔑 signIn called with email:', email);
    try {
      cleanupAuthState();
      
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
      cleanupAuthState();
      
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
      
      if (error) {
        console.error('❌ Supabase signUp error:', error);
        throw error;
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
      cleanupAuthState();
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('❌ Error signing out:', error);
        throw error;
      }
      console.log('✅ signOut successful');
      
      window.location.href = '/auth';
    } catch (error) {
      console.error('💥 Error in signOut function:', error);
      throw error;
    }
  };

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
