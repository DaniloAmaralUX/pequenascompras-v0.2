// ============================================================
// Máquina de Estados do Workflow de Compras (PRD §5)
// ============================================================
// Funções puras que aplicam transições a uma solicitação,
// gravando o evento no histórico e atualizando datas/campos.
// ============================================================

import {
  PURCHASE_STATUS,
  type PurchaseRequest,
  type PurchaseStatus
} from '@/constants/mock-api-purchase-requests';
import { STATUS_ATIVOS } from '../constants/purchase-request-options';
import type { WorkflowAction, WorkflowActionPayload } from '../api/types';

type TransicaoDef = {
  de: PurchaseStatus[];
  para: PurchaseStatus;
  descricao: string;
};

export const TRANSICOES: Record<WorkflowAction, TransicaoDef> = {
  aprovar: {
    de: [PURCHASE_STATUS.AGUARDANDO_APROVACAO],
    para: PURCHASE_STATUS.APROVADA,
    descricao: 'Solicitação aprovada pelo gestor'
  },
  rejeitar: {
    de: [PURCHASE_STATUS.AGUARDANDO_APROVACAO],
    para: PURCHASE_STATUS.REJEITADA,
    descricao: 'Solicitação rejeitada pelo gestor'
  },
  'registrar-pedido': {
    de: [PURCHASE_STATUS.APROVADA],
    para: PURCHASE_STATUS.PEDIDO_REGISTRADO,
    descricao: 'Pedido registrado no ERP (integração simulada)'
  },
  'registrar-compra': {
    de: [PURCHASE_STATUS.PEDIDO_REGISTRADO],
    para: PURCHASE_STATUS.EM_COMPRA,
    descricao: 'Compra registrada pelo analista de suprimentos'
  },
  'encaminhar-financeiro': {
    de: [PURCHASE_STATUS.EM_COMPRA],
    para: PURCHASE_STATUS.AGUARDANDO_PAGAMENTO,
    descricao: 'Solicitação encaminhada ao Financeiro para pagamento'
  },
  'confirmar-pagamento': {
    de: [PURCHASE_STATUS.AGUARDANDO_PAGAMENTO],
    para: PURCHASE_STATUS.PAGO,
    descricao: 'Pagamento confirmado pelo Financeiro'
  },
  'confirmar-envio': {
    de: [PURCHASE_STATUS.PAGO],
    para: PURCHASE_STATUS.AGUARDANDO_RECEBIMENTO,
    descricao: 'Envio confirmado — aguardando recebimento'
  },
  'confirmar-recebimento': {
    de: [PURCHASE_STATUS.AGUARDANDO_RECEBIMENTO],
    para: PURCHASE_STATUS.CONCLUIDA,
    descricao: 'Recebimento confirmado — solicitação concluída'
  },
  cancelar: {
    de: STATUS_ATIVOS,
    para: PURCHASE_STATUS.CANCELADA,
    descricao: 'Solicitação cancelada'
  }
};

/** Retorna as ações de workflow disponíveis a partir de um status. */
export function acoesDisponiveis(status: PurchaseStatus): WorkflowAction[] {
  return (Object.keys(TRANSICOES) as WorkflowAction[]).filter((acao) =>
    TRANSICOES[acao].de.includes(status)
  );
}

/** Aplica uma transição de workflow a uma solicitação (retorna nova cópia). */
export function applyTransition(
  request: PurchaseRequest,
  payload: WorkflowActionPayload
): { ok: boolean; message: string; request: PurchaseRequest } {
  const def = TRANSICOES[payload.action];

  if (!def.de.includes(request.status)) {
    return {
      ok: false,
      message: `Ação não permitida a partir do status "${request.status}".`,
      request
    };
  }

  const agora = new Date().toISOString();
  const atualizada: PurchaseRequest = {
    ...request,
    status: def.para,
    historico: [
      ...request.historico,
      {
        data: agora,
        autor: payload.autor,
        descricao: def.descricao,
        comentario: payload.comentario,
        de: request.status,
        para: def.para
      }
    ]
  };

  // Efeitos colaterais por ação
  switch (payload.action) {
    case 'aprovar':
      atualizada.aprovador_nome = payload.autor;
      atualizada.aprovada_em = agora;
      break;
    case 'rejeitar':
      atualizada.aprovador_nome = payload.autor;
      break;
    case 'registrar-compra':
      atualizada.analista_nome = payload.autor;
      atualizada.fornecedor_nome = payload.fornecedor_nome;
      atualizada.valor_real = payload.valor_real;
      atualizada.comprada_em = agora;
      break;
    case 'confirmar-pagamento':
      atualizada.paga_em = agora;
      break;
    case 'confirmar-recebimento':
      atualizada.recebida_em = agora;
      break;
    default:
      break;
  }

  return { ok: true, message: 'Transição aplicada com sucesso.', request: atualizada };
}
