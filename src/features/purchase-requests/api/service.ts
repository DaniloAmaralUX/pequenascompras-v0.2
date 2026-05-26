// ============================================================
// PurchaseRequest Service — Camada de Acesso a Dados
// ============================================================
// Único arquivo a modificar ao conectar a um backend real ("Base B").
// O motor de governança roda aqui no protótipo; em produção, no backend.
// ============================================================

import {
  fakePurchaseRequests,
  PURCHASE_STATUS,
  type PurchaseRequest,
  type PurchaseRequestItem
} from '@/constants/mock-api-purchase-requests';
import { validateEligibility } from '../lib/governance';
import { applyTransition } from '../lib/workflow';
import type {
  PurchaseRequestFilters,
  PurchaseRequestsResponse,
  PurchaseRequestByIdResponse,
  PurchaseRequestPayload,
  WorkflowActionPayload
} from './types';

export async function getPurchaseRequests(
  filters: PurchaseRequestFilters
): Promise<PurchaseRequestsResponse> {
  return fakePurchaseRequests.getPurchaseRequests(filters);
}

export async function getPurchaseRequestById(
  id: number
): Promise<PurchaseRequestByIdResponse> {
  return fakePurchaseRequests.getPurchaseRequestById(id) as Promise<PurchaseRequestByIdResponse>;
}

/** Monta a entidade PurchaseRequest a partir do payload do formulário. */
function montarSolicitacao(payload: PurchaseRequestPayload): PurchaseRequest {
  const itens: PurchaseRequestItem[] = payload.itens.map((it) => ({
    ...it,
    id: crypto.randomUUID()
  }));
  const valorEstimado = itens.reduce(
    (t, it) => t + it.quantidade * it.valor_unitario_estimado,
    0
  );
  const agora = new Date().toISOString();

  return {
    id: fakePurchaseRequests.nextId(),
    numero: fakePurchaseRequests.nextNumero(),
    solicitante_nome: payload.solicitante_nome,
    unidade: payload.unidade,
    centro_de_custo: payload.centro_de_custo,
    justificativa: payload.justificativa,
    prioridade: payload.prioridade,
    forma_pagamento: payload.forma_pagamento ?? '',
    itens,
    valor_estimado: valorEstimado,
    status: PURCHASE_STATUS.RASCUNHO,
    motivos_bloqueio: [],
    criada_em: agora,
    anexos: payload.anexos,
    historico: [
      { data: agora, autor: payload.solicitante_nome, descricao: 'Solicitação criada' }
    ]
  };
}

/**
 * Cria uma solicitação. Se `enviar` for true, roda o motor de governança:
 * elegível → "Aguardando Aprovação"; bloqueada → "Bloqueada" com os motivos.
 */
export async function createPurchaseRequest(payload: PurchaseRequestPayload) {
  const solicitacao = montarSolicitacao(payload);

  if (!payload.enviar) {
    return fakePurchaseRequests.createPurchaseRequest(solicitacao);
  }

  const agora = new Date().toISOString();
  solicitacao.enviada_em = agora;
  solicitacao.historico.push({
    data: agora,
    autor: payload.solicitante_nome,
    descricao: 'Solicitação enviada para aprovação',
    de: PURCHASE_STATUS.RASCUNHO,
    para: PURCHASE_STATUS.AGUARDANDO_APROVACAO
  });

  const elegibilidade = validateEligibility({
    valor_estimado: solicitacao.valor_estimado,
    centro_de_custo: solicitacao.centro_de_custo,
    itens: solicitacao.itens,
    anexos: solicitacao.anexos
  });

  if (elegibilidade.elegivel) {
    solicitacao.status = PURCHASE_STATUS.AGUARDANDO_APROVACAO;
  } else {
    solicitacao.status = PURCHASE_STATUS.BLOQUEADA;
    solicitacao.motivos_bloqueio = elegibilidade.motivos;
    solicitacao.historico.push({
      data: agora,
      autor: 'Motor de Governança',
      descricao: 'Solicitação bloqueada pelas regras de governança',
      de: PURCHASE_STATUS.AGUARDANDO_APROVACAO,
      para: PURCHASE_STATUS.BLOQUEADA
    });
  }

  return fakePurchaseRequests.createPurchaseRequest(solicitacao);
}

/** Aplica uma ação de workflow (aprovar, registrar compra, etc.) a uma solicitação. */
export async function applyWorkflowAction(id: number, payload: WorkflowActionPayload) {
  const atual = await fakePurchaseRequests.getPurchaseRequestById(id);
  if (!atual.success || !('request' in atual) || !atual.request) {
    return { success: false, message: `Solicitação com ID ${id} não encontrada` };
  }

  const resultado = applyTransition(atual.request, payload);
  if (!resultado.ok) {
    return { success: false, message: resultado.message };
  }

  return fakePurchaseRequests.updatePurchaseRequest(id, resultado.request);
}
