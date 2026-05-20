import { queryOptions } from '@tanstack/react-query';
import { getSuppliers, getSupplierById } from './service';
import type { Supplier, SupplierFilters } from './types';

export type { Supplier };

export const supplierKeys = {
  all: ['suppliers'] as const,
  list: (filters: SupplierFilters) => [...supplierKeys.all, 'list', filters] as const,
  detail: (id: number) => [...supplierKeys.all, 'detail', id] as const
};

export const suppliersQueryOptions = (filters: SupplierFilters) =>
  queryOptions({
    queryKey: supplierKeys.list(filters),
    queryFn: () => getSuppliers(filters)
  });

export const supplierByIdOptions = (id: number) =>
  queryOptions({
    queryKey: supplierKeys.detail(id),
    queryFn: () => getSupplierById(id)
  });
