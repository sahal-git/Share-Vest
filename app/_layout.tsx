import { View } from 'react-native'
import React from 'react'
import { Slot } from 'expo-router'
import { WatchlistProvider } from '@/context/WatchlistContext';
import { ProfileProvider } from '@/context/ProfileProvider';

export default function RootLayout() {
  return (
    <ProfileProvider>
      <WatchlistProvider>
        <Slot />
      </WatchlistProvider>
    </ProfileProvider>
  )
}