import { useEffect, useState } from 'react';
import { View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import Splash from '@/components/Splash';

// Keep splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  const [fontsLoaded] = useFonts({
    // Add your custom fonts here if needed
  });

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make API calls, etc.
        await new Promise(resolve => setTimeout(resolve, 2000)); // Minimum display time
        
        // Tell the application to render
        setIsReady(true);
      } catch (e) {
        console.warn(e);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (isReady) {
      // Hide splash screen after resources are loaded
      (async () => {
        await SplashScreen.hideAsync();
        // Show our animated splash
        setTimeout(() => {
          setShowSplash(false);
        }, 2500); // Duration of our custom splash animation
      })();
    }
  }, [isReady]);

  if (!isReady || !fontsLoaded) {
    return null;
  }

  if (showSplash) {
    return <Splash />;
  }

  return (
    <View style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen 
          name="(screens)/onboarding" 
          options={{ 
            headerShown: false,
            presentation: 'fullScreenModal'
          }} 
        />
        <Stack.Screen 
          name="(tabs)" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="(screens)" 
          options={{ headerShown: false }} 
        />
      </Stack>
    </View>
  );
} 