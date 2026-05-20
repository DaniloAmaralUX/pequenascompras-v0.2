import { queryOptions } from '@tanstack/react-query';
import { getCatalogItems, getCatalogItemById } from './service';
import type { CatalogItem, CatalogItemFilters } from './types';

export type { CatalogItem };

export const catalogItemKeys = {
  all: ['catalog-items'] as const,
  list: (filters: CatalogItemFilters) => [...catalogItemKeys.all, 'list', filters] as const,
  detail: (id: number) => [...catalogItemKeys.all, 'detail', id] as const
};

export const catalogItemsQueryOptions = (filters: CatalogItemFilters) =>
  queryOptions({
    queryKey: catalogItemKeys.list(filters),
    queryFn: () => getCatalogItems(filters)
  });

export const catalogItemByIdOptions = (id: number) =>
  queryOptions({
    queryKey: catalogItemKeys.detail(id),
    queryFn: () => getCatalogItemById(id)
  });
