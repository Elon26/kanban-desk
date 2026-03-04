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

import { FeaturesArea } from './components/features-area';
import { TariffCheckboxes } from './components/tariff-checkboxes';
import { useConfig } from './hooks/use-config';
import { usePaywall } from './hooks/use-paywall';
import { PaywallFooter } from './paywall-fooler';

export function PaywallA() {
  const { t } = useTranslation('myNamespace');
  const setIsReadyToShowNotification = useSetStorage(
    'isReadyToShowNotification'
  );
  const selectedLang = useStorageValue('selectedLang');
  const [isRestoring, setIsRestoring] = useState(false);
  const { hidePaywall } = usePaywall();
  const { logEvent } = useAnalytics();
  const [cheaperSubscription, setCheaperSubscription] =
    useState<IAPSubscription | null>(null);
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

  const [selectedSubscription, setSelectedSubscription] = useState<
    IAPSubscription | undefined
  >(undefined);

  const { annoyingPaywallA: annoyingPaywall } = useConfig();
  const [readyToShow, setReadyToShow] = useState(false);
  setTimeout(() => {
    setReadyToShow(true);
  }, 4000);
  const [closeAttempt, setCloseAttempt] = useState(0);

  useEffect(() => {
    if (subscriptions) {
      const res = subscriptions.find((x) => x.periodUnit === 'week');
      setSelectedSubscription(res ?? subscriptions[0]);
      setCheaperSubscription(
        subscriptions.sort((a, b) => a.price - b.price)[0]
      );
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

      return t('trial', {
        trialPeriod: trialPeriod,
        price: subscriptionPrice,
        subscriptionPeriod: subscriptionPeriod,
      });
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
    selectedLang,
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
                {langs[selectedLang].pages.paywall.optimize_tasks_moderation}
              </UiText>
            </UiText>
          </View>

          <TariffCheckboxes
            cheaperSubscription={cheaperSubscription}
            selectedSubscription={selectedSubscription}
            subscriptions={subscriptions}
            setSelectedSubscription={setSelectedSubscription}
          />

          <FeaturesArea />
        </ScrollView>

        <PaywallFooter>
          <UiText className="text-center text-xs text-gray">
            {langs[selectedLang].pages.paywall.cancel_anytime}
          </UiText>
          <View className="justify-center">
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
                  selectedSubscription?.trial
                    ? subscribeButtonLabel
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
