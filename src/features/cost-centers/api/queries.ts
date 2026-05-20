import { queryOptions } from '@tanstack/react-query';
import { getCostCenters, getCostCenterById } from './service';
import type { CostCenter, CostCenterFilters } from './types';

export type { CostCenter };

export const costCenterKeys = {
  all: ['cost-centers'] as const,
  list: (filters: CostCenterFilters) => [...costCenterKeys.all, 'list', filters] as const,
  detail: (id: number) => [...costCenterKeys.all, 'detail', id] as const
};

export const costCentersQueryOptions = (filters: CostCenterFilters) =>
  queryOptions({
    queryKey: costCenterKeys.list(filters),
    queryFn: () => getCostCenters(filters)
  });

export const costCenterByIdOptions = (id: number) =>
  queryOptions({
    queryKey: costCenterKeys.detail(id),
    queryFn: () => getCostCenterById(id)
  });
