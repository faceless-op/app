import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Use environment variables for Supabase configuration
const supabaseUrl = 'https://wrgqbkewsevoihflndyr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndyZ3Fia2V3c2V2b2loZmxuZHlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2MzY4OTAsImV4cCI6MjA2NzIxMjg5MH0.MHRdfiBhsXcNHcAaX0uVjGsdeG0URu-eMKTj9ipjDVg';

// Initialize the Supabase client with AsyncStorage for session persistence
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Auth state change handler
export const onAuthStateChange = (callback: any) => {
  return supabase.auth.onAuthStateChange(callback);
};

// Sign in with email and password
export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

// Sign up with email and password
export const signUpWithEmail = async (email: string, password: string, userData: any) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: userData.fullName,
      },
    },
  });
  return { data, error };
};

// Sign out
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

// Get current user
export const getCurrentUser = () => {
  return supabase.auth.getUser();
};

// Get current session
export const getSession = () => {
  return supabase.auth.getSession();
};
