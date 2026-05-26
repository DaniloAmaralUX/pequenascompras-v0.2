////////////////////////////////////////////////////////////////////////////////
// Banco de dados fake de Solicitações de Compra — Sistema de Pequenas Compras
////////////////////////////////////////////////////////////////////////////////

import { faker } from '@faker-js/faker';
import { matchSorter } from 'match-sorter';
import { SESI_UNIDADES } from '@/constants/mock-api-cost-centers';
import { loadFromStorage, saveToStorage } from '@/lib/mock-storage';

const STORAGE_KEY = 'purchase-requests';
const COUNTER_KEY = 'purchase-requests-counter';

export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Status da solicitação (máquina de estados — ver PRD §5)
export const PURCHASE_STATUS = {
  RASCUNHO: 'Rascunho',
  AGUARDANDO_APROVACAO: 'Aguardando Aprovação',
  BLOQUEADA: 'Bloqueada',
  REJEITADA: 'Rejeitada',
  APROVADA: 'Aprovada',
  PEDIDO_REGISTRADO: 'Pedido Registrado',
  EM_COMPRA: 'Em Compra',
  AGUARDANDO_PAGAMENTO: 'Aguardando Pagamento',
  PAGO: 'Pago',
  AGUARDANDO_RECEBIMENTO: 'Aguardando Recebimento',
  CONCLUIDA: 'Concluída',
  CANCELADA: 'Cancelada'
} as const;

export type PurchaseStatus = (typeof PURCHASE_STATUS)[keyof typeof PURCHASE_STATUS];

export const PRIORIDADES = ['Baixa', 'Média', 'Alta', 'Urgente'] as const;
export const FORMAS_PAGAMENTO = ['Caixa', 'Outra'] as const;

export type PurchaseRequestItem = {
  id: string;
  descricao: string;
  categoria: string;
  quantidade: number;
  unidade_medida: string;
  valor_unitario_estimado: number;
  valor_unitario_real?: number;
  catalog_item_id?: number;
};

export type HistoryEvent = {
  data: string;
  autor: string;
  descricao: string;
  de?: string;
  para?: string;
};

export type PurchaseRequest = {
  id: number;
  numero: string;
  solicitante_nome: string;
  unidade: string;
  centro_de_custo: string;
  justificativa: string;
  prioridade: string;
  forma_pagamento?: string;
  itens: PurchaseRequestItem[];
  fornecedor_nome?: string;
  aprovador_nome?: string;
  analista_nome?: string;
  valor_estimado: number;
  valor_real?: number;
  status: PurchaseStatus;
  motivos_bloqueio: string[];
  criada_em: string;
  enviada_em?: string;
  aprovada_em?: string;
  comprada_em?: string;
  paga_em?: string;
  recebida_em?: string;
  anexos: { nome: string; tipo: string }[];
  historico: HistoryEvent[];
};

// Ordem do fluxo "caminho feliz" — usada para preencher datas/histórico do mock
const FLUXO: PurchaseStatus[] = [
  PURCHASE_STATUS.RASCUNHO,
  PURCHASE_STATUS.AGUARDANDO_APROVACAO,
  PURCHASE_STATUS.APROVADA,
  PURCHASE_STATUS.PEDIDO_REGISTRADO,
  PURCHASE_STATUS.EM_COMPRA,
  PURCHASE_STATUS.AGUARDANDO_PAGAMENTO,
  PURCHASE_STATUS.PAGO,
  PURCHASE_STATUS.AGUARDANDO_RECEBIMENTO,
  PURCHASE_STATUS.CONCLUIDA
];

const somaItens = (itens: PurchaseRequestItem[]) =>
  itens.reduce((t, it) => t + it.quantidade * it.valor_unitario_estimado, 0);

/**
 * Catálogo fixo de itens comuns de pequenas compras. Usar um pool fixo
 * (em vez de nomes aleatórios) faz os itens se repetirem entre solicitações,
 * tornando significativas as análises de recorrência e de preço.
 */
