import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { WatchlistProvider } from '@/context/WatchlistContext';
import { ProfileProvider } from '@/context/ProfileContext';
import { CourseProvider } from '@/context/CourseContext';

export default function RootLayout() {
  return (
    <ProfileProvider>
      <WatchlistProvider>
        <CourseProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(screens)" options={{ headerShown: false }} />
          </Stack>
        </CourseProvider>
      </WatchlistProvider>
    </ProfileProvider>
  )
}