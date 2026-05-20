////////////////////////////////////////////////////////////////////////////////
// Banco de dados fake de Usuários — Sistema de Pequenas Compras (SESI)
////////////////////////////////////////////////////////////////////////////////

import { faker } from '@faker-js/faker';
import { matchSorter } from 'match-sorter';
import { SESI_UNIDADES } from '@/constants/mock-api-cost-centers';

export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Papéis do sistema de compras (usados no RBAC)
export const USER_ROLES = [
  'Solicitante',
  'Gestor',
  'Analista de Suprimentos',
  'Administrador'
] as const;

// Situação do usuário
export const USER_STATUSES = ['Ativo', 'Inativo', 'Convidado'] as const;

export type User = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  status: string;
  role: string;
  unidade: string;
  centro_de_custo: string;
  created_at: string;
  updated_at: string;
};

export const fakeUsers = {
  records: [] as User[],

  initialize() {
    const sampleUsers: User[] = [];
    for (let id = 1; id <= 40; id++) {
      sampleUsers.push({
        id,
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email().toLowerCase(),
        phone: faker.phone.number({ style: 'national' }),
        status: faker.helpers.arrayElement(USER_STATUSES),
        role: faker.helpers.arrayElement(USER_ROLES),
        unidade: faker.helpers.arrayElement(SESI_UNIDADES),
        centro_de_custo: `CC-${faker.number.int({ min: 1001, max: 1014 })}`,
        created_at: faker.date.between({ from: '2024-01-01', to: '2025-12-31' }).toISOString(),
        updated_at: faker.date.recent().toISOString()
      });
    }
    this.records = sampleUsers;
  },

  async getAll({ roles = [], search }: { roles?: string[]; search?: string }) {
    let users = [...this.records];

    if (roles.length > 0) {
      users = users.filter((user) => roles.includes(user.role));
    }

    if (search) {
      users = matchSorter(users, search, {
        keys: ['first_name', 'last_name', 'email']
      });
    }

    return users;
  },

  async createUser(data: Omit<User, 'id' | 'created_at' | 'updated_at'>) {
    await delay(500);

    const newUser: User = {
      ...data,
      id: this.records.length > 0 ? Math.max(...this.records.map((u) => u.id)) + 1 : 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.records.push(newUser);

    return {
      success: true,
      message: 'Usuário criado com sucesso',
      user: newUser
    };
  },

  async updateUser(id: number, data: Omit<User, 'id' | 'created_at' | 'updated_at'>) {
    await delay(500);

    const index = this.records.findIndex((user) => user.id === id);

    if (index === -1) {
      return { success: false, message: `Usuário com ID ${id} não encontrado` };
    }

    this.records[index] = {
      ...this.records[index],
      ...data,
      updated_at: new Date().toISOString()
    };

    return {
      success: true,
      message: 'Usuário atualizado com sucesso',
      user: this.records[index]
    };
  },

  async deleteUser(id: number) {
    await delay(500);

    const index = this.records.findIndex((user) => user.id === id);

    if (index === -1) {
      return { success: false, message: `Usuário com ID ${id} não encontrado` };
    }

    this.records.splice(index, 1);

    return {
      success: true,
      message: 'Usuário removido com sucesso'
    };
  },

  async getUsers({
    page = 1,
    limit = 10,
    roles,
    search,
    sort
  }: {
    page?: number;
    limit?: number;
    roles?: string | string[];
    search?: string;
    sort?: string;
  }) {
    await delay(500);
    const rolesArray = roles ? (Array.isArray(roles) ? roles : String(roles).split(/[.,]/)) : [];
    const allUsers = await this.getAll({
      roles: rolesArray,
      search
    });

    if (sort) {
      try {
        const sortItems = JSON.parse(sort) as {
          id: string;
          desc: boolean;
        }[];
        if (sortItems.length > 0) {
          const { id, desc } = sortItems[0];
          allUsers.sort((a, b) => {
            const aVal =
              id === 'name' ? `${a.first_name} ${a.last_name}` : (a as Record<string, unknown>)[id];
            const bVal =
              id === 'name' ? `${b.first_name} ${b.last_name}` : (b as Record<string, unknown>)[id];
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

    const totalUsers = allUsers.length;

    const offset = (page - 1) * limit;
    const paginatedUsers = allUsers.slice(offset, offset + limit);

    return {
      success: true,
      time: new Date().toISOString(),
      message: 'Usuários carregados',
      total_users: totalUsers,
      offset,
      limit,
      users: paginatedUsers
    };
  }
};

fakeUsers.initialize();
