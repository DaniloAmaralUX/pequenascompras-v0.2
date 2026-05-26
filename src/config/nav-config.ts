import { NavGroup } from '@/types';

/**
 * Configuração de navegação — Sistema de Gestão de Pequenas Compras (SESI)
 *
 * Usada tanto pela sidebar quanto pela barra Cmd+K.
 * Os itens são organizados em grupos, cada um com um SidebarGroupLabel.
 *
 * RBAC: cada item pode ter uma propriedade `access` controlando a visibilidade
 * por papel/permissão/organização. Exemplos:
 *   access: { role: 'admin' }
 *   access: { requireOrg: true }
 *
 * O menu contém apenas destinos (seções). Ações como "Nova Solicitação"
 * ficam como botões no cabeçalho da página correspondente, não aqui.
 */
export const navGroups: NavGroup[] = [
  {
    label: 'Compras',
    items: [
      {
        title: 'Dashboard',
        url: '/dashboard/overview',
        icon: 'dashboard',
        isActive: false,
        shortcut: ['d', 'd'],
        access: { profiles: ['Gestor', 'Analista de Suprimentos'] },
        items: []
      },
      {
        title: 'Solicitações',
        url: '/dashboard/requests',
        icon: 'request',
        shortcut: ['s', 's'],
        isActive: false,
        items: []
      },
      {
        title: 'Aprovações',
        url: '/dashboard/approvals',
        icon: 'checks',
        shortcut: ['a', 'a'],
        isActive: false,
        access: { profiles: ['Gestor'] },
        items: []
      },
      {
        title: 'Execução',
        url: '/dashboard/execution',
        icon: 'receipt',
        shortcut: ['e', 'e'],
        isActive: false,
        access: { profiles: ['Analista de Suprimentos'] },
        items: []
      }
    ]
  },
  {
    label: 'Relatórios',
    items: [
      {
        title: 'Itens Recorrentes',
        url: '/dashboard/reports/items',
        icon: 'report',
        shortcut: ['r', 'i'],
        isActive: false,
        access: { profiles: ['Analista de Suprimentos'] },
        items: []
      },
      {
        title: 'Gasto por Setor',
        url: '/dashboard/reports/spend',
        icon: 'costCenter',
        shortcut: ['r', 'g'],
        isActive: false,
        access: { profiles: ['Analista de Suprimentos'] },
        items: []
      },
      {
        title: 'Preços & Alertas',
        url: '/dashboard/reports/prices',
        icon: 'trendingUp',
        shortcut: ['r', 'p'],
        isActive: false,
        access: { profiles: ['Analista de Suprimentos'] },
        items: []
      }
    ]
  },
  {
    label: 'Cadastros',
    items: [
      {
        title: 'Fornecedores',
        url: '/dashboard/suppliers',
        icon: 'supplier',
        shortcut: ['f', 'f'],
        isActive: false,
        access: { profiles: ['Analista de Suprimentos'] },
        items: []
      },
      {
        title: 'Catálogo de Itens',
        url: '/dashboard/catalog',
        icon: 'catalog',
        shortcut: ['c', 'c'],
        isActive: false,
        access: { profiles: ['Analista de Suprimentos'] },
        items: []
      },
      {
        title: 'Centros de Custo',
        url: '/dashboard/cost-centers',
        icon: 'costCenter',
        shortcut: ['x', 'x'],
        isActive: false,
        access: { profiles: ['Analista de Suprimentos'] },
        items: []
      },
      {
        title: 'Usuários',
        url: '/dashboard/users',
        icon: 'teams',
        shortcut: ['u', 'u'],
        isActive: false,
        access: { profiles: ['Analista de Suprimentos'] },
        items: []
      }
    ]
  },
  {
    label: 'Conta',
    items: [
      {
        title: 'Perfil',
        url: '/dashboard/profile',
        icon: 'profile',
        shortcut: ['m', 'm'],
        isActive: false,
        items: []
      },
      {
        title: 'Notificações',
        url: '/dashboard/notifications',
        icon: 'notification',
        shortcut: ['n', 'n'],
        isActive: false,
        items: []
      }
    ]
  }
];
