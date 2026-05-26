import { Icons } from '@/components/icons';

/**
 * Perfis de usuário do sistema de Pequenas Compras.
 * Os ids correspondem aos valores de USER_ROLES (src/constants/mock-api-users.ts).
 *
 * Usados pelo seletor "Ver como" no header — uma ferramenta de protótipo para
 * visualizar a aplicação como cada perfil veria (RBAC client-side de demonstração).
 */
export const PROFILES = [
  {
    id: 'Solicitante',
    label: 'Solicitante',
    icon: 'request',
    description: 'Abre solicitações e acompanha o andamento'
  },
  {
    id: 'Gestor',
    label: 'Gestor',
    icon: 'checks',
    description: 'Revisa e decide sobre solicitações pendentes'
  },
  {
    id: 'Analista de Suprimentos',
    label: 'Analista de Suprimentos',
    icon: 'receipt',
    description: 'Executa compras e mantém catálogo e fornecedores'
  }
] as const satisfies readonly {
  id: string;
  label: string;
  icon: keyof typeof Icons;
  description: string;
}[];

export type ProfileId = (typeof PROFILES)[number]['id'];

export const DEFAULT_PROFILE: ProfileId = 'Analista de Suprimentos';

/** Type guard para validar um valor lido de cookie. */
export function isProfileId(value: string | undefined | null): value is ProfileId {
  return !!value && PROFILES.some((profile) => profile.id === value);
}
