'use client';

import { Icons } from '@/components/icons';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { NotificationCard } from '@/components/ui/notification-card';
import { useProfileNotifications } from '../utils/store';
import { useRouter } from 'next/navigation';

const MAX_VISIBLE = 6;

/** Rotas de destino por action id — todas dentro do escopo de cada perfil. */
const actionRoutes: Record<string, string> = {
  'view-request': '/dashboard/requests',
  'view-approvals': '/dashboard/approvals',
  'view-execution': '/dashboard/execution',
  'view-suppliers': '/dashboard/suppliers',
  'view-reports': '/dashboard/reports/items',
  'view-dashboard': '/dashboard/overview'
};

export function NotificationCenter() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useProfileNotifications();
  const router = useRouter();
  const visibleNotifications = notifications.slice(0, MAX_VISIBLE);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          className='relative size-8'
          aria-label={`Notificações${unreadCount > 0 ? ` (${unreadCount} não lidas)` : ''}`}
        >
          <Icons.notification className='size-4' />
          {unreadCount > 0 && (
            <span className='bg-destructive text-destructive-foreground absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-medium tabular-nums'>
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align='end'
        className='w-[calc(100vw-2rem)] p-0 sm:w-[380px]'
        sideOffset={8}
      >
        <div className='flex items-center justify-between px-4 py-3'>
          <Link href='/dashboard/notifications' className='group flex items-center gap-1'>
            <h4 className='text-sm font-semibold group-hover:underline'>Notificações</h4>
            <Icons.chevronRight className='text-muted-foreground size-3.5 transition-transform duration-150 group-hover:translate-x-0.5' />
          </Link>
          <div className='flex items-center gap-2'>
            {unreadCount > 0 && (
              <span className='bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs tabular-nums'>
                {unreadCount} {unreadCount === 1 ? 'nova' : 'novas'}
              </span>
            )}
            {unreadCount > 0 && (
              <Button
                variant='ghost'
                size='sm'
                className='text-muted-foreground h-auto px-2 py-1 text-xs'
                onClick={markAllAsRead}
              >
                Marcar todas como lidas
              </Button>
            )}
          </div>
        </div>
        <Separator />
        <ScrollArea className='h-[400px]'>
          {notifications.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-12'>
              <Icons.notification className='text-muted-foreground/40 mb-2 size-8' aria-hidden='true' />
              <p className='text-muted-foreground text-sm'>Nenhuma notificação ainda</p>
            </div>
          ) : (
            <div className='flex flex-col gap-1 p-2'>
              {visibleNotifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  id={notification.id}
                  title={notification.title}
                  body={notification.body}
                  status={notification.status}
                  createdAt={notification.createdAt}
                  actions={notification.actions}
                  onMarkAsRead={markAsRead}
                  onAction={(notifId, actionId) => {
                    const route = actionRoutes[actionId] ?? '/dashboard/requests';
                    markAsRead(notifId);
                    router.push(route);
                  }}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
