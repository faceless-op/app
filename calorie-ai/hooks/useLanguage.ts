import { useState, useEffect } from 'react';
import { getLocales } from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type LanguageCode = 'en' | 'es' | 'fr' | 'de' | 'zh';
export type Language = {
  code: LanguageCode;
  name: string;
};

const supportedLanguages: Language[] = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'zh', name: '中文' },
];

export const useLanguage = () => {
  const [language, setLanguage] = useState<LanguageCode>(getLocales()[0].languageCode as LanguageCode || 'en');
  const [isLoading, setIsLoading] = useState(true);

  // Load saved language preference
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('appLanguage');
        if (savedLanguage) {
          setLanguage(savedLanguage as LanguageCode);
        }
      } catch (error) {
        console.error('Error loading language:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLanguage();
  }, []);

  // Change language and save preference
  const changeLanguage = async (newLanguage: LanguageCode) => {
    try {
      setLanguage(newLanguage);
      await AsyncStorage.setItem('appLanguage', newLanguage);
      // You might want to trigger a UI refresh here
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  return { 
    language, 
    changeLanguage, 
    supportedLanguages,
    isLoading
  };
};
