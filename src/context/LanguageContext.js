import { createContext, useContext, useEffect, useState } from "react";
import i18n from "./i18n";
import { EventRegister } from "react-native-event-listeners";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const languageListener = EventRegister.addEventListener(
      "ChangeLanguage",
      (data) => {
        if (typeof data === "string") {
          i18n.changeLanguage(data);
          setLanguage(data);
        } else {
          console.error("Invalid language value:", data);
        }
      }
    );

    return () => {
      EventRegister.removeEventListener(languageListener);
    };
  }, []);

  const changeLanguage = (lng) => {
    if (typeof lng === "string") {
      i18n.changeLanguage(lng);
      setLanguage(lng);
    } else {
    }
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  return useContext(LanguageContext);
};
