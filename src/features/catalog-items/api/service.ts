// ============================================================
// CatalogItem Service — Camada de Acesso a Dados
// ============================================================
// Único arquivo a modificar ao conectar a um backend real ("Base B").
// Atual: mock (dados fake em memória para protótipo).
// ============================================================

import { fakeCatalogItems } from '@/constants/mock-api-catalog-items';
import type {
  CatalogItemFilters,
  CatalogItemsResponse,
  CatalogItemByIdResponse,
  CatalogItemMutationPayload
} from './types';

export async function getCatalogItems(
  filters: CatalogItemFilters
): Promise<CatalogItemsResponse> {
  return fakeCatalogItems.getCatalogItems(filters);
}

export async function getCatalogItemById(id: number): Promise<CatalogItemByIdResponse> {
  return fakeCatalogItems.getCatalogItemById(id) as Promise<CatalogItemByIdResponse>;
}

export async function createCatalogItem(data: CatalogItemMutationPayload) {
  return fakeCatalogItems.createCatalogItem(data);
}

export async function updateCatalogItem(id: number, data: CatalogItemMutationPayload) {
  return fakeCatalogItems.updateCatalogItem(id, data);
}

export async function deleteCatalogItem(id: number) {
  return fakeCatalogItems.deleteCatalogItem(id);
}
