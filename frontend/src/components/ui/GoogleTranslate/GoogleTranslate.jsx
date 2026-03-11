// components/ui/GoogleTranslate/GoogleTranslate.jsx
import { useState, useRef, useEffect } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

const languages = [
  { code: "en",  label: "English",    country: "us", gtCode: null    },
  { code: "es",  label: "Spanish",    country: "es", gtCode: "es"    },
  { code: "fr",  label: "French",     country: "fr", gtCode: "fr"    },
  { code: "de",  label: "German",     country: "de", gtCode: "de"    },
  { code: "it",  label: "Italian",    country: "it", gtCode: "it"    },
  { code: "pt",  label: "Portuguese", country: "pt", gtCode: "pt"    },
  { code: "ru",  label: "Russian",    country: "ru", gtCode: "ru"    },
  { code: "zh",  label: "Chinese",    country: "cn", gtCode: "zh-CN" },
  { code: "ja",  label: "Japanese",   country: "jp", gtCode: "ja"    },
  { code: "ko",  label: "Korean",     country: "kr", gtCode: "ko"    },
  { code: "ar",  label: "Arabic",     country: "sa", gtCode: "ar"    },
  { code: "hi",  label: "Hindi",      country: "in", gtCode: "hi"    },
  { code: "tr",  label: "Turkish",    country: "tr", gtCode: "tr"    },
  { code: "nl",  label: "Dutch",      country: "nl", gtCode: "nl"    },
  { code: "pl",  label: "Polish",     country: "pl", gtCode: "pl"    },
  { code: "cs",  label: "Czech",      country: "cz", gtCode: "cs"    },
  { code: "da",  label: "Danish",     country: "dk", gtCode: "da"    },
  { code: "fi",  label: "Finnish",    country: "fi", gtCode: "fi"    },
  { code: "et",  label: "Estonian",   country: "ee", gtCode: "et"    },
  { code: "fil", label: "Filipino",   country: "ph", gtCode: "tl"    },
  { code: "sv",  label: "Swedish",    country: "se", gtCode: "sv"    },
  { code: "no",  label: "Norwegian",  country: "no", gtCode: "no"    },
];

const LANG_CHANGE_EVENT = "app:languageChanged";

// ── Singleton: only init the widget once across all instances ─────────────────
let widgetInitialized = false;

const initWidget = () => {
  if (widgetInitialized) return;
  widgetInitialized = true;

  if (!document.getElementById("gt-hidden-widget")) {
    const div = document.createElement("div");
    div.id = "gt-hidden-widget";
    div.style.cssText =
      "position:absolute;visibility:hidden;height:0;overflow:hidden";
    document.body.appendChild(div);
  }

  if (!document.getElementById("gt-script")) {
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        { pageLanguage: "en", autoDisplay: false },
        "gt-hidden-widget"
      );
    };
    const script = document.createElement("script");
    script.id = "gt-script";
    script.src =
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);
  }
};

// ── Shared selected language across all instances ─────────────────────────────
let sharedLang = null;

