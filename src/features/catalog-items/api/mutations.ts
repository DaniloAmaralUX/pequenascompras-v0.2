import { mutationOptions } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { createCatalogItem, updateCatalogItem, deleteCatalogItem } from './service';
import { catalogItemKeys } from './queries';
import type { CatalogItemMutationPayload } from './types';

export const createCatalogItemMutation = mutationOptions({
  mutationFn: (data: CatalogItemMutationPayload) => createCatalogItem(data),
  onSuccess: () => {
    getQueryClient().invalidateQueries({ queryKey: catalogItemKeys.all });
  }
});

export const updateCatalogItemMutation = mutationOptions({
  mutationFn: ({ id, values }: { id: number; values: CatalogItemMutationPayload }) =>
    updateCatalogItem(id, values),
  onSuccess: () => {
    getQueryClient().invalidateQueries({ queryKey: catalogItemKeys.all });
  }
});

export const deleteCatalogItemMutation = mutationOptions({
  mutationFn: (id: number) => deleteCatalogItem(id),
  onSuccess: () => {
    getQueryClient().invalidateQueries({ queryKey: catalogItemKeys.all });
  }
});
