import React, { createContext, useContext, useState } from 'react';

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  avatar: string;
}

type ProfileContextType = {
  profile: ProfileData;
  updateProfile: (data: Partial<ProfileData>) => void;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<ProfileData>({
    name: "Shameer",
    email: "shameer@sharevest.com",
    phone: "+91 9876543210",
    avatar: "https://i.pravatar.cc/150?img=56"
  });

  const updateProfile = (data: Partial<ProfileData>) => {
    setProfile(prev => ({ ...prev, ...data }));
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile }}>
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