const clearGoogTransCookie = () => {
  const domains = [window.location.hostname, "." + window.location.hostname];
  domains.forEach((d) => {
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${d}`;
  });
  document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
};

const syncI18nToEnglish = () => {
  // Clear ALL known language storage keys so the old i18n system
  // does not re-apply a non-English language on next render
  localStorage.setItem("language", "en");
  localStorage.removeItem("i18nextLng");
  localStorage.removeItem("i18next_lng");
};

const getInitialLang = () => {
  if (sharedLang) return sharedLang;

  // Check if user explicitly chose English before
  const saved = localStorage.getItem("language");
  if (!saved || saved === "en") {
    sharedLang = languages[0];
    clearGoogTransCookie();
    return languages[0];
  }

  // Try to match saved i18n language to a Google Translate language
  const matched = languages.find((l) => l.code === saved || l.gtCode === saved);
  if (matched) {
    sharedLang = matched;
    return matched;
  }

  // Fallback: read googtrans cookie
  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("googtrans="));
  if (cookie) {
    const parts = cookie.split("=")[1].split("/");
    const target = parts[2];
    if (target && target !== "en") {
      const fromCookie = languages.find((l) => l.gtCode === target);
      if (fromCookie) {
        sharedLang = fromCookie;
        return fromCookie;
      }
    }
  }

  sharedLang = languages[0];
  return languages[0];
};


const Flag = ({ country, size = 24 }) => (
  <img
    src={`https://flagcdn.com/w40/${country}.png`}
    alt={country}
    width={size}
    height={Math.round(size * 0.67)}
    className="rounded-sm object-cover flex-shrink-0"
    onError={(e) => {
      e.target.style.display = "none";
    }}
  />
);

const LanguageSwitcher = ({ dropDown = false }) => {
  const [selected, setSelected] = useState(() => getInitialLang());
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Init Google Translate widget — singleton, safe to call multiple times
  useEffect(() => {
    initWidget();
  }, []);

  // Restore scroll position after English reload
  useEffect(() => {
    const savedPos = sessionStorage.getItem("scrollPos");
    if (savedPos) {
      window.scrollTo({ top: parseInt(savedPos), behavior: "instant" });
      sessionStorage.removeItem("scrollPos");
    }
  }, []);

  // Sync with other LanguageSwitcher instances on the same page
  useEffect(() => {
    const handler = (e) => {
      const lang = languages.find((l) => l.code === e.detail.code);
      if (lang) {
        sharedLang = lang;
        setSelected(lang);
      }
    };
    window.addEventListener(LANG_CHANGE_EVENT, handler);
    return () => window.removeEventListener(LANG_CHANGE_EVENT, handler);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const triggerGoogleTranslate = (gtCode) => {
    const tryChange = (attempts = 0) => {
      const select = document.querySelector(".goog-te-combo");
      if (select) {
        select.value = gtCode;
        select.dispatchEvent(new Event("change"));
      } else if (attempts < 20) {
        setTimeout(() => tryChange(attempts + 1), 300);
      }
    };
    tryChange();
  };

  const handleSelect = (lang) => {
    setOpen(false);
    sharedLang = lang;

    // Sync BOTH storage keys so i18n system and Google Translate agree
    localStorage.setItem("language", lang.code);
    localStorage.removeItem("i18nextLng");

    // Broadcast to all other instances
    window.dispatchEvent(
      new CustomEvent(LANG_CHANGE_EVENT, { detail: { code: lang.code } })
    );

    if (lang.gtCode === null) {
      // Switching to English — clear everything and reload
      setSelected(lang);
      syncI18nToEnglish();
      sessionStorage.setItem("scrollPos", window.scrollY);
      clearGoogTransCookie();
      window.location.reload();
      return;
    }

    setSelected(lang);
    triggerGoogleTranslate(lang.gtCode);
  };

  const dropdownPosition = dropDown ? "top-full mt-2" : "bottom-full mb-2";

  return (
    <>
      <style>{`
        .goog-te-banner-frame,
        #goog-gt-tt,
        .goog-te-balloon-frame,
        .goog-tooltip,
        .goog-tooltip-content,
        .skiptranslate { display: none !important; }
        body { top: 0 !important; }
      `}</style>

      <div ref={ref} className="relative inline-block">
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2 shadow-sm hover:shadow-md hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-200"
        >
          <Flag country={selected.country} size={22} />
          <span className="text-sm font-bold text-gray-800 dark:text-gray-100 uppercase tracking-wide">
            {selected.code}
          </span>
          {open ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </button>

        {open && (
          <div
            className={`absolute ${dropdownPosition} left-0 w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl overflow-hidden z-[9999]`}
          >
            <div className="max-h-72 overflow-y-auto">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleSelect(lang)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors duration-150
                    ${
                      selected.code === lang.code
                        ? "bg-blue-50 dark:bg-blue-900/30"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                >
                  <Flag country={lang.country} size={22} />
                  <span
                    className={`text-sm font-medium ${
                      selected.code === lang.code
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {lang.label}
                  </span>
                  {selected.code === lang.code && (
                    <span className="ml-auto w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>

            <div className="border-t border-gray-100 dark:border-gray-700 px-4 py-2.5 flex items-center gap-2 bg-gray-50 dark:bg-gray-800/60">
              <Flag country={selected.country} size={20} />
              <span className="text-sm font-bold text-gray-600 dark:text-gray-300 uppercase">
                {selected.code}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-400 ml-auto" />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default LanguageSwitcher;