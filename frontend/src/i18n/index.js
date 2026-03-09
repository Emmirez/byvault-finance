import en from "./translations/en.json";
import es from "./translations/es.json";
import fr from "./translations/fr.json";
import de from "./translations/de.json";

// Language configurations
export const languages = [
  { code: "en", name: "English", flag: "🇺🇸", direction: "ltr" },
  { code: "es", name: "Español", flag: "🇪🇸", direction: "ltr" },
  { code: "fr", name: "Français", flag: "🇫🇷", direction: "ltr" },
  { code: "de", name: "Deutsch", flag: "🇩🇪", direction: "ltr" },
];

// Translations object
const translations = { en, es, fr, de };

/**
 * Get translation for current language
 * @param {string} lang - Language code
 * @returns {Object} Translations object
 */
export const getTranslations = (lang = "en") => {
  return translations[lang] || translations.en;
};

export default translations;
