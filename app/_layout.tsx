import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { WatchlistProvider } from '@/context/WatchlistContext';
import { ProfileProvider } from '@/context/ProfileContext';

export default function _layout() {
  return (
    <ProfileProvider>
      <WatchlistProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(screens)" options={{ headerShown: false }} />
        </Stack>
      </WatchlistProvider>
    </ProfileProvider>
  )
}