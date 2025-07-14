import { useEffect, useState, useCallback } from 'react';
import { Session, User as SupabaseUser, UserMetadata } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface User extends SupabaseUser {
  user_metadata: UserMetadata & {
    full_name?: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    email_verified?: boolean;
  };
}

interface AuthState {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
}

export const useAuth = (): AuthState & {
  signIn: (email: string, password: string) => Promise<{ error: any; session: Session | null }>;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any; session: Session | null }>;
  signOut: () => Promise<{ error: any }>;
  refreshSession: () => Promise<void>;
} => {
  const [state, setState] = useState<AuthState>({
    session: null,
    user: null,
    loading: true,
    isAuthenticated: false,
  });

  const updateSession = useCallback(async (session: Session | null) => {
    setState(prev => ({
      ...prev,
      session,
      user: session?.user ?? null,
      isAuthenticated: !!session,
      loading: false,
    }));
  }, []);

  // Initialize auth state
  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        await updateSession(session);
      } catch (error) {
        console.error('Error initializing auth:', error);
        setState(prev => ({ ...prev, loading: false }));
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        await updateSession(session);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, [updateSession]);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      await updateSession(data.session);
      return { error: null, session: data.session };
    } catch (error) {
      console.error('Sign in error:', error);
      setState(prev => ({ ...prev, loading: false }));
      return { error, session: null };
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string, userData: any) => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.fullName,
            // Add any additional user data here
          },
        },
      });
      
      if (error) throw error;
      
      await updateSession(data.session);
      return { error: null, session: data.session };
    } catch (error) {
      console.error('Sign up error:', error);
      setState(prev => ({ ...prev, loading: false }));
      return { error, session: null };
    }
  };

  // Sign out
  const signOut = async () => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      await updateSession(null);
      return { error: null };
    } catch (error) {
      console.error('Sign out error:', error);
      setState(prev => ({ ...prev, loading: false }));
      return { error };
    }
  };

  // Refresh session
  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      
      await updateSession(data.session);
    } catch (error) {
      console.error('Refresh session error:', error);
      throw error;
    }
  };

  return {
    ...state,
    signIn,
    signUp,
    signOut,
    refreshSession,
  };
};
