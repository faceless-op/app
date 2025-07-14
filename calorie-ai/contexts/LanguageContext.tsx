import React, { createContext, useContext, useMemo } from 'react';
import { useLanguage } from '../hooks/useLanguage';

type LanguageContextType = ReturnType<typeof useLanguage>;

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  changeLanguage: async () => {},
  supportedLanguages: [],
  isLoading: true
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const language = useLanguage();
  
  // This ensures the context value is stable between renders
  const contextValue = useMemo(() => language, [language]);
  
  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useAppLanguage = () => useContext(LanguageContext);
