import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

type UserData = {
  name: string;
  email: string;
  joinDate: string;
  stats: {
    streak: number;
    mealsTracked: number;
    weightLost: number;
  };
  subscription: string;
  themePreference?: 'light' | 'dark' | 'system';
  gender?: string;
  dob?: string;
  height?: number;
  weight?: number;
  phone?: string;
  address?: string;
  recoveryEmail?: string;
};

type UserContextType = {
  userData: UserData | null;
  updateUserData: (updates: Partial<UserData>) => Promise<void>;
};

const UserContext = createContext<UserContextType>({
  userData: null,
  updateUserData: async () => {}
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, refreshSession } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);

  const updateUserData = async (updates: Partial<UserData>) => {
    if (!userData) return;
    
    // Update local state
    setUserData({ ...userData, ...updates });
    
    // Update Supabase
    const { error } = await supabase.auth.updateUser({
      data: {
        ...user?.user_metadata,
        ...updates
      }
    });
    
    if (error) throw error;
    await refreshSession();
  };

  // Initialize user data
  useEffect(() => {
    if (user) {
      const joinDate = new Date(user.created_at || Date.now());
      const formattedDate = joinDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
      });

      setUserData({
        name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        email: user.email || 'No email',
        joinDate: `Member since ${formattedDate}`,
        stats: {
          streak: 0,
          mealsTracked: 0,
          weightLost: 0,
        },
        subscription: 'Free',
        ...user.user_metadata
      });
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ userData, updateUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
