import { mutationOptions } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { createCostCenter, updateCostCenter, deleteCostCenter } from './service';
import { costCenterKeys } from './queries';
import type { CostCenterMutationPayload } from './types';

export const createCostCenterMutation = mutationOptions({
  mutationFn: (data: CostCenterMutationPayload) => createCostCenter(data),
  onSuccess: () => {
    getQueryClient().invalidateQueries({ queryKey: costCenterKeys.all });
  }
});

export const updateCostCenterMutation = mutationOptions({
  mutationFn: ({ id, values }: { id: number; values: CostCenterMutationPayload }) =>
    updateCostCenter(id, values),
  onSuccess: () => {
    getQueryClient().invalidateQueries({ queryKey: costCenterKeys.all });
  }
});

export const deleteCostCenterMutation = mutationOptions({
  mutationFn: (id: number) => deleteCostCenter(id),
  onSuccess: () => {
    getQueryClient().invalidateQueries({ queryKey: costCenterKeys.all });
  }
});
