import { IAPSubscription } from '@kirz/expo-toolkit';
import React, { useEffect, useState } from 'react';
import { Pressable } from 'react-native';
import langs from '@/i18n/langs.json';

import { UiText } from '@/ui/ui-text';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { scaleX } from '@kirz/nativewind-scale';
import { useStorageValue } from '@/hooks/use-storage';

type Props = {
  selectedSubscription: IAPSubscription | undefined;
  subscriptions: IAPSubscription[] | undefined;
  setSelectedSubscription: (subscription: IAPSubscription) => void;
};

export default function PaywallSwitcher({
  selectedSubscription,
  subscriptions,
  setSelectedSubscription,
}: Props) {
  const selectedLang = useStorageValue('selectedLang');
  const [isSelectedWeek, setIsSelectedWeek] = useState(
    selectedSubscription?.periodUnit === 'week'
  );
  const translateX = useSharedValue(0);

  function handleChangeSubscribe() {
    const newSelectedSubscription = subscriptions?.find(
      (subscription) =>
        subscription.periodUnit === (isSelectedWeek ? 'quarter' : 'week')
    );
    if (newSelectedSubscription) {
      setSelectedSubscription(newSelectedSubscription);
    }
  }

  useEffect(() => {
    if (selectedSubscription?.periodUnit === 'week') {
      setIsSelectedWeek(true);
      translateX.value = withTiming(scaleX(0), { duration: 200 });
    } else {
      setIsSelectedWeek(false);
      translateX.value = withTiming(scaleX(106), { duration: 200 });
    }
  }, [selectedSubscription]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Pressable
      className="flex-row items-center justify-between self-center rounded-3xl border border-white bg-[#615890] px-6 mb-13 mt-6 py-2 h-10 w-52"
      onPress={() => handleChangeSubscribe()}
    >
      <Animated.View
        className="absolute rounded-3xl bg-white left-0.5 top-0.5 h-8.5 w-24"
        style={[animatedStyle]}
      />
      <UiText
        className="font-semibold"
        style={{
          color:
            selectedSubscription?.periodUnit === 'week' ? 'black' : 'white',
        }}
      >
        {langs[selectedLang].pages.paywall.weekly}
      </UiText>
      <UiText
        className="font-semibold"
        style={{
          color:
            selectedSubscription?.periodUnit === 'quarter' ? 'black' : 'white',
        }}
      >
        {langs[selectedLang].pages.paywall.quarter}
      </UiText>
    </Pressable>
  );
}
