import { View } from 'react-native';

import { useStorageValue } from '@/hooks/use-storage';
import langs from '@/i18n/langs.json';
import BoltIcon from '@/svg/paywall/bolt.svg';
import CrownIcon from '@/svg/paywall/crown.svg';
import NotificationIcon from '@/svg/paywall/notification.svg';
import SecretFolderIcon from '@/svg/paywall/secret-folder.svg';
import StickerIcon from '@/svg/paywall/sticker.svg';
import { UiText } from '@/ui/ui-text';

import { useConfig } from '../hooks/use-config';
import { Feature } from './feature';

export function FeaturesArea() {
  const { moderation_mode } = useConfig();
  const selectedLang = useStorageValue('selectedLang');

  const features = [
    {
      title: langs[selectedLang].pages.paywall.features.first.title,
      description: langs[selectedLang].pages.paywall.features.first.description,
      icon: CrownIcon,
    },
    moderation_mode
      ? {
          title:
            langs[selectedLang].pages.paywall.features.second_moderation.title,
          description:
            langs[selectedLang].pages.paywall.features.second_moderation
              .description,
          icon: NotificationIcon,
        }
      : {
          title: langs[selectedLang].pages.paywall.features.second.title,
          description:
            langs[selectedLang].pages.paywall.features.second.description,
          icon: NotificationIcon,
        },
    {
      title: langs[selectedLang].pages.paywall.features.third.title,
      description: langs[selectedLang].pages.paywall.features.third.description,
      icon: BoltIcon,
    },
    {
      title: langs[selectedLang].pages.paywall.features.fourth.title,
      description:
        langs[selectedLang].pages.paywall.features.fourth.description,
      icon: SecretFolderIcon,
    },
    {
      title: langs[selectedLang].pages.paywall.features.fifth.title,
      description: langs[selectedLang].pages.paywall.features.fifth.description,
      icon: StickerIcon,
    },
  ];

  return (
    <View className="gap-y-5 mx-3">
      <View className="flex-row items-center gap-x-1">
        <UiText className="text-sm text-gray">
          {langs[selectedLang].pages.paywall.what_include}
        </UiText>
        <View>
          <UiText className="rounded-full border border-[#81F763] bg-white/10 text-2xs text-gray color-[#81F763] px-1.5 py-0.5">
            {langs[selectedLang].pro}
          </UiText>
        </View>
      </View>
      <View className="gap-y-3">
        {features.map((feature) => (
          <Feature
            key={feature.title}
            title={feature.title}
            description={feature.description}
            Icon={feature.icon as React.FC<React.SVGProps<SVGSVGElement>>}
          />
        ))}
      </View>
      <View className="h-40" />
    </View>
  );
}
