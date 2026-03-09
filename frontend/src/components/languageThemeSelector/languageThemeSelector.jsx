// components/LanguageThemeSelector.jsx
import { useState } from 'react';
import { Globe, Sun, Moon, Monitor, ChevronDown } from 'lucide-react';
import { useDarkMode } from '../hooks/useDarkMode';

const LanguageThemeSelector = ({ t, language, setLanguage }) => {
  const { darkMode, toggleDarkMode, setTheme } = useDarkMode();
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState('language'); // 'language' or 'theme'

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'Français' }
  ];

  const themes = [
    { id: 'light', label: t('theme.light'), icon: Sun },
    { id: 'dark', label: t('theme.dark'), icon: Moon },
    { id: 'system', label: t('theme.system'), icon: Monitor }
  ];

  const currentTheme = darkMode ? 'dark' : 'light';

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      >
        {mode === 'language' ? (
          <>
            <Globe size={20} />
            <span className="hidden md:inline">
              {languages.find(l => l.code === language)?.label}
            </span>
          </>
        ) : (
          <>
            {darkMode ? <Moon size={20} /> : <Sun size={20} />}
            <span className="hidden md:inline">
              {darkMode ? t('theme.dark') : t('theme.light')}
            </span>
          </>
        )}
        <ChevronDown size={16} />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50 border border-gray-200 dark:border-gray-700">
          <div className="flex border-b border-gray-200 dark:border-gray-700 mb-2">
            <button
              onClick={() => setMode('language')}
              className={`flex-1 py-2 text-center ${mode === 'language' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-gray-600 dark:text-gray-400'}`}
            >
              {t('common.language')}
            </button>
            <button
              onClick={() => setMode('theme')}
              className={`flex-1 py-2 text-center ${mode === 'theme' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-gray-600 dark:text-gray-300'}`}
            >
              {t('theme.toggle')}
            </button>
          </div>
          
          <div className="max-h-60 overflow-y-auto">
            {mode === 'language' ? (
              <div className="py-1">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setIsOpen(false);
                    }}
                    className={`flex items-center space-x-3 w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                      language === lang.code 
                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span>{lang.label}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="py-1">
                {themes.map((themeOption) => (
                  <button
                    key={themeOption.id}
                    onClick={() => {
                      if (themeOption.id === 'system') {
                        // Reset to system preference
                        localStorage.removeItem('theme');
                        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                        if (prefersDark !== darkMode) {
                          toggleDarkMode();
                        }
                      } else {
                        setTheme(themeOption.id);
                      }
                      setIsOpen(false);
                    }}
                    className={`flex items-center space-x-3 w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                      currentTheme === themeOption.id 
                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <themeOption.icon size={18} />
                    <span>{themeOption.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageThemeSelector;