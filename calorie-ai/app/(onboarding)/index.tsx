import { Stack } from 'expo-router';
import OnboardingScreen from '../../app/onboarding';

export default function OnboardingLayout() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <OnboardingScreen />
    </>
  );
}
