////////////////////////////////////////////////////////////////////////////////
// Banco de dados fake de Fornecedores — Sistema de Pequenas Compras (SESI)
////////////////////////////////////////////////////////////////////////////////

import { faker } from '@faker-js/faker';
import { matchSorter } from 'match-sorter';

export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Categorias de fornecedor (alinhadas aos tipos de pequenas compras avulsas)
export const SUPPLIER_CATEGORIES = [
  'Material de Escritório',
  'Manutenção Predial',
  'Alimentação / Coffee Break',
  'Equipamentos e TI',
  'Serviços Gerais',
  'Limpeza e Higiene',
  'Outros'
] as const;

export type Supplier = {
  id: number;
  nome: string;
  cnpj: string;
  email: string;
  telefone: string;
  categoria: string;
  homologado: boolean;
  bloqueado: boolean;
  created_at: string;
  updated_at: string;
};

function gerarCnpj(): string {
  const n = () => faker.string.numeric(1);
  return `${n()}${n()}.${n()}${n()}${n()}.${n()}${n()}${n()}/0001-${n()}${n()}`;
}

export const fakeSuppliers = {
  records: [] as Supplier[],

  initialize() {
    const registros: Supplier[] = [];
    for (let i = 1; i <= 18; i++) {
      registros.push({
        id: i,
        nome: faker.company.name(),
        cnpj: gerarCnpj(),
        email: faker.internet.email().toLowerCase(),
        telefone: faker.phone.number({ style: 'national' }),
        categoria: faker.helpers.arrayElement(SUPPLIER_CATEGORIES),
        homologado: faker.datatype.boolean(0.75),
        bloqueado: faker.datatype.boolean(0.15),
        created_at: faker.date.between({ from: '2024-01-01', to: '2025-12-31' }).toISOString(),
        updated_at: faker.date.recent().toISOString()
      });
    }
    this.records = registros;
  },

  async getAll({ categorias = [], search }: { categorias?: string[]; search?: string }) {
    let suppliers = [...this.records];

    if (categorias.length > 0) {
      suppliers = suppliers.filter((s) => categorias.includes(s.categoria));
    }

    if (search) {
      suppliers = matchSorter(suppliers, search, {
        keys: ['nome', 'cnpj', 'email', 'categoria']
      });
    }

    return suppliers;
  },

  async getSuppliers({
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
      message: 'Fornecedores carregados',
      total_suppliers: total,
      offset,
      limit,
      suppliers: paginados
    };
  },

  async getSupplierById(id: number) {
    await delay(300);
    const supplier = this.records.find((s) => s.id === id);

    if (!supplier) {
      return { success: false, message: `Fornecedor com ID ${id} não encontrado` };
    }

    return {
      success: true,
      time: new Date().toISOString(),
      message: `Fornecedor com ID ${id} encontrado`,
      supplier
    };
  },

  async createSupplier(data: Omit<Supplier, 'id' | 'created_at' | 'updated_at'>) {
    await delay(400);
    const novo: Supplier = {
      ...data,
      id: this.records.length > 0 ? Math.max(...this.records.map((s) => s.id)) + 1 : 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.records.push(novo);
    return { success: true, message: 'Fornecedor criado com sucesso', supplier: novo };
  },

  async updateSupplier(id: number, data: Omit<Supplier, 'id' | 'created_at' | 'updated_at'>) {
    await delay(400);
    const index = this.records.findIndex((s) => s.id === id);
    if (index === -1) {
      return { success: false, message: `Fornecedor com ID ${id} não encontrado` };
    }
    this.records[index] = {
      ...this.records[index],
      ...data,
      updated_at: new Date().toISOString()
    };
    return {
      success: true,
      message: 'Fornecedor atualizado com sucesso',
      supplier: this.records[index]
    };
  },

  async deleteSupplier(id: number) {
    await delay(400);
    const index = this.records.findIndex((s) => s.id === id);
    if (index === -1) {
      return { success: false, message: `Fornecedor com ID ${id} não encontrado` };
    }
    this.records.splice(index, 1);
    return { success: true, message: 'Fornecedor removido com sucesso' };
  }
};

fakeSuppliers.initialize();
