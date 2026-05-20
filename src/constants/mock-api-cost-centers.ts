////////////////////////////////////////////////////////////////////////////////
// Banco de dados fake de Centros de Custo — Sistema de Pequenas Compras (SESI)
////////////////////////////////////////////////////////////////////////////////

import { faker } from '@faker-js/faker';
import { matchSorter } from 'match-sorter';

export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Unidades do SESI (mock — substituir pela lista real na integração)
export const SESI_UNIDADES = [
  'SESI - Unidade Centro',
  'SESI - Unidade Norte',
  'SESI - Unidade Sul',
  'SESI - Unidade Leste',
  'SESI - Administração Regional'
] as const;

export type CostCenter = {
  id: number;
  codigo: string;
  nome: string;
  unidade: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
};

const NOMES_CENTRO = [
  'Recursos Humanos',
  'Tecnologia da Informação',
  'Educação',
  'Saúde e Segurança',
  'Infraestrutura',
  'Suprimentos',
  'Marketing e Comunicação',
  'Financeiro',
  'Atendimento',
  'Diretoria'
];

export const fakeCostCenters = {
  records: [] as CostCenter[],

  initialize() {
    const registros: CostCenter[] = [];
    for (let i = 1; i <= 14; i++) {
      registros.push({
        id: i,
        codigo: `CC-${String(1000 + i)}`,
        nome: faker.helpers.arrayElement(NOMES_CENTRO),
        unidade: faker.helpers.arrayElement(SESI_UNIDADES),
        ativo: faker.datatype.boolean(0.85),
        created_at: faker.date.between({ from: '2024-01-01', to: '2025-12-31' }).toISOString(),
        updated_at: faker.date.recent().toISOString()
      });
    }
    this.records = registros;
  },

  async getAll({ unidades = [], search }: { unidades?: string[]; search?: string }) {
    let costCenters = [...this.records];

    if (unidades.length > 0) {
      costCenters = costCenters.filter((c) => unidades.includes(c.unidade));
    }

    if (search) {
      costCenters = matchSorter(costCenters, search, {
        keys: ['codigo', 'nome', 'unidade']
      });
    }

    return costCenters;
  },

  async getCostCenters({
    page = 1,
    limit = 10,
    unidades,
    search,
    sort
  }: {
    page?: number;
    limit?: number;
    unidades?: string | string[];
    search?: string;
    sort?: string;
  }) {
    await delay(400);
    const unidadesArray = unidades
      ? Array.isArray(unidades)
        ? unidades
        : String(unidades).split(/[.,]/)
      : [];
    const todos = await this.getAll({ unidades: unidadesArray, search });

    if (sort) {
      try {
        const sortItems = JSON.parse(sort) as { id: string; desc: boolean }[];
        if (sortItems.length > 0) {
          const { id, desc } = sortItems[0];
          todos.sort((a, b) => {
            const aVal = (a as Record<string, unknown>)[id];
            const bVal = (b as Record<string, unknown>)[id];
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
    const paginados = todos.slice(offset, offset + limit);

    return {
      success: true,
      time: new Date().toISOString(),
      message: 'Centros de custo carregados',
      total_cost_centers: total,
      offset,
      limit,
      cost_centers: paginados
    };
  },

  async getCostCenterById(id: number) {
    await delay(300);
    const costCenter = this.records.find((c) => c.id === id);

    if (!costCenter) {
      return { success: false, message: `Centro de custo com ID ${id} não encontrado` };
    }

    return {
      success: true,
      time: new Date().toISOString(),
      message: `Centro de custo com ID ${id} encontrado`,
      cost_center: costCenter
    };
  },

  async createCostCenter(data: Omit<CostCenter, 'id' | 'created_at' | 'updated_at'>) {
    await delay(400);
    const novo: CostCenter = {
      ...data,
      id: this.records.length > 0 ? Math.max(...this.records.map((c) => c.id)) + 1 : 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.records.push(novo);
    return { success: true, message: 'Centro de custo criado com sucesso', cost_center: novo };
  },

  async updateCostCenter(id: number, data: Omit<CostCenter, 'id' | 'created_at' | 'updated_at'>) {
    await delay(400);
    const index = this.records.findIndex((c) => c.id === id);
    if (index === -1) {
      return { success: false, message: `Centro de custo com ID ${id} não encontrado` };
    }
    this.records[index] = {
      ...this.records[index],
      ...data,
      updated_at: new Date().toISOString()
    };
    return {
      success: true,
      message: 'Centro de custo atualizado com sucesso',
      cost_center: this.records[index]
    };
  },

  async deleteCostCenter(id: number) {
    await delay(400);
    const index = this.records.findIndex((c) => c.id === id);
    if (index === -1) {
      return { success: false, message: `Centro de custo com ID ${id} não encontrado` };
    }
    this.records.splice(index, 1);
    return { success: true, message: 'Centro de custo removido com sucesso' };
  }
};

fakeCostCenters.initialize();
