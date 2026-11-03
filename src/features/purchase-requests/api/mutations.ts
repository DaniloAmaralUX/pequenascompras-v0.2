import { mutationOptions } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { reportKeys } from '@/features/reports/api/queries';
import { createPurchaseRequest, applyWorkflowAction } from './service';
import { purchaseRequestKeys } from './queries';
import type { PurchaseRequestPayload, WorkflowActionPayload } from './types';

/**
 * Invalida as solicitações e os relatórios derivados delas.
 * Fica em `onSettled` (e não em `onSuccess`) porque os componentes
 * sobrescrevem `onSuccess` para mostrar toasts — e a invalidação
 * não pode se perder nessa sobrescrita.
 */
const invalidarSolicitacoes = () => {
  const queryClient = getQueryClient();
  queryClient.invalidateQueries({ queryKey: purchaseRequestKeys.all });
  queryClient.invalidateQueries({ queryKey: reportKeys.all });
};

export const createPurchaseRequestMutation = mutationOptions({
  mutationFn: (data: PurchaseRequestPayload) => createPurchaseRequest(data),
  onSettled: invalidarSolicitacoes
});

export const workflowActionMutation = mutationOptions({
  mutationFn: ({ id, payload }: { id: number; payload: WorkflowActionPayload }) =>
    applyWorkflowAction(id, payload),
  onSettled: invalidarSolicitacoes
});
