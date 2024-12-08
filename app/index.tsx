import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

export default function Index() {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return null; // or a loading spinner
  }

  return (
    <Redirect href={isLoggedIn ? '/(tabs)' : '/(screens)/intro'} />
  );
} 