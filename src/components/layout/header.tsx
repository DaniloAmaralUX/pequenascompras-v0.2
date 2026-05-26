import React from 'react';
import { SidebarTrigger } from '../ui/sidebar';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { Breadcrumbs } from '../breadcrumbs';
import { ProfileSwitcher } from './profile-switcher';
import { ThemeModeToggle } from '../themes/theme-mode-toggle';
import { NotificationCenter } from '@/features/notifications/components/notification-center';

export default function Header() {
  return (
    <header className='bg-background/60 sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between gap-2 backdrop-blur-md md:h-14'>
      <div className='flex items-center gap-2 px-4'>
        <SidebarTrigger className='-ml-1' />
        <Separator orientation='vertical' className='mr-2 h-4' />
        <Breadcrumbs />
        <Badge variant='outline' className='ml-2 hidden text-[10px] font-normal sm:inline-flex'>
          Protótipo
        </Badge>
      </div>

      <div className='flex items-center gap-2 px-4'>
        <ProfileSwitcher />
        <ThemeModeToggle />
        <NotificationCenter />
      </div>
    </header>
  );
}
