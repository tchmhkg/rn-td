import React from 'react';
import i18n from 'i18n-js';
import * as RNLocalize from 'react-native-localize';

import en from './en.json';
import hk from './zh-hk.json';
import AsyncStorage from '@react-native-community/async-storage';

const locales = RNLocalize.getLocales();
console.log('Locales => ', locales);

const translations = {
  en,
  zh: hk,
  yue: hk,
};

if (Array.isArray(locales)) {
  i18n.locale = locales[0].languageCode;
}

i18n.fallbacks = true;
i18n.translations = translations;

// export default I18n;
const getLangFromStorage = async () => {
  try {
    const lang = await AsyncStorage.getItem('lang');
    if (lang !== null) {
      return lang;
    }
    return i18n.locale;
  } catch (e) {
    console.log(e);
  }
};

export const LocalizationContext = React.createContext();
export const useLocale = () => React.useContext(LocalizationContext);

const LocaleProvider = ({children}) => {
  const [locale, setLocale] = React.useState(i18n.locale);
  const storeLocale = (lang) => {
    AsyncStorage.setItem('lang', lang);
    setLocale(lang);
  };

  const localizationContext = React.useMemo(
    () => ({
      t: (scope, options) =>
        i18n.t(scope, {locale, defaultValue: scope, ...options}),
      locale,
      setLocale: storeLocale,
    }),
    [locale],
  );

  React.useEffect(() => {
    const getDefaultLang = async () => {
      const lang = await getLangFromStorage();
      setLocale(lang);
    };
    getDefaultLang();
  }, []);

  return (
    <LocalizationContext.Provider value={localizationContext}>
      {children}
    </LocalizationContext.Provider>
  );
};

export default LocaleProvider;
