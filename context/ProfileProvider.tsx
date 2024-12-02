import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  avatar: string;
}

type ProfileContextType = {
  profile: ProfileData;
  updateProfile: (data: Partial<ProfileData>) => Promise<void>;
  loadProfile: () => Promise<void>;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<ProfileData>({
    name: "",
    email: "",
    phone: "",
    avatar: "https://i.pravatar.cc/150?img=56"
  });

  const router = useRouter();

  const loadProfile = async () => {
    try {
      const storedProfile = await AsyncStorage.getItem('profileData');
      if (storedProfile) {
        setProfile(JSON.parse(storedProfile));
      } else {
        router.replace('/(auth)/login');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const updateProfile = async (data: Partial<ProfileData>) => {
    try {
      const newProfile = { ...profile, ...data };
      await AsyncStorage.setItem('profileData', JSON.stringify(newProfile));
      setProfile(newProfile);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, updateProfile, loadProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}

export { useProfile };
export type { ProfileData }; 