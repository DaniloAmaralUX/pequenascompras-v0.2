import { useMemo } from 'react';
import { create } from 'zustand';
import type { NotificationStatus, NotificationAction } from '@/components/ui/notification-card';
import type { ProfileId } from '@/config/profiles';
import { useActiveProfile } from '@/components/layout/active-profile';

export type Notification = {
  id: string;
  title: string;
  body: string;
  status: NotificationStatus;
  createdAt: string;
  /** Perfis que devem receber esta notificação. */
  profiles: ProfileId[];
  actions?: NotificationAction[];
};

type NotificationState = {
  notifications: Notification[];
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  addNotification: (notification: Omit<Notification, 'status'>) => void;
};

const minutesAgo = (m: number) => new Date(Date.now() - m * 60 * 1000).toISOString();
const hoursAgo = (h: number) => new Date(Date.now() - h * 60 * 60 * 1000).toISOString();
const daysAgo = (d: number) => new Date(Date.now() - d * 24 * 60 * 60 * 1000).toISOString();

const mockNotifications: Notification[] = [
  // ============================================================
  // SOLICITANTE — acompanha o status das suas solicitações
  // ============================================================
  {
    id: 'sol-1',
    profiles: ['Solicitante'],
    title: 'Solicitação aprovada',
    body: 'Sua solicitação PC-2026-0010 foi aprovada e seguiu para a execução.',
    status: 'unread',
    createdAt: minutesAgo(6),
    actions: [
      { id: 'view-request', label: 'Ver solicitação', type: 'redirect', style: 'primary' }
    ]
  },
  {
    id: 'sol-2',
    profiles: ['Solicitante'],
    title: 'Solicitação bloqueada pela governança',
    body: 'PC-2026-0008 foi bloqueada — possível fatiamento detectado em 30 dias.',
    status: 'unread',
    createdAt: minutesAgo(31),
    actions: [
      { id: 'view-request', label: 'Ver motivo', type: 'redirect', style: 'danger' }
    ]
  },
  {
    id: 'sol-3',
    profiles: ['Solicitante'],
    title: 'Recebimento confirmado',
    body: 'Os itens da solicitação PC-2026-0001 foram recebidos. Solicitação concluída.',
    status: 'unread',
    createdAt: hoursAgo(2),
    actions: [
      { id: 'view-request', label: 'Ver detalhe', type: 'redirect', style: 'primary' }
    ]
  },
  {
    id: 'sol-4',
    profiles: ['Solicitante'],
    title: 'Solicitação rejeitada',
    body: 'PC-2026-0007 foi rejeitada pelo Gestor — justificativa insuficiente.',
    status: 'read',
    createdAt: daysAgo(1),
    actions: [
      { id: 'view-request', label: 'Refazer solicitação', type: 'redirect', style: 'default' }
    ]
  },
  {
    id: 'sol-5',
    profiles: ['Solicitante'],
    title: 'Você tem rascunhos pendentes',
    body: '2 rascunhos não foram enviados para aprovação há mais de 3 dias.',
    status: 'read',
    createdAt: daysAgo(3),
    actions: [
      { id: 'view-request', label: 'Ver rascunhos', type: 'redirect', style: 'default' }
    ]
  },

  // ============================================================
  // GESTOR — fila de aprovação e alertas de governança
  // ============================================================
  {
    id: 'ges-1',
    profiles: ['Gestor'],
    title: 'Nova solicitação aguardando aprovação',
    body: 'PC-2026-0012 — Unidade Sul · R$ 1.847,00 · Prioridade Alta.',
    status: 'unread',
    createdAt: minutesAgo(6),
    actions: [
      { id: 'view-approvals', label: 'Analisar', type: 'redirect', style: 'primary' }
    ]
  },
  {
    id: 'ges-2',
    profiles: ['Gestor'],
    title: 'Possível fatiamento detectado',
    body: '3 solicitações do CC-1010 nos últimos 14 dias somam R$ 3.450,00 (acima do limite).',
    status: 'unread',
    createdAt: minutesAgo(31),
    actions: [
      { id: 'view-approvals', label: 'Revisar fila', type: 'redirect', style: 'danger' }
    ]
  },
  {
    id: 'ges-3',
    profiles: ['Gestor'],
    title: 'Solicitação urgente parada',
    body: 'PC-2026-0011 (Urgente) aguarda aprovação há mais de 24 horas.',
    status: 'unread',
    createdAt: hoursAgo(2),
    actions: [
      { id: 'view-approvals', label: 'Aprovar agora', type: 'redirect', style: 'primary' }
    ]
  },
  {
    id: 'ges-4',
    profiles: ['Gestor'],
    title: 'Aprovação registrada',
    body: 'Sua decisão em PC-2026-0009 foi aplicada e a solicitação seguiu para o Analista.',
    status: 'read',
    createdAt: daysAgo(1)
  },
  {
    id: 'ges-5',
    profiles: ['Gestor'],
    title: 'Resumo mensal disponível',
    body: 'Gasto de abril/2026 consolidado — R$ 28.940,00 em 19 solicitações.',
    status: 'read',
    createdAt: daysAgo(3),
    actions: [
      { id: 'view-dashboard', label: 'Ver dashboard', type: 'redirect', style: 'default' }
    ]
  },

  // ============================================================
  // ANALISTA — pipeline de execução, fornecedores, oportunidades
  // ============================================================
  {
    id: 'ana-1',
    profiles: ['Analista de Suprimentos'],
    title: 'Nova compra para registrar',
    body: 'PC-2026-0010 foi aprovada e está pronta para registro no ERP.',
    status: 'unread',
    createdAt: minutesAgo(6),
    actions: [
      { id: 'view-execution', label: 'Abrir execução', type: 'redirect', style: 'primary' }
    ]
  },
  {
    id: 'ana-2',
    profiles: ['Analista de Suprimentos'],
    title: 'Pagamento confirmado pelo Financeiro',
    body: 'PC-2026-0006 — R$ 2.290,15 pagos. Aguardando envio do fornecedor.',
    status: 'unread',
    createdAt: minutesAgo(31),
    actions: [
      { id: 'view-execution', label: 'Confirmar envio', type: 'redirect', style: 'primary' }
    ]
  },
  {
    id: 'ana-3',
    profiles: ['Analista de Suprimentos'],
    title: 'Aguardando confirmação de recebimento',
    body: 'PC-2026-0005 está aguardando recebimento há 5 dias — verifique com o solicitante.',
    status: 'unread',
    createdAt: hoursAgo(2),
    actions: [
      { id: 'view-execution', label: 'Acompanhar', type: 'redirect', style: 'default' }
    ]
  },
  {
    id: 'ana-4',
    profiles: ['Analista de Suprimentos'],
    title: 'Fornecedor com inatividade prolongada',
    body: 'Hagenes, Beer and Monahan está sem movimentação há 90 dias. Considere revisar homologação.',
    status: 'read',
    createdAt: daysAgo(1),
    actions: [
      { id: 'view-suppliers', label: 'Ver fornecedor', type: 'redirect', style: 'default' }
    ]
  },
  {
    id: 'ana-5',
    profiles: ['Analista de Suprimentos'],
    title: 'Oportunidade de contrato',
    body: '5 itens recorrentes detectados nos últimos 30 dias — candidatos a compra em atacado.',
    status: 'read',
    createdAt: daysAgo(3),
    actions: [
      { id: 'view-reports', label: 'Ver relatório', type: 'redirect', style: 'primary' }
    ]
  }
];

