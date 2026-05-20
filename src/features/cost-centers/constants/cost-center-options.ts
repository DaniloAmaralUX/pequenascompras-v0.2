import { SESI_UNIDADES } from '@/constants/mock-api-cost-centers';

/** Opções de unidade do SESI — usadas em formulários e filtros de tabela. */
export const unidadeOptions = SESI_UNIDADES.map((u) => ({ value: u, label: u }));
