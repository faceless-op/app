import { useState, useEffect } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const usePreferences = () => {
  const [isDarkMode, setIsDarkMode] = useState(Appearance.getColorScheme() === 'dark');

  // Load saved preference and listen for system changes
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const savedMode = await AsyncStorage.getItem('darkMode');
        if (savedMode !== null) {
          setIsDarkMode(savedMode === 'true');
          Appearance.setColorScheme(savedMode === 'true' ? 'dark' : 'light');
        }
      } catch (error) {
        console.error('Error loading preferences:', error);
      }
    };

    loadPreferences();
    
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (!colorScheme) return;
      setIsDarkMode(colorScheme === 'dark');
    });
    
    return () => subscription.remove();
  }, []);

  // Toggle theme and save preference
  const toggleTheme = async () => {
    try {
      const newMode = !isDarkMode;
      setIsDarkMode(newMode);
      await AsyncStorage.setItem('darkMode', String(newMode));
      Appearance.setColorScheme(newMode ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  return { isDarkMode, toggleTheme };
};