export const useNotificationStore = create<NotificationState>()((set) => ({
  notifications: mockNotifications,

  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, status: 'read' as const } : n
      )
    })),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({
        ...n,
        status: 'read' as const
      }))
    })),

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id)
    })),

  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        { ...notification, status: 'unread' as const },
        ...state.notifications
      ]
    }))
}));

/**
 * Notificações filtradas pelo perfil ativo + ações de leitura limitadas
 * apenas ao escopo do perfil (não vaza notificações de outros perfis).
 */
export function useProfileNotifications() {
  const { activeProfile } = useActiveProfile();
  const {
    notifications: all,
    markAsRead,
    markAllAsRead: markAllGlobal,
    removeNotification,
    addNotification
  } = useNotificationStore();

  const notifications = useMemo(
    () => all.filter((n) => n.profiles.includes(activeProfile)),
    [all, activeProfile]
  );

  const unreadCount = useMemo(
    () => notifications.filter((n) => n.status === 'unread').length,
    [notifications]
  );

  // markAllAsRead restrito ao perfil ativo
  const markAllAsRead = () => {
    notifications.filter((n) => n.status === 'unread').forEach((n) => markAsRead(n.id));
    void markAllGlobal; // mantém referência, mas não usa para evitar vazamento entre perfis
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    addNotification
  };
}
