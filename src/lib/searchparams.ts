import {
  createSearchParamsCache,
  createSerializer,
  parseAsInteger,
  parseAsString
} from 'nuqs/server';

export const searchParams = {
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  name: parseAsString,
  nome: parseAsString,
  gender: parseAsString,
  category: parseAsString,
  categoria: parseAsString,
  unidade: parseAsString,
  numero: parseAsString,
  status: parseAsString,
  prioridade: parseAsString,
  role: parseAsString,
  sort: parseAsString,
  /** Janela de período (em dias) para o Dashboard. 30 = padrão; 0 = todo o histórico. */
  periodo: parseAsInteger.withDefault(30)
  // advanced filter
  // filters: getFiltersStateParser().withDefault([]),
  // joinOperator: parseAsStringEnum(['and', 'or']).withDefault('and')
};

export const searchParamsCache = createSearchParamsCache(searchParams);
export const serialize = createSerializer(searchParams);
