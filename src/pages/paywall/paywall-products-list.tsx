import { type IAPSubscription, useLocale, usePurchases } from '@kirz/expo-toolkit';
import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';

import { UiText } from '@/ui/ui-text';

type PaywallProductsListProps = {
  isPurchasing: boolean;
  subscriptionsSorted: IAPSubscription[];
  selectedSubscription: IAPSubscription | undefined;
  setSelectedSubscription: (subscription: IAPSubscription) => void;
};

export function PaywallProductsList({
  isPurchasing,
  subscriptionsSorted,
  selectedSubscription,
  setSelectedSubscription,
}: PaywallProductsListProps) {
  const { computeSubscriptionDiscount } = usePurchases();
  const [cheaperSubscription, setCheaperSubscription] = useState<IAPSubscription | null>(null);
  const { formatPrice, formatPeriod } = useLocale();

  useEffect(() => {
    if (subscriptionsSorted) {
      const res = subscriptionsSorted.find((x) => x.trial);
      setSelectedSubscription(res ?? subscriptionsSorted[0]);
      setCheaperSubscription(subscriptionsSorted.sort((a, b) => a.price - b.price)[0]);
    }
  }, [setSelectedSubscription, subscriptionsSorted]);

  return (
    <View className="flex-1 gap-2.5 mt-5">
      {subscriptionsSorted?.map((subscription) => {
        const isSelected = subscription.id === selectedSubscription?.id;

        const discount = cheaperSubscription
          ? computeSubscriptionDiscount(subscription, cheaperSubscription)
          : 0;
        return (
          <Pressable
            key={subscription.id}
            disabled={isPurchasing}
            className={`flex-row items-center justify-between rounded-2xl border-2 bg-white px-2 py-4 ${isSelected ? 'border-primary' : 'border-white'}`}
            onPress={() => setSelectedSubscription(subscription)}
          >
            <View>
              <View className="flex-row">
                <UiText className="text-base font-bold color-primary">
                  {formatPrice(subscription.price, subscription.currency)}/{subscription.title},{' '}
                </UiText>

                <UiText className="text-base font-medium color-black">
                  {subscription.periodUnit === 'week'
                    ? 'cancel at any time'
                    : subscription.periodUnit}
                </UiText>
              </View>
              {subscription.trial && (
                <UiText className="text-sm font-normal color-[#949494] mt-1">
                  {formatPeriod(subscription.trial.periodUnit, subscription.trial.numberOfPeriods)}{' '}
                  free trial period
                </UiText>
              )}
            </View>
            {discount !== 0 ? (
              <View
                className="items-center justify-center bg-primary px-3 h-8"
                style={{
                  borderRadius: 50,
                }}
              >
                <UiText className="text-base font-medium color-white">
                  sale {Math.floor(discount)}%
                </UiText>
              </View>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}
