import { ScrollView } from 'react-native';

import { BackButtonAlt } from '@/components/back-button-alt';
import { SeparatorAlt } from '@/ui/separator-alt';
import { View } from '@/ui/view';

import { FeaturesArea } from './features-area';
import { PaywallFooter } from './paywall-footer';
import { StarArea } from './star-area';
import { TariffCheckboxes } from './tariff-checkboxes';
import { TitleArea } from './title-area';

export function FirstPaywall({
  changeScreen,
  paywallScreenNumber,
}: {
  changeScreen: (screenNumber: 1 | 2 | 3) => void;
  paywallScreenNumber: 1 | 2 | 3;
}) {
  return (
    <View className="flex-1 bg-background px-1.5">
      <ScrollView>
        <StarArea>
          <BackButtonAlt />
          <TitleArea
            title="Get Premium"
            subtitle="More features, more possibilities, no limits!"
          />
          <TariffCheckboxes />
        </StarArea>
        <SeparatorAlt />
        <FeaturesArea />
      </ScrollView>
      <PaywallFooter
        changeScreen={changeScreen}
        paywallScreenNumber={paywallScreenNumber}
      />
    </View>
  );
}
