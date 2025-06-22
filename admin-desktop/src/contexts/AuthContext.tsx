
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getSupabase, initializeSupabase } from '../lib/supabase';
import { useCredentials } from './CredentialsContext';
import type { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  supabaseReady: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [supabaseReady, setSupabaseReady] = useState(false);
  const { credentials, isSetupComplete } = useCredentials();

  useEffect(() => {
    if (isSetupComplete && credentials) {
      initializeAuth();
    } else {
      setLoading(false);
      setSupabaseReady(false);
    }
  }, [isSetupComplete, credentials]);

  const initializeAuth = async () => {
    try {
      const supabase = await initializeSupabase();
      setSupabaseReady(true);

      // Get initial session
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      });

      setLoading(false);

      return () => subscription.unsubscribe();
    } catch (error) {
      console.error('Auth initialization failed:', error);
      setSupabaseReady(false);
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!supabaseReady) {
      throw new Error('Supabase not initialized');
    }

    const supabase = getSupabase();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }
  };

  const signOut = async () => {
    if (!supabaseReady) {
      return;
    }

    const supabase = getSupabase();
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signOut,
    supabaseReady,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
