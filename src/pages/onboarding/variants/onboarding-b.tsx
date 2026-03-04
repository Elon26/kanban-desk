import { OnboardingLayout, OnboardingSlide } from '../onboarding-layout';
import { OnboardingB1 } from './onboarding-b-1';
import { OnboardingB2 } from './onboarding-b-2';
import { OnboardingB3 } from './onboarding-b-3';

export function OnboardingB({ hideSlide }: { hideSlide?: boolean }) {
  const allSlides: OnboardingSlide[] = [
    ['0', OnboardingB1, ''],
    ['1', OnboardingB2, ''],
    ['2', OnboardingB3, ''],
  ];

  const slides = hideSlide
    ? allSlides.filter(([key]) => key !== '2')
    : allSlides;

  return <OnboardingLayout slides={slides} />;
}
