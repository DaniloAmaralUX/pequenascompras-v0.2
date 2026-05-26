export type {
  PurchaseRequest,
  PurchaseRequestItem,
  HistoryEvent,
  PurchaseStatus
} from '@/constants/mock-api-purchase-requests';

import type { PurchaseRequest, PurchaseRequestItem } from '@/constants/mock-api-purchase-requests';

export type PurchaseRequestFilters = {
  page?: number;
  limit?: number;
  statuses?: string;
  prioridades?: string;
  search?: string;
  sort?: string;
  /** Filtra pelas solicitações de um solicitante específico (usado pelo perfil Solicitante). */
  solicitanteNome?: string;
};

export type PurchaseRequestsResponse = {
  success: boolean;
  time: string;
  message: string;
  total_requests: number;
  offset: number;
  limit: number;
  requests: PurchaseRequest[];
};

export type PurchaseRequestByIdResponse = {
  success: boolean;
  time: string;
  message: string;
  request: PurchaseRequest;
};

/** Item informado no formulário (sem id — gerado no serviço). */
export type PurchaseRequestItemInput = Omit<PurchaseRequestItem, 'id' | 'valor_unitario_real'>;

/** Payload do formulário de criação/edição de solicitação. */
export type PurchaseRequestPayload = {
  solicitante_nome: string;
  unidade: string;
  centro_de_custo: string;
  justificativa: string;
  prioridade: string;
  forma_pagamento?: string;
  itens: PurchaseRequestItemInput[];
  anexos: { nome: string; tipo: string }[];
  /** true = enviar para aprovação; false = salvar como rascunho. */
  enviar: boolean;
};

/** Ações de transição do workflow. */
export type WorkflowAction =
  | 'aprovar'
  | 'rejeitar'
  | 'registrar-pedido'
  | 'registrar-compra'
  | 'encaminhar-financeiro'
  | 'confirmar-pagamento'
  | 'confirmar-envio'
  | 'confirmar-recebimento'
  | 'cancelar';

export type WorkflowActionPayload = {
  action: WorkflowAction;
  autor: string;
  comentario?: string;
  /** Dados extras (fornecedor, valor real) para a etapa de registro da compra. */
  fornecedor_nome?: string;
  valor_real?: number;
};
