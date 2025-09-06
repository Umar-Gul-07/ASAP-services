// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          welcome: "Welcome to our website",
          about: "About Us",
          service: "Services",
        }
      },
      ur: {
        translation: {
          welcome: "ہماری ویب سائٹ پر خوش آمدید",
          about: "ہمارے بارے میں",
          service: "سروسز",
        }
      }
    },
    lng: "en", // default language
    fallbackLng: "en",
    interpolation: { escapeValue: false }
  });

export default i18n;
