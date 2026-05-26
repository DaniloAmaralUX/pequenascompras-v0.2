'use client';

import { Icons } from '@/components/icons';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { NotificationCard } from '@/components/ui/notification-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouter } from 'next/navigation';
import { useProfileNotifications } from '../utils/store';

const actionRoutes: Record<string, string> = {
  'view-request': '/dashboard/requests',
  'view-approvals': '/dashboard/approvals',
  'view-execution': '/dashboard/execution',
  'view-suppliers': '/dashboard/suppliers',
  'view-reports': '/dashboard/reports/items',
  'view-dashboard': '/dashboard/overview'
};

export default function NotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useProfileNotifications();
  const router = useRouter();

  const unreadNotifications = notifications.filter((n) => n.status === 'unread');
  const readNotifications = notifications.filter((n) => n.status === 'read');

  const renderList = (items: typeof notifications) => {
    if (items.length === 0) {
      return (
        <div className='flex flex-col items-center justify-center py-16'>
          <Icons.notification className='text-muted-foreground/40 mb-3 size-10' aria-hidden='true' />
          <p className='text-muted-foreground text-sm'>Nenhuma notificação</p>
        </div>
      );
    }

    return (
      <div className='flex flex-col gap-2'>
        {items.map((notification) => (
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
    );
  };

  return (
    <PageContainer
      pageTitle='Notificações'
      pageDescription='Veja e gerencie todas as notificações do seu perfil.'
      pageHeaderAction={
        unreadCount > 0 ? (
          <Button variant='outline' size='sm' onClick={markAllAsRead}>
            Marcar todas como lidas
          </Button>
        ) : undefined
      }
    >
      <Tabs defaultValue='all'>
        <TabsList>
          <TabsTrigger value='all'>
            Todas <span className='tabular-nums'>({notifications.length})</span>
          </TabsTrigger>
          <TabsTrigger value='unread'>
            Não lidas <span className='tabular-nums'>({unreadNotifications.length})</span>
          </TabsTrigger>
          <TabsTrigger value='read'>
            Lidas <span className='tabular-nums'>({readNotifications.length})</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value='all' className='mt-4'>
          {renderList(notifications)}
        </TabsContent>
        <TabsContent value='unread' className='mt-4'>
          {renderList(unreadNotifications)}
        </TabsContent>
        <TabsContent value='read' className='mt-4'>
          {renderList(readNotifications)}
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}
