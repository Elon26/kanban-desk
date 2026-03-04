import { View } from 'react-native';

import { useStorageValue } from '@/hooks/use-storage';
import langs from '@/i18n/langs.json';
import { UiText } from '@/ui/ui-text';

export function TrialDescription() {
  const selectedLang = useStorageValue('selectedLang');

  const trialDescriptions = [
    {
      title: langs[selectedLang].pages.paywall.trial_descriptions.first.title,
      subtitle:
        langs[selectedLang].pages.paywall.trial_descriptions.first.subtitle,
    },
    {
      title: langs[selectedLang].pages.paywall.trial_descriptions.second.title,
      subtitle:
        langs[selectedLang].pages.paywall.trial_descriptions.second.subtitle,
    },
    {
      title: langs[selectedLang].pages.paywall.trial_descriptions.third.title,
      subtitle:
        langs[selectedLang].pages.paywall.trial_descriptions.third.subtitle,
    },
  ];

  return (
    <View className="gap-y-6 px-2">
      {trialDescriptions.map((description) => (
        <View key={description.title} className="gap-y-2">
          <UiText className="text-xl font-semibold">{description.title}</UiText>
          <UiText className="font-light text-gray">
            {description.subtitle}
          </UiText>
        </View>
      ))}
      <View className="h-48" />
    </View>
  );
}
