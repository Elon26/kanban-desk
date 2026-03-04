import { type IAPSubscription, usePurchases } from '@kirz/expo-toolkit';
import dayjs from 'dayjs';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';

import NotificationIcon from '@/svg/paywall/unlock.svg';
import ReceiptIcon from '@/svg/paywall/unlock.svg';
import UnlockIcon from '@/svg/paywall/unlock.svg';
import { UiText } from '@/ui/ui-text';
import { trialDaysInProduct } from '@/utils/paywall';

export function PaywallHighlights() {
  const { subscriptions } = usePurchases();

  const [selectedSubscription, setSelectedSubscription] = useState<
    IAPSubscription | undefined
  >(undefined);
  const subscriptionsSorted = useMemo(() => {
    if (subscriptions) {
      return [...subscriptions].sort((a, b) => a.price - b.price);
    }
    return [];
  }, [subscriptions]);
  useEffect(() => {
    setSelectedSubscription(subscriptionsSorted[1] ?? subscriptionsSorted[0]);
  }, [subscriptionsSorted]);

  const daysInTrial = selectedSubscription
    ? trialDaysInProduct(selectedSubscription)
    : 0;

  const startsOnString = useMemo(() => {
    if (!selectedSubscription) {
      return '';
    }
    return `Your subscription will start on ${dayjs().add(trialDaysInProduct(selectedSubscription), 'day').format('MMMM DD, YYYY')}`;
  }, [selectedSubscription]);

  return (
    <Fragment>
      <View className="flex-row items-center gap-4 p-2.5 mt-3">
        <View className="items-center justify-center rounded-full bg-primary size-12">
          <UnlockIcon />
        </View>
        <View className="flex-1 gap-1.5">
          <UiText>
            <UiText className="text-lg font-medium color-primary">
              Today: Access Without Limits
            </UiText>
          </UiText>
          <UiText className="text-xs opacity-50 color-black">
            Gain complete access and begin cleaning your smartphone without
            restrictions
          </UiText>
        </View>
      </View>

      <View className="flex-row items-center gap-4 p-2.5">
        <View className="items-center justify-center rounded-full bg-primary size-12">
          <NotificationIcon />
        </View>
        <View className="flex-1 gap-1.5">
          <UiText>
            <UiText className="text-lg font-medium color-primary">
              {daysInTrial ? `Day ${daysInTrial - 1}` : 'Today'}: Trial End
              Notification
            </UiText>
          </UiText>
          <UiText className="text-xs opacity-50 color-black">
            Get notified when your free trial period is about to expire
          </UiText>
        </View>
      </View>
      <View className="flex-row items-center gap-4 p-2.5">
        <View className="items-center justify-center rounded-full bg-primary size-12">
          <ReceiptIcon />
        </View>
        <View className="flex-1 gap-1.5">
          <UiText className="text-lg font-medium color-primary">
            {daysInTrial ? `Day ${daysInTrial}` : 'Today'}: Trial End
          </UiText>
          <UiText className="text-xs opacity-50 color-black">
            {startsOnString}
          </UiText>
        </View>
      </View>
    </Fragment>
  );
}
