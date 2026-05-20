import { USER_ROLES, USER_STATUSES } from '@/constants/mock-api-users';
import { SESI_UNIDADES } from '@/constants/mock-api-cost-centers';

/** Papéis do sistema de compras — usados em formulários e filtros. */
export const ROLE_OPTIONS = USER_ROLES.map((r) => ({ value: r, label: r }));

/** Situações do usuário. */
export const STATUS_OPTIONS = USER_STATUSES.map((s) => ({ value: s, label: s }));

/** Unidades do SESI. */
export const UNIDADE_OPTIONS = SESI_UNIDADES.map((u) => ({ value: u, label: u }));
