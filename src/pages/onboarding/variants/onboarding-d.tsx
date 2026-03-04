import { OnboardingLayout, OnboardingSlide } from '../onboarding-layout';
import { OnboardingD1 } from './onboarding-d-1';
import { OnboardingD2 } from './onboarding-d-2';

export function OnboardingD({ hideSlide }: { hideSlide?: boolean }) {
  const allSlides: OnboardingSlide[] = [
    ['0', OnboardingD1, ''],
    ['1', OnboardingD2, ''],
  ];

  const slides = hideSlide
    ? allSlides.filter(([key]) => key !== '1')
    : allSlides;

  return <OnboardingLayout slides={slides} />;
}
