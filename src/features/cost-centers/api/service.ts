// ============================================================
// CostCenter Service — Camada de Acesso a Dados
// ============================================================
// Único arquivo a modificar ao conectar a um backend real ("Base B").
// Atual: mock (dados fake em memória para protótipo).
// ============================================================

import { fakeCostCenters } from '@/constants/mock-api-cost-centers';
import type {
  CostCenterFilters,
  CostCentersResponse,
  CostCenterByIdResponse,
  CostCenterMutationPayload
} from './types';

export async function getCostCenters(
  filters: CostCenterFilters
): Promise<CostCentersResponse> {
  return fakeCostCenters.getCostCenters(filters);
}

export async function getCostCenterById(id: number): Promise<CostCenterByIdResponse> {
  return fakeCostCenters.getCostCenterById(id) as Promise<CostCenterByIdResponse>;
}

export async function createCostCenter(data: CostCenterMutationPayload) {
  return fakeCostCenters.createCostCenter(data);
}

export async function updateCostCenter(id: number, data: CostCenterMutationPayload) {
  return fakeCostCenters.updateCostCenter(id, data);
}

export async function deleteCostCenter(id: number) {
  return fakeCostCenters.deleteCostCenter(id);
}
