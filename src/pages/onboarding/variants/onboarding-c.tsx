import { OnboardingLayout, OnboardingSlide } from '../onboarding-layout';
import { OnboardingC1 } from './onboarding-c-1';
import { OnboardingC2 } from './onboarding-c-2';
import { OnboardingC3 } from './onboarding-c-3';

export function OnboardingC({ hideSlide }: { hideSlide?: boolean }) {
  const allSlides: OnboardingSlide[] = [
    ['0', OnboardingC1, ''],
    ['1', OnboardingC2, ''],
    ['2', OnboardingC3, ''],
  ];

  const slides = hideSlide
    ? allSlides.filter(([key]) => key !== '2')
    : allSlides;

  return <OnboardingLayout slides={slides} />;
}
