// ============================================================
// Camada de Analytics — Relatórios de Pequenas Compras (PRD §8)
// ============================================================
// Funções puras que cruzam os dados das solicitações para gerar
// KPIs e relatórios (item × valor × volume × data × frequência ×
// solicitante × centro de custo).
//
// No protótipo computam sobre o store mock; na integração real,
// estas agregações rodam no backend / camada de BI.
// ============================================================

import {
  fakePurchaseRequests,
  PURCHASE_STATUS,
  type PurchaseRequest
} from '@/constants/mock-api-purchase-requests';

/** Status que NÃO entram na análise de gasto/demanda. */
const STATUS_EXCLUIDOS: string[] = [
  PURCHASE_STATUS.RASCUNHO,
  PURCHASE_STATUS.CANCELADA,
  PURCHASE_STATUS.REJEITADA
];

const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

/** Valor considerado: valor real (se já comprado) ou estimado. */
const valorEfetivo = (r: PurchaseRequest) => r.valor_real ?? r.valor_estimado;

/** Solicitações que entram nas análises (exclui rascunho/cancelada/rejeitada). */
function solicitacoesValidas(): PurchaseRequest[] {
  return fakePurchaseRequests.records.filter((r) => !STATUS_EXCLUIDOS.includes(r.status));
}

export type DashboardKpis = {
  gastoTotal: number;
  totalSolicitacoes: number;
  ticketMedio: number;
  itensRecorrentes: number;
  tempoMedioCicloDias: number;
  aguardandoAprovacao: number;
};

export type SerieValor = { rotulo: string; valor: number };

export type DashboardData = {
  kpis: DashboardKpis;
  gastoMensal: SerieValor[];
  gastoPorCategoria: SerieValor[];
  topItens: SerieValor[];
  recentes: PurchaseRequest[];
};

export type ItemRecorrente = {
  item: string;
  categoria: string;
  numCompras: number;
  qtdTotal: number;
  valorTotal: number;
  numSolicitantes: number;
  numCentros: number;
  precoMedio: number;
  precoMin: number;
  precoMax: number;
};

export type GastoSetor = {
  centro: string;
  numSolicitacoes: number;
  valorTotal: number;
};

export type AlertaPreco = {
  numero: string;
  item: string;
  solicitante: string;
  precoUnitario: number;
  precoMedio: number;
  diferencaPct: number;
};

