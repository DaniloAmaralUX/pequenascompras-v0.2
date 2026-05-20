import { SUPPLIER_CATEGORIES } from '@/constants/mock-api-suppliers';

/** Opções de categoria de fornecedor — usadas em formulários e filtros de tabela. */
export const supplierCategoryOptions = SUPPLIER_CATEGORIES.map((c) => ({
  value: c,
  label: c
}));
