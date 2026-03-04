import { Env } from '@kirz/expo-env';
import { openURL } from 'expo-linking';
import { View } from 'react-native';

import { UiButton } from '@/ui/ui-button';
import { UiText } from '@/ui/ui-text';

export function PaywallRewiews() {
  return (
    <View className="gap-5 p-4">
      {[
        [
          'Wonderful',
          'Jack Nicolson',
          'Cleaner app has been a game-changer for me! As a small business owner, staying on top of inventory and supplies can be overwhelming. With this app, I can efficiently manage everything and focus on providing top-notch service to my customers. Highly recommend!',
        ],
        [
          'Wonderful',
          'Andrew Newman',
          "Thanks to this app with Safety Advisor, I can efficiently manage my dad's auto repair shop without the hassle of manual tracking. This AI helper simplifies inventory management, saving me valuable time and effort.",
        ],
        [
          'Wonderful',
          'Martin Smith',
          "Cleaner app is a lifesaver! Being able to easily clean up unnecessary files has made a significant impact on my device's performance. As a busy professional, having this app has been a game-changer in optimizing my phone's speed and efficiency. Highly recommend for anyone looking to boost their device's performance!",
        ],
      ].map(([title, author, text]) => (
        <View key={author} className="bg-white gap-2.5 p-4">
          <View className="flex-row items-center justify-between">
            <UiText className="text-xs font-semibold">{title}</UiText>
            <UiText className="text-xs text-[#999999]">{author}</UiText>
          </View>
          <View className="flex-row gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <UiText key={i}>Star</UiText>
            ))}
          </View>
          <UiText className="text-xs text-[#999999]">{text}</UiText>
        </View>
      ))}
      <UiButton onPress={() => openURL(`https://apps.apple.com/app/id${Env.APP_ID}`)}>
        View more reviews
      </UiButton>
    </View>
  );
}
