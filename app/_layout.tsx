import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WatchlistProvider } from '@/context/WatchlistContext';
import { ProfileProvider } from '@/context/ProfileContext';
import { CourseProvider } from '@/context/CourseContext';
import { ExpenseProvider } from '@/context/ExpenseContext';
import * as SplashScreen from 'expo-splash-screen';
import LoadingScreen from '@/components/LoadingScreen';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Load any resources or data here
      const hasOnboarded = await AsyncStorage.getItem('hasOnboarded');
      setInitialRoute(hasOnboarded ? '(tabs)' : 'onboarding');
      
      // Hide splash screen
      await SplashScreen.hideAsync();
      setIsReady(true);
    } catch (error) {
      console.error('Error initializing app:', error);
      setInitialRoute('onboarding');
      setIsReady(true);
      await SplashScreen.hideAsync();
    }
  };

  if (!isReady || !initialRoute) {
    return <LoadingScreen />;
  }

  return (
    <ProfileProvider>
      <WatchlistProvider>
        <CourseProvider>
          <ExpenseProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen 
                name="index"
                redirect={initialRoute === '(tabs)'}
              />
              <Stack.Screen 
                name="onboarding"
                options={{ 
                  gestureEnabled: false,
                  animation: 'fade',
                }} 
              />
              <Stack.Screen 
                name="(tabs)"
                options={{ 
                  gestureEnabled: false,
                  animation: 'fade',
                }} 
              />
              <Stack.Screen 
                name="(screens)"
                options={{
                  animation: 'slide_from_right',
                }} 
              />
            </Stack>
          </ExpenseProvider>
        </CourseProvider>
      </WatchlistProvider>
    </ProfileProvider>
  );
}