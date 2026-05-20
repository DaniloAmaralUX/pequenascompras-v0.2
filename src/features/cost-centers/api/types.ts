export type { CostCenter } from '@/constants/mock-api-cost-centers';

export type CostCenterFilters = {
  page?: number;
  limit?: number;
  unidades?: string;
  search?: string;
  sort?: string;
};

export type CostCentersResponse = {
  success: boolean;
  time: string;
  message: string;
  total_cost_centers: number;
  offset: number;
  limit: number;
  cost_centers: import('@/constants/mock-api-cost-centers').CostCenter[];
};

export type CostCenterByIdResponse = {
  success: boolean;
  time: string;
  message: string;
  cost_center: import('@/constants/mock-api-cost-centers').CostCenter;
};

export type CostCenterMutationPayload = {
  codigo: string;
  nome: string;
  unidade: string;
  ativo: boolean;
};
