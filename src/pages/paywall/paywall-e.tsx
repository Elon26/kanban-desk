import {
  type IAPSubscription,
  useAnalytics,
  useLocale,
  usePurchases,
} from '@kirz/expo-toolkit';
import { scaleX } from '@kirz/nativewind-scale';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Alert,
  Animated,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { Easing } from 'react-native-reanimated';
import { twMerge } from 'tailwind-merge';

import { Container } from '@/components/container';
import { Page } from '@/components/page';
import { PageBackground } from '@/components/page-background';
import { colors } from '@/config/theme';
import { useSetStorage, useStorageValue } from '@/hooks/use-storage';
import langs from '@/i18n/langs.json';
import AppleIcon from '@/svg/apple-alt.svg';
import CloseIcon from '@/svg/close.svg';
import { Pressable } from '@/ui/pressable';
import { PulseBtnAlt } from '@/ui/pulse-button-alt';
import { SfSymbol } from '@/ui/sf-symbol';
import { UiText } from '@/ui/ui-text';

import AnimatedArea from './components/animated-area';
import { useConfig } from './hooks/use-config';
import { usePaywall } from './hooks/use-paywall';
import { PaywallFooter } from './paywall-fooler';

export function PaywallE() {
  const setIsReadyToShowNotification = useSetStorage(
    'isReadyToShowNotification'
  );
  const { annoyingPaywallE: annoyingPaywall, subscription_for_paywall_e } =
    useConfig();
  const { t } = useTranslation('myNamespace');
  const selectedLang = useStorageValue('selectedLang');
  const { hidePaywall } = usePaywall();
  const [isRestoring, setIsRestoring] = useState(false);
  const {
    subscriptions: sub,
    hasPremium,
    restorePurchases,
    purchaseProduct,
  } = usePurchases();

  let subscriptions = sub;
  if (subscription_for_paywall_e === 'a') {
    subscriptions = sub?.filter(
      (sub) =>
        sub.periodUnit !== 'week' ||
        (sub.periodUnit === 'week' &&
          sub.id === 'shoestore.todobooster.sub.week')
    );
  }
  if (subscription_for_paywall_e === 'b') {
    subscriptions = sub?.filter(
      (sub) =>
        sub.periodUnit !== 'week' ||
        (sub.periodUnit === 'week' &&
          sub.id === 'shoestore.todobooster.sub.weeknew')
    );
  }
  if (subscription_for_paywall_e === 'c') {
    subscriptions = sub?.filter(
      (sub) =>
        sub.periodUnit !== 'week' ||
        (sub.periodUnit === 'week' &&
          sub.id === 'shoestore.todobooster.sub.weeknew12')
    );
  }

  const { logEvent } = useAnalytics();
  const [trialSubscription, setTrialSubscription] = useState<
    IAPSubscription | undefined
  >(undefined);

  const [readyToShow, setReadyToShow] = useState(false);
  setTimeout(() => {
    setReadyToShow(true);
  }, 4000);
  const [closeAttempt, setCloseAttempt] = useState(0);

  useEffect(() => {
    if (subscriptions) {
      const res = subscriptions.find((x) => x.periodUnit === 'week');
      setTrialSubscription(res ?? subscriptions[0]);
    }
  }, []);

  const { formatPrice, formatPeriod } = useLocale();

  const subscribeSign = useMemo(() => {
    if (trialSubscription?.trial) {
      const trialPeriod = formatPeriod(
        trialSubscription.trial.periodUnit,
        trialSubscription.trial.numberOfPeriods
      );

      const subscriptionPeriod = formatPeriod(
        trialSubscription.periodUnit,
        trialSubscription.numberOfPeriods
      );

      return t('enjoy', {
        trialPeriod: trialPeriod,
        price:
          trialSubscription.currency === 'USD'
            ? '$' + Math.round(trialSubscription.price * 100) / 100
            : `${formatPrice(trialSubscription.price, trialSubscription.currency)}`,
        subscriptionPeriod: subscriptionPeriod,
      });
    }

    if (trialSubscription) {
      return `${formatPrice(trialSubscription.price, trialSubscription.currency)}/${formatPeriod(trialSubscription.periodUnit, trialSubscription.numberOfPeriods)}`;
    }
    return '';
  }, [formatPeriod, formatPrice, trialSubscription]);

  const [isPurchasing, setIsPurchasing] = useState(false);

  const handleSubscribe = useCallback(async () => {
    setIsPurchasing(true);

    await logEvent(`af_start_purchase*${trialSubscription?.trial}_paywall_v_a`);
    if (hasPremium) {
      return;
    }
    if (trialSubscription) {
      try {
        const purchase = await purchaseProduct(trialSubscription.id);
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
  }, [hasPremium, trialSubscription, purchaseProduct, hidePaywall, logEvent]);

  const animatedStorage = useRef(new Animated.Value(90));
  const [currentStorage, setCurrentStorage] = useState(0);

  useEffect(() => {
    Animated.timing(animatedStorage.current, {
      toValue: 25,
      duration: 3000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, []);

  useEffect(() => {
    const listener = animatedStorage.current.addListener(({ value }) => {
      setCurrentStorage(Math.round(value));
    });
    return () => animatedStorage.current.removeListener(listener);
  }, [animatedStorage]);

  return (
    <Page>
      <Container>
        <PageBackground />
        <View className="flex-row items-center justify-between px-2 mb-4">
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
          <View className="gap-y-8">
            <AnimatedArea />
            <View className="items-center rounded-full border-2 border-blue bg-white/10 gap-y-1.5 p-3">
              <UiText className="text-xs text-gray">
                {langs[selectedLang].pages.paywall.paywall_d.system_is_loaded}
              </UiText>
              <UiText
                className={twMerge(
                  'text-xl font-medium',
                  currentStorage > 75
                    ? 'text-[#E53C3C]'
                    : currentStorage > 50
                      ? 'text-[#F7BE63]'
                      : 'text-[#30D079]'
                )}
              >
                {currentStorage} GB
              </UiText>
            </View>
            <View className="flex-row flex-wrap justify-center gap-2">
              {[
                langs[selectedLang].pages.paywall.paywall_d.smart_cleaner,
                langs[selectedLang].pages.paywall.paywall_d.clean_contacts,
                langs[selectedLang].pages.paywall.paywall_d.private_locker,
                langs[selectedLang].pages.paywall.paywall_d.instant_space_boost,
              ].map((item) => (
                <View
                  key={item}
                  className="flex-row items-center rounded-full border border-blue bg-white/10 gap-x-2.5 px-2 py-1"
                >
                  <SfSymbol
                    name="checkmark"
                    tintColor={colors.blue.toString()}
                    size={scaleX(20)}
                    weight="bold"
                  />
                  <UiText className="text-sm font-medium text-gray">
                    {item}
                  </UiText>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

        <PaywallFooter>
          <View className="justify-center">
            <View
              className={
                trialSubscription?.trial
                  ? 'gap-y-1 mb-3'
                  : 'flex-row justify-center gap-x-1 mb-3'
              }
            >
              <UiText className="text-center text-xs text-gray">
                {subscribeSign}
              </UiText>

              <UiText className="text-center text-xs text-gray">
                {langs[selectedLang].pages.paywall.cancel_anytime}
              </UiText>
            </View>

            {isPurchasing ? (
              <ActivityIndicator
                size="large"
                color={colors.primary.toString()}
              />
            ) : (
              <PulseBtnAlt
                color="#f77339"
                disabled={isRestoring}
                handler={handleSubscribe}
                label={
                  trialSubscription?.trial
                    ? langs[selectedLang].buttons.start_trial
                    : langs[selectedLang].buttons.continue
                }
              />
            )}

            <View className="flex-row items-center justify-center gap-x-1 -mb-1 mt-1">
              <AppleIcon />
              <UiText className="text-sm text-gray">
                {langs[selectedLang].pages.paywall.secured_with_apple}
              </UiText>
            </View>
          </View>
        </PaywallFooter>
      </Container>
    </Page>
  );
}
