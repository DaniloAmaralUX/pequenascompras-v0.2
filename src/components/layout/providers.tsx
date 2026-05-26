'use client';

import React from 'react';
import { ActiveThemeProvider } from '../themes/active-theme';
import { ActiveProfileProvider } from './active-profile';
import QueryProvider from './query-provider';

export default function Providers({
  activeThemeValue,
  activeProfileValue,
  children
}: {
  activeThemeValue: string;
  activeProfileValue?: string;
  children: React.ReactNode;
}) {
  return (
    <ActiveThemeProvider initialTheme={activeThemeValue}>
      <ActiveProfileProvider initialProfile={activeProfileValue}>
        <QueryProvider>{children}</QueryProvider>
      </ActiveProfileProvider>
    </ActiveThemeProvider>
  );
}
