import { Env } from '@kirz/expo-env';
import {
  type IAPSubscription,
  useAnalytics,
  useLocale,
  usePurchases,
} from '@kirz/expo-toolkit';
import { scaleX, scaleY } from '@kirz/nativewind-scale';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ImageProps,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';

import { Container } from '@/components/container';
import { Page } from '@/components/page';
import { colors } from '@/config/theme';
import { useSetStorage, useStorageValue } from '@/hooks/use-storage';
import langs from '@/i18n/langs.json';
import BackgroundImage from '@/images/paywall-background.png';
import CloseIcon from '@/svg/close.svg';
import ClockIcon from '@/svg/paywall/clock.svg';
import { Btn } from '@/ui/button';
import { Pressable } from '@/ui/pressable';
import { UiText } from '@/ui/ui-text';

import { PaywallSlider } from './components/paywall-slider';
import PaywallSwitcher from './components/paywall-switcher';
import { useConfig } from './hooks/use-config';
import { usePaywall } from './hooks/use-paywall';
import { useWebViewModal } from './hooks/use-web-view-modal';

export function PaywallB() {
  const setIsReadyToShowNotification = useSetStorage(
    'isReadyToShowNotification'
  );
  const selectedLang = useStorageValue('selectedLang');
  const [isRestoring, setIsRestoring] = useState(false);
  const { hidePaywall } = usePaywall();
  const { logEvent } = useAnalytics();
  const {
    subscriptions: sub,
    hasPremium,
    restorePurchases,
    purchaseProduct,
  } = usePurchases();

  const subscriptions = sub?.filter(
    (sub) =>
      sub.periodUnit !== 'week' ||
      (sub.periodUnit === 'week' && sub.id === 'shoestore.todobooster.sub.week')
  );

  const { openModal: openWebViewModal } = useWebViewModal();

  const [selectedSubscription, setSelectedSubscription] = useState<
    IAPSubscription | undefined
  >(undefined);

  const { annoyingPaywallB: annoyingPaywall } = useConfig();
  const [readyToShow, setReadyToShow] = useState(false);
  setTimeout(() => {
    setReadyToShow(true);
  }, 4000);
  const [closeAttempt, setCloseAttempt] = useState(0);

  useEffect(() => {
    if (subscriptions) {
      const res = subscriptions.find((x) => x.periodUnit === 'week');
      setSelectedSubscription(res ?? subscriptions[0]);
    }
  }, []);

  const { formatPrice, formatPeriod } = useLocale();

  const subscribeButtonLabel = useMemo(() => {
    if (selectedSubscription?.trial) {
      const trialPeriod = formatPeriod(
        selectedSubscription.trial.periodUnit,
        selectedSubscription.trial.numberOfPeriods
      );

      const subscriptionPrice = formatPrice(
        selectedSubscription.price,
        selectedSubscription.currency
      );

      const subscriptionPeriod = formatPeriod(
        selectedSubscription.periodUnit,
        selectedSubscription.numberOfPeriods
      );

      return `${trialPeriod} free, then ${subscriptionPrice}/${subscriptionPeriod}`;
    }

    if (selectedSubscription) {
      return `${formatPrice(selectedSubscription.price, selectedSubscription.currency)}/${formatPeriod(selectedSubscription.periodUnit, selectedSubscription.numberOfPeriods)}`;
    }
    return '';
  }, [formatPeriod, formatPrice, selectedSubscription]);

  const [isPurchasing, setIsPurchasing] = useState(false);

  const handleSubscribe = useCallback(async () => {
    setIsPurchasing(true);

    await logEvent(
      `af_start_purchase*${selectedSubscription?.trial}_paywall_v_a`
    );
    if (hasPremium) {
      return;
    }
    if (selectedSubscription) {
      try {
        const purchase = await purchaseProduct(selectedSubscription.id);
        if (!purchase?.transactionId) {
          throw new Error('Purchase failed');
        }

        setIsReadyToShowNotification(true);
        hidePaywall();
      } catch {
        Alert.alert(
          langs[selectedLang].alerts.error,
          langs[selectedLang].alerts.purchase_failed
        );
      }
    }
    setIsPurchasing(false);
  }, [
    hasPremium,
    selectedSubscription,
    purchaseProduct,
    hidePaywall,
    logEvent,
  ]);

  return (
    <Page>
      <Container>
        <View className="absolute h-screen w-screen">
          <Image
            className="h-full w-full"
            resizeMode="cover"
            source={BackgroundImage as ImageProps}
          />
        </View>

        <View className="flex-row items-center justify-between px-2">
          <Pressable
            disabled={isPurchasing || isRestoring}
            onPress={async () => {
              setIsRestoring(true);
              const isRestored = await restorePurchases();
              Alert.alert(
                langs[selectedLang].alerts.restore_purchases,
                isRestored
                  ? langs[selectedLang].alerts.purchase_restored
                  : langs[selectedLang].alerts.no_purchases_found
              );
              setIsRestoring(false);
            }}
          >
            {isPurchasing || isRestoring ? (
              <View className="items-center justify-center w-24">
                <ActivityIndicator />
              </View>
            ) : (
              <UiText className="text-sm font-light text-gray underline">
                {langs[selectedLang].pages.paywall.restore_purchase}
              </UiText>
            )}
          </Pressable>
          <TouchableOpacity
            onPress={
              annoyingPaywall && closeAttempt < 4
                ? () => setCloseAttempt((prev) => ++prev)
                : () => {
                    setIsReadyToShowNotification(true);
                    hidePaywall();
                  }
            }
            className={annoyingPaywall && !readyToShow ? 'invisible' : ''}
          >
            <CloseIcon />
          </TouchableOpacity>
        </View>

        <ScrollView>
          <PaywallSwitcher
            selectedSubscription={selectedSubscription}
            subscriptions={subscriptions}
            setSelectedSubscription={setSelectedSubscription}
          />

          <View className="flex-row">
            <UiText className="text-center">
              <UiText className="text-2xl">
                {langs[selectedLang].pages.paywall.optimize_tasks}
              </UiText>
              <UiText className="text-2xl font-bold">
                {' '}
                {langs[selectedLang].pages.paywall.fast_and_safe}
              </UiText>
            </UiText>
          </View>

          <PaywallSlider />

          <View className="flex-row items-center justify-center gap-x-2 my-9">
            <ClockIcon />
            <UiText className="font-medium">
              {langs[selectedLang].pages.paywall.no_upfront_payment}{' '}
              {langs[selectedLang].pages.paywall.cancel_anytime}
            </UiText>
          </View>

          <Btn
            size="big"
            label={langs[selectedLang].buttons.subscribe}
            classes="bg-[#202020] border border-white/30 mx-2"
            handler={() => {}}
            disabled
          />

          <View className="items-center rounded-3xl border border-blue gap-y-4 mx-2 p-3 mb-6 mt-3">
            <UiText className="text-lg font-semibold">
              {langs[selectedLang].pages.paywall.not_sure}
            </UiText>
            <Pressable
              className="rounded-4xl bg-blue w-full"
              onPress={handleSubscribe}
            >
              {isPurchasing ? (
                <ActivityIndicator
                  size="large"
                  color={colors.green.toString()}
                />
              ) : selectedSubscription?.trial ? (
                <View
                  className="items-center justify-center gap-y-1"
                  style={{ width: scaleX(291), height: scaleY(55) }}
                >
                  <UiText className="text-center text-lg font-semibold">
                    {langs[selectedLang].pages.paywall.try_trial}
                  </UiText>
                  <UiText className="text-center text-xs">
                    {formatPeriod(
                      selectedSubscription.trial.periodUnit,
                      selectedSubscription.trial.numberOfPeriods
                    )}{' '}
                    {langs[selectedLang].free_small}, {langs[selectedLang].then}{' '}
                    {selectedSubscription &&
                      formatPrice(
                        selectedSubscription.price,
                        selectedSubscription.currency
                      )}
                    /
                    {selectedSubscription &&
                      formatPeriod(
                        selectedSubscription.periodUnit,
                        selectedSubscription.numberOfPeriods
                      )}
                  </UiText>
                </View>
              ) : (
                <View
                  className="items-center justify-center"
                  style={{ width: scaleX(291), height: scaleY(55) }}
                >
                  <UiText className="text-center">
                    {subscribeButtonLabel}
                  </UiText>
                </View>
              )}
            </Pressable>
          </View>

          <View className="flex-row justify-center my-5">
            <UiText
              className="text-sm font-medium underline"
              onPress={() => {
                openWebViewModal(Env.TERMS_OF_USE);
              }}
            >
              {langs[selectedLang].pages.settings.terms}
            </UiText>
            <UiText className="text-sm font-medium"> & </UiText>
            <UiText
              className="text-sm font-medium underline"
              onPress={() => {
                openWebViewModal(Env.PRIVACY_POLICY);
              }}
            >
              {langs[selectedLang].pages.settings.privacy}
            </UiText>
          </View>
        </ScrollView>
      </Container>
    </Page>
  );
}
