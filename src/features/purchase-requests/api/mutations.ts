import { mutationOptions } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { createPurchaseRequest, applyWorkflowAction } from './service';
import { purchaseRequestKeys } from './queries';
import type { PurchaseRequestPayload, WorkflowActionPayload } from './types';

export const createPurchaseRequestMutation = mutationOptions({
  mutationFn: (data: PurchaseRequestPayload) => createPurchaseRequest(data),
  onSuccess: () => {
    getQueryClient().invalidateQueries({ queryKey: purchaseRequestKeys.all });
  }
});

export const workflowActionMutation = mutationOptions({
  mutationFn: ({ id, payload }: { id: number; payload: WorkflowActionPayload }) =>
    applyWorkflowAction(id, payload),
  onSuccess: () => {
    getQueryClient().invalidateQueries({ queryKey: purchaseRequestKeys.all });
  }
});
