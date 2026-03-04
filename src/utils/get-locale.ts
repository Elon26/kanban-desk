import * as RNLocalize from 'react-native-localize';

import LangCode from '@/i18n/lang-code';

export function getLocale() {
  const locales = RNLocalize.getLocales();
  const languageCode = locales[0].languageCode;
  const selectedLang: LangCode =
    languageCode === LangCode.ja || languageCode === LangCode.ko
      ? languageCode
      : LangCode.en;

  return selectedLang;
}