const CATALOGO_ITENS = [
  { nome: 'Café em grão', categoria: 'Alimentação / Coffee Break', unidade: 'Quilograma', preco: 38 },
  { nome: 'Coffee break - salgados', categoria: 'Alimentação / Coffee Break', unidade: 'Pacote', preco: 95 },
  { nome: 'Água mineral 500ml', categoria: 'Alimentação / Coffee Break', unidade: 'Caixa', preco: 22 },
  { nome: 'Papel sulfite A4', categoria: 'Material de Escritório', unidade: 'Resma', preco: 28 },
  { nome: 'Caneta esferográfica azul', categoria: 'Material de Escritório', unidade: 'Caixa', preco: 24 },
  { nome: 'Bloco de notas', categoria: 'Material de Escritório', unidade: 'Unidade', preco: 9 },
  { nome: 'Pasta de arquivo', categoria: 'Material de Escritório', unidade: 'Unidade', preco: 15 },
  { nome: 'Toner para impressora', categoria: 'Equipamentos e TI', unidade: 'Unidade', preco: 185 },
  { nome: 'Cabo HDMI 2m', categoria: 'Equipamentos e TI', unidade: 'Unidade', preco: 32 },
  { nome: 'Mouse USB', categoria: 'Equipamentos e TI', unidade: 'Unidade', preco: 46 },
  { nome: 'Lâmpada LED', categoria: 'Manutenção Predial', unidade: 'Unidade', preco: 26 },
  { nome: 'Detergente multiuso', categoria: 'Limpeza e Higiene', unidade: 'Litro', preco: 13 },
  { nome: 'Papel higiênico', categoria: 'Limpeza e Higiene', unidade: 'Pacote', preco: 34 },
  { nome: 'Copo descartável 200ml', categoria: 'Limpeza e Higiene', unidade: 'Pacote', preco: 9 },
  { nome: 'Pilha AA', categoria: 'Equipamentos e TI', unidade: 'Pacote', preco: 16 }
];

function gerarItens(forcarValorAlto = false): PurchaseRequestItem[] {
  const qtd = faker.number.int({ min: 1, max: 4 });
  const escolhidos = faker.helpers.arrayElements(CATALOGO_ITENS, qtd);
  return escolhidos.map((cat) => {
    // preço varia ±25% do preço base — gera dispersão para a análise de preços
    const variacao = faker.number.float({ min: 0.75, max: 1.25 });
    return {
      id: faker.string.uuid(),
      descricao: cat.nome,
      categoria: cat.categoria,
      quantidade: faker.number.int({
        min: forcarValorAlto ? 20 : 1,
        max: forcarValorAlto ? 60 : 18
      }),
      unidade_medida: cat.unidade,
      valor_unitario_estimado: parseFloat((cat.preco * variacao).toFixed(2))
    };
  });
}

let contadorNumero = 0;
function proximoNumero(): string {
  contadorNumero += 1;
  return `PC-2026-${String(contadorNumero).padStart(4, '0')}`;
}

