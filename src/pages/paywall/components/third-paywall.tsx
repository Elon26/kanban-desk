import { BackButtonAlt } from '@/components/back-button-alt';
import { Page } from '@/ui/page';
import { View } from '@/ui/view';

import { CartArea } from './cart-area';
import { PaywallFooterButtonArea } from './paywall-footer-button-area';
import { TariffCheckboxes } from './tariff-checkboxes';
import { TitleArea } from './title-area';

export function ThirdPaywall({
  changeScreen,
  paywallScreenNumber,
}: {
  paywallScreenNumber: 1 | 2 | 3;
  changeScreen: (screenNumber: 1 | 2 | 3) => void;
}) {
  return (
    <Page>
      <View className="mb-7">
        <CartArea>
          <BackButtonAlt />
          <TitleArea
            title="Get Premium"
            subtitle="More features, more possibilities, no limits!"
          />
        </CartArea>
        <TariffCheckboxes />
      </View>
      <PaywallFooterButtonArea
        buttonText="3 days free then $69.99/quarter"
        paywallScreenNumber={paywallScreenNumber}
        changeScreen={changeScreen}
      />
    </Page>
  );
}
