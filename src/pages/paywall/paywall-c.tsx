import {
  type IAPSubscription,
  useAnalytics,
  useLocale,
  usePurchases,
} from '@kirz/expo-toolkit';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
import { Btn } from '@/ui/button';
import { Pressable } from '@/ui/pressable';
import { UiText } from '@/ui/ui-text';

import { TrialDescription } from './components/trial-description';
import { TariffDiagram } from './components/trial-diagram';
import { useConfig } from './hooks/use-config';
import { usePaywall } from './hooks/use-paywall';
import { PaywallFooter } from './paywall-fooler';

export function PaywallC() {
  const setIsReadyToShowNotification = useSetStorage(
    'isReadyToShowNotification'
  );
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
  const { logEvent } = useAnalytics();
  const [trialSubscription, setTrialSubscription] = useState<
    IAPSubscription | undefined
  >(undefined);

  const subscriptions = sub?.filter(
    (sub) =>
      sub.periodUnit !== 'week' ||
      (sub.periodUnit === 'week' && sub.id === 'shoestore.todobooster.sub.week')
  );

  const { annoyingPaywallC: annoyingPaywall } = useConfig();
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

      const subscriptionPrice = formatPrice(
        trialSubscription.price,
        trialSubscription.currency
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
          <View className="flex-row pt-4">
            <UiText className="text-center">
              <UiText className="text-2xl">
                {langs[selectedLang].pages.paywall.optimize_tasks}
              </UiText>
              <UiText className="text-2xl font-bold">
                {' '}
                {langs[selectedLang].pages.paywall.fast_and_safe}{' '}
              </UiText>
            </UiText>
          </View>

          <TariffDiagram />

          <TrialDescription />
        </ScrollView>

        <PaywallFooter>
          <View className="justify-center">
            <View
              className={
                trialSubscription?.trial
                  ? ''
                  : 'flex-row justify-center gap-x-1'
              }
            >
              <UiText className="text-center text-xs text-gray">
                {langs[selectedLang].pages.paywall.no_upfront_payment}
              </UiText>

              <UiText className="text-center text-xs text-gray">
                {subscribeSign}
              </UiText>
            </View>

            <UiText className="text-center text-xs text-gray my-3">
              {langs[selectedLang].pages.paywall.cancel_anytime}
            </UiText>

            {isPurchasing ? (
              <ActivityIndicator
                size="large"
                color={colors.primary.toString()}
              />
            ) : (
              <Btn
                size="big"
                disabled={isRestoring}
                handler={handleSubscribe}
                label={
                  trialSubscription?.trial
                    ? langs[selectedLang].buttons.start_trial
                    : langs[selectedLang].buttons.continue
                }
              />
            )}
          </View>
        </PaywallFooter>
      </Container>
    </Page>
  );
}
