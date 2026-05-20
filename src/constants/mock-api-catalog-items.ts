////////////////////////////////////////////////////////////////////////////////
// Banco de dados fake de Itens de Catálogo — Sistema de Pequenas Compras (SESI)
////////////////////////////////////////////////////////////////////////////////

import { faker } from '@faker-js/faker';
import { matchSorter } from 'match-sorter';

export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Categorias de item (alinhadas às categorias de fornecedor)
export const ITEM_CATEGORIES = [
  'Material de Escritório',
  'Manutenção Predial',
  'Alimentação / Coffee Break',
  'Equipamentos e TI',
  'Serviços Gerais',
  'Limpeza e Higiene',
  'Outros'
] as const;

// Unidades de medida
export const UNIDADES_MEDIDA = [
  'Unidade',
  'Caixa',
  'Pacote',
  'Quilograma',
  'Litro',
  'Resma'
] as const;

export type CatalogItem = {
  id: number;
  nome: string;
  categoria: string;
  unidade_medida: string;
  is_item_estoque: boolean;
  tem_contrato_vigente: boolean;
  preco_medio_historico: number;
  created_at: string;
  updated_at: string;
};

export const fakeCatalogItems = {
  records: [] as CatalogItem[],

  initialize() {
    const registros: CatalogItem[] = [];
    for (let i = 1; i <= 24; i++) {
      registros.push({
        id: i,
        nome: faker.commerce.productName(),
        categoria: faker.helpers.arrayElement(ITEM_CATEGORIES),
        unidade_medida: faker.helpers.arrayElement(UNIDADES_MEDIDA),
        is_item_estoque: faker.datatype.boolean(0.25),
        tem_contrato_vigente: faker.datatype.boolean(0.2),
        preco_medio_historico: parseFloat(faker.commerce.price({ min: 5, max: 800, dec: 2 })),
        created_at: faker.date.between({ from: '2024-01-01', to: '2025-12-31' }).toISOString(),
        updated_at: faker.date.recent().toISOString()
      });
    }
    this.records = registros;
  },

  async getAll({ categorias = [], search }: { categorias?: string[]; search?: string }) {
    let items = [...this.records];

    if (categorias.length > 0) {
      items = items.filter((it) => categorias.includes(it.categoria));
    }

    if (search) {
      items = matchSorter(items, search, { keys: ['nome', 'categoria'] });
    }

    return items;
  },

  async getCatalogItems({
    page = 1,
    limit = 10,
    categorias,
    search,
    sort
  }: {
    page?: number;
    limit?: number;
    categorias?: string | string[];
    search?: string;
    sort?: string;
  }) {
    await delay(400);
    const categoriasArray = categorias
      ? Array.isArray(categorias)
        ? categorias
        : String(categorias).split(/[.,]/)
      : [];
    const todos = await this.getAll({ categorias: categoriasArray, search });

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
    const paginados = todos.slice(offset, offset + limit);

    return {
      success: true,
      time: new Date().toISOString(),
      message: 'Itens de catálogo carregados',
      total_items: total,
      offset,
      limit,
      items: paginados
    };
  },

  async getCatalogItemById(id: number) {
    await delay(300);
    const item = this.records.find((it) => it.id === id);

    if (!item) {
      return { success: false, message: `Item com ID ${id} não encontrado` };
    }

    return {
      success: true,
      time: new Date().toISOString(),
      message: `Item com ID ${id} encontrado`,
      item
    };
  },

  async createCatalogItem(data: Omit<CatalogItem, 'id' | 'created_at' | 'updated_at'>) {
    await delay(400);
    const novo: CatalogItem = {
      ...data,
      id: this.records.length > 0 ? Math.max(...this.records.map((it) => it.id)) + 1 : 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.records.push(novo);
    return { success: true, message: 'Item criado com sucesso', item: novo };
  },

  async updateCatalogItem(id: number, data: Omit<CatalogItem, 'id' | 'created_at' | 'updated_at'>) {
    await delay(400);
    const index = this.records.findIndex((it) => it.id === id);
    if (index === -1) {
      return { success: false, message: `Item com ID ${id} não encontrado` };
    }
    this.records[index] = {
      ...this.records[index],
      ...data,
      updated_at: new Date().toISOString()
    };
    return { success: true, message: 'Item atualizado com sucesso', item: this.records[index] };
  },

  async deleteCatalogItem(id: number) {
    await delay(400);
    const index = this.records.findIndex((it) => it.id === id);
    if (index === -1) {
      return { success: false, message: `Item com ID ${id} não encontrado` };
    }
    this.records.splice(index, 1);
    return { success: true, message: 'Item removido com sucesso' };
  }
};

fakeCatalogItems.initialize();
