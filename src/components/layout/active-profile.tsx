'use client';

import { ReactNode, createContext, useContext, useState } from 'react';

import { DEFAULT_PROFILE, isProfileId, type ProfileId } from '@/config/profiles';

const COOKIE_NAME = 'active_profile';

function setProfileCookie(profile: ProfileId) {
  if (typeof window === 'undefined') return;

  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(profile)}; path=/; max-age=31536000; SameSite=Lax; ${window.location.protocol === 'https:' ? 'Secure;' : ''}`;
}

type ActiveProfileContextType = {
  activeProfile: ProfileId;
  setActiveProfile: (profile: ProfileId) => void;
};

const ActiveProfileContext = createContext<ActiveProfileContextType | undefined>(undefined);

/**
 * Provider do perfil ativo do protótipo ("Ver como").
 * Espelha o ActiveThemeProvider — persiste a escolha num cookie `active_profile`.
 */
export function ActiveProfileProvider({
  children,
  initialProfile
}: {
  children: ReactNode;
  initialProfile?: string;
}) {
  const [activeProfile, setActiveProfileState] = useState<ProfileId>(
    isProfileId(initialProfile) ? initialProfile : DEFAULT_PROFILE
  );

  const setActiveProfile = (profile: ProfileId) => {
    setActiveProfileState(profile);
    setProfileCookie(profile);
  };

  return (
    <ActiveProfileContext.Provider value={{ activeProfile, setActiveProfile }}>
      {children}
    </ActiveProfileContext.Provider>
  );
}

export function useActiveProfile() {
  const context = useContext(ActiveProfileContext);
  if (context === undefined) {
    throw new Error('useActiveProfile must be used within an ActiveProfileProvider');
  }
  return context;
}
