import { Stack, useRouter, useSegments } from 'expo-router';
import { Provider as PaperProvider, MD3LightTheme, MD3DarkTheme, configureFonts, ActivityIndicator } from 'react-native-paper';
import { useColorScheme, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { AvatarProvider } from '../contexts/AvatarContext';
import { UserProvider } from '../contexts/UserContext';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { usePreferences } from '../hooks/usePreferences';
import { LanguageProvider } from '../contexts/LanguageContext';

// Define your custom theme
const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#6200ee',
    secondary: '#03dac6',
    error: '#b00020',
  },
  fonts: configureFonts({
    config: {
      fontFamily: 'System',
      fontSize: 16,
      fontWeight: '400',
      letterSpacing: 0.5,
      lineHeight: 20,
    },
  }),
};

// This is the root layout for the app
function RootLayout() {
  const { isAuthenticated, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const { isDarkMode } = usePreferences();
  const colorScheme = useColorScheme();
  
  // Create theme objects
  const navigationTheme = isDarkMode ? DarkTheme : DefaultTheme;
  const paperTheme = isDarkMode ? MD3DarkTheme : theme;

  useEffect(() => {
    if (loading) {
      console.log('Auth loading...');
      return;
    }

    console.log('Auth state changed - isAuthenticated:', isAuthenticated, 'segments:', segments);

    // Define the target route based on authentication state
    if (isAuthenticated) {
      // If user is authenticated and trying to access auth pages, redirect to home
      if (segments[0] === '(auth)') {
        console.log('User authenticated, redirecting to home');
        router.replace('/(tabs)/home');
      }
    } else {
      // If user is not authenticated and not on an auth page, redirect to sign-in
      if (segments[0] !== '(auth)') {
        console.log('User not authenticated, redirecting to sign-in');
        router.replace('/auth/sign-in');
      }
    }
  }, [isAuthenticated, loading, segments, router]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ThemeProvider value={navigationTheme}>
      <PaperProvider theme={paperTheme}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <LanguageProvider>
            <UserProvider>
              <AvatarProvider>
                <Stack>
                  <Stack.Screen 
                    name="index" 
                    options={{ 
                      headerShown: false,
                      animation: 'fade',
                    }} 
                  />
                  
                  <Stack.Screen 
                    name="auth/sign-in" 
                    options={{ 
                      title: 'Sign In',
                      headerShown: false,
                      animation: 'slide_from_right',
                    }} 
                  />
                  
                  <Stack.Screen 
                    name="auth/sign-up" 
                    options={{ 
                      title: 'Create Account',
                      headerShown: false,
                      animation: 'slide_from_right',
                    }} 
                  />
                  
                  <Stack.Screen 
                    name="(tabs)" 
                    options={{ 
                      headerShown: false,
                      animation: 'fade',
                    }} 
                  />
                </Stack>
              </AvatarProvider>
            </UserProvider>
          </LanguageProvider>
        </GestureHandlerRootView>
      </PaperProvider>
    </ThemeProvider>
  );
}

export default RootLayout;
