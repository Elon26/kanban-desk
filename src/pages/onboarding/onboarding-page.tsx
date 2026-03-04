import { useConfig } from '@/hooks/use-config';
import { useSetStorage } from '@/hooks/use-storage';

import { OnboardingA } from './variants/onboarding-a';
import { OnboardingB } from './variants/onboarding-b';
import { OnboardingC } from './variants/onboarding-c';
import { OnboardingD } from './variants/onboarding-d';

const Onboardings = {
  a: OnboardingA,
  b: OnboardingB,
  c: OnboardingC,
  d: OnboardingD,
};

export function OnboardingPage() {
  const setIsOnboardingDAnimationStarts = useSetStorage(
    'isOnboardingDAnimationStarts'
  );
  const { onboarding_id } = useConfig();
  const Onboarding = Onboardings[onboarding_id] ?? OnboardingA;
  setIsOnboardingDAnimationStarts(false);

  return <Onboarding />;
}
