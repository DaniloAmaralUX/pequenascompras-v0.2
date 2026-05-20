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
 * NOTA (Fase 0): este arquivo contém apenas as rotas já existentes.
 * À medida que as features de Compras forem implementadas (Fases 1-3),
 * os itens correspondentes (Solicitações, Aprovações, Execução, Relatórios,
 * Fornecedores, Catálogo, Centros de Custo) serão adicionados aqui.
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
        items: []
      },
      {
        title: 'Catálogo de Itens',
        url: '/dashboard/product',
        icon: 'catalog',
        shortcut: ['c', 'c'],
        isActive: false,
        items: []
      },
      {
        title: 'Usuários',
        url: '/dashboard/users',
        icon: 'teams',
        shortcut: ['u', 'u'],
        isActive: false,
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
