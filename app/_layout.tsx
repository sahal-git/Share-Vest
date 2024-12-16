import React from 'react';
import { Stack } from 'expo-router';
import { WatchlistProvider } from '@/context/WatchlistContext';
import { ProfileProvider } from '@/context/ProfileContext';
import { CourseProvider } from '@/context/CourseContext';
import { AuthProvider } from '@/context/AuthContext';
import { StockProvider } from '@/context/StockContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <ProfileProvider>
        <WatchlistProvider>
          <CourseProvider>
            <StockProvider>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen 
                  name="index"
                  options={{ headerShown: false }}
                />
              </Stack>
            </StockProvider>
          </CourseProvider>
        </WatchlistProvider>
      </ProfileProvider>
    </AuthProvider>
  );
}