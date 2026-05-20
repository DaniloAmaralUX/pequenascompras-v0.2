// ============================================================
// Motor de Regras de Governança — Pequenas Compras (PRD §6)
// ============================================================
// Valida a elegibilidade de uma solicitação segundo as regras de
// compliance do benchmark "Direct Buy". Retorna a lista de motivos
// de bloqueio (vazia = elegível).
//
// No protótipo o motor lê os stores mock diretamente. Na integração
// real, esta lógica roda no backend (Base B / ERP).
// ============================================================

import {
  fakePurchaseRequests,
  PURCHASE_STATUS,
  type PurchaseRequestItem
} from '@/constants/mock-api-purchase-requests';
import { fakeCatalogItems } from '@/constants/mock-api-catalog-items';
import { GOVERNANCA } from '../constants/purchase-request-options';

const formatBRL = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export type EligibilityInput = {
  valor_estimado: number;
  centro_de_custo: string;
  itens: PurchaseRequestItem[];
  anexos: { nome: string }[];
  /** ID a excluir da checagem de fatiamento (ao revalidar a própria solicitação). */
  excluirId?: number;
};

export type EligibilityResult = {
  elegivel: boolean;
  motivos: string[];
};

/** Detecta tentativa de fatiamento de compras para burlar o limite. */
function detectarFatiamento(input: EligibilityInput): string | null {
  const limiteData = new Date();
  limiteData.setDate(limiteData.getDate() - GOVERNANCA.JANELA_FATIAMENTO_DIAS);

  const categoriasNovas = new Set(input.itens.map((it) => it.categoria));

  const relacionadas = fakePurchaseRequests.records.filter((r) => {
    if (r.id === input.excluirId) return false;
    if (r.status === PURCHASE_STATUS.REJEITADA || r.status === PURCHASE_STATUS.CANCELADA) {
      return false;
    }
    if (r.centro_de_custo !== input.centro_de_custo) return false;
    if (new Date(r.criada_em) < limiteData) return false;
    return r.itens.some((it) => categoriasNovas.has(it.categoria));
  });

  if (relacionadas.length === 0) return null;

  const somaRelacionadas = relacionadas.reduce((t, r) => t + r.valor_estimado, 0);
  const total = somaRelacionadas + input.valor_estimado;

  if (total > GOVERNANCA.LIMITE_VALOR) {
    return (
      `Possível fatiamento de compras: já existem ${relacionadas.length} solicitação(ões) ` +
      `do mesmo centro de custo e categoria nos últimos ${GOVERNANCA.JANELA_FATIAMENTO_DIAS} dias. ` +
      `O valor acumulado (${formatBRL(total)}) ultrapassa o limite de ${formatBRL(GOVERNANCA.LIMITE_VALOR)}.`
    );
  }
  return null;
}

/** Valida a elegibilidade de uma solicitação segundo as regras de governança. */
export function validateEligibility(input: EligibilityInput): EligibilityResult {
  const motivos: string[] = [];

  // Regra 1 — limite de valor
  if (input.valor_estimado > GOVERNANCA.LIMITE_VALOR) {
    motivos.push(
      `Valor estimado (${formatBRL(input.valor_estimado)}) acima do limite de ` +
        `${formatBRL(GOVERNANCA.LIMITE_VALOR)} para pequenas compras. ` +
        'Encaminhe ao processo tradicional de compras.'
    );
  }

  // Regra 2 — centro de custo
  if (!input.centro_de_custo?.trim()) {
    motivos.push('Centro de custo não informado.');
  }

  // Regra 3 — comprovante de preço
  if (!input.anexos || input.anexos.length === 0) {
    motivos.push(
      'É obrigatório anexar um comprovante de preço (orçamento, print de site ou nota fiscal).'
    );
  }

  // Regra 4 — ao menos um item
  if (!input.itens || input.itens.length === 0) {
    motivos.push('A solicitação deve conter ao menos um item.');
  }

  // Regra 5 — itens de estoque / com contrato vigente (via catálogo)
  for (const item of input.itens ?? []) {
    if (!item.catalog_item_id) continue;
    const cat = fakeCatalogItems.records.find((c) => c.id === item.catalog_item_id);
    if (cat?.is_item_estoque) {
      motivos.push(
        `O item "${item.descricao}" é item de estoque — não pode ser comprado de forma avulsa.`
      );
    }
    if (cat?.tem_contrato_vigente) {
      motivos.push(
        `O item "${item.descricao}" possui contrato vigente — deve ser comprado pelo contrato.`
      );
    }
  }

  // Regra 6 — anti-fatiamento
  const fatiamento = detectarFatiamento(input);
  if (fatiamento) motivos.push(fatiamento);

  return { elegivel: motivos.length === 0, motivos };
}
