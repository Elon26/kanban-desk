import { BackButtonAlt } from '@/components/back-button-alt';
import { Page } from '@/ui/page';

import { DailyPreferences } from './daily-preferences';
import { LaurelArea } from './laurel-area';
import { PaywallFooterButtonArea } from './paywall-footer-button-area';
import { SimpleTextArea } from './simple-text-area';
import { TitleArea } from './title-area';

export function SecondPaywall({
  changeScreen,
  paywallScreenNumber,
}: {
  paywallScreenNumber: 1 | 2 | 3;
  changeScreen: (screenNumber: 1 | 2 | 3) => void;
}) {
  return (
    <Page className="pt-5">
      <BackButtonAlt />
      <TitleArea title="How Your Free Trial plan Works" />
      <DailyPreferences />
      <LaurelArea />
      <SimpleTextArea />
      <PaywallFooterButtonArea
        buttonText="Start Your Trial"
        paywallScreenNumber={paywallScreenNumber}
        changeScreen={changeScreen}
      />
    </Page>
  );
}
