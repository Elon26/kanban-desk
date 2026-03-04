import { scaleX } from '@kirz/nativewind-scale';
import { LinearGradient } from 'expo-linear-gradient';

import { useStorageValue } from '@/hooks/use-storage';
import langs from '@/i18n/langs.json';

import { PaywallFooterButtonArea } from './paywall-footer-button-area';

export function PaywallFooter({
  changeScreen,
  paywallScreenNumber,
}: {
  changeScreen: (screenNumber: 1 | 2 | 3) => void;
  paywallScreenNumber: 1 | 2 | 3;
}) {
  const selectedLang = useStorageValue('selectedLang');

  return (
    <LinearGradient
      colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.8)', 'rgba(0, 0, 0, 1)']}
      style={{
        width: '100%',
        height: scaleX(200),
        position: 'absolute',
        bottom: 0,
        paddingTop: 100,
      }}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <PaywallFooterButtonArea
        buttonText={langs[selectedLang].pages.paywall.days_free_then}
        changeScreen={changeScreen}
        paywallScreenNumber={paywallScreenNumber}
      />
    </LinearGradient>
  );
}
