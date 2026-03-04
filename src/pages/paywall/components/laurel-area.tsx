import { Image, ImageProps, View } from 'react-native';

import { useStorageValue } from '@/hooks/use-storage';
import langs from '@/i18n/langs.json';
import LaurelImage from '@/images/empty.png';
import { UiText } from '@/ui/ui-text';

export function LaurelArea() {
  const selectedLang = useStorageValue('selectedLang');

  return (
    <View className="flex-row items-center justify-center">
      <Image className="left-2" source={LaurelImage as ImageProps} />
      <View>
        <UiText className="text-center text-gray">
          {langs[selectedLang].pages.paywall.access}
        </UiText>
        <UiText className="text-center text-xl font-bold text-white">
          {langs[selectedLang].pages.paywall.trial}
        </UiText>
      </View>
      <Image
        className="right-2"
        style={[
          {
            transform: [{ rotateX: '180deg' }, { rotateZ: '180deg' }],
          },
        ]}
        source={LaurelImage as ImageProps}
      />
    </View>
  );
}
