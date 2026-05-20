export type { Supplier } from '@/constants/mock-api-suppliers';

export type SupplierFilters = {
  page?: number;
  limit?: number;
  categorias?: string;
  search?: string;
  sort?: string;
};

export type SuppliersResponse = {
  success: boolean;
  time: string;
  message: string;
  total_suppliers: number;
  offset: number;
  limit: number;
  suppliers: import('@/constants/mock-api-suppliers').Supplier[];
};

export type SupplierByIdResponse = {
  success: boolean;
  time: string;
  message: string;
  supplier: import('@/constants/mock-api-suppliers').Supplier;
};

export type SupplierMutationPayload = {
  nome: string;
  cnpj: string;
  email: string;
  telefone: string;
  categoria: string;
  homologado: boolean;
  bloqueado: boolean;
};