function gerarSolicitacao(id: number, statusAlvo: PurchaseStatus): PurchaseRequest {
  const solicitante = faker.person.fullName();
  const valorAlto = statusAlvo === PURCHASE_STATUS.BLOQUEADA;
  const itens = gerarItens(valorAlto);
  const valorEstimado = somaItens(itens);
  const criadaEm = faker.date.between({ from: '2026-01-05', to: '2026-05-15' });

  const historico: HistoryEvent[] = [
    {
      data: criadaEm.toISOString(),
      autor: solicitante,
      descricao: 'Solicitação criada'
    }
  ];

  const req: PurchaseRequest = {
    id,
    numero: proximoNumero(),
    solicitante_nome: solicitante,
    unidade: faker.helpers.arrayElement(SESI_UNIDADES),
    centro_de_custo: `CC-${faker.number.int({ min: 1001, max: 1014 })}`,
    justificativa: faker.lorem.sentence({ min: 8, max: 16 }),
    prioridade: faker.helpers.arrayElement(PRIORIDADES),
    forma_pagamento: faker.helpers.arrayElement(FORMAS_PAGAMENTO),
    itens,
    valor_estimado: valorEstimado,
    status: statusAlvo,
    motivos_bloqueio: [],
    criada_em: criadaEm.toISOString(),
    anexos:
      statusAlvo === PURCHASE_STATUS.RASCUNHO
        ? []
        : [{ nome: 'orcamento.pdf', tipo: 'application/pdf' }],
    historico
  };

  const idxAlvo = FLUXO.indexOf(statusAlvo);
  let cursor = new Date(criadaEm);
  const avancar = () => {
    cursor = faker.date.soon({ days: 5, refDate: cursor });
    return cursor.toISOString();
  };

  // Caminho feliz — preenche datas/histórico até o status alvo
  if (idxAlvo >= 1) {
    req.enviada_em = avancar();
    historico.push({
      data: req.enviada_em,
      autor: solicitante,
      descricao: 'Solicitação enviada para aprovação',
      de: PURCHASE_STATUS.RASCUNHO,
      para: PURCHASE_STATUS.AGUARDANDO_APROVACAO
    });
  }
  if (idxAlvo >= 2) {
    req.aprovador_nome = faker.person.fullName();
    req.aprovada_em = avancar();
    historico.push({
      data: req.aprovada_em,
      autor: req.aprovador_nome,
      descricao: 'Solicitação aprovada pelo gestor',
      de: PURCHASE_STATUS.AGUARDANDO_APROVACAO,
      para: PURCHASE_STATUS.APROVADA
    });
  }
  if (idxAlvo >= 3) {
    req.analista_nome = faker.person.fullName();
    historico.push({
      data: avancar(),
      autor: 'Robô de Integração',
      descricao: 'Pedido registrado no ERP (simulado)',
      de: PURCHASE_STATUS.APROVADA,
      para: PURCHASE_STATUS.PEDIDO_REGISTRADO
    });
  }
  if (idxAlvo >= 4) {
    req.fornecedor_nome = faker.company.name();
    req.valor_real = parseFloat((valorEstimado * faker.number.float({ min: 0.9, max: 1.1 })).toFixed(2));
    req.comprada_em = avancar();
    historico.push({
      data: req.comprada_em,
      autor: req.analista_nome ?? 'Analista',
      descricao: `Compra registrada com o fornecedor ${req.fornecedor_nome}`,
      de: PURCHASE_STATUS.PEDIDO_REGISTRADO,
      para: PURCHASE_STATUS.EM_COMPRA
    });
  }
  if (idxAlvo >= 5) {
    historico.push({
      data: avancar(),
      autor: req.analista_nome ?? 'Analista',
      descricao: 'Encaminhado ao Financeiro para pagamento',
      de: PURCHASE_STATUS.EM_COMPRA,
      para: PURCHASE_STATUS.AGUARDANDO_PAGAMENTO
    });
  }
  if (idxAlvo >= 6) {
    req.paga_em = avancar();
    historico.push({
      data: req.paga_em,
      autor: req.analista_nome ?? 'Analista',
      descricao: 'Pagamento confirmado pelo Financeiro',
      de: PURCHASE_STATUS.AGUARDANDO_PAGAMENTO,
      para: PURCHASE_STATUS.PAGO
    });
  }
  if (idxAlvo >= 7) {
    historico.push({
      data: avancar(),
      autor: req.analista_nome ?? 'Analista',
      descricao: 'Aguardando recebimento do produto/serviço',
      de: PURCHASE_STATUS.PAGO,
      para: PURCHASE_STATUS.AGUARDANDO_RECEBIMENTO
    });
  }
  if (idxAlvo >= 8) {
    req.recebida_em = avancar();
    historico.push({
      data: req.recebida_em,
      autor: solicitante,
      descricao: 'Recebimento confirmado — solicitação concluída',
      de: PURCHASE_STATUS.AGUARDANDO_RECEBIMENTO,
      para: PURCHASE_STATUS.CONCLUIDA
    });
  }

  // Estados fora do caminho feliz
  if (statusAlvo === PURCHASE_STATUS.BLOQUEADA) {
    req.enviada_em = avancar();
    req.motivos_bloqueio = ['Valor estimado acima do limite de R$ 3.000,00 para pequenas compras'];
    historico.push(
      {
        data: req.enviada_em,
        autor: solicitante,
        descricao: 'Solicitação enviada para aprovação',
        de: PURCHASE_STATUS.RASCUNHO,
        para: PURCHASE_STATUS.AGUARDANDO_APROVACAO
      },
      {
        data: avancar(),
        autor: 'Motor de Governança',
        descricao: 'Solicitação bloqueada: ' + req.motivos_bloqueio.join('; '),
        de: PURCHASE_STATUS.AGUARDANDO_APROVACAO,
        para: PURCHASE_STATUS.BLOQUEADA
      }
    );
  }
  if (statusAlvo === PURCHASE_STATUS.REJEITADA) {
    req.enviada_em = avancar();
    req.aprovador_nome = faker.person.fullName();
    historico.push(
      {
        data: req.enviada_em,
        autor: solicitante,
        descricao: 'Solicitação enviada para aprovação',
        de: PURCHASE_STATUS.RASCUNHO,
        para: PURCHASE_STATUS.AGUARDANDO_APROVACAO
      },
      {
        data: avancar(),
        autor: req.aprovador_nome,
        descricao: 'Solicitação rejeitada pelo gestor: justificativa insuficiente',
        de: PURCHASE_STATUS.AGUARDANDO_APROVACAO,
        para: PURCHASE_STATUS.REJEITADA
      }
    );
  }
  if (statusAlvo === PURCHASE_STATUS.CANCELADA) {
    req.enviada_em = avancar();
    historico.push({
      data: avancar(),
      autor: solicitante,
      descricao: 'Solicitação cancelada pelo solicitante',
      para: PURCHASE_STATUS.CANCELADA
    });
  }

  return req;
}

