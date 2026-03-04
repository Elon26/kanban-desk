import { IAPSubscription, useLocale, usePurchases } from '@kirz/expo-toolkit';
import { View } from 'react-native';

import { useStorageValue } from '@/hooks/use-storage';
import langs from '@/i18n/langs.json';
import { UiText } from '@/ui/ui-text';
import { Pressable } from '@/ui/pressable';
import { PaywallCheckbox } from './paywall-checkbox';

export function TariffCheckboxes({
  selectedSubscription,
  subscriptions,
  setSelectedSubscription,
  cheaperSubscription,
}: {
  selectedSubscription: IAPSubscription | undefined;
  cheaperSubscription: IAPSubscription | null;
  subscriptions: IAPSubscription[] | undefined;
  setSelectedSubscription: (subscription: IAPSubscription) => void;
}) {
  const selectedLang = useStorageValue('selectedLang');
  const { computeSubscriptionDiscount } = usePurchases();
  const { formatPrice } = useLocale();

  return (
    <View className="rounded-3xl bg-[#533866] gap-y-1 mx-1 mb-4 mt-5">
      {subscriptions?.map((subscription, index) => {
        const discount = cheaperSubscription
          ? computeSubscriptionDiscount(subscription, cheaperSubscription)
          : 0;
        return (
          <View key={subscription.id}>
            <Pressable
              className="bg-primary-dark h-[70px] flex-row items-center justify-between rounded-2xl gap-x-4 px-4 py-3.5"
              onPress={() => {
                setSelectedSubscription(subscription);
              }}
            >
              <View>
                <UiText className="text-lg font-medium capitalize">
                  {subscription.periodUnit === 'week'
                    ? langs[selectedLang].pages.paywall.one_week
                    : langs[selectedLang].pages.paywall.quarter}
                </UiText>
                <View className="flex-row items-center gap-x-1">
                  <UiText
                    className="text-center text-sm"
                    style={{
                      color:
                        discount !== 0 && cheaperSubscription
                          ? '#81F763'
                          : '#BFBFBF',
                    }}
                  >
                    {subscription.currency === 'USD'
                      ? '$' + Math.round(subscription.price * 100) / 100
                      : `${formatPrice(subscription.price, subscription.currency)}`}
                  </UiText>
                  {subscription.periodUnit === 'quarter' && (
                    <View className="flex-row items-center gap-x-3">
                      <View className="flex-row gap-x-1">
                        {discount !== 0 && cheaperSubscription ? (
                          <UiText className="text-xs text-gray line-through">
                            {subscription.currency === 'USD'
                              ? '$' +
                                Math.round(
                                  cheaperSubscription.price * 12 * 100
                                ) /
                                  100
                              : formatPrice(
                                  cheaperSubscription.price * 12,
                                  subscription.currency
                                )}
                          </UiText>
                        ) : null}
                      </View>
                      <UiText className="rounded-3xl bg-primary text-sm text-black px-1.5 py-0.5">
                        {Math.floor(discount)}%{' '}
                        {langs[selectedLang].off.toUpperCase()}
                      </UiText>
                    </View>
                  )}
                </View>
              </View>
              <View className="flex-1 gap-y-1">
                <View className="flex-row justify-between"></View>
              </View>
              <PaywallCheckbox
                checked={subscription.id === selectedSubscription?.id}
                onChange={() => setSelectedSubscription(subscription)}
              />
            </Pressable>
            {index !== subscriptions.length - 1 && (
              <View className="h-[1px] bg-white/10" />
            )}
          </View>
        );
      })}
    </View>
  );
}