/** Dados consolidados do Dashboard de Compras. */
export function getDashboardData(): DashboardData {
  const reqs = solicitacoesValidas();
  const gastoTotal = reqs.reduce((t, r) => t + valorEfetivo(r), 0);
  const totalSolicitacoes = reqs.length;

  // Tempo médio de ciclo (criação → recebimento) das concluídas
  const concluidas = reqs.filter((r) => r.status === PURCHASE_STATUS.CONCLUIDA && r.recebida_em);
  const tempoMedio =
    concluidas.length > 0
      ? concluidas.reduce((t, r) => {
          const dias =
            (new Date(r.recebida_em as string).getTime() - new Date(r.criada_em).getTime()) /
            86_400_000;
          return t + dias;
        }, 0) / concluidas.length
      : 0;

  // Gasto mensal
  const porMes = new Map<string, number>();
  for (const r of reqs) {
    const d = new Date(r.criada_em);
    const chave = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, '0')}`;
    porMes.set(chave, (porMes.get(chave) ?? 0) + valorEfetivo(r));
  }
  const gastoMensal: SerieValor[] = [...porMes.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([chave, valor]) => {
      const [, mes] = chave.split('-');
      return { rotulo: MESES[Number(mes)], valor: Math.round(valor) };
    });

  // Gasto por categoria + top itens
  const porCategoria = new Map<string, number>();
  const porItem = new Map<string, number>();
  for (const r of reqs) {
    for (const it of r.itens) {
      const total = it.quantidade * it.valor_unitario_estimado;
      porCategoria.set(it.categoria, (porCategoria.get(it.categoria) ?? 0) + total);
      porItem.set(it.descricao, (porItem.get(it.descricao) ?? 0) + total);
    }
  }
  const gastoPorCategoria: SerieValor[] = [...porCategoria.entries()]
    .map(([rotulo, valor]) => ({ rotulo, valor: Math.round(valor) }))
    .sort((a, b) => b.valor - a.valor);
  const topItens: SerieValor[] = [...porItem.entries()]
    .map(([rotulo, valor]) => ({ rotulo, valor: Math.round(valor) }))
    .sort((a, b) => b.valor - a.valor)
    .slice(0, 8);

  const recorrentes = getItensRecorrentes();

  return {
    kpis: {
      gastoTotal,
      totalSolicitacoes,
      ticketMedio: totalSolicitacoes > 0 ? gastoTotal / totalSolicitacoes : 0,
      itensRecorrentes: recorrentes.length,
      tempoMedioCicloDias: Math.round(tempoMedio),
      aguardandoAprovacao: fakePurchaseRequests.records.filter(
        (r) => r.status === PURCHASE_STATUS.AGUARDANDO_APROVACAO
      ).length
    },
    gastoMensal,
    gastoPorCategoria,
    topItens,
    recentes: [...reqs]
      .sort((a, b) => new Date(b.criada_em).getTime() - new Date(a.criada_em).getTime())
      .slice(0, 5)
  };
}

/**
 * Itens recorrentes — comprados em 2+ solicitações distintas.
 * Saída principal para identificar oportunidades de compra em atacado.
 */
export function getItensRecorrentes(): ItemRecorrente[] {
  const reqs = solicitacoesValidas();
  const mapa = new Map<
    string,
    {
      categoria: string;
      numCompras: number;
      qtdTotal: number;
      valorTotal: number;
      solicitantes: Set<string>;
      centros: Set<string>;
      precos: number[];
    }
  >();

  for (const r of reqs) {
    for (const it of r.itens) {
      const e =
        mapa.get(it.descricao) ??
        {
          categoria: it.categoria,
          numCompras: 0,
          qtdTotal: 0,
          valorTotal: 0,
          solicitantes: new Set<string>(),
          centros: new Set<string>(),
          precos: [] as number[]
        };
      e.numCompras += 1;
      e.qtdTotal += it.quantidade;
      e.valorTotal += it.quantidade * it.valor_unitario_estimado;
      e.solicitantes.add(r.solicitante_nome);
      e.centros.add(r.centro_de_custo);
      e.precos.push(it.valor_unitario_estimado);
      mapa.set(it.descricao, e);
    }
  }

  return [...mapa.entries()]
    .filter(([, e]) => e.numCompras >= 2)
    .map(([item, e]) => ({
      item,
      categoria: e.categoria,
      numCompras: e.numCompras,
      qtdTotal: e.qtdTotal,
      valorTotal: Math.round(e.valorTotal),
      numSolicitantes: e.solicitantes.size,
      numCentros: e.centros.size,
      precoMedio: e.precos.reduce((t, p) => t + p, 0) / e.precos.length,
      precoMin: Math.min(...e.precos),
      precoMax: Math.max(...e.precos)
    }))
    .sort((a, b) => b.valorTotal - a.valorTotal);
}

/** Gasto agrupado por centro de custo. */
export function getGastoPorSetor(): GastoSetor[] {
  const reqs = solicitacoesValidas();
  const mapa = new Map<string, { num: number; valor: number }>();
  for (const r of reqs) {
    const e = mapa.get(r.centro_de_custo) ?? { num: 0, valor: 0 };
    e.num += 1;
    e.valor += valorEfetivo(r);
    mapa.set(r.centro_de_custo, e);
  }
  return [...mapa.entries()]
    .map(([centro, e]) => ({
      centro,
      numSolicitacoes: e.num,
      valorTotal: Math.round(e.valor)
    }))
    .sort((a, b) => b.valorTotal - a.valorTotal);
}

/**
 * Alertas de preço — itens cujo preço unitário está acima da média
 * histórica do próprio item (variação > 10%).
 */
export function getAlertasPreco(): AlertaPreco[] {
  const reqs = solicitacoesValidas();

  // Média de preço por item
  const precosPorItem = new Map<string, number[]>();
  for (const r of reqs) {
    for (const it of r.itens) {
      const lista = precosPorItem.get(it.descricao) ?? [];
      lista.push(it.valor_unitario_estimado);
      precosPorItem.set(it.descricao, lista);
    }
  }
  const mediaPorItem = new Map<string, number>();
  for (const [item, precos] of precosPorItem) {
    mediaPorItem.set(item, precos.reduce((t, p) => t + p, 0) / precos.length);
  }

  const alertas: AlertaPreco[] = [];
  for (const r of reqs) {
    for (const it of r.itens) {
      const media = mediaPorItem.get(it.descricao) ?? it.valor_unitario_estimado;
      const diferenca = (it.valor_unitario_estimado - media) / media;
      if (diferenca > 0.1) {
        alertas.push({
          numero: r.numero,
          item: it.descricao,
          solicitante: r.solicitante_nome,
          precoUnitario: it.valor_unitario_estimado,
          precoMedio: media,
          diferencaPct: diferenca * 100
        });
      }
    }
  }
  return alertas.sort((a, b) => b.diferencaPct - a.diferencaPct);
}
