import { IAPSubscription } from '@kirz/expo-toolkit';
import { View } from 'react-native';

import AlarmIcon from '@/svg/paywall/bolt.svg';
import UnlockIcon from '@/svg/paywall/bolt.svg';
import VerifyIcon from '@/svg/paywall/bolt.svg';
import { UiText } from '@/ui/ui-text';

export function DailyPreferences({
  trialSubscription,
}: {
  trialSubscription: IAPSubscription | undefined;
}) {
  const trialPeriod = trialSubscription?.trial
    ? trialSubscription?.trial.numberOfPeriods
    : 3;

  return (
    <View className="gap-y-2 -mx-6 mb-6">
      <View className="h-[70px] flex-row gap-x-1">
        <View className="w-[113px] flex-row items-center justify-end rounded-lg bg-primary px-5">
          <UnlockIcon />
        </View>
        <View className="w-[280px] justify-center rounded-lg bg-white/10 gap-y-1 px-4">
          <UiText className="font-bold text-primary">Today</UiText>
          <UiText className="text-text-gray text-xs">
            Enjoy full free access and clean up your device now!
          </UiText>
        </View>
        <View className="bg-primary-dark w-[113px] rounded-lg" />
      </View>

      <View className="h-[70px] flex-row gap-x-1">
        <View className="bg-primary-dark w-[36px] rounded-lg" />
        <View className="w-[72px] flex-row items-center justify-center rounded-lg bg-primary px-5">
          <VerifyIcon />
        </View>
        <View className="bg-primary-dark w-[252px] justify-center rounded-lg gap-y-1 px-4">
          <UiText className="font-bold text-primary">
            In {trialPeriod - 1} days
          </UiText>
          <UiText className="text-text-gray text-xs">
            You will receive a notification about the end of your trial period
          </UiText>
        </View>
        <View className="bg-primary-dark w-[139px] rounded-lg" />
      </View>

      <View className="h-[70px] flex-row gap-x-1">
        <View className="bg-primary-dark w-[36px] rounded-lg" />
        <View className="w-[102px] flex-row items-center justify-start rounded-lg bg-primary px-5">
          <AlarmIcon />
        </View>
        <View className="bg-primary-dark justify-center rounded-lg gap-y-1 px-4 w-full">
          <UiText className="font-bold text-primary">
            In {trialPeriod} days
          </UiText>
          <UiText className="text-text-gray text-xs">
            Payment will be processed; you can{'\n'} cancel anytime before this
            date
          </UiText>
        </View>
      </View>
    </View>
  );
}
