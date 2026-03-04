import {
  type PeriodUnit,
  useAnalytics,
  usePurchases,
} from '@kirz/expo-toolkit';
import { router } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import PagerView from 'react-native-pager-view';
import { useSharedValue } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Container } from '@/components/container';
import { Page } from '@/components/page';
import { PageBackground } from '@/components/page-background';
import { useConfig } from '@/hooks/use-config';
import { useSetStorage, useStorageValue } from '@/hooks/use-storage';
import langs from '@/i18n/langs.json';
import { usePaywall } from '@/pages/paywall/hooks/use-paywall';
import { UiButton } from '@/ui/ui-button';
import { UiText } from '@/ui/ui-text';

import { AnimatedDot } from './animated-dot';

type TrialDTO = {
  periodUnit: PeriodUnit;
  numberOfPeriods: number;
  daysInTrial: number;
};

export type OnboardingSlide = [
  string,
  React.ComponentType<{ trial?: TrialDTO }>,
  string,
  TrialDTO?,
];

type OnboardingLayoutProps = {
  slides: OnboardingSlide[];
};

export function OnboardingLayout({ slides }: OnboardingLayoutProps) {
  const selectedLang = useStorageValue('selectedLang');
  const hasDeveloperPremium = useStorageValue('hasDeveloperPremium');
  const { hasPremium: hasBusinessPremium } = usePurchases();
  const hasPremium = hasDeveloperPremium || hasBusinessPremium;

  const pagerRef = useRef<PagerView>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const { logEvent } = useAnalytics();
  const setIsOnboardingFinished = useSetStorage('isOnboardingFinished');
  const setIsOnboardingDAnimationStarts = useSetStorage(
    'isOnboardingDAnimationStarts'
  );
  const { onboarding_paywall_id, onboarding_id } = useConfig();
  const { showPaywall } = usePaywall();
  const animatedValue = useSharedValue(0);

  useEffect(() => {
    logEvent(`af_show_paywall_v_${onboarding_paywall_id}`);
  }, [onboarding_paywall_id, logEvent]);

  const handleNext = useCallback(() => {
    if (!pagerRef.current) return;

    if (onboarding_id === 'd' && currentPage === 0) {
      setIsOnboardingDAnimationStarts(true);
    }

    if (currentPage < slides.length - 1) {
      pagerRef.current.setPage(currentPage + 1);
      logEvent(`af_onboarding_v_${onboarding_id}_${currentPage + 1}`);
      setCurrentPage((prev) => prev + 1);
    } else {
      setIsOnboardingFinished(true);
      logEvent(`af_onboarding_v_${onboarding_id}_finished`);
      router.replace('/main');
      if (!hasPremium) showPaywall(onboarding_paywall_id);
    }
  }, [
    currentPage,
    slides.length,
    hasPremium,
    setIsOnboardingFinished,
    showPaywall,
    onboarding_paywall_id,
    logEvent,
    onboarding_id,
  ]);

  return (
    <Page>
      <PageBackground withLines />
      <Container>
        <View className="flex-1 -mx-4">
          <PagerView
            style={{ flex: 1 }}
            initialPage={0}
            ref={pagerRef}
            onPageScroll={({ nativeEvent: { position, offset } }) => {
              animatedValue.value = position + offset;
            }}
            onPageSelected={({ nativeEvent: { position } }) => {
              setCurrentPage(position);
            }}
          >
            {slides.map(([key, Slide, title, trial]) => (
              <View
                key={key}
                className="flex-1 items-center justify-center overflow-hidden"
              >
                <Slide trial={trial} />
                <UiText className="text-center text-xl font-bold mb-2">
                  {title}
                </UiText>
              </View>
            ))}
          </PagerView>
          <View className="absolute left-0 right-0 bottom-8">
            <SafeAreaView className="items-center gap-5">
              <View className="flex-row items-center">
                {slides.map(([index], i) => (
                  <AnimatedDot
                    key={index}
                    index={i}
                    animatedValue={animatedValue}
                  />
                ))}
              </View>
              <UiButton onPress={handleNext}>
                {langs[selectedLang].buttons.continue}
              </UiButton>
            </SafeAreaView>
          </View>
        </View>
      </Container>
    </Page>
  );
}
