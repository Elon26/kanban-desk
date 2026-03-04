import { OnboardingLayout, OnboardingSlide } from '../onboarding-layout';
import { OnboardingA1 } from './onboarding-a-1';
import { OnboardingA2 } from './onboarding-a-2';

export function OnboardingA({ hideSlide }: { hideSlide?: boolean }) {
  const allSlides: OnboardingSlide[] = [
    ['0', OnboardingA1, ''],
    ['1', OnboardingA2, ''],
  ];

  const slides = hideSlide
    ? allSlides.filter(([key]) => key !== '1')
    : allSlides;

  return <OnboardingLayout slides={slides} />;
}
