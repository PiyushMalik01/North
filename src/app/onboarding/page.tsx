import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard';

export const metadata = {
  title: 'Welcome to North',
  description: 'Set up your learning profile',
};

export default function OnboardingPage() {
  return <OnboardingWizard />;
}
