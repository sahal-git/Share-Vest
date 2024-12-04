import 'expo-router/entry';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';

export default function App() {
  useEffect(() => {
    // Keep splash screen visible
    SplashScreen.preventAutoHideAsync();
  }, []);

  return null;
} 