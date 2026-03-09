import { useState, useEffect } from 'react';
import { getTranslations, languages } from './index';

/**
 * Custom hook for language management
 * @returns {Object} Language state and functions
 */
export const useLanguage = () => {
  // Initialize state directly with localStorage value if available
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('language');
    return savedLanguage || 'en';
  });
  
  const [translations, setTranslations] = useState(() => {
    const savedLanguage = localStorage.getItem('language');
    return getTranslations(savedLanguage || 'en');
  });

  // Update translations when language changes
  useEffect(() => {
    setTranslations(getTranslations(language));
  }, [language]);

  /**
   * Change language
   * @param {string} lang - Language code
   */
  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    
    // Update document attributes
    const langConfig = languages.find(l => l.code === lang);
    if (langConfig) {
      document.documentElement.dir = langConfig.direction || 'ltr';
      document.documentElement.lang = lang;
    }
  };

  /**
   * Translate function with fallback
   * @param {string} key - Translation key
   * @param {Object} params - Parameters for dynamic content
   * @returns {string} Translated text
   */
  const t = (key, params = {}) => {
    try {
      const keys = key.split('.');
      let value = translations;
      
      // Navigate through nested keys
      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          // Fallback to English
          const enTranslations = getTranslations('en');
          let enValue = enTranslations;
          for (const enK of keys) {
            if (enValue && typeof enValue === 'object' && enK in enValue) {
              enValue = enValue[enK];
            } else {
              enValue = undefined;
              break;
            }
          }
          return enValue || key;
        }
      }

      // Replace parameters if value is string
      if (typeof value === 'string' && params) {
        return Object.keys(params).reduce((str, param) => {
          return str.replace(new RegExp(`\\{${param}\\}`, 'g'), params[param]);
        }, value);
      }

      return value || key;
    } catch (error) {
      console.warn(`Translation error for key: ${key}`, error);
      return key;
    }
  };

  return {
    language,
    translations,
    changeLanguage,
    t,
  };
};