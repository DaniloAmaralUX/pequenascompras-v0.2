import {
  PURCHASE_STATUS,
  PRIORIDADES,
  FORMAS_PAGAMENTO,
  type PurchaseStatus
} from '@/constants/mock-api-purchase-requests';

/** Parâmetros de governança (configuráveis pelo Admin numa fase futura). */
export const GOVERNANCA = {
  /** Limite de valor para pequenas compras (benchmark: R$ 3.000,00). */
  LIMITE_VALOR: 3000,
  /** Janela (dias) para detecção de fatiamento de compras. */
  JANELA_FATIAMENTO_DIAS: 30
};

/** Opções de status para filtros de tabela. */
export const statusOptions = Object.values(PURCHASE_STATUS).map((s) => ({
  value: s,
  label: s
}));

/** Opções de prioridade. */
export const prioridadeOptions = PRIORIDADES.map((p) => ({ value: p, label: p }));

/** Opções de forma de pagamento. */
export const formaPagamentoOptions = FORMAS_PAGAMENTO.map((f) => ({ value: f, label: f }));

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

/** Mapa de status → variante de Badge. */
export const statusBadgeVariant: Record<string, BadgeVariant> = {
  [PURCHASE_STATUS.RASCUNHO]: 'secondary',
  [PURCHASE_STATUS.AGUARDANDO_APROVACAO]: 'outline',
  [PURCHASE_STATUS.BLOQUEADA]: 'destructive',
  [PURCHASE_STATUS.REJEITADA]: 'destructive',
  [PURCHASE_STATUS.APROVADA]: 'default',
  [PURCHASE_STATUS.PEDIDO_REGISTRADO]: 'default',
  [PURCHASE_STATUS.EM_COMPRA]: 'default',
  [PURCHASE_STATUS.AGUARDANDO_PAGAMENTO]: 'outline',
  [PURCHASE_STATUS.PAGO]: 'default',
  [PURCHASE_STATUS.AGUARDANDO_RECEBIMENTO]: 'outline',
  [PURCHASE_STATUS.CONCLUIDA]: 'default',
  [PURCHASE_STATUS.CANCELADA]: 'secondary'
};

/** Conjuntos de status que definem as 4 visões da listagem. */
export const STATUS_VIEWS: Record<'aprovacoes' | 'execucao', PurchaseStatus[]> = {
  aprovacoes: [PURCHASE_STATUS.AGUARDANDO_APROVACAO],
  execucao: [
    PURCHASE_STATUS.APROVADA,
    PURCHASE_STATUS.PEDIDO_REGISTRADO,
    PURCHASE_STATUS.EM_COMPRA,
    PURCHASE_STATUS.AGUARDANDO_PAGAMENTO,
    PURCHASE_STATUS.PAGO,
    PURCHASE_STATUS.AGUARDANDO_RECEBIMENTO
  ]
};

/** Status considerados "ativos" (workflow em andamento). */
export const STATUS_ATIVOS: PurchaseStatus[] = [
  PURCHASE_STATUS.RASCUNHO,
  PURCHASE_STATUS.AGUARDANDO_APROVACAO,
  PURCHASE_STATUS.BLOQUEADA,
  PURCHASE_STATUS.APROVADA,
  PURCHASE_STATUS.PEDIDO_REGISTRADO,
  PURCHASE_STATUS.EM_COMPRA,
  PURCHASE_STATUS.AGUARDANDO_PAGAMENTO,
  PURCHASE_STATUS.PAGO,
  PURCHASE_STATUS.AGUARDANDO_RECEBIMENTO
];
