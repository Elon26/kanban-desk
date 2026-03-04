import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { getLocale } from '@/utils/get-locale';

const currentLang = getLocale();

i18n.use(initReactI18next).init({
  resources: {
    en: {
      myNamespace: {
        enjoy:
          'Enjoy {{trialPeriod}} for free, then just {{price}} per {{subscriptionPeriod}}',
        mergeContacts_one: 'Merge {{count}} contact',
        mergeContacts_plural: 'Merge {{count}} contacts',
        quantity: '{{selectedQuantity}} of {{totalQuantity}}',
        storage: '{{usedSpace}} of {{totalSpace}}',
        storageUsed: '{{usedSpace}} used of {{totalSpace}}',
        trial: '{{trialPeriod}} free, then {{price}} / {{subscriptionPeriod}}',
        viewAll_one: 'view all {{count}} file',
        viewAll_plural: 'view all {{count}} files',
      },
    },
    ko: {
      myNamespace: {
        enjoy:
          '무료로 {{trialPeriod}} 동안 이용한 후, {{subscriptionPeriod}}당 {{price}}에 이용하세요',
        mergeContacts_one: '연락처 {{count}}개 병합',
        mergeContacts_plural: '연락처 {{count}}개 병합',
        quantity: '{{selectedQuantity}} / {{totalQuantity}}',
        storage: '{{usedSpace}} / {{totalSpace}}',
        storageUsed: '{{totalSpace}} 중 {{usedSpace}} 사용됨',
        trial:
          '{{trialPeriod}} 무료 체험, 이후 {{subscriptionPeriod}} {{price}}',
        viewAll_one: '파일 {{count}}개 모두 보기',
        viewAll_plural: '파일 {{count}}개 모두 보기',
      },
    },
    ja: {
      myNamespace: {
        enjoy:
          '{{trialPeriod}} を無料でお試しいただけます。その後は {{subscriptionPeriod}} ごとに {{price}} です。',
        mergeContacts_one: '{{count}}件の連絡先を統合',
        mergeContacts_plural: '{{count}}件の連絡先を統合',
        quantity: '{{selectedQuantity}} 中 {{totalQuantity}}',
        storage: '{{totalSpace}} 中 {{usedSpace}} 使用中',
        storageUsed: '{{totalSpace}} 中 {{usedSpace}} 使用中',
        trial:
          '{{trialPeriod}}間無料、その後は{{subscriptionPeriod}}あたり{{price}}',
        viewAll_one: '{{count}} 件すべてを見る',
        viewAll_plural: '{{count}} 件すべてを見る',
      },
    },
  },
  lng: currentLang,
  fallbackLng: 'en',
  ns: ['myNamespace'],
  defaultNS: 'myNamespace',
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

export default i18n;
