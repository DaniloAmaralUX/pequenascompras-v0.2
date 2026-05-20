import { queryOptions } from '@tanstack/react-query';
import { getPurchaseRequests, getPurchaseRequestById } from './service';
import type { PurchaseRequest, PurchaseRequestFilters } from './types';

export type { PurchaseRequest };

export const purchaseRequestKeys = {
  all: ['purchase-requests'] as const,
  list: (filters: PurchaseRequestFilters) =>
    [...purchaseRequestKeys.all, 'list', filters] as const,
  detail: (id: number) => [...purchaseRequestKeys.all, 'detail', id] as const
};

export const purchaseRequestsQueryOptions = (filters: PurchaseRequestFilters) =>
  queryOptions({
    queryKey: purchaseRequestKeys.list(filters),
    queryFn: () => getPurchaseRequests(filters)
  });

export const purchaseRequestByIdOptions = (id: number) =>
  queryOptions({
    queryKey: purchaseRequestKeys.detail(id),
    queryFn: () => getPurchaseRequestById(id)
  });
