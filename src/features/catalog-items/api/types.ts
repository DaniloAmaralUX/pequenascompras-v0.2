export type { CatalogItem } from '@/constants/mock-api-catalog-items';

export type CatalogItemFilters = {
  page?: number;
  limit?: number;
  categorias?: string;
  search?: string;
  sort?: string;
};

export type CatalogItemsResponse = {
  success: boolean;
  time: string;
  message: string;
  total_items: number;
  offset: number;
  limit: number;
  items: import('@/constants/mock-api-catalog-items').CatalogItem[];
};

export type CatalogItemByIdResponse = {
  success: boolean;
  time: string;
  message: string;
  item: import('@/constants/mock-api-catalog-items').CatalogItem;
};

export type CatalogItemMutationPayload = {
  nome: string;
  categoria: string;
  unidade_medida: string;
  is_item_estoque: boolean;
  tem_contrato_vigente: boolean;
  preco_medio_historico: number;
};
