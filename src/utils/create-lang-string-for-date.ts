import LangCode from '@/i18n/lang-code';

export function createLangStringForDate(selectedLang: LangCode) {
  return selectedLang + '-' + selectedLang.toUpperCase();
}
