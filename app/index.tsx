import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingScreen from '@/components/LoadingScreen';

export default function Index() {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    checkInitialRoute();
  }, []);

  const checkInitialRoute = async () => {
    try {
      const hasOnboarded = await AsyncStorage.getItem('hasOnboarded');
      setInitialRoute(hasOnboarded ? '(tabs)' : 'onboarding');
    } catch (error) {
      setInitialRoute('onboarding');
    }
  };

  if (!initialRoute) {
    return <LoadingScreen />;
  }

  return <Redirect href={initialRoute} />;
} 