export const fakePurchaseRequests = {
  records: [] as PurchaseRequest[],

  initialize() {
    // Tenta carregar dados persistidos no navegador (client-side)
    const persisted = loadFromStorage<PurchaseRequest[]>(STORAGE_KEY);
    if (persisted && persisted.length > 0) {
      this.records = persisted;
      const persistedCounter = loadFromStorage<number>(COUNTER_KEY);
      contadorNumero = persistedCounter ?? Math.max(...persisted.map((r) => r.id), 0);
      return;
    }

    // Distribuição de status para cobrir todos os cenários do workflow
    const distribuicao: PurchaseStatus[] = [
      PURCHASE_STATUS.RASCUNHO,
      PURCHASE_STATUS.RASCUNHO,
      PURCHASE_STATUS.AGUARDANDO_APROVACAO,
      PURCHASE_STATUS.AGUARDANDO_APROVACAO,
      PURCHASE_STATUS.AGUARDANDO_APROVACAO,
      PURCHASE_STATUS.AGUARDANDO_APROVACAO,
      PURCHASE_STATUS.BLOQUEADA,
      PURCHASE_STATUS.BLOQUEADA,
      PURCHASE_STATUS.REJEITADA,
      PURCHASE_STATUS.APROVADA,
      PURCHASE_STATUS.APROVADA,
      PURCHASE_STATUS.APROVADA,
      PURCHASE_STATUS.PEDIDO_REGISTRADO,
      PURCHASE_STATUS.PEDIDO_REGISTRADO,
      PURCHASE_STATUS.EM_COMPRA,
      PURCHASE_STATUS.EM_COMPRA,
      PURCHASE_STATUS.AGUARDANDO_PAGAMENTO,
      PURCHASE_STATUS.AGUARDANDO_PAGAMENTO,
      PURCHASE_STATUS.PAGO,
      PURCHASE_STATUS.AGUARDANDO_RECEBIMENTO,
      PURCHASE_STATUS.CONCLUIDA,
      PURCHASE_STATUS.CONCLUIDA,
      PURCHASE_STATUS.CONCLUIDA,
      PURCHASE_STATUS.CONCLUIDA,
      PURCHASE_STATUS.CANCELADA
    ];
    contadorNumero = 0;
    this.records = distribuicao.map((status, i) => gerarSolicitacao(i + 1, status));
    this.persist();
  },

  persist() {
    saveToStorage(STORAGE_KEY, this.records);
    saveToStorage(COUNTER_KEY, contadorNumero);
  },

  async getAll({
    statuses = [],
    prioridades = [],
    search
  }: {
    statuses?: string[];
    prioridades?: string[];
    search?: string;
  }) {
    let reqs = [...this.records];

    if (statuses.length > 0) {
      reqs = reqs.filter((r) => statuses.includes(r.status));
    }
    if (prioridades.length > 0) {
      reqs = reqs.filter((r) => prioridades.includes(r.prioridade));
    }
    if (search) {
      reqs = matchSorter(reqs, search, {
        keys: ['numero', 'solicitante_nome', 'justificativa', 'centro_de_custo']
      });
    }

    return reqs;
  },

  async getPurchaseRequests({
    page = 1,
    limit = 10,
    statuses,
    prioridades,
    search,
    sort
  }: {
    page?: number;
    limit?: number;
    statuses?: string | string[];
    prioridades?: string | string[];
    search?: string;
    sort?: string;
  }) {
    await delay(400);
    const toArray = (v?: string | string[]) =>
      v ? (Array.isArray(v) ? v : String(v).split(/[.,]/)) : [];
    const todos = await this.getAll({
      statuses: toArray(statuses),
      prioridades: toArray(prioridades),
      search
    });

    if (sort) {
      try {
        const sortItems = JSON.parse(sort) as { id: string; desc: boolean }[];
        if (sortItems.length > 0) {
          const { id, desc } = sortItems[0];
          todos.sort((a, b) => {
            const aVal = (a as Record<string, unknown>)[id];
            const bVal = (b as Record<string, unknown>)[id];
            if (typeof aVal === 'number' && typeof bVal === 'number') {
              return desc ? bVal - aVal : aVal - bVal;
            }
            const aStr = String(aVal ?? '').toLowerCase();
            const bStr = String(bVal ?? '').toLowerCase();
            return desc ? bStr.localeCompare(aStr) : aStr.localeCompare(bStr);
          });
        }
      } catch {
        // parâmetro de ordenação inválido — ignora
      }
    }

    const total = todos.length;
    const offset = (page - 1) * limit;

    return {
      success: true,
      time: new Date().toISOString(),
      message: 'Solicitações carregadas',
      total_requests: total,
      offset,
      limit,
      requests: todos.slice(offset, offset + limit)
    };
  },

  async getPurchaseRequestById(id: number) {
    await delay(300);
    const request = this.records.find((r) => r.id === id);
    if (!request) {
      return { success: false, message: `Solicitação com ID ${id} não encontrada` };
    }
    return {
      success: true,
      time: new Date().toISOString(),
      message: `Solicitação com ID ${id} encontrada`,
      request
    };
  },

  async createPurchaseRequest(request: PurchaseRequest) {
    await delay(400);
    this.records.push(request);
    this.persist();
    return { success: true, message: 'Solicitação criada com sucesso', request };
  },

  async updatePurchaseRequest(id: number, request: PurchaseRequest) {
    await delay(400);
    const index = this.records.findIndex((r) => r.id === id);
    if (index === -1) {
      return { success: false, message: `Solicitação com ID ${id} não encontrada` };
    }
    this.records[index] = request;
    this.persist();
    return { success: true, message: 'Solicitação atualizada com sucesso', request };
  },

  nextId() {
    return this.records.length > 0 ? Math.max(...this.records.map((r) => r.id)) + 1 : 1;
  },

  nextNumero() {
    return proximoNumero();
  }
};

fakePurchaseRequests.initialize();
