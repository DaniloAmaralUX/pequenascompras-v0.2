// ============================================================
// Supplier Service — Camada de Acesso a Dados
// ============================================================
// Este é o ÚNICO arquivo a modificar ao conectar a um backend real
// (ex.: a "Base B" / ERP do SESI). Queries e componentes importam daqui.
// Atual: mock (dados fake em memória para protótipo).
// ============================================================

import { fakeSuppliers } from '@/constants/mock-api-suppliers';
import type {
  SupplierFilters,
  SuppliersResponse,
  SupplierByIdResponse,
  SupplierMutationPayload
} from './types';

export async function getSuppliers(filters: SupplierFilters): Promise<SuppliersResponse> {
  return fakeSuppliers.getSuppliers(filters);
}

export async function getSupplierById(id: number): Promise<SupplierByIdResponse> {
  return fakeSuppliers.getSupplierById(id) as Promise<SupplierByIdResponse>;
}

export async function createSupplier(data: SupplierMutationPayload) {
  return fakeSuppliers.createSupplier(data);
}

export async function updateSupplier(id: number, data: SupplierMutationPayload) {
  return fakeSuppliers.updateSupplier(id, data);
}

export async function deleteSupplier(id: number) {
  return fakeSuppliers.deleteSupplier(id);
